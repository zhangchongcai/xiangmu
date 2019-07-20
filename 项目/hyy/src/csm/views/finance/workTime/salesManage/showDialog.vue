<template>
  <div class="my_dialog">
    <el-dialog title="修改终端" :visible.sync="dialogTableVisible">
      <el-form label-position="right" label-width="100">

        <el-form-item label="终端名称">
          <el-input v-model="tername" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-radio-group v-model="status">
            <el-radio :label="1">有效</el-radio>
            <el-radio :label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="扣减仓库/货架">
          <el-select v-model="rackName" placeholder="请选择" value-key="id" style="width:300px" @change="changeValue">
            <el-option v-for="item in goodlist" :key="item.id" :label="item.name" :value="item">
              <!-- {{item.rackName}} -->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售地点：">
          <el-select v-model="uid" placeholder="请选择">
            <el-option v-for="(item,index) in salelist" :key="index" :label="item.placeName" :value="item.uid">

            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="addressUpdata">确定</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>

</template>
<script>
  export default {
    data() {
      return {
        dialogTableVisible: false,
        id: "",
        status: "",
        cinemaName: "",
        tername: "",
        cinemaUid: "",
        // rackName:"",
        rackName: "",
        goodlist: [],
        salelist: [],
        saleName: "",
        rackCode:"",
        //查询数据
        uid: "",
        parentData: {},
        placeName: ""
      }
    },
    methods: {
      // 确定选择
      chooseUser() {
        this.mydialogTableVisible = false;
      },
      handleCurrentChange(val) {
        console.log(val, 1111)
        this.currentPage = val
      },
      getRackName(row) {
        console.log(row)
      },
      addressUpdata() {  // 修改
        this.uid = this.uid || ""
        // {rackName:item.name,rackCode:item.code,storeType:item.storeType}  keyValue
        this.$csmList.addressUpdata({
          cinemaUid: this.cinemaUid,
          id: this.id,
          rackCode: this.rackCode, 
          rackName: this.rackName,
          storeType: this.storeType,
          status: this.status,
          tername: this.tername,
          salePlaceEntity: {
            uid: this.uid
          }
        }).then(data => {
          if (data && data.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'warning',
              duration: '1000',
              onClose: () => {
                this.dialogTableVisible = false;
                this.$emit("changeData")
              }
            })
          } else {
            this.$notify({
              title: '失败',
              message: `${data.msg}`,
              type: 'error',
              duration: '1000',
              onClose: () => {
                // this.dialogTableVisible = false;
              }
            });
          }
          console.log(data)
        })
      },
      changeValue(val) {
        console.log(val)
        this.rackName = val.name
        this.rackCode = val.code
        this.storeType = val.storeType
      }
    },
    watch: {
      dialogTableVisible(val) {
        if (val) {
          console.log(this.uid)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .two_search {
    width: 214px;
    font-size: 12px;
  }

  .div_title {
    // padding: 1em;
    // overflow: hidden;
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