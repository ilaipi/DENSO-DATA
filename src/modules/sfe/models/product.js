/**
 * 上海期货交易所的"日交易快讯"中的产品
 */
module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('Consumer', {
    name: {
      type: DataTypes.STRING,
      comment: '产品名称'
    },
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
    }
  }, {
    classMethods: {},
    instanceMethods: {}
  });

  return Model;
};