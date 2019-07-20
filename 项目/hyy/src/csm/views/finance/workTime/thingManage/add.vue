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
      <p class="div_title"><i class="el-icon-arrow-down">添加物品</i></p>
      <el-form :inline="true" size="small" label-width="100px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="物品名称:" required>
              <el-input v-model="searchAdition.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理编号:" required>
              <el-input v-model="searchAdition.code"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="10">
            <el-form-item label="适用影院:" required>
              <el-radio-group v-model="searchAdition.refcinema" @change="changeCinema">
                <el-radio label="1">全部影院</el-radio>
                <el-radio label="0">指定影院</el-radio>
              </el-radio-group>
              <el-input v-model="cinemaName" v-show="isSome" clearable class="cinema" @focus="selectTreeEvent">
              </el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <el-dialog title="影院选择" :visible.sync="selectTreeValue" width="448px" :before-close="handleClose"
      :lock-scroll="false">
      <el-tree @node-click="nodeClick" :data="newselectValue" show-checkbox default-expand-all node-key="index"
        ref="tree" highlight-current v-loading="this.loading" :props="defaultProps"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmTreeBtn">确 定</el-button>
        <el-button @click="cancelTreeBtn">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 底部 -->
    <div style="height:80px;background:transparent;"></div>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button type="primary" @click="addOtherthing">添加</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>
<script type="text/javascript">
  export default {
    components: {},
    data() {
      return {
        isSome: false,
        cinemaName:"",
        searchAdition: {},
        cinemaValue: this.selectValue && this.selectValue.defVALUE,
        newselectValue: [],
        propSselectValue: this.selectValue,
        selectTreeValue: false,
        filterText: "",
        defaultProps: {
          children: "children",
          label: "orgName"
        },
        loading: false
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    methods: {
      changeCinema(val) {
        this.isSome = !Boolean(Number(val))
      },
      confirmTreeBtn() {
        let value = this.$refs.tree.getCheckedNodes();
        console.log(value)
        let cinemaUIDnewArray = [];
        let cinemaUID = [];
        let orgNameArray = [];
        let orgName = [];
        value.forEach(function (val) {
          if (val.cinemaUID != null) {
            cinemaUIDnewArray.push({
              cinemaUid: val.cinemaUID
            });
            orgNameArray.push(val.orgName);
          }
        });    
        let orgNameString = orgNameArray.join(",");
        this.searchAdition.otherthingCinemaList = cinemaUIDnewArray;
        this.cinemaName = orgNameString
        this.selectTreeValue = false;
        console.log(orgNameString);
      },
      cancelTreeBtn() {
        this.selectTreeValue = false;
      },
      handleNodeClick(data) {
        console.log(data);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      selectTreeEvent() {
        let self = this;
        //只请求一次数据
        if (self.newselectValue.length <= 0) {
          //加载旋转圈圈
          this.loading = true;
          let limit = {
             
              type: 2,
              pageSize: 1000,
              pageNum: 1
          }
          //调用api，展示影院树
          this.$csmList
            .getCinemaByParam(Object.assign({},limit))
            .then(data => {
              const treeValue = data.data;
            
              // this.data = changeTreeJson(treeValue.rows);
              self.newselectValue = changeTreeJson(treeValue.rows);
              Vue.nextTick(function () {
                self.loading = false;
              });
            })
            .catch(msg => {
              console.log(msg);
            });
        }

        this.selectTreeValue = true;
      },
      nodeClick(data) {
        console.log(data);
      },
      handleClose() {
        this.selectTreeValue = false;
      },
      // 添加 
      addOtherthing() {
        this.$csmList.addOtherthing(Object.assign({},this.searchAdition))
          .then(data => {
            this.$confirm('添加成功, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              this.searchAdition = {}
              cinemaName = ""
            }).catch(() => {
              this.$router.push("list")      
            });
          })
          .catch(msg => {
            console.log(msg);
          });
      }
    }
  };
  //转换后台json结构为element可用的结构
  function changeTreeJson(valArr) {
    let newValArr = [];
    valArr.forEach(function (val) {
      let treeNode = {};
      treeNode.cinemaUID = val.id;
      treeNode.orgName =
        val.children != null ?
        val.orgName :
        val.fullName != null ?
        val.fullName :
        val.orgName;
      if (val.children != null) {
        let childrenArr = changeTreeJson(val.children);
        treeNode.children = childrenArr;
      }
      newValArr.push(treeNode);
    });
    return newValArr;
  }
</script>
<style lang="scss" scoped>
  .el-tree-node__label {
    font-size: 12px;
  }
  .cinemaList{
    min-height: 86vh;
    position: relative;
  }
  //  提示信息
  .el-form {
    box-sizing: border-box;
    overflow: hidden;

    .el-row {
      .el-form-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .el-input {
          // height: 32px;
        }
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
    position: absolute;
    z-index: 999;
    bottom: 0;
    right: 0;
    background-color: #f5f5f5;

    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }
  /deep/ .el-dialog{
    .el-dialog__header{
      padding: 16px 20px 12px;
      &::after{
        display: block;
        content: "";
        width:408px;
        height: 1px;
        margin-top: 5px;
        background-color: #E5E5E5;
      }
      .el-dialog__close{
        font-size: 18px;
      }
    }
    .el-dialog__body{
      height: 460px;
      overflow-y: scroll;
      .el-tree-node__label{
        font-size: 12px;
        color: #666666;   
      }
    }
    .el-dialog__footer{
      padding: 0 0 12px;
      &::before{
        display: block;
        content: "";
        width:448px;
        height: 1px;
        margin-bottom: 12px;
        background-color: #E5E5E5;
      }
    }
    button{
      span{
        font-size: 12px;
      }
    }
  }
</style>