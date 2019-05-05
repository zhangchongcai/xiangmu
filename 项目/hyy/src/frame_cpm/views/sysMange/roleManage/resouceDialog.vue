<template>
    <div class="diydialog">
        <el-dialog
        :title="roleTitle"
        :visible.sync="dialogVisible"
        width="80%"
        :before-close="handleClose">
        <div class="film-top">
            <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
                <el-form-item label="员工名称：" prop="resourceName">
					<el-input v-model="searchAdition.resourceName"></el-input>
				</el-form-item>
                <el-form-item class="width100" label="员工账号：" prop="sysCode">
                    <el-input v-model="searchAdition.resourceName"></el-input>
                </el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search" style="margin-top: 6px">搜索</el-button>
            </el-form>
        </div>
        <div class="film-body" style="max-height:320px;overflow:auto;">
            <div class="aside_left">
                <el-table :data="resourceList" @selection-change="handleSelectionChange" ref="resourceListRef" style="width: 98%;margin-left:1%;" class="diy-header" stripe>
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column prop="sysCode" label="员工名称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="sysName" label="员工账号" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="resourceName" label="所属部门" show-overflow-tooltip></el-table-column>
				</el-table>
                <div class="page-wrap">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 25, 30]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
                
            </div>
            <!-- <div class="aside_right">
                <div class="choose-header">
                     <span style="float:left;">已选影院 {{multipleSelection.length}}</span>
                     <span style="float:right;">清空</span>
                </div>
                <div class="selected-ul">
                    <ul>
                        <li v-for="(item,index) in multipleSelection" :key="index" class="li-item">
                            <span style="float:left;">{{item.resourceName}}</span>
                            <span style="float:right;">X</span>
                        </li>
                    </ul>
                </div>
            </div> -->
        </div>
         <span slot="footer" class="dialog-footer">
              <slot name="footerId"></slot>
            <!-- <el-button @click="closeDialog(false)">取 消</el-button>
            <el-button type="primary" @click="confirmData()">确 定</el-button> -->
            <!-- <div class="class" slot="dialogfooter"></div> -->
        </span>
        
    </el-dialog>
    </div>
</template>

