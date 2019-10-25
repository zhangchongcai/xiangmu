<template>
  <div class="content set-meal">
    <!--    <div class="breadcrumb">-->
    <!--      <el-breadcrumb separator-class="el-icon-arrow-right">-->
    <!--        <el-breadcrumb-item :to="{ path: '/retail/commodityInformation/list' }">总部商品管理</el-breadcrumb-item>-->
    <!--        <el-breadcrumb-item>{{typeText}}套餐</el-breadcrumb-item>-->
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
                  <span>套餐</span>
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
                  <span>{{queryData.className}}</span>
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="速记代码" prop="shorthandCode" :rules="[{ required: routeQuery.type==3 ? false : true, message: '速记代码不能为空',trigger: 'change' }, {pattern:/^[0-9a-zA-Z_-]{6}$/,message: '请输入6位英文字母或数字!'}]">
                  <span v-if="routeQuery.type==3">{{queryData.shorthandCode}}</span>
                  <el-input v-else placeholder class="common-basic-input" v-model="queryData.shorthandCode"></el-input>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item prop="name" label="商品名称" :rules="[{ required: routeQuery.type==3 ? false : true, message: '商品名称不能为空',trigger: 'change' }]">
                  <span v-if="routeQuery.type==3">{{queryData.name}}</span>
                  <el-input v-else placeholder class="common-basic-input" v-model="queryData.name"></el-input>
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
                <el-form-item label="商品描述" prop="remark">
                  <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
                  <el-input v-else class="common-basic-input" v-model="queryData.remark" type="textarea" :rows="4"></el-input>
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
        <!-- 套餐信息 start-->
        <el-collapse-item title="套餐信息" name="2">
          <div>
            <div class="clearfix add-btn">
              <el-button v-if="routeQuery.type!=3" class="right" @click="handleAddGoods" type="primary" plain>添加商品</el-button>
            </div>
            <div class="recipe-box" v-for="(item,groupIndex) in formattingDataList" :key="item.id" v-show="(item.isOption==0 && item.options.length==0) || item.options.length>0">
              <div class="add-material clearfix">
                <div class="left" v-if="item.isOption != 0">{{item.merName}} 可替换为以下商品</div>
              </div>
              <div>
                <el-table :data="item.options" v-loading="tableLoding">
                  <el-table-column v-for="item in formatRecipeTableColumn(item)" :key="item.key" :prop="item.key" :label="item.label" :width="item.width" :render-header="item.renderHeader" :formatter="item.formatter">
                    <template slot-scope="{row}" name="header">
                      <div v-if="item.edit">
                        <span v-if="routeQuery.type==3">{{row[item.key]}}</span>
                        <el-input v-else size="small" type="number" v-model="row[item.key]" placeholder></el-input>
                      </div>
                      <div v-else-if="item.bothEdit">
                        <div v-if="routeQuery.type==3">
                          <span>{{row[item.key].flag==0 ? '加价':'减价'}}</span>
                          <span>{{row[item.key].price}}</span>
                        </div>

                        <div v-else>
                          <el-select v-model="row.addOrMinus.flag" placeholder class="both-edit-inp">
                            <el-option label="加价" value="0"></el-option>
                            <el-option label="减价" value="1"></el-option>
                          </el-select>
                          <el-input size="small" class="both-edit-inp" type="number" v-model="row[item.key].price" placeholder></el-input>
                        </div>
                      </div>
                      <div v-else>
                        <span>{{row[item.key]}}</span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="操作" v-if="routeQuery.type!=3" width="170">
                    <template slot-scope="{row,$index}">
                      <el-button v-if="item.isOption == 0" type="text" size="small" @click.stop="handleAddOptionalItems(row, $index)">添加可选商品
                      </el-button>
                      <el-button type="text" size="small" @click.stop="handleRecipeTableDlete(groupIndex,row, $index)">删除
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <!-- 套餐信息 end-->

        <!-- 销售信息 start-->
        <el-collapse-item title="销售信息" name="3">
          <div>
            <el-row>
              <div class="form-item-box left">
                <el-form-item prop="price" label="售价" :rules="[{ required: routeQuery.type==3 ? false : true, message: '售价不能为空',trigger: 'change' },{ validator: priceValidator, trigger:'change'}]">
                  <span v-if="routeQuery.type==3">{{queryData.price}}</span>
                  <el-input v-else class="price-inp" type="number" :value="queryData.price" @input="priceInputEvent($event)"></el-input> 元
                </el-form-item>
              </div>
              <div class="form-item-box left">
                <el-form-item label="销售状态" prop="canSale">
                  <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许销售':'禁止销售'}}</span>
                  <el-radio-group v-model="queryData.canSale" v-else>
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
                      <el-option key="0" label="不限制" value="0"></el-option>
                      <el-option key="1" label="指定时间" value="1"></el-option>
                    </el-select>
                    <el-date-picker v-if="queryData.downTimeType==1" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" class="date-picker" v-model="queryData.downTime" type="datetime" placeholder="选择日期"></el-date-picker>
                  </div>
                </el-form-item>
              </div>
            </el-row>
            <el-row>
              <div class="form-item-box left">
                <el-form-item label="适用门店">
                  <span v-if="routeQuery.type==3">
                    <span v-if="queryData.saleCinema==1">{{saleCinemaType(queryData.saleCinema) }} </span>
                    <span v-else class="examine" @click="handleDialog('myCinemalDialog')">
                      <span class="examine-tit incise">{{ selectedStoreName}}</span><span>共 {{queryData.cinemas.length}} 家</span>
                    </span>
                  </span>
                  <div v-else>
                    <el-select v-model="queryData.saleCinema" placeholder="请选择" class="apply-select">
                      <el-option v-for="item in applyStoresRadios" :key="item.type" :label="item.label" :value="item.type"></el-option>
                    </el-select>
                    <span class="apply-tag select-input" v-if="queryData.saleCinema!='1'">
                      <el-input class="input apply-stores-input" placeholder="请选择" v-model="selectedStoreName" clearable @focus="handleDialog('myCinemalDialog')" @clear="handleDeleteCinemas">
                      </el-input>
                      <el-button type="primary" plain @click.stop="handleDialog('myCinemalDialog')">选择</el-button>
                    </span>
                  </div>
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
                      <el-button type="primary" plain v-if="routeQuery.type!=3" @click.stop="handleDialog('myChannelDialog')">选择</el-button>
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
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :multiple="multipleCinemal" :check="routeQuery.type==3 && queryData.saleCinema!=1" :dialogFeedbackData="queryData.cinemas" :title="cinemalDialogTittle"></cinemal-dialog>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" :dialogFeedbackData="queryData.channels" :multiple="multipleCinemal" :check="routeQuery.type==3 &&  queryData.saleChannel!=1" :title="channelDialogTittle"></channel-dialog>
    <!-- 选择商品 -->
    <selected-goods :dialogVisible.sync="selectedGoodsDialogVisible" :dialogFeedbackData="goodList" :merType="'1,2'" @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"></selected-goods>
  </div>
