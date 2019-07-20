<template>
   <div>
       <div v-if="orgType == 'group'" class="label-title">
           总部：{{orgName}}
       </div>
       <div v-else-if="orgType == 'city'" class="label-title">
           区域：{{orgName}}
       </div>
       <div v-else-if="orgType == 'cinema'" class="label-title">
           影院：{{orgName}}
       </div>
   </div>
</template>
<script>
export default {
    props:{
        orgName:{
            type:String
        },
        orgType:{
            type:String
        }
    }
}
</script>

