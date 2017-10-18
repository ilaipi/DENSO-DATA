/**
 * 长江有色金属网
 * 1#铜
 */
module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('CCMNProduct', {
    name: {
      type: DataTypes.STRING,
      comment: '产品名称'
    },
    productId: {
      type: DataTypes.STRING,
      comment: '产品ID',
      enum: [
      ]
    }
  }, {
    timestamps: false,
    tableName: 'ccmn_product',
    classMethods: {},
    instanceMethods: {}
  });

  return Model;
};