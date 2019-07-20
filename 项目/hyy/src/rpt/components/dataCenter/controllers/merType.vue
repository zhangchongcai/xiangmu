<template>
  <el-select
    v-model="value"
    placeholder="请选择"
    popper-class="el_select"
    @change="changeSelect"
    class="mer-type"
    multiple
  >
    <el-option v-for="(item, index) in merTypeData" :key="index" :label="item" :value="item">
      <span style="color: #8492a6; font-size: 13px">{{ item }}</span>
    </el-option>
  </el-select>
</template>

<script>
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: [
        "value"
      ],
      subComName: "merType",
      value: [],
      merTypeData: ["单品", "原材料", "合成品", "套餐", "服务商品"],
      merTypeId: [1, 5, 2, 4, 3]
    };
  },
  methods: {
    changeSelect(val) {
      let merTypeDom = document.getElementsByClassName(
        "mer-type"
      );
      let el = merTypeDom[0].children[0];
      console.log(el);
      let el_span = el.querySelector("span");
      el_span && el.removeChild(el_span);
      el.style.padding = " 0 10px";
      el.style.textOverflow = "ellipsis";
      el.style.fontSize = "12px";
      el.textContent = String(val).replace(/,/g, "、");
      let merTypeArr = [];
      for (let i = 0; i < this.merTypeData.length; i++) {
        this.value.forEach(element => {
          if (this.merTypeData[i] === element) {
            merTypeArr.push(this.merTypeData[i]);
          }
        });
      }
      this.$emit("selectMerTypeData", merTypeArr.join(","));
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.value = [];
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


