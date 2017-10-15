/**
 * 上海期货交易所的"日交易快讯"数据
 */
module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('SFEKX', {
    productId: {
      type: DataTypes.STRING,
      comment: '产品ID',
      enum: [
        'cu_f', // 铜
        'al_f', // 铝
        'zn_f', // 锌
        'pb_f', // 铅
        'ni_f', // 镍
        'sn_f', // 锡
        'au_f', // 黄金
        'ag_f', // 白银
        'rb_f', // 螺纹钢
        'wr_f', // 线材
        'hc_f', // 热轧卷板
        'fu_f', // 燃料油
        'bu_f', // 石油沥青
        'ru_f' // 天然橡胶
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
      type: DataTypes.INTEGER,
      comment: '前结算'
    },
    openPrice: {
      type: DataTypes.INTEGER,
      comment: '今开盘'
    },
    highestPrice: {
      type: DataTypes.INTEGER,
      comment: '最高价'
    },
    lowestPrice: {
      type: DataTypes.INTEGER,
      comment: '最低价'
    },
    closePrice: {
      type: DataTypes.INTEGER,
      comment: '收盘价'
    },
    settlementPrice: {
      type: DataTypes.INTEGER,
      comment: '结算参考价'
    },
    zd1: {
      type: DataTypes.INTEGER,
      comment: '涨跌1'
    },
    zd2: {
      type: DataTypes.INTEGER,
      comment: '涨跌2'
    },
    volume: {
      type: DataTypes.INTEGER,
      comment: '成交手'
    },
    openInterest: {
      type: DataTypes.INTEGER,
      comment: '持仓手'
    },
    openInterestChg: {
      type: DataTypes.INTEGER,
      comment: '持仓手变化'
    }
  }, {
    timestamps: false,
    tableName: 'sfekx',
    classMethods: {},
    instanceMethods: {}
  });

  return Model;
};