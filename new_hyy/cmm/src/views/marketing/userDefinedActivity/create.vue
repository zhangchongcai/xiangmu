<template>
    <div>
        <user-defined-activity-create :pageType="pageType" :innerId="innerId"/>
    </div>
</template>

<script>
import userDefinedActivityCreate from "./add-or-update"
export default {
    data(){
        return {
            pageType:"create",//页面状态
            innerId:null,//入参
        }
    },
    components:{
        userDefinedActivityCreate
    },
    created(){
        
    },
    methods: {
    
    },
   
}
</script>
<style lang="scss" scoped>
 
</style>