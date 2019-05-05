<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>领用物品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">领用物品管理</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="90px">
        <el-form-item label="物品名称:">
          <el-input v-model="searchAdition.billCode"></el-input>
        </el-form-item>
        <el-form-item label="物品编号:">
          <el-input v-model="searchAdition.billCode"></el-input>
        </el-form-item>
        <el-form-item label="适用影院:">
          <el-radio-group v-model="searchAdition.resource">
            <el-radio label="全部影院"></el-radio>
            <el-radio label="制定影院"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">添加</el-button>
      </el-form>
    </div> -->
    <div class="content">
      <el-row style="padding:5px;float:right;">
        <el-button type="primary" plain class="xinjian" @click="$router.push('add')">添加</el-button>
      </el-row>
      <br style="clear:both;">
      <el-row>
        <el-table :data="tableData" stripe>
          <el-table-column prop="name" label="物品名称" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="code" label="管理编号" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="cinemaName" label="适用影院" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right">
            <template slot-scope="scope">
              <span class="icon-color" @click="delateOther(scope.row.uid)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="current" :page-size="size"
          layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import  dialog from '../public/dialog.vue' 
  export default {
    components: {},
    data() {
      return {
        total: 1,//总数
        current: 1,//当前页
        size: 10, //当前页数大小
        tableData: [],//列表
        //查询条件
        searchAdition:{}
      };
    },
    methods: {
      //删除
      delateOther(uid) {
         this.$csmList.deleteOtherthing(uid)
          .then(data =>{
            console.log(data)
            if (data && data.code === 200) {
              this.$alert('删除成功', '领用物品管理', {
              confirmButtonText: '确定',
              callback:()=>{
                this.getList()
              }
            });
            }
          })
          .catch(err =>{
            console.log(err)
          })
      },
      //获取列表数据
      getList() {
        let cinemaName = [];
        let addition = this.searchAdition;
        this.$csmList.otherthingsList(Object.assign({}, addition),this.current,this.size)
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.total = data.data.total;
              this.currPage = data.current;
              this.tableData = data.data.records;
              this.tableData.forEach(item => {
                if(item.refcinema ==  " 0"){
                  // item.otherthingCinemaList = null
                  // item.otherthingCinemaList =   item.otherthingCinemaList.concat(item.otherthingCinemaList)
                   item.otherthingCinemaList.length>0 &&  item.otherthingCinemaList.forEach(el =>{
                     console.log(el.cinemaName)
                     cinemaName.push(el.cinemaName)
                     console.log(cinemaName)
                   })
                  item.cinemaName = cinemaName.join(";")
                  console.log(item.cinemaName)
                  }else{
                  item.cinemaName = "全部影院"
                }
                console.log(item.otherthingCinemaList)
              })
              
            } else {}
          })
          .catch(err => {
            console.log(err);
          })
      },
      //当前页数数目改变
      handleSizeChange(valua) {
        this.size = valua;
        console.log(this.current);
        this.getList();
      },
      //当前页改变
      handleCurrentChange(valua) {
        this.current = valua;
        console.log(this.current);
        this.getList();
      }
    },
    created() {
      this.getList();
    }
  };
</script>
<style lang="scss" scoped>
  .cinemaList {
    box-sizing: border-box;
    width: 100%;

    .search-form {
      background: #f5f5f5;
      padding: 16px 24px;
      margin-bottom: 10px;
      /deep/ .el-input__inner{
        width: 176px;
      }
    }
  }

  .el-form-item {
    width: 300px;
    transition: all 1s linear;
  }
  .el-input--suffix,.el-input__inner,.el-select,.el-form-item__content{
    width: 176px;
  }
  //表格样式
  .cinemaList .has-gutter tr th {
    background: #f2f4fd;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  //行高
  .cinemaList .el-table th {
    padding: 7px 0;
  }

  .cinemaList .el-table td {
    padding: 7px 0;
  }

  .cinemaList .el-pagination {
    text-align: center;
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
    width: 90px;
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
</style>