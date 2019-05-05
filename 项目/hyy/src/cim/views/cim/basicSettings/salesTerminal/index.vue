<template>
  <div>
    <div class="common-header sales-terminal-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="门店名称">
          <!-- <el-cascader
            expand-trigger="hover"
            :options="cinemaOptions"
            v-model="queryData.cinemaUid"
            :show-all-levels="false"
            @change="handleChange"
          ></el-cascader> -->
        </el-form-item>
        <el-form-item label="终端名称">
          <el-input v-model="queryData.tername" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="终端编码">
          <el-input v-model="queryData.rackCode" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="停用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="硬件识别码">
          <el-input v-model="queryData.mac" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="queryData.ip" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" v-loading="tableLoding" stripe>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification($index, row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.currentPage"
          :page-size="queryData.pageSize"
          :background="pgbackground"
          :page-sizes="pageSizes"
          :layout="pgLayout"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      class="change-dialog"
      title="修改终端状态"
      :visible.sync="terminalStatusDialog"
      width="400px"
    >
      <el-form
        :inline="true"
        :model="changeData"
        label-position="left"
        label-width="120px"
        label-suffix=":"
      >
        <el-form-item label="终端名称">
          <el-input v-model="changeData.tername"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio v-model="changeData.status" label="1">有效</el-radio>
          <el-radio v-model="changeData.status" label="0">无效</el-radio>
        </el-form-item>
        <el-form-item label="扣减仓库/货架">
          <el-select v-model="changeData.rackCode">
            <el-option
              :label="item.name"
              :value="item.code"
              v-for="item in storageRacks"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售地点">
          <el-select v-model="changeData.placeUid">
            <el-option
              :label="item.placeName"
              :value="item.uid"
              v-for="item in salePlaces"
              :key="item.uid"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="terminalStatusDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";

export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        cinemaUid: "",
        tername: "",
        code: "",
        status: "",
        mac: "",
        ip: "",
        page: 1,
        pageSize: 10
      },
      cinemaOptions:[],
      //修改终端数据
      changeData: {
        tername: "",
        status: "",
        rackCode: "",
        placeUid: "",
        salePlaceEntity: { uid: "" }
      },
      tableColumn: [
        {
          label: "门店名称",
          key: "address"
        },
        {
          label: "终端名称",
          key: "tername"
        },
        {
          label: "终端编码",
          key: "code"
        },
        {
          label: "硬件识别码",
          key: "mac"
        },
        {
          label: "计算机IP",
          key: "ip"
        },
        {
          label: "终端状态",
          key: "status",
          formatter(row, column, status) {
            let result = "";
            switch (row.status) {
              case 0:
                result = "无效";
                break;
              case 1:
                result = "有效";
                break;
            }
            return result;
          }
        },
        {
          label: "终端类型",
          key: "type"
        },
        {
          label: "扣减仓库/货架",
          key: "rackName"
        },
        {
          label: "销售地点",
          key: "placeName"
        }
      ],
      tableData: [],
      storageRacks: [], //仓库,货架
      salePlaces: [], //销售地址
      tableLoding: false,
      total: 0,
      terminalStatusDialog: false,
      dataListLoading: false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.onQuery();
    },
    // 查询
    onQuery() {
      this.getTerminalQueryPage(this.queryData);
      // console.log(this.queryData);
    },
    // 获取终端列表
    getTerminalQueryPage(param) {
      this.tableLoding = true;
      this.$api
        .terminalQueryPage(param)
        .then(resData => {
          if (resData.code == 200) {
            let tempArr = [];
            tempArr = resData.data.records.map(item => {
              if (item.salePlaceEntity) {
                item.placeName = item.salePlaceEntity.placeName;
                item.placeUid = item.salePlaceEntity.uid; //仓库id
              }
              return item;
            });
            this.tableData = tempArr;
            this.total = resData.data.total;
            // console.log(tempArr);
            this.tableLoding = false;
          }
        })
        .catch(() => {
          this.tableLoding = false;
        });
    },
    // 修改
    terminalUpdate(param) {
      this.$api.terminalUpdate(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 销售地址查询
    getSalePlaceAll(param) {
      this.$api.salePlaceAll(param).then(resData => {
        if (resData.code == 200) {
          this.salePlaces = resData.data;
        }
      });
    },
    // 货架查询
    getTerminalRackAll(param) {
      this.$api.terminalRackAll(param).then(resData => {
        if (resData.code == 200) {
          this.storageRacks = resData.data;
        }
      });
    },
    // 修改操作
    handleModification(index, row) {
      const { id, tername, status, placeUid, rackCode, rackName } = row;
      this.getSalePlaceAll();
      this.getTerminalRackAll();
      this.changeData.id = id;
      this.changeData.tername = tername;
      this.changeData.status = status.toString();
      this.changeData.placeUid = placeUid; //销售地址 = placeUid;
      this.changeData.rackCode = rackCode; //仓库编码
      this.terminalStatusDialog = true;
    },
    handleChange(value) {
      console.log(value);
    },
    //确认提交修改
    handleModificationSubmit() {
      this.changeData.salePlaceEntity.uid = this.changeData.placeUid; //销售地址对象
      let tempObj = this.storageRacks.find(item => {
        return this.changeData.rackCode == item.code;
      });
      if (tempObj) {
        this.changeData.rackName = tempObj.name; //仓库名字
      }
      // console.log(this.changeData);
      this.terminalUpdate(this.changeData);

      this.terminalStatusDialog = false;
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    }
  }
};
</script>


<style lang="scss">
.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .el-form-item__content {
    width: 65%;
  }
}
</style>