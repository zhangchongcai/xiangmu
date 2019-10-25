<template>
  <div class="content com-posite">
    <!--    <div class="breadcrumb">-->
    <!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--        <el-breadcrumb-item  :to="{ path: '/retail/commodityInformationStore/list' }">门店商品管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>{{typeText}}合成品</el-breadcrumb-item>-->
    <!--      </el-breadcrumb>-->
    <!--    </div>-->
    <div class="tittle"></div>
    <el-form ref="ruleForm" :inline="true" :model="queryData" label-position="left" label-width="85px" label-suffix="：">
      <el-collapse v-model="activeNames">
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
                  <span>{{queryData.code}}</span>
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
                <el-form-item label="速记代码" prop="shorthandCode">
                  <span>{{queryData.shorthandCode}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item prop="name" label="商品名称">
                  <span>{{queryData.name}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item prop="aliasName" label="销售别名">
                  <span>{{queryData.aliasName}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item prop="spec" label="商品规格">
                  <span>{{queryData.spec}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item prop="unitUid" label="基本单位">
                  <span>{{queryData.unitName}}</span>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="商品描述" prop="remark">
                  <span>{{queryData.remark}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box good-img-col left">
                <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
                  <img class="upload-img" :src="queryData.imgUrl" alt>
                </el-form-item>
              </div>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 原材料信息 start-->
        <el-collapse-item title="原材料信息" name="2">
          <div>
            <div class="recipe-box" v-for="(item,groupIndex) in  queryData.cinemaCombinationSkuVoList" :key="item.id">
              <el-form :inline="true" :model="item" label-position="right" label-suffix=":" inline-message>
                <el-row class="recipe-tittle-box">
                  <div>
                    <el-col :span="8">
                      <el-form-item :label="`配方${numeric(groupIndex)}名称`">
                        <span>{{item.name}}</span>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item :label="'SKU编码'">
                        <span>{{item.code}}</span>
                      </el-form-item>
                    </el-col>
                  </div>
                  <el-col :span="6">
                    <el-form-item label="售价" prop="price" :rules="[{ required: routeQuery.type==3 ? false : true, message: '售价不能为空'},{ validator: priceValidator, trigger:'change'}]">
                      <span v-if="routeQuery.type==3">{{item.price}}</span>
                      <el-input v-else class="price-inp" type="number" :value="item.price" @input="priceInputEvent($event,item)"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div>
                <el-table :data="item.cinemaMakeItemVoList" stripe v-loading="tableLoding">
                  <el-table-column v-for="item in recipeTableColumn" :key="item.key" :prop="item.key" :label="item.label" :width="item.width" :render-header="item.renderHeader" :formatter="item.formatter">
                    <template slot-scope="{row}" name="header">
                      <div v-if="item.edit">
                        <span v-if="routeQuery.type==3">{{row[item.key]}}</span>
                        <el-input v-else size="small" type="number" v-model="row[item.key]" placeholder></el-input>
                      </div>
                      <div v-else-if="item.bothEdit">
                        <span>上限</span>
                        <span>{{row[item.key].max}} -</span>
                        <span>下限</span>
                        <span>{{row[item.key].min}}</span>
                      </div>
                      <div v-else>
                        <span>{{row[item.key]}}</span>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <!-- 原材料信息 end-->

        <!-- 销售信息 start-->
        <el-collapse-item title="销售信息" name="3">
          <div>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="销售状态" prop="canSale">
                  <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许销售':'禁止销售'}}</span>
                  <el-radio-group v-else v-model="queryData.canSale">
                    <el-radio label="1">允许销售</el-radio>
                    <el-radio label="0">禁止销售</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </el-row>
            <el-row class="putaway-timer">
              <div class="form-item-box left">
                <el-form-item prop="upTime" label="上架时间">
                  <span v-if="routeQuery.type==3">{{queryData.upTime}}</span>
                  <el-date-picker v-else class="date-picker" v-model="queryData.upTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期"></el-date-picker>
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
                    <el-date-picker v-if="queryData.downTimeType==1" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" class="date-picker" v-model="queryData.downTime" type="datetime" placeholder="选择日期"></el-date-picker>
                  </div>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="适用门店">
                  <span>{{routeQuery.cinemaName}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="适用渠道">
                  <span v-if="routeQuery.type==3" :class="queryData.saleChannel!=1 ? 'examine':''">
                    <span v-if="queryData.saleChannel==1">全部渠道</span>
                    <span v-else class="examine examine-tit incise" @click="handleDialog('myChannelDialog')">{{ selectedChannelName}} </span>
                  </span>
                  <div v-else>
                    <el-select v-model="queryData.saleChannel" placeholder="请选择" class="apply-select">
                      <el-option v-for="item in applyChannelRadios" :key="item.type" :label="item.label" :value="item.type"></el-option>
                    </el-select>
                    <span class="apply-tag select-input" v-if="queryData.saleChannel!='1'">
                      <el-input class="input apply-stores-input" placeholder="请选择" v-model="selectedChannelName" clearable @focus="handleDialog('myChannelDialog')" @clear="handleDeleteChanne">
                      </el-input>
                      <el-button v-if="routeQuery.type!=3" @click.stop="handleDialog('myChannelDialog')">选择</el-button>
                    </span>
                  </div>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <!--              <div class="form-item-box left">-->
              <!--                <el-form-item prop="isSaleAsSetMeal" label-width="160px" label="是否只允许套餐内售卖">-->
              <!--                  <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>-->
              <!--                  <el-radio-group v-else v-model="queryData.isSaleAsSetMeal">-->
              <!--                    <el-radio label="1">是</el-radio>-->
              <!--                    <el-radio label="0">否</el-radio>-->
              <!--                  </el-radio-group>-->
              <!--                </el-form-item>-->
              <!--              </div>-->
              <div class="form-item-box left">
                <el-form-item label="销售地点">
                  <span v-if="routeQuery.type==3" :class="queryData.salePlace!=1 ? 'examine':''">
                    <span v-if="queryData.saleChannel==1">全部地点</span>
                    <span v-else class="examine examine-tit incise" @click="handleDialog('mySalesPlaceDialog')">{{ salesPlaceName}} </span>
                  </span>
                  <div v-else>
                    <el-select v-model="queryData.salePlace" placeholder="请选择" class="apply-select">
                      <el-option v-for="item in salesPlaceRadios" :key="item.type" :label="item.label" :value="item.type"></el-option>
                    </el-select>
                    <span class="apply-tag select-input" v-if="queryData.salePlace!='1'">
                      <el-input class="input apply-stores-input" placeholder="请选择" v-model="salesPlaceName" clearable @focus="handleDialog('mySalesPlaceDialog')" @clear="handleDeletePlace">
                      </el-input>
                      <el-button v-if="routeQuery.type!=3" @click.stop="handleDialog('mySalesPlaceDialog')">选择</el-button>
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
        <el-button @click="handleCancel">取 消</el-button>
      </div>
      <div v-else class="submit-box">
        <el-button @click="handleCancel">关 闭</el-button>
      </div>
    </el-form>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" multiple :title="'选择适用门店'"></cinemal-dialog>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" :multiple="multipleCinemal" title="选择适用渠道" :check="routeQuery.type==3 &&  queryData.saleChannel!=1" :dialogFeedbackData="queryData.cinemaSaleChannelVoList"></channel-dialog>
    <!-- 选择销售地点 -->
    <sales-place ref="mySalesPlaceDialog" @onSumit="onSalesPlaceSumit" :cinemaUid="routeQuery.cinemaUid" :multiple="multipleCinemal" :check="routeQuery.type==3 && queryData.salePlace!=1" :title="salesPlaceTittle" :dialogFeedbackData="queryData.cinemaSalePlaceVoList"></sales-place>
    <!-- 选择商品 -->
    <selected-goods :dialogVisible.sync="selectedGoodsDialogVisible" :dialogFeedbackData="goodList" :merType="'5'" @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"></selected-goods>
  </div>
</template>

<script>
import moment from 'moment';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import applyStores from 'cimSrc/components/applyStores/applyStores.vue';
import applyChannel from 'cimSrc/components/applyChannel/applyChannel.vue';
import selectedGoods from 'cimSrc/dialogs/cimSelectedGoods/index.vue';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import channelDialog from 'cimSrc/components/channelDialog/channelDialog.vue';
import salesPlace from 'cimSrc/components/salesPlace/salesPlace.vue';

export default {
  mixins: [mixin],
  data () {
    return {
      // 查询数据
      queryData: {
        // 基础信息
        type: '2', // 商品类型：2-合成品
        code: '', // 商品编码
        catUid: '', // 商品分类id
        catName: '', // 商品分类名称
        shorthandCode: '', // 速记代码
        name: '', // 商品名称
        aliasName: '', // 销售别名
        spec: '', // 商品规格
        unitUid: '', // 基本单位
        remark: '', // 商品描述
        imgUrl:
          'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1306880214,1632905597&fm=26&gp=0.jpg', // 商品图片
        // 原材料信息 //门店和总部的对象不一样
        cinemaCombinationSkuVoList: [
          {
            id: Math.random(),
            name: '标准配方',
            price: '',
            code: '',
            cinemaMakeItemVoList: []
          }
        ],
        // 销售信息
        canSale: '1', // 销售状态
        upTime: moment().format('YYYY-MM-DD HH:mm'), // 上架时间
        downTimeType: '0', // 下架时间类型
        downTime: '', // 下架时间
        saleCinema: '0', // 适用门店 1全部门店 0指定门店 2排除门店
        cinemasList: [],
        saleChannel: '0', // 适用渠道 1全部渠道 0指定渠道
        cinemaSaleChannelVoList: [],
        isSaleAsSetMeal: '1', // 是否只允许套餐内售卖
        salePlace: '0', // 适用地点 1全部地点 0指定地点
        cinemaSalePlaceVoList: []
      },
      // 原材料信息表头
      recipeTableColumn: [
        {
          label: '商品名称',
          key: 'name'
        },
        {
          label: 'SKU编码',
          key: 'skuCode'
        },
        {
          label: '速记代码',
          key: 'shorthandCode'
        },
        {
          label: '标准用量',
          key: 'needCount',
          edit: true,
          required: true,
          renderHeader: (h, { column, $index }) => {
            return h('div', {
              attrs: {
                class: 'cell' // ele原来样式
              },
              domProps: {
                innerHTML: this.routeQuery.type == 3 ? column.label : '<span class="red">* </span>' + column.label
              }
            });
          }
        },
        {
          label: '建议用量',
          key: 'count',
          bothEdit: true,
          width: 250
        },
        {
          label: '基本单位',
          key: 'unitName'
        },
        {
          label: '零售额分配比率（%）',
          key: 'rateAmount',
          edit: true,
          required: true,
          width: 170,
          renderHeader: (h, { column, $index }) => {
            return h('div', {
              attrs: {
                class: 'cell' // ele原来样式
              },
              domProps: {
                innerHTML: this.routeQuery.type == 3 ? column.label : '<span class="red">* </span>' + column.label
              }
            });
          }
        }
      ],
      selectedGoodsDialogVisible: false, // 添加原材料弹窗
      goodList: [],
      unitOptions: [],
      tableLoding: false,
      total: 0,
      selectedStoreName: '',
      applyStoresRadios: [
        {
          label: '全部门店',
          type: '1'
        },
        {
          label: '指定门店',
          type: '0'
        }
      ],
      selectedChannelName: '',
      applyChannelRadios: [
        {
          label: '全部渠道',
          type: '1'
        },
        {
          label: '指定渠道',
          type: '0'
        }
      ],
      salesPlaceName: '',
      salesPlaceRadios: [
        {
          label: '全部地点',
          type: '1'
        },
        {
          label: '指定地点',
          type: '0'
        }
      ],
      trycombinationSkuData: {},
      submitLoading: false,
      activeNames: ['1', '2', '3'],
      multipleCinemal: true,
      cinemalDialogTittle: '选择适用门店',
      salesPlaceTittle: '选择销售地点'
    };
  },
  activated () {
    // this.init();
  },
  mounted () {
    this.init();
  },

  methods: {
    init () {
      this.queryData.cinemaUid = this.routeQuery.cinemaUid;
      switch (this.routeQuery.type) {
        // 新建
        case '1':
          this.synproFindUnitList({ catUid: this.routeMerData.uid });
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.catUid = this.routeMerData.uid;
          this.queryData.catName = this.routeMerData.uidname;
          break;
        // 修改
        case '2':
          this.synproQuerySyntheticProduct({ code: this.routeMerData.merCode, cinemaUid: this.routeQuery.cinemaUid });
          break;
        // 查看
        case '3':
          this.synproQuerySyntheticProduct({ code: this.routeMerData.merCode, cinemaUid: this.routeQuery.cinemaUid });
          break;
      }
    },
    // 查询
    onQuery () {
    },
    // 获取基本单位
    synproFindUnitList (param) {
      this.$cimList.headquartersGoods
        .merUnitList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.unitOptions = resData.data;
          }
        })
        .catch(err => { });
    },
    // 选择原材料组合sku信息接口
    synproTrycombinationSku (param, callBack) {
      // callBack || () => {
      // };
      this.$cimList.headquartersGoods
        .synproTrycombinationSku(param)
        .then(resData => {
          if (resData.code == 200) {
            callBack(resData.data);
          }
        })
        .catch(err => { });
    },
    // 新建合成品
    saveSyntheticProduct (param) {
      this.submitLoading = true;
      this.$cimList.headquartersGoods
        .synproSaveSyntheticProduct(param)
        .then(resData => {
          this.submitLoading = false;
          if (resData.code == 200) {
            this.$message('新建成功!');
            this.handleCancel();
          } else {
            this.$message(resData.data || resData.msg);
          }
        })
        .catch(err => {
          this.$message(err.message);
        });
    },
    // 门店修改合成品
    synproUpdateCinemaSynthetic (param) {
      this.submitLoading = true;
      this.$cimList.storequartersGoods.synproUpdateCinemaSynthetic(param)
        .then(resData => {
          this.submitLoading = false;
          if (resData.code == 200) {
            this.$message('修改成功!');
            this.handleCancel();
          } else {
            this.$message(resData.data || resData.msg);
          }
        })
        .catch(err => { });
    },
    // 查看合成品
    synproQuerySyntheticProduct (param) {
      this.$cimList.storequartersGoods.synproqueryCinemaSynthetic(param)
        .then(resData => {
          if (resData.code == 200) {
            if (resData.data.downTime) {
              resData.data.downTimeType = '1';
            } else {
              resData.data.downTimeType = '0';
            }
            this.queryData = resData.data;
            this.queryData.canSale = this.queryData.canSale.toString();
            this.queryData.saleCinema = this.queryData.saleCinema.toString();
            this.queryData.saleChannel = this.queryData.saleChannel.toString();
            this.queryData.isSaleAsSetMeal = this.queryData.isSaleAsSetMeal.toString();
            this.queryData.salePlace = this.queryData.salePlace.toString();
            this.goodList = this.queryData.cinemaCombinationSkuVoList[0].cinemaMakeItemVoList;
            this.synproFindUnitList({ catUid: this.queryData.catUid });
            this.selectedStoreName = resData.data.cinemasList
              .map(item => {
                return item.cinemaName;
              })
              .join(',');
            this.selectedChannelName = resData.data.cinemaSaleChannelVoList
              .map(item => {
                return item.channelName;
              })
              .join(',');
            this.queryData.cinemaSaleChannelVoList = this.queryData.cinemaSaleChannelVoList.map(item => {
              item.name = item.channelName;
              return item;
            });
            if (resData.data.cinemaSalePlaceVoList) {
              this.salesPlaceName = resData.data.cinemaSalePlaceVoList.map(item => {
                return item.placeName;
              }).join(',');
              this.queryData.cinemaSalePlaceVoList = this.queryData.cinemaSalePlaceVoList.map(item => {
                item.code = item.placeCode;
                return item;
              });
              placeCode;
            }
          }
        })
        .catch(err => { });
    },
    // 确定提交信息
    handleSubmit () {
      ;
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if ((this.queryData.saleChannel == 0) && (this.queryData.cinemaSaleChannelVoList.length == 0)) {
            this.$message('请选择至少一个指定渠道！');
            return;
          }
          if ((this.queryData.salePlace == 0) && (this.queryData.cinemaSalePlaceVoList.length == 0)) {
            this.$message('请选择至少一个指定地点！');
            return;
          }
          if (this.queryData.downTimeType == 0) {
            this.queryData.downTime = null;
          }
          let flag = true;
          for (let item of this.queryData.cinemaCombinationSkuVoList) {
            if (item.price < 0 || item.price >= 1000) {
              this.$message('售价0<n<1000');
              flag = false;
              return;
            }
          }
          if (flag) {
            if (this.routeQuery.type == 1) {
              this.saveSyntheticProduct(this.queryData);
            } else if (this.routeQuery.type == 2) {
              this.synproUpdateCinemaSynthetic(this.queryData);
            } else if (this.routeQuery.type == 3) {
              // 查看
            }
          }
        } else {
          this.$message('带*号的为必填项，请填写');
          return false;
        }
      });
    },
    priceValidator (rule, value, callback) {
      if (value < 0 || value >= 1000) {
        return callback(new Error('售价0<n<1000'));
      } else {
        callback();
      }
    },
    priceInputEvent (value, row) {
      row.price = value.replace(/^(.*\..{2}).*$/, '$1');
    },
    // 取消提交信息
    handleCancel () {
      this.$store.commit('tagNav/removeTagNav', {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      });
      this.$router.push({
        path: '/retail/commodityInformationStore/list'
      });
    },
    selectedGoodsDialogCallBack (value) {
      if (value.btnType == 1) {
        this.goodList = value.data;
        let skuIds = this.goodList
          .map(item => {
            return item.skuUid;
          })
          .join(',');
        let skuCodes = this.queryData.cinemaCombinationSkuVoList
          .map(item => {
            return item.code;
          })
          .join(',');
        this.synproTrycombinationSku(
          {
            merCode: this.queryData.code,
            skuCodes: skuCodes, // 已经生成的合成品sku的code
            skuIds: skuIds // 所选原材料的skuUid
          },
          data => {
            this.queryData.cinemaCombinationSkuVoList.forEach(item => {
              if (!item.code) {
                item.code = data.code;
              }
              item.id = Math.random();
              item.cinemaMakeItemVoList = JSON.parse(
                JSON.stringify(data.cinemaMakeItemVoList)
              );
            });
            // console.log(data)
            // console.log(this.queryData.cinemaCombinationSkuVoList)
          }
        );
      }
    },
    // 添加配方分组
    handleAddrRecipeGroup () {
      let skuCodes = this.queryData.cinemaCombinationSkuVoList
        .map(item => {
          return item.code;
        })
        .join(',');
      let skuIds = this.goodList
        .map(item => {
          return item.skuUid;
        })
        .join(',');

      let tempObj = {
        id: Math.random(),
        name: '',
        price: '',
        code: '',
        cinemaMakeItemVoList: []
      };

      this.synproTrycombinationSku(
        {
          merCode: this.queryData.code,
          skuCodes: skuCodes, // 已经生成的合成品sku的code
          skuIds: skuIds // 所选原材料的skuUid
        },
        data => {
          tempObj.code = data.code;
          tempObj.cinemaMakeItemVoList = data.cinemaMakeItemVoList;
          this.queryData.cinemaCombinationSkuVoList.push(tempObj);
        }
      );
    },
    // 删除配方分组
    handleDleteRecipeGroup (index) {
      this.queryData.cinemaCombinationSkuVoList.splice(index, 1);
    },
    handleRecipeTableDlete (groupIndex, row, index) {
      this.handleDelMaterial(row);
      this.queryData.cinemaCombinationSkuVoList.forEach(item => {
        item.cinemaMakeItemVoList = item.cinemaMakeItemVoList.filter(item => {
          return item.skuCode != row.skuCode;
        });
      });
    },
    // 删除单个选择的原材料
    handleDelMaterial (row) {
      // 清空选择的原材料以及包装
      this.goodList = this.goodList.filter(item => {
        return item.skuCode != row.skuCode;
      });
    },
    handleDialog (name) {
      if (this.routeQuery.type == 3) {
        this.multipleCinemal = false;
        this.cinemalDialogTittle = '查看适用门店';
        this.salesPlaceTittle = '查看销售地点';
      }
      this.$refs[name].handleDialog(true);
    },
    // 门店
    onCinemalSumit (data = []) {
      this.queryData.cinemasList = data.map(item => {
        return {
          cinemaUid: item.uid
        };
      });
      this.selectedStoreName = data
        .map(item => {
          return item.name;
        })
        .join(',');
      // console.log("门店数据", data);
    },
    // 渠道
    onChanneSumit (data = []) {
      this.queryData.cinemaSaleChannelVoList = data.map(item => {
        return {
          channelUid: item.channelUid || item.uid,
          name: item.channelName || item.name
        };
      });
      this.selectedChannelName = data
        .map(item => {
          return item.channelName || item.name;
        })
        .join(',');
      // console.log("渠道数据", data);
    },
    // 销售地点
    onSalesPlaceSumit (data = []) {
      this.queryData.cinemaSalePlaceVoList = data.map(item => {
        return {
          placeUid: item.placeUid || item.uid,
          name: item.placeName || item.name
        };
      });

      this.salesPlaceName = data
        .map(item => {
          return item.placeName || item.name;
        })
        .join(',');
      // console.log("销售地点数据", data);
    },
    // 删除门店
    handleDeleteCinemas () {
      this.onCinemalSumit([]);
    },
    // 删除渠道
    handleDeleteChanne () {
      this.onChanneSumit([]);
    },
    // 删除d地点
    handleDeletePlace () {
      this.onSalesPlaceSumit([]);
    },
    numeric (index) {
      index = index + 1;
      let num = [
        '零',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六',
        '七',
        '八',
        '九',
        '十'
      ];
      return num[index];
    },
    saleCinemaType (type) {
      switch (type) {
        case '0':
          return '';
          break;
        case '1':
          return this.routeQuery.cinemaName;
          break;
        case '2':
          return '';
          break;
      }
    }
  },
  computed: {
    routeQuery () {
      return this.$route.query;
    },
    routeMerData () {
      if (this.$route.query.data) {
        return JSON.parse(this.$route.query.data);
      } else {
        return {};
      }
    },
    typeText () {
      // 1新建，2修改，3查看
      switch (this.routeQuery.type) {
        // 单品
        case '1':
          return '新建';
          break;
        // 原材料
        case '2':
          return '编辑';
          break;
        // 合成品
        case '3':
          return '查看';
          break;
      }
    }
  },
  components: {
    applyStores,
    applyChannel,
    selectedGoods,
    cinemalDialog,
    channelDialog,
    salesPlace
  }
};
</script>

<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.com-posite {
  .add-btn {
    margin: 5px 0;
  }
  .price-inp {
    width: 100px;
  }
  .both-edit-inp {
    width: 60px;
  }
}
</style>