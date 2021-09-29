import {Entity, Column, ObjectIdColumn} from 'typeorm';

@Entity('gw_membership_plan')
export class GwMembership {
    @ObjectIdColumn()
    _id: string;

    @Column()
    name: string;

    @Column()
    price: string;

    @Column()
    position: string;

    @Column()
    is_featured: string;

    @Column()
    level: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
