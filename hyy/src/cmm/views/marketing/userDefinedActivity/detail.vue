<template>
    <div class="detail">
        <el-collapse v-model="activeNames">
            <el-collapse-item v-for="item in config" :key="item.title" :title="item.title" :name="item.activeName" :class="{'addGroupLeft':item.activeName == 2}">
                <ul class="con_ul" v-if="item.activeName != 2">
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
                <div class="bigBtn" v-else>
                    <div class="def-tag" v-for="(rule,index) in rules" :key="index" @click="openDialog(index)">
                        <span>{{rule.name}}</span>
                    </div>
                </div>
            </el-collapse-item>
        </el-collapse>
        <el-row class="flex-base flex-center bottom-control-group">
            <div class="detailReturnBtn">
                <el-button class="returnBtn" @click="returnList()">返回</el-button>
            </div>
        </el-row>
        <div class="dialog">
            <el-dialog :visible.sync="dialogVisible" width="80%">
                <el-collapse v-model="dialogActiveNames">
                    <el-collapse-item v-for="item in dialogConfig" :key="item.title" :title="item.title" :name="item.dialogActiveName">
                        <ul class="con_ul" v-if="item.dialogActiveName == 1">
                            <li v-for="(conItem,conIdx) in item.content" :key="conIdx">
                                <el-row>
                                    <el-col :span="3">
                                        <div>{{conItem.title+"："}}</div>
                                    </el-col>
                                    <el-col :span="21">
                                        <span>{{conItem.value}}</span>
                                    </el-col>
                                </el-row>
                            </li>
                        </ul>
                        <div v-if="item.dialogActiveName != 1" style="padding-left: 30px;">
                            <el-tabs tab-position="left" style="height:500px;">
                                <el-tab-pane v-for="tabItem in item.content" :key="tabItem.title" label>
                                    <span slot="label">
                                        <el-badge type="primary" size="small" :value="tabItem.content.length" v-if="tabItem.content.length>0">
                                            {{tabItem.title}}
                                        </el-badge>
                                        <span v-else style="font-size:12px;">{{tabItem.title}}</span>
                                    </span>
                                    <ul class="con_ul" v-if="item.dialogActiveName == 2">
                                        <li v-for="(tabConItem,tabConIdx) in tabItem.content" :key="tabConIdx">
                                            <el-row>
                                                <el-col :span="3">
                                                    <div>{{tabConItem.title+"："}}</div>
                                                </el-col>
                                                <el-col :span="21">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="3">
                                                                <span v-if="tabConItem.opUniqueName">{{tabConItem.opUniqueName}}</span>
                                                            </el-col>
                                                            <el-col :span="11">
                                                                <span>{{tabConItem.value}}</span>
                                                                <div v-for="(tabConOptItem,tabConOptIndex) in tabConItem.options" :key="tabConOptIndex">{{tabConOptItem}}</div>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <div v-for="(childItem,childIdx) in tabConItem.children" :key="childIdx">
                                                    <el-col :span="3">
                                                        <div>{{childItem.title+"："}}</div>
                                                    </el-col>
                                                    <el-col :span="21">
                                                        <div>
                                                            <el-row>
                                                                <el-col :span="3">
                                                                    <span v-if="childItem.opUniqueName">{{childItem.opUniqueName}}</span>
                                                                </el-col>
                                                                <el-col :span="11">
                                                                    <span>{{childItem.value}}</span>
                                                                </el-col>
                                                            </el-row>
                                                        </div>
                                                    </el-col>
                                                </div>
                                            </el-row>
                                        </li>
                                    </ul>
                                    <ul class="con_ul" v-if="item.dialogActiveName == 3">
                                        <li v-for="(tabConItem,tabConIdx) in tabItem.content" :key="tabConIdx">
                                            <div>【{{tabConItem.title}}】</div>
                                            <el-row v-for="(contentItem,contentIdx) in tabConItem.content" :key="contentIdx">
                                                <el-col :span="3">
                                                    <div>{{contentItem.title+"："}}</div>
                                                </el-col>
                                                <el-col :span="21">
                                                    <div>
                                                        <el-row>
                                                            <el-col :span="3">
                                                                <span v-if="contentItem.opUniqueName">{{contentItem.opUniqueName}}</span>
                                                            </el-col>
                                                            <el-col :span="11">
                                                                <span>{{contentItem.value}}</span>
                                                            </el-col>
                                                        </el-row>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import qs from "qs";
