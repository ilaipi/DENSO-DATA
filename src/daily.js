/**
 * 每天采集当天的数据
 * 如果是1号和16号 则发送邮件
 */
import moment from 'moment';

import models from './common/models/';

import * as sfe from './modules/sfe/service.js';
import sfeExcel from './modules/sfe/services/excel.js';
import * as mailSender from './modules/util/mailsender.js';
import logger from './modules/util/log.js';

models()
.then(async () => {
  const today = moment();
  const day = today.date();
  await sfe.gather(today.format('YYYYMMDD'));

  // 获取本月改变交割月的那天
  const last = today.add(1, 'months').date(1).subtract(1, 'days').date();
  const changeDay = last > 30 ? 17 : 16;

  if (day !== 1 && day !== changeDay) return;
  logger.info({ day, changeDay }, 'will send mail');
  let start;
  let end;
  // 1号发上个月的数据
  if (day === 1) {
    start = moment().subtract(1, 'months').date(1); // 含
    end = moment(); // 不含
  }
  // 变化的那天 发上个月变化的那天到这个月变化的前一天的数据
  if (day === changeDay) {
    const preLast = moment().date(1).subtract(1, 'days').date();
    const preChangeDay = preLast > 30 ? 17 : 16;
    start = moment().subtract(1, 'months').date(preChangeDay - 1);
    end = moment().subtract(1, 'days');
  }
  logger.info({ start: start.format('YYYYMMDD'), end: end.format('YYYYMMDD') });
  const cuContent = await sfeExcel({
    start, end, productId: 'cu_f'
  });
  const znContent = await sfeExcel({
    start, end, productId: 'zn_f'
  });
  const filename = `${start.format('MMDD')}-${end.format('MMDD')}`;
  await mailSender.send({
    subject: `上期所交易数据${filename}`,
    text: `Hey~I am Billy~
距离3个月还有${moment(new Date('2017/11/19')).diff(moment(), 'days')}天哦`,
    attachments: [{
      filename: `铜-${filename}.xlsx`,
      content: cuContent
    }, {
      filename: `锌-${filename}.xlsx`,
      content: znContent
    }]
  });
});