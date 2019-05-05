<template>
    <section>
        <transition name="fade"
                mode="out-in">
            <Main />
        </transition>
    </section>
</template>
<script>
import mainCon from './Main'
export default {
    components: {
        Main: mainCon
    }
}
</script>
<style lang="scss">
   
</style>
