<template>
  <div class="content serve-good">
<!--    <div class="breadcrumb">-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--        <el-breadcrumb-item :to="{ path: '/retail/commodityInformationStore/list' }">门店商品管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>{{typeText}}服务商品</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <el-form
            :inline="true"
            ref="ruleForm"
            :model="queryData"
            label-position="left"
            label-width="85px"
            label-suffix=":"
    >
      <el-collapse v-model="activeNames">
        <!-- 基础信息 start-->
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品类型">
                  <span>服务商品</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="商品编码">
                  <span>{{queryData.code}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item prop="className" label="商品分类">
                  <span>{{queryData.className}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item
                        prop="shorthandCode"
                        label="速记代码"
                >
                  <span>{{queryData.shorthandCode}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item
                        prop="name"
                        label="商品名称"
                >
                  <span>{{queryData.name}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="销售别名">
                  <span>{{queryData.aliasName}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品规格">
                  <span>{{queryData.spec}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="品牌">
                  <span>{{queryData.brandName}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item
                        prop="unitUid"
                        label="基本单位"
                >
                  <span>{{queryData.unitName}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box good-img-col left">
                <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
                  <img class="upload-img" :src="queryData.imgUrl" alt>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="包装条码">
                  <span>{{queryData.barCode}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品描述">
                  <span>{{queryData.remark}}</span>
                </el-form-item>
              </div>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 销售信息 start-->
        <el-collapse-item title="销售信息" name="2">
          <div class="basic-box">
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="售价">
                  <span v-if="routeQuery.type==3">{{queryData.price}}</span>
                  <el-input class="price-inp" v-else type="number" v-model="queryData.price"></el-input>&nbsp;&nbsp;元
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="销售状态">
                  <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
                  <el-radio-group v-else v-model="queryData.canSale">
                    <el-radio label="1" value="1">允许</el-radio>
                    <el-radio label="0" value="0">禁止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-row>
            <el-row class="putaway-timer">
              <div class="form-item-box left">
                <el-form-item prop="upTime" label="上架时间">
                  <span v-if="routeQuery.type==3">{{queryData.upTime}}</span>
                  <el-date-picker
                          v-else
                          class="date-picker"
                          v-model="queryData.upTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm"
                          value-format="yyyy-MM-dd HH:mm"
                          placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
              </div>
              <div class="form-item-box left down-time">
                <el-form-item prop="downTime" label="下架时间">
                  <span v-if="routeQuery.type==3">{{queryData.downTime ? queryData.downTime : '不限制'}}</span>
                  <div v-else>
                    <el-select v-model="queryData.downTimeType" placeholder="请选择" class="apply-select">
                      <el-option label="不限制" value="0"></el-option>
                      <el-option label="指定时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker
                            v-if="queryData.downTimeType==1"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            class="date-picker"
                            v-model="queryData.downTime"
                            type="datetime"
                            placeholder="选择日期"
                    ></el-date-picker>
                  </div>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="适用门店">
                  <span>{{saleCinemaType(queryData.saleCinema)}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="适用渠道">
                  <span v-if="routeQuery.type==3" :class="queryData.saleChannel!=1 ? 'examine':''">
                     <span v-if="queryData.saleChannel==1">全部渠道</span>
                     <span v-else class="examine examine-tit incise"
                           @click="handleDialog('myChannelDialog')">{{ selectedChannelName}} </span>
                  </span>
                  <div v-else>
                    <el-select v-model="queryData.cinemaSaleChannel" placeholder="请选择" class="apply-select">
                      <el-option
                              v-for="item in applyChannelRadios"
                              :key="item.type"
                              :label="item.label"
                              :value="item.type"
                      ></el-option>
                    </el-select>
                    <span class="apply-tag select-input" v-if="queryData.cinemaSaleChannel!='1'">
                        <el-input
                                class="input apply-stores-input"
                                placeholder="请选择"
                                v-model="selectedChannelName"
                                clearable
                                @focus="handleDialog('myChannelDialog')"
                                @clear="handleDeleteChanne"
                        >
                       </el-input>
                        <el-button
                                type="primary" plain
                                v-if="routeQuery.type!=3"
                                @click.stop="handleDialog('myChannelDialog')"
                        >{{selectedChannelName?"编辑":"选择"}}</el-button>
                    </span>
                  </div>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label-width="160px" label="是否只允许套餐内售卖">
                  <span v-if="routeQuery.type==3">{{queryData.isSaleAsSetMeal == 1 ? '允许':'禁止'}}</span>
                  <el-radio-group v-else v-model="queryData.isSaleAsSetMeal">
                    <el-radio label="1" value="1">是</el-radio>
                    <el-radio label="0" value="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="销售地点">
                  <span v-if="routeQuery.type==3" :class="queryData.salePlace!=1 ? 'examine':''">
                     <span v-if="queryData.saleChannel==1">全部地点</span>
                     <span v-else class="examine examine-tit incise"
                           @click="handleDialog('mySalesPlaceDialog')">{{ salesPlaceName}} </span>
                  </span>
                  <div v-else>
                    <el-select v-model="queryData.salePlace" placeholder="请选择" class="apply-select">
                      <el-option
                              v-for="item in salesPlaceRadios"
                              :key="item.type"
                              :label="item.label"
                              :value="item.type"
                      ></el-option>
                    </el-select>
                    <span class="apply-tag select-input" v-if="queryData.salePlace!='1'">
                        <el-input
                                class="input apply-stores-input"
                                placeholder="请选择"
                                v-model="salesPlaceName"
                                clearable
                                @focus="handleDialog('mySalesPlaceDialog')"
                                @clear="handleDeletePlace"
                        >
                       </el-input>
                        <el-button
                                type="primary" plain
                                v-if="routeQuery.type!=3"
                                @click.stop="handleDialog('mySalesPlaceDialog')"
                        >{{salesPlaceName?"编辑":"选择"}}</el-button>
                 </span>
                  </div>
                </el-form-item>
              </div>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 销售信息 end-->
      </el-collapse>

      <div class="submit-box" v-if="routeQuery.type!=3">
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保 存</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </div>
      <div v-else class="submit-box">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-form>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" :dialogFeedbackData="queryData.cinemaSaleChannelEntityList" :cinemaUid="routeQuery.cinemaUid"  :multiple="multipleCinemal"
                    :title="cinemalDialogTittle"
                    :check="routeQuery.type==3 && queryData.saleCinema!=1"></channel-dialog>
    <!-- 选择销售地点 -->
    <sales-place ref="mySalesPlaceDialog" @onSumit="onSalesPlaceSumit" :cinemaUid="routeQuery.cinemaUid" :dialogFeedbackData="queryData.cinemaSalePlaceEntityList"
                 :check="routeQuery.type==3 && queryData.salePlace!=1" :multiple="multipleCinemal" :title="salesPlaceTittle"></sales-place>
  </div>
</template>

<script>
  import moment from "moment";
  import mixin from "cim/mixins/cim/paginationConfig.js";
  import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
  import channelDialog from "cim/components/channelDialog/channelDialog.vue";
  import brandDialog from "cim/components/brandDialog/brandDialog.vue";
  import salesPlace from "cim/components/salesPlace/salesPlace.vue";

  export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        //基础信息
        type: "3", //商品类型：3-服务商品
        uid: "", //总部商品id
        cinemaSkuUid: "", //门店商品id 修改时候需要
        // cinemaSkuUid: "7286a0e8-d8e2-44f2-873b-5a83880a480b", //门店商品id
        code: "", //商品编码
        classUid: "", //商品分类
        className: "",
        shorthandCode: "", //速记代码
        name: "", //商品名称
        aliasName: "", //销售别名
        spec: "", //商品规格
        unitUid: "", //基本单位
        brandUid: "", //品牌
        remark: "", //商品描述
        barCode: "", //包装条码
        imgUrl:
          "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1306880214,1632905597&fm=26&gp=0.jpg", //商品图片
        //销售信息
        price: "", //价格
        canSale: "1", //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: "1", //适用门店 1全部门店 0指定门店 2排除门店
        cinemaEntityList: [],
        cinemaSaleChannel: "1", //适用渠道 1全部渠道 0指定渠道
        cinemaSaleChannelEntityList: [],
        isSaleAsSetMeal: "1", //是否只允许套餐内售卖
        salePlace: "1", //销售地点 1全部 0指定地点
        cinemaSalePlaceEntityList: []
      },
      unitOptions: [], //基本单位
      brandOptions: [], //品牌
      selectedBranchName: "",
      selectedStoreName: "",
      applyStoresRadios: [
        {
          label: "全部门店",
          type: "1"
        },
        {
          label: "指定门店",
          type: "0"
        },
      ],
      selectedChannelName: "",
      applyChannelRadios: [
        {
          label: "全部渠道",
          type: "1"
        },
        {
          label: "指定渠道",
          type: "0"
        }
      ],
      salesPlaceName: "",
      salesPlaceRadios: [
        {
          label: "全部地点",
          type: "1"
        },
        {
          label: "指定地点",
          type: "0"
        }
      ],
      submitLoading:false,
      activeNames: ['1', '2', '3'],
      multipleCinemal: true,
      cinemalDialogTittle: "选择适用门店",
      salesPlaceTittle: "选择销售地点",
    };
  },
  activated(){
    // this.init();
  },
  mounted() {
    this.init();
    // console.log(this.queryData);
    console.log(this.routeMerData);
  },
  methods: {
    init() {
      switch (this.routeQuery.type) {
              // 新建
        case "1":
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.className = this.routeMerData.uidname;
          this.queryData.classUid = this.routeMerData.uid;
          this.synproFindUnitList({catUid: this.routeMerData.uid});
          // this.classBrandQuery({ catUid: this.routeMerData.uid });
          break;
              //修改
        case "2":
          this.merServiceGoodsQuery({
            uid: this.routeMerData.uid
          });
          break;
              //查看
        case "3":
          this.merServiceGoodsQuery({
            uid: this.routeMerData.uid
          });
          break;
      }
    },
    setCheckedKys(radios) {
      radios.forEach(item => {
        if (item.value) {
          item.checkedKys = item.value.map(valueItem => {
            return valueItem.id;
          });
        }
      });
    },
    // 获取基本单位
    synproFindUnitList(param) {
      this.$cimList.headquartersGoods
              .merUnitList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.unitOptions = resData.data;
          }
        })
        .catch(err => {});
    },
    // 获取品牌列表
    classBrandQuery(param) {
      this.$cimList.headquartersGoods
              .merBandList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.brandOptions = resData.data.list;
          }
        })
        .catch(err => {});
    },
    handleSubmit() {
      console.log(this.queryData);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if ((this.queryData.cinemaSaleChannel == 0) && (!this.queryData.cinemaSaleChannelEntityList || this.queryData.cinemaSaleChannelEntityList.length == 0)) {
            this.$message("请选择至少一个指定渠道！");
            return
          }
          if ((this.queryData.salePlace == 0) && (!this.queryData.cinemaSalePlaceEntityList || this.queryData.cinemaSalePlaceEntityList.length == 0)) {
            this.$message("请选择至少一个指定地点！");
            return
          }
          if(this.queryData.downTimeType == 0){
            this.queryData.downTime = null;
          }
          if (this.routeQuery.type == 1) {
          } else if (this.routeQuery.type == 2) {
            this.cinemaServiceGoodsUpdate(this.queryData);
          } else if (this.routeQuery.type == 3) {
            //查看
          }
        } else {
          this.$message("带*号的为必填项，请填写");
          return false;
        }
      });
    },
    // 取消提交信息
    handleCancel() {
      this.$router.go(-1);
    },
    // 查看服务商品
    merServiceGoodsQuery(param) {
      this.$cimList.storequartersGoods.cinemaServiceGoodsQuery(param)
        .then(resData => {
          if (resData.code == 200) {
            if (resData.data.downTime) {
              resData.data.downTimeType = "1";
            } else {
              resData.data.downTimeType = "0";
            }
            this.queryData = resData.data;
            this.queryData.cinemaUid = this.routeMerData.cinemaUid
            if (this.queryData.canSale != null) {
              this.queryData.canSale = this.queryData.canSale.toString();
            }
            if (this.queryData.isSaleAsSetMeal != null) {
              this.queryData.isSaleAsSetMeal = this.queryData.isSaleAsSetMeal.toString();
            }
            if (this.queryData.cinemaSaleChannel == null) {
              this.queryData.cinemaSaleChannel = this.queryData.saleChannel.toString();
            } else {
              this.queryData.cinemaSaleChannel = this.queryData.cinemaSaleChannel.toString();
            }
            if (this.queryData.saleCinema != null) {
              this.queryData.saleCinema = this.queryData.saleCinema.toString();
            }
            if (this.queryData.salePlace != null) {
              this.queryData.salePlace = this.queryData.salePlace.toString();
            }else{
              this.queryData.salePlace = "1"
            }
            if (resData.data.cinemaSaleChannelEntityList) {
              this.selectedChannelName = resData.data.cinemaSaleChannelEntityList.map(item => {
                return item.channelName
              }).join(",")
              this.queryData.cinemaSaleChannelEntityList = this.queryData.cinemaSaleChannelEntityList.map(item => {
                item.name = item.channelName;
                return item
              })
            }
            if (resData.data.cinemaSalePlaceEntityList) {
              this.salesPlaceName = resData.data.cinemaSalePlaceEntityList.map(item => {
                return item.placeName
              }).join(",")
              this.queryData.cinemaSalePlaceEntityList = this.queryData.cinemaSalePlaceEntityList.map(item => {
                item.placeUid = item.placeUid || item.uid;
                return item
              })
            }
          }
        });
    },
    // 门店修改
    cinemaServiceGoodsUpdate(param) {
      this.submitLoading =true;
      this.$cimList.storequartersGoods
        .cinemaServiceGoodsUpdate(param)
        .then(resData => {
          this.submitLoading =false;
          if (resData.code == 200) {
            this.$message("修改成功");
            this.handleCancel();
          } else {
            this.$message(resData.msg);
          }
        }).catch(()=>{
        this.submitLoading =false;
      })
    },
    handleDialog(name) {
       if (this.routeQuery.type == 3) {
         this.multipleCinemal = false;
         this.cinemalDialogTittle = "查看适用门店";
         this.salesPlaceTittle = "查看销售地点";
       }
      this.$refs[name].handleDialog(true);
    },
    // 门店
    onCinemalSumit(data = []) {
      this.queryData.cinemaEntityList = data.map(item => {
        return {
          cinemaUid: item.uid
        };
      });
      this.selectedStoreName = data
              .map(item => {
                return item.name;
              })
              .join(",");
      console.log("门店数据", data);
    },
    // 渠道
    onChanneSumit(data = []) {
      this.queryData.cinemaSaleChannelEntityList = data.map(item => {
        return {
          channelUid: item.channelUid   ||  item.uid,
          name:item.channelName  || item.name,
        };
      });
      this.selectedChannelName = data
              .map(item => {
                return item.channelName  || item.name;
              })
              .join(",");
      console.log("渠道数据", data);
    },
    // 销售地点
    onSalesPlaceSumit(data = []) {
      this.queryData.cinemaSalePlaceEntityList = data.map(item => {
        return {
          placeUid: item.placeUid || item.uid,
          name:item.placeName || item.name
        };
      });

      this.salesPlaceName = data
              .map(item => {
                return item.placeName ||  item.name;
              })
              .join(",");
      console.log("销售地点数据", data);
    },
    // 品牌
    onBrandSumit(data = []) {
      this.queryData.brandUid = data[0].uid;
      this.selectedBranchName = data[0].name;
      console.log("品牌数据", data);
    },
    //删除门店
    handleDeleteCinemas() {
      this.onCinemalSumit([]);
    },
    //删除渠道
    handleDeleteChanne() {
      this.onChanneSumit([]);
    },
    //删除d地点
    handleDeletePlace() {
      this.onSalesPlaceSumit([]);
    },
    //删除品牌
    handleDeleteBranchs() {
      this.onBrandSumit([{uid: "", name: ""}]);
    },
    saleCinemaType(type) {
      switch (type) {
        case "0":
          return this.routeQuery.cinemaName;
          break;
        case "1":
          return this.routeQuery.cinemaName;
          break;
        case "2":
          return this.routeQuery.cinemaName;
          break;
      }
    }
  },
  computed: {
    routeQuery() {
      return this.$route.query;
    },
    routeMerData() {
      if (this.$route.query.data) {
        return JSON.parse(this.$route.query.data);
      } else {
        return {};
      }
    },
    typeText() {
      //1新建，2修改，3查看
      switch (this.routeQuery.type) {
        // 单品
        case "1":
          return "新建";
          break;
        // 套餐
        case "2":
          return "编辑";
          break;
        // 合成品
        case "3":
          return "查看";
          break;
      }
    }
  },
  components: {
    cinemalDialog,
    channelDialog,
    brandDialog,
    salesPlace
  }
};
</script>

<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.serve-good {
  .price-inp {
    width: 100px;
  }

  .good-img-col {
    position: relative;

    .good-img-form-item {
      position: absolute;
      z-index: 2;
    }
  }
}
</style>