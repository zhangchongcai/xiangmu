<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">采购管理</el-breadcrumb-item>
        <el-breadcrumb-item to>采购单管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}采购退货单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tittle"></div>
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="120px"
      label-suffix=":"
    >
      <!-- 基础信息 start-->
      <div>
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="10">
            <el-form-item label="采购退货单号">
              <span>CG20190401000123</span>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="退货门店" class="select-input">
              <el-input v-model="queryData.supplierName" placeholder="请选择门店"></el-input>
              <el-button @click="handleDialogEvent('refGoodSelectedDialog')">请选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="采购退货单号" class="select-input">
              <el-input v-model="queryData.supplierName" placeholder="请选择采购单号"></el-input>
              <el-button @click="handleDialogEvent('refSuppliersDialog')">请选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="供应商名称" class="select-input">
              <el-input v-model="queryData.supplierName" placeholder="请选择采购单号"></el-input>
              <el-button @click="handleDialogEvent('refSuppliersDialog')">请选择</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="退货原因">
              <el-select v-model="queryData.storageName">
                <el-option value="0" label="商品已过期"></el-option>
                <el-option value="1" label="商品存在破损"></el-option>
                <el-option value="2" label="总部要求统一退货"></el-option>
                <el-option value="3" label="不想要了"></el-option>
                <el-option value="4" label="其他"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item>
              <div slot="label">
                <el-select v-model="queryData.storageType">
                  <el-option label="退货仓库" value="0"></el-option>
                  <el-option label="退货货架" value="1"></el-option>
                </el-select>
              </div>
              <el-select v-model="queryData.storageName1">
                <el-option label="总仓" value="0"></el-option>
                <el-option label="分仓" value="1"></el-option>
                <el-option label="前仓" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 退货信息 start-->
      <div>
        <div class="sub-tittle">退货信息</div>
        <div class="text-right" v-if="routeQuery.type!=3">
          <el-button @click="selectedGoodsDialogVisible=true">添加商品</el-button>
        </div>
        <el-table :data="storageTableData" stripe>
          <el-table-column
            v-for="item in storageTableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :formatter="item.formatter"
          >
            <template slot-scope="{row}" name="header">
              <div v-if="item.edit">
                <el-input size="small" v-model="row[item.key]" placeholder></el-input>
              </div>
              <div v-else-if="item.selsect">
                <el-select v-model="row[item.key]">
                  <el-option key="0" label="瓶" value="0"></el-option>
                  <el-option key="1" label="箱" value="1"></el-option>
                </el-select>
              </div>
              <div v-else>
                <span>{{row[item.key]}}</span>
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
            <el-form-item prop="bunesRate" label-width="60px" label="备注">
              <span v-if="routeQuery.type==3">{{queryData.bunesRate}}</span>
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
      <!-- 退货信息 end-->

      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="refCinemalDialog"></cinemal-dialog>
      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="refSuppliersDialog"></suppliers-dialog>
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
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
      //查询数据
      queryData: {
        //基础信息
        type: "2", //商品类型：2-合成品
        code: "", //供应商编码
        name: "", //供应商名称
        status: "1", //状态
        taxRegisterNum: "", //税务登记号
        linkman: "", //联系人
        tel: "", //联系电话
        email: "", //电子邮箱
        fax: "", //传真
        cooperation: "", //合作时间
        openAccountBank: "", //开户行
        bankAccount: "", //银行账户
        bunesRate: "", //返点率
        zipCode: "", //邮编
        region: "", //区域
        address: "", //详细地址
        zipCode: "", //邮编
        storageType: "1" //邮编
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
      // 退货信息表格表头
      storageTableColumn: [
        {
          label: "商品名称",
          key: "supplierCode"
        },
        {
          label: "SKU编码",
          key: "supplierName"
        },
        {
          label: "商品规格",
          key: "areaName"
        },
        {
          label: "基本单位",
          key: "linkMan",
          selsect: true
        },
        {
          label: "库存数量",
          key: "linkManTel"
        },
        {
          label: "退货数",
          key: "linkManTel1",
          edit: true
        },
        {
          label: "单价(元)",
          key: "status",
          edit: true
        },
        {
          label: "税率(%)",
          key: "status1",
          edit: true
        },
        {
          label: "含税金额(元)",
          key: "status2",
          edit: true
        },
        {
          label: "不含税金额(元)",
          key: "status4"
        },
        {
          label: "税额(元)",
          key: "status5"
        }
      ],
      // 表格数据
      storageTableData: [
        {
          supplierCode: "CG201904010001",
          supplierName: "中影德金影城客村丽影店",
          areaName: "美联经营部",
          linkManTel: "123"
        }
      ],
      selectedGoodsDialogVisible: false
    };
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {},
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
    // 获取分类列表
    getCategoryTrees(param) {
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(param)
        .then(resData => {
          if (resData.code == 200) {
            this.categoryTrees = resData.data.children;
          }
        });
    },
    handleOperateEvent() {},
    //
    handleSubmit() {},
    //
    handleCancel() {},
    saleCinemaType(type) {
      switch (type) {
        case "0":
          return "指定门店";
          break;
        case "1":
          return "全部门店";
          break;
        case "2":
          return "排除门店";
          break;
      }
    },
    handleDialogEvent(name) {
      this.$refs[name].handleDialog(true);
    },
    selectedGoodsDialogCallBack(value) {
      this.goodList = value.data;
      console.log(value);
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