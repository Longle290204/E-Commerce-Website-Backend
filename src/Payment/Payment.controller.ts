import { Get, Query, Res, Post, Body, Req, Controller } from '@nestjs/common';
import { CreatePaymentDto } from './dto/CreatePayment.dto';
import * as crypto from 'crypto';
import { Response } from 'express';
import { Request } from 'express';
import { PaymentService } from './Payment.service';

@Controller('payment')
export class PaymentController {
   constructor(private readonly paymentService: PaymentService) {}

   @Post('/create-payment')
   createPayment(@Body() createPayment: CreatePaymentDto, @Req() req: Request) {
      const ip = req.ip;
      const url = this.paymentService.createPaymentUrl(createPayment, ip);
      return { paymentUrl: url };
   }

   @Get('/vnpay-return')
   handleVnpayReturn(@Query() query: Record<string, string>, @Res() res: Response) {
      const vnp_HashSecret = '712VQKA4PQ5W6AA3KPON4QQADLQMGA4G'; // same as lúc tạo link
      const vnp_SecureHash = query['vnp_SecureHash'];

      // Bỏ trường vnp_SecureHash và vnp_SecureHashType ra khỏi query
      delete query['vnp_SecureHash'];
      delete query['vnp_SecureHashType'];

      // Sort các param theo alphabet
      const sortedParams = Object.fromEntries(Object.entries(query).sort(([a], [b]) => a.localeCompare(b)));

      // Tạo chuỗi để hash lại
      const querystring = require('qs');
      const signData = querystring.stringify(sortedParams, { encode: false });
      const hmac = crypto.createHmac('sha512', vnp_HashSecret);
      const calculatedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

      if (calculatedHash === vnp_SecureHash) {
         if (query['vnp_ResponseCode'] === '00') {
            // Thành công
            return res.redirect(`/payment-result?status=success`);
         } else {
            // Không thành công
            return res.redirect(`/payment-result?status=fail`);
         }
      } else {
         // Chữ ký không hợp lệ
         return res.redirect(`/payment-result?status=invalid-signature`);
      }
   }

   @Get('/payment-result')
   getPaymentResult(@Query('status') status: string) {
      console.log({ message: `Kết quả thanh toán: ${status}` });

      return { message: `Kết quả thanh toán: ${status}` };
   }
}
