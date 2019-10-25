<template>
  <div>
    <el-dialog :title="windowType" :close-on-click-modal="false" class="my_dialog" append-to-body :visible.sync="dialogVisible" @close="close">
      <el-form label-width="" :inline="true">
        <div style="position:relative" v-if="windowType=='选择用户'">
          <el-form-item label="用户账号" class="two_search">
            <el-input v-model="userId" style="width:152px;font-size:12px;"></el-input>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input v-model="userName" style="width:184px;font-size:12px;"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="userStatus" style="width:184px">
              <el-option label="全部" value>全部</el-option>
              <el-option label="启用" value="0">启用</el-option>
              <el-option label="禁用" value="1">禁用</el-option>
              <el-option label="离职" value="2">离职</el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" style="position:absolute;right:0;top:5px;" @click="searchData">查询</el-button>
        </div>
        <div style="position:relative" v-if="windowType=='选择角色'">
          <el-form-item label="角色名称" class="two_search">
            <el-input v-model="name" style="width:152px;font-size:12px;"></el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select v-model="userStatus" style="width:184px">
              <el-option label="全部" value>全部</el-option>
              <el-option label="禁用" value="0">禁用</el-option>
              <el-option label="启用" value="1">启用</el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" style="position:absolute;right:0;top:5px;" @click="searchData">查询</el-button>
        </div>
      </el-form>
      <!-- highlight-current-row  -->
      <div class="choose_table">
        <div>
          <el-table :data="tableList" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0} ref="multipleTable" @select-all="handleSelect" :row-key="getRowKeys" @select="handleSelect" v-if="windowType=='选择用户'">
            <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
            <el-table-column property="loginName" label="用户账号" width="246"></el-table-column>
            <el-table-column property="fullName" label="用户名称" width="246"></el-table-column>
            <el-table-column property="status" label="状态" width="96">
              <template slot-scope="scope">
                <div class="success">
                  {{scope.row.status==0?"启用":""}}
                </div>
                <div class="info">
                  {{scope.row.status==1?"禁用":""}}
                </div>
                <div class="danger">
                  {{scope.row.status==2?"离职":""}}
                </div>
              </template>
            </el-table-column>
          </el-table>

          <el-table :data="tableList" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0} ref="multipleTable" @select-all="handleSelect" :row-key="getRowKeys" @select="handleSelect" v-if="windowType=='选择角色'">
            <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
            <el-table-column property="name" label="角色名称" width="394"></el-table-column>
            <el-table-column property="status" label="状态" width="194">
              <template slot-scope="scope">
                <div class="info">
                  {{scope.row.status==0?"禁用":""}}
                </div>
                <div class="success">
                  {{scope.row.status==1?"启用":""}}
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum" :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
          </div>
        </div>
        <div class="choose_ul">
          <p class="ul_header">
            <span>已选内容：</span>
            <span style="color: #3B74FF;cursor: pointer;" @click="clearSelection">清空</span>
          </p>
          <ul class="ul_body has-page">
            <li v-for="(item,index) in chooseItem" :key="index">
              <span v-if="windowType=='选择用户'">{{item.fullName}}</span>
              <span v-if="windowType=='选择角色'">{{item.name}}</span>
              <span class="delate_span" @click="delateSpan(item)"> <i class="el-icon-close"></i></span>
            </li>
          </ul>
        </div>
      </div>
      <div style="height:12px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="sumbitRes" style="margin-right:22px;">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser, roleList } from "cwfSrc/http/interface.js"
