<template>
  <el-dialog class="good-select-dialog" width="1016px" :title="title" :visible="dialogVisible" @close="closeCallBack"
             @open="openCallBack">
    <div>
      <el-row>
        <el-col :span="5">
          <div class="good-trees-box">
            <el-tree :data="categoryTrees"  icon-class="iconfont icon-neiye-zhankaijiantou" :props="defaultProps" highlight-current node-key="uid" :default-expanded-keys="defaultExpanded"
                     @node-click="handleaCtegoryTrees">
            </el-tree>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="query-box">
            <el-form :inline="true" :model="queryData" label-position="right" label-suffix=":">
              <div>
                <el-form-item label="商品名称">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.merName"></el-input>
                </el-form-item>
                <el-form-item label="商品编码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.merCode"></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="SKU编码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.skuCode"></el-input>
                </el-form-item>
                <el-form-item label="速记代码">
                  <el-input placeholder class="change-dialog-inp" v-model="queryData.shorthandCode"></el-input>
                </el-form-item>
                <el-button class="search" icon="el-icon-search" type="primary" @click="onQuery">查询</el-button>
              </div>
            </el-form>
          </div>
          <div>
            <el-row>
              <el-col :span="19">
                <div class="table-box">
                  <el-table ref="materialTable" :data="tableData" height="470" v-loading="tableLoding" row-key="merCode" @selection-change="handleSelectionMaterial">
                    <el-table-column type="selection" width="40" reserve-selection :selectable="isDisabled" disabled="true"></el-table-column>
                    <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label"
                                     :formatter="item.formatter"></el-table-column>
                  </el-table>
                  <div class="page-wrap">
                    <el-pagination @current-change="handleCurrentChange" :current-page="queryData.currentPage"
                                   :page-size="queryData.pageSize" layout="total, prev, pager, next,jumper"
                                   :total="this.total"></el-pagination>
                  </div>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="empty-box">
                  <div class="clearfix">
                    <span class="selected-content left">已选内容</span>
                    <el-button type="text" class="right" @click="handleEmptyMaterials">清 空</el-button>
                  </div>
                  <ul class="empty-content">
                    <li :key="item.merCode" v-for="(item) in selectedgoods" class="clearfix">
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
    <span slot="footer">
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
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
            label: "基本单位",
            key: "unitName"
          }
        ]
      }
    },
    data() {
      return {
        //查询数据
        queryData: {
          canSale: "1", //可销售商品
          merType: "", //商品类型
          classUid: "",
          name: "",
          code: "",
          shorthandCode: "",
          skuCode: "",
          page: 1,
          pageSize: 10
        },
        categoryTrees: [], //商品分类树
        defaultProps: {
          children: "children",
          label: "name"
        },
        tableData: [],
        tableLoding:false,
        selectedgoods: [],
        total: 0,
        isOpen :true,
      };
    },
    mounted() {
    },
    updated() {
    },
    methods: {
      //弹窗打开回调
      openCallBack() {
        this.queryData.classUid = "";
        this.init();
        this.onQuery("open");
      },
      init() {
        this.selectProductClass({uid: ""});
      },
      // 查询
      onQuery(type) {
        this.queryData.merType = this.merType;
        if (this.cinemaUid) {
          this.queryData.cinemaUid = this.cinemaUid;
          this.goodsDataQueryCinemaGoodsList(this.queryData, type);
        } else {
          this.goodsDataQueryGoodsList(this.queryData, type);
        }
      },
      // 查询树
      handleaCtegoryTrees(data) {
        if (data.uid == "0") {
          this.queryData.classUid = "";
        } else {
          this.queryData.classUid = data.uid;
        }
        if (this.cinemaUid) {
          this.queryData.cinemaUid = this.cinemaUid;
          this.goodsDataQueryCinemaGoodsList(this.queryData);
        } else {
          this.goodsDataQueryGoodsList(this.queryData);
        }

      },
      // 请求商品分类树接口
      selectProductClass(param) {
        this.$cimList
                .getCategoryTrees(param)
                .then(res => {
                  if (res.code === 200) {
                    this.categoryTrees = [res.data];
                  } else {
                    this.error(res.msg);
                  }
                })
                .catch(err => {
                });
      },
      // 根据商品分类查询总部商品信息
      goodsDataQueryGoodsList(param, type) {
        this.tableLoding =true;
        this.$cimList.headquartersGoods
                .goodsDataQueryGoodsList(param)
                .then(res => {
                  this.reqCallBack(res, type)
                })
                .catch(err => {
                  this.tableLoding =false;
                });
      },
      // 根据商品分类查询门店商品信息
      goodsDataQueryCinemaGoodsList(param, type) {
        this.tableLoding =true;
        this.$cimList.storequartersGoods
                .goodsDataQueryCinemaGoodsList(param)
                .then(res => {
                  this.reqCallBack(res, type)
                })
                .catch(err => {
                  this.tableLoding =false;
                });
      },
      reqCallBack(res, type) {
        console.log(this.dialogFeedbackData, "this.dialogFeedbackData")
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
          this.tableData = res.data.list.map(item=>{
             if(item.merType==2){
               if(item.skuName){
                 item.merName =  item.merName + '--' +   item.skuName
               }
             }
            return item
          })
          this.tableLoding =false;
          this.total = res.data.total;
        } else {
          this.error(res.msg);
        }
      },
      // 选择添加商品
      handleSelectionMaterial(value) {
        console.log("选择的商品", value)
        this.selectedgoods = value;
      },
      //删除选择
      deleteSelected(row, flag) {
        this.$refs.materialTable.toggleRowSelection(row,false);
      },

      //去重(根据uid相同，避免数据问题)
      unRepeat(arr) {
        let hash = {};
        return arr.reduce((item, next) => {
          if (!hash[next.merCode]) {
            hash[next.merCode] = true;
            item.push(next);
          }
          return item;
        }, []);
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
        this.$emit("cimSelectedGoodsDialogCallBack", {
          btnType: 0,
          data: this.selectedgoods
        });
      },
      //确定
      handleSubmit() {
        this.$emit("dialogFeedbackData", this.selectedgoods);
        this.$emit("cimSelectedGoodsDialogCallBack", {
          btnType: 1,
          data: this.selectedgoods
        });
        if(this.autoClose){
          this.$emit("update:dialogVisible", false);
        }
      }
    },
    computed: {
      defaultExpanded() {
        return this.categoryTrees.map(item => {
          return item.uid;
        });
      }
    },
    watch: {
      dialogVisible(val) {
        this.$nextTick(() => {
          this.$refs.materialTable.clearSelection();
        })
      },
    }
  };
