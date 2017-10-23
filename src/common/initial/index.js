/**
 * 同步近3个月的数据
 */
import moment from 'moment';

import * as sfe from './../../modules/sfe/service.js';
import sfeExcel from './../../modules/sfe/services/excel.js';
import * as mailSender from './../../modules/util/mailsender.js';
import logger from './../../modules/util/log.js';

export default async () => {
  let date = moment().subtract(3, 'months');
  do {
    await sfe.gather(date.format('YYYYMMDD'));
    date.add(1, 'days');
  } while (date.isBefore(moment()));
};