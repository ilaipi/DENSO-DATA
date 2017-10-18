/**
 * 长江有色金属网
 * 1#铜
 */
module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('CCMN', {
    productId: {
      type: DataTypes.STRING,
      comment: '产品ID',
      enum: [
      ]
    },
    date: {
      type: DataTypes.DATEONLY,
      comment: '交易日期'
    },
    deliveryMonth: {
      type: DataTypes.STRING,
      comment: '交割月'
    },
    preSettlementPrice: {
      type: DataTypes.DOUBLE,
      comment: '前结算'
    },
    openPrice: {
      type: DataTypes.DOUBLE,
      comment: '今开盘'
    },
    highestPrice: {
      type: DataTypes.DOUBLE,
      comment: '最高价'
    },
    lowestPrice: {
      type: DataTypes.DOUBLE,
      comment: '最低价'
    },
    closePrice: {
      type: DataTypes.DOUBLE,
      comment: '收盘价'
    },
    settlementPrice: {
      type: DataTypes.DOUBLE,
      comment: '结算参考价'
    },
    zd1: {
      type: DataTypes.DOUBLE,
      comment: '涨跌1'
    },
    zd2: {
      type: DataTypes.DOUBLE,
      comment: '涨跌2'
    },
    volume: {
      type: DataTypes.DOUBLE,
      comment: '成交手'
    },
    openInterest: {
      type: DataTypes.DOUBLE,
      comment: '持仓手'
    },
    openInterestChg: {
      type: DataTypes.DOUBLE,
      comment: '持仓手变化'
    }
  }, {
    tableName: 'ccmn',
    classMethods: {},
    instanceMethods: {}
  });

  return Model;
};