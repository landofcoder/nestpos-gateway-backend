import {Injectable} from '@nestjs/common';
import {GwAppConnected} from "../entities/gw-app-connected.entity";
import {GwUsers} from "../entities/gw-users.entity";
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {MAGENTO2} from '../constant';
import {v4 as uuidv4} from 'uuid';

const bcrypt = require('bcryptjs');

@Injectable()
export class GwAppConnectedService {
    constructor(
        @InjectRepository(GwAppConnected) private readonly gwAppConnectedMongoRepository: Repository<GwAppConnected>,
        @InjectRepository(GwUsers) private readonly  gwUsersEntity: Repository<GwUsers>
    ) {
    }

    async findByToken(token: string): Promise<GwAppConnected> {
        return this.gwAppConnectedMongoRepository.findOne({where: {token}});
    }

    async findAll(userId: string): Promise<GwAppConnected[]> {
        return this.gwAppConnectedMongoRepository.find({where: {user_id: userId}, order: {_id: 'DESC'}});
    }

    async signUp(firstName: string, lastName: string, email: string, password: string) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const obj = {
            firstName,
            lastName,
            email,
            role: 'normal',
            password: hash
        }
        const result = await this.gwUsersEntity.insert(obj);
        return !!result;
    }

    async signIn(email: string, password: string) {
        const errorMessage = 'Email or password not found';
        // Get hash by email
        const user = await this.gwUsersEntity.findOne({email});
        if (user) {
            const hasPassword = user.password;
            const resultMatch = bcrypt.compareSync(password, hasPassword);
            if (resultMatch) {
                return JSON.stringify({
                    status: true,
                    message: '',
                    data: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        email: user.email,
                        password: user.password
                    }
                })
            }
        }

        return JSON.stringify({
            status: false,
            message: errorMessage,
            data: {}
        })
    }

    async createApp(userId: string, name: string, siteUrl: string, imageUrl: string) {
        const token = uuidv4().replace(/-/g, '');
        const obj = {
            name,
            user_id: userId,
            platform: MAGENTO2,
            destination_url: siteUrl,
            product_image_base_url: imageUrl,
            token,
            created_at: new Date(),
            updated_at: new Date(),
            plan: 'TRIAL'
        }
        const result = await this.gwAppConnectedMongoRepository.insert(obj);
        return !!result;
    }

    /**
     * Update app
     * @param appId
     * @param name
     * @param siteUrl
     * @param imageUrl
     */
    async updateApp(appId: string, name: string, siteUrl: string, imageUrl: string) {
        const obj = {name, destination_url: siteUrl, product_image_base_url: imageUrl};
        const result = await this.gwAppConnectedMongoRepository.update(appId, obj);
        return !!result;
    }

    async getReportAllApp() {
        // Query all gw users
        const listGwUsers = await this.gwUsersEntity.find();
        const listResult = [];
        for (const item of listGwUsers) {
            const userId = item._id;
            const itemAss = Object.assign({}, item);
            // Select gw apps with userId
            // @ts-ignore
            itemAss.listApps = await this.gwAppConnectedMongoRepository.find({
                where: {user_id: userId + ''},
                order: {_id: 'DESC'}
            });
            listResult.push(itemAss);
        }
        return JSON.stringify(listResult);
    }
}
