/**
 * 同步近3个月的数据
 */
import moment from 'moment';

import * as sfe from './../../modules/sfe/service.js';
import * as ccmn from './../../modules/ccmn/service.js';

export default async () => {
  let date = moment().subtract(4, 'months');
  do {
    await sfe.gather(date.format('YYYYMMDD'));
    date.add(1, 'days');
  } while (date.isBefore(moment()));
  await ccmn.gather();
};