<template>
<div class="mod-user">
    <div v-if="pageShow=='actList'">
        <!-- 搜索栏 -->
        <section>
            <!-- <searchLan :modelName="modelName" :config="searchConfig" :isCache="isCache" @pressSearch="search" @searchValueChange="setSearch"></searchLan> -->
            <el-form :inline="true" :model="searchHeaderFormData" ref="searchHeaderFormData" class="cmm_search-header">
                <el-form-item label="活动名称：" label-width="72px">
                    <el-input v-model="searchHeaderFormData.searchActivityName" @blur="()=>{searchHeaderFormData.searchActivityName = searchHeaderFormData.searchActivityName.trim();}" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="有效期：" label-width="60px">
                    <el-date-picker v-model="searchHeaderFormData.validDate" value-format="yyyy-MM-dd" type="daterange" placeholder="选择日期" range-separator="至" start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="创建人：" label-width="60px">
                    <el-input class="input-dialog" v-model="searchHeaderFormData.searchCreaterId" @blur="()=>{searchHeaderFormData.searchCreaterId = searchHeaderFormData.searchCreaterId.trim();}" placeholder="请选择" readonly></el-input>
                    <i class="el-icon-close close-btn" @click="clearInputValue('searchCreaterId')" v-show="searchHeaderFormData.searchCreaterId"></i>
                    <el-button type="primary" class="dialogBtn" @click="userCreaterClick({value:searchHeaderDialogData.searchCreaterId,text:searchHeaderFormData.searchCreaterId})" plain>选择</el-button>
                </el-form-item>
                <el-form-item label="创建单位：" label-width="72px">
                    <el-input class="input-dialog" v-model="searchHeaderFormData.searchCreaterArea" @blur="()=>{searchHeaderFormData.searchCreaterArea = searchHeaderFormData.searchCreaterArea.trim();}" placeholder="请选择" readonly></el-input>
                    <i class="el-icon-close close-btn" @click="clearInputValue('searchCreaterArea')" v-show="searchHeaderFormData.searchCreaterArea"></i>
                    <el-button type="primary" class="dialogBtn" @click="orgStructureClick({value:searchHeaderDialogData.searchCreaterArea})" plain>选择</el-button>
                </el-form-item>
                <el-form-item label="审批人：" label-width="60px">
                    <el-input class="input-dialog" v-model="searchHeaderFormData.searchApprovalmanId" @blur="()=>{searchHeaderFormData.searchApprovalmanId = searchHeaderFormData.searchApprovalmanId.trim();}" placeholder="请选择" readonly></el-input>
                    <i class="el-icon-close close-btn" @click="clearInputValue('searchApprovalmanId')" v-show="searchHeaderFormData.searchApprovalmanId"></i>
                    <el-button type="primary" class="dialogBtn" @click="userApprovalClick({value:searchHeaderDialogData.searchApprovalmanId,text:searchHeaderFormData.searchApprovalmanId})" plain>选择</el-button>
                </el-form-item>
                <el-form-item label="适用影院：" label-width="72px">
                    <el-input class="input-dialog" v-model="searchHeaderFormData.searchBusinessCode" @blur="()=>{searchHeaderFormData.searchBusinessCode = searchHeaderFormData.searchBusinessCode.trim();}" placeholder="请选择" readonly></el-input>
                    <i class="el-icon-close close-btn" @click="clearInputValue('searchBusinessCode')" v-show="searchHeaderFormData.searchBusinessCode"></i>
                    <el-button type="primary" class="dialogBtn" @click="cinemaClick({value:searchHeaderDialogData.searchBusinessCode,text:searchHeaderFormData.searchBusinessCode})" plain>选择</el-button>
                </el-form-item>
                <el-form-item label="执行策略：" label-width="72px">
                    <el-select v-model="searchHeaderFormData.executeMode" placeholder="请选择">
                        <el-option v-for="item in executeModeOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="活动状态：" label-width="72px">
                    <el-select v-model="searchHeaderFormData.searchState" placeholder="请选择">
                        <el-option v-for="item in searchStateOptions" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="btn-wrap">
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button @click="resetForm()" plain >重置</el-button>
                </el-form-item>
            </el-form>
        </section>

        <!-- 按钮组 -->
        <section class="flex-base flex-end">
            <el-row>
                <el-button class="addBtn" @click="addAct">新建</el-button>
            </el-row>
        </section>

        <!-- 表格 -->
        <section>
            <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
        </section>

        <!-- 分页 -->
        <section class="flex-base flex-center pageStyle">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" background layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
            </el-pagination>
        </section>

        <el-dialog title="停用/启用活动" width="40%" :close-on-click-modal="false" :visible.sync="startOrStopShow" append-to-body>
            <div style="margin-left: 60px; font-weight: 600;">请确认是否{{status==0?'停用':'启用'}}该营销活动?</div>
            <el-form :model="startOrStopForm" :rules="startOrStopRule" ref="startOrStopForm">
                <el-form-item label="备注" prop="remark">
                    <el-input style="width:80%;" type="textarea" v-model="startOrStopForm.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="startOrStopSubmit()">确定</el-button>
          <el-button @click="startOrStopShow = false">取消</el-button>
        </span>
        </el-dialog>
    </div>
    <!-- 查询头弹窗 -->
        <!-- 选择组织结构 -->
        <orgStructureDialog :title="orgStructureDialog.title" :dialogTableVisible.sync="orgStructureDialog.orgStructureDialogVisible" ref="orgStructureDialog" @callBack="handleOrgStructureBack"></orgStructureDialog>
        <!-- 选择影院 -->
        <cinemaDialog :title="cinemaDialog.title" :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" ref="cinemaDialog" @callBack="handleCinemaBack"></cinemaDialog>
        <!-- 选择审批人 -->
        <userDialog :title="userApprovalDialog.title" :dialogTableVisible.sync="userApprovalDialog.userApprovalDialogVisible" ref="userApprovalDialog" @callBack="handleUserApprovalBack"></userDialog>
        <!-- 选择创建人 -->
        <userDialog :title="userCreaterDialog.title" :dialogTableVisible.sync="userCreaterDialog.userCreaterDialogVisible" ref="userCreaterDialog" @callBack="handleUserCreaterBack"></userDialog>
    <!-- 列表弹窗 -->
        <!-- 查看审批单弹窗 -->
        <approvalDialog v-if="showApproval"  ref="approvalDialog" :bizNo="bizNo" :dialogFormVisible="showApproval" @close="approvalDetailClose"></approvalDialog>
    <!-- 打开新建、编辑页 -->
    <add-user-defined v-if="pageShow=='addAct'" ref="addOrUpdate" @refreshDataList="handleRefreshDataList"></add-user-defined>
