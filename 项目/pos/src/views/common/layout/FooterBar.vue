<template>
<div>
    <div class="footer-bar">
         <img class="items logo" src="/static/imgs/logo.png" alt="ORISTAR">
        <span class="items">
             登录账号: <span class="person-name">{{userName}}</span>
         </span>
        <ul class="lis-container">
            <li class="action-items"
                :label="item.menuName"
                v-for="(item,id) in menuList"
                :key="id"
            >
                <i class="default-style iconfont iconpiaowushouye" v-if="item.seq==1||item.seq==2"></i>
                <a href="javascript:void(0);" @click="$router.push(item.resUrl)" class="default-style item-name">{{item.menuName}}</a>
            </li>
            <li class="action-items" @click="openOthersNav" v-show="otherFlag">
                <span class="default-style item-name">其他</span>
            </li>
            <li class="action-items" @click="$router.push({name: 'setting'})">
                <i class="default-style iconfont iconshezhi"></i>
                <span class="default-style item-name">设置</span>
            </li>
            <li class="action-items">
                <i class="default-style iconfont icontuichu" @click="dialogVisible=true"></i>
            </li>
        </ul>
         <!--<ul class="lis-container">-->
             <!--<li class="action-items" @click="toHome">-->
                 <!--<i class="default-style iconfont iconpiaowushouye"></i>-->
                 <!--<span class="default-style item-name">票务</span>-->
             <!--</li>-->
             <!--<li class="action-items" @click="toSeller">-->
                 <!--<i class="default-style iconfont iconmaipin"></i>-->
                 <!--<span class="default-style item-name">卖品</span>-->
             <!--</li>-->
             <!--<li class="action-items"  @click="$router.push({name: 'memberHome'})">-->
                 <!--<i class="default-style iconfont iconhuiyuan"></i>-->
                 <!--<span class="default-style item-name">会员</span>-->
             <!--</li>-->
             <!--<li class="action-items" @click="$router.push({name: 'pickUp'})">-->
                 <!--<span class="default-style item-name">取票</span>-->
             <!--</li>-->
             <!--<li class="action-items" @click="$router.push({name: 'checkTicket'})">-->
                 <!--<span class="default-style item-name">验票</span>-->
             <!--</li>-->
              <!--<li class="action-items" @click="$router.push({name: 'returnGoods'})">-->
                 <!--<span class="default-style item-name">退货</span>-->
             <!--</li>-->
              <!--<li class="action-items" @click="$router.push({name: 'registerTicket'})">-->
                 <!--<span class="default-style item-name">补登票</span>-->
             <!--</li>-->
              <!--<li class="action-items" @click="openOthersNav">-->
                 <!--<span class="default-style item-name">其他</span>-->
             <!--</li>-->
             <!--<li class="action-items" @click="$router.push({name: 'setting'})">-->
                 <!--<i class="default-style iconfont iconshezhi"></i>-->
                 <!--<span class="default-style item-name">设置</span>-->
             <!--</li>-->
             <!--<li class="action-items">-->
                 <!--<i class="default-style iconfont icontuichu" @click="dialogVisible=true"></i>-->
             <!--</li>-->
         <!--</ul>-->
    </div>
    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
            <div class="outInfo">
                <i class="iconfont icontishigantanhao"></i>
                <span>确认注销当前用户？</span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="quit">确 定</el-button>
            </span>
        </el-dialog>
</div>
</template>

<script>
import {mapMutations,mapGetters} from 'vuex'
import {SHOW_MORE_NAV} from 'types'
import { userLogout } from 'http/apis'
import util from "../../../http/app";
export default {
    props: ['otherFlag','menuList','otherList'],
    data(){
        return{
            dialogVisible:false,
        }
    },
    computed:{
        ...mapGetters([
            'userName'
        ]),

        currentPathName() {
            return this.$route.name
        }
    },

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
        async quit(){
            const data = await userLogout({})
            if(data.code !=200) return this.$message.error(data.msg);
            localStorage.removeItem('token')
            this.dialogVisible = false
            this.$message.success(data.msg);
            this.$router.replace({name:'login'})
            // util.quit()
            // console.log("111")
        },
    },
}
</script>
<style lang="scss" scope>
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
            overflow: hidden;

            .action-items {
                width: 9.5vw;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background: #436AC8;
                }

                .default-style {
                    display: inline;
                    font-size: $font-size12;
                    color: $font-color-white;
                }

                .item-name {
                    margin-left: 6px;
                }
            }

            .actived {
                background: #436AC8;
            }
        }

    }
    .outInfo{
        display: flex;
        align-items: center;
        justify-content: center;
            i{
                color:#436AC8;
                font-size: 27px;
            }
        }
</style>
