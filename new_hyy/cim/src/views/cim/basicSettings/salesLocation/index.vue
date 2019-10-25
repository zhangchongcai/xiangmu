<template>
  <div>
    <div class="common-header">
      <el-form :inline="true" :model="queryData" label-position="right" label-width="100px" label-suffix=":">
        <el-form-item label="门店名称">
          <el-input v-model="queryData.cinemaUid" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="销售地点编码">
          <el-input v-model="queryData.code" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="销售地点名称">
          <el-input v-model="queryData.placeName" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification($index, row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleeDlete($index, row)">删除</el-button>
            <el-button type="text" size="small" @click.stop="handleStop($index, row)">{{statusValue(row.status)}}</el-button>
            <el-button type="text" size="small" @click.stop="handleCheck($index, row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.page" :page-sizes="[10,20,30]" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <el-dialog class="change-dialog" :title="isNewBuile ? '新建销售地点':'修改销售地点'" :visible.sync="changeDialog" width="800px">
      <el-form :inline="true" ref="changeForm" :model="changeData" label-position="left" label-width="100px" label-suffix=":" :rules="changeRules">
        <el-form-item label="门店名称" prop="cinemaUid">
          <el-input v-model="changeData.cinemaUid"></el-input>
        </el-form-item>
        <el-form-item label="销售地点名称" prop="placeName">
          <el-input v-model="changeData.placeName"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio v-model="changeData.status" label="1">启用</el-radio>
          <el-radio v-model="changeData.status" label="0">停用</el-radio>
        </el-form-item>
      </el-form>
      <div class="zd-box">
        已绑定终端
        <el-button type="primary" size="small" plain @click="addTerminalEvent()">添加终端</el-button>
      </div>
      <el-table :data="changeData.terminals" stripe>
        <el-table-column v-for="item in terminaltableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="terminalHandleeDlete($index, row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="change-dialog" title="查看销售地点" :visible.sync="checkDialog" width="800px">
      <el-form :inline="true" ref="changeForm" :model="checkChangeData" label-position="left" label-width="100px" label-suffix=":" :rules="changeRules">
        <el-form-item label="门店名称" prop="cinemaUid">
          {{checkChangeData.cinemaUid}}
        </el-form-item>
        <el-form-item label="销售地点编码" prop="code">
          {{checkChangeData.code}}
        </el-form-item>
        <el-form-item label="销售地点名称" prop="placeName">
          {{checkChangeData.placeName}}
        </el-form-item>
        <el-form-item label="状态" prop="status">
          {{checkChangeData.status}}
        </el-form-item>
      </el-form>
      <div class="zd-box">已绑定终端</div>
      <el-table :data="checkChangeData.terminals" stripe>
        <el-table-column v-for="item in terminaltableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
      </el-table>
      <span slot="footer">
        <el-button @click="checkDialog = false">取 消</el-button>
        <el-button type="primary" @click="checkDialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加终端" :visible.sync="addTerminal" width="700px" :before-close="addTerminalHandleClose">
      <template>
        <el-form :inline="true" ref="changeForm" :model="terminalData" label-position="left" label-width="100px" label-suffix=":" :rules="changeRules">
          <el-form-item label="终端编号" prop="code">
            <el-input v-model="terminalData.code"></el-input>
          </el-form-item>
          <el-form-item label="终端状态">
            <el-select v-model="terminalData.status">
              <el-option label="全部" value></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="TerminalEventBtn()">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table ref="multipleTable" :data="zdtableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleTerminalSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column v-for="item in terminaltableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTerminal = false">取 消</el-button>
        <el-button type="primary" @click="terminalConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
export default {
  data () {
    return {
      checkDialog: false,
      addTerminal: false,
      // 新建状态
      statusRadio: 1,
      terminalData: {
        cinemaUid: '',
        code: '',
        ip: '',
        mac: '',
        page: 1,
        pageSize: 10,
        status: '',
        tername: ''
      },
      // 查询数据
      queryData: {
        cinemaUid: '',
        code: '',
        page: 1,
        pageSize: 10,
        placeName: '',
        status: ''
      },
      // 数据总数
      total: 10,
      tableColumn: [
        {
          label: '门店名称',
          key: 'cinemaUid'
        },
        {
          label: '销售地点编码',
          key: 'code'
        },
        {
          label: '销售地点名称',
          key: 'placeName'
        },
        {
          label: '绑定终端编号',
          key: 'terminalCodesStr'
        },
        {
          label: '状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 0:
                result = '停用';
                break;
              case 1:
                result = '启用';
                break;
            }
            return result;
          }
        }
      ],
      terminaltableColumn: [
        {
          label: '计算机名',
          key: 'machineName'
        },
        {
          label: 'IP',
          key: 'ip'
        },
        {
          label: '终端编号',
          key: 'code'
        },
        {
          label: '终端类型',
          key: 'type'
        },
        {
          label: '状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 0:
                result = '停用';
                break;
              case 1:
                result = '启用';
                break;
            }
            return result;
          }
        }
      ],
      tableData: [],
      // 新建or修改数据
      changeData: {
        status: '1',
        cinemaUid: '',
        placeName: '',
        uid: '',
        terminals: []
      },
      checkChangeData: {
        status: '',
        cinemaUid: '',
        placeName: '',
        code: '',
        uid: '',
        terminals: []
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        // cinemaUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        // code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        // name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      },
      zdtableData: [{
        cinemaUid: '',
        code: '',
        placeName: '',
        terminalCodesStr: '',
        status: ''
      }],
      terminalmultipleSelection: []
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    // 初始化
    init () {
      this.queryStoreEvent(this.queryData);
    },
    // 查询
    onSubmit () {
      this.queryStoreEvent(this.queryData);
    },
    // 对象属性是否为空 是改为null
    queryDataIfNull (data) {
      for (let key in data) {
        if (data[key] == '') {
          data[key] = null;
        }
      }
    },
    // 查询数据
    queryStoreEvent (data) {
      // debugger
      console.log(data);
      this.$cimList.queryPage(data).then(data => {
        let _self = this;
        if (data && data.code === 200) {
          let newdata = data.data;
          _self.tableData = newdata.records;
          _self.total = newdata.total;
        } else {

        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 查询终端
    queryTerminalEvent (data) {
      this.$cimList.terminalQueryPage(data).then(data => {
        let _self = this;
        if (data && data.code === 200) {
          let newdata = data.data;
          this.zdtableData = newdata.records;
        } else {

        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 新增
    saveStoreEvent (data) {
      // debugger
      this.$cimList.salePlaceSave(data).then(data => {
        let _self = this;
        if (data && data.code === 200) {
          // debugger
          _self.queryStoreEvent(_self.queryData);
        } else {
          // debugger
        }
      }).catch(err => {
        console.log(err);
      });
    }, // 修改
    updateStoreEvent (data) {
      this.$cimList.salePlaceUpdate(data).then(data => {
        let _self = this;
        if (data && data.code === 200) {
          _self.queryStoreEvent(_self.queryData);
        } else {

        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 查看接口
    CheckStoreEvent (data) {
      this.$cimList.salePlaceCheck(data).then(data => {
        let _self = this;
        if (data && data.code === 200) {
          let newdata = data.data;
          debugger;
          _self.checkChangeData.status = newdata.status.toString();
          _self.checkChangeData.cinemaUid = newdata.cinemaUid;
          _self.checkChangeData.code = newdata.code;
          _self.checkChangeData.placeName = newdata.placeName;
          _self.checkChangeData.uid = newdata.uid;
          _self.checkChangeData.terminals = newdata.terminals;
        } else {

        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 查看点击事件
    handleCheck (index, row) {
      this.CheckStoreEvent(row.uid);
      this.checkDialog = true;
    },
    // 查询终端
    addTerminalEvent () {
      this.addTerminal = true;
      this.queryTerminalEvent(this.terminalData);
    },
    // // 终端界面点击查询
    TerminalEventBtn () {
      this.queryTerminalEvent(this.terminalData);
    },
    // 关闭终端
    addTerminalHandleClose () {
      this.addTerminal = false;
    },
    // 添加终端选择框
    handleTerminalSelectionChange (val) {
      this.terminalmultipleSelection = val;
    },
    // 添加终端确定
    terminalConfirm () {
      this.addTerminal = false;
      this.changeData.terminals = this.terminalmultipleSelection;
    },
    // 修改操作
    handleModification (index, row) {
      this.changeData.status = row.status.toString();
      this.changeData.cinemaUid = row.cinemaUid;
      this.changeData.placeName = row.placeName;
      this.changeData.uid = row.uid;
      this.changeData.terminals = row.terminals;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete (index, row) {
      this.$cimList.salePlaceDelete(row.uid).then(data => {
        let _self = this;
        if (data && data.code === 200) {
          _self.queryStoreEvent(_self.queryData);
        }
      });
    },
    // 删除终端操作
    terminalHandleeDlete (index, row) {
      this.changeData.terminals.splice(index, 1);
    },
    statusValue (type) {
      switch (type) {
        case 0:
          return '停用';
          break;
        case 1:
          return '启用';
          break;
      }
    },
    handleStop (index, row) {
      if (row.terminalCodesStr == '') {
        if (row.status == 0) {
          row.status = 1;
        } else {
          row.status = 0;
        }
        this.$cimList.salePlaceStatus(row.status, row.uid).then(data => {
          let _self = this;
          if (data && data.code === 200) {
            _self.queryStoreEvent(_self.queryData);
          } else {

          }
        }).catch(err => {
          console.log(err);
        });
      } else {
        alert('绑定终端不能停用');
      }
    },
    // 确认提交修改
    handleModificationSubmit () {
      let _self = this;
      _self.$refs['changeForm'].validate(valid => {
        if (valid) {
          if (_self.isNewBuile) {
            _self.saveStoreEvent(_self.changeData);
          } else {
            _self.updateStoreEvent(_self.changeData);
          }
          _self.changeDialog = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.queryStoreEvent(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.queryStoreEvent(this.queryData);
      console.log(`当前页: ${val}`);
    },
    handleNewBuilt () {
      this.changeData = {
        status: '1',
        cinemaUid: '006',
        placeName: '',
        uid: '',
        terminals: []
      },
        this.changeDialog = true;
      this.isNewBuile = true;
    }
  }
};
</script>

<style lang="scss">
.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
    width: 70%;
  }
}
.zd-box button {
  float: right;
}
</style>