import Global from "../../../util/global.js";
import config from "frame_cpm/http/config";
import TargetLabel from "../../partical/targetLabel";
import TargetNewDialog from "../../partical/targetNewDialog";
import CalendarView from "../../../components/calendar/calendar";
import BreadCrumb from "../../partical/breadCrumb";
import AuthorityName from '../../partical/authorityName'
import SectionTarget from '../common/section-target'
import SectionTrend from '../common/section-trend'
import SectionTypeChannel from '../common/section-type-channel'
import SectionDetail from '../common/section-detail'
var  member = {
    components: {
        SectionTarget,
        SectionTrend,
        SectionTypeChannel,
        SectionDetail,
        BreadCrumb,
        AuthorityName,
        TargetLabel,
        TargetNewDialog,
        CalendarView
    },
    name:'会员概览',
    data() {
        return {
            naveList:[{name:'会员分析'},{name:"会员概况"}],
            brandId: null,
            cinemaBrand: [],
            orgType:null,
            orgName: null,
            currentTime: null,
            dateType:['天','周','月','年','自定义'],
            // dateTypeIndex:null,
            timeType:"day",
            time: null,
            startTime: null,
            endTime: null,
            cityId:null,
            cinemaId:null,
            showRatio:true, // 环比、同比的显示与隐藏
            hiddenRound:false, // 置灰环比
            hiddenSame:false,// 置灰同比
            ratioType:1,// 环比
            selectedTarget:[], // 已选指标
            targetList:[], // 指标列表
            allTrendData:{},// 趋势
            allChannelData:{},// 类型、渠道
            detailData:[],
            bsiCodes:['xzhy','yxhy','ljhy','kzhyh','xinkhy','xukhy','bkhy','czhy','ydqhy30',
            'ydqhy7','hykfsy','hyczje','ljczje','hyxfje','hyxksy','hyxuksy',
            'hybksy','hykdj','hyrjsy'
            ],
            trendTargetLabel:[],
            trendOtherLabel:[],
            trendFirstLabel:null,
            channelTargetLabel:[],
            channelOtherLabel:[],
            channelFirstLabel:null,
            userId: this.$store.state.loginUser
            ? this.$store.state.loginUser.uid
            : null,
            page:1,
            size:15,
            total:0,
            sizes:Global.pageSizes
        };
    },
    filters: {
        // 带单位
        formatNum: (money, count,unit) => {
          return Global.formatNum(money,count,unit);
        },
        // 不带单位
        formatMoney(money,indicatorCode) {
            if(indicatorCode == 'xssl' || indicatorCode == 'xsdl'){
                return Global.formatMoney(money,0);
            }else{
                return Global.formatMoney(money);
            }
        },
        formatTargetUnit: (type, money) => {
          return Global.formatTargetUnit(type, money);
        }
      },
      created() {
        // console.log('页面创建')
        this.getOnce(); 
        this.initData();
      },
    
      watch:{
        "$route"(to,from){
            let orgType = null;
            if(this.orgType == 'city'){
                orgType = 'area';
            }else{
                orgType = this.orgType;
            }
            // console.log(this.orgType,from.path,to.path,1)
            if(to.name == from.name && to.path.endsWith(`${orgType}/member/total`)){
                // console.log('新页面刷新',this.orgType,from.path,to.path,2)
                this.initData()
            }
        }
      },
      methods: {
        getOnce(){// 调用一次
            this.getCurrentTime();
            this.getBrand();
        },
        getAllApi(){
            this.getTarget();
            this.getTargetView();
            this.getDetail();
            this.getTrend();
            this.getChannel();
        },
        initData(){
            let query = this.$route.query;
            this.cityId = query.cityId?query.cityId:null;
            this.cinemaId = query.cinemaId?query.cinemaId:null;
            this.timeType =  query.dateType?query.dateType:'day';
            this.orgName = query.name?query.name:null;
            // this.dateTypeIndex = query.dateTypeIndex?query.dateTypeIndex:null,
            this.startTime = query.startTime?query.startTime:this.$moment(new Date()).format("YYYY-MM-DD"), 
            this.endTime = query.endTime?query.endTime:this.$moment(new Date()).format("YYYY-MM-DD");
            if(this.timeType == 'day'){
              this.time = this.startTime;
            }else{
              this.time = [this.startTime,this.endTime]
            }
            this.getOrg().then(()=>{
                this.getAllApi()
            });
            
        },
        // 影院品牌
        getBrand(){
            this.$camList.selectBrand().then(res=>{
                this.cinemaBrand = res.data;
            })
        },
        // 组织结构
        getOrg(){
            return new Promise((resolve,reject)=>{
                if(this.orgName){ // 
                    let orgType = ["group","area","cinema"].find(item => this.$route.path.includes(item));
                    if(orgType == 'area'){
                        this.orgType = 'city';
                    }else{
                        this.orgType = orgType;
                    }
                    resolve()
                }else{ // 初始化 
                    this.$camList.getOrgInfo({body:{}}).then(res=>{
                        if(res.data){
                            this.orgName = res.data.orgName;
                            this.orgType = res.data.orgType;
                        }
                        resolve()
                    })  
                }
            })
        },
        // 1.数据更新
        getCurrentTime() {
          this.$camList.getCurrentTime().then(res => {
            this.currentTime = res.data;
          });
        },
        // 2.查询指标
        getTarget(){
            let params = {
                body:{
                    dateType:this.timeType,
                    startDate:this.startTime,
                    endDate:this.endTime,
                    userId:this.userId,
                    cityId:this.cityId,
                    cinemaId:this.cinemaId
                }
            };
            this.$camList.memberTarget(params).then(res=>{
                // console.log('会员指标',res.data)
                this.selectedTarget = res.data;
            })
        },
        // 全部指标
        getTargetView(){
            let params = {
                body:{
                    dateType:this.timeType,
                    userId:this.userId,
                    cityId:this.cityId,
                    cinemaId:this.cinemaId
                }
            };
            this.$camList.memberTargetAll(params).then(res=>{
                // console.log(res.data.view,'全部指标')
                let trendLabel = res.data.trend;
                let channelLabel = res.data.channel;
                this.handleLabel({trendLabel:trendLabel,channelLabel:channelLabel});
                let resView = res.data.view;
                let amountObj = {
                    name:'会员数量类',
                    list:resView['amout']
                };
                let profitObj = {
                    name:'会员收益类',
                    list:resView['profit']
                };
                let ratioObj = {
                    name:'效率类',
                    list:resView['ratio']
                };
                let resData = [amountObj,profitObj,ratioObj];
                this.targetList = resData;
                
            })
        },
        handleLabel({trendLabel,channelLabel}){
            if(trendLabel.length>6){
                this.trendFirstLabel =  trendLabel[0].code;
                this.trendTargetLabel = trendLabel.slice(0,7).map(item=>{
                    return {id:item.code,name:item.name}
                });
                this.trendOtherLabel = trendLabel.slice(7).map(item=>{
                    return {id:item.code,name:item.name}
                })
            }else if(trendLabel.length>0){
                this.trendFirstLabel =  trendLabel[0].code;
                this.trendTargetLabel = trendLabel.map(item=>{
                    return {id:item.code,name:item.name}
                });
                this.trendOtherLabel = [];
            }
            if(channelLabel.length>6){
                this.channelFirstLabel = channelLabel[0].code;
                this.channelTargetLabel = channelLabel.slice(0,7).map(item=>{
                    return {id:item.code,name:item.name}
                });
                this.channelOtherLabel = channelLabel.slice(7).map(item=>{
                    return {id:item.code,name:item.name}
                })
            }else if(channelLabel.length>0){
                this.channelFirstLabel = channelLabel[0].code;
                this.channelTargetLabel = channelLabel.map(item=>{
                    return {id:item.code,name:item.name}
                });
                this.channelOtherLabel = [];
            }
            // console.log(this.trendFirstLabel,this.channelFirstLabel,'labels')
            // console.log(this.channelTargetLabel,this.channelOtherLabel,'channel labels')
        },
        // 显示指标弹窗
        showTargetView(){
            this.$refs.targetDailog.show = true;
            this.getTargetView();
        },
        // 保存指标
        saveTarget(ids){
            let params = {
                body:{
                    indicatorCodes:ids,
                    userId:this.userId,
                    cityId:this.cityId,
                    cinemaId:this.cinemaId
                }
            };
            this.$camList.memberSaveTarget(params).then(res=>{
                // console.log(res,'保存指标')
                this.$refs.targetDailog.selectList = [];
                this.$refs.targetDailog.show = false;
                this.getTarget();
            })
        },
        // 3.查询趋势图
        getTrend(){
            let params = {
                body:{
                  dateType:this.timeType,
                  startDate:this.startTime,
                  endDate:this.endTime,
                  userId:this.userId,
                  cityId:this.cityId,
                  cinemaId:this.cinemaId
                }
            };
            this.$camList.memberTrend(params).then(res=>{
                // console.log(res.data,'趋势')
                let resData = res.data;
                if(resData){
                    this.allTrendData = resData;
                }else{
                    this.allTrendData = [];
                }
            })
        },        
        // 4.查询渠道
        getChannel(){
            let params = {
                body:{
                    dateType:this.timeType,
                    startDate:this.startTime,
                    endDate:this.endTime,
                    userId:this.userId,
                    cityId:this.cityId,
                    cinemaId:this.cinemaId
                }
            };
            this.$camList.memberChannelType(params).then(res=>{
                // console.log(res,'全部渠道')
                this.allChannelData = res.data;
            })
        },
        // 5.查询明细
        getDetail(){
            let params = {
                body:{
                    dateType:this.timeType,
                    startDate:this.startTime,
                    endDate:this.endTime,
                    userId:this.userId,
                    pageNo:this.page,
                    pageSize:this.size,
                    cityId:this.cityId,
                    cinemaId:this.cinemaId
                }
            };
            this.$camList.memberDetailTable(params).then(res=>{
                // console.log(res,'明细')
                this.detailData = res.data.list;
                this.total = res.data.total
            })
        },
        // 趋势表格下载
        trendExport(){
              let baseURL = config.baseURL;
              let api = `/analysis/member/downloadMemberTend?&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
                this.timeType
              }&token=${this.$store.state.loginToken}`;
              let downUrl = `${baseURL}${api}`;
              if(this.orgType == 'city'){
                    if(this.cityId){
                        downUrl = `${downUrl}&cityId=${this.cityId}`;
                    }
                  
              }else if(this.orgType == 'cinema'){
                    if(this.cinemaId){
                        downUrl = `${downUrl}&cinemaId=${this.cinemaId}`;
                    }
              }
              window.location.href = downUrl;
        },
        // 明细表格下载
        detailExport(){
            let baseURL = config.baseURL;
            let api = `/analysis/member/downloadRegionData?&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
                this.timeType
              }&token=${this.$store.state.loginToken}`;
            let downUrl = `${baseURL}${api}`;
            if(this.orgType == 'city'){
                if(this.cityId){
                    downUrl = `${downUrl}&cityId=${this.cityId}`;
                }
            }else if(this.orgType == 'cinema'){
                if(this.cinemaId){
                    downUrl = `${downUrl}&cinemaId=${this.cinemaId}`;
                }
            }
            window.location.href = downUrl;
        },
       
        //获取时间类型
        getTimeType(type) {
          this.timeType = type;
          let target = this.$refs.target; // 指标section
          if (type == "custom") {  // 自定义 隐藏同比、环比
            this.showRatio = false;
          } else if(type == "year"){  //年只显示环比
            this.showRatio = true;
            this.hiddenSame = true;
            this.hiddenRound = false;
            target.ratioType = 1;
          }else{ //天、周、月、显示同比和环比,
            this.showRatio = true;
            this.hiddenSame = false;
            this.hiddenRound = false;
            target.ratioType = 1;
          }
        },
        //改变时间
        changeTime(option) {
          if (option.startTime) {
            this.startTime = option.startTime;
            this.endTime = option.endTime;
          } else {
            this.startTime = this.$moment(option).format("YYYY-MM-DD");
            this.endTime = this.$moment(option).format("YYYY-MM-DD");
          }
        },
        handleSizeChange(id){
            this.size = id
            this.getDetail();
        },
        handleCurrentChange(id){
            this.page = id;
            this.getDetail();
        },
        // 指标设置/弹窗
        showTargetSetting() {
          let targetDialog = this.$refs.targetDailog;
          let params = {
            body: {
              userId: this.userId,
              cityId:this.cityId,
              cinemaId:this.cinemaId
            }
          };
          this.$camList.saleTargetBinding(params).then(response => {
            let res = response.data;
            targetDialog.profit = res.profit;
            targetDialog.ratio = res.ratio;
            targetDialog.sale = res.sale;
            targetDialog.show = true;
          });
        },
       // 前往城市版
           goDetail(option) {
            let cityId = option.cityId?option.cityId:null;
            let cinemaId = option.cinemaId?option.cinemaId:null;
            let name = option.name;
            let type = this.orgType;
            if(type == 'group'){
                this.$router.push({path:'/analysis/area/member/total',query:{
                    cityId:cityId,
                    name:name,
                    dateType:this.timeType,
                    startTime:this.startTime,
                    endTime:this.endTime

                }})
            }else if(type == 'city'){
                this.$router.push({path:'/analysis/cinema/member/total',query:{
                    cinemaId:cinemaId,
                    name:name,
                    dateType:this.timeType,
                    startTime:this.startTime,
                    endTime:this.endTime
                }})
            }
        },
        // 查询
        search() {
            this.page = 1;
            this.getAllApi();
        },
        
    }
}
export default member;
