import sequelize from 'sequelize';
import axios from 'axios';
import moment from 'moment';
import { map, unset, forEach, keys, trim } from 'lodash';

import logger from './../util/log.js';

const getDate = () => {
  return moment(new Date()).format('YYYYMMDD');
};

const baseUrl = 'http://www.shfe.com.cn/data/dailydata/kx/kx';

const fields = {
  PRODUCTID: 'productId',
  PRODUCTNAME: 'name',
  DELIVERYMONTH: 'deliveryMonth',
  PRESETTLEMENTPRICE: 'preSettlementPrice',
  OPENPRICE: 'openPrice',
  HIGHESTPRICE: 'highestPrice',
  LOWESTPRICE: 'lowestPrice',
  CLOSEPRICE: 'closePrice',
  SETTLEMENTPRICE: 'settlementPrice',
  ZD1_CHG: 'zd1',
  ZD2_CHG: 'zd2',
  VOLUME: 'volume',
  OPENINTEREST: 'openInterest',
  OPENINTERESTCHG: 'openInterestChg'
};

const savaMeta = async (rows) => {
  const products = {};
  // 过滤重复的商品
  forEach(rows, ({ productId, name }) => {
    products[productId] = { productId, name };
  });
  unset(products, '总计');
  const model = sequelize.models.SFEProduct;
  // 每个商品进行更新
  for (let productId of keys(products)) {
    const product = await model.findOne({ where: { productId } });
    if (product) {
      product.name = products[productId].name;
      await product.save;
    } else {
      await model.create(products[productId]);
    }
  }
};

const fetchData = async (date) => {
  const url = `${baseUrl}${date}.dat`;
  let response;
  try {
    response = await axios.get(url);
  } catch (err) {
    logger.warn(err, '采集异常');
    return;
  }
  if (response.status !== 200) {
    return;
  }
  return response.data;
};

const parseData = (data, date) => {
  const rowFields = keys(fields);
  return map(data, row => {
    const delivery = { date };
    for (let field of rowFields) {
      delivery[fields[field]] = trim(row[field]) || null;
    }
    return delivery;
  });
};

const gather = async (date) => {
  logger.info({ date }, 'gather sfe data');
  const data = await fetchData(date);
  const rows = parseData(data.o_curinstrument, date);
  await savaMeta(rows);
  logger.info({ rows }, 'get sfe data');
  const Model = sequelize.models.SFEKX;
  await Model.bulkCreate(rows);
};

export { gather };

export default async () => {
  const date = getDate();
  // const date = '20171013';
  await gather(date);
};