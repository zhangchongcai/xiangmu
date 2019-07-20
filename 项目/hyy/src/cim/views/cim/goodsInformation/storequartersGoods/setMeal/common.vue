<template>
<div class="sommeal-style">
  <div class="content">
    <!-- <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/retail/commodityInformationStore/list' }">门店商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}套餐</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <!-- {{this.queryData}} -->
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
              <span>套餐</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码">
              <span class="col666">{{queryData.code}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品分类">
              <span>{{queryData.className}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="速记代码" prop="shorthandCode">
              <span>{{queryData.shorthandCode}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="name"
              label="商品名称"
              :rules="[{ required: true, message: '商品名称不能为空',trigger: 'change' }]"
            >
              <span>{{queryData.name}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="aliasName" label="销售别名">
              <span>{{queryData.aliasName}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品描述" prop="remark">
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
      <!-- 基础信息 end-->
      
      <!-- 套餐信息 start-->
      <div>
        <div class="sub-tittle">套餐信息</div>
        <div class="add-material clearfix">
          <el-button class="right" v-if="routeQuery.type!=3" @click=" handleAddGoods">添加商品</el-button>
        </div>
        <div
          class="recipe-box"
          v-for="(item,groupIndex) in formattingDataList"
          :key="item.id"
          v-show="item.options.length>0"
          >
          <div class="add-material clearfix">
            <div class="left" v-if="item.isOption != 0">{{item.name}} 可替换为以下商品</div>
          </div>
          <div>
            <el-table :data="item.options" stripe v-loading="tableLoding">
              <el-table-column
                v-for="item in formatRecipeTableColumn(item)"
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
                    <el-input v-else size="small" v-model="row[item.key]" placeholder></el-input>
                  </div>
                  <div v-else-if="item.bothEdit">
                    <div v-if="routeQuery.type==3">
                      <span>{{row[item.key].flag==0 ? '加价':'减价'}}</span>
                      <span>{{row[item.key].price}}</span>
                    </div>

                    <div v-else>
                      <el-select v-model="row[item.key].flag" placeholder class="both-edit-inp">
                        <el-option label="加价" value="0"></el-option>
                        <el-option label="减价" value="1"></el-option>
                      </el-select>
                      <el-input
                        size="small"
                        class="both-edit-inp"
                        v-model="row[item.key].price"
                        placeholder
                      ></el-input>
                    </div>
                  </div>
                  <div v-else>
                    <span>{{row[item.key]}}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="操作" v-if="routeQuery.type!=3">
                <template slot-scope="{row,$index}">
                  <el-button
                    v-if="item.isOption == 0"
                    type="text"
                    size="small"
                    @click.stop="handleAddOptionalItems(row, $index)"
                  >添加可选商品</el-button>
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
      </div>
      <!-- 套餐信息 end-->

      <!-- 销售信息 start-->
      <div>
        <div class="sub-tittle">销售信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="price" label="价格">
              <span v-if="routeQuery.type==3">{{queryData.price}}</span>
              <el-input v-else class="basic-input" v-model="queryData.price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="销售状态" prop="canSale">
              <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
              <el-radio-group v-model="queryData.canSale" v-else>
                <el-radio label="1">允许</el-radio>
                <el-radio label="0">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="putaway-timer">
          <el-col :span="12">
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
          </el-col>
          <el-col :span="12">
            <el-form-item prop="downTime" label="下架时间">
              <span v-if="routeQuery.type==3">{{queryData.downTime == null || queryData.downTime == "" ? '不限制' : queryData.downTime}}</span>
              <div v-else>
                <el-select v-model="queryData.downTimeType" placeholder="请选择" class="endTime-input" @change="downTimeEvent()">
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="适用门店">
              <span>{{this.queryData.cinemaName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
                <el-form-item label="适用渠道">
                  <span v-if="routeQuery.type==3">{{queryData.saleChannel==1?"全部渠道": selectedChannelName}}</span>
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
          <el-col :span="12">
                <el-form-item label="销售地点">
                  <span v-if="routeQuery.type==3">{{queryData.salePlace==1?"全部地点":salesPlaceName}}</span>
                  <!-- <span v-if="routeQuery.type==3">{{salesPlaceName}}</span> -->
                  <div v-else>
                    <el-select v-model="queryData.salePlace" placeholder="请选择" class="apply-select" @change="salePlaceEvent()">
                      <el-option
                              v-for="item in salesPlaceRadios"
                              :key="item.type"
                              :label="item.label"
                              :value="item.type"
                      ></el-option>
                    </el-select>
                    <span class="select-input" v-if="queryData.salePlace!=1">
                    <el-input
                            class="input apply-stores-input"
                            placeholder="请选择"
                            v-model="salesPlaceName"
                            clearable
                            @focus="handleDialog('mySalesPlaceDialog')"
                            @clear="handleplaceDeleteChanne"
                    >
                    </el-input>
                    <el-button @click.stop="handleDialog('mySalesPlaceDialog')" type="primary cinemaSel-btn" plain>选择</el-button>
                    </span>
                  </div>
                </el-form-item>
              </el-col>
        </el-row>
      </div>
      <!-- 销售信息 end-->
      <div class="submit-box">
        <el-button type="primary" @click="handleSubmit" v-if="routeQuery.type!=3">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-form>

    <!-- 添加套餐 -->
    <el-dialog
      class="change-dialog"
      width="70%"
      title="选择套餐及包装"
      :visible.sync="addRawMaterialDialog"
    >
      <div>
        <el-row>
          <el-col :span="6">
            <el-tree :data="categoryTrees" :props="defaultProps" @node-click="handleaCtegoryTrees"></el-tree>
          </el-col>
          <el-col :span="18">
            <div>
              <el-form
                :inline="true"
                :model="materialQueryData"
                label-position="right"
                label-suffix=":"
              >
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="商品名称">
                      <el-input
                        placeholder
                        class="change-dialog-inp"
                        v-model="materialQueryData.name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="商品编码">
                      <el-input
                        placeholder
                        class="change-dialog-inp"
                        v-model="materialQueryData.merCode"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label>
                      <el-button icon="el-icon-search" @click="onQuery">查询</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="SKU编码">
                      <el-input
                        placeholder
                        class="change-dialog-inp"
                        v-model="materialQueryData.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="速记代码">
                      <el-input
                        placeholder
                        class="change-dialog-inp"
                        v-model="materialQueryData.shorthandCode"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div>
              <el-row>
                <el-col :span="18">
                  <div class="table-box">
                    <el-table
                      ref="materialTable"
                      :data="materialTableData"
                      height="300"
                      @selection-change="handleSelectionMaterial"
                      stripe
                      v-loading="tableLoding"
                    >
                      <el-table-column type="selection" width="40"></el-table-column>
                      <el-table-column
                        v-for="item in materialTableColumn"
                        :key="item.key"
                        :prop="item.key"
                        :label="item.label"
                        :formatter="item.formatter"
                      ></el-table-column>
                    </el-table>
                    <div class="page-wrap">
                      <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="queryData.currentPage"
                        :page-size="queryData.pageSize"
                        :background="pgbackground"
                        :page-sizes="pageSizes"
                        :layout="pgLayout"
                        :total="total"
                      ></el-pagination>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="empty-box">
                    <div class="clearfix">
                      <span class="selected-content f-l">已选内容</span>
                      <el-button type="text" class="f-r" @click="handleEmptyMaterials">清 空</el-button>
                    </div>
                    <hr>
                    <ul class="empty-content">
                      <li v-for="(item,index) in selectedMaterials" :key="item.code">
                        <el-tag
                          size="small"
                          @close="handleDelMaterial(item,index)"
                          closable
                        >{{item.name}}</el-tag>
                      </li>
                    </ul>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="addRawMaterialDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择销售地点 -->
    <sales-place 
      ref="mySalesPlaceDialog" 
      @onSumit="onSalesPlaceSumit" 
      :cinemaUid="newcinemaUid"
      multiple>
    </sales-place>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" multiple :title="'选择适应渠道'" :dialogFeedbackData="queryData.channels"></channel-dialog>
    <!-- 选择商品 -->
    <selected-goods
      :dialogVisible.sync="selectedGoodsDialogVisible"
      :dialogFeedbackData="goodList"
      :merType="'1,2'"
      @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
    ></selected-goods>
  </div>
</div>  
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import applyStores from "cim/components/applyStores/applyStores.vue";
import applyChannel from "cim/components/applyChannel/applyChannel.vue";
import salesPlace from "cim/components/salesPlace/salesPlace.vue";
import channelDialog from "cim/components/channelDialog/channelDialog.vue";
import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      selectedGoodsDialogVisible: false, //添加套餐弹窗
      goodList: [],
      newcinemaUid:"",
      selectedChannelName:"",
      //查询数据
      queryData: {
        saleChannel: 1, //适用渠道 1全部渠道 0指定渠道
        channels: [],
        places:[],
        saleChannelList:[],
        salePlace:1,
        cinemaSalePlaceEntityList: [],
        cinemaUid:"",
        cinemaName:"",
        //基础信息
        type: "4", //商品类型：4-套餐
        classUid: "", //类别id
        className: "", //商品分类
        code: "", //商品编码
        shorthandCode: "", //速记代码
        name: "", //商品名称
        aliasName: "", //销售别名
        remark: "", //商品描述
        imgUrl:
          "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1306880214,1632905597&fm=26&gp=0.jpg", //商品图片
        // 套餐信息
        dataList: [],
        //销售信息
        price: "", //价格
        canSale: "1", //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: 0, //适用门店 1全部门店 0指定门店 2排除门店
        cinemas: [],
      },
      // 套餐信息表头
      recipeTableColumn: [
        {
          label: "商品名称",
          key: "merName"
        },
        {
          label: "商品编码",
          key: "merCode"
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
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "数量",
          key: "merCount",
          edit: true
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "售价",
          key: "price"
        },
        {
          label: "加减价金额（元）",
          key: "addOrMinus",
          bothEdit: true,
          width: 200
        }
      ],
      isMaySelected: null, //点击的可选商品对象
      // 套餐查询数据
      materialQueryData: {
        classUid: "51c40ea1-9597-4a0e-baa1-6a05e21933b8", //商品分类id
        name: "",
        merCode: "",
        shorthandCode: "",
        code: "",
        page: 1,
        pageSize: 10
      },
      // 添加套餐表头
      materialTableColumn: [
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品编码",
          key: "merCode"
        },
        {
          label: "SKU编码",
          key: "code"
        },
        {
          label: "速记代码",
          key: "shortCode"
        },
        {
          label: "商品规格",
          key: "spec"
        },
        {
          label: "基本单位",
          key: "uniteName"
        }
      ],
      materialTableData: [],
      selectedMaterials: [],
      value: "",
      addRawMaterialDialog: false, //添加套餐弹窗
      defaultProps: {
        children: "children",
        label: "name"
      },
      options: [],
      categoryTrees: [],
      tableLoding: false,
      total: 0,
      applyStoresRadios: [],
      salesPlaceName: "",
      salesPlaceRadios: [
        {
          label: "全部地点",
          type: 1
        },
        {
          label: "指定地点",
          type: 0
        }
      ],
      applyChannelRadios: [
        {
          label: "全部渠道",
          type: 1
        },
        {
          label: "指定渠道",
          type: 0
        }
      ]
    };
  },
  mounted() {
    this.init();
    // console.log(this.routeQuery);
    console.log(this.routeMerData);
    
  },
  watch:{
    'salePlace':function(newval){
      this.salePlace = newval
    }
  },
  methods: {
    init() {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
      this.setmealLoadCategoies({});
      switch (this.routeQuery.type) {
        // 新建
        case "1":
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.classUid = this.routeMerData.uid;
          this.queryData.className = this.routeMerData.uidname;
          break;
        //修改
        case "2":
          this.queryData.cinemaUid = JSON.parse(this.$route.query.cinemaUid)
          this.newcinemaUid = JSON.parse(this.$route.query.cinemaUid)
          console.log(this.queryData.cinemaUid)
          let val1 = {
            uid:this.routeMerData.uid,
            cinemaUid:this.queryData.cinemaUid.toString()
          }
          this.setmealQuery(val1);
          break;
        //查看
        case "3":
          this.queryData.cinemaUid = JSON.parse(this.$route.query.cinemaUid)
          let val = {
            uid:this.routeMerData.uid,
            cinemaUid:this.queryData.cinemaUid.toString()
          }
          this.setmealQuery(val);
          break;
      }
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
                return item.placeName;
              })
              .join(",");
    },
    handleDialog(name) {
      this.$refs[name].handleDialog(true);
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
      // console.log(this.queryData);
      this.materialQueryData.classUid = "";
      this.setmealLoadItems(this.materialQueryData);
    },
    // 查看
    setmealQuery(param) {
      console.log(param)
      this.$cimList.storequartersGoods
        .cinmaSetmealQuery(param)
        .then(resData => {
          if (resData.code == 200) {
            this.queryData = resData.data;
            this.queryData.canSale = this.queryData.canSale.toString();
            this.queryData.saleChannel = this.queryData.saleChannel
            if(this.queryData.hasOwnProperty('places')){

            }else{
              Vue.set(this.queryData,"salePlace", 1)
            }
            if(resData.saleChannel == 1){
              this.queryData.channels = []
            }
            if(this.queryData.channels.length > 0){
                let channelString =[]
                let newchannels = []
                resData.data.channels.forEach((val,index,arr)=>{
                  channelString.push(val.channelName)
                  let newObj = {}
                  newObj.channelUid = val.channelUid
                  newObj.name = val.channelName
                  newchannels.push(newObj)
                })
                this.selectedChannelName = channelString.join(",")
                this.queryData.channels = newchannels
              }
              Vue.set(this.queryData,"downTimeType", "0")
              this.queryData.downTimeType = this.queryData.downTime == null || this.queryData.downTime == "" ? "0":"1"
            if(this.queryData.places.length > 0){
              let placesString =[]
                let newplaces = []
                resData.data.places.forEach((val,index,arr)=>{
                  placesString.push(val.placeName)
                  let newObj = {}
                  newObj.placeUid = val.placeUid
                  newplaces.push(newObj)
                })
                this.salesPlaceName = placesString.join(",")
                this.queryData.cinemaSalePlaceEntityList = newplaces
                
            }
            
            console.log("data", this.queryData);
          }
        })
        .catch(err => {});
    },
    downTimeEvent(){
      if(this.queryData.downTimeType == "0"){
        this.queryData.downTime = ""
      }
    },
    //选择商品确认
    selectedGoodsDialogCallBack(value) {
      if (value.btnType == 1) {
        let tempArr = value.data;
        if (this.isMaySelected) {
          //可选商品不能选择自己
          tempArr = tempArr.filter(item => {
            return item.skuCode != this.isMaySelected.skuCode;
          });
          // 组装
          tempArr = tempArr.map(item => {
            item.parentSkuCode = this.isMaySelected.skuCode;
            item.isChange = 1;
            item.uid = null;
            item.merCount = 1;
            return item;
          });
          this.queryData.dataList.push(...tempArr);
        } else {
          tempArr = tempArr.map(item => {
            item.parentSkuCode = item.skuCode;
            item.uid = null;
            return item;
          });
          console.log(this.formattingDataList)
          this.queryData.dataList.push(...tempArr);
          this.queryData.dataList = this.unRepeat(this.queryData.dataList);
        }
      }
    },
    // 新增
    setmealSave(param) {
      this.$cimList.storequartersGoods
        .cinmaSetmealSave(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$router.go(-1);
            this.$message("修改成功");
          } else {
            this.$message(resData.msg);
          }
        })
        .catch(err => {});
    },
    // 查询分类
    setmealLoadCategoies(param) {
      this.$cimList.headquartersGoods
        .setmealLoadCategoies(param)
        .then(resData => {
          if (resData.code == 200) {
            this.categoryTrees = resData.data.children;
          }
        })
        .catch(err => {});
    },
    // 获取套餐商品及可选商品
    setmealLoadItems(param) {
      this.$cimList.headquartersGoods
        .setmealLoadItems(param)
        .then(resData => {
          if (resData.code == 200) {
            this.materialTableData = resData.data.list;
            this.total = resData.data.total;
          }
        })
        .catch(err => {});
    },
    // 选择添加套餐
    handleSelectionMaterial(value) {
      this.selectedMaterials = value;
      console.log(value);
    },
    // 清空选择的套餐
    handleEmptyMaterials() {
      this.selectedMaterials = [];
      this.$refs.materialTable.clearSelection();
    },
    // 删除单个选择的套餐
    handleDelMaterial(row, index) {
      this.selectedMaterials.splice(index, 1);
      this.$refs.materialTable.toggleRowSelection(row);
    },
    // 查询树
    handleaCtegoryTrees(data) {
      // this.materialQueryData.classUid = data.uid;
      this.setmealLoadItems({
        classUid: data.uid,
        page: this.materialQueryData.page,
        pageSize: this.materialQueryData.pageSize
      });
    },
    // 确定提交信息
    handleSubmit() {
      console.log(this.queryData.cinemaUid);
      console.log(this.requestDataList(this.formattingDataList));
      let tempArr = JSON.parse(JSON.stringify(this.queryData));
      tempArr.dataList = this.requestDataList(this.formattingDataList);
      tempArr.cinemaUid = this.newcinemaUid
      tempArr.saleChannel = parseInt(this.queryData.saleChannel)
      tempArr.channels = tempArr.saleChannel == 1 ? [] : tempArr.channels
      // let newchannels = []
      console.log(tempArr.channels)
      // if(tempArr.saleChannel == 0){
      //   tempArr.channels.forEach((val,index,arr)=>{
      //     let newObj = {}
      //     newObj.channelUid = val.channelUid
      //     newchannels.push(newObj)
      //   })
      //   tempArr.channels = newchannels
      // }
      tempArr.places = tempArr.cinemaSalePlaceEntityList
      if(tempArr.salePlace == 1){
        tempArr.places = []
      }
      delete tempArr.saleCinema
      delete tempArr.cinemas
      if (this.routeQuery.type == 1) {
        this.setmealSave(tempArr);
      } else if (this.routeQuery.type == 2) {
        if(tempArr.hasOwnProperty('places')){
          // 门店的参数
        }else{
          // 总部的参数
          tempArr.dataList.forEach((val,index,arr)=>{
            delete val.uid
          })
        }
        console.log(tempArr.downTimeType)
        console.log(tempArr.downTime)
      if(tempArr.saleChannel === 0 && tempArr.channels.length === 0){
        this.$message("请选择指定销售渠道")
      }else if(tempArr.salePlace === 0 && tempArr.cinemaSalePlaceEntityList.length === 0){
        this.$message("请选择指定销售地点")
      }else if(tempArr.downTimeType === "1" && tempArr.downTime === "" || tempArr.downTimeType === "1" && tempArr.downTime === null){
        this.$message("选择了指定下架时间,请选择时间")
      }
      else{
        this.setmealSave(tempArr);
      }
        
      } else if (this.routeQuery.type == 3) {
        //查看
      }
    },
    // 处理请求参数
    requestDataList(data = []) {
      let tempArr = [];
      data.forEach(item => {
        if (item.options.length > 0) {
          tempArr.push(...item.options);
        }
      });
      tempArr.map(item => {
        if (item.addOrMinus && item.addOrMinus.price) {
          item.addFlag = item.addOrMinus.flag;
          //减价为负数
          // if (item.addOrMinus.flag == 1) {
          //   item.addPrice = "-" + item.addOrMinus.price;
          // } else {
          item.addPrice = item.addOrMinus.price;
          // }
        }
        return item;
      });
      return tempArr;
    },
    // 取消提交信息
    handleCancel() {
      this.$router.go(-1);
    },
    //确认提交修改
    handleModificationSubmit() {
      if (this.isMaySelected) {
        let tempArr = JSON.parse(JSON.stringify(this.selectedMaterials));
        tempArr = tempArr.map(item => {
          item.parentSkuCode = this.isMaySelected.code;
          item.isChange = 1;
          item.uid = "";
          return item;
        });

        this.queryData.dataList.push(...tempArr);
      } else {
        let tempArr = JSON.parse(JSON.stringify(this.selectedMaterials));
        tempArr = tempArr.map(item => {
          item.parentSkuCode = item.code;
          item.uid = "";
          return item;
        });
        this.queryData.dataList = tempArr;
      }
      console.log(this.queryData.dataList);
      this.addRawMaterialDialog = false;
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    },
    // 删除配方分组
    handleDleteRecipeGroup(index) {
      this.queryData.combinationSkuVoList.splice(index, 1);
    },
        //删除渠道
    handleDeleteChanne() {
      this.onChanneSumit([]);
    },
        //删除地点
    handleDeleteplace() {
      this.onSalesPlaceSumit([]);
    },
        // 渠道
    onChanneSumit(data = []) {
      this.queryData.channels = data.map(item => {
        return {
          channelUid: item.uid || item.channelUid,
          name: item.name || item.channelName
        };
      });
      this.selectedChannelName = data
        .map(item => {
          return item.name;
        })
        .join(",");
      console.log("渠道数据", data);
        // let newArr = []
        // data.forEach((val,index,arr)=>{
        //   let newObj = {}
        //   newObj.channelUid = val.uid
        //   newArr.push(newObj)
        // })
        // this.queryData.channels = newArr 
    },
    // 添加商品
    handleAddGoods(value) {
      this.isMaySelected = null;
      this.selectedGoodsDialogVisible = true;
      this.goodList = [];
    },
    //添加可选商品
    handleAddOptionalItems(row, index) {
      this.goodList = [];
      console.log(this.goodList);
      this.isMaySelected = row;
      this.selectedGoodsDialogVisible = true;
    },

    // 删除商品
    handleRecipeTableDlete(groupIndex, row, index) {
      this.$confirm("确认删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.queryData.dataList = this.queryData.dataList.filter(item => {
            return item.merCode != row.merCode;
          });
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    //确定选择适用门店
    handleStoresCheckedNodes(checkedValue) {
      this.checkedNodes(this.applyStoresRadios, checkedValue);
    },
    //确定选择适用渠道
    handleChannelCheckedNodes(checkedValue) {
      this.checkedNodes(this.applyChannelRadios, checkedValue);
    },
    checkedNodes(radios = [], checkedValue) {
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
    },
    saleChannelEvent(){
      this.selectedChannelName = ""
      if(this.queryData.saleChannel == 1){
         this.queryData.channels = []
      }
    },
    salePlaceEvent(){
      if(this.queryData.salePlace == 1){
         this.queryData.cinemaSalePlaceEntityList = []
      }
    },
    formatRecipeTableColumn(item) {
      let optionList = JSON.parse(JSON.stringify(this.recipeTableColumn));
      if (item.isOption == 0) {
        optionList.pop();
      }else{
        optionList.splice(7,1)
        optionList[5].edit = false
      }
      return optionList;
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
          return "修改";
          break;
        // 合成品
        case "3":
          return "查看";
          break;
      }
    },
    formattingDataList() {
      let allDataList = JSON.parse(JSON.stringify(this.queryData.dataList));
      let resultArr = [];
      let optionList = [];
      allDataList.forEach(item => {
        //加价标志，0：加价，1：减价
        if (item.addFlag == 0) {
          item.addOrMinus = {
            flag: "0",
            price: item.addPrice
          };
        } else {
          item.addOrMinus = {
            flag: "1",
            price: item.addPrice
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
      console.log(resultArr);
      return resultArr;
    }
  },
  components: {
    applyStores,
    applyChannel,
    salesPlace,
    channelDialog,
    selectedGoods
  }
};
</script>

<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
.sommeal-style{
  .basic-input {
    min-width: 250px;
  }
  .putaway-timer {
    .el-form-item__content {
      min-width: 150px;
    }
  }
  .add-material {
    margin-bottom: 10px;
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
  .submit-box {
    margin-top: 50px;
    text-align: center;
  }
  .table-box {
    margin-top: 10px;
  }
  .both-edit-inp {
    width: 80px;
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
  .empty-box {
    padding: 10px;
    .selected-content {
      margin-top: 6px;
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }
    .empty-content {
      height: 300px;
      overflow-y: auto;
      li {
        margin-top: 5px;
      }
    }
    .el-tag {
      width: 100%;
    }
    .el-tag .el-icon-close {
      float: right;
      top: 4px;
    }
  }
}
</style>