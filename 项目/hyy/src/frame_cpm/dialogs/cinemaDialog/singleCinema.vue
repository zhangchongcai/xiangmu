<template>
    <div class="diydialog-filmsingle">
        <el-dialog
        title="选择影院"
        :show-close="false"
        :visible.sync="framedialogVisible"
        :before-close="beforeClose"
        :close-on-click-modal="false"
        width="600px">
<!--  -->
        <div class="film-top">
            <el-form :inline="true" ref="ruleForm" label-width="78px" size="small" label-position="right" class="film-search">
                <el-form-item label="影院编码：">
					<el-input v-model.trim="searchAdition.code" style="width:160px;"></el-input>
				</el-form-item>
                <el-form-item label="影院全称：">
					<el-input v-model.trim="searchAdition.fullName" style="width:160px;"></el-input>
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
                <el-button type="primary" @click="searchFunc"  style=" width:80px; height:32px; margin-top: 1px;margin-left:8px;">搜索</el-button>
            </el-form>
        </div>
        <div class="film-body">
                <!-- class="diy-header" -->
                <el-table :data="filmList" @row-click= "showRow" style="height:336px;" @current-change="handleRowChange" ref="filmListRef" highlight-current-row>
                    <!-- <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column> -->
                    <el-table-column label="" width="50" align="center">
                        <template scope="scope">
                            <el-radio class="radio"  v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>
					<el-table-column prop="code" label="影院编码" show-overflow-tooltip></el-table-column>
					<el-table-column prop="name" label="影院全称" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="name" label="城市地区" show-overflow-tooltip>
                        <template slot-scope="scope">
                            {{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.areaName}}
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="area" label="城市地区" show-overflow-tooltip></el-table-column> -->
                    <!-- <el-table-column prop="isActive" label="状态" show-overflow-tooltip><el-table-column> -->
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
import {authQueryUserCinemas} from 'frame_cpm/http/interface.js'
export default {
    props: {
        framedialogVisible: {
            type:Boolean,
            default: true,
            required: true
        },
        innerData:{
            type:Object,
            default:{},
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
            filmListAll:[],
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
        // this.getAreaByparentCode()
        // this.filterCinemaList()
        this.selectedId = this.innerData.id
          let postObj = {
                    cinemaName: this.searchAdition.fullName,
                    cinemaCode: this.searchAdition.code,
                    resourceCode: this.innerCinemaMultiData && this.innerCinemaMultiData.resourceCode,
                    type: this.$attrs.type,
                    pageSize: 30000,
                    pageNum: 1
                }
                authQueryUserCinemas(postObj).then( ret => {
                    if (ret && ret.code === 200) {
                        this.filmListAll = ret.data.rows
                    }
                }).catch( err => {
                    console.log(err)
                })
    },
       watch: {
        framedialogVisible: {
            handler(newVal, oldVal) {
                if (newVal) {
                    this.searchAdition.code=''
                    this.searchAdition.fullName=''
                    this.listAuthCommCinemas();
                }
            }
        },
        deep: true,
        immediate: true
    },
    methods:{
        // closeDialog(){
        //     this.$emit('introduce',{
        //         framedialogVisible: false,
        //     })
        // },
       handleRowChange(val) {
        // this.selectedRows = val;
        // this.selectedId=this.selectedRows.id;
      },
        showRow(row){
            //赋值给radio
            let _this = this;
            let selectedRowsIndex = this.filmList.indexOf(row);
            this.selectedRows = row;
            this.selectedId=this.selectedRows.id;
            _this.$nextTick(function () { 
                if(selectedRowsIndex != -1){
                    _this.$refs.filmListRef.setCurrentRow(_this.filmList[selectedRowsIndex]);
                }
            })
        },
        beforeClose(){
            this.$emit('introduce',{
                framedialogVisible: false,
            })
        },
        confirmData(){
            let _this = this;
            let singleData = this.filmListAll.filter(item=>{
                return item.id == this.selectedRows.id
            })
            // let cinemaIdss = this.multipleSelection.map(item=> item.id)
            let cinemaIdss = this.selectedRows && this.selectedRows.fullName?this.selectedRows:singleData[0]
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
            console.log(cinemaIdss)
            _this.$emit('callBackSingle',{
                framedialogVisible: false,
                data: cinemaIdss,
                whereUse:this.$attrs.whereUse
            }) 
         
        },
        //查询
        searchFunc(){
            this.listAuthCommCinemas();
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
                let params = this.innerData
                let postObj = {
                    cinemaName: this.searchAdition.fullName,
                    cinemaCode: this.searchAdition.code,
                    resourceCode: this.innerCinemaMultiData && this.innerCinemaMultiData.resourceCode,
                    type: this.$attrs.type,
                    pageSize: this.pageSize,
                    pageNum: this.pageNum
                }
                authQueryUserCinemas(postObj).then( ret => {
                    if (ret && ret.code === 200) {
                        _this.total = ret.data.total
                        _this.filmList = ret.data.rows
                        _this.filmList.map(item=>{
                                item.area = !!item.provinceName?item.provinceName:'' + ' ' + !!item.cityName?item.cityName:'' + ' ' + !!item.areaName?item.areaName:''
                            })
                        _this.selectedId = params.id
                        if(!!params.id || !!_this.selectedRows){
                            // _this.selectedRows = this.filmList.filter(item=>params.id == item.id)[0]
                            let selectedSingleData = this.filmList.filter(item=>params.id == item.id)[0]
                            if(!!selectedSingleData){
                                _this.selectedRows = selectedSingleData
                            }else{
                                _this.selectedRows = params
                            }
                            _this.$nextTick(function () { 
                                for(let i=0;i<_this.filmList.length;i++){
                                    if(_this.filmList[i].id == params.id){
                                        _this.$refs.filmListRef.setCurrentRow(_this.filmList[i]);
                                    }
                                }
                            })
                        }
                        
                       
                    } else {

                    }
                }).catch( err => {
                    console.log(err)
                })
            //    this.filmList= cinemaData.commCinemas; 
            //    let abc = cinemaData.commCinemas
            //    this.total = abc.length
            //    this.selectedId = params.id
            //    this.selectedRows = this.filmList.filter(item=>params.id == item.id)[0]
            //     _this.$nextTick(function () { 
            //         for(let i=0;i<_this.filmList.length;i++){
            //             if(_this.filmList[i].id == params.id){
            //                 _this.$refs.filmListRef.setCurrentRow(_this.filmList[i]);
            //             }
            //         }
            //     })
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
        width:576px;
        .el-dialog__header{
            border-bottom: 1px solid #ccc !important;   
        }
        .el-table{
            border:0 !important;
            th, td {
                height: 30px !important;  
                line-height: 30px !important;  
            }
        }
        .el-dialog__title{
            color: #333;
        }
        .el-form-item--small .el-form-item__label{
            font-size:12px;
            color:#666;
        }
        .el-form-item--small.el-form-item{
          margin-bottom: 0;  
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
        .film-top{
            margin-left:8px;
            .el-form-item__label{
                padding: 0 !important;
            }
        }
        /deep/ .el-dialog {
            .el-table--enable-row-hover .el-table__body tr:hover>td {
            background-color: #e7ebff !important;
            }
        }
        .el-table tr:nth-child(1n){
            background-color: #fff;
        }
        .el-table tr:nth-child(2n){
            background-color: #fff;
        }
       .el-table.el-table--striped{
          border: 1px solid #e5e5e5;
          border-bottom:1px solid #e5e5e5;
        }
        // .el-table--striped .el-table__body tr.el-table__row--striped td{
        //   background:#f0f0f0;
        // }
        // .el-table--striped .el-table__body tr.el-table__row--striped.current-row td{
        //   background:#e7ebff;
        // }
        .el-table__body tr.current-row > td{
          background:#e7ebff;
        }
        .el-table .cell{
          padding-left: 8px;
          padding-right: 8px;
          span{
            /*color:#333;*/
            &.table-btn-mini{
              color:#3B74FF;
              cursor: pointer;
              margin-right:6px;
            }
          }
        }
        .el-table th.is-leaf{
            border-bottom: 1px solid #e5e5e5;
            // border-left: 1px solid #e5e5e5;
            background: #e7ebff;
            color: #333;
        }
        .el-table td {
            border-bottom: 1px solid #e5e5e5;
        }
        .el-table th.is-leaf:nth-child(1), .el-table td:nth-child(1) {
            border-left: 0;
        }
        .el-dialog {
            .el-dialog__body{
                // border-top:1px solid #ccc;
                // border-bottom:1px solid #ccc;
                padding: 16px 0px 0 !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .page-wrap{
        padding: 24px 0 24px 0;
        text-align: left;
        margin-left:18px;
    }
    .film-body{
        margin: 16px;
        border: 1px solid #e5e5e5;
        .aside_left{
            display: flex;
            padding-left:10px;
            padding-right: 10px;
            height: 332px;
            overflow: hidden;
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
