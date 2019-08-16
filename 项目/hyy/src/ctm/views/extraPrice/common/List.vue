/*
* Description:增值服务价格管理
* Author:
* Update:
*/
<template>
  <div class="ctm extra-price-manager">
    <div class="bg-search-form p-t-24 p-h-24">
      <el-form class="base-form" :inline="true" :model="dataForm" @keyup.enter.native="getData()">
        <el-form-item label="方案名称：">
          <el-input v-model="dataForm.name" clearable placeholder="方案名称"></el-input>
        </el-form-item>

        <el-form-item label="适用渠道：">
          <el-select clearable v-model="dataForm.channel" palceholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option v-for="(item,index) in channel" :key="index" :label="item.name" :value="item.uid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用影院：">
          <el-row>
            <el-input v-model="dataForm.cinemaName" readonly placeholder="全部"></el-input>
            <el-button type="primary callWindowBtn" class="m-l-6 w-80" plain @click="showModel">选择</el-button>
          </el-row>
        </el-form-item>
        <!-- v-auth="'ads_index_material'" -->
        <el-form-item>
          <el-button class="w-80" type="primary" @click="getData()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="a-r m-t-10">
      <el-button class="w-80" v-auth="'ctm_extra_price_manager_add'" plain type="primary" @click="add()">新建</el-button>
    </div>
    <div class="m-t-10">
      <dy-table ref="dyTable" v-loading="loading" :columns="columns" :rows="rows"></dy-table>
    </div>
    <el-pagination v-if="total>pageSize" class="m-t-10 a-c" background @current-change="pageNumChange" @size-change="pageSizeChange" :page-size="pageSize" :current-page="pageNum" layout="total,prev, pager, next, jumper" :total="total"></el-pagination>
    <TableSelect :formItems="formItems" nameKey="name" rowKey="uid" :request="requestApi" :columns="brandColumns" :defaultQuery="defaultQuery" :multiSelect="true" title="选择影院" :modelVisible="modelVisible" @close="modelVisible=false" @select="selectedTable" :defaultSelectRows="defaultSelectRows" />
  </div>
</template>

