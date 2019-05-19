<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/group/home' }">
          <span class="text-gray">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">竞对影院管理</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title reset-button">
           我的影院：
              <el-input style="width:180px" size="small" v-model="cinemaName" disabled></el-input>
              <el-button type="primary" size="small" @click="myCinemaShow">请选择</el-button>
          </label>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title clearfix">
        竞对影院列表
        <div class="right reset-button">
            <el-button  size="small" @click="addShow">添加</el-button>
        </div>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="competeCinemaList">
            <el-table-column label="序号"  width="60" type="index" fixed></el-table-column>
            <el-table-column prop="cinemaCompeteUnicode" label="专资编码" min-width="90"></el-table-column>
            <el-table-column prop="cinemaName" label="竞对影院名称" min-width="180"></el-table-column>
            <el-table-column prop="cinemaHall" label="影厅数" min-width="90"></el-table-column>
            <el-table-column prop="cinemaSeat" label="座位数" min-width="90"></el-table-column>
            <el-table-column prop="cinemaAddress" label="地址"  min-width="90"></el-table-column>
            <el-table-column prop="cinemaLine" label="所属院线" min-width="90"></el-table-column>
            <el-table-column prop="cinemaInvest" label="所属影投" min-width="90"></el-table-column>
            <el-table-column  label="操作"  min-width="110px">
                <template slot-scope="scope">
                    <span class="text-blue cursor" @click="delet(scope.row.id)">移除</span>
                    <span class="text-blue cursor" @click="sort(scope.row.id,scope.$index,'up')" v-if="scope.$index >0">上移</span>
                    <span class="text-blue cursor" @click="sort(scope.row.id,scope.$index,'down')" v-if="scope.$index < (competeCinemaList.length-1)">下移</span>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page" v-if="competeCinemaList.length > 0">
          <el-pagination size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="$pageSizes"
            :page-size="size"
            layout="total,sizes,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 竞对影院选择弹窗 -->
    <cinema-select ref="selectDailog" :cinemaId="cinemaId" @addCinema="addCinema"></cinema-select>
    <!-- 我的影院选择弹窗 -->
    <cinema-my-select ref="mySelectDialog" @getList="getBindingCinema"></cinema-my-select>
  </div>
</template>
<script>
import CinemaMySelect from '../partical/cinemaMySelect';
import CinemaSelect from "../partical/cinemaSelect";

export default {
  components: { CinemaMySelect,CinemaSelect},
  data() {
    return {
      userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
      cinemaName:null,
      cinemaId:null,
      competeCinemaList: [],
      size: 10,
      page: 1,
      total: 0,
    };
  },
 
  methods: {
    // 1. 查询竞对影院（已绑定）
    getBindingCinema(option){
      if(option){
        this.cinemaName = option.cinemaName;
        this.cinemaId = option.cinemaId;
      }
      let params = {
        body:{
            userId:this.userId,
            cinemaCode:this.cinemaId,
            pageNo:this.page,
            pageSize:this.size
        }
      };
      this.$camList.getBindingCinemaList(params).then(response =>{
          let res = response.data;
          this.competeCinemaList = res.list;
          this.total = res.total;
      })
    },
    
    // 4. 添加竞对影院
    addCinema(info){
        let params = {
           body:info
        };
        this.$camList.addCompeteCinema(params).then(response =>{
            this.getBindingCinema();
            this.$refs.selectDailog.show = false;
        })
    },
    // 5.排序
    sort(id,index,type){
      let toId = null;
      let toIndex = null;
      if(type == 'up'){
          toId = this.competeCinemaList[(index - 1)].id;
          toIndex = index -1 ;
      }else if(type == 'down'){
         toId = this.competeCinemaList[(index + 1)].id;
         toIndex = index + 1;
      }
      let params = {
          body:{
            id:id,
            sortId:toId,
            userId:this.userId
          }
      };
      this.$camList.sortCompeteCinema(params).then(response =>{
        let oldRow = this.competeCinemaList[index];
        let toRow = this.competeCinemaList[toIndex];
        this.$set(this.competeCinemaList,index,toRow);
        this.$set(this.competeCinemaList,toIndex,oldRow);
      })
    },
    // 我的影院弹窗
    myCinemaShow(){
      this.$refs.mySelectDialog.initData();
      this.$refs.mySelectDialog.show = true;
    },
    // 竞对影院弹窗
    addShow(){
      if(!this.cinemaId){
        this.$message({type:'error',message:'请选择我的影院'})
        return ;
      }else{
        this.$refs.selectDailog.getCompeteList();
        this.$refs.selectDailog.show = true;
      }
    },
    // 删除竞对影院
    delet(id){
      this.$confirm('确定删除该竞对影院?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(()=>{
        let params = {
          body:{
             idList:[id]
          }
        }
        this.$camList.deleteCompeteBind(params).then(response =>{
            this.getBindingCinema()
        })
      })
    },
    // 分页/大小
    handleSizeChange(num) {
      this.size = num;
      this.getBindingCinema()
    },
    //分页/页码
    handleCurrentChange(num) {
      this.page = num;
       this.getBindingCinema()
    
    }
  }
};
</script>
