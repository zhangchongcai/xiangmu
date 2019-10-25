<template>
  <el-select v-model="merTypeObj.value" placeholder="请选择" popper-class="rpt-select" @change="changeSelect" class="mer-type" multiple>
    <el-option v-for="(item, index) in merTypeData" :key="index" :label="item" :value="item">
      <span style="color: #8492a6; font-size: 13px">{{ item }}</span>
    </el-option>
  </el-select>
</template>

<script>
import { multiSelectionStyleFunc } from 'rptSrc/util/commonFunc';
export default {
  props: {
    resetStatus: Boolean,
    merTypeObj: Object
  },
  data () {
    return {
      merTypeData: ['单品', '原材料', '合成品', '套餐', '服务商品'],
      merTypeId: [1, 5, 2, 4, 3]
    };
  },
  methods: {
    changeSelect (val) {
      let merTypeArr = [];
      for (let i = 0; i < this.merTypeData.length; i++) {
        this.merTypeObj.value.forEach(element => {
          if (this.merTypeData[i] === element) {
            merTypeArr.push(this.merTypeData[i]);
          }
        });
      }
      multiSelectionStyleFunc('mer-type', merTypeArr);
      this.$emit('selectMerTypeData', merTypeArr.join(','));
    }
  },
  mounted () {
    multiSelectionStyleFunc('mer-type', this.merTypeObj.value);
  },
  watch: {
    resetStatus (newVal) {
      if (newVal) {
        this.merTypeObj.value = [];
        multiSelectionStyleFunc('mer-type', []);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-select__tags {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  width: 130px !important;
}

li.selected span {
  color: #3b74ff !important;
}
</style>


