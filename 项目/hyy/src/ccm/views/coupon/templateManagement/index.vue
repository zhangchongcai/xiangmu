<template>
    <div>
        <el-button @click="showDialog">点击</el-button>
        <ccmSaleList v-if="isShowDialog"></ccmSaleList>
    </div>
</template>

<script>

export default {
    // components: {
    //     ccmSaleList
    // },
    data() {
        return {
            isShowDialog: false
        }
    },
    created() {

    },
    methods: {
        showDialog() {
            this.isShowDialog = !this.isShowDialog;
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
