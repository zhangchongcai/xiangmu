/*
* Description:增值服务价格管理
* Author:
* Update:
*/
<template>
  <div class="ctm extra-price-manager">
    <div class="bg-search-form p-t-24 p-h-24">
      <el-form
        class="base-form"
        :inline="true"
        :model="dataForm"
        @keyup.enter.native="getData()"
      >
        <el-form-item label="方案名称：">
          <el-input
            v-model="dataForm.companyName"
            clearable
            placeholder="方案名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="适用渠道：">
          <el-select
            clearable
            v-model="dataForm.approvalStatus"
            palceholder="请选择"
          >
            <el-option
              v-for="item in channel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用影院：">
          <el-row>
            <el-input
              v-model="dataForm.cinemaName"
              clearable
              readonly
              placeholder="全部"
            ></el-input>
            <el-button
              type="primary callWindowBtn"
              plain
              @click="showModel"
            >选择</el-button>
          </el-row>
        </el-form-item>
        <!-- v-auth="'ads_index_material'" -->
        <el-form-item>
          <el-button
            class="w-80"
            type="primary"
            @click="getData()"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="a-r m-t-10">
      <el-button
        class="w-80"
        plain
        type="primary"
        @click="add()"
      >新建</el-button>
    </div>
    <div class="m-t-10">
      <dy-table
        ref="dyTable"
        v-loading="loading"
        :columns="columns"
        :rows="rows"
      ></dy-table>
    </div>
    <el-pagination
      v-if="total>pageSize"
      class="m-t-10 a-c"
      background
      @current-change="pageNumChange"
      @size-change="pageSizeChange"
      :page-size="pageSize"
      :current-page="pageNum"
      layout="total,prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <TableSelect
      :formItems="formItems"
      nameKey="areaName"
      rowKey="id"
      :request="requestApi"
      :columns="brandColumns"
      :defaultQuery="defaultQuery"
      :multiSelect="false"
      title="选择影院"
      :modelVisible="modelVisible"
      @close="modelVisible=false"
      @select="selectedTable"
      :defaultSelectRow="defaultSelectRow"
    />
  </div>
</template>

<script type='text/ecmascript-6'>
import mixins from '../../../mixins/mixins.js'
import cacheMixin from 'src/frame_cpm/mixins/cacheMixin.js'
import { mapActions, mapState } from 'vuex'
import { deletePricePlan, getPlayGuideList, deletePlayGuide, fetchCitySortList, queryAreatList, saveCitySortList } from 'ctm/http/interface'
import { authQueryUserCinemas } from "frame_cpm/http/interface.js"
import TableSelect from '../../../components/TableSelect/TableSelect';
export default {
  mixins: [cacheMixin.cacheMixin, mixins.pageMixin, mixins.baseMixin],
  components: {
    TableSelect
  },
  data () {
    return {
      channel: [{
        label: "全部",
        value: undefined
      }, {
        label: "猫眼",
        value: 1
      }, {
        label: "淘票票",
        value: 2
      }],
      defaultQuery: { type: 2 },
      cacheField: ["pageNum", "dataForm"],
      formItems: [
        { label: '影院名称：', prop: 'name' },
        { label: '影院编码：', prop: 'code' }
      ],
      defaultSelectRow: {},
      currentRow: {},
      requestApi: authQueryUserCinemas,
      brandColumns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '影院全称', prop: 'name' },
        { label: '影院编码', prop: 'code' },
        // { label: '品牌简称', prop: 'shortName' }
      ],
      modelVisible: false,
      loading: false,
      cascaderSelected: [],
      cascaderOptions: [],
      cascaderOptionsK: {},
      cascaderProps: {
        value: 'id',
        label: 'provinceName',
        children: 'children'
      },
      rangeDate: [],
      dataForm: {},
      rows: [
        {
          cityType: "A类城市",
          grade: "A",
          areaList: [],
          cityName: ""
        },
        {
          cityType: "B类城市",
          grade: "B",
          areaList: [],
          cityName: ""
        }, {
          cityType: "C类城市",
          grade: "C",
          areaList: [],
          cityName: ""
        }
      ],
      columns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '方案编码', prop: 'cityType', width: 200 },
        { label: '方案名称', prop: 'cityType' },
        { label: '优先级', prop: 'cityType' },
        { label: '适用渠道', prop: 'cityType' },
        { label: '适用影厅', prop: 'cityType' },
        { label: '增值服务费', prop: 'cityType' },
        {
          label: '状态',
          prop: 'cityName',
          // width: '150',
          renderCell: (h, value, row) => (
            <div class="f-12">
              {row.cityName}
            </div>
          )
        },

        {
          label: "操作",
          width: "250px",
          renderCell: (h, value, row) => (
            <div>
              <a class="table-btn-color m-r-10 f-12" onClick={() => this.scan(row)} round>
                查看
              </a>
              <a class="table-btn-color m-r-10 f-12" onClick={() => this.edit(row)} round>
                修改
              </a>
              <a class="table-btn-color m-r-10 f-12" onClick={() => this.disable(row)} round>
                禁用
              </a>
              <a class="table-btn-color m-r-10 f-12" onClick={() => this.delete(row)} round>
                删除
              </a>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    ...mapState({
      menus: state => state.commonData.menus,
      perms: state => state.commonData.perms
    }),
  },
  created () {
    // console.log(this.pageNum);
  },
  mounted () {
    // console.log("品牌商列表");
  },
  methods: {
    showModel () {
      this.modelVisible = true;
    },
    async selectedTable (val) {
      console.log(val);
      this.defaultSelectRow = val;
      this.dataForm.cinemaName = val.name;
    },
    getTimeRange (startTime, endTime) {
      if (!startTime || !endTime) {
        return ""
      }
      return this.$utils.formatDate(startTime, 'yyyy.MM.dd') + '-' + this.$utils.formatDate(endTime, 'yyyy.MM.dd')
    },
    getArea (row) {
      if (!row.provinceName || !row.cityName) {
        return ""
      }
      return row.provinceName + "-" + row.cityName
    },
    add () {
      this.$router.push('./add')
    },
    edit (row) {
      console.log(row);
      this.$router.push({
        path: "./edit",
        query: {
          uid: row.grade
        }
      });
    },
    scan (row) {
      this.$router.push({
        path: "./scan",
        query: {
          uid: row.grade
        }
      });
    },
    async disable (row) {
      let str = "确定要停用该品牌吗？";
      const re = await this.$utils.confirm(str)
      if (re) { }
    },
    async delete () { },
    async getData () {
      this.loading = true;
      let params = {
        ...this.dataForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        size: 10,
        current: 1,
        planDate: "2019-07-04"
      }
      // console.log(this.$route);
      // let [err, ret] = await this.$to(getPlayGuideList(params));
      let [err, ret] = await this.$to(fetchCitySortList(params));

      this.loading = false;
      if (err) {
        return;
      }
      if (ret.code == 200) {
        // this.total = parseInt(ret.data.total);

      }

    },
    selectDate (val) {
      // console.log(val)
      if (val) {
        this.dataForm.startTime = val[0] + " 00:00:00"
        this.dataForm.endTime = val[1] + " 23:59:59"
      } else {
        this.dataForm.startTime = undefined
        this.dataForm.endTime = undefined
      }
    },
  }

}
</script>

<style lang='scss' scoped>
.extra-price-manager {
  background-color: #ffffff;
}
</style>
