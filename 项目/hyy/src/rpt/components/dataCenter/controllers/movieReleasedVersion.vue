<template>
  <div>
    <el-select
      popper-class="rpt-select"
      v-model="movieReleasedVersion"
      placeholder="请选择"
      @change="getdataValue"
      @focus="focusBTn"
      class="released-version"
      multiple
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in options"
        :key="`realeasedVersion_${item.id}`"
        :label="item.propertyValue"
        v-loading="loading"
        :value="item.propertyCode"
      ></el-option>
    </el-select>
  </div>
</template>
<script type="text/javascript">
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    selectValue: {
      type: null | Object,
      default: "",
      require: true
    },
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: ["movieReleasedVersion"],
      subComName: "movieVersion",
      newselectValue: this.selectValue,
      options: [],
      channelName: this.selectValue.defVALUE,
      loading: false,
      movieReleasedVersion: []
    };
  },
  methods: {
    //选择触发事件
    getdataValue(selVal) {
      let releasedVersionDom = document.getElementsByClassName(
        "released-version"
      );
      let el = releasedVersionDom[0].children[0];
      console.log(el);
      let el_span = el.querySelector("span");
      el_span && el.removeChild(el_span);
      el.style.padding = " 0 10px";
      el.style.textOverflow = "ellipsis";
      el.style.fontSize = "12px";
      let valueArr = [];
      selVal.forEach(element1 => {
        this.options.forEach(element2 => {
          element1 == element2.propertyCode
            ? valueArr.push(element2.propertyValue)
            : null;
        });
      });
      el.textContent = String(valueArr).replace(/,/g, "、");
      this.$emit("selectmovieReleasedVersionData", selVal.join(","));
    },
    focusBTn() {
      this.$rptList.movieReleasedVersion().then(res => {
        if (res.code == 200) {
          this.options = res.data.propertyList;
        }
      });
    },
    getDatacenterSucc(res) {
      this.options = res.data.data.result;
    }
  },
  watch: {
    selectValue(newVal, oldVal) {
      this.newselectValue = newVal;
    },
    resetStatus(newVal) {
      if (newVal) {
        this.movieReleasedVersion = [];
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
