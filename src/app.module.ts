import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configValidateSchema } from './tasks/config.schema'; // Joi schema
import { CategoryModule } from './category/category.module';
import { ProductModule } from './products/product.module';
import { SlideBannerModule } from './slide-banner/slide-banner.module';
import { CartModule } from './shopping-cart/Cart/cart.module';
import { ProductSizeModule } from './product-size/product-size.module';
import { SuperAdminModule } from './auth/super-admin/super-admin.module';
import { SizeModule } from './size/size.module';
import { FavoriteProductModule } from './favorite_product/favorite_product.module';
import { BreadcrumbModule } from './Breadcrumb/Breadcrumb.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './Payment/Payment.module';

@Module({
   imports: [
      ProductSizeModule,
      ConfigModule.forRoot({
         envFilePath: [`.env.stage.${process.env.STAGE}`],
         // ConfigModule: Để cấu hình cũng như tải các biến môi trường
         // forRoot(): module sẽ tự động đọc các biến môi trường từ file .env và làm chúng có sẵn trong toàn bộ ứng dụng
         //envFilePath: Xác định đường dẫn tới tệp .env mà ConfigModule sẽ tải các biến môi trường từ đó.
         // isGlobal: true,
         // validationSchema: configValidateSchema,
      }),
      CategoryModule,
      ProductModule,
      TasksModule,
      SlideBannerModule,
      CartModule,
      FavoriteProductModule,
      SizeModule,
      SuperAdminModule,
      AuthModule,
      BreadcrumbModule,
      OrderModule,
      PaymentModule,
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         inject: [ConfigService],
         useFactory: async (configService: ConfigService) => {
            const config = {
               DB_HOST: configService.get('DB_HOST'),
               DB_PORT: configService.get('DB_PORT'),
               DB_USERNAME: configService.get('DB_USERNAME'),
               DB_PASSWORD: configService.get('DB_PASSWORD'),
               DB_DATABASE: configService.get('DB_DATABASE'),
               JWT_SECRET: configService.get('JWT_SECRET'),
            };

            const { error, value } = configValidateSchema.validate(config);

            if (error) {
               throw new Error(`Config validation error: ${error.message}`);
            }

            return {
               type: 'postgres',
               autoLoadEntities: true,
               synchronize: true,
               host: value.DB_HOST,
               port: value.DB_PORT,
               username: value.DB_USERNAME,
               password: value.DB_PASSWORD,
               database: value.DB_DATABASE,
            };
         },
      }),
   ],
   providers: [],
   controllers: [],
})
export class AppModule {}
