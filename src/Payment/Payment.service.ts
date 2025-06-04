import * as crypto from 'crypto';
import * as moment from 'moment';
import * as qs from 'qs';
import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/CreatePayment.dto';

@Injectable()
export class PaymentService {
   createPaymentUrl(createPayment: CreatePaymentDto, ip: string) {
      const vnp_TmnCode = 'G2UHKRKL';
      const vnp_HashSecret = '712VQKA4PQ5W6AA3KPON4QQADLQMGA4G';
      const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
      const vnp_ReturnUrl = 'http://localhost:3000/admin';

      console.log('ip', ip);

      const date = new Date();
      const createDate = moment(date).format('YYYYMMDDHHmmss');
      const orderId = moment(date).format('HHmmss');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      console.log();

      const vnp_Params: Record<string, string> = {
         vnp_Version: '2.1.0',
         vnp_Command: 'pay',
         vnp_TmnCode: vnp_TmnCode,
         vnp_Locale: 'vn',
         vnp_CurrCode: 'VND',
         vnp_TxnRef: orderId,
         // vnp_SecureHashType: 'SHA512',
         vnp_OrderInfo: createPayment.orderDescription,
         vnp_OrderType: 'other',
         vnp_Amount: (createPayment.amount * 100).toString(),
         vnp_ReturnUrl: vnp_ReturnUrl,
         vnp_IpAddr: ip,
         vnp_CreateDate: createDate,
         vnp_ExpireDate: moment(tomorrow).format('YYYYMMDDHHmmss'),
      };

      // B1: Sắp xếp tham số theo thứ tự alphabet
      const sortedParams = Object.keys(vnp_Params)
         .sort()
         .reduce((accumulator, key) => {
            accumulator[key] = vnp_Params[key];
            return accumulator;
         }, {});

      // B2: Tạo chuỗi query để ký (KHÔNG encode giá trị!)
      // const signData = qs.stringify(sortedParams, { encode: false });
      const signData = qs.stringify(sortedParams, { encode: false });
      console.log('👉 signData:', signData);
      // B3: Tạo chữ ký HMAC SHA512

      const signed = crypto.createHmac('sha512', vnp_HashSecret).update(signData, 'utf-8').digest('hex');
      console.log('signed:', signed);

      // B4: Gắn chữ ký vào params
      sortedParams['vnp_SecureHash'] = signed;
      // sortedParams['vnp_SecureHashType'] = 'SHA512';

      const finalUrl = `${vnp_Url}?${qs.stringify(sortedParams, { encode: true })}`;
      console.log('👉 Final URL:', finalUrl);

      return finalUrl;
   }
}
