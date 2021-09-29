import {Entity, Column, ObjectIdColumn} from 'typeorm';

@Entity('gw_users')
export class GwUsers {
    @ObjectIdColumn()
    _id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: string;

    @Column()
    plan: string;

    @Column()
    membership_id: string;

    @Column()
    status: string;

    @Column()
    note: string;

    @Column()
    permissions: string;

    @Column()
    expired_at: Date;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
