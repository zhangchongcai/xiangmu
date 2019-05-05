<template>
    <section class="self-el-section-warp" :style="style">
        <div class="calendarInputWarp" @click.prevent.stop="handleCalendarInputClick($event)">
            <!-- <el-input v-model="input" placeholder="请选择日期" @focus="handleCalendarInputClick($event)"></el-input> -->
            <!-- <input type="text" class="calendarMainInputClass" :placeholder="placeholder" /> -->
            <el-input v-model="choisedData" placeholder="请选择日期"  clearable readonly suffix-icon="el-icon-date"></el-input>
        </div>
        <!-- <div class="calendarContentWarp" v-clickoutside="handleClose" v-cloak :class="(show ? 'calendarContentWarpOpened' : '')">        -->
        <div class="calendarContentWarp" v-cloak :class="{'calendarContentWarpOpened':calendarShow , 'rangeDateTimeWarp':(leftTypeNavIndex>3)}"  v-clickoutside="handleClose">
            <div class="leftTypeNav">
                <template v-for="(item , index) in leftTypeNavList">
                    <a :key="index" v-text="item" :class="(leftTypeNavIndex == item ? 'cur' : '')" @click.prevent.stop="handleChangeLeftTypeNavIndex(item,index)"></a>
                </template>
            </div>
            <div class="rightCalendarContent">
                <component :is="currentComponent" v-model="value" @valueChange="changeValueReturn"></component>
            </div>
        </div>
    </section>
