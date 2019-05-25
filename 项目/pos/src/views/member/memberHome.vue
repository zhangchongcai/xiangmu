<template>
  <div class="_member-home">
    <div class="member-home-title">会员服务</div>
    <ul class="merber-home-content" v-if="menuDataFilter">
      <li v-for="(item,index) of menuDataFilter" :key="index" class="member-home-item" :class="item.disabled?'is-disabled hover-disabled':''"
        @click="handleGoDetail(item.routePath)"
        >
        <span><img :src="item.iconPath" alt="icon" class="menu-icon"></span>
        <span class="menu-title">{{item.name}}</span>
      </li>
    </ul>
    <div class="foot-buttom-layer">
      <el-button size="medium" @click="$router.push({path:'/home'})">返回</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuData: [
        {
          iconPath: "../../../static/memberImage/kaika.png",
          name: "开卡",
          routePath: "/member/memberApplyCard",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/xiugaiziliao.png",
          name: "修改资料",
          routePath: "/member/ModifyData",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/xiugaimima.png",
          name: "修改密码",
          routePath: "/member/memberChangePsd",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/chongzhimima.png",
          name: "重置密码",
          routePath: "/member/resetPsd",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/buka.png",
          name: "补卡",
          routePath: "/member/repairCard",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/shengjihuanka.png",
          name: "升级换卡",
          routePath: "",
          disabled: true,
          show:false
        },
        {
          iconPath: "../../../static/memberImage/guashijiegua.png",
          name: "挂失/解除挂失",
          routePath: "/member/lossCard",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/huiyuanzhuxiao.png",
          name: "会员注销",
          routePath: "/member/cancellationCard",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/chongzhi.png",
          name: "充值",
          routePath: "/member/memberRecharge",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/chongxiao.png",
          name: "冲销",
          routePath: "/member/sterilisation",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/chaxun.png",
          name: "查询",
          routePath: "/member/queryDetails",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/jifenduihuan.png",
          name: "积分兑换",
          routePath: "",
          disabled: true,
          show:false
        },
        {
          iconPath: "../../../static/memberImage/yuejiezhuan.png",
          name: "余额结转",
          routePath: "/member/turnBalance",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/huiyuankajihuo.png",
          name: "会员卡解冻",
          routePath: "/member/memberThaw",
          disabled: false,
          show:true
        },
        {
          iconPath: "../../../static/memberImage/shoujihaokaika.png",
          name: "手机号开卡",
          routePath: "",
          disabled: true,
          show:false
        }
      ]
    };
  },
  computed:{
    menuDataFilter:function(){
      return this.menuData.filter(item=>{
        return item.show;
      })
    }
  },
   mounted(){
     if(!sessionStorage['payParams']){
      sessionStorage['payParams'] = JSON.stringify({
        channelName:'柜台',
        cinemaName:localStorage['cinemaName'],
        operatorNo:localStorage['userUid'],
        posNo:localStorage['tenantId'],
        channelId:'0'
      })
    }
  },
  methods: {
    handleGoDetail(routePath) {
      this.$router.push({
        path: routePath
      });
    }
  }
};
</script>

<style lang="scss">
._member-home {
  .merber-home-content {
    padding: 6.5vh 1.4vw 6.5vh 4.3vw;
    display: flex;
    flex-wrap: wrap;
    .member-home-item {
      width: 15.6vw;
      height: 10.4vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-right: 2.9vw;
      margin-bottom: 3.9vh;
      text-align: center;
      border: 1px solid #a7b8e4;
      border-radius: 2px;
      cursor: pointer;
      .menu-icon {
        // width: 2.9vw;
        // height: 2.9vh;
      }
      .menu-title {
        color: #333;
      }
    }
    .member-home-item:hover {
      border: 1px solid #3b74ff;
      .menu-title {
        color: #3b74ff;
      }
    }
    .is-disabled {
      cursor: not-allowed;
      background: #B2B2B2;
    }
    .is-disabled:hover {
      border: 1px solid #a7b8e4;
      .menu-title {
        color: #333;
      }
    }
  }
}
</style>