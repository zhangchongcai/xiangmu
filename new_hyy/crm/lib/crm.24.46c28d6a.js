webpackJsonpcrm([24],{145:function(t,e,o){"use strict";function a(t){o(294)}Object.defineProperty(e,"__esModule",{value:!0});var r=o(206),s=o(296),i=o(8),l=a,n=i(r.a,s.a,!1,l,null,null);e.default=n.exports},179:function(t,e,o){"use strict";function a(t,e){try{/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(t.getFullYear()+"").substr(4-RegExp.$1.length)));var o={"M+":t.getMonth()+1,"d+":t.getDate(),"h+":t.getHours(),"m+":t.getMinutes(),"s+":t.getSeconds()};for(var a in o)if(new RegExp("("+a+")").test(e)){var s=o[a]+"";e=e.replace(RegExp.$1,1===RegExp.$1.length?s:r(s))}return e}catch(t){return console.log(t),""}}function r(t){return("00"+t).substr(t.length)}Date.prototype.formatDate=Date.prototype.formatDate||function(t){return a(this,t)},Date.prototype.addDays=Date.prototype.addDays||function(t){return this.setDate(this.getDate()+t),this},Date.prototype.addWeeks=Date.prototype.addWeeks||function(t){return this.addDays(7*t),this},Date.prototype.addMonths=Date.prototype.addMonths||function(t){var e=this.getDate();return this.setMonth(this.getMonth()+t),this.getDate()<e&&this.setDate(0),this},Date.prototype.addYears=Date.prototype.addYears||function(t){var e=this.getMonth();return this.setFullYear(this.getFullYear()+t),e<this.getMonth()&&this.setDate(0),this}},206:function(t,e,o){"use strict";o(179);e.a={name:"CardList",data:function(){return{tipMessage:"",tableData:[],total:20,memberLevelRuleVOList:[],formData:{goodsAttribute:"",goodsName:"",goodsNo:"",goodsType:"",ticketNo:"",memberNo:"",memberLev:"",merchantName:"",current:1,size:20,tenantId:this.$store.state.loginUser.consumerId},goodsAttributeList:[{code:"",name:"全部"},{code:"electronic_coupons",name:"电子优惠券"},{code:"virtual_card",name:"虚拟卡"},{code:"physical_commodity",name:"实物商品"}],goodsTypeList:[{commodityTypeName:"全部",commodityTypeNo:""}]}},created:function(){this.getdiffCommodityTypeList(),this.getLevelDetail(),this.search()},mounted:function(){},filters:{judegStatus:function(t){return"unstart"==t?"未启用":"start"==t?"已启用":"已停用"},formatCreateTime:function(t){return t?new Date(t.replace(/-/g,"/")).formatDate("yyyy-MM-dd"):"-"}},methods:{getLevelDetail:function(){var t=this;this.$crmList.getLevelDetail({tenantId:this.formData.tenantId}).then(function(e){t.memberLevelRuleVOList=e.memberLevelRuleVOList})},getdiffCommodityTypeList:function(){var t=this,e={tenantId:this.formData.tenantId};this.$crmList.diffCommodityTypeList(e).then(function(e){t.$set(t,"goodsTypeList",t.goodsTypeList.concat(e.records))})},search:function(){var t=this,e=this.formData;this.tipMessage="数据加载中...",this.$crmList.diffGoodsDetailList(e).then(function(e){t.tipMessage="暂无数据",t.tableData=e.records,t.total=e.total}).catch(function(t){})},emptyShow:function(t,e,o,a){return null==o||void 0==o||""===o?"-":o},goodsAttribute:function(t,e,o,a){return"electronic_coupons"==o?"电子优惠券":"virtual_card"==o?"虚拟卡":"physical_commodity"==o?"实物商品":"-"},handleSearch:function(){this.formData.current=1,this.search()},resetForm:function(){this.$refs.formData.resetFields()},handleSizeChange:function(t){this.formData.size=t,this.search()},handleCurrentChange:function(t){this.formData.current=t,this.search()},exportExcel:function(){var t=this.$store.state.default.apiConfig.baseURL+this.$store.state.crm.domain+"/diff/goods/export/detail/list?tenantId="+this.$store.state.loginUser.consumerId+"&merchantName="+this.formData.merchantName+"&goodsAttribute="+this.formData.goodsAttribute+"&goodsName="+this.formData.goodsName+"&goodsNo="+this.formData.goodsNo+"&goodsType="+this.formData.goodsType+"&memberLev="+this.formData.memberLev+"&memberNo="+this.formData.memberNo+"&token="+this.$store.state.loginToken;window.open(t,"_blank")}},watch:{}}},294:function(t,e,o){var a=o(295);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);o(132)("28dee333",a,!0,{})},295:function(t,e,o){e=t.exports=o(131)(!0),e.push([t.i,"\n.commodityListReportDetail .heightBug input {\n  height: 32px !important;\n}\n.commodityListReportDetail .add-btn {\n  font-size: 12px;\n  padding: 6px 0;\n  text-align: right;\n}\n.commodityListReportDetail .add-btn .add-button-custom {\n    font-size: 12px;\n    padding: 5px 20px;\n    border: none;\n    color: #114d75;\n}\n.commodityListReportDetail .add-btn .add-button-custom span {\n      color: #739bff !important;\n}\n.commodityListReportDetail .member-list-table .unstart {\n  color: #739bff;\n}\n.commodityListReportDetail .member-list-table .start {\n  color: #2dbc2d;\n}\n.commodityListReportDetail .member-list-table .stop {\n  color: #f33430;\n}\n.commodityListReportDetail .member-list-table .operation-button span {\n  font-size: 12px;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/crm/src/views/member/commodityReportForm/commodityReportDetail.vue"],names:[],mappings:";AACA;EACE,wBAAwB;CACzB;AACD;EACE,gBAAgB;EAChB,eAAe;EACf,kBAAkB;CACnB;AACD;IACI,gBAAgB;IAChB,kBAAkB;IAClB,aAAa;IACb,eAAe;CAClB;AACD;MACM,0BAA0B;CAC/B;AACD;EACE,eAAe;CAChB;AACD;EACE,eAAe;CAChB;AACD;EACE,eAAe;CAChB;AACD;EACE,gBAAgB;CACjB",file:"commodityReportDetail.vue",sourcesContent:["\n.commodityListReportDetail .heightBug input {\n  height: 32px !important;\n}\n.commodityListReportDetail .add-btn {\n  font-size: 12px;\n  padding: 6px 0;\n  text-align: right;\n}\n.commodityListReportDetail .add-btn .add-button-custom {\n    font-size: 12px;\n    padding: 5px 20px;\n    border: none;\n    color: #114d75;\n}\n.commodityListReportDetail .add-btn .add-button-custom span {\n      color: #739bff !important;\n}\n.commodityListReportDetail .member-list-table .unstart {\n  color: #739bff;\n}\n.commodityListReportDetail .member-list-table .start {\n  color: #2dbc2d;\n}\n.commodityListReportDetail .member-list-table .stop {\n  color: #f33430;\n}\n.commodityListReportDetail .member-list-table .operation-button span {\n  font-size: 12px;\n}\n"],sourceRoot:""}])},296:function(t,e,o){"use strict";var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"commodityListReportDetail"},[o("el-form",{ref:"formData",staticClass:"form-data-wrap _member-search-area-custom",attrs:{inline:!0,model:t.formData}},[o("el-form-item",{attrs:{label:"商品ID：",prop:"goodsNo"}},[o("el-input",{attrs:{placeholder:"商品ID",clearable:"",maxlength:"20"},model:{value:t.formData.goodsNo,callback:function(e){t.$set(t.formData,"goodsNo",e)},expression:"formData.goodsNo"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"商品名称：",prop:"goodsName"}},[o("el-input",{attrs:{placeholder:"商品名称",clearable:"",maxlength:"30"},model:{value:t.formData.goodsName,callback:function(e){t.$set(t.formData,"goodsName",e)},expression:"formData.goodsName"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"商家名称：",prop:"merchantName"}},[o("el-input",{attrs:{placeholder:"商家名称",clearable:"",maxlength:"30"},model:{value:t.formData.merchantName,callback:function(e){t.$set(t.formData,"merchantName",e)},expression:"formData.merchantName"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"商品属性：",prop:"goodsAttribute"}},[o("el-select",{attrs:{placeholder:"请选择商品属性",clearable:""},model:{value:t.formData.goodsAttribute,callback:function(e){t.$set(t.formData,"goodsAttribute",e)},expression:"formData.goodsAttribute"}},t._l(t.goodsAttributeList,function(t){return o("el-option",{key:t.code,attrs:{label:t.name,value:t.code}})}),1)],1),t._v(" "),o("el-form-item",{attrs:{label:"商品类型：",prop:"goodsType"}},[o("el-select",{attrs:{placeholder:"请选择商品类型",clearable:""},model:{value:t.formData.goodsType,callback:function(e){t.$set(t.formData,"goodsType",e)},expression:"formData.goodsType"}},t._l(t.goodsTypeList,function(t){return o("el-option",{key:t.commodityTypeNo,attrs:{label:t.commodityTypeName,value:t.commodityTypeNo}})}),1)],1),t._v(" "),o("el-form-item",{attrs:{label:"券编码：",prop:"ticketNo"}},[o("el-input",{attrs:{placeholder:"券编码",clearable:"",maxlength:"30"},model:{value:t.formData.ticketNo,callback:function(e){t.$set(t.formData,"ticketNo",e)},expression:"formData.ticketNo"}})],1),t._v(" "),o("el-form-item",{attrs:{label:"会员等级：",prop:"memberLev"}},[o("el-select",{attrs:{placeholder:"请选择会员等级",clearable:""},model:{value:t.formData.memberLev,callback:function(e){t.$set(t.formData,"memberLev",e)},expression:"formData.memberLev"}},t._l(t.memberLevelRuleVOList,function(t){return o("el-option",{key:t.levelNo,attrs:{label:t.levelName,value:t.levelNo}})}),1)],1),t._v(" "),o("el-form-item",{attrs:{label:"会员ID/手机号：",prop:"memberNo"}},[o("el-input",{attrs:{placeholder:"会员ID/手机号",clearable:"",maxlength:"30"},model:{value:t.formData.memberNo,callback:function(e){t.$set(t.formData,"memberNo",e)},expression:"formData.memberNo"}})],1),t._v(" "),o("el-form-item",{staticClass:"btn-wrap"},[o("el-button",{staticClass:"_el-btn-custom",attrs:{type:"primary"},on:{click:t.handleSearch}},[t._v("搜索")]),t._v(" "),o("el-button",{staticClass:"_el-btn-custom _member-custom-ghost-button",attrs:{plain:""},on:{click:t.resetForm}},[t._v("重置")])],1)],1),t._v(" "),o("div",{staticClass:"add-btn"},[o("el-button",{staticClass:"_el-btn-custom _member-custom-ghost-button",attrs:{plain:""},on:{click:t.exportExcel}},[t._v("导出Excel")])],1),t._v(" "),o("div",{staticClass:"member-list-table _m-member-table-custom"},[o("el-table",{staticStyle:{width:"100%"},attrs:{data:t.tableData,stripe:"","empty-text":t.tipMessage}},[o("el-table-column",{attrs:{prop:"goodsNo",formatter:t.emptyShow,label:"商品ID","min-width":"100","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"goodsName",formatter:t.emptyShow,label:"商品名称","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"merchantName",formatter:t.emptyShow,label:"商家名称","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"goodsAttribute",formatter:t.goodsAttribute,label:"商品属性","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"goodsTypeName",formatter:t.emptyShow,label:"商品类型","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"couponNo",formatter:t.emptyShow,label:"券编码","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"memberId",formatter:t.emptyShow,label:"会员ID","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"memberName",formatter:t.emptyShow,label:"姓名","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"memberMobile",formatter:t.emptyShow,label:"手机号","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"memberLevelName",formatter:t.emptyShow,label:"会员等级","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"receiveTime",formatter:t.emptyShow,label:"获取时间","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"offsetTime",formatter:t.emptyShow,label:"核销时间","min-width":"120","show-overflow-tooltip":""}}),t._v("=\n      "),o("el-table-column",{attrs:{prop:"offsetMerchantName",formatter:t.emptyShow,label:"核销商户","min-width":"120","show-overflow-tooltip":""}}),t._v(" "),o("el-table-column",{attrs:{prop:"status",formatter:t.emptyShow,label:"核销状态","min-width":"120","show-overflow-tooltip":""}})],1)],1),t._v(" "),o("div",{staticClass:"page-wrap"},[o("el-pagination",{attrs:{background:"","current-page":t.formData.current-0,"page-size":t.formData.size-0,layout:"total, sizes, prev, pager, next, jumper","page-sizes":[20,50,100],total:t.total-0},on:{"size-change":t.handleSizeChange,"current-change":t.handleCurrentChange}})],1)],1)},r=[],s={render:a,staticRenderFns:r};e.a=s}});