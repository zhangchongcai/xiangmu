<template>
    <section class="calendarWarpSection">
        <div class="calendarGlobalControls">
            <span class="controlLeft">
                <i class="el-icon-d-arrow-left" @click.prevent.stop="coutDownYears"></i>
            </span>
            <em v-text="nowYear"></em>
            <span class="controlRight">
                <i class="el-icon-d-arrow-right" @click.prevent.stop="addUpYears"></i>
            </span>
        </div>
        <div class="calendarlistWarp" ref="weekListDom">
            <ul class="weekList">
                <template v-for="(item , index) in weekList">
                    <li :key="index" :class="{'current' : item.ifCurrentWeek , 
                    'selected' : selectedIndex == index,
                    'noEnableChoise': (!item.enableChoise)}" 
                    :ref="item.ifCurrentWeek ? 'currentWeek':''"
                    @click="handleChoiseItem(item,index)">
                        {{item.label}}
                        <template v-if="item.ifCurrentWeek">
                            本周
                        </template>
                    </li>
                </template>
            </ul>
        </div>
    </section>
</template>
<script>
import {getWeekData} from '../../util/dateListOfWeeks'
export default {
    props: {
        value: {
            // type: Date , 
            default: new Date() , 
            required: true
        },
        activeIndex:{
            required: true
        }
    },
    watch:{
        value(){
            this.initDate()
        }
    },
    data(){
        return {
            weekList : [],     //周列表
            nowYear: (new Date()).getFullYear() , //当前年
            currentIndex: this.index,
            selectedIndex:this.activeIndex,
        }   
    } , 
    created(){
        this.initDate(true)
    },
    mounted() {
        this.initPosition()
    },
    updated() {
        this.initPosition()
    },
    methods: {
        initDate(flag){
            if(this.value instanceof Array){
                // week 
                this.nowYear = new Date().getFullYear();
                this.weekList = getWeekData(this.nowYear);
                if(flag) {
                    this.selectedIndex = this.weekList.findIndex(item=>(item.weekStartDate == +this.value[0]) && (item.weekEndDate == +this.value[1]));  
                }
            }else{
                //day -- > week  
                this.nowYear = (new Date()).getFullYear(); //当前年
                this.weekList = getWeekData(this.nowYear);
                // this.selectedIndex = -1;  
            } 
        },
        initPosition() {
            // this.$refs['currentWeek'][0] && this.$refs['currentWeek'][0].scrollIntoView({
            //     block: 'center'
            // })
            let wrap = this.$refs.weekListDom
            let li = this.$refs['currentWeek'][0]
            if(wrap && li) {
                // wrap.scrollTo(0, li.offsetTop - wrap.offsetTop - 118) 等同下面的方法
                wrap.scrollTop = li.offsetTop - wrap.offsetTop - 118
            }
        },
        coutDownYears(){    //减一年
            this.nowYear -- ; 
            this.weekList = getWeekData(this.nowYear);
            this.$refs.weekListDom.scrollTop = 0;
        } , 
        addUpYears(){   //加一年
            this.nowYear ++ ; 
            this.weekList = getWeekData(this.nowYear);
            this.$refs.weekListDom.scrollTop = 0;
        } , 
        scrollFn(e){
            // this.$refs.weekListDom.scrollTop = this.currentIndex * 35 ;
        } , 
        handleChoiseItem(item,index){
            if(!item.enableChoise){
                return false;
            }
            this.weekList.forEach(function(i){
                i.isActive = false ;
            })
            item.isActive = true ; 
            // this.currentIndex = index;
            this.selectedIndex = index;
            this.$emit('valueChange' , [
                new Date(item.weekStartDate) , 
                new Date(item.weekEndDate)
            ],index);
        }
    }
}
</script>
<style lang="scss" scoped>
    div.calendarlistWarp{
        ul{
            li{
               cursor: pointer; 
               height:35px;
               line-height: 35px;
               text-indent: 10px;
            }
            li:hover{
                background:#F1F1F1;
            } 
            li.current{
                color:#6591FF;
            }
            li.selected{
                background:#6591FF ; 
                color:#FFF;
            }
        }
    }
</style>
