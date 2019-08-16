<template>
<div>
  <el-dialog
    class="good-select-dialog"
    width="1016px"
    :title="title"
    :visible="dialogVisible"
    @close="closeCallBack"
    @open="openCallBack"
    >
    <div v-if="firstDialog ==true">
      <el-row>
        <el-col :span="5">
          <div class="good-trees-box">
            <el-tree
              :data="categoryTrees"
              icon-class="iconfont icon-neiye-zhankaijiantou"
              :props="defaultProps"
              highlight-current
              node-key="categoryId"
              :default-expanded-keys="defaultExpanded"
              @node-click="handleaCtegoryTrees"
            >
            </el-tree>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="query-box">
            <el-form :inline="true" :model="queryData" label-position="right" label-suffix=":">
              <div>
                <el-form-item label="品牌">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.brandName"></el-input>
                </el-form-item>
                <el-form-item label="商品条码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.barCode"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="商品名称">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.name"></el-input>
                </el-form-item>
                <el-button class="search" type="primary" @click="onQuery">搜索</el-button>
              </div>
            </el-form>
          </div>
          <div>
            <el-row>
              <el-col :span="19">
                <div class="table-box">
                  <el-table
                    ref="materialTable"
                    :data="tableData"
                    height="450"
                    v-loading="tableLoding"
                    :row-key="getRowKey"
                    @selection-change="handleSelectionMaterial"
                  >
                    <el-table-column
                      type="selection"
                      width="40"
                      reserve-selection
                      :selectable="isDisabled"
                      disabled="true"
                    ></el-table-column>
                    <el-table-column
                      v-for="item in tableColumn"
                      :key="item.key"
                      :prop="item.key"
                      :label="item.label"
                      :formatter="item.formatter"
                    ></el-table-column>
                  </el-table>
                  <div class="page-wrap">
                    <el-pagination
                      background
                      @current-change="handleCurrentChange"
                      :current-page="queryData.currentPage"
                      :page-size="queryData.pageSize"
                      layout="total, prev, pager, next,jumper"
                      :total="this.total"
                    ></el-pagination>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="empty-box">
                  <div class="clearfix">
                    <span class="selected-content left">已选内容</span>
                    <el-button type="text" class="right empty-btn" @click="handleEmptyMaterials">清 空</el-button>
                  </div>
                  <ul class="empty-content">
                    <li
                      :key="item.skuUid || item.merCode"
                      v-for="(item) in selectedgoods"
                      class="clearfix"
                    >
                      <span class="left title">{{item.merName || item.name}}</span>
                      <i class="el-icon-close right" @click="deleteSelected(item,false)"></i>
                    </li>
                  </ul>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-row>
        <el-col>
          <div>
            <el-row>
              <el-col>
                <div class="table-box">
                  <el-table
                    ref="materialTable"
                    :data="newtableData"
                    height="450"
                    :row-key="getRowKey"
                  >
                    <!-- <el-table-column
                      type="selection"
                      width="40"
                      reserve-selection
                      :selectable="isDisabled"
                      disabled="true"
                    ></el-table-column> -->
                    <el-table-column
                      v-for="item in newtableColumn"
                      :key="item.key"
                      :prop="item.key"
                      :label="item.label"
                      :width="item.width"
                      :formatter="item.formatter"
                      >
                      <template slot-scope="{row,$index}">
                        <template>
                          <div v-if="item.selectUnit" class="selectUnit">
                              <el-input v-model="row.catName" placeholder="请选择商品分类" style="width:100px;">
                                <i class="el-icon-close el-input__icon" slot="suffix" @click="onCinemalSumit($index)"></i>
                              </el-input>
                              <el-button @click="selectCinemalDialog(row,$index)" style="padding: 3px 20px;">选择</el-button>
                          </div>
                          <div v-else>
                            <span>{{row[item.key]}}</span>
                          </div>
                        </template>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <div class="page-wrap">
                    <el-pagination
                      background
                      @current-change="handleCurrentChange"
                      :current-page="queryData.currentPage"
                      :page-size="queryData.pageSize"
                      layout="total, prev, pager, next,jumper"
                      :total="this.total"
                    ></el-pagination>
                  </div> -->
                </div>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <span slot="footer">
      <el-button type="primary" @click="handleSubmit()">{{this.firstDialog == true ? "下一步":"确定"}}</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
    <!-- {{this.newtableData}} -->
  </el-dialog>
  <!-- 选择影院弹窗 -->
    <combbankgoods-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dataRow="newrow"></combbankgoods-dialog>
</div>  
</template>


