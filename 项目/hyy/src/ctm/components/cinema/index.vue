<template>
    <div class="diydialog-filmsingle">
        <el-dialog
        title="选择影院"
        :visible.sync="framedialogVisible"
        :show-close="false"
        width="70%">
        <div class="film-top">
            <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
                <el-form-item label="影院编码：">
					<el-input v-model="searchAdition.code"></el-input>
				</el-form-item>
                <el-form-item label="影院全称：">
					<el-input v-model="searchAdition.fullName"></el-input>
				</el-form-item>
                <!-- <el-form-item class="width100" label="地区选择：" prop="area">
                        <el-select size="small" style="width: 110px" v-model="searchAdition.provinceCode" v-on:change="getProv($event)" placeholder="请选择省份">
                        <el-option v-for="item in provs" :label="item.areaName" :value="item.areaCode" :key= "item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" style="width: 110px" v-model="searchAdition.cityName" v-on:change="getCity($event)" placeholder="请选择城市">
                        <el-option v-for="item in citys" :label="item.areaName" :value="item.areaCode" :key="item.value">
                        </el-option>
                    </el-select>
                        <el-select size="small" style="width: 110px" v-model="searchAdition.regionName" v-on:change="getArea($event)" placeholder="请选择地区" >
                        <el-option v-for="item in areas" :label="item.areaName" :value="item.areaCode" :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-button type="primary" @click="searchFunc" icon="el-icon-search" style="margin-top: 1px;margin-left:8px;">搜索</el-button>
            </el-form>
        </div>
        <div class="film-body">
                <el-table :data="filmList" @row-click= "showRow"  height="308px" ref="filmListRef" highlight-current-row>
                    <el-table-column label="选择" width="50" align="center">
                        <template slot-scope="scope">
                            <el-radio class="radio"  v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
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
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
                </div>
        </div>
         <span slot="footer" class="dialog-footer">
              <slot name="footerId"></slot>
            <el-button type="primary" @click="confirmData()">确 定</el-button>
            <el-button @click="closeDialog(false)">取 消</el-button>
            <!-- <div class="class" slot="dialogfooter"></div> -->
        </span>
        
    </el-dialog>
    </div>
</template>

<script>
import {authQueryUserCinemas} from 'frame_cpm/http/interface.js'
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
                regionName:''
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

        openDialog() {
            this.framedialogVisible = true
            this.listAuthCommCinemas()
        },
        closeDialog() {
            this.framedialogVisible = false

        },
        showRow(row){
            //赋值给radio
            let _this = this;
            let selectedRowsIndex = this.filmList.indexOf(row);
            this.selectedRows = row;
            _this.$nextTick(function () { 
                if(selectedRowsIndex != -1){
                    this.selectedId = row.id
                }
            })
        },
        confirmData(){
            let _this = this;
            let cinemaIdss = !!this.selectedRows?this.selectedRows:{}
            _this.$emit('cinemaCallback',{
                data: cinemaIdss,
                whereUse:this.$attrs.whereUse
            }) 
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
                    cinemaName: this.searchAdition.fullName,
                    cinemaCode: this.searchAdition.code,
                    type: 2,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                authQueryUserCinemas(postObj).then( ret => {
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

<style lang="scss">
    .diydialog-filmsingle{
        .el-dialog__header{
            .el-dialog__title{
                padding-bottom: 5px;
                width: 100%;
                display: inline-block;
                border-bottom: 1px solid #e5e5e5;
            }
        }
        
    }
</style>
<style lang="scss" scoped>
    .film-body{
        border: 1px solid #e5e5e5;
        .selected-ul{
            .li-item{
                width: 100%;
                clear: both;
                display: block;
            }
        }
    }
</style>
