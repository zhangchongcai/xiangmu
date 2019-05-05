<template>
  <div class="apply-stores">
    <el-select
      v-model="type"
      placeholder="请选择"
      class="apply-select"
      @change="handleApplyChange(type)"
    >
      <el-option v-for="item in radios" :key="item.type" :label="item.label" :value="item.type"></el-option>
    </el-select>
    <span class="apply-tag" v-if="type!=0">
      <el-input
        class="input apply-stores-input"
        v-model="currentChecked.name"
        :disabled="currentChecked.name ?true:false"
        placeholder="请选择"
        @focus="setCheckedKeys(type)"
      >
        <i
          slot="suffix"
          v-if="currentChecked.name"
          class="el-icon-close icon"
          @click.stop="handleDelete"
        ></i>
      </el-input>
      <el-button v-if="currentChecked.name" @click.stop="setCheckedKeys(type)">编辑</el-button>
    </span>
    <!-- 选择门店 -->
    <el-dialog :visible.sync="applyDialog">
      <div>
        <el-form :inline="true" label-position="right" label-suffix=":">
          <el-form-item :label="title">
            <el-input placeholder="请输入你要查询的内容" v-model="filterQueryValue">
              <el-button slot="append" icon="el-icon-search" @click="handleQuery(filterQueryValue)"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="apply-tree">
        <el-row>
          <el-col :span="24">
            <el-tree
              :data="sourceTreeData"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              :default-expanded-keys="defaultCheckedKys"
              :filter-node-method="filterNode"
              ref="applyTree"
            >></el-tree>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="applyDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleApplySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
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
  data() {
    return {
      type: this.defaultSelected,
      currentChecked: {},
      applyInput: "",
      filterQueryValue: "", //筛选值
      applyDialog: false,
      defaultCheckedKys: [],
      sourceTreeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "中大影院"
                },
                {
                  id: 10,
                  label: "客村影院"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "大学城影院"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted() {},
  methods: {
    //切换
    handleApplyChange(type) {
      let tempArr = this.radios.filter(item => {
        return item.type == type;
      });
      this.currentChecked = tempArr[0];
      this.$emit("onCheckedNodes", {
        type: this.type,
        value: this.currentChecked.value || []
      });
    },
    setCheckedKeys() {
      this.applyDialog = true;
      this.$nextTick(() => {
        this.defaultCheckedKys = this.currentChecked.checkedKys;
        this.$refs.applyTree.setCheckedKeys(this.defaultCheckedKys);
      });
      console.log(this.defaultCheckedKys);
    },
    handleDelete(item) {
      this.currentChecked.name = "";
      this.currentChecked.value = [];
      this.currentChecked.checkedKys = [];
      let tempObj = {
        type: this.type,
        value: []
      };
      this.$emit("onCheckedNodes", tempObj);
      // console.log(this.radios);
    },
    // 筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //查询
    handleQuery(val) {
      this.$refs.applyTree.filter(val);
    },
    //选择
    handleApplySubmit(value) {
      let checkedNodes = this.$refs.applyTree.getCheckedNodes(true);
      let tempObj = {
        type: this.type,
        value: checkedNodes
      };
      this.$emit("onCheckedNodes", tempObj);
      this.applyDialog = false;
    }
  },
  computed: {},
  watch: {
    filterQueryValue(val) {
      this.$refs.applyTree.filter(val);
    }
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