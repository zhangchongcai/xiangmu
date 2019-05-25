<template>
    <div class="bar-warp">
        <div class="seach-menu bl">
            <el-input v-model="seachAddition" placeholder="请输入入店码、条形码、编号"></el-input>
            <el-button @click="search">查询</el-button>
        </div>
        <div class="pay-menu bl">
            <ul v-if="allPayWays.length">
                    <li v-for="(item, index) in allPayWays.slice(0, 5)" :key="'pay' + index" @click="showPayPanel(item)">
                        {{item.payTypeName}}
                    </li>
                <li v-if="allPayWays.length > 5" @click="showMorePayMethods">更多<span class="el-icon-arrow-down" style="margin-left:.2vw"></span></li>
            </ul>
        </div>
        <ul class="detail-menu bl" @click="hanlderDetail">
            <li>
                <span>订单总额:</span>
                <span>￥</span>
                <span class="money" id="origin">{{cartData.notPayAmount?cartData.notPayAmount:0}}</span>
            </li>
            <li>
                <span>明细</span>
                <span :class="['el-icon-arrow-down',cartIsshow?'cartIsshow':'']" style="margin-left:5px;font-size:1.2vw"></span>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import {PAY_DIALOG_TRIGER, MORE_PAY_TRIGER, PAY_METHOD_TRIGER} from 'types'
