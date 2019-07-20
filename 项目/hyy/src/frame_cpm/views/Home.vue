<template>
    <div class='home-index'>
        <div style="margin:0 auto; text-align:center; color:#bcbcbc;">
            <h2 class="english-h2">WELCOME TO USE THIS SYSTEM</h2>
            <h2 class="cn-h3">欢迎使用本系统</h2>
            <div class="home-img">
                <img src="../assets/images/home-welcome.png" alt="欢迎使用系统" >
            </div>
        </div>
        <!--<div style="width:100%; display:flex;justify-content: flex-end;">-->
            <!--<el-button type="primary" @click="getSouce">自定义工作台</el-button>-->
        <!--</div>-->
        <!--<div class="main">-->
            <!--<router-view style="width:48%;height:300px;float:left"></router-view>-->
            <!--<router-view name="left" style="width:48%;height:300px"></router-view>-->
            <!--<router-view name="right" style="width:48%;height:300px"></router-view>-->
        <!--</div>-->
        <!--<el-dialog-->
                <!--title="提示"-->
                <!--:visible.sync="centerDialogVisible"-->
                <!--center>-->
            <!--<el-transfer-->
                    <!--v-model="value"-->
                    <!--:props="{-->
                      <!--key: 'value',-->
                      <!--label: 'desc'-->
                    <!--}"-->
                    <!--:data="data">-->
            <!--</el-transfer>-->
            <!--<span slot="footer" class="dialog-footer">-->
                <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
                <!--<el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>-->
            <!--</span>-->
        <!--</el-dialog>-->
    </div>
</template>

<script>
  import {getUrl} from 'frame_cpm/http/interface.js'
    export default {
        data(){
            return{
              centerDialogVisible: false
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

            },
            getSouce() {
                this.centerDialogVisible = true
            }
        }
    }
</script>

<style lang="scss" scoped>
    /*.home-index{*/
        /*background: #8b8b8b;*/
        /*width:100%;*/
        /*height:auto;*/
    /*}*/

   .home-index{
       display:flex;
       justify-content: center;
       align-items: center;
       background-color:#f5f5f5;
       color:#bcbcbc;
       height: 100%;
       .home-img{
           width:577px;
           height:314px;
           text-align: center;
           margin:0 auto;
           img{
               width:100%;
           }
       }
       .english-h2{
           font-size: 18px;
           color: #666;
       }
       .cn-h3{
           font-size: 20px;
           color: #333;
           margin-top: 18px;
           letter-spacing: 8px;
       }
   }

</style>
