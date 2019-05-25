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
      {{this.queryData}}
      <!-- {{this.outStorehouseArr}} -->
      <!-- {{this.inStorehouseCodeArr}} -->
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单据号">
              <span>{{this.queryData.billCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转移门店" class="select-input">
              <span v-if="routeQuery.type==3">广州天河正佳飞扬店</span>
              <div v-else>
                  <el-input v-model="queryData.cinemaName" placeholder="请选择门店"></el-input>
                  <el-button @click="selectCinemalDialog">选择</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="">
              <el-select v-model="queryData.outStoreType" @focus="chukkuEvent()">
                <!-- <el-option label="全部" value></el-option> -->
                <el-option label="转出仓库" value="1"></el-option>
                <el-option label="转出货架" value="2"></el-option>
              </el-select>
              <span>:</span>
              <el-select v-model="queryData.outStorehouseCode" @focus="selCkORHj(queryData.outStoreType)" @change="changeSelCk()">
                <el-option
                  v-for="item in outStorehouseArr"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="">
              <el-select v-model="queryData.inStoreType" @focus="rukuEvent()">
                <!-- <el-option label="全部" value></el-option> -->
                <el-option label="转入仓库" value="1"></el-option>
                <el-option label="转入货架" value="2"></el-option>
              </el-select>
              <span>:</span>
              <el-select v-model="queryData.inStorehouseCode" @focus="selRkORHj(queryData.inStoreType)" @change="changeSelRk()">
                <el-option
                  v-for="item in inStorehouseCodeArr"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->

      <!-- 商品清单 start-->
      <div>
        <div class="text-right" v-if="routeQuery.type!=3">
          <el-button @click="selectedGoodsDialogVisible=true">添加商品</el-button>
        </div>
        <div class="sub-tittle">商品清单</div>
        <el-table :data="goodList" stripe>
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
            <el-form-item prop="remark" label-width="60px" label="备注">
              <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
              <el-input
                type="textarea"
                placeholder="请输入"
                v-else
                class="remark-input"
                v-model="queryData.remark"
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
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
        :dialogFeedbackData="goodList"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>
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
import selectedGoods from "cim/dialogs/cimKcSelectedGoods/index.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      selectedGoodsDialogVisible:false,
      goodList:[],
      outStorehouseArr:[],
      inStorehouseCodeArr:[],
      value: '',
      //查询数据
      queryData: {
        billCode:"",
        cinemaName:"11123",
        cinemaUid:"389122",
        inStoreType:"1",
        inStorehouseCode:"",
        inStorehouseName:"",
        outStoreType:"1",
        outStorehouseName:"",
        outStorehouseCode:"",
        remark:"",
        status:""
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
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "单位",
          key: "unitName"
        },
        {
          label: "基本单位成本价（元）",
          key: "price"
        },
        {
          label: "可转出数量",
          key: "outStoreCount"
        },
        {
          label: "转出数量",
          key: "outCount",
          edit: true
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      if(this.routeQuery.type == "1"){
        // this.queryData.cinemaUid = JSON.parse(this.routeQuery.data).cinemaUid
        // this.queryData.remarks = JSON.parse(this.routeQuery.data).remarks
        // this.queryData.remarks = JSON.parse(this.routeQuery.data).remarks
        // this.queryData.caseName = JSON.parse(this.routeQuery.data).caseName
        // this.queryData.uid = JSON.parse(this.routeQuery.data).uid
        // this.GoodSelected = JSON.parse(this.routeQuery.data).checkSolutionInfosVoList
        this.resMoveBillFindMoveDetailInfo()
      }
    },
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
      console.log(val);
    },
    selectedGoodsDialogCallBack(value) {
      this.goodList = value.data;
      console.log(value);
    },
    chukkuEvent(){
      this.queryData.outStorehouseName = ""
      this.queryData.outStorehouseCode = ""
    },
    rukuEvent(){
      this.queryData.inStorehouseName = ""
      this.queryData.inStorehouseCode = ""
    },
    // 选择仓库或者货架
    selCkORHj(type){
      this.resMoveBillFindAllStorehouse(parseInt(type))
    },
    selRkORHj(type){
      this.resMoveBillFindAllStorehouse1(parseInt(type))
    },
    changeSelCk(){
      let selectedWorkName = {};
       selectedWorkName = this.outStorehouseArr.find((item)=>{
           return item.code === this.queryData.outStorehouseCode;
       });
       this.queryData.outStorehouseName = selectedWorkName.name
    },
    changeSelRk(){
      let selectedWorkName = {};
       selectedWorkName = this.inStorehouseCodeArr.find((item)=>{
           return item.code === this.queryData.inStorehouseCode;
       });
       this.queryData.inStorehouseName = selectedWorkName.name
    },
    // 获取分类列表
    resMoveBillFindAllStorehouse(type) {
      let val = {
        cinemaUid:"111111",
        type:type
      }
      console.log(val)
      this.$cimList.inventoryTransfer
        .moveBillFindAllStorehouse(val)
        .then(res => {
          if (res.code == 200) {
              this.outStorehouseArr = res.data       
          }
        });
    },
    // 获取分类列表
    resMoveBillFindAllStorehouse1(type) {
      let val = {
        cinemaUid:"111111",
        type:type
      }
      console.log(val)
      this.$cimList.inventoryTransfer
        .moveBillFindAllStorehouse(val)
        .then(res => {
          if (res.code == 200) {
              this.inStorehouseCodeArr = res.data       
          }
        });
    },
    // 获取code请求
    resMoveBillFindMoveDetailInfo(type) {
      let val = {
        uid:type
      }
      console.log(val)
      this.$cimList.inventoryTransfer
        .moveBillFindMoveDetailInfo(val)
        .then(res => {
          if (res.code == 200) {
            this.queryData.billCode = res.data.billCode
            console.log(res)
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