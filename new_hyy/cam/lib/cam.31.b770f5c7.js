webpackJsonpcam([31],{262:function(e,t,a){"use strict";var n=a(10);t.a={data:function(){return{}},beforeRouteEnter:function(e,t,a){Object(n.b)({body:{}}).then(function(e){e.data&&a(function(t){var a=e.data.orgType;"group"==a?t.$router.push("/analysis/group/home"):"city"==a?t.$router.push("/analysis/area/home"):"cinema"==a&&t.$router.push("/analysis/cinema/home")})})}}},320:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"content-wrap"},[a("router-view")],1)])},r=[],u={render:n,staticRenderFns:r};t.a=u},55:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a(262),r=a(320),u=a(15),s=u(n.a,r.a,!1,null,null,null);t.default=s.exports}});