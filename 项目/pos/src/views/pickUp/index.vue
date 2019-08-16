<template>
    <div class="pageLayer">
        <div class="title">取货</div>
        <div class="contentLayer">
            <!-- <div class="typeSelect">
                <div :class="type == 0 ? 'on': ''" @click="type=0">留座取票</div>
                <div :class="type == 1 ? 'on': ''" @click="type=1">取货</div>
            </div> -->
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
            <!-- <el-button type="primary" @click="$router.push('appointment')">场次留座查询</el-button> -->
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
            type:1,
            labels:['手机号/会员卡号','取货码'],
            val:'',
            
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
          if(!this.val) return this.$message.warning(`请输入${this.labels[this.type]}!`)
          if(!/^\d+$/.test(this.val)) return this.$message.warning(`请输入正确的${this.labels[this.type]}!`)
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


