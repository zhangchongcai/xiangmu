<template>
    <div class="detail">
        <el-collapse v-model="activeNames">
            <el-collapse-item v-for="item in config" :key="item.title" :title="item.title" :name="item.activeName">
                <ul class="con_ul">
                    <li v-for="(conItem,conIdx) in item.content" :key="conIdx">
                        <el-row>
                            <el-col :span="2">
                                <div>{{conItem.title+"："}}</div>
                            </el-col>
                            <el-col :span="22">
                                <div>
                                    <el-row>
                                        <el-col :span="2">
                                            <span v-if="conItem.opUniqueName">{{conItem.opUniqueName}}</span>
                                        </el-col>
                                        <el-col :span="11">
                                            <span>{{conItem.value}}</span>
                                        </el-col>
                                    </el-row>
                                </div>
                                <div v-for="(optItem,index) in conItem.options" :key="index">{{optItem}}</div>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </el-collapse-item>
        </el-collapse>
        <el-row class="flex-base flex-center bottom-control-group">
            <div class="detailReturnBtn">
                <el-button class="returnBtn" @click="returnList()">返回</el-button>
            </div>
        </el-row>
    </div>
</template>

<script>
import qs from "qs";
export default {
    data(){
        return {
            // 折叠区域
            activeNames: ["1", "2", "3", "4"],
            templateId:'',
            config:[{
                activeName:"1",
                title:"活动基础信息",
                content:[{
                    title:"活动类型",
                    key:'templateId',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"活动名称",
                    key:'name',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"活动描述",
                    key:'remark',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"执行策略",
                    key:'executeMode',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"执行优先级",
                    key:'priority',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"活动有效期",
                    key:'validDate',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"排除日期",
                    key:'excludeDate',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"时段范围",
                    key:'validWeekTimeRange',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                },{
                    title:"交易渠道",
                    key:'consumeWayCode',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                }]
            },{
                activeName:"2",
                title:"设置活动条件",
                content:[{
                    title:"交易影院",
                    key:'cinemaCode',
                    opUniqueName:'包含',
                    value:'',
                    options:[]
                },{
                    title:"会员等级",
                    key:'customerLevelCode',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                },{
                    title:"会员卡政策",
                    key:'cardRightCode',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                },{
                    title:"商品名称",
                    key:'merKey',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                },{
                    title:"卖品单价",
                    key:'merPrice',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                },{
                    title:"支付方式",
                    key:'payTypeCode',
                    opUniqueName:'不限',
                    value:'',
                    options:[]
                },{
                    title:"卖品总金额",
                    key:'merSumPrice',
                    opUniqueName:'',
                    value:'',
                    options:[]
                }]
            },{
                activeName:"3",
                title:"设置优惠方案",
                content:[{
                    title:"商品",
                    key:'merKey',
                    opUniqueName:'',
                    value:'',
                    options:[]
                },{
                    title:"优惠设置",
                    key:'modifyValue',
                    opUniqueName:'',
                    value:'',
                    options:[]
                }]
            },{
                activeName:"4",
                title:"设置活动预算",
                content:[{
                    title:"活动总预算",
                    key:'modifyAmountMethod',
                    opUniqueName:'不限制',
                    value:'',
                    options:[]
                },{
                    title:"活动总预算周期限制",
                    key:'runRestrainType',
                    opUniqueName:'不限制',
                    value:'',
                    options:[]
                }]
            }],
            // 租户id
            tenantId:JSON.parse(localStorage.getItem('user')).consumerId,
        }
    },
    created(){
        if(this.$route.query.id){
            let id = this.$route.query.id;
            this.init(id);
        }
    },
    methods: {
        init(id){
            let params = qs.stringify({
                activityId: id,
                tenantId: this.tenantId,
            });
            this.$cmmList.marketingViewActivity(params).then(res => {
                if (res && res.code === 200) {
                    let ruleGroup = JSON.parse(res.data.marketingActivityVO.ruleGroup);
                    this.templateId = ruleGroup.templateId;
                    let ruleConditions = ruleGroup.rules[0].ruleConditions;
                    let actions = ruleGroup.rules[0].actions;
                    let bizPropertyMap = ruleGroup.rules[0].bizPropertyMap;
                    for(let item of this.config){
                        // 活动基础信息
                        if(item.activeName == 1){
                            // 活动类型
                            if(ruleGroup.templateId == 17){
                                item.content.find( item => item.key=='templateId').value = '打折';
                            }else if(ruleGroup.templateId == 18){
                                item.content.find( item => item.key=='templateId').value = '满减';
                            }else if(ruleGroup.templateId == 19){
                                item.content.find( item => item.key=='templateId').value = '立减';
                            }else if(ruleGroup.templateId == 20){
                                item.content.find( item => item.key=='templateId').value = '减至';
                            }
                            // 活动名称
                            item.content.find( item => item.key=='name').value = ruleGroup.name;
                            // 活动描述
                            item.content.find( item => item.key=='remark').value = ruleGroup.remark;
                            // 执行策略
                            item.content.find( item => item.key=='executeMode').value =ruleGroup.executeMode == "AUTO_MATCH" ? "自动" : "推荐"
                            // 执行优先级
                            item.content.find( item => item.key=='priority').value = ruleGroup.priority == 100 ? "按最优先执行" : ruleGroup.priority;
                            // 活动有效期
                            item.content.find( item => item.key=='validDate').value = ruleGroup.validDateStart + "  至  " + ruleGroup.validDateEnd;
                            for(let comItem of ruleGroup.commonInfo){
                                // 排除日期
                                if(comItem.key == "holiday"){
                                    let conItem = item.content.find( item => item.key=='excludeDate');
                                    if(conItem.value){
                                        conItem.value = '节假日除外 / 指定排除日期范围';
                                    }else{
                                        conItem.value = '节假日除外';
                                    }
                                }
                                if(comItem.key == "appointInvalidDate"){
                                    let options = [];
                                    let values = JSON.parse(comItem.value)
                                    for (let value of values) {
                                        value = value[0] + '  至  ' + value[1]
                                        options.push(value)
                                    }
                                    let conItem = item.content.find( item => item.key=='excludeDate');
                                    if(conItem.value){
                                        conItem.value = '节假日除外 / 指定排除日期范围';
                                    }else{
                                        conItem.value = '指定排除日期范围';
                                    }
                                    conItem.options = options;
                                }
                                // 时段范围
                                if(comItem.key == 'validWeekTimeRange'){
                                    let options = [];
                                    let values = JSON.parse(comItem.value)
                                    for (let value of values) {
                                        let valueItems = []
                                        for(let valueItem of value){
                                            if(valueItem == 1){
                                                valueItems.push('星期一')
                                            }else if(valueItem == 2){
                                                valueItems.push('星期二')
                                            }else if(valueItem == 3){
                                                valueItems.push('星期三')
                                            }else if(valueItem == 4){
                                                valueItems.push('星期四')
                                            }else if(valueItem == 5){
                                                valueItems.push('星期五')
                                            }else if(valueItem == 6){
                                                valueItems.push('星期六')
                                            }else if(valueItem == 7){
                                                valueItems.push('星期日')
                                            }
                                        }
                                        valueItems.push(value[value.length - 2]+':00 至 '+ value[value.length - 1]+':00 ')
                                        valueItems = valueItems.join('、')
                                        options.push(valueItems)
                                    }
                                    let conItem = item.content.find( item => item.key=='validWeekTimeRange');
                                    conItem.opUniqueName = comItem.opUniqueName == "WeekTimeRangeOperator" ? "指定时段":"不限";
                                    conItem.options = options;
                                }
                                // 交易渠道
                                if(comItem.key == 'consumeWayCode'){
                                    let conItem = item.content.find( item => item.key=='consumeWayCode');
                                    conItem.opUniqueName = comItem.opUniqueName == "normalIn" ? '包含' : comItem.opUniqueName == "normalNotIn" ? "不包含" : '不限';
                                    conItem.value = comItem.text;
                                }
                            }
                        }
                        // 设置活动条件
                        if(item.activeName == 2){
                            for (let ruleCondition of ruleConditions) {
                                //交易影院
                                if (ruleCondition.key == "cinemaCode") {
                                    let conItem = item.content.find( item => item.key=='cinemaCode')
                                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : '不包含';
                                    conItem.value = ruleCondition.text;
                                }
                                // 会员等级
                                if (ruleCondition.key == "customerLevelCode") {
                                    let conItem = item.content.find( item => item.key=='customerLevelCode')
                                    if(ruleCondition.opUniqueName == 'normalIn'){
                                        conItem.opUniqueName = '包含'
                                        conItem.value = ruleCondition.text;
                                    }else if(ruleCondition.opUniqueName == 'normalNotIn'){
                                        conItem.opUniqueName = '不包含'
                                        conItem.value = ruleCondition.text;
                                    }else if(ruleCondition.opUniqueName == 'not_memberOperator'){
                                        conItem.opUniqueName = '非会员'
                                    }else{
                                        conItem.opUniqueName = '不限'
                                    }
                                }
                                //会员卡政策
                                if (ruleCondition.key == "cardRightCode") {
                                    let conItem = item.content.find( item => item.key=='cardRightCode')
                                    if(ruleCondition.opUniqueName == 'normalIn'){
                                        conItem.opUniqueName = '包含'
                                        conItem.value = ruleCondition.text;
                                    }else if(ruleCondition.opUniqueName == 'normalNotIn'){
                                        conItem.opUniqueName = '不包含'
                                        conItem.value = ruleCondition.text;
                                    }else if(ruleCondition.opUniqueName == 'AllMember'){
                                        conItem.opUniqueName = '全部卡政策'
                                    }else{
                                        conItem.opUniqueName = '不限'
                                    }
                                }
                                // 商品名称
                                if(ruleCondition.key == "merKey"){
                                    let conItem = item.content.find( item => item.key=='merKey')
                                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                                    conItem.value = ruleCondition.text;
                                }
                                // 卖品单价
                                if(ruleCondition.key == "merPrice"){
                                    let conItem = item.content.find( item => item.key=='merPrice')
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        conItem.opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        conItem.opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        conItem.opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        conItem.opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        conItem.opUniqueName = '不等于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        conItem.opUniqueName = '等于';
                                    }else{
                                        conItem.opUniqueName = '不限';
                                    }
                                    conItem.value = ruleCondition.value;
                                }
                                // 支付方式
                                if(ruleCondition.key == "payTypeCode"){
                                    let conItem = item.content.find( item => item.key=='payTypeCode')
                                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                                    conItem.value = ruleCondition.text;
                                }
                                // 卖品总金额
                                if(ruleCondition.key == "merSumPrice"){
                                    item.content.find( item => item.key=='merSumPrice').value  = ruleCondition.value;
                                }
                            }
                        }
                        //设置优惠方案
                        if(item.activeName == 3){
                            for (let action of actions) {
                                //商品
                                if (action.key == "merKey") {
                                    item.content.find( item => item.key=='merKey').value = action.text;
                                }
                                // 优惠设置
                                if (action.key == "modifyValue") {
                                    let conItem = item.content.find( item => item.key=='modifyValue')
                                    if(this.templateId == 17){
                                        conItem.value = `折扣${action.value}%(每件商品)`
                                    }else if(this.templateId == 18){
                                        for(let action of actions){
                                            if (action.key == "fullReduceValue") {
                                                let values = JSON.parse(action.value)
                                                let options = [];
                                                for(let value of values){
                                                    options.push(`满 ¥ ${value[0]} 减 ¥ ${value[1]}`)
                                                }
                                                conItem.options = options;
                                            }
                                        }
                                    }else if(this.templateId == 19){
                                        conItem.value = `立减${action.value}/每件商品`
                                    }else if(this.templateId == 20){
                                        conItem.value = `定价${action.value}元/每件商品`
                                    }
                                }
                                // 折扣后取整方式
                                if (action.key == "decimalRoundMode"){
                                    let value = '';
                                    if(action.value == "ROUND_UNNECESSARY"){
                                        value = "保留小数"
                                    }else if(action.value == "ROUND_HALF_UP"){
                                        value = "四舍五入"
                                    }else if(action.value == "ROUND_FLOOR"){
                                        value = "忽略小数取整"
                                    }else if(action.value == "ROUND_CEILING"){
                                        value = "小数进1取整"
                                    }
                                    item.content.push({
                                        title:"折扣后取整方式",
                                        key:'decimalRoundMode',
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }
                                // 调价商品数量
                                if (action.key == "modifyAmountMethod"){
                                    let value = '';
                                    let opUniqueName = '';
                                    for(let action of actions){
                                        if (action.key == "modifyAmount") {
                                            value = action.value;
                                        }
                                    }
                                    if(action.value == "appointAmount"){
                                        opUniqueName = "指定数量"
                                    }else if(action.value == "all"){
                                        opUniqueName = "该商品全部数量"
                                    }else if(action.value == "perMemberDay"){
                                        opUniqueName = "每会员每日数量"
                                    }else if(action.value == "perMemberWeek"){
                                        opUniqueName = "每会员每周数量"
                                    }else if(action.value == "perMemberMonth"){
                                        opUniqueName = "每会员每月数量"
                                    }
                                    item.content.push({
                                        title:"调价商品数量",
                                        key:'modifyAmountMethod',
                                        opUniqueName,
                                        value:action.value == "all" ? '' : value,
                                        options:[]
                                    })
                                }
                            }
                        }
                        //设置活动预算
                        if(item.activeName == 4){
                            // 预算金额计算
                            if(bizPropertyMap.totalOrdersAmount || bizPropertyMap.totalDiscountAmount){
                                let conItem = item.content.find( item => item.key=='modifyAmountMethod')
                                conItem.opUniqueName = '指定预算限制'
                                if(bizPropertyMap.totalOrdersAmount){
                                    conItem.options.push(`限制优惠总订单数${bizPropertyMap.totalOrdersAmount}单`);
                                }
                                if(bizPropertyMap.totalDiscountAmount){
                                    conItem.options.push(`限制总优惠金额${bizPropertyMap.totalDiscountAmount}元`);
                                }
                            }else{
                                let conItem = item.content.find( item => item.key=='modifyAmountMethod')
                                conItem.opUniqueName = '不限制';
                                conItem.options = [];
                            }
                            // 活动总预算周期限制
                            let conItem = item.content.find( item => item.key=='runRestrainType');
                            if(bizPropertyMap.runAmount){
                                conItem.options.push(`数量${bizPropertyMap.runAmount}个`);
                            }
                            if(bizPropertyMap.runRestrainType == 'perDay'){
                                conItem.opUniqueName = '每日限制';
                            }else if(bizPropertyMap.runRestrainType == 'perWeek'){
                                conItem.opUniqueName = '每周限制';
                            }else if(bizPropertyMap.runRestrainType == 'perMonth'){
                                conItem.opUniqueName = '每月限制';
                            }else if(bizPropertyMap.runRestrainType == 'perYear'){
                                conItem.opUniqueName = '每年限制';
                            }else if(bizPropertyMap.runRestrainType == 'appointTimeRange'){
                                conItem.opUniqueName = '指定周期限制';
                                let value = JSON.parse(bizPropertyMap.appointRunRestrainRange)
                                conItem.value = value[0] +  '  至  '  + value[1]
                            }else{
                                conItem.opUniqueName = '不限制';
                                conItem.options = [];
                            }
                        }
                    }
                }
            }).catch(err => {
                console.log(err);
            });
        },
        returnList(){
            // 返回
            this.$store.commit("tagNav/removeTagNav", this.$route);
            this.$router.push({name:'卖品活动管理'});
        }
    },
    // 组件路由守卫
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if(!to.query.id){
                vm.$store.commit("tagNav/removeTagNav", vm.$route);
                next({name:'卖品活动管理'});
            }
        })
    }
}
</script>
<style lang="scss" scoped>
/deep/.detail{
    .el-collapse-item{
        .el-collapse-item__header::after {
            height: 0;
            width: 0;
        }
        .el-collapse-item__header {
        padding-left: 50px !important;
        width: 968px;
        border-bottom: 1px solid #ebeef5;
        font-weight: 600;
            .el-collapse-item__arrow {
                margin-left: -104px;
            }
        }
        .is-active {
            border-bottom: 0 none;
            border-bottom-color: transparent !important;
        }
    }
    .con_ul{
        padding-left:50px; 
        li{
            line-height: 36px;
        }
    }
    .detailReturnBtn {
        position: fixed;
        bottom: 0px;
        height: 56px;
        width: 90%;
        background: #ffffff;
    }
    .returnBtn {
        width: 80px;
        padding-left: 0;
        padding-right: 0;
        height: 32px;
        font-size: 12px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        span {
            text-align: center;
        }
    }
}   
</style>