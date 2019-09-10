<template>
  <div class="pageLayer">
    <div class="pageTitle">退货</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <div class="fromInput" :style="{width:'34.5vw'}">
          <el-input  type="text" v-model="key" placeholder="请扫描或输入影票编号/订单编号/取货码/票券编号" size="medium" width="34.5vw"></el-input>
        </div>
        <el-button size="medium" type="primary" @click="getDate">查询</el-button>
        <!-- <el-button size="medium" @click="dialogOpen('2')">清空</el-button>
        <el-button size="medium"  @click="dialogOpen('1')">按影片场次退票</el-button> -->
        <el-button size="medium" @click="empty">清空</el-button>
        <!-- <el-button size="medium"  @click="$router.push({name:'selectReturnGoods'})">按影片场次退票</el-button> -->
      </div>
      <div class="orderLayer">
        <h1>订单信息</h1>
        <ul>
          <li><span>订单编号：</span>{{data.billCode}} <span v-if="data.netSaleFlag" class="tag">网售</span>  </li>
          <li><span>终端编号：</span>{{data.terminalCode}}</li>
          <li><span>收银员：</span>{{data.userName}}</li>
          <li><span>交易影院：</span>{{data.cinemaName}}</li>
          <li><span>交易时间：</span>{{data.createTime}}</li>
          <li><span>总金额：</span>{{data.payAmount || 0}}元</li>
          <li><span>放映信息：</span>{{data.showInfo}}</li>
        </ul>
      </div>
      <div class="tableLayer">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          header-cell-class-name="posTableHead"
          :row-class-name="rowClassName"
          :show-header="false"
          >
          <el-table-column >
            <template slot-scope="scope">
              <span>{{scope.row.TableId}}</span>
              <!-- <span class="tag">标记</span> -->
            </template>
          </el-table-column>
          <el-table-column prop="seatStr"></el-table-column>
          <el-table-column >
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.TableId">{{scope.row.statusStr}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="priceStr"></el-table-column>
          <el-table-column
            width="55">
            <template slot-scope="scope">
              <div>
               <el-checkbox @change="checkboxChange(...arguments,scope.row)" v-if="scope.row.TableId" :disabled="scope.row.getStatus == 30 || data.netSaleFlag ? true : false" v-model="multipleSelection" :label="scope.row" >{{ }}</el-checkbox>
              </div>
            </template>
          </el-table-column>
          <!-- <div slot="append" class="tableFoot">
            <div class="paginationLayer">
              <div class="paginationInfo">共10条记录 1/2</div>
              <div class="paginaButtoms">
                <el-button size="mini" icon="el-icon-arrow-left"></el-button>
                <el-button size="mini" icon="el-icon-arrow-right"></el-button>
              </div>
            </div>
          </div> -->
        </el-table>
      </div>
      <div class="queryDateForm" style="padding-bottom:0;">
        <v-select :disabled="data.netSaleFlag ? true : false">
          <el-select 
          v-model="returnTypesVal" 
          placeholder="请选择退款方式" 
          :disabled="data.netSaleFlag ? true : false"
          class="retunTypeSelect" size="small">
              <el-option
              v-for="item in returnTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </v-select>
        <div class="returnMoneys">
          合计退款金额：&nbsp; {{cash}} <span>元&nbsp;
            <template v-if="moneys.length">
              （
              <span 
              v-for="(item,index) in moneys" 
              :key="index">
              {{item.name}}<b>{{item.money}}</b>元{{index == moneys.length-1?'':'+'}}</span>
              ）
            </template>
          </span>
        </div>
      </div>
      <div class="queryDateForm">
        <div class="fromInput"><el-input  v-model="phone" type="text" placeholder="请登记手机号" size="small"></el-input>  </div>
        <v-select>
          <el-select v-model="value" placeholder="请选择退款原因" class="select" size="small">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </v-select>
      </div>
      
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">取消</el-button>
      <el-button size="medium" type="primary" @click="beforeRefor"  :loading="loading">退款</el-button>
      <!-- <el-button size="medium" type="primary" @click="jhPayJudge"  :loading="loading">退款</el-button> -->
    </div>
    <!-- <el-dialog title="操作提示" :visible.sync="visible" width="50%">
      <div class="dialogContent">
        <div class="payByCard" v-if="type == 1">
          <div><i class="iconfont iconqingshuaqiatuikuan"></i></div>
          <div>请刷卡退款</div>
        </div>
        <div class="formlayer" v-else>
          <el-form ref="form" :model="form" label-width="120px" >
            <el-form-item label="登录账号：">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="登录密码：">
              <el-input v-model="form.password"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </div>
    </el-dialog> -->
    <el-dialog title="操作提示" :visible.sync="visible" width="30%">
      <div class="dialogContent">
        <span class="iconLayer"><i class="iconfont icontishigantanhao"></i></span> 
        <span>场次已经放映结束，退票需要广电审核，是否继续退票？</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="jhPayJudge">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'assets/css/table.scss'
