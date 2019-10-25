<template>
  <div class="supplires-list">
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix="：">
        <el-form-item label="供应商编码">
          <el-input v-model="queryData.supplierCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称">
          <el-input v-model="queryData.supplierName" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="queryData.linkManTel" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="queryData.linkMan" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
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
          <el-table-column label="操作" fixed="right" width="200">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)">编辑</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('3', row)">{{row.status == 1 ? "停用":"启用"}}</el-button>
              <el-button v-if="row.status!=1" type="text" size="small" @click.stop="handleOperateEvent('4', row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.page" :page-sizes="pageSizes" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import mixins from "frame_cpm/mixins/cacheMixin";
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
const { cacheMixin } = requireModule('base');
export default {
  mixins: [mixin, cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['queryData'],
      // 查询数据
      queryData: {
        supplierCode: '',
        supplierName: '',
        linkManTel: '',
        linkMan: '',
        status: '',
        page: 1,
        pageSize: 15
      },
      // 数据总数
      total: 0,
      tableLoding: false,
      // 表格表头
      tableColumn: [
        {
          label: '供应商编码',
          key: 'supplierCode'
        },
        {
          label: '供应商名称',
          key: 'supplierName'
        },
        {
          label: '区域',
          key: 'areaName'
        },
        {
          label: '联系人',
          key: 'linkMan'
        },
        {
          label: '联系电话',
          key: 'linkManTel'
        },
        {
          label: '状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 1:
                result = '启用';
                break;
              case 0:
                result = '停用';
                break;
            }
            return result;
          }
        }
      ],
      // 表格数据
      tableData: [],
      changeRules: {
        // cinemaUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        // code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        // name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      }
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    // 初始化
    init () {
      this.onQuery();
      // this.$store.commit('getLevel',this.$route.meta.title)
    },
    // 查询
    onQuery () {
      // console.log(this.queryData);
      this.supplierAdminQueryList(this.queryData);
    },
    // 查询
    supplierAdminQueryList (param) {
      this.tableLoding = true;
      this.$cimList.procurement.supplierAdminQueryList(param).then(resData => {
        if (resData.code == 200) {
          this.tableData = resData.data.list;
          this.total = resData.data.total;
        }
        this.tableLoding = false;
      }).catch(() => {
        this.tableLoding = false;
      });
    },
    // 禁用或者启用
    supplierAdminUpdateSupplierStatus (param) {
      this.$cimList.procurement
        .supplierAdminUpdateSupplierStatus(param)
        .then(resData => {
          if (resData.code == 200) {
            this.onQuery();
          }
        });
    },
    // 删除
    supplierAdminDeleteSupplier (param) {
      this.$cimList.procurement
        .supplierAdminDeleteSupplier(param)
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
        path: '/retail/procurement/suppliers/' + router,
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
          // 启停
          this.supplierAdminUpdateSupplierStatus({
            uid: row.uid,
            status: row.status
          });
          break;
        case '4':
          // 删除
          this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
            customClass: 'retail-style',
            dangerouslyUseHTMLString: true,
            cancelButtonText: '取消',
            confirmButtonText: '确定',
            center: true
          })
            .then(() => {
              this.supplierAdminDeleteSupplier({ uid: row.uid });
            })
            .catch(() => { });
          break;
      }
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.onQuery();
    }
  },
  components: {

  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.supplires-list {
}
</style>