<script>
// combBankGoodsDialog
import combbankgoodsDialog from "cim/components/combBankGoodsDialog/cinemaDialog.vue";
export default {
  props: {
    title: {
      type: String,
      default: "选择商品"
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //商品类型 1单品， 2合成品,3服务商品，4套餐，5原材料
    merType: {
      type: [String, Number],
      default: ""
    },
    //门店id
    cinemaUid: {
      type: [String, Number],
      default: ""
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
    // 自动关闭
    autoClose: {
      type: Boolean,
      default: true
    },
    // 表头
    tableColumn: {
      type: [Array],
      default: () => [
        {
          label: "商品编码",
          key: "code"
        },
        {
          label: "品牌",
          key: "brandName"
        },
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "单位",
          key: "unitName"
        }
      ]
    }
  },
  data() {
    return {
      // 查找商品分类参数
      newrow:{},
      firstDialog:true,
      //查询数据
      queryData: {
        pageSize: 10,
        page: 1,
        	// 商品条码
        barCode:"",
        	// 品牌
        brandName:"",
        	// 类目code
        classCode:"",
        // 商品名称
        name:""
      },
      customTree:'',
      categoryTrees: [], //商品分类树
      defaultProps: {
        children: "subTree",
        label: "name"
      },
      tableData: [],
      newtableData:[],
      tableLoding: false,
      selectedgoods: [],
      total: 0,
      isOpen: true,
      newtableColumn:[
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品编码",
          key: "code"
        },
        {
          label: "品牌",
          key: "brandName"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "商品分类",
          key: "catName",
          selectUnit:true,
          width:200

        }
      ]
    };
  },
  mounted() {
    
    
  },

  methods: {
    //弹窗打开回调
    openCallBack() {
      this.queryData.classCode = "";
      this.init();
      this.onQuery("open");
    },
    init() {
      this.firstDialog = true
      this.selectedgoods = []
      this.resSynproTreeAllClass();
      
    },
    selectCinemalDialog(row,index) {
      this.newrow = {}
      this.newrow = row
      this.newrow.newrowId = index
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      if (val.length > 0) {
        this.newtableData.forEach((hval,hindex,harr)=>{
          harr[this.newrow.newrowId].catName = val[0].name
          harr[this.newrow.newrowId].catCode = val[0].code
        })
      } else {
        this.newtableData.forEach((hval,hindex,harr)=>{
            harr[this.newrow.newrowId].catName = ""
            harr[this.newrow.newrowId].catCode = ""
        })
      }
    },
    getRowKey(row) {
      //套餐商品没有skuCode
      if (row.skuUid) {
        return row.skuUid;
      } else {
        return row.merCode;
      }
    },
    // 查询
    onQuery(type) {
      this.resSynproListAllCmcMer(this.queryData);

      // this.queryData.merType = this.merType;
      // if (this.cinemaUid) {
      //   this.queryData.cinemaUid = this.cinemaUid;
      //   this.goodsDataQueryCinemaGoodsList(this.queryData, type);
      // } else {
      //   this.goodsDataQueryGoodsList(this.queryData, type);
      // }

    },
    // 查询树
    handleaCtegoryTrees(data) {
      this.queryData.classCode = data.code
      this.onQuery()
      // if (data.uid == "0") {
      //   this.queryData.classUid = "";
      // } else {
      //   this.queryData.classUid = data.uid;
      // }

      // if (this.cinemaUid) {
      //   this.queryData.cinemaUid = this.cinemaUid;
      //   this.goodsDataQueryCinemaGoodsList(this.queryData);
      // } else {
      //   this.goodsDataQueryGoodsList(this.queryData);
      // }
      // this.customTree = data.uid;
    },
    // 查询商品库商品分类synproListAllCmcMer
    resSynproTreeAllClass() {
      this.$cimList.headquartersGoods
        .synproTreeAllClass()
        .then(res => {
          if (res.code === 200) {
            this.categoryTrees = res.data;
            // this.proThreedata[0].name = "商品分类"
            console.log(res.data);
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 根据商品分类查询总部商品信息
    goodsDataQueryGoodsList(param, type) {
      this.tableLoding = true;
      this.$cimList.headquartersGoods
        .goodsDataQueryGoodsList(param)
        .then(res => {
          this.reqCallBack(res, type);
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    // 根据商品分类查询门店商品信息
    goodsDataQueryCinemaGoodsList(param, type) {
      this.tableLoding = true;
      this.$cimList.storequartersGoods
        .goodsDataQueryCinemaGoodsList(param)
        .then(res => {
          this.reqCallBack(res, type);
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    // 请求商品列表
    resSynproListAllCmcMer(param) {
      this.tableLoding = true;
      this.$cimList.headquartersGoods
        .synproListAllCmcMer(param)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            this.total = res.data.total;
          }
          this.tableLoding = false;
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    // synproSynCmcBaseMer
    reqCallBack(res, type) {
      console.log(this.dialogFeedbackData, "this.dialogFeedbackData");
      if (res.code === 200) {
        if (type == "open") {
          // this.selectedgoods = this.dialogFeedbackData;
          // this.$refs.materialTable.clearSelection();
          if (this.dialogFeedbackData.length > 0) {
            this.dialogFeedbackData.forEach(row => {
              this.$refs.materialTable.toggleRowSelection(row);
            });
          }
        }
        this.tableData = res.data.list.map(item => {
          if (item.merType == 2) {
            if (item.skuName) {
              item.merName = item.merName + "--" + item.skuName;
            }
          }
          return item;
        });
        this.tableLoding = false;
        this.total = res.data.total;
      } else {
        this.error(res.msg);
      }
    },
    // 选择添加商品
    handleSelectionMaterial(value) {
      console.log("选择的商品", value);
      this.selectedgoods = value;
    },
    //删除选择
    deleteSelected(row, flag) {
      this.$refs.materialTable.toggleRowSelection(row, false);
    },
    // 清空选择
    handleEmptyMaterials() {
      this.$refs.materialTable.clearSelection();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    },
    isDisabled(row) {
      return !row.isDisabled;
    },
    //取消弹窗
    closeCallBack() {
      this.$emit("update:dialogVisible", false);
    },
    //取消弹窗
    handleCancel() {
      this.closeCallBack();
    },
    //确定
    handleSubmit() {
      if(this.firstDialog == true){
        if(this.selectedgoods.length == 0){
          this.$message("请选择商品");
        }else{
          this.newtableData = this.selectedgoods
          this.firstDialog = false
        }
        
      }else{
        let newAvtive = {}
        let dqActive = ""
        this.newtableData.some((val,newindex,arr)=>{
          if(val.catName == "" && val.catCode == ""){
            return newAvtive = {a1:true,a2:val}
          }
        })
        if(newAvtive.a1 === true){
          this.$message(newAvtive.a2.name+":没有选择商品分类");
        }else{
          let data = {
            list:this.newtableData
          }
          this.resSynproSynCmcBaseMer(data)
          
        }
      }
      
      
    },
      // 商品保存请求
    resSynproSynCmcBaseMer(param) {
      this.$cimList.headquartersGoods
        .synproSynCmcBaseMer(param)
        .then(res => {
          if (res.code === 200) {
            this.closeCallBack();
            this.$message("添加成功");
            // this.tableData = res.data
            // this.total = res.data.total;
          }else{
            this.$message(res.msg);
            // this.tableLoding = false;
          }
        })
        .catch(err => {
          
        });
    }
  },
  computed: {
    defaultExpanded() {
      return this.categoryTrees.map(item => {
        return item.categoryId;
      });
    }
  },
  watch: {
    dialogVisible(val) {
      this.$nextTick(() => {
        this.$refs.materialTable.clearSelection();
      });
    }
  },
  components:{
    combbankgoodsDialog
  }
};
</script>


<style lang="scss">
.good-select-dialog {
  .el-table {

    border-left: 1px solid #e5e5e5;
    th,td:first-of-type{
      border-left: none;
    }
    th,td:last-of-type{
      border-right: none !important;
    }
  }
  .page-wrap{
    border: 1px solid #e5e5e5;
    border-right: none;
  }

  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;
    .query-box {
      .el-input {
        width: 184px;
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .table-box {
    margin-top: 10px;
  }
  .good-trees-box {
    overflow: scroll;
    .el-tree {
      height: 594px;
    }
    .el-radio{
      margin-right: 0;
    }
    .el-radio__label{
      display: none;
    }
  }

  .el-form-item__content {
    width: 184px;
  }
  .page-wrap {
    padding: 10px;
  }
  .search {
    margin-top: 5px;
    float: right;
  }

  .empty-box {
    padding: 0 10px 10px 10px;
    margin-top: 10px;
    border: 1px solid #e5e5e5;
    .selected-content {
      padding: 10px 0;
    }
    .el-icon-close {
      cursor: pointer;
      font-size: 12px;
    }
    .title {
      width: 85%;
      font-size: 12px;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }

    .empty-content {
      height: 458px;

      overflow-y: auto;
      border-top: 1px solid #f5f5f5;
      padding: 5px 0;
      li {
        padding: 6px 0;
      }
    }
  }
  .el-table .el-input__icon {
    line-height: 25px;
  }
}

</style>
