<template>
  <div>
    <div class="cinemaList">
      <el-form :inline="true" label-position="right" class="demo-form-inline search-form" label-width="100px"
        label-suffix=":">
        <el-form-item label="影院名称">
          <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()"
            style="width:176px;height:32px;">
            {{ cinemaName }}</el-button>
        </el-form-item>
        <el-form-item label="终端编号">
          <el-input v-model="code" placeholder="请输内容" maxlength="12"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" style="margin:5px">查询</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label"
          :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作" width="80" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click.stop="changeTerminal(row)">{{row.status==1?"停用":"启用"}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="page" :page-sizes="[10,20,30]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType"
      :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId">
        <el-button @click="singleCinemaVisible = false">取 消</el-button>
        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
          定</el-button>
      </div>
    </singleCinema>
  </div>
</template>

<script>
  import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
  export default {
    components: {
      singleCinema
    },
    data() {
      return {
        singleCinemaVisible: false,
        singleCinemaType: 2,
        innerData: {
          id: '',
        },
        cinemaName: "", //影院名字
        page: 1,
        pageSize: 10,
        cinemaUid: "",
        code: "",
        status: "",
        // 数据总数
        total: 0,
        tableColumn: [{
            label: "影院名称",
            key: "cinemaName"
          },
          {
            label: "终端编号",
            key: "code"
          },
          {
            label: "注册时间",
            key: "createTime"
          },
          {
            label: "终端状态",
            key: "status",
            formatter(row, column, cellValue) {
              let result = "";
              switch (row.status) {
                case 0:
                  result = "停用";
                  break;
                case 1:
                  result = "启用";
                  break;
              }
              return result;
            }
          }
        ],
        tableData: [],
      };
    },
    methods: {
      search() { //查询
        this.getList()
      },
      getList() { // 获取列表页
        let httpObj = {
          // cinemaName: this.cinemaName,
          cinemaUid: this.cinemaUid,
          code: this.code,
          current: this.page,
          size: this.pageSize,
          status: this.status
        }
        this.$ctmList.terminalList(httpObj).then(res => {
          if (res.code === 200) {
            this.total = res.data.total;
            this.tableData = res.data.list
          } else {
            this.error(res.msg)
          }
        })
      },
      changeTerminal(row) { // 改变终端的状态
        let status = row.status == 1?'0':'1'
        let httpObj = {
          id: row.id, // 主键ID
          status // 账号的状态
        }
        this.$ctmList.openTerminal(httpObj).then(res => {
          if (res.code === 200) {
            this.getList()
          } else {
            this.error(res.msg)
          }
        })
      },
      callBackSingle(data) { // 打开影院
        this.cinemaUid = data.data.id
        this.cinemaName = data.data.name
        this.cinemaName = this.cinemaName.length> 10?this.cinemaName.substring(0,9)+"...": this.cinemaName
        this.innerData.id = data.data.id
        this.singleCinemaVisible = data.framedialogVisible
        // this.search() 
      },
      getUserInfo() {
        this.$ctmList.getUserInfo().then(res => {
          if (res.code === 200) {
            this.cinemaName = res.data.cinemaName
            this.cinemaUid = res.data.cinemaUid
            this.innerData.id = Number(res.data.cinemaUid)
            this.getList()
          } else {
            this.error(res.msg)
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.page = val;
        this.getList();
      }
    },
    created() {
      // this.getUserInfo()
      this.getList()
      this.cinemaName = "全部影院"
    }
  };
</script>

<style lang="scss" scoped>
  .el-button--primary {
    padding: 9px 32px;
  }

  .cinemaList {
    box-sizing: border-box;
    width: 100%;

    .search-form {
      background: #f5f5f5;
      padding: 16px 24px;
      margin-bottom: 10px;

      /deep/ .el-input__inner {
        width: 176px;
      }
    }
  }

  .el-form-item {
    width: 300px;
    margin-bottom: 8px;
  }

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