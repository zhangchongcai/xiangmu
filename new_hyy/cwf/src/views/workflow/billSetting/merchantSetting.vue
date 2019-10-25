<template>
  <div class="cwf_merchantSetting">
    <div>
      <!-- 搜索栏 -->
      <section>
        <!-- 当一个form元素中只有一个输入框时，在该输入框中按下回车应提交该表单。所以整个页面就刷新了el-form上加上onSubmit="return false"或者 @submit.native.prevent -->
        <el-form :inline="true" :model="searchFormData" ref="searchFormData" class="cwf_search" onSubmit="return false">
          <el-form-item label="适用组织名称：" label-width="96px">
            <el-input v-model="searchFormData.orginizationName" @blur="()=>{searchFormData.orginizationName = searchFormData.orginizationName.trim();}" placeholder="适用组织名称" clearable></el-input>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetForm()" plain>重置</el-button>
          </el-form-item>
        </el-form>
      </section>
      <!-- 按钮组 -->
      <section class="flex-base flex-end">
        <el-row>
          <el-button class="fr addBtn" type="primary" plain @click="addDetail">新建</el-button>
        </el-row>
      </section>
      <!-- 表格 -->
      <section>
        <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
      </section>
      <!-- 分页 -->
      <section class="flex-base flex-center pageStyle" v-if="tableData.length != 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
        </el-pagination>
      </section>
    </div>
    <!-- 删除弹窗 -->
    <el-dialog :visible.sync="deleteDialogTableVisible" class="delete-dialog" width="25%">
      <div class="dialog-content">
        <p><i class="el-icon-warning"></i>当前操作不可逆？您确定</p>
        <p style="padding-left:73px;">要继续吗？</p>
      </div>
      <div class="dialog-btn">
        <el-button type="primary" @click="deleteCommit" style="margin-right:29px;">继续</el-button>
        <el-button @click="deleteDialogTableVisible = false" style="margin-left:0px;">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import commonTable from '../../../components/Table/commonTable.vue';
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
const { cacheMixin } = requireModule('base');

