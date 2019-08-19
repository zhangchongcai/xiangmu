<template>
    <section class="self-el-section-warp" :style="autoStyle">
        <div class="calendarInputWarp"  @click.prevent.stop="handleCalendarInputClick($event)">
            <el-input v-model="choisedData" placeholder="请选择日期"  clearable readonly suffix-icon="el-icon-date">
            </el-input>
        </div>
        <!-- <div class="calendarContentWarp" v-clickoutside="handleClose" v-cloak :class="(show ? 'calendarContentWarpOpened' : '')">        -->
        <div class="calendarContentWarp" v-cloak :class="{'calendarContentWarpOpened':calendarShow , 'rangeDateTimeWarp':(leftTypeNavIndex>3)}"  v-clickoutside="handleClose">
            <div class="leftTypeNav">
                <template v-for="(item , index) in leftTypeNavList">
                    <a :key="index" v-text="item" :class="(leftTypeNavIndex == item ? 'cur' : '')" @click.prevent.stop="handleChangeLeftTypeNavIndex(item,index)"></a>
                </template>
            </div>
            <div class="rightCalendarContent" @click.prevent.stop>
                <component  ref="activeComponent"
                    v-model="value" 
                    :is="currentComponent"
                    :activeIndex="activeIndex"
                    @valueChange="changeValueReturn">
                </component>
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
            // type: Object , 
            default: '' , 
            required : true 
        } , 
        dateType: {
            type: Array  , 
            default:()=>{
                return ['天', '周', '月', '年']
            }
        }, 
        dateTypeActive:{
            type: String , 
            default:'天'
        },
        dateTypeIndex:{
            default:-1,
        },
        placeholder:{
            default: '' , 
            required : false
        } , 
        autoStyle: {
            type: String , 
            default: ''  , 
            required : false 
        },
        format: {
            type: String,
            default: 'yyyy-MM-dd',
            validator: function (value) {
                return ['yyyy-MM-dd', 'yyyy/MM/dd'].includes(value)
            }
        },
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
            leftTypeNavList: this.dateType,   //日历左侧导航list
            leftTypeNavIndex: this.formatDateType(this.dateTypeActive), //日历左侧导航选中下标
            elePosition: null ,  //输入框位置信息
            currentComponent: 'day-component', //
            activeIndex:this.dateTypeIndex //组件名称
        }
    } , 
    mounted(){
        this.caleAboutData();
    },
    created(){
        this.switchComponent(this.leftTypeNavIndex);
    },
    methods : {
        formatDate(date) {            
            return date.formatDate(this.format)
        },
        formatDateType(str){
            switch(str){
                case 'day':
                    return '天'
                break;
                case 'week':
                    return '周'
                break;
                case 'month':
                    return '月'
                break;
                case 'year':
                    return '年'
                break;
                case 'custom':
                    return '自定义'
                break;
                default:
                    return '天'
                break;
            }
        },
        caleAboutData(){
            if(this.value){
                if(!(this.value instanceof Array)){
                    // day
                    let time = new Date(this.value).getTime();
                    this.choisedData = this.formatDate(new Date(time)) ;
                }
                else{
                    // Array:week month year custom
                    let time1 = this.value[0], 
                    time2 = this.value[1]; 
                    this.choisedData = this.formatDate(new Date(time1)) + ' 至 ' + this.formatDate(new Date(time2))
                }
            }
            else{
                this.value = this.formatDate(new Date());
            }
        } , 
        handleCalendarInputClick(e){
            // console.log(e,'handleCalendarInputClick')
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
            // 周 子组件 定位功能
            this.$children[1] && this.$children[1].initPosition && this.$children[1].initPosition()
        }, 
        changeValueReturn(val,index){
            let startTime = null;
            let endTime = null;
            if(val instanceof Array){
                val.sort(function(a , b){
                    return a - b  ; 
                })
                startTime = this.formatDate(val[0]);
                endTime = this.formatDate(val[1]);
               
            }else{
                startTime = this.formatDate(val);
                endTime = this.formatDate(val);
            }
            // this.calendarShow = false;
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
            this.$emit('input' , val); 
            this.$emit('emitCalendarType' , returnVal);
            this.$emit('change',{startTime:startTime,endTime:endTime,index:index});
            this.$nextTick(()=>{
                this.calendarShow = false; 
            })
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
            // width:420px;
            width:500px;
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
                                a.current{
                                    background:#ffff;
                                    color:#6591FF;
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
                        };
                        ul.weekList{
                        li.noEnableChoise{
                           color:#cdcdcd
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
                            li.noEnableChoise{
                                color:#cdcdcd;
                            }
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
                                border-radius: 4px;
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
                            >span.disabled{
                                background:none;
                                color:#c9c9c9;
                                &:hover{
                                    background:none;
                                    color:#c9c9c9;
                                }
                            }
                            >span.selected{
                                background:#6591FF;
                                color:#FFF;
                            }
                            >span.noEnableChoise{
                                color:#dcdcdc;
                                // background:#dcdcdc
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
            // top: 42px;
            opacity: 1;
        }
        div.rangeDateTimeWarp{
            width:760px;
        }
        
    }
</style>

