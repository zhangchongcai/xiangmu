<template>
  <div class="cinemaList">
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small">
        <el-form-item label="资金科目编号：">
          <el-input v-model="searchAdition.subjectCode"></el-input>
        </el-form-item>
        <el-form-item label="资金科目名称：">
          <el-input v-model="searchAdition.subjectName"></el-input>
        </el-form-item>
        <el-form-item label="收支类型：">
          <el-select v-model="searchAdition.bpType">
            <el-option label="全部" value>全部</el-option>
            <el-option label="收入" value="0">收入</el-option>
            <el-option label="支出" value="1">支出</el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
      </el-form>
    </div>
    <div class="content">
      <el-row style="padding:5px;float:right;">
        <el-button type="primary" plain class="xinjian" @click="account_add">新建</el-button>
      </el-row>
      <br style="clear:both;">
      <!-- <el-row> -->
      <el-table :data="tableData" stripe border style="width: 100%">
        <el-table-column prop="subjectCode" label="资金科目编号"></el-table-column>
        <el-table-column prop="subjectName" label="资金科目名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="bpType" label="收支类型" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button size='small' type="text" @click="changeThis(scope.row)">修改</el-button>
            <el-button size='small' type="text" @click="delateThis(scope.row.uid)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- </el-row> -->

    </div>
    <div class="page-wrap" ref="page_div">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current" :page-sizes="[15, 20, 30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
    </div>
    <mydialog ref="addDialog" @changeData="changeData"></mydialog>
  </div>
</template>
<script type="text/javascript">
import mydialog from "./addDialog.vue"
export default {
  components: {
    mydialog
  },
  data () {
    return {
      page: {
        total: 1, //总数
        current: 1, //当前页
        pageSize: 15, //当前页数大小 
      },
      tableData: [], //列表
      searchAdition: {   //查询条件 
      }
    };
  },
  methods: {
    getList () {   // 获取列表数据
      let addition = this.searchAdition;
      this.$csmList.searchSubject(this.page.current, this.page.pageSize, Object.assign({}, addition))
        .then(data => {
          console.log(data)
          if (data && data.code === 200) {
            this.tableData = data.data.records;
            this.tableData.forEach(item => {
              item.bpType = item.bpType == "0" ? "收入" : "支出"
            })
            this.page = data.data
            this.$refs.page_div.style.display = data.data.total < 16 ? "none" : "block"  // 分页是否显示  15条不显示
          } else { }
        })
        .catch(err => {
          console.log(err);
        })
    },
    changeData () {  // 触发列表页刷新
      this.getList()
    },
    search () {  // 搜索
      this.getList()
    },
    account_add () {  // 新建数据
      this.$refs.addDialog.dialogTableVisible = true
      this.$refs.addDialog.title = "新建资金科目"
      this.$refs.addDialog.changed = false  // 判断是否是修改
    },
    changeThis (row) {  // 修改该条数据'
      console.log(row)
      this.$refs.addDialog.dialogTableVisible = true
      this.$refs.addDialog.title = "修改资金科目"
      this.$refs.addDialog.changed = true  // 判断是否是修改
      this.$refs.addDialog.subjectCode = row.subjectCode
      this.$refs.addDialog.subjectName = row.subjectName
      this.$refs.addDialog.bpType = row.bpType
      this.$refs.addDialog.uid = row.uid
    },
    handleSizeChange (valua) {   // 当前页数数目改变
      this.page.pageSize = valua;
      this.getList();
    },
    handleCurrentChange (valua) {  // 当前页改变
      this.page.current = valua;
      this.getList();
    },
    delateThis (subjectCode) {  // 删除该条数据
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$csmList.delateSubject(subjectCode)
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getList()
                }
              });
            } else {
              this.$message(data.msg)
            }
          })
          .catch(err => {
            console.log(err);
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted () {
    this.getList()
  }
};
</script>
<style lang="scss" scoped>
.cinemaList {
  box-sizing: border-box;
  width: 100%;

  /deep/ .search-form {
    background: #f5f5f5;
    padding: 24px 24px 16px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;

    .el-input__inner {
      width: 176px;
    }

    .el-form-item__label {
      font-size: 12px;
      color: #666;
      height: 32px;
    }

    .el-form-item {
      margin-bottom: 8px;
      margin-right: 32px;
      display: flex;
      height: 32px;
      .el-form-item__content {
        height: 32px;
        display: flex;
        align-items: center;
      }

      .el-button + .el-button {
        margin-left: 8px;
      }
    }
  }

  /deep/ .el-date-editor .el-range-separator {
    //时间选择器样式
    line-height: 24px;
    width: 24px;
  }
}
.el-button--primary {
  display: flex;
  width: 80px;
  height: 32px;
  justify-content: center;
  align-items: center;
}
//表格样式
.cinemaList tr th {
  background: #f2f4fd;
  color: #333333;
  font-family: MicrosoftYaHei;
}

//行高
.cinemaList .el-table th {
  padding: 7px 0;
}

.cinemaList .el-table td {
  padding: 7px 0;
}

.cinemaList .el-pagination {
  text-align: center;
}

//时间选择器样式
.el-date-editor .el-range-separator {
  line-height: 24px;
}

.el-date-editor .el-range__icon {
  line-height: 24px;
}

/deep/ .el-date-editor--daterange.el-input__inner {
  width: 256px !important;
}

.el-date-table td span {
  border-radius: 0;
}

.like-lable {
  color: #606266;
  padding: 0 12px 0 0;
  width: 100px;
  box-sizing: border-box;
  white-space: nowrap;
  text-align: right;
}
.search-time {
  display: flex;
}
/deep/ .el-dialog {
  // dialog的样式
  width: 576px;
  height: 576px;

  .el-dialog__header::after {
    // content: "";
    display: block;
    width: 536px;
    height: 1px;
    background: #e5e5e5;
  }

  .el-dialog__body {
    padding: 0 20px;

    .two_search {
      width: 214px;
      height: 32px;
    }

    .one_search {
      width: 268px;
    }

    .el-form-item__label {
      font-size: 12px;
    }

    .el-table {
      margin-top: 11px;
      height: 340px;

      .cinemaList .has-gutter tr th {
        padding: 0;
      }

      .cell {
        font-size: 12px;
        line-height: 30px;
        // text-align: center;
      }

      .el-radio__label {
        padding: 0;
        display: none;
      }
    }

    .block {
      margin-top: 15px;
    }
  }

  .btn-area {
    display: flex;
    justify-content: center;
  }
}
</style>