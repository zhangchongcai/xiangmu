<template>
  <div class="contentWrap">
    <div class="member-home-title">{{$attrs.titleText}}</div>
    <div
      class="Search"
      v-if="searchData.length !== 0">
      <el-form
        :inline="true"
        :model="searchDataObj"
        class="demo-form-inline">
        <el-form-item
          v-for="(item,index) in searchData"
          :key='index'
          :label="item.label">
          <template v-if="item.type === 'date'">
            <el-date-picker
              v-model="searchDataObj[item.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format='yyyy-MM-dd'>
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'select'">
            <el-select 
              v-model="searchDataObj[item.prop]">
              <el-option
                v-for="(val,i) in item.option"
                :key="i"
                :label="val.label"
                :value="val.value">
              </el-option>
            </el-select>
          </template>
          <template v-else>
            <el-input
              v-model="searchDataObj[item.prop]"
              :placeholder="item.label"
            ></el-input>
          </template>
        </el-form-item>
        <slot name="otherSubmitBtn"></slot>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="$attrs.dataList"
        stripe
        :header-cell-style="tableHeaderColor"
        v-loading="member.loading"
      >
        <el-table-column
          v-for="(item,index) in tableColumnData"
          :key="index"
          :label="item.label"
          :width="item.width"
        >
          <template slot-scope="scope">
            {{scope.row[item.prop] | formateData(scope.row,item)}}
          </template>
        </el-table-column>
        <slot name="append"></slot>
      </el-table>
      <el-pagination
        v-if="$attrs.totalData > 0"
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="Number($attrs.totalData)"
        @current-change='handleCurrentChange'
        :current-page="$attrs.pageNo"
        class="pagination"
      >
      </el-pagination>
    </div>
    <div class="back">
      <el-button @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
/**
 *    :title 页面标题
      :searchData  可以搜索的input
      :tableColumnData 表格头部展示信息
      :dataList 接口请求的表格数据
      :totalData 数据总条数
      :pageNo 数据重置页码显示
      :chooseMonth 父组件选择的时间传到自组件
      @currentPage 当前页码
      @getDate 子组件显示date组件选择时间传给自组件给接口参数使用
 * */
import { toFormModel , formatMemberInfo} from "../util/utils";
import { mapState } from 'vuex';
export default {
  props: {
    searchData: {
      type: Array
    },
    tableColumnData: {
      type: Array
    }
  },
  data() {
    return {
      inheritAttrs: false,
      searchDataObj: toFormModel(this.searchData) //搜索对象
    };
  },
  computed:{
    ...mapState(['member'])
  },
  watch: {
    'searchDataObj': {
      handler: function(val, oldVal) {
        this.$emit("getDate", oldVal);
      },
      deep: true
    },
    "$attrs.chooseMonth": {
      handler: function(val, oldVal) {
        this.searchDataObj = val;
      },
      deep: true
    }
  },
  methods: {
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return "background-color:#e5eafd;color:#333;font-size:20px";
      }
    },
    handleCurrentChange(val) {
      this.$emit("currentPage", val);
    },
    back(){
      this.$router.push({
        name:'queryDetails',
        query:this.$route.query
      })
    }
  },
  filters: {
    formateData: function(value, initialRow, item) {
      if (item.prop === "startTimeAndEndTime") {
        if (!!initialRow["startTime"] && !!initialRow["endTime"]) {
          return initialRow["startTime"] + "至" + initialRow["endTime"];
        } else {
          return "--";
        }
      } else {
        switch (true) {
          case value == null:
            return "--";
            break;
          case value === "UNUSED":
            return "未使用";
            break;
          case value === "USED":
            return "已使用";
            break;
            case value instanceof Object && !!value:
            return formatMemberInfo(value);
            break;
          default:
            return value;
        }
      };
    }
  }
};
</script>
<style scoped lang='scss'>
.contentWrap {
  .Search {
    padding-left: 3vw;
    margin-top: 3vh;
  }
}
.pagination {
  text-align: right;
  margin: 3vh 1.5vw 3vh 0;
}
.back {
  text-align: right;
  margin: 4vh 1.5vw 2.5vh 0;
}
.table {
  width: 95vw;
  margin: auto;
  min-height: 65vh;
  margin-top:3vh
}
</style>
