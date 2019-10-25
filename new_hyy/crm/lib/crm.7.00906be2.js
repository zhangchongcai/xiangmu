webpackJsonpcrm([7],{240:function(e,t,a){"use strict";var n=a(53),r=a.n(n);t.a={name:"addJointNameCardMerchant",data:function(){var e=this,t=/^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/,a=function(a,n,r){n.toString().trim()?t.test(n.toString().trim())?e.$crmList.checkIfNameRepeat({name:n.toString().trim(),merchantId:e.$route.query.merchantId?e.$route.query.merchantId:"",tenantId:e.$store.state.loginUser.consumerId}).then(function(t){t?r(new Error("该名称已存在，请更换其他名称")):(e.ruleForm.merchantName=n.toString().trim(),r())}).catch(function(e){return console.log(e)}):r(new Error("输入的名称含有不合法字符")):r(new Error("请输入商户名称"))};return{ruleForm:{merchantName:"",compactId:"",cooperationStart:"",cooperationEnd:"",memo:"",status:1,tenantId:this.$store.state.loginUser.consumerId},cooperationTime:[],rules:{merchantName:[{max:20,message:"长度不可超过20个字符",trigger:"blur"},{required:!0,validator:a,trigger:"blur"}],compactId:[{max:20,message:"长度不可超过20个字符",trigger:"blur"}],memo:[{max:100,message:"长度不可超过100个字符",trigger:"blur"}]}}},mounted:function(){var e=this;if(this.$route.query.merchantId){var t={merchantId:this.$route.query.merchantId,tenantId:this.$store.state.loginUser.consumerId};this.$crmList.getMerchantInfo(t).then(function(t){e.ruleForm=t,e.cooperationTime.push(t.cooperationStart,t.cooperationEnd)}).catch(function(e){console.log(e)})}},methods:{submitForm:function(e){var t=this;this.$refs[e].validate(function(e){if(!e)return console.log("error submit!!"),!1;var a=JSON.parse(r()(t.ruleForm));t.cooperationTime.length&&(a.cooperationStart=t.cooperationTime[0],a.cooperationEnd=t.cooperationTime[1]),t.$route.query.merchantId?t.$crmList.editjointNameCardInfo(a).then(function(){t.$message.success("修改成功"),t.$store.commit("tagNav/removeTagNav",t.$route),t.$router.push({path:"/member/jointNameCard/list"})}).catch(function(e){console.log(e)}):t.$crmList.addjointNameCardMerchant(a).then(function(){t.$message.success("添加成功"),t.$store.commit("tagNav/removeTagNav",t.$route),t.$router.push({path:"/member/jointNameCard/list"})}).catch(function(e){console.log(e)})})},resetForm:function(e){this.$store.commit("tagNav/removeTagNav",this.$route),this.$router.push({path:"/member/jointNameCard/list"})},handleChange:function(e){console.log("alue------",e)}}}},417:function(e,t,a){var n=a(418);"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);a(132)("31791bee",n,!0,{})},418:function(e,t,a){t=e.exports=a(131)(!0),t.push([e.i,"\n.add-jointNameCard-merchant .add-joint-name-card-form .cooperation-time {\n  margin: 5px 0 28px 0 !important;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .cooperation-time .el-range-input {\n    font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .cooperation-time .el-range-separator {\n    font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form ._member-joint-name-card-memo .el-form-item__error {\n  top: 120px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-form--label-left .el-form-item__label {\n  color: #666;\n  font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-input {\n  width: 360px;\n  font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-textarea {\n  width: 360px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-form-item {\n  margin-bottom: 22px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-form-item__error {\n  top: 40px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form ._add-joint-name-card-btn-wrap {\n  width: 100%;\n  margin: 40px 0 40px;\n  text-align: center;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form ._add-joint-name-card-btn-wrap .el-form-item__content {\n    margin-left: 0 !important;\n}\n","",{version:3,sources:["G:/Workspaces/work/chenxin/module-hyy/crm/src/views/member/jointNameCard/addJointNameCardMerchant.vue"],names:[],mappings:";AACA;EACE,gCAAgC;CACjC;AACD;IACI,gBAAgB;CACnB;AACD;IACI,gBAAgB;CACnB;AACD;EACE,WAAW;CACZ;AACD;EACE,YAAY;EACZ,gBAAgB;CACjB;AACD;EACE,aAAa;EACb,gBAAgB;CACjB;AACD;EACE,aAAa;CACd;AACD;EACE,oBAAoB;CACrB;AACD;EACE,UAAU;CACX;AACD;EACE,YAAY;EACZ,oBAAoB;EACpB,mBAAmB;CACpB;AACD;IACI,0BAA0B;CAC7B",file:"addJointNameCardMerchant.vue",sourcesContent:["\n.add-jointNameCard-merchant .add-joint-name-card-form .cooperation-time {\n  margin: 5px 0 28px 0 !important;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .cooperation-time .el-range-input {\n    font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .cooperation-time .el-range-separator {\n    font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form ._member-joint-name-card-memo .el-form-item__error {\n  top: 120px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-form--label-left .el-form-item__label {\n  color: #666;\n  font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-input {\n  width: 360px;\n  font-size: 12px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-textarea {\n  width: 360px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-form-item {\n  margin-bottom: 22px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form .el-form-item__error {\n  top: 40px;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form ._add-joint-name-card-btn-wrap {\n  width: 100%;\n  margin: 40px 0 40px;\n  text-align: center;\n}\n.add-jointNameCard-merchant .add-joint-name-card-form ._add-joint-name-card-btn-wrap .el-form-item__content {\n    margin-left: 0 !important;\n}\n"],sourceRoot:""}])},419:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"add-jointNameCard-merchant"},[a("el-form",{ref:"ruleForm",staticClass:"add-joint-name-card-form",attrs:{model:e.ruleForm,rules:e.rules,size:"medium","label-width":"100px","label-position":"left"}},[a("el-form-item",{attrs:{label:"商户名称：",prop:"merchantName"}},[a("el-input",{attrs:{placeholder:"请输入商户名称"},model:{value:e.ruleForm.merchantName,callback:function(t){e.$set(e.ruleForm,"merchantName",t)},expression:"ruleForm.merchantName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"合同编号：",prop:"compactId"}},[a("el-input",{attrs:{placeholder:"请输入合同编号"},model:{value:e.ruleForm.compactId,callback:function(t){e.$set(e.ruleForm,"compactId",t)},expression:"ruleForm.compactId"}})],1),e._v(" "),a("el-form-item",{staticClass:"cooperation-time",attrs:{label:"合作时间：",prop:"cooperationTime"}},[a("el-date-picker",{staticStyle:{width:"360px"},attrs:{type:"daterange",align:"right","unlink-panels":"","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd"},model:{value:e.cooperationTime,callback:function(t){e.cooperationTime=t},expression:"cooperationTime"}})],1),e._v(" "),a("el-form-item",{staticClass:"_member-joint-name-card-memo",attrs:{label:"备注：",prop:"memo"}},[a("el-input",{attrs:{type:"textarea",resize:"none",rows:5},model:{value:e.ruleForm.memo,callback:function(t){e.$set(e.ruleForm,"memo",t)},expression:"ruleForm.memo"}})],1),e._v(" "),a("el-form-item",{staticClass:"_add-joint-name-card-btn-wrap"},[a("el-button",{staticClass:"_el-btn-custom _member-add-edit-save-btn",attrs:{type:"primary"},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v("保存\n      ")]),e._v(" "),a("el-button",{staticClass:"_el-btn-custom",on:{click:function(t){return e.resetForm("ruleForm")}}},[e._v("取消")])],1)],1)],1)},r=[],o={render:n,staticRenderFns:r};t.a=o},74:function(e,t,a){"use strict";function n(e){a(417)}Object.defineProperty(t,"__esModule",{value:!0});var r=a(240),o=a(419),m=a(8),i=n,d=m(r.a,o.a,!1,i,null,null);t.default=d.exports}});