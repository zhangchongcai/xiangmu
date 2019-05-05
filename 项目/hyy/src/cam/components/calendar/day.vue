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
                    <span v-text="item.label" :class="{'notInMonth':!item.dayInCurrentMonth ,'currendDay': item.currendDay , 'selected' : timeCount == item.value}" @click="sureSelectedTheDate(item)"></span>
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
            type: Object  , 
            default: new Date()  , 
            required: true 
        }
    },
    watch:{
        value(){
            this.loadBaseDate();
        }
    },
    data(){
        return {
            timeNow: null , 
            year: 0 , 
            month: 0 ,
            timeCount: 0  , 
            daysList: [] 
        }
    } , 
    mounted(){
        this.loadBaseDate();
        this.getDaysListByYearAndMonth();
    }, 
    created(){
        this.loadBaseDate();
        // this.getDaysListByYearAndMonth();
    },
    computed: {
    }, 
    methods: {
        loadBaseDate(){
             this.timeNow = new Date();
                this.year =  new Date().getFullYear();
                this.month = new Date().getMonth() + 1; 
                this.getDaysListByYearAndMonth();
            // if(this.value){
            //     console.log(this.value,'value day111')
            //     let time = null ; 
            //     if(this.value instanceof Array){
            //         console.log(this.value,'value day222')
            //         time = new Date().clone();
            //         this.timeNow = time;
            //     }
            //     else{
                   
            //         time = this.value.clone();
            //         console.log(time)
            //         this.timeNow = time;
            //         this.timeCount = new Date(this.timeNow.formatDate('yyyy/MM/dd 00:00:00')).getTime() ; 
            //     }
            //     this.year =  this.timeNow.getFullYear();
            //     this.month = this.timeNow.getMonth() + 1; 
            //     this.getDaysListByYearAndMonth();
            // }
            // else{
            //     this.timeNow = new Date();
            //     this.year =  new Date().getFullYear();
            //     this.month = new Date().getMonth() + 1; 
            //     this.getDaysListByYearAndMonth();
            // }
        },
        getDaysListByYearAndMonth(){
            this.daysList = getDaysListOfMonth(this.timeNow);
        },
        coutDownYears(){    //年的减少
            this.timeNow.addYears(-1);
            this.getDaysListByYearAndMonth();
        } , 
        addUpYears(){   //年的增加
            this.timeNow.addYears(1) ; 
            this.getDaysListByYearAndMonth();
        } , 
        coutDownMonth(){    //月的减少
            this.timeNow.addMonths(-1);
            this.getDaysListByYearAndMonth();
        }, 
        addUpMonth(){    //月的增加
            this.timeNow.addMonths(1);
            this.getDaysListByYearAndMonth();
        }  , 
        sureSelectedTheDate(item){  //确定选择日期
            this.$emit('valueChange' , new Date(item.value));
            if(!item.dayInCurrentMonth){
                this.timeNow = new Date(item.value);
                this.loadBaseDate();
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
