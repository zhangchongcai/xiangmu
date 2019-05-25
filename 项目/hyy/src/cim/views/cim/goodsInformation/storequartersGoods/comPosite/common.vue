<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">门店商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}合成品</el-breadcrumb-item>
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
              label="商品分类"
            >
              <span>{{queryData.catName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="速记代码" prop="shorthandCode">
              <span v-if="routeQuery.type==3">{{queryData.shorthandCode}}</span>
              <el-input placeholder class="basic-input" v-else v-model="queryData.shorthandCode"></el-input>
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
              <span v-if="routeQuery.type==3">{{queryData.name}}</span>
              <el-input v-else class="basic-input" v-model="queryData.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="aliasName" label="销售别名">
                <span v-if="routeQuery.type==3">{{queryData.aliasName}}</span>
              <el-input v-else class="basic-input" v-model="queryData.aliasName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="spec" label="商品规格">
              <span v-if="routeQuery.type==3">{{queryData.spec}}</span>
              <el-input placeholder="例：350ML" v-else class="basic-input" v-model="queryData.spec"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              prop="unitUid"
              label="基本单位"
              :rules="[{ required: true, message: '基本单位不能为空',trigger: 'change' }]"
            >
               <span v-if="routeQuery.type==3">{{queryData.unitName}}</span>
              <el-select v-else v-model="queryData.unitUid" placeholder="请选择" class="basic-input">
                <el-option
                  v-for="item in unitOptions"
                  :key="item.uid"
                  :label="item.unitName"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品描述" prop="remark">
               <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
              <el-input v-else class="basic-input" v-model="queryData.remark" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="good-img-col">
            <el-form-item prop="imgUrl" label="商品图片" class="good-img-form-item">
              <img class="upload-img" v-if="routeQuery.type==3" :src="queryData.imgUrl" alt>
              <el-upload
                v-else
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
              >
                <img v-if="queryData.imgUrl" :src="queryData.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="el-upload__tip" slot="tip">(请上传500kb以内的JPG/PNG文件，建议图片规格：150*150px)</div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 原材料信息 start-->
      <div>
        <div class="sub-tittle" >原材料信息</div>
        <div class="text-right" v-if="routeQuery.type!=3">
          <el-button @click="addRawMaterialDialog=true">添加原材料及包装</el-button>
        </div>
        <div
          class="recipe-box"
          v-for="(item,groupIndex) in  queryData.cinemaCombinationSkuVoList"
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
                    <span v-if="routeQuery.type==3">{{queryData.name}}</span>
                    <el-input v-else class="recipe-name-inp" v-model="item.name"></el-input>
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
                  <span v-if="routeQuery.type==3">{{item.price}}</span>
                  <el-input v-else class="price-inp" type="number" v-model="item.price"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="text-right"  v-if="routeQuery.type!=3">
                <el-button
                  v-if="groupIndex >0"
                  type="text"
                  size="medium"
                  @click.stop="handleDleteRecipeGroup(groupIndex)"
                >删除配方</el-button>
              </el-col>
            </el-row>
          </el-form>
          <div>
            <el-table :data="item.cinemaMakeItemVoList" stripe  v-loading="tableLoding">
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
                    <el-input v-else size="small" v-model="row[item.key]" placeholder></el-input>
                  </div>
                  <div v-else-if="item.bothEdit">
                    <span>上限</span>
                    <span v-if="routeQuery.type==3">{{row[item.key].max}} - </span>
                    <el-input
                      size="small"
                      v-else
                      class="both-edit-inp"
                      v-model="row[item.key].max"
                      placeholder
                    ></el-input>
                    <span>下限</span>
                    <span v-if="routeQuery.type==3">{{row[item.key].min}}</span>
                    <el-input
                      v-else
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

        <div  v-if="routeQuery.type!=3">
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
               <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
              <el-radio-group v-else v-model="queryData.canSale">
                <el-radio label="1">允许</el-radio>
                <el-radio label="0">禁止</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="putaway-timer">
          <el-col :span="8">
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
          <el-col :span="8">
            <el-form-item prop="downTime" label="下架时间">
              <span v-if="routeQuery.type==3">{{queryData.downTime ? queryData.downTime : '不限制'}}</span>
              <div v-else>
                <el-select  v-model="queryData.downTimeType" placeholder="请选择" class="endTime-input">
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
          <el-col :span="8">
            <el-form-item label="适用门店">
              <apply-stores
                title="适用门店"
                :defaultSelected="queryData.saleCinema"
                :radios="applyStoresRadios"
                @onCheckedNodes="handleStoresCheckedNodes"
              ></apply-stores>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="适用渠道">
              <apply-channel
                title="适用渠道"
                :defaultSelected="queryData.saleChannel"
                :radios="applyChannelRadios"
                @onCheckedNodes="handleChannelCheckedNodes"
              ></apply-channel>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item prop="isSaleAsSetMeal" label-width="160px" label="是否只允许套餐内售卖">
              <span v-if="routeQuery.type==3">{{queryData.canSale == 1 ? '允许':'禁止'}}</span>
              <el-radio-group v-else v-model="queryData.isSaleAsSetMeal">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
           <el-col :span="10">
            <el-form-item label="销售地点">
              <apply-channel
                title="销售地点"
                :defaultSelected="queryData.salePlace"
                :radios="applyChannelRadios"
                @onCheckedNodes="handleChannelCheckedNodes"
              ></apply-channel>
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
    <el-dialog
      class="change-dialog"
      width="70%"
      title="选择原材料及包装"
      :visible.sync="addRawMaterialDialog"
    >
      <div>
        <el-row>
          <el-col :span="6">
            <el-tree :data="categoryTrees" :props="defaultProps"  @node-click="handleaCtegoryTrees"></el-tree>
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
                      <el-button icon="el-icon-search" @click="onQuery">查询</el-button>
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
        code: "", //商品编码
        catUid: "", //商品分类id
        catName: "", //商品分类名称
        shorthandCode: "", //速记代码
        name: "", //商品名称
        aliasName: "", //销售别名
        spec: "", //商品规格
        unitUid: "", //基本单位
        remark: "", //商品描述
        imgUrl: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1306880214,1632905597&fm=26&gp=0.jpg", //商品图片
        // 原材料信息 //门店和总部的对象不一样
        cinemaCombinationSkuVoList: [
          {
            id: Math.random(),
            name: "标准配方",
            price: '',
            code: "",
            cinemaMakeItemVoList: [
              // {
              //   originSkuUid: "", //现调原材料SKU商品UID
              //   name: "奶粉", //商品名称
              //   code: "YCL001", //商品编码
              //   id: "CS1564654652", //
              //   shorthandCode: "124547", //速记代码
              //   count: { min: "", max: "" }, //建议用量
              //   rateAmount: "", //零售比例
              //   unitName: "g"
              // }
            ]
          }
        ],
        //销售信息
        canSale: "1", //销售状态
        upTime: moment().format("YYYY-MM-DD HH:mm"), //上架时间
        downTimeType: "0", //下架时间类型
        downTime: "", //下架时间
        saleCinema: "1", //适用门店 1全部门店 0指定门店 2排除门店
        cinemasList	:[],
        saleChannel: "1", //适用渠道 1全部渠道 0指定渠道
        channelsList:[],
        salePlace: "1", //销售地点 1全部 0指定 2排除
        cinemaSalePlaceVoList:[],
        isSaleAsSetMeal: "1" //是否只允许套餐内售卖
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
        mercatUid: "", //商品分类id
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
      materialTableData: [],
      selectedMaterials: [],
      value: "",
      addRawMaterialDialog: false, //添加原材料弹窗
      defaultProps: {
        children: "children",
        label: "name"
      },
      unitOptions:[],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      categoryTrees:[],
      currentSelectedUid:'',
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
      tableLoding: false,
      total: 0,
      applyStoresRadios: [
        {
          label: "全部门店",
          type: "1"
        },
        {
          label: "指定门店",
          type: "0",
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
          type: "2",
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
          type: "1"
        },
        {
          label: "指定渠道",
          type: "0",
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
      ],
      trycombinationSkuData:{},
    };
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      this.setCheckedKys(this.applyStoresRadios);
      this.setCheckedKys(this.applyChannelRadios);
      this.synproFindUnitList({mercatUid:this.routeMerData.uid})
      this.getCategoryTrees({});
      switch (this.routeQuery.type) {
        // 新建
        case '1':
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.catUid = this.routeMerData.uid;
          this.queryData.catName = this.routeMerData.uidname;
          break;
        //修改
        case '2':
          this.synproUpdateCinemaSynthetic({code:this.routeMerData.merCode})
          break;
        //查看
        case '3':
          this.synproqueryCinemaSynthetic({code:this.routeMerData.merCode})
          break;
      }
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
      console.log(this.materialQueryData);

       this.findSemifinishedMater(this.materialQueryData);
    },
     // 获取分类列表
    getCategoryTrees(param) {
      this.$cimList.headquartersGoods.setmeaLoadCategoies(param).then(resData => {
        if (resData.code == 200) {
          this.categoryTrees = resData.data.children;
        }
      });
// var resData = {"code":200,"timestamp":1557042879527,"msg":"操作成功","status":"Ok","data":{"uid":"0","seq":1,"name":"卖品","parentUid":null,"isLeaf":0,"children":[{"uid":"51c40ea1-9597-4a0e-baa1-6a05e21933b8","seq":1,"name":"饮料","parentUid":"0","isLeaf":0,"children":[{"uid":"fcba706a-998a-46e1-aaa9-3c4d8958799d","seq":1,"name":"果汁","parentUid":"51c40ea1-9597-4a0e-baa1-6a05e21933b8","isLeaf":1,"children":[]}]},{"uid":"d86ca2d9-3b26-4db2-9f30-82e594749b35","seq":2,"name":"零食","parentUid":"0","isLeaf":0,"children":[]},{"uid":"a3dedd87-1b0f-4d0d-89dd-7d949e3ac58c","seq":3,"name":"3D镜片","parentUid":"0","isLeaf":1,"children":[]},{"uid":"4esds65a8-5d8d-5c9d-41dg-8k454f5ff4a","seq":4,"name":"套餐","parentUid":"0","isLeaf":1,"children":[]}]}}
//       this.categoryTrees =[resData.data][0].children;
    },
    // 获取原材料列表
    findSemifinishedMater(param) {
      this.$cimList.headquartersGoods
        .synproFindSemifinishedMater(param)
        .then(resData => {
          if (resData.code == 200) {
            this.materialTableData = resData.data.list;
            this.total = resData.data.total;
          }
        })
        .catch(err => {});
    },
    // 获取基本单位
    synproFindUnitList(param) {
      this.$cimList.headquartersGoods
        .synproFindUnitList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.unitOptions = resData.data
          }
        })
        .catch(err => {});
    },
    // 选择原材料组合sku信息接口
    synproTrycombinationSku(param,callBack) {
      callBack ? callBack : ()=>{}
      this.$cimList.headquartersGoods
        .synproTrycombinationSku(param)
        .then(resData => {
          if (resData.code == 200) {
            // this.trycombinationSkuData= resData.data
            callBack(resData.data);
          }
        })
        .catch(err => {});
    },
    // 新建合成品
    saveSyntheticProduct(param) {
      this.$cimList.headquartersGoods
        .synproSaveSyntheticProduct(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message("新建成功!");
          }else{
            this.$message(resData.msg);
          }
        })
        .catch(err => {
           this.$message("服务器错误");
        });
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
    //门店查看合成品
    synproqueryCinemaSynthetic(param) {
      this.$cimList.storequartersGoods
        .synproqueryCinemaSynthetic(param)
        .then(resData => {
          if (resData.code == 200) {
            this.queryData = resData.data;
            this.queryData.canSale =  this.queryData.canSale.toString();
            this.queryData.isSaleAsSetMeal =  this.queryData.isSaleAsSetMeal.toString();
            this.queryData.saleCinema =   this.queryData.saleCinema.toString();
            this.queryData.saleChannel =  this.queryData.saleChannel.toString();
            this.queryData.salePlace =  this.queryData.salePlace.toString();
            this.selectedMaterials = this.queryData.cinemaCombinationSkuVoList[0].cinemaMakeItemVoList;
            console.log("this.selectedMaterials",this.selectedMaterials)
            if(this.queryData.downTime){
                this.queryData.downTimeType = '1'
            }else{
                this.queryData.downTimeType = '0'
            }
          }
        })
        .catch(err => {});
    },
      // 查询树
    handleaCtegoryTrees(data) {
      this.materialQueryData.mercatUid = data.uid;
      this.findSemifinishedMater(this.materialQueryData);
    },
    // 选择添加原材料
    handleSelectionMaterial(value) {
      this.selectedMaterials = value;
      console.log(value);
    },
    // 清空选择的原材料
    handleEmptyMaterials() {
      this.selectedMaterials = [];
      this.$refs.materialTable.clearSelection();
    },
    // 删除单个选择的原材料
    handleDelMaterial(row) {
      // console.log(row)
       // 情空选择的原材料以及包装
      this.selectedMaterials = this.selectedMaterials.filter(item=>{
          return item.skuCode != row.skuCode;
      });
      let tempArr = this.materialTableData.filter(item=>{
          return item.skuCode == row.skuCode;
      });
      // this.$refs.materialTable.toggleRowSelection(tempArr[0]);
    },
    // 确定提交信息
    handleSubmit() {
      console.log(this.queryData);
      if(this.routeQuery.type == 1){
         this.saveSyntheticProduct(this.queryData);
      }else if(this.routeQuery.type == 2){
         this.updateSyntheticProduct(this.queryData);
      }else if(this.routeQuery.type == 3){
         //查看
        
      }
    },
    // 取消提交信息
    handleCancel() {
      this.$router.go(-1);
    },
    handleModificationSubmit() {
      this.addRawMaterialDialog = false;
      // let skuCodes = this.selectedMaterials.map(item=>{
      //   return item.skuUid
      // }).join(',')
      let skuIds = this.selectedMaterials.map(item=>{
        return item.skuUid
      }).join(',')
      this.synproTrycombinationSku({
        merCode:this.queryData.code,
        skuCodes:'',//已经生成的合成品sku的code
        skuIds: skuIds,//所选原材料的skuUid
      },(data)=>{
        this.queryData.cinemaCombinationSkuVoList.forEach(item=>{
          if(!item.code){
            item.code= data.code;
          }
          item.id = Math.random();
          item.cinemaMakeItemVoList = JSON.parse(JSON.stringify(data.cinemaMakeItemVoList));
        })
        // console.log(data)
        // console.log(this.queryData.cinemaCombinationSkuVoList)
      })     
    },
    
    handleSizeChange(val) {
      this.materialQueryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.materialQueryData.page = val;
      this.onQuery();
    },
    // 添加配方分组
    handleAddrRecipeGroup() {
      let skuCodes = this.queryData.cinemaCombinationSkuVoList.map(item=>{
        return item.code
      }).join(',')

      // if(this.queryData.cinemaCombinationSkuVoList.length>0){
      //   skuIds = this.queryData.cinemaCombinationSkuVoList[0].cinemaMakeItemVoList.map(item=>{
      //     return item.skuUid
      //   }).join(',')
      // }
      let skuIds = this.selectedMaterials.map(item=>{
        return item.skuUid
      }).join(',')
      
      let tempObj = {
        id: Math.random(),
        name: "",
        price: "",
        code: "",
        cinemaMakeItemVoList: [
        ]
      }

      this.synproTrycombinationSku({
        merCode:this.queryData.code,
        skuCodes:skuCodes,//已经生成的合成品sku的code
        skuIds: skuIds,//所选原材料的skuUid
      },(data)=>{
        tempObj.code=data.code;
        tempObj.cinemaMakeItemVoList=data.cinemaMakeItemVoList;
        this.queryData.cinemaCombinationSkuVoList.push(tempObj);
        console.log(data)
      })
     
    },
    // 删除配方分组
    handleDleteRecipeGroup(index) {
      this.queryData.cinemaCombinationSkuVoList.splice(index, 1);
    },
    handleRecipeTableDlete(groupIndex, row, index) {
      console.log(groupIndex, row, index);

      this.handleDelMaterial(row)
      this.queryData.cinemaCombinationSkuVoList.forEach(item=>{
        item.cinemaMakeItemVoList = item.cinemaMakeItemVoList.filter(item=>{
           return item.skuCode != row.skuCode;
        })
      })
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
    routeMerData(){
       if(this.$route.query.data ){
          return JSON.parse(this.$route.query.data);
       }else{
          return {}
       }
    },
    typeText() {
      //1新建，2修改，3查看
      switch (this.routeQuery.type) {
        // 单品
        case '1':
          return "新建";
          break;
        // 原材料
        case '2':
          return "修改";
          break;
        // 合成品
        case '3':
          return "查看";
          break;
      }
    }
  },
  components: {
    applyStores,
    applyChannel
  }
};
</script>

<style lang="scss">
@import "../../../../../assets/css/element-common.scss";
@import "../../../../../assets/css/common.scss";
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
</style>