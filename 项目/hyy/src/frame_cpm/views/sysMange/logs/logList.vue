<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>日志管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list-wrapper">
             <el-form :inline="true" :model="listQuery" label-width="98px" size="mini" class="demo-form-inline search-form">
                <el-form-item label="操作时间：" >
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="选择" v-model="listQuery.startTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="1" style="text-align:center;">-</el-col>
                    <el-col :span="11">
                        <el-date-picker placeholder="选择" v-model="listQuery.endTime" style="width: 100%;"></el-date-picker>
                    </el-col>
                </el-form-item>
                <el-form-item label="操作名称：">
                    <el-input v-model="listQuery.opName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="操作描述：">
                    <el-input v-model="listQuery.opDesc" placeholder="请输入"></el-input>
                </el-form-item>
                 <el-form-item label="操作人名称：">
                    <el-input v-model="listQuery.opUserName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-button class='search-padding' type="primary" @click="handleFilter">查询</el-button>
            </el-form>
            <div class="content-line"></div>
           <el-table
                :key='tableKey'
                :data="list"
                v-loading="listLoading"
                element-loading-text="拼命加载中..."
                highlight-current-row
                stripe
                class="diy-header"
                style="width: 98%;margin-left:1%;">
                <el-table-column label="操作人名...">
                    <template slot-scope="scope">
                    <span>{{ scope.row.opUserName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作名称">
                    <template slot-scope="scope">
                    <span>{{ scope.row.opName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作描述">
                    <template slot-scope="scope">
                    <span>{{ scope.row.opDesc }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.opTime | renderTime}}</span>
                    </template>
                </el-table-column>
                 <el-table-column label="IP">
                    <template slot-scope="scope">
                        <span>{{ scope.row.ip }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="toDetail(scope.row)" icon="el-icon-view"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        <!-- footer 分页条 -->
        <div class="page-wrap">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.pageNum"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="listQuery.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                style="margin: -10px;">
            </el-pagination>
        </div>
        </div>
    </div>
</template>

<script>
    import {oplogList} from 'frame_cpm/http/interface.js'
  export default {
    name: "log",
    data() {
      return {
        listQuery: {
            pageNum: 1,
            pageSize: 10,
            type: undefined,
            startTime:'',
            endTime:'',
            opName:null,
            opDesc:null,
            opUserName:null
        },
        total:null,
        list: null,
        listLoading: true,
        tableKey: 0
      }
    },
    created() {
        this.getList()
    },
    filters:{
      renderTime(date) {
        let dateee = new Date(date).toJSON();
        return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
      }
    },
    methods: {
      getList () {
        let _this = this;
        this.listLoading = false
        let queryObj = this.listQuery
        this.listQuery.startTime?queryObj.startTime = `${this.formatDate(this.listQuery.startTime, 'yyyy-MM-dd')}' 00:00:00'`:queryObj.startTime = ''
        this.listQuery.endTime?queryObj.endTime = `${this.formatDate(this.listQuery.endTime , 'yyyy-MM-dd')}' 23:59:59'`:queryObj.endTime = ''
        oplogList(queryObj)
        .then( ret => {
           if(ret.code==200) {
             _this.list = ret.data.rows
             _this.pageNum = ret.data.pageNum
             _this.pageSize = ret.data.pageSize
             _this.total = ret.data.total
             _this.listLoading = false
           }else{
               _this.$message({
                   message:ret.msg,
                   type: 'info'
               });
           }
        }).catch(() => {
          _this.$message('网络繁忙，请稍后再试')
        });
        },
        handleSizeChange (val) {
            this.listQuery.pageSize = val
            this.getList()
        },
        handleCurrentChange (val) {
            this.listQuery.pageNum = val
            this.getList()
        },
        handleFilter () {
            this.listQuery.pageNum = 1
            this.getList(this.listQuery)
        },
        toDetail(val){
            this.$router.push({path: 'detail', query: {logNo: val.logNo}})
        },
        formatDate(datetime , fmt){
            let _this = new Date(datetime);
            var o = {
                "M+": _this.getMonth() + 1,
                "d+": _this.getDate(),
                "h+": _this.getHours(),
                "m+": _this.getMinutes(),
                "s+": _this.getSeconds(),
                "q+": Math.floor((_this.getMonth() + 3) / 3),
                "S": _this.getMilliseconds()
            };
            if (/(y+)/.test(fmt)){fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + "").substr(4 - RegExp.$1.length));}
            for (var k in o){
                if (new RegExp("(" + k + ")").test(fmt)){fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));}
            }
            return fmt;
        }
    },
    computed:{

    },
  }
</script>

<style scoped lang="scss">
    .content-wrapper {
        height: 100%;

        .breadcrumb {
            padding: 9px 0 9px 3px;

            .el-breadcrumb {
                span {
                    font-size: 14px;
                }
            }
        }

        .detail {
            width: 100%;
            margin-top: 10px;
            border: 1px solid #ccc;

            .newBuild {
                width: 100%;
                height: 60px;
                background-color: #ccc;
                border-top: #8b8b8b;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }

            .table {
                width: 96%;
                margin: 30px auto;
            }
        }

        .el-table .el-button--primary {
            background: #3B74FF;
        }

        .el-table .el-button {
            color: #fff;
        }
    }
</style>
