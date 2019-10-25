/*
 * Description:常量示例
 * Author:詹陈龙
 * Update:
 */
import { utils } from './utils';

class Constant {
  constructor () {
    // 性别示例
    // this.SexV = {
    //   男: 'M',
    //   女: 'F'
    // };
    this.statusV = {
      全部: undefined,
      停用: 0,
      启用: 1
    };

    this.options = {
      // sex: utils.objToArr(this.SexV),
      status: utils.objToArr(this.statusV)
    };
    // this.SexK = utils.reverse(this.SexV)
    this.statusK = utils.reverse(this.statusV);
  }
}
const constant = new Constant();
export default constant;
