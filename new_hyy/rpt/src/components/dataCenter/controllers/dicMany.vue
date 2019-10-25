<template>
  <div>
    <el-select popper-class="rpt-select" v-model="dicManyObj.dicVal" placeholder="请选择" @change="getdataValue" @focus="focusBTn" class="dic-many" multiple>
      <el-option v-for="item in options" :key="`dicMany_${item.id}`" :label="item.dicName" :value="item.dicVal"></el-option>
    </el-select>
  </div>
</template>
<script type="text/javascript">
import { multiSelectionStyleFunc } from 'rptSrc/util/commonFunc';
export default {
  props: {
    resetStatus: Boolean,
    queryData: Object,
    dicManyObj: Object
  },
  data () {
    return {
      options: []
    };
  },
  methods: {
    getdataValue (selVal) {
      this.dicManyObj.dicName = [];
      selVal.forEach(element1 => {
        this.options.forEach(element2 => {
          if (element1 == element2.dicVal) {
            this.dicManyObj.dicName.push(element2.dicName);
          }
        });
      });
      multiSelectionStyleFunc('dic-many', this.dicManyObj.dicName);
      this.queryData.queryColValue = selVal.join(',');
    },
    focusBTn () {
      this.$rptList.gitDicData(this.queryData.dicTag).then(res => {
        this.options = res;
      });
    }
  },
  mounted () {
    multiSelectionStyleFunc(
      'dic-many',
      this.dicManyObj.dicName
    );
  },
  watch: {
    resetStatus (newVal) {
      if (newVal) {
        this.queryData.queryColValue = '';
        this.dicManyObj.dicVal = [];
        this.dicManyObj.dicName = [];
        multiSelectionStyleFunc('dic-many', []);
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