import util from 'src/http/app'
import FormatterData from  'src/http/voucherData'
export default {
    data() {
        return {
            seachAddition:null,
            
            cartIsshow:false,
        }
    },
    computed: {
      ...mapGetters([
          'allPayWays',
          'seatSelection',
          'cartData',
          'configData'
      ])
    },
    methods: {
        ...mapMutations({
            MORE_PAY_TRIGER, //显示隐藏更多支付
            PAY_DIALOG_TRIGER, //显示隐藏支付弹框
            PAY_METHOD_TRIGER, //修改支付方式
        }),
        showPayPanel(item) {
           if(this.seatSelection.length) {
              this.PAY_METHOD_TRIGER(item)
              this.PAY_DIALOG_TRIGER()
           }else {
               this.$message({
                message: '请您选择座位哦！',
                type: 'warning'
                });
           }
        },
        showMorePayMethods() {
             this.MORE_PAY_TRIGER()
        },
        hanlderDetail() {
            this.$emit('handerDetail')
            this.cartIsshow = !this.cartIsshow
        },
        search() {
            // let item = {"type":0,"width":319,"height":319,"print_method":1,"ticketUid":null,"ticket_element":[{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":21,"y":21,"elementValue":"人类研究所影院","font_size":19,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":133,"y":32,"elementValue":"123456","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":21,"y":57,"elementValue":"4号厅","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":165,"y":62,"elementValue":"9排1号","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":24,"y":89,"elementValue":"死侍2：我爱我家（数字）","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":214,"y":210,"elementValue":"2019.04.30","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":25,"y":123,"elementValue":"08:15","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":166,"y":242,"elementValue":"0","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":22,"y":159,"elementValue":"2019.04.22 09:31:37","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":140,"y":202,"elementValue":"1120138051843104768","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":33,"y":185,"elementValue":"0","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":108,"y":117,"elementValue":"11201380518431047","font_size":12,"font_black":0,"font_style":"0","show_modle":2},{"movieTicketUid":"0abf013e-5eb1-4f64-8257-ec3d0e433cb6","x":16,"y":207,"elementValue":"柜台","font_size":12,"font_black":0,"font_style":"0","show_modle":1}]}            
            // let test = {"type":0,"width":315,"height":359,"print_method":0,"ticket_element":[{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":53,"y":18.700000000000003,"elementValue":"广州辰星影院","font_size":20,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":39,"y":49.50000000000001,"elementValue":"广东深圳招商银行激光杜比全景声厅","font_size":18,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":108,"y":82.5,"elementValue":"2019.12.31","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":160,"y":50.6,"elementValue":"21:00","font_size":18,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":94.60000000000001,"elementValue":"战狼2（普通/粤语）","font_size":18,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":134.20000000000002,"elementValue":"5排23号","font_size":16,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":121,"y":332.20000000000005,"elementValue":"成人票","font_size":14,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":134,"y":132,"elementValue":"25.00元","font_size":16,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":135,"y":165,"elementValue":"0.00元","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":32,"y":196.9,"elementValue":"2019.04.16 11:03:26","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":172,"y":195.8,"elementValue":"海","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":224.4,"elementValue":"000000000000","font_size":12,"font_black":0,"font_style":"0","show_modle":1},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":36,"y":364.1,"elementValue":"0001500005133635","font_size":12,"font_black":0,"font_style":"0","show_modle":2},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":258,"y":49.50000000000001,"elementValue":"广东深圳招商银行激光杜比全景声厅","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":272,"y":106.7,"elementValue":"2019.12.31","font_size":10,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":259,"y":144.10000000000002,"elementValue":"21:00","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":250,"y":185.9,"elementValue":"5排23号","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":275,"y":270.6,"elementValue":"25.00元","font_size":14,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":260,"y":228.8,"elementValue":"单人座","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":258,"y":71.5,"elementValue":"第1场","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":166,"y":334.40000000000003,"elementValue":"","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":40,"y":333.3,"elementValue":"现金","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":165,"elementValue":"现场售票","font_size":14,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":167,"y":224.4,"elementValue":"0.00元","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":150,"y":278.3,"elementValue":"0.00元","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":264,"y":314.6,"elementValue":"00015000","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":264,"y":327.8,"elementValue":"05133635","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"x":50,"y":132,"elementValue":"测试票","font_size":30,"font_black":1,"font_style":"12","show_modle":1}]}
            // let testVoucher = {"width":200,"height":300,"ticket_element":[{"elementValue":"欢迎光临","x":60,"y":0,"font_size":12,"font_black":0,"show_modle":0},{"elementValue":"广州辰星影院数字影院","x":20,"y":13,"font_size":12,"font_black":0,"show_modle":0},{"elementValue":"销售交易凭证 ","x":40,"y":26,"font_size":12,"font_black":0,"show_modle":0},{"elementValue":"------------------------------------","x":5,"y":34,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"1.战狼2-普通/粤语哈哈哈哈哈哈哈","x":5,"y":42,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"1 x 25.00","x":115,"y":42,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"2.0402套餐","x":5,"y":54,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"1 x 40.00","x":115,"y":54,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"------------------------------------","x":5,"y":62,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"总件数：2","x":5,"y":70,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"应收： 65.00","x":90,"y":70,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"实收： 65.00","x":90,"y":82,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"------------------------------------","x":5,"y":90,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"支付明细：","x":5,"y":98,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"现金：65.00","x":25,"y":110,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"------------------------------------","x":5,"y":118,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"交易流水号：","x":5,"y":126,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"00011000000190418000504","x":15,"y":138,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"交易时间：2019-04-18 14:53:59","x":5,"y":150,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"终端：1000000","x":5,"y":162,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"收银员：海","x":5,"y":174,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"------------------------------------","x":5,"y":182,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"扫码抽奖赢iphonex","x":5,"y":194,"font_size":23,"font_black":0,"show_modle":0},{"elementValue":"扫码抽奖赢iphonex扫码抽奖赢iphonex扫","x":5,"y":221,"font_size":11,"font_black":0,"show_modle":0},{"elementValue":"码抽奖赢xxxxx","x":5,"y":233,"font_size":11,"font_black":0,"show_modle":0}]}
            let trade_data = {"uid_voucher":null,"voucherType":null,"cashier":"超级管理员","cinemaName":"人类研究所影院","returnAmount":0,"payPrice":90,"totalCount":3,"totalPrice":90,"tradeNo":"DTe4c4a-a95","tradeTime":"2019-04-26 18:09:51","terminalCode":"terminalCode","cinemaPrice":0,"arr_goods":[{"id":919,"uid":"348a1877-f989-442c-a8aa-7b036760d7bf","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","goodsName":"死侍2：我爱我家（数字）【7行，2列】","goodsType":4,"originalPrice":30,"salePrice":30,"saleNum":1,"rejectNum":0,"relationGoodsUid":"0","getFlag":0,"getTime":null,"delFlag":0,"createTime":"2019-04-26 18:09:46","updateTime":"2019-04-26 18:09:41"},{"id":920,"uid":"d15f50f0-8142-43a2-b823-cb5cf89b73a6","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","goodsName":"死侍2：我爱我家（数字）【7行，3列】","goodsType":4,"originalPrice":30,"salePrice":30,"saleNum":1,"rejectNum":0,"relationGoodsUid":"0","getFlag":0,"getTime":null,"delFlag":0,"createTime":"2019-04-26 18:09:46","updateTime":"2019-04-26 18:09:42"},{"id":921,"uid":"9a7c653c-d16a-41ec-971b-04bb438a0ef9","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","goodsName":"死侍2：我爱我家（数字）【7行，1列】","goodsType":4,"originalPrice":30,"salePrice":30,"saleNum":1,"rejectNum":0,"relationGoodsUid":"0","getFlag":0,"getTime":null,"delFlag":0,"createTime":"2019-04-26 18:09:46","updateTime":"2019-04-26 18:09:42"}],"arr_payment":[{"id":659,"uid":"8c60ffde-3037-49d3-9252-77b3721c64ec","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","payNo":"ab2e3164-10c4-48b2-b216-9166aa7695a5","payTypeCode":"XRMB","payTypeName":"现金支付","payAmount":90,"returnAmount":0,"payTime":null,"rejectAmount":null,"returnCode":null,"opType":1,"status":1,"delFalg":0,"createTime":"2019-04-26 18:09:54","updateTime":"2019-04-26 18:09:50"}]}            
            let get_trade_data = {"uid_voucher":null,"voucherType":null,"cashier":"超级管理员","cinemaName":"人类研究所影院","get_code":null,"terminalCode":"terminalCode","totalCount":3,"totalPrice":90,"tradeNo":"DTe4c4a-a95","tradeTime":"2019-04-26 18:09:51","arr_goods":[{"id":919,"uid":"348a1877-f989-442c-a8aa-7b036760d7bf","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","goodsName":"死侍2：我爱我家（数字）【7行，2列】","goodsType":4,"originalPrice":30,"salePrice":30,"saleNum":1,"rejectNum":0,"relationGoodsUid":"0","getFlag":0,"getTime":null,"delFlag":0,"createTime":"2019-04-26 18:09:46","updateTime":"2019-04-26 18:09:41"},{"id":920,"uid":"d15f50f0-8142-43a2-b823-cb5cf89b73a6","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","goodsName":"死侍2：我爱我家（数字）【7行，3列】","goodsType":4,"originalPrice":30,"salePrice":30,"saleNum":1,"rejectNum":0,"relationGoodsUid":"0","getFlag":0,"getTime":null,"delFlag":0,"createTime":"2019-04-26 18:09:46","updateTime":"2019-04-26 18:09:42"},{"id":921,"uid":"9a7c653c-d16a-41ec-971b-04bb438a0ef9","tenantId":"TID000000","cinemaUid":"111111","saleBillUid":"758ec3f4-b5f3-4d6f-adcf-1b089c55e41c","goodsName":"死侍2：我爱我家（数字）【7行，1列】","goodsType":4,"originalPrice":30,"salePrice":30,"saleNum":1,"rejectNum":0,"relationGoodsUid":"0","getFlag":0,"getTime":null,"delFlag":0,"createTime":"2019-04-26 18:09:46","updateTime":"2019-04-26 18:09:42"}]}
                // 影票打印测试
                // util.printTicket('film_print',item,this.configData,args=> {
                //     console.log('成功的回调',args)
                // })
                //凭证打印测试
                    console.log(FormatterData.trade_print('1',trade_data))
                let data = FormatterData.trade_print('1',trade_data)
                util.printTicket('bill_print',data,this.configData,args=> {
                    console.log('成功的回调',args)
                }) 
        }
    },
}   
</script>

