<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/analysis/new/home' }">
          <span class="text-gray">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">卖品规则管理</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title">
          品类选择：
             <el-cascader size="small"
                placeholder="请选择"
                :options="categoryList"
                filterable
                clearable
                change-on-select
                @change="changeCategory"
              ></el-cascader>
          </label>
          <el-button type="primary" size="mini" style="margin-left:30px" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        品类列表
      </div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column prop="id" label="品类ID"  min-width="60" fixed></el-table-column>
            <el-table-column prop="category" label="二级品类名称"  min-width="110" fixed></el-table-column>
            <el-table-column prop="lowdays" label="最低库存周转天"  min-width="90"></el-table-column>
            <el-table-column prop="highdays" label="最高库存周转天" min-width="90"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"  min-width="100"></el-table-column>
            <el-table-column prop="updateTime" label="最近修改时间"  min-width="100"></el-table-column>
            <el-table-column label="操作"  min-width="90" >
              <template slot-scope="scope">
                  <span class="text-blue cursor" @click="update" style="padding-right:10px;"> 修改</span>
                  <span class="text-blue cursor" @click="switchOpen">停用</span>
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
    <!-- 编辑弹窗 -->
    <update-sale-manage ref="updateDialog"></update-sale-manage>
  </div>
</template>
<script>
import UpdateSaleManage from './components/updateSaleManage'
export default {
  components:{
    UpdateSaleManage
  },
  data() {
    return {
      groupId:1,
      categoryList:[],
      tableData: [{}],
      size: 10,
      page: 1,
      total: 0,
    };
  },
   computed:{
    categoryObject(){
        let obj = {};
        this.categoryList.forEach(item=>{
            let id = item.value;
            let level = item.level;
            if(!obj.hasOwnProperty(id)){
              obj[id] = level;
            }
            if(item.children){
              item.children.forEach(item=>{
                 if(!obj.hasOwnProperty(item.value)){
                    obj[item.value] = item.level;
                }
              })
            }
        })
        return obj;
    }
  },
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.getCategoryList()
    },
    // 1.品类类型
    getCategoryList(){
      this.$camList.categoryList().then(response =>{
        let res = response.data;
        let resData = res.map(item=>{
          return {
            value:item.categoryCode,
            label:item.categoryName,
            level:item.level,
            children:item.childNodes.map(item=>{
              return {
                value:item.categoryCode,
                label:item.categoryName,
                level:item.level
              }
            })
          }
        })
        this.categoryList = resData;
      })
    },
     // 改变品类类型
    changeCategory(id){
      let leng = id.length -1 ;
      let new_id = id[leng];
      this.categoryId = new_id;
      this.level = this.categoryObject[new_id];
    },
    // 编辑
    update(){
      this.$refs.updateDialog.show = true;
    },  
    // 启用/停用
    switchOpen(){

    },

    // 分页/大小
    handleSizeChange(num) {
      this.size = num;
      this.getTableData();
    },
    //分页/页码
    handleCurrentChange(num) {
      this.page = num;
      this.getTableData();
    }
  }
};
</script>
