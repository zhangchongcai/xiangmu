<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">总部商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{'新建'}}新建合成品</el-breadcrumb-item>
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
              <span>合成品</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商品编码">
              <span>{{queryData.code}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              prop="classUid"
              label="商品分类"
              :rules="[{ required: true, message: '商品分类不能为空',trigger: 'change' }]"
            >
              <el-input placeholder class="basic-input" v-model="queryData.classUid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="速记代码" prop="shorthandCode">
              <el-input placeholder class="basic-input" v-model="queryData.shorthandCode"></el-input>
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
              <el-input placeholder class="basic-input" v-model="queryData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="aliasName" label="销售别名">
              <el-input placeholder class="basic-input" v-model="queryData.aliasName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="spec" label="商品规格">
              <el-input placeholder="例：350ML" class="basic-input" v-model="queryData.spec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="unitUid"
              label="基本单位"
              :rules="[{ required: true, message: '基本单位不能为空',trigger: 'change' }]"
            >
              <el-select v-model="queryData.unitUid" placeholder="请选择" class="basic-input">
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
            <el-form-item label="商品描述" prop="remark">
              <el-input class="basic-input" v-model="queryData.remark" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="good-img-col">
            <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
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

      <!-- 原材料信息 start-->
      <div>
        <div class="sub-tittle">原材料信息</div>
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
                    :rules="[{ required: true, message: '配方名称不能为空'}]"
                  >
                    <el-input class="recipe-name-inp" v-model="item.name"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="'SKU编码'">
                    <span>{{item.code}}</span>
                  </el-form-item>
                </el-col>
              </div>
              <el-col :span="4">
                <el-form-item label="售价" :rules="[{ required: true, message: '售价不能为空'}]">
                  <el-input class="price-inp" type="number" v-model="item.price"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="text-right">
                <el-button @click="addRawMaterialDialog=true" v-if="groupIndex <1">添加原材料及包装</el-button>
                <el-button
                  v-else
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
                    <el-input size="small" v-model="row[item.key]" placeholder></el-input>
                  </div>
                  <div v-else-if="item.bothEdit">
                    <span>上限</span>
                    <el-input
                      size="small"
                      class="both-edit-inp"
                      v-model="row[item.key].max"
                      placeholder
                    ></el-input>
                    <span>下限</span>
                    <el-input
                      size="small"
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

              <el-table-column label="操作">
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

        <diV>
          <el-button
            icon="el-icon-circle-plus-outline"
            @click="handleAddrRecipeGroup"
            type="text"
          >添加配方</el-button>
        </diV>
      </div>
      <!-- 原材料信息 end-->

      <!-- 销售信息 start-->
      <div>
        <div class="sub-tittle">销售信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="销售状态" prop="canSale">
              <el-radio-group v-model="queryData.canSale">
                <el-radio :label="1">允许</el-radio>
                <el-radio :label="0">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="putaway-timer">
          <el-col :span="8">
            <el-form-item prop="upTime" label="上架时间">
              <el-date-picker
                class="date-picker"
                v-model="queryData.upTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="downTime" label="下架时间">
              <el-select v-model="queryData.downTimeType" placeholder="请选择" class="endTime-input">
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
            <el-form-item prop="isSaleAsSetMeal" label-width="160px" label="是否只允许套餐内售卖">
              <el-radio-group v-model="queryData.isSaleAsSetMeal">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
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

    <!-- 添加原材料 -->
    <el-dialog class="change-dialog" width="70%" title="添加原材料" :visible.sync="addRawMaterialDialog">
      <div>
        <el-row>
          <el-col :span="6">
            <el-tree :data="sourceTreeData" :props="defaultProps"></el-tree>
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
                        v-model="materialQueryData.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item label>
                      <el-button icon="el-icon-search">查询</el-button>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item label="速记代码">
                      <el-input
                        placeholder
                        class="change-dialog-inp"
                        v-model="materialQueryData.shorthandCode"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item label="SKU编码">
                      <el-input
                        placeholder
                        class="change-dialog-inp"
                        v-model="materialQueryData.skuCode"
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
                    <el-table :data="materialTableData" height="300" stripe v-loading="tableLoding">
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
                       <el-button type="text" class="f-r">清 空</el-button>
                    </div>
                    <hr>
                    <ul class="empty-content">
                      <li><el-tag size="small" closable>奶粉</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
                      <li><el-tag size="small" closable>糖</el-tag></li>
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
      //查询数据
      queryData: {
        //基础信息
        type: "2", //商品类型：2-合成品
        code: "HC201903241023", //商品编码
        classUid: "衣服", //商品分类
        shorthandCode: "", //速记代码
        name: "", //商品名称
        aliasName: "", //销售别名
        spec: "", //商品规格
        unitUid: "", //基本单位
        remark: "", //商品描述
        imgUrl: "", //商品图片
        // 原材料信息
        combinationSkuVoList: [
          {
            id: Math.random(),
            name: "标准配方",
            price: 10,
            code: "CS00014",
            makeItemVoList: [
              {
                originSkuUid: "", //现调原材料SKU商品UID
                name: "奶粉", //商品名称
                code: "YCL001", //商品编码
                id: "CS1564654652", //
                shorthandCode: "124547", //速记代码
                count: { min: "", max: "" }, //建议用量
                rateAmount: "", //零售比例
                unitName: "g"
              }
            ]
          }
        ],
        //销售信息
        canSale: 1, //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: "", //适用门店
        saleChannel: "", //适用渠道
        isSaleAsSetMeal: 1 //是否只允许套餐内售卖
      },
      // 原材料信息表头
      recipeTableColumn: [
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品编码",
          key: "code"
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
                innerHTML: '<span class="red">* </span>' + column.label
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
                innerHTML: '<span class="red">* </span>' + column.label
              }
            });
          }
        }
      ],
      // 原材料查询数据
      materialQueryData: {
        merClassUid: "", //商品分类id
        name: "",
        code: "",
        shorthandCode: "",
        skuCode: "",
        page: 1,
        pageSize: 10
      },
      // 添加原材料表头
      materialTableColumn: [
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品编码",
          key: "code"
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
          key: "attrValue"
        },
        {
          label: "基本单位",
          key: "unitName"
        }
      ],
      materialTableData: [
        {
          name: "奶粉",
          code: "YCL001",
          skuCode: "124547",
          shorthandCode: "安安",
          attrValue: "10ml",
          unitName: "g"
        },
        {
          name: "奶粉",
          code: "YCL001",
          skuCode: "124547",
          shorthandCode: "安安",
          attrValue: "10ml",
          unitName: "g"
        },
        {
          name: "奶粉",
          code: "YCL001",
          skuCode: "124547",
          shorthandCode: "安安",
          attrValue: "10ml",
          unitName: "g"
        },
      ],
      selectedMaterial:[
        {
          name: "奶粉",
          code: "YCL001",
          skuCode: "124547",
          shorthandCode: "安安",
          attrValue: "10ml",
          unitName: "g"
        },
        {
          name: "奶粉",
          code: "YCL001",
          skuCode: "124547",
          shorthandCode: "安安",
          attrValue: "10ml",
          unitName: "g"
        },
      ],
      value: "",
      addRawMaterialDialog: false, //添加原材料弹窗
      defaultProps: {
        children: "children",
        label: "label"
      },
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

      //修改终端数据
      changeData: {
        tername: "",
        status: "",
        rackCode: "",
        placeUid: "",
        salePlaceEntity: { uid: "" }
      },

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
          name: "大学城影院",
          value: [
            {
              id: 5,
              label: "大学城影院"
            }
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
    console.log(this.$api.headquartersGoods.synproSaveSyntheticProduct);
  },

  methods: {
    init() {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
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
            // this.tableData = tempArr;
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
      console.log(this.queryData);
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
      this.queryData.combinationSkuVoList.push({
        id: Math.random(),
        name: "",
        price: 12,
        code: "CS00014",
        makeItemVoList: [
          {
            name: "奶粉", //商品名称
            code: "YCL001", //商品编码
            id: "CS1564654652", //
            shorthandCode: "124547", //速记代码
            count: { min: "", max: "" }, //建议用量
            rateAmount: "", //零售比例
            unitName: "g"
          }
        ]
      });
    },
    // 删除配方分组
    handleDleteRecipeGroup(index) {
      this.queryData.combinationSkuVoList.splice(index, 1);
    },
    handleRecipeTableDlete(groupIndex, row, index) {
      // console.log(groupIndex, row, index);
      this.queryData.combinationSkuVoList[groupIndex].makeItemVoList.splice(
        index,
        1
      );
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
.empty-box{
  padding: 10px;
  .selected-content{
    margin-top: 6px;
  }
  .el-button{
    padding-left: 0;
    padding-right: 0;
  }
  .empty-content{
    height: 300px;
    overflow-y: auto;
    li{
      margin-top: 5px;
    }
  }
  .el-tag{
    width: 100%;
  }
  .el-tag .el-icon-close{
    float: right;
    top: 4px;
  }
}
</style>