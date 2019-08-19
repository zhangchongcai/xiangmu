import Global from "../../../../util/global.js";
import BreadCrumb from "../../../partical/breadCrumb";
import TicketsSearch from './tickets-section-search';
import TicketsDetail from './tickets-section-detail'
const tickets =  {
components: {BreadCrumb,TicketsDetail,TicketsSearch},
  data() {
    return {
        naveList:[{name:'营销分析'},{name:'票劵概览'}],
        orgType:null,
        orgName:null,
        defaultSearch:{
            columnType:'ticket_create_time',
            seq:"DESC",
            "ticketType":null,
            "detailType":1,
            "ticketName":null,
            "ticketStatus": null,
            "startDate": this.$moment(new Date()).add(-1,'month').format('YYYY-MM-DD') ,
            "endDate": this.$moment(new Date()).format('YYYY-MM-DD'), 
            "pageNo":1,
            "pageSize":15,
        },
        startTime:this.$moment(new Date()).add(-1,'month').format('YYYY-MM-DD'),
        endTime:this.$moment(new Date()).format('YYYY-MM-DD'),
        tableData: [],
        page:1,
        total:0,
        size: 15,
        sizes:Global.pageSizes
    };
  },
  created(){
    this.getTableData();
    this.getOrg();
  },
  methods: {
    // 组织结构
    getOrg(){
        if(this.$route.query.type){
            this.orgName = this.$route.query.name;
            this.orgType = this.$route.query.type;
            return
        }else{
            this.$camList.getOrgInfo({body:{}}).then(res=>{
                if(res.data){
                    this.orgName = res.data.orgName;
                    this.orgType = res.data.orgType;
                }
            })
        }
    },
    // 列表
    getTableData(params){
        let paramsObj = {body:{}};
        if(params){
            paramsObj = {body:params};
        }else{
            paramsObj = {
                body:this.defaultSearch
            };
        }
        this.$camList.getTickets(paramsObj).then(res=>{
            let resData = res.data;
            if(resData && resData.list){
                this.tableData = resData.list;
                this.total = resData.total;
            }
        })
    },
    search(params){
        // this.defaultSearch = Object.assign({},params);
        this.startTime = params.startDate;
        this.endTime = params.endDate;
        this.size = params.pageSize;
        this.page = params.pageNo;
        this.defaultSearch = Object.assign(params)
        this.getTableData(params)
    },
    goDetail(option){
        this.$router.push({path:`/analysis/${option.type}/ticket/use`,
            query:{
                id:option.id,
                startTime:option.startTime,
                endTime:option.endTime,
                type:this.orgType,
                name:this.orgName
            }
        })
    },
    changeTime() {
        // console.log(arguments)
        this.defaultSearch.startDate = arguments[0]
        this.defaultSearch.endDate = arguments[1]
    },
    changeType() {
        // console.log(arguments[0])
    },
    changeStatus() {
        // console.log(arguments[0])
    },
    changeName() {
        // console.log(arguments[0])
    },
    // 分页/大小
    handleSizeChange(num) {
        this.size = num;
        this.defaultSearch.pageSize = num;
        this.getTableData();
    },
    //分页/页码
    handleCurrentChange(num) {
        this.page = num;
        this.defaultSearch.pageNo = num;
        this.getTableData();
    }
  }
};
export default tickets