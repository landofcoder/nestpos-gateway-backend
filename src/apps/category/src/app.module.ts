import { Module } from "@nestjs/common";
import { Magento2Service } from './magento2/magento2.service';
import {AppController} from "./app.controller";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [Magento2Service]
})
export class AppModule {}
