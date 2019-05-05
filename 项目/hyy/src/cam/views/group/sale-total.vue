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
              class="reset-radios-group"
            >
              <el-radio :label="1">全部</el-radio>
              <el-radio :label="2">仅会员</el-radio>
            </el-radio-group>
          </label>
          <el-button type="primary" size="mini" style="margin-left:30px">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        指标概览
        <div class="inline-block right">
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
      <div class="section-content">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.title}}</div>
            <div class="money">
              <i class="iconfont" :class="item.icon" :style="{color:item.color}"></i>
              <span class="money-num">{{item.num}}</span>
              <span class="unit">{{item.unit}}</span>
            </div>
            <div class="ratio">
              环比
              <i></i>
              <span class="ratio-num">{{item.radio}}</span>%
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
        <div></div>
      </div>
      <div class="section-content">
        <ve-line
          :data="saleLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        渠道及品类分布
      </div>
      <div class="section-select center">
        <target-lable  @getType="changeChannelType"></target-lable>
      </div>
      <!-- 销售额、销售数量、销售毛利、销售成本 展示饼图
      销售单量、人均消费额、客单价、件单价、客单量、购买率、销售毛利率、会员消费占比展示柱形图-->
      <!-- 饼图 -->
      <div class="section-content flex" v-if="showPie">
        <div style="width:50%;">
          <ve-pie
            :data="channelPieData"
            :settings="channelSettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-pie>
        </div>
        <div style="width:50%;">
          <ve-ring
            :data="categoryPieData"
            :settings="categorySettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-ring>
        </div>
      </div>
      <!-- 柱状图 -->
      <div class="section-content flex" v-else>
        <div style="width:50%;">
          <ve-histogram :data="channelBarData" :extend="barExtend" :legend-visible="false"></ve-histogram>
        </div>
        <div style="width:50%;">
          <ve-histogram :data="categoryBarData" :extend="barExtend" :legend-visible="false"></ve-histogram>
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
        城市体详情
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column label="序号" align="center" width="60" type="index" fixed></el-table-column>
            <el-table-column label="城市体名称" align="center" min-width="90" fixed>
              <template slot-scope="scope">
                <div class="cursor" @click="goDetail(scope.row.cityId)">
                  <span class="text-blue">{{scope.row.name}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="salesVolume" label="销售额" align="center" min-width="110"></el-table-column>
            <el-table-column prop="salesOrders" label="销售单量" align="center" min-width="90"></el-table-column>
            <el-table-column prop="salesCount" label="销售数量" align="center" min-width="90"></el-table-column>
            <el-table-column prop="unitPrice" label="客单价" align="center" min-width="90"></el-table-column>
            <el-table-column prop="piecePrice" label="件单价" align="center" min-width="90"></el-table-column>
            <el-table-column prop="unitCount" label="客单量" align="center" min-width="90"></el-table-column>
            <el-table-column prop="buyRate" label="购买率" align="center" min-width="90"></el-table-column>
            <el-table-column prop="sppPrice" label="人均消费额" align="center" min-width="110px"></el-table-column>
            <el-table-column prop="sellingCost" label="销售成本" align="center" min-width="110px"></el-table-column>
            <el-table-column prop="salesGrossProfit" label="销售毛利" align="center" min-width="110px"></el-table-column>
            <el-table-column
              prop="salesGrossProfitRate"
              label="销售毛利润"
              align="center"
              min-width="110px"
            ></el-table-column>
            <el-table-column
              prop="memberSalesVolumePercent"
              label="会员消费占比"
              align="center"
              min-width="120px"
            ></el-table-column>
            <el-table-column
              prop="setmealSalesVolumePercent"
              label="套餐消费占比"
              align="center"
              min-width="120px"
            ></el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 50, 100, 400]"
            :page-size="size"
            layout=" sizes,total,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 指标设置弹窗 -->
    <target-dialog ref="targetDailog"></target-dialog>
  </div>
