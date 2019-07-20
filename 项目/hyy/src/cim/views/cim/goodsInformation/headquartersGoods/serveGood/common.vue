<template>
  <div class="content serve-good">
<!--    <div class="breadcrumb">-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--        <el-breadcrumb-item :to="{ path: '/retail/commodityInformation/list' }">总部商品管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>{{typeText}}服务商品</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="queryData"
      label-position="left"
      label-width="85px"
      label-suffix="："
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
                        :rules="[{ required: routeQuery.type==3 ? false : true, message: '速记代码不能为空',trigger: 'change' }, {pattern:/^[0-9a-zA-Z_-]{6}$/,message: '请输入6位英文字母或数字!'}]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.shorthandCode}}</span>
                  <el-input v-else placeholder class="common-basic-input" v-model="queryData.shorthandCode"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item
                        prop="name"
                        label="商品名称"
                        :rules="[{ required: routeQuery.type==3 ? false : true, message: '商品名称不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.name}}</span>
                  <el-input v-else placeholder class="common-basic-input" v-model="queryData.name"></el-input>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="销售别名">
                  <span v-if="routeQuery.type==3">{{queryData.aliasName}}</span>
                  <el-input v-else placeholder class="common-basic-input" v-model="queryData.aliasName"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品规格">
                  <span v-if="routeQuery.type==3">{{queryData.spec}}</span>
                  <el-input v-else placeholder="例：350ML" class="common-basic-input" v-model="queryData.spec"></el-input>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="品牌" class="brand">
                  <span v-if="routeQuery.type==3">{{queryData.brandName}}</span>
                  <div class="select-input" v-else>
                    <el-input class="select-input" placeholder="请选择" v-model="selectedBranchName"
                              clearable
                              @clear="handleDeleteBranchs"
                              @focus="handleDialog('myBrandDialog')">
                    </el-input>
                    <el-button type="primary" plain @click.stop="handleDialog('myBrandDialog')">
                      {{selectedBranchName?"编辑":"选择"}}
                    </el-button>
                  </div>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item
                        prop="unitUid"
                        label="基本单位"
                        :rules="[{ required: routeQuery.type==3 ? false : true, message: '基本单位不能为空',trigger: 'change' }]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.unitName}}</span>
                  <el-select v-else v-model="queryData.unitUid" placeholder="请选择" class="common-basic-input">
                    <el-option
                            v-for="item in unitOptions"
                            :key="item.uid"
                            :label="item.unitName"
                            :value="item.uid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="form-item-box good-img-col left">
                <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
                  <img class="upload-img" v-if="routeQuery.type==3" :src="queryData.imgUrl" alt>
                  <img-upload v-else :url="queryData.imgUrl" @on-success="successAvatarUpload"></img-upload>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="包装条码">
                  <span v-if="routeQuery.type==3">{{queryData.barCode}}</span>
                  <el-input class="common-basic-input" v-else v-model="queryData.barCode"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品描述">
                  <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
                  <el-input
                          v-else
                          class="common-basic-input"
                          v-model="queryData.remark"
                          type="textarea"
                          :rows="4"
                  ></el-input>
                </el-form-item>
              </div>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 销售信息 start-->
        <el-collapse-item title="销售信息" name="2">
          <div>
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
            <el-row>
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
          </div>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="适用门店">
                   <span v-if="routeQuery.type==3">
                     <span v-if="queryData.saleCinema==1">{{saleCinemaType(queryData.saleCinema) }} </span>
                     <span v-else class="examine"
                        @click="handleDialog('myCinemalDialog')">
                       <span class="examine-tit incise">{{ selectedStoreName}}</span>
                       <span v-if="queryData.cinemaEntityList">共 {{queryData.cinemaEntityList.length}} 家</span>
                     </span>
                  </span>
                  <div v-else>
                    <el-select v-model="queryData.saleCinema" placeholder="请选择" class="apply-select">
                      <el-option
                              v-for="item in applyStoresRadios"
                              :key="item.type"
                              :label="item.label"
                              :value="item.type"
                      ></el-option>
                    </el-select>
                    <span class="select-input" v-if="queryData.saleCinema!='1'">
                        <el-input
                                class="input apply-stores-input"
                                placeholder="请选择"
                                v-model="selectedStoreName"
                                clearable
                                @focus="handleDialog('myCinemalDialog')"
                                @clear="handleDeleteCinemas"
                        >
                       </el-input>
                      <el-button type="primary" plain @click.stop="handleDialog('myCinemalDialog')">{{selectedStoreName?"编辑":"选择"}}</el-button>
                 </span>
                  </div>
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
                    <el-select v-model="queryData.saleChannel" placeholder="请选择" class="apply-select">
                      <el-option
                              v-for="item in applyChannelRadios"
                              :key="item.type"
                              :label="item.label"
                              :value="item.type"
                      ></el-option>
                    </el-select>
                    <span class="select-input" v-if="queryData.saleChannel!='1'">
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
            </el-row>
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
    <!-- 选择品牌弹窗 -->
    <brand-dialog ref="myBrandDialog" @onSumit="onBrandSumit" :catUid="queryData.classUid"
                  :dialogFeedbackData="[{brandUid:queryData.brandUid,name:selectedBranchName}]"></brand-dialog>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="queryData.cinemaEntityList"
                    :multiple="multipleCinemal"
                    :title="cinemalDialogTittle"
                    :check="routeQuery.type==3 && queryData.saleCinema!=1"></cinemal-dialog>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" :dialogFeedbackData="queryData.channelEntityList"
                    :multiple="multipleCinemal"
                    :check="routeQuery.type==3 &&  queryData.saleChannel!=1"
                    :title="channelDialogTittle"></channel-dialog>
  </div>
