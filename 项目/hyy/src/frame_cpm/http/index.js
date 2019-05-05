//引入各个模块api
import cpmList from './interface';
import crmList from 'crm/http/interface'
import ctmList from 'ctm/http/interface'
import ccmList from 'ccm/http/interface'
import cmmList from 'cmm/http/interface'
import camList from 'cam/http/interface'
import rptList from 'rpt/http/interface'
import cimList from 'cim/http/interface'
import csmList from 'csm/http/interface'

const install = (Vue) => {
    if (install.installed) {
        return;
    }
    install.installed = true;

    Object.defineProperties(Vue.prototype, {
        //挂载在Vue原型的 $api 对象上
        $cpmList: {
            get() {
                return cpmList;
            }
        },
        $crmList: {
            get() {
                return crmList;
            }
        },
        $ctmList: {
            get() {
                return ctmList;
            }
        },
        $ccmList: {
            get() {
                return ccmList;
            }
        },
        $cmmList: {
            get() {
                return cmmList;
            }
        },
        $camList: {
            get() {
                return camList;
            }
        },
        $rptList: {
            get() {
                return rptList;
            }
        },
        $cimList: {
            get() {
                return cimList;
            }
        },
        $csmList: {
            get() {
                return csmList;
            }
        },
        
    });
};

export default install;