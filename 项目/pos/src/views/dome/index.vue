<template>
    <div>
        {{userInfo}}
    <div>13131</div> 
    
    <transition v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false">
    <div v-show="flag" class="div">
        <div v-for="item in 6"  :key="item">{{item}}</div>
    </div>
    </transition>
    <button @click="flag=!flag">flag</button>
    </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
import { USER_INFO } from 'src/newVuex/types'
export default {
    data(){
        return{
            flag:false,
        }
    },
    computed:{
        ...mapState({
            userInfo : state => state.user.userInfo
        })
    },
    async mounted(){
        // console.log(1)
        // await this[USER_INFO]({a:1,b:2}).then(res => { console.log(2)})
        // console.log(3)
    },
    methods:{
        ...mapActions({
            USER_INFO
        }),
        beforeEnter: function (el) {
            el.style.opacity = 0
            el.style.transformOrigin = 'left'
            },
        enter: function (el, done) {
             console.log(el,done)
            },
        leave: function (el, done) {
            console.log(el,done)
        }
    },
}
</script>
<style lang="scss" scoped>
</style>