<style lang="scss">
    .bar-warp{
        position:fixed;
        bottom:8.9vh;
        right: 0;
        left: 0;
        height: 5.2vh;
        line-height: 5.2vh;
        display: flex;
        z-index: 500;
        background: #fff;
        .bl{
            display: inline-block;
            vertical-align: middle;
            border-radius: 2px;
        }
        .seach-menu{
            @include bg_seachPay_color($bg-searchPaydetalTabColor);
            box-sizing:border-box; 
            height: 100%;
            width: 30%;
            padding: 0 1.6vw;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            .el-input{
                display: inline-block;
                flex: 1;                
                line-height: 28px;
                font-size: $font-size12;
                .el-input__inner{
                    height: 3.6vh;
                }
            }
            .el-button{
                height: 3.6vh;
                padding:0 0.8vw;
                line-height: 3.6vh;
                margin-left: 5%;
                font-size: $font-size12;
                span{
                    font-size: $font-size12;
                }
            }
        }
        .pay-menu{
            box-sizing: border-box;
            height: 100%;
            flex: 1;
            margin:0 2px;
            ul{
                overflow: hidden;
                font-size: 0px;
                height: 100%;
                width: 100%;
                display: flex;
                li{
                    @include bg_seachPay_color($bg-searchPaydetalTabColor);
                    @include font_color($font-color-searchPaydetalTabColor);
                    font-size: $font-size12;
                    border-radius: 2%;
                    height: 100%;
                    flex:1;
                    cursor: pointer;
                    text-align: center;
                    display: inline-block;
                    &{
                        margin-left: 2px;
                    }
                    &:first-child{
                        margin-left: 0px;
                    }
                    &:hover{
                        @include bg_seachPay_color($bg-searchPaydetalTabColor);
                    }
                }
            }
        }
        .detail-menu {
            display: flex;
            box-sizing: border-box;
            float: right;
            font-size: $font-size12;
            width: 21%;  
            text-align: center;
            color: #ffffff;
            border: #3b74ff 1px solid;
            @include btn-background-color-theme($btn-background-color-theme);
            border-radius: 2px;
            cursor: pointer;
            padding:0px 1.8vw;
            li{
                display: inline-block;
                text-align: left;
            }
            li:first-child{
                flex:1.2;
                span{
                    display: inline-block;
                    height: 100%;
                    font-size: $font-size12;
                }
                .money{
                    font-size: $font-size20;
                }
            }
            li:last-child{
                span{
                font-size: $font-size12;
                }
            }
            .cartIsshow{
                transform: rotate(180deg)
            }
        }
        
    }
</style>
