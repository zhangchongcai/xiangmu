<template>
    <section class="calendarWarpSection">
        <div class="calendarGlobalControls">
            <span class="controlLeft">
                <i class="el-icon-d-arrow-left" @click.prevent.stop="coutDownYears"></i>
            </span>
            <em>
                {{startYear}}年 - {{endYear}}年
            </em>
            <span class="controlRight">
                <i class="el-icon-d-arrow-right" @click.prevent.stop="addUpYears"></i>
            </span>
        </div>
        <div class="calendarlistWarp">
            <div class="monthLists">
                <template v-for="(item , index) in yearsList">
                    <div :key="index">
                        <a :class="{'enableChoise': item.enableChoise , 'noEnableChoise': (!item.enableChoise) , 'isActive':(isActive==index)}" @click="choiseMonth(item , index)">{{item.label}}年</a>
                    </div>
                </template> 
            </div>
        </div>
    </section>
</template>
<script>
export default {
    data(){
        return {
            startYear: null , 
            endYear: null ,
            yearsList: []  ,
            isActive: -1 
        }
    } , 
    created(){
        let year = new Date().getFullYear();
        this.startYear = (Math.floor(year / 10)) * 10; 
        this.setYearsList();
    },
    methods: {
        coutDownYears(){
            this.startYear -= 10 ;
            this.setYearsList();
        },
        addUpYears(){
            this.startYear = this.endYear + 1 ;
            this.setYearsList();
        },
        setYearsList(year){
            this.isActive = -1 ; 
            this.yearsList = [] ;
            let currentYear = new Date().getFullYear();
            this.endYear = this.startYear + 9 ; 
            for(let i = this.startYear ; i <=this.endYear ; i++){
                let label = i ; 
                let enableChoise = (i <= currentYear) ? true : false ;
                this.yearsList.push({
                    label , 
                    enableChoise 
                })
            }
        } , 
        choiseMonth(item , index){
            if(!item.enableChoise){
                return false;
            }
            let year = item.label ; 
            let startDate = new Date(year , 0 , 1) , 
                endDate = new Date(year , 11 , 31) ; 
            // console.log(startDate.formatDate('yyyy/MM/dd'));
            // console.log(endDate.formatDate('yyyy/MM/dd'));
            this.isActive = index;
            this.$emit('valueChange' , [
                startDate , 
                endDate
            ]);
        }
    }
}
</script>

