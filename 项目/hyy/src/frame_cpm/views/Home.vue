<template>
    <div class='home-index'>
        <div style="margin:0 auto; text-align:center; color:#bcbcbc;">
            <div class="iconfont icon-jijiangshangxian home-icon"></div>
            <p>功能即将上线，敬请期待～</p>
        </div>
    </div>
</template>

<script>
  import {getUrl} from 'frame_cpm/http/interface.js'
    export default {
        data(){
            return{

            }
        },
        created(){
            this. redictFun()
        },
        methods:{
            redictFun(){
                let userResult = JSON.parse(localStorage.getItem('user'))
                if(!userResult){
                    this.$router.push("/login");
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
    .home-icon{
        font-size:48px;
        margin-bottom:28px;
    }
    .home-index{
        display:flex;
        justify-content: center;
        align-items: center;
        background-color:#f5f5f5;
        color:#bcbcbc;
        height: 100%;
    }
</style>
