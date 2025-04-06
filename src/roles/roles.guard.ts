import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
// canActivate : Để kiểm tra xem người dùng có quyền truy cập hay không
export class RolesGuard implements CanActivate {
   // reflector: Để lấy metadata từ decorator
   constructor(private reflector: Reflector) {}

   // ExecutionContext: Để lấy metadata từ decorator
   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      // context.getHandler(): Để lấy metadata từ decorator
      const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

      if (!requiredRoles || requiredRoles.length === 0) {
         return true; // Nếu không yêu cầu role nào, cho phép truy cập
      }

      // Lấy user từ request (được gán bởi JWT Guard trước đó)
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      console.log('user', user);

      // console.log('role', user.role);

      if (!user || !requiredRoles.includes(user.role?.name)) {
         throw new ForbiddenException('Bạn không có quyền truy cập!');
      }

      return true;
   }
}
