<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
        <!-- <bread-crumb  :currentTime="currentTime" :dataList="dataList"></bread-crumb> -->
        <div class="time-wrap clearfix">
            <div class="time-item">
                <Authority-Name :orgType="orgType" :orgName="orgName"></Authority-Name>
            </div>
            <div class="time-item">
            <label class="label-title">
                时间选择：
                <calendar-view size="mini"
                    v-model="time"
                    :dateType="dateType"
                    :dateTypeActive='dateTypeActive'
                    @change="changeTime"
                    @emitCalendarType="getTimeType">
                </calendar-view>
            </label>
            </div>
            <div class="time-item">
            <label class="label-title reset-cascader">
                品类选择：
                <el-cascader
                    size="small"
                    :show-all-levels="false"
                    placeholder="请选择"
                    :options="categoryList"
                    filterable
                    clearable
                    change-on-select
                    @change="changeCategory"
                ></el-cascader>
            </label>
            </div>
            <div class="time-item">
            <label class="label-title">
                供应商：
                <el-select
                        v-model="supplierId"
                        filterable
                        clearable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="getSuppliersList"
                        @change="changeSupplier">
                        <el-option
                        v-for="item in suppliersList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.uid">
                        </el-option>
                </el-select>
            </label>
            </div>
            <div class="time-item">
            <el-button type="primary" size="small" @click="search">查询</el-button>
            </div>
        </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        指标概览
        <div class="right reset-radios-group">
          <el-radio-group v-model="targetType">
            <el-radio :label="1">按数量</el-radio>
            <el-radio :label="2">按金额</el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 数量 -->
      <div class="section-content" v-if="targetType == 1">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.title}}</div>
            <div class="money">
              <i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
              <span class="money-num">{{item.num|formatMoney(item)}}</span>
              <span class="unit">{{item.unit |formatUnit(item.num)}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 金额 -->
       <div class="section-content" v-if="targetType == 2">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.title}}</div>
            <div class="money">
              <i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
              <span class="money-num">{{item.amount|formatMoney}}</span>
              <span class="unit">{{item.accountUnit|formatUnit(item.amount)}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        出入库变化趋势分析
        <div class="right reset-radios-group">
          <el-radio-group v-model="inoutType" @change="changeInOutType">
            <el-radio :label="1">按数量</el-radio>
            <el-radio :label="2">按金额</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px"></div>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue"   @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue"  @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content" style="padding-left:10px">
          <div v-if="isLine">
             <ve-histogram v-if="inoutType == 1"
              :data="inOutData1"
              :settings="inoutSettings"
              :extend="inoutExtend"
              :colors="colors1">
            </ve-histogram>
             <ve-histogram v-if="inoutType == 2"
              :data="inOutData2"
              :settings="inoutSettings"
              :extend="inoutExtend"
              :colors="colors1">
            </ve-histogram>
          </div>
          <div  class="reset-table mt20 clearfix" v-else>
            <el-button class="right"  style="margin-bottom:10px" @click="getTrendOut">导出</el-button>
            <el-table border v-if="inoutType == 1" :data="switchData">
              <el-table-column prop="dateColumn" label="日期" min-width="120" align="center"></el-table-column>
              <el-table-column prop="purchCount" label="采购入库数量(件)" min-width="100" align='center'>
                  <template slot-scope="scope">
                      {{scope.row.purchCount|formatNum(0)}}
                  </template>
              </el-table-column>
              <el-table-column prop="salesCount" label="销售出库数量" min-width="100" align="center">
                  <template slot-scope="scope">
                      {{scope.row.salesCount|formatNum(0)}}
                  </template>
              </el-table-column>
              <el-table-column  prop="inventoryTurnoverDaysDay" label="库存数量周转天" min-width="100" align='center'>
                 <template slot-scope="scope">
                      {{scope.row.inventoryTurnoverDaysDay|formatNum}}
                  </template>
              </el-table-column>
            </el-table>
             <el-table border v-else :data="switchData">
              <el-table-column prop="dateColumn" label="日期" min-width="120" align="center"></el-table-column>
              <el-table-column prop="purchAmount" label="采购入库金额" min-width="100" align="center">
                   <template slot-scope="scope">
                      {{scope.row.purchAmount|formatNum}}
                  </template>
              </el-table-column>
              <el-table-column prop="salesAmount"  label="销售出库金额" min-width="100" align="center">
                  <template slot-scope="scope">
                      {{scope.row.salesAmount|formatNum}}
                  </template>
              </el-table-column>
              <el-table-column prop="inventoryTurnoverDaysAmount" label="库存金额周转天" min-width="100" align="center">
                  <template slot-scope="scope">
                      {{scope.row.inventoryTurnoverDaysAmount|formatNum}}
                  </template>
              </el-table-column>
            </el-table>
          </div>
      </div>
    </div>
    <!-- <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        期末库存变化趋势分析
        <div class="right">
          <el-radio-group v-model="stockType" @change="changeStockType">
            <el-radio :label="1">按数量</el-radio>
            <el-radio :label="2">按金额</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="section-content">
        <ve-waterfall
          :data="endStockData"
          :settings="endStockSettings"
          :extend="endStockExtend"
          :colors="colors"
        ></ve-waterfall>
      </div>
    </div> -->
    <div class="section">
        <div class="section-title flex">
            <div>
                <i class="el-icon-arrow-up icon"></i>
                商品进销存详情
            </div>
            <div>
                <el-button class="right" size="mini" style="margin-right:10px" @click="getOut">导出</el-button>
                 <!-- 影院级别的有智能补货和滞销处理 -->
                <template v-if="(orgType=='cinema') && currentShow">
                    <el-button class="right"  style="margin-right:10px" @click="goUnSale">
                        <i class="ring zhixiao"></i>滞销处理
                    </el-button>
                    <el-button class="right"  @click="goReplenish">
                        <i class="ring buhuo"></i> 智能补货
                    </el-button>
                </template>
                <!-- 影院级别的有智能补货和滞销处理 -->
            </div>
        </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column prop="goodSku" label="SKU编码"  min-width="110" fixed></el-table-column>
             <el-table-column prop="goodName" label="商品名称"  min-width="120" fixed>
                <template slot-scope="scope">
                    <span v-if="(orgType=='cinema') && currentShow">
                        <i class="ring buhuo"  v-if="scope.row.psiType == 0"></i>
                        <i class="ring zhixiao" v-if="scope.row.psiType == 1"></i>
                    </span>
                    {{scope.row.goodName}}
                </template>
            </el-table-column>
            <el-table-column prop="parentCategoryName" label="一级品类"  min-width="90"></el-table-column>
            <el-table-column prop="categoryName" label="二级品类"  min-width="90"></el-table-column>
            <el-table-column prop="brandName" label="品牌"  min-width="90"></el-table-column>
            <el-table-column prop="supplyName" label="供应商"  min-width="140"></el-table-column>
            <el-table-column prop="startInventory" label="期初库存数量"  min-width="110px">
              <template slot-scope="scope">
                  {{scope.row.startInventory|formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="startAmount" label="期初库存成本额"  min-width="110px">
              <template slot-scope="scope">
                   {{scope.row.startAmount|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="purchAmount" label="采购数量"  min-width="110px">
              <template slot-scope="scope">
                   {{scope.row.purchCount|formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="purchCount" label="采购成本额"  min-width="110px">
               <template slot-scope="scope">
                   {{scope.row.purchAmount|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesCount" label="销售数量"  min-width="120px">
               <template slot-scope="scope">
                   {{scope.row.salesCount|formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="sellingCost" label="销售成本额"  min-width="120px">
               <template slot-scope="scope">
                   {{scope.row.sellingCost|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="endInventory" label="期末库存数量"  min-width="120px">
               <template slot-scope="scope">
                   {{scope.row.endInventory|formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="endAmount" label="期末库存成本额"   min-width="120px">
              <template slot-scope="scope">
                   {{scope.row.endAmount|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="inventoryTurnoverDaysDay" label="库存数量周转天"  min-width="120px">
               <template slot-scope="scope">
                   {{scope.row.inventoryTurnoverDaysDay | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="inventoryTurnoverDaysAmount" label="库存金额周转天"  min-width="120px">
               <template slot-scope="scope">
                   {{scope.row.inventoryTurnoverDaysAmount | formatNum}}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination size="mini" v-if="total>15"
            layout="sizes,total,prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="sizes"
            :page-size="size"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import config from "frame_cpm/http/config";
import CalendarView from '../../components/calendar/calendar'
import Global from '../../util/global'
import BreadCrumb from '../partical/breadCrumb'
import AuthorityName from '../partical/authorityName'
export default {
  components:{CalendarView,BreadCrumb,AuthorityName},
  data() {
    this.colors1 = [
        "#3B74FF",
        "#FE825E",
        "#FE6081"
    ];
    return {
        dataList:[{
            name:'进销存分析'
        }],
         userId: this.$store.state.loginUser
        ? this.$store.state.loginUser.uid
        : null,
        switchData:[],
        orgType:null,
        orgName:null,
        currentTime:null,
        isLine:true,
        dateType:['周','月'],
        dateTypeActive:'week',
        time:null,
        startTime:null,
        endTime:null,
        currentWeekTime:[],
        currentMonth:[],
        currentShow:true,// 补货/滞销按钮（本周/月显示）
        timeType:'week',
        categoryObj:this.$store.getters.categoryObj,
        categoryId:null,
        level:null,
        suppliersList:[],
        supplierId:null,
        consumerId:this.$store.state.loginUser.consumerId,
        inOutData1:{ // 出入库变化数量
            columns:['日期','采购入库','销售出库','库存周转天数'],
            rows:[]   
        },
        inOutData2:{ // 出入库变化金额
            columns:['日期','采购入库','销售出库','库存周转天数'],
            rows:[]   
        },
        inoutSettings:{
            itemStyle:{
              colors:['#3B74FF ','#FE825E','#FE608']
            }, 
            showLine:['库存周转天数'],
            axisSite:{right:['库存周转天数']},
            yAxisName: ['数值', '天数'],
            yAxis:{
                splitLine:{show:false}
            },
            legend:{
               selected:{
                   '采购入库':true
               }
            }
        },
        inoutExtend:{
          barWidth:10,
            yAxis:{
                splitLine:{
                    show:false,
                },
                axisLine:{
                    show:true, 
                    lineStyle:{
                        color:'#aaa'
                    }
                },
                axisTick:{show:true},
                axisLabel:{
                    color:'#333'
                },
                nameTextStyle:{
                    color:'#333'
                },
            },
            xAxis:{
                axisLine:{
                    show:true,
                    lineStyle:{
                        color:'#aaa'
                    }
                },
                axisTick:{show:true},
                axisLabel:{
                    color:'#333'
                }
            },  
            // legend:{
            //    selected:{
            //        '采购入库':true
            //    }
            // },
            tooltip:{
              formatter:(params)=>{
                let res = [];
                let resStr = '';
                params.forEach(item=>{
                    resStr += item.marker + item.seriesName + ':' + Global.formatNum(item.value)+'<br>'
                 })
                res.push(resStr)
                return res
              }
            }
        },
        endStockData:{
            columns:['日期','num','day'],
            rows:[],
        },
        endStockSettings:{
            totalNum:500,
            totalName:"初期库存",
            totalColor:'#fff',
            remainName:"期末库存", 
        },
        endStockExtend:{
            barWidth:30,
            barHeight:20,
            dimension:['日期'], // 维度
            metrics:['num','day'],// 指标 
        },
      inoutType:1, // 出入库 1数量 2 金额
      stockType:1,// 库存变化
      targetType:1, // 指标变化
      tip:'按数量',
      tableData: [], // 表格列表
      sizes:Global.pageSizes,
      size: 15,
      page: 1,
      total: 0,
      // 指标概览
      targetArr: [
        {
          icon: "icon-jingyingjuece-kucun",
          color: "#fe825e",
          title: "期初库存",
          num: 0,
          amount:0,
          unit: "件",
          accountUnit:'元',
          ratio: 0
        },
        {
          icon: "icon-jingyingjuece-kucun",
          color: "#8e7eff",
          title: "期末库存",
          num: 0,
          amount:0,
          unit: "件",
          accountUnit:'元',
          ratio: 0
        },
        {
          icon: "icon-jingyingjuece-caigouruku",
          color: "#3b74ff",
          title: "采购入库",
          num: 0,
          amount:0,
          unit: "件",
          accountUnit:'元',
          ratio: 0
        },
        {
          icon: "icon-jingyingjuece-chuku",
          color: "#ff6081",
          title: "销售出库",
          num: 0,
          amount:0,
          unit: "件",
          accountUnit:'元',
          ratio: 0
        },
        {
          icon: "icon-jingyingjuece-zhouzhuan",
          color: "#fec107",
          title: "库存周转天数",
          num: 0,
          amount:0,
          unit: "天",
          accountUnit:'天',
          ratio: 0
        }
      ]
    };
  },
  computed:{
    // 品类
    categoryList(){
      if(this.$store.state.cam.categoryList){
        //   console.log(this.$store.state.cam.categoryList,'fffff')
        return this.$store.state.cam.categoryList
      }else{
          return [];
      }
    },
    // level
    categoryLevel(){
        let obj = {};
        if(this.categoryList){
            let list = this.categoryList.slice(0);
            list.forEach(item=>{
                let id = item.value;
                let level = item.level;
                    if(!obj.hasOwnProperty(id)){
                    obj[id] = level;
                    }
                    if(item.children){
                    item.children.forEach(item=>{
                        if(!obj.hasOwnProperty(item.value)){
                            obj[item.value] = item.level;
                        }
                    })
                    }
            })
            return obj;
        }
    }
  },
   filters:{
    // 带单位
    formatNum:(money,count,unit) =>{
      return Global.formatNum(money,count,unit);
    },
    // 不带单位
    formatMoney(money,item){
        // console.log(item,'item')
        if(item && item.title == '库存周转天数'){
            return Global.formatMoney(money)
        }else{
            return Global.formatMoney(money,0)
        }
    },
    // 单位
    formatUnit:(type,money)=>{
      return Global.formatInventoryUnit(type,money)
    },
  },
  created() {
    this.Time();
    this.getCategoryList(); // 品类
    this.getSuppliersList(); // 供应商
    this.getCurrentTime();
    this.getAllData();
  },
  methods: {
   Time(){
        var now = new Date();
        var nowDayOfWeek = now.getDay(); // 今天本周的第几天
        var nowDay = now.getDate();//当前日 
        var nowMonth = now.getMonth();
        var nowYear = (now.getYear())<2000?(now.getYear())+1900:0;
        // 本周开始时间
        var weekStartDate = this.$moment(new Date(nowYear,nowMonth, nowDay - nowDayOfWeek +1 )).format('YYYY-MM-DD');
        // 本周结束时间
        var weekEndDate = this.$moment(new Date(nowYear,nowMonth, nowDay + (7 - nowDayOfWeek))).format("YYYY-MM-DD");
        // 本月开始时间
        var monthStartDate = this.$moment(new Date(nowYear,nowMonth,1)).format('YYYY-MM-DD');
        // 本月结束时间
        var monthEndDate = this.$moment(this.$moment(new Date(nowYear,(nowMonth+1),1)).add(-1,'day')).format('YYYY-MM-DD');
    
        this.time = [weekStartDate, weekEndDate];
        this.currentWeekTime = [weekStartDate, weekEndDate];
        this.currentMonth = [monthStartDate,monthEndDate];
        this.startTime = weekStartDate;
        this.endTime = weekEndDate;
    },
    getCurrentTime(){
        this.$camList.getCurrentTime().then(res=>{
        this.currentTime = res.data;
      })
    },
    getAllData() {
      this.getData();
      this.page = 1;
      this.getTableData();
    },
    getData(){
      let params = {
        body:{
            startDate:this.startTime,
            endDate:this.endTime,
            dateType:this.timeType,
            categoryUid:this.categoryId,
            supplyUid:this.supplierId,
            level:this.level
        }   
      }
      this.$camList.inoutData(params).then(response =>{
        let res = response.data;
        if(res){
          this.orgType = res.orgType;
          this.orgName = res.orgName;
          let resData = res;
          let targetData = resData.currentData;
          // 概览数据
          if(targetData){
              this.targetArr[0].num = targetData.startInventory;
              this.targetArr[1].num = targetData.endInventory;
              this.targetArr[2].num = targetData.purchCount;
              this.targetArr[3].num = targetData.salesCount;
              this.targetArr[4].num = targetData.inventoryTurnoverDaysDay;
              this.targetArr[0].amount = targetData.startAmount;
              this.targetArr[1].amount= targetData.endAmount;
              this.targetArr[2].amount = targetData.purchAmount;
              this.targetArr[3].amount = targetData.salesAmount;
              this.targetArr[4].amount = targetData.inventoryTurnoverDaysAmount;
          }
          // 出入库变化趋势表格
          this.switchData = resData.list;
          // 出入库变化趋势
          let barData = resData.barMap;
          if(barData && barData.yAxis){
            // 数量
            this.inOutData1.rows = barData.yAxis.map(item=>{
              return {
                日期:item.dateColumn,
                采购入库:item.purchCount,
                销售出库:item.salesCount,
                库存周转天数:item.inventoryTurnoverDaysDay
              }
            })
            // 金额
            this.inOutData2.rows = barData.yAxis.map(item=>{
              return {
                日期:item.dateColumn,
                采购入库:item.purchAmount,
                销售出库:item.salesAmount,
                库存周转天数:item.inventoryTurnoverDaysAmount
              }
            })
          }
        }else{
              this.targetArr[0].num = 0;
              this.targetArr[1].num = 0;
              this.targetArr[2].num = 0;
              this.targetArr[3].num = 0;
              this.targetArr[4].num = 0;
              this.targetArr[0].amount = 0;
              this.targetArr[1].amount= 0;
              this.targetArr[2].amount = 0;
              this.targetArr[3].amount = 0;
              this.targetArr[4].amount = 0;
              this.switchData = [];
              this.inOutData1.rows = [];
              this.inOutData2.rows = [];
        } 
      })
    },
    // 2.获取品类
    getCategoryList(){
      this.$store.dispatch('cam/getCagegory')
    },
    //3.获取供应商
    getSuppliersList(name){
      let params = {
        body:{
          consumerId:this.consumerId,
          supplyName:name?name:null,
          pageNo:1,
          pageSize:9999,
        }
      }
      this.$camList.suppliersList(params).then(response =>{
        let res = response.data;
        if(res.list){
          this.suppliersList = res.list;
        }else{
          this.suppliersList = [];
        }
      })
    },
    // 4.表格
    getTableData(){
      let params = {
        body:{
          dateType:this.timeType,
          startDate:this.startTime,
          endDate:this.endTime,
          categoryUid:this.categoryId,
          level:this.level,
          supplyUid:this.supplierId,
          pageNo:this.page,
          pageSize:this.size,
        }
      }
      this.$camList.inoutTable(params).then(response =>{
        let res = response.data;
        if(res){
          this.tableData = res.list;
          this.total = res.total;
        }else{
            this.tableData = [];
            this.total = 0;
        }
      })
    },
    search(){
     this.getAllData()
    },
    // 改变商品类型
    changeCategory(id){
      if(id.length>0){
        let new_id = id[id.length*1 - 1];
        this.categoryId = new_id;
        this.level = this.categoryLevel[new_id];
      }else{
        this.categoryId = null;
        this.level = null;
      }
    this.getAllData()
    },
    // 改变供应商
     changeSupplier(id){
        if(id){
            this.supplierId = id;
        }else{
            this.supplierId = null;
        }
      this.getAllData()
    },
    //获取时间类型
    getTimeType(type) {
      this.timeType = type;
    },
    //改变时间
    changeTime(option) {
      if (option.startTime) {
        this.startTime = option.startTime;
        this.endTime = option.endTime;
        this.dateTypeIndex = option.index;
      }
        // 本周/本月判断
        let type = this.timeType;
        if(type == 'week'){
            // 本周
            if(this.startTime == this.currentWeekTime[0]){
                this.currentShow = true;
            }else{
                this.currentShow = false;
            } 
        }else if(type == 'month'){
            // 本月
            if(this.startTime == this.currentMonth[0]){
                this.currentShow = true;
            }else{
                this.currentShow = false;
            }
        }else{
            this.currentShow = false;
        }
    this.getAllData()
    },
    // 改变(出入库)
    changeInOutType(id) {
     this.getData();
    },
    // 表格导出
    getOut(){
        let baseURL = config.baseURL;
        let downUrl =`${baseURL}/analysis/sellGoods/psi/exportDetailData?userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&token=${this.$store.state.loginToken}`;
        // console.log(downUrl,'inin')
        window.location.href = downUrl;
    },
    // 趋势导出
    getTrendOut(){
        let baseURL = config.baseURL;
        let downUrl = `${baseURL}/analysis/sellGoods/psi/exportData?userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
            this.timeType
        }&token=${
            this.$store.state.loginToken
        }`;
        window.location.href = downUrl;
    },
    // 前往智能补货 -->
    goReplenish(){
      this.$router.push({name:"影院补货明细"})
    },
    // 前往滞销处理
    goUnSale(){
      this.$router.push({name:"影院滞销明细"})
    },
    // 分页/大小
    handleSizeChange(num) {
      this.size = num;
      this.getTableData();
    },
    //分页/页码
    handleCurrentChange(num) {
      this.page = num;
      this.getTableData();
    }
  }
};
</script>