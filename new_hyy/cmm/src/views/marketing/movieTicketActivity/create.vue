<template>
    <div>
        <movie-ticket-activity-create :pageType="pageType" :innerId="innerId"/>
    </div>
</template>

<script>
import movieTicketActivityCreate from "./add-or-update"
export default {
    data(){
        return {
            pageType:"create",//页面状态
            innerId:null,//入参
        }
    },
    components:{
        movieTicketActivityCreate
    },
    created(){
        
    },
    methods: {
    
    },
   
}
</script>
<style lang="scss" scoped>
 
</style>