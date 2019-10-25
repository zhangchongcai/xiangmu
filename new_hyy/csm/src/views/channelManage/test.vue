<template>
  <section>
    <el-button @click="handleDialogVisible">111111</el-button>
    <hallSelect ref="hallSelect" :cinemaUid="cinemaUid" @getData="getData"></hallSelect>
  </section>
</template>

<script>
import hallSelect from 'ctm/components/hallSelect/HallSelect.vue'
export default {
  components: { hallSelect },
  data () {
    return {
      cinemaUid: '111111',
      currentData: []
    }
  },
  methods: {
    handleDialogVisible () {
      this.$refs.hallSelect.handleDialogVisible(true)
    },
    getData (newValue) {
      console.log(newValue)
      this.currentData = newValue
    },
  },
  mounted () {

  }
}
</script>

<style scoped>
</style>