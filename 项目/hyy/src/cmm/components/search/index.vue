<template>
<div class="search-window">
    <el-form v-if="isShowForm" :inline="true" :model="baseConfig.form">
        <template v-for="(item,index) in baseConfig.system">
            <el-form-item :class="item.keyName" v-if="isShowLevelItem(item)" :key="index" :prop="item.keyName" :required="item.required" :label="item.name+':'" :rules="item.rules">
                <!-- 单个输入框 - 是否带唤起弹窗按钮-->
                <template v-if="item.type == 'input'">
                    <el-row class="flex-base">
                        <el-input class="input-type-166" v-if="!item.alertButton" :clearable="item.clearable" @clear="clearInputVal(item.keyName,item.alertButton)" :readonly="item.readonly" v-model="baseConfig.form[`${item.keyName}`]" :placeholder="item.placeholider"></el-input>
                        <template v-if="item.alertButton">
                            <el-input class="input-type-166 windowInput" :clearable="item.clearable" @clear="clearInputVal(item.keyName,item.alertButton)" readonly v-model="item.value" :placeholder="item.placeholider"></el-input>
                            <el-button class="windowBtn" type="primary callWindowBtn" plain @click="callWindow(item.alertCompontsName,item.keyName,item.isNeedReturn)">{{item.alertButtonText ? item.alertButtonText : '选择'}}</el-button>
                        </template>
                    </el-row>
                </template>
                <!-- 范围输入框 -->
                <template v-if="item.type == 'input-more'">
                    <el-row class="flex-base input-more">
                        <template v-for="(jtem,index) in item.options">
                            <el-form-item :key="index" :prop="jtem.prop" :label="jtem.name" :rules="jtem.rules">
                                <el-row class="flex-base input-row">
                                    <el-input class="input-type-166" v-model="baseConfig.form[`${jtem.keyName}`]"></el-input>
                                    <span class="line">-</span>
                                </el-row>
                            </el-form-item>
                        </template>
                    </el-row>
                </template>
                <!-- 选择框 -->
                <template v-if="item.type == 'select'">
                    <el-select class="input-type-166" style="width:192px;" v-model="baseConfig.form[`${item.keyName}`]" :placeholder="item.placeholder ? item.placeholder : '请选择'" :multiple="item.multiple" :multiple-limit="item.multipleLimit">
                        <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </template>
                <!-- 日期选择 -->
                <template v-if="item.type == 'date-picker'">
                    <el-date-picker value-format="yyyy-MM-dd"  v-model="baseConfig.form[`${item.keyName}`]" :type="item.dateType ? item.dateType : 'daterange'" :placeholder="item.placeholder ? item.placeholder : '选择日期'" :range-separator="item.rangeSeparator ? item.rangeSeparator : '至'" :start-placeholder="item.startPlaceholder ? item.startPlaceholder : 'yyyy-MM-dd'" :end-placeholder="item.endPlaceholder ? item.endPlaceholder : 'yyyy-MM-dd'"></el-date-picker>
                </template>
            </el-form-item>
        </template>
        <el-form-item class="btn-group">
            <el-row class="flex-base" :class="{'isTicketManagement': modelName == 'salesManagement'}">
                <el-button class="searchBtn" type="primary" @click="emitSearch">查询</el-button>
                <el-button class="searchBtn" style="border-color:#3b74ff;color:#3b74ff;margin-left:8px;" @click="emitReset">重置</el-button>
                <el-button type="text" v-if="searchLevelButton" @click="changeSearchType">高级查询<i class="el-icon--right" :class="{'el-icon-arrow-down': !isShowHightLevel, 'el-icon-arrow-up': isShowHightLevel}"></i></el-button>
            </el-row>
        </el-form-item>
    </el-form>
    <!-- 弹窗 -->
    <section class="alert-group">
        <!-- 选择组织结构 -->
        <orgStructureDialog
            :title="orgStructureDialog.title" 
            :dialogTableVisible.sync="orgStructureDialog.orgStructureDialogVisible" 
            ref="orgStructureDialog"
            @callBack="handleOrgStructureBack"
        >
        </orgStructureDialog>
        <!-- 选择影院 -->
        <cinemaDialog
            :title="cinemaDialog.title" 
            :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" 
            ref="cinemaDialog"
            @callBack="handleCinemaBack"
        >
        </cinemaDialog>
        <!-- 选择审批人 -->
        <userDialog
            :title="userApprovalDialog.title" 
            :dialogTableVisible.sync="userApprovalDialog.userApprovalDialogVisible" 
            ref="userApprovalDialog"
            @callBack="handleUserApprovalBack"
        >
        </userDialog>
        <!-- 选择创建人 -->
        <userDialog
            :title="userCreaterDialog.title" 
            :dialogTableVisible.sync="userCreaterDialog.userCreaterDialogVisible" 
            ref="userCreaterDialog"
            @callBack="handleUserCreaterBack"
        >
        </userDialog>
        
    </section>
