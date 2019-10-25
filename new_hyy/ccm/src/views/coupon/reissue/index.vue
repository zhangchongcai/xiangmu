<template>
  <div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
      <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="stSearch"></searchLan>
    </section>

    <!-- 表格栏 -->
    <section class="table-section">
      <el-table :data="tableData" style="width: 100%">
        <template v-for="(item,index) in tableConfig">
          <el-table-column :key="index" v-if="!item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed"></el-table-column>
          <el-table-column :key="index" v-else-if="item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
            <template slot-scope="scope">
              <div v-if="item.table == '操作'">
                <el-button type="text" @click="control(scope.row)">操作</el-button>
              </div>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </section>

    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center" v-if="tableData.length != 0">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
      </el-pagination>
    </section>
  </div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
export default {
  components: {
    searchLan
  },
  data () {
    return {
      tableData: [],
      modelName: 'reissu',
      searchConfig: [{
        keyName: 'phoneNum',
        name: '手机号码',
        type: 'input',
        value: ''
      }, {
        keyName: 'requsetNo',
        name: '销售申请单号',
        type: 'input',
        value: ''

      }],
      tableConfig: [{
        label: '手机号码',
        prop: 'phoneNum',
        width: '200'
      }, {
        label: '票券分类',
        prop: 'ticketType',
        width: '150'
      }, {
        label: '短信发送日期',
        prop: 'msgSendDay',
        width: '200'
      }, {
        label: '票券名称',
        prop: 'ticketName',
        width: '250'
      }, {
        label: '客户名称',
        prop: 'curstomerName',
        width: '200'
      }, {
        label: '销售审批日期',
        prop: 'saleDay',
        width: '250'
      }, {
        label: '操作',
        fixed: 'right',
        width: '300',
        hasTemplate: true
      }],
      pageConfig: {
        start: 0,
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        currentPage: 1,
        total: 0
      },
      searchParam: {}
    };
  },
  methods: {
    /**
     * @function search - 搜索
     */
    search (param) {
      console.log(param);
    },
    /**
     * @function control - 操作
     */
    control (param) {
      console.log(param);
    },
    /**
     * @function handleSizeChange - 修改分页大小
     */
    handleSizeChange () {

    },
    /**
     * @function handleCurrentChange - 修改当前显示页
     */
    handleCurrentChange () {

    },
    /**
     * @function stSearch -修改搜索栏
     */
    stSearch (param) {
      this.searchParam = param;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
