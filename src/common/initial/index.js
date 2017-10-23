import fs from 'fs';

import moment from 'moment';

import * as sfe from './../../modules/sfe/service.js';
import sfeExcel from './../../modules/sfe/services/excel.js';
import * as mailSender from './../../modules/util/mailsender.js';
import logger from './../../modules/util/log.js';

export default async () => {
  let date = moment().subtract(3, 'months');
  do {
    // await sfe.gather(date.format('YYYYMMDD'));
    date.add(1, 'days');
  } while (date.isBefore(moment()));
  const start = moment().subtract(3, 'months');
  const end = moment();
  const content = await sfeExcel({
    start,
    end,
    productId: 'cu_f'
  });
  const filename = `${start.format('YYYYMMDD')}-${end.format('YYYYMMDD')}.xlsx`;
  await mailSender.send({
    subject: `上期所交易数据${start.format('YYYYMMDD')}-${end.format('YYYYMMDD')}`,
    text: `Hey~I am Billy~
距离3个月还有${moment(new Date('2017/11/19')).diff(moment(), 'days')}天哦`,
    attachments: [{
      filename: `${start.format('YYYYMMDD')}-${end.format('YYYYMMDD')}.xlsx`,
      content
    }]
  });
  logger.info('done');
};