<template>
    <div class="diydialog">
        <el-dialog
        title="选择影院"
        :visible.sync="dialogVisible"
        width="80%"
        :show-close="false"
        custom-class="usual-dialog"
        :before-close="handleClose">
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
                <el-button type="primary" @click="searchFunc" icon="el-icon-search" style="margin-top: 1px">搜索</el-button>
            </el-form>
        </div>
        <div class="film-body" style="max-height:320px;overflow:auto;">
            <div class="aside_left">
                <el-table :data="filmList" @selection-change="handleSelectionChange" ref="filmListRef" style="width: 98%;margin-left:1%;" class="diy-header" stripe>
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
					<el-table-column prop="code" label="影院编码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="影院全称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="area" label="城市地区" show-overflow-tooltip></el-table-column>
                    <!-- <el-table-column prop="isActive" label="状态" show-overflow-tooltip><el-table-column> -->
				</el-table>
                <div class="page-wrap">
                    <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 25, 50, 100]"
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
                            <span style="float:left;">{{item.name}}</span>
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
import cinemaData from './cinema.js'
import {listAuthCommCinemas} from 'frame_cpm/http/interface.js'
export default {
    props: {
        dialogVisible: {
            type:Boolean,
            default: true,
            required: true
        },
        innerData:{
            type:Object,
            default:{},
            required: true
        },
        isListprop: {
            type:Boolean,
            default: false,
            required: true
        }
    },
    data(){
        return {
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
            pageSize:20,
            currentPage:1
        }
    },
    created(){
        // this.getAreaByparentCode()
        // this.filterCinemaList()
        console.log(this.$attrs.whereUse)
        debugger
    },
    methods:{
        // closeDialog(){
        //     this.$emit('introduce',{
        //         dialogVisible: false,
        //     })
        // },
        confirmData(){
            let _this = this;
            let cinemaIdss = this.multipleSelection.map(item=> item.id)
            this.multipleSelection.map(item=> item.checked=true)
            // let quanji = this.filmList.map(item=> item.id)
            // let paichuji = quanji.filter(key => !cinemaIdss.includes(key))
            // let params={
            //     consumerId:this.innerData.consumerId,
            //     time:this.innerData.time,
            //     cinemaIds:paichuji.join(',')
            // }
            // _this.$apiBase.cancelAuthCinema(params)
            // .then( ret => {
            //     if (ret && ret.code === 200) {
            //         // _this.success(ret.data)
            //          _this.success('已取消授权影院'+paichuji.length+'家')    
            //     } else {
            //         _this.error(ret.data)
            //     }
            // }).catch( err => {
            //     console.log(err)
            // })
            let abc = _this.$attrs.whereUse
               debugger
            _this.$emit('callBack',{
                dialogVisible: false,
                dataList: this.multipleSelection,
                whereUse:this.$attrs.whereUse
            }) 
         
        },
        //查询
        searchFunc(){
            this.listAuthCommCinemas();
        },
        handleClose(done) {
            this.$emit('callBack',{
                dialogVisible: false,
                dataList:[]
            }) 
            // this.$confirm('确认关闭？').then(_ => {
            //     done();
            // }).catch(_ => {});
            
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val)
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
            listAuthCommCinemas(){
                // let params={
                //     consumerId:175,
                //     productVersionId:1,
                //     relatedInformationId:1
                // }
                let _this =this
                let params = this.innerData.editData
                let abcd = _this.$attrs.whereUse
                debugger
                let postObj = {
                    fullName:this.searchAdition.fullName,
                    code:this.searchAdition.code
                }
                // listAuthCommCinemas(postObj)
                // .then( ret => {
                //     if (ret && ret.code === 200) {
                //         this.filmList = ret.data
                //         this.total = ret.data.length
                //         this.filmList.map(item=>{
                //             item.area = item.provinceName + item.cityName + item.areaName
                //         })
                        // this.$nextTick(function () {  
                        // for(let i=0;i<_this.filmList.length;i++){
                        //         _this.$refs.filmListRef.toggleRowSelection(this.filmList[i],true)
                        //     }
                        // })
                //     } else {}
                // }).catch( err => {
                //     console.log(err)
                // })
               this.filmList= cinemaData.commCinemas; 
               let abc = cinemaData.commCinemas
               this.total = abc.length
                for(let i=0;i<_this.filmList.length;i++){
                    _this.filmList[i].checked = false
                    if(params && params.length){
                        for(let j=0;j<params.length;j++){
                            if(_this.filmList[i].id == params[j].id){
                                _this.filmList[i].checked = true
                            }
                        }
                    }
                }
                let hasChecked = this.filmList.filter(item =>  item.checked === true)
              
                debugger
                this.$nextTick(function () {   
                      _this.$refs.filmListRef.clearSelection(); 
                    hasChecked.forEach((row,index) => {
                        _this.$refs.filmListRef.toggleRowSelection(row,true);
                    });
                })
            },
            //当前页数数目改变
			handleSizeChange(valua) {
				this.pageSize = valua;
				console.log(this.current);
				this.listAuthCommCinemas();
			},
				//当前页改变
			handleCurrentChange(valua) {
				this.current = valua;
				console.log(this.current);
				this.listAuthCommCinemas();
			},
            submitForm(formName) {
                
            },

    }
}
</script>

<style lang="scss">
    .diydialog{
        .usual-dialog{
            z-index: 999999;
        }
        .el-dialog__wrapper{
            z-index: 999999!important;
        }
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
            width: 88%;
            float: left;
        }
        .aside_right{
            width: 48%;
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
