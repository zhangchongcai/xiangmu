<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{path:'/analysis/cinema/inventory'}">
          <span class="text-gray">进销存</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">智能补货</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
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
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="getSuppliersList"
                :loading="loading"
                @change="changeSupplier">
                <el-option
                  v-for="item in suppliersList"
                  :key="item.id"
                  :label="item.supply_name"
                  :value="item.supply_code">
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
        缺货明细
      </div>
      <div class="section-content" >
        <div style="overflow:hidden;zoom:1">
            <el-button class="right" size="mini" @click="getOut" style="margin-left:20px">导出</el-button>
            <el-button class="right" size="mini" @click="goOrder" >生成采购单</el-button>
             <!-- 跳转卖品 -->
        </div>
        <div class="reset-table mt20">
          <el-table border :data="tableData">
            <el-table-column prop="goodSku" label="SKU编码"  min-width="110"></el-table-column>
            <el-table-column prop="goodName" label="卖品名称"  min-width="90"></el-table-column>
            <el-table-column prop="parentCategoryName" label="一级品类"  min-width="90"></el-table-column>
            <el-table-column prop="categoryName" label="二级品类"  min-width="90"></el-table-column>
            <el-table-column prop="supplyName" label="所属供应商"  min-width="90"></el-table-column>
            <el-table-column prop="endInventory" label="期末库存数量"  min-width="120px"></el-table-column>
            <el-table-column prop="inventoryTurnoverDaysDay" label="库存数量周转天"  min-width="120px"></el-table-column>
            <el-table-column prop="sugPurchCount" label="建议采购量"  min-width="120px"></el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination
            size="mini"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[15, 30, 45, 60]"
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
export default {
  data() {
    return {
        groupId:1,
        cityId:1,
        cinemaId:1106970,
        categoryList:[],
        categoryId:null,
        suppliersList:[],
        supplierId:null,
        level:null,
        timeType: "day",
        tableData: [], // 表格列表
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
      this.getTableData();
      this.getCategoryList(); 
      this.getSuppliersList();
    },
    search(){
       this.getTableData();
    },
    // 1.商品类型
    getCategoryList(){
      this.$camList.categoryList().then(response=>{
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
    //2.供应商列表
    getSuppliersList(name){
      let params = {
        body:{
          pageNo:1,
          pageSize:this.size,
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
          groupId:this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          dataType:this.timeType,
          categoryCode:this.categoryId,
          level:this.level,
          supplyId:this.supplierId,
          pageNo:this.page,
          pageSize:this.size,
          psiType:0 // 0缺货 1滞销
        }
      }
      this.$camList.inoutTable(params).then(response=>{
        let res = response.data;
        this.tableData = res.list;
        this.total = res.total;
      })
    },
    // 改变商品类型
    changeCategory(id){
      let new_id = id[id.length*1 - 1]
      this.categoryId = new_id;
      this.level = this.categoryObject[new_id];
    },
    // 前往采购单
    goOrder(){
      this.$message({type:'warning',message:'跳转卖品采购页面'})
      // this.$router.push({name:"影院智能补货"})
    },
    // 导出
    getOut(){
      this.$message({type:'warning',message:'开发中'})
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