<template>
  <div class="content com-posite">
<!--    <div class="breadcrumb">-->
<!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--        <el-breadcrumb-item  :to="{ path: '/retail/commodityInformation/list' }">总部商品管理</el-breadcrumb-item>-->
<!--        <el-breadcrumb-item>{{typeText}}合成品</el-breadcrumb-item>-->
<!--      </el-breadcrumb>-->
<!--    </div>-->
    <div class="tittle"></div>
    <el-form
      ref="ruleForm"
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="85px"
      label-suffix="："
    >
      <el-collapse  v-model="activeNames">
        <!-- 基础信息 start-->
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品类型">
                  <span>合成品</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="商品编码">
                  <span class="code">{{queryData.code}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品分类">
                  <span>{{queryData.catName}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item
                        label="速记代码"
                        prop="shorthandCode"
                        :rules="[{ required: routeQuery.type==3 ? false : true, message: '速记代码不能为空',trigger: 'change' }, {pattern:/^[0-9a-zA-Z_-]{6}$/,message: '请输入6位英文字母或数字!'}]"
                >
                  <span v-if="routeQuery.type==3">{{queryData.shorthandCode}}</span>
                  <el-input
                          placeholder
                          class="common-basic-input"
                          v-else
                          v-model="queryData.shorthandCode"
                  ></el-input>
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
                  <el-input v-else class="common-basic-input" v-model="queryData.name"></el-input>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item prop="aliasName" label="销售别名">
                  <span v-if="routeQuery.type==3">{{queryData.aliasName}}</span>
                  <el-input v-else class="common-basic-input" v-model="queryData.aliasName"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item prop="spec" label="商品规格">
                  <span v-if="routeQuery.type==3">{{queryData.spec}}</span>
                  <el-input placeholder="例：350ML" v-else class="common-basic-input" v-model="queryData.spec"></el-input>
                </el-form-item>
              </div>
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
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品描述" prop="remark">
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
              <div class="form-item-box good-img-col left">
                <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
                  <img class="upload-img" v-if="routeQuery.type==3" :src="queryData.imgUrl" alt>
                  <img-upload v-else :url="queryData.imgUrl" @on-success="successAvatarUpload"></img-upload>
                </el-form-item>
              </div>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 原材料信息 start-->
        <el-collapse-item title="原材料信息" name="2">
          <div>
            <div class="add-btn clearfix" v-if="routeQuery.type!=3">
              <el-button @click="selectedGoodsDialogVisible=true" type="primary" plain>添加原材料及包装</el-button>
            </div>
            <div
                    class="recipe-box"
                    v-for="(item,groupIndex) in  queryData.combinationSkuVoList"
                    :key="item.id"
            >
              <el-form :inline="true" :model="queryData" label-position="right" label-suffix=":">
                <el-row class="recipe-tittle-box">
                  <div>
                    <el-col :span="8">
                      <el-form-item
                              :label="`配方${numeric(groupIndex)}名称`"
                              :rules="[{ required: routeQuery.type==3 ? false : true, message: '配方名称不能为空'}]"
                      >
                        <span v-if="routeQuery.type==3">{{item.name}}</span>
                        <el-input v-else class="recipe-name-inp" v-model="item.name"   :disabled="queryData.combinationSkuVoList.length >1 ? false:true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="'SKU编码'">
                        <span>{{item.code}}</span>
                      </el-form-item>
                    </el-col>
                  </div>
                  <el-col :span="4">
                    <el-form-item label="售价" :rules="[{ required: routeQuery.type==3 ? false : true, message: '售价不能为空'}]">
                      <span v-if="routeQuery.type==3">{{item.price}}</span>
                      <el-input
                              v-else
                              class="price-inp"
                              type="number"
                              v-model="item.price"
                              @keyup.native="handleNumber"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4" v-if="routeQuery.type!=3">
                    <el-button
                            class="right"
                            v-if="groupIndex >0"
                            type="text"
                            size="medium"
                            @click.stop="handleDleteRecipeGroup(groupIndex)"
                    >删除配方</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <div>
                <el-table :data="item.makeItemVoList" stripe v-loading="tableLoding">
                  <el-table-column
                          v-for="item in recipeTableColumn"
                          :key="item.key"
                          :prop="item.key"
                          :label="item.label"
                          :width="item.width"
                          :render-header="item.renderHeader"
                          :formatter="item.formatter"
                  >
                    <template slot-scope="{row}" name="header">
                      <div v-if="item.edit">
                        <span v-if="routeQuery.type==3">{{row[item.key]}}</span>
                        <el-input v-else size="small" type="number" v-model="row[item.key]" placeholder></el-input>
                      </div>
                      <div v-else-if="item.bothEdit">
                        <span>上限</span>
                        <span v-if="routeQuery.type==3">{{row[item.key].max}} -</span>
                        <el-input
                                size="small"
                                v-else
                                type="number"
                                class="both-edit-inp"
                                v-model="row[item.key].max"
                                placeholder
                        ></el-input>
                        <span>下限</span>
                        <span v-if="routeQuery.type==3">{{row[item.key].min}}</span>
                        <el-input
                                v-else
                                size="small"
                                type="number"
                                class="both-edit-inp"
                                v-model="row[item.key].min"
                                placeholder
                        ></el-input>
                      </div>
                      <div v-else>
                        <span>{{row[item.key]}}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" v-if="routeQuery.type!=3">
                    <template slot-scope="{row,$index}">
                      <el-button
                              type="text"
                              size="small"
                              @click.stop="handleRecipeTableDlete(groupIndex,row, $index)"
                      >删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div v-if="routeQuery.type!=3">
              <el-button
                      icon="el-icon-circle-plus-outline"
                      @click="handleAddrRecipeGroup"
                      type="text"
              >添加配方</el-button>
            </div>
          </div>
        </el-collapse-item>
        <!-- 原材料信息 end-->

        <!-- 销售信息 start-->
        <el-collapse-item title="销售信息" name="3">
          <div>
            <el-row>
              <div class="form-item-box good-img-col left">
                <el-form-item label="销售状态" prop="canSale">
                  <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
                  <el-radio-group v-else v-model="queryData.canSale">
                    <el-radio label="1">允许</el-radio>
                    <el-radio label="0">禁止</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-row>
            <el-row class="putaway-timer">
              <div class="form-item-box good-img-col left">
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
                      <el-option key="0" label="不限制" value="0"></el-option>
                      <el-option key="1" label="指定时间" value="1"></el-option>
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
              <div class="form-item-box good-img-col left">
                <el-form-item label="适用门店">
                  <span v-if="routeQuery.type==3">
                     <span v-if="queryData.saleCinema==1">{{saleCinemaType(queryData.saleCinema) }} </span>
                     <span v-else class="examine"
                           @click="handleDialog('myCinemalDialog')">
                         <span class="examine-tit incise">{{ selectedStoreName}}</span><span>共 {{queryData.cinemasList.length}} 家</span>
                     </span>
                  </span>
                  <div v-else>
                    <el-select
                            v-model="queryData.saleCinema"
                            placeholder="请选择"
                            class="apply-select"
                    >
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
              <div class="form-item-box good-img-col left">
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
              <el-col :span="12">
                <el-form-item prop="isSaleAsSetMeal" label-width="160px" label="是否只允许套餐内售卖">
                  <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
                  <el-radio-group v-else v-model="queryData.isSaleAsSetMeal">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 销售信息 end-->
      </el-collapse>

      <div class="submit-box" v-if="routeQuery.type!=3">
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
      <div v-else class="submit-box">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-form>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :multiple="multipleCinemal"
                    :title="cinemalDialogTittle"
                    :check="routeQuery.type==3 && queryData.saleCinema!=1"
                    :dialogFeedbackData="queryData.cinemasList"></cinemal-dialog>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" :multiple="multipleCinemal"
                    :title="channelDialogTittle"
                    :check="routeQuery.type==3 &&  queryData.saleChannel!=1"
                    :dialogFeedbackData="queryData.channelsList"></channel-dialog>
    <!-- 选择商品 -->
    <selected-goods
      :dialogVisible.sync="selectedGoodsDialogVisible"
      :dialogFeedbackData="goodList"
      :merType="'5'"
      @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
    ></selected-goods>
  </div>
</template>

<script>
  import moment from "moment";
  import mixin from "cim/mixins/cim/paginationConfig.js";
  import applyStores from "cim/components/applyStores/applyStores.vue";
  import applyChannel from "cim/components/applyChannel/applyChannel.vue";
  import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
  import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
  import channelDialog from "cim/components/channelDialog/channelDialog.vue";
  import imgUpload from "cim/components/imgUpload/imgUpload.vue";

  export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        //基础信息
        type: "2", //商品类型：2-合成品
        code: "", //商品编码
        catUid: "", //商品分类id
        catName: "", //商品分类名称
        shorthandCode: "", //速记代码
        name: "", //商品名称
        aliasName: "", //销售别名
        spec: "", //商品规格
        unitUid: "", //基本单位
        remark: "", //商品描述
        imgUrl:"", //商品图片
        // 原材料信息 //门店和总部的对象不一样
        combinationSkuVoList: [
          {
            id: Math.random(),
            name: "标准配方",
            price: "",
            code: "",
            makeItemVoList: []
          }
        ],
        //销售信息
        canSale: "1", //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: "1", //适用门店 1全部门店 0指定门店 2排除门店
        cinemasList: [],
        saleChannel: "1", //适用渠道 1全部渠道 0指定渠道
        channelsList: [],
        isSaleAsSetMeal: "1", //是否只允许套餐内售卖

      },
      // 原材料信息表头
      recipeTableColumn: [
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "速记代码",
          key: "shorthandCode"
        },
        {
          label: "标准用量",
          key: "needCount",
          edit: true,
          required: true,
          renderHeader: (h, { column, $index }) => {
            return h("div", {
              attrs: {
                class: "cell" //ele原来样式
              },
              domProps: {
                innerHTML:  this.routeQuery.type == 3 ? column.label : '<span class="red">* </span>' + column.label
              }
            });
          }
        },
        {
          label: "建议用量",
          key: "count",
          bothEdit: true,
          width: 250
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "零售额分配比率（%）",
          key: "rateAmount",
          edit: true,
          required: true,
          width: 170,
          renderHeader: (h, { column, $index }) => {
            return h("div", {
              attrs: {
                class: "cell" //ele原来样式
              },
              domProps: {
                innerHTML:  this.routeQuery.type == 3 ? column.label : '<span class="red">* </span>' + column.label
              }
            });
          }
        }
      ],
      selectedGoodsDialogVisible: false, //添加原材料弹窗
      goodList: [],
      unitOptions: [],
      tableLoding: false,
      total: 0,
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
      trycombinationSkuData: {},
      submitLoading: false,
      activeNames: ['1', '2', '3'],
      multipleCinemal: true,
      cinemalDialogTittle: "选择适用门店",
      channelDialogTittle: "选择适用渠道",
    };
  },
  activated(){
    // this.init();
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      switch (this.routeQuery.type) {
        // 新建
        case "1":
          this.synproFindUnitList({ catUid: this.routeMerData.uid,flag:"0" });
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.catUid = this.routeMerData.uid;
          this.queryData.catName = this.routeMerData.uidname;
          break;
        //修改
        case "2":
          this.synproQuerySyntheticProduct({ code: this.routeMerData.merCode });
          break;
        //查看
        case "3":
          this.synproQuerySyntheticProduct({ code: this.routeMerData.merCode });
          break;
      }
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
    // 选择原材料组合sku信息接口
    synproTrycombinationSku(param, callBack) {
      callBack ? callBack : () => {};
      this.$cimList.headquartersGoods
        .synproTrycombinationSku(param)
        .then(resData => {
          if (resData.code == 200) {
            callBack(resData.data);
          }
        })
        .catch(err => {});
    },
    // 新建合成品
    saveSyntheticProduct(param) {
      this.submitLoading = true;
      this.$cimList.headquartersGoods
        .synproSaveSyntheticProduct(param)
        .then(resData => {
          this.submitLoading = false;
          if (resData.code == 200) {
            this.$message("新建成功!");
            this.handleCancel();
          } else {
            this.$message(resData.data || resData.msg);
          }
        })
        .catch(err => {
          this.$message(err.message);
        });
    },
    // 修改合成品
    updateSyntheticProduct(param) {
      this.submitLoading = true;
      this.$cimList.headquartersGoods
        .synproUpdateSyntheticProduct(param)
        .then(resData => {
          this.submitLoading = false;
          if (resData.code == 200) {
            this.$message("修改成功!");
            this.handleCancel();
          } else {
            this.$message(resData.data || resData.msg);
          }
        })
        .catch(err => {});
    },
    // 门店修改合成品
    synproUpdateCinemaSynthetic(param) {
      this.$cimList.storequartersGoods
        .synproUpdateCinemaSynthetic(param)
        .then(resData => {
          if (resData.code == 200) {
          }
        })
        .catch(err => {});
    },
    //查看合成品
    synproQuerySyntheticProduct(param) {
      this.$cimList.headquartersGoods
        .synproQuerySyntheticProduct(param)
        .then(resData => {
          if (resData.code == 200) {
            if (resData.data.downTime) {
              resData.data.downTimeType = "1";
            } else {
              resData.data.downTimeType = "0";
            }
            this.queryData = resData.data;
            this.queryData.canSale = this.queryData.canSale.toString();
            this.queryData.saleCinema = this.queryData.saleCinema.toString();
            this.queryData.saleChannel = this.queryData.saleChannel.toString();
            this.queryData.isSaleAsSetMeal = this.queryData.isSaleAsSetMeal.toString();
            this.goodList = this.queryData.combinationSkuVoList[0].makeItemVoList;
            this.synproFindUnitList({ catUid: this.queryData.catUid,flag:"0" });
            console.log("this.goodList", this.goodList);
            this.selectedStoreName = resData.data.cinemasList
              .map(item => {
                return item.cinemaName;
              })
              .join(",");
            this.selectedChannelName = resData.data.channelsList
              .map(item => {
                return item.channelName;
              })
              .join(",");
            this.queryData.cinemasList = this.queryData.cinemasList.map(item => {
              item.name = item.cinemaName;
              return item
            })
            this.queryData.channelsList = this.queryData.channelsList.map(item => {
              item.name = item.channelName;
              return item
            })
          }
        })
        .catch(err => {});
    },
    // 确定提交信息
    handleSubmit() {
      console.log(this.queryData);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if ((this.queryData.saleCinema == 0) && (this.queryData.cinemasList.length == 0)) {
            this.$message("请选择至少一个指定门店！");
            return
          }
          if ((this.queryData.saleChannel == 0) && (this.queryData.channelsList.length == 0)) {
            this.$message("请选择至少一个指定渠道！");
            return
          }
          if(this.queryData.downTimeType == 0){
            this.queryData.downTime = null;
          }
          if (this.routeQuery.type == 1) {
            this.saveSyntheticProduct(this.queryData);
          } else if (this.routeQuery.type == 2) {
            this.updateSyntheticProduct(this.queryData);
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
    selectedGoodsDialogCallBack(value) {
      console.log(value);
      if (value.btnType == 1) {
        this.goodList = value.data;
        this.addRawMaterialDialog = false;
        let skuIds = this.goodList
          .map(item => {
            return item.skuUid;
          })
          .join(",");
        let skuCodes = this.queryData.combinationSkuVoList
          .map(item => {
            return item.code;
          })
          .join(",");
        this.synproTrycombinationSku(
          {
            merCode: this.queryData.code,
            skuCodes: skuCodes, //已经生成的合成品sku的code
            skuIds: skuIds //所选原材料的skuUid
          },
          data => {
            this.queryData.combinationSkuVoList.forEach(item => {
              if (!item.code) {
                item.code = data.code;
              }
              item.id = Math.random();
              item.makeItemVoList = JSON.parse(
                JSON.stringify(data.makeItemVoList)
              );
            });
            // console.log(data)
            // console.log(this.queryData.combinationSkuVoList)
          }
        );
      }
    },
    // 添加配方分组
    handleAddrRecipeGroup() {
      let skuCodes = this.queryData.combinationSkuVoList
        .map(item => {
          return item.code;
        })
        .join(",");
      let skuIds = this.goodList
        .map(item => {
          return item.skuUid;
        })
        .join(",");

      let tempObj = {
        id: Math.random(),
        name: "",
        price: "",
        code: "",
        makeItemVoList: []
      };

      this.synproTrycombinationSku(
        {
          merCode: this.queryData.code,
          skuCodes: skuCodes, //已经生成的合成品sku的code
          skuIds: skuIds //所选原材料的skuUid
        },
        data => {
          tempObj.code = data.code;
          tempObj.makeItemVoList = data.makeItemVoList;
          this.queryData.combinationSkuVoList.push(tempObj);
          console.log(data);
        }
      );
    },
    // 删除配方分组
    handleDleteRecipeGroup(index) {
      this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
        customClass: "retail-style",
        dangerouslyUseHTMLString: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        center: true,
      }).then(() => {
        this.queryData.combinationSkuVoList.splice(index, 1);
      }).catch(() => {

      });

    },
    handleRecipeTableDlete(groupIndex, row, index) {
      console.log(groupIndex, row, index);
      this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
        customClass: "retail-style",
        dangerouslyUseHTMLString: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        center: true,
      }).then(() => {
        this.handleDelMaterial(row);
        this.queryData.combinationSkuVoList.forEach(item => {
          item.makeItemVoList = item.makeItemVoList.filter(item => {
            return item.skuCode != row.skuCode;
          });
        });
      }).catch(() => {

      });

    },
    // 删除单个选择的原材料
    handleDelMaterial(row) {
      // console.log(row)
      // 清空选择的原材料以及包装
      this.goodList = this.goodList.filter(item => {
        return item.skuCode != row.skuCode;
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
      this.queryData.cinemasList = data.map(item => {
        return {
          cinemaUid: item.cinemaUid ||  item.uid,
          name:item.cinemaName || item.name
        };
      });
      this.selectedStoreName = data
        .map(item => {
          return item.cinemaName  || item.name;
        })
        .join(",");
      console.log("门店数据", data);
    },
    // 渠道
    onChanneSumit(data = []) {
      this.queryData.channelsList = data.map(item => {
        return {
          channelUid:item.channelUid || item.uid ,
          name:item.channelName || item.name
        };
      });
      this.selectedChannelName = data
        .map(item => {
          return item.channelName  ||  item.name;
        })
        .join(",");
      console.log("渠道数据", data);
    },
    //图片上传成功回调
    successAvatarUpload(response) {
      this.queryData.imgUrl = response;
    },
    //删除门店
    handleDeleteCinemas() {
      this.onCinemalSumit([]);
    },
    //删除渠道
    handleDeleteChanne() {
      this.onChanneSumit([]);
    },
    numeric(index) {
      index = index + 1;
      let num = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十"
      ];
      return num[index];
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
        // 原材料
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
    applyStores,
    applyChannel,
    selectedGoods,
    cinemalDialog,
    channelDialog,
    imgUpload
  }
};
</script>

<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.com-posite{
  .add-btn{
    margin: 5px 0;
  }
  .price-inp {
    width: 100px;
  }
  .both-edit-inp {
    width: 60px;
  }
  .recipe-box{
    /*padding-bottom: 20px;*/
  }
  .el-form{
    .el-form-item{
      margin-bottom: 14px;
    }
    .code{
      color: #666;
    }
  }

}

</style>