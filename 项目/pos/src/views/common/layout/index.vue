<template>
    <div class="index-page">
        <el-container :class="['main-container', !showBar ? 'large-height' : 'small-height']">
            <el-main>
                <div class="content-wrapper">
                    <router-view></router-view>
                </div>
            </el-main>
            <el-footer v-show="showBar" height="8.9vh">
                <footer-bar
                        :otherFlag="otherFlag"
                        :menuList="menuList"
                        v-if="menuList"
                ></footer-bar>
                <footer-tip></footer-tip>
                <div v-show="showMoreNav" class="more-nav">
                  <div class="more-nav-item" v-for="(item,id) in otherList" :key="id" @click="toThePath(item.resUrl)">
                     {{item.menuName}}
                  </div>
                </div>
            </el-footer>
        </el-container>

    </div>
</template>

<script>
import { getMenuTree } from 'http/apis'
import FooterBar from './FooterBar'
import FooterTip from './FooterTip'
import {mapGetters, mapMutations,mapState} from 'vuex'
import {SHOW_MORE_NAV,EMPOWER_SET_SHOW,EMPOWER_SET_USER,EMPOWER_SET_PASSWORD} from 'types'
    export default {
        data() {
          return {
        
          }
        },
        created() {
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
            menuList : state => state.global.menuList,
            otherFlag : state => state.global.otherFlag,
            otherList : state => state.global.otherList,
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
                    this.$router.push(path);
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
