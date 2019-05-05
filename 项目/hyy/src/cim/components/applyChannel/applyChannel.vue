<template>
  <div>
    <el-radio-group v-model="type" @change="handleApplyChange">
      <el-radio v-for="(item) in radios" @click.native="(item)" :label="item.type" :key="item.type">
        {{item.label}}
        <span class="apply-tag" v-if="item.type!=0 && item.type == type">
          <el-input
            class="input"
            v-model="item.name"
            placeholder="请选择"
            :disabled="item.name ?true:false"
            @focus="setCheckedKeys(item.type)"
          >
            <i
              slot="suffix"
              v-if="item.name"
              class="el-icon-close icon"
              @click.stop="handleDelete(item)"
            ></i>
          </el-input>
          <el-button @click.stop="setCheckedKeys(item.type)" v-if="item.name">编辑</el-button>
        </span>
      </el-radio>
    </el-radio-group>
    <!-- 选择门店 -->
    <el-dialog :title="title" :visible.sync="applyDialog">
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
              :data="sourceData"
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
      filterQueryValue: "", //筛选值
      applyDialog: false,
      defaultCheckedKys: [],
      currentChecked: [],
      sourceData: [
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
                  label: "渠道一"
                },
                {
                  id: 10,
                  label: "渠道二"
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
      //  this.$emit("onRadioChange", this.type);
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
      item.name = "";
      item.value = [];
      item.checkedKys = [];
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
    handleApplySubmit() {
      let checkedNodes = this.$refs.applyTree.getCheckedNodes(true);
      let tempObj = {
        type: this.type,
        value: checkedNodes
      };
      this.$emit("onCheckedNodes", tempObj);
      this.applyDialog = false;
    }
  },
  computed: {
    showCheckedNodes() {}
  },
  watch: {
    filterQueryValue(val) {
      this.$refs.applyTree.filter(val);
    }
  }
};
</script>


<style lang="scss">
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
    margin-top: 6px;
  }
  .el-icon-more {
    font-size: 22px;
    position: absolute;
  }
}
</style>