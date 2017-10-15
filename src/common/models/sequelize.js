import glob from 'glob';
import path from 'path';
import _ from 'lodash';
import Sequelize from 'sequelize';

import config from './../../modules/util/config';

export default () => {
  const sequelize = new Sequelize(config.sequelize);
  const models = {};
  let defines = glob.sync('*/model.js', {
    root: 'modules',
    cwd: path.resolve(__dirname, '..', '..', 'modules')
  });
  defines = _.union(defines, glob.sync('*/models/*.js', {
    root: 'modules',
    cwd: path.resolve(__dirname, '..', '..', 'modules')
  }));
  defines.forEach(function (define) {
    const schema = require('../../modules/' + define);
    const model = schema(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  });
  Sequelize.models = models;
  _.forIn(models, function (model) {
    if (model.associate) {
      model.associate(models);
    }
  });
  return sequelize.sync();
};