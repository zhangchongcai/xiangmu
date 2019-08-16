<template>
  <div class="cinema-stock-scan-wrap">
    <div class="cinema-stock-scan-content">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="基础信息" name="1">
          <div class="basic-info">
            <el-form ref="form" :model="sizeForm" label-width="98px" size="small">
              <el-form-item label="方案名称：">
                <span class="cinema-stock-scan-text">{{data.name}}</span>
              </el-form-item>
              <el-form-item label="状态：">
                <span class="cinema-stock-scan-text">{{data.status1}}</span>
              </el-form-item>
              <el-form-item label="优先级：">
                <span class="cinema-stock-scan-text">{{data.priority}}</span>
              </el-form-item>
              <el-form-item label="有效日期：">
                <span
                  class="cinema-stock-scan-text"
                  v-if="data.startDy && data.endDy"
                >{{data.startDy.split(" ")[0]}} 至 {{data.endDy.split(" ")[0]}}</span>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
        <!-- ********************************************************************************************* -->
        <el-collapse-item title="适用条件" name="2">
          <div class="basic-info">
            <el-form ref="form" :model="sizeForm" label-width="98px" size="small">
              <el-form-item label="适用影院：">
                <template v-for="(ciCinemaItem,index) in data.ciCinemaList">
                  <span class="cinema-stock-scan-text" :key="index">{{ciCinemaItem.cinemaName}}</span>
                </template>
                <span v-if="data.useCinema==1">不限影院</span>
              </el-form-item>
              <el-form-item label="适用影厅类型：">
                <template v-for="(ciPriceHallTypeItem,index) in data.ciPriceHallType">
                  <span class="cinema-stock-scan-text" :key="index">{{ciPriceHallTypeItem.type}}</span>
                </template>
                <span v-if="data.useHallType==1" class="cinema-stock-scan-text">不限影厅</span>
              </el-form-item>
              <el-form-item label="适用影厅：">
                <el-table :data="tableData" v-if="tableData.length>0">
                  <el-table-column prop="cinemaName" label="影院"></el-table-column>
                  <el-table-column prop="hallList" label="适用影厅">
                    <template slot-scope="scope">
                      <el-tag
                        class="m-l-5"
                        v-for="(tag) in scope.row.hallList"
                        :key="tag.code"
                        type="info"
                      >{{tag.name}}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
                <span class="cinema-stock-scan-text" v-if="tableData.length<=0">全部</span>
              </el-form-item>
              <el-form-item label="适用影片：">
                <template v-for="(schBashMovieItem,index) in data.movieList">
                  <span class="cinema-stock-scan-text" :key="index">{{schBashMovieItem.name}}</span>
                </template>
                <span v-if="data.movieList.length==0" class="cinema-stock-scan-text">不限影片</span>
              </el-form-item>
              <el-form-item label="适用放映时段：" v-if="data.a">
                <template v-for="(sizeForm,index) in data.a">
                  <span class="cinema-stock-scan-text" :key="index">{{"第"+sizeForm+"周"}}</span>
                </template>
              </el-form-item>
              <el-form-item label="适用时段：">
                <div v-for=" (item,index) in data.tmList" :key="index">
                  <span class="cinema-stock-scan-text" v-if="item.monday ==1">星期一、</span>
                  <span class="cinema-stock-scan-text" v-if="item.tuesday ==1">星期二、</span>
                  <span class="cinema-stock-scan-text" v-if="item.wednesday ==1">星期三、</span>
                  <span class="cinema-stock-scan-text" v-if="item.thursday ==1">星期四、</span>
                  <span class="cinema-stock-scan-text" v-if="item.friday ==1">星期五、</span>
                  <span class="cinema-stock-scan-text" v-if="item.saturday ==1">星期六、</span>
                  <span class="cinema-stock-scan-text" v-if="item.sunday ==1">星期日</span>
                  <span
                    class="cinema-stock-scan-text cinema-stock-scan-distant"
                  >{{item.startTm}} ~ {{item.endTm}}</span>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
        <el-collapse-item title="调价设置" name="3">
          <div class="basic-info">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
              <el-tab-pane label="柜台/自助" name="first">
                <el-form ref="form" :model="sizeForm" label-width="85px" size="small">
                  <el-form-item label="适用渠道：">
                    <template
                      v-for="(ciPriceSaleChannelVoItem,index) in data.ciPriceSaleChannelVoList"
                    >
                      <span
                        class="cinema-stock-scan-text"
                        :key="index"
                        v-if="ciPriceSaleChannelVoItem.channelNature == 0||ciPriceSaleChannelVoItem.channelNature == 1"
                      >{{ciPriceSaleChannelVoItem.channelName}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="定价方案：">
                    <el-table :data="ttVoList" border style="width: 100%">
                      <el-table-column prop="movieVersionName" label="影片版本" width="180"></el-table-column>
                      <el-table-column prop="ttName" label="票类" width="180"></el-table-column>
                      <el-table-column prop="price" label="价格">
                        <template slot-scope="scope">￥{{scope.row.price}}</template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                  <el-form-item label>
                    <span class="cinema-stock-scan-text">若价格方案的定价低于发行价时，将以影片最低发行价出售。</span>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="线上网售" name="second">
                <el-form ref="form" :model="sizeForm" label-width="85px" size="small">
                  <el-form-item label="适用渠道：">
                    <template
                      v-for="(ciPriceSaleChannelVoItem,index) in data.ciPriceSaleChannelVoList"
                    >
                      <span
                        class="cinema-stock-scan-text"
                        :key="index"
                        v-if="ciPriceSaleChannelVoItem.channelNature == 2"
                      >{{ciPriceSaleChannelVoItem.channelName}}</span>
                    </template>
                  </el-form-item>
                  <el-form-item label="定价方案：">
                    <el-table :data="data.priceNetSale" border>
                      <el-table-column prop="movieVersionName" label="影片版本"></el-table-column>
                      <el-table-column prop="price" label="渠道结算票价">
                        <template slot-scope="scope">￥{{scope.row.price}}</template>
                      </el-table-column>
                      <!-- <el-table-column
                                                prop="price"
                                                label="渠道市场价">
                                                <template slot-scope="scope">
                                                    暂无
                                                </template>
                      </el-table-column>-->
                    </el-table>
                  </el-form-item>
                  <el-form-item label>
                    <span class="cinema-stock-scan-text">若价格方案的定价低于发行价时，将以影片最低发行价出售。</span>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            <el-form label-width="156px">
              <el-form-item label="分区加价：">
                <div class="cinema-stock-scan-text" v-if="data.useRegionPrice == 1">
                  <span v-for="(item,index) in data.priceRegionList" :key="index" class="m-r-10">
                    <span v-if="item.price">{{item.regionTypeName}} : {{item.price}}元</span>
                  </span>
                </div>
                <span class="cinema-stock-scan-text" v-else>否</span>
              </el-form-item>
              <el-form-item label="动态调价：">
                <div class="cinema-stock-scan-text" v-if="data.useAdjustmentPrice == 1">
                  <span v-for="(item,index) in data.priceAdjustmentList" :key="index">
                    <span
                      v-if="item.occupancyMin||item.occupancyMax"
                    >{{item.occupancyMin}}% ≤ 上座率 ≤ {{item.occupancyMax}}%</span>
                    <span v-if="item.startTime">放映前 {{item.time}} 小时</span>
                    出票价
                    <span v-if="item.adjustmentType==1">
                      <span v-if="item.price >0">+{{item.price}}元</span>
                      <span v-if="item.price <0">{{item.price}}元</span>
                    </span>
                    <span v-if="item.adjustmentType==2">打折 {{item.percentage}}%</span>
                    <br />
                  </span>
                </div>
                <span class="cinema-stock-scan-text" v-else>否</span>
              </el-form-item>
            </el-form>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="bottom-handler-tool">
        <div class="btn-area">
          <el-button type="primary" @click="goEdit">编辑</el-button>
          <el-button @click="cancelFun">关闭</el-button>
        </div>
      </div>
    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>
<script>
import FixStepTool from "ctm/components/fix-step-tool/fix-step-tool";
import fixStepMixin from "ctm/mixins/fixStepTool";
const cityOptions = [
  { name: "周一", value: "monday" },
  { name: "周二", value: "tuesday" },
  { name: "周三", value: "wednesday" },
  { name: "周四", value: "thursday" },
  { name: "周五", value: "friday" },
  { name: "周六", value: "saturday" },
  { name: "周日", value: "sunday" }
];

export default {
  data() {
    return {
      data: {
        movieList: [],
        name:''
      },
      ttVoList: [],
      tableData: [],
      activeNames: ["1", "2", "3"],
      activeName: "first",
      week: cityOptions,
      priceList: [],
      rateList: [],
      onlilneFlag: 0,
      outLineFlag: 0,
      sizeForm: {
        ciPriceProgram: {},
        ciCinemaList: [],
        ciPriceHallType: [],
        schBashMovieList: [],
        ciPriceSaleChannelVoList: [],
        priceNetSale: []
      },
      leftDisabled: false,
      rightDisabled: true,
      //交互部分数据
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "基础信息",
            isactive: false
          },
          {
            name: "适用条件",
            isactive: false
          },
          {
            name: "调价设置",
            isactive: false
          }
        ]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getDatas() {
      let self = this;
      console.log("self.$route.query.id", self.$route.query.id);
      let data = {
        programUid: self.$route.query.id
      };
      self.$ctmList
        .findPriceProgram(data)
        .then(ret => {
          if (ret.code == 200) {
            let res = ret.data;
            this.data = res;
            if (this.data.status == 0) {
              this.$set(this.data, "status1", "禁用");
            } else {
              this.$set(this.data, "status1", "启用");
            }
            this.tableData = res.ciPriceHall;
            this.ttVoList = res.ttVoList;
            if (res.movieLifeCycleStr) {
              var a = res.movieLifeCycleStr.split(",");
              this.$set(this.data, "a", a);
            }

            // if (
            //   self.sizeForm.ciPriceSaleChannelVoList.every(item => {
            //     return item.feeFlag != 0;
            //   })
            // ) {
            //   self.outLineFlag = 1;
            // }
            // if (
            //   self.sizeForm.ciPriceSaleChannelVoList.every(item => {
            //     return item.feeFlag != 2;
            //   })
            // ) {
            //   self.onlilneFlag = 1;
            // }
          }
        })
        .catch(err => {
          console.log("哪里出错了，检擦一下哥哥", err);
        });
    },
    goEdit() {
      let _this = this;
      this.$router.push({
        path: "edit",
        query: {
          id: this.$route.query.id
        }
      });
    },
    cancelFun() {
      this.$router.push({
        path: "list"
      });
    },
    //图片动画部分***************************/
    handleChange(val) {
      console.log(val);
    },
    handleCarousel(isLeft) {
      let current = this.$refs.carousel.style.transform.replace(
        /[^0-9\-,]/g,
        ""
      );
      let width = this.$refs.carousel.childNodes[0].offsetWidth;
      if (isLeft) {
        // 左
        if ((this.$refs.carousel.childNodes.length - 5) * width == -current) {
          this.leftDisabled = true;
        }
        if ((this.$refs.carousel.childNodes.length - 4) * width == -current) {
          return;
        }
        this.rightDisabled = false;
        this.$refs.carousel.style.transform = `translateX(${Number(current) -
          width}px)`;
      } else {
        // 右
        if (-current <= width) {
          this.rightDisabled = true;
        }
        if (current >= 0) {
          return;
        }
        this.leftDisabled = false;
        this.$refs.carousel.style.transform = `translateX(${Number(current) +
          width}px)`;
      }
    }
  },
  mixins: [fixStepMixin],
  created() {
    this.getDatas();
  }
};
</script>
<style lang="scss">
.cinema-stock-scan-wrap {
  width: 100%;
  position: relative;
  .cinema-stock-scan-breadcrumb {
    margin-left: 24px;
    margin-top: 10px;
    margin-bottom: 10px;
    color: 12px;
  }
  .el-collapse-item__header::after {
    height: 0px;
  }
  //新button样式
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    position: absolute;
    z-index: 999;
    bottom: 0;
    right: 0;
    // background-color: #f5f5f5;
    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }
  .basic-info {
    width: 884px;
    margin-left: 30px;
    // form css reset

    .el-table {
      .date-css {
        font-size: 12px;
        color: #666;
      }
      &::before {
        height: 0;
      }
      tr:nth-child(1n) {
        background-color: #fff;
        &:hover > td {
          background-color: #fff;
        }
      }
      tr:nth-child(2n) {
        background-color: #f5f5f5;
        &:hover > td {
          background-color: #f5f5f5;
        }
      }
      th,
      td {
        padding: 0;
        height: 38px;
        line-height: 38px;
        box-sizing: border-box;
        border: none;
      }
      th {
        background-color: rgb(242, 244, 253);
      }
      .el-table__header-wrapper {
        background-color: rgb(242, 244, 253);
      }
      .has-gutter {
        .cell {
          color: #333;
        }
      }
      .cell {
        font-size: 12px;
        color: #666;
      }
    }
    .el-form-item {
      margin-bottom: 14px;
    }
    .el-form-item__label {
      font-size: 12px;
      text-align: left;
    }
    .lable-wrap1 {
      .el-form-item__label {
        width: 156px !important;
      }
    }
    .lable-wrap2 {
      .el-form-item__label {
        width: 97px !important;
      }
    }
    .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
    }
    .cinema-stock-scan-table {
      width: 680px;
    }
    .el-form-item__label {
      font-size: 12px;
    }

    .cinema-stock-scan-text {
      font-size: 12px;
      width: 800px;
      color: #808080;
      margin-right: 10px;
    }
    .cinema-stock-scan-distant {
      margin-left: 8px;
    }
    //影片剧照list
    .main-container {
      position: relative;
      width: 100%;
      .carousel-container {
        overflow: hidden;
        width: 92%;
        margin: 0 auto;
        .carousel {
          transition: transform 1s;
          list-style: none;
          white-space: nowrap;
          width: 100%;
          .carousel-item {
            display: inline-block;
            padding: 5px;
            width: calc(25% - 10px);
            height: 200px;
            .inner-img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .el-button {
        position: absolute;
        top: 50%;
        z-index: 10;
        transform: translateY(-50%);
      }
      .arrow-left {
        left: 0;
      }
      .arrow-right {
        right: 0;
      }
    }
    // ****************************************
    .separate-accounts-date,
    .separate-accounts-price,
    .separate-accounts-action {
      display: inline-block;
      //   height: 32px;
    }
    .separate-accounts-price {
      width: 83px;
      .el-input--small {
        width: 46px;
      }
      span {
        font-size: 12px;
        color: #666666;
      }
    }
    .separate-accounts-date {
      width: 224px;
      margin-left: -12px;
      span {
        font-size: 12px;
        color: #666666;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 196px;
      }
    }
    .separate-accounts-action {
      margin-left: 6px;
      .el-button {
        border: 1px solid #3b74ff;
        color: #3b74ff;
        span {
          font-size: 12px;
        }
      }
      .el-button--mini {
        padding: 10px 5px 8px;
      }
    }
  }
  .film-info-save {
    text-align: center;
    margin-top: 12px;
    margin-bottom: 12px;
  }
  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    margin: 0 8px 0;
    transform: rotate(-90deg);
  }
  .el-collapse-item__arrow.is-active {
    transform: rotate(90deg);
  }
  .el-collapse-item__wrap {
    border: 1px solid #ffffff;
  }
}
</style>
