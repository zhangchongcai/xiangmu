<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item to>盘点方案管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}盘点方案</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    {{this.$route.query.type}}
    <div class="tittle"></div>
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
      :rules="changeRules"
    >
      <!-- 基础信息 start-->
      <div>
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="门店名称" class="select-input">
              <el-input v-model="queryData.cinemaUid" placeholder="请选择门店"></el-input>
              <el-button @click="selectCinemalDialog">选择</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="方案名称">
              <span v-if="routeQuery.type==3">{{queryData.caseName}}</span>
              <el-input
                v-model="queryData.caseName"
                v-else
                placeholder="请输内容"
                prefix-icon="el-icon-search"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="remarks" label="方案描述">
              <span v-if="routeQuery.type==3">{{queryData.remarks}}</span>
              <el-input
                type="textarea"
                placeholder="请输入"
                v-else
                class="remark-input"
                v-model="queryData.remarks"
              ></el-input>
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
        <div class="sub-tittle">盘点商品清单</div>
        <el-table :data="goodList" height="300" stripe>
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
          <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!=3">
            <template slot-scope="{row,$index}">
              <el-button 
                type="text" 
                size="small" 
                @click.stop="handleOperateEvent(row,$index)"
                >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
        <el-button type="primary" @click="handleSubmit" v-if="routeQuery.type!=3">确认</el-button>
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
      selectedGoodsDialogVisible:false,
      goodList:[],
      //查询数据
      queryData: {
        cinemaUid:"111111",
        pageSize: 10,
        page: 1,
        remarks:"",
        caseName:"",
        checkSolutionMerEntityList:[],
        uid:""
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
          label: "基本单位",
          key: "unitName"
        }
      ],
      // 表格数据
      tableData: [],
      changeRules: {
        caseName: [
          { required: true, message: '请输入方案名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.init();
    // this.queryData.billCode = JSON.parse(this.routeQuery.data).billCode
    // if(this.routeQuery.type == "1"){
    //   this.queryData.billCode = JSON.parse(this.routeQuery.data).billCode
    // }
  },
  watch:{
    goodList(val){
      this.goodList = val
    }
  },
  methods: {
    init() {
      if(this.$route.query.type != "1"){
        this.queryData.cinemaUid = JSON.parse(this.routeQuery.data).cinemaUid
        this.queryData.remarks = JSON.parse(this.routeQuery.data).remarks
        this.queryData.uid = JSON.parse(this.routeQuery.data).uid
        this.queryData.caseName = JSON.parse(this.routeQuery.data).caseName
        this.goodList = JSON.parse(this.routeQuery.data).checkSolutionInfosVoList
        this.queryData.checkSolutionMerEntityList = JSON.parse(this.routeQuery.data).checkSolutionInfosVoList
      }
    },
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
    handleOperateEvent(row,index) {
      this.goodList.splice(index, 1)
      console.log(this.goodList)
    },
    // 新增事件
    handleSubmit() {
      this.queryData.checkSolutionMerEntityList = this.chuliGoodSelected(this.goodList)
      if(this.routeQuery.type == "1"){
        if(this.queryData.checkSolutionMerEntityList.length == 0 ){
          this.$message("请添加商品");
        }else{
          this.resCheckSolutionSave(this.queryData)
          this.$router.go(-1)
        }
      }else{
        if(this.queryData.checkSolutionMerEntityList.length == 0 ){
          this.$message("请添加商品");
        }else{
          this.resCheckSolutionUpdate(this.queryData)
          this.$router.go(-1)
        }
      }
      
    },
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
    selectedGoodsDialogCallBack(value) {
      this.goodList = value.data;
      console.log(value);
    },
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleDialogEvent(){      
      // this.selectedGoodsDialogVisible = true
    },
    // 处理选择影院参数
    chuliGoodSelected(selc){
      let newArr = []
      selc.forEach((val,index,arr)=>{
        let valObj = {}
        valObj.unitUid = val.unitUid
        valObj.skuUid = val.skuUid
        if(val.merUid == undefined){
          valObj.merUid = val.uid
        }else{
          valObj.uid = val.uid
          valObj.merUid = val.merUid
        }
        newArr.push(valObj)
      })
      return newArr
    },
    // 盘点方案新增请求
    resCheckSolutionSave(val){
      this.$cimList.inventoryPlan
        .checkSolutionSave(val)
        .then(res => {
          if (res.code === 200) {
            this.$message("新建成功");
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 盘点方案修改请求
    resCheckSolutionUpdate(val){
      this.$cimList.inventoryPlan
        .checkSolutionUpdate(val)
        .then(res => {
          if (res.code === 200) {
            this.$message("修改成功");
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
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