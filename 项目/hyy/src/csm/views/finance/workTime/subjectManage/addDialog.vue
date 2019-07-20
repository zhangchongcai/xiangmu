<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <el-form label-position="right" label-width="100">
        <el-form-item label="资金科目编号:">
          <el-input v-model="subjectCode" style="width:300px"  :disabled="changed"></el-input>
        </el-form-item>
         <el-form-item label="资金科目名称:">
          <el-input v-model="subjectName" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="收支类型：">
          <el-select v-model="bpType" placeholder="请选择">
            <el-option label="收入" value="0">收入</el-option>
            <el-option label="支出" value="1">支出</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="addSubject">确定</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        dialogTableVisible:false,
        subjectCode:"",
        subjectName:"",
        bpType:"",
        title:"",
        changed:false,
        uid:""
      }
    },
    methods: {
      handleCurrentChange(val) {
        console.log(val, 1111)
        this.currentPage = val
      },
      getRackName(row) {
        console.log(row)
      },
      addSubject() {  // 新增和修改
        let obj = {
          bpType:this.bpType,
          subjectName:this.subjectName,
          subjectCode:this.subjectCode
        }
        if(this.changed){  // 修改
          // console.log(this.bpType,typeof(this.bpType))
          this.bpType = this.bpType == "收入"?"0":this.bpType == "支出"?"1":this.bpType
          this.$csmList.changeSubject(
            this.subjectCode,{
              bpType:this.bpType,
              subjectName:this.subjectName,
              uid:this.uid
            }
          ).then(data => {
            if (data && data.code === 200) {
              this.$message({
                message: '修改成功',
                type: 'success',
                duration: '1000',
                onClose: () => {
                  this.refresh()
                }
              });     
            }
          })
        }else{
          this.$csmList.addSubject(  // 新增
            obj
          ).then(data => {
            if (data && data.code === 200) {
              this.$message({
                message: '新增成功',
                type: 'success',
                duration: '1000',
                onClose: () => {
                  this.refresh()
                }
              });     
            }
          })
        }
      },
      refresh(){  // 重制数据
        this.dialogTableVisible = false;
        this.$emit("changeData")
        this.bpType = ""
        this.subjectName = ""
        this.subjectCode = ""
      }
    },
    watch: {
      dialogTableVisible(val) {
        if (!val) {
          this.refresh()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .div_title {
    line-height: 32px;
    .title_btn {
      padding: 8px 12px;
      float: right;
      margin-right: 12px;
      height: 32px;
      color: #333;

      span {
        font-size: 12px;
        font-weight: 600;
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

  .my_dialog {
    /deep/ .el-dialog {
      width: 576px;
      height: 365px;

      .el-dialog__header::after {
        content: "";
        display: block;
        width: 536px;
        height: 1px;
        background: #e5e5e5;
      }

      /deep/ .el-form-item {
        margin: 20px;
      }

      .el-select {
        width: 300px;
      }

      .el-table th,
      .el-table td {
        padding: 0;
      }

      .el-dialog__body {
        padding: 0 20px;

        .el-form-item__label,
        .el-form-item__content {
          font-size: 12px;
          line-height: 24px;
          padding-right: 0px;
          letter-spacing: 0;
        }

        .el-form-item__label {
          width: 100px;
          line-height: 32px;
          margin-right: 20px;
        }

        .el-table {
          margin-top: 11px;
          max-height: 300px;

          // height: 300px;
          .has-gutter tr th {
            padding: 0;
          }

          .cell {
            font-size: 12px;
            line-height: 30px;
          }

          .el-radio__label {
            padding: 0;
            display: none;
          }
        }

        .block {
          margin-top: 15px;

          .el-pagination {
            text-align: center;
          }
        }
      }

      .btn-area {
        position: absolute;
        bottom: 20px;
        left: 228px;
      }

      /deep/ .content .el-input {
        width: 50px;
      }
    }
  }
</style>