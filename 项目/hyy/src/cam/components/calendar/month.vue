<template>
    <section class="calendarWarpSection">
        <div class="calendarGlobalControls">
            <span class="controlLeft">
                <i class="el-icon-d-arrow-left" @click.prevent.stop="coutDownYears"></i>
            </span>
            <em v-text="year"></em>
            <span class="controlRight">
                <i class="el-icon-d-arrow-right" @click.prevent.stop="addUpYears"></i>
            </span>
        </div>
        <div class="calendarlistWarp">
            <div class="monthLists">
                <template v-for="(item , index) in monthList">
                    <div :key="index">
                        <!-- <a :class="(item.enableChoise ? 'enableChoise' : 'noEnableChoise')" >{{item.label}}月</a> -->
                        <a :class="{'current':item.current,'enableChoise': item.enableChoise , 'noEnableChoise': (!item.enableChoise) , 'isActive':(selectedIndex == index)}" @click="choiseMonth(item , index)">{{item.label}}月</a>
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
            year: null  ,    //年
            month : null ,   //当前月
            monthList: [] ,  //月list
            selectedIndex:this.activeIndex        
        }
    } , 
    props: {
        value: {
            default: new Date() , 
            required: true
        },
        activeIndex:{
            default: -1,
        }
    },
    mounted(){
        this.initDate()
    },
    watch:{
        value(){
            this.initDate()
        }
    },
    created(){
      this.initDate()
    } , 
    methods : {
         initDate(){
            if(!(this.value instanceof Array)){
                // day -->month
                this.timeNow = new Date();
                this.year = new Date(this.timeNow).getFullYear();
                this.month = new Date(this.timeNow).getMonth() + 1;
                this.selectedIndex = -1;

            }else{
                // month
                this.timeNow = new Date();
                this.year = new Date(this.timeNow).getFullYear();
                this.month = new Date(this.timeNow).getMonth() + 1;
            }
           this.caleMonthList(); 
        },
        coutDownYears(){
            this.year -- ; 
            this.caleMonthList();
        },
        addUpYears(){
            this.year ++ ; 
            this.caleMonthList();
        },
        caleMonthList(){
            this.monthList = [] ;
            let nowDate = new Date();
            for(let i = 1 ;i < 13 ; i++){
                let selectDate = new Date(this.year , i - 1 , 1); 
                let label = i + '' ; 
                let year = this.year ; 
                let month = i ;     
                let enableChoise = (selectDate > nowDate) ? false : true ; 
                let current =  this.month  == i ?  true:false; 
                this.monthList.push({
                    label , 
                    year ,
                    month , 
                    enableChoise,
                    current
                });
            }
        } , 
        choiseMonth(item , index){
            if(!item.enableChoise){
                return false;
            }
            let year = item.year , 
                month = item.month ; 
            let startDate = new Date(year , month - 1 , 1) , 
                endDate = new Date(year , month , 1).addDays(-1) ; 
                this.selectedIndex = index;
            this.$emit('valueChange' , [
                startDate , 
                endDate
            ],index);
        }
    }
}
</script>