export default {
    data(){
        return {
            // 折叠区域
            activeNames: ["1", "2", "3"],
            // 分组活动执行条件折叠区域
            dialogActiveNames: ["1", "2", "3"],
            templateId:'',
            config:[{
                activeName:"1",
                title:"活动基础信息",
                content:[{
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
                },{
                    title:"交易影院",
                    key:'cinemaCode',
                    opUniqueName:'包含',
                    value:'',
                    options:[]
                }]
            },{
                activeName:"2",
                title:"分组活动执行条件",
                content:[]
            },{
                activeName:"3",
                title:"设置活动预算",
                content:[{
                    title:"预算金额计算",
                    key:'budgetSet',
                    opUniqueName:'优惠金额',
                    value:'',
                    options:[]
                },{
                    title:"活动总预算",
                    key:'activityBudgetSum',
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
            dialogConfig:[{
                dialogActiveName:"1",
                title:"子活动基础信息",
                content:[{
                    title:"分组活动名称",
                    key:'name',
                    opUniqueName:'',
                    value:'',
                    options:[]
                }]
            },{
                dialogActiveName:"2",
                title:"子活动适用条件",
                content:[{
                    title:"会员类",
                    key:'MemberInfo',
                    content:[]
                },{
                    title:"影票类",
                    key:'FilmTicketInfo',
                    content:[]
                },{
                    title:"卖品类",
                    key:'MerchandiseInfo',
                    content:[]
                },{
                    title:"交易类",
                    key:'SaleInfo',
                    content:[]
                }]
            },{
                dialogActiveName:"3",
                title:"子活动执行方式",
                content:[{
                    title:"会员类",
                    key:'MemberInfo',
                    content:[]
                },{
                    title:"影票类",
                    key:'FilmTicketInfo',
                    content:[]
                },{
                    title:"交易类",
                    key:'SaleInfo',
                    content:[]
                }]
            }],
            // 租户id
            tenantId:JSON.parse(localStorage.getItem('user')).consumerId,
            // 分组活动执行条件
            rules:[],
            rule:[],
            dialogVisible: false
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
                    let bizPropertyMap = ruleGroup.rules[0].bizPropertyMap;
                    let rules = ruleGroup.rules;
                    this.rules = rules;
                    for(let item of this.config){
                        // 活动基础信息
                        if(item.activeName == 1){
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
                                    try {
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
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                                // 时段范围
                                if(comItem.key == 'validWeekTimeRange'){
                                    try {
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
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                                // 交易渠道
                                if(comItem.key == 'consumeWayCode'){
                                    let conItem = item.content.find( item => item.key=='consumeWayCode');
                                    conItem.opUniqueName = comItem.opUniqueName == "normalIn" ? '包含' : comItem.opUniqueName == "normalNotIn" ? "不包含" : '不限';
                                    conItem.value = comItem.text;
                                }
                                // 交易影院
                                if (comItem.key == "cinemaCode") {
                                    let conItem = item.content.find( item => item.key=='cinemaCode')
                                    conItem.opUniqueName = comItem.opUniqueName == 'normalIn' ? '包含' : '不包含';
                                    conItem.value = comItem.text;
                                }
                            }
                        }
                        // 分组活动执行条件
                        if(item.activeName == 2){}
                        // 设置活动预算
                        if(item.activeName == 3){
                            // 预算金额计算
                            item.content.find( item => item.key=='budgetSet').opUniqueName = bizPropertyMap.budgetSet == 'discount' ?  '优惠金额' : '补贴金额'
                            // 活动总预算
                            if(bizPropertyMap.totalTicketsAmount || bizPropertyMap.totalDiscountAmount){
                                let conItem = item.content.find( item => item.key=='activityBudgetSum');
                                conItem.opUniqueName = '指定预算限制'
                                if(bizPropertyMap.totalTicketsAmount){
                                    conItem.options.push(`限制总票数${bizPropertyMap.totalTicketsAmount}张`);
                                }
                                if(bizPropertyMap.totalDiscountAmount){
                                    conItem.options.push(`限制总补贴金额${bizPropertyMap.totalDiscountAmount}元`);
                                }
                            }else{
                                let conItem = item.content.find( item => item.key=='activityBudgetSum')
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
                                try {
                                    conItem.opUniqueName = '指定周期限制';
                                    let value = JSON.parse(bizPropertyMap.appointRunRestrainRange)
                                    conItem.value = value[0] +  '  至  '  + value[1]
                                } catch (error) {
                                    console.log(error)
                                }
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
        // 打开分组活动执行条件弹窗
        openDialog(index){
            // 初始化子活动适用条件
            for(let tabItem  of this.dialogConfig[1].content){
                tabItem.content = [];
            }
            // 初始化子活动执行方式
            for(let tabItem  of this.dialogConfig[2].content){
                tabItem.content = [];
            }
            this.dialogVisible = true;
            this.rule = this.rules[index];
            let rule = this.rule;
            console.log(this.rule)
            for(let item of this.dialogConfig){
                // 子活动基础信息
                if(item.dialogActiveName == 1){
                    item.content[0].value = rule.name;
                }
                // 子活动适用条件
                if(item.dialogActiveName == 2){
                    for(let ruleCondition of rule.ruleConditions){
                        for(let tabItem of item.content){
                            // 会员类
                            if(tabItem.key == "MemberInfo"){
                                if(ruleCondition.key == "birthday" && ruleCondition.groupId == 7){// 生日
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "EqualCurrentDay"){
                                        opUniqueName = '等于当日';
                                    }else if(ruleCondition.opUniqueName == "EqualCurrentMoney"){
                                        opUniqueName = '等于当月';
                                    }else if(ruleCondition.opUniqueName == "EqualCurrentMonthOffset"){
                                        opUniqueName = '交易当月前后N月';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"生日",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value == "true" ? "":ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "sex" && ruleCondition.groupId == 8){// 性别
                                    tabItem.content.push({
                                        title:"性别",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : '不限',
                                        value:ruleCondition.value == '0' ? '男' : ruleCondition.value == '1' ? '女' : ruleCondition.value == '0,1'||'1,0' ? '男,女' :'',
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "age" && ruleCondition.groupId == 9){// 年龄
                                    try{
                                        let opUniqueName = '';
                                        let value = ruleCondition.value;
                                        let options = [];
                                        if(ruleCondition.opUniqueName == "normalGreater"){
                                            opUniqueName = '大于';
                                        }else if(ruleCondition.opUniqueName == "normalEqual"){
                                            opUniqueName = '等于';
                                        }else if(ruleCondition.opUniqueName == "normalLess"){
                                            opUniqueName = '小于';
                                        }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                            opUniqueName = '大于等于';
                                        }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                            opUniqueName = '小于等于';
                                        }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                            opUniqueName = '不等于';
                                        }else if(ruleCondition.opUniqueName == "BetweenOperator"){
                                            opUniqueName = '包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}-${value[1]}`)
                                            }
                                            value = '';
                                        }else if(ruleCondition.opUniqueName == "not_BetweenOperator"){
                                            opUniqueName = '不包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}-${value[1]}`)
                                            }
                                            value = '';
                                        }else{
                                            opUniqueName = '不限';
                                        }
                                        tabItem.content.push({
                                            title:"年龄",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName,
                                            value,
                                            options
                                        })
                                    }catch(err){
                                        console.log(err)
                                    }
                                }else if(ruleCondition.key == "openMonths" && ruleCondition.groupId == 87){// 开卡月限
                                    try {
                                        let opUniqueName = '';
                                        let value = ruleCondition.value;
                                        let options = [];
                                        if(ruleCondition.opUniqueName == "normalGreater"){
                                            opUniqueName = '大于';
                                        }else if(ruleCondition.opUniqueName == "normalEqual"){
                                            opUniqueName = '等于';
                                        }else if(ruleCondition.opUniqueName == "normalLess"){
                                            opUniqueName = '小于';
                                        }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                            opUniqueName = '大于等于';
                                        }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                            opUniqueName = '小于等于';
                                        }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                            opUniqueName = '不等于';
                                        }else if(ruleCondition.opUniqueName == "BetweenOperator"){
                                            opUniqueName = '包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}-${value[1]}`)
                                            }
                                            value = '';
                                        }else if(ruleCondition.opUniqueName == "not_BetweenOperator"){
                                            opUniqueName = '不包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}-${value[1]}`)
                                            }
                                            value = '';
                                        }else{
                                            opUniqueName = '不限';
                                        }
                                        tabItem.content.push({
                                            title:"开卡月限",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName,
                                            value,
                                            options
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }else if(ruleCondition.key == "openYears" && ruleCondition.groupId == 11){// 开卡年限
                                    try {
                                        let opUniqueName = '';
                                        let value = ruleCondition.value;
                                        let options = [];
                                        if(ruleCondition.opUniqueName == "normalGreater"){
                                            opUniqueName = '大于';
                                        }else if(ruleCondition.opUniqueName == "normalEqual"){
                                            opUniqueName = '等于';
                                        }else if(ruleCondition.opUniqueName == "normalLess"){
                                            opUniqueName = '小于';
                                        }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                            opUniqueName = '大于等于';
                                        }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                            opUniqueName = '小于等于';
                                        }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                            opUniqueName = '不等于';
                                        }else if(ruleCondition.opUniqueName == "BetweenOperator"){
                                            opUniqueName = '包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}-${value[1]}`)
                                            }
                                            value = '';
                                        }else if(ruleCondition.opUniqueName == "not_BetweenOperator"){
                                            opUniqueName = '不包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}-${value[1]}`)
                                            }
                                            value = '';
                                        }else{
                                            opUniqueName = '不限';
                                        }
                                        tabItem.content.push({
                                            title:"开卡年限",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName,
                                            value,
                                            options
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }else if(ruleCondition.key == "openDate" && ruleCondition.groupId == 12){// 开卡日期
                                    try {
                                        let opUniqueName = '';
                                        let value = ruleCondition.value;
                                        let options = [];
                                        if(ruleCondition.opUniqueName == "TimeGreaterOperator"){
                                            opUniqueName = '大于';
                                        }else if(ruleCondition.opUniqueName == "TimeEqualOperator"){
                                            opUniqueName = '等于';
                                        }else if(ruleCondition.opUniqueName == "TimeLessOperator"){
                                            opUniqueName = '小于';
                                        }else if(ruleCondition.opUniqueName == "TimeGreaterEqualOperator"){
                                            opUniqueName = '大于等于';
                                        }else if(ruleCondition.opUniqueName == "TimeLessEqualOperator"){
                                            opUniqueName = '小于等于';
                                        }else if(ruleCondition.opUniqueName == "not_TimeEqualOperator"){
                                            opUniqueName = '不等于';
                                        }else if(ruleCondition.opUniqueName == "DateRangeContainOperator"){
                                            opUniqueName = '包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}至${value[1]}`)
                                            }
                                            value = '';
                                        }else if(ruleCondition.opUniqueName == "not_DateRangeContainOperator"){
                                            opUniqueName = '不包含区间';
                                            let values = JSON.parse(value)
                                            for (let value of values) {
                                                options.push(`${value[0]}至${value[1]}`)
                                            }
                                            value = '';
                                        }else{
                                            opUniqueName = '不限';
                                        }
                                        tabItem.content.push({
                                            title:"开卡日期",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName,
                                            value,
                                            options
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }else if(ruleCondition.key == "registerBusinessCode" && ruleCondition.groupId == 13){// 注册影院
                                    tabItem.content.push({
                                        title:"注册影院",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "balance" && ruleCondition.groupId == 3){// 账户余额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"账户余额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "integral" && ruleCondition.groupId == 4){// 积分余额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"积分余额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "integralTotall" && ruleCondition.groupId == 52){// 累计积分
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"累计积分",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "sumPrice" && ruleCondition.groupId == 2){// 单次消费金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"单次消费金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "consumeSum" && ruleCondition.groupId == 6){// 累计消费金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"累计消费金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "cardTypeKey" && ruleCondition.groupId == 10){// 会员卡类型
                                    tabItem.content.push({
                                        title:"会员卡类型",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "cardRightCode" && ruleCondition.groupId == 100){// 会员卡政策
                                    tabItem.content.push({
                                        title:"会员卡政策",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' : ruleCondition.opUniqueName == "AllMember" ? '全部卡政策' :'不限',
                                        value:ruleCondition.opUniqueName == "AllMember"?'':ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "customerLevelCode" && ruleCondition.groupId == 101){// 会员等级
                                    tabItem.content.push({
                                        title:"会员等级",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' : ruleCondition.opUniqueName == "not_memberOperator" ? '非会员' :'不限',
                                        value:ruleCondition.opUniqueName == "not_memberOperator"?'':ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "firstRecharge" && ruleCondition.groupId == 98){// 首充金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"首充金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "sumPrice" && ruleCondition.groupId == 1){// 单次充值金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "customGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "customEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "customLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "customGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "customLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"单次充值金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "chargeSum" && ruleCondition.groupId == 50){// 累计充值金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "customGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "customEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "customLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "customGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "customLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"累计充值金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }
                            }
                            // 影票类
                            if(tabItem.key == "FilmTicketInfo"){
                                if(ruleCondition.key == "uniformCode" && ruleCondition.groupId == 79){// 影片
                                    tabItem.content.push({
                                        title:"影片",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "hallTypeKey" && ruleCondition.groupId == 36){// 影厅类型
                                    tabItem.content.push({
                                        title:"影厅类型",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmTypeKey" && ruleCondition.groupId == 34){// 影片类型
                                    tabItem.content.push({
                                        title:"影片类型",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "stringSplitContainOneOperator" ? '包含' : ruleCondition.opUniqueName == "notStringSplitContainOneOperator" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "showEffect" && ruleCondition.groupId == 35){// 放映效果
                                    tabItem.content.push({
                                        title:"放映效果",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "FieldStringIndexOf" ? '包含' : ruleCondition.opUniqueName == "notFieldStringIndexOf" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "seatGrade" && ruleCondition.groupId == 89){// 座位等级
                                    tabItem.content.push({
                                        title:"座位等级",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "hallSeatAmout" && ruleCondition.groupId == 37){// 放映厅座位数
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"放映厅座位数",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "lowestPrice" && ruleCondition.groupId == 38){// 最低发行价
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"最低发行价",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value + "元",
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "planStartTime" && ruleCondition.groupId == 81){// 放映有效期
                                    try {
                                        let opUniqueName = '';
                                        if(ruleCondition.opUniqueName == "TimeBetweenOperator"){
                                            ruleCondition.value = JSON.parse(ruleCondition.value);
                                            opUniqueName = '包含范围';
                                        }else if(ruleCondition.opUniqueName == "DayContainOperator"){
                                            opUniqueName = '包含每月指定日';
                                        }else if(ruleCondition.opUniqueName == "not_DayContainOperator"){
                                            opUniqueName = '不包含每月指定日';
                                        }else{
                                            opUniqueName = '不限';
                                        }
                                        tabItem.content.push({
                                            title:"放映有效期",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName,
                                            value:ruleCondition.opUniqueName == "TimeBetweenOperator" ? `${ruleCondition.value[0]}至${ruleCondition.value[1]}`:ruleCondition.value,
                                            options:[]
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }else if(ruleCondition.key == "filmPlanWeekRange" && ruleCondition.groupId == 83){// 放映星期范围
                                    if(ruleCondition.opUniqueName == "WeekDateRangeOperator"){
                                        ruleCondition.value = ruleCondition.value.replace(/1/,'星期一').replace(/2/,'星期二').replace(/3/,'星期三').replace(/4/,'星期四').replace(/5/,'星期五').replace(/6/,'星期六').replace(/7/,'星期日')
                                    }else{
                                        ruleCondition.value = '';
                                    }
                                    tabItem.content.push({
                                        title:"放映星期范围",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "WeekDateOperator" ? '周一到周五' :ruleCondition.opUniqueName == "WeekDateRangeOperator" ? '指定星期范围' :'不限',
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmPlanInvalidTime" && ruleCondition.groupId == 82){// 放映排除日期
                                    try {
                                        let options = [];
                                        if(ruleCondition.value != '' && ruleCondition.value != "true"){
                                            ruleCondition.opUniqueName = '指定排除日期范围'
                                            let values = JSON.parse(ruleCondition.value)
                                            for (let value of values) {
                                                value = value[0] + '  至  ' + value[1]
                                                options.push(value)
                                            }
                                        }else if(ruleCondition.value == "true"){
                                            ruleCondition.opUniqueName = '节假日除外'
                                        }
                                        tabItem.content.push({
                                            title:"放映排除日期",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName:ruleCondition.opUniqueName,
                                            value:'',
                                            options
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }else if(ruleCondition.key == "filmPlanTimeRange" && ruleCondition.groupId == 84){// 放映时段范围
                                    try {
                                        let opUniqueName = '';
                                        let options = [];
                                        if(ruleCondition.opUniqueName == "MorningOperator"){
                                            opUniqueName = '上午09:00-12:59'
                                        }else if(ruleCondition.opUniqueName == "AfternoonOperator"){
                                            opUniqueName = '下午13:00-16:59'
                                        }else if(ruleCondition.opUniqueName == "NightOperator"){
                                            opUniqueName = '晚上17:00-02:00'
                                        }else if(ruleCondition.opUniqueName == "TimeRangeContainOperator"){
                                            opUniqueName = '指定时段范围'
                                            let values = JSON.parse(ruleCondition.value)
                                            for (let value of values) {
                                                value = value[0] + '  至  ' + value[1]
                                                options.push(value)
                                            }
                                        }else{
                                            opUniqueName = '不限'
                                        }
                                        tabItem.content.push({
                                            title:"放映时段范围",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName,
                                            value:'',
                                            options
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    } 
                                }
                            }
                            // 卖品类
                            if(tabItem.key == "MerchandiseInfo"){
                                if(ruleCondition.key == "brandId" && ruleCondition.groupId == 40){// 品牌
                                    tabItem.content.push({
                                        title:"品牌",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "classCode" && ruleCondition.groupId == 41){// 类别
                                    tabItem.content.push({
                                        title:"类别",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "merKey" && ruleCondition.groupId == 46){// 商品名称
                                    tabItem.content.push({
                                        title:"商品名称",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }
                            }
                            // 交易类
                            if(tabItem.key == "SaleInfo"){
                                if(ruleCondition.key == "cinemaAreaId" && ruleCondition.groupId == 25){// 交易影院行政区域
                                    tabItem.content.push({
                                        title:"交易影院行政区域",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "tradeType" && ruleCondition.groupId == 33){// 交易类型
                                    tabItem.content.push({
                                        title:"交易类型",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.value.replace(/BUY/,'消费').replace(/MEMBER_ADD_AMOUNT/,'充值').replace(/REJECT/,'退货'),
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "saleItemType" && ruleCondition.groupId == 100){// 商品类型
                                    tabItem.content.push({
                                        title:"商品类型",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.value.replace(/1/,'卖品').replace(/0/,'电影票'),
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "price" && ruleCondition.groupId == 31){// 商品单价
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"商品单价",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmPrice" && ruleCondition.groupId == 92){// 影票单价
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"影票单价",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "merPrice" && ruleCondition.groupId == 93){// 卖品单价
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"卖品单价",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmTicketAmount" && ruleCondition.groupId == 80){// 影票商品数量
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"影票商品数量",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmSumPrice" && ruleCondition.groupId == 90){// 影票总金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"影票总金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "merSumPrice" && ruleCondition.groupId == 91){// 卖品总金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"卖品总金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "sumPrice" && ruleCondition.groupId == 26){// 整单交易金额
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else if(ruleCondition.opUniqueName == "normalNotEqual"){
                                        opUniqueName = '不等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"整单交易金额",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "merKey" && ruleCondition.groupId == 21){// 指定商品购买数量/商品名称
                                    tabItem.content.push({
                                        title:"指定商品购买数量",
                                        key:'',
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:'',
                                        value:'',
                                        options:[],
                                        children:[{
                                            title:"商品名称",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含':'不限',
                                            value:ruleCondition.text,
                                            options:[],
                                        },{
                                            title:"数量",
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'不限',
                                            value:'',
                                            options:[],
                                        }]
                                    })
                                }else if(ruleCondition.key == "amount" && ruleCondition.groupId == 21){// 指定商品购买数量/数量
                                    let child = tabItem.content.find(item => item.title=='指定商品购买数量').children[1];
                                    if(ruleCondition.opUniqueName == "normalEqual"){
                                        child.opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        child.opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        child.opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        child.opUniqueName = '小于等于';
                                    }else{
                                        child.opUniqueName = '不限';
                                    }
                                    child.value = ruleCondition.value;
                                    child.key = ruleCondition.key;
                                    child.groupId = ruleCondition.groupId;
                                }else if(ruleCondition.key == "classCode" && ruleCondition.groupId == 28){// 同类商品累计购买数量/商品类别
                                    tabItem.content.push({
                                        title:"同类商品累计购买数量",
                                        key:'',
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:'',
                                        value:'',
                                        options:[],
                                        children:[{
                                            title:"商品类别",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含':'不限',
                                            value:ruleCondition.text,
                                            options:[],
                                        },{
                                            title:"累计购买数量",
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'不限',
                                            value:'',
                                            options:[],
                                        }]
                                    })
                                }else if(ruleCondition.key == "sumAmount" && ruleCondition.groupId == 28){// 同类商品累计购买数量/累计购买数量
                                    let child = tabItem.content.find(item => item.title=='同类商品累计购买数量').children[1];
                                    if(ruleCondition.opUniqueName == "MerStatisItemAmountGreater"){
                                        child.opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountEqual"){
                                        child.opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountLess"){
                                        child.opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountGreaterEqual"){
                                        child.opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountLessEqual"){
                                        child.opUniqueName = '小于等于';
                                    }else{
                                        child.opUniqueName = '不限';
                                    }
                                    child.value = ruleCondition.value;
                                    child.key = ruleCondition.key;
                                    child.groupId = ruleCondition.groupId;
                                }else if(ruleCondition.key == "brandId" && ruleCondition.groupId == 29){// 同品牌商品累计购买数量/商品品牌
                                    tabItem.content.push({
                                        title:"同品牌商品累计购买数量",
                                        key:'',
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:'',
                                        value:'',
                                        options:[],
                                        children:[{
                                            title:"商品品牌",
                                            key:ruleCondition.key,
                                            groupId:ruleCondition.groupId,
                                            opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含':'不限',
                                            value:ruleCondition.text,
                                            options:[],
                                        },{
                                            title:"累计购买数量",
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'不限',
                                            value:'',
                                            options:[],
                                        }]
                                    })
                                }else if(ruleCondition.key == "sumAmount" && ruleCondition.groupId == 29){// 同品牌商品累计购买数量/累计购买数量
                                    let child = tabItem.content.find(item => item.title=='同品牌商品累计购买数量').children[1];
                                    if(ruleCondition.opUniqueName == "MerStatisItemAmountGreater"){
                                        child.opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountEqual"){
                                        child.opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountLess"){
                                        child.opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountGreaterEqual"){
                                        child.opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "MerStatisItemAmountLessEqual"){
                                        child.opUniqueName = '小于等于';
                                    }else{
                                        child.opUniqueName = '不限';
                                    }
                                    child.value = ruleCondition.value;
                                    child.key = ruleCondition.key;
                                    child.groupId = ruleCondition.groupId;
                                }else if(ruleCondition.key == "payTypeCode" && ruleCondition.groupId == 86){// 支付方式
                                    tabItem.content.push({
                                        title:"支付方式",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalIn" ? '包含' : ruleCondition.opUniqueName == "normalNotIn" ? '不包含' :'不限',
                                        value:ruleCondition.text,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmStartDayBefore" && ruleCondition.groupId == 94){// 放映前N天
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"放映前N天",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "filmStartHourBefore" && ruleCondition.groupId == 95){// 放映前N小时
                                    let opUniqueName = '';
                                    if(ruleCondition.opUniqueName == "normalGreater"){
                                        opUniqueName = '大于';
                                    }else if(ruleCondition.opUniqueName == "normalEqual"){
                                        opUniqueName = '等于';
                                    }else if(ruleCondition.opUniqueName == "normalLess"){
                                        opUniqueName = '小于';
                                    }else if(ruleCondition.opUniqueName == "normalGreaterEqual"){
                                        opUniqueName = '大于等于';
                                    }else if(ruleCondition.opUniqueName == "normalLessEqual"){
                                        opUniqueName = '小于等于';
                                    }else{
                                        opUniqueName = '不限';
                                    }
                                    tabItem.content.push({
                                        title:"放映前N小时",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName,
                                        value:ruleCondition.value,
                                        options:[]
                                    })
                                }else if(ruleCondition.key == "firstBuyTicket" && ruleCondition.groupId == 96){// 首次购票
                                    tabItem.content.push({
                                        title:"首次购票",
                                        key:ruleCondition.key,
                                        groupId:ruleCondition.groupId,
                                        opUniqueName:ruleCondition.opUniqueName == "normalEqual" ? '包含':'',
                                        value:ruleCondition.value == 'true' ? '是':'',
                                        options:[]
                                    })
                                }
                            }
                        }
                    }
                }
                // 子活动执行方式
                if(item.dialogActiveName == 3){
                    for(let action of rule.actions){
                        for(let tabItem of item.content){
                            // 会员类
                            if(tabItem.key == "MemberInfo"){
                                if(action.key == "presentPoint" && action.groupId == 1){// 赠送积分
                                    tabItem.content.push({
                                        title:'赠送积分',
                                        content:[{
                                            title:'赠送积分',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "pointPersent" && action.groupId == 18){// 赠送积分倍率
                                    tabItem.content.push({
                                        title:'赠送积分倍率',
                                        content:[{
                                            title:'赠送积分倍率',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "presentMoney" && action.groupId == 2){// 赠送会员卡储值额
                                    tabItem.content.push({
                                        title:'赠送会员卡储值额',
                                        content:[{
                                            title:'赠送会员卡储值额',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "couponApplyCode" && action.groupId == 3){// 赠送票券/票券名称
                                    tabItem.content.push({
                                        title:'赠送票券',
                                        content:[{
                                            title:'票券名称',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.text,
                                            options:[]
                                        },{
                                            title:'数量',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        },{
                                            title:'是否发送短信',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "amount" && action.groupId == 3){// 赠送票券/数量
                                    let actionItem = tabItem.content.find(item => item.title=='赠送票券').content[1];
                                    actionItem.key = action.key;
                                    actionItem.groupId = action.groupId;
                                    actionItem.value = action.value;
                                }else if(action.key == "isSendSms" && action.groupId == 3){// 赠送票券/是否发送短信
                                    let actionItem = tabItem.content.find(item => item.title=='赠送票券').content[2];
                                    actionItem.key = action.key;
                                    actionItem.groupId = action.groupId;
                                    actionItem.value = action.value == "send" ? '是':action.value == 'unsend' ? '否':'';
                                }
                            }
                            // 影票类
                            if(tabItem.key == "FilmTicketInfo"){
                                if(action.key == "modifyWay" && action.groupId == 15){// 修改单票售价/调价方式
                                    let value = '';
                                    if(action.value == "fixPrice"){
                                        value = "固定金额 ( 元 )";
                                    }else if(action.value == "discountPrice"){
                                        value = "零售价打折 ( % )";
                                    }else if(action.value == "subPrice"){
                                        value = "零售价-N ( 元 )";
                                    }else if(action.value == "addToLowestPrice"){
                                        value = "最低发行价±N元";
                                    }
                                    tabItem.content.push({
                                        title:'修改单票售价',
                                        content:[{
                                            title:'调价方式',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value,
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "modifyValue" && action.groupId == 15){// 修改单票售价/调整额
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    actionItem.content.push({
                                        title:'调整额',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value,
                                        options:[]
                                    })
                                    if(actionItem.content.find(item => item.title=='调价方式').value == "零售价打折 ( % )"){
                                        actionItem.content.push({
                                            title:'折扣后加减N元',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        },{
                                            title:'积分定价（分）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        },{
                                            title:'加金额（元）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        })
                                    }else{
                                        actionItem.content.push({
                                            title:'积分定价（分）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        },{
                                            title:'加金额（元）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "addAmountAfterDiscount" && action.groupId == 15){// 修改单票售价/折扣后加减N元
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    let actionConItem = actionItem.content.find(item => item.title=='折扣后加减N元');
                                    if(actionConItem){
                                        actionConItem.key = action.key;
                                        actionConItem.groupId = action.groupId;
                                        actionConItem.value = action.value;
                                    }
                                }else if(action.key == "integralAmount" && action.groupId == 15){// 修改单票售价/积分定价（分）
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    let actionConItem = actionItem.content.find(item => item.title=='积分定价（分）');
                                    actionConItem.key = action.key;
                                    actionConItem.groupId = action.groupId;
                                    actionConItem.value = action.value;
                                }else if(action.key == "integralMoney" && action.groupId == 15){// 修改单票售价/加金额（元）
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    let actionConItem = actionItem.content.find(item => item.title=='加金额（元）');
                                    actionConItem.key = action.key;
                                    actionConItem.groupId = action.groupId;
                                    actionConItem.value = action.value;
                                }else if(action.key == "decimalRoundMode" && action.groupId == 15){// 修改单票售价/折后取整方式
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    let value = '';
                                    if(action.value == "ROUND_HALF_UP"){
                                        value = "四舍五入";
                                    }else if(action.value == "ROUND_FLOOR"){
                                        value = "忽略小数取整";
                                    }else if(action.value == "ROUND_CEILING"){
                                        value = "小数进1取整";
                                    }else if(action.value == "ROUND_UNNECESSARY"){
                                        value = "保留小数";
                                    }
                                    actionItem.content.push({
                                        title:'折后取整方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "lessProcessMethod" && action.groupId == 15){// 修改单票售价/低于最低价时
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    let value = '';
                                    if(action.value == "notAllowSale"){
                                        value = "不允许出票";
                                    }else if(action.value == "cinemaPay"){
                                        value = "影院补贴";
                                    }else if(action.value == "clientPay"){
                                        value = "用户补贴";
                                    }
                                    actionItem.content.push({
                                        title:'低于最低价时',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "cinemaPayAmount" && action.groupId == 15){// 修改单票售价/最多补贴N元
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    if(actionItem.content.find(item => item.title=='低于最低价时').value == "影院补贴"){
                                        actionItem.content.push({
                                            title:'最多补贴N元',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                    
                                }else if(action.key == "modifyAmountMethod" && action.groupId == 15){// 修改单票售价/调价商品数量
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    let value = '';
                                    if(action.value == "appointAmount"){
                                        value = "指定数量";
                                    }else if(action.value == "all"){
                                        value = "该商品全部数量";
                                    }else if(action.value == "perMemberDay"){
                                        value = "每会员每日数量";
                                    }else if(action.value == "perMemberWeek"){
                                        value = "每会员每周数量";
                                    }else if(action.value == "perMemberMonth"){
                                        value = "每会员每月数量";
                                    }
                                    actionItem.content.push({
                                        title:'调价商品数量',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "modifyAmount" && action.groupId == 15){// 修改单票售价/数量
                                    let actionItem = tabItem.content.find(item => item.title=='修改单票售价');
                                    if(actionItem.content.find(item => item.title=='调价商品数量').value != "该商品全部数量"){
                                        actionItem.content.push({
                                            title:'数量',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "modifyWay" && action.groupId == 29){// 按座位等级修改票价/调价方式
                                    let value = '';
                                    if(action.value == "fixPrice"){
                                        value = "固定金额 ( 元 )";
                                    }else if(action.value == "discountPrice"){
                                        value = "零售价打折 ( % )";
                                    }else if(action.value == "subPrice"){
                                        value = "零售价-N ( 元 )";
                                    }else if(action.value == "addToLowestPrice"){
                                        value = "最低发行价±N元";
                                    }
                                    tabItem.content.push({
                                        title:'按座位等级修改票价',
                                        content:[{
                                            title:'调价方式',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value,
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "modifyValue" && action.groupId == 29){// 按座位等级修改票价/调整额
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    actionItem.content.push({
                                        title:'调整额',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value,
                                        options:[]
                                    })
                                    if(actionItem.content.find(item => item.title=='调价方式').value == "零售价打折 ( % )"){
                                        actionItem.content.push({
                                            title:'折扣后加减N元',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        },{
                                            title:'积分定价（分）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        },{
                                            title:'加金额（元）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        })
                                    }else{
                                        actionItem.content.push({
                                            title:'积分定价（分）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        },{
                                            title:'加金额（元）',
                                            key:"",
                                            groupId:"",
                                            opUniqueName:'',
                                            value:"",
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "addAmountAfterDiscount" && action.groupId == 29){// 按座位等级修改票价/折扣后加减N元
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    let actionConItem = actionItem.content.find(item => item.title=='折扣后加减N元');
                                    if(actionConItem){
                                        actionConItem.key = action.key;
                                        actionConItem.groupId = action.groupId;
                                        actionConItem.value = action.value;
                                    }
                                }else if(action.key == "integralAmount" && action.groupId == 29){// 按座位等级修改票价/积分定价（分）
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    let actionConItem = actionItem.content.find(item => item.title=='积分定价（分）');
                                    actionConItem.key = action.key;
                                    actionConItem.groupId = action.groupId;
                                    actionConItem.value = action.value;
                                }else if(action.key == "integralMoney" && action.groupId == 29){// 按座位等级修改票价/加金额（元）
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    let actionConItem = actionItem.content.find(item => item.title=='加金额（元）');
                                    actionConItem.key = action.key;
                                    actionConItem.groupId = action.groupId;
                                    actionConItem.value = action.value;
                                }else if(action.key == "decimalRoundMode" && action.groupId == 29){// 按座位等级修改票价/折后取整方式
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    let value = '';
                                    if(action.value == "ROUND_HALF_UP"){
                                        value = "四舍五入";
                                    }else if(action.value == "ROUND_FLOOR"){
                                        value = "忽略小数取整";
                                    }else if(action.value == "ROUND_CEILING"){
                                        value = "小数进1取整";
                                    }else if(action.value == "ROUND_UNNECESSARY"){
                                        value = "保留小数";
                                    }
                                    actionItem.content.push({
                                        title:'折后取整方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "lessProcessMethod" && action.groupId == 29){// 按座位等级修改票价/低于最低价时
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    let value = '';
                                    if(action.value == "notAllowSale"){
                                        value = "不允许出票";
                                    }else if(action.value == "cinemaPay"){
                                        value = "影院补贴";
                                    }else if(action.value == "clientPay"){
                                        value = "用户补贴";
                                    }
                                    actionItem.content.push({
                                        title:'低于最低价时',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "cinemaPayAmount" && action.groupId == 29){// 按座位等级修改票价/最多补贴N元
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    if(actionItem.content.find(item => item.title=='低于最低价时').value == "影院补贴"){
                                        actionItem.content.push({
                                            title:'最多补贴N元',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                    
                                }else if(action.key == "modifyAmountMethod" && action.groupId == 29){// 按座位等级修改票价/调价商品数量
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    let value = '';
                                    if(action.value == "appointAmount"){
                                        value = "指定数量";
                                    }else if(action.value == "all"){
                                        value = "该商品全部数量";
                                    }else if(action.value == "perMemberDay"){
                                        value = "每会员每日数量";
                                    }else if(action.value == "perMemberWeek"){
                                        value = "每会员每周数量";
                                    }else if(action.value == "perMemberMonth"){
                                        value = "每会员每月数量";
                                    }
                                    actionItem.content.push({
                                        title:'调价商品数量',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "modifyAmount" && action.groupId == 29){// 按座位等级修改票价/数量
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    if(actionItem.content.find(item => item.title=='调价商品数量').value != "该商品全部数量"){
                                        actionItem.content.push({
                                            title:'数量',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "seatGrade" && action.groupId == 29){// 按座位等级修改票价/座位等级
                                    let actionItem = tabItem.content.find(item => item.title=='按座位等级修改票价');
                                    actionItem.content.push({
                                        title:'座位等级',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value,
                                        options:[]
                                    })
                                }
                            }
                            // 交易类
                            if(tabItem.key == "SaleInfo"){
                                if(action.key == "merKey" && action.groupId == 11){// 赠送商品/商品
                                    tabItem.content.push({
                                        title:'赠送商品',
                                        content:[{
                                            title:'商品',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.text,
                                            options:[]
                                        },{
                                            title:'商品单价',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        },{
                                            title:'赠送数量',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "price" && action.groupId == 11){// 赠送商品/商品单价
                                    let actionItem = tabItem.content.find(item => item.title=='赠送商品').content[1];
                                    actionItem.key = action.key;
                                    actionItem.groupId = action.groupId;
                                    actionItem.value = action.value;
                                }else if(action.key == "amount" && action.groupId == 11){// 赠送商品/赠送数量
                                    let actionItem = tabItem.content.find(item => item.title=='赠送商品').content[2];
                                    actionItem.key = action.key;
                                    actionItem.groupId = action.groupId;
                                    actionItem.value = action.value;
                                }else if(action.key == "merKey" && action.groupId == 9){// 单品优惠价调整/商品
                                    tabItem.content.push({
                                        title:'单品优惠价调整',
                                        content:[{
                                            title:'商品',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.text,
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "modifyWay" && action.groupId == 9){// 单品优惠价调整/调价方式
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    let value = '';
                                    if(action.value == "fixPrice"){
                                        value = "固定金额 ( 元 )";
                                    }else if(action.value == "discountPrice"){
                                        value = "零售价打折 ( % )";
                                    }else if(action.value == "subPrice"){
                                        value = "零售价-N ( 元 )";
                                    }else if(action.value == "addToLowestPrice"){
                                        value = "最低发行价±N元";
                                    }
                                    actionItem.content.push({
                                        title:'调价方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "modifyValue" && action.groupId == 9){// 单品优惠价调整/调整额
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    actionItem.content.push({
                                        title:'调整额',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value,
                                        options:[]
                                    })
                                    if(actionItem.content.find(item => item.title=='调价方式').value == "零售价打折 ( % )"){
                                        actionItem.content.push({
                                            title:'折扣后加减N元',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        },{
                                            title:'积分定价（分）',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        },{
                                            title:'加金额（元）',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        })
                                    }else{
                                        actionItem.content.push({
                                            title:'积分定价（分）',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        },{
                                            title:'加金额（元）',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "addAmountAfterDiscount" && action.groupId == 9){// 单品优惠价调整/折扣后加减N元
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    let actionConItem = actionItem.content.find(item => item.title=="折扣后加减N元");
                                    if(actionConItem){
                                        actionConItem.key = action.key;
                                        actionConItem.groupId = action.groupId;
                                        actionConItem.value = action.value;
                                    }
                                }else if(action.key == "integralAmount" && action.groupId == 9){// 单品优惠价调整/积分定价（分）
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    let actionConItem = actionItem.content.find(item => item.title=='积分定价（分）');
                                    actionConItem.key = action.key;
                                    actionConItem.groupId = action.groupId;
                                    actionConItem.value = action.value;
                                }else if(action.key == "integralMoney" && action.groupId == 9){// 单品优惠价调整/加金额（元）
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    let actionConItem = actionItem.content.find(item => item.title=='加金额（元）');
                                    actionConItem.key = action.key;
                                    actionConItem.groupId = action.groupId;
                                    actionConItem.value = action.value;
                                }else if(action.key == "modifyAmountMethod" && action.groupId == 9){// 单品优惠价调整/调价商品数量
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    let value = '';
                                    if(action.value == "appointAmount"){
                                        value = "指定数量";
                                    }else if(action.value == "all"){
                                        value = "该商品全部数量";
                                    }else if(action.value == "perMemberDay"){
                                        value = "每会员每日数量";
                                    }else if(action.value == "perMemberWeek"){
                                        value = "每会员每周数量";
                                    }else if(action.value == "perMemberMonth"){
                                        value = "每会员每月数量";
                                    }
                                    actionItem.content.push({
                                        title:'调价商品数量',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "modifyAmount" && action.groupId == 9){// 单品优惠价调整/数量
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    if(actionItem.content.find(item => item.title=='调价商品数量').value != "该商品全部数量"){
                                        actionItem.content.push({
                                            title:'数量',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "decimalRoundMode" && action.groupId == 9){// 单品优惠价调整/折后取整方式
                                    let actionItem = tabItem.content.find(item => item.title=='单品优惠价调整');
                                    let value = '';
                                    if(action.value == "ROUND_HALF_UP"){
                                        value = "四舍五入";
                                    }else if(action.value == "ROUND_FLOOR"){
                                        value = "忽略小数取整";
                                    }else if(action.value == "ROUND_CEILING"){
                                        value = "小数进1取整";
                                    }else if(action.value == "ROUND_UNNECESSARY"){
                                        value = "保留小数";
                                    }
                                    actionItem.content.push({
                                        title:'折后取整方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value,
                                        options:[]
                                    })
                                }else if(action.key == "merKey" && action.groupId == 10){// 以优惠价格增加单品/商品
                                    tabItem.content.push({
                                        title:'以优惠价格增加单品',
                                        content:[{
                                            title:'商品',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.text,
                                            options:[]
                                        },{
                                            title:'商品单价',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        },{
                                            title:'增加数量',
                                            key:'',
                                            groupId:'',
                                            opUniqueName:'',
                                            value:'',
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "price" && action.groupId == 10){// 以优惠价格增加单品/商品单价
                                    let actionItem = tabItem.content.find(item => item.title=='以优惠价格增加单品').content[1];
                                    actionItem.key = action.key;
                                    actionItem.groupId = action.groupId;
                                    actionItem.value = action.value;
                                }else if(action.key == "amount" && action.groupId == 10){// 以优惠价格增加单品/增加数量
                                    let actionItem = tabItem.content.find(item => item.title=='以优惠价格增加单品').content[2];
                                    actionItem.key = action.key;
                                    actionItem.groupId = action.groupId;
                                    actionItem.value = action.value;
                                }else if(action.key == "merCategoryMethod" && action.groupId == 27){// 卖品分类优惠价调整/商品分类
                                    tabItem.content.push({
                                        title:'卖品分类优惠价调整',
                                        content:[{
                                            title:'商品分类',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value == "appointCategory" ? '指定分类' : action.value == "allMerCategory" ? '全部卖品分类' : '',
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "classCode" && action.groupId == 27){// 卖品分类优惠价调整/分类
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    if(actionItem.content.find(item => item.title=='商品分类').value == "指定分类"){
                                        actionItem.content.push({
                                            title:'分类',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.text,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "modifyWay" && action.groupId == 27){// 卖品分类优惠价调整/调价方式
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    actionItem.content.push({
                                        title:'调价方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value == "discountPrice" ? '零售价打折 ( % )' : action.value == "subPrice" ? '零售价-N ( 元 )' : '',
                                        options:[]
                                    })
                                }else if(action.key == "modifyValue" && action.groupId == 27){// 卖品分类优惠价调整/调价值
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    actionItem.content.push({
                                        title:'调价值',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value,
                                        options:[]
                                    })
                                }else if(action.key == "addAmountAfterDiscount" && action.groupId == 27){// 卖品分类优惠价调整/折扣后加减N元
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    if(actionItem.content.find(item => item.title=='调价方式').value == "零售价打折 ( % )"){
                                        actionItem.content.push({
                                            title:'折扣后加减N元',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "modifyAmountMethod" && action.groupId == 27){// 卖品分类优惠价调整/调价商品数量
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    let value = ''
                                    if(action.value == "appointAmount"){
                                        value = "指定数量"
                                    }else if(action.value == "all"){
                                        value = "该分类全部数量"
                                    }else if(action.value == "perMemberDay"){
                                        value = "每会员每日数量"
                                    }else if(action.value == "perMemberWeek"){
                                        value = "每会员每周数量"
                                    }else if(action.value == "perMemberMonth"){
                                        value = "每会员每月数量"
                                    }
                                    actionItem.content.push({
                                        title:'调价商品数量',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:value,
                                        options:[]
                                    })
                                }else if(action.key == "modifyAmount" && action.groupId == 27){// 卖品分类优惠价调整/数量
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    if(actionItem.content.find(item => item.title=='调价商品数量').value != "该分类全部数量"){
                                        actionItem.content.push({
                                            title:'数量',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "decimalRoundMode" && action.groupId == 27){// 卖品分类优惠价调整/折后取整方式
                                    let actionItem = tabItem.content.find(item => item.title=='卖品分类优惠价调整');
                                    let value = ''
                                    if(action.value == "ROUND_HALF_UP"){
                                        value = "四舍五入"
                                    }else if(action.value == "ROUND_FLOOR"){
                                        value = "忽略小数取整"
                                    }else if(action.value == "ROUND_CEILING"){
                                        value = "小数进1取整"
                                    }else if(action.value == "ROUND_UNNECESSARY"){
                                        value = "保留小数"
                                    }
                                    actionItem.content.push({
                                        title:'折后取整方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:value,
                                        options:[]
                                    })
                                }else if(action.key == "merBrandMethod" && action.groupId == 28){// 按品牌优惠价调整/商品品牌
                                    tabItem.content.push({
                                        title:'按品牌优惠价调整',
                                        content:[{
                                            title:'商品品牌',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value == "appointBrand" ? '指定品牌' : action.value == "allMerBrand" ? '全部品牌' : '',
                                            options:[]
                                        }]
                                    })
                                }else if(action.key == "brandId" && action.groupId == 28){// 按品牌优惠价调整/品牌
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    if(actionItem.content.find(item => item.title=='商品品牌').value == "指定品牌"){
                                        actionItem.content.push({
                                            title:'品牌',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.text,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "modifyWay" && action.groupId == 28){// 按品牌优惠价调整/调价方式
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    actionItem.content.push({
                                        title:'调价方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value == "discountPrice" ? '零售价打折 ( % )' : action.value == "subPrice" ? '零售价-N ( 元 )' : '',
                                        options:[]
                                    })
                                }else if(action.key == "modifyValue" && action.groupId == 28){// 按品牌优惠价调整/调价值
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    actionItem.content.push({
                                        title:'调价值',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:action.value,
                                        options:[]
                                    })
                                }else if(action.key == "addAmountAfterDiscount" && action.groupId == 28){// 按品牌优惠价调整/折扣后加减N元
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    if(actionItem.content.find(item => item.title=='调价方式').value == "零售价打折 ( % )"){
                                        actionItem.content.push({
                                            title:'折扣后加减N元',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "modifyAmountMethod" && action.groupId == 28){// 按品牌优惠价调整/调价商品数量
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    let value = ''
                                    if(action.value == "appointAmount"){
                                        value = "指定数量"
                                    }else if(action.value == "all"){
                                        value = "该分类全部数量"
                                    }else if(action.value == "perMemberDay"){
                                        value = "每会员每日数量"
                                    }else if(action.value == "perMemberWeek"){
                                        value = "每会员每周数量"
                                    }else if(action.value == "perMemberMonth"){
                                        value = "每会员每月数量"
                                    }
                                    actionItem.content.push({
                                        title:'调价商品数量',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:value,
                                        options:[]
                                    })
                                }else if(action.key == "modifyAmount" && action.groupId == 28){// 按品牌优惠价调整/数量
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    if(actionItem.content.find(item => item.title=='调价商品数量').value != "该分类全部数量"){
                                        actionItem.content.push({
                                            title:'数量',
                                            key:action.key,
                                            groupId:action.groupId,
                                            opUniqueName:'',
                                            value:action.value,
                                            options:[]
                                        })
                                    }
                                }else if(action.key == "decimalRoundMode" && action.groupId == 28){// 按品牌优惠价调整/折后取整方式
                                    let actionItem = tabItem.content.find(item => item.title=='按品牌优惠价调整');
                                    let value = ''
                                    if(action.value == "ROUND_HALF_UP"){
                                        value = "四舍五入"
                                    }else if(action.value == "ROUND_FLOOR"){
                                        value = "忽略小数取整"
                                    }else if(action.value == "ROUND_CEILING"){
                                        value = "小数进1取整"
                                    }else if(action.value == "ROUND_UNNECESSARY"){
                                        value = "保留小数"
                                    }
                                    actionItem.content.push({
                                        title:'折后取整方式',
                                        key:action.key,
                                        groupId:action.groupId,
                                        opUniqueName:'',
                                        value:value,
                                        options:[]
                                    })
                                }
                            }
                        }
                    }
                }
            }
        },
        returnList(){
            // 返回
            this.$store.commit("tagNav/removeTagNav", this.$route);
            this.$router.push({name:'自定义营销活动管理'});
        },
    },
    // 组件路由守卫
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if(!to.query.id){
                vm.$store.commit("tagNav/removeTagNav", vm.$route);
                next({name:'自定义营销活动管理'});
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
    .bigBtn {
        display: flex;
        flex-wrap: wrap;
        padding-left:50px; 
        .def-tag {
            background: #F2F4FD;
            width: 140px;
            height: 70px;
            margin: 0 10px 10px 0;
            text-align: center;
            padding: 15px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 12px;
            font-weight:bolder;
            color: #333333;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid #3B74FF;
            position: relative;
        }
    }
    .addGroupLeft{
        .el-collapse-item__header{
            padding-left: 50px;
            width: 968px;
            border-bottom: 1px solid #ebeef5;
            .el-collapse-item__arrow{
                margin-left: -132px;
            }
        }
    }
    .dialog{
        .el-collapse-item__arrow{
            margin-left: -120px !important;
        }
        .el-tabs__nav-scroll{
            height: 500px;
        }
        .el-tabs__content{
            overflow-y:auto !important;
            height: 500px;
        }
        font-weight: 0;
    }
}   
</style>