export default {
  props: {
    //弹窗状态
    showSelectWindow: {
      type: Boolean,
      default: false
    },
    //弹窗类型
    windowType: {
      type: String,
      default: "父组件尚未传值"
    },
    //回显
    reviewList: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      tenantId: this.$store.state.loginUser.consumerId || "", //商户id
      //用户查询数据
      searchUserParams: {
        fullName: "",
        loginName: "",
      },
      //角色查询数据
      searchRoleParams: {
        name: ""
      },
      name: "",
      userId: "",
      userName: "",
      userStatus: "",
      dialogVisible: this.showSelectWindow,//弹窗状态
      chooseItem: [],
      tableList: [],
      pageData: {
        pageNum: 1,
        total: 0,
        size: 10,
      },
    }
  },
  watch: {
    showSelectWindow (val) {
      console.log("dialogV333isible", val)
      this.dialogVisible = val;
      this.userId = "";
      this.userName = "";
      this.userStatus = "";
      this.name = "";
    },
    dialogVisible (val) {
      console.log(val, 111111111)
      this.chooseItem = []
      this.userId = "";
      this.userName = "";
      this.userStatus = "";
      this.name = "";
      this.$emit("changeDialogTableVisible", val)
    }
  },
  created () {
    console.log("created")
    this.getDataList("created")
  },
  methods: {
    //关闭弹窗
    close () {
      this.dialogVisible = false
      this.$emit("closeSelcetWindow", false)
    },
    //查询数据
    searchData () {
      this.getDataList()
    },
    //点击确定提交选中数据
    sumbitRes () {
      let submitData = {
        assigneeId: "",
        assigneeName: "",
      }
      if (this.windowType == '选择用户') {
        let nameArr = []
        this.chooseItem.map(item => { nameArr.push(item.fullName) })
        let uidArr = []
        this.chooseItem.map(item => { uidArr.push(item.uid) })

        submitData.assigneeName = nameArr.join(',')
        submitData.assigneeId = uidArr.join(',')
        submitData.assigneeType = 0

      }
      if (this.windowType == '选择角色') {
        let nameArr = []
        this.chooseItem.map(item => { nameArr.push(item.name) })
        let uidArr = []
        this.chooseItem.map(item => { uidArr.push(item.uid) })

        submitData.assigneeName = nameArr.join(',')
        submitData.assigneeId = uidArr.join(',')
        submitData.assigneeType = 1
      }
      console.log(submitData)
      this.$emit("submitData", submitData)
      this.dialogVisible = false
    },
    //获取row的key值
    getRowKeys (row) {
      return row.uid
    },
    //获取用户列表
    getUserList () {
      console.log("getUserList")
      let params = {
        fullName: this.userName,
        loginName: this.userId,
        pageNum: this.pageData.pageNum,
        pageSize: this.pageData.size,
        status: this.userStatus,
        tenantId: this.tenantId
      }
      getUser(params).then(res => {
        if (res.data && res.code == 200) {
          this.tableList = res.data.rows || []
          this.pageData.total = res.data.total || 0
          //回显
          if (this.windowType == "选择用户") {
            console.log("getUserList-this.chooseItem", this.chooseItem)
            this.rowMultipleChecked(this.chooseItem)
          } else {
            this.chooseItem = []
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 1000
          });
        }
      })
    },
    //获取角色列表
    getRoleList () {
      console.log("getRoleList")
      let params = {
        name: this.name,
        pageNum: this.pageData.pageNum,
        pageSize: this.pageData.size,
        status: this.userStatus,
        tenantId: this.tenantId
      }
      roleList(params).then(res => {
        if (res && res.code === 200) {
          this.tableList = res.data.rows || []
          this.pageData.total = res.data.total || 0
          //回显
          if (this.windowType == "选择角色") {
            this.rowMultipleChecked(this.chooseItem)
          } else {
            this.chooseItem = []
          }
        } else {
          this.$message({
            message: res.msg,
            type: "warning",
            duration: 1000
          });
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //回显
    rowMultipleChecked (selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableList.length; k++) {
            if (selectedArr[i].uid == this.tableList[k].uid) {
              if (selectedArr[i].reviewFlag == "review") {
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableList[k],
                  true
                );
              }
              selectedArr[i] = this.tableList[k]
              break;
            }
          }
        }
      } else {
        try {
          this.$refs.multipleTable.clearSelection();
        } catch (error) {
          console.log(error)
        }
      }
    },
    //手动选择
    handleSelect (selection, row) {
      if (row) {
        //点击单选
        this.rowOneToggle(row);
      } else {
        //点击全选
        if (selection.length == 0) {
          for (let index = 0; index < this.tableList.length; index++) {
            const item = this.tableList[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
      console.log("this.choose", this.chooseItem)
    },
    //手动选择-单一数据toggle
    rowOneToggle (row) {
      for (let index = 0; index < this.chooseItem.length; index++) {
        if (row.uid == this.chooseItem[index].uid) {
          this.chooseItem.splice(index, 1);
          return;
        }
      }
      this.chooseItem.push(row);
    },
    //手动选择-单一数据add
    rowOneAdde (row) {
      for (let index = 0; index < this.chooseItem.length; index++) {
        if (row.uid == this.chooseItem[index].uid) {
          return;
        }
      }
      this.chooseItem.push(row);
    },
    //手动选择-单一数据reomove
    rowOneRemove (row) {
      for (let index = 0; index < this.chooseItem.length; index++) {
        if (row.uid == this.chooseItem[index].uid) {
          this.chooseItem.splice(index, 1);
          return;
        }
      }
    },
    //获取列表数据
    getDataList (created) {
      //初始化回显
      if (created) {
        if (this.reviewList) {
          this.chooseItem = (this.reviewList.length == 0) ? [] : JSON.parse(JSON.stringify(this.reviewList))
        } else {
          this.chooseItem = []
        }
        console.log("chooseItem", this.chooseItem)
      }
      if (this.windowType == "选择用户") {
        this.getUserList()
      }
      if (this.windowType == "选择角色") {
        this.getRoleList()
      }
    },
    //页面改变
    handleCurrentChange (val) {
      this.pageData.pageNum = val
      console.log(val)
      this.getDataList()
    },
    //删除
    delateSpan (item) {
      console.log(item)
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item, false);
        for (let i = this.chooseItem.length - 1; i >= 0; i--) {
          if (this.chooseItem[i].uid == item.uid) {
            this.chooseItem.splice(i, 1)
            break;
          }
        }
      }
    },
    //清除
    clearSelection () {
      try {
        this.$refs.multipleTable.clearSelection();
      } catch (error) {
        console.log(error)
      }
      this.chooseItem = []
    },
  },
}
</script>

