<template>
  <div>
    <dialogWarp :dialogVisible="dialogVisible" :name="customTitle" @crmDialogOutputFlag="handleCrmDialogFlag">
      <div class="__crm-available-coupon-wrap">
        <el-form :inline="true" :model="formData" ref="formData" class="__crm-available-coupon-search _custom-search-item">
          <el-form-item label="等级名称" prop="levelName">
            <el-input v-model="formData.levelName" placeholder="等级名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="等级编号" prop="levelNo">
            <el-input v-model="formData.levelNo" placeholder="等级编号" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
            <!-- <el-button @click="resetForm('formData')" class="_el-btn-custom">重置</el-button> -->
          </el-form-item>
        </el-form>
        <div class="__crm-available-coupon-dialog-content-wrap _crm-member-level-dialog-wrap">
          <div class="__crm-available-coupon-dialog-content-left">
            <div class="__crm-available-coupon-dialog-table _m-member-table-custom">
              <el-table ref="multipleTable" :empty-text="tipMessage" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect" :row-key="getRowKeys">
                <el-table-column type="selection" width="55" :reserve-selection="true">
                </el-table-column>
                <el-table-column prop="levelNo" :formatter="emptyShow" label="会员等级编号" min-width="75" show-overflow-tooltip></el-table-column>
                <el-table-column prop="levelName" :formatter="emptyShow" label="会员等级名称" min-width="75" show-overflow-tooltip></el-table-column>
                <el-table-column :formatter="emptyShow" label="会员升级规则" min-width="230" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.levelNo == '1'" class="ordinary">
                      当前等级为最低，无法添加升级规则
                    </span>
                    <span v-else class="no-ordinary">
                      升级标准：定级周期内成长值达到{{scope.row.levelupGrowth}}点;
                      保级标准：定级周期内成长值达到{{scope.row.saveGrowth}}点
                    </span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="__crm-available-coupon-dialog-content-right">
            <div class="__content-right-wrap">
              <div class="__content-right-title">
                已选等级
              </div>
              <div class="__clear-btn" @click="handleEmpty">清空</div>
            </div>
            <ul class="__selected-equity-wrap">
              <li class="__selected-equity-item-inner" v-for="(item, index) of multipleSelectionItem" :key="index">
                <div class="__selected-equity-name-desc">{{item.levelName}}</div>
                <i class="el-icon-close __dialog-icon-delete" @click="dialogDeleteEquity(index)"></i>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </dialogWarp>
  </div>
</template>
<script type="text/javascript">
import dialogWarp from '../views/member/components/dialogWarp/dialogWarp';

