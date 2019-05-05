<template>
    <div class='home-index'>
        <div style="margin:0 auto; text-align:center; color:#bcbcbc;">
            <div class="iconfont icon-jijiangshangxian home-icon"></div>
            <p>功能即将上线，敬请期待～</p>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{

            }
        },
        created(){

        },
        methods:{
            redictFun(){
                let userResult = JSON.parse(localStorage.getItem('user'))
                if(!userResult){
                    this.$router.push("/login");
                     console.log('hhh',userResult)
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
