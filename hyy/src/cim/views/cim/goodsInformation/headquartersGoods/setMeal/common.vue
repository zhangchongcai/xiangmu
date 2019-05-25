<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">总部商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}套餐</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tittle"></div>
    <el-form
      ref="ruleForm"
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
              <span>{{queryData.code}}</span>
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
            <el-form-item
              label="速记代码"
              prop="shorthandCode"
              :rules="[{ required: true, message: '速记代码不能为空',trigger: 'change' }]"
            >
              <span v-if="routeQuery.type==3">{{queryData.shorthandCode}}</span>
              <el-input
                v-else
                placeholder
                type="number"
                class="basic-input"
                v-model="queryData.shorthandCode"
              ></el-input>
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
              <el-input v-else placeholder class="basic-input" v-model="queryData.name"></el-input>
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
            <el-form-item label="商品描述" prop="remark">
              <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
              <el-input
                v-else
                class="basic-input"
                v-model="queryData.remark"
                type="textarea"
                :rows="4"
              ></el-input>
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

      <!-- 套餐信息 start-->
      <div>
        <div class="sub-tittle">套餐信息</div>
        <div class="add-material clearfix">
          <el-button class="right" v-if="routeQuery.type!=3" @click="handleAddGoods">添加商品</el-button>
        </div>
        <div
          class="recipe-box"
          v-for="(item,groupIndex) in formattingDataList"
          :key="item.id"
          v-show="item.options.length>0"
        >
          <div class="add-material clearfix">
            <div class="left" v-if="item.isOption != 0">{{item.merName}} 可替换为以下商品</div>
          </div>
          <div>
            <el-table :data="item.options" v-loading="tableLoding">
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
            <el-form-item
              prop="price"
              label="售价"
              :rules="[{ required: true, message: '售价不能为空',trigger: 'change' }]"
            >
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
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="适用门店">
              <el-select v-model="queryData.saleCinema" placeholder="请选择" class="apply-select">
                <el-option
                  v-for="item in applyStoresRadios"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                ></el-option>
              </el-select>
              <span class="apply-tag" v-if="queryData.saleCinema!='1'">
                <el-input
                  class="input apply-stores-input"
                  placeholder="请选择"
                  v-model="selectedStoreName"
                >
                  <i slot="suffix" class="el-icon-close icon" @click.stop="handleDeleteCinemas"></i>
                </el-input>
                <el-button @click.stop="handleDialog('myCinemalDialog')">选择</el-button>
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="适用渠道">
              <el-select v-model="queryData.saleChannel" placeholder="请选择" class="apply-select">
                <el-option
                  v-for="item in applyChannelRadios"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                ></el-option>
              </el-select>
              <span class="apply-tag" v-if="queryData.saleChannel!='1'">
                <el-input
                  class="input apply-stores-input"
                  placeholder="请选择"
                  v-model="selectedChannelName"
                >
                  <i slot="suffix" class="el-icon-close icon" @click.stop="handleDeleteChanne"></i>
                </el-input>
                <el-button @click.stop="handleDialog('myChannelDialog')">选择</el-button>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 销售信息 end-->
      <div class="submit-box" v-if="routeQuery.type!=3">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-form>

    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" multiple :title="'选择适应门店'"></cinemal-dialog>
    <!-- 选择渠道弹窗 -->
    <channel-dialog ref="myChannelDialog" @onSumit="onChanneSumit" multiple :title="'选择适应渠道'"></channel-dialog>
    <!-- 选择商品 -->
    <selected-goods
      :title="'选择套餐及包装'"
      :dialogVisible.sync="selectedGoodsDialogVisible"
      :dialogFeedbackData="goodList"
      @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
    ></selected-goods>
  </div>
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import applyStores from "cim/components/applyStores/applyStores.vue";
import applyChannel from "cim/components/applyChannel/applyChannel.vue";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import channelDialog from "cim/components/channelDialog/channelDialog.vue";
import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
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
        saleCinema: "1", //适用门店 1全部门店 0指定门店 2排除门店
        cinemas: [],
        saleChannel: "1", //适用渠道 1全部渠道 0指定渠道
        channels: []
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
      materialTableData: [],
      selectedGoodsDialogVisible: false, //添加套餐弹窗
      goodList: [],

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
        {
          label: "排除门店",
          type: "2"
        }
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
      ]
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    init() {
      switch (this.routeQuery.type) {
        // 新建
        case "1":
          this.queryData.code = this.routeMerData.proCode;
          this.queryData.classUid = this.routeMerData.uid;
          this.queryData.className = this.routeMerData.uidname;
          break;
        //修改
        case "2":
          //  this.setmealQuery({ uid: "efa55a04-60d4-49e7-970e-04242157c1f5" });
          this.setmealQuery({ uid: this.routeMerData.uid });
          break;
        //查看
        case "3":
          this.setmealQuery({ uid: this.routeMerData.uid });
          break;
      }
    },
    handleDialog(name) {
      this.$refs[name].handleDialog(true);
    },
    // 门店
    onCinemalSumit(data) {
      this.queryData.cinemas = data.map(item => {
        return {
          cinemaUid: item.uid,
          uid: "" //套餐渠道的uid。为空新增，否则修改
        };
      });
      this.selectedStoreName = data
        .map(item => {
          return item.name;
        })
        .join(",");
      console.log("门店数据", data);
    },
    // 渠道
    onChanneSumit(data) {
      this.queryData.channels = data.map(item => {
        return {
          channelUid: item.uid,
          uid: "" //套餐渠道的uid。为空新增，否则修改
        };
      });
      this.selectedChannelName = data
        .map(item => {
          return item.name;
        })
        .join(",");
      console.log("渠道数据", data);
    },
    //删除门店
    handleDeleteCinemas() {
      this.onCinemalSumit([]);
    },
    //删除渠道
    handleDeleteChanne() {
      this.onChanneSumit([]);
    },
    // 查询
    onQuery() {
      // console.log(this.queryData);
      this.materialQueryData.classUid = "";
      this.setmealLoadItems(this.materialQueryData);
    },
    // 查看
    setmealQuery(param) {
      this.$cimList.headquartersGoods
        .setmealQuery(param)
        .then(resData => {
          if (resData.code == 200) {
            // resData.data.dataList  = this.queryData.dataList
            this.queryData = resData.data;
            this.queryData.canSale = this.queryData.canSale.toString();
            if (this.queryData.downTime) {
              this.queryData.downTimeType = "1";
            } else {
              this.queryData.downTimeType = "0";
            }
            if (this.queryData.saleChannel != null) {
              this.queryData.saleChannel = this.queryData.saleChannel.toString();
            }
            if (this.queryData.saleCinema != null) {
              this.queryData.saleCinema = this.queryData.saleCinema.toString();
            }
            console.log("data", this.queryData);
          }
        })
        .catch(err => {});
    },
    // 新增
    setmealSave(param) {
      this.$cimList.headquartersGoods
        .setmealSave(param)
        .then(resData => {
          if (resData.code == 200) {
            if (this.routeQuery.type == 1) {
              this.$message("新建成功");
            } else {
              this.$message("修改成功");
            }
            this.handleCancel();
          } else {
            this.$message(resData.msg);
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
    // 确定提交信息
    handleSubmit() {
      console.log(this.queryData);
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          console.log(this.formattingDataList);
          console.log(this.requestDataList(this.formattingDataList));
          let tempArr = JSON.parse(JSON.stringify(this.queryData));
          tempArr.dataList = this.requestDataList(this.formattingDataList);
          console.log(tempArr);
          if (tempArr.dataList.length > 0) {
            if (this.routeQuery.type == 1) {
              this.setmealSave(tempArr);
            } else if (this.routeQuery.type == 2) {
              this.setmealSave(tempArr);
            } else if (this.routeQuery.type == 3) {
              //查看
            }
          } else {
            this.$message("请添加一个商品");
          }
        } else {
          this.$message("带*号的为必填项，请填写");
          return false;
        }
      });
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
          item.addPrice = item.addOrMinus.price;
        }
        return item;
      });
      return tempArr;
    },
    // 取消提交信息
    handleCancel() {
      this.$router.go(-1);
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
            return item;
          });
          this.queryData.dataList.push(...tempArr);
        } else {
          tempArr = tempArr.map(item => {
            item.parentSkuCode = item.skuCode;
            item.uid = null;
            return item;
          });
          this.queryData.dataList.push(...tempArr);
          this.queryData.dataList = this.unRepeat(this.queryData.dataList);
        }
        console.log("sadsa啊实打实", this.queryData.dataList);
      }
    },
    //去重
    unRepeat(arr) {
      let hash = {};
      return arr.reduce((item, next) => {
        if (!hash[next.skuCode]) {
          hash[next.skuCode] = true;
          item.push(next);
        }
        return item;
      }, []);
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
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
    formatRecipeTableColumn(item) {
      let optionList = JSON.parse(JSON.stringify(this.recipeTableColumn));
      if (item.isOption == 0) {
        optionList.pop();
      }
      return optionList;
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
    selectedGoods,
    cinemalDialog,
    channelDialog
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
.add-material {
  // text-align: right;
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
</style>