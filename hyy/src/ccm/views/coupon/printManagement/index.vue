<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 表格 -->
    <section class="table-section">
        <el-table :data="tableData" style="width: 100%">
            <template v-for="(item,index) in tableConfig">
                <el-table-column v-if="!item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                <el-table-column v-else-if="item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                    <template slot-scope="scope">
                        <div v-if="item.label == '操作'">
                            <el-button type="text" @click="printMethods('print',scope.row)">打印</el-button>
                            <el-button type="text" @click="printMethods('rePrint',scope.row)">重打</el-button>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </section>

    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center pageStyle" v-if="tableData.length != 0">
        <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page="pageConfig.pageNo" 
        :page-sizes="pageConfig.pageSizes" 
        :page-size="pageConfig.pageSize" 
        background layout="total, prev, pager, next, jumper, sizes"   
        :total="pageConfig.total">
        </el-pagination>
    </section>
    <!-- 弹窗 -->
    <el-dialog
        title="票券打印"
        :visible.sync="printVisible"
        width="32%"
        :close-on-click-modal="false"
        >
        <div class="print-main">
            <el-form :inline="true" ref="print" label-width="85px" size="small" class="form-print"  :model="form" :rules="rules">
                <el-form-item label="申请单号：">
					<div class="nameValue">{{form.applyCode}}</div>
				</el-form-item>
                <div>
                    <el-form-item label="票券名称：">
                        <div class="nameValue">{{form.couponName}}</div>    
                    </el-form-item>
                </div>
                <el-form-item label="打印数量：" prop="num">
					<el-input v-model="form.num"></el-input>
				</el-form-item>
                <el-form-item label="打印设备：" prop="opara">
					<el-select v-model="form.opara" placeholder="请选择" @change="oparaChange">
                        <el-option
                        v-for="item in oparaOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="使用票版：" prop="templateName">
					<el-input v-model="form.templateName"  :readonly=true>
                        <i slot="suffix" class="el-icon-circle-close" @click="clearInputValue()" v-if="form.templateId"></i>
                    </el-input>
                    <el-button plain @click="selecteTemplate">选择</el-button>
				</el-form-item>
            </el-form>
            <div  class="footer-are">
                <el-button type="primary" @click="printFnc('print')" >确定</el-button>
                <el-button plain @click="printVisible=false" style="margin-left:8px;">取消</el-button>
            </div>
        </div>
        <printModel @selecteTemplateCallBack="selecteTemplateCallBack" ref="tamplate"></printModel>
    </el-dialog>
    <el-dialog
        title="票券重打印"
        :visible.sync="rePrintVisible"
        width="32%"
        :close-on-click-modal="false"
        >
        <div class="print-main">
            <el-form :inline="true" ref="rePrint" label-width="85px" size="small" class="form-print"  :model="form" :rules="rules">
                <el-form-item label="申请单号：">
					<div class="nameValue">{{form.applyCode}}</div>
				</el-form-item>
                <div>
                    <el-form-item label="票券名称：">
                        <div class="nameValue">{{form.couponName}}</div>    
                    </el-form-item>
                </div>
                <div class="nameValue" style="padding: 0 10px 20px;">请指定需要重打印的顺序号：</div>
                <el-form-item label="起始序号：" prop="beginSeq">
					<el-input v-model="form.beginSeq"></el-input>
				</el-form-item>
                <el-form-item label="结束序号：" prop="endSeq">
					<el-input v-model="form.endSeq"></el-input>
				</el-form-item>
                <el-form-item label="打印设备：" prop="opara">
                    <el-select v-model="form.opara" placeholder="请选择">
                        <el-option
                        v-for="item in oparaOptions"
                        :key="item.value"
                        :label="item.name"
                        :value="item.code">
                        </el-option>
                    </el-select>
				</el-form-item>
                <el-form-item label="使用票版：" prop="templateName">
					<el-input v-model="form.templateName" :readonly=true>
                        <i slot="suffix" class="el-icon-circle-close" @click="clearInputValue()" v-if="form.templateId"></i>
                    </el-input>
                    <el-button plain @click="selecteTemplate">选择</el-button>
				</el-form-item>
            </el-form>
            <div  class="footer-are">
                <el-button type="primary" @click="printFnc('rePrint')" >确定</el-button>
                <el-button plain @click="rePrintVisible=false" style="margin-left:8px;">取消</el-button>
            </div>
        </div>
        <printModel @selecteTemplateCallBack="selecteTemplateCallBack" ref="tamplate"></printModel>
    </el-dialog>
</div>
</template>

<script>
import printModel from 'ccm/dialogs/printModel';
import searchLan from '../../../components/search/index.vue';
import util from 'ccm/util/app.js'
import minxins from 'frame_cpm/mixins/cacheMixin.js'