</template>

<script>
import moment from 'moment';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import applyStores from 'cimSrc/components/applyStores/applyStores.vue';
import applyChannel from 'cimSrc/components/applyChannel/applyChannel.vue';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import channelDialog from 'cimSrc/components/channelDialog/channelDialog.vue';
import selectedGoods from 'cimSrc/dialogs/cimSelectedGoods/index.vue';
import imgUpload from 'cimSrc/components/imgUpload/imgUpload.vue';

export default {
  mixins: [mixin],
  data () {
    return {
      // 查询数据
      queryData: {
        // 基础信息
        type: '4', // 商品类型：4-套餐
        classUid: '', // 类别id
        className: '', // 商品分类
        code: '', // 商品编码
        shorthandCode: '', // 速记代码
        name: '', // 商品名称
        aliasName: '', // 销售别名
        remark: '', // 商品描述
        imgUrl: '', // 商品图片
        // 套餐信息
        dataList: [],
        // 销售信息
        price: '', // 价格
        canSale: '1', // 销售状态
        upTime: moment().format('YYYY-MM-DD HH:mm'), // 上架时间
        downTimeType: '0', // 下架时间类型
        downTime: '', // 下架时间
        saleCinema: '1', // 适用门店 1全部门店 0指定门店 2排除门店
        cinemas: [],
        saleChannel: '1', // 适用渠道 1全部渠道 0指定渠道
        channels: []
      },
      // 套餐信息表头
      recipeTableColumn: [
        {
          label: '商品名称',
          key: 'merName'
        },
        {
          label: '商品编码',
          key: 'merCode'
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
          label: '商品规格',
          key: 'merSpec'
        },
        {
          label: '数量',
          key: 'merCount',
          edit: true
        },
        {
          label: '基本单位',
          key: 'unitName'
        },
        {
          label: '售价',
          key: 'price'
        },
        {
          label: '加减价金额（元）',
          key: 'addOrMinus',
          bothEdit: true,
          width: 200
        }
      ],
      isMaySelected: null, // 点击的可选商品对象
      // 套餐查询数据
      materialQueryData: {
        classUid: '', // 商品分类id
        name: '',
        merCode: '',
        shorthandCode: '',
        code: '',
        page: 1,
        pageSize: 10
      },
      materialTableData: [],
      selectedGoodsDialogVisible: false, // 添加套餐弹窗
      goodList: [],

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
      submitLoading: false,
      activeNames: ['1', '2', '3'],
      multipleCinemal: true,
      cinemalDialogTittle: '选择适用门店',
      channelDialogTittle: '选择适用渠道'
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
      switch (this.routeQuery.type) {
        // 新建
        case '1':
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.classUid = this.routeMerData.uid;
          this.queryData.className = this.routeMerData.uidname;
          break;
        // 修改
        case '2':
          this.setmealQuery({ uid: this.routeMerData.uid });
          break;
        // 查看
        case '3':
          this.setmealQuery({ uid: this.routeMerData.uid });
          break;
      }
    },
    handleDialog (name) {
      if (this.routeQuery.type == 3) {
        this.multipleCinemal = false;
        this.cinemalDialogTittle = '查看适用门店';
        this.channelDialogTittle = '查看适用渠道';
      }
      this.$refs[name].handleDialog(true);
    },
    // 图片上传成功回调
    successAvatarUpload (response) {
      this.queryData.imgUrl = response;
    },
    // 门店
    onCinemalSumit (data) {
      this.queryData.cinemas = data.map(item => {
        return {
          cinemaUid: item.cinemaUid || item.uid,
          name: item.cinemaName || item.name,
          uid: '' // 套餐门店的uid。为空新增，否则修改
        };
      });
      this.selectedStoreName = data
        .map(item => {
          return item.cinemaName || item.name;
        })
        .join(',');
      // console.log("门店数据", data);
    },
    // 渠道
    onChanneSumit (data) {
      this.queryData.channels = data.map(item => {
        return {
          channelUid: item.channelUid || item.uid,
          name: item.channelName || item.name,
          uid: '' // 套餐渠道的uid。为空新增，否则修改

        };
      });
      this.selectedChannelName = data
        .map(item => {
          return item.channelName || item.name;
        })
        .join(',');
      // console.log("渠道数据", data);
    },
    // 删除门店
    handleDeleteCinemas () {
      this.onCinemalSumit([]);
    },
    // 删除渠道
    handleDeleteChanne () {
      this.onChanneSumit([]);
    },
    // 图片上传成功回调
    successAvatarUpload (response) {
      this.queryData.imgUrl = response;
    },
    // 查询
    onQuery () {
      // console.log(this.queryData);
      this.materialQueryData.classUid = '';
      this.setmealLoadItems(this.materialQueryData);
    },
    // 查看
    setmealQuery (param) {
      this.$cimList.headquartersGoods
        .setmealQuery(param)
        .then(resData => {
          if (resData.code == 200) {
            if (resData.data.downTime) {
              resData.data.downTimeType = '1';
            } else {
              resData.data.downTimeType = '0';
            }
            this.queryData = resData.data;
            if (this.queryData.dataList) {
              this.queryData.dataList = this.queryData.dataList.map(item => {
                if (item.skuName) {
                  if (item.skuCode.indexOf('HC') > -1) {
                    item.merName = item.merName + '-' + item.skuName;
                  } else {
                    item.merName = item.skuName;
                  }
                }
                return item;
              });
            }

            this.selectedStoreName = resData.data.cinemas
              .map(item => {
                return item.cinemaName;
              })
              .join(',');
            this.selectedChannelName = resData.data.channels
              .map(item => {
                return item.channelName;
              })
              .join(',');
            this.queryData.cinemas = this.queryData.cinemas.map(item => {
              item.name = item.cinemaName;
              item.code = item.cinemaCode;
              if (!item.areaName) {
                item.areaName = item.area;
              }
              return item;
            });
            this.queryData.channels = this.queryData.channels.map(item => {
              item.name = item.channelName;
              return item;
            });

            this.queryData.canSale = this.queryData.canSale.toString();
            if (this.queryData.saleChannel != null) {
              this.queryData.saleChannel = this.queryData.saleChannel.toString();
            }
            if (this.queryData.saleCinema != null) {
              this.queryData.saleCinema = this.queryData.saleCinema.toString();
            }
          }
        })
        .catch(err => { });
    },
    // 新增
    setmealSave (param) {
      this.submitLoading = true;
      this.$cimList.headquartersGoods
        .setmealSave(param)
        .then(resData => {
          this.submitLoading = false;
          if (resData.code == 200) {
            if (this.routeQuery.type == 1) {
              this.$message('新建成功');
            } else {
              this.$message('修改成功');
            }
            this.handleCancel();
          } else {
            this.$message(resData.msg);
          }
        })
        .catch(err => { });
    },

    // 获取套餐商品及可选商品
    setmealLoadItems (param) {
      this.$cimList.headquartersGoods
        .setmealLoadItems(param)
        .then(resData => {
          if (resData.code == 200) {
            this.materialTableData = resData.data.list;
            this.total = resData.data.total;
          }
        })
        .catch(err => { });
    },
    // 确定提交信息
    handleSubmit () {
      // console.log(this.queryData);
      // console.log(this.formattingDataList);
      // console.log(this.requestDataList(this.formattingDataList));
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.queryData.downTimeType == 0) {
            this.queryData.downTime = null;
          }
          let tempObj = JSON.parse(JSON.stringify(this.queryData));
          tempObj.dataList = this.requestDataList(this.formattingDataList);
          if (tempObj.dataList.length > 0) {
            let isMerCountMax = [];
            tempObj.dataList.forEach(item => {
              if (!item.merCount || item.merCount <= 0 || item.merCount >= 100) {
                this.$message('商品数量0<n<100');
                isMerCountMax.push(item);
              }
            });
            if ((this.queryData.saleCinema == 0) && (this.queryData.cinemas.length == 0)) {
              this.$message('请选择至少一个指定门店！');
              return;
            }
            if ((this.queryData.saleChannel == 0) && (this.queryData.channels.length == 0)) {
              this.$message('请选择至少一个指定渠道！');
              return;
            }

            if (isMerCountMax.length == 0) {
              if (this.routeQuery.type == 1) {
                this.setmealSave(tempObj);
              } else if (this.routeQuery.type == 2) {
                this.setmealSave(tempObj);
              } else if (this.routeQuery.type == 3) {
                // 查看
              }
            }
          } else {
            this.$message('请添加一个商品');
          }
        } else {
          this.$message('带*号的为必填项，请填写');
          return false;
        }
      });
    },
    // 处理请求参数
    requestDataList (data = []) {
      let tempArr = [];
      data.forEach(item => {
        if (item.options.length > 0) {
          tempArr.push(...item.options);
        }
      });
      tempArr.map(item => {
        if (item.addOrMinus && item.addOrMinus.price) {
          item.addFlag = item.addOrMinus.flag;
          item.addPrice = item.addOrMinus.price;
        }
        return item;
      });
      return tempArr;
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
        path: '/retail/commodityInformation/list'
      });
    },

    // 选择商品确认
    selectedGoodsDialogCallBack (value) {
      if (value.btnType == 1) {
        let tempArr = value.data;
        if (this.isMaySelected) {
          // 可选商品不能选择自己
          tempArr = tempArr.filter(item => {
            return item.skuCode != this.isMaySelected.skuCode;
          });
          // 组装
          tempArr = tempArr.map(item => {
            item.parentSkuCode = this.isMaySelected.skuCode;
            item.isChange = 1;
            item.uid = null;
            item.merCount = 1;  // 可换商品固定为1个，不能修改
            return item;
          });
        } else {
          tempArr = tempArr.map(item => {
            item.parentSkuCode = item.skuCode;
            item.uid = null;
            return item;
          });
        }
        this.queryData.dataList.push(...tempArr);
        // console.log(this.queryData.dataList,"1")
        this.queryData.dataList = this.unRepeat(this.queryData.dataList);
        // console.log(this.queryData.dataList,"2")
      }
    },
    // 去重
    unRepeat (arr) {
      let hash = {};
      return arr.reduce((item, next) => {
        if (!hash[next.skuCode]) {
          hash[next.skuCode] = true;
          item.push(next);
        }
        return item;
      }, []);
    },
    priceValidator (rule, value, callback) {
      if (value < 0 || value >= 1000) {
        return callback(new Error('售价0<n<1000'));
      } else {
        callback();
      }
    },
    priceInputEvent (value) {
      this.queryData.price = value.replace(/^(.*\..{2}).*$/, '$1');
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.onQuery();
    },
    // 添加商品
    handleAddGoods (value) {
      this.isMaySelected = null;
      this.selectedGoodsDialogVisible = true;
      this.goodList = [];
    },
    // 添加可选商品
    handleAddOptionalItems (row, index) {
      this.goodList = [];
      this.isMaySelected = row;
      this.selectedGoodsDialogVisible = true;
    },

    // 删除商品
    handleRecipeTableDlete (groupIndex, row, index) {
      this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
        customClass: 'retail-style',
        dangerouslyUseHTMLString: true,
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        center: true
      }).then(() => {
        this.queryData.dataList = this.queryData.dataList.filter((item, listIndex) => {
          return row.skuCode != item.skuCode;
        });
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      })
        .catch(() => { });
    },
    // 确定选择适用渠道
    handleChannelCheckedNodes (checkedValue) {
      this.checkedNodes(this.applyChannelRadios, checkedValue);
    },
    checkedNodes (radios = [], checkedValue) {
      radios.forEach(item => {
        if (item.type == checkedValue.type) {
          if (checkedValue.value) {
            item.value = checkedValue.value;
            item.name = checkedValue.value
              .map(valueItem => {
                return valueItem.label;
              })
              .join(',');
            item.checkedKys = checkedValue.value.map(valueItem => {
              return valueItem.id;
            });
          }
        }
      });
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
    formatRecipeTableColumn (item) {
      let optionList = JSON.parse(JSON.stringify(this.recipeTableColumn));
      if (item.isOption == 0) {
        optionList.pop();
      } else {
        optionList.splice(7, 1);
        optionList[5].edit = false;
      }
      return optionList;
    },
    renderHeader (h, { column, $index }) {
      return h('div', {
        attrs: {
          class: 'cell' // ele原来样式
        },
        domProps: {
          innerHTML: '<span class="red">* </span>' + column.label
        }
      });
    },
    saleCinemaType (type) {
      switch (type) {
        case '0':
          return '';
          break;
        case '1':
          return '全部门店';
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
        // 套餐
        case '2':
          return '编辑';
          break;
        // 合成品
        case '3':
          return '查看';
          break;
      }
    },
    formattingDataList () {
      let allDataList = JSON.parse(JSON.stringify(this.queryData.dataList));
      let resultArr = [];
      let optionList = [];
      allDataList.forEach(item => {
        // 加价标志，0：加价，1：减价
        if (!item.addFlag || item.addFlag == 0) {
          item.addOrMinus = {
            flag: '0',
            price: item.addPrice || 0
          };
        } else {
          item.addOrMinus = {
            flag: '1',
            price: item.addPrice || 0
          };
        }
        // 不是可选商品
        if (!item.isChange || item.isChange == 0) {
          optionList.push(item);
        }
      });
      optionList.forEach(item1 => {
        item1.options = [];
        allDataList.forEach(item2 => {
          if (item1.parentSkuCode == item2.parentSkuCode) {
            // 是可选商品
            if (item2.isChange) {
              item1.options.push(item2);
            }
          }
        });
        resultArr.push(item1);
      });
      resultArr.unshift({
        isOption: 0,
        options: optionList
      });
      return resultArr;
    }
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
.set-meal {
  .add-btn {
    padding: 5px 10px;
  }
  .both-edit-inp {
    width: 80px;
  }
  .price-inp {
    width: 100px;
  }
  .add-material {
    margin-bottom: 20px;
  }
}
</style>