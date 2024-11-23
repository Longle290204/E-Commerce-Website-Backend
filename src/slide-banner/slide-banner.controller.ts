import { Controller, Get, Body } from '@nestjs/common';
import { SlideBannerService } from './slide-banner.service';
import { UseInterceptors } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadedFile } from '@nestjs/common';
import { HttpStatus, HttpException } from '@nestjs/common';
import { SlideBanner } from './slider~entity';
import { CreateSlideBannerDto } from './dto/create~SlideBanner.dto';

@Controller('slide-banner')
export class SlideBannerController {
  constructor(private slideBannerService: SlideBannerService) {}
  @Post()
  @UseInterceptors(
    FileInterceptor('imageURL', {
      storage: diskStorage({
        destination: './slidebanners',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async createSliderBanner(
    @Body() createSlideBannerDto: CreateSlideBannerDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    if (!image) {
      throw new HttpException('File is required.', HttpStatus.BAD_REQUEST);
    }

    try {
      const slideBanner = await this.slideBannerService.create(
        createSlideBannerDto,
        image,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Product created successfully',
        data: slideBanner,
      };
    } catch (error) {
      throw new HttpException(
        { message: 'Error creating product', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('slidebanners')
  getSlideBanner(): Promise<SlideBanner[]> {
    return this.slideBannerService.getSliderBanner();
  }
}
