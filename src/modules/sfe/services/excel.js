import sequelize from 'sequelize';
import excel from 'node-excel-export';

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
  const content = excel.buildExport([
    {
      name: product.name,
      specification,
      data: rows
    }
  ]);
  return content;
};