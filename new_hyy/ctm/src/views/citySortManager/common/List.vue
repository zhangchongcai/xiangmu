/*
* Description:城市分类管理
* Author:
* Update:
*/
<template>
  <div class="brand-dealer-manager">
    <div>
      <dy-table ref="dyTable" v-loading="loading" :columns="columns" :rows="rows"></dy-table>
    </div>
    <el-pagination v-if="total>pageSize" class="m-t-10 a-c" background @current-change="pageNumChange" @size-change="pageSizeChange" :page-size="pageSize" :current-page="pageNum" layout="total,prev, pager, next, jumper" :total="total"></el-pagination>
    <TableSelect :formItems="formItems" nameKey="areaName" :cacheAble="false" rowKey="areaCode" :request="requestApi" :columns="brandColumns" :multiSelect="true" title="修改城市级别分类" :modelVisible="modelVisible" @close="modelVisible=false" @select="selectedTable" :defaultSelectRows="defaultSelectRows" />
  </div>
</template>

<script type='text/ecmascript-6'>
import mixins from '../../../mixins/mixins.js';
import { mapActions, mapState } from 'vuex';
import { deletePricePlan, getPlayGuideList, deletePlayGuide, fetchCitySortList, queryAreatList, saveCitySortList } from 'ctmSrc/http/interface';
import { baseInterface, cacheMixin } from 'base';
import TableSelect from '../../../components/TableSelect/TableSelect';
const { authQueryUserCinemas } = baseInterface;
export default {
  mixins: [cacheMixin.cacheMixin, mixins.pageMixin, mixins.baseMixin],
  components: {
    TableSelect
  },
  data () {
    return {
      cacheField: ['pageNum', 'dataForm'],
      formItems: [
        // { label: '影院名称：', prop: 'name' },
        { label: '所在城市：',
          prop: 'provinceCode',
          prop1: 'cityCode',
          type: 'divider-cascader',
          options: 'divider-area',
          options1: [],
          props: { disabled: false, props: { value: 'areaCode', label: 'areaName' }, level: 2 } }
      ],
      defaultSelectRows: [],
      currentRow: {},
      requestApi: queryAreatList,
      brandColumns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '城市名称', prop: 'areaName' }
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
          cityType: 'A类城市',
          grade: 'A',
          areaList: [],
          cityName: ''
        },
        {
          cityType: 'B类城市',
          grade: 'B',
          areaList: [],
          cityName: ''
        }, {
          cityType: 'C类城市',
          grade: 'C',
          areaList: [],
          cityName: ''
        }
      ],
      columns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '城市类型', prop: 'cityType', width: 150 },
        {
          label: '城市数量',
          width: '150',
          renderCell: (h, value, row) => (
            <div class="f-12">
              {row.areaList.length != 0 ? row.areaList.length : ''}
            </div>
          )
        },
        {
          label: '城市名称',
          prop: 'cityName',
          // width: '150',
          renderCell: (h, value, row) => (
            <div class="f-12">
              {row.cityName}
            </div>
          )
        },
        {
          label: '操作',
          width: '200px',
          renderCell: (h, value, row) => (
            <div>
              {
                row.grade != 'C'
                  ? (
                    this.$_has('ctm_city_sort_manager_edit')
                      ? <a class="table-btn-color m-r-10 f-12" onClick={() => this.edit(row)} round>
                        编辑
                    </a>
                      : ''
                  )

                  : ''
              }

            </div>
          )
        }
      ]
    };
  },
  computed: {
    ...mapState({
      menus: state => state.commonData.menus,
      perms: state => state.commonData.perms,
      user: state => state.loginUser
    })
  },
  created () {
    // console.log(this.pageNum);
  },
  mounted () {
    // console.log("品牌商列表");
  },
  methods: {
    async selectedTable (val) {
      // this.dataForm.brandInfo = val
      console.log(val);
      let codes = [];
      if (val && val.length > 0) {
        val.forEach((item, index) => {
          codes.push(item.areaCode);
        });
      }
      console.log(codes);
      let params = {
        grade: this.currentRow.grade,
        codes: codes
      };
      let [err, ret] = await this.$to(saveCitySortList(params));
      if (err) {
        return;
      }
      console.log(ret);
      if (ret.code == 200) {
        this.$message('修改成功！');
        this.getData();
      }
    },
    getTimeRange (startTime, endTime) {
      if (!startTime || !endTime) {
        return '';
      }
      return this.$utils.formatDate(startTime, 'yyyy.MM.dd') + '-' + this.$utils.formatDate(endTime, 'yyyy.MM.dd');
    },
    getArea (row) {
      if (!row.provinceName || !row.cityName) {
        return '';
      }
      return row.provinceName + '-' + row.cityName;
    },
    edit (row) {
      console.log(row);
      this.currentRow = row;
      this.defaultSelectRows = row.areaList || [];
      this.modelVisible = true;
    },
    async getData () {
      this.loading = true;
      let params = {
        ...this.dataForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        size: 10,
        current: 1,
        planDate: '2019-07-04'
      };
      // console.log(this.$route);
      // let [err, ret] = await this.$to(getPlayGuideList(params));
      let [err, ret] = await this.$to(fetchCitySortList(params));

      this.loading = false;
      if (err) {
        return;
      }
      if (ret.code == 200) {
        // this.total = parseInt(ret.data.total);
        let cityNameA = '';
        let cityNameB = '';
        if (ret.data.areaListA && ret.data.areaListA.areaList) {
          ret.data.areaListA.areaList.forEach((item, index) => {
            if (index == ret.data.areaListA.areaList.length - 1) {
              cityNameA = cityNameA + item.areaName;
            } else {
              cityNameA = cityNameA + item.areaName + ',';
            }
          });
        }
        if (ret.data.areaListB && ret.data.areaListB.areaList) {
          ret.data.areaListB.areaList.forEach((item, index) => {
            if (index == ret.data.areaListB.areaList.length - 1) {
              cityNameB = cityNameB + item.areaName;
            } else {
              cityNameB = cityNameB + item.areaName + ',';
            }
          });
        }
        let arr = [
          {
            cityType: 'A类城市',
            grade: 'A',
            areaList: ret.data.areaListA.areaList,
            cityName: cityNameA
          },
          {
            cityType: 'B类城市',
            grade: 'B',
            areaList: ret.data.areaListB.areaList,
            cityName: cityNameB
          },
          {
            cityType: 'C类城市',
            grade: 'C',
            areaList: [],
            cityName: '除A类 B类所有城市外默认都归为C类'
          }
        ];
        this.rows = arr;
      }
    },
    selectDate (val) {
      // console.log(val)
      if (val) {
        this.dataForm.startTime = val[0] + ' 00:00:00';
        this.dataForm.endTime = val[1] + ' 23:59:59';
      } else {
        this.dataForm.startTime = undefined;
        this.dataForm.endTime = undefined;
      }
    }
  }

};
</script>

<style lang='scss' scoped>
.brand-dealer-manager {
  background-color: #ffffff;
}
</style>
