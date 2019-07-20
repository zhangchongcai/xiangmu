<template>
<div class="page-wrapper page-justsee-film-base page-justsee-basecenema-edit">
    <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>查看基础影片</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="clearboth"></div>
    <!-- <section v-if="!noDatadialogVisible"> -->
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
             <!--基本信息-->
             <section class="film-base-page">
                 <el-form ref="filmBase" :model="filmBase" label-width="110px" label-position="right" label-height='60px'>
                 <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="影片名称：" prop="fullName">
                        <el-input v-model="filmBase.fullName" :disabled="true" placeholder="" class="wid220"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="英文名称：" prop="enName">
                        <el-input v-model="filmBase.enName" :disabled="true" placeholder=""  class="wid220"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="年代：" prop="years">
                        <!-- <el-input v-model="filmBase.years" :disabled="true" placeholder=""  class="wid220"></el-input> -->
                        <span>{{filmBase.years}}</span>
                        <!-- <el-date-picker
                         :disabled="true"
                        v-model="filmBase.years"
                        type="year"
                        placeholder="选择年">
                        </el-date-picker> -->
                         <!-- <el-date-picker
                            type="year"
                             :disabled="true"
                            value-format="yyyy"
                            placeholder="选择日期"
                            v-model="filmBase.years"
                            style="width: 100%;"
                            ></el-date-picker> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="影片别名：" prop="name">
                            <span>{{nameslist}}</span>
                        <!-- <el-input v-model.trim ="filmBase.inputName" :disabled="true" placeholder="" style="width:150px;'"></el-input>
                        <el-button @click.prevent="addAlias()" v-if="!true">添加</el-button> -->
                           <!-- <el-table :key='tableKey'
                            :data="nameslist"
                            v-loading="listLoading"
                            element-loading-text="拼命加载中..."
                            highlight-current-row
                            stripe
                            size="mini"
                            v-if="nameslist.length>0"
                            style="width: 96%; ">
                            <el-table-column label="别名">
                                <template slot-scope="scope">
                                <span>{{ scope.row }}</span>
                                </template>
                            </el-table-column>
                        </el-table> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="艺恩ID：" prop="eunEnId">
                        <el-input v-model="filmBase.eunEnId" :disabled="true" placeholder=""  class="wid220"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                  <el-row :gutter="20">
                    <el-col :span="8">
                        <!-- <el-table :key='tableKey'
                            :data="nameslist"
                            v-loading="listLoading"
                            element-loading-text="拼命加载中..."
                            highlight-current-row
                            stripe
                            size="mini"
                            v-if="nameslist.length>0"
                            style="width: 96%;margin-left:28px; ">
                            <el-table-column label="别名">
                                <template slot-scope="scope">
                                <span>{{ scope.row }}</span>
                                </template>
                            </el-table-column>
                        </el-table> -->
                    </el-col>
                  </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="上映日期：" prop="showTime">
                            <!-- <d5-datepicker v-bind="{ clearable: false, 'value-format': 'yyyy-MM-dd'}" v-model="filmBase.showTime" :maxDate="filmBase.downwardTime"  :disabled="isJustSee">
                            </d5-datepicker> -->
                            <span>{{filmBase.showTime}}</span>
                             <!-- <el-tabs v-model="activeDate" @tab-click="handleClick" style="width: 220px;">
                                <el-tab-pane label="年" name="tabYear">
                                    <el-date-picker
                                        v-model="filmBase.showTime"
                                        value-format="yyyy"
                                        type="year"
                                        placeholder="选择年">
                                    </el-date-picker>
                                </el-tab-pane>
                                <el-tab-pane label="月" name="tabMonth">
                                    <el-date-picker
                                        v-model="filmBase.showTime"
                                        type="month"
                                        value-format="yyyy-MM"
                                        placeholder="选择月">
                                    </el-date-picker>
                                </el-tab-pane>
                                <el-tab-pane label="日" name="tabDay">
                                    <el-date-picker
                                        v-model="filmBase.showTime"
                                        type="date"
                                         value-format="yyyy-MM-dd"
                                        placeholder="选择日">
                                    </el-date-picker>
                                </el-tab-pane>
                            </el-tabs> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="下映日期：" prop="downwardTime">
                            <!-- <d5-datepicker v-bind="{ clearable: false, 'value-format': 'yyyy-MM-dd'}" v-model="filmBase.downwardTime" :minDate="filmBase.showTime"  :disabled="isJustSee">
                            </d5-datepicker> -->
                             <span>{{filmBase.downwardTime}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="首映日期：" prop="premiereTime">
                            <span>{{filmBase.premiereTime}}</span>
                            <!-- <d5-datepicker v-bind="{ clearable: false, 'value-format': 'yyyy-MM-dd'}" v-model="filmBase.premiereTime"  :disabled="isJustSee">
                            </d5-datepicker> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="影片时长：" prop="code">
                            <!-- <el-input v-model="filmBase.filmTime" v-if="!true" placeholder=""  class="wid220"></el-input> -->
                            <span>{{filmBase.filmTime}}</span>
                            <span>分钟</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="帧数：" prop="frameNumber">
                         <span>{{filmBase.frameNumber}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="影片字幕：" prop="filmSubtitles">
                        <span>{{filmBase.filmSubtitles | dict('movie_film_film_subtitles',filmBase.filmSubtitles)}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="影片级别：" prop="filmLevel">
                            <!-- movie_film_film_level -->
                            <span>{{filmBase.filmLevel | dict('movie_film_film_level',filmBase.filmSubtitles)}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="影片产地：" prop="producingArea">
                            <!-- movie_film_producing_area -->
                        <span>{{filmBase.producingArea | dict('movie_film_producing_area',filmBase.filmSubtitles)}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
               <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="影片版本：" prop="filmEditions" class="margin-bottom0">
                            <!-- v-if="!isJustSee" -->
                            <el-checkbox-group v-model="filmEditions" class="just-see-checkbox">
                                <el-checkbox v-for="edition in filmEditionDicts" :label="edition.code" :disabled="true" :key="edition.code">{{edition.name}}</el-checkbox>
                            </el-checkbox-group>
                            <!-- <div v-if="isJustSee" class="just-see-checkbox">
                                <span v-for="edition in filmEditions" :key="edition">{{edition.name}}</span>
                            </div> -->
                        </el-form-item>
                    </el-col>
                </el-row> 
                 <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="影片语言：" prop="filmLanguages" class="margin-bottom0">
                        <el-checkbox-group v-model="filmLanguages" class="just-see-checkbox">
                              <el-checkbox v-for="edition in filmLanguagesDicts" :label="edition.code" :disabled="true" :key="edition.code">{{edition.name}}</el-checkbox>
                        </el-checkbox-group>
                        <!-- <div v-if="isJustSee" class="just-see-checkbox">
                            <span v-for="edition in filmLanguages" :key="edition">{{edition}}</span>
                        </div> -->
                        </el-form-item>
                    </el-col>
                </el-row>  
                 <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="影片类型：" prop="filmTypes" class="margin-bottom0">
                        <el-checkbox-group v-model="filmTypes" class="just-see-checkbox">
                            <el-checkbox v-for="edition in filmTypesDicts" :label="edition.code" :disabled="true"  :key="edition.code">{{edition.name}}</el-checkbox>
                        </el-checkbox-group>
                        <!-- <div v-if="isJustSee" class="just-see-checkbox">
                            <span v-for="edition in filmTypes" :key="edition">{{edition}}</span>
                        </div> -->
                        </el-form-item>
                    </el-col>
                </el-row> 
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form-item label="主海报：" prop="fujian" v-if="!!uploadValue" class="width100per">
                            <imageUpload :value="uploadValue" :islookUp="true" @imageCallBack="imgParamCall"  :disabled="true"></imageUpload>
                        </el-form-item>  
                    </el-col>
                </el-row>   
                 <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form-item label="推荐广告语：" prop="filmSlogan" class="margin-bottom0">
                            <span>{{filmBase.filmSlogan}}</span>
                            <!-- <el-input type="textarea" v-model="filmBase.filmSlogan" :disabled="true"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="16">
                        <el-form-item label="剧情介绍：" prop="storyDesc">
                             <span>{{filmBase.storyDesc}}</span>
                            <!-- <el-input type="textarea" v-model="filmBase.storyDesc" :disabled="true"></el-input> -->
                        </el-form-item>
                    </el-col>
                </el-row>  
                
                </el-form>
                <div class="btn" style="margin:20px auto; text-align:center;">
                    <el-button @click="out">返回</el-button>
                </div>
             </section>
             <!--基本信息-->
        </el-tab-pane>
        <el-tab-pane label="图片" name="second" v-if="false == true">图片</el-tab-pane>
    </el-tabs>
    <!-- </section> -->
    <!-- <section class="no-film" v-if="noDatadialogVisible">
        暂无此影片数据
         <div class="btn" style="margin:20px auto; text-align:center;">
                    <el-button @click="out">返回</el-button>
                </div>
    </section> -->
    <el-dialog title="提示" :visible.sync="noDatadialogVisible" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div>
                 暂无此影片数据
            </div>
            <div class="btn" style="margin:20px auto; text-align:center;">
                    <el-button @click="noDatadialogVisible = false">关闭</el-button>
            </div>
    </el-dialog>
</div>
</template>

<script>
import utilDict from '../../util/formatDict.js'
// import {
//     checkEmail,
//     numberPatten,
//     alphaNum,
// } from '../../../util/inputDataCheck'
// import {provs,allCity} from './cityData.js';
    function formatDate(datetime , fmt){
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
import { cpmFilmCodeget, dictList,cpmFilmget, cpmFilmList,cpmFilmCodeList,getByCode  } from "frame_cpm/http/interface.js";
    export default {
        data(){
            return{
               listLoading:false,
               noDatadialogVisible:false,
               baseURL:'',
               uploadValue:'',
               activeName: 'first',
               activeDate: 'tabMonth',
               tableKey:1,
               fileList:[],
               postBeforValidate:true,
               isModify:false,
               isJustSee:false,
               checkList: ['选中且禁用','复选框 A'],
               filmTitle:'',
               nameslist:'',
               filmBase:{
                   fullName:null,
                   inputName:'',
                   enName:null,
                   years:null,
                   name:null,
                   eunEnId:null,
                   showTime:null,
                   downwardTime:null,
                   premiereTime:null,
                   filmTime:null,
                   frameNumber:null,
                   filmSubtitles:null,
                   filmLevel:null,
                   producingArea:null,
                   mainPoster:null,
                   filmSlogan:null,
                   storyDesc:null
               },
               rules:{
                   fullName:[
                       {required: true ,message:'请填写影片名称', trigger: 'blur'},
                   ]
               },
               frameNums: [],
               filmSubtitles: [], // 影片字幕
               filmLevels: [], // 影片级别
               producingAreas: [], // 影片产地
               filmEditions:[],  // 影片版本
               filmEditionDicts:[],
               filmLanguages:[],  // 影片语言
               filmLanguagesDicts:[],
               filmTypes:[], // 影片类型
               filmTypesDicts:[], // 影片类型
            }    
        },
        methods:{
            handleCheckedFilmEditionChange(val){
                this.filmEdition = val
                console.log(val)
            },
            handleClick(tab, event) {
                console.log(tab, event);
            },
            imgParamCall(opt){
                console.log(opt)
                this.uploadValue = opt
            },
            handlePreview(file) {
                console.log(file);
            },
            //获取客户详情
            getInfo(){
                let idCache = this.$route.query.code;
                    // var getname = this.getname;
               getByCode({code:idCache})
                .then((ret)=> {
                  if(ret.code === 200){
                    //   this.filmBase = ret.data
                    //   this.filmEditions=ret.data.filmEdition.split(',')
                    //   this.filmLanguages=ret.data.filmLanguage.split(',')
                    //   this.filmTypes=ret.data.filmType.split(',')
                    //   this.nameslist = ret.data.name !== '' ?ret.data.name.split(','):''
                    if(!!ret.data && !!ret.data.filmId){
                        cpmFilmget({id:ret.data.filmId})
                        .then((retInner)=> {
                            if(retInner.code === 200){
                                this.filmBase = retInner.data
                                this.uploadValue = retInner.data.mainPoster
                                this.filmTypes = retInner.data.filmType.substr(0,1) == ',' ? retInner.data.filmType.substr(1).split(','):retInner.data.filmType.split(',')
                                this.filmLanguages = retInner.data.filmLanguage.substr(0,1) ==',' ? retInner.data.filmLanguage.substr(1).split(',') : retInner.data.filmLanguage.split(',')
                                this.filmEditions = retInner.data.filmEdition.substr(0,1) ==',' ? retInner.data.filmEdition.substr(1).split(',') : retInner.data.filmEdition.split(',')
                                this.nameslist = retInner.data.name !== '' ? retInner.data.name : ''
                                this.filmBase.showTime = !!this.filmBase.showTime?formatDate(retInner.data.showTime, 'yyyy-MM-dd'):' '
                                this.filmBase.downwardTime = !!this.filmBase.downwardTime?formatDate(retInner.data.downwardTime, 'yyyy-MM-dd'):' '
                                this.filmBase.premiereTime = !!this.filmBase.premiereTime ? formatDate(retInner.data.premiereTime, 'yyyy-MM-dd'):' '
                                // this.filmBase.years = this.filmBase.years?this.filmBase.years:''
                                this.filmBase.years = !!this.filmBase.years ? formatDate(retInner.data.years, 'yyyy') : ' '
                                console.log(retInner.data)
                            }
                        })
                    }else{
                        this.noDatadialogVisible = true
                    }
                    
                  }
                })
                .catch(function (error) {
                    console.log(error);
                });
            },
            //获取联动城市方法

            //取消退出
            out(){
                // this.$router.push("/home/ope/baseFilm/index")
                this.$router.go(-1)
            },
            unique(arr){
            　　var newArr = [arr[0]];
            　　 for(var i=1;i<arr.length;i++){
            　　　　if(newArr.indexOf(arr[i]) == -1){
                    　　 newArr.push(arr[i]);
                　　  }
                    }
                return newArr;
            },
            addContact(){
                let abc = this.$refs
            //    this.tableData.push({contract:'',telephone:'', job:'' ,email:''}) 
            if(this.$refs.tableDataRef){
                // this.$refs.tableDataRef.clearValidate()
            }
            this.dialogFormVisible = true
            }
        },
        created(){
            let domain = document.domain;
            switch (domain) {
                case 'testops.oristarcloud.com':
                    this.baseURL = 'http://testops.oristarcloud.com/api'
                    break;
                case 'devops.oristarcloud.com':
                    this.baseURL = 'http://devops.oristarcloud.com/api'
                    break;
                case '127.0.0.1':
                    this.baseURL = 'http://devops.oristarcloud.com/api'
                    break;
            }
            // this.frameNums = utilDict.getDicts('movie_film_frame_number'); // 帧数
            // this.filmSubtitles = utilDict.getDicts('movie_film_film_subtitles'); // 影片字幕
            // this.filmLevels = utilDict.getDicts('movie_film_film_level'); // 影片级别
            // this.producingAreas = utilDict.getDicts('movie_film_producing_area'); // 影片产地
            this.filmLanguagesDicts = utilDict.getDicts('movie_film_film_language'); // 影片语言
            this.filmEditionDicts = utilDict.getDicts('movie_film_film_edition'); // 影片版本
            this.filmTypesDicts = utilDict.getDicts('movie_film_film_type'); // 影片类型
    
            this.isModify = (this.$route.query.isModify=='true' || this.$route.query.isModify==true)?true:false
            this.isJustSee  = (this.$route.query.isJustSee=='true' || this.$route.query.isJustSee==true)?true:false
            if(this.$route.query.code){
                this.getInfo();
                // this.filmTitle = '编辑基础影片'
            }else if(!this.isModify && !this.isJustSee){
                // this.filmTitle = '新建基础影片'
            }
        //    if(this.isJustSee){
        //         this.filmTitle = '查看基础影片'
        //     }
            // dictList().then(ret => {
            //     this.list = ret.data.result
            //     this.total = ret.data.totalSize !=0? ret.data.totalSize:1
            //     this.listLoading = false
            // })
        },
    }
</script>
<style lang="scss">
    .page-justsee-film-base{
        .just-see-checkbox{
            .el-checkbox{
                display: none;
                &.is-checked{
                    display: inline-block;
                    .el-checkbox__input{
                        display: none;
                    }
                }
            }
            span{
                margin-right:6px;
            }
            .el-checkbox__input.is-disabled + span.el-checkbox__label{
                color: #808080;
                cursor: text;
            }
        }
        .el-date-editor.is-disabled .el-icon-date{
            display: none;
        }
        .el-textarea.is-disabled .el-textarea__inner{
             border-color:transparent;
            background-color:transparent;
            cursor: text;
            color: #808080;
            border: 0 none;
            padding-top:10px;
        }
        .el-checkbox{
            margin-left: 0;
            margin-right: 30px;
        }
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
<style  lang='scss' scoped>
    .page-justsee-basecenema-edit{
        height: calc(100% - 50px);
    }
    .no-film{
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: -4%;
        height: calc(100% - 200px);
        color: #606266;
    }
    .breadcrumb{
        margin-top:20px; margin-bottom:20px;
    }
    .film-base-page{
      
        .wid220{
            width: 220px;
        }
        .el-row {
            &:last-child {
            margin-bottom: 0;
            }
        }
        .el-form-item.margin-bottom0{
            margin-bottom: 0;
        }
        .el-form-item{
             margin-bottom: 12px;
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .el-table .cell span.table-btn-mini {
            color: #3B74FF;
            cursor: pointer;
            margin-right: 6px;
        }
    }
</style>
