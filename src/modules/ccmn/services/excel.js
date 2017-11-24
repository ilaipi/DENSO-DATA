import sequelize from 'sequelize';
import excel from 'node-excel-export';

export default async ({ start, end, name }) => {
  const model = sequelize.models.CCMN;
  const rows = await model.findAll({ where: { name }, order: [ [ 'date' ] ] }); // 日期排升序
  const specification = {
    date: {
      displayName: '日期',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    priceRange: {
      displayName: '价格区间',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    avgPrice: {
      displayName: '均价',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    zd: {
      displayName: '涨跌',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    },
    unit: {
      displayName: '单位',
      headerStyle: {
        font: { sz: 14 }
      },
      width: 120
    }
  };
  const content = excel.buildExport([
    {
      name,
      specification,
      data: rows
    }
  ]);
  return content;
};