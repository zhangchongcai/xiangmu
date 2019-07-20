<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
        <!-- <bread-crumb  :currentTime="currentTime" :dataList="dataList"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title">
            品类选择：
             <el-cascader
                placeholder="请选择"
                :options="categoryList"
                filterable
                clearable
                change-on-select
                @change="changeCategory"
              ></el-cascader>
         
          </label>
        </div>
         <div class="time-item">
          <label class="label-title">
            供应商：
               <el-select
                    v-model="supplierId"
                    filterable
                    clearable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getSuppliersList"
                    @change="changeSupplier">
                <el-option
                  v-for="item in suppliersList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.uid">
                </el-option>
              </el-select>
          </label>
        </div>
        <div class="time-item">
         <el-button type="primary" size="small" @click="search">查询</el-button>
        </div>
      </div>
    </div>
     <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        滞销明细
      </div>
      <div class="section-content" >
        <div style="overflow:hidden;zoom:1;margin-bottom:8px">
            <el-button class="right" size="mini" @click="getOut">导出</el-button>
        </div>
        <div class="reset-table">
          <el-table border :data="tableData">
            <el-table-column prop="goodSku" label="SKU编码"  min-width="110"></el-table-column>
            <el-table-column prop="goodName" label="卖品名称" min-width="90"></el-table-column>
            <el-table-column prop="parentCategoryName" label="一级品类"  min-width="90"></el-table-column>
            <el-table-column prop="categoryName" label="二级品类" min-width="90"></el-table-column>
            <el-table-column prop="supplyName" label="所属供应商"  min-width="90"></el-table-column>
            <el-table-column prop="endInventory" label="库存数量"  min-width="90"></el-table-column>
            <el-table-column prop="inventoryTurnoverDaysDay" label="可销天数"  min-width="90"></el-table-column>
            <el-table-column  label="操作"  min-width="90">
                <template slot-scope="scope">
                  <!-- 跳转营销、卖品 -->
                  <span class="text-blue cursor" style="padding-right:10px" @click="goMarket">促销</span> 
                  <span class="text-blue cursor" @click="goSale">退供</span>
                </template>
            </el-table-column>

          </el-table>
        </div>
        <div class="reset-page" v-if="total>15">
          <el-pagination
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[15, 30, 45,60]"
            :page-size="size"
            layout=" sizes,total,prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BreadCrumb from '../partical/breadCrumb'
import config from "frame_cpm/http/config";
export default {
    components:{
        BreadCrumb
    },
  data() {
    return {
        dataList:[
            {path:'/analysis/group/inventory',name:'进销存分析'},
            {name:'滞销明细'}
        ],
        userId: this.$store.state.loginUser
        ? this.$store.state.loginUser.uid
        : null,
        startTime:this.$moment(new Date()).format('YYYY-MM-DD'),
        endTime:this.$moment(new Date()).format('YYYY-MM-DD'),
        timeType:'week',
        currentTime:null,
        categoryId:null,
        suppliersList:[],
        supplierId:null,
        tableData: [{}], // 表格列表
        size: 15,
        page: 1,
        total: 0,
        level:null,
    };
  },
  computed:{
     categoryList(){
      if(this.$store.state.cam.categoryList){
         return this.$store.state.cam.categoryList
      }else{
        return [];
      }
    },
    // level
    categoryLevel(){
        let obj = {};
        if(this.categoryList){
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
    }
  },
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.getTableData();
      this.getCategoryList(); // 分类
      this.getSuppliersList() // 供应商
      this.getCurrentTime();
    },
    search(){
      this.getTableData();
    },
    // 更新时间 
    getCurrentTime(){
      this.$camList.getCurrentTime().then(res=>{
          this.currentTime = res.data;
      })
    },
    // 1.品类
    getCategoryList(){
      this.$store.dispatch('cam/getCagegory')
    },
    // 2.供应商
    getSuppliersList(name){
      let params = {
        body:{
          pageNo:1,
          pageSize:9999,
          supplyCode:null,
          supplyName:name?name:null,
        }
      }
      this.$camList.suppliersList(params).then(response=>{
        let res = response.data;
        if(res.list){
          this.suppliersList = res.list;
        }
      })
    },
    // 3.滞销列表
    getTableData(){
      let params = {
        body:{
          startDate:this.$moment(new Date()).format('YYYY-MM-DD'),
          endDate:this.$moment(new Date()).format('YYYY-MM-DD'),
          categoryUid:this.categoryId,
          supplyUid:this.supplierId,
          psiType:1, // 0.缺货 1 滞销
          level:this.level,
          pageNo:this.page,
          pageSize:this.size,
        }
      }
      this.$camList.inoutTable(params).then(response =>{
        let res = response.data;
        this.tableData = res.list;
        this.total = res.total;
      })
    },
    // 改变商品类型
    changeCategory(id){
      if(id.length>0){
        let new_id = id[id.length*1 - 1]
        this.categoryId = new_id;
        this.level = this.categoryLevel[new_id]
      }else{
        this.categoryId = null;
        this.level = null;
      }
    },
    // 改变供应商
    changeSupplier(id){
       if(id){
            this.supplierId = id;
        }else{
            this.supplierId = null;
        }
    },
    // 表格导出
    getOut(){
        let baseURL = config.baseURL;
        let downUrl =`${baseURL}/analysis/sellGoods/psi/exportDetailData?psiType=1&userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&token=${this.$store.state.loginToken}`;
        window.location.href = downUrl;
    },
    // 促销
    goMarket(){
      this.$router.push({path:'/marketing/management/salesActivity'})
    },
    // 退供
    goSale(){
      this.$router.push({path:'/retail/procurement/purchaseReturn/common?type=1'})
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
    },
  
  }
};
</script>