import vSelect from 'components/select/index'
import labelInput from 'components/labelInput/index'
import dateInput from 'components/dateInput/index'
import jhPay from 'http/jhPay';
import printing from 'http/printing'
import app from 'http/app'
import { mapGetters } from 'vuex'
import { refundFindSaleBillForRefund,csmReason,refundRefundSaleBill,getJhPayParam } from 'http/apis'
export default {
  components:{
    vSelect,
    labelInput,
    dateInput,
  },
  data(){
    return{
      date:false,
      form:{
        name:'',
        password:'',
      },
      key:'',
      data:{

      },
      options: [],
      value: '',
      phone:'',
      num:'',
      type:'1',
      visible:false,
      tableData:[],
      multipleSelection: [],
      stateStr:['未打印','已打印'],
      goodsStr:['未取货','已取货'],
      loading:false,
      returnType:true,
      returnTypes:[{label:'原路退款',value:1},{label:'现金退款',value:2}],
      returnTypesVal : 1,
    }
  },
  mounted(){
    this.getSelect();
  },
  computed:{
    ...mapGetters([
      'cinemaUid',
      'configData',
    ]),
    cash(){
      let num = 0;
      this.multipleSelection.map((item) => {
        item.saleGoodsPays.map( subItem => {
            num += subItem.payAmount;
        })
      })
      return num.toFixed(2);
    },
    moneys(){
      let obj = {};
      let arr = [];
      this.multipleSelection.map((item) => {
        item.saleGoodsPays.map( subItem => {
          if(!obj[subItem.payTypeName]){
              obj[subItem.payTypeName] = {
                name : subItem.payTypeName,
                money : 0
              }
          }
          obj[subItem.payTypeName].money += subItem.payAmount
        })
      })
      for(let key in obj){
        obj[key].money = obj[key].money.toFixed(2)
        arr.push(obj[key])
      }
      return arr
    },
  },
  

  methods: {
      rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

      },
      dialogOpen(type){
        this.type = type
        this.visible=true
      },
      beforeRefor(){
        for(let i = 0; i< this.multipleSelection.length; i++){
          let item = this.multipleSelection[i];
          if(item.cinemaTicketCode){
            let showTimeEnd = new Date(item.movieTickets[0].showTimeEnd).getTime();
            let nowTime = new Date().getTime();
            if(nowTime > showTimeEnd){
              this.returnType = false
              this.visible = true
              return 
            }
          }
        }
        this.jhPayJudge()
      },
      async refor(){
        // this.visible = false;
        // if(!this.multipleSelection.length) return this.$message.warning('请选择退货商品!');
        // if(!this.value) return this.$message.warning('请选择退货原因!');
        // if(!this.phone) return this.$message.warning('请输入登记手机号码!');
        this.loading = true
        const data = await refundRefundSaleBill({
          billCode:this.data.billCode,
          refundGoods: this.multipleSelection.map( item => { return { uid : item.uid} }),
          refundReason: this.value,
          refundPhone : this.phone,
          refundMoneyType : this.returnTypesVal,
        })
        // console.log(data);
        this.loading = false
        if(data.code != 200 ){
          return this.$message.error(data.msg);
        }

        this.$message.success(this.returnType ? data.msg : '退票申请已受理，请等待广电审核！');
        this.returnType = true
        this.printVoucherTicket(data.data)
        this.getDate()
      },
      async jhPayJudge(){
        this.visible = false;
        if(!this.multipleSelection.length) return this.$message.warning('请选择退货商品!');
        let tableDataStr = JSON.stringify(this.multipleSelection);
        if(!(tableDataStr.indexOf('聚合支付') > -1)||this.returnTypesVal == 2) return this.refor()
        const data = await getJhPayParam({
            cinameUid : this.data.cinemaUid,
            saleBillCode:this.data.billCode,
        })
        if(!data.data) return this.refor()
          const applicationType = data.data.silverOrderNumber ? '02' : '00'
          this.ws = new jhPay({
            open:(res) => {
                this.ws.send({
                  applicationType:applicationType, //消费类型  循序1
                  transactionType:'02',//交易类型标志 循序4
                  payAmount:data.data.payAmount+'',//JH支付金额转换 循序5
                  voucherNO:data.data.oldVoucherNO,
                  bankBillCode:data.data.silverOrderNumber,
                  transactionCode:data.data.oldTradeRef,
                  transactionDate:data.data.tradeDate,
                })
            },
            message:(res) => {
              if(res.returnCode != "00") return this.$message.error(res.misrepresentation)
              this.refor()
            },
            error:(res) => {
            }
          })
      },
      printVoucherTicket(data){ //打印退货凭证，
        const printingData = new printing()
        app.printTicket('bill_print',printingData.returnGoodsVoucher(data),this.configData,(res)=>{
          if(data.ticketVouchers && data.ticketVouchers.length){
            this.couponVoucherTicket(data.ticketVouchers,0) //打印票券
          }
          console.log(res)
        })
      },
      couponVoucherTicket(arr,i){
        if(arr.length == i) return
        let printingData = new printing()
        app.printTicket('bill_print',printingData.couponVoucher(arr[i]),this.configData,(res)=>{
            this.couponVoucherTicket(arr,++i)
          })
      },
      async getDate(){
        if(!this.key) return this.$message.warning('请扫描或输入影票编号/订单编号/取货码/票券编号！')
        this.multipleSelection = [];
        let data  = await refundFindSaleBillForRefund({code:this.key})
        
        if(data.code == 200){
          this.data = data.data;
          let arr = [];
          for(let i = 0; i < data.data.refundGoods.length; i++){
            let item = data.data.refundGoods[i];
            let priceArr = [];
            if(item){
              if(item.cinemaTicketCode){
                item.seatStr = item.seatName;
                item.TableId = item.cinemaTicketCode;
              }else{
                item.seatStr = item.saleNum+'份';
                item.TableId = item.goodsName;
              }
              // 11未取票；12未取货，21已打印22已取货30已退货
              switch(item.getStatus){
                case 11 : item.statusStr = '未取票';break;
                case 12 : item.statusStr = '未取货';break;
                case 21 : item.statusStr = '已打印';break;
                case 22 : item.statusStr = '已取货';break;
                case 30 : item.statusStr = '已退货';break;
              }
              item.saleGoodsPays.map( priceItem => {
                priceArr.push(`${priceItem.payTypeName}:${priceItem.payAmount}元`)
              })
              item.priceStr = priceArr.join('、')
              arr.push(item);
            }else{
              arr.push({})
            }
          }
          this.tableData = arr;
          if(data.data.netSaleFlag){
            this.multipleSelection = this.tableData 
          }
        }else{
          this.$message.error(data.msg);
        }
      },
      async getSelect(){
        let data = await csmReason()
        if(data.code == 200){
          for(let key in data.data){
            let obj = {
              value : data.data[key],
              label : data.data[key]
            }
            this.options.push(obj);
          }
        }else{
          this.$message.error(data.msg);
        }
      },
      checkboxChange(val,e,obj){
        if(obj.cinemaTicketCode){
          for(let i = 0 ; i < this.tableData.length; i++){
            let item = this.tableData[i]
            if(obj.uid == item.uid) continue
            if(val){
              if(obj.uid == item.relationGoodsUid){
                let flag = true
                for(let j = 0; j < this.multipleSelection.length; j++){
                  let subItem = this.multipleSelection[j];
                  if(subItem.uid == item.uid) flag = false;
                }
                if(flag && !(item.getStatus == 30 || this.data.netSaleFlag)) this.multipleSelection.push(item);
              }
            }else{
              this.multipleSelection.map((subItem,index) => {
                if(subItem.relationGoodsUid == obj.uid) this.multipleSelection.splice(index,1)
              })
            }
          }
        }
      },
      
      empty(){
        this.key = '';
        this.data = {};
        this.tableData = [];
        this.multipleSelection = [];
      },
    },
}
</script>

