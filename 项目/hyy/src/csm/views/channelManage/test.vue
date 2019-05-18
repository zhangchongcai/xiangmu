<template>
    <section>
        <el-button @click="handleDialogVisible">111111</el-button>
        <payType
                ref="payType"
                :cinemaUidList="cinemaUidList"
                :currentData="currentData"
                @change="valueChange"
        ></payType>
    </section>
</template>

<script>
    import payType from 'csm/components/payType/PayType.vue'
    export default {
        components: {payType},
        data() {
            return {
                cinemaUidList: ['111111'],
                currentData: []
            }
        },
        methods: {
            handleDialogVisible() {
                this.$refs.payType.handleDialogVisible(true)
            },
            valueChange(newValue) {
                console.log(newValue)
                this.currentData = newValue
            }
        },
        mounted() {
            this.currentData = ['111111']
            console.log(new Date(8888999999999999))
        }
    }
</script>

<style scoped>

</style>