<script type='text/ecmascript-6'>
import mixins from '../../../mixins/mixins.js'
import cacheMixin from 'src/frame_cpm/mixins/cacheMixin.js'
import { mapActions, mapState } from 'vuex'
import { cinemaList, fetchCitySortList, queryExtraPriceList, updateExtraPriceState, deleteExtraPrice, queryChannelList, queryMyChannelList, fetchCinemaList, getExtraPriceChannelList } from 'ctm/http/interface'
import { authQueryUserCinemas } from "frame_cpm/http/interface.js"
import TableSelect from '../../../components/TableSelect/TableSelect';
export default {
  mixins: [cacheMixin.cacheMixin, mixins.pageMixin, mixins.baseMixin],
  components: {
    TableSelect
  },
  data () {
    return {
      channel: [],
      //type: 2
      defaultQuery: {},
      cacheField: ["pageNum", "dataForm", "defaultSelectRows"],
      formItems: [
        { label: '影院名称：', prop: 'name' },
        { label: '影院编码：', prop: 'code' }
      ],
      defaultSelectRows: [],
      currentRow: {},
      requestApi: fetchCinemaList,
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
      rows: [],
      columns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '方案编码', prop: 'code', width: 160 },
        { label: '方案名称', prop: 'name' },
        { label: '优先级', prop: 'priority', width: 60 },
        {          label: '适用渠道',
          // width: 300,
          prop: 'channelsStr',
          // renderCell: (h, value, row) => (
          //   <span class="f-12">
          //     {this.getChannelStr(row.channels)}
          //   </span>
          // )
        },
        {          label: '适用影厅',
          prop: 'hallsStr'
        },
        {          label: '增值服务费', prop: 'cityType',
          renderCell: (h, value, row) => (
            <div class="f-12">
              {this.getPriceStr(row)}
            </div>
          )
        },
        {
          label: '状态',
          prop: 'status',
          width: 60,
          renderCell: (h, value, row) => (
            <div class="f-12">
              {row.status == 1 ? '启用' : (row.status == 0 ? '禁用' : '')}
            </div>
          )
        },

        {
          label: "操作",
          width: "200px",
          renderCell: (h, value, row) => (
            <div>
              {
                this.$_has('ctm_extra_price_manager_scan') ?
                  <a class="table-btn-color m-r-10 f-12" onClick={() => this.scan(row)} round>
                    查看
                </a>
                  : ""
              }

              {
                this.$_has('ctm_extra_price_manager_edit') ?
                  <a class="table-btn-color m-r-10 f-12" onClick={() => this.edit(row)} round>
                    编辑
                </a>
                  : ""
              }
              {
                row.status == 1 ?
                  (
                    this.$_has('ctm_extra_price_manager_disable') ?
                      <a class="table-btn-color m-r-10 f-12" onClick={() => this.disable(row, 0)} round>
                        禁用
                    </a>
                      : ""
                  )
                  :
                  (
                    this.$_has('ctm_extra_price_manager_enable') ?
                      <a class="table-btn-color m-r-10 f-12" onClick={() => this.disable(row, 1)} round>
                        启用
                    </a>
                      : ""
                  )
              }

              {
                this.$_has('ctm_extra_price_manager_delete') ?
                  <a class="table-btn-color m-r-10 f-12" onClick={() => this.delete(row)} round>
                    删除
                </a>
                  : ""
              }
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
    this.getChannelList();
  },
  methods: {
    async getChannelList () {
      let params = {}
      let [err, ret] = await this.$to(getExtraPriceChannelList(params));
      if (err) {
        return
      }
      if (ret.code == 200) {
        this.channel = ret.data;
      }
    },
    getPriceStr (row) {
      let str = "";
      if (row.ruleType == 0) {
        if (row.priceType == 0) {
          str = "固定金额：" + (row.price ? row.price.toFixed(2) : 0) + "元"
        } else if (row.priceType == 1) {
          str = "结算价百分比：" + (row.price ? row.price.toFixed(2) : 0) + "%"
        }
      } else if (row.ruleType == 1) {
        if (row.priceType == 2) {
          str = "不限最高价"
        } else if (row.priceType == 3) {
          str = "指定增值服务费最高限价：" + (row.price ? row.price.toFixed(2) : 0) + "元";
        }
      }
      return str;
    },
    getHallStr (hallObj) {
      let halls = hallObj.halls;
      let str = ""
      if (halls && halls.length > 0) {
        halls.forEach((item, index) => {
          if (index == halls.length - 1) {
            str = str + item.name;
          } else {
            str = str + item.name + "，";
          }
        })
      } else {
        str = "适用所有影厅"
      }
      return str;
    },
    getChannelStr (channels) {
      let str = ""
      if (channels && channels.length > 0) {
        channels.forEach((item, index) => {
          if (index == channels.length - 1) {
            str = str + item.name;
          } else {
            str = str + item.name + "，";
          }
        })
      } else {
        str = "不限渠道"
      }
      return str;
    },
    showModel () {
      this.modelVisible = true;
    },
    async selectedTable (val) {
      console.log(val);
      this.defaultSelectRows = val;
      let cinemaUidList = [];

      let str = "";
      let cutStr = "";
      val.forEach((item, index) => {
        cinemaUidList.push(item.uid);
        if (index == val.length - 1) {
          str = str + item.name
        } else {
          str = str + item.name + "，"
        }
      })
      cutStr = str;
      if (val.length > 1 && str.length > 10) {
        cutStr = str.substring(0, 10) + "...共" + val.length + "家"
      }
      this.dataForm.cinemaName = cutStr;
      this.dataForm.cinemaNameStr = str;
      // this.dataForm.cinemaName = val.cinemaName;
      // this.dataForm.cinemaUid = val.cinemaUid;
      this.dataForm.cinemaUidList = cinemaUidList;
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
          uid: row.uid
        }
      });
    },
    scan (row) {
      this.$router.push({
        path: "./scan",
        query: {
          uid: row.uid
        }
      });
    },
    async disable (row, status) {
      let str = "确定要禁用该方案吗？";
      if (status == 1) {
        str = "确定要启用该方案吗？";
      }
      const re = await this.$utils.confirm(str)
      if (re) {
        let params = {
          programUid: row.uid,
          state: status
        }
        let [err, ret] = await this.$to(updateExtraPriceState(params));
        if (err) {
          return;
        }
        if (ret.code == 200) {
          let tip = "禁用成功！";
          if (status == 1) {
            tip = "启用成功！";
          }
          this.$message({
            type: 'success',
            message: tip
          });
          // this.getData();
          row.status = status;
        }
      }
    },
    async delete (row) {
      let str = "确定要删除该方案吗？";
      const re = await this.$utils.confirm(str)
      if (re) {
        let params = {
          uid: row.uid
        }
        let [err, ret] = await this.$to(deleteExtraPrice(params));
        if (err) {
          return;
        }
        if (ret.code == 200) {
          this.$message({
            type: 'success',
            message: "删除成功！"
          });
          this.getData();
        }
      }
    },
    async getData () {
      this.loading = true;
      let params = {
        ...this.dataForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        current: this.pageNum,
        size: this.pageSize
      }
      // console.log(this.$route);
      let [err, ret] = await this.$to(queryExtraPriceList(params));
      // let [err, ret] = await this.$to(fetchCitySortList(params));

      this.loading = false;
      if (err) {
        return;
      }
      if (ret.code == 200) {
        this.total = parseInt(ret.data.total);
        if (ret.data.list && ret.data.list.length > 0) {
          ret.data.list.forEach(item => {
            item.hallsStr = this.getHallStr(item);
            item.channelsStr = this.getChannelStr(item.channels)
          })
        }
        this.rows = ret.data.list;

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
