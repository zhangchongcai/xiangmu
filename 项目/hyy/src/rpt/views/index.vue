<template>
    <section>
        <transition name="fade"
                    mode="out-in">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
        </transition>
    </section>
</template>
<script>
export default {
    
}
</script>
<style lang="scss">
   
</style>
