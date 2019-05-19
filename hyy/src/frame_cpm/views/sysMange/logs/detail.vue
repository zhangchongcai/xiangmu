<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>日志详情</el-breadcrumb-item>
            </el-breadcrumb>

        </div>
        <div  class="currency-btn" @click="back()">返回</div>
        <div class="detail">
            <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content align-right">操作人名称：</div></el-col>
                <el-col :span="12"><div class="grid-content align-left">{{detailObj.opUserName}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content align-right">操作名称：</div></el-col>
                <el-col :span="12"><div class="grid-content align-left">{{detailObj.opName}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content align-right">操作描述：</div></el-col>
                <el-col :span="12"><div class="grid-content align-left">{{detailObj.opDesc}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content align-right">操作时间：</div></el-col>
                <el-col :span="12"><div class="grid-content align-left">{{detailObj.opTime | renderTime}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content align-right">IP：</div></el-col>
                <el-col :span="12"><div class="grid-content align-left">{{detailObj.ip}}</div></el-col>
            </el-row>
            <div class="line"></div>
            <div class="btn-center"><el-button type="primary" @click="back">确定</el-button></div>
        </div>
    </div>
</template>

<script>
    import {oplogDetail} from 'frame_cpm/http/interface.js'
  export default {
    name: "logDetail",
    data() {
      return {
        listLoading: true,
        detailObj: {}
      }
    },
    created() {
        this.getData()
    },
    filters:{
        renderTime(date) {
            // console.log(date)
            let dateee = new Date(date).toJSON();
            return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
        }
    },
    methods: {
      getData () {
        let _this = this;
        this.listLoading = false
        let logNo = this.$route.query.logNo;
          oplogDetail(logNo).then(ret => {
            if(ret.code==200){
                this.detailObj = ret.data;
            }else{
                _this.$message({
                    message:ret.msg,
                    type: 'info'
                });
            }
        }).catch(() => {
        });
        },
        back(){
            this.$router.back(-1)
        },
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
            margin-top: 20px;
            border: 1px solid #ccc;
            padding-top: 20px;
            padding-bottom: 20px;
            margin-bottom: 8px;
            color: #808080;
            clear:both;
        }

        .el-row {
            margin-bottom: 20px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .el-col {
            border-radius: 4px;
        }

        .align-right {
            text-align: right;
        }

        .align-left {
            text-align: left;
        }

        .line {
            clear: both;
            height: 1px;
            line-height: 1px;
            font-size: 0;
            background: #ccc;
            margin: 0 auto 20px;
        }

        .currency-btn {
            height: 30px;
            line-height: 30px;
            padding: 0 20px;
            background: linear-gradient(to bottom, #f2f2f3, #e4edf3);
            text-align: center;
            border-radius: 4px;
            border: 1px solid #bdcdd3;
            cursor: pointer;
            color: #232323;
            font-size: 14px;
            float: right;
        }

        .btn-center {
            margin: 0 auto;
            text-align: center;
        }
    }
</style>
<style lang="scss">
    .page-justsee{
        .el-input.is-disabled .el-input__inner{
            border-color:transparent;
            background-color:transparent;
            cursor: text;
            color: #808080;
            padding: 0;
            border: 0 none;
            &:link{
                border:none
            }
            &:visited{
                border:none
            }
            &:hover{
                border:none
            }
            &:active{
                border:none
            }
        }
        .normal-text{
            color: #808080;
            padding: 0;
        }
        .el-input__suffix{
            display: none;
        }
        .el-form-item__content{
            color: #808080;
        }
    }
</style>
