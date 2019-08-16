<template>
  <div class="groupBuyingChannelLayer">
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="110px">
        <el-form-item label="客户名称：">
          <el-input   @input="inputChange" v-model="customerName" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="客户编码：">
          <el-input   @input="inputChange" v-model="customerCode" placeholder="请输入客户编码"></el-input>
        </el-form-item>
         <el-form-item label="团购券名称：">
          <el-input   @input="inputChange" v-model="name" placeholder="请输入团购券名称"></el-input>
        </el-form-item>
        <el-form-item  label="状态">
          <el-select v-model="state" @change="getData">
            <el-option  :value="1" :label="'允许'"></el-option>
            <el-option  :value="0" :label="'不允许'"></el-option>  
          </el-select>
        </el-form-item>
        <el-form-item label="适用影院：">
          <el-input  class="cinemasInput"
           v-model="cinemasModel" 
           @focus="inputFocus"
           placeholder="请选择影院" ></el-input>
        </el-form-item>
        <!-- test -->
        <!-- <el-button type="primary" plain class="xinjian" @click="getData">查询</el-button> -->
        <!-- <el-button type="primary" @click="changeHigh" class="search-btn">{{highWord}}</el-button> -->
      </el-form>

    </div>
    <div class="content">
      <el-row style="padding:5px;float:right;">
        <el-button type="primary" plain class="xinjian" @click="$router.push({path:'details',query:{urlName:'新建'}})">新建</el-button>
      </el-row>
      <br style="clear:both;">
      <!-- <el-row> -->
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="grouponTicketEntity.customerName" label="客户名称" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="grouponTicketEntity.customerCode" label="客户编码" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="grouponTicketEntity.name" label="团购券名称" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="workerName" label="有效期">
            <template slot-scope="scope">
              {{scope.row.grouponTicketEntity.startDate}} - {{scope.row.grouponTicketEntity.endDate}}
            </template>
          </el-table-column>
          <el-table-column prop="grouponTicketEntity.amount" label="代金券抵用金额" width="130" show-overflow-tooltip></el-table-column>
           <el-table-column prop="grouponTicketEntity.settlementAmount" label="代金券结算金额" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="适用影院"  show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.grouponTicketCinemas ? scope.row.grouponTicketCinemas.map( item => item.name).join('、') : '全部影院'}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="可兑换商品" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.grouponTicketMers ? scope.row.grouponTicketMers.map( item => item.merName).join('、') : '全部商品'}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="状态" width="80" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.grouponTicketEntity.status ? '允许': '不允许'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" >
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="$router.push({path:'details',query:{uid:scope.row.grouponTicketEntity.uid,urlName:'查看'}})">查看</el-button>
              <el-button size='small' type="text"  @click="$router.push({path:'details',query:{uid:scope.row.grouponTicketEntity.uid ,urlName:'修改'}})">修改</el-button>
              <el-button size='small' type="text" @click="deleteItem(scope.row.grouponTicketEntity.uid)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <el-pagination
          v-if="total"
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 15, 30]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      <!-- </el-row> -->
       
      <!-- <div class="page-wrap" ref="page_div">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="current" :page-size="pageSize" :total="total"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div> -->
    </div>
    <multiCinema
    @frameCinemaDialogCallBack="frameCinemaDialogCallBack"
    :reviewData="reviewData"
    :dialogVisible.sync="dialogVisible"
    :whereUes="whereUes"
    :innerCinemaMultiData="innerData"
    :disabledData="disabledData"
    ></multiCinema>
    
  </div>
</template>
<script>
import  multiCinema from "frame_cpm/dialogs/cinemaDialog/multiCinema2.vue";
import { grouponTicketQuery,grouponTicketDelete } from "csm/http/interface"
export default {
  components:{
    multiCinema
  },
  data(){
    return{
      dialogVisible:false,
      reviewData:[],
      disabledData:[],
      whereUes:undefined,
      innerData:{
        type:1,
      },
      a:'1313131',
      tableData:[],
      name:'',
      state:1,
      pageSize:10,
      total:0,
      currentPage:1,
      timeout:null,
      customerName:'',
      customerCode:'',

    }
  },
  computed:{
    cinemasModel(){
      let list =  this.reviewData.map((item)=>{
        return item.name
      })
      return list.join('、')
    },
    reviewDataIds(){
      return this.reviewData.map( item => item.id )
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    async getData(){
      const data = await grouponTicketQuery({
        cinemaUids : this.reviewDataIds,
        name:this.name,
        status:this.state,
        page:this.currentPage,
        pageSize:this.pageSize,
        customerName:this.customerName,
        customerCode:this.customerCode,
      })
      this.tableData = data.data.list;
      this.total = data.data.total;
    },
    async deleteItem(uid){
      const data = await grouponTicketDelete(uid)
      console.log(data)
      if(data.code != 200) return this.error(data.msg);
      this.success('删除成功!')
      this.getData();
    },
    frameCinemaDialogCallBack(res){
      console.log(res)
      this.reviewData = res.data;
    },
    inputFocus(){
      this.dialogVisible = true;
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.getData()
    },
    handleCurrentChange(index){
      this.currentPage = index;
      this.getData()
    },
    inputChange(){
      if(this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
          this.getData()
      }, 400);
    }
  },
  watch:{
    reviewDataIds(){
      this.getData()
    }

  }
}
</script>
<style lang="scss" scoped>
.groupBuyingChannelLayer{
  .search-form {
      background: #f5f5f5;
      padding: 16px 24px 8px;
      margin-bottom: 10px;
      // transition: all 1s linear;
      position: relative;
      /deep/ .el-input__inner{
        width: 176px;
      }
      .change_tip{
        font-family: MicrosoftYaHei;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        cursor: pointer;
        position: absolute;
        top:26px;
        right: 40px;
        .el-icon-arrow-down{
          transition: all linear .3s;
        }
        .is-active{
          transform: rotate(180deg);
          transition: all linear .3s;
        }
      }
    }
  .cinemasInput{
    /deep/ .el-input__inner{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .pagination{
    text-align: center;
    margin-top: 20px;
  }
}

</style>


