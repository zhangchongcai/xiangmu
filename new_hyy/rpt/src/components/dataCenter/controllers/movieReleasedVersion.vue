<template>
  <div>
    <el-select popper-class="rpt-select" v-model="movieReleasedVersionObj.movieReleasedVersion" placeholder="请选择" @change="getdataValue" @focus="focusBTn" class="released-version" multiple>
      <el-option v-for="item in options" :key="`realeasedVersion_${item.id}`" :label="item.keyName" :value="item.keyName"></el-option>
    </el-select>
  </div>
</template>
<script type="text/javascript">
import { multiSelectionStyleFunc } from 'rptSrc/util/commonFunc';
export default {
  props: {
    resetStatus: Boolean,
    movieReleasedVersionObj: Object
  },
  data () {
    return {
      options: []
    };
  },
  methods: {
    getdataValue (selVal) {
      multiSelectionStyleFunc('released-version', selVal);
      this.$emit('selectmovieReleasedVersionData', selVal.join(','));
    },
    focusBTn () {
      this.$rptList.movieReleasedVersion().then(res => {
        if (res.code == 200) {
          this.options = res.data;
        }
      });
    }
  },
  mounted () {
    multiSelectionStyleFunc(
      'released-version',
      this.movieReleasedVersionObj.movieReleasedVersion
    );
  },
  watch: {
    resetStatus (newVal) {
      if (newVal) {
        this.movieReleasedVersionObj.movieReleasedVersion = [];
        multiSelectionStyleFunc('released-version', []);
        this.$forceUpdate();
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
