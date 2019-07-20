import Global from "../../../util/global.js";
import AuthorityName from "../../partical/authorityName"
import CalendarView from "../../../components/calendar/calendar"
import TargetLabel from "../../partical/targetLabel"
import TreeGrid from "../../partical/TreeGrid"
export default {
  components: { 
    AuthorityName,
    CalendarView,
    TargetLabel,
    TreeGrid
  },
  data() {
    return {
      columns: [
          {
            text: '数据集名称',
            dataIndex: 'name'
          },
          {
            text: '性别',
            dataIndex: 'sex'
          },
          {
            text: '年龄',
            dataIndex: 'age'
          }
        ],
      dataSource: [
        {
          id: 1,
          parentId: 0,
          name: '测试1',
          age: 18,
          sex: '男',
          children: [
            {
              id: 2,
              parentId: 1,
              name: '测试2',
              age: 22,
              sex: '男'
            }
          ]
        },
        {
          id: 3,
          parentId: 0,
          name: '测试3',
          age: 23,
          sex: '女',
          children: [
            {
              id: 4,
              parentId: 3,
              name: '测试4',
              age: 22,
              sex: '男'
            },
            {
              id: 5,
              parentId: 3,
              name: '测试5',
              age: 25,
              sex: '男'
            },
            {
              id: 6,
              parentId: 3,
              name: '测试6',
              age: 26,
              sex: '女',
              children: [
                {
                  id: 7,
                  parentId: 6,
                  name: '测试7',
                  age: 27,
                  sex: '男'
                }
              ]
            }
          ]
        },
        {
          id: 18,
          parentId: 0,
          name: '测试8',
          age: 18,
          sex: '男'
        }
      ],
      orgType: Global.judgeOrgType,
      orgName: '总部',
      time: new Date(),
      dateType: ["天", "周", "月", "年", "自定义"],
      dateTypeActive: "天",
      dateTypeIndex: null,
      timeType: "day",
      memberType: false, // 会员类型
      memberTypeVal: 0,  // 会员类型 值
      activeType: 'xse',
      targetLabel: Global.categoryTrend,   // 趋势指标
      otherLabel: Global.categoryTrendOther, // 趋势指标 -其他
      trendIndicatorType: "xse", // 品类指标
      isNumber: true, // 是数值还是占比
      isHistogram: false, // 是否显示柱形图
      chartSettings: {
        stack: { '用户': ['小食', '饮料', '非食', '衍生品'] }
      },
      chartData: {
        columns: ['日期', '小食', '饮料', '非食', '衍生品'],
        rows: [
          { '日期': '2019年2月', '小食': 1393, '饮料': 1093, '非食': 1393, '衍生品': 1093 },
          { '日期': '2019年3月', '小食': 3530, '饮料': 3230, '非食': 3530, '衍生品': 3230 },
          { '日期': '2019年4月', '小食': 2923, '饮料': 2623, '非食': 2923, '衍生品': 2623 },
          { '日期': '2019年5月', '小食': 1723, '饮料': 1423, '非食': 1723, '衍生品': 1423 },
          { '日期': '2019年6月', '小食': 3792, '饮料': 3492, '非食': 3792, '衍生品': 3492 },
          { '日期': '2019年7月', '小食': 4593, '饮料': 4293, '非食': 4593, '衍生品': 4293 }
        ]
      },
      tableData: [
        {
          name:'小食',
          label: '缺',
          rLabel: '滞',
          children: [
            { 
              name: '爆谷产品',
              children: [
                { 
                  name: '中爆谷',
                }, 
                {
                  name: '大爆谷'
                }
              ]
            }, 
            {
              name: '饼干糕点'
            }
          ]
        }
      ], // 表格列表
      
      tableSortMsg: null, //表格排序信息
      sizes: Global.pageSizes,
      size: 10,
      page: 1,
      total: 0,
    }
  },
  computed: {
    
  },
  filters: {
    // 未返回的数据格式
    formatNull: (num) => {
      if(num === null || num === undefined) return '--'
      return num
    },
    // 满足特定格式化要求
    formatFixed: (num) => {
      if(num === null || num === undefined) return '--'
      if(num < 10000) {
        return Math.round(num)
      }
      return num
    },
    // 带单位
    formatNum: (money, count,unit) => {
      return Global.formatNum(money,count,unit);
    },
    // 不带单位
    formatMoney(money,indicatorCode) {
        if(['cc','rjcc','gyrc'].includes(indicatorCode)){
            if(money > 10000) {
              return Global.formatMoney(money);
            }else {
              return isNaN(money) ? '--' : Math.round(money)
            } 
        }else{
            return Global.formatMoney(money);
        }
    },
    formatTargetUnit: (type, money) => {
      return Global.formatBoxOfficeTargetUnit(type, money);
    }
  },
  watch: {
    isNumber(val) {
      console.log('是否是数值',val)
    }
  },
  created() {
    
  },
  methods: {
    //获取时间类型  --待定
    getTimeType(type) {
      this.timeType = type;
      if (this.timeType == "year") {
        
      } else if (this.timeType == "custom") {
        
      } else {
        
      }
    },
    //改变时间
    changeTime(option) {

    },
    // 查询
    search() {
      // this.getAllData();
    },
    // 改变/会员
    changeMemberType() {
      this.memberTypeVal = +this.memberType;
      if(this.memberTypeVal) { //仅会员
        
        
      }else {
        
      }
    },
    // 改变/指标趋势类型
    changeTrendType(id) {
      this.isHistogram = Global.categoryTrendOther.findIndex(item=>item.id === id) > -1
      if(this.isHistogram) {
        this.chartSettings = {}
      }else {
        this.chartSettings = {
          stack: { '用户': ['小食', '饮料', '非食', '衍生品'] }
        }
      }
      this.trendIndicatorType = id;
      // this.getTargetTrend()
    },
    // 品类明细导出
    getCategoryOut() {
      // let baseURL = config.baseURL;
      // let downUrl = `${baseURL}/analysis/boxOffice/exportRegionData?userId=${
      //   this.userId
      // }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
      //   this.timeType
      // }&member=${this.memberTypeVal}&token=${this.$store.state.loginToken}`;
      // if(this.cinemaId) {
      //   downUrl += `&brandId=${this.cinemaId}`
      // }
      // window.location.href = downUrl;
    },
    // 列表排序
    tableSortChange(column) {
      let orderObj = null
      if(column.column) {
        orderObj = {
          columnType: column.prop,
          seq: column.order === 'ascending' ? 'ASC':'DESC'
        }
        this.tableSortMsg = Object.assign({},orderObj)
      }else {
        this.tableSortMsg = null
      }
      // this.getTableData(orderObj)
    },
    // 去往品类详情页面
    goDetail(id) {
      return
      this.$router.push({
        path: "/analysis/area/boxOffice/total",
        query: {
          id: id,
        }
      });
    },
  }
}