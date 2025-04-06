import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { User } from '../user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminController } from './super-admin.controller';
import { Role } from 'src/roles/entity/role.entity';

@Module({
   imports: [TypeOrmModule.forFeature([User, Role])],
   controllers: [SuperAdminController],
   providers: [SuperAdminService],
   exports: [SuperAdminService],
})
export class SuperAdminModule {}
