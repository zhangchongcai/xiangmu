webpackJsonpcam([32],{265:function(t,e,a){"use strict";var n=a(10);e.a={data:function(){return{}},beforeRouteEnter:function(t,e,a){Object(n.b)({body:{}}).then(function(t){t.data&&a(function(e){var a=t.data.orgType;"group"==a?e.$router.push("/analysis/group/boxOffice/total"):"city"==a?e.$router.push("/analysis/area/boxOffice/total"):"cinema"==a&&e.$router.push("/analysis/cinema/boxOffice/total")})})}}},323:function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("router-view")],1)},r=[],u={render:n,staticRenderFns:r};e.a=u},58:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a(265),r=a(323),u=a(15),o=u(n.a,r.a,!1,null,null,null);e.default=o.exports}});