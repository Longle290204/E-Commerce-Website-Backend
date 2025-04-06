import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { ConflictException } from '@nestjs/common';
import { Role } from 'src/roles/entity/role.entity';

@Injectable()
export class SuperAdminService implements OnModuleInit {
   constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,

      @InjectRepository(Role)
      private roleRepository: Repository<Role>,
   ) {}

   // Create super admin
   async onModuleInit() {
      const roleNames = ['super-admin', 'admin', 'user'];

      // Create role
      for (const roleName of roleNames) {
         const roleExists = await this.roleRepository.findOne({ where: { name: roleName } });
         if (!roleExists) {
            const newRole = this.roleRepository.create({ name: roleName });
            await this.roleRepository.save(newRole);
         }
      }

      let superAdminRole = await this.roleRepository.findOne({ where: { name: 'super-admin' } });
      const superAdmin = await this.userRepository.findOne({ where: { role: superAdminRole } });

      if (!superAdmin) {
         const salt = await bcrypt.genSalt();
         const hashPassword = await bcrypt.hash('superadmin2004', salt);
         const newSuperAdmin = this.userRepository.create({
            username: 'superadmin',
            password: hashPassword,
            role: superAdminRole,
         });

         await this.userRepository.save(newSuperAdmin);
      }
   }

   // Create admin
   async createAdmin(createAdminDto: CreateAdminDto): Promise<void> {
      const { username, password, role } = createAdminDto;
   
      const trimmedUsername = username.trim();
      const existsUser = await this.userRepository.findOne({ where: { username: trimmedUsername } });

      if (existsUser) {
         throw new ConflictException('User already exists');
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      const adminRole = await this.roleRepository.findOne({ where: { name: role } });

      const newUserOrAdmin = this.userRepository.create({
         username: username,
         password: hashPassword,
         role: adminRole,
      });

      await this.userRepository.save(newUserOrAdmin);
   }

   // Update password
   // async updatePassword(updatePassword: UpdatePasswordDto): Promise<void> {
   //    const { oldPassword, newPassword, reNewPassword } = updatePassword;

   //    // Check if passwords match
   //    if (newPassword !== reNewPassword) {
   //       throw new Error('Passwords do not match');
   //    }

   //    // Check if super admin exists
   //    const superAdmin = await this.roleRepository.findOne({ where: { name: 'super-admin' } });
   //    if (superAdmin) {
   //       throw new Error('Super admin not found');
   //    }

   //    // Check if old password is correct
   //    const role = await this.userRepository.findOne({ where: { id: superAdmin.id } });
   //    const checkAdminPassword = await bcrypt.compare(oldPassword, role.password);
   //    if (!checkAdminPassword) {
   //       throw new Error('Old password is incorrect');
   //    }

   //    // Update password and save
   //    const hashPassword = await bcrypt.hash(newPassword, 10);
   //    role.password = hashPassword;
   //    await this.userRepository.save(superAdmin);
   // }
}
