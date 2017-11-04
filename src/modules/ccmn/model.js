/**
 * 长江有色金属网
 * 1#铜
 */
module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('CCMN', {
    name: {
      type: DataTypes.STRING,
      comment: '产品'
    },
    priceRange: {
      type: DataTypes.STRING,
      comment: '价格区间'
    },
    date: {
      type: DataTypes.DATEONLY,
      comment: '交易日期'
    },
    avgPrice: {
      type: DataTypes.INTEGER,
      comment: '均价'
    },
    zd: {
      type: DataTypes.INTEGER,
      comment: '涨跌'
    },
    unit: {
      type: DataTypes.STRING,
      comment: '单位'
    }
  }, {
    tableName: 'ccmn',
    classMethods: {},
    instanceMethods: {}
  });

  return Model;
};