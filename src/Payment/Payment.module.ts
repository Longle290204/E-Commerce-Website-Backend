import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './Payment.controller';
import { PaymentService } from './Payment.service';
import { ConfigModule } from '@nestjs/config';

@Module({
   imports: [ConfigModule, TypeOrmModule.forFeature([])],
   controllers: [PaymentController],
   providers: [PaymentService],
   exports: [],
})
export class PaymentModule {}
