<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/group/home' }">
          <span class="text-gray">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">影院KPI管理</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title">
            时间选择：
              <el-date-picker 
                size="small"
                v-model="time"
                type="month"
                placeholder="选择月"
                @change="changeTime">
              </el-date-picker>
          </label>
        </div>
        <div class="time-item">
          <label class="label-title">
            影院名称：
            <el-input size="small" style="width:200px" v-model="cinemaName"></el-input>
          </label>
          <el-button type="primary" size="mini" style="margin-left:30px" @click="search">查询</el-button>
        <el-button type="primary" size="mini" style="margin-left:30px" @click="search">导入KPI</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title flex">
        <div>影院列表</div>
        <div class="reset-button">
           <el-button  class="right" size="small" @click="createShow">新建</el-button>
        </div>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column prop="id" label="专资编码"  min-width="90" fixed></el-table-column>
            <el-table-column prop="cinemaName" label="影院名称"  min-width="180" fixed></el-table-column>
            <el-table-column prop="dateKey" label="月份"  min-width="90"></el-table-column>
            <el-table-column prop="boxOfficeTarget" label="票房收入目标"  min-width="90"></el-table-column>
            <el-table-column prop="audienceCountTarget" label="观影人数目标"  min-width="90"></el-table-column>
            <el-table-column prop="sellGoodsTarget" label="卖品收入目标" min-width="90"></el-table-column>
            <el-table-column prop="addMemberCount" label="新增会员目标"  min-width="90"></el-table-column>
            <el-table-column prop="memberConsumeTarget" label="会员消费金额目标"  min-width="110px"></el-table-column>
            <el-table-column prop="marketShare" label="票房市场份额目标"  min-width="110px"></el-table-column>
            <el-table-column label="操作"  min-width="90" >
              <template slot-scope="scope">
                    <span class="text-blue cursor" @click="updateShow(scope.row)"> 编辑</span>
                    <span class="text-blue cursor" style="padding-left:10px" @click="delKpi(scope.row.id,scope.row.dateKey)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page" v-if="tableData.length > 0">
          <el-pagination size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="$pageSizes"
            :page-size="size"
            layout=" sizes,total,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 编辑kpi弹窗 -->
    <update-cinema-kpi ref="update" :info="info" @updateKpi="updateKpi"> </update-cinema-kpi>
    <!-- 新建kpi弹窗 -->
    <create-cinema-kpi ref="create" @createKpi="createKpi"></create-cinema-kpi>
  </div>
</template>
<script>
import UpdateCinemaKpi from "./components/updateCinemaKpi";
import CreateCinemaKpi from "./components/createCinemaKpi";
export default {
  components: {UpdateCinemaKpi,CreateCinemaKpi},
  data() {
    return {
      userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
      time:null,
      cinemaName:null,
      info:null,
      tableData: [], // 表格列表
      size: 10,
      page: 1,
      total: 0,
    };
  },
  created(){
    this.getList();
  },
  methods: {
    // 1.影院列表（已设置kpi）
    getList(){
      let params = {
        body:{
          userId:this.userId,
          cinemaName:this.cinemaName,
          monthDate : this.time,
          pageNo:this.page,
          pageSize:this.size
        } 
      };  
      this.$camList.getCinemaKpi(params).then(response =>{
          let res = response.data;
          this.tableData = res.cinemaKpiList.list;
          this.total = res.cinemaKpiList.total;
      })
    },
    // 2.新建kpi
    createKpi(info){
      let params = {
          body:info
      }
      this.$camList.createKpi(params).then(response => {
        this.$refs.create.handleClose();
        this.getList()
      })
    },
    // 3.更新kpi
    updateKpi(info){
      let params = {
          body:info
      }
      this.$camList.updateKpi(params).then(response => {
          this.$refs.update.show = false;
          this.getList()
      })
    },
    // 4.删除kpi
    delKpi(id,date){
      this.$confirm('确定删除此影院的kpi?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(res=>{
        let params = {
          body:{
            id:id,
            dateKey:date,
            userId:this.userId
          }
        };
        this.$camList.deleteKpi(params).then(response =>{
            this.getList()
        })
      })
    },
    // 查询
    search(){
      this.page = 1;
      this.size = 10;
      this.getList()
    },
    // 改变时间
    changeTime(time){
      this.time = this.$moment(time).format('YYYY-MM')
    },
    // 新建弹窗
    createShow(){
      this.$refs.create.show = true;
    },
    // 更新弹窗
    updateShow(row){
      this.info = row;
      this.info.userId = this.userId,
      this.$refs.update.show = true;
    },
    // 分页/大小
    handleSizeChange(num) {
      this.size = num;
      this.getList();
    },
    //分页/页码
    handleCurrentChange(num) {
      this.page = num;
      this.getList();
    }
  }
};
</script>
