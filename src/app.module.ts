import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { configValidateSchema } from './tasks/config.schema'; // Joi schema

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      // ConfigModule: Để cấu hình cũng như tải các biến môi trường
      // forRoot(): module sẽ tự động đọc các biến môi trường từ file .env và làm chúng có sẵn trong toàn bộ ứng dụng
      //envFilePath: Xác định đường dẫn tới tệp .env mà ConfigModule sẽ tải các biến môi trường từ đó.
      // isGlobal: true,
      // validationSchema: configValidateSchema,
    }),
    TasksModule,
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
    AuthModule,
  ],
  providers: [TasksService],
  controllers: [TasksController],
})
export class AppModule {}
