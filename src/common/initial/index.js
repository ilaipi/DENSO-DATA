import moment from 'moment';

import * as sfe from './../../modules/sfe/service.js';
import sfeExcel from './../../modules/sfe/services/excel.js';

export default async () => {
  let date = moment().subtract(3, 'months');
  do {
    // await sfe.gather(date.format('YYYYMMDD'));
    date.add(1, 'days');
  } while (date.isBefore(moment()));
  await sfeExcel({
    start: moment().subtract(3, 'months'),
    end: moment(),
    productId: 'cu_f'
  });
};