export default {
  components: {
    commonTable,
  },
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ["pageConfig", "searchFormData"],//缓存对象数据
      subComName: "billSetting",//缓存数据唯一标识
      deleteDialogTableVisible: false,//删除弹窗显示
      commitDeteleData: {},//删除对象
      tenantId: this.$store.state.loginUser.consumerId || "", //商户id
      //查询头
      searchFormData: {
        pageNo: 1,
        pageSize: 10,
        orginizationName: "",
        tenantId: this.tenantId
      },
      //分页配置
      pageConfig: {
        start: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      },
      //列表显示数据
      tableData: [],
      //列表渲染配置
      tableLabels: [{
        prop: 'businessName',
        label: '适用组织名称',
        // width: '800'
      },
      {
        prop: 'createTime',
        label: '更新时间',
        // width: '430',
      },

      ],
      //列表操作配置
      tableOptions: {
        label: "操作",
        fixed: "right",
        width: '200',
        options: [{
          text: "编辑",
          method: "editDetail",
          condition: (scope) => {
            return true;
          }
        },
        {
          text: "删除",
          method: "delDetail",
          condition: (scope) => {
            return true;
          }
        }
        ]
      },
    }
  },
  created () {
    this.handleSearch();
  },
  methods: {
    //查询
    search () {
      this.pageConfig.currentPage = 1
      this.handleSearch();
    },
    //重置
    resetForm () {
      this.searchFormData = {
        pageNo: 1,
        pageSize: 10,
        orginizationName: "",
        tenantId: this.tenantId
      }
    },
    //获取数据
    handleSearch () {
      let params = {};

      this.searchFormData.pageSize = this.pageConfig.pageSize
      this.searchFormData.pageNo = this.pageConfig.currentPage
      this.searchFormData.tenantId = this.tenantId

      //过滤空值
      for (const key in this.searchFormData) {
        if (this.searchFormData[key]) {
          params[key] = this.searchFormData[key];
        }
      }

      this.getBillSettingList(params)
    },
    //获取单据设置列表
    getBillSettingList (params) {
      this.$cwfList.searchBillSetting(params).then(data => {
        if (data && data.code == 200 && data.flag == 1) {
          this.tableData = data.data.workflowBusinessList.list
          this.pageConfig.total = data.data.workflowBusinessList.total
        } else {
          this.$message({
            message: data.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //操作列回调
    handleButton (data) {
      this[`${data.method}`](data.scope);
    },
    //编辑
    editDetail (scope) {
      this.$router.push({
        path: "/workflow/editBillSetting",
        query: {
          businessId: scope.row.businessId,
          type: "edit"
        }
      })
    },
    //新增
    addDetail () {
      this.$router.push({
        path: "/workflow/editBillSetting",
        query: {
          type: "add"
        }
      })
    },
    //点击删除按钮
    delDetail (scope) {
      this.openDeleteDialog(scope)
    },
    //打开删除弹窗
    openDeleteDialog (scope) {
      if (scope) {
        this.commitDeteleData = scope.row
      } else {
        this.commitDeteleData = {}
      }
      console.log(this.commitDeteleData)
      this.deleteDialogTableVisible = true
    },
    //删除
    deleteCommit () {
      if (this.deleteDialogTableVisible && JSON.stringify(this.commitDeteleData) != "{}") {
        let params = {
          merchantId: this.commitDeteleData.merchantId,
          tenantId: this.tenantId
        }
        this.$cwfList.deleteBillSetting(params).then(data => {
          if (data && data.code === 200 && data.flag == 1) {
            this.deleteDialogTableVisible = false
            this.commitDeteleData = {}
            this.search()
            this.$message({
              message: "删除成功",
              type: "success",
              duration: 1000
            });
          } else {
            this.deleteDialogTableVisible = false
            this.commitDeteleData = {}
            this.tableData = [];
            this.pageConfig.total = 0;
            this.$message({
              message: data.msg,
              type: "warning",
              duration: 1000
            });
          }
        }).catch(err => {
          this.deleteDialogTableVisible = false
          this.commitDeteleData = {}
          console.log(err)
        })
      }
    },
    //修改分页大小
    handleSizeChange (pageSize) {
      this.pageConfig.pageSize = pageSize;
      this.pageConfig.currentPage = 1;
      this.handleSearch();
    },
    //修改当前显示页
    handleCurrentChange (currentPage) {
      this.pageConfig.currentPage = currentPage;
      this.handleSearch();
    },
  }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/comList.scss";
.cwf_merchantSetting {
  //查询头样式
  .cwf_search {
    padding: 24px;
    background-color: #f3f3f3;
    .el-form-item {
      margin: 0;
      margin-right: 32px;
      /deep/ .el-form-item__label {
        color: #666666;
        font-size: 12px !important;
      }
      .el-input {
        width: 192px;
        font-size: 12px !important;
        color: #666666;
      }
      /deep/ .el-select {
        width: 192px;
        .el-input__inner {
          font-size: 12px !important;
        }
      }
    }
    .el-button {
      width: 80px;
    }
  }
  section {
    margin-bottom: 15px;
  }
  .fr {
    float: right;
  }
  .el-pagination {
    text-align: center;
  }
  .addBtn {
    width: 80px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    text-align: center;
    padding: 0;
  }
  //删除弹窗样式
  .delete-dialog {
    .dialog-content {
      padding: 0 20px 20px 20px;
      p {
        padding: 0 40px;
        text-align: left;
        font-size: 14px;
        color: #666666;
      }
      .el-icon-warning {
        font-size: 18px;
        color: #ff8900;
        margin-right: 15px;
      }
    }
    .dialog-btn {
      text-align: center;
      .el-button {
        width: 80px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        vertical-align: middle;
        padding: 0;
      }
    }
    /deep/ .el-dialog__body {
      padding: 20px;
    }
  }
}
</style>
