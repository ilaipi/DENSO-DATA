import nodemailer from 'nodemailer';

import config from './config.js';
import logger from './log.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: '465',
  secure: true,
  auth: {
    user: config.mail.from,
    pass: config.mail.pass
  }
});

const mailOptions = {
  from: config.mail.from,
  to: config.mail.to
};

/**
 * 发邮件
 * @param { String } subject 邮件主体
 * @param { String } text 邮件文本正文
 * @param { String } html 邮件html正文
 * @param { Array[Object] } attachments 附件
 * attachments: { filename: <String>, content: <Buffer> }
 */
const send = async ({ subject, text, html, attachments }) => {
  const options = { ...mailOptions, attachments, subject, text, html };
  logger.info({ subject, text, html }, 'send mail');
  await transporter.sendMail(options);
};

export { send };