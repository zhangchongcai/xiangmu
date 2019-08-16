import basicSettings from './basicSettings';
import goodsInformation from './goodsInformation';
import inventoryManagement from './inventoryManagement';
import procurement from './procurement';
import posSetting from './posSetting';

const index = Object.assign({}, basicSettings, goodsInformation,inventoryManagement,procurement,posSetting);

export default index;