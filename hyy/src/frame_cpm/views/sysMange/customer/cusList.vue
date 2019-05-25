<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list-wrapper">
            <div class="form">
                <el-form :inline="true" :model="formInline" size="mini">
                    <el-form-item label="客户账号：" prop="code">
                        <el-input v-model="formInline.code"></el-input>
                    </el-form-item>
                    <el-form-item label="客户简称："  prop="name">
                        <el-input v-model="formInline.name"></el-input>
                    </el-form-item>
                    <el-form-item label="客户类型：" prop="type">
                        <el-select v-model="formInline.type" placeholder="请选择">
                            <el-option
                                    v-for="item in typeArr"
                                    :key="item.keyCode"
                                    :label="item.keyName"
                                    :value="item.keyCode"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="formInline.status" placeholder="请选择">
                            <el-option
                                    v-for="item in statusArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="create-wrapper">
                <el-button style="margin-right: 10px;" type="primary" @click="toCreate">新建</el-button>
            </div>
            <div class="table">
                <el-table
                        :data="cusList"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="code"
                            label="客户账号"

                    >
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="客户简称"

                    >
                    </el-table-column>
                    <el-table-column
                            prop="type"
                            label="客户类型"

                    >
                    </el-table-column>
                    <el-table-column
                            prop="status"
                            label="状态"

                    >
                        <template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
                    </el-table-column>
                    <el-table-column
                            prop="operateUserName"
                            label="操作人"

                    >
                    </el-table-column>
                    <el-table-column
                            prop="updateTime"
                            label="操作时间"
                            width="150"

                    >
                        <template slot-scope="scope">
                            <span>{{scope.row.updateTime | renderTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button @click="toDetail(scope.row)" type="text">查看</el-button>
                            <el-button @click="editCus(scope.row)" type="text">编辑</el-button>
                            <el-button @click="changeStatus(scope.row)" type="text">{{scope.row.status==1?'禁用':'启用'}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- footer 分页条 -->
                <div class="page-wrap">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 25, 50, 100]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {cusList,changeStatu,typeList} from 'frame_cpm/http/interface.js'
  export default {
    name: "cusList",
    data() {
      return {
        statusArr: [{
          value: '1',
          label: '启用'
        }, {
          value: '2',
          label: '禁用'
        }, {
          value: '',
          label: '全部'
        }],
        typeArr: [],
        //总数
        total:1,
        //当前页
        currentPage:1,
        //当前页数大小
        pageSize:10,
        formInline: {
          name: '',
          code: '',
          type: '',
          status: '',
        },
        cusList: [],
        status: '',
      }
    },
    filters:{
      renderTime(date) {
        let dateee = new Date(date).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      }
    },
    created() {
      this.getType()
      this.getCusList()
    },
    methods: {
      getType() {
        typeList()
          .then(ret => {
            if(ret && ret.result){
              this.typeArr = ret.data
            }else{
              this.$message({
                message:ret.msg,
                type: 'info'
              });
            }
          })
          .catch(() => {
            this.$message('网络繁忙，请稍后再试')
          });
      },
      toCreate() {
        this.$router.push({path:'newCus',query:{type:1}})
      },
      editCus(val) {
        this.$router.push({path:'newCus',query:{type:2,code:val.code,id:val.id,consumerId:val.consumerId}})
      },
      toDetail(val) {
        this.$router.push({path:'newCus',query:{type:3,code:val.code}})
      },
      getCusList(){
        let _this = this;
        let params = {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          name: this.formInline.name,
          code: this.formInline.code,
          status: this.formInline.status,
          type: this.formInline.type
        }
        cusList(params)
          .then(ret => {
            if(ret && ret.result){
              _this.pageNum = ret.data.pageNum
              _this.pageSize = ret.data.pageSize
              _this.total = ret.data.total
              _this.cusList = ret.data.rows
            }else{
              _this.$message({
                message:ret.msg,
                type: 'info'
              });
            }
          })
          .catch(() => {
            _this.$message('网络繁忙，请稍后再试')
          });
      },
      onSubmit() {
        this.getCusList()
      },
      changeStatus(val) {
        let data = {
          status: val.status,
          consumerId: val.consumerId,
          id: val.id
        }
        if(val.status==1){
          this.$confirm(
            `确认禁用后将不可用，是否继续禁用?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '再想想',
              type: 'warning'
            }
          ).then(() => {
            changeStatu(data)
              .then(ret => {
                if(ret && ret.code == 200){
                  this.success("禁用成功")
                  val.status = 2
                }
              })
              .catch(() => {
                this.error('失败')
              })
          })
        }else{
          changeStatu(data)
            .then(ret => {
              if(ret && ret.code == 200){
                this.success("启用成功")
                val.status = 1
              }
            })
            .catch(() => {
              this.error('失败')
            })
        }
      },
      //当前页改变
      handleCurrentChange(value) {
        this.currentPage = value;
        this.getCusList();
      },
      //当前页数数目改变e
      handleSizeChange(value) {
        this.pageSize = value;
        this.getCusList();
      },
    }
  }
</script>
<style lang="scss" scoped>
    .content-wrapper {
        .breadcrumb {
            margin-bottom: 10px;
            .el-breadcrumb {
                span {
                    font-size: 14px;
                }
            }
        }
        .list-wrapper {
            .create-wrapper {
                width: 100%;
                height: 32px;
                margin-bottom: 10px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .el-form--inline .el-form-item {
                margin-right: 5% !important;
            }
            .companySpan {
                width: 40px;
                height: 32px;
                border-radius: 4px;
                line-height: 40px;
                text-align: center;
                background-color: #3B74FF;
                color: #fff;
                margin-top: 4px;

                i {
                    font-size: 30px;
                }
            }

            .newBuild {
                width: 100%;
                height: 60px;
                background-color: #ccc;
                border-top: #8b8b8b;
            }

            .table {
                width: 96%;
                margin: 30px auto;
            }
            .form{
                width:100%;
                margin:10px 0 10px 10px;
            }
        }
        .window {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(204, 204, 204, 0.9);
            z-index: 1000;

            .treeBox {
                width: 500px;
                height: 400px;
                background-color: #fff;
                position: absolute;
                top: 20%;
                left: 30%;
                border-radius: 2%;

                .title {
                    font-size: 20px;
                    text-align: left;
                    text-indent: 20px;
                    line-height: 40px;
                    color: #8b8b8b;

                    i {
                        display: inline-block;
                        float: right;
                        font-size: 20px;
                        font-weight: bolder;
                        margin: 10px;

                        &:hover {
                            color: red;
                            font-size: 25px;
                        }
                    }
                }

                .border {
                    width: 100%;
                    height: 1px;
                    background-color: #ccc;
                    margin: 6px 0;
                }

                .message {
                    width: 90%;
                    height: 60%;
                    overflow-y: scroll;
                    border: 1px solid #91bbe9;
                    margin: 20px auto;

                }

                .btn {
                    width: 90%;
                    display: flex;
                    justify-content: flex-end;
                    margin: 20px auto;

                }
            }

        }
    }
</style>
