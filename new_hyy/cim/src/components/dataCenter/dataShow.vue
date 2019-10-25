<template>
  <div class="datacenter-pagination">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="Pagination.currentPage" :page-sizes="Pagination.page_sizes" :page-size="Pagination.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="Pagination.total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    datatable: Array,
    Pagination: Object
  },
  data () {
    return {

    };
  },
  methods: {
    handleSizeChange: function (size) {
      this.Pagination.pagesize = size;
      console.log(`每页: ${size}`);
    },
    handleCurrentChange: function (currentPage) {
      this.Pagination.currentPage = currentPage;
      console.log(`当前页: ${currentPage}`);
    }
  }
};
</script>
<style Scoped>
.el-table th,
.el-table td {
  padding: 7px 0;
}
.el-table th {
  background: #f2f4fd;
  padding: 1px 0;
}
</style>