</div>
</template>

<script>
// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import searchAlertHandle from 'cmm/mixins/marketing/searchAlertHandle.js';
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
export default {
    components: {},
    // mixins: [searchAlertHandle,minxins.cacheMixin],
    mixins: [searchAlertHandle],
    props: {
        config: {
            required: true,
            type: Array
        },
        modelName: {
            type: String
        },
        searchLevelButton: {
            type: Boolean,
            default: false
        },
        isCache:{
            default: true
        }
    },
    data() {
        return {
            /* 缓存数据 */
            // cacheField: ["baseConfig"],
            /* 基本配置 */
            isShowForm: false,
            aaa:{},
            baseConfig: {
                form: {},
                system: [{
                    name: '',
                    keyName: '',
                    type: '',
                    value: '',
                    placeholder: '',
                    rules: []
                }]
            },
            /* 唤起弹窗后,需填入输入框的名 */
            currentInputName: '',
            /* 是否显示高级检索内容 */
            isShowHightLevel: false,
            /* 此处监听数据变化 */
            watchDataChange: null,
        }
    },
    created() {
        this.init();
    },
    mounted(){
        if(!this.isCache){
            this.baseConfig.form = {}
        }
    },
    methods: {
        init(){
            /* 根据输入config 构建form */
            let form = {};
            let system = {}
               system = JSON.parse(JSON.stringify(this.config));
            try {
                for (let i = 0; i < system.length; i++) {
                    let item = system[i];
                    let isMore = item.type == 'input-more' ? true : false;
                    if (isMore) {
                        let options = item.options;
                        for (let j = 0; j < options.length; j++) {
                            let jtem = options[j];
                            if (!form[`${jtem.keyName}`]) {
                                form[`${jtem.keyName}`] = jtem.value ? jtem.value : '';
                            } else {
                                throw new Error('在传入config渲染搜索框时,请确保keyName的值为唯一');
                            }
                        }
                    } else {
                        if (!form[`${item.keyName}`]) {
                            form[`${item.keyName}`] = item.value ? item.value : '';
                        } else {
                            throw new Error('在传入config渲染搜索框时,请确保keyName的值为唯一');
                        }
                    }
                }
            } catch (msg) {
                console.log(msg);
            }
            // 实时将数据变化返回
            this.watchDataChange = this.$watch('baseConfig', (new_val, old_val) => {
                this.$emit('searchValueChange', new_val);
            }, {
                deep: true
            })
            /*------star--------*/
            let _form = this.baseConfig.form
            let cacheForm = false
            for(var item of Object.keys(_form)){
                console.log(item)
                if(typeof(_form[item])=='object'){
                    if(_form[item].text !=''){
                        console.log(_form[item])
                        console.log(`有值的项${item}:`,_form[item].text)
                        cacheForm = true
                    }
                }else if(typeof(_form[item])=='string'){
                    if(_form[item] !=''){
                        console.log(`有值的项${item}:`,_form[item])
                        cacheForm = true
                    }
                }
            }
            if(cacheForm) {
                form = _form
            }
            /*-----end---------*/
            this.baseConfig = {
                form,
                system
            }
            this.isShowForm = true;
            
        },
        /**
         * @function callWindow - 唤起弹窗
         * @param {Boolean} isNeedReturn - 是否需要回传参数给弹窗
         */
        callWindow(alertCompontsName, keyName, isNeedReturn) {
            this.currentInputName = keyName;
            let param = {}
            if (isNeedReturn) {
                param[`data`] = this.baseConfig.form[`${keyName}`];
            }
            // 触发弹窗
            try {
                if (typeof alertCompontsName != 'string' || alertCompontsName == '') {
                    throw new TypeError(`请在alertCompontsName传入非空字符串`);
                }

                let fnName = this.altertKeysFn[`${alertCompontsName}`];
                if (fnName) {
                    let fn = this[`${fnName}`];
                    if (typeof fn == 'function') {
                        fn();
                    } else {
                        throw new TypeError(`mixin:searchAlertHandle方法中不存在${alertCompontsName}所对应的方法，无法执行`);
                    }
                } else {
                    throw new TypeError(`mixin:searchAlertHandle方法中不存在${alertCompontsName}所对应的配置方法，无法执行`);
                }
            } catch (msg) {
                console.log(msg);
            }
        },
        /**
         * @function changeInputValue - 弹窗回调 修改对应输入框
         */
        changeInputValue(param) {
            let isCancle = param.isCancle;
            if (isCancle) {
                this.currentInputName = '';
                return;
            }

            let currentInputName = this.currentInputName;
            // 传给后台的id 用于前端显示的text
            this.baseConfig.form[`${currentInputName}`] = {
                text: param.data,
                value: param.data
            };
            let inputItem = this.baseConfig.form[`${currentInputName}`];
            if (typeof inputItem == 'object') {
                inputItem = {
                    text: param.text,
                    value: param.data
                }
            } else {
                inputItem = {
                    value: param.data
                };
            }

            this.currentInputName = '';
        },
        /**
         * @function emitSearch - 回传事件给父层
         */
        emitSearch() {
            let param = this.baseConfig.form;
            this.$emit('pressSearch', param)
        },
        /**
         * @function emitReset - 重置查询内容
         */
        emitReset(){
            let form = {};
            let system = JSON.parse(JSON.stringify(this.config));
            console.log(system)
            for(let item of system){
                if(!item.options){
                    form[item.keyName] = "";
                    item.value = "";
                }else{
                    form[item.keyName] = item.options[0].value;
                    item.value = item.options[0].value;
                }
            }
            this.baseConfig.form = form;
            this.baseConfig.system = system;
        },
        /**
         * @function changeSearchType - 修改查询规则 高级/低级
         */
        changeSearchType() {
            this.isShowHightLevel = !this.isShowHightLevel;
        },
        /**
         * @function isShowLevelItem - 是否显示高级输入栏
         */
        isShowLevelItem(item) {
            let isShow = true;
            let isShowHightLevel = this.isShowHightLevel;
            if (item.level && !isShowHightLevel) {
                isShow = false;
            }
            return isShow;
        },
        /**
         * @function clearInputVal - 清空输入框的值
         * @param {String} keyName - 输入框key
         * @param {Boolean} isAlert - 是否为弹框清除，如果是需要同时清除text和value 否在只清除value
         */
        clearInputVal(keyName, isAlert) {
            try {
                let isExist = this.baseConfig.form[`${keyName}`];
                if (isExist) {
                    if (isAlert) {
                        this.baseConfig.form[`${keyName}`] = {
                            text: '',
                            value: ''
                        }
                    } else {
                        this.baseConfig.form[`${keyName}`] = '';
                    }
                } else {
                    throw new Error(`搜索栏中不存在${keyName}`);
                }
            } catch (msg) {
                console.log(msg);
            }

        }
    },
    destroyed() {
        this.watchDataChange();
    }
}
</script>

