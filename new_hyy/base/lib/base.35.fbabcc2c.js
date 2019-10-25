webpackJsonpbase([35],{190:function(e,t,n){"use strict";function a(e){n(310)}Object.defineProperty(t,"__esModule",{value:!0});var r=n(250),s=n(312),i=n(46),o=a,l=i(r.a,s.a,!1,o,"data-v-044eb0c8",null);t.default=l.exports},250:function(e,t,n){"use strict";var a=n(18),r=n.n(a),s=n(47),i=n(82);t.a={name:"cusList",mixins:[i.a.cacheMixin],data:function(){return{cacheField:["cusList","currentPage","pageSize","formInline"],statusArr:[{value:"",label:"全部"},{value:"1",label:"启用"},{value:"2",label:"禁用"}],typeArr:[],total:1,currentPage:1,pageSize:10,formInline:{name:"",code:"",type:"全部",status:""},cusList:[],status:""}},activated:function(){this.getCusList()},filters:{renderTime:function(e){var t=new Date(e).toJSON();return new Date(+new Date(t)+288e5).toISOString().replace(/T/g," ").replace(/\.[\d]{3}Z/,"")},typeFilter:function(e){if(!e)return"";var t=JSON.parse(sessionStorage.getItem("cusType"));return t?t.map(function(t){if(t.propertyCode==e)return t.propertyName}).join().replace(/,/g,""):void 0}},created:function(){this.getType(),this.getCusList()},methods:{getType:function(){var e=this;Object(s._17)().then(function(t){t&&200==t.code?(t.data&&sessionStorage.setItem("cusType",r()(t.data)),e.typeArr=t.data,e.typeArr.unshift({propertyName:"全部",propertyCode:""})):e.$message({message:t.msg,type:"info"})}).catch(function(){e.$message("网络繁忙，请稍后再试")})},toCreate:function(){this.$router.push({path:"newCus",query:{type:1}})},editCus:function(e){this.$router.push({path:"editCus",query:{type:2,code:e.code,id:e.id,consumerId:e.consumerId}})},toDetail:function(e){this.$router.push({path:"seeCus",query:{type:3,code:e.code}})},getCusList:function(){var e=this,t={pageNum:this.currentPage,pageSize:this.pageSize,name:this.formInline.name,code:this.formInline.code,status:this.formInline.status,type:"全部"==this.formInline.type?"":this.formInline.type};Object(s.v)(t).then(function(t){t&&200==t.code?(e.pageNum=t.data.pageNum,e.pageSize=t.data.pageSize,e.total=t.data.total,e.cusList=t.data.rows):e.$message({message:t.msg,type:"info"})}).catch(function(){e.error("网络繁忙，请稍后再试")})},onSubmit:function(){this.getCusList()},changeStatus:function(e){var t=this;if(1==e.status)this.$confirm("确认禁用后将不可用，是否继续禁用?","提示",{confirmButtonText:"确定",cancelButtonText:"再想想",type:"warning"}).then(function(){var n={status:2,consumerId:e.consumerId,id:e.id};Object(s.j)(n).then(function(e){e&&200==e.code&&(t.success("禁用成功"),t.$nextTick(function(){t.getCusList()}))}).catch(function(){t.error("失败")})});else{var n={status:1,consumerId:e.consumerId,id:e.id};Object(s.j)(n).then(function(e){e&&200==e.code&&(t.success("启用成功"),t.$nextTick(function(){t.getCusList()}))}).catch(function(){t.error("失败")})}},handleCurrentChange:function(e){this.currentPage=e,this.getCusList()},handleSizeChange:function(e){this.pageSize=e,this.getCusList()}}}},310:function(e,t,n){var a=n(311);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);n(182)("42ebb732",a,!0,{})},311:function(e,t,n){t=e.exports=n(181)(!0),t.push([e.i,"\n.content-wrapper .list-wrapper .form[data-v-044eb0c8] {\n  background: #f5f5f5;\n  padding: 20px 0 0;\n}\n.content-wrapper .list-wrapper .form .el-input[data-v-044eb0c8] {\n    width: 192px;\n}\n.content-wrapper .list-wrapper .form .el-select[data-v-044eb0c8] {\n    width: 192px;\n}\n.content-wrapper .list-wrapper .create-wrapper[data-v-044eb0c8] {\n  width: 100%;\n  height: 32px;\n  margin: 10px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/base/src/views/sysMange/customer/cusList.vue"],names:[],mappings:";AACA;EACE,oBAAoB;EACpB,kBAAkB;CACnB;AACD;IACI,aAAa;CAChB;AACD;IACI,aAAa;CAChB;AACD;EACE,YAAY;EACZ,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,qBAAqB;EACrB,cAAc;EACd,sBAAsB;MAClB,mBAAmB;UACf,0BAA0B;EAClC,0BAA0B;MACtB,uBAAuB;UACnB,oBAAoB;CAC7B",file:"cusList.vue",sourcesContent:["\n.content-wrapper .list-wrapper .form[data-v-044eb0c8] {\n  background: #f5f5f5;\n  padding: 20px 0 0;\n}\n.content-wrapper .list-wrapper .form .el-input[data-v-044eb0c8] {\n    width: 192px;\n}\n.content-wrapper .list-wrapper .form .el-select[data-v-044eb0c8] {\n    width: 192px;\n}\n.content-wrapper .list-wrapper .create-wrapper[data-v-044eb0c8] {\n  width: 100%;\n  height: 32px;\n  margin: 10px 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n"],sourceRoot:""}])},312:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"content-wrapper"},[n("div",{staticClass:"list-wrapper"},[n("div",{staticClass:"form"},[n("el-form",{attrs:{inline:!0,model:e.formInline,size:"mini","label-width":"100px"}},[n("el-form-item",{attrs:{label:"客户编码：",prop:"code"}},[n("el-input",{model:{value:e.formInline.code,callback:function(t){e.$set(e.formInline,"code","string"==typeof t?t.trim():t)},expression:"formInline.code"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"客户全称：",prop:"name"}},[n("el-input",{model:{value:e.formInline.name,callback:function(t){e.$set(e.formInline,"name","string"==typeof t?t.trim():t)},expression:"formInline.name"}})],1),e._v(" "),n("el-form-item",{attrs:{label:"客户类型：",prop:"type"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formInline.type,callback:function(t){e.$set(e.formInline,"type",t)},expression:"formInline.type"}},e._l(e.typeArr,function(e){return n("el-option",{key:e.propertyCode,attrs:{label:e.propertyName,value:e.propertyCode}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{label:"状态：",prop:"status"}},[n("el-select",{attrs:{placeholder:"请选择"},model:{value:e.formInline.status,callback:function(t){e.$set(e.formInline,"status",t)},expression:"formInline.status"}},e._l(e.statusArr,function(e){return n("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",[n("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("查询")])],1)],1)],1),e._v(" "),n("div",{staticClass:"create-wrapper"},[n("el-button",{directives:[{name:"auth",rawName:"v-auth",value:"system_buyer_add",expression:"'system_buyer_add'"}],attrs:{type:"primary"},on:{click:e.toCreate}},[e._v("新建")])],1),e._v(" "),n("div",{staticClass:"table"},[n("el-table",{staticStyle:{width:"100%"},attrs:{data:e.cusList}},[n("el-table-column",{attrs:{prop:"code",label:"客户编码","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"fullName",label:"客户全称","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"type",label:"客户类型","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(e._f("typeFilter")(t.row.type)))]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"status",label:"状态"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(e._s(1==t.row.status?"启用":"禁用"))]}}])}),e._v(" "),n("el-table-column",{attrs:{prop:"operateUserName",label:"操作人","show-overflow-tooltip":""}}),e._v(" "),n("el-table-column",{attrs:{prop:"updateTime",label:"操作时间",width:"150","show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[n("span",[e._v(e._s(e._f("renderTime")(t.row.updateTime)))])]}}])}),e._v(" "),n("el-table-column",{attrs:{label:"操作",width:"200",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[n("el-button",{directives:[{name:"auth",rawName:"v-auth",value:"system_buyer_see",expression:"'system_buyer_see'"}],staticClass:"table-btn-mini",attrs:{type:"text"},on:{click:function(n){return e.toDetail(t.row)}}},[e._v("查看")]),e._v(" "),n("el-button",{directives:[{name:"auth",rawName:"v-auth",value:"system_buyer_update",expression:"'system_buyer_update'"}],staticClass:"table-btn-mini",attrs:{type:"text"},on:{click:function(n){return e.editCus(t.row)}}},[e._v("编辑")]),e._v(" "),n("el-button",{directives:[{name:"auth",rawName:"v-auth",value:"system_buyer_enableDisabling",expression:"'system_buyer_enableDisabling'"}],staticClass:"table-btn-mini",attrs:{type:"text"},on:{click:function(n){return e.changeStatus(t.row)}}},[e._v(e._s(1==t.row.status?"禁用":"启用"))])]}}])})],1),e._v(" "),n("div",{staticClass:"page-wrap"},[n("el-pagination",{attrs:{background:"","current-page":e.currentPage,"page-sizes":[10,25,50,100],"page-size":e.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange,"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t}}})],1)],1)])])},r=[],s={render:a,staticRenderFns:r};t.a=s}});