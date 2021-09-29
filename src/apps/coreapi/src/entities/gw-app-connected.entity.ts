import {Entity, Column, ObjectIdColumn} from 'typeorm';

@Entity('gw_app_connected')
export class GwAppConnected {
    @ObjectIdColumn()
    _id: string;

    @Column()
    name: string;

    @Column()
    token: string;

    @Column()
    platform: string;

    @Column()
    plan: string;

    @Column()
    user_id: string;

    @Column()
    domain: string;

    @Column()
    status: string;

    @Column()
    app_settings: string;

    @Column()
    destination_url: string;

    @Column()
    product_image_base_url: string;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
}
