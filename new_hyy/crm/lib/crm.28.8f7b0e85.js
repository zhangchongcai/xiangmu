webpackJsonpcrm([28],{150:function(t,e,a){"use strict";function s(t){a(312)}Object.defineProperty(e,"__esModule",{value:!0});var r=a(212),o=a(314),i=a(8),n=s,l=i(r.a,o.a,!1,n,null,null);e.default=l.exports},212:function(t,e,a){"use strict";var s=a(53),r=a.n(s);e.a={name:"otherRightsList",data:function(){return{stopStartDialog:!1,stopStartInfo:{},tipMessage:"",tableData:[],cardStatusOptions:[],total:20,formData:{equityName:"",equityType:"",equityCategory:"",status:"",equityNo:"",current:1,size:20,tenantId:this.$store.state.loginUser.consumerId},equityTypeList:[{name:"服务类",value:"service_type"},{name:"消费类",value:"consumer_type"},{name:"体验类",value:"experience_type"},{name:"身份类",value:"identity_type"}],equityCategoryList:[{name:"优惠券",value:"coupons"}]}},created:function(){this.handleCardStatus(),this.search()},filters:{judegStatus:function(t){return"unstart"==t?"未启用":"start"==t?"已启用":"已停用"},formatCreateTime:function(t){return t?new Date(t.replace(/-/g,"/")).formatDate("yyyy-MM-dd"):"-"}},methods:{search:function(){var t=this,e=JSON.parse(r()(this.formData));this.tipMessage="数据加载中...",this.$crmList.getdiffEquityList(e).then(function(e){t.tipMessage="暂无数据",t.tableData=e.records,t.total=e.total}).catch(function(t){})},equityCategoryNameShow:function(t,e,a,s){return"consumer_type"!=t.equityType?"-":null==a||void 0==a||""===a?"-":a},emptyShow:function(t,e,a,s){return null==a||void 0==a||""===a?"-":a},handleSearch:function(){this.formData.current=1,this.search()},resetForm:function(t){this.$refs[t].resetFields()},handleCardStatus:function(){var t={tenantId:this.$store.state.loginUser.consumerId},e=this;e.$crmList.getCardStatus(t).then(function(t){e.cardStatusOptions=t})},handleSizeChange:function(t){this.formData.size=t,this.search()},handleCurrentChange:function(t){this.formData.current=t,this.search()},handleMemberDetail:function(t){this.$router.push({path:"/member/otherRights/otherRightsDetail",query:{equityId:t.id,tenantId:this.$store.state.loginUser.consumerId}})},handleAddCardType:function(){this.$router.push({path:"/member/otherRights/addOtherRights"})},handleEmitCardType:function(t){this.$router.push({path:"/member/otherRights/editOtherRights",query:{cardId:t.id}})},handleSureChangeStatus:function(){var t=this;this.stopStartDialog=!1;var e=this.stopStartInfo,a=this,s={status:"start"==e.status?"stop":"start",id:e.id,tenantId:this.$store.state.loginUser.consumerId};a.$crmList.diffEquityStatus(s).then(function(){a.search(),t.$message({type:"success",message:"start"==e.status?"已停用":"已启用"})}).catch(function(t){return console.log(t)})},handleStartUse:function(t){this.stopStartInfo=t,this.stopStartDialog=!0}},watch:{"formData.equityType":function(t){"consumer_type"!=t&&(this.formData.equityCategory="")}}}},312:function(t,e,a){var s=a(313);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);a(132)("44bf168c",s,!0,{})},313:function(t,e,a){e=t.exports=a(131)(!0),e.push([t.i,"\n.other-rights-list .heightBug input {\n  height: 32px !important;\n}\n.other-rights-list .add-btn {\n  font-size: 12px;\n  padding: 6px 0;\n  text-align: right;\n}\n.other-rights-list .other-rights-list-table .unstart {\n  color: #739bff;\n}\n.other-rights-list .other-rights-list-table .start {\n  color: #2dbc2d;\n}\n.other-rights-list .other-rights-list-table .stop {\n  color: #f33430;\n}\n.other-rights-list .other-rights-list-table .operation-button span {\n  font-size: 12px;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/crm/src/views/member/otherRights/otherRightsList.vue"],names:[],mappings:";AACA;EACE,wBAAwB;CACzB;AACD;EACE,gBAAgB;EAChB,eAAe;EACf,kBAAkB;CACnB;AACD;EACE,eAAe;CAChB;AACD;EACE,eAAe;CAChB;AACD;EACE,eAAe;CAChB;AACD;EACE,gBAAgB;CACjB",file:"otherRightsList.vue",sourcesContent:["\n.other-rights-list .heightBug input {\n  height: 32px !important;\n}\n.other-rights-list .add-btn {\n  font-size: 12px;\n  padding: 6px 0;\n  text-align: right;\n}\n.other-rights-list .other-rights-list-table .unstart {\n  color: #739bff;\n}\n.other-rights-list .other-rights-list-table .start {\n  color: #2dbc2d;\n}\n.other-rights-list .other-rights-list-table .stop {\n  color: #f33430;\n}\n.other-rights-list .other-rights-list-table .operation-button span {\n  font-size: 12px;\n}\n"],sourceRoot:""}])},314:function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"other-rights-list"},[a("el-form",{ref:"formData",staticClass:"form-data-wrap _member-search-area-custom",attrs:{inline:!0,model:t.formData}},[a("el-form-item",{attrs:{label:"权益ID：",prop:"equityNo"}},[a("el-input",{attrs:{placeholder:"填写权益ID",clearable:"",maxlength:"20"},model:{value:t.formData.equityNo,callback:function(e){t.$set(t.formData,"equityNo",e)},expression:"formData.equityNo"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"权益名称：",prop:"equityName"}},[a("el-input",{attrs:{placeholder:"填写权益名称",clearable:"",maxlength:"30"},model:{value:t.formData.equityName,callback:function(e){t.$set(t.formData,"equityName",e)},expression:"formData.equityName"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"权益类型：",prop:"equityType"}},[a("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:t.formData.equityType,callback:function(e){t.$set(t.formData,"equityType",e)},expression:"formData.equityType"}},t._l(t.equityTypeList,function(t){return a("el-option",{key:t.name,attrs:{label:t.name,value:t.value}})}),1)],1),t._v(" "),a("el-form-item",{attrs:{label:"权益类别：",prop:"equityCategory"}},[a("el-select",{staticClass:"heightBug",attrs:{placeholder:"全部",clearable:"",disabled:"consumer_type"!=t.formData.equityType},model:{value:t.formData.equityCategory,callback:function(e){t.$set(t.formData,"equityCategory",e)},expression:"formData.equityCategory"}},t._l(t.equityCategoryList,function(t){return a("el-option",{key:t.name,attrs:{label:t.name,value:t.value}})}),1)],1),t._v(" "),a("el-form-item",{attrs:{label:"状态：",prop:"status"}},[a("el-select",{attrs:{placeholder:"全部",clearable:""},model:{value:t.formData.status,callback:function(e){t.$set(t.formData,"status",e)},expression:"formData.status"}},t._l(t.cardStatusOptions,function(t){return a("el-option",{key:t.code,attrs:{label:t.desc,value:t.code}})}),1)],1),t._v(" "),a("el-form-item",{staticClass:"btn-wrap"},[a("el-button",{staticClass:"_el-btn-custom",attrs:{type:"primary"},on:{click:t.handleSearch}},[t._v("搜索")]),t._v(" "),a("el-button",{staticClass:"_el-btn-custom _member-custom-ghost-button",attrs:{plain:""},on:{click:function(e){return t.resetForm("formData")}}},[t._v("重置\n      ")])],1)],1),t._v(" "),a("div",{staticClass:"add-btn"},[a("el-button",{staticClass:"_el-btn-custom _member-custom-ghost-button",attrs:{plain:""},on:{click:t.handleAddCardType}},[t._v("新建")])],1),t._v(" "),a("div",{staticClass:"other-rights-list-table member-list-table _m-member-table-custom"},[a("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:"","empty-text":t.tipMessage}},[a("el-table-column",{attrs:{prop:"equityNo",formatter:t.emptyShow,label:"权益ID","min-width":"100","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"equityName",formatter:t.emptyShow,label:"权益名称","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"equityTypeName",formatter:t.emptyShow,label:"权益类型","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"equityCategoryName",formatter:t.equityCategoryNameShow,label:"权益类别","min-width":"100","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"status",label:"状态","min-width":"120","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[a("span",{class:"unstart"==e.row.status?"unstart":"start"==e.row.status?"start":"stop",staticStyle:{fontSize:"12px"}},[t._v(t._s(t._f("judegStatus")(e.row.status)))])]}}])}),t._v(" "),a("el-table-column",{attrs:{fixed:"right",label:"操作","min-width":"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{staticClass:"operation-button",attrs:{type:"text",size:"small"},on:{click:function(a){return t.handleMemberDetail(e.row)}}},[t._v("查看\n          ")]),t._v(" "),"unstart"==e.row.status?a("el-button",{staticClass:"operation-button",attrs:{type:"text",size:"small"},on:{click:function(a){return t.handleEmitCardType(e.row)}}},[t._v("编辑")]):t._e(),t._v(" "),"unstart"==e.row.status?a("el-button",{staticClass:"operation-button",attrs:{type:"text",size:"small"},on:{click:function(a){return t.handleStartUse(e.row)}}},[t._v("启用")]):t._e(),t._v(" "),"start"==e.row.status?a("el-button",{staticClass:"operation-button",attrs:{type:"text",size:"small"},on:{click:function(a){return t.handleStartUse(e.row)}}},[t._v("停用")]):t._e()]}}])})],1)],1),t._v(" "),a("el-dialog",{staticClass:"_member-tip-dialog-custom-style",attrs:{title:"",visible:t.stopStartDialog,width:"320px","show-close":!1},on:{"update:visible":function(e){t.stopStartDialog=e}}},[a("i",{staticClass:"iconfont icon-danchuang-tishi _member-tip-dialog-icon"}),t._v(" "),a("span",{staticClass:"_member-tip-dialog-desc"},[t._v("确定要"+t._s("start"==t.stopStartInfo.status?"停用":"启用")+"\n      "+t._s(t.stopStartInfo.equityName)+" 吗？")]),t._v(" "),a("span",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{staticClass:"_el-btn-custom _member-add-edit-save-btn",attrs:{type:"primary"},on:{click:t.handleSureChangeStatus}},[t._v("确定\n      ")]),t._v(" "),a("el-button",{staticClass:"_el-btn-custom _member-add-edit-save-btn",on:{click:function(e){t.stopStartDialog=!1}}},[t._v("取消")])],1)]),t._v(" "),a("div",{staticClass:"page-wrap"},[a("el-pagination",{attrs:{background:"","current-page":t.formData.current-0,"page-size":t.formData.size-0,layout:"total, sizes, prev, pager, next, jumper","page-sizes":[20,50,100],total:t.total-0},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)},r=[],o={render:s,staticRenderFns:r};e.a=o}});