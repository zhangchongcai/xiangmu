<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">总部商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{'新建'}}原材料</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tittle"></div>
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="85px"
      label-suffix=":"
    >
      <!-- 基础信息 start-->
      <div>
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品类型">
              <span>单品</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码">
              <span>HC201903241023</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品分类">
              <span>饮料</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="速记代码">
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="商品名称"
              :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]"
            >
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售别名">
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品规格">
              <el-input placeholder class="basic-input"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-select v-model="value" placeholder="请选择" class="basic-input">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              label="基本单位"
              :rules="[{ required: true, message: '基本单位不能为空',trigger: 'change' }]"
            >
              <el-select v-model="basicUnitvalue" placeholder="请选择" class="basic-input" @change="basicUnitEvent()">
                <el-option
                  v-for="item in basicUnitArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
             <el-form-item label="产地">
              <el-radio-group v-model="radio">
                <el-radio :label="1">国产</el-radio>
                <el-radio :label="0">进口</el-radio>
              </el-radio-group>
             </el-form-item>
          </el-col>
        </el-row>  
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品描述">
              <el-input class="basic-input" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="good-img-col">
            <el-form-item label="商品图片" class="good-img-form-item">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">(请上传500kb以内的JPG/PNG文件，建议图片规格：150*150px)</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->
      <!-- {{this.basicUnitData}} -->
      <!-- 采购信息 start-->
      <div>
        <div class="sub-tittle">采购信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="进货税率">
              <el-input placeholder class="basic-input widthInput100"></el-input>
              <span>%</span>
            </el-form-item>
          </el-col>
        </el-row>
        <div>采购单位</div>
        <div>
            <el-table :data="basicUnitData" stripe>
              <el-table-column
                v-for="item in basicUnitColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :width="item.width"
                :formatter="item.formatter"
              > 
                <template slot-scope="{row,$index}">
                  <div v-if="$index == 0">
                    <span>{{row[item.key]}}</span>
                  </div>
                  <template v-if="$index != 0">
                    <div v-if="item.edit">
                      <el-input size="small" v-model="row[item.key]"  @change="selecyUnitEvent(row[item.key],$index)" placeholder></el-input>
                    </div>
                    <div v-else-if="item.selectUnit" class="selectUnit">
                      <el-form-item label="">
                        <el-select v-model="row[item.key]" @change="selecyUnitEvent(row[item.key],$index)" placeholder="请选择" class="basic-input">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{row[item.key]}}</span>
                    </div>
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                  <el-button  v-if="$index != 0" type="text" size="small" @click.stop="unitHandleDlete(row, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
        </div>
        <diV>
          <el-button
            icon="el-icon-circle-plus-outline"
            @click="addUnitEvent()"
            type="text"
          >添加采购单位</el-button>
        </diV>
      </div>
      <!-- 采购信息 end-->

      <!-- 销售信息 start-->
      <div>
        <div class="sub-tittle">销售信息</div>
        <template v-model="skuData" v-if="this.skuData.length == 0">
          <div class="sku">如需添加商品的SKU商品请点击<el-button @click="addSkuEvent()" plain>添加SKU商品</el-button></div>
          <el-row>
            <el-col :span="8">
              <el-form-item label="SKU编码">
                <span>DP201903241026</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                label="售价"
                :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]"
              >
                <el-input placeholder class="basic-input widthInput100"></el-input>元
              </el-form-item>
            </el-col>
          </el-row>
        </template>
        <template v-if="this.skuData.length >= 1">
          <div class="sku-table">
            <divdel-btn class="del-btn">
              <i class="el-icon-close" @click="skuDelTableEvent()"></i>
            </divdel-btn>
            <el-table :data="skuData" stripe>
              <el-table-column
                v-for="item in skuColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :width="item.width"
                :formatter="item.formatter"
              > 
                <template slot-scope="{row,$index}">
                    <div v-if="item.edit">
                      <el-input size="small" v-model="row[item.key]"  @change="selecyUnitEvent(row[item.key],$index)" placeholder></el-input>
                    </div>
                    <div v-else-if="item.selectUnit" class="selectUnit">
                      <el-form-item label="">
                        <el-select v-model="row[item.key]" @change="selecyUnitEvent(row[item.key],$index)" placeholder="请选择" class="basic-input">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div v-else>
                      <span>{{row[item.key]}}</span>
                    </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                  <el-button  type="text" size="small" @click.stop="skuHandleDlete(row, $index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
        <el-row>
          <el-col :span="8">
            <el-form-item label="销售状态">
              <el-radio-group v-model="radio">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="putaway-timer">
          <el-col :span="8">
            <el-form-item label="上架时间">
              <el-date-picker
                class="date-picker"
                v-model="startTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="下架时间">
              <el-select v-model="endTimeRadio" placeholder="请选择" class="endTime-input">
                <el-option key="0" label="不限制" value="0"></el-option>
                <el-option key="1" label="指定时间" value="1"></el-option>
              </el-select>
              <el-date-picker
                v-if="endTimeRadio==1"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                class="date-picker"
                v-model="endTime"
                type="datetime"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="适用门店">
              <apply-stores
                title="适用门店"
                :defaultSelected="0"
                :radios="applyStoresRadios"
                @onCheckedNodes="handleStoresCheckedNodes"
              ></apply-stores>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="适用渠道">
              <apply-channel
                title="适用渠道"
                :defaultSelected="0"
                :radios="applyChannelRadios"
                @onCheckedNodes="handleChannelCheckedNodes"
              ></apply-channel>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="160px" label="是否只允许套餐内售卖">
              <el-radio-group v-model="radio4">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="安全库存">
              <span>上限</span>
              <el-input placeholder class="basic-input widthInput100"></el-input>
              <span>--下限</span>
              <el-input placeholder class="basic-input widthInput100"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 销售信息 end-->
      <div class="submit-box">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-form>
    <!-- 添加sku -->
    <el-dialog
      title="选择销售属性"
      :visible.sync="skudialog"
      width="440px"
      :before-close="skuhandleClose">
      <div class="sku-box">
      <template v-for="(skuitem,index) in skuAttribute">
        <div class="sku-select-group">
          <div class="line"></div>
          <div class="name">{{skuitem.name}}</div>
          <el-checkbox-group v-model="skuitem.modelValue" :max="3" @change="skuSelectEvent(skuAttribute)">
            <el-checkbox :label="selSkuItem" v-for="selSkuItem in skuitem.Suboptions"></el-checkbox>
          </el-checkbox-group>
        </div>
      </template>  
        <div class="tips">
          选择销售属性后，可生成SKU商品，最多可选择3个销售属性
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="skuhandleClose()">取 消</el-button>
        <el-button type="primary" @click="skuDetermineBtn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import applyStores from "cim/components/applyStores/applyStores.vue";
