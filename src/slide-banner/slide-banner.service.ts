import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SlideBanner } from './slider~entity';
import { CreateSlideBannerDto } from './dto/create~SlideBanner.dto';

@Injectable()
export class SlideBannerService {
  constructor(private readonly dataSource: DataSource) {}
  private slideBannerRepository = this.dataSource.getRepository(SlideBanner);

  async create(
    createSlideBannerDto: CreateSlideBannerDto,
    image: Express.Multer.File,
  ): Promise<SlideBanner> {
    const imageURL = `http://localhost:3002/slidebanners/${image.filename}`;
    const slideBanner = this.slideBannerRepository.create({ ...createSlideBannerDto ,imageURL });
    return await this.slideBannerRepository.save(slideBanner);
  }

  getSliderBanner(): Promise<SlideBanner[]> {
    return this.slideBannerRepository.find();
  }
}
