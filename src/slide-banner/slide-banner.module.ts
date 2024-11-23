import { Module } from '@nestjs/common';
import { SlideBannerService } from './slide-banner.service';
import { SlideBannerController } from './slide-banner.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideBanner } from './slider~entity';

@Module({
  imports: [TypeOrmModule.forFeature([SlideBanner])],
  providers: [SlideBannerService],
  controllers: [SlideBannerController],
})
export class SlideBannerModule {}
