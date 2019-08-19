<template>
  <div class="detailsLayer">
    <div class="searchAdition">
      <p class="div_title"><i class="el-icon-arrow-down">基础信息</i></p>
      <el-form  class="detailsForm" size="small" label-width="140px">
        <el-form-item label="客户名称：">
          <div v-if="pageType == 1">{{form.customerName}}</div>
          <el-input v-else @focus="$refs['custId'].openDialog(true)" :style="{width:'inherit'}" v-model="form.customerName"></el-input>
        </el-form-item>
        <el-form-item label="客户编码：" v-if="['1','3'].includes(pageType)">
          <div v-if="pageType == 1">{{form.customerCode}}</div>
          <el-input v-else @focus="$refs['custId'].openDialog(true)" :style="{width:'inherit'}" v-model="form.customerCode"></el-input>
        </el-form-item>
        <el-form-item label="团购劵名称：">
          <div v-if="pageType == 1">{{form.name}}</div>
          <el-input v-else :style="{width:'inherit'}" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <div v-if="pageType == 1">{{form.status ? '允许' : '不允许'}}</div>
          <el-radio-group v-model="form.status" v-else>
            <el-radio :label="1">允许</el-radio>
            <el-radio  :label="0">不允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="有效期：">
          <div v-if="pageType == 1">{{form.date[0]}} - {{form.date[1]}}</div>
          <el-date-picker
            v-else
            :style="{width:'inherit'}"
            v-model="form.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="代金劵抵用金额：">
          <span v-if="pageType == 1">{{form.amount}} 元</span>
          <template v-else>
            <el-input   :style="{width:'inherit'}" v-model="form.amount"></el-input>
            <span :style="{marginLeft:'10px'}">元</span>
          </template>
        </el-form-item>
        <el-form-item label="代金劵结算金额：">
          <span v-if="pageType == 1">{{form.settlementAmount}} 元</span>
          <template v-else>
            <el-input   :style="{width:'inherit'}" v-model="form.settlementAmount"></el-input>
            <span :style="{marginLeft:'10px'}">元</span>
          </template>
        </el-form-item>
        <el-form-item label="适用影院范围：">
          <div v-if="pageType == 1">{{form.useCinema ? '全部影院' : cinemasModel}}</div>
          <el-radio-group  v-else v-model="form.useCinema">
            <el-radio  :label="1">全部影院</el-radio>
            <el-radio  :label="0">指定影院</el-radio>
          </el-radio-group>
          <el-input  @focus="inputFocus" class="cinemasInput"  v-model="cinemasModel" v-if="form.useCinema == 0 && pageType != 1" :style="{width:'inherit'}" ></el-input>
        </el-form-item>
        <el-form-item  label="兑换商品范围：">
          <div v-if="pageType == 1">{{form.useMer ? '不限' : '指定'}}</div>
          <el-radio-group v-else v-model="form.useMer">
            <el-radio  :label="1">不限</el-radio>
            <el-radio  :label="0">指定</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="searchAdition" v-if="form.useMer != 1">
      <p class="div_title"><i class="el-icon-arrow-down">可以兑换商品</i></p>
      <el-row style="padding:5px;float:right;marginBottom:15px;" v-if="pageType !=1">
        <el-button type="primary" plain class="xinjian" 
          @click="selectedGoodsDialogVisible=true">选择商品</el-button>
        <el-button type="primary"  plain class="xinjian" @click="totalDel(null)">删除</el-button>
      </el-row>
      <br style="clear:both;">
      <el-table 
      ref="multipleTable"
      :data="dialogFeedbackData" stripe border style="width: 100%"
      @selection-change="handleSelectionChange"
      :key="pageType">
        <el-table-column
          v-if="pageType !=1"
          type="selection"
          width="55">
        </el-table-column>
          <el-table-column prop="timeCode" label="商品类型" >
            <template slot-scope="scope">
              {{goodsTypeStrs[scope.row.merType]}}
            </template>
          </el-table-column>
          <el-table-column prop="merName" label="商品名称"></el-table-column>
          <el-table-column prop="shorthandCode" label="速记代码" show-overflow-tooltip></el-table-column>
          <el-table-column label="销售状态"  show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.canSaleType ? '可销售' : '不可销售'}}
            </template>
          </el-table-column>
          <el-table-column prop="unitName" label="基本单位"  show-overflow-tooltip></el-table-column>
          <el-table-column prop="price" label="零售价（元）" show-overflow-tooltip></el-table-column>
          <el-table-column label="团购价（元）"  >
            <template slot-scope="scope">
              <div v-if="pageType == 1">{{scope.row.grouponPrice || 0}}</div>
              <input class="priceInput" v-else  type="text" v-model="scope.row.grouponPrice"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="pageType !=1" >
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="totalDel(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </div>

    <!-- 底部 -->
    <div style="height:20px;background:transparent;"></div>
    <div class="bottom-handler-tool" v-if="pageType != 1">
      <div class="btn-area">
        <el-button type="primary" @click="pageType == 2 ? add() : change() " >{{pageType == 2 ? '添加':'修改'}}</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </div>
    </div>
    <selected-goods
    :dialogVisible.sync="selectedGoodsDialogVisible"
    :dialogFeedbackData="dialogFeedbackData"
    @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
    ></selected-goods>
    <multiCinema
    @frameCinemaDialogCallBack="frameCinemaDialogCallBack"
    :reviewData="reviewData"
    :dialogVisible.sync="dialogVisible"
    :whereUes="whereUes"
    :innerCinemaMultiData="innerData"
    :disabledData="disabledData"
    ></multiCinema>
    <tradeMerchantSingleDialog ref="custId" @tradeMerchantSingleCallBack="tradeMerchantSingleCallBack" ></tradeMerchantSingleDialog>
  </div>
