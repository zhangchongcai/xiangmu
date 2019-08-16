<template>
    <transition name="fade">
    <div class="main" v-if="isShow">
        <div class="cover"></div>
        <div class="content">
            <h1>班次领用信息</h1>
            <p><span>{{userName}}</span>，您好，以下是您本班次的领用登记信息,请予确认</p>
            <ul>
                <li><span class="li-f">科目</span><span>领用情况</span></li>
                <li  v-for="(item,index) in this.value.records" :key="index"><span class="li-f">{{item.thingName}}</span><span>{{item.thingType==99?item.amount:item.thingCount}}</span></li>
            </ul>
            <div><el-button @click="sureClick">确认</el-button></div>
        </div>
    </div>
    </transition>
</template>

<script>
import {mapMutations,mapGetters} from 'vuex'
    export default {
        name: "useInfo",
        props: {
            isShow:{
                type:Boolean,
                default:false,
                required:true,
            },
            value:{
                type:Object,
                default:{},
                required:false,
            }
        },

        data() {
            return {
            }
        },
        computed:{
        ...mapGetters([
            'userName',
        ]),
        },
        methods: {
            //确认
             sureClick(){
                this.$emit('useInfoSureClick');
             }
                 
        }
    }
</script>

<style scoped lang='scss'>

    .main{
        z-index:100;
        position:fixed;
        left: 0;
        top: 0;
        width:100%;
        height:100%;
        .cover{
            width:100%;
            height:100%;
            position:absolute;
            background:rgba(0,0,0,0.3);
        }

        .content{
            width: 700px;
            background: white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            padding: 15px 20px 35px 35px;
            h1{
                text-align: center;
                font-size: 16px;
                font-weight: bold;
            }
            p{
                font-size: 14px;
                margin-top: 10px;
                span{
                    font-weight: bold;
                }
            }

            ul{
                border: 1px solid #999;
                margin: 10px 0 25px 0;
                li{
                    height: 40px;
                    line-height: 40px;
                    border-bottom: 0.5px solid #ccc;
                    color: #666;
                     span{
                         text-align: center;
                         display: inline-block;
                         width: 49%;
                      &.li-f{
                        border-right: 0.5px solid #ccc;
                        }
                     }
                    
                   
                    &:last-child{
                        border-bottom: none;
                    }

                    &:first-child{
                        color: #000;
                    }

                }
            }

            div{
                text-align: center;
            }

    }

     .fade-enter-active, .fade-leave-active {
        transition: all .25s;
    }
}
</style>