</div>
</template>

<script>
import AddUserDefined from './add-or-update';
import searchLan from '../../../components/search/index.vue';
import commonTable from '../../../components/Table/commonTable.vue';

import approvalDialog from '../../../dialogs/approval/approvalDialog.vue';
import minxins from 'frame_cpm/mixins/cacheMixin.js'
// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import searchAlertHandle from 'cmm/mixins/marketing/searchAlertHandle.js';
export default {
    components: {
        AddUserDefined,
        searchLan,
        commonTable,
        approvalDialog
    },
    mixins: [searchAlertHandle,minxins.cacheMixin],
    data() {
        return {
            //缓存对象数据
            cacheField: ["pageConfig","searchHeaderFormData","searchHeaderDialogData"],
            subComName:"userDefinedActivity",//缓存数据唯一标识
            bizNo:"",//审批单业务编码
            showApproval:false,//是否显示查看审批单弹窗
            tenantId:JSON.parse(localStorage.getItem('user')).consumerId,  //租户id
            modelName: "movieTicketManagement",
            isCache:true,
            pageShow: 'actList',
            //查询头
            searchHeaderFormData:{
                searchActivityName:"",//活动名称
                validDate:"",//有效期
                searchCreaterId: "",//创建人
                searchCreaterArea: "",//创建单位
                searchApprovalmanId: "",//审批人
                searchBusinessCode: "",//适用影院
                executeMode: "",//执行策略
                searchState: "",//活动状态
                pageNo: 1,
                pageSize: 10,
                ruleTemplateId: "33",//模板id
                searchValidDateEnd: "",//有效期开始时间
                searchValidDateStart: "",//有效期结束时间
                tenantId: JSON.parse(localStorage.getItem('user')).consumerId,  //租户id
            },
            //查询头-弹窗值
            searchHeaderDialogData:{
                searchCreaterId:"", //创建人
                searchCreaterArea:"", //创建单位
                searchApprovalmanId:"", //审批人
                searchBusinessCode:"", //适用影院
            },
            //执行策略-选项列表
            executeModeOptions:[
                { label: '全部', value: '' }, 
                { label: '自动', value: 'AUTO_MATCH' }, 
                { label: '推荐', value: 'AUTO_MATCH_RECOMMEND' }
            ],
            //活动状态-选项列表
            searchStateOptions:[
                { label: '全部', value: '' }, 
                { label: '新建', value: '1' }, 
                { label: '锁定', value: '2' },
                { label: '执行中', value: '3' },
                { label: '暂停', value: '4' },
                { label: '作废', value: '5' }
            ],
            searchConfig: [{
                    keyName: 'searchActivityName',
                    name: '活动名称',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'validDate',
                    name: '有效期',
                    type: 'date-picker',
                    dateType: 'daterange',
                    value: ''
                }, {
                    keyName: 'searchCreaterId',
                    name: '创建人',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'userCreaterDialog',
                }, {
                    keyName: 'searchCreaterArea',
                    name: '创建单位',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'orgStructureDialog',
                }, {
                    keyName: 'searchApprovalmanId',
                    name: '审批人',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'userApprovalDialog',
                }, {
                    keyName: 'searchBusinessCode',
                    name: '适用影院',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'cinemaDialog',
                }, {
                    keyName: 'executeMode',
                    name: '执行策略',
                    type: 'select',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '自动',
                        value: 'AUTO_MATCH'
                    }, {
                        label: '推荐',
                        value: 'AUTO_MATCH_RECOMMEND'
                    }]
                },
                {
                    keyName: 'searchState',
                    name: '活动状态',
                    type: 'select',
                    value: '',
                    options: [{
                            label: '全部',
                            value: ''
                        }, {
                            label: '新建',
                            value: '1'
                        }, {
                            label: '锁定',
                            value: '2'
                        },
                        {
                            label: '执行中',
                            value: '3'
                        },
                        {
                            label: '暂停',
                            value: '4'
                        }, {
                            label: '作废',
                            value: '5'
                        }
                    ]
                },
            ],
            searchParam: {},
            //分页配置
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            },
            tableData: [],
            tableLabels: [{
                    prop: 'activityCode',
                    label: '活动编码',
                    width: '150'
                },
                {
                    prop: 'activityName',
                    label: '活动名称',
                    width: '150'
                },
                {
                    prop: 'executeMode',
                    label: '执行策略',
                    width: '70',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return scope.row.executeMode == "AUTO_MATCH" ? '自动' : '推荐';
                    }
                },
                {
                    prop: 'priority',
                    label: '优先级',
                    // width: '110'
                },
                {
                    prop: 'validDateStart',
                    label: '有效期',
                    width: '100',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return scope.row.validDateStart ? scope.row.validDateStart + " 至 " + scope.row.validDateEnd : '';
                    }
                },
                {
                    prop: 'createrName',
                    label: '创建人',
                    // width: '100'
                },
                {
                    prop: 'orgName',
                    label: '创建单位',
                    // width: '150'
                },
                {
                    prop: 'createTime',
                    label: '创建日期',
                    width: '90'
                },
                {
                    prop: 'approvalmanName',
                    label: '审批人',
                    // width: '100'
                },
                {
                    prop: 'approvalResult',
                    label: '审批状态',
                    // width: '100',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        switch (scope.row.approvalResult) {
                            case 1:
                                return '未提交';
                                break;
                            case 2:
                                return '未审批';
                                break;
                            case 3:
                                return '审批通过';
                                break;
                            case 4:
                                return '审批不通过';
                                break;
                            case 5:
                                return '迁移';//临时状态
                                break;
                            default:
                                return '';
                                break;
                        };
                    }
                },
                {
                    prop: 'activityState',
                    label: '活动状态',
                    width: '70',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        switch (scope.row.activityState) {
                            case 1:
                                return '新建';
                                break;
                            case 2:
                                return '锁定';
                                break;
                            case 3:
                                return '执行中';
                                break;
                            case 4:
                                return '暂停';
                                break;
                            case 5:
                                return '作废';
                                break;
                            default:
                                return '';
                                break;
                        };
                    }
                },
            ],
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '200',
                options: [{
                        text: "查看",
                        method: "actDetail",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }else{
                                return true;
                            }
                        }
                    },
                    {
                        text: "修订",
                        method: "reviseAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return scope.row.approvalResult == 3 && (scope.row.activityState == 3 || scope.row.activityState == 4)
                        }
                    },
                    {
                        text: "修改",
                        method: "updateAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return scope.row.activityState == 1 && (scope.row.approvalResult == 1 || scope.row.approvalResult == 4)
                        }
                    },
                    {
                        text: "复制",
                        method: "copyAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return true
                            }
                            else if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }else{
                                return true;
                            }
                        }
                    },
                    {
                        text: "作废",
                        method: "cancelAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return (scope.row.approvalResult == 3 && (scope.row.activityState == 3 || scope.row.activityState == 4))
                            ||(scope.row.approvalResult == 4 && scope.row.activityState == 1)
                        }
                    },
                    {
                        text: "删除",
                        method: "removeAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return scope.row.activityState == 1 && scope.row.approvalResult == 1
                        }
                    },
                   
                    {
                        text: "启用",
                        method: "openAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return scope.row.approvalResult == 3 && scope.row.activityState == 4;
                        }
                    },
                    {
                        text: "停用",
                        method: "closeAct",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return scope.row.approvalResult == 3 && scope.row.activityState == 3;
                        }
                    },
                    {
                        text: "提交审批",
                        method: "submitApproval",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return scope.row.activityState == 1 && (scope.row.approvalResult == 1 || scope.row.approvalResult == 4)
                        }
                    },
                    {
                        text: "查看审批单",
                        method: "approvalDetail",
                        condition: (scope) => {
                            //临时状态（scope.row.approvalResult == 5 处理迁移数据）
                            if(scope.row.approvalResult == 5){
                                return false
                            }
                            if(scope.row.activityCode.indexOf("MEB") != -1){
                                return false
                            }
                            return ( scope.row.approvalResult == 2 && scope.row.activityState == 2)
                            ||(scope.row.approvalResult == 3 && (scope.row.activityState == 3 || scope.row.activityState == 4))
                            ||(scope.row.approvalResult == 4 && scope.row.activityState == 1)
                        }
                    },
                ]
            },

            startOrStopShow: false,
            status: 0,
            stopOrStartId: '',
            startOrStopForm: {
                remark: ''
            },
            startOrStopRule: {
                remark: [{
                    required: true,
                    message: '备注不能为空',
                    trigger: 'blur'
                }]
            },
            param:''
        }
    },
    created() {
        this.handleSearch();
    },
    methods: {
        //子组件返回新建、编辑、复制成功结果
        handleRefreshDataList(status){
            console.log("status",status)
            if(status!=false){
                this.resetCacheInit()
            }
            this.handleSearch()
        },
        //缓存数据初始化
        resetCacheInit(){
            //重置查询头数据
            this.resetForm()
            //重置分页配置
            this.pageConfig = {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            }
        },
        //查询
        handleSearch(){
            console.log(this.searchHeaderFormData)
            console.log(this.searchHeaderDialogData)
            
            if(this.searchHeaderFormData.validDate && this.searchHeaderFormData.validDate.length!=0){
                this.searchHeaderFormData.searchValidDateStart=this.searchHeaderFormData.validDate[0]
                this.searchHeaderFormData.searchValidDateEnd=this.searchHeaderFormData.validDate[1]
            }else{
                this.searchHeaderFormData.validDate=""
                this.searchHeaderFormData.searchValidDateStart=""
                this.searchHeaderFormData.searchValidDateEnd=""
            }
           
            let params={
                searchActivityName:this.searchHeaderFormData.searchActivityName,//活动名称
                validDate:this.searchHeaderFormData.validDate,//有效期
                searchCreaterId: this.searchHeaderDialogData.searchCreaterId,//创建人
                searchCreaterArea: this.searchHeaderDialogData.searchCreaterArea,//创建单位
                searchApprovalmanId: this.searchHeaderDialogData.searchApprovalmanId,//审批人
                searchBusinessCode:this.searchHeaderDialogData.searchBusinessCode,//适用影院
                executeMode: this.searchHeaderFormData.executeMode,//执行策略
                searchState: this.searchHeaderFormData.searchState,//活动状态
                pageNo: this.pageConfig.currentPage || 1,
                pageSize: this.pageConfig.pageSize || 10,
                ruleTemplateId: this.searchHeaderFormData.ruleTemplateId || "33",//模板id
                searchValidDateEnd: this.searchHeaderFormData.searchValidDateEnd,//有效期开始时间
                searchValidDateStart: this.searchHeaderFormData.searchValidDateStart,//有效期结束时间
                tenantId: this.tenantId,  //租户id
            }
            this.getDataList(params);
        },
        //清除弹窗显示内容
        clearInputValue(key){
            this.searchHeaderDialogData[key]=""
            this.searchHeaderFormData[key]=""
        },
        //重置
        resetForm(){
            //查询头
            this.searchHeaderFormData={
                searchActivityName:"",//活动名称
                validDate:"",//有效期
                searchCreaterId: "",//创建人
                searchCreaterArea: "",//创建单位
                searchApprovalmanId: "",//审批人
                searchBusinessCode: "",//适用影院
                executeMode: "",//执行策略
                searchState: "",//活动状态
                pageNo: 1,
                pageSize: 10,
                ruleTemplateId: "33",//模板id
                searchValidDateEnd: "",//有效期开始时间
                searchValidDateStart: "",//有效期结束时间
                tenantId: this.tenantId,  //租户id
            }
            //查询头-弹窗值
            this.searchHeaderDialogData={
                searchCreaterId:"", //创建人
                searchCreaterArea:"", //创建单位
                searchApprovalmanId:"", //审批人
                searchBusinessCode:"", //适用影院
            }
        },
        /* @function search - 搜索
         */
        search() {
            // if(bool == true){
            //     this.isCache = false;
            //     this.pageConfig.currentPage = 1;
            //     this.pageConfig.pageSize = 10;
            //     this.searchParam = {
            //         searchActivityName:"",
            //         validDate:"",
            //         searchCreaterId:"",
            //         searchCreaterArea:"",
            //         searchApprovalmanId:"",
            //         searchBusinessCode:"",
            //         executeMode:"",
            //         ruleTemplateId:"",
            //         searchState:""
            //     };
            // }
            // this.param = this.setParam();
            // this.getDataList(this.param);
            this.pageConfig.currentPage = 1;
            this.handleSearch()
        },

        setParam() {
            let exitsSearhParam = JSON.stringify(this.searchParam) != '{}' ? true : false;
            let params = {};
            let pageData = {
                tenantId: this.tenantId, //商户id
                ruleTemplateId: this.searchParam.ruleTemplateId ? this.searchParam.ruleTemplateId : '33',
                pageNo: this.pageConfig.currentPage,
                pageSize: this.pageConfig.pageSize,
                searchValidDateStart: '',
                searchValidDateEnd: ''
            }
            if (exitsSearhParam) {
                if (this.searchParam.validDate) {
                    pageData.searchValidDateStart = this.searchParam.validDate[0];
                    pageData.searchValidDateEnd = this.searchParam.validDate[1];
                }
                if (this.searchParam.ruleTemplateId == "") {
                    this.searchParam.ruleTemplateId = pageData.ruleTemplateId;
                }
                params = Object.assign(pageData, this.searchParam);
            } else {
                params = pageData;
            }
            return params;
        },

        /**
         * @function setSearch - 修改搜索栏数据
         * 
         */
        setSearch(param) {
            this.searchParam = param.form;
            for(let item of this.searchConfig){
                if(item.keyName == 'searchActivityName'){
                    item.value = this.searchParam.searchActivityName
                }else if(item.keyName == 'validDate'){
                    item.value = this.searchParam.validDate
                }else if(item.keyName == 'searchCreaterId'){
                    item.value = param.system.find(item=>item.keyName == 'searchCreaterId').value
                }else if(item.keyName == 'searchCreaterArea'){
                    item.value = param.system.find(item=>item.keyName == 'searchCreaterArea').value
                }else if(item.keyName == 'searchApprovalmanId'){
                    item.value = param.system.find(item=>item.keyName == 'searchApprovalmanId').value
                }else if(item.keyName == 'searchBusinessCode'){
                    item.value = param.system.find(item=>item.keyName == 'searchBusinessCode').value
                }else if(item.keyName == 'executeMode'){
                    item.value = this.searchParam.executeMode
                }else if(item.keyName == 'searchState'){
                    item.value = this.searchParam.searchState
                }
            }
            this.pageConfig.currentPage = 1; //改变搜索条件，从第一页开始查询
        },

        // 获取数据列表
        getDataList(params) {
            this.pageShow = 'actList'
            this.$cmmList.marketingList(params).then(data => {
                if (data && data.code === 200) {
                    console.log("result",data.data.result)
                    if(data.data.result.length <= 0 && params.pageNo > 1){
                        params.pageNo--;
                        this.$cmmList.marketingList(params).then(data => {
                            if (data && data.code === 200) {
                                this.tableData = data.data.result;
                                this.pageConfig.total = data.data.totalCount;
                                this.pageConfig.currentPage = data.data.currentPageNo;
                                for(let item of this.tableData){
                                    if(item.priority === 100){
                                        item.priority = "按最优先执行"
                                    }
                                }
                            }else {
                                this.tableData = [];
                                this.pageConfig.total = 0;
                            }
                            this.isCache = true;
                        }).catch(err => {
                            this.isCache = true;
                            console.log(err)
                        })
                    }else{
                        this.tableData = data.data.result;
                        this.pageConfig.total = data.data.totalCount;
                        this.pageConfig.currentPage = data.data.currentPageNo;
                        for(let item of this.tableData){
                            if(item.priority === 100){
                                item.priority = "按最优先执行"
                            }
                        }
                        // this.$message({
                        //     message: "查询成功",
                        //     type: "success",
                        //     duration: 1000
                        // });
                    }
                } else {
                    this.tableData = [];
                    this.pageConfig.total = 0;
                    // this.$message({
                    //     message: data.msg,
                    //     type: "warning",
                    //     duration: 1000
                    // });
                }
                this.isCache = true;
            }).catch(err => {
                this.isCache = true;
                console.log(err)
            })
        },

        //操作列回调
        handleButton(data) {
            switch (data.method) {
                case 'openAct':
                    this.openAct(data.scope);
                    break;
                case 'closeAct':
                    this.closeAct(data.scope);
                    break;
                case 'cancelAct':
                    this.cancelAct(data.scope);
                    break;
                case 'removeAct':
                    this.removeAct(data.scope);
                    break;
                case 'reviseAct':
                    this.reviseAct(data.scope);
                    break;
                case 'updateAct':
                    this.updateAct(data.scope);
                    break;
                case 'actDetail':
                    this.actDetail(data.scope);
                    break;
                case 'copyAct':
                    this.copyAct(data.scope);
                    break;
                case 'submitApproval':
                    this.submitApproval(data.scope);
                    break;
                case 'approvalDetail':
                    this.approvalDetail(data.scope);
                    break;
            }
        },

        /* 启用活动 */
        openAct(scope) {
            this.stopOrStartHandle(scope.row.id, 1);
        },
        /* 停用活动 */
        closeAct(scope) {
            this.stopOrStartHandle(scope.row.id, 0);
        },
        /* 作废活动 */
        cancelAct(scope) {
            this.$confirm(`您确定要作废此记录吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteHandle(scope.row.id)
            }).catch(() => {})
        },
        /* 删除活动 */
        removeAct(scope){
            this.$confirm(`您确定要删除此记录吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteHandle(scope.row.id)
            }).catch(() => {})
            
        },
        /* 新建活动 */
        addAct() {
            this.addOrUpdateHandle(null, "add");
        },
        /* 修订活动 */
        reviseAct(scope){
            this.addOrUpdateHandle(scope.row, "revise");
        },
        /* 修改活动 */
        updateAct(scope) {
            this.addOrUpdateHandle(scope.row, "update");
        },
        /* 查看活动 */
        actDetail(scope) {
            this.$router.push({path:'userDefinedActivity/detail',query:{id:scope.row.id}})
            // this.addOrUpdateHandle(scope.row, "detail");
        },
        /* 复制活动 */
        copyAct(scope) {
            this.addOrUpdateHandle(scope.row, "copy")
        },
        /* 提交审批 */
        submitApproval(scope) {
            this.handleCommand(1, scope);
        },
        /* 查看审批单 */
        approvalDetail(scope) {
            this.handleCommand(2, scope);
        },

        /**
         * @function handleSizeChange - 修改分页大小
         */

        handleSizeChange(pageSize) {
            // this.pageConfig.pageSize = pageSize;
            // this.pageConfig.currentPage = 1;
            // this.param.pageSize = pageSize;
            // this.param.pageNo = 1;
            // this.getDataList(this.param)
            this.pageConfig.pageSize = pageSize;
            this.pageConfig.currentPage = 1;
            this.handleSearch()
        },

        /**
         * @function handleCurrentChange - 修改当前显示页
         */
        handleCurrentChange(currentPage) {
            // this.pageConfig.currentPage = currentPage;
            // this.param.pageNo = currentPage;
            // this.getDataList(this.param)
            this.pageConfig.currentPage = currentPage;
            this.handleSearch()
        },

        addOrUpdateHandle(row, isEdit,transfer) {
            this.pageShow = 'addAct'
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(row, isEdit)
            })
        },
        // 删除
        deleteHandle(id) {
            this.$cmmList.marketingDel({
                "id": id,
                "tenantId": this.tenantId
            }).then(data => {
                if (data && data.code === 200) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1500,
                        onClose: () => {
                            // this.getDataList(this.param)
                            // this.resetCacheInit()
                            this.handleSearch()
                        }
                    })
                } else {
                    this.$message.error(data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 停用或启用
        stopOrStartHandle(id, status) {
            this.startOrStopShow = true
            this.startOrStopForm.remark = ''
            console.log(id, status)
            this.stopOrStartId = id
            this.status = status
        },
        startOrStopSubmit() {
            // this.$confirm(`请确认是否${status==0?'停用':'启用'}该营销活动?`, '停用/启用活动', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
            this.$refs['startOrStopForm'].validate((valid) => {
                if (valid) {
                    this.$cmmList.marketingEnableOrDisabl({
                        "id": this.stopOrStartId,
                        "tenantId": this.tenantId,
                        "remark": this.startOrStopForm.remark
                    }).then(data => {
                        console.log(data)
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.startOrStopShow = false
                                    // this.getDataList(this.param)
                                    // this.resetCacheInit()
                                    this.handleSearch()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }

                    }).catch(err => {
                        console.log(err)
                    })
                }
            })
            // }).catch(() => {})
        },

        handleCommand(command, scope) {
            if (command == 1) { //提交审批
                this.$cmmList.marketingSubmitAudit({
                    "id": scope.row.id,
                    "tenantId": this.tenantId
                }).then(data => {
                    console.log(data)
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                // this.getDataList(this.param)
                                // this.resetCacheInit()
                                this.handleSearch()
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }

                }).catch(err => {
                    console.log(err)
                })
            } else { //查看审批单
                // this.pageShow = 'auditView'
                // this.$nextTick(() => {
                //     this.$refs.auditView.init()
                // })
                this.approvalDetailOpen(scope)
                

            }

        },
        /* 开启审批单 */
        approvalDetailOpen(scope) {
            console.log(scope)
            this.bizNo=scope.row.activityCode
            this.showApproval=true
        },
         //关闭查看审批单
        approvalDetailClose(){
            this.showApproval=false
        },

    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/comList.scss";
@import "../../../assets/search-header.scss";
.el-dropdown-menu__item{
    font-size: 12px !important;
}

</style>
