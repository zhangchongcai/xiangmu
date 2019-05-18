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
          <label class="label-title">
           我的影院：
                <el-button size="small" @click="myCinema">请选择</el-button>
          </label>
        </div>
      </div>
    </div>
  
    <div class="section">
      <div class="section-title">
        竞对影院列表
        <div class="right">
            <el-button size="small" @click="add">添加</el-button>
        </div>
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column label="序号"  width="60" type="index" fixed></el-table-column>
            <el-table-column prop="id" label="专资编码" min-width="110"></el-table-column>
            <el-table-column prop="name" label="竞对影院名称" min-width="90"></el-table-column>
            <el-table-column prop="movieNum" label="影厅数"  min-width="90"></el-table-column>
            <el-table-column prop="seatNum" label="座位数"  min-width="90"></el-table-column>
            <el-table-column prop="address" label="地址"  min-width="90"></el-table-column>
            <el-table-column prop="cinema" label="所属院线"  min-width="90"></el-table-column>
            <el-table-column prop="shadow" label="所属影投"  min-width="90"></el-table-column>
            <el-table-column  label="操作"  min-width="110px">
                <template slot-scope="scope">
                    <span class="text-blue cursor" @click="delet(scope.row.id)">移除</span>
                </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 50, 100, 400]"
            :page-size="size"
            layout=" sizes,total,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- 竞对影院选择弹窗 -->
    <cinema-select ref="selectDailog"></cinema-select>
    <!-- 我的影院选择弹窗 -->
    <cinema-my-select ref="mySelectDialog"></cinema-my-select>
  </div>
</template>
<script>
import CinemaMySelect from '../partical/cinemaMySelect';
import CinemaSelect from "../partical/cinemaSelect";

export default {
  components: { CinemaMySelect,CinemaSelect},
  data() {
    return {
      groupId:1,
      tableData: [{
        id:1,
        name:'影院1',
        movieNum:100,
        seatNum:100,
        address:'北京市朝阳区',
        cinema:'大地',
        shadow:'大地影投'
      }], // 表格列表
      size: 10,
      page: 1,
      total: 0
    };
  },
  created() {
   
  },
  methods: {
    // 我的影院
    myCinema(){
      this.$refs.mySelectDialog.show = true;
    },
    // 竞对影院
    select(){
      this.$refs.selectDailog.show = true;
    },
    // 添加竞对影院
    add(){
      this.$refs.selectDailog.show = true;
    },
    // 删除竞对影院
    delet(id){
      this.$confirm('确定删除该竞对影院?','提示',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      })
      // this.confirm({str:'确定删除该竞对影院？'})
    },
    // 分页/大小
    handleSizeChange(num) {
      this.size = num;
    
    },
    //分页/页码
    handleCurrentChange(num) {
      this.page = num;
    
    }
  }
};
</script>