<style lang="scss" scoped>
.pageLayer{
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.pageTitle{
  font-size: $font-size16;
  @include bg_color($background-color-theme);
  padding: 1.3vh 3vw;
  color:$font-color-white
}
.contentLayer{
  padding: 0 2vw;
  flex: 1;
}
.queryDateForm{
  padding: 2vh 0;
  & > * {
    margin-right: 1vw;
    margin-bottom: 2vh;
  }
  .priceItem{
    
    margin-right: 3vw;
    span{
      font-size: 1.3vw;
    }
    b{
      
      font-size: 1.3vw;
    }
  }
  .returnMoneys{
    display: inline-block;
    font-size: 13px;
    color:#666;
    &>span{
      font-size: 12px;
      letter-spacing:2px;
      span{
        font-size: inherit;
        b{
          color:#FF8618;
          font-weight: 100;
        }
      }
      
    }
  }
}
.select{
  width: 30vw;
}
.retunTypeSelect{
  width: 15.6vw;
}
.fromInput{
  width: 32.3vw;
  display: inline-block;
}
.contentInfoLayer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
  .videoInfo{
    font-size: $font-size14;
    @include font_color($font-color-blue);
  }
}
.tableLayer{
  border:1px solid #D9E4FF;
  .tableBtn{
    border:1px solid;
    padding: 2px 5px;
    @include font-and-border-color()

  }
}
.tableFoot{
  display: flex;
  padding: 1.2vh 2vw;
  justify-content: flex-end;
  color:$font-color3;
  align-items: center;
  .paginationLayer{
    display: flex;
    font-size: $font-size12;
    align-items: center;
    .paginationInfo{
      font-size: 13px;
      margin-right: 2vw;
    }
    .paginaButtoms{
      &>span{
        display: inline-block;
        padding: 3px 15px;
        border:1px solid #BCBCBC ;
        color:#BCBCBC ;
        border-radius: 0.2vw;
        margin-left: 1.5vw;
      }
    }
  }
  .price{
    font-size: $font-size14;
    span{
      color:#FF8618;
    }
  }
}
.footButtomLayer{
  padding: 1vh 2vw;
  text-align: right;
}
.orderCell{
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  .text{
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .tableBtn{
    border: 1px solid;
    padding: 2px 5px;
    color: #3B74FF;
    border-color: #3B74FF;
    width: 40px;
  }
  .texthidden{
    position: absolute;
    transform: translate(1000%);
    white-space: nowrap;
  }
}
.iconshanchu{
  @include font_color($font-color-blue);
  font-size: 22px;
}
.priceItem {
    display: inline-block;
}
.orderLayer{
  h1{
    font-size: $font-size14;
    margin-bottom: 2.5vh;
  }
  ul{
    display: flex;
    flex-wrap: wrap;
    li{
      width: 33.3%;
      margin-bottom: 1.5vh;
      &:last-child{
        width: 100%;
        margin-bottom: 2.5vh;
      }
      span{
        color:$font-color6;
      }
      .tag{
        color:#3B74FF;
        border-color:#3B74FF;
      }
    }
  }
}
.tag{
  border: 1px solid #FF8618;
  color:#FF8618;
  font-size: 12px;
  border-radius: 10px;
  padding: 1px 3px;
  margin-left: 10px;
}
.retunGoodsInfo{
  display: flex;
  margin-top: 1.2vh;
  &>div{
    margin-right: 3vw;
    span{
      color:$font-color6;
    }
    b{
        color:#FF8618;
    }
  }
}
// .dialogContent{
  
//   .payByCard{
//     text-align: center;
//   }
//   .formlayer{
//     padding-right: 50px;
//   }
//   .iconfont{
//     @include font_color($font-color-blue);
//     font-size: 10vw;
//   }
  
// }
.dialogContent{
  padding: 0 15%;
  display: flex;
  span{
    display: block;
  }
  .iconLayer{
    
    .iconfont{
      @include font_color($font-color-blue);
      font-size: 2.4vw;
    }
  }
  
}
</style>





  