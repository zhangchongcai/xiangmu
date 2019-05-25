<template>
  <section>
    <el-dialog title="选择支付方式" :visible.sync="visible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="支付方式名称：">
          <el-input v-model="formInline.payTypeName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="selectForTenant">查 询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="payTypeName" label="支付方式" show-overflow-tooltip></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmSelect">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
export default {
  name: "PayType",
  props: {
    cinemaUidList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    payTypeData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      visible: false,
      multipleSelection: [],
      tableData: this.payTypeData,
      formInline: {
        payTypeName: ""
      }
    };
  },
  watch: {
    dialogVisible(val) {
      console.log(val);
      this.visible = val;
    },
    payTypeData: {
      handler(newVal, oldVal) {
        this.tableData = JSON.parse(JSON.stringify(newVal))
      }
    }
  },
  methods: {
    confirmSelect() {
      let payType = [];
      this.multipleSelection.forEach(element => {
        payType.push(element.payTypeName);
      });
      this.$emit("getData", payType.join(","));
      this.visible = false;
    },

    // handleDialogVisible(val) {
    //   this.visible = val;
    // },

    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    selectForTenant() {
      console.log(this.formInline.payTypeName)
      this.$rptList
        .selectForTenant({
          cinemaUidList: this.cinemaUidList,
          payTypeName: this.formInline.payTypeName
        })
        .then(res => {
          console.log(res);
          if (res.code === 200) {
            this.tableData = res.data;
          } else {
            this.error(res.msg);
          }
        });
    }
  }
};
</script>

<style scoped>
</style>
