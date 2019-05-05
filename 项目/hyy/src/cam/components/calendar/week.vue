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
            <ul>
                <template v-for="(item , index) in weekList">
                    <li :key="index" :class="{'current' : item.ifCurrentWeek , 'selected' : item.isActive}" @click="handleChoiseItem(item)">
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
            type: Date , 
            default: new Date() , 
            required: true
        }
    },
    watch(){

    },
    data(){
        return {
            weekList : [] ,     //周列表
            nowYear: (new Date()).getFullYear() , //当前年
            currentIndex: 0 
        }   
    } , 
    mounted(){
        let _this = this ; 
        this.weekList = getWeekData(this.nowYear);
        this.weekList.forEach(function(item , index){
            if(item.ifCurrentWeek===true){
                _this.currentIndex = index;
            }
        });        
    },
    created(){
    },
    methods: {
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
        handleChoiseItem(item){
            this.weekList.forEach(function(i){
                i.isActive = false ;
            })
            item.isActive = true ; 
            this.$emit('valueChange' , [
                new Date(item.weekStartDate) , 
                new Date(item.weekEndDate)
            ]);
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
            li.current , li:hover{
                background:#F1F1F1;
            } 
            li.selected{
                background:#6591FF ; 
                color:#FFF;
            }
        }
    }
</style>
