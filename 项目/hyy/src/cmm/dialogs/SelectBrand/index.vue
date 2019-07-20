<template>
  <div class="my_dialog">
    <el-dialog :title="title" :close-on-click-modal="false" :visible.sync="mydialogTableVisible">
      <el-form label-width="" :inline="true">
        <div style="position:relative">
          <el-form-item label="品牌编码" class="two_search">
            <el-input v-model="brandCode" style="width:152px"></el-input>
          </el-form-item>
          <el-form-item label="品牌名称">
            <el-input v-model="brandName" style="width:184px"></el-input>
          </el-form-item>
          <el-button type="primary" style="position:absolute;right:0;top:5px;" @click="searchUser">查询</el-button>
        </div>
      </el-form>
      <div class="choose_table">
        <div>
          <el-table :data="tableList" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
             ref="multipleTable" @select-all="selectAll"  :row-key="getRowKeys" @selection-change="select">
            <el-table-column type="selection" width="40" :reserve-selection="true"></el-table-column>
            <el-table-column property="code" label="品牌编码" width="294"></el-table-column>
            <el-table-column property="name" label="品牌名称" width="294"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.page"
              :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
            </el-pagination>
          </div>
        </div>
        <div class="choose_ul">
          <p class="ul_header">
            <span>已选内容：</span>
            <span style="color: #3B74FF;cursor: pointer;" @click="clearSelection">清空</span>
          </p>
          <ul class="ul_body">
            <li v-for="(item,index) in chooseItem" :key="index">
              <span>{{item.name}}</span>
              <span class="delate_span" @click="delateSpan(item)"> <i class="el-icon-close"></i></span>
            </li>
          </ul>
        </div>

      </div>

      <div style="height:12px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="mydialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
import {findBrandList} from "cim/http/cim/basicSettings.js"
  export default {
    props: {
      title: {
        type: String,
        default: "父组件尚未传值"
      },
    },
    data() {
      return {
        brandCode:"",
        brandName:"",
        mydialogTableVisible: false,
        chooseItem: [],
        rows:[],
        tableList:[],
        pageData:{
          page:1,
          pageSize:10,
          size:10,
        },
       
      }
    },
    methods: {
        //获取row的key值
        getRowKeys(row){
            return row.id
        },
        // 点击选择数据（暂时储存的数据）
        select(selection,row) {
            if (selection && selection instanceof Array) {
                this.chooseItem=selection;
            }
        },
        // 全选
        selectAll(selection){
            if (selection && selection instanceof Array) {
            this.chooseItem = selection;
            }
        },
        // 确定选择
        chooseUser() {
            this.mydialogTableVisible = false;
            let textArr = []
            let valueArr = []
            this.chooseItem.forEach(item => {
                textArr.push(item.name)
                valueArr.push(item.uid)
            })
            let data = {
              whereUse : '',
              textArr,
              valueArr
            }
            this.$emit("SelBrandCallBack", data);
            this.$emit("youhuiBrandcallBack", data);
        },
        //打开弹窗
        openDialog(){
            this.mydialogTableVisible=true
            this.findBrandList()

        },
        // 页面改变
        handleCurrentChange(val) {
            this.pageData.page=val
            console.log(val)
            this.findBrandList()
        },
        // 查询
        searchUser() {
            this.findBrandList()
        },
        // 删除
        delateSpan(item){
            console.log(this.chooseItem)
            if (item) {
                this.$refs.multipleTable.toggleRowSelection(item);
            }
        },
        clearSelection(){
            this.$refs.multipleTable.clearSelection();
            this.chooseItem = []
        },
        //获取影院类型列表
        findBrandList(){
            let params={
              name:this.brandName,
              code: this.brandCode,
              page: this.pageData.page,
              pageSize: this.pageData.size
            }
            findBrandList(params).then(res=>{
            if(res.data&&res.code==200)
                this.tableList=res.data.list
                this.pageData.total=res.data.total || null

            })
        },
    },
    watch: {
      dialogTableVisible(val) {
        this.mydialogTableVisible = val;
        this.brandCode = "";
        this.brandName = "";
        // this.chooseItem = [];
        console.log(this.rows)
      },
      
      mydialogTableVisible(val) {
        this.$emit("changeDialogTableVisible", val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .my_dialog {
    /deep/ .el-dialog {
      // width: calc(576px + 224px);
      width: 892px;
      height: 576px;
      border-radius: 4px;
      .el-dialog__header{
        padding: 14px 20px 10px;
      }
      .el-dialog__title {
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
        line-height: 28px;
      }
      .el-dialog__headerbtn .el-dialog__close{
        color: #979797;
        font-size: 16px; 
      }
      .el-form-item__label {
        font-size: 12px;
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

      .choose_table {
        display: flex;
        margin-top: 11px;
        border-left: 1px solid #E5E5E5;
        border-bottom: 1px solid #E5E5E5;

        .choose_ul {
          background: #FFFFFF;
          border: 1px solid #E5E5E5;
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
              background-color: #F5F5F5;
            }

            span {
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #666666;
              letter-spacing: 0;
            }
          }

          .ul_body {
            margin-top: 10px;
            overflow-y: scroll;
            height: 350px;

            li {
              padding: 4px 16px;
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
          width: 214px;
          font-size: 12px;
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
          height: 353px;
          // width: 536px;
          width: calc(536px + 92px);
          flex: 0 1 auto;
          box-sizing: border-box;

          .has-gutter tr th {
            padding: 0;
          }

          .cell {
            font-size: 12px;
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
          padding: 10px;

          .el-pagination {
            text-align: center;
          }
        }
      }

      .btn-area {
        display: flex;
        justify-content: center;
      }

      /deep/ .content .el-input {
        width: 50px;
      }
    }
  }
</style>