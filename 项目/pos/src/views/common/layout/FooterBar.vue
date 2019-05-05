<template>
    <div class="footer-bar">
         <img class="items logo" src="/static/imgs/logo.png" alt="ORISTAR">
         <span class="items">
             登录账号: <span class="person-name">{{"张经理"}}</span>
         </span>

         <ul class="lis-container">
             <li class="action-items" @click="toHome">
                 <i class="default-style iconfont iconpiaowushouye"></i>
                 <span class="default-style item-name">票务</span>
             </li>
             <li class="action-items" @click="toSeller">
                 <i class="default-style iconfont iconmaipin"></i>
                 <span class="default-style item-name">卖品</span>
             </li>
             <li class="action-items">
                 <i class="default-style iconfont iconhuiyuan"></i>
                 <span class="default-style item-name">会员</span>
             </li>
             <li class="action-items" @click="$router.push({name: 'pickUp'})">
                 <span class="default-style item-name">取票</span>
             </li>
             <li class="action-items" @click="$router.push({name: 'checkTicket'})">
                 <span class="default-style item-name">验票</span>
             </li>
              <li class="action-items" @click="$router.push({name: 'returnGoods'})">
                 <span class="default-style item-name">退货</span>
             </li>
              <li class="action-items" @click="$router.push({name: 'registerTicket'})">
                 <span class="default-style item-name">补登票</span>
             </li>
              <li class="action-items" @click="openOthersNav">
                 <span class="default-style item-name">其他</span>
             </li>
             <li class="action-items" @click="$router.push({name: 'setting'})">
                 <i class="default-style iconfont iconshezhi"></i>
                 <span class="default-style item-name">设置</span>
             </li>
             <li class="action-items">
                 <i class="default-style iconfont icontuichu" @click="quit"></i>
             </li>
         </ul>
    </div>
</template>

<script>
import {mapMutations} from 'vuex'
import {SHOW_MORE_NAV} from 'types'
import util from "../../../http/app";
export default {
    methods: {
        ...mapMutations([
            SHOW_MORE_NAV
        ]),

        toSeller() {
            this.$router.push({name: 'sellerIndex'})
        },

        toHome() {
            this.$router.push({name: 'toHome'})
        },

        openOthersNav() {
            this.SHOW_MORE_NAV()
        },
        //退出窗口
        quit(){
            util.quit()  
            // console.log("111")
        }
    }
}
</script>

<style lang="scss">
    .footer-bar {
        width: 100vw;
        height: 6.3vh;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 24px;

        .logo {
            width: 5vw;
        }

        .items {
            flex: 0 0 1;
            color: $font-color-white;
            font-size: $font-size12;

            .person-name {
                color: $font-color-white;
                font-size: $font-size12;
            }
        }

        .lis-container {
            display: flex;
            height: 100%;
            justify-content: space-between;

            .action-items {
                width: 7.8vw;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background: #436AC8;
                }

                .default-style {
                    font-size: $font-size12;
                    color: $font-color-white;
                }

                .item-name {
                    margin-left: 6px;
                }
            }
        }
    }
</style>