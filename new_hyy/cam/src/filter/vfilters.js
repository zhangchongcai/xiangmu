import { formatDate } from '../util/formatDate';
import formatMoney from '../util/formatMoney';
const vfilter = {
  formatDate: function (date, ymd) {
    try {
      return formatDate(new Date(date), ymd);
    } catch (e) {
      return date;
    }
  },
  formatMoney: function (price, places, symbol, thousand, decimal) {
    try {
      return formatMoney(price, places, symbol, thousand, decimal);
    } catch (e) {
      return price;
    }
  },
  limitTitleWord: function (str, length) {
    try {
      if (str.length < length) {
        return str;
      } else {
        return str.slice(0, length) + '...';
      }
    } catch (e) {
      return str;
    }
  },
  formatNum: (num, unit) => {
    let newNum = num * 1;
    if (num < 10000) {
      return num + unit;
    } else if (num < 100000000) {
      return (num / 10000).toFixed(2) + '万' + unit;
    } else {
      return (num / 100000000).toFixed(2) + '亿' + unit;
    }
  }
};

export default vfilter;
