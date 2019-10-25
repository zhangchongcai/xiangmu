<template>
  <div class="storesingle-style">
    <div class="content">
      <!-- <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item  :to="{ path: '/retail/commodityInformationStore/list' }">门店商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{typeText}}单品</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      <el-form :inline="true" ref="ruleForm" :model="queryData" label-position="left" label-width="85px" label-suffix="：">
        <!-- 基础信息 start-->
        <!-- {{this.queryData}} -->
        <el-collapse v-model="activeNames">
          <el-collapse-item title="基础信息" name="1">
            <div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品类型">
                    <span>单品</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="商品编码">
                    <span class="col666">{{queryData.proCode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品分类">
                    <span>{{queryData.catName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="速记代码">
                    <span>{{queryData.shorthandCode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品名称" :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]">
                    <span>{{queryData.name}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="销售别名">
                    <span>{{queryData.aliasName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品规格">
                    <span>{{queryData.spec}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="品牌">
                    <span>{{queryData.brandName}}</span>
                  </el-form-item>

                </el-col>
              </el-row>
              <el-row v-if="this.skuData.length == 0">
                <el-col :span="8">
                  <el-form-item label="包装条码">
                    <span>{{queryData.skuVoList.barCode}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="基本单位" :rules="[{ required: true, message: '基本单位不能为空',trigger: 'change' }]">
                    <span>{{queryData.unitName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="产地">
                    <span>{{queryData.placeOriginName}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="商品描述">
                    <span>{{queryData.remark}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="good-img-col">
                  <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
                    <img class="upload-img" :src="queryData.imgUrl" alt>
                    <!-- imgUpload -->
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item title="采购信息" name="2">
            <div>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="进货税率" prop="taxRate" :rules="[
                      { required: false,trigger: 'change' },
                      { pattern: /^([1-9][0-9]?)$|^([0]\.[0-9]{1,2})$|^([1-9][0-9]?\.[0-9]{1,2})$|^([0])$|^\\./, message: '请输入最多2位数字和2位小数',trigger: 'change' }
                    ]">
                    <el-input placeholder class="basic-input200 widthInput100" v-model="queryData.taxRate" v-if="routeQuery.type != 3"></el-input>
                    <span v-if="routeQuery.type == 3">{{queryData.taxRate}}</span>
                    <span>%</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <div>采购单位</div>
              <div>
                <el-table :data="basicUnitData" stripe>
                  <el-table-column v-for="item in basicUnitColumn" :key="item.key" :prop="item.key" :label="item.label" :width="item.width" :formatter="item.formatter">
                    <template slot-scope="{row}">
                      <template>
                        <div>
                          <span>{{row[item.key]}}</span>
                        </div>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </el-collapse-item>
          <!-- 采购信息 end-->

          <!-- 销售信息 start-->
          <el-collapse-item title="销售信息" name="3">
            <div>
              <template v-model="skuData" v-if="this.skuData.length == 0">
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="SKU编码">
                      <span>{{queryData.skuVoList.code}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="售价" prop="skuVoList.price" :rules="[{ required: true, message: '售价不能为空',trigger: 'change' },{ validator: priceValidator, trigger:'change'}]">
                      <el-input placeholder class="basic-input200 widthInput100" type="number" v-if="routeQuery.type != 3" :value="queryData.skuVoList.price" @input="priceInputEvent($event)"></el-input>
                      <span v-if="routeQuery.type == 3">{{queryData.skuVoList.price}}</span>元
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="销售状态">
                      <el-radio-group v-model="queryData.canSale" v-if="routeQuery.type != 3">
                        <el-radio :label="1">允许销售</el-radio>
                        <el-radio :label="0">禁止销售</el-radio>
                      </el-radio-group>
                      <span v-if="routeQuery.type == 3">{{queryData.canSale == 1 ? "允许销售":"禁止销售"}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </template>
              <template v-if="this.skuData.length >= 1 && routeQuery.type !=3">
                <div class="sku-table">
                  <el-table :data="skuData" stripe>
                    <el-table-column v-for="item in skuColumn" :key="item.key" :prop="item.key" :label="item.label" :width="item.width" :formatter="item.formatter" :render-header="item.renderHeader">
                      <template slot-scope="{row}">
                        <div v-if="item.edit">
                          <el-input size="small" v-model="row[item.key]" placeholder></el-input>
                        </div>
                        <div v-else>
                          <span>{{row[item.key]}}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="{row,$index}">
                        <el-button type="text" size="small" @click.stop="stopskuHandleDlete(row, $index)">{{row.status == 1 ? '禁止销售':'允许销售'}}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
              <template v-if="this.skuData.length >= 1 && routeQuery.type == 3">
                <div class="sku-table">
                  <divdel-btn class="del-btn" v-if="routeQuery.type != 3">
                    <i class="el-icon-close" @click="skuDelTableEvent()"></i>
                  </divdel-btn>
                  <el-table :data="skuData" stripe>
                    <el-table-column v-for="item in routeQuery.type == 3 ? skuColumn1 : skuColumn2" :key="item.key" :prop="item.key" :label="item.label" :width="item.width" :formatter="item.formatter" :render-header="item.renderHeader">
                      <template slot-scope="{row}">
                        <div>
                          <span>{{row[item.key]}}</span>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </template>
              <el-row class="putaway-timer">
                <el-col :span="10">
                  <el-form-item label="上架时间">
                    <el-date-picker class="date-picker widthInput100" v-model="queryData.upTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-if="routeQuery.type != 3"></el-date-picker>
                    <span v-if="routeQuery.type == 3">{{queryData.upTime}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item prop="downTime" label="下架时间">
                    <span v-if="routeQuery.type==3">{{queryData.downTime == null || queryData.downTime == "" ? '不限制' : queryData.downTime}}</span>
                    <div v-else>
                      <el-select v-model="queryData.downTimeType" placeholder="请选择" class="apply-select" @change="downTimeEvent()">
                        <el-option key="0" label="不限制" value="0"></el-option>
                        <el-option key="1" label="指定时间" value="1"></el-option>
                      </el-select>
                      <el-date-picker v-if="queryData.downTimeType==1" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" class="date-picker widthInput100" v-model="queryData.downTime" type="datetime" placeholder="选择日期"></el-date-picker>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="适用门店">
                    <span>{{this.queryData.cinemaName}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="适用渠道">
                    <!-- <span v-if="routeQuery.type==3">{{queryData.saleChannel==1?"全部渠道": selectedChannelName}}</span> -->
                    <template v-if="routeQuery.type==3 && this.queryData.saleChannel === 0">
                      <div class="see-style">
                        <span class="c-type" @click="channelClick()">{{selectedChannelName}}</span>
                        <span class="c-type" @click="channelClick()">...共{{this.seechannelArr == null || this.seechannelArr == "" ? 0:this.seechannelArr.length}}家</span>
                      </div>
                    </template>
                    <template v-else-if="routeQuery.type==3 && this.queryData.saleChannel === 1">
                      <span>全部渠道</span>
                    </template>
                    <div v-else>
                      <el-select v-model="queryData.saleChannel" placeholder="请选择" class="apply-select" @change="saleChannelEvent()">
                        <el-option v-for="item in applyChannelRadios" :key="item.type" :label="item.label" :value="item.type"></el-option>
                      </el-select>
                      <span class="select-input" v-if="queryData.saleChannel!='1'">
                        <!-- <span class="select-btn" v-if="!selectedChannelName">
                        <el-button type="primary" plain @click="handleDialog('myChannelDialog')">选择</el-button>
                      </span> -->
                        <span>
                          <el-input class="input apply-stores-input" placeholder="请选择" v-model="selectedChannelName" clearable @focus="handleDialog('myChannelDialog')" @clear="handleDeleteChanne">
                          </el-input>
                          <el-button @click.stop="handleDialog('myChannelDialog')" type="primary cinemaSel-btn" plain>选择</el-button>
                        </span>
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <!-- <el-col :span="10">
                <el-form-item label-width="160px" label="是否只允许套餐内售卖">
                  <el-radio-group v-model="queryData.onlyAllowSetmeal" v-if="routeQuery.type != 3">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                  <span v-if="routeQuery.type == 3">{{queryData.onlyAllowSetmeal == 1 ? "是":"否"}}</span>
                </el-form-item>
              </el-col> -->
                <el-col :span="10">
                  <el-form-item label="销售地点">
                    <!-- <span v-if="routeQuery.type==3">{{queryData.salePlace==1?"全部地点":"指定地点"}}</span>
                  <span v-if="routeQuery.type==3">{{salesPlaceName}}</span> -->
                    <template v-if="routeQuery.type==3 && this.seeplacelArr.length !=0" style="height:40px;">
                      <div class="see-style">
                        <span class="c-type" @click="placeClick()">{{salesPlaceName}}</span>
                        <span class="c-type" @click="placeClick()">...共{{this.seeplacelArr == null || this.seeplacelArr == "" ? 0:this.seeplacelArr.length}}家</span>
                      </div>
                    </template>
                    <template v-else-if="routeQuery.type==3 && this.seeplacelArr.length ==0">
                      <span>全部地点</span>
                    </template>
                    <div v-else>
                      <el-select v-model="queryData.salePlace" placeholder="请选择" class="apply-select" @change="salePlaceEvent()">
                        <el-option v-for="item in salesPlaceRadios" :key="item.type" :label="item.label" :value="item.type"></el-option>
                      </el-select>
                      <span class="select-input" v-if="queryData.salePlace!=1">
                        <el-input class="input apply-stores-input" placeholder="请选择" v-model="salesPlaceName" clearable @focus="handleDialog('mySalesPlaceDialog')" @clear="handleplaceDeleteChanne">
                        </el-input>
                        <el-button @click.stop="handleDialog('mySalesPlaceDialog')" type="primary cinemaSel-btn" plain>选择</el-button>
                      </span>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item label="安全库存" prop="storeUpLimit">
                    <span style="color: #666;">上限：</span>
                    <el-input placeholder class="basic-input widthInput100" v-model="queryData.storeUpLimit" v-if="routeQuery.type != 3"></el-input>
                    <span v-if="routeQuery.type == 3">{{queryData.storeUpLimit}}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="10">
                  <el-form-item label="下限" prop="storeDownLimit">
                    <el-input placeholder class="basic-input widthInput100" v-model="queryData.storeDownLimit" v-if="routeQuery.type != 3"></el-input>
                    <span v-if="routeQuery.type == 3">{{queryData.storeDownLimit}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 销售信息 end-->
        <div class="submit-box">
          <el-button type="primary" @click="comSingleSubmit()" v-if="routeQuery.type != 3">保 存</el-button>
          <el-button @click="handleCancel">{{routeQuery.type !=3 ? "取消":"关闭"}}</el-button>
        </div>
      </el-form>
      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" multiple :title="'选择适用门店'"></cinemal-dialog>
      <!-- 选择渠道弹窗 -->
      <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" multiple :title="'选择适用渠道'" :dialogFeedbackData="queryData.saleChannelList" :cinemaUid="routeQuery.cinemaUid"></channel-dialog>
      <!-- 选择销售地点 -->
      <!-- :dialogFeedbackData="queryData.cinemaSalePlaceEntityList" -->
      <sales-place ref="mySalesPlaceDialog" @onSumit="onSalesPlaceSumit" :dialogFeedbackData="queryData.cinemaSalePlaceEntityList" :cinemaUid="queryData.cinemaUid" multiple></sales-place>
      <seechannel-dialog :dialogVisible.sync="dialogVisibleseechannel" :needData="JSON.stringify(this.seechannelArr)">
      </seechannel-dialog>
      <seeplace-dialog :dialogVisible.sync="dialogVisibleseeplace" :needData="JSON.stringify(this.seeplacelArr)">
      </seeplace-dialog>
    </div>
  </div>
</template>
<script>
import qs from 'qs';
import moment from 'moment';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import applyStores from 'cimSrc/components/applyStores/applyStores.vue';
import applyChannel from 'cimSrc/components/applyChannel/applyChannel.vue';
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';
import channelDialog from 'cimSrc/components/channelDialog/channelDialog.vue';
import salesPlace from 'cimSrc/components/salesPlace/salesPlace.vue';
import seechannelDialog from 'cimSrc/components/seeChannelDialog/seeCinemalDialog.vue';
import seeplaceDialog from 'cimSrc/components/seePlaceDialog/seeCinemalDialog.vue';
export default {
  mixins: [mixin],
  data () {
    return {
      dialogVisibleseeplace: false,
      seeplacelArr: [],
      dialogVisibleseechannel: false,
      seechannelArr: [],
      // 品牌弹窗
      branddialog: false,
      skuStart: false,
      ruter: '',
      aaa: {},
      skuAttr: [],
      AttributeSkudata: [],
      // 页面数据
      queryData: {
        salePlace: 1,
        cinemaSalePlaceEntityList: [],
        cinemaUid: '',
        newuid: '',
        merUid: '',
        placeOrigin: '',
        brandUid: '',
        brandName: '',
        catName: '',
        catUid: '',
        proCode: '',
        // 商品类型 1-单品
        merType: 1,
        // 商品编码
        code: '',
        // 商品分类
        classUid: '',
        // 速记代码
        shorthandCode: '',
        // 商品名称
        name: '',
        // 销售别名
        aliasName: '',
        // 商品规格
        spec: '',
        // 品牌
        brandUid: '',
        // 基本单位
        unitUid: '',
        // 产地  0国产,1进口
        placeOrigin: 0,
        // 商品图片
        imgUrl: '',
        // 商品描述
        remark: '',
        // 进货税率
        taxRate: '',
        saleChannel: 1,
        saleCinema: 1,
        // 采购单位对象集合
        purUnitList: {
          // 单位名称
          unitUid: '',
          // 采购转换系数
          purUnitRatio: ''
        },
        // sku对象集合
        skuVoList: {
          uid: '',
          // 包装条码
          barCode: '',
          // sku编码
          code: '',
          // 价格
          price: '',
          // 属性集合
          skuAttr: [],
          status: 1,
          cinemaSkuUid: ''
        },
        // 销售状态 0不允许,1允许
        canSale: 1,
        // 上架时间
        upTime: moment().format('YYYY-MM-DD HH:mm'),
        // 下架时间类型
        downTimeType: '0',
        // 下架时间
        downTime: moment().format('YYYY-MM-DD HH:mm'),
        // 是否只允许套餐内售卖 0否,1是
        onlyAllowSetmeal: 0,
        // 库存下限
        storeDownLimit: '',
        // 库存上限
        storeUpLimit: '',
        // 商品指定影院
        saleCinemaList: [],
        // 商品指定渠道
        saleChannelList: []
      },
      checkList: [],
      skuAttrcheckList: [],
      // 添加sku数据格式
      // modelValue skuAttribute
      skuAttribute: [
        {
          name: '颜色',
          modelValue: [],
          Suboptions: [{}, {}, {}, {}]
        },
        {
          name: '味道',
          modelValue: [],
          Suboptions: ['香草味', '橙味', '草莓味', '苹果味']
        },
        {
          name: '甜度',
          modelValue: [],
          Suboptions: ['原味', '多糖', '少糖']
        }
      ],
      skudialog: false,
      filterText: '',
      startTime: moment().format('YYYY-MM-DD HH:mm'),
      endTimeRadio: '0',
      endTime: '',
      // 基本单位显示
      basicUnitvalue: '',
      // 基本单位选择框
      basicUnitArr: [
        {
          value: '个',
          label: '个'
        },
        {
          value: '箱',
          label: '箱'
        },
        {
          value: '瓶',
          label: '瓶'
        }
      ],
      // 基本单位选择框
      buyUnitArr: [
        {
          value: '个',
          label: '个'
        },
        {
          value: '箱',
          label: '箱'
        },
        {
          value: '瓶',
          label: '瓶'
        }
      ],
      // 采购单位表头数组
      basicUnitColumn: [
        {
          label: '单位名称',
          key: 'name',
          selectUnit: true
        },
        {
          label: '转换系数',
          key: 'purUnitRatio',
          edit: true
        },
        {
          label: '转换公式',
          key: 'fun'
        }
      ],
      // sku属性表头
      skuColumn: [
        {
          label: 'SKU编码',
          key: 'code'
        },
        {
          label: '售价（元）',
          key: 'price',
          edit: true
        },
        {
          label: '包装条码',
          key: 'barCode'
        },
        {
          label: '销售状态',
          key: 'active'
        }
      ], // sku属性表头
      skuColumn1: [
        {
          label: 'SKU编码',
          key: 'code'
        },
        {
          label: '售价（元）',
          key: 'price'
        },
        {
          label: '包装条码',
          key: 'barCode'
        },
        {
          label: '销售状态',
          key: 'active'
        }
      ],
      // 采购单位表格数组
      basicUnitData: [],
      // 创建sku数组
      skuData: [],
      value: '',
      addRawMaterialDialog: false, // 添加原材料弹窗
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      recipeGroupList: [
        {
          attrValue: '',
          id: Math.random(),
          delFlag: 0,
          name: '标准配方',
          tableData: [
            {
              address: '奶粉',
              tername: 'YCL001',
              sku: 'CS1564654652',
              code: '124547',
              mac: '',
              dosage: { min: '', max: '' },
              mac2: 'g'
            },
            {
              address: '汤',
              tername: 'YCL002',
              sku: 'CS15646546543',
              code: '124547',
              mac: '',
              dosage: { min: '', max: '' },
              mac2: 'g'
            },
            {
              address: '中杯',
              tername: 'YCL003',
              sku: 'CS1564654654',
              code: '124547e',
              mac: '',
              dosage: { min: '', max: '' },
              mac2: '个'
            }
          ]
        }
      ],
      channelClick () {
        this.dialogVisibleseechannel = true;
      },
      placeClick () {
        this.dialogVisibleseeplace = true;
      },
      sourceTreeData: [],
      cinemaOptions: [],
      // 修改终端数据
      changeData: {
        tername: '',
        status: '',
        rackCode: '',
        placeUid: '',
        salePlaceEntity: { uid: '' }
      },
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
      activeNames: ['1', '2', '3'],
      tableColumn: [
        {
          label: '商品名称',
          key: 'address'
        },
        {
          label: '商品编码',
          key: 'tername'
        },
        {
          label: 'SKU编码',
          key: 'sku'
        },
        {
          label: '速记代码',
          key: 'code'
        },
        {
          label: '商品规格',
          key: 'mac'
        },
        {
          label: '基本单位',
          key: 'mac1'
        }
      ],
      tableData: [],
      storageRacks: [], // 仓库,货架
      salePlaces: [], // 销售地址
      tableLoding: false,
      total: 0,
      terminalStatusDialog: false,
      saleChannel: 1,
      saleCinema: 1,
      selectedStoreName: '',
      selectedChannelName: '',
      applyStoresRadios: [
        {
          label: '全部门店',
          type: 1
        },
        {
          label: '指定门店',
          type: 0
        },
        {
          label: '排除门店',
          type: 2
        }
      ],
      cinemaSalePlaceList: [
        {
          label: '全部地点',
          type: 1
        },
        {
          label: '指定地点',
          type: 0
        }
      ],
      applyChannelRadios: [
        {
          label: '全部渠道',
          type: 1
        },
        {
          label: '指定渠道',
          type: 0
        }
      ]
    };
  },
  mounted () {
    this.init();
    console.log(this.$route.query.data);
  },
  created () {
    for (let key in this.skuAttribute) {
      this.$set(this.skuAttrcheckList, key, []);
    }
  },
  methods: {
    init () {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
      if (this.$route.query.type == 3) {
        this.seesingleProductGet(JSON.parse(this.$route.query.data), JSON.parse(this.$route.query.cinemaUid));
        this.queryData.cinemaUid = JSON.parse(this.$route.query.cinemaUid);
      } else if (this.$route.query.type == 2) {
        this.seesingleProductGet(JSON.parse(this.$route.query.data), JSON.parse(this.$route.query.cinemaUid));
        this.queryData.cinemaUid = JSON.parse(this.$route.query.cinemaUid);
        this.queryData.skuVoList.code = this.queryData.proCode + Math.ceil(Math.random() * 99);
      } else if (this.$route.query.type == 1) {
        this.queryData.skuVoList.code = JSON.parse(this.$route.query.data).proCode + Math.ceil(Math.random() * 99);
        this.queryData.catName = JSON.parse(this.$route.query.data).uidname;
        this.queryData.catUid = JSON.parse(this.$route.query.data).uid;
        this.queryData.proCode = JSON.parse(this.$route.query.data).proCode;
      }
    },
    // 查看原材料
    seesingleProductGet (val1, val2) {
      let value = {
        merUid: val1,
        cinemaUid: val2
      };
      this.$cimList.storequartersGoods.singleProductGetCinema(value).then(res => {
        if (res.code === 200) {
          if (res.data.saleCinemaList != null) {
            let cinemaString = [];
            res.data.saleCinemaList.forEach((val, index, arr) => {
              cinemaString.push(val.cinemaName);
            });
            this.selectedStoreName = cinemaString.join(',');
          }
          if (res.data.cinemaSaleChannelList != null) {
            let channelString = [];
            let newcinemaSale = [];
            res.data.cinemaSaleChannelList.forEach((val, index, arr) => {
              let newObj = {};
              newObj.channelUid = val.channelUid;
              newObj.name = val.channelName;
              channelString.push(val.channelName);
              newcinemaSale.push(newObj);
            });
            this.selectedChannelName = channelString.join(',');
            this.queryData.saleChannelList = newcinemaSale;
          }
          if (res.data.cinemaSalePlaceList != null) {
            let cinemaSaleString = [];
            let newcinemaSale = [];
            res.data.cinemaSalePlaceList.forEach((val, index, arr) => {
              let newObj = {};
              newObj.placeUid = val.placeUid;
              newObj.name = val.placeName;
              cinemaSaleString.push(val.placeName);
              newcinemaSale.push(newObj);
            });
            this.salesPlaceName = cinemaSaleString.join(',');
            this.queryData.cinemaSalePlaceEntityList = newcinemaSale;
          }
          this.queryData.saleChannel = res.data.saleChannel;
          this.queryData.saleCinema = res.data.saleCinema;
          this.queryData.unitUid = res.data.unitName;
          this.queryData.newuid = res.data.cinemaMer.uid;
          this.queryData.salePlace = res.data.salePlace.toString();
          this.queryData.merUid = res.data.uid;
          this.queryData.brandName = res.data.brandName;
          this.queryData.brandUid = res.data.brandUid;
          this.queryData.catName = res.data.catName;
          this.queryData.proCode = res.data.code;
          this.queryData.uid = res.data.classUid;
          this.queryData.catUid = res.data.catUid;
          this.queryData.cuid = res.data.uid;
          this.queryData.cunitUid = res.data.unitUid;
          this.queryData.cinemaName = res.data.cinemaName;
          this.queryData.channelName = res.data.channelName;
          this.queryData.unitName = res.data.unitName;
          this.queryData.uidname = res.data.className;
          this.queryData.shorthandCode = res.data.shorthandCode;
          this.queryData.name = res.data.name;
          this.queryData.aliasName = res.data.aliasName;
          this.queryData.spec = res.data.spec;
          this.queryData.brandUid = res.data.brandUid;
          this.queryData.onlyAllowSetmeal = res.data.isSaleAsSetMeal;
          if (res.data.skuVoList[0].skuAttr.length == 0) {
            this.queryData.skuVoList.barCode = res.data.skuVoList[0].barCode;
            this.queryData.skuVoList.code = res.data.skuVoList[0].code;
            this.queryData.skuVoList.price = res.data.skuVoList[0].price;
            this.queryData.skuVoList.skuAttr = res.data.skuVoList[0].skuAttr;
            this.queryData.skuVoList.uid = res.data.skuVoList[0].skuUid;
            this.queryData.skuVoList.cinemaSkuUid = res.data.skuVoList[0].uid;
          }
          if (res.data.skuVoList[0].skuAttr.length >= 1) {
            this.skuColumnEvent1(res.data.skuVoList);
          }
          if (res.data.skuVoList[0].skuAttr.length >= 1) {
            this.skuColumnEvent2(res.data.skuVoList);
          }
          this.queryData.placeOriginName = res.data.placeOrigin == 0 ? '国产' : '进口';
          this.queryData.remark = res.data.remark;
          this.queryData.imgUrl = res.data.imgUrl;
          this.queryData.taxRate = res.data.taxRate;
          this.seechannelArr = res.data.cinemaSaleChannelList;
          this.seeplacelArr = res.data.cinemaSalePlaceList === null ? [] : res.data.cinemaSalePlaceList;
          this.queryData.canSale = res.data.canSale;
          this.queryData.downTime = res.data.downTime;
          this.queryData.upTime = res.data.upTime;
          this.queryData.downTimeType = res.data.downTime == null || res.data.downTime == '' ? '0' : '1';
          this.queryData.storeUpLimit = res.data.stockUpper;
          this.queryData.storeDownLimit = res.data.stockLower;
          let resdatapurUnitVoList = res.data.purUnitVoList == null ? [] : res.data.purUnitVoList;
          if (this.$route.query.type == 3) {
            resdatapurUnitVoList.forEach((val, index, arr) => {
              let basicUnitDataOBj = {};
              basicUnitDataOBj.name = val.name;
              basicUnitDataOBj.purUnitRatio = val.purUnitRatio;
              basicUnitDataOBj.uid = val.uid;
              basicUnitDataOBj.unitEntityUid = val.unitEntityUid;
              basicUnitDataOBj.fun = '1' + val.name + '=' + val.purUnitRatio + res.data.unitName;
              this.basicUnitData.push(basicUnitDataOBj);
            });
          } else if (this.$route.query.type == 2) {
            resdatapurUnitVoList.forEach((val, index, arr) => {
              let basicUnitDataOBj = {};
              basicUnitDataOBj.name = val.name;
              basicUnitDataOBj.purUnitRatio = val.purUnitRatio;
              basicUnitDataOBj.uid = val.uid;
              basicUnitDataOBj.unitUid = val.unitUid;
              basicUnitDataOBj.unitEntityUid = val.unitEntityUid;
              basicUnitDataOBj.fun = '1' + val.name + '=' + val.purUnitRatio + res.data.unitName;
              this.basicUnitData.push(basicUnitDataOBj);
              console.log(this.basicUnitData);
            });
          }
        } else {
          this.error(res.msg);
        }
      }).catch(err => {

      });
    },
    // 选择基本单位
    basicUnitEvent () {
      let selectedWorkName = {};
      selectedWorkName = this.basicUnitArr.find((item) => {
        return item.uid === this.queryData.unitUid;
      });
      console.log(selectedWorkName);

      let basicUnitFirstValue = {
        name: selectedWorkName.label,
        purUnitRatio: '1',
        fun: '1' + selectedWorkName.label + '=1' + selectedWorkName.label,
        unitUid: this.queryData.unitUid
      };

      this.basicUnitData.splice(0, 1, basicUnitFirstValue);
    },
    // 添加采购单位
    addUnitEvent () {
      console.log(this.queryData.unitUid);
      if (this.queryData.unitUid == '') {
        this.$message('请选择基本单位');
      } else {
        let basicUnitFirstValue = {
          unitUid: '',
          name: '',
          purUnitRatio: '',
          fun: ''
        };
        this.basicUnitData.push(basicUnitFirstValue);
      }
    },
    // 销售地点
    onSalesPlaceSumit (data = []) {
      this.queryData.cinemaSalePlaceEntityList = data.map(item => {
        return {
          placeUid: item.uid || item.placeUid,
          name: item.placeName || item.name
        };
      });
      this.salesPlaceName = data
        .map(item => {
          return item.placeName || item.name;
        })
        .join(',');
    },
    // 系数转换
    changeUnitEvent (value, index) {
      let purUnitRatio = this.basicUnitData[0].purUnitRatio;
      let name = this.basicUnitData[0].name;
      let newFun = purUnitRatio + this.basicUnitData[index].name + '=' + this.basicUnitData[index].purUnitRatio + name;
      this.basicUnitData[index].fun = newFun;
      this.buyUnitArr.forEach((val) => {
        if (val.label == this.basicUnitData[index].name) {
          this.basicUnitData[index].unitUid = val.uid;
        }
      });
    },
    // 点击采购单位事件
    focusUnitEvent (value, index) {
      this.resBuyUnit();
    },
    // 删除采购单位
    unitHandleDlete (row, index) {
      this.basicUnitData.splice(index, 1);
    },
    // 添加SKU商品
    addSkuEvent () {
      this.skudialog = true;
      this.resQueryAttribute();
    },
    // 选择sku属性
    skuSelectEvent (value) {
      // let skuAttr = []
      // // let linsVal = this.skuAttrcheckList
      // this.forEach.forEach((val,index,arr)=>{

      // })
      // // this.skuAttrcheckList
      // console.log(value)
    },
    // sku弹窗确定按钮
    skuDetermineBtn () {
      this.skudialog = false;
      this.resCreateSku();
    },
    priceValidator (rule, value, callback) {
      if (value < 0 || value >= 1000) {
        return callback(new Error('售价0<n<1000'));
      } else {
        callback();
      }
    },
    priceInputEvent (value) {
      this.queryData.skuVoList.price = value.replace(/^(.*\..{2}).*$/, '$1');
    },
    // sku关闭按钮
    skuhandleClose () {
      this.skuAttribute;
      this.skudialog = false;
    },
    // 新建单品关闭sku
    skuDelTableEvent () {
      this.skuData = [];
      this.queryData.skuVoList.code = this.queryData.proCode;
    },
    // 删除sku属性当前行事件
    skuHandleDlete (row, index) {
      this.skuData.splice(index, 1);
    },
    // 基本单位获取焦点事件
    focusBasicUnitEvent () {
      this.resBasicUnit();
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 新增单品提交
    comSingleSubmit () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.$route.query.type == 1) {
            this.resSingleProductSave();
          } else if (this.$route.query.type == 2) {
            this.ressingleProductUpdate();
          }
        } else {
          this.$message('信息填写有误，请按照红色提示修改');
          return false;
        }
      });
    },
    // sku属性禁止销售按钮
    stopskuHandleDlete (row, index) {
      if (row.status == 1) {
        row.active = '禁止销售';
        row.status = 0;
      } else {
        row.active = '允许销售';
        row.status = 1;
      }
      console.log(row);
    },
    handleDialog (name) {
      this.$refs[name].handleDialog(true);
    },
    // 门店
    onCinemalSumit (data = []) {
      this.queryData.cinemas = data.map(item => {
        return {
          cinemaUid: item.uid
        };
      });
      this.selectedStoreName = data
        .map(item => {
          return item.name;
        })
        .join(',');
      console.log('门店数据', data);
      let newArr = [];
      data.forEach((val, index, arr) => {
        let newObj = {};
        newObj.cinemaUid = val.uid;
        newArr.push(newObj);
      });
      this.queryData.saleCinemaList = newArr;
    },
    downTimeEvent () {
      if (this.queryData.downTimeType == '0') {
        this.queryData.downTime = '';
      }
    },
    // 渠道
    onChanneSumit (data = []) {
      // console.log(data)
      // this.queryData.channels = data.map(item => {
      //   return {
      //     channelUid: item.uid
      //   };
      // });
      this.selectedChannelName = data
        .map(item => {
          return item.name;
        })
        .join(',');
      console.log('渠道数据', data);
      let newArr = [];
      data.forEach((val, index, arr) => {
        let newObj = {};
        newObj.channelUid = val.channelUid || val.uid;
        newObj.name = val.channelName || val.name;
        newArr.push(newObj);
      });
      this.queryData.saleChannelList = newArr;
    },
    // 删除门店
    handleDeleteCinemas () {
      this.onCinemalSumit([]);
    },
    // 删除渠道
    handleDeleteChanne () {
      this.onChanneSumit([]);
    },
    // 删除销售地点
    handleplaceDeleteChanne () {
      this.onSalesPlaceSumit([]);
    },
    // 基本单位请求
    resBasicUnit () {
      let value = {
        // 商品分类
        // this.$route.query.data.uid
        // catUid:JSON.parse(this.$route.query.data).uid,
        catUid: this.queryData.catUid,
        // 0基本单位
        flag: 0
      };
      console.log(value);
      this.$cimList.headquartersGoods.merUnitList(value).then(res => {
        if (res.code === 200) {
          let linsbasicUnitArr = [];
          let linsObj = {};
          res.data.forEach((val, index, arr) => {
            linsObj.uid = val.uid;
            linsObj.label = val.unitName;
            linsObj.value = val.uid;
            linsbasicUnitArr.push(linsObj);
            linsObj = {};
          });
          this.basicUnitArr = linsbasicUnitArr;
        } else {
          this.error(res.msg);
        }
      }).catch(err => {

      });
    },
    // 采购单位请求
    resBuyUnit () {
      this.buyUnitArr = [];
      let value = {
        // 商品分类
        // this.$route.query.data.uid
        // catUid:JSON.parse(this.$route.query.data).uid,
        catUid: this.queryData.catUid,
        // 0基本单位
        flag: 1
      };
      console.log(value);
      this.$cimList.headquartersGoods.merUnitList(value).then(res => {
        if (res.code === 200) {
          let linsbasicUnitArr = [];
          let linsObj = {};
          res.data.forEach((val, index, arr) => {
            linsObj.uid = val.uid;
            linsObj.label = val.unitName;
            linsObj.value = val.unitName;
            linsbasicUnitArr.push(linsObj);
            linsObj = {};
          });
          this.buyUnitArr = linsbasicUnitArr;
        } else {
          this.error(res.msg);
        }
      }).catch(err => {

      });
    },
    // 创建sku请求
    resCreateSku () {
      let skuAttr = [];
      this.skuAttrcheckList.forEach((val1, index, arr) => {
        val1.forEach((val2, index, arr) => {
          this.skuAttribute.forEach((skuval, index, arr) => {
            skuval.Suboptions.forEach((Subval, index, arr) => {
              if (val2 == Subval.attrValue) {
                let resval = {};
                resval.attrCode = skuval.code;
                resval.attrName = skuval.name;
                resval.attrType = skuval.attrType;
                resval.attrUid = skuval.attrUid;
                resval.attrValue = Subval.attrValue;
                resval.itemCode = Subval.itemCode;
                resval.itemUid = Subval.uid;
                skuAttr.push(resval);
                resval = {};
              }
            });
          });
        });
      });
      let resValue = {
        merCode: this.queryData.proCode,
        skuAttr: skuAttr,
        spuUid: this.$route.query.type == 1 ? null : this.queryData.cuid
      };
      this.$cimList.headquartersGoods.singleProductCreateSku(resValue).then(res => {
        if (res.code === 200) {
          this.skuColumnEvent(res.data);
          console.log(res);
        }
      }).catch(err => {

      });
    },
    // 查看销售属性请求
    resQueryAttribute () {
      let resValue = {
        // this.$route.query.data.uid
        catUid: this.queryData.catUid
      };
      console.log(resValue);
      this.$cimList.headquartersGoods.singleProductQueryAttribute(resValue).then(res => {
        if (res.code === 200) {
          this.skuAttribute = res.data;
        } else {
          this.error(res.msg);
        }
      }).catch(err => {

      });
    },
    // 修改单品
    ressingleProductUpdate () {
      let app = [];
      app.push(this.queryData.skuVoList);
      let resValue = {
        downTime: this.queryData.downTimeType == '0' ? '' : this.queryData.downTime,
        upTime: this.queryData.upTime,
        cinemaMer: {
          cinemaUid: this.queryData.cinemaUid,
          canSale: this.queryData.canSale,
          uid: this.queryData.newuid,
          salePlace: parseInt(this.queryData.salePlace),
          merUid: this.queryData.merUid,
          catUid: this.queryData.catUid,
          imgUrl: this.queryData.imgUrl,
          merType: this.queryData.merType,
          remark: this.queryData.remark,
          onlyAllowSetmeal: this.queryData.onlyAllowSetmeal,
          saleChannel: this.queryData.saleChannel,
          saleCinema: this.queryData.saleCinema,
          shorthandCode: this.queryData.shorthandCode,
          storeDownLimit: this.queryData.storeDownLimit,
          storeUpLimit: this.queryData.storeUpLimit,
          taxRate: this.queryData.taxRate
        },
        purUnitList: this.basicUnitData,
        cinemaSaleChannelList: this.queryData.saleChannelList,
        cinemaSalePlaceList: this.queryData.cinemaSalePlaceEntityList,
        skuVoList: this.skuData.length == 0 ? app : this.skuData,
        spu: {
          brandUid: this.queryData.brandUid,
          code: this.queryData.proCode,
          merSpec: this.queryData.spec,
          name: this.queryData.name,
          placeOrigin: this.queryData.placeOrigin,
          unitUid: this.queryData.cunitUid,
          merUid: this.queryData.cuid
        },
        spuAttributeList: []
      };
      if (this.queryData.saleChannel === 0 && this.queryData.saleChannelList.length === 0) {
        this.$message('请选择指定销售渠道');
      } else if (parseInt(this.queryData.salePlace) === 0 && this.queryData.cinemaSalePlaceEntityList.length === 0) {
        this.$message('请选择指定销售地点');
      } else if (this.queryData.downTimeType === '1' && this.queryData.downTime === '' || this.queryData.downTimeType === '1' && this.queryData.downTime === null) {
        this.$message('选择了指定下架时间,请选择时间');
      } else {
        console.log(resValue);
        this.$cimList.storequartersGoods.singleProductUpdateCinema(resValue).then(res => {
          if (res.code === 200) {
            // this.AttributeSkudata = res.data
            this.$message('修改成功');
            this.handleCancel();
          } else {
            this.$message(res.msg);
          }
        });
      }
    },

    chuliAttributeSkudata () {
      let newSkudata = [];
      let newobj = {};
      this.AttributeSkudata.forEach((val, index, arr) => {

      });
    },
    // 多个sku数据处理
    skuColumnEvent (valskuData) {
      let skuData = [];
      valskuData.forEach((val, index, arr) => {
        let valObj = {};
        valObj.code = val.code;
        valObj.price = val.price;
        valObj.barCode = val.barCode;
        valObj.uid = val.skuUid;
        valObj.cinemaSkuUid = val.uid;
        valObj.status = val.status;
        valObj.active = val.status == 1 ? '允许销售' : '禁止销售';
        valObj.skuAttr = [];
        val.skuAttr.forEach((skuval, skuindex, skuarr) => {
          let sttrObj = {};
          let gg = 'attrName' + skuindex;
          valObj[gg] = skuval.attrValue;
          sttrObj.attrValue = skuval.attrValue;
          sttrObj.attrCode = skuval.attrCode;
          sttrObj.attrName = skuval.attrName;
          sttrObj.attrType = skuval.attrType;
          sttrObj.attrUid = skuval.attrUid;
          sttrObj.attrValue = skuval.attrValue;
          sttrObj.itemCode = skuval.itemCode;
          sttrObj.itemUid = skuval.itemUid;

          valObj.skuAttr.push(sttrObj);
        });
        skuData.push(valObj);
      });
      this.skuData = skuData;
      valskuData[0].skuAttr.forEach((skuval, skuindex, skuarr) => {
        let skuColomOBj = {};
        skuColomOBj.label = skuval.attrName;
        skuColomOBj.key = 'attrName' + skuindex;
        this.skuColumn.splice(1, 0, skuColomOBj);
      });
    },
    skuColumnEvent1 (valskuData) {
      let skuData = [];
      valskuData.forEach((val, index, arr) => {
        let valObj = {};
        valObj.code = val.code;
        valObj.price = val.price;
        valObj.uid = val.skuUid;
        valObj.cinemaSkuUid = val.uid;
        valObj.barCode = val.barCode;
        valObj.status = val.status;
        valObj.active = val.status == 1 ? '允许销售' : '禁止销售';

        valObj.skuAttr = [];
        val.skuAttr.forEach((skuval, skuindex, skuarr) => {
          let sttrObj = {};
          let gg = 'attrName' + skuindex;
          valObj[gg] = skuval.attrValue;
          sttrObj.attrValue = skuval.attrValue;
          sttrObj.attrCode = skuval.attrCode;
          sttrObj.attrName = skuval.attrName;
          sttrObj.attrType = skuval.attrType;
          sttrObj.attrUid = skuval.attrUid;
          sttrObj.attrValue = skuval.attrValue;
          sttrObj.itemCode = skuval.itemCode;
          sttrObj.itemUid = skuval.itemUid;

          valObj.skuAttr.push(sttrObj);
        });
        skuData.push(valObj);
      });
      this.skuData = skuData;
      valskuData[0].skuAttr.forEach((skuval, skuindex, skuarr) => {
        let skuColomOBj = {};
        skuColomOBj.label = skuval.attrName;
        skuColomOBj.key = 'attrName' + skuindex;
        this.skuColumn1.splice(1, 0, skuColomOBj);
      });
    },
    skuColumnEvent2 (valskuData) {
      let skuData = [];
      valskuData.forEach((val, index, arr) => {
        let valObj = {};
        valObj.code = val.code;
        valObj.price = val.price;
        valObj.uid = val.skuUid;
        valObj.cinemaSkuUid = val.uid;
        valObj.barCode = val.barCode;
        valObj.status = val.status;
        valObj.active = val.status == 1 ? '允许销售' : '禁止销售';

        valObj.skuAttr = [];
        val.skuAttr.forEach((skuval, skuindex, skuarr) => {
          let sttrObj = {};
          let gg = 'attrName' + skuindex;
          valObj[gg] = skuval.attrValue;
          sttrObj.attrValue = skuval.attrValue;
          sttrObj.attrCode = skuval.attrCode;
          sttrObj.attrName = skuval.attrName;
          sttrObj.attrType = skuval.attrType;
          sttrObj.attrUid = skuval.attrUid;
          sttrObj.attrValue = skuval.attrValue;
          sttrObj.itemCode = skuval.itemCode;
          sttrObj.itemUid = skuval.itemUid;

          valObj.skuAttr.push(sttrObj);
        });
        skuData.push(valObj);
      });
      this.skuData = skuData;
      valskuData[0].skuAttr.forEach((skuval, skuindex, skuarr) => {
        let skuColomOBj = {};
        skuColomOBj.label = skuval.attrName;
        skuColomOBj.key = 'attrName' + skuindex;
        this.skuColumn.splice(1, 0, skuColomOBj);
      });
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
    setCheckedKys (radios) {
      radios.forEach(item => {
        if (item.value) {
          item.checkedKys = item.value.map(valueItem => {
            return valueItem.id;
          });
        }
      });
    },
    // 查询
    onQuery () {
      // this.getTerminalQueryPage(this.queryData);
      // console.log(this.queryData);
    },
    // 获取终端列表
    getTerminalQueryPage (param) {
      this.tableLoding = true;
      this.$api
        .terminalQueryPage(param)
        .then(resData => {
          if (resData.code == 200) {
            let tempArr = [];
            tempArr = resData.data.records.map(item => {
              if (item.salePlaceEntity) {
                item.placeName = item.salePlaceEntity.placeName;
                item.placeUid = item.salePlaceEntity.uid; // 仓库id
              }
              return item;
            });
            this.tableData = tempArr;
            this.total = resData.data.total;
            // console.log(tempArr);
            this.tableLoding = false;
          }
        })
        .catch(() => {
          this.tableLoding = false;
        });
    },
    // 修改
    terminalUpdate (param) {
      this.$api.terminalUpdate(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 销售地址查询
    getSalePlaceAll (param) {
      this.$api.salePlaceAll(param).then(resData => {
        if (resData.code == 200) {
          this.salePlaces = resData.data;
        }
      });
    },
    // 货架查询
    getTerminalRackAll (param) {
      this.$api.terminalRackAll(param).then(resData => {
        if (resData.code == 200) {
          this.storageRacks = resData.data;
        }
      });
    },
    // 修改操作
    handleModification (index, row) {
      const { id, tername, status, placeUid, rackCode, rackName } = row;
      this.getSalePlaceAll();
      this.getTerminalRackAll();
      this.changeData.id = id;
      this.changeData.tername = tername;
      this.changeData.status = status.toString();
      this.changeData.placeUid = placeUid; // 销售地址 = placeUid;
      this.changeData.rackCode = rackCode; // 仓库编码
      this.terminalStatusDialog = true;
    },
    handleChange (value) {
      console.log(value);
    },
    // 确定提交信息
    handleSubmit () {
      console.log(this.recipeGroupList);
    },
    // 取消提交信息
    // handleCancel() {
    //   this.handleCancel();
    // },
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
    // 确认提交修改
    handleModificationSubmit () {
      this.addRawMaterialDialog = false;
      // this.changeData.salePlaceEntity.uid = this.changeData.placeUid; //销售地址对象
      // let tempObj = this.storageRacks.find(item => {
      //   return this.changeData.rackCode == item.code;
      // });
      // if (tempObj) {
      //   this.changeData.rackName = tempObj.name; //仓库名字
      // }
      // // console.log(this.changeData);
      // this.terminalUpdate(this.changeData);
      // this.terminalStatusDialog = false;
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.onQuery();
    },
    // 添加配方分组
    handleAddrRecipeGroup () {
      this.recipeGroupList.push({
        attrValue: '',
        id: Math.random(),
        delFlag: 0,
        tableData: [
          {
            address: '奶粉',
            tername: 'YCL001',
            code: '124547',
            mac: '',
            dosage: { min: '', max: '' },
            mac2: 'g'
          },
          {
            address: '汤',
            tername: 'YCL002',
            code: '124547',
            mac: '',
            dosage: { min: '', max: '' },
            mac2: 'g'
          },
          {
            address: '中杯',
            tername: 'YCL003',
            code: '124547e',
            mac: '',
            dosage: { min: '', max: '' },
            mac2: '个'
          }
        ]
      });
    },
    // 删除配方分组
    handleDleteRecipeGroup (index) {
      this.recipeGroupList.splice(index, 1);
    },
    handleRecipeTableDlete (groupIndex, row, index) {
      console.log(groupIndex, row, index);
      this.recipeGroupList[groupIndex].tableData.splice(index, 1);
    },
    // 确定选择适用门店
    handleStoresCheckedNodes (checkedValue) {
      this.checkedNodes(this.applyStoresRadios, checkedValue);
    },
    // 确定选择适用渠道
    handleChannelCheckedNodes (checkedValue) {
      this.checkedNodes(this.applyChannelRadios, checkedValue);
    },
    saleChannelEvent () {
      if (this.queryData.saleChannel === 1) {
        this.queryData.saleChannelList = [];
        this.handleDeleteChanne();
      }
    },
    salePlaceEvent () {
      console.log(this.queryData.salePlace);
      this.queryData.salesPlaceName = '';
      if (this.queryData.salePlace === 1) {
        this.queryData.cinemaSalePlaceEntityList = [];
      }
    },
    checkedNodes (radios, checkedValue) {
      // console.log(radios);
      console.log(checkedValue);
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
    saleCinemaType (type) {
      switch (type) {
        case 0:
          return '指定门店';
          break;
        case 1:
          return '全部门店';
          break;
        case 2:
          return '排除门店';
          break;
      }
    }
  },
  computed: {
    routeQuery () {
      return this.$route.query;
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
          return '修改';
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
    cinemalDialog,
    channelDialog,
    salesPlace,
    seechannelDialog,
    seeplaceDialog
  }
};
</script>


<style lang="scss" scoped>
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.storesingle-style {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form--inline .el-form-item__content {
    line-height: 30px !important;
  }
  .el-form--inline .el-form-item__label {
    line-height: 30px !important;
  }
  .basic-input {
    min-width: 250px;
  }
  .putaway-timer {
    .el-form-item__content {
      min-width: 150px;
    }
  }
  .common-header.has-gutter tr th {
    background: red !important;
  }
  .recipe-box {
    margin: 30px 0;
  }
  .recipe-tittle-box {
    margin: 10px 0;
  }
  .recipe-tittle {
    line-height: 40px;
    text-align: center;
    font-size: 20px;
  }
  .change-dialog {
    .el-form-item__content {
      width: 60%;
    }
  }
  .delete-recipe-group {
    font-size: 20px;
  }
  .recipe-name-inp {
    width: 200px;
  }
  .price-inp {
    width: 100px;
  }
  .content {
    padding: 20px;
  }
  .tittle {
    font-weight: 900;
    font-size: 18px;
  }
  .sub-tittle {
    height: 40px;
    line-height: 40px;
    width: 100%;
    background: #f5f5f5;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .sku-table {
    background: #f5f5f5;
    border-radius: 4px;
    border-radius: 4px;
    padding: 17px 53px 17px 17px;
    box-sizing: border-box;
    position: relative;
    .del-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      i {
        cursor: pointer;
      }
    }
  }
  .submit-box {
    margin-top: 50px;
    text-align: center;
  }
  .table-box {
    margin-top: 10px;
  }
  .both-edit-inp {
    width: 60px;
  }
  .breadcrumb {
    margin-bottom: 30px;
  }
  .text-right {
    text-align: right;
  }
  .endTime-input {
    width: 110px;
  }
  .widthInput100 {
    width: 192px;
    min-width: 100px;
    display: inline-block;
  }
  .sku {
    button {
      margin-left: 20px;
    }
  }
  .selectUnit {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .sku-box {
    .sku-select-group {
      .line {
        height: 1px;
        width: 100%;
        background: #e5e5e5;
        margin-bottom: 16px;
      }
      .name {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        margin-bottom: 16px;
      }
      .el-checkbox {
        margin-bottom: 16px;
      }
    }
    .tips {
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
    }
  }
  .el-form .el-form-item {
    margin-bottom: 14px;
  }
}
</style>