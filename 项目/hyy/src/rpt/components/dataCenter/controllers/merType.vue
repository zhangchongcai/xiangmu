<template>
  <el-select
    v-model="value"
    placeholder="请选择"
    popper-class="el_select"
    @change="changeSelect"
    multiple
  >
    <el-option v-for="(item, index) in merTypeData" :key="index" :label="item" :value="item">
      <span style="color: #8492a6; font-size: 13px">{{ item }}</span>
    </el-option>
  </el-select>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            merTypeData: ['单品', '原材料', '合成品', '套餐', '服务商品'],
            merTypeId: [1, 5, 2, 4, 3]
        }
    },
    methods: {
        changeSelect() {
          let merTypeArr = [];
          for(let i = 0; i < this.merTypeData.length; i++) {
            // if(this.merTypeData[i] === this.value) {
            //   merType = this.merTypeId[i]
            // }
            this.value.forEach(element => {
              if(this.merTypeData[i] === element) {
                merTypeArr.push(this.merTypeId[i])
              }
            });
          }
            this.$emit('selectMerTypeData', merTypeArr.join(','))
        }
    }
};
</script>

<style lang="sass" scoped>

</style>


