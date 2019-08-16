<template>
    <div>
        <!-- 表格 -->
        <div style="text-align:right;padding:12px 0 ">
            <el-button plain @click="edit(false)">新建</el-button>
        </div>
        <section class="table-section">
            <el-table :data="tableConfig.data" style="width: 100%">
                <template v-for="(item,index) in tableConfig.title">
                    <el-table-column v-if="!item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                    <el-table-column v-else-if="item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                        <template slot-scope="scope">
                            <div v-if="item.label == '操作'">
                                <el-button type="text" 
                                @click="operationMethod(opera.operationMethod,scope.row)"
                                v-for="opera in item.options" :key="opera.operationMethod"
                                >
                                    {{opera.operationName}}
                                </el-button>
                            </div>
                            <div v-else>
                                {{formData(item.prop,scope.row)}}
                            </div>
                            <!-- <div v-else-if="item.label == '默认票版'">
                                {{scope.row.isDefault==1?'是':'否'}}
                            </div>
                            <div v-else-if="item.prop=='width' || item.prop=='height'">
                                {{}}
                            </div> -->
                        </template>
                    </el-table-column>
                </template>
            </el-table>
        </section>

        <!-- 分页 -->
        <section class="pagination-section flex-base flex-center pageStyle" v-if="tableConfig.data.length != 0">
            <el-pagination @size-change="handleSizeChange" 
            @current-change="handleCurrentChange" 
            :current-page="pageConfig.pageNo" 
            :page-sizes="pageConfig.pageSizes" 
            :page-size="pageConfig.pageSize" 
            background layout="total, prev, pager, next, jumper, sizes" 
            :total="pageConfig.total">
            </el-pagination>
        </section>
    </div>
</template>

<script>
import minxins from 'frame_cpm/mixins/cacheMixin.js'

export default {
    
    // components: {
    //     ccmSaleList
    // },
    mixins: [minxins.cacheMixin],
    data() {
        return {
            /* 缓存数据 */
            cacheField: ["tableConfig","pageConfig"],
            subComName:'printList',
            isShowDialog: false,
            pageConfig:{
                pageNo:1,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10,
                total: 15
            },
            tableConfig:{
                data:[
                    {a:'默认票版',b:'200',c:'2019-07-07',d:'系统管理员',e:'1'}
                ],
                title:[{
                        label: '票版名称',
                        prop: 'name',
                        width: '200'
                    },{
                        label: '票版宽度(毫米)',
                        prop: 'width',
                        width: '200',
                        hasTemplate:true
                    },{
                        label: '票版高度(毫米)',
                        prop: 'height',
                        width: '200',
                        hasTemplate:true
                    },{
                        label:'更新时间',
                        prop:'updateTime',
                        with:''
                    },{
                        label:'制作人',
                        prop:'createUser',
                        with:''
                    },{
                        label:'默认票版',
                        prop:'isDefault',
                        with:'',
                        hasTemplate:true
                    },{
                        label: '操作',
                        width: '300',
                        hasTemplate: true,
                        fixed: 'right',
                        options:[{
                                operationName:'查看',
                                operationMethod:'check'
                            },{
                                operationName:'编辑',
                                operationMethod:'edit'
                            },
                            {
                                operationName:'删除',
                                operationMethod:'delete'
                            },
                            // {
                            //     operationName:'导入',
                            //     operationMethod:'import'
                            // },{
                            //     operationName:'导出',
                            //     operationMethod:'export'
                            // },
                            {
                                operationName:'设为默认',
                                operationMethod:'setDefualt'
                            }
                        ]
                    }
                ]
                
            }
        }
    },
    created() {
        //初始化查询
        this.searchList()
    },
    methods: {
        showDialog() {
            this.isShowDialog = !this.isShowDialog;
        },
        formData(type,data) {
            if(type=='isDefault'){
                return data.isDefault==1?'是':'否'
            }else if(type == 'width'){
                return Math.ceil(data.width/3.99)
            }else if (type == 'height'){
                return Math.ceil(data.height/3.99)
            }
        },
        /**
         *  @function operationMethod 
         *  @param    methodName 方法名
         *  @param    data  数据
         */
        operationMethod(methodName,data) {
            this[`${methodName}`](data)
        },
        //查看
        check(data) {
            console.log('查看')
            this.$router.push({
                name:'checkCouponTemplate',
                query:{
                    id:data.id,
                }
            })
        },
        //编辑
        edit(data) {
            this.$router.push({
                name:'couponTemplate',
                query:{
                    id:data.id,
                    isEdit:data?true:false
                }
            })
        },
        //删除
        delete(data) {
            this.$confirm('确认删除票版？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ccmList.deletemodel({id:data.id}).then(res => {
                        let type='warning',
                            message=res.msg?res.msg:'删除票版失败！'
                        if(res.code==200){
                            type = 'success'
                            message=res.mgs?res.msg:'删除票版成功！'
                            this.searchList()
                        }
                        this.$message({
                            type,
                            message
                        })
                    })
                })
        },
        //导入
        import(data) {
            console.log('导入',data)
        },
        //导出
        export(data) {
            console.log('导出',data)
        },
        //设置默认
        setDefualt(data) {
            this.$ccmList.setdefault({id:data.id}).then(res => {
                let type='warning',
                    message=res.msg?res.msg:'设置默认票版失败！'
                if(res.code==200){
                    type = 'success'
                    message=res.mgs?res.msg:'设置默认票版成功！'
                    this.searchList()
                }
                this.$message({
                    type,
                    message
                })
            })
        },
        handleSizeChange(value) {
            this.pageConfig.pageSize = value
            this.searchList()
        },
        handleCurrentChange(value) {
            this.pageConfig.pageNo = value
            this.searchList()
        },
        //查询列表
        searchList() {
            let params = {
                pageNo : this.pageConfig.pageNo,
                pageSize : this.pageConfig.pageSize
            }
            this.$ccmList.selectmodel(params).then(res => {
                if(res.code == 200 ){
                    this.tableConfig.data = res.data.list
                    this.pageConfig.total = res.data.pageNum
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/comList.scss";   

</style>
