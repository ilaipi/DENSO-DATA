import moment from 'moment';

import * as sfe from './../../modules/sfe/service.js';

export default async () => {
  let date = moment().subtract(3, 'months');
  do {
    await sfe.gather(date.format('YYYYMMDD'));
    date.add(1, 'days');
  } while (date.isBefore(moment()));
};