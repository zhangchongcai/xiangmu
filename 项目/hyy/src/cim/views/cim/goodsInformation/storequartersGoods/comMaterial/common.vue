<template>
<div class="storemateerial-style">
  <!-- {{this.queryData.channels}} -->
  <div class="content" >
    <el-form
      :inline="true"
      ref="ruleForm"
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
              <el-col :span="8">
                <el-form-item label="商品类型">
                  <span>原材料</span>
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
                <el-form-item
                  label="商品名称"
                  :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]"
                >
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
            <el-row>
              <el-col :span="8">
                <el-form-item label="包装条码">
                  <span>{{this.queryData.skuVoList.barCode}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="基本单位"
                  :rules="[{ required: true, message: '基本单位不能为空',trigger: 'change' }]"
                >
                  <span>{{queryData.unitName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="产地" >
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
        <!-- 基础信息 end-->
        <!-- 采购信息 start-->
        <el-collapse-item title="采购信息" name="2">
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item 
                label="进货税率"
                prop="taxRate"
                :rules="[
                      { required: false,trigger: 'change' },
                      { pattern: /^([1-9][0-9]?)$|^([0]\.[0-9]{1,2})$|^([1-9][0-9]?\.[0-9]{1,2})$|^([0])$|^\\./, message: '请输入最多2位数字和2位小数',trigger: 'change' }
                    ]"
                >
                  <el-input placeholder class="basic-input widthInput100" v-model="queryData.taxRate" v-if="routeQuery.type != 3"></el-input >
                  <span v-if="routeQuery.type == 3">{{queryData.taxRate}}</span>
                  <span>%</span>
                </el-form-item>
              </el-col>
            </el-row>
            <div>采购单位</div>
            <div>
                <el-table :data="basicUnitData" stripe>
                  <el-table-column
                    v-for="item in basicUnitColumn1"
                    :key="item.key"
                    :prop="item.key"
                    :label="item.label"
                    :width="item.width"
                    :formatter="item.formatter"
                  > 
                    <template slot-scope="{row,$index}">
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
            <template v-model="skuData">
              <el-row>
                <el-col :span="10">
                  <el-form-item label="SKU编码" >
                    <span v-if="routeQuery.type == 1">
                    {{JSON.parse(this.$route.query.data).proCode+Math.ceil(Math.random() * 99)}}
                    </span>
                    <span v-if="routeQuery.type == 3">
                    {{queryData.skuVoList.code}}
                    </span> 
                    <span v-if="routeQuery.type == 2">
                    {{queryData.skuVoList.code}}
                    </span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    label="售价"
                    prop="skuVoList.price"
                    :rules="[
                    { required: true, message: '售价不能为空',trigger: 'change' },
                    { pattern: /^([1-9][0-9]{0,5})$|^([0]\.[0-9]{1,2})$|^([1-9][0-9]{0,5}\.[0-9]{1,2})$|^([0])$|^\\./, message: '请输入最多5位数字和2位小数',trigger: 'change' }
                    ]"
                  >
                    <el-input placeholder class="basic-input widthInput100" v-if="routeQuery.type != 3" v-model="queryData.skuVoList.price"></el-input>
                    <span v-if="routeQuery.type == 3">{{queryData.skuVoList.price}}</span>元
                  </el-form-item>
                </el-col>
                <el-col :span="8">
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
                      <span  class="c-type" @click="channelClick()">{{selectedChannelName}}</span>
                      <span class="c-type" @click="channelClick()">...共{{this.seechannelArr == null || this.seechannelArr == "" ? 0:this.seechannelArr.length}}家</span>
                    </div>
                  </template>
                  <template v-else-if="routeQuery.type==3 && this.queryData.saleChannel === 1">
                      <span>全部渠道</span>
                  </template>
                  <div v-else>
                    <el-select v-model="queryData.saleChannel" placeholder="请选择" class="apply-select" @change="saleChannelEvent()">
                      <el-option
                              v-for="item in applyChannelRadios"
                              :key="item.type"
                              :label="item.label"
                              :value="item.type"
                      ></el-option>
                    </el-select>
                    <span class="select-input" v-if="queryData.saleChannel!='1'">
                      <!-- <span class="select-btn" v-if="!selectedChannelName">
                        <el-button type="primary" plain @click="handleDialog('myChannelDialog')">选择</el-button>
                      </span> -->
                      <span>
                          <el-input
                                  class="input apply-stores-input"
                                  placeholder="请选择"
                                  v-model="selectedChannelName"
                                  clearable
                                  @focus="handleDialog('myChannelDialog')"
                                  @clear="handleDeleteChanne"
                          >
                         </el-input>
                          <el-button @click.stop="handleDialog('myChannelDialog')" type="primary cinemaSel-btn" plain>选择</el-button>
                      </span>
                    </span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item label="安全库存"
                  prop="storeUpLimit"
                  :rules="[
                    { required: false,trigger: 'change' },
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入大于下限正整数',trigger: 'change' }
                    ]"
                  > 
                  <span style="color: #666;">上限：</span>
                  <el-input placeholder class="basic-input widthInput100" v-if="routeQuery.type != 3" v-model="queryData.storeUpLimit"></el-input>
                    <span v-if="routeQuery.type == 3">{{queryData.storeUpLimit}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item 
                  label="下限"
                  prop="storeDownLimit"
                  :rules="[
                    { required: false,trigger: 'change' },
                    { pattern: /^([1-9]\d*|[0]{1,1})$/, message: '请输入小于等于上线限正整数',trigger: 'change' }
                    ]"
                  >
                  <!-- <span>下限</span> -->
                  <el-input placeholder class="basic-input widthInput100" v-if="routeQuery.type != 3" v-model="queryData.storeDownLimit"></el-input>
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
  </div>
  <!-- 选择渠道弹窗 -->
    <!-- <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" multiple :title="'选择适用渠道'"></channel-dialog> -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" multiple :title="'选择适用渠道'" :dialogFeedbackData="queryData.channels" :cinemaUid="routeQuery.cinemaUid"></channel-dialog>
  <!-- 选择销售地点 -->
    <sales-place ref="mySalesPlaceDialog" @onSumit="onSalesPlaceSumit" :cinemaUid="routeQuery.cinemaUid"
                 multiple></sales-place>
    <seechannel-dialog
          :dialogVisible.sync="dialogVisibleseechannel"
          :needData="JSON.stringify(this.seechannelArr)"
          >
    </seechannel-dialog>             
