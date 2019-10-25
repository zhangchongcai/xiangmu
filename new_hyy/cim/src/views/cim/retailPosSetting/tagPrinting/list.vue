<template>
  <div class="tag-printing-list">
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="商品名称">
          <el-input v-model="queryData.merName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="queryData.merCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="SKU编码">
          <el-input v-model="queryData.skuCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="速记代码">
          <el-input v-model="queryData.barCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-button class="query-btn" type="primary" @click="onQuery()">查询</el-button>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleAddGoodEvent">添加商品</el-button>
        <el-button type="primary" size="small" plain @click="handleBatchesDelete">批量删除</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe v-loading="tableLoding" ref="goodsTable" row-key="uid" @selection-change="handleSelectionTable">
          <el-table-column type="selection" width="40" reserve-selection></el-table-column>
          <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.page" :page-sizes="[10,20,30]" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <selected-goods :autoClose="false" :dialogVisible.sync="selectedGoodsDialogVisible" @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"></selected-goods>
  </div>
</template>

<script>
// import mixins from "frame_cpm/mixins/cacheMixin";
import selectedGoods from 'cimSrc/dialogs/cimSelectedGoods/index.vue';
const { cacheMixin } = requireModule('base');

export default {
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['queryData'],
      // 查询数据
      queryData: {
        // cinemaUid: "745498",
        merName: '',
        merCode: '',
        skuCode: '',
        barCode: '',
        page: 1,
        pageSize: 10
      },
      // 数据总数
      total: 0,
      tableLoding: false,
      // 表格表头
      tableColumn: [
        {
          label: '商品名称',
          key: 'merName'
        },
        {
          label: '商品编码',
          key: 'merCode'
        },
        {
          label: 'SKU编码',
          key: 'skuCode'
        },
        {
          label: '速记代码',
          key: 'shorthandCode'
        },
        {
          label: '商品规格',
          key: 'merSpec'
        },
        {
          label: '基本单位',
          key: 'unitName'
        }
      ],
      // 表格数据
      tableData: [],
      selectedgoods: [],
      changeRules: {},
      selectedGoodsDialogVisible: false
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    // 初始化
    init () {
      this.onQuery();
    },
    // 查询
    onQuery () {
      // console.log(this.queryData);
      this.labelConfigurationQueryLabel(this.queryData);
    },
    handleSelectionTable (value) {
      this.selectedgoods = value;
    },
    // 查询
    labelConfigurationQueryLabel (param) {
      this.tableLoding = true;
      this.$cimList.posSetting
        .labelConfigurationQueryLabel(param)
        .then(resData => {
          if (resData.code == 200) {
            this.tableData = resData.data.list.map(item => {
              // 单品
              if (item.merType == 1) {
                item.merName = item.skuName;
              }
              // 合成品
              if (item.merType == 2) {
                if (item.skuName) {
                  item.merName = item.merName + '-' + item.skuName;
                }
              }
              return item;
            });
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        })
        .catch(() => {
          this.tableLoding = false;
        });
    },
    // 删除
    labelConfigurationDeleteLabel (param) {
      this.$cimList.posSetting
        .labelConfigurationDeleteLabel(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.onQuery();
          } else {
            this.$message({
              message: resData.msg
            });
          }
        });
    },
    // 多个删除
    labelConfigurationDeleteLabelList (param) {
      this.$cimList.posSetting
        .labelConfigurationDeleteLabelList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$refs.goodsTable.clearSelection();
            this.onQuery();
          } else {
            this.$message({
              message: resData.msg
            });
          }
        });
    },
    // 添加商品
    handleAddGoodEvent () {
      this.selectedGoodsDialogVisible = true;
    },
    handleBatchesDelete () {
      if (this.selectedgoods.length == 0) {
        this.$message({
          message: '请选择至少一个选项!'
        });
        return;
      }
      let printUidList = this.selectedgoods.map(item => {
        return item.uid;
      });
      this.$confirm(
        "<i class='el-icon-circle-close'></i><span>确定删除吗?</span>",
        {
          customClass: 'retail-style',
          dangerouslyUseHTMLString: true,
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          center: true
        }
      )
        .then(() => {
          this.labelConfigurationDeleteLabelList({
            cinemaUid: this.queryData.cinemaUid,
            printUidList: printUidList
          });
        })
        .catch(() => { });
    },
    selectedGoodsDialogCallBack (value) {
      if (value.btnType == 1) {
        let params = value.data.map(item => {
          return {
            // cinemaUid: '745498',
            merUid: item.uid,
            skuUid: item.skuUid
          };
        });
        this.labelConfigurationSaveLabel(params);
      }
    },
    // 添加标签
    labelConfigurationSaveLabel (param) {
      this.$cimList.posSetting
        .labelConfigurationSaveLabel(param)
        .then(resData => {
          if (resData.code == 200) {
            this.selectedGoodsDialogVisible = false;
            this.onQuery();
          } else {
            this.$message({
              message: resData.msg
            });
          }
        });
    },
    jumpPage (param = {}) {
      this.$router.push({
        path: '/retail/posSetting/suppliers/common',
        query: param
      });
    },
    handleOperateEvent (type, row) {
      switch (type) {
        case '1':
          break;
        case '2':
          break;
        case '3':
          break;
        case '4':
          // 删除
          this.$confirm(
            "<i class='el-icon-circle-close'></i><span>确定删除吗?</span>",
            {
              customClass: 'retail-style',
              dangerouslyUseHTMLString: true,
              cancelButtonText: '取消',
              confirmButtonText: '确定',
              center: true
            }
          )
            .then(() => {
              this.labelConfigurationDeleteLabel({
                cinemaUid: this.queryData.cinemaUid,
                printUid: row.uid
              });
            })
            .catch(() => { });
          break;
      }
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.onQuery();
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.onQuery();
      // console.log(`当前页: ${val}`);
    }
  },
  components: {
    selectedGoods
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.tag-printing-list {
}
</style>