</template>
<script>
import TargetLable from "../partical/targetLable";
import TargetDialog from "../partical/targetDialog";
import CalendarView from '../../components/calendar/calendar'
export default {
  components: { TargetLable, TargetDialog,CalendarView},
  data() {
    this.grid = {
      show: true,
      borderColor: "#fff",
      borderColor: "#000"
    };
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
    this.markLine = {
      lineStyle: {
        color: "#666",
        type: "solid"
      },
      data: [{ type: "average", name: "平均值" }]
    };
    this.markPoint = {
      data: [
        {
          name: "最大值",
          type: "max"
        }
      ]
    };
    this.chartSettings = {
      dataType: {
        访问用户: "KMB",
        年龄: "percent",
        下单用户: "normal"
      }
    };
    this.timeNum = 32;
    this.targetNum = 68;
    this.guaguColor=[
      [this.targetNum/(this.targetNum*1 + this.timeNum*1), "#3B74FF"],[1,'#F5F5F5']
    ];
    return {
      gaugeData: {
        columns: ["name", "value"],
        rows: [
          { name: "实际完成率", value: this.targetNum},
          { name: "时间进度", value: this.timeNum}
        ]
      },
      gaugeSettings: {
        seriesMap: {
          实际完成率: {
            radius: "80%",
            endAngle: 0,
            startAngle: 180,
            min: 0,
            max: 100,
            name:'实际完成率',
            axisLine: { // 轴线
              lineStyle: {
                color: this.guaguColor,
                width: 20,
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            splitLine:{ // 分割线
                show:true,
                lineStyle:{
                  color:'#bcbcbc',
                }
            },
            axisTick:{ // 刻度线
              show:true,
            },
            axisLabel:{ // 刻度标签
              show:true,
              color:'#3B74FF'
            },
            pointer:{ // 指针
              length:'100%',
              width:2,
            },
            itemStyle:{ // 指针样式
              color:'#3B74FF',
              borderType:'dashed',
            },
            detail:{
              show:false,
            },
          },
          时间进度: {
            name:'时间进度',
            radius: "80%",
            endAngle: 0,
            startAngle: 180,
            min: 0,
            max: 100,
            axisLine: { // 轴线
              lineStyle: {
                color: this.guaguColor,
                width: 20,
                shadowColor: "#fff",
                shadowBlur: 10
              }
            },
            splitLine:{ // 分割线
              show:false,
            },
            axisTick:{ // 刻度线
              show:true,
            },
            axisLabel:{ // 刻度标线
              show:true,
              color:'#3B74FF'
            },
             pointer:{ // 指针
              length:'100%',
              width:2,
            },
            itemStyle:{ //指针样式
              borderType:'dotted',
              color:'#888'
            },
            detail:{
              show:false,
              // formatter:function(val){
              //   return val + '%'
              // },
            }
          }
        }
      },
      gaugeExtend: {
        seriesMap: {
          实际完成率: {
            radius: "80%",
            endAngle: 0,
            startAngle: 180,
            min: 0,
            max: 100,
            axisLine: {
              show: false,
              lineStyle: {
                color: [[1, "#3B74FF"]],
                width: 20,
                shadowColor: "#fff",
                shadowBlur: 10
              }
            }
          },
          时间进度: {
            radius: "80%",
            endAngle: 0,
            startAngle: 180,
            min: 0,
            max: 100,
            axisLine: {
              show: false,
              lineStyle: {
                color: [[1, "#3B74FF"]],
                width: 20,
                shadowColor: "#fff",
                shadowBlur: 10
              }
            }
          }
        }
      },
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
      memberType: 1, // 会员类型
      ratioType: 1, // 环比类型
      saleType: 1, // 卖品指标
      channelType: 1, // 渠道/类型指标
      showPie: true, // 渠道/类型 饼图和柱状图切换
      tableData: [], // 表格列表
      size: 10,
      page: 1,
      total: 0,
      // 指标概览
      targetArr: [
        {
          icon: "icon-neiye-zongxiaoshoue",
          color: "#fe825e",
          title: "总销售额",
          num: 0,
          unit: "万",
          ratio: 20
        },
        {
          icon: "icon-neiye-kedanjia",
          color: "#8e7eff",
          title: "卖品客单价",
          num: 0,
          unit: "元",
          ratio: 20
        },
        {
          icon: "icon-neiyegoumaishuai",
          color: "#3b74ff",
          title: "卖品购买率",
          num: 0,
          unit: "%",
          ratio: 20
        },
        {
          icon: "icon-neiye-jine",
          color: "#ff6081",
          title: "人均卖品金额",
          num: 0,
          unit: "元",
          ratio: 20
        },
        {
          icon: "icon-neiye-xiaofei",
          color: "#fec107",
          title: "会员消费占比",
          num: 0,
          unit: "%",
          ratio: 20
        },
        {
          icon: "icon-neiye-xiaoshoue",
          color: "#17cd31",
          title: "套餐销售占比",
          num: 0,
          unit: "%",
          ratio: 20
        }
      ],
      // 卖品指标趋势（折线）
      saleLineData: {
        columns: ["日期", "销售量"],
        rows: [
          { 日期: "1月1日", 销售量: 123 },
          { 日期: "1月2日", 销售量: 1223 },
          { 日期: "1月3日", 销售量: 2123 },
          { 日期: "1月4日", 销售量: 4123 },
          { 日期: "1月5日", 销售量: 3123 },
          { 日期: "1月6日", 销售量: 7123 }
        ]
      },
      // 折线图的设置
      lineSettings: {
        smooth: false,
        itemStyle: {
          color: "#3B74FF", // 折线点颜色
          lineStyle: {
            color: "#3B74FF"
          }
        }
      },
      // 折线图扩展
      lineExtend: {
        "xAxis.0.axisLabel.rotate": 45
      },

      // 渠道（饼图）
      channelPieData: {
        columns: ["name", "value"],
        rows: [
          {
            name: "pos机",
            value: 50
          },
          {
            name: "淘票票",
            value: 20
          }
        ]
      },
      // 渠道设置
      channelSettings: {
        // level: [["线上", "线下"], ["pos机", "淘票票", "时光网", "vc", "其他"]]
      },
      // 品类分析（玫瑰图）
      categoryPieData: {
        columns: ["name", "value"],
        rows: [
          {
            name: "爆米花",
            value: 3
          },
          {
            name: "可乐",
            value: 2
          },
          {
            name: "薯条",
            value: 2
          }
        ]
      },
      // 品类分析扩展
      categorySettings: {
        roseType: "radius"
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
        }
      },
      //柱状图扩展
      barExtend: {
        barWidth: 10,
        color: "#3B74FF"
      },
      // 渠道柱状图数据
      channelBarData: {
        columns: ["name", "value"],
        rows: [
          {
            name: "pos机",
            value: 10
          },
          {
            name: "猫眼",
            valeu: 20
          },
          {
            name: "淘票票",
            value: 30
          },
          {
            name: "百度糯米",
            value: 30
          },
          {
            name: "时光网",
            value: 30
          },
          {
            name: "自有电商",
            value: 30
          }
        ]
      },
      channelBarSetting: {
        barWidth: 10
      },
      // 品类柱状图数据
      categoryBarData: {
        columns: ["name", "value"],
        rows: [
          {
            name: "小食",
            value: 1
          },
          {
            name: "饮料",
            value: 10
          },
          {
            name: "衍生品",
            value: 11
          },
          {
            name: "套餐",
            value: 20
          },
          {
            name: "其他",
            value: 30
          }
        ]
      },

      //  城市体卖品销售表现（四象限）
      scatterData: {
        columns: ["buyRate", "unitPrice", "salesVolume"],
        rows: {
          上海: [
            {
              name: "上海",
              buyRate: 76.5,
              salesVolume: 49498,
              unitPrice: 4.3823
            }
          ],
          北京: [
            {
              name: "北京",
              buyRate: 93.98,
              salesVolume: 26071,
              unitPrice: 93.98
            }
          ],
          广州: [
            {
              name: "广州",
              buyRate: 10.5486,
              salesVolume: 26477,
              unitPrice: 10.5486
            }
          ]
        }
      },
      // 散点图设置
      scatterSettings: {
        dimension: ["buyRate"], // 维度
        metrics: ["unitPrice", "salesVolume", "buyRate"], // 指标
        xAxisType: "value", // x轴类型  category, value, time, log
        xAxisName: "卖品购买率", // x轴标题
        yAxisName: "客单价/元",
        labelMap: {
          buyRate: "购买率", // 别名
          salesVolume: "销售额",
          unitPrice: "客单价",
          name: "城市体"
        }
        // tooltipTrigger: 'axis' // 覆盖时候，提示框通过坐标轴
      },
      // 散点图扩展
      scatterExtend: {
        yAxis: {
          nameLocation: "end",
          nameTextStyle: {
            color: "#000",
            fontSize: 12
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
            padding: 30
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
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.getData();
      this.getChannelData();
      this.getGoodsData();
    },
    // 1.获取指标/卖品趋势/表格
    getData() {
      let params = {
        body: {
          groupId: 1,
          startDate: this.startTime,
          endDate: this.endTime,
          chainPerType: this.timeType
        }
      };
      this.$camList.SaleData(params).then(res => {
        if (res) {
          let resData = res;
          // 初始化指标概览
          let targetObj = {
            salesVolume: res.salesVolume, // 销售额
            unitPrice: res.unitPrice, // 客单价
            sppPrice: res.sppPrice, // 人均
            buyRate: res.buyRate, // 购买率
            memberSalesVolumePercent: res.memberSalesVolumePercent, // 会员消费占比
            setmealSalesVolumePercent: res.setmealSalesVolumePercent // 套餐
          };
          this.targetArr[0].num = this.formatFloat(
            targetObj.salesVolume / 10000,
            2
          );
          this.targetArr[1].num = this.formatFloat(targetObj.unitPrice, 2);
          this.targetArr[2].num = this.formatFloat(targetObj.buyRate, 2);
          this.targetArr[3].num = this.formatFloat(targetObj.sppPrice, 2);
          this.targetArr[4].num = this.formatFloat(
            targetObj.memberSalesVolumePercent
          );
          this.targetArr[5].num = this.formatFloat(
            targetObj.setmealSalesVolumePercent
          );
           // 2.初始化卖品指标趋势 -->分类
          this.saleLineData.rows = res.sellGoodsListByDate.yAxis.map(item => {
            return {
              日期: item.dateKey,
              销售量: item.salesVolume
            };
          });
          // 初始化表格
          this.tableData = resData.sellGoodsList.list.slice(0);
          this.tableData.forEach(item => {
            item.buyRate = item.buyRate + "%";
            item.salesGrossProfitRate = item.salesGrossProfitRate + "%";
            item.memberSalesVolumePercent = item.memberSalesVolumePercent + "%";
            item.setmealSalesVolumePercent =
              item.setmealSalesVolumePercent + "%";
            item.salesVolume =
              ((item.salesVolume * 1) / 10000).toFixed(2) + "万";
          });
          this.total = resData.sellGoodsList.total;
         
        }
      });
    },
    // 2. 获取渠道/品类数据 -->分类
    getChannelData() {
      let params = {
        body: {
          groupId: 1,
          startDate: this.startTime,
          endDate: this.endTime,
          chainPerType: this.timeType
        }
      };
      this.$camList.SaleChannelData(params).then(res => {
        if (res.sellGoodsChannel) {
          let resData = res;
          // 渠道
          this.channelPieData.rows = resData.sellGoodsChannel.yAxis.map(
            item => {
              return {
                value: item.salesVolume,
                name: item.channelName
              };
            }
          );
          // 品类
          this.categoryPieData.rows = resData.sellGoodsCategory.yAxis.map(
            item => {
              return {
                value: item.salesVolume,
                name: item.categoryName
              };
            }
          );
        }
      });
    },
    // 3. 销售表现（散点图）
    getGoodsData() {
      let params = {
        body: {
          groupId: 1,
          startDate: this.startTime,
          endDate: this.endTime,
          chainPerType: this.timeType
        }
      };
      this.$camList.SaleGoodsData(params).then(res => {
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

    // 2.改变会员
    changeMemberType(id) {
      this.memberType = id;
      this.getAllData();
    },
    //3.改变环比/同比(指标概览)
    changeRadio(id) {
      this.ratioType = id;
      // api?????
    },
    //4. 改变类型（卖品指标趋势）
    changeSaleType(id) {
      this.saleType = id;
      // api????
    },
    // 5.改变渠道及品类分布
    changeChannelType(id) {
      // console.log(id,'集团333')
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
      this.channelType = id;
      // api???
      // this.$nextTick(() => {
      //   this.getData();
      // });

      if (id == 1 || id == 3 || id == 7 || id == 9) {
        this.showPie = true;
      } else {
        this.showPie = false;
      }
      
    },
    // 前往城市版
    goDetail(id) {
      this.$router.push({ path: "/area/sale/total", query: { id: id } });
    },
    // 指标设置
    showTargetSetting() {
      this.$refs.targetDailog.visible = true;
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
    },
    // 城市体表格分页api
    getTableData() {
      let params = {
        body: {
          chainPerType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          groupId: 1,
          pageNo: this.page,
          pageSize: this.size
        }
      };
      this.$camList.cityTabelData(params).then(res => {
        if (res.sellGoodsList) {
          this.tableData = res.sellGoodsList.list;
        }
      });
    }
  }
};
</script>
