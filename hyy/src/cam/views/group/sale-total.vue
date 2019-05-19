<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/group/home' }">
          <span class="text-gray">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">卖品销售概览</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title">
            时间选择：
            <calendar-view
              size="mini"
              v-model="time"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <label>
            <span class="label-title">会员属性：</span>
            <el-radio-group
              v-model="memberType"
              @change="changeMemberType"
              class="reset-radios-group">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">仅会员</el-radio>
            </el-radio-group>
          </label>
          <el-button type="primary" size="mini" style="margin-left:30px" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        指标概览
        <div class="reset-radios-group right">
          <el-radio-group v-model="ratioType" @change="changeRadio">
            <el-radio :label="1">环比</el-radio>
            <el-radio :label="2">同比</el-radio>
          </el-radio-group>
          <el-button
            size="mini"
            style="margin-left:20px;margin-right:20px"
            @click="showTargetSetting"
          >指标设置</el-button>
        </div>
      </div>
      <div class="section-content" v-if="targetArr">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.indicatorName}}</div>
            <div class="money">
              <i class="iconfont" :class="icons[index]" :style="{color:iconColors[index]}"></i>
              <span class="money-num">{{item.value}}</span>
              <span class="unit">{{item.indicatorCode|formatTargetUnit}}</span>
            </div>
            <div class="ratio" v-if="ratioType == 1">
              环比
              <i></i>
              <span class="ratio-num">{{item.roundPeriodValue == '-9999'?'--':item.roundPeriodValue}}</span>%
            </div>
             <div class="ratio" v-else>
              同比
              <i></i>
              <span class="ratio-num">{{item.samePeriodValue == '-9999'?'--':item.samePeriodValue}}</span>%
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        卖品指标趋势
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px">单位：元</div>
        <div>
          <target-lable @getType="changeSaleType"></target-lable>
        </div>
        <div>
          <i class="iconfont icon-neiye-zhexiantu" style="color:#3B74FF" @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge" style="color:#3B74FF" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line v-if="isLine"
          :data="saleLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        >
        </ve-line>
          <div  class="reset-table mt20" v-else>
             <el-table border :data="saleTableData" height="380">
              <el-table-column prop="dateKey" label="日期" min-width="100" fixed></el-table-column>
              <el-table-column prop="salesVolume" label="销售额" min-width="100" fixed></el-table-column>
              <el-table-column prop="salesOrders"  label="销售单量" min-width="100" fixed></el-table-column>
              <el-table-column prop="salesCount" label="销售数量" min-width="100" fixed></el-table-column>
              <el-table-column prop="unitPrice" label="平均单价" min-width="100"></el-table-column>
              <el-table-column prop="buyRate" label="购买率" min-width="100"></el-table-column>
              <el-table-column prop="sppPrice" label="SPP" min-width="100"></el-table-column>
              <el-table-column prop="" label="销售成本" min-width="100"></el-table-column>
              <el-table-column prop="salesGrossProfit" label="销售毛利" min-width="100"></el-table-column>
              <el-table-column prop="salesGrossProfitRate" label="销售毛利率" min-width="100"></el-table-column>
              <el-table-column prop="memberSalesVolumePercent" label="会员消费占比" min-width="100"></el-table-column>
            </el-table>
          </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        渠道及品类分布
      </div>
      <div class="section-select center">
        <target-lable  @getType="changeChannelType" type="channel"></target-lable>
      </div>
      <!-- 饼图 -->
      <div class="section-content flex" v-if="showPie">
        <div style="width:50%;">
          <ve-pie
            :data="channelData"
            :settings="channelSettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-pie>
        </div>
        <div style="width:50%;">
          <ve-ring
            :data="categoryData"
            :settings="categorySettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-ring>
        </div>
      </div>
      <!-- 柱状图 -->
      <div class="section-content flex" v-else>
        <div style="width:40%;margin:0 auto">
          <ve-histogram :title="渠道" :data="channelData" :extend="barExtend" :legend-visible="false"></ve-histogram>
        </div>
        <div style="width:40%;margin:0 auto">
          <ve-histogram :data="categoryData" :extend="barExtend" :legend-visible="false"></ve-histogram>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        卖品销售表现
      </div>
      <div class="section-content">
        <!-- 散点图 -->
        <ve-scatter 
          :legend-visible="false"
          :data="scatterData"
          :settings="scatterSettings"
          :extend="scatterExtend"
        ></ve-scatter>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        区域详情
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column label="序号" width="60" type="index" fixed></el-table-column>
            <el-table-column label="区域名称"  min-width="180" fixed>
              <template slot-scope="scope">
                <div class="cursor" @click="goDetail(scope.row.cityId)">
                  <span class="text-blue">{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="salesVolume" label="销售额"  min-width="110"></el-table-column>
            <el-table-column prop="salesOrders" label="销售单量"  min-width="90"></el-table-column>
            <el-table-column prop="salesCount" label="销售数量"  min-width="90"></el-table-column>
            <el-table-column prop="unitPrice" label="客单价"  min-width="90"></el-table-column>
            <el-table-column prop="piecePrice" label="件单价"  min-width="90"></el-table-column>
            <el-table-column prop="unitCount" label="客单量"  min-width="90"></el-table-column>
            <el-table-column prop="buyRate" label="购买率"  min-width="90"></el-table-column>
            <el-table-column prop="sppPrice" label="人均消费额"  min-width="110px"></el-table-column>
            <el-table-column prop="sellingCost" label="销售成本"  min-width="110px"></el-table-column>
            <el-table-column prop="salesGrossProfit" label="销售毛利"  min-width="110px"></el-table-column>
            <el-table-column prop="salesGrossProfitRate" label="销售毛利率"  min-width="110px"></el-table-column>
            <el-table-column prop="memberSalesVolumePercent" label="会员消费占比"  min-width="120px"></el-table-column>
            <el-table-column prop="setmealSalesVolumePercent" label="套餐消费占比"  min-width="120px"></el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="$pageSizes"
            :page-size="size"
            layout="total,sizes,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 指标设置弹窗 -->
    <target-dialog ref="targetDailog" :userId="userId"></target-dialog>
  </div>
</template>
<script>
import TargetLable from "../partical/targetLable";
import TargetDialog from "../partical/targetDialog";
import CalendarView from '../../components/calendar/calendar'
export default {
  components: { TargetLable, TargetDialog,CalendarView},
  data() {
    this.colors = [
      "#3B74FF",
      "#FE6081",
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
    return {
      groupId:1,
      isLine:true,
      userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
      time: this.$moment(this.$moment(new Date()).add(-1, "day")).format(
        "YYYY-MM-DD"
      ),
      startTime: this.$moment(new Date())
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      endTime: this.$moment(new Date())
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      timeType: "day",
      memberType: 0, // 会员类型
      ratioType: 1, // 环比类型
      saleType: 'xse', // 卖品指标
      saleAllType:['xse','xsdl','xssl','kdj','jdj','kdl','cbj','xsml','xhmlr','xscb','gml','rjmpje','hyxfzb','tcxfzb'],
      saleLineAllData:null,
      saleTableData:[],
      channelType: 'xse', // 渠道/类型指标
      channelAllData:null,
      showPie: true, // 渠道/类型 饼图和柱状图切换
      tableData: [], // 表格列表
      size: 10,
      page: 1,
      total: 0,
      iconColors:['#fe825e','#8e7eff','#3b74ff','#ff6081','#fec107','#17cd31'],
      icons:["icon-neiye-zongxiaoshoue","icon-neiye-kedanjia","icon-neiyegoumaishuai","icon-neiye-jine","icon-neiye-xiaofei","icon-neiye-xiaoshoue"],
      // 指标概览
      targetArr: [],
      // 指标趋势
      saleLineData: {
        columns: ["date", "value"],
        rows: []
      },
      // 指标趋势/折线图设置
      lineSettings: {
        itemStyle: {
          color: "#3B74FF", // 折线点颜色
          lineStyle: {
            color: "#3B74FF"
          }
        } 
      },
      // 指标趋势/折线图扩展
      lineExtend: {
        "xAxis.0.axisLabel.rotate": 45,
      },
      // 渠道
      channelData:{
        columns: ["name", "value"],
        rows: []
      },
      // 渠道设置
      channelSettings: {
      },
      // 品类
      categoryData:{
        columns: ["name", "value"],
        rows: []
      },
      // 品类设置
      categorySettings: {
        roseType: "radius",
      },
      // 饼图扩展
      pieExtend: {
        legend: {
          top: "bottom",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
       
      },
      //柱状图扩展
      barExtend: {
        barWidth: 10,
        color: "#3B74FF"
      },
      // 卖品销售表现（四象限）
      scatterData: {
        columns: ["buyRate", "unitPrice", "salesVolume"],
        rows: {}
      },
      // 散点图设置
      scatterSettings: {
        dimension: ["buyRate"], // 维度
        metrics: ["unitPrice", "salesVolume",'buyRate'], // 指标
        xAxisType: "value", // x轴类型  category, value, time, log
        xAxisName: "卖品购买率(%)", // x轴标题
        yAxisName: "客单价(元)",
        labelMap: {
          buyRate: "购买率", // 别名
          salesVolume: "销售额",
          unitPrice: "客单价",
        },
      },
      // 散点图扩展
      scatterExtend: {
        yAxis: {
          nameLocation: "end",
          nameTextStyle: {
            color: "#000",
            fontSize: 12,
            padding:[0,0,0,40],
          },
          splitLine: false,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#eee"
            }
          },
          axisLabel: {
            color: "000"
          }
        },
        xAxis: {
          nameLocation: "middle",
          nameTextStyle: {
            color: "#000",
            fontSize: 12,
            padding:20,
          },
          splitLine: false,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#eee"
            }
          },
          axisLabel: {
            color: "000"
          }
        }
      }
    };
  },
  filters:{
    formatTargetUnit(type){
      switch(type){
        case 'xse': // 销售额
          return '万';
        break;
        case 'xscb': // 销售成本
          return '元';
        break;
        case 'xsdl': // 销售单量
          return '元';
        break;
        case 'xssl': // 销售数量
          return '个';
        break;
        case 'xsml': // 销售毛利
          return '元';
        break;
        case 'xsmlr': // 销售毛利率
          return '%';
        break;
        case 'kdj': // 客单价
          return '元';
        break;
        case 'kdl': // 客单量
          return '个';
        break;
        case 'jdj': // 件单价
          return '元';
        break;
        case 'gml': // 购买率
          return '%';
        break;
        case 'rjmpje': // 人均卖品金额
          return '元';
        break;
        case 'hyxfzb': // 会员消费占比
          return '%';
        break;
        case 'tcxfzb': // 套餐消费占比
          return '%';
        break;
        case 'cbj': // 成本价
          return '元';
        break;
      }
    }
  },
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.getData();
      this.getTargetView();
      this.getTargetTrend();
      this.getChannelData();
      this.getGoodsData();
    },
    // 1.区域列表
    getData() {
      let params = {
        body: {
          userId:this.userId,
          startDate: this.startTime,
          endDate: this.endTime,
          member:this.memberType,
          dateType: this.timeType
        }
      };
      this.$camList.SaleData(params).then(response => {
        let res = response.data;
        if (res) {
          let resData = res;
          // 3.初始化表格
          this.tableData = resData.sellGoodsList.list.slice(0);
          this.tableData.forEach(item => {
            item.buyRate = item.buyRate + "%";
            item.salesGrossProfitRate = item.salesGrossProfitRate + "%";
            item.memberSalesVolumePercent = item.memberSalesVolumePercent + "%";
            item.setmealSalesVolumePercent = item.setmealSalesVolumePercent + "%";
            item.salesVolume =
              ((item.salesVolume * 1) / 10000).toFixed(2) + "万";
          });
          this.total = resData.sellGoodsList.total;
        }
      });
    },
    // 2.卖品指标概览
    getTargetView(codes){
      let params = {
        body:{
          userId:this.userId,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
          indicatorCodes:codes,
        }
      };
      this.$camList.saleTargetView(params).then(response =>{
        let res = response.data;
        this.targetArr = res;
      })
    },
    // 3.卖品指标趋势
    getTargetTrend(){
      let params = {
        body:{
          userId:this.userId,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
          bsiCodes:this.saleAllType,
        }
      };
      this.$camList.switchTarget(params).then(response =>{
        let res = response.data;
        this.saleLineAllData = res;
        this.saleTableData = res.indicatorSellGoods;
        if(res[this.saleType].sellAnalysis){
            this.saleLineData.rows = res[this.saleType].sellAnalysis.map(item=>{
            return {
              date:item.name,
              value:item.value,
            }
          })
        }
      })      
    },
    // 4. 渠道/品类数据
    getChannelData() {
      let id = this.channelType;
       let params = {
        body:{
          userId:this.userId,
          bsiCodes:this.saleAllType,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
        }
      };
      this.$camList.switchChannel(params).then(response =>{
          let res = response.data;
          this.channelAllData = res;
          let resData = res[id];
          if(resData.category){
            this.categoryData.rows = resData.category;
          }
          if(resData.channel){
            this.channelData.rows = resData.channel
          }
          if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
              this.showPie = true;
          } else {
              this.showPie = false;
          }
      })
    },
    // 5. 销售表现
    getGoodsData() {
      let params = {
        body: {
          userId:this.userId,
          groupId: this.groupId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member:this.memberType,
        }
      };
      this.$camList.SaleGoodsData(params).then(response => {
        let res = response.data;
        if (res.sellGoodsAll) {
          let data = res.sellGoodsAll;
          if (data) {
            for (var key in data) {
              data[key][0].buyRate = data[key][0].buyRate.toFixed(2); // 购买率
            }
            this.scatterData.rows = data;
          }
        }
      });
    },
    // 6.区域分页
    getTableData() {
      let params = {
        body: {
          userId:this.userId,
          groupId: this.groupId,
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member:this.memberType,
          pageNo: this.page,
          pageSize: this.size
        }
      };
      this.$camList.cityTabelData(params).then(response => {
        let res = response.data;
        if (res.sellGoodsList) {
          this.tableData = res.sellGoodsList.list;
        }
      });
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
        this.endTime = this.$moment(option).format('YYYY-MM-DD')
      }
      this.getAllData();
    },
    // 改变/会员
    changeMemberType(id) {
      this.memberType = id;
      this.getAllData();
    },
    // 改变/指标概览(环比/同比)
    changeRadio(id) {
      this.ratioType = id;
    },
    // 改变/卖品指标趋势类型
    changeSaleType(id) {
      this.saleType = id;
      if(this.saleLineAllData[this.saleType].sellAnalysis){
          this.saleLineData.rows = this.saleLineAllData[this.saleType].sellAnalysis.map(item=>{
            return {
              date:item.name,
              value:item.value,
            }
          })
      }
    },
    // 改变/渠道及品类分布
    changeChannelType(id) {
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
      this.channelType = id;
      let resData = this.channelAllData[id];
      if(resData.category){
        this.categoryData.rows = resData.category;
      }
      if(resData.channel){
        this.categoryData.rows = resData.channel;
      }
      if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
        this.showPie = true;
      } else {
        this.showPie = false;
      }
    },
    // 指标设置/弹窗
    showTargetSetting() {
      let targetDialog = this.$refs.targetDailog;
      let params = {
        body:{
          userId:this.userId
        }
      };
      this.$camList.saleTargetBinding(params).then(response =>{
        let res = response.data;
        targetDialog.profit = res.profit;
        targetDialog.ratio = res.ratio;
        targetDialog.sale = res.sale;
        targetDialog.show = true;
      })
    },
    // 前往城市版
    goDetail(id) {
      this.$router.push({ name: "城市体卖品分析", query: { cityId: id } });
    },
    // 查询
    search(){
      this.getAllData()
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