export default {
    components: {
        searchLan,
        printModel
    },
    mixins: [minxins.cacheMixin],
    data() {
        var checkNum = (rule, value, callBack) => {
            let regExp = /^[1-9]\d*$/;
            if(!value){
                return callBack(new TypeError('请输入数量！'));
            }else if (!regExp.test(value)) {
                return callBack(new TypeError('请输入小于5位的正整数！'));
            }else{
                return callBack();
            }
        }
        return {
            /* 缓存数据 */
            cacheField: ["form","pageConfig","tableData","searchParam","oparaOptions","configData"],
            subComName:'printList',
            modelName:'printManagement',
            tableData: [],
            printVisible:false,
            rePrintVisible:false,
            searchParam:{},
            oparaOptions:[],
            /**
             * @param 
                applyCode:'',   //单号
                couponName:'', //票券名称
                num:'',        //数量
                opara:'',       //设备
                beginSeq:'',    //起始序号
                endSeq:'',      //结束序号
                templateName:'',//票版名称
                templateId:'',  //票版id
             */
            form:{
                applyCode:'',
                couponName:'',
                num:'',
                opara:'',
                beginSeq:'',
                endSeq:'',
                templateName:'',
                templateId:'',

            },
            searchConfig: [{
                name: '申请单号',
                keyName: 'applyCode',
                type: 'input',
                value: ''
            }, {
                name: '票券名称',
                keyName: 'couponName',
                type: 'input',
                value: ''
            }, {
                name: '创建人',
                keyName: 'createname',
                type: 'input',
                value:''
            },{
                keyName: 'salesMode',
                    name: '销售方式',
                    type: 'select',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '影院零售',
                        value: '1'
                    }, 
                    {
                        label: '营销活动',
                        value: '2'
                    }, {
                        label: '大客户',
                        value: '3'
                    }, {
                        label: '第三方合作',
                        value: '4'
                    }]
                }
            ],
            tableConfig: [{
                    label: '申请单号',
                    prop: 'applyCode',
                    width: '180'
                }, {
                    label: '票券名称',
                    prop: 'couponName',
                    width:'100'
                }, {
                    label: '客户名称',
                    prop: 'custName',
                }, {
                    label: '票券类型',
                    prop: 'typeName',
                }, {
                    label: '申请日期',
                    prop: 'createTime',
                }, {
                    label: '数量',
                    prop: 'couponCount',
                }, {
                    label: '单价',
                    prop: 'couponPrice',
                }, {
                    label: '已打印数量',
                    prop: 'printCount',
                }, {
                    label: '未打印数量',
                    prop: 'notPrintNum',
                }, {
                    label: '最后打印序列号',
                    prop: 'lastPrintSeq',
                    width:'100'
                }, {
                    label: '使用票版',
                    prop: 'names',
                },
                {
                    label: '操作',
                    width: '180',
                    hasTemplate: true,
                    fixed: 'right'
                }
            ],
            /* 分页设置 */
            pageConfig: {
                pageNo: 1, 
                pageSizes: [10, 20, 30, 40],
                pageSize: 10,
                total: 15
            },
            rules:{
                num:[
                    {required:true, validator: checkNum, trigger: 'blur' }
                ],
                beginSeq:[
                    {required:true, validator: checkNum, trigger: 'blur' }
                ],
                endSeq:[
                    {required:true, validator: checkNum, trigger: 'blur' }
                ],
                opara:{required:true,message:'请选择打印设备',trigger:'change'},
                templateName:{required:true,message:'请选择票版',trigger:'change'}
                
                
            },
            configData:[],
        }
    },
    created() {
        this.search()
    },
    methods: {
        /**
         * @function setSearch - 修改搜索栏
         */
        setSearch(params) {
            this.searchParam =  params
        },
        /**
         * @function setParams
         */
        setParams(params) {
            console.log('有参数',params)
            params = params? params : ''
            let _param = {}
            let searchParam = this.searchParam;
            let objKey = ['createname','couponName','salesMode','applyCode']
                objKey.forEach(item => {
                    if(!_param[item]){
                        _param[item] = params[item]?params[item] : searchParam[item]?  searchParam[item] :  ''
                    }
                })
            if(params){
                this.pageConfig.pageNo = 1   //点击按钮 页数回到第一页
            }
            _param["pageNo"] =  this.pageConfig.pageNo 
            _param["pageSize"] = this.pageConfig.pageSize
            return  _param
        },
        /**
         * @function search - 搜索
         */
        search(data) {
            console.log(data)
            let param = this.setParams(data)
            this.$ccmList.findCouponByCondition(param).then(res => {
                if(res.code==200){
                    this.tableData = res.data.list
                    this.pageConfig.total = res.data.pageNum
                }
            })
        },

        /**
         * @function printMethods - 弹窗参数和唤起弹窗
         * @param type   -1.打印，-2.重打印
         * @param data  -当前行数据
         */
        printMethods(type,data) {
            this.form.applyCode = data.applyCode
            this.form.couponName = data.couponName
            if(type == 'print'){  //打印
                this.printVisible = true
            }else if (type == 'rePrint'){ //重打印
               this.rePrintVisible = true
            }
        },
        /**
         * @function printFnc 
         * @param type==''print 打印 ；='reprint'重打印
         */
        async printFnc(type) {
            let form = this.form
            let response = {code:-1}
            let printData = {}
            let flag  = false
            if(type == 'print'){  //打印
                this.$refs[`${type}`].validate((validate) => {
                    flag = validate    
                })
                if(flag){
                    let param = ["templateId","applyCode","num"]
                    let _param = {}
                    for(let i=0; i<param.length; i++){
                        if(form[param[i]]){
                            _param[`${param[i]}`] = form[`${param[i]}`]
                        }
                    }
                    response = await this.$ccmList.ticketPrinting(_param)
                }else{
                    return
                }
                
            }else if (type == 'rePrint'){ //重打印
                this.$refs[`${type}`].validate((validate) => {
                    flag = validate
                })
                if(flag){
                    let param = ["templateId","applyCode","couponName","beginSeq","endSeq",]
                    let _param = {}
                    for(let i=0; i<param.length; i++){
                        if(form[param[i]]){
                            _param[`${param[i]}`] = form[`${param[i]}`]
                        }
                    }
                    response = await this.$ccmList.reprint(_param)
                }else{
                    return
                }
            }
            if(response.code==200){
                printData = response.data
            }else{
                return this.$message({
                    type:'error',
                    message:response.msg? response.msg : '打印失败！'
                })
            }
            /**
             *  @function printTicket -参数1.类型； 参数2打印数据；参数3打印设备；参数4回调
             */
            console.log('数据',printData)
            console.log('配置 ',form)
            this.printCoupon(printData,0)

        },
        printCoupon(printData,index) {
            let cel = printData[index]
            util.printTicket('coupon_print',cel,this.configData,(req)=>{
                console.log(req)
                let type = 'warning'
                let message = `打印第${index+1}张票券失败！`
                if(req[0]==0){
                    type='success',
                    message=`成功打印第${index+1}张票券！`
                }
                this.$message({
                    type,
                    message
                })
                index++
                if(index<printData.length){
                    this.printCoupon(printData,index)
                }else{
                    this.$message({
                        type:'success',
                        message:'打印结束！'
                    })
                    this.search()
                    this.printVisible = false
                    this.rePrintVisible = false
                }
            })
        },
        /**
         * @function -打开弹窗
         */
        selecteTemplate(){
            this.$refs.tamplate.openDialog(true)
        },
        /**
         * @function selecteTemplateCallBack  -模板弹窗回调
         * @param rowData
         */
        selecteTemplateCallBack(data){
            this.form.templateName = data.name
            this.form.templateId = data.id
        },
        clearInputValue() {
            this.form.templateName = ''
            this.form.templateId = ''
        },
        /**
         * @function handleSizeChange - 分页改变size
         */
        handleSizeChange(value) {
            this.pageConfig.pageSize = value
            this.search()
        },

        /**
         * @function handleCurrentChange - 分页改变页码
         */
        handleCurrentChange(value) {
            this.pageConfig.pageNo = value
            this.search()
        },
        oparaChange(value) {
            this.oparaOptions.forEach(item => {
                if(item.code==value){
                    item.selected=true;
                    console.log("trueitem",item)
                }else{
                    item.selected=false;
                    console.log("falseitem",item)
                }
            });
            this.configData.coupon_print=JSON.parse(JSON.stringify(this.oparaOptions))
            console.log("configData",this.configData)
            util.writeTerminalParameter(this.configData,(res)=>{
                console.log(res) 
            })
        },
    },
    mounted() {
        util.readTerminalParameter((configData)=>{
            this.configData=configData
            this.oparaOptions = configData.coupon_print
            console.log('终端：',configData) 
        })
       
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/comList.scss";   
.footer-are{
    text-align: center;
    border-top: 1px #E5E5E5  solid;
    padding-top: 20px;
}
    /deep/ .el-dialog__body{
        padding: 20px 0 ;
    }
    /deep/ .el-form{
        padding: 0 10px;
    }
     /deep/ .el-dialog__header{
      .el-dialog__title{
          padding-bottom: 5px;
          width: 100%;
          display: inline-block;
          border-bottom: 1px solid #e5e5e5;
      }
    }
    /deep/ .form-print .el-input{
        width: 220px
    }
</style>
