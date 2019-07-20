import {formatDate} from '../util/formatDate';
import formatMoney from '../util/formatMoney';
import utilDict from '../util/formatDict.js'
const vfilter = {
	formatDate: function(date, ymd) {
		try {
			return formatDate(new Date(date), ymd);
		} catch (e) {
			return date;
		}
	},
	formatMoney: function(price, places, symbol, thousand, decimal) {
		try {
			return formatMoney(price, places, symbol, thousand, decimal);
		} catch (e) {
			return price;
		}
	},
	limitTitleWord: function(str, length) {
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
	dict(code, groupCode) {
        var name = utilDict.getDictValue(groupCode, code)
        return name || code
    },
    dictState(code, groupCode) {
        var name = utilDict.getDictStateValue(groupCode, code)
        return name || code
    }
};

export default vfilter;
