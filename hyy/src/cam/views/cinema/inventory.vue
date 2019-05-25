<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/analysis/new/home' }">
          <span class="text-gray">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">进销存分析</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title">
            时间选择：
            <calendar-view
              size="mini"
              :dateType="dateType"
              v-model="time"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <label class="label-title">
            品类选择：
             <el-cascader
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
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="getSuppliersList"
                :loading="loading"
                @change="changeSupplier">
                <el-option
                  v-for="item in suppliersList"
                  :key="item.id"
                  :label="item.supply_name"
                  :value="item.supply_code">
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
        <div class="right">
          <el-radio-group v-model="targetType" @change="changeTargetType">
            <el-radio :label="1">按数量</el-radio>
            <el-radio :label="2">按金额</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="section-content">
        <div class="target-flex" v-if="targetType == 1">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.title}}</div>
            <div class="money">
              <i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
              <span class="money-num">{{item.num}}</span>
              <span class="unit">{{item.unit}}</span>
            </div>
          </div>
        </div>
         <div class="target-flex" v-if="targetType == 2">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.title}}</div>
            <div class="money">
              <i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
              <span class="money-num">{{item.amount}}</span>
              <span class="unit">{{item.unit}}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        出入库变化趋势分析
        <div class="right">
          <el-radio-group v-model="inoutType" @change="changeInOutType">
            <el-radio :label="1">按数量</el-radio>
            <el-radio :label="2">按金额</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px">{{tip}}</div>
        <div>
        <i class="iconfont icon-neiye-zhexiantu" style="color:#3B74FF" @click="isLine = true"></i>
        <i class="iconfont icon-neiye-biaoge" style="color:#3B74FF" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
          <div  v-if="isLine">
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
          
          <div  class="reset-table mt20" v-else>
            <el-table border v-if="inoutType == 1" :data="data">
              <el-table-column prop="dateColumn" label="日期" min-width="120" align="center"></el-table-column>
              <el-table-column prop="purchCount" label="采购入库数量" min-width="100" align='center'></el-table-column>
              <el-table-column prop="saleCount" label="销售出库数量" min-width="100" align="center"></el-table-column>
              <el-table-column prop="inventoryTurnoverDaysDay" label="库存数量周转天" min-width="100" align='center'> </el-table-column>
            </el-table>
             <el-table border v-if="inoutType == 2" :data="data">
              <el-table-column prop="dateColumn" label="日期" min-width="120" align="center"></el-table-column>
              <el-table-column prop="purchAmount" label="采购入库金额" min-width="100" align="center"></el-table-column>
              <el-table-column prop="saleAmount"  label="销售出库金额" min-width="100" align="center"></el-table-column>
              <el-table-column prop="inventoryTurnoverDaysAmount" label="库存金额周转天" min-width="100" align="center"></el-table-column>
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
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        商品进销存详情
      </div>
      <div class="section-content" >
        <div style="overflow:hidden;zoom:1">
            <el-button class="right" size="mini" style="margin-right:10px" @click="getOut">导出</el-button>
            <el-button class="right" size="mini" style="margin-right:10px" @click="goUnSale">滞销处理</el-button>
            <el-button class="right" size="mini" @click="goReplenish">智能补货</el-button>
        </div>
        <div class="reset-table mt20">
           <el-table border :data="tableData">
            <el-table-column prop="goodSku" label="SKU编码"  min-width="110" fixed></el-table-column>
            <el-table-column prop="goodName" label="商品名称"  min-width="120" fixed></el-table-column>
            <el-table-column prop="parentCategoryName" label="一级品类"  min-width="90"></el-table-column>
            <el-table-column prop="categoryName" label="二级品类"  min-width="90"></el-table-column>
            <el-table-column prop="brandName" label="品牌"  min-width="140"></el-table-column>
            <el-table-column prop="supplyName" label="供应商"  min-width="90"></el-table-column>
            <el-table-column prop="startInventory" label="期初库存数量"  min-width="110px"></el-table-column>
            <el-table-column prop="startAmount" label="期初库存成本额"  min-width="110px"></el-table-column>
            <el-table-column prop="purchCount" label="采购数量"  min-width="110px"></el-table-column>
            <el-table-column prop="purchCount" label="采购成本额"  min-width="110px"></el-table-column>
            <el-table-column prop="saleCount" label="销售数量"  min-width="120px"></el-table-column>
            <el-table-column prop="saleAmount" label="销售成本额"  min-width="120px"></el-table-column>
            <el-table-column prop="endInventory" label="期末库存数量"  min-width="120px"></el-table-column>
            <el-table-column prop="endAmount" label="期末库存成本额"   min-width="120px"></el-table-column>
            <el-table-column prop="inventoryTurnoverDaysDay" label="库存数量周转天"  min-width="120px"></el-table-column>
            <el-table-column prop="inventoryTurnoverDaysAmount" label="库存金额周转天"  min-width="120px"></el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[15, 30, 45, 60]"
            :page-size="size"
            layout=" sizes,total,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CalendarView from '../../components/calendar/calendar'