<script>
// import utilDict from 'frame_cpm/util/formatDict.js'
export default {
    props: {
        dialogVisible: {
            type:Boolean,
            default: true,
            required: true
        },
        bitianxiang:{
            type:Object,
            default:{},
            required: true
        },
        isListprop: {
            type:Boolean,
            default: false,
            required: true
        },
        roleTitle: {
            type:String,
            default: '',
            required: true
        },
    },
    data(){
        return {
            searchAdition:{
                mgCode:'',
                provinceCode:'',
                cityName:'',
                regionName:''
            },
            resourceDicts:[],
            multipleSelection: [],
            resourceList:[],
            provs:[],
            citys:[],
            areas:[],
            rules:{},
            total:1,
            pageSize:20,
            currentPage:1
        }
    },
    created(){
        // this.getAreaByparentCode()
        // this.filterCinemaList()
        // this.resourceDicts = utilDict.getDicts('resource_sys_code');
        // let abc = utilDict.getDicts('resource_sys_code');
    },
    methods:{
        // closeDialog(){
        //     this.$emit('introduce',{
        //         dialogVisible: false,
        //     })
        // },
        confirmData(){
            let _this = this;
            let resourceIdsTemp = this.multipleSelection.map(item=>{
                return item.id
            }).join(',')
              let params={
                    menuId:this.bitianxiang.menuId,
                    resourceIds:resourceIdsTemp
                }
                _this.$apiBase.insertMenuResource(params)
                .then( ret => {
                    if (ret && ret.code === 200) {
                        _this.success(ret.data)
                    } else {
                        _this.error(ret.data)
                    }
                }).catch( err => {
                    console.log(err)
                })
            _this.$emit('introduce',{
                dialogVisible: false,
                dataList: this.multipleSelection
            }) 
         
        },
        //查询
        search(){
            this.bitianxiang.resourceName = this.searchAdition.resourceName
            // this.bitianxiang.menuId = this.searchAdition.sysCode
            this.queryResource();
        },
        handleClose(done) {
            this.$emit('introduce',{
                dialogVisible: false,
                dataList:[]
            }) 
            // this.$confirm('确认关闭？').then(_ => {
            //     done();
            // }).catch(_ => {});
            
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        selectable(row) {
            return row.approveStatus === 'WAIT_APPROVE'
        },

        getProv: function (prov) {
                var item = this.provs.filter(item=>{
                    return item.areaCode==prov
                })
                // console.log(item)
                this.searchAdition.area.pcode=item[0].areaCode;
                this.searchAdition.area.pname=item[0].areaName;
                this.searchAdition.area.cname=""
                this.searchAdition.area.aname="" // 供valadite 使用

                this.searchAdition.provinceCode=item[0].areaCode;
                this.searchAdition.provinceName=item[0].areaName;
                this.searchAdition.cityCode = ''
                this.searchAdition.cityName = ''
                this.searchAdition.regionCode = ''
                this.searchAdition.regionName = ''
                this.getAreaByparentCode(prov)
            },
            //保存城市数据
            getCity: function (city) {
                var item = this.citys.filter(item=>{
                    return item.areaCode==city
                })
                this.searchAdition.area.ccode=item[0].areaCode;
                this.searchAdition.area.cname=item[0].areaName;
                this.searchAdition.area.aname="" // 供valadite 使用

                this.searchAdition.cityCode =item[0].areaCode;
                this.searchAdition.cityName =item[0].areaName;
                this.searchAdition.regionCode = ''
                this.searchAdition.regionName = ''
                this.$api.getAreaByparentCode({areaCode:city})
                .then( ret => {
                    if (ret && ret.code === 200) {
                            this.areas = ret.data
                    } else {}
                }).catch( err => {
                    console.log(err)
                })
            },
            getArea: function (area) {
                var item = this.areas.filter(item=>{
                    return item.areaCode==area
                })
                this.searchAdition.area.acode=item[0].areaCode;
                this.searchAdition.area.aname=item[0].areaName;  // 供valadite 使用
                this.searchAdition.regionCode =item[0].areaCode;
                this.searchAdition.regionName =item[0].areaName;
                console.log(this.searchAdition)
            },
            getAreaByparentCode(code){
                var parentCode=code?code:"000000";
                this.$api.getAreaByparentCode({areaCode:parentCode})
                .then( ret => {
                    if (ret && ret.code === 200) {
                        if(!code){
                            this.provs = ret.data
                        }else{
                            this.citys = ret.data
                        }
                    } else {}
                }).catch( err => {
                    console.log(err)
                })
            }, 
            queryResource(data){
                let _this =this
                _this.bitianxiang.pageNum = 1
                    // let params = _this.bitianxiang
                    // params.pageNum = 1
                    // let getObj = {}
                    // getObj.pageNum = 1
                this.$apiBase.queryResource(this.bitianxiang)
                .then( ret => {
                    if (ret && ret.code === 200) {
                        _this.resourceList = ret.data.rows
                        let abc = _this.$refs.resourceListRef
                        _this.total = ret.data.total;
                        _this.pageNum = ret.data.pageNum;
                        _this.pageSize = ret.data.pageSize;
                        let hasChecked = _this.resourceList.filter(item =>  item.checked === true)
                        this.$nextTick(function () {    
                        hasChecked.forEach((row,index) => {
                            _this.$refs.resourceListRef.toggleRowSelection(row,true);
                        });
                        })
                    } else {}
                }).catch( err => {
                    console.log(err)
                })
                // then((ret)=>{
                    // for(let i=0;i<this.resourceList.length;i++){
                    //         _this.$refs.resourceListRef.toggleRowSelection(this.resourceList[i],true)
                    //     }
                // })
            },
            //当前页数数目改变
			handleSizeChange(valua) {
				this.pageSize = valua;
				console.log(this.current);
				this.queryResource();
			},
				//当前页改变
			handleCurrentChange(valua) {
				this.current = valua;
				console.log(this.current);
				this.queryResource();
			},
            submitForm(formName) {
                
            },

    }
}
</script>

<style lang="scss">
    .diydialog{
        .el-dialog {
            .el-dialog__body{
                border-top:1px solid #ccc;
                border-bottom:1px solid #ccc;
                padding: 20px 0px 0 !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .film-body{
        padding-top: 8px;
        .aside_left{
            width: 98%;
            float: left;
        }
        .aside_right{
            width: 38%;
            padding:1%; 
            margin-left:-8px;
            float: left;
            border:1px solid #e5e5e5;
            border-left:0;
            .choose-header{
                padding-bottom:12px; 
            }
        }
        .selected-ul{
            .li-item{
                width: 100%;
                clear: both;
                display: block;
            }
        }
    }
</style>