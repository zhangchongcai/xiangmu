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
                <div  v-clickoutside="SHOW_MORE_NAV" v-if="showMoreNav" class="more-nav">
                  <div class="more-nav-item" v-for="(item,id) in otherList" :key="id" @click="toThePath(item.resUrl)">
                    <i :class="['default-style','iconfont',item.icon]" v-if="!!item.icon"></i>&nbsp;
                     {{item.menuName}}
                  </div>
                </div>
            </el-footer>
        </el-container>
        <!-- 会员卡检索输入框 -->
        <VipNumber></VipNumber>
    </div>
</template>

<script>
import { getMenuTree } from 'http/apis'
import FooterBar from './FooterBar'
import FooterTip from './FooterTip'
import VipNumber from 'components/paytab/vipNumber'
import {mapGetters, mapMutations,mapState} from 'vuex' 
import {SHOW_MORE_NAV,EMPOWER_SET_SHOW,EMPOWER_SET_USER,EMPOWER_SET_PASSWORD} from 'types'
const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
        function documentHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
                return false;
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
                // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
                binding.value(e);
            }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};
    export default {
        data() {
          return {
              
          }
        },
        created() {
        },
        async mounted(){
           
        },
        beforeDestroy(){
         
        },
        directives: {clickoutside},
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
                  case '/page/settings/lockedPage':
                    this.$confirm('确定锁机？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$router.push(path);
                    }).catch(() => {
                            
                    });
                    break;
                  default:
                    this.$router.push(path);
              }
              this.SHOW_MORE_NAV();
          },
        },
        components: {
            FooterBar,
            FooterTip,
            VipNumber,
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
                    align-content: flex-start;
                    flex-wrap: wrap;
                    z-index: 9999;
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
.default-style{
    display: inline;
    font-size: $font-size12;
    color: $font-color-white;
}
</style>
