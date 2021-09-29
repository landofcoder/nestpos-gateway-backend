import {Entity, Column, ObjectIdColumn} from 'typeorm';

@Entity('gw_forgot_password')
export class GwForgotPassword {
    @ObjectIdColumn()
    _id: string;

    @Column()
    user_id: string;

    @Column()
    email: string;

    @Column()
    token: string;

    @Column()
    used: boolean;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