</template>

<script>
  import moment from "moment";
  import mixin from "cim/mixins/cim/paginationConfig.js";
  import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
  import channelDialog from "cim/components/channelDialog/channelDialog.vue";
  import brandDialog from "cim/components/brandDialog/brandDialog.vue";
  import imgUpload from "cim/components/imgUpload/imgUpload.vue";

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
        imgUrl:"", //商品图片
        //销售信息
        price: "", //价格
        canSale: "1", //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: "1", //适用门店 1全部门店 0指定门店 2排除门店
        cinemaEntityList: [],
        saleChannel: "1", //适用渠道 1全部渠道 0指定渠道
        channelEntityList: [],
        isSaleAsSetMeal: "1", //是否只允许套餐内售卖
        salePlace: "1" //销售地点 1全部 0指定 门店
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
      submitLoading: false,
      activeNames: ['1', '2', '3'],
      multipleCinemal: true,
      cinemalDialogTittle: "选择适用门店",
      channelDialogTittle: "选择适用渠道",
    };
  },
  created() {},
  activated(){
    // this.init();
  },
  mounted() {
    this.init();
    console.log(this.queryData);
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
          this.synproFindUnitList({catUid: this.queryData.classUid, flag: "0"});
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
    //图片上传成功回调
    successAvatarUpload(response) {
      this.queryData.imgUrl = response;
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
          if (this.queryData.canSale == 1 && !this.queryData.price) {
            this.$message("销售状态设置为允许，则标准售价不允许为空！");
            return;
          }
          if ((this.queryData.saleCinema == 0) && (!this.queryData.cinemaEntityList || this.queryData.cinemaEntityList.length == 0)) {
            this.$message("请选择至少一个指定门店！");
            return
          }
          if ((this.queryData.saleChannel == 0) && (this.queryData.channelEntityList.length == 0)) {
            this.$message("请选择至少一个指定渠道！");
            return
          }
          if(this.queryData.downTimeType == 0){
            this.queryData.downTime = null;
          }
          if (this.routeQuery.type == 1) {
            this.merServiceGoodsSave(this.queryData);
          } else if (this.routeQuery.type == 2) {
            this.merServiceGoodsUpdate(this.queryData);
          } else if (this.routeQuery.type == 3) {
            //查看
          }
        } else {
          this.$message("带*号的为必填项，请填写");
          return false;
        }
      });
    },

    // 总部新建
    merServiceGoodsSave(param) {
      this.submitLoading = true;
      this.$cimList.headquartersGoods
        .merServiceGoodsSave(param)
        .then(resData => {
          if (resData.code == 200) {
            this.submitLoading = false;
            this.$message("新建成功!");
            this.handleCancel();
          } else {
            this.$message(resData.msg);
          }
        });
    },

    // 修改
    merServiceGoodsUpdate(param) {
      this.submitLoading = true;
      this.$cimList.headquartersGoods
        .merServiceGoodsUpdate(param)
        .then(resData => {
          this.submitLoading = false;
          if (resData.code == 200) {
            this.$message("修改成功");
            this.handleCancel();
          } else {
            this.$message(resData.msg);
          }
        });
    },
    // 取消提交信息
    handleCancel() {
      this.$router.go(-1);
    },
    // 查看服务商品
    merServiceGoodsQuery(param) {
      this.$cimList.headquartersGoods
        .merServiceGoodsQuery(param)
        .then(resData => {
          if (resData.code == 200) {
            if (resData.data.downTime) {
              resData.data.downTimeType = "1";
            } else {
              resData.data.downTimeType = "0";
            }
            this.queryData = resData.data;
            this.selectedBranchName = this.queryData.brandName;
            if (this.queryData.canSale != null) {
              this.queryData.canSale = this.queryData.canSale.toString();
            }
            if (this.queryData.isSaleAsSetMeal != null) {
              this.queryData.isSaleAsSetMeal = this.queryData.isSaleAsSetMeal.toString();
            }
            if (this.queryData.saleChannel != null) {
              this.queryData.saleChannel = this.queryData.saleChannel.toString();
            }
            if (this.queryData.saleCinema != null) {
              this.queryData.saleCinema = this.queryData.saleCinema.toString();
            }
            if (resData.data.cinemaEntityList) {
              this.selectedStoreName = resData.data.cinemaEntityList.map(item => {
                return item.cinemaName
              }).join(",")
              this.queryData.cinemaEntityList = this.queryData.cinemaEntityList.map(item => {
                item.name = item.cinemaName;
                return item
              })
            }
            if (resData.data.channelEntityList) {
              this.selectedChannelName = resData.data.channelEntityList.map(item => {
                return item.channelName
              }).join(",")
              this.queryData.channelEntityList = this.queryData.channelEntityList.map(item => {
                item.name = item.channelName;
                return item
              })
            }
            this.synproFindUnitList({catUid: this.queryData.classUid, flag: "0"});


          }
        });
    },
    // 门店修改
    cinemaServiceGoodsUpdate(param) {
      this.$cimList.storequartersGoods
        .cinemaServiceGoodsUpdate(param)
        .then(resData => {
          if (resData.code == 200) {
          }
        });
    },
    handleDialog(name) {
      if (this.routeQuery.type == 3) {
        this.multipleCinemal = false;
        this.cinemalDialogTittle = "查看适用门店"
        this.channelDialogTittle = "查看适用渠道"
      }
      this.$refs[name].handleDialog(true);
    },
    // 门店
    onCinemalSumit(data = []) {
      this.queryData.cinemaEntityList = data.map(item => {
        return {
          cinemaUid: item.cinemaUid  || item.uid,
          name:item.cinemaName || item.name,
        };
      });
      this.selectedStoreName = data
        .map(item => {
          return item.cinemaName || item.name;
        })
        .join(",");
      console.log("门店数据", data);
    },
    // 渠道
    onChanneSumit(data = []) {
      this.queryData.channelEntityList = data.map(item => {
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
    // 品牌
    onBrandSumit(data = []) {
      this.queryData.brandUid =data[0].brandUid  || data[0].uid;
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
    //删除品牌
    handleDeleteBranchs() {
      this.onBrandSumit([{ uid: "", name: "" }]);
    },
    saleCinemaType(type) {
      switch (type) {
        case "0":
          return "";
          break;
        case "1":
          return "全部门店";
          break;
        case "2":
          return "";
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
    },
  },
  components: {
    cinemalDialog,
    channelDialog,
    brandDialog,
    imgUpload,
  }
};
</script>

<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.serve-good{
  .price-inp {
    width: 100px;
  }
  .brand{
    .select-input .el-input{
      width: 208px;
    }
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