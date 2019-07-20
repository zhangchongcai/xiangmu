import qs from 'qs'

export default {
    data() {},
    methods:{
        checkName(rules, value, callback) {
            let reg =  /^[a-zA-Z\u4E00-\u9FA5]{0,}$/;
            if (!value) {
                return callback(new Error('请输入票券名称'));
            }else if(value.length>25){
                return callback(new Error('票券名称不能超过25位字符'));
            }
            let param = {
                couponName: value
            }
            let pointer = this;
            if (pointer.model.type == 'revise') {
                param[`id`] = pointer.model.id;
            }
            // 校验唯一性 debunch
            if (pointer.time) clearTimeout(pointer.time);

            pointer.time = setTimeout(() => {
                pointer.$ccmList.saleListCheckName(param).then(data => {
                    if (data.flag == 1) {
                        callback();
                    } else {
                        callback(new Error(`${data.msg}`));
                    }
                    clearTimeout(pointer.time);
                }).catch(msg => {
                    callback(`查询票券名重复错误：${msg}`);
                    clearTimeout(pointer.time);
                })
            }, 1000);
        }
    },
    created(){}
}