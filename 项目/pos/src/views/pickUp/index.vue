<template>
    <div class="pageLayer">
        <div class="title">取货</div>
        <div class="contentLayer">
            <div class="typeSelect">
                <div :class="type == 0 ? 'on': ''" @click="type=0">留座取票</div>
                <div :class="type == 1 ? 'on': ''" @click="type=1">取货</div>
            </div>
            <div class="inputLayer">
                <input type="text"    v-model="val" :placeholder="'请输入'+labels[type]">
                <div>{{labels[type]}}：</div>
            </div>
            <div class="ps">(含：网络、电话、手机APP等渠道购买的电影票或卖品)</div>
            <number-key-board ref="keyBoard" class="keyboard"  @keynumber="onkey"></number-key-board>
            <div class="submitBtn" @click="router">取货</div>  
        </div>
        <div class="foot">
            <el-button plain class="bdButton" @click="$router.go(-1)">取消</el-button>
            <el-button type="primary" @click="$router.push('appointment')">场次留座查询</el-button>
        </div>
    </div>
</template>
<script>
import numberKeyBoard from 'src/components/numberKeyBoard/index.vue'
import { posticketGetTicket } from 'src/http/apis'
import apps from 'src/http/app'
import { mapState} from 'vuex'
export default {
    components:{
        numberKeyBoard,
    },
    data(){
        return{
            state : false,
            type:0,
            labels:['手机号/会员卡号','取货码'],
            val:'',
            ticket:{"type":0,"width":315,"height":359,"print_method":0,"ticket_element":[{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":53,"y":18.700000000000003,"elementValue":"广州辰星影院","font_size":20,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":39,"y":49.50000000000001,"elementValue":"广东深圳招商银行激光杜比全景声厅","font_size":18,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":108,"y":82.5,"elementValue":"2019.12.31","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":160,"y":50.6,"elementValue":"21:00","font_size":18,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":94.60000000000001,"elementValue":"战狼2（普通/粤语）","font_size":18,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":134.20000000000002,"elementValue":"5排23号","font_size":16,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":121,"y":332.20000000000005,"elementValue":"成人票","font_size":14,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":134,"y":132,"elementValue":"25.00元","font_size":16,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":135,"y":165,"elementValue":"0.00元","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":32,"y":196.9,"elementValue":"2019.04.16 11:03:26","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":172,"y":195.8,"elementValue":"海","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":224.4,"elementValue":"000000000000","font_size":12,"font_black":0,"font_style":"0","show_modle":1},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":36,"y":364.1,"elementValue":"0001500005133635","font_size":12,"font_black":0,"font_style":"0","show_modle":2},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":258,"y":49.50000000000001,"elementValue":"广东深圳招商银行激光杜比全景声厅","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":272,"y":106.7,"elementValue":"2019.12.31","font_size":10,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":259,"y":144.10000000000002,"elementValue":"21:00","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":250,"y":185.9,"elementValue":"5排23号","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":275,"y":270.6,"elementValue":"25.00元","font_size":14,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":260,"y":228.8,"elementValue":"单人座","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":258,"y":71.5,"elementValue":"第1场","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":166,"y":334.40000000000003,"elementValue":"","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":40,"y":333.3,"elementValue":"现金","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":31,"y":165,"elementValue":"现场售票","font_size":14,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":167,"y":224.4,"elementValue":"0.00元","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":150,"y":278.3,"elementValue":"0.00元","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":264,"y":314.6,"elementValue":"00015000","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"movieTicketUid":"8c35ec31-cd1e-49d2-b570-728b646b1cd2","x":264,"y":327.8,"elementValue":"05133635","font_size":12,"font_black":0,"font_style":"0","show_modle":0},{"x":50,"y":132,"elementValue":"测试票","font_size":30,"font_black":1,"font_style":"12","show_modle":0}]}
        }
    },
    mounted(){
        console.log(this)
    },
    computed:{
        ...mapState({
            configData : state => state.config.configData
        })
    },
    methods: {
      onkey(item){
          this.val = item;
      },
      confirm(item){
          console.log(item);
          this.state = !this.state;
      },
      async router(){
        //   apps.printTicket('film_print',this.ticket,this.configData,(res) => {
        //       console.log(res)
        //   })
          if(!this.val) return this.$message.warning(`请输入${this.labels[this.type]}!`)
          if(this.type == 1){
              const data  = await posticketGetTicket({
                  getCode : this.val
              })
              if(!data.data) return this.$message.warning('此取货码无商品信息！')
          }else{
              return this.$message.warning('留座取票功能暂未开启！')
          }  
          this.$router.push({
              path: this.type == 0 ? 'ticketPick':'pickGoods',
              query: {
                  val : this.val
              }
          })
      }
    }
}
</script>
<style lang="scss" scoped>
.pageLayer{
    display: flex;
    flex-direction: column;
    height: 100vh;
}
.title{
    font-size: $font-size16;
    @include bg_color($background-color-theme);
    padding: 1.3vh 3vw;
    color:$font-color-white
}
.contentLayer{
    width: 32.3vw;
    margin: 8.9vh auto 0;
    flex:1;
    > div {
        margin-bottom: 2.6vh;
    }
}
.typeSelect{
    display: flex;
    border:1px solid $btn-background-color-theme;
    border-radius: 2px;
    overflow: hidden;
    div{
        flex:1;
        color:$font-color3;
        text-align: center;
        cursor: pointer;
        padding: 0.8vh 0;
        font-size: $font-size14;
    }
    .on{
        @include bg_color($btn-background-color-theme);
        color:$font-color-white
    }
}
.inputLayer{
    position: relative;
    input{
        display: block;
        width: 100%;
        padding: 1.3vh 2vw;
        box-sizing: border-box;
        font-size: $font-size14;
        border-radius: 2px;
        border:1px solid #BCBCBC;
    }
    div{
        position: absolute;
        left: -16.3vw;
        top: 0;
        font-size: $font-size16;
        width: 16.3vw;
        padding: 1vh 0;
        text-align: right;
    }
}
.ps{
    color:$font-color6;
    font-size: $font-size12;
}
.keyboard{
    font-size: 30px;
}
.submitBtn{
    font-size: $font-size14;
    @include bg_color($btn-background-color-theme);
    color:$font-color-white;
    text-align: center;
    padding: 1.3vh 0;
}
.foot{
    text-align: right;
    padding-right: 2vw;
    padding-bottom: 1vh;
}
.bdButton{
    @include bd-color-and-font-color()
}

</style>


