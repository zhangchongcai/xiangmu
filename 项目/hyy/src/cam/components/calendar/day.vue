<template>
     <section class="calendarWarpSection">
        <div class="calendarGlobalControls">
            <span class="controlLeft">
                <i class="el-icon-d-arrow-left" @click.prevent.stop="coutDownYears"></i>
                <i class="el-icon-arrow-left" @click.prevent.stop="coutDownMonth"></i>
            </span>
            <template v-if="timeNow">
                <em>{{timeNow.getFullYear()}}年</em>
                <em>{{timeNow.getMonth() + 1}}月</em>
            </template>
            <span class="controlRight">
                <i class="el-icon-arrow-right" @click.prevent.stop="addUpMonth"></i>
                <i class="el-icon-d-arrow-right" @click.prevent.stop="addUpYears"></i>
            </span>
        </div>
        <div class="weekTopTips">
            <div>一</div>
            <div>二</div>
            <div>三</div>
            <div>四</div>
            <div>五</div>
            <div>六</div>
            <div>日</div>
        </div>
        <div class="dayListWarp" v-if="daysList.length > 0">
            <template v-for="(item, index) in daysList">
                <div class="dayItem" :key="index">
                    <span v-text="item.label" :class="{
                        'notInMonth':!item.dayInCurrentMonth , 
                        'currendDay':item.currendDay, 
                        'noEnableChoise': (!item.enableChoise),
                        'selected' : item.dayInCurrentMonth && ((+value) === (+item.value))}" 
                        @click="sureSelectedTheDate(item,index)"></span>
                </div>
            </template>
        </div>
    </section>
</template>
<script>
import {getDaysListOfMonth} from '../../util/getDaysOfMonth'
export default {
    props: {
        value: {
            default: new Date(), 
            required: true 
        },
        activeIndex:{
            default: -1,
        }
    },
    watch:{
        value(){
            this.initDate();
        }
    },
    data(){
        return {
            timeNow: null , 
            year:null ,
            month: null,
            daysList: [],
            selectedIndex:this.activeIndex
        }
    }, 
    created(){
        this.initDate()
    },
    methods: {
        initDate(){
            if(!(this.value instanceof Array)){
                // props 字符串类型
                this.timeNow = new Date();
                this.year = new Date(this.timeNow).getFullYear();
                this.month = new Date(this.timeNow).getMonth() + 1;
                
            }else{
                // 其他切换过来的,是数组类型的，恢复默认状态（当前时间）
                this.timeNow = new Date();
                this.year = new Date(this.timeNow).getFullYear();
                this.month = new Date(this.timeNow).getMonth() + 1;
                this.selectedIndex = -1;
            }
            this.getDaysListByYearAndMonth(); 
        },
        loadBaseDate(){
            this.initDate()  
        },
        getDaysListByYearAndMonth(){
            this.daysList = getDaysListOfMonth(this.timeNow);
        },
        coutDownYears(){    //年的减少
            this.timeNow.addYears(-1);
            this.getDaysListByYearAndMonth();
        } , 
        addUpYears(){   //年的增加
            // if(this.year <= this.timeNow.getFullYear()){
            //     return 
            // }
            this.timeNow.addYears(1); 
            this.getDaysListByYearAndMonth();
        } , 
        coutDownMonth(){    //月的减少
            this.timeNow.addMonths(-1);
            this.getDaysListByYearAndMonth();
           
        }, 
        addUpMonth(){    //月的增加
           let year = this.timeNow.getFullYear();
           let month = this.timeNow.getMonth() + 1;
            // if(year == this.year && month >= this.month){
            //     return 
            // }
            
            this.timeNow.addMonths(1);
            this.getDaysListByYearAndMonth();
        }  , 
        sureSelectedTheDate(item,index){  //确定选择日期
            if(!item.enableChoise){
                return false;
            }
            this.selectedIndex = index;
            this.$emit('valueChange' , new Date(item.value),index);
            if(!item.dayInCurrentMonth){
                this.timeNow = new Date(item.value);
                this.initDate()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
div.calendarContentWarpOpened{
    height:340px;
}
</style>
