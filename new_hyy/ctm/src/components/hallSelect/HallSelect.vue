<template>
  <section>
    <el-dialog title="选择影厅" :visible.sync="dialogVisible">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="影厅名称：">
          <el-input v-model="formInline.hallName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="findAllHall">查 询</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="影厅名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="code" label="影厅编码" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="type" label="影厅类型" show-overflow-tooltip>
        </el-table-column>
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
  name: 'HallSelect',
  props: {
    cinemaUid: {
      type: String,
      require: true
    }
  },

  data () {
    return {
      dialogVisible: false,
      multipleSelection: [],
      tableData: [],
      formInline: {
        hallName: ''
      }

    };
  },
  methods: {
    confirmSelect () {
      this.$emit('getData', this.multipleSelection);
      this.dialogVisible = false;
    },

    handleDialogVisible (val) {
      this.dialogVisible = val;
      this.findAllHall();
    },

    handleSelectionChange (val) {
      this.multipleSelection = val;
    },

    findAllHall () {
      this.$ctmList.findAllHall({
        cinemaUid: this.cinemaUid
      }).then(res => {
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