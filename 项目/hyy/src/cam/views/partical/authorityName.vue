<template>
   <div>
        <div v-if="orgType == 'group'" class="label-title">
           总部:<span style="padding-left:16px;">{{orgName}}</span>
        </div>
        <div v-else-if="orgType == 'city'" class="label-title">
           区域:<span style="padding-left:16px;">{{orgName}}</span>
        </div>
        <div v-else-if="orgType == 'cinema'" class="label-title">
           影院:<span style="padding-left:16px;">{{orgName}}</span>
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

