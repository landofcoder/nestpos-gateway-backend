import {Entity, Column, ObjectIdColumn} from 'typeorm';

@Entity('gw_transaction')
export class GwTransaction {
    @ObjectIdColumn()
    _id: string;

    @Column()
    name: string;
    
    @Column()
    membership_id: string;

    @Column()
    total: string;

    @Column()
    paid_price: string;

    @Column()
    user_id: string;

    @Column()
    status: string;

    @Column()
    payment_name: string;

    @Column()
    transaction_details: string;

    @Column()
    created_at: Date;

    @Column()
    paid_at: Date;

    @Column()
    updated_at: Date;
}
