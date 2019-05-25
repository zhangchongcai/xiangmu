import basicSettings from './basicSettings';
import goodsInformation from './goodsInformation';
import inventoryManagement from './inventoryManagement';
import procurement from './procurement';

const index = Object.assign({}, basicSettings, goodsInformation,inventoryManagement,procurement);

export default index;