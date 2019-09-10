<template>
    <div class="print-check">
        <main class="main">
            <div class="pageTitle">重打印凭证</div>
            <div class="row-item">
                <p class="title">基本信息</p>
                <ul>
                    <li><span class="name">订单编号：</span>{{data.billCode}}</li>
                    <li><span class="name">终端编号：</span>{{data.terminalCode}}</li>
                    <li><span class="name">收银员：</span>{{data.cashier}}</li>
                </ul>
                <ul>
                    <li><span class="name">交易类型：</span>{{billType[data.billType]}}</li>
                    <li><span class="name">交易时间：</span>{{data.transactionDate}}</li>
                    <li><span class="name">总金额：</span>{{data.totalAmount}}元</li>
                </ul>
            </div>
            <div class="row-item">
                <p class="title">商品信息</p>
                <div class="tableLayer" >
                <el-table
                ref="multipleTable"
                :data="list"
                tooltip-effect="dark"
                style="width: 100%"
                header-cell-class-name="posTableHead"
                :row-class-name="rowClassName"
                >
                <el-table-column prop="goodsName" label="商品名称" ></el-table-column>
                <el-table-column prop="salePrice" label="单价（元）" ></el-table-column>
                <el-table-column prop="saleNum" label="数量" ></el-table-column>
                </el-table>
            </div>
            </div>
            <div class="row-item">
                <p class="title">支付信息</p>
                <div class="itemDiv" v-for="(item,index) in priceArr" :key="index"><span class="name">{{item.key}}：</span>{{item.value}}元</div>
            </div>
        </main>
        <footer class="footer">
            <el-button type="primary" plain @click="back">取消</el-button>
            <el-button type="primary"  @click="print" >重打印</el-button>
        </footer>
    </div>
</template>
<script>
import voucherData from 'src/http/voucherData'
import  app  from 'src/http/app'
import {saleBillSearchReprintDetail} from 'http/apis'
import {mapState} from 'vuex';
export default {
    data() {
        return{
            data:{},
            list:[],
            billType: {
                1: "消费",
                2: "会员服务",
                3: "赠送",
                4: "报损",
                5: "留座",
                6: "影票补登",
                21: "会员开卡",
                22: "会员充值",
                23: "会员补卡",
                24: "会员注销",
                25: "升级换卡",
                26: "充值冲销",
                27: "会员激活",
                28: "余额结转"
            },
            priceArr:[],
        }
    },
    computed:{
        ...mapState({
        configData : state => state.config.configData
        })
    },
    methods: {
        back() {
            this.$router.go(-1)
        },
        rowClassName({row, rowIndex}){
        let className = rowIndex%2 ? 'posRowOdd' : 'posRowEven';
        return className;

        },
        print(){
            this.printVoucherTicket(this.data)
        },
        printVoucherTicket(data,type=1){ //打印凭证，
            if(!data) return
            let printData  =  voucherData.trade_print(type,voucherData.type1Data(data))
            return console.log(printData)
            util.printTicket('bill_print',printData,this.configData,(res)=>{
                
                if(this.configData.sale_goods_print_type != 1){ //此处判断是否打印取货凭证
                    if(type ==2 ) return //防止死循环，打印取货凭证 传多一个type为2
                    this.printVoucherTicket(data,2)
                }
            })
        },
    },
    async mounted(){
        let billUid = this.$route.query.billUid;
        const data = await saleBillSearchReprintDetail({
            billUid
        })
        this.data = data.data;
        this.list = data.data.goodsEntityList
        for (let [key, value] of Object.entries(data.data.payedMap)) {
            this.priceArr.push({
                key,
                value
            })
        }
        console.log(data)
    }
}
</script>
<style lang="scss">
.print-check{
    display: flex;
    flex-direction: column;
    height: 100vh;
    .main{
        flex:1
    }
    .pageTitle{
      font-size: $font-size16;
      @include bg_color($background-color-theme);
      padding: 1.3vh 2%;
      color:$font-color-white
    }
    .row-item{
        padding-left: 2%;
        padding-right: 2%;
        .title{
            font-size: $font-size14;
            color: #333333;
            font-weight: 550;
            padding: 1vh;
        }
        .itemDiv{
            padding:0.5vh 1vh 0.5vh 1vh;
        }
        ul{
            display: flex;
            margin: 1vw;
            li{
                flex: 1;
                font-size: $font-size12;
                .name{
                    color: #666666;
                    font-size: $font-size12;
                }
            }
        }
    }
    .footer{
        text-align: right;
        height: 7.2vh;
        padding-right: 2%;
    }
    .tableLayer{
  border:1px solid #D9E4FF;
  .tableBtn{
    border:1px solid;
    padding: 2px 5px;
    @include font-and-border-color()

  }
}
}
</style>


