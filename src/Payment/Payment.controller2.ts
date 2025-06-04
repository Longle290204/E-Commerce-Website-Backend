// import { Controller, Post, Req, Res, Body } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import dateFormat from 'dateformat';
// import * as crypto from 'crypto';
// import * as qs from 'qs';
// import { Request, Response } from 'express';
// import dayjs from 'dayjs';
// @Controller('payment')
// export class PaymentController {
//    constructor(private configService: ConfigService) {}

//    @Post('create_payment_url')
//    createPaymentUrl(@Req() req: Request, @Res() res: Response, @Body() body: any) {
//       const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
//       console.log('ipAddr', ipAddr);
      
//       const tmnCode = this.configService.get<string>('vnp_TmnCode') || 'G2UHKRKL';
//       const secretKey = this.configService.get<string>('vnp_HashSecret') || '712VQKA4PQ5W6AA3KPON4QQADLQMGA4G';
//       console.log('SecretKey:', secretKey);
//       const vnpUrl = this.configService.get<string>('vnp_Url') || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
//       const returnUrl = this.configService.get<string>('vnp_ReturnUrl') || 'http://localhost:3000/admin';

//       // const date = new Date();
//       const dayjs = require('dayjs');
//       const createDate = dayjs().format('YYYYMMDDHHmmss');
//       const orderId = dayjs().format('HHmmss');

//       console.log('createDate', createDate);

      

//       const amount = body.amount;
//       const bankCode = body.bankCode;
//       const orderInfo = body.orderDescription;
//       const orderType = body.orderType || 'other';
//       const locale = body.language || 'vn';
//       const currCode = 'VND';

//       let vnp_Params: Record<string, any> = {
//          vnp_Version: '2.1.0',
//          vnp_Command: 'pay',
//          vnp_TmnCode: tmnCode,
//          vnp_Locale: locale,
//          vnp_CurrCode: currCode,
//          vnp_TxnRef: orderId,
//          vnp_OrderInfo: orderInfo,
//          vnp_OrderType: orderType,
//          vnp_Amount: parseInt((amount || '0').replace(/,/g, '')) * 100,
//          vnp_ReturnUrl: returnUrl,
//          vnp_IpAddr: ipAddr,
//          vnp_CreateDate: createDate,
//       };

//       if (bankCode) {
//          vnp_Params['vnp_BankCode'] = bankCode;
//       }

//       vnp_Params = this.sortObject(vnp_Params);

//       const signData = qs.stringify(vnp_Params, { encode: true });
//       const hmac = crypto.createHmac('MD5', secretKey);
//       const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
//       vnp_Params['vnp_SecureHash'] = signed;

//       const finalUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true })}`;
//       console.log('finalUrl', finalUrl);
      
//       console.log('🔎 vnp_Params:', vnp_Params);
//       console.log('🔐 signData:', signData);
//       console.log('🔐 signed:', signed);

//       return res.redirect(finalUrl);
//    }

//    // Sắp xếp object theo key alphabetically
//    private sortObject(obj: Record<string, any>) {
//       const sorted = {};
//       const keys = Object.keys(obj).sort();
//       for (const key of keys) {
//          sorted[key] = obj[key];
//       }
//       return sorted;
//    }

//    // @Get('/vnpay-return')
//    // handleVnpayReturn(@Query() query: Record<string, string>, @Res() res: Response) {
//    //    const vnp_HashSecret = '712VQKA4PQ5W6AA3KPON4QQADLQMGA4G'; // same as lúc tạo link
//    //    const vnp_SecureHash = query['vnp_SecureHash'];

//    //    // Bỏ trường vnp_SecureHash và vnp_SecureHashType ra khỏi query
//    //    delete query['vnp_SecureHash'];
//    //    delete query['vnp_SecureHashType'];

//    //    // Sort các param theo alphabet
//    //    const sortedParams = Object.fromEntries(Object.entries(query).sort(([a], [b]) => a.localeCompare(b)));

//    //    // Tạo chuỗi để hash lại
//    //    const querystring = require('qs');
//    //    const signData = querystring.stringify(sortedParams, { encode: false });
//    //    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
//    //    const calculatedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

//    //    if (calculatedHash === vnp_SecureHash) {
//    //       if (query['vnp_ResponseCode'] === '00') {
//    //          // Thành công
//    //          return res.redirect(`/payment-result?status=success`);
//    //       } else {
//    //          // Không thành công
//    //          return res.redirect(`/payment-result?status=fail`);
//    //       }
//    //    } else {
//    //       // Chữ ký không hợp lệ
//    //       return res.redirect(`/payment-result?status=invalid-signature`);
//    //    }
//    // }

//    // @Get('/payment-result')
//    // getPaymentResult(@Query('status') status: string) {
//    //    console.log({ message: `Kết quả thanh toán: ${status}` });

//    //    return { message: `Kết quả thanh toán: ${status}` };
//    // }
// }
