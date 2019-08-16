<template>
    <div class="ccm_dialog">
        <el-dialog
        title="选择影院"
        :visible.sync="framedialogVisible"
        :close-on-click-modal="false"
        >
        <div>
            <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
                <el-form-item label="影院编码：">
					<el-input v-model="searchAdition.code"></el-input>
				</el-form-item>
                <el-form-item label="影院全称：">
					<el-input v-model="searchAdition.fullName"></el-input>
				</el-form-item>
                <el-button type="primary" @click="searchFunc"  style="position:absolute;right:0px">搜索</el-button>
            </el-form>
        </div>
        <div class="choose-body">
                <el-table :data="filmList" @row-click= "showRow"  ref="filmListRef" highlight-current-row>
                    <el-table-column label="选择" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio class="radio"  v-model="selectedId" :label="scope.row.code">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
					<el-table-column prop="code" label="影院编码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="影院全称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cityName" label="城市地区" show-overflow-tooltip>
                    </el-table-column>
				</el-table>
                <div class="page-wrap">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[10, 25, 50, 100]"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
        </div>
        <div  slot="footer">
            <el-button type="primary" @click="confirmData()">确 定</el-button>
            <el-button @click="closeDialog(false)">取 消</el-button>
        </div>
        
    </el-dialog>
    </div>
</template>

<script>
// import {authQueryUserCinemas} from 'frame_cpm/http/interface.js'
import {getCinemaList} from "cmm/http/interface.js"
export default {
    props: {
        innerData:{
            type:Object,
            default:()=>{},
            required: false
        }
    },
    data(){
        return {
            framedialogVisible:false,
            searchAdition:{
                code:'',
                fullName:'',
                provinceCode:'',
                cityName:'',
                regionName:'',
                userUid:JSON.parse(localStorage.getItem('user')).uid,
            },
            multipleSelection: [],
            filmList:[],
            provs:[],
            citys:[],
            areas:[],
            rules:{},
            total:0,
            pageSize:10,
            pageNum:1,
            selectedId: '',
		    selectedRows:null
        }
    },
    created(){
    },
    methods:{

        openDialog(flag,innerData) {
            this.framedialogVisible = true
            this.selectedId = innerData
            this.listAuthCommCinemas()
        },
        closeDialog() {
            this.framedialogVisible = false

        },
        showRow(row){
            //赋值给radio
            this.selectedRows = row;
            this.selectedId = row.code
        },
        confirmData(){
            let _this = this;
            _this.$emit('cinemaSingleCallBack',this.selectedRows) 
            this.framedialogVisible =false
        },
        //查询
        searchFunc(){
            this.listAuthCommCinemas();
        },
        selectable(row) {
            return row.approveStatus === 'WAIT_APPROVE'
        },

            listAuthCommCinemas(){
                let _this =this
                let postObj = {
                    name: this.searchAdition.fullName,
                    code: this.searchAdition.code,
                    userUid:this.searchAdition.userUid,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                getCinemaList(postObj).then( ret => {
                    if (ret && ret.code === 200) {
                        _this.total = ret.data.total
                        _this.filmList = ret.data.rows
                    } else {
                    }
                }).catch( err => {
                    console.log(err)
                })
            },
            //当前页数数目改变
			handleSizeChange(valua) {
				this.pageSize = valua;
				this.listAuthCommCinemas();
			},
				//当前页改变
			handleCurrentChange(valua) {
				this.pageNum = valua;
				this.listAuthCommCinemas();
			},
            submitForm(formName) {
                
            },

    }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/dialogs.scss"; 
</style>
