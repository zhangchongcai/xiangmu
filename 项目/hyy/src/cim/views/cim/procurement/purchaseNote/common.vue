<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">采购管理</el-breadcrumb-item>
        <el-breadcrumb-item to>采购单管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}采购单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tittle"></div>
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
    >
      <!-- 基础信息 start-->
      <div>
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购单号">
              <span>{{queryData.billCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="采购门店" class="select-input">
              <el-input
                v-model="queryData.cinemaName"
                clearable
                min="0"
                max="10"
                @clear="onCinemalSumit()"
                placeholder="请选择门店"
              ></el-input>
              <el-button @click="handleDialogEvent('refCinemalDialog')">请选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="8">
            <el-form-item label="启用采购协议">
              <el-switch v-model="queryData.name1"></el-switch>
            </el-form-item>
          </el-col>-->
          <el-col :span="10">
            <el-form-item label="供应商名称" class="select-input">
              <el-input
                v-model="queryData.supName"
                clearable
                @clear="onSupplierSumit()"
                placeholder="请选择供应商"
              ></el-input>
              <el-button @click="handleDialogEvent('refSuppliersDialog')">请选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 商品清单 start-->
      <div>
        <div class="sub-tittle">商品清单</div>
        <div class="text-right" v-if="routeQuery.type!=3">
          <el-button @click="selectedGoodsDialogVisible=true">添加商品</el-button>
        </div>
        <el-table :data="queryData.purchaseBillDetailVoList" stripe>
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :formatter="item.formatter"
          >
            <template slot-scope="{row}" name="header">
              <div v-if="item.edit">
                <el-input
                  size="small"
                  type="number"
                  min="0"
                  max="10"
                  v-model="row[item.key]"
                  placeholder
                ></el-input>
              </div>
              <div v-else-if="item.selsect">
                <el-select v-model="row[item.key]">
                  <el-option key="0" label="瓶" value="0"></el-option>
                  <el-option key="1" label="箱" value="1"></el-option>
                </el-select>
              </div>
              <div v-else>
                <span>{{calculateCost(row,item)}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="remark" label-width="60px" label="备注">
              <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
              <el-input
                type="textarea"
                placeholder="请输入"
                v-else
                class="remark-input"
                v-model="queryData.bunesRate"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 商品清单 end-->
      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="refCinemalDialog" @onSumit="onCinemalSumit"></cinemal-dialog>
      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="refSuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
        :dialogFeedbackData="queryData.purchaseBillDetailVoList"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>

      <div class="submit-box">
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";

export default {
  mixins: [mixin],
  data() {
    return {
      selectedGoodsDialogVisible: false,
      //查询数据
      queryData: {
        //基础信息
        billCode: "", //采购单号
        cinemaUid: "2", //门店id
        cinemaName: "", //门店名称
        billType: "0", //单据类型,0无协议,1有协议
        agreementCode: "", //	协议编码
        agreementName: "", //协议名称
        agreementUid: "", //	协议uid
        purchaseBillDetailVoList: [], //采购商品明细集合
        supName: "", //供应商名称
        supUid: "", //供应商id
        isReview: 0, //是否需要审核,0不需要,1需要
        remark: "", //备注
        tag: 1 //保存标志,0草稿,1保存并提交
      },
      options: [
        {
          label: "江苏",
          cities: []
        },
        {
          label: "浙江",
          cities: []
        }
      ],
      props: {
        value: "label",
        children: "cities"
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "商品名称",
          key: "merName"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "采购单位",
          key: "purUnitName",
          selsect: true
        },
        {
          label: "采购数量",
          key: "purCount",
          edit: true
        },
        {
          label: "采购成本(元)",
          key: "purPrice",
          edit: true
        },
        {
          label: "税率(%)",
          key: "taxRate",
          edit: true
        },
        {
          label: "含税金额(元)",
          key: "amount",
          edit: true
        },
        {
          label: "不含税采购成本(元)",
          key: "excludingTaxCost"
        },
        {
          label: "不含税金额(元)",
          key: "excludingTaxAmount"
        },
        {
          label: "税额(元)",
          key: "taxAmount"
        }
      ]
      // goodList: [
      // {
      //   canSaleType: "1",
      //   merCode: "SP201904240002",
      //   merName: "合成品测试2",
      //   merSpec: "250ml",
      //   merType: "2",
      //   price: 25,
      //   shorthandCode: "22222",
      //   skuCode: "SP20190424000201",
      //   skuUid: "cb279510-c577-4413-9c60-fe482bd39abc",
      //   tenantId: "377161",
      //   uid: "3b08510f-e3f4-4412-a751-e01493357dc4",
      //   unitName: "个",
      //   unitUid: "342353252646754"
      // },
      // {
      //   uid: "a19203fe-e88a-4cbf-ad28-af7ff6293e14",
      //   tenantId: "377161",
      //   merCode: "DP201905131519511135",
      //   merName: "欢迎欢迎",
      //   merType: "1",
      //   unitName: "瓶",
      //   price: 44,
      //   canSaleType: "1",
      //   skuCode: "DP20190513151951113501",
      //   skuUid: "bcba83b6-eba7-4872-80a8-569f70cb808c",
      //   shorthandCode: "15132000",
      //   merSpec: "156",
      //   unitUid: "342353252646751"
      // }
      // ]
    };
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      if (this.routeQuery.type == 1) {
        this.purchaseCode();
      }else{
        this.purchaseGet({billCode:this.routeMerData.billCode})
      }
    },
    // 生成采购编码
    purchaseCode(param) {
      this.$cimList.procurement.purchaseCode(param).then(resData => {
        if (resData.code == 200) {
          this.queryData.billCode = resData.data;
        }
      });
    },
    // 新增采购单
    purchaseSave(param) {
      this.$cimList.procurement.purchaseSave(param).then(resData => {
        if (resData.code == 200) {
        }
      });
    },
    // 查看采购单
    purchaseGet(param) {
      this.$cimList.procurement.purchaseGet(param).then(resData => {
        if (resData.code == 200) {
        }
      });
    },

    handleOperateEvent(row) {
      this.$confirm("确认删除吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.queryData.purchaseBillDetailVoList = this.queryData.purchaseBillDetailVoList.filter(
            item => {
              return item.uid != row.uid;
            }
          );
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },
    //
    handleSubmit() {
      console.log(this.queryData);
      this.purchaseSave(this.queryData);
      // console.log(this.goodList);
    },
    //
    handleCancel() {},
    handleDialogEvent(name) {
      this.$refs[name].handleDialog(true);
    },
    selectedGoodsDialogCallBack(value) {
      // this.goodList = value.data;
      if (value.btnType == 1) {
        this.queryData.purchaseBillDetailVoList = value.data;
        console.log(value);
      } else {
      }
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].id;
      } else {
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
      console.log(this.queryData);
    },
    // 选泽供应商回调
    onSupplierSumit(val = []) {
      if (val.length > 0) {
        this.queryData.supName = val[0].supplierName;
        // this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.supName = "";
        // this.queryData.cinemaUid = "";
      }
      console.log(this.queryData);
    },
    //计算成本
    calculateCost(row, item) {
      switch (item.key) {
        case "excludingTaxCost":
          // 不含税采购成本=采购成本-采购成本*税率
          if (row.purPrice && row.taxRate) {
            return (row[item.key] =
              row.purPrice - (row.purPrice * row.taxRate) / 100).toFixed(2);
          } else {
            return "";
          }
          break;
        case "excludingTaxAmount":
          //不含税金额=含税金额-含税金额*税率
          if (row.amount && row.taxRate) {
            return (row[item.key] =
              row.amount - (row.amount * row.taxRate) / 100).toFixed(2);
          } else {
            return "";
          }
          break;
        case "taxAmount":
          //含税金额=采购成本*采购数量
          if (row.purPrice && row.purCount) {
            return (row[item.key] = row.purPrice * row.purCount).toFixed(2);
          } else {
            return "";
          }
          break;
        default:
          return row[item.key];
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
        // 财务
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
    cinemalDialog,
    suppliersDialog,
    selectedGoods
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.basic-input {
  min-width: 250px;
}
.select-input {
  .el-input {
    width: 65%;
  }
}
.remark-input {
  min-width: 450px;
  margin-top: 10px;
  input {
    width: 80%;
  }
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
  margin-bottom: 10px;
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