import applyChannel from "cim/components/applyChannel/applyChannel.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      checkList:[],
      // 添加sku数据格式
      skuAttribute:[
        {
          name:"颜色",
          modelValue:[],
          Suboptions:["红色","蓝色","绿色","黄色"]
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
      radio: 1,
      radio1: 1,
      radio2: 1,
      radio3: 1,
      radio4: 1,
      startTime: moment().format("YYYY-MM-DD HH:mm"),
      endTimeRadio: "0",
      endTime: "",
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
      // 采购单位表头数组
      basicUnitColumn: [
        {
          label: "单位名称",
          key: "name",
          selectUnit:true
        },
        {
          label: "转换系数",
          key: "conversion",
          edit: true
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
          label: "颜色",
          key: "color"
        },
        {
          label: "口味",
          key: "kouwei"
        },
        {
          label: "售价",
          key: "shoujia",
          edit: true
        },
        {
          label: "包装条码",
          key: "tiaoma",
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
      sourceTreeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "中大影院"
                },
                {
                  id: 10,
                  label: "客村影院"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "大学城影院"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      //查询数据
      queryData: {
        cinemaUid: "",
        tername: "",
        code: "",
        status: "",
        mac: "",
        ip: "",
        page: 1,
        pageSize: 10
      },
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
          type: 0
        },
        {
          label: "指定门店",
          type: 1,
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
      applyChannelRadios: [
        {
          label: "全部渠道",
          type: 0
        },
        {
          label: "指定渠道",
          type: 1,
          name: "渠道一,渠道二",
          value: [
            {
              id: 9,
              label: "渠道一"
            },
            {
              id: 10,
              label: "渠道二"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.init();
    console.log(this.$route.query);
  },

  methods: {
    init() {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
    },
    // 选择基本单位
    basicUnitEvent(){
      let basicUnitFirstValue = {
          name:this.basicUnitvalue,
          conversion:"1",
          fun:'1'+this.basicUnitvalue+"=1"+this.basicUnitvalue
        }
      // this.basicUnitFirstValue.name = this.basicUnitvalue
      // this.basicUnitFirstValue.fun = '1'+this.basicUnitvalue+"=1"+this.basicUnitvalue
      this.basicUnitData.splice(0,1,basicUnitFirstValue)
    },
    // 添加采购单位
    addUnitEvent(){
      console.log(this.basicUnitvalue)
      if(this.basicUnitvalue == ""){
        this.$message('请选择基本单位');
      }else{
        let basicUnitFirstValue = {
          name:"",
          conversion:"",
          fun:""
        }
        this.basicUnitData.push(basicUnitFirstValue)
      }
    },
    // 系数转换
    selecyUnitEvent(value,index){
      let conversion = this.basicUnitData[0].conversion
      let name = this.basicUnitData[0].name
      let newFun = conversion + this.basicUnitData[index].name + "=" + this.basicUnitData[index].conversion +name
      this.basicUnitData[index].fun = newFun
    },
    // 删除采购单位
    unitHandleDlete(row, index){
      this.basicUnitData.splice(index,1)
    },
    // 添加SKU商品
    addSkuEvent(){
      this.skudialog = true

    },
    // 选择sku属性
    skuSelectEvent(value){
      console.log(value)
    },
    // sku弹窗确定按钮
    skuDetermineBtn(){
      this.skudialog = false
      this.skuData = this.linshiskuData
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
    handleCancel() {
      this.$router.go(-1);
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
  computed: {},
  components: {
    applyStores,
    applyChannel
  }
};
</script>


<style lang="scss">
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
  .el-form-item {
    // margin-bottom: 10;
  }
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
  width: 100px;
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
</style>