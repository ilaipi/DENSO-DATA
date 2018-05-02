import sequelize from 'sequelize';
import moment from 'moment';
import axios from 'axios';
import iconv from 'iconv';
import cheerio from 'cheerio';
import { map, isEmpty } from 'lodash';

import logger from './../util/log.js';

const baseUrl = 'http://www.ccmn.cn/historyprice/cjxh_1/';

const { Iconv } = iconv;

const fetchData = async () => {
  let response;
  try {
    const encoder = new Iconv('GBK', 'UTF-8');
    response = await axios.get(baseUrl, {
      responseType: 'arraybuffer'
    });
    response = encoder.convert(response.data).toString();
    response = response.replace(/\r?\n|\r|\t|\s{2,}/g, '');
    const $ = cheerio.load(response);
    response = $('div#list_elem table tbody tr');
  } catch (err) {
    logger.warn(err, '采集长江有色金属网异常');
    return;
  }
  return response;
};

const fields = ['name', 'priceRange', 'avgPrice', 'zd', 'unit', 'date'];

const parseData = (data) => {
  if (isEmpty(data)) return [];
  const year = moment().get('year');
  const rows = data.map((idx, element) => {
    const $ = cheerio.load(element);
    const product = {};
    $('td').each((i, ele) => {
      product[fields[i]] = cheerio.load(ele).text();
    });
    product.date = moment(new Date(`${year}-${product.date}`)).toDate();
    product.avgPrice = Number(product.avgPrice);
    product.zd = Number(product.zd);
    console.log(product);
    return product;
  });
  rows.splice(0, 1);
  return rows;
};

const gather = async () => {
  logger.info('start ccmn');
  const data = await fetchData();
  logger.info('ccmn fetched');
  const products = parseData(data);
  if (isEmpty(products)) return;
  const date = products[0].date;
  const Model = sequelize.models.CCMN;
  await Model.destroy({ where: { date } });
  await Model.bulkCreate(map(products, (product) => { return { ...product }; }));
};

export default async () => {
  logger.info('start ccmn');
  const data = await fetchData();
  logger.info('ccmn fetched');
  parseData(data);
};

export { gather };