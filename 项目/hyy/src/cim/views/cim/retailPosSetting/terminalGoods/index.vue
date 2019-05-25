<template>
  <div>
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="门店名称" class="select-input">
          <el-input v-model="queryData.supplierName" placeholder="请选择门店"></el-input>
          <el-button @click="handleDialogEvent('refCinemalDialog')">请选择</el-button>
        </el-form-item>
        <el-form-item label="常用商品设置">
          <el-button @click="addBlankBlock">添加空白块</el-button>
          <el-button @click="handleDialogEvent('refGoodSelectedDialog')">添加常用商品</el-button>
          <el-button>保存</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="draggable-box">
      <draggable-goods v-model="userGoodlist"></draggable-goods>
    </div>

    <div class="common-header">
      <el-button
        class="own-terminal"
        @click="handleDialogEvent('refTerminalSelectedDialog')"
      >添加独立终端设置</el-button>
      <el-table :data="ownTerminalTableData" stripe>
        <el-table-column
          v-for="item in ownTerminalTableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" style="width:180px;">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click.stop="handleOperateEvent('1',row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleOperateEvent('2',row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div>
      <div class="common-header">
        <el-button class="own-terminal" @click="handleDialogEvent('refGoodSelectedDialog')">推荐商品设置</el-button>
        <span>推荐商品设置(最多选4种)</span>
      </div>
      <div class="draggable-box">
        <draggable-goods v-model="recommendGoodlist"></draggable-goods>
      </div>
    </div>

    <div class="common-header">
      <el-button
        class="own-terminal"
        @click="handleDialogEvent('refTerminalSelectedDialog')"
      >添加独立终端设置</el-button>
      <el-table :data="ownTerminalTableData" stripe>
        <el-table-column
          v-for="item in ownTerminalTableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作" style="width:180px;">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click.stop="handleOperateEvent('1',row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleOperateEvent('2',row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="refCinemalDialog"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="refSuppliersDialog"></suppliers-dialog>
    <!-- 选择商品弹窗 -->
    <good-selected-dialog ref="refGoodSelectedDialog"></good-selected-dialog>
    <!-- 选择终端弹窗 -->
    <terminal-selected-dialog ref="refTerminalSelectedDialog" :title="'添加独立终端设置'"></terminal-selected-dialog>
  </div>
</template>
<script>
import draggable from "vuedraggable";
import sortable from "sortablejs";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
import goodSelectedDialog from "cim/dialogs/cimSelectedGoods/index.vue";
import terminalSelectedDialog from "cim/components/terminalSelectedDialog/terminalSelectedDialog.vue";
import draggableGoods from "cim/components/draggableGoods/draggableGoods.vue";
export default {
  data() {
    return {
      queryData: {
        supplierName: ""
      },
      userGoodlist: [
        {
          name: "可口可乐",
          price: "¥15.00",
          color: "red",
          id: Math.random()
        },
        {
          name: "雪碧",
          price: "¥12.00",
          color: "blue",
          id: Math.random()
        },
        {
          id: Math.random()
        },
        {
          name: "辣条",
          price: "¥15.00",
          color: "yellow",
          id: Math.random()
        },
        {
          name: "鸡蛋",
          price: "¥15.00",
          id: Math.random()
        },
        {
          name: "薯条",
          price: "¥19.00",
          color: "#67393E",
          id: Math.random()
        },
        {
          name: "蛋卷",
          price: "¥30.00",
          id: Math.random()
        },
        {
          name: "鸡翅",
          price: "¥13.00",
          color: "#67C23A",
          id: Math.random()
        },
        {
          name: "爆米花",
          price: "¥5.00",
          color: "#003E3E",
          id: Math.random()
        },
        {
          name: "烧鸭",
          price: "¥8.00",
          color: "#CA8EFF",
          id: Math.random()
        },
        {
          name: "咪咪",
          price: "¥11.00",
          id: Math.random()
        }
      ],
      recommendGoodlist: [
        {
          name: "可口可乐",
          price: "¥15.00",
          color: "red",
          id: Math.random()
        },
        {
          name: "雪碧",
          price: "¥12.00",
          color: "blue",
          id: Math.random()
        },
        {
          id: Math.random()
        },
        {
          name: "辣条",
          price: "¥15.00",
          color: "yellow",
          id: Math.random()
        },
        {
          name: "鸡蛋",
          price: "¥15.00",
          id: Math.random()
        },
        {
          name: "薯条",
          price: "¥19.00",
          color: "#67393E",
          id: Math.random()
        },
        {
          name: "蛋卷",
          price: "¥30.00",
          id: Math.random()
        },
        {
          name: "鸡翅",
          price: "¥13.00",
          color: "#67C23A",
          id: Math.random()
        },
      ],
      // 独立表格表头
      ownTerminalTableColumn: [
        {
          label: "序号",
          key: "supplierCode"
        },
        {
          label: "适用终端",
          key: "supplierName"
        }
      ],
      // 表格数据
      ownTerminalTableData: [
        {
          supplierCode: 1,
          supplierName: 100254
        }
      ]
    };
  },
  methods: {
    onQuery() {
      console.log(this.userGoodlist);
    },
    // //设置颜色
    // handleSetColor(item) {
    //   this.colorDialogVisible = true;
    //   this.currentSelectColor.id = item.id;
    //   console.log(this.currentSelectColor);
    // },
    //添加空白块
    addBlankBlock() {
      this.userGoodlist.push({
        id: Math.random()
      });
    },

    addOwnTerminal() {},
    handleDialogEvent(name) {
      this.$refs[name].handleDialog(true);
    },
    handleOperateEvent() {
      this.handleDialogEvent('refTerminalSelectedDialog')
    }
  },
  watch: {
    userGoodlist: function(newVal) {
      console.log(newVal);
    }
  },
  components: {
    draggable,
    sortable,
    cinemalDialog,
    suppliersDialog,
    goodSelectedDialog,
    terminalSelectedDialog,
    draggableGoods
  }
};
</script>
<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";

.el-form--inline .el-form-item {
  // margin-right: 40px;
}
.select-input {
  .el-input {
    width: 150px;
  }
}
.draggable-box {
  width: 800px;
}
.own-terminal {
  margin-bottom: 20px;
}
.draggable-box {
  padding-bottom: 10px;
}
</style>