</template>
<script>
import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
import  multiCinema from "frame_cpm/dialogs/cinemaDialog/multiCinema2.vue";
import tradeMerchantSingleDialog from 'ccm/dialogs/tradeMerchantSingle'
import { grouponTicketSave,grouponTicketView,grouponTicketUpdate } from "csm/http/interface"
export default {
  components: {
    selectedGoods,
    multiCinema,
    tradeMerchantSingleDialog
  },
  data(){
    return{
      form:{
        name : '',
        status:1,
        date:'',
        amount:'',
        useCinema:1,
        useMer: 1,
        settlementAmount:'',
        customerName:'',
        customerCode:'',
      },
      dialogVisible:false,
      reviewData:[],
      disabledData:[],
      whereUes:undefined,
      innerData:{
        type:1,
      },
      multipleSelection:[],
      dialogFeedbackData:[],
      pageType:'',
      selectedGoodsDialogVisible:false,
      cinemaUids:[],
      grouponTicketMers:[],
      goodsTypeStrs:['','单品','合成品','服务商品','套餐','原材料'],
      changeUid: '',
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.title = to.query.urlName +'团购券'
    next();
  },
  created(){
    this.routerChange()
  },
  async mounted(){
    console.log(this.$refs)
    if(this.pageType!=2){
      this.queryDetail()
    }
    // console.log(this.$route)
    // this.$route.meta.title = this.$route.params.urlName;
  },
  computed:{
    cinemasModel(){
      let list =  this.reviewData.map((item)=>{
        return item.name
      })
      return list.join('、')
    }
  },
  methods:{
    routerChange(){
      switch(this.$route.query.urlName){
        case '查看' : this.pageType = '1' ; break;
        case '新建' : this.pageType = '2' ; break;
        case '修改' : this.pageType = '3' ; break; 
      }
    },
    async queryDetail(){
      const data = await grouponTicketView({
        uid : this.$route.query.uid
      })
      if(data.code ==200){
        const { grouponTicketCinemas, grouponTicketEntity, grouponTicketMers} = data.data
        this.form.name = grouponTicketEntity.name;
        this.form.date = [grouponTicketEntity.startDate,grouponTicketEntity.endDate];
        this.form.useCinema = grouponTicketEntity.useCinema;
        this.form.useMer = grouponTicketEntity.useMer;
        this.form.status = grouponTicketEntity.status
        this.form.amount = grouponTicketEntity.amount;
        this.form.customerName = grouponTicketEntity.customerName;
        this.form.customerCode = grouponTicketEntity.customerCode;
        this.changeUid = grouponTicketEntity.uid
        this.form.settlementAmount = grouponTicketEntity.settlementAmount
        if(grouponTicketCinemas){
          this.reviewData = grouponTicketCinemas || []
        }
        if(grouponTicketMers){
          grouponTicketMers.map( item => {
            item.canSaleType = item.canSale;
            item.uid = item.merUid;
            item.price = item.standardPrice;
          })
          this.dialogFeedbackData = grouponTicketMers;
        }
      }
      console.log(data)
    },
    frameCinemaDialogCallBack(res){
      this.reviewData = res.data;
    },
    inputFocus(){
      this.dialogVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectedGoodsDialogCallBack(res){
      for (let item of res.data){
        item.grouponPrice = item.price
        for (let subItem of this.dialogFeedbackData){
          if(item.uid == subItem.uid){
            item.grouponPrice = subItem.grouponPrice
          }
        }
      }
      this.dialogFeedbackData = res.data 
    },
    totalDel(item){
      const { multipleSelection,dialogFeedbackData } = this;
      if(multipleSelection.length == dialogFeedbackData.length){
        this.multipleSelection = [];
        this.dialogFeedbackData = [];
        return
      }
      let selectItems = item ? [item] : multipleSelection;
      for (let i = 0; i < selectItems.length; i++){
          const item = selectItems[i];
          for(let j = 0; j < dialogFeedbackData.length; j++){
            const subItem = dialogFeedbackData[j];
            if(item.uid == subItem.uid || item.skuUid == subItem.skuUid){
              this.dialogFeedbackData.splice(j,1);
              break;
            }
          }
      }
      this.multipleSelection = [];
    },
    initSubmitData(){
      const { form:{ amount,status,date,useCinema,useMer,name,settlementAmount,customerName,customerCode },reviewData,dialogFeedbackData } = this;
      const cinemaUids = reviewData.filter( item => item.id ).map( item => item.id )
      const grouponTicketMers = dialogFeedbackData.map( item => {
          return {
            canSale : item.canSaleType,
            grouponPrice: item.grouponPrice,
            merType : item.merType,
            merUid : item.uid,
            shorthandCode : item.shorthandCode,
            skuUid : item.skuUid,
            standardPrice : item.price,
            unitName : item.unitName,
            unitUid : item.unitUid,
            merName:item.merName
          }
      })
      if(!customerName) return this.error('请选择客户!')
      if(!name) return this.error('请输入团购券名称!')
      if(!date) return this.error('请选择有效期!')
      if(!amount || amount < 1) return this.error('代金劵抵用金额不能小于1元!')
      if(!settlementAmount || settlementAmount < 1) return this.error('代金劵结算金额不能小于1元!')
      if(useCinema == 0 && !cinemaUids.length){
        if(!reviewData.length) return this.error('请选择影院!')
      } 
      if(useMer == 0 && !grouponTicketMers.length) return this.error('请选择商品!')
      return {
        amount,
        status,
        useCinema,
        useMer,
        name,
        startDate:date[0],
        endDate:date[1],
        cinemaUids ,
        grouponTicketMers ,
        settlementAmount,
        customerName,
        customerCode
      } 
    },
    async add(){
      let params = this.initSubmitData()
      if(!params) return
      const data = await grouponTicketSave(params)
      if(data.code != 200) return this.error(data.msg);
      this.success(data.msg)
      this.$router.go(-1)
    },
    async change(){
      console.log(this.initSubmitData())
      let params = this.initSubmitData()
      if(!params) return
      params.uid = this.changeUid;
      const data = await grouponTicketUpdate(params)
      if(data.code != 200) return this.error(data.msg);
      this.success(data.msg)
      this.$router.go(-1)
    },
    tradeMerchantSingleCallBack(res){
      console.log(res)
      this.form.customerName = res.fullName;
      this.form.customerCode = res.code;
    },
    // openCustomer(){
    //   this.
    // }
  },
  watch:{
    '$route'(){
      this.routerChange()
      if(this.pageType!=2){
        this.queryDetail()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detailsLayer{
  .detailsForm{

  }
  .priceInput{
    -webkit-appearance: none;
    background-color: #FFFFFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    outline: none;
    padding: 5px 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    width: 100%;
    &:focus{
      border-color: #3B74FF;
    }
  }
  .bottom-handler-tool{
      text-align: center;
    }
  .cinemasInput{
    /deep/ .el-input__inner{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }  
}
.table_div,
  .searchAdition {
    margin-bottom: 20px;
  }

  .div_title {
    padding: 1em;
    // overflow: hidden;
    line-height: 32px;

    .title_btn {
      padding: 8px 12px;
      float: right;
      margin-right: 12px;
      // width: 88px;
      height: 32px;

      span {
        font-size: 12px;
      }
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }

    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 10px;
      background-color: rgb(25, 40, 80);
      margin-right: 10px;
    }

    // border-left: 2px rgb(25, 40, 80) solid;
    .el-icon-arrow-down:before {
      margin-right: 5px;
    }
    
  }
</style>

