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

/**
 * 根据日期 判断第一行的交割月
 * 31天的月份 16号以后才是下个月
 * 30天的月份 15号以后就是下个月
 */
const firstDeliveryMonth = (date) => {
  const momentDate = moment(date);
  const day = momentDate.date();
  const endDay = momentDate.add(1, 'months').date(1).subtract(1, 'days').date();
  if (endDay > 30 && day > 16) {
    momentDate.add(1, 'months');
  }
  if (endDay < 30 && day > 15) {
    momentDate.add(1, 'months');
  }
  return momentDate.format('YYMM');
};

const parseData = (data, date) => {
  const rowFields = keys(fields);
  return map(data, row => {
    const delivery = { date };
    const fdm = firstDeliveryMonth(date);
    for (let field of rowFields) {
      delivery[fields[field]] = trim(row[field]) || null;
    }
    delivery.first = delivery.deliveryMonth === fdm;
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

/**
 * 查询指定时间范围内（前含后不含）
 * 某个商品
 * 所有的first=true记录
 */
const queryFirst = async ({ start, end, productId }) => {
  const model = sequelize.models.SFEKX;
  const where = { productId, first: true };
  const { and, gte, lt } = sequelize.Op;
  if (start && end) {
    where[and] = [ { date: { [gte]: start } }, { date: { [lt]: end } } ];
  }
  return await model.findAll({ where });
};

export { gather, queryFirst };

export default async () => {
  const date = getDate();
  // const date = '20171018';
  await gather(date);
};