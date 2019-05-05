<template>
     <section class="calendarWarpSection">
        <div>
            <div class="calendarGlobalControls">
                <span class="controlLeft">
                    <i class="el-icon-d-arrow-left" @click.prevent.stop="coutDownYears"></i>
                    <i class="el-icon-arrow-left" @click.prevent.stop="coutDownMonth"></i>
                </span>
                <em>{{(new Date(timeNow)).getFullYear()}}年</em>
                <em>{{(new Date(timeNow)).getMonth() + 1}}月</em>
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
                    <template v-if="choisedDateTime.length==0">
                        <div class="dayItem" :key="index" v-if="index < 42" @click="customClickDataItem(item)" @mouseover="divMouseOverHandle(item)">
                            <span v-text="item.label" :class="{'notInMonth': !item.dayInCurrentMonth}" ></span>
                        </div>
                    </template>
                    <template v-else-if="choisedDateTime.length==1">
                        <div class="dayItem" :key="index" v-if="index < 42" @click="customClickDataItem(item)" @mouseover="divMouseOverHandle(item)">
                            <span v-text="item.label" :class="{'notInMonth': !item.dayInCurrentMonth , 'selected':((choisedDateTime[0]==item.value || choisedDateTime[1]==item.value)&&item.dayInCurrentMonth)}" ></span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="dayItem" :key="index" v-if="index  < 42" @click="customClickDataItem(item)" @mouseover="divMouseOverHandle(item)"
                            :class="{'backgroundGlay': ((item.value >= choisedDateTime[0] && item.value <= choisedDateTime[1]) || (item.value >= choisedDateTime[1] && item.value <= choisedDateTime[0]))}"
                        >
                            <span v-text="item.label" :class="{'notInMonth': !item.dayInCurrentMonth , 'selected':((choisedDateTime[0]==item.value || choisedDateTime[1]==item.value)&&item.dayInCurrentMonth)}" ></span>
                        </div>
                    </template>
                </template>
            </div>
        </div>
        <div>
            <div class="calendarGlobalControls">
                <em>{{(new Date(timeNow02)).getFullYear()}}年</em>
                <em>{{(new Date(timeNow02)).getMonth() + 1}}月</em>
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
                    <template v-if="choisedDateTime.length==0">
                        <div class="dayItem" :key="index" v-if="index > 41" @click="customClickDataItem(item)" @mouseover="divMouseOverHandle(item)">
                            <span v-text="item.label" :class="{'notInMonth': !item.dayInCurrentMonth}" ></span>
                        </div>
                    </template>
                    <template v-else-if="choisedDateTime.length==1">
                        <div class="dayItem" :key="index" v-if="index > 41" @click="customClickDataItem(item)" @mouseover="divMouseOverHandle(item)">
                            <span v-text="item.label" :class="{'notInMonth': !item.dayInCurrentMonth , 'selected':((choisedDateTime[0]==item.value || choisedDateTime[1]==item.value)&&item.dayInCurrentMonth)}" ></span>
                        </div>
                    </template>
                    <template v-else>
                        <div class="dayItem" :key="index" v-if="index > 41" @click="customClickDataItem(item)" @mouseover="divMouseOverHandle(item)"
                            :class="{'backgroundGlay': ((item.value >= choisedDateTime[0] && item.value <= choisedDateTime[1]) || (item.value >= choisedDateTime[1] && item.value <= choisedDateTime[0]))}">
                            <span v-text="item.label" :class="{'notInMonth': !item.dayInCurrentMonth , 'selected':((choisedDateTime[0]==item.value || choisedDateTime[1]==item.value)&&item.dayInCurrentMonth)}" ></span>
                        </div>
                    </template>
                </template>
            </div>
        </div>
    </section>
</template>
<script>
import {getDaysListOfMonth} from '../../util/getDaysOfMonth'
export default {
    data(){
        return {
            timeNow: new Date().getTime() , 
            timeNow02: null,
            daysList: [] ,
            daysList_02: [] , 
            choisedDateTime: [] , 
            clickedLength: 0 
        }
    } , 
    watch: {
        timeNow(){
            this.timeNow02 = new Date(this.timeNow).addMonths(1).getTime() ; 
            this.getDaysListByYearAndMonth();
        } 
    },
    mounted(){
        this.timeNow02 = new Date(this.timeNow).addMonths(1).getTime() ; 
        this.getDaysListByYearAndMonth();
    } , 
    methods: {
        getDaysListByYearAndMonth(){
            let _this = this ; 
            _this.daysList = getDaysListOfMonth(new Date(this.timeNow));
            let otherList = getDaysListOfMonth(new Date(this.timeNow02));
            otherList.forEach(function(item){
                let params = {
                    label: item.label , 
                    currendDay: item.currendDay , 
                    dayInCurrentMonth: item.dayInCurrentMonth , 
                    value: item.value
                };
                _this.daysList.push(Object.freeze(params));
            });
        },
        coutDownYears(){    //年的减少
            this.timeNow = (new Date(this.timeNow)).addYears(-1).getTime();
        } , 
        addUpYears(){   //年的增加
            this.timeNow = (new Date(this.timeNow)).addYears(1).getTime();
        } , 
        coutDownMonth(){    //月的减少
            this.timeNow = (new Date(this.timeNow)).addMonths(-1).getTime();
        }, 
        addUpMonth(){    //月的增加
            this.timeNow = (new Date(this.timeNow)).addMonths(1).getTime();
        } , 
        customClickDataItem(item){
            if(this.clickedLength == 2){
                this.clickedLength = 1 ; 
                this.choisedDateTime.length = 0 ;
                this.choisedDateTime.push(item.value) ; 
            }
            else{
                this.clickedLength += 1; 
                this.choisedDateTime.push(item.value)
                console.log(this.choisedDateTime);
            }
            console.log(this.choisedDateTime.length);
            if(this.choisedDateTime.length>2){
                this.$emit('valueChange' , [
                    new Date(this.choisedDateTime[0]) , 
                    new Date(this.choisedDateTime[1])
                ]);
            }
        } , 
        divMouseOverHandle(item){       
            if(this.choisedDateTime.length ==1){
                this.choisedDateTime.push(item.value);
            }
            else if(this.choisedDateTime.length ==2){
                this.choisedDateTime.length = 1 ;
                this.choisedDateTime.push(item.value);
            }
        }
    } , 
    directives: {
        classData:{
            bind: function(el , bindings){
                // console.log('指令已经绑定到元素上了') ; 
                // console.log(el);
                // console.log(bindings);
                // console.log(el);
            } , 
            update: function(el , bindings){
                // console.log('指令的数据有所变化');
                // console.log(el);
                // console.log(bindings);
                // console.log(bindings.value);
                
            } , 
            unbind: function () {
                // console.log('解除绑定了');
            }
        }
    }
}
</script>
<style lang="scss" scoped>
div.calendarContentWarpOpened{
    height:340px;
}
section.calendarWarpSection{
    display: flex;
    >div{
        flex:1 ;
        border-right: 1px solid #e4e4e4;
        padding-right: 10px;
    }
    >div:last-child{
        border:None;
        padding-left:10px;
        padding-right: 0px;
    }
}
</style>
