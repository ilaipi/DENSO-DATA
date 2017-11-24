import sequelize from 'sequelize';
import excel from 'node-excel-export';
import moment from 'moment';
import { keyBy } from 'lodash';

import * as sfe from './../service.js';

export default async ({ start, end, productId }) => {
  const model = sequelize.models.SFEProduct;
  const product = await model.findOne({ where: { productId } });
  const rows = await sfe.queryFirst({ start, end, productId });
  const specification = {
    date: {
      displayName: '日期',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    deliveryMonth: {
      displayName: '交割月',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    closePrice: {
      displayName: '收盘价',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    settlementPrice: {
      displayName: '结算参考价',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    }
  };
  const mappings = keyBy(rows, ({ date }) => moment(date).format('YYYY-MM-DD'));
  const mappingRows = [];
  let today = moment(start);
  do {
    mappingRows.push(mappings[today.format('YYYY-MM-DD')] || {
      date: today.format('YYYY-MM-DD')
    });
    today.add(1, 'days');
  } while (today.isBefore(end));
  const content = excel.buildExport([
    {
      name: product.name,
      specification,
      data: mappingRows
    }
  ]);
  return content;
};