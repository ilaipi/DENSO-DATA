/**
 * 每天采集当天的数据
 * 如果是1号和16号 则发送邮件
 */
import moment from 'moment';

import models from './common/models/';

import * as sfe from './modules/sfe/service.js';
import * as ccmn from './modules/ccmn/service.js';
import sfeExcel from './modules/sfe/services/excel.js';
import ccmnExcel from './modules/ccmn/services/excel.js';
import * as mailSender from './modules/util/mailsender.js';
import logger from './modules/util/log.js';

models()
.then(async () => {
  const today = moment();
  const day = today.date();
  await sfe.gather(today.format('YYYYMMDD'));
  await ccmn.gather();

  if (day !== 1 && day !== 16) { process.exit(0); }
  logger.info({ day }, 'will send mail');
  // 1 或 16
  let start = moment().subtract(1, 'months').date(day); // 含
  let end = today; // 不含
  logger.info({ start: start.format('YYYYMMDD'), end: end.format('YYYYMMDD') }, 'send mail date');
  const cuContent = await sfeExcel({
    start, end, productId: 'cu_f'
  });
  const alContent = await sfeExcel({
    start, end, productId: 'al_f'
  });
  const ccmnContent = await ccmnExcel({
    start, end, name: '1#铜'
  });
  const filename = `${start.format('MMDD')}-${end.format('MMDD')}`;
  await mailSender.send({
    subject: `交易数据${filename}`,
    text: `Hey~I am your Billy~
距离3个月还有${moment(new Date('2017/11/19')).diff(moment(), 'days')}天哦`,
    attachments: [{
      filename: `上期所铜-${filename}.xlsx`,
      content: cuContent
    }, {
      filename: `上期所铝-${filename}.xlsx`,
      content: alContent
    }, {
      filename: `长江有色金属网-1#铜-${filename}.xlsx`,
      content: ccmnContent
    }]
  });
  process.exit(0);
});