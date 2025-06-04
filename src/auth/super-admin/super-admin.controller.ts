import { Body, Controller, Patch, ValidationPipe, UsePipes, UseGuards, SetMetadata, Post } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RolesGuard } from 'src/roles/roles.guard';
import { User } from '../user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('super-admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SuperAdminController {
   constructor(private superAdminService: SuperAdminService) {}

   @Post('create-admin')
   @SetMetadata('roles', ['super-admin'])
   async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<void> {
      return this.superAdminService.createAdmin(createAdminDto);
   }

   // UsePipes help code validation safe and secure
   // @Patch('update-password')
   // @UsePipes(ValidationPipe)
   // async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
   //    return this.superAdminService.updatePassword(updatePasswordDto);
   // }
}
