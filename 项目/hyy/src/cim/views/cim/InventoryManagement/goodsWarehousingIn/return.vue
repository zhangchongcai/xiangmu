<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item to>库存管理入库登记</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}领用退回入库</el-breadcrumb-item>
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
            <el-form-item label="单据号">
              <span>CG20190401000123</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="登记门店" class="select-input">
              <span>广州天河正佳飞扬店</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="单据类型">
              <span>领用退回入库</span>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-select v-model="queryData.status">
                <!-- <el-option label="全部" value></el-option> -->
                <el-option label="入库仓库" value="2"></el-option>
                <el-option label="入库货架" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="">
              <el-select v-model="queryData.status">
                <!-- <el-option label="全部" value></el-option> -->
                <el-option label="前台" value="2"></el-option>
                <el-option label="总仓" value="1"></el-option>
                <el-option label="分仓" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 商品清单 start-->
      <div>
        <div class="text-right" v-if="routeQuery.type!=3">
          <el-button @click="handleComBank()">添加商品</el-button>
        </div>
        <div class="sub-tittle">商品清单</div>
        <el-table :data="tableData" stripe>
          <el-table-column
            v-for="item in tableColumn"
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
                 <el-select  v-model="row[item.key]">
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
      <!-- 商品清单 end-->

      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="myCinemalDialog"></cinemal-dialog>
      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
      <com-bank ref="selcom" :ComBankdialogVisible="ComBankdialogVisible"></com-bank>

      <div class="submit-box">
        <el-button type="primary" @click="handleSubmit">保存并提交</el-button>
        <el-button type="primary" @click="handleSubmit">保存为草稿</el-button>
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
import ComBank from "cim/components/selcom/common";

export default {
  mixins: [mixin],
  data() {
    return {
      ComBankdialogVisible:false,
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
        zipCode: "" //邮编
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
          key: "supplierCode"
        },
        {
          label: "商品规格",
          key: "supplierName"
        },
        {
          label: "SKU编码",
          key: "areaName"
        },
        {
          label: "基本单位",
          key: "linkMan"
        },
        {
          label: "入库数量",
          key: "linkManTel",
          edit:true,
        },
        {
          label: "基本单位成本价（元）",
          key: "status",
          edit: true
        },
        {
          label: "金额（元）",
          key: "status1"
        }
      ],
      // 表格数据
      tableData: [
        {
          supplierCode: "CG201904010001",
          supplierName: "中影德金影城客村丽影店",
          areaName: "美联经营部"
        }
      ]
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
    handleCancel() {
      this.$router.go(-1);
    },
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
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleComBank() {
      // 调用子组件请求
      this.$refs.selcom.init()
    },
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
    ComBank
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