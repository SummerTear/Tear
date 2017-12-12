import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import { mailConfig, webConfig } from '../config';
import genOrigin from './genOrigin';

// TODO 多语言
// 生成html
let mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'SummerTear',
    link: `${genOrigin(webConfig.host, webConfig.port)}`
  }
});
let genConfirmEmailHtml = (uid, key) =>
  mailGenerator.generate({
    body: {
      intro: '这是用户验证',
      action: {
        instructions: '点击下面的按钮验证',
        button: {
          color: '',
          text: '验证账号',
          link: `${genOrigin(webConfig.host, webConfig.port)}/confirm/${uid}_${
            key
          }`
        }
      }
    }
  });

// 邮件发送
const smtpTransport = nodemailer.createTransport({
  host: mailConfig.host,
  secureConnection: true,
  port: mailConfig.port,
  auth: {
    user: mailConfig.username,
    pass: mailConfig.password
  }
});

export default function sendRegisterEmail(address, uid, activeKey) {
  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(
      {
        from: mailConfig.from,
        to: address,
        subject: '帐号验证',
        html: genConfirmEmailHtml(uid, activeKey)
      },
      (error, response) => {
        if (error) {
          reject(error);
          console.log('mail send error', error);
        } else {
          resolve(response);
        }
      }
    );
  });
}
