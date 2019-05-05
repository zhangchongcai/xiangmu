<template>
  <div>
    <div class="pageTitle">退货</div>
    <div class="contentLayer">
      <div class="queryDateForm">
        <div class="fromInput" :style="{width:'34.5vw'}">
          <el-input  type="text" v-model="key" placeholder="请扫描或输入影票编号/订单编号/取货码/票券编号" size="medium" width="34.5vw"></el-input>
        </div>
        <el-button size="medium" type="primary" @click="getDate">查询</el-button>
        <el-button size="medium" @click="dialogOpen('2')">清空</el-button>
        <el-button size="medium"  @click="dialogOpen('1')">按影片场次退票</el-button>
      </div>
      <div class="orderLayer">
        <h1>订单信息</h1>
        <ul>
          <li><span>订单编号：</span>{{data.billCode}}</li>
          <li><span>终端编号：</span>{{data.terminalCode}}</li>
          <li><span>收银员：</span>{{data.userName}}</li>
          <li><span>交易影院：</span>{{data.cinemaName}}</li>
          <li><span>交易时间：</span>{{data.payedTime}}</li>
          <li><span>总金额：</span>{{data.payAmount}}元</li>
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
               <el-checkbox @change="checkboxChange(...arguments,scope.row)" v-if="scope.row.TableId" :disabled="scope.row.getStatus ==30 ? true : false" v-model="multipleSelection" :label="scope.row" >{{ }}</el-checkbox>
              </div>
            </template>
          </el-table-column>
          <div slot="append" class="tableFoot">
            <div class="paginationLayer">
              <div class="paginationInfo">共10条记录 1/2</div>
              <div class="paginaButtoms">
                <!-- <span class="previous">&lt;</span>
                <span class="next">&gt;</span> -->
                <el-button size="mini" icon="el-icon-arrow-left"></el-button>
                <el-button size="mini" icon="el-icon-arrow-right"></el-button>
              </div>
            </div>
          </div>
        </el-table>
      </div>
      <div class="retunGoodsInfo">
        <div><span>应退金额：</span>现金<b> {{cash}}元</b> </div> 
        <!-- <div><span>应退票券：</span>电子兑换券1张，纸质优惠券1张</div>银联<b>180.00元</b> -->
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
      <div class="footButtomLayer">
        <el-button size="medium" @click="$router.go(-1)">取消</el-button>
        <el-button size="medium" type="primary" @click="refor" >退款</el-button>
      </div>
    </div>
    <el-dialog title="操作提示" :visible.sync="visible" width="50%">
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
    </el-dialog>
  </div>
</template>

<script>
import 'assets/css/table.scss'
import vSelect from 'components/select/index'
import labelInput from 'components/labelInput/index'
import dateInput from 'components/dateInput/index'
import { refundFindSaleBillForRefund,csmReason,refundRefundSaleBill } from 'http/apis'
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
      key:'DTdabd9-10b',
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
      goodsStr:['未取货','已取货']

    }
  },
  mounted(){
    this.getSelect();
  },
  computed:{
    cash(){
      let num = 0;
      this.multipleSelection.map((item) => {
        item.saleGoodsPays.map( subItem => {
          if(subItem.payTypeCode == 'XRMB'){
            num += subItem.payAmount;
          }
        })
      })
      return num;
    }
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
      async refor(){
        if(!this.multipleSelection.length) return this.$message.warning('请选择退货商品!');
        if(!this.value) return this.$message.warning('请选择退货原因!');
        if(!this.phone) return this.$message.warning('请输入登记手机号码!');
        const data = await refundRefundSaleBill({
          billCode:this.data.billCode,
          refundGoods: this.multipleSelection.map( item => { return { uid : item.uid} }),
          refundReason: this.value,
          refundPhone : this.phone
        })
        console.log(data);
        if(data.code != 200 ){
          return this.$message.error(data.msg);
        }
        this.$message.success(data.msg);
        
        this.getDate()
      },
      async getDate(){
        this.multipleSelection = [];
        let data  = await refundFindSaleBillForRefund({code:this.key})
        
        if(data.code == 200){
          this.data = data.data;
          let arr = [];
          for(let i = 0; i < 8; i++){
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
                if(flag) this.multipleSelection.push(item);
              }
            }else{
              this.multipleSelection.map((subItem,index) => {
                if(subItem.relationGoodsUid == obj.uid) this.multipleSelection.splice(index,1)
              })
            }
          }
        }
      }
    },
}
</script>

<style lang="scss" scoped>
.pageTitle{
  font-size: $font-size16;
  @include bg_color($background-color-theme);
  padding: 1.3vh 3vw;
  color:$font-color-white
}
.contentLayer{
  padding: 0 2vw;
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
      color:#FF8618;
      font-size: 1.3vw;
    }
  }
}
.select{
  width: 30vw;
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
  margin-top: 1vh;
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
.dialogContent{
  
  .payByCard{
    text-align: center;
  }
  .formlayer{
    padding-right: 50px;
  }
  .iconfont{
    @include font_color($font-color-blue);
    font-size: 10vw;
  }
  
}
</style>





  