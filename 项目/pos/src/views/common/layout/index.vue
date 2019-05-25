<template>
    <div class="index-page">
        <el-container :class="['main-container', !showBar ? 'large-height' : 'small-height']">
            <el-main>
                <div class="content-wrapper">
                    <router-view></router-view>
                </div>
            </el-main>
            <el-footer v-show="showBar" height="8.9vh">
                <footer-bar></footer-bar>
                <footer-tip></footer-tip>
                <div v-show="showMoreNav" class="more-nav">
                  <div class="more-nav-item" v-for="item in moreNav" :key="item.name" @click="toThePath(item.path)">
                     {{item.name}}
                  </div>
                </div>
            </el-footer>

        </el-container>
        
    </div>
</template>

<script>
import FooterBar from './FooterBar'
import FooterTip from './FooterTip'
import {mapGetters, mapMutations,mapState} from 'vuex'
import {SHOW_MORE_NAV,EMPOWER_SET_SHOW,EMPOWER_SET_USER,EMPOWER_SET_PASSWORD} from 'types'
    export default {
        data() {
          return {
              moreNav: [
                  {
                      name: '票券销售',
                      path: 'sellCoupon'
                  },
                  {
                      name: '充值',
                      path: 'recharge'
                  },
                  {
                      name: '备餐登记',
                      path: 'prePareMeals'
                  },
                  {
                      name: '备餐明细',
                      path: 'mealDetail'
                  },
                  {
                      name: '设置',
                      path: 'setting'
                  },
                  {
                      name: '重打印凭证',
                      path: 'printRepeat'
                  },
                  {
                      name: '重打印影票',
                      path: 'rePrint'
                  },
                  {
                      name: '开钱箱',
                      path: 'openBox'
                  },
                  {
                      name: '抽钞登记',
                      path: 'withdrawMoney'
                  },
                  {
                      name: '卖品进出确认',
                      path: 'sellerConfirm'
                  },
                  {
                      name: '前区清点',
                      path: 'inventory'
                  },
                  {
                      name: '我的销售排名',
                      path: 'myRanking'
                  },
                  {
                      name: '广电通知',
                      path: 'noticeLists'
                  },
                  {
                      name: '补登票',
                      path: 'registerTicket'
                  },
                  {
                      name: '锁机',
                      path: 'lockedPage'
                  },
                  {
                      name: '修改密码',
                      path: 'changePassword'
                  },
                  {
                      name: '会员卡写卡',
                      path: 'vipcard'
                  },
                  {
                      name: '票券批量打印',
                      path: 'others'
                  },
                  
              ]
          }
        },
        computed: {
           ...mapGetters([
               'showBar',
               'showMoreNav'
           ]),
           ...mapState({
            show : state => state.empower.show,
            password : state => state.empower.password,
            type : state => state.empower.type,
            })
        },
        methods: {
          ...mapMutations([
              SHOW_MORE_NAV,
              EMPOWER_SET_SHOW,
              EMPOWER_SET_PASSWORD,
              EMPOWER_SET_USER,
          ]),

          toThePath(path) {
              switch(path){
                  case 'openBox':
                  this[EMPOWER_SET_USER]('');
                  this[EMPOWER_SET_PASSWORD]('');  
                  this[EMPOWER_SET_SHOW](true);
                  break;
                  default:
                    this.$router.push({name:path});
              }
              this.SHOW_MORE_NAV();
          }
        },
        components: {
            FooterBar,
            FooterTip
        },
        watch:{
            show(newVal){
                if(!newVal && this.password){
                    console.log('开钱')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .index-page {
        width: 100vw;
        height: 100vh;
        .small-height {
            height: 100vh;
            overflow: hidden;
            }
        .large-height {
            height: 100%;
        }
        .main-container {
            .el-main {
                padding: 0;
                .content-wrapper {
                    height: 100%;
                }
            }
            .el-footer {
                width: 100%;
                box-sizing: border-box;
                height: 6.3vh;
                background-color: $themeColor;
                padding: 0;
                .more-nav {
                    width: calc(12.8vw * 5);
                    height: calc(6.3vh * 4);
                    @include bg_color($themeColor);
                    position: absolute;
                    bottom: calc( 8.9vh + 1px);
                    right: 15.4vw;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;
                    z-index: 999;
                    .more-nav-item {
                        flex: 0 0 20%;
                        width: 20%;
                        height: calc(100% / 4);
                        box-sizing: border-box;
                        border-bottom: 1px solid #cfc4f821;
                        border-right: 1px solid #cfc4f821;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        color: $font-color-white;
                        font-size: $font-size12;

                        &:hover {
                            background: #436AC8;
                            cursor: pointer;
                        }
                    }
                }
            }
        }
    }
    
</style>