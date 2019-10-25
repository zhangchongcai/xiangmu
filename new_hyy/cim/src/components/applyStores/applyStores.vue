<template>
  <div class="apply-stores">
    <el-select v-model="selected" placeholder="请选择" class="apply-select" @change="handleApplyChange(defaultSelected)">
      <el-option v-for="item in radios" :key="item.type" :label="item.label" :value="item.type"></el-option>
    </el-select>
    <span class="apply-tag" v-if="defaultSelected!='1'">
      <el-input class="input apply-stores-input" v-model="currentChecked.name" :disabled="currentChecked.name ? true:false" placeholder="请选择">
        <i slot="suffix" v-if="currentChecked.name" class="el-icon-close icon" @click.stop="handleDelete"></i>
      </el-input>
      <el-button v-if="currentChecked.name" @click.stop="handleEdit">编辑</el-button>
    </span>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" multiple :title="'选择适用门店'"></cinemal-dialog>

  </div>
</template>

<script>
import cinemalDialog from 'cimSrc/components/cinemalDialog/cinemaDialog.vue';

export default {
  props: {
    title: {
      type: String
      // default: false
    },
    defaultSelected: {
      type: [Number, String]
      // default: false
    },
    radios: {
      type: Array,
      default: [],
      required: true
    }
  },
  data () {
    return {

      currentChecked: {},
      defaultCheckedKys: []
    };
  },
  mounted () {
    console.log(this.radios);
  },
  methods: {
    // 切换
    handleApplyChange (type) {
      let tempArr = this.radios.filter(item => {
        return item.type == type;
      });
      this.currentChecked = tempArr[0];
    },
    handleDelete (item) {
      // this.currentChecked.name = "";
      // this.currentChecked.value = [];
      // this.currentChecked.checkedKys = [];
      // let tempObj = {
      //   type: this.defaultSelected,
      //   value: []
      // };
      // this.$emit("onCheckedNodes", tempObj);
      // console.log(this.radios);
    },
    handleEdit () {
      this.selectCinemalDialog();
    },
    onCinemalSumit (data) {
      console.log('daasda', data);
    },
    selectCinemalDialog () {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    // 筛选
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },
  computed: {
    selected () {
      return this.defaultSelected;
    }
  },
  components: {
    cinemalDialog
  },
  watch: {

  }
};
</script>


<style lang="scss">
.apply-stores {
  .apply-select {
    width: 110px;
  }
  .apply-tree {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .apply-tag {
    margin-left: 10px;
    margin-right: 10px;

    .input {
      width: 200px;
    }
    .icon {
      cursor: pointer;
      font-size: 18px;
      margin-top: 12px;
    }
    .el-icon-more {
      font-size: 22px;
      position: absolute;
    }
  }
  .apply-stores-input {
    cursor: pointer;
  }
}
</style>