</script>


<style lang="scss">
  .good-select-dialog {
    .el-dialog__body{
      padding-top: 0;
      padding-bottom: 0;
      .query-box{
        .el-input{
          width: 184px;
        }
      }
    }
    .table-box{
      margin-top: 10px;
    }
    .good-trees-box {
      overflow: scroll;
      .el-tree{
        height: 520px;
      }
    }
    .el-form-item__content{
      width: 184px;
    }
    .el-form-item{
      margin-bottom: 0;
    }
    .page-wrap{
      padding: 10px;
    }
    .search {
      margin-top: 5px;
      float:right;
    }

    .empty-box {
      padding: 0 10px 10px 10px;
      margin-top: 10px;
      border: 1px solid #E5E5E5;
      .selected-content {
        padding: 10px 0;
      }
      .el-icon-close{
        cursor:pointer;
      }
      .title{
        width: 85%;
        overflow: hidden; /*超出部分隐藏*/
        white-space: nowrap; /*不换行*/
        text-overflow: ellipsis; /*超出部分文字以...显示*/
      }
      .el-button {
        padding-left: 0;
        padding-right: 0;
      }

      .empty-content {
        height: 394px;
        overflow-y: auto;
        border-top: 1px solid #F5F5F5;
        padding: 5px 0;
        li {
          padding: 6px 0;
        }
      }
    }
  }
</style>
