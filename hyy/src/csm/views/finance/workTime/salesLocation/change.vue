<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>领用物品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">领用物品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'add' }">添加物品</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="searchAdition">
      <p class="div_title"><i class="el-icon-arrow-down">修改销售地点</i></p>
      <el-form :inline="true" size="small" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="门店名称:" required>
              {{cinemaName}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="销售地点编码:" required>
              {{showData.code}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="销售地点名称:" required>
              <el-input v-model="showData.placeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="状态:" required>
              <el-radio-group v-model="status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div class="common-new-built" style="padding:5px;float:right;">
        <el-button type="primary" size="small" plain @click="openTerminal">添加终端</el-button>
      </div>
      <br style="clearn:both">
      <p class="div_title"><i class="el-icon-arrow-down">已绑定终端</i></p>
      <el-table :data="gridData" stripe>
        <el-table-column v-for="item in terminaltableColumn" :key="item.key" :prop="item.key" :label="item.label"
          :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="terminalHandleeDlete($index, row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部 -->
    <div style="height:80px;background:transparent;"></div>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button type="primary" @click="changeThing">保存</el-button>
        <el-button @click="$router.push('list')">取消</el-button>
      </div>
    </div>
    <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
  </div>
  <!-- </div> -->
</template>
<script type="text/javascript">
  import mydialog from "../public/searchDialog"
  export default {
    components: {
      mydialog
    },
    data() {
      return {
        cinemaName: "",
        showData: {
          code: "",
          placeName: "",
        },
        status: 1,
        gridData: [],
        terminaltableColumn: [{
            label: "终端名称",
            key: "tername"
          },
          {
            label: "IP",
            key: "ip"
          },
          {
            label: "终端编号",
            key: "code"
          },
          {
            label: "终端类型",
            key: "type"
          },
          {
            label: "状态",
            key: "status",
            // formatter(row, column, cellValue) {
            //   let result = "";
            //   switch (row.status) {
            //     case 0:
            //       result = "停用";
            //       break;
            //     case 1:
            //       result = "启用";
            //       break;
            //   }
            //   return result;
            // }
          }
        ],
      }
    },
    methods: {
      openTerminal(event) { // 打开填加终端
        event.srcElement.blur()

        this.getGridData("", "", this.$route.query.cinemaUid)
      },
      getGridData(code, status, cinemaUid) { // 获取列表数据
        this.$csmList.terminalList2(code, status, cinemaUid).then(data => {
          if (data && data.code === 200) {
            if (data.data && data.data.length > 0) {
              data.data.forEach(item => {
                item.status = item.status ? "启用" : "停用"
              })
              this.$refs.searchDialog.dialogTableVisible = true;
              this.$refs.searchDialog.title = "添加终端";
              this.$refs.searchDialog.showWhich = "terminal";
              this.$refs.searchDialog.gridData = data.data
            } else {
              this.$message('暂无未绑定销售地点的终端，请核实终端是否已绑定了其他销售地点。')
            }
          }
        })
      },
      chooseWorker(obj) { //  返回值
        let whichOne = this.$refs.searchDialog.showWhich;
        this.gridData = obj
      },
      terminalHandleeDlete(index) { // 删除终端
        this.gridData.splice(index, 1)
      },
      changeThing() { // 修改
        let gridData = JSON.parse(JSON.stringify(this.gridData))
        let terminals = []
        gridData.length && gridData.forEach(item => {
          item.status = item.status == "停用" ? "0" : "1"
        })
        terminals = gridData.length ? gridData : []
        this.$csmList.addressChange({
            cinemaUid: this.showData.cinemaUid,
            id: this.showData.id,
            placeName: this.showData.placeName,
            status: this.showData.status,
            uid: this.showData.uid,
            terminals: terminals,
            code: this.showData.code
          })
          .then(data => {
            console.log(data)
            this.$message(data.msg)
            if (data.code == 200 && data) {
              this.$message('修改成功')
              this.$router.push("list")
            }
            // this.$confirm('修改成功, 是否继续?', '提示', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'success'
            // }).then(() => {
            //   this.searchAdition = {}
            //   cinemaName = ""
            // }).catch(() => {
            //   this.$router.push("list")
            // });
          })
          .catch(msg => {
            console.log(msg);
          });
      },
      addressDetail() { // 详情 
        this.$csmList.addressDetail(this.$route.query.uid).then(data => {
          if (data && data.code === 200) {
            console.log(data)
            this.cinemaName = this.$route.query.cinemaName
            this.showData = data.data
            this.status = data.data.status
            this.gridData = data.data.terminals
            this.gridData.forEach(item => {
              item.status = item.status ? "启用" : "停用"
            })
          }
        })
      },
      searchWorker(current, userName, userAccount) {
        this.getWorker(current, userName, userAccount)
      },
    },
    mounted() {
      this.$route.query.uid && this.addressDetail()
    }
  };
</script>
<style lang="scss" scoped>
  .el-tree-node__label {
    font-size: 12px;
  }

  .el-form {
    //  提示信息
    box-sizing: border-box;
    overflow: hidden;

    .el-row {
      .el-form-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
    }

    /deep/ .el-form-item__content {
      display: flex;

      /deep/ .el-radio-group {
        display: flex;
        align-items: center;
      }

      .cinema {
        margin: 0 10px;
      }
    }
  }

  // title 
  .table_div,
  .searchAdition {
    margin-bottom: 20px;
  }

  .div_title {
    padding: 1em;
    // overflow: hidden;
    line-height: 32px;

    .title_btn {
      padding: 8px 12px;
      float: right;
      margin-right: 12px;
      // width: 88px;
      height: 32px;

      span {
        font-size: 12px;
      }
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }

    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 10px;
      background-color: rgb(25, 40, 80);
      margin-right: 10px;
    }

    // border-left: 2px rgb(25, 40, 80) solid;
    .el-icon-arrow-down:before {
      margin-right: 5px;
    }
  }

  // 基础信息
  .el-form-item__label,
  .el-form-item__content span {
    font-size: 12px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  // 设置表单增删的长度
  .content {
    // .el-input {
    //   width: 192px;
    // }

    .like_ul {
      padding: 8px 8px 0;
    }

    .el-form-item {
      margin: 0;
    }
  }

  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    margin: 0 8px 0;
    // transform: rotate(-90deg);
  }

  .el-collapse-item__header {
    display: inline-block;
    border-bottom: none;
    position: relative;
    padding: 7px 0;
    font-size: 14px;
    color: #333;

    &::after {
      left: 0;
      bottom: 0;
      width: 968px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
    }
  }

  // 清除.el-form-item的长度限制
  .el-form-item {
    width: auto;
  }

  //时间选择器样式
  .el-date-editor .el-range-separator {
    line-height: 24px;
  }

  .el-date-editor .el-range__icon {
    line-height: 24px;
  }

  .el-date-editor--daterange.el-input__inner {
    width: 256px;
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

  .el-input--suffix {
    width: 177px;
  }

  .search-btn {
    margin-left: 30px;
  }

  // 底部
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    // position: fixed;
    z-index: 999;
    bottom: 0;
    right: 0;

    // background-color: #f5f5f5;
    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }

  /deep/ .el-dialog {
    .el-dialog__header {
      padding: 16px 20px 12px;

      &::after {
        display: block;
        content: "";
        width: 408px;
        height: 1px;
        margin-top: 5px;
        background-color: #E5E5E5;
      }

      .el-dialog__close {
        font-size: 18px;
      }
    }

    .el-dialog__body {
      // height: 460px;
      // overflow-y: scroll;

      .el-tree-node__label {
        font-size: 12px;
        color: #666666;
      }
    }

    .el-dialog__footer {
      padding: 0 0 12px;

      &::before {
        display: block;
        content: "";
        width: 448px;
        height: 1px;
        margin-bottom: 12px;
        background-color: #E5E5E5;
      }
    }

    button {
      span {
        font-size: 12px;
      }
    }
  }
</style>