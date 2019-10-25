<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <!-- <bread-crumb  :dataList="naveList"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <span class="label-title">品类选择:</span>
          <el-cascader size="small" :show-all-levels="false" placeholder="请选择" :options="categoryList" filterable clearable change-on-select @change="changeCategory"></el-cascader>
        </div>
        <div class="time-item">
          <el-button type="primary" size="mini" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">品类列表</div>
      <div class="section-content">
        <div class="reset-table">
          <el-table border :data="tableData">
            <!-- <el-table-column prop="uid" label="品类ID" min-width="60" fixed show-overflow-tooltip></el-table-column> -->
            <el-table-column label="序号" min-width="60" type="index" fixed></el-table-column>
            <el-table-column prop="name" label="二级品类名称" min-width="110" fixed></el-table-column>
            <el-table-column prop="minInventoryDay" label="最低库存周转天" min-width="90"></el-table-column>
            <el-table-column prop="maxInventoryDay" label="最高库存周转天" min-width="90"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="100"></el-table-column>
            <el-table-column prop="modifyTime" label="最近修改时间" min-width="100"></el-table-column>
            <el-table-column prop="flag" label="状态" min-width="60">
              <template slot-scope="scope">{{scope.row.flag == 0 ?'停用':'启用'}}</template>
            </el-table-column>
            <el-table-column label="操作" min-width="90">
              <template slot-scope="scope">
                <span class="text-blue cursor" @click="update(scope.row)" style="padding-right:10px;">编辑</span>
                <span class="text-blue cursor" @click="switchOpen(scope.row)">{{(scope.row.flag)*1 == 0? '启用' :'停用'}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="reset-page">
          <el-pagination v-if="total>15" size="mini" layout="total,sizes,prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="sizes" :page-size="size" :total="total"></el-pagination>
          <span class="page-else" v-else-if="total>0">共{{total}}条</span>
        </div>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <update-sale-manage ref="updateDialog" :infoData="updateInfo" @updateApi="updateApi"></update-sale-manage>
  </div>
</template>
<script>
import global from '../../util/global.js';
import BreadCrumb from '../partical/breadCrumb';
import UpdateSaleManage from './dialog/update-sale-manage';
export default {
  components: {
    BreadCrumb,
    UpdateSaleManage
  },
  data () {
    return {
      naveList: [{ name: '卖品规则管理' }],
      consumerId: this.$store.state.loginUser.consumerId,
      categoryList: [],
      parentUid: null,
      uid: null,
      tableData: [],
      page: 1,
      size: 15,
      total: 0,
      sizes: global.pageSizes,
      updateInfo: null
    };
  },
  computed: {
    categoryObject () {
      let obj = {};
      this.categoryList.forEach(item => {
        let id = item.value;
        let parentUid = item.parentUid;
        if (!obj.hasOwnProperty(id)) {
          obj[id] = parentUid;
        }
        if (item.children) {
          item.children.forEach(item => {
            if (!obj.hasOwnProperty(item.value)) {
              obj[item.value] = item.parentUid;
            }
          });
        }
      });
      return obj;
    }
  },
  created () {
    this.getCategoryList();
    this.getAllData();
  },
  methods: {
    search () {
      this.getAllData();
    },
    getAllData () {
      this.page = 1;
      this.size = 15;
      this.getList();
    },
    // 1.品类类型
    getCategoryList () {
      let params = {
        body: { consumerId: this.consumerId }
      };
      this.$camList.cagegoryList(params).then(response => {
        let res = response.data;
        let resData = res.map(item => {
          return {
            value: item.uid,
            label: item.categoryName,
            parentUid: item.parentUid,
            children: item.childNodes.map(item => {
              return {
                value: item.uid,
                label: item.categoryName,
                parentUid: item.parentUid
              };
            })
          };
        });
        this.categoryList = resData;
      });
    },
    // 2.列表
    getList () {
      let params = {
        body: {
          consumerId: this.consumerId,
          pageNo: this.page,
          pageSize: this.size,
          parentUid: this.parentUid,
          uid: this.uid
        }
      };
      this.$camList.getRuleList(params).then(response => {
        if (response.data) {
          let res = response.data;
          this.tableData = res.list;
          this.total = res.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    // 3.更改
    updateApi (info) {
      let params = {
        body: {
          consumerId: info.consumerId,
          parentUid: this.parentUid,
          uid: info.uid,
          maxInventoryDay: info.maxInventoryDay,
          minInventoryDay: info.minInventoryDay
        }
      };
      this.$camList
        .updateRuleInfo(params)
        .then(res => {
          this.$refs.updateDialog.show = false;
          this.getAllData();
        })
        .catch(err => {
          let res = JSON.parse(err.response.request.response).message;
          this.$message({ type: 'warning', message: res });
        });
    },
    // 改变品类类型
    changeCategory (id) {
      let leng = id.length - 1;
      let new_id = id[leng];
      this.uid = new_id;
      this.parentUid = this.categoryObject[new_id];
    },
    // 编辑
    update (row) {
      this.$refs.updateDialog.info = Object.assign({}, row);
      this.$refs.updateDialog.show = true;
    },
    // 4.启用/停用
    switchOpen (row) {
      let params = {
        body: {
          consumerId: row.consumerId,
          parentUid: this.parentUid,
          uid: row.uid,
          flag: row.flag == 0 ? 1 : 0
        }
      };
      this.$camList
        .switchRuleStatus(params)
        .then(res => {
          this.getList();
        })
        .catch(err => {
          let res = JSON.parse(err.response.request.response).message;
          this.$message({ type: 'warning', message: res });
        });
    },
    // 分页/大小
    handleSizeChange (num) {
      this.size = num;
      this.getList();
    },
    // 分页/页码
    handleCurrentChange (num) {
      this.page = num;
      this.getList();
    }
  }
};
</script>
