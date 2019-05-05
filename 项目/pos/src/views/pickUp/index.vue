<template>
    <div class="pageLayer">
        <div class="title">取货</div>
        <div class="contentLayer">
            <div class="typeSelect">
                <div :class="type == 0 ? 'on': ''" @click="type=0">留座取票</div>
                <div :class="type == 1 ? 'on': ''" @click="type=1">取货</div>
            </div>
            <div class="inputLayer">
                <input type="text"    v-model="val" placeholder="请输入手机号/会员卡号">
                <div>{{labels[type]}}</div>
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
export default {
    components:{
        numberKeyBoard,
    },
    data(){
        return{
            state : false,
            type:0,
            labels:['手机号/会员卡号：','取货码：'],
            val:'',

        }
    },
    mounted(){
        console.log(this)
    },
    methods: {
      onkey(item){
          this.val = item;
      },
      confirm(item){
          console.log(item);
          this.state = !this.state;
      },
      router(){
          this.$router.push({
              path: this.type ? 'ticketPick':'pickGoods',
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


