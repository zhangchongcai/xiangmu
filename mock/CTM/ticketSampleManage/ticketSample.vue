<template>
  <div class="mod-user">
      <!-- 查询块 -->
      <el-form :inline='true' :model="dataForm" class="demo-ruleForm">
        <el-form-item>
          <el-button type="primary" @click="addTicket()">新建</el-button>
        </el-form-item>
      </el-form>
      <!-- 内容块 -->
      <el-table
        :data='dataList'
        stripe
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
          label='票版名称'>
        </el-table-column>
        <el-table-column
          prop='width'
          label='票版宽度'>
        </el-table-column>
        <el-table-column
          prop='height'
          label='票版高度'>
        </el-table-column>
        <el-table-column
          prop='ticketsampleChannelNames'
          label='渠道'>
        </el-table-column>
        <el-table-column
          prop='createTime'
          label='制作时间'>
        </el-table-column>
        <el-table-column
          prop='createUser'
          label='制作人'>
        </el-table-column>
        <el-table-column
          fixed='right'
          width='300'
          label='操作'>
          <template slot-scope='scope' >
            <el-button size='mini' type="text" @click='searchDetail(scope.row.uid)'>查看</el-button>
            <el-button size='mini' type="text" @click='ediHandle(scope.row.uid)'>修改</el-button>
            <el-button size='mini' type="text" @click='deleteHandle(scope.row)'>删除</el-button>
            <el-button size='mini' type="text" @click='importHandle(scope.row.uid)'>导入</el-button>
            <input class="hidden" ref="importExecl" type="file" @change="selExcelFile($event)">
            <el-button size='mini' type="text" @click='exportHandle(scope.row.uid)'>导出</el-button>
            <a :href="excelUrl" download="导出记录.xlsx" ref="excelBtn" class="hidden"></a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码 -->
      <el-pagination
        style="text-align:center"
        @size-change='sizeChangeHandle'
        @current-change='currentChangeHandle'
        :current-page='pageIndex'
        :page-sizes='[10, 20, 30]'
        :page-size='pageSize'
        :total='total'
        layout='total, sizes, prev, pager, next, jumper'>
      </el-pagination>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        excelUrl: '',
        // 添加/编辑数据
        dialogShow: false,
        dataForm: {
          
        },
        // 回调数据
        dataList: [],
        pageIndex: 1,
        pageSize: 5,
        total: 10,
        dataListLoading: false,
        uid:null,
      }
    },
    created () {
      this.getDataList();
    },
    methods: {
      // 获取数据列表
      getDataList () {
        let limit = {
          'page': this.pageIndex,
          'pageSize': this.pageSize
        }
        
        this.$api.ticketList(limit).then( data => {
            if (data && data.code === 200) {
              data = data.data;
              this.total = data.total  //页数
              data.records.map(item=>{
                item.createTime = item.createTime.split(' ')[0]
              })
              this.dataList = data.records
            } else {
              this.dataList = []
              this.totalPage = 0
            }

        }).catch( err => {
            console.log(err)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      //新建
      addTicket() {
        this.$router.push({
          path:"ticketdesign"
        })
      },
      stateFormat(row, column) {
				console.log(row)
			},

      //查询
      searchDetail(uid){
        this.$router.push({
          path:'ticketdetail',
          query:{uid:uid}
        })
      },
      //修改
      ediHandle(uid) {
        this.$router.push({
          path:'ticketdesign',
          query:{uid:uid},
        })
      },
      // 删除
      deleteHandle (item) {
        console.log(item)
        this.$confirm(`确定进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(item.name == "默认票版") {
            return this.$message({
                  message: '默认票版不允许删除',
                  type: 'warning',
                  duration: 1500,
                })
          }
          this.$api.ticketsampleDel(item.uid).then( data => {
              console.log(data)
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
      },
      //导入数据
      selExcelFile: function (e,uid) {
          let files = e.target.files;
          let fileObj = files[0];
          let fileName = fileObj.name;
          console.log(files)
          let extName = fileName.substring(fileName.lastIndexOf(".")+1).toLowerCase();
          console.log(extName)
          if (typeof (fileObj) == "undefined" || fileObj.size <= 0) {
              this.$message({
              type:'error',
              message:'请选择文件'
            })
              this.$refs.importExecl.value='';
              return;
          }else if (!(extName == 'ots')){
            this.$message({
              type:'error',
              message:'请选择ots的文件'
            })
            this.$refs.importExecl.value='';
            return;
          }
          // let formFile = new FormData();
          // formFile.append("action", "UploadVMKImagePath");
          // formFile.append("file", fileObj); //加入文件对象
          // let data = formFile;
          var reader = new FileReader();
			    reader.readAsDataURL(fileObj);
          reader.onloadend = e => {
            console.log(e.target)
            let data = {
              dataInfo : e.target.result,
              name : fileName,
              uid:this.uid
            }
            this.$api.importTicketFile(
            data
            ).then( data => {
                console.log(data)
                this.$refs.importExecl.value='';
                if (data && data.code === 200) {
                  this.$message({
                    message: '导入成功',
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
          }
          // let token = this.$cookie.get('token')

          
      },
      importHandle: function (uid) {
        this.uid = uid
        console.log(uid)
        this.$refs.importExecl.click();
      },
      // 导出数据
      exportHandle (uid) {
        console.log(uid)
        this.$api.exportTicketFile(uid)
        .then(data=> {
          if(data && data.code === 200){
            data = data.data
            console.log(data)
            const exportExlUrl = `data:application/vnd.ms-excel;base64,${data.dataInfo}`
            const fileName = data.name + ".ots"
            if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = exportExlUrl
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            }else { // IE10+下载
                console.log('ie')
                var elemIF = document.createElement("iframe");  
                elemIF.src = exportExlUrl;  
                elemIF.style.display = "none";  
                document.body.appendChild(elemIF); 
            }
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
.hidden{
  display: none;
}
.demo-ruleForm{
  padding-right: 50px;
  padding-top: 20px;
  float: right;
}
.el-pagination{
  padding-top: 15px;
}
.el-table .el-button{
  padding: 0 10px;
  margin-left: 0;
}
// .el-table__body tr(2n){
//   background: #ffff;
// }
</style>

