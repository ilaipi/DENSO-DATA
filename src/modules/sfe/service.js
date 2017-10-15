import sequelize from 'sequelize';
import axios from 'axios';
import moment from 'moment';
import { map, keys, trim } from 'lodash';

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

export default async () => {
  // const date = getDate();
  const date = '20171013';
  console.log('date', date);
  const data = await fetchData(date);
  const rows = parseData(data.o_curinstrument, date);
  console.log(rows);
  const Model = sequelize.models.SFEKX;
  await Model.bulkCreate(rows);
};