</template>
<script>
import DayComponent from './day.vue' 
import WeekComponent from './week' 
import MonthComponent from './month'
import YearComponent from './year' 
import CustomComponent from './custom'
export default {
    props:{
        value: {
            type: Object , 
            default: '' , 
            required : true 
        } , 
        dateType: {
            type: Array  , 
            default:['天', '周', '月', '年','自定义'], 
        } , 
        placeholder:{
            default: '' , 
            required : false
        } , 
        style: {
            type: String , 
            default: ''  , 
            required : false 
        }
    } , 
    watch: {
        value(){
            this.caleAboutData();
        }
    } , 
    components: {
        'day-component' : DayComponent , 
        'week-component' : WeekComponent , 
        'month-component' : MonthComponent , 
        'year-component' : YearComponent , 
        'custom-component': CustomComponent
    } , 
    data(){
        return {
            calendarShow: false  , 
            choisedData: null   ,   //需要显示的日期字符串 
            leftTypeNavList:this.dateType,   //日历左侧导航list
            leftTypeNavIndex: this.dateType[0] ,   //日历左侧导航选中下标
            elePosition: null ,  //输入框位置信息
            currentComponent: 0   //组件名称
        }
    } , 
    mounted(){
        this.caleAboutData();
    },
    created(){
        this.switchComponent(this.leftTypeNavIndex);
    },
    methods : {
        caleAboutData(){
            if(this.value){
                if(!(this.value instanceof Array)){
                    let time = new Date(this.value).getTime();
                    this.choisedData = new Date(time).formatDate('yyyy-MM-dd') ;
                }
                else{
                    let time1 = this.value[0].getTime() , 
                    time2 = this.value[1].getTime() ; 
                    this.choisedData = new Date(time1).formatDate('yyyy-MM-dd') + ' 至 ' + new Date(time2).formatDate('yyyy-MM-dd')
                }
            }
            else{
                // this.value = new Date();
            }
        } , 
        handleCalendarInputClick(e){
            if(this.calendarShow){
                this.calendarShow = false ; 
                return false;
            }
            this.calendarShow = true ; 
            this.elePosition = e.target.getBoundingClientRect();
        } , 
        handleChangeLeftTypeNavIndex(item,index){
            this.leftTypeNavIndex = item;
            this.switchComponent(item);
        },
        switchComponent(index){
            switch(index){
                case '天': 
                    this.currentComponent = 'day-component' ; 
                    break;
                case '周': 
                    this.currentComponent = 'week-component' ; 
                    break;
                case '月': 
                    this.currentComponent = 'month-component' ; 
                    break;
                case '年': 
                    this.currentComponent = 'year-component' ; 
                    break;
                case '自定义': 
                    this.currentComponent = 'custom-component' ; 
                    break;   
                default:
                    break;
            }
        },
        handleClose(){
            this.calendarShow = false ; 
        }, 
        changeValueReturn(val){
            let startTime = null;
            let endTime = null;
            if(val instanceof Array){
                val.sort(function(a , b){
                    return a - b  ; 
                })
                startTime = this.$moment(val[0]).format('YYYY-MM-DD');
                endTime = this.$moment(val[1]).format('YYYY-MM-DD');
               
            }else{
                
                startTime = this.$moment(val).format('YYYY-MM-DD');
                endTime = this.$moment(val).format('YYYY-MM-DD');
            }
            this.calendarShow = false;
            let returnVal = '' ; 
            switch(this.leftTypeNavIndex){
                case '天': 
                    returnVal = "day";
                    break;
                case '周': 
                    returnVal = "week";
                    break;
                case '月': 
                    returnVal = "month";
                    break;
                case '年': 
                    returnVal = "year";
                    break;
                case '自定义':
                    returnVal = "custom";
                    break;
                default:
                    returnVal = "day";
                    break;
            }

            this.$emit('input' , val) ; 
            this.$emit('emitCalendarType' , returnVal);
            this.$emit('change',{startTime:startTime,endTime:endTime});
        }
    } , 
    directives:{
        clickoutside:{
            bind:function(el,binding,vnode){
                function documentHandler(e){
                    if(el.contains(e.target)){
                        return false;
                    }
                    if(binding.expression){
                        binding.value(e)
                    }
                }
                el._vueClickOutside_ = documentHandler;
                document.addEventListener('click',documentHandler);
            },
            unbind:function(el,binding){
                document.removeEventListener('click',el._vueClickOutside_);
                delete el._vueClickOutside_;
            }
        }
    }
}
</script>
<style lang="scss">
    section.self-el-section-warp{
        display: inline-block;
        position:relative;
        z-index: 99;
        width:230px;
        div.calendarInputWarp{
            display: inline-block;
            cursor: pointer;
            width:100%;
        }
        [v-cloak] {
            display: none;
        }
        div.calendarContentWarp{
            height: 0px;
            position: absolute;
            width:420px;
            background:#fff;
            border-radius: 3px;
            opacity: 0;
            top:40px;
            transition: all .2s cubic-bezier(0.645, 0.045, 0.355, 1);
            overflow: hidden;
            display: flex;
            box-shadow: 0px 0px 10px #808080;
            i.arrowIcon{
                position:absolute;
                font-size:20px;
                color:#e4e7ed;
                left:20px;
                top:-12px;
            }
            div.leftTypeNav{
                flex: 0px 0px 100px;
                width:100px;
                background: #e4e7ed;
                a{
                    display: block;
                    width:100%;
                    height:44px;
                    line-height: 44px;
                    text-align: center;
                    transition: all .2s cubic-bezier(0.645, 0.045, 0.355, 1);
                }
                a.cur{
                    background:#6591FF ; 
                    color: #FFF;
                }
            }
            div.rightCalendarContent{
                flex: 1;
                section.calendarWarpSection{
                    padding:8px 15px 15px;
                    div.calendarGlobalControls{
                        border-bottom: 1px solid #dcdfe6; 
                        text-align: center;
                        overflow:hidden;
                        position:relative;
                        height:35px;
                        line-height: 35px;
                        color:#666;
                        >em{
                            font-size:16px;
                            font-weight: bold;
                            margin-right: 5px;
                        }
                        >span{
                            display:inline-block;
                            height:100%;
                            position:absolute;
                            top:-2px;
                            color:#666;
                            cursor: pointer;
                            i{
                                display:inline-block;
                                width:20px;
                                height:36px;
                                line-height: 36px;
                            }
                        }
                        span.controlLeft{
                            left:5px;
                        }
                        span.controlRight{
                            right:5px;
                        }
                    }
                    div.calendarlistWarp{
                        border:1px solid #e4e7ed;
                        margin-top:12px;
                        height:270px;
                        overflow-y: auto;
                        div.monthLists{
                            display: flex; 
                            flex-flow: row wrap;
                            padding-top:24px;
                            >div{
                                flex: 0 1 33.333%;
                                text-align: center;
                                height:55px;
                                line-height: 50px;
                                a{
                                    display: block;
                                    width:50px;
                                    height:25px;
                                    line-height: 25px;
                                    text-align: center;
                                    margin:15px auto 0px;
                                    border-radius: 3px;
                                    transition: all .2s cubic-bezier(0.645, 0.045, 0.355, 1);
                                }
                                a.enableChoise:hover{
                                    background:#f1f1f1;
                                }
                                a.isActive{
                                    background:#6591FF;
                                    color:#fff;
                                }
                                a.isActive:hover{
                                    background:#6591FF;
                                    color:#fff;
                                }
                                a.noEnableChoise{
                                    color:#cdcdcd;
                                }
                            }
                        }
                    }
                    div.weekTopTips{
                        display: flex;
                        height:40px;
                        padding-top:10px;
                        border-bottom:1px solid #f9f9f9;
                        >div{
                            flex: 1;
                            height: 40px;
                            line-height: 40px;
                            text-align:  center;
                            color:#999;
                        }
                    }
                    div.dayListWarp{
                        display: flex;
                        flex-wrap: wrap;
                        >div.dayItem{
                            text-align: center;
                            height:40px;
                            width:14.285%;
                            cursor: pointer;
                            >span{
                                display:block;
                                margin:5px auto;
                                width:30px;
                                height:30px;
                                line-height: 30px;
                                border-radius: 10px;
                                color:#333;
                                transition: all .2s cubic-bezier(0.645, 0.045, 0.355, 1);
                            }
                            >span:hover{
                                background:#f2f6fc;
                                color:#6591FF;
                            }
                            >span.currendDay{
                                color:#6591FF;
                            }
                            >span.notInMonth{
                                background:none;
                                color:#c9c9c9;
                            }
                            >span.selected{
                                background:#6591FF;
                                color:#FFF;
                            }
                        }
                        >div.dayItemClick{
                            span{
                                background:#6591FF;
                                color:#FFF;
                            }
                        }
                        >div.backgroundGlay{
                            background:#f2f6fc;
                        }
                    }
                }
                
            }
        }
        div.calendarContentWarpOpened{
            height: 340px;
            top: 42px;
            opacity: 1;
        }
        div.rangeDateTimeWarp{
            width:760px;
        }
        
    }
</style>