<style lang="scss" scoped>
// .flex-base {
//     display: flex;
//     display: -webkit-flex;
//     align-content: center;
//     justify-content: center;
// }

/deep/.search-window {
    overflow: hidden;
    font-size: 12px;
    background: #F3F3F3;
    padding: 24px;
    .windowBtn{
        width: 80px;
        padding-left: 0;
        padding-right: 0;
        height: 32px;
        font-size: 12px;
        margin-left: 10px;
        position: relative;
        top: 1px;
    }
    .searchBtn{
        width: 80px;
        padding-left: 0;
        padding-right: 0;
        height: 32px;
        font-size: 12px;
        position: relative;
        top: 4px;
    }
    .el-form-item{
        margin-right: 32px;
        margin-bottom:0px; 
    }
    .searchActivityName{
        .el-input{
            width: 192px;
        }
    }
    .validDate{
        .el-range-input{
            font-size: 12px;
            color: #666666;
            position: relative;
            left: -18px;
        }
        .el-range-separator{
            width:50px;
            font-size: 12px;
            color: #666666;
            position: relative;
            left: -18px;
        }
        .el-form-item__label{
            padding-right: 16px;
        }
        .el-date-editor{
            position: relative;
            top: 4px;
            width: 256px;
            .el-range__close-icon{
                position: relative;
                left: -18px;
            }
            .el-range__icon{
                position: relative;
                left: 218px;
            }
        }
    }
    .searchCreaterId{
        .el-form-item__label{
            padding-right: 16px;
        }
        .el-input{
            width: 192px;
        }
    }
    .searchApprovalmanId{
        .el-form-item__label{
            padding-right: 16px;
        }
        .el-input{
            width: 192px;
        }
    }
    .searchCreaterArea,.searchBusinessCode{
        .el-input{
            width: 192px;
        }
    }
    .windowInput{
        input{
            background: #f5f5f5;
        }
    }
    .el-form-item__label,.el-form-item__content,.el-input__inner {
        color: #666666;
        font-size: 12px !important;
    }
    .btn-group{
        // float: right;
        margin-right:8px; 
    }
    .el-form-item__label{
        padding-right:16px;
    }
    .el-form-item__content{
        height: 40px;
    }
    
}
.el-select-dropdown__item{
    font-size: 12px !important;
    color: #666666;
}
.selected{
    color: #3B74FF;
}
// /* 范围输入框 */
.input-more {
    .input-row {
        .line {
            margin: 0 3px;
        }

    }
    .el-form-item {
        margin-right: unset;
    }

    .el-form-item:nth-last-of-type(1) {
        margin-right: 10px;

        .line {
            display: none;
        }
    }

}
</style>