export default {
  components:{CalendarView},
  data() {
    this.colors = [
      "#3B74FF",
      "#FE825E",
      "#FEC107",
      "#A5F053",
      "#FE825E",
      "#8E7EFF",
      "#ca8622",
      "#bda29a",
      "#6e7074",
      "#546570",
      "#c4ccd3"
    ];
    this.colors1 = [
        "#3B74FF",
        "#FE825E",
        "#FE6081"
    ];
    
    return {
      cityId:1,
      cinemaId:1106970,
       dateType:['周','月'],
        isLine:true,
        categoryList:[{
          value:'1',
          label:'类型1',
          leval:1,
          children:[{
            value:'1-1',
            label:'子类型1',
            leval:2,

          },{
            value:'1-2',
            label:'子类型2',
            leval:2
          }]
        }],
        categoryId:null,
        suppliersList:[{

        }],
        supplierId:null,
        inOutData1:{
            columns:['日期','采购入库','销售出库','库存周转天数'],
            rows:[{
                '日期':'第23周','采购入库':120,'销售出库':100,'库存周转天数':100
            },{
                '日期':'第23周','采购入库':130,'销售出库':100,'库存周转天数':80
            
            },{
                '日期':'第23周','采购入库':80,'销售出库':100,'库存周转天数':120
            }]   
        },
        inOutData2:{
            columns:['日期','采购入库','销售出库','库存周转天数'],
            rows:[{
                '日期':'第23周','采购入库':120,'销售出库':100,'库存周转天数':100
            },{
                '日期':'第23周','采购入库':130,'销售出库':100,'库存周转天数':80
            
            },{
                '日期':'第23周','采购入库':80,'销售出库':100,'库存周转天数':120
            }]   
        },
        inoutSettings:{
            showLine:['库存周转天数'],
            smooth: false,
            itemStyle:{
                colors:['#3B74FF ','#FE825E','#FE608']
            }, 
        },
        inoutExtend:{
            barWidth:10,
            series(val){
                val[2].smooth = false;
                return val
            }
        },
        endStockData:{
            columns:['日期','num','day'],
            rows:[{
                日期:'2018/12/1',num:70,day:120,
            },{
                日期:'2018/12/2',num:80,day:200,
            },{
                日期:'2018/12/1',num:90,day:160,
            },{
                日期:'2018/12/2',num:80,day:180
            }],
        },
        endStockSettings:{
            totalNum:500,
            totalName:"初期库存",
            totalColor:'#fff',
            remainName:"期末库存", 
            xAxis:[{
                  type : 'category',
                  data:['周一','周二','周三']
            }],
            yAxis:[{
                type:'value',

            }],
            series:[{
                name:'增加',
                type:'waterfall',
                data:[40,60,80]
            },{
                name:'周转周期',
                type:'line',
                data:[1,3,5]
            }]
        },
        endStockExtend:{
            barWidth:30,
            barHeight:20,
            dimension:['日期'], // 维度
            metrics:['num','day'],// 指标
            yAxis:[{
                type:'value',

            }]
        },
      inoutType:1, // 出入库
      stockType:1,// 库存变化
      targetType:1, // 指标变化
      tip:'按数量',
     
      time:null,
      startTime: this.$moment(new Date())
        .add(-2, "day")
        .format("YYYY-MM-DD"),
      endTime: this.$moment(new Date())
        .add(-2, "day")
        .format("YYYY-MM-DD"),
      timeType: "day",
      tableData: [{

      }], // 表格列表
      size: 10,
      page: 1,
      total: 0,
      // 指标概览
      targetArr: [
        {
          icon: "icon-neiye-zongxiaoshoue",
          color: "#fe825e",
          title: "期初库存",
          num: 0,
          amount:0,
          unit: "件",
          ratio: 20
        },
        {
          icon: "icon-neiye-kedanjia",
          color: "#8e7eff",
          title: "期末库存",
          num: 0,
          amount:0,
          unit: "件",
          ratio: 20
        },
        {
          icon: "icon-neiyegoumaishuai",
          color: "#3b74ff",
          title: "采购入库",
          num: 0,
          amount:0,
          unit: "件",
          ratio: 20
        },
        {
          icon: "icon-neiye-jine",
          color: "#ff6081",
          title: "销售出库",
          num: 0,
          amount:0,
          unit: "件",
          ratio: 20
        },
        {
          icon: "icon-neiye-xiaofei",
          color: "#fec107",
          title: "库存周转天数",
          num: 0,
          amount:0,
          unit: "天",
          ratio: 20
        }
      ]
    };
  },
  computed:{
    categoryObject(){
        let obj = {};
        this.categoryList.forEach(item=>{
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
  },
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.getData(); // 总数据
      this.getCategoryList(); // 分类
      this.getSuppliersList() // 供应商
      this.getTableData();
    },
    search(){
      this.getData();
      this.getTableData();
    },
    // 1.总数据
    getData(){
      let params = {
        body:{
            startDate:this.startTime,
            endDate:this.endTime,
            cityId:this.cityId,
            cinemaId:this.cinemaId,
            groupId:1,
            categoryCode:this.categoryId,
            supplyCode:this.supplierId,
            dateType:this.timeType,
            level:this.level
        }   
      }
      this.$camList.inoutData(params).then(response=>{
        let res = response.data;
        let resData = res;
        let targetData = resData.currentData;
        if(targetData){
            // 概览数据
              this.targetArr[0].num = targetData.startInventory;
              this.targetArr[1].num = targetData.endInventory;
              this.targetArr[2].num = targetData.purchCount;
              this.targetArr[3].num = targetData.saleCount;
              this.targetArr[4].num = targetData.inventoryTurnoverDaysDay;
              this.targetArr[0].amount = targetData.startAmount;
              this.targetArr[1].amount= targetData.endAmount;
              this.targetArr[2].amount = targetData.purchAmount;
              this.targetArr[3].amount = targetData.saleAmount;
              this.targetArr[4].amount = targetData.inventoryTurnoverDaysAmount;
        }
        // 表格模版
        this.data = resData.list;
        // 出入库

        let barData = resData.barMap;
        if(barData && barData.yAxis){
          // 出入库数量
          this.inOutData1.rows = barData.yAxis.map(item=>{
            return {
              日期:item.dateColumn,
              采购入库:item.purchCount,
              销售出库:item.saleCount,
              库存周转天数:item.inventoryTurnoverDaysDay
            }
          })
          // 出入库金额
          this.inOutData2.rows = barData.yAxis.map(item=>{
            return {
              日期:item.dateColumn,
              采购入库:item.purchAmount,
              销售出库:item.saleAmount,
              库存周转天数:item.inventoryTurnoverDaysAmount
            }
          })
        }
      })
    },
    // 2.获取商品类型
    getCategoryList(){
      this.$camList.categoryList().then(response=>{
        let res = response.data;
        let resData = res.map(item=>{
          return {
            value:item.categoryCode,
            label:item.categoryName,
            level:item.level,
            children:item.childNodes.map(item=>{
              return {
                 value:item.categoryCode,
                label:item.categoryName,
                level:item.level
              }
            })
          }
        })
        this.categoryList = resData;
      })
    },
    //3.获取供应商
    getSuppliersList(name){
      let params = {
        body:{
          pageNo:1,
          pageSize:this.size,
          supplyCode:null,
          supplyName:name?name:null,
        }
      }
      this.$camList.suppliersList(params).then(response=>{
        let res = response.data;
        if(res.list){
          this.suppliersList = res.list;
        }
      })
    },
    // 4.表格
    getTableData(){
      let params = {
        body:{
          groupId:1,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          dateType:this.timeType,
          categoryCode:this.categoryId,
          level:this.level,
          supplyId:this.supplierId,
          pageNo:this.page,
          pageSize:this.size,
        }
      }
      this.$camList.inoutTable(params).then(response=>{
        let res = response.data;
        this.tableData = res.list;
        this.total = res.total;
      })
    },
    // 改变商品类型
    changeCategory(id){
      let new_id = id[id.length*1 - 1]
      this.categoryId = new_id;
      this.level = this.categoryObject[new_id];
    },
    // 改变供应商
    changeSupplier(id){
      this.supplierId = id;
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
      }else{
        this.startTime = this.$moment(option).format('YYYY-MM-DD');
        this.endTime = this.$moment(option).format('YYYY-MM-DD');
      }
    },
    // 改变指标
    changeTargetType(id){
      let num = this.targetArr.length;
      if(id == 1){
        this.targetArr.forEach((item,index)=>{
          if(index < (num*1 -1)){
            item.unit = '件'
          }
        })
      }else if(id == 2){
         this.targetArr.forEach((item,index)=>{
          if(index < (num*1 -1)){
            item.unit = '元'
          }
        })
      }
    },
    // 改变(出入库)
    changeInOutType(id) {
      if(id == 1){
        this.tip = "按数量";
      }else if(id == 2){
        this.tip = "按金额";
      }
    },

    //4. 改变（库存）
    changeStockType(id) {
      this.getStockData();
    },
    // 前往城市版
    goDetail(id) {
      this.$router.push({ path: "/area/sale/total", query: { id: id } });
    },
    // 导出
    getOut(){
      this.$message({type:'warning',message:'导出开发中'})
    },
    // 前往智能补货 -->
    goReplenish(){
      this.$router.push({name:"影院补货明细"})
    },
    // 前往滞销处理
    goUnSale(){
       this.$router.push({name:"影院滞销明细"})
    },
    // 保留小数点
    formatFloat(num, count) {
      if (num) {
        return num.toFixed(count);
      }
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