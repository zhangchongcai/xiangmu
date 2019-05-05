<template>
    <div>
        {{userInfo}}
    <div>13131</div> 
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import { USER_INFO } from 'src/newVuex/types'
export default {
    data(){
        return{

        }
    },
    computed:{
        ...mapState({
            userInfo : state => state.user.userInfo
        })
    },
    async mounted(){
        console.log(1)
        await this[USER_INFO]({a:1,b:2}).then(res => { console.log(2)})
        console.log(3)
    },
    methods:{
        ...mapActions({
            USER_INFO
        })
    },
}
</script>

