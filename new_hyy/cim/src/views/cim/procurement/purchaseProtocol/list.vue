<template>
  <div class="purchase-note-list">
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="协议编码">
          <el-input v-model="queryData.code" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="供应商名称">
          <el-input v-model="queryData.supName" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="有效" value="1"></el-option>
            <el-option label="无效" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button class="query-btn" type="primary" @click="onQuery()">查询</el-button>
      </el-form>
    </div>
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe v-loading="tableLoding">
          <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)">编辑</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="queryData.page" :page-sizes="pageSizes" :page-size.sync="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
// import mixins from "frame_cpm/mixins/cacheMixin";
const { cacheMixin } = requireModule('base');

export default {
  mixins: [mixin, cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['queryData'],
      // 查询数据
      queryData: {
        code: '', // 采购单号
        supName: '', // 供应商名称
        status: '',
        page: 1,
        pageSize: 10
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: '协议编码',
          key: 'code'
        },
        {
          label: '协议名称',
          key: 'name'
        },
        {
          label: '供应商名称',
          key: 'supName'
        },
        {
          label: '有效期',
          key: 'effectiveStr'
        },

        {
          label: '状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 1:
                result = '有效';
                break;
              case 0:
                result = '无效';
                break;
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
      tableData: [],
      tableLoding: false
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
      this.getAgreementList(this.queryData);
    },
    // 查询
    getAgreementList (param) {
      this.tableLoding = true;
      this.$cimList.procurement
        .agreementQueryPage(param)
        .then(resData => {
          if (resData.code == 200) {
            this.tableData = resData.data.list;
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        })
        .catch(() => {
          this.tableLoding = false;
        });
    },
    // 新建
    handleNewBuilt () {
      this.jumpPage({
        type: '1'
      });
    },
    jumpPage (param = {}) {
      let router = '';
      switch (param.type) {
        case '1':
          // 新增
          router = 'add';
          break;
        case '2':
          // 编辑
          router = 'edit';
          break;
        case '3':
          // 查看
          router = 'details';
          break;
      }
      this.$router.push({
        path: '/retail/procurement/purchaseProtocol/' + router,
        query: param
      });
    },

    handleOperateEvent (type, row) {
      switch (type) {
        case '1':
          // 查看
          this.jumpPage({
            type: '3',
            data: JSON.stringify({ uid: row.uid })
          });
          break;
        case '2':
          // 编辑
          this.jumpPage({
            type: '2',
            data: JSON.stringify({ uid: row.uid })
          });
          break;
        case '3':
          // 提交
          this.purchaseSubmit({ code: row.code, isReview: 1 });
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
              // 删除
              this.handleeDlete({ uid: row.uid });
            })
            .catch(() => { });
          break;
      }
    },
    // 删除操作
    handleeDlete (param) {
      this.$cimList.procurement
        .agreementDelete(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.onQuery();
          } else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 提交操作
    purchaseSubmit (param) {
      this.$cimList.procurement
        .purchaseSubmit(param)
        .then(resData => {
          if (resData.code == 200) {
            this.$message({
              type: 'success',
              message: '提交成功!'
            });
            this.onQuery();
          } else {
            this.$message({
              type: 'error',
              message: resData.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.getAgreementList(this.queryData);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.getAgreementList(this.queryData);
    }
  },
  components: {

  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.purchase-note-list {
}
</style>