export default {
  data () {
    return {
      oldData: [
        { levelNo: '1', levelName: '普通会员', saveGrowth: 0, levelupGrowth: 0 }
      ],
      tipMessage: '',
      // 查询卡政策的数据
      formData: {
        levelName: '', // 等级名称
        levelNo: '' // 等级编号
      },
      multipleSelectionItem: [], // 临时选择的自有权益
      callBackData: [], // 暴露出去的已选数据
      tableData: [
        { levelNo: '1', levelName: '普通会员', saveGrowth: 0, levelupGrowth: 0 }
      ]
    };
  },
  components: {
    dialogWarp
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    innerData: {
      // 默认查询的基础数据（查询条件）
      type: Object,
      default: () => { }
    },
    reviewData: {
      // 回显数据
      type: Array,
      default: () => []
    },
    disableData: {
      // 禁选数据
      type: Array,
      default: () => []
    },
    whereUse: {
      // 调用弹窗的识别参数
      type: String,
      default: 'mainPageUnique'
    },
    customTitle: {
      // 自定义弹窗title
      type: String,
      default: '会员等级'
    }
  },
  created () { },
  mounted () {
    this.multipleSelectionItem = this.reviewData;
    // this.search();
  },
  watch: {
    dialogVisible: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.multipleSelectionItem = this.reviewData;
          this.search();
        }
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
    // dialog内删除已选权益
    dialogDeleteEquity (index) {
      this.multipleSelectionItem.splice(index, 1);
      this.$refs.multipleTable.clearSelection();
      this.rowMultipleChecked(this.multipleSelectionItem);
    },
    // 清空dialog内已选权益
    handleEmpty () {
      this.multipleSelectionItem = [];
      this.$refs.multipleTable.clearSelection();
    },
    // 筛选表格数据
    formatData (data) {
      !this.formData.levelNo || data.levelNo.indexOf(this.formData.levelNo);
    },
    // 点击搜索按钮
    handleSearch () {
      this.$set(
        this,
        'tableData',
        this.oldData.filter(data => {
          if (!this.formData.levelNo && !this.formData.levelName) {
            return true;
          } else if (this.formData.levelNo && !this.formData.levelName) {
            return data.levelNo.includes(this.formData.levelNo);
          } else if (!this.formData.levelNo && this.formData.levelName) {
            return data.levelName.includes(this.formData.levelName);
          } else {
            return (
              data.levelNo.includes(this.formData.levelNo) &&
              data.levelName.includes(this.formData.levelName)
            );
          }
        })
      );
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    // 搜索自有权益
    search () {
      this.tipMessage = '数据加载中...';
      this.$crmList
        .getLevelDetail({ tenantId: this.$store.state.loginUser.consumerId })
        .then(data => {
          this.tipMessage = '暂无数据';
          if (!data.memberLevelRuleVOList) {
            this.tipMessage = '暂无数据';
          }
          this.tableData = data.memberLevelRuleVOList
            ? data.memberLevelRuleVOList
            : [
              {
                levelNo: '1',
                levelName: '普通会员',
                saveGrowth: 0,
                levelupGrowth: 0
              }
            ];
          this.oldData = data.memberLevelRuleVOList
            ? data.memberLevelRuleVOList
            : [
              {
                levelNo: '1',
                levelName: '普通会员',
                saveGrowth: 0,
                levelupGrowth: 0
              }
            ];
          this.$refs.multipleTable.clearSelection();
          this.rowMultipleChecked(this.multipleSelectionItem);
        })
        .catch(err => {
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = '系统繁忙，请稍后重试！';
          }
        });
    },
    // 数据为空格式化
    emptyShow (row, column, cellValue, index) {
      if (cellValue == null || cellValue == undefined || cellValue === '') {
        return '-';
      } else {
        return cellValue;
      }
    },
    getRowKeys (row) {
      return row.id;
    },
    // 单一数据toggle
    rowOneToggle (row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.levelNo == this.multipleSelectionItem[index].levelNo) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    // 单一数据add
    rowOneAdde (row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.levelNo == this.multipleSelectionItem[index].levelNo) {
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    // 单一数据reomove
    rowOneRemove (row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (row.levelNo == this.multipleSelectionItem[index].levelNo) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
    },
    // 手动选择卡类型
    handleSelect (selection, row) {
      if (row) {
        this.rowOneToggle(row);
      } else {
        if (selection.length == 0) {
          for (let index = 0; index < this.tableData.length; index++) {
            const item = this.tableData[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
    },
    // 卡类型回显
    rowMultipleChecked (selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableData.length; k++) {
            if (selectedArr[i].levelNo == this.tableData[k].levelNo) {
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[k],
                true
              );
              break;
            }
          }
        }
      }
    },
    handleCrmDialogFlag (flag) {
      this.$emit('update:dialogVisible', false);
      if (flag == 1) {
        this.callBackData = new Array(...this.multipleSelectionItem);
      } else if (flag == 0) {
        this.multipleSelectionItem = new Array(...this.reviewData);
      }
      var selectedData = {
        btnType: flag,
        whereUse: this.whereUse,
        data: this.callBackData
      };
      this.$emit('crmMemberLevelDialogCallBack', selectedData);
    }
  }
};
</script>
<style lang="scss">
._crm-member-level-dialog-wrap {
  .el-table__body-wrapper {
    height: 396px !important;
  }
  .no-ordinary,
  .ordinary {
    font-size: 12px;
    color: #333;
  }
}
</style>