<template>
    <div class="cinema-dialog">
        <el-dialog
        title="选择要绑定的usbKey"
        :visible.sync="dialogVisible"
        width="576px"
        :close-on-click-modal=false
        >
        <div class="film-body">
            <el-table :data="usbArray" @row-click= "showRow" @ ref="usbKeyRef" highlight-current-row>
                <template v-for="(row,index) in tableConfig" >
                    <el-table-column label="选择" width="50" align="center" :key="index" v-if="row.isTemplate">
                        <template slot-scope="scope">
                            <el-radio class="radio"  v-model="radio" :label="scope.row.cinemaCode+scope.row.cinemaName">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column :prop="row.keyValue" :label="row.label" :key="index" v-if="!row.isTemplate"></el-table-column>
                </template>
            </el-table>
        </div>
            <span slot="footer" class="dialog-footer">
                <slot name="footerId"></slot>
                <el-button type="primary" @click="confirmData()">确 定</el-button>
                <el-button @click="dialogVisible=false">取 消</el-button>
            </span>
            <div class="inner-dialog">
                <el-dialog
                width="30%"
                title="失败"
                :visible.sync="innerVisible"
                append-to-body>
                    <div style="text-align:center">
                        <p style="padding-bottom:10px"><span>请选择一个Usbkey识别号</span> </p>
                        <el-button type="primary" @click="innerVisible=false">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
        </el-dialog>
    </div>
    
</template>

<script>
export default {
    props: {
        usbArray:{
            type:Array,
            default:[],
            required: true
        }
    },
    data(){
        return {
            dialogVisible:false,
            innerVisible:false,
            radio:'',
            selectedRows:null,
            tableConfig:[
                {
                    label:"",
                    keyValue:'',
                    isTemplate:true
                },
                {
                    label:"Usbkey识别码",
                    keyValue:'usbKeyCode'
                },
                {
                    label:"影院编码",
                    keyValue:'cinemaCode'
                },
                {
                    label:"更新时间",
                    keyValue:'updateTime'
                }
            ]
        }
    },
    methods:{
        openDialog() {
            this.dialogVisible = true
        },
        closeDialog() {
            this.dialogVisible = false

        },
        showRow(row){
            //赋值给radio
           console.log('点击当行',row)
            let _this = this;
            this.selectedRows = row;
            this.radio=row.cinemaCode+row.cinemaName
        },
        confirmData(){
            let _this = this;
            if(!this.selectedRows){
                return this.innerVisible = true
            }
            let selectedRows = !!this.selectedRows?this.selectedRows:{}
            _this.$emit('usbKeyCodeCallBack',selectedRows.usbKeyCode,) 
            this.dialogVisible =false
        },

    }
}
</script>

<style lang="scss">
    .cinema-dialog{
        .film-top{
            margin-left:8px;
        }
        .el-dialog {
            .el-dialog__body{
                padding-top: 10px;
            }
        }
        .inner-dialog{
            .el-dialog__body{
                padding-top: 10px;
            }
        }
    }
</style>
