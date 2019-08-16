<template>
    <div class="ccm_dialog">
        <el-dialog
        title="选择预生成编号"
        :visible.sync="framedialogVisible"
        width="576px"
        :close-on-click-modal="false"
        >
        <div class="search-header" style="margin-bottom:20px;">
            <el-form :inline="true" ref="ruleForm" label-width="120px" size="small"  class="film-search" :model="searchAdition">
                <el-form-item label="起始票券流水号：" prop="startId" :rules="[{required:true,message:'输入流水号'}]">
					<el-input v-model="searchAdition.startId"></el-input>
				</el-form-item>
                <!-- <el-form-item label="数量：" prop="pageSize" :rules="[{required:true,validator:checkPageSize}]">
					<el-input v-model="searchAdition.pageSize" ></el-input> icon="el-icon-search"
				</el-form-item> -->
                <el-button type="primary" @click="searchFunc"  style="margin-left:8px;">添加</el-button>
            </el-form>
        </div>
        <div class="choose-body">
            <el-table :data="tableData" height="400px"  ref="table" highlight-current-row>
                <template v-for="(item,index) in tableConfig" >
                    <el-table-column :key="index" v-if="item.hasTemplate" 
                    :prop="item.prop?item.prop:''" 
                    :label="item.label?item.label:''" 
                    :width="item.width?item.width:''" >
                        <div slot-scope="scope">
                            {{formatStatus(scope.row.stockStatus)}}
                        </div>
                    </el-table-column>
                    <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column> -->
                </template>
            </el-table>
            <span v-show="tableData.length">数量:{{tableData.length}}</span>
        </div>
         <span slot="footer" class="dialog-footer">
              <slot name="footerId"></slot>
            <el-button type="primary" @click="confirmData()">确 定</el-button>
            <el-button @click="closeDialog(false)">取 消</el-button>
        </span>
        
    </el-dialog>
    </div>
</template>

<script>
export default {
    props: [
        "incomeCinemaId" , 'couponCount'
    ],
    data(){
        return {
            framedialogVisible:false,
            searchAdition:{
                startId:'',
                incomeCinemaId:'',
                pageSize:''
            },
            selectedId: '',
            selectedRows:null,
            tableData:[],
            tableConfig:[
                {
                    prop:'id',
                    label:'流水号',
                    width:''
                },
                {
                    prop: 'couponCode',
                    label: '票券编号',
                    width: ''
                },
                {
                    prop: 'stockStatus',
                    label: '库存状态',
                    width: '',
                    hasTemplate:true,
                },
                {
                    prop: 'couponColor',
                    label: '颜色',
                    width: ''
                },
            ]
        }
    },
    created(){
    },
    methods:{
        //状态转换
        formatStatus(status) {
            let text = ''
            switch(status) {
                case 1 : text = '配发'
                break;
                case 2 : text = '报损'
                break;
                case 0 : text = '原票'
                break;
                default : text = '未知'
                break;
            }
            return text
        },
        checkPageSize(rules, value, callback) {
            if(!value) {
                return callback(new Error('请输入数量'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value)) {
                return callback(new TypeError('请输入正整数'));
            }else if(value == 0){
                return callback(new TypeError('请输入正整数'));
            }
            let couponCount = this.couponCount
            // console.log("this.couponCount",this.couponCount)
            // console.log(value)
            if (Number(value) > Number(couponCount)) {
                return callback(new Error('数量不能超过票券数量'))
            }
            callback();
        },
        openDialog() {
            this.framedialogVisible = true
        },
        closeDialog() {
            this.framedialogVisible = false
        },
        confirmData(){
            this.$refs.ruleForm.validate((valid) => {
                if(!this.tableData.length){
                    return this.$message('请先添加票券','提示',{type:'warning'})
                }
                if(valid) {
                    if(this.tableData.length < Number(this.couponCount) ){
                        this.$confirm('票券编号数量小票券数量是否继续添加？','提示',{type:'warning'}).then(_=>{
                            this.$emit('batchTicketIdsCallBack',this.tableData) 
                            this.framedialogVisible =false
                        })
                    }else{
                        this.$emit('batchTicketIdsCallBack',this.tableData) 
                        this.framedialogVisible 
                    }
                }
            })
        },
        //查询
        searchFunc(){
            this.$refs.ruleForm.validate((valid) => {
                if(valid){
                    if(this.couponCount){
                        this.search();
                    }else{
                        this.$message({
                            type:'warning',
                            message:'请先输入票券数量！'
                        })
                    }
                }
            })
        },
        selectable(row) {
            return row.approveStatus === 'WAIT_APPROVE'
        },

        search(){
            this.searchAdition.incomeCinemaId = this.incomeCinemaId
            let postObj = this.searchAdition
            postObj.pageSize = this.couponCount
            this.$ccmList.findByStartAndNum(postObj).then( res => {
                if (res && res.code === 200) {
                    this.tableData = res.data
                    if(!res.data.length){
                        this.$message.error("没有找到对应编号")
                    }else{
                        this.$message.success("数据添加成功")
                    }
                } else {
                    this.$message.error("数据添加失败")
                }
            }).catch( err => {
                console.log(err)
            })
        },

    }
}
</script>

<style lang="scss" scoped>
@import '../../assets/css/dialogs.scss'
</style>
