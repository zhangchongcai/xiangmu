<template>
    <div class="alert-window">
        <iframe :src="src" frameborder="0" :width="alertConfig.width" :height="alertConfig.height"></iframe>
    </div>
</template>

<script>
export default {
    props: {
        src: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            alertConfig: {
                width: '0px',
                height: '0px'
            }
        }
    },
    created() {
        let width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        let height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        this.alertConfig.width = width;
        this.alertConfig.height = height;
    }
}
</script>

<style lang="scss" scoped>
    .alert-window{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 99999;
    }
</style>
