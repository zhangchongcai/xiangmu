<template>
  <div class="innerlayer">
    <div class="content">
      <ul class="items">
        <li class="item" v-for="(item,index) in icons" :key="index">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="'#'+item.icon"></use>
          </svg>
          <p>{{item.name}}</p>
        </li>
      </ul>
    </div>
    <div class="footButtomLayer">
      <el-button size="medium" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>
<script>
// import { testApi } from 'http/apis'
export default {
 
  data(){
    return{
        icons:[
          {
            icon:'iconkaiqia',
            name:'开卡',
            path:'',
          },
          {
            icon:'iconxiugaiziliao',
            name:'修改资料',
            path:'',
          },
          {
            icon:'iconxiugaimima',
            name:'修改密码',
            path:'',
          },
          {
            icon:'iconzhongzhimima',
            name:'重置密码',
            path:'',
          },
          {
            icon:'iconbuqia',
            name:'补卡',
            path:'',
          },
          {
            icon:'iconshengjihuanqia',
            name:'升级换卡',
            path:'',
          },
          {
            icon:'iconguashijiegua',
            name:'挂失/解除挂失',
            path:'',
          },
          {
            icon:'iconhuiyuanzhuxiao',
            name:'会员注销',
            path:'',
          },
          {
            icon:'iconchongzhi',
            name:'充值',
            path:'',
          },
          {
            icon:'iconchongxiao',
            name:'冲销',
            path:'',
          },
          {
            icon:'iconchaxun',
            name:'查询',
            path:'',
          },
          {
            icon:'iconjifenduihuan',
            name:'积分兑换',
            path:'',
          },
          {
            icon:'iconyuejiezhuan',
            name:'余额结转',
            path:'',
          },
          {
            icon:'iconhuiyuanqiajihuo',
            name:'会员卡激活',
            path:'',
          },
          {
            icon:'iconshoujihaokaiqia',
            name:'手机号开卡',
            path:'',
          },
        ]
    }
  },
  mounted(){
  },
  methods:{
    
  }
}
</script>

<style lang="scss" scoped>
.innerlayer{
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  .content{
    .items{
      padding: 0 4.1vw;
      .item{
        display: inline-block;
        width: 15vw;
        border:1px solid #A7B8E4;
        border-radius: 2px;
        text-align: center;
        padding: 1.8vh 0 1.5vh;
        margin-right: 2.9vw;
        margin-top: 3.9vh;
        &:nth-child(5n){
          margin-right: 0;
        }
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        &:active{
          @include font-and-border-color();
          p{
            @include font-and-border-color();
          }
        }
        .icon{
          font-size: 3vw;
        }
        p{
          font-size: 1.4vw;
          color:#333;
          margin-top: 0.5vh;
        }
      }
    }
  }
}
.content{
  flex: 1
}
.footButtomLayer{
  padding: 1.3vh 0;
  text-align: right;
}
</style>


 

