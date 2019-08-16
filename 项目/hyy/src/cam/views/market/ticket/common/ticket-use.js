
import Global from "../../../../util/global.js";
import config from "frame_cpm/http/config";
import TargetNewDialog from "../../../partical/targetNewDialog";
import BreadCrumb from "../../../partical/breadCrumb";
import SectionSearch from '../common/ticket-section-search'
import SectionTarget from '../common/ticket-section-target'
import SectionTrend from '../common/ticket-section-trend'
import SectionDetail from '../common/ticket-section-detail'
const ticket = {
    components: {
        BreadCrumb,
        SectionSearch,
        SectionTarget,
        SectionTrend,
        SectionDetail,
       TargetNewDialog,
    },
    data() {
        return {
            id:null,
            cityId:null,
            cinemaId:null,
            orgType: null,
            orgName: null,
            naveList:[{name:'票劵使用效果分析',path:'/analysis/group/ticket/use'}],
            ticketInfo:{ // 基础信息
                name:null,
                type:null,
                time:[]
            },
            currentTime:null,
            timeType: "day",
            time:null,
            startTime: null,
            endTime: null,
            userId: this.$store.state.loginUser ? this.$store.state.loginUser.uid:null,
            codes:['ddxfe','ddxfdl','kdj','ffsl','sysl','syl','yspqcb','sypqcb','cyhysl','hyxfzb'],
            orderByColumn:null,
            sort:'asc',
            targetArr: [], // 指标概览
            targetList:[],// 全部指标   
            allTrendData:null, //指标趋势
            detailType:null, // 1.区域明细 2.影院明细 3.影片明细
            tableData:[],// 明细表格
            total:0,
            size:15,
            sizes:Global.pageSizes,
            page:1
        };
    },
    watch: {
        // "$route"(to,from){
        //     let orgType = this.orgType||'group';
        //     console.log(orgType,'fff',to,from)
        //     if(to.name == from.name && to.path.endsWith(`${orgType}/ticket/use`)){
        //         this.getCurrentTime();
        //         this.getOrg();
        //         this.init();
        //     }
        // }
    },
    created() {
        this.getCurrentTime();
        this.getOrg();
        this.init()
    },
    methods: {
        getCurrentTime() {
            this.$camList.getCurrentTime().then(res => {
                this.currentTime = res.data;
            });
        },
        init(){
            let query  = this.$route.query;
            this.id = query.id;
            this.cityId = query.cityId;
            this.cinemaId = query.cinemaId;
            this.orgType = query.type;
            this.orgName = query.name;
            this.startTime = query.startTime;
            this.endTime = query.endTime;
            this.timeType = query.startTime == query.endTime ?'day':'auto';
            this.time = [this.$moment(query.startTime).format('YYYY-MM-DD'),this.$moment(query.endTime).format('YYYY-MM-DD')];
            this.getAllData()
        },
        getAllData() {
            this.getTarget();
            this.getAllTarget();
        },
        getOrg(){
            // 下转带的权限
            if(this.$route.query.type){
                this.orgName = this.$route.query.name;
                this.orgType = this.$route.query.type;
                this.detailType = this.orgType == 'group'?1:(this.orgType == 'city'?2:3); // 明细列表，初始化类型
                return
            }else{
                this.$camList.getOrgInfo({body:{}}).then(res=>{
                    if(res.data){
                        this.orgName = res.data.orgName;
                        this.orgType = res.data.orgType;
                        this.detailType = this.orgType == 'group'?1:(this.orgType == 'city'?2:3);
                    }
                })
            }
        },
        // 1.默认指标概览/趋势/基本信息
        getTarget() {
            let params = {
              body:{
                cityId:this.cityId,
                cinemaId:this.cinemaId,
                userId:this.userId,
                startDate:this.startTime,
                endDate:this.endTime,
                dateType:this.timeType,
                ticketBatchNo:this.id
              }
            };
            this.$camList.ticketUseTarget(params).then(response =>{
              let res = response.data;
              if(res){
                this.targetArr = res.indicators; 
                this.allTrendData = res.trend; 
                this.id = res.ticketBatchNo;
                this.ticketInfo.id= res.ticketBatchNo;
                this.ticketInfo.name = res.ticketName;
                this.ticketInfo.type = res.ticketType;
                this.ticketInfo.time = [res.ticketValidTimeStart,res.ticketValidTimeEnd];
                // 获取时间后再获取区域列表
                this.getTableData();
              }
            })
        },
        // 2.全部指标
        getAllTarget(){
            return new Promise((resolve,reject)=>{
                let params = {
                    body:{
                        userId:this.userId,
                        cityId:this.cityId,
                        cinemaId:this.cinemaId,
                        bsiType:3,//0卖品 1 会员 2 票房 3票券
                    }
                };
                this.$camList.ticketUseAllTarget(params).then(res=>{
                    let resData = res.data;
                    if(resData){
                        let saleObj = {
                            name:'销售类',
                            list:resData['sale']
                        };
                        let budgetObj = {
                            name:'预算类',
                            list:resData['budget']
                        };
                        let costObj = {
                            name:'成本类',
                            list:resData['cost']
                        };
                        let personObj = {
                            name:'用户类',
                            list:resData['person']
                        };
                        this.targetList = [saleObj,budgetObj,costObj,personObj];  
                    } 
                })
            })
        },
        // 3.保存指标
        saveTarget(codes){
            let params = {
                body:{
                    cityId:this.cityId,
                    cinemaId:this.cinemaId,
                    indicatorCodes:codes,
                    userId:this.userId,
                    bsiType:3,//0卖品 1 会员 2 票房 3票券
                }
            };
            this.$camList.ticketUseSaveTarget(params).then(res=>{
                this.$refs.targetDialog.show = false;
                this.getTarget();
            })
        },
        // 4.区域分页
        getTableData(option) {
            if(option){
                this.detailType = option.type;
                this.orderByColumn = option.orderByColumn;
                this.sort = option.sort;
                this.page = option.page;
            }
            let params = {
                body: {
                    userId: this.userId,
                    cityId:this.cityId,
                    cinemaId:this.cinemaId,
                    detailType:this.detailType,
                    ticketBatchNo:this.id,
                    orderByColumn:this.orderByColumn,
                    sort:this.sort,
                    startDate: this.startTime,
                    endDate: this.endTime,
                    pageNo: this.page,
                    pageSize: this.size,
                    
                }
            };
            this.$camList.ticketUseDetail(params).then(response => {
                let res = response.data;
                if (res && res.list) {
                    this.tableData = res.list;
                    this.total = res.total;
                }
               
          });
        },
        showCompar(option){
            let params = {
                body:{
                    bsiCode:option.code,
                    ticketBatchNo:this.id?this.id:null,
                    startDate:this.startTime,
                    endDate:this.endTime,
                    detailType:option.type,
                    ids:option.ids,
                    dateType:this.timeType 
                }
            }
            this.$camList.ticketUseDetailCompare(params).then(res=>{
                let resData = res.data;
                let refDetail = this.$refs.detail;
                if(resData){
                    let columns = Object.keys(resData[0]);
                    let len = resData.length;
                    let num = 0;
                    if (len>20){
                        num = parseInt(len * 1 / 12);
                    }
                    this.$set(refDetail.lineExtend, 'xAxis.0.axisLabel.interval', num);
                    this.$set(refDetail.lineData,'columns',columns);
                    this.$set(refDetail.lineData,'rows', resData);
                    refDetail.isCompar = true
                }
                
            })
           
        },
        // 指标设置/弹窗
        showTargetSetting() {
            this.$refs.targetDialog.show = true;
        },
        // 跳转
        goDetail(option){
            let type = option.type;
            let cityId = option.cityId;
            let cinemaId = option.cinemaId;
            let name = option.name;
            if(type == 'city'){
                this.$router.push({path:'/analysis/area/ticket/use',
                    query:{
                    cityId:cityId,
                    name:name,
                    type:type,
                    id:this.id,
                    startTime:this.startTime,
                    endTime:this.endTime
                    }
                })
            }else if(type == 'cinema'){
                this.$router.push({path:'/analysis/cinema/ticket/use',query:{
                    cinemaId:cinemaId,
                    name:name,
                    type:type,
                    id:this.id,
                    startTime:this.startTime,
                    endTime:this.endTime
                }});
            } 
        },
        // 趋势表格下载
        trendExport(){
            let baseURL = config.baseURL;
            let api = `/analysis/market/downloadMarketTend?startDate=${this.startTime}&endDate=${this.endTime}&ticketBatchNo=${this.id}&userId=${this.userId}&token=${this.$store.state.loginToken}`;
            let downUrl =`${baseURL}${api}`;
            if(this.orgType == 'city'){
                if(this.cityId){
                    downUrl = `${downUrl}&cityId=${this.cityId}`;
                }else{
                    downUrl = `${downUrl}`;
                }
                
            }else if(this.orgType == 'cinema'){
                if(this.cinemaId){
                    downUrl = `${downUrl}&cinemaId=${this.cinemaId}`;
                }else{
                    downUrl = `${downUrl}`;
                } 
            }
            window.location.href = downUrl;
        },
        // 明细表格下载
        detailExport(option){
            let detailType = this.detailType;
            if(option){
                detailType = option.type
            }
            let baseURL = config.baseURL;
            let api = `/analysis/market/downloadRegionData?detailType=${detailType}&startDate=${this.startTime}&endDate=${this.endTime}&ticketBatchNo=${this.id}&userId=${this.userId}&token=${this.$store.state.loginToken}`;
            let downUrl =`${baseURL}${api}`;
            if(this.orgType == 'city'){
                if(this.cityId){
                    downUrl = `${downUrl}&cityId=${this.cityId}`;
                }else{
                    downUrl = `${downUrl}`;
                }
            }else if(this.orgType == 'cinema'){
                if(this.cinemaId){
                    downUrl = `${downUrl}&cinemaId=${this.cinemaId}`;
                }else{
                    downUrl = `${downUrl}`;
                }
            }
            // console.log(downUrl,'明细下载')
            window.location.href = downUrl;
        },
        // 查询
        search() {
            this.page = 1;
            this.size = 15;
            this.getAllData();
        },
        // 改变时间
        changeTime(time){
            if(time){
                this.startTime = time[0];
                this.endTime = time[1];
                if(this.startTime == this.endTime){
                    this.timeType = 'day'; // 始末时间相同，则默认是天，显示环比
                }else{
                    this.timeType = 'auto' // 始末时间不相同，则默认是自定义时间，隐藏环比
                }
            }else{
                this.startTime = this.$moment(new Date()).add(-1,'day').format('YYYY-MM-DD');
                this.endTime = this.$moment(new Date().add(-1,'day'),format('YYYY-MM-DD'));
            }
        },
        // 分页/大小
        handleSizeChange(num) {
          this.size = num;
          this.page = 1;
          this.getTableData();
        },
        //分页/页码
        handleCurrentChange(num) {
          this.page = num;
          this.getTableData();
        }
    }
}
export default ticket