</div>
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import applyStores from "cim/components/applyStores/applyStores.vue";
import applyChannel from "cim/components/applyChannel/applyChannel.vue";
import channelDialog from "cim/components/channelDialog/channelDialog.vue";
import salesPlace from "cim/components/salesPlace/salesPlace.vue";
import seechannelDialog from "cim/components/seeChannelDialog/seeCinemalDialog.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      seechannelArr:[],
      dialogVisibleseechannel:false,
      activeNames:['1','2','3'],
      skuStart:false,
      ruter:"",
      aaa:{},
      skuAttr:[],
      AttributeSkudata:[],
      //页面数据
      queryData: {
        channels:[],
        cinemaMerUid:"",
        salePlace: "1",
        cinemaSalePlaceEntityList: [],
        brandName:"",
        cinemaUid:"",
        cinemaName:"",
        catUid:"",
        catName:"",
        skuUid:"",
        cunitUid:"",
        cuid:"",
        uid:"",
        channelName:"",
        mendianName:"",
        placeOriginName:"",
        unitName:"",
        uidname:"",
        proCode:"",
        // 商品类型 1-单品
        merType: 1 ,
        // 商品编码
        code:"",
        // 商品分类
        classUid:"",
        // 速记代码
        shorthandCode:"",
        // 商品名称
        name:"",
        // 销售别名
        aliasName:"",
        // 商品规格
        spec:"",
        // 品牌
        brandUid:"",
        // 基本单位
        unitUid:"",
        // 产地  0国产,1进口
        placeOrigin:0,
        // 商品图片
        imgUrl:"",
        // 商品描述
        remark:"",
        // 进货税率
        taxRate:"",
        saleChannel:1,
        saleCinema:0,
        // 采购单位对象集合
        purUnitList:{
          // 单位名称
          unitUid:"",
          // 采购转换系数
          purUnitRatio:""
        },
        // sku对象集合
        skuVoList:{
          // 包装条码
          barCode:"",
          // sku编码
          code:"",
          // 价格
          price:"",
          // 属性集合
          skuAttributeList:[]
        },
        // 销售状态 0不允许,1允许
        canSale:1,
        //上架时间
        upperTime: moment().format("YYYY-MM-DD HH:mm"), 
        //下架时间类型
        downTimeType: "0", 
        //下架时间
        lowerTime: moment().format("YYYY-MM-DD HH:mm"), 
        // 是否只允许套餐内售卖 0否,1是
        onlyAllowSetmeal:0,
        // 库存下限
        storeDownLimit:"",
        // 库存上限
        storeUpLimit:"",
          // 商品指定影院
        saleCinemaList:[],
          // 商品指定渠道
        saleChannelList:[]
      },
      checkList:[],
      skuAttrcheckList:[],
      // 添加sku数据格式
      skuAttribute:[
        {
          name:"颜色",
          modelValue:[],
          Suboptions:[{},{},{},{}]
        },
        {
          name:"味道",
          modelValue:[],
          Suboptions:["香草味","橙味","草莓味","苹果味"]
        },
        {
          name:"甜度",
          modelValue:[],
          Suboptions:["原味","多糖","少糖"]
        }
      ],
      skudialog:false,
      filterText: "",
      startTime: moment().format("YYYY-MM-DD HH:mm"),
      endTimeRadio: "0",
      endTime: "",
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
      options: [
        {
          value: "个",
          label: "个"
        },
        {
          value: "箱",
          label: "箱"
        },
        {
          value: "瓶",
          label: "瓶"
        }
      ],
      // 基本单位显示
      basicUnitvalue:"",
      // 基本单位选择框
      basicUnitArr: [
        {
          value: "个",
          label: "个"
        },
        {
          value: "箱",
          label: "箱"
        },
        {
          value: "瓶",
          label: "瓶"
        }
      ],
      // 基本单位选择框
      buyUnitArr: [
        {
          value: "个",
          label: "个"
        },
        {
          value: "箱",
          label: "箱"
        },
        {
          value: "瓶",
          label: "瓶"
        }
      ],
      // 采购单位表头数组
      basicUnitColumn: [
        {
          label: "单位名称",
          key: "name",
          selectUnit:true
        },
        {
          label: "转换系数",
          key: "purUnitRatio",
          edit: true
        },
        {
          label: "转换公式",
          key: "fun"
        }
      ],// 采购单位表头数组 
      // 采购单位表头数组
      basicUnitColumn2: [
        {
          label: "单位名称",
          key: "name",
          selectUnit:true
        },
        {
          label: "转换系数",
          key: "purUnitRatio",
          edit: true
        },
        {
          label: "转换公式",
          key: "fun"
        }
      ],// 采购单位表头数组
      basicUnitColumn1: [
        {
          label: "单位名称",
          key: "name"
        },
        {
          label: "转换系数",
          key: "purUnitRatio"
        },
        {
          label: "转换公式",
          key: "fun"
        }
      ],
      // sku属性表头
      skuColumn: [
        {
          label: "SKU编码",
          key: "code"
        },
        {
          label: "售价",
          key: "barCode",
          edit: true
        },
        {
          label: "包装条码",
          key: "price",
          edit: true
        },
        {
          label: "SKU商品状态",
          key: "active"
        }
      ],
      // 采购单位表格数组
      basicUnitData:[],
      // 创建sku数组
      skuData:[],
      linshiskuData:[
        {
          code:"123",
          color:"黄色",
          kouwei:"苹果味",
          shoujia:"",
          tiaoma:"",
          active:"允许",
        },
        {
          code:"128",
          color:"绿色",
          kouwei:"橙味",
          shoujia:"",
          tiaoma:"",
          active:"允许",
        },
      ],
      value: "",
      addRawMaterialDialog: false, //添加原材料弹窗
      defaultProps: {
        children: "children",
        label: "label"
      },
      selectedChannelName: "",
      applyChannelRadios: [
        {
          label: "全部渠道",
          type: 1
        },
        {
          label: "指定渠道",
          type: 0
        }
      ],
      recipeGroupList: [
        {
          attrValue: "",
          id: Math.random(),
          delFlag: 0,
          name: "标准配方",
          tableData: [
            {
              address: "奶粉",
              tername: "YCL001",
              sku: "CS1564654652",
              code: "124547",
              mac: "",
              dosage: { min: "", max: "" },
              mac2: "g"
            },
            {
              address: "汤",
              tername: "YCL002",
              sku: "CS15646546543",
              code: "124547",
              mac: "",
              dosage: { min: "", max: "" },
              mac2: "g"
            },
            {
              address: "中杯",
              tername: "YCL003",
              sku: "CS1564654654",
              code: "124547e",
              mac: "",
              dosage: { min: "", max: "" },
              mac2: "个"
            }
          ]
        }
      ],
      cinemaOptions: [],
      //修改终端数据
      changeData: {
        tername: "",
        status: "",
        rackCode: "",
        placeUid: "",
        salePlaceEntity: { uid: "" }
      },
      tableColumn: [
        {
          label: "商品名称",
          key: "address"
        },
        {
          label: "商品编码",
          key: "tername"
        },
        {
          label: "SKU编码",
          key: "sku"
        },
        {
          label: "速记代码",
          key: "code"
        },
        {
          label: "商品规格",
          key: "mac"
        },
        {
          label: "基本单位",
          key: "mac1"
        }
      ],
      recipeTableColumn: [
        {
          label: "商品名称",
          key: "address"
        },
        {
          label: "商品编码",
          key: "tername"
        },
        {
          label: "速记代码",
          key: "code"
        },
        {
          label: "标准用量",
          key: "mac",
          edit: true,
          required: true,
          renderHeader: (h, { column, $index }) => {
            return h("div", {
              attrs: {
                class: "cell" //ele原来样式
              },
              domProps: {
                innerHTML: '<span class="red">* </span>' + column.label
              }
            });
          }
        },
        {
          label: "建议用量",
          key: "dosage",
          bothEdit: true,
          width: 250
        },
        {
          label: "基本单位",
          key: "mac2"
        },
        {
          label: "零售额分配比率（%）",
          key: "mac3",
          edit: true,
          required: true,
          width: 170,
          renderHeader: (h, { column, $index }) => {
            return h("div", {
              attrs: {
                class: "cell" //ele原来样式
              },
              domProps: {
                innerHTML: '<span class="red">* </span>' + column.label
              }
            });
          }
        }
      ],
      tableData: [
        {
          address: "奶粉",
          tername: "YCL001",
          code: "124547",
          mac: "",
          dosage: { min: "", max: "" },
          mac2: "g"
        },
        {
          address: "汤",
          tername: "YCL002",
          code: "124547",
          mac: "",
          dosage: { min: "", max: "" },
          mac2: "g"
        },
        {
          address: "中杯",
          tername: "YCL003",
          code: "124547e",
          mac: "",
          dosage: { min: "", max: "" },
          mac2: "个"
        }
      ],
      storageRacks: [], //仓库,货架
      salePlaces: [], //销售地址
      tableLoding: false,
      total: 0,
      terminalStatusDialog: false,
      dataListLoading: false,
      applyStoresRadios: [
        {
          label: "全部门店",
          type: 1
        },
        {
          label: "指定门店",
          type: 0,
          name: "中大影院,客村影院",
          value: [
            {
              id: 9,
              label: "中大影院"
            },
            {
              id: 10,
              label: "客村影院"
            }
          ]
        },
        {
          label: "排除门店",
          type: 2,
          // name: "大学城影院",
          value: [
            // {
            //   id: 5,
            //   label: "大学城影院"
            // }
          ]
        }
      ],
    };
  },
  mounted() {
    this.init();
    console.log(this.$route.query.data);
  },
  created() {
      for (let key in this.skuAttribute) {
        this.$set(this.skuAttrcheckList, key, [])
      }
    },
  methods: {
    init() {
      console.log(JSON.parse(this.$route.query.data))
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
      // if (truthis.$route.querye) {}
      if(this.$route.query.type == 3){
        this.queryData.cinemaUid = JSON.parse(this.$route.query.cinemaUid)
        this.seeMerRawStockQuery(JSON.parse(this.$route.query.data))
      }else if(this.$route.query.type == 2){
        this.queryData.cinemaUid = this.$route.query.cinemaUid
        this.seeMerRawStockQuery(JSON.parse(this.$route.query.data))
      }
    },
    salePlaceEvent(){
      if(this.queryData.salePlace === "1"){
         this.queryData.cinemaSalePlaceEntityList = []
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 选择基本单位
    basicUnitEvent(){
       let selectedWorkName = {};
       selectedWorkName = this.basicUnitArr.find((item)=>{
           return item.uid === this.queryData.unitUid;
       });
       console.log(selectedWorkName)

      let basicUnitFirstValue = {
          name:selectedWorkName.label,
          purUnitRatio:"1",
          fun:'1'+selectedWorkName.label+"=1"+selectedWorkName.label,
          unitUid:this.queryData.unitUid
        }

      this.basicUnitData.splice(0,1,basicUnitFirstValue)

    },
    // 查看原材料
    seeMerRawStockQuery(val){
      let value = {
        uid:val,
        cinemaUid:this.queryData.cinemaUid.toString()
      }
      this.$cimList.storequartersGoods.cinemaRawStockQuery(value).then( res => {
        console.log(res)
          if(res.code === 200) {
              if(res.data.channelEntityVoList != null){
                let channelString =[]
                let channelArr =[]
                res.data.channelEntityVoList.forEach((val,index,arr)=>{
                  let newObj = {}
                  newObj.channelUid = val.uid
                  newObj.name = val.name
                  channelString.push(val.name)
                  channelArr.push(newObj)
                })
                this.selectedChannelName = channelString.join(",")
                this.queryData.channels = channelArr
                this.queryData.channelEntityList = channelArr
              }
              // this.queryData.channelEntityList=res.data.channelEntityVoList
              this.queryData.unitUid =res.data.unitName
              this.seechannelArr = res.data.channelEntityVoList
              this.queryData.cinemaMerUid =res.data.cinemaMerUid
              this.queryData.cinemaName =res.data.cinemaName
              this.queryData.catUid =res.data.catUid
              this.queryData.saleChannel =res.data.saleChannel
              this.queryData.catName =res.data.catName
              this.queryData.skuUid =res.data.skuUid
              this.queryData.proCode = res.data.code
              this.queryData.uid = res.data.classUid
              this.queryData.cuid = res.data.uid
              this.queryData.cunitUid = res.data.unitUid
              this.queryData.channelName = res.data.channelName
              this.queryData.unitName = res.data.unitName
              this.queryData.uidname = res.data.className
              this.queryData.shorthandCode = res.data.shorthandCode
              this.queryData.name = res.data.name
              this.queryData.aliasName = res.data.aliasName
              this.queryData.spec = res.data.spec
              this.queryData.brandUid = res.data.brandUid
              this.queryData.brandName = res.data.brandName
              this.queryData.skuVoList.barCode = res.data.barCode
              this.queryData.placeOriginName = res.data.placeOriginName
              this.queryData.remark = res.data.remark
              this.queryData.imgUrl = res.data.imgUrl
              this.queryData.taxRate = res.data.taxRate
              this.queryData.skuVoList.code = res.data.skuCode
              this.queryData.skuVoList.price = res.data.price
              this.queryData.canSale = res.data.canSale
              this.queryData.storeDownLimit = res.data.stockLower
              this.queryData.storeUpLimit = res.data.stockUpper
             
              if(this.$route.query.type == 3){
                res.data.purUnitEntityVo.forEach((val,index,arr)=>{
                let basicUnitDataOBj = {}
                  basicUnitDataOBj.name = val.name
                  basicUnitDataOBj.purUnitRatio = val.purUnitRatio
                  basicUnitDataOBj.uid = val.uid
                  basicUnitDataOBj.unitEntityUid = val.unitEntityUid
                  basicUnitDataOBj.fun = "1"+val.name+"="+val.purUnitRatio+res.data.unitName
                  this.basicUnitData.push(basicUnitDataOBj)
                })
              }else if(this.$route.query.type == 2){
                res.data.purUnitEntityVo.forEach((val,index,arr)=>{
                let basicUnitDataOBj = {}
                  basicUnitDataOBj.name = val.name
                  basicUnitDataOBj.purUnitRatio = val.purUnitRatio
                  basicUnitDataOBj.uid = val.uid
                  basicUnitDataOBj.unitEntityUid = val.unitEntityUid
                  basicUnitDataOBj.fun = "1"+val.name+"="+val.purUnitRatio+res.data.unitName
                  this.basicUnitData.push(basicUnitDataOBj)
                })
              }
            
            }else {
                this.error(res.msg);
            }
        }).catch( err => {

        })
    },
    // 添加采购单位
    addUnitEvent(){
      console.log(this.queryData.unitUid)
      if(this.queryData.unitUid == ""){
        this.$message('请选择基本单位');
      }else{
        let basicUnitFirstValue = {
          unitUid:"",
          name:"",
          purUnitRatio:"",
          fun:""
        }
        this.basicUnitData.push(basicUnitFirstValue)
      }
    },
    // 系数转换
    changeUnitEvent(value,index){
      let purUnitRatio = this.basicUnitData[0].purUnitRatio
      let name = this.basicUnitData[0].name
      let newFun = purUnitRatio + this.basicUnitData[index].name + "=" + this.basicUnitData[index].purUnitRatio +name
      this.basicUnitData[index].fun = newFun
      this.buyUnitArr.forEach((val)=>{
        if(val.label == this.basicUnitData[index].name){
          this.basicUnitData[index].unitUid = val.uid
        }
      })
    },
    // 点击采购单位事件
    focusUnitEvent(value,index){
        this.resBuyUnit()
    },
    // 删除采购单位
    unitHandleDlete(row, index){
      this.basicUnitData.splice(index,1)
    },
    // 添加SKU商品
    addSkuEvent(){
      this.skudialog = true
      this.resQueryAttribute()
    },
    // 选择sku属性
    skuSelectEvent(value){},
    // sku弹窗确定按钮
    skuDetermineBtn(){
      this.skudialog = false
      this.resCreateSku()
    },
    channelClick(){
        this.dialogVisibleseechannel = true
    },
    // sku关闭按钮
    skuhandleClose(){
      this.skudialog = false
    },
    // 新建单品关闭sku
    skuDelTableEvent(){
      this.skuData = []
    },
    // 删除sku属性当前行事件
    skuHandleDlete(row, index){
      this.skuData.splice(index,1)
    },
    // 基本单位获取焦点事件
    focusBasicUnitEvent(){
      this.resBasicUnit()
    },
    // 新增单品提交
    comSingleSubmit(){
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if(this.$route.query.type == 1){
            this.resSingleProductSave()
          }else if(this.$route.query.type == 2){
            this.resmerRawStockUpdate()
          }
        }else{
          this.$message("信息填写有误，请按照红色提示修改");
          return false;
        }
      }) 
    },
    // sku属性停用按钮
    stopskuHandleDlete(row,index){
      row.skuStart = !row.skuStart
      if(row.skuStart){
        row.active = "停用"
        row.status = 0
      }else{
        row.active = "启用"
        row.status = 1
      }
      console.log(row)
    },
    // 基本单位请求
    resBasicUnit(){
      let value = {
        // 商品分类
        // this.$route.query.data.uid
        catUid:this.$route.query.type == 1 ? JSON.parse(this.$route.query.data).uid : this.queryData.uid,
        // 0基本单位
        flag:0
      }
      console.log(value)
      this.$cimList.headquartersGoods.merUnitList(value).then( res => {
          if(res.code === 200) {
            let linsbasicUnitArr = []
            let linsObj = {}
            res.data.forEach((val,index,arr)=>{
              linsObj.uid = val.uid
              linsObj.label = val.unitName
              linsObj.value = val.uid
              linsbasicUnitArr.push(linsObj)
              linsObj = {}
            })
            this.basicUnitArr = linsbasicUnitArr
            console.leg(res)
            }else {
                this.error(res.msg);
            }
        }).catch( err => {

        })
    },
    onChanneSumit(data = []) {
      this.queryData.channels = data.map(item => {
        return {
          channelUid: item.uid || item.channelUid,
          name: item.name || item.channelName
        };
      });
      this.selectedChannelName = data
        .map(item => {
          return item.name || item.channelName;
        })
        .join(",");
      console.log("渠道数据", data);

        let newArr = []
        data.forEach((val,index,arr)=>{
          let newObj = {}
          newObj.channelUid = val.uid || val.channelUid
          newObj.uid = ""
          newArr.push(newObj)
        })
        this.queryData.channelEntityList = newArr
    },
    // 销售地点
    onSalesPlaceSumit(data = []) {
      this.queryData.cinemaSalePlaceEntityList = data.map(item => {
        return {
          placeUid: item.uid
        };
      });
      this.salesPlaceName = data
              .map(item => {
                return item.name;
              })
              .join(",");
      console.log("销售地点数据", data);
    },
    //删除渠道
    handleDeleteChanne() {
      this.onChanneSumit([]);
    },
    handleDialog(name) {
      this.$refs[name].handleDialog(true);
    },
    // 采购单位请求
    resBuyUnit(){
      this.buyUnitArr = []
      let value = {
        // 商品分类
        // ruter.data.uid
        catUid:this.$route.query.type == 1 ? JSON.parse(this.$route.query.data).uid : this.queryData.uid,
        // 0基本单位
        flag:1
      }
      console.log(value)
      this.$cimList.headquartersGoods.merUnitList(value).then( res => {
          if(res.code === 200) {
            let linsbasicUnitArr = []
            let linsObj = {}
            res.data.forEach((val,index,arr)=>{
              linsObj.uid = val.uid
              linsObj.label = val.unitName
              linsObj.value = val.unitName
              linsbasicUnitArr.push(linsObj)
              linsObj = {}
            })
            this.buyUnitArr = linsbasicUnitArr
            console.leg(res)
            }else {
                this.error(res.msg);
            }
        }).catch( err => {

        })
    },
    saleChannelEvent(){
      if(this.queryData.saleChannel === 1){
         this.queryData.channelEntityList = []
         this.handleDeleteChanne()
      }
    },
    // 创建sku请求
    resCreateSku(){
        let skuAttr = []
        this.skuAttrcheckList.forEach((val1,index,arr)=>{
          val1.forEach((val2,index,arr)=>{
            this.skuAttribute.forEach((skuval,index,arr)=>{
              skuval.Suboptions.forEach((Subval,index,arr)=>{
                if(val2 == Subval.attrValue){
                  let resval = {}
                  resval.attrCode = skuval.code
                  resval.attrName = skuval.name
                  resval.attrType = skuval.attrType
                  resval.attrUid = skuval.attrUid
                  resval.attrValue = Subval.attrValue
                  resval.itemCode = Subval.itemCode
                  resval.itemUid = Subval.uid
                  skuAttr.push(resval)
                  resval = {}
                }
              }) 
            })
          })
        })
      let resValue = {
        merCode:JSON.parse(this.$route.query.data).proCode,
        skuAttr:skuAttr,
        spuUid:null
      }
      this.$cimList.headquartersGoods.singleProductCreateSku(resValue).then( res => {
        if(res.code === 200){
          this.skuColumnEvent(res.data)
          console.log(res)
          }
        }).catch( err => {

        })
    },
    // 查看销售属性请求
    resQueryAttribute(){
      let resValue = {
        // ruter.data.uid
        merClassUid:'51c40ea1-9597-4a0e-baa1-6a05e21933b8'
      }
      console.log(resValue)
      this.$cimList.headquartersGoods.singleProductQueryAttribute(resValue).then( res => {
          if(res.code === 200) {
            this.skuAttribute = res.data
            console.leg(res)
            }else {
                this.error(res.msg);
            }
        }).catch( err => {

        })
    },
    handleDialog(name) {
      this.$refs[name].handleDialog(true);
    },
     // 修改原材料
    resmerRawStockUpdate(){
      if(this.queryData.cinemaMerUid == ""){
        this.queryData.channelEntityList.forEach((val)=>{
          val.uid = ""
        })
      }
      let resValue = {
          cinemaUid:this.queryData.cinemaUid,
          uid:this.queryData.cuid,
          catUid:this.queryData.catUid,
          skuUid:this.queryData.skuUid,
          aliasName:this.queryData.aliasName,
          barCodeUid:this.queryData.skuVoList.barCode,
          brandUid:this.queryData.brandUid,
          canSale:this.queryData.canSale,
          classUid:this.queryData.uid,
          code:this.queryData.proCode,
          imgUrl:this.queryData.imgUrl,
          name:this.queryData.name,
          placeOrigin:this.queryData.placeOrigin,
          price:this.queryData.skuVoList.price,
          remark:this.queryData.remark,
          saleChannel:this.queryData.saleChannel,
          saleCinema:this.queryData.saleCinema,
          shorthandCode:this.queryData.shorthandCode,
          skuCode:this.queryData.skuVoList.code,
          spec:this.queryData.spec,
          status:"",
          stockLower:this.queryData.storeDownLimit,
          stockUpper:this.queryData.storeUpLimit,
          taxRate:this.queryData.taxRate,
          type:5,
          unitEntityList:this.basicUnitData,
          unitUid:this.queryData.cunitUid,
          upTime:this.queryData.upperTime,
          attributeVoList:[],
          channelEntityList:this.queryData.channelEntityList,
          cinemaEntityList:this.queryData.cinemaEntityList
      }
      console.log(resValue)
      this.$cimList.storequartersGoods.cinemaRawStockUpdate(resValue).then( res => {
          if(res.code === 200) {
            // this.AttributeSkudata = res.data
            this.handleCancel();
            this.$message("修改成功");
            }else {
              this.$message(res.msg);
            }
        }).catch( err => {

        })
        
    },

    chuliAttributeSkudata(){
      let newSkudata = []
      let newobj = {}
      this.AttributeSkudata.forEach((val,index,arr)=>{

      })
    },
    // 多个sku数据处理
    skuColumnEvent(valskuData){
    let skuData = []
    valskuData.forEach((val,index,arr)=>{
      let valObj = {}
      valObj.code = val.code
      valObj.active = "启用"
      valObj.status = 1
      valObj.skuStart = false
      valObj.skuAttributeList = []
      val.skuAttr.forEach((skuval,skuindex,skuarr)=>{
        let sttrObj = {}
        if(skuval.attrCode == 1){
          valObj.kouwei = skuval.attrValue
        }else if(skuval.attrCode == 2){
          valObj.color = skuval.attrValue
        }else if(skuval.attrCode == 3){
          valObj.tiandu = skuval.attrValue
        }
        sttrObj.attrValue = skuval.attrValue
        sttrObj.attrCode = skuval.attrCode
        sttrObj.attrName = skuval.attrName
        sttrObj.attrType = skuval.attrType
        sttrObj.attrUid = skuval.attrUid
        sttrObj.attrValue = skuval.attrValue
        sttrObj.itemCode = skuval.itemCode
        sttrObj.itemUid = skuval.itemUid

        valObj.skuAttributeList.push(sttrObj)
      })
      skuData.push(valObj)
    })
    this.skuData = skuData
        valskuData[0].skuAttr.forEach((skuval,skuindex,skuarr)=>{
        let skuColomOBj = {}
        if(skuval.attrCode == 1){
          skuColomOBj.label = skuval.attrName
          skuColomOBj.key = 'kouwei'
        }else if(skuval.attrCode == 2){
          skuColomOBj.label = skuval.attrName
          skuColomOBj.key = 'color'
        }else if(skuval.attrCode == 3){
          skuColomOBj.label = skuval.attrName
          skuColomOBj.key = 'tiandu'
        }
        this.skuColumn.splice(1,0,skuColomOBj)
    })

    },
    renderHeader(h, { column, $index }) {
      return h("div", {
        attrs: {
          class: "cell" //ele原来样式
        },
        domProps: {
          innerHTML: '<span class="red">* </span>' + column.label
        }
      });
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
    // 查询
    onQuery() {
      // this.getTerminalQueryPage(this.queryData);
      // console.log(this.queryData);
    },
    // 获取终端列表
    getTerminalQueryPage(param) {
      this.tableLoding = true;
      this.$api
        .terminalQueryPage(param)
        .then(resData => {
          if (resData.code == 200) {
            let tempArr = [];
            tempArr = resData.data.records.map(item => {
              if (item.salePlaceEntity) {
                item.placeName = item.salePlaceEntity.placeName;
                item.placeUid = item.salePlaceEntity.uid; //仓库id
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
    terminalUpdate(param) {
      this.$api.terminalUpdate(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 销售地址查询
    getSalePlaceAll(param) {
      this.$api.salePlaceAll(param).then(resData => {
        if (resData.code == 200) {
          this.salePlaces = resData.data;
        }
      });
    },
    // 货架查询
    getTerminalRackAll(param) {
      this.$api.terminalRackAll(param).then(resData => {
        if (resData.code == 200) {
          this.storageRacks = resData.data;
        }
      });
    },
    // 修改操作
    handleModification(index, row) {
      const { id, tername, status, placeUid, rackCode, rackName } = row;
      this.getSalePlaceAll();
      this.getTerminalRackAll();
      this.changeData.id = id;
      this.changeData.tername = tername;
      this.changeData.status = status.toString();
      this.changeData.placeUid = placeUid; //销售地址 = placeUid;
      this.changeData.rackCode = rackCode; //仓库编码
      this.terminalStatusDialog = true;
    },
    handleChange(value) {
      console.log(value);
    },
    // 确定提交信息
    handleSubmit() {
      console.log(this.recipeGroupList);
    },
    // 取消提交信息
    // handleCancel() {
    //   this.handleCancel();
    // },
    handleCancel() {
      this.$store.commit("tagNav/removeTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query
      })
      this.$router.push({
          path: "/retail/commodityInformationStore/list",
      });
    },
    //确认提交修改
    handleModificationSubmit() {
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
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    },
    // 添加配方分组
    handleAddrRecipeGroup() {
      this.recipeGroupList.push({
        attrValue: "",
        id: Math.random(),
        delFlag: 0,
        tableData: [
          {
            address: "奶粉",
            tername: "YCL001",
            code: "124547",
            mac: "",
            dosage: { min: "", max: "" },
            mac2: "g"
          },
          {
            address: "汤",
            tername: "YCL002",
            code: "124547",
            mac: "",
            dosage: { min: "", max: "" },
            mac2: "g"
          },
          {
            address: "中杯",
            tername: "YCL003",
            code: "124547e",
            mac: "",
            dosage: { min: "", max: "" },
            mac2: "个"
          }
        ]
      });
    },
    // 删除配方分组
    handleDleteRecipeGroup(index) {
      this.recipeGroupList.splice(index, 1);
    },
    handleRecipeTableDlete(groupIndex, row, index) {
      console.log(groupIndex, row, index);
      this.recipeGroupList[groupIndex].tableData.splice(index, 1);
    },
    //确定选择适用门店
    handleStoresCheckedNodes(checkedValue) {
      this.checkedNodes(this.applyStoresRadios, checkedValue);
    },
    //确定选择适用渠道
    handleChannelCheckedNodes(checkedValue) {
      this.checkedNodes(this.applyChannelRadios, checkedValue);
    },
    checkedNodes(radios, checkedValue) {
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
              .join(",");
            item.checkedKys = checkedValue.value.map(valueItem => {
              return valueItem.id;
            });
          }
        }
      });
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
    }
  },
  computed: {
    routeQuery() {
      return this.$route.query;
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
          return "修改";
          break;
        // 合成品
        case "3":
          return "查看";
          break;
      }
    }
  },
  components: {
    applyStores,
    applyChannel,
    channelDialog,
    salesPlace,
    seechannelDialog
  }
};
</script>


<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.storemateerial-style{
  .basic-input {
    min-width: 250px;
  }

  .putaway-timer {
    .el-form-item__content {
      min-width: 150px;
    }
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
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
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
  .sku-table{
    background: #F5F5F5;
    border-radius: 4px;
    border-radius: 4px;
    padding:17px 53px 17px 17px;
    box-sizing: border-box;
    position: relative;
    .del-btn{
      position: absolute;
      top:12px;
      right:12px;
      i{
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
  .widthInput100{
    width: 192px;
    min-width:100px;
    display:inline-block;
  }
  .sku{
    button{
      margin-left:20px;
    }
  }
  .selectUnit{
    .el-form-item{
      margin-bottom:0;
    }
  }
  .sku-box{
    .sku-select-group{
      .line{
        height:1px;
        width:100%;
        background: #E5E5E5;
        margin-bottom:16px;
      }
      .name{
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        margin-bottom:16px;
      }
      .el-checkbox{
        margin-bottom:16px;
      }
    }
    .tips{
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