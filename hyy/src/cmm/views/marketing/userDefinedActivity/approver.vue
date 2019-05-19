<template>
<div>
    <!-- 选择审批人 -->
    <el-dialog
      title="选择审批人"
      :close-on-click-modal="false"
      width="55%"
      :visible.sync="chooseApproverShow">
      <!-- 查询块 -->
      <el-form :inline='true' :model='dataForm' @keyup.enter.native="getDataList('1')">
        <el-form-item label='组织名称'>
          <el-input v-model='dataForm.name' clearable></el-input>
        </el-form-item>
        <el-form-item label='人员名称'>
          <el-input v-model='dataForm.name' clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="getDataList('1')">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 内容块 -->
      <el-table
        :data='dataList'
        border
        highlight-current-row
        v-loading="dataListLoading"
        style='width: 100%;'
        @row-click="rowClickHandle">
        <el-table-column
          type="index"
          label='序号'
          header-align="center"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop='name'
          label='组织名称'>
        </el-table-column>
        <el-table-column
          prop='name'
          label='人员名称'>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        background
        @size-change='sizeChangeHandle'
        @current-change='currentChangeHandle'
        :current-page='pageIndex'
        :page-sizes='[10, 20, 50, 100]'
        :page-size='pageSize'
        :total='totalCount'
        layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="chooseApproverSubmit()">确定</el-button>
        <el-button @click="chooseApproverShow = false">返回</el-button>
      </span>
    </el-dialog>
</div>
</template>
<script>
import qs from 'qs';
  export default {
    data () {
      return {
        chooseApproverShow: false,
        dataForm: {
          name: '',
          seq: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        dataListLoading: false,
        approverName:''
      }
    },
    created() {
      this.getDataList()
    },
    methods: {
      init () {
        this.chooseApproverShow = true
      },
      // 获取数据列表
      getDataList (page) {
        this.dataListLoading = true
        let limit = {
          'page': page=='1'?'1':this.pageIndex,
          'pageSize': this.pageSize
        } 
        let params = Object.assign(limit, this.dataForm)
        params = qs.stringify(params)
        console.log(params)
        this.$cmmList.tickettypeList(params).then( data => {
            console.log(data)
            if (data && data.code === 200) {
              this.dataList = data.data.records
              this.totalCount = data.data.total
            } else {
              this.dataList = []
              this.totalCount = 0
            }
            this.dataListLoading = false

        }).catch( err => {
            console.log(err)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        console.log(val)
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      rowClickHandle (row, event, column) {
        console.log(row.name)
        this.approverName = row.name
      },
      // 表单提交
      chooseApproverSubmit () {
        this.chooseApproverShow = false
        this.$emit("returnApprover", this.approverName)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table{
    margin-bottom: 20px;
  }
</style>
