webpackJsonpbase([20],{206:function(e,a,t){"use strict";function n(e){t(421),t(423)}Object.defineProperty(a,"__esModule",{value:!0});var s=t(276),i=t(425),l=t(46),o=n,r=l(s.a,i.a,!1,o,"data-v-16738cb4",null);a.default=r.exports},276:function(e,a,t){"use strict";function n(e,a){var t=new Date(e),n={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds(),"q+":Math.floor((t.getMonth()+3)/3),S:t.getMilliseconds()};/(y+)/.test(a)&&(a=a.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length)));for(var s in n)new RegExp("("+s+")").test(a)&&(a=a.replace(RegExp.$1,1==RegExp.$1.length?n[s]:("00"+n[s]).substr((""+n[s]).length)));return a}var s=t(96),i=t(47);a.a={data:function(){return{listLoading:!1,noDatadialogVisible:!1,baseURL:"",uploadValue:"",activeName:"first",activeDate:"tabMonth",tableKey:1,fileList:[],postBeforValidate:!0,isModify:!1,isJustSee:!1,checkList:["选中且禁用","复选框 A"],filmTitle:"",nameslist:"",filmBase:{fullName:null,inputName:"",enName:null,years:null,name:null,eunEnId:null,showTime:null,downwardTime:null,premiereTime:null,filmTime:null,frameNumber:null,filmSubtitles:null,filmLevel:null,producingArea:null,mainPoster:null,filmSlogan:null,storyDesc:null},rules:{fullName:[{required:!0,message:"请填写影片名称",trigger:"blur"}]},frameNums:[],filmSubtitles:[],filmLevels:[],producingAreas:[],filmEditions:[],filmEditionDicts:[],filmLanguages:[],filmLanguagesDicts:[],filmTypes:[],filmTypesDicts:[]}},methods:{handleCheckedFilmEditionChange:function(e){this.filmEdition=e,console.log(e)},handleClick:function(e,a){console.log(e,a)},imgParamCall:function(e){console.log(e),this.uploadValue=e},handlePreview:function(e){console.log(e)},getInfo:function(){var e=this,a=this.$route.query.code;Object(i.H)({code:a}).then(function(a){200===a.code&&(a.data&&a.data.filmId?Object(i.s)({id:a.data.filmId}).then(function(a){200===a.code&&(e.filmBase=a.data,e.uploadValue=a.data.mainPoster,e.filmTypes=","==a.data.filmType.substr(0,1)?a.data.filmType.substr(1).split(","):a.data.filmType.split(","),e.filmLanguages=","==a.data.filmLanguage.substr(0,1)?a.data.filmLanguage.substr(1).split(","):a.data.filmLanguage.split(","),e.filmEditions=","==a.data.filmEdition.substr(0,1)?a.data.filmEdition.substr(1).split(","):a.data.filmEdition.split(","),e.nameslist=""!==a.data.name?a.data.name:"",e.filmBase.showTime=e.filmBase.showTime?n(a.data.showTime,"yyyy-MM-dd"):" ",e.filmBase.downwardTime=e.filmBase.downwardTime?n(a.data.downwardTime,"yyyy-MM-dd"):" ",e.filmBase.premiereTime=e.filmBase.premiereTime?n(a.data.premiereTime,"yyyy-MM-dd"):" ",e.filmBase.years=e.filmBase.years?n(a.data.years,"yyyy"):" ",console.log(a.data))}):e.noDatadialogVisible=!0)}).catch(function(e){console.log(e)})},out:function(){this.$router.go(-1)},unique:function(e){for(var a=[e[0]],t=1;t<e.length;t++)-1==a.indexOf(e[t])&&a.push(e[t]);return a},addContact:function(){this.$refs;this.$refs.tableDataRef,this.dialogFormVisible=!0}},created:function(){switch(document.domain){case"testops.oristarcloud.com":this.baseURL="http://testops.oristarcloud.com/api";break;case"devops.oristarcloud.com":case"127.0.0.1":this.baseURL="http://devops.oristarcloud.com/api"}this.filmLanguagesDicts=s.a.getDicts("movie_film_film_language"),this.filmEditionDicts=s.a.getDicts("movie_film_film_edition"),this.filmTypesDicts=s.a.getDicts("movie_film_film_type"),this.isModify=!("true"!=this.$route.query.isModify&&1!=this.$route.query.isModify),this.isJustSee=!("true"!=this.$route.query.isJustSee&&1!=this.$route.query.isJustSee),this.$route.query.code?this.getInfo():!this.isModify&&this.isJustSee}}},421:function(e,a,t){var n=t(422);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);t(182)("7cc7066a",n,!0,{})},422:function(e,a,t){a=e.exports=t(181)(!0),a.push([e.i,"\n.page-justsee-film-base .just-see-checkbox .el-checkbox {\n  display: none;\n}\n.page-justsee-film-base .just-see-checkbox .el-checkbox.is-checked {\n    display: inline-block;\n}\n.page-justsee-film-base .just-see-checkbox .el-checkbox.is-checked .el-checkbox__input {\n      display: none;\n}\n.page-justsee-film-base .just-see-checkbox span {\n  margin-right: 6px;\n}\n.page-justsee-film-base .just-see-checkbox .el-checkbox__input.is-disabled + span.el-checkbox__label {\n  color: #808080;\n  cursor: text;\n}\n.page-justsee-film-base .el-date-editor.is-disabled .el-icon-date {\n  display: none;\n}\n.page-justsee-film-base .el-textarea.is-disabled .el-textarea__inner {\n  border-color: transparent;\n  background-color: transparent;\n  cursor: text;\n  color: #808080;\n  border: 0 none;\n  padding-top: 10px;\n}\n.page-justsee-film-base .el-checkbox {\n  margin-left: 0;\n  margin-right: 30px;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner {\n  border-color: transparent;\n  background-color: transparent;\n  cursor: text;\n  color: #808080;\n  padding: 0;\n  border: 0 none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:link {\n    border: none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:visited {\n    border: none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:hover {\n    border: none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:active {\n    border: none;\n}\n.page-justsee-film-base .normal-text {\n  color: #808080;\n  padding: 0;\n}\n.page-justsee-film-base .el-input__suffix {\n  display: none;\n}\n.page-justsee-film-base .el-form-item__content {\n  color: #808080;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/base/src/views/film/filmDetail.vue"],names:[],mappings:";AACA;EACE,cAAc;CACf;AACD;IACI,sBAAsB;CACzB;AACD;MACM,cAAc;CACnB;AACD;EACE,kBAAkB;CACnB;AACD;EACE,eAAe;EACf,aAAa;CACd;AACD;EACE,cAAc;CACf;AACD;EACE,0BAA0B;EAC1B,8BAA8B;EAC9B,aAAa;EACb,eAAe;EACf,eAAe;EACf,kBAAkB;CACnB;AACD;EACE,eAAe;EACf,mBAAmB;CACpB;AACD;EACE,0BAA0B;EAC1B,8BAA8B;EAC9B,aAAa;EACb,eAAe;EACf,WAAW;EACX,eAAe;CAChB;AACD;IACI,aAAa;CAChB;AACD;IACI,aAAa;CAChB;AACD;IACI,aAAa;CAChB;AACD;IACI,aAAa;CAChB;AACD;EACE,eAAe;EACf,WAAW;CACZ;AACD;EACE,cAAc;CACf;AACD;EACE,eAAe;CAChB",file:"filmDetail.vue",sourcesContent:["\n.page-justsee-film-base .just-see-checkbox .el-checkbox {\n  display: none;\n}\n.page-justsee-film-base .just-see-checkbox .el-checkbox.is-checked {\n    display: inline-block;\n}\n.page-justsee-film-base .just-see-checkbox .el-checkbox.is-checked .el-checkbox__input {\n      display: none;\n}\n.page-justsee-film-base .just-see-checkbox span {\n  margin-right: 6px;\n}\n.page-justsee-film-base .just-see-checkbox .el-checkbox__input.is-disabled + span.el-checkbox__label {\n  color: #808080;\n  cursor: text;\n}\n.page-justsee-film-base .el-date-editor.is-disabled .el-icon-date {\n  display: none;\n}\n.page-justsee-film-base .el-textarea.is-disabled .el-textarea__inner {\n  border-color: transparent;\n  background-color: transparent;\n  cursor: text;\n  color: #808080;\n  border: 0 none;\n  padding-top: 10px;\n}\n.page-justsee-film-base .el-checkbox {\n  margin-left: 0;\n  margin-right: 30px;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner {\n  border-color: transparent;\n  background-color: transparent;\n  cursor: text;\n  color: #808080;\n  padding: 0;\n  border: 0 none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:link {\n    border: none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:visited {\n    border: none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:hover {\n    border: none;\n}\n.page-justsee-film-base .el-input.is-disabled .el-input__inner:active {\n    border: none;\n}\n.page-justsee-film-base .normal-text {\n  color: #808080;\n  padding: 0;\n}\n.page-justsee-film-base .el-input__suffix {\n  display: none;\n}\n.page-justsee-film-base .el-form-item__content {\n  color: #808080;\n}\n"],sourceRoot:""}])},423:function(e,a,t){var n=t(424);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);t(182)("2d3364f4",n,!0,{})},424:function(e,a,t){a=e.exports=t(181)(!0),a.push([e.i,"\n.page-justsee-basecenema-edit[data-v-16738cb4] {\n  height: calc(100% - 50px);\n}\n.no-film[data-v-16738cb4] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-top: -4%;\n  height: calc(100% - 200px);\n  color: #606266;\n}\n.breadcrumb[data-v-16738cb4] {\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.film-base-page .wid220[data-v-16738cb4] {\n  width: 220px;\n}\n.film-base-page .el-row[data-v-16738cb4]:last-child {\n  margin-bottom: 0;\n}\n.film-base-page .el-form-item.margin-bottom0[data-v-16738cb4] {\n  margin-bottom: 0;\n}\n.film-base-page .el-form-item[data-v-16738cb4] {\n  margin-bottom: 12px;\n}\n.film-base-page .el-col[data-v-16738cb4] {\n  border-radius: 4px;\n}\n.film-base-page .bg-purple-dark[data-v-16738cb4] {\n  background: #99a9bf;\n}\n.film-base-page .bg-purple[data-v-16738cb4] {\n  background: #d3dce6;\n}\n.film-base-page .bg-purple-light[data-v-16738cb4] {\n  background: #e5e9f2;\n}\n.film-base-page .grid-content[data-v-16738cb4] {\n  border-radius: 4px;\n  min-height: 36px;\n}\n.film-base-page .row-bg[data-v-16738cb4] {\n  padding: 10px 0;\n  background-color: #f9fafc;\n}\n.film-base-page .el-table .cell span.table-btn-mini[data-v-16738cb4] {\n  color: #3b74ff;\n  cursor: pointer;\n  margin-right: 6px;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/base/src/views/film/filmDetail.vue"],names:[],mappings:";AACA;EACE,0BAA0B;CAC3B;AACD;EACE,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;EAC5B,yBAAyB;MACrB,sBAAsB;UAClB,wBAAwB;EAChC,gBAAgB;EAChB,2BAA2B;EAC3B,eAAe;CAChB;AACD;EACE,iBAAiB;EACjB,oBAAoB;CACrB;AACD;EACE,aAAa;CACd;AACD;EACE,iBAAiB;CAClB;AACD;EACE,iBAAiB;CAClB;AACD;EACE,oBAAoB;CACrB;AACD;EACE,mBAAmB;CACpB;AACD;EACE,oBAAoB;CACrB;AACD;EACE,oBAAoB;CACrB;AACD;EACE,oBAAoB;CACrB;AACD;EACE,mBAAmB;EACnB,iBAAiB;CAClB;AACD;EACE,gBAAgB;EAChB,0BAA0B;CAC3B;AACD;EACE,eAAe;EACf,gBAAgB;EAChB,kBAAkB;CACnB",file:"filmDetail.vue",sourcesContent:["\n.page-justsee-basecenema-edit[data-v-16738cb4] {\n  height: calc(100% - 50px);\n}\n.no-film[data-v-16738cb4] {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin-top: -4%;\n  height: calc(100% - 200px);\n  color: #606266;\n}\n.breadcrumb[data-v-16738cb4] {\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.film-base-page .wid220[data-v-16738cb4] {\n  width: 220px;\n}\n.film-base-page .el-row[data-v-16738cb4]:last-child {\n  margin-bottom: 0;\n}\n.film-base-page .el-form-item.margin-bottom0[data-v-16738cb4] {\n  margin-bottom: 0;\n}\n.film-base-page .el-form-item[data-v-16738cb4] {\n  margin-bottom: 12px;\n}\n.film-base-page .el-col[data-v-16738cb4] {\n  border-radius: 4px;\n}\n.film-base-page .bg-purple-dark[data-v-16738cb4] {\n  background: #99a9bf;\n}\n.film-base-page .bg-purple[data-v-16738cb4] {\n  background: #d3dce6;\n}\n.film-base-page .bg-purple-light[data-v-16738cb4] {\n  background: #e5e9f2;\n}\n.film-base-page .grid-content[data-v-16738cb4] {\n  border-radius: 4px;\n  min-height: 36px;\n}\n.film-base-page .row-bg[data-v-16738cb4] {\n  padding: 10px 0;\n  background-color: #f9fafc;\n}\n.film-base-page .el-table .cell span.table-btn-mini[data-v-16738cb4] {\n  color: #3b74ff;\n  cursor: pointer;\n  margin-right: 6px;\n}\n"],sourceRoot:""}])},425:function(e,a,t){"use strict";var n=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"page-wrapper page-justsee-film-base page-justsee-basecenema-edit"},[t("div",{staticClass:"breadcrumb"},[t("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[t("el-breadcrumb-item",[e._v("查看基础影片")])],1)],1),e._v(" "),t("div",{staticClass:"clearboth"}),e._v(" "),t("el-tabs",{attrs:{type:"card"},on:{"tab-click":e.handleClick},model:{value:e.activeName,callback:function(a){e.activeName=a},expression:"activeName"}},[t("el-tab-pane",{attrs:{label:"基本信息",name:"first"}},[t("section",{staticClass:"film-base-page"},[t("el-form",{ref:"filmBase",attrs:{model:e.filmBase,"label-width":"110px","label-position":"right","label-height":"60px"}},[t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"影片名称：",prop:"fullName"}},[t("el-input",{staticClass:"wid220",attrs:{disabled:!0,placeholder:""},model:{value:e.filmBase.fullName,callback:function(a){e.$set(e.filmBase,"fullName",a)},expression:"filmBase.fullName"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"英文名称：",prop:"enName"}},[t("el-input",{staticClass:"wid220",attrs:{disabled:!0,placeholder:""},model:{value:e.filmBase.enName,callback:function(a){e.$set(e.filmBase,"enName",a)},expression:"filmBase.enName"}})],1)],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"年代：",prop:"years"}},[t("span",[e._v(e._s(e.filmBase.years))])])],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"影片别名：",prop:"name"}},[t("span",[e._v(e._s(e.nameslist))])])],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"艺恩ID：",prop:"eunEnId"}},[t("el-input",{staticClass:"wid220",attrs:{disabled:!0,placeholder:""},model:{value:e.filmBase.eunEnId,callback:function(a){e.$set(e.filmBase,"eunEnId",a)},expression:"filmBase.eunEnId"}})],1)],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:8}})],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"上映日期：",prop:"showTime"}},[t("span",[e._v(e._s(e.filmBase.showTime))])])],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"下映日期：",prop:"downwardTime"}},[t("span",[e._v(e._s(e.filmBase.downwardTime))])])],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"首映日期：",prop:"premiereTime"}},[t("span",[e._v(e._s(e.filmBase.premiereTime))])])],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"影片时长：",prop:"code"}},[t("span",[e._v(e._s(e.filmBase.filmTime))]),e._v(" "),t("span",[e._v("分钟")])])],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"帧数：",prop:"frameNumber"}},[t("span",[e._v(e._s(e.filmBase.frameNumber))])])],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"影片字幕：",prop:"filmSubtitles"}},[t("span",[e._v(e._s(e._f("dict")(e.filmBase.filmSubtitles,"movie_film_film_subtitles",e.filmBase.filmSubtitles)))])])],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"影片级别：",prop:"filmLevel"}},[t("span",[e._v(e._s(e._f("dict")(e.filmBase.filmLevel,"movie_film_film_level",e.filmBase.filmSubtitles)))])])],1),e._v(" "),t("el-col",{attrs:{span:8}},[t("el-form-item",{attrs:{label:"影片产地：",prop:"producingArea"}},[t("span",[e._v(e._s(e._f("dict")(e.filmBase.producingArea,"movie_film_producing_area",e.filmBase.filmSubtitles)))])])],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:24}},[t("el-form-item",{staticClass:"margin-bottom0",attrs:{label:"影片版本：",prop:"filmEditions"}},[t("el-checkbox-group",{staticClass:"just-see-checkbox",model:{value:e.filmEditions,callback:function(a){e.filmEditions=a},expression:"filmEditions"}},e._l(e.filmEditionDicts,function(a){return t("el-checkbox",{key:a.code,attrs:{label:a.code,disabled:!0}},[e._v(e._s(a.name))])}),1)],1)],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:24}},[t("el-form-item",{staticClass:"margin-bottom0",attrs:{label:"影片语言：",prop:"filmLanguages"}},[t("el-checkbox-group",{staticClass:"just-see-checkbox",model:{value:e.filmLanguages,callback:function(a){e.filmLanguages=a},expression:"filmLanguages"}},e._l(e.filmLanguagesDicts,function(a){return t("el-checkbox",{key:a.code,attrs:{label:a.code,disabled:!0}},[e._v(e._s(a.name))])}),1)],1)],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:24}},[t("el-form-item",{staticClass:"margin-bottom0",attrs:{label:"影片类型：",prop:"filmTypes"}},[t("el-checkbox-group",{staticClass:"just-see-checkbox",model:{value:e.filmTypes,callback:function(a){e.filmTypes=a},expression:"filmTypes"}},e._l(e.filmTypesDicts,function(a){return t("el-checkbox",{key:a.code,attrs:{label:a.code,disabled:!0}},[e._v(e._s(a.name))])}),1)],1)],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:16}},[e.uploadValue?t("el-form-item",{staticClass:"width100per",attrs:{label:"主海报：",prop:"fujian"}},[t("imageUpload",{attrs:{value:e.uploadValue,islookUp:!0,disabled:!0},on:{imageCallBack:e.imgParamCall}})],1):e._e()],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:16}},[t("el-form-item",{staticClass:"margin-bottom0",attrs:{label:"推荐广告语：",prop:"filmSlogan"}},[t("span",[e._v(e._s(e.filmBase.filmSlogan))])])],1)],1),e._v(" "),t("el-row",{attrs:{gutter:20}},[t("el-col",{attrs:{span:16}},[t("el-form-item",{attrs:{label:"剧情介绍：",prop:"storyDesc"}},[t("span",[e._v(e._s(e.filmBase.storyDesc))])])],1)],1)],1),e._v(" "),t("div",{staticClass:"btn",staticStyle:{margin:"20px auto","text-align":"center"}},[t("el-button",{on:{click:e.out}},[e._v("返回")])],1)],1)]),e._v(" "),e._e()],1),e._v(" "),t("el-dialog",{attrs:{title:"提示",visible:e.noDatadialogVisible,width:"50%","close-on-click-modal":!1,"close-on-press-escape":!1,"show-close":!1},on:{"update:visible":function(a){e.noDatadialogVisible=a}}},[t("div",[e._v("\n      暂无此影片数据\n    ")]),e._v(" "),t("div",{staticClass:"btn",staticStyle:{margin:"20px auto","text-align":"center"}},[t("el-button",{on:{click:function(a){e.noDatadialogVisible=!1}}},[e._v("关闭")])],1)])],1)},s=[],i={render:n,staticRenderFns:s};a.a=i}});