<style lang="scss" scoped>
.my_dialog {
  /deep/ .el-dialog {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #666666;
    // width: calc(576px + 224px);
    width: 892px;
    // height: 576px;
    border-radius: 4px;
    overflow: hidden;
    .el-dialog__header {
      padding: 14px 20px 10px;
    }
    .el-dialog__title {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 28px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #979797;
      width: 12px;
      height: 12px;
      line-height: 12px;
      text-align: center;
      vertical-align: middle;
      // font-size: 16px;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #666;
    }
    .el-icon-close {
      font-size: 8px;
    }
    .el-button {
      display: inline-block;
      width: 80px;
      height: 32px;
      line-height: 15px;
      vertical-align: middle;
    }
    .el-select {
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #666666;
      .el-input {
        .el-input__inner {
          font-size: 12px !important;
        }
      }
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-dialog__header::after {
      content: "";
      display: block;
      // width: calc(536px + 224px);
      width: 852px;
      height: 1px;
      background: #e5e5e5;
    }
    span {
      font-family: MicrosoftYaHei;
      font-size: 12px;
      letter-spacing: 0;
    }
    .choose_table {
      display: flex;
      margin-top: 11px;
      border-left: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      .choose_ul {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-bottom: none;
        width: 224px;
        .ul_header {
          display: flex;
          padding: 10px 16px;
          justify-content: space-between;
          position: relative;
          // border-bottom: 1px solid #F5F5F5;
          &::after {
            display: block;
            position: absolute;
            top: 37px;
            content: "";
            width: 192px;
            height: 1px;
            background-color: #f5f5f5;
          }
          span {
            // font-family: MicrosoftYaHei;
            // font-size: 12px;
            color: #666666;
            letter-spacing: 0;
          }
        }
        .ul_body {
          margin-top: 10px;
          overflow-y: scroll;
          font-size: 12px;
          li {
            padding: 4.5px 16px;
            display: flex;
            justify-content: space-between;
            span {
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #666666;
              letter-spacing: 0;
            }
            .delate_span {
              cursor: pointer;
            }
          }
        }
        .has-page {
          min-height: 0px;
          max-height: 350px;
        }
      }
    }
    .el-dialog__body {
      padding: 0 20px;
      tr th,
      tr td {
        height: 30px;
        line-height: 30px;
      }
      .two_search {
        // width: 250px;
        // font-size: 12px;
        margin-right: 16px;
      }
      .one_search {
        width: 268px;
      }
      .el-table__header-wrapper,
      .el-table__body-wrapper,
      .el-table__footer-wrapper {
        // width: 536px;
        width: calc(536px + 92px);
      }
      .el-table {
        min-height: 335px;
        // width: 536px;
        width: calc(536px + 92px);
        flex: 0 1 auto;
        box-sizing: border-box;
        .has-gutter tr th {
          padding: 0;
        }
        .cell {
          // font-size: 12px;
          line-height: 30px;
          // float: left;
          // text-align: center;
        }
        .el-radio__label {
          padding: 0;
          display: none;
        }
      }
      .block {
        padding: 20px;
        .el-pagination {
          padding: 0;
          text-align: center;
        }
      }
    }
    .btn-area {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
    }
    .success,
    .danger,
    .info {
      font-size: 12px;
    }
    .primary {
      color: #409eff;
    }
    .success {
      color: #2dbc2d;
    }
    .danger {
      color: #f56c6c;
    }
    .warning {
      color: #fec107;
    }
    /deep/ .content .el-input {
      width: 50px;
    }
  }
}
</style>