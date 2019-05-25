<template>
  <div class="mod-user">
    <div v-if="!dialogShow">
      <!-- 查询块 -->
      <el-form :inline='true' :model="dataForm" class="demo-ruleForm">
        <el-form-item>
          <el-button type="primary" @click="addOrUpdateHandle()">新建</el-button>
        </el-form-item>
      </el-form>
      <!-- 内容块 -->
      <el-table
        :data='dataList'
        border
        v-loading="dataListLoading"
        style='width: 100%;'>
        <el-table-column
          type="index"
          label='序号'
          header-align="center"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop='name'
          label='票类名称'>
        </el-table-column>
        <el-table-column
          label='是否为标准票类'>
          <template slot-scope='scope'>
            <span v-if='scope.row.baseFlag === 1' class='danger'>否</span>
            <span v-else class="primary">是</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label='区域加价是否有效'>
          <template slot-scope='scope'>
            <el-tag v-if='scope.row.status === 0' size='small' type='danger'>无效</el-tag>
            <el-tag v-else size='small'>有效</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column
          label='是否允许打折'>
          <template slot-scope='scope'>
            <span v-if='scope.row.isDiscount === 1' class='danger'>否</span>
            <span v-else class="primary">是</span>
          </template>
        </el-table-column>
        <el-table-column
          prop='seq'
          label='票类顺序'>
        </el-table-column>
        <el-table-column
          fixed='right'
          width='200'
          label='操作'>
          <template slot-scope='scope'>
            <el-button size='small' type="text" @click='addOrUpdateHandle(scope.row)'>修改</el-button>
            <el-button size='small' v-if="scope.row.name!='成人票'&&scope.row.name!='团体票'&&scope.row.name!='学生票'" type="text" @click='deleteHandle(scope.row.uid)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        background
        @size-change='sizeChangeHandle'
        @current-change='currentChangeHandle'
        :current-page='pageIndex'
        :page-sizes='[10, 20, 30]'
        :page-size='pageSize'
        :total='totalCount'
        layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
    </div>
    <ticket-type v-else ref="addOrUpdate" @refreshDataList="getDataList"></ticket-type>
  </div>
</template>
<script>
  import TicketType from './ticketType-add-or-update'
  import qs from 'qs';
  export default {
    components: {
      TicketType
    },
    data () {
      return {
        // 添加/编辑数据
        dialogShow: false,
        dataForm: {
          
        },
        // 回调数据
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalCount: 0,
        dataListLoading: false
      }
    },
    created () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.dialogShow = false
        let limit = qs.stringify({
          'page': this.pageIndex,
          'pageSize': this.pageSize
        })
        // console.log(limit)
        this.$api.tickettypeList(limit).then( data => {
            // console.log(data)
            if (data && data.code === 200) {
              this.dataList = data.data.records
              this.totalCount = data.data.total
              // this.pageIndex = data.data.current
              // this.pageSize = data.data.size
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
        // console.log(val)
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        // console.log(val)
        this.pageIndex = val
        this.getDataList()
      },
      addOrUpdateHandle (row) {
        this.dialogShow = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(row)
        })
      },
      // 删除
      deleteHandle (id) {
        // console.log(id)
        this.$confirm(`您确定要删除此记录吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$api.tickettypeDel(id).then( data => {
              // console.log(data)
              if (data && data.code === 200) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.getDataList()
                  }
                })
              } else {
                this.$message.error(data.msg)
              }

          }).catch( err => {
              console.log(err)
          })
        }).catch(() => {})
      }
    }
  }
</script>

<style lang="scss" scoped>
.demo-ruleForm{
  padding-right: 50px;
  padding-top: 20px;
  float: right;
}
.el-pagination{
  padding-top: 15px;
}
.primary{
  color: #409EFF;
}
.danger{
  color: #F56C6C;
}
</style>