import {Injectable} from '@nestjs/common';

const sgMail = require('@sendgrid/mail');
import {sendGridKey, dashboardUrl} from '../../../config/config';
import {InjectRepository} from "@nestjs/typeorm";
import {GwAppConnected} from "./entities/gw-app-connected.entity";
import {MongoRepository} from "typeorm";
import {GwUsers} from "./entities/gw-users.entity";
import {GwForgotPassword} from "./entities/gw-forgot-password.entity";
import {v4 as uuidv4} from 'uuid';
import { differenceInDays, addDays } from 'date-fns';

sgMail.setApiKey(sendGridKey);
const bcrypt = require('bcryptjs');

@Injectable()
export class AppService {

    constructor(
        @InjectRepository(GwAppConnected) private readonly gwAppConnectedMongoRepository: MongoRepository<GwAppConnected>,
        @InjectRepository(GwUsers) private readonly  gwUsersEntity: MongoRepository<GwUsers>,
        @InjectRepository(GwForgotPassword) private readonly gwForgotPasswordMongoRepository: MongoRepository<GwForgotPassword>
    ) {
    }

    async forgotPassword(email: string): Promise<boolean> {
        // Check email validate in users collection
        const userByEmail = await this.gwUsersEntity.findOne({email});
        if (userByEmail) {
            // Create new record in forgot_password
            const tokenRestPass = await this.getForgotPasswordRecord(userByEmail._id, userByEmail.email);
            const firstName = userByEmail.firstName;

            const resetUrl = `${dashboardUrl}/auth/reset-password/${tokenRestPass}`;
            const msg = {
                to: email,
                from: 'info@landofcoder.com',
                subject: 'Landofcoder Pos Password Reset',
                html: `<strong>${firstName}</strong>, Someone requested that the password for your Pos account be reset. Copyable link: ${resetUrl}`,
            };
            try {
                const sendResult = await sgMail.send(msg);
                return !!sendResult;
            } catch (e) {
                return false;
            }
        } else {
            return false;
        }
    }

    async getForgotByToken(token: string): Promise<any> {
        const result = await this.gwForgotPasswordMongoRepository.findOne({token, used: false});
        if (result) {
            return result
        }
        return false;
    }

    /**
     * Check license
     * @param token
     * @param version
     */
    async checkLicense(token, version): Promise<string> {
        const result = await this.gwAppConnectedMongoRepository.findOne({token});
        const licenseResult = {
            daysLeft: 0,
            data: {},
            plan: 'TRIAL',
            lock: false
        };

        licenseResult.plan = result.plan;

        if (result && result.plan === 'TRIAL') {
            // Update plan by result from database
            const createdAt = result.created_at;
            const dayEndTrial = addDays(new Date(createdAt), 30);
            const days = differenceInDays(dayEndTrial, new Date());
            if(days > 30) {
                licenseResult.lock = true;
            }
            licenseResult.daysLeft = days;
        }
        return JSON.stringify(licenseResult);
    }

    async resetPasswordRequest(token: string, password: string): Promise<boolean> {
        // Check valid token
        const forgotPasswordResult = await this.gwForgotPasswordMongoRepository.findOne({token});
        if (forgotPasswordResult) {
            // Handle pass change
            const userId = forgotPasswordResult.user_id;
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const result = await this.gwUsersEntity.findOneAndUpdate({_id: userId}, {$set: {password: hash}});
            // If change password success, then update forgot record that field used to true
            if (result) {
                await this.gwForgotPasswordMongoRepository.findOneAndUpdate({token}, {$set: {used: true}});
            }
            return !!result;
        } else {
            return false;
        }
    }

    async changePasswordFromProfile(password: string, email: string): Promise<boolean> {
        const userByEmail = await this.gwUsersEntity.findOne({email: email});
        console.log('data', userByEmail);
        if (userByEmail) {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            const userId = userByEmail._id;
            console.log('type', typeof userId);
            const changePasswordResult = await this.gwUsersEntity.findOneAndUpdate({_id: userId}, {$set: {password: hash}});
            if (changePasswordResult) {
                return true;
            } else {
                return false;
            }
        }
    }

    async saveProfile(firstName: string, lastName: string, email: string): Promise<boolean> {
        const result = await this.gwUsersEntity.findOneAndUpdate({email: email}, {
            $set: {
                firstName: firstName,
                lastName: lastName
            }
        });
        if (result) {
            return true;
        } else {
            return false;
        }
    }

    async getForgotPasswordRecord(userId: string, email: string): Promise<string> {
        // Get not used token
        const forgotPasswordItem = await this.gwForgotPasswordMongoRepository.findOne({user_id: userId, used: false});
        if (!forgotPasswordItem) {
            // Create new one
            const token = uuidv4();
            const obj = {
                user_id: userId,
                email,
                token,
                used: false,
                created_at: new Date(),
                updated_at: new Date()
            };
            await this.gwForgotPasswordMongoRepository.insert(obj);
            return token;
        } else {
            return forgotPasswordItem.token;
        }
    }
}
