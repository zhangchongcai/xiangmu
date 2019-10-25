<template>
    <div class="movie-plan_detail">
        <el-collapse
            v-model="activeNames">
            <!-- 基础信息 -->
            <el-collapse-item
                v-if="isEditMode"
                title="基础信息"
                name="1">
                <div class="basic-info movie-info">
                    <el-form
                        label-width="72px">
                        <el-form-item label="影厅：">
                            <span class="cinema-stock-edit-text">
                                {{movieData.hallName}}
                            </span>
                        </el-form-item>
                        <el-form-item label="放映影片：">
                            <span class="cinema-stock-edit-text">
                               {{movieData.movieName}}
                            </span>
                        </el-form-item>
                        <el-form-item label="影片时长：">
                            <span class="cinema-stock-edit-text">
                                {{movieData.timeLong}}分
                            </span>
                        </el-form-item>
                        <el-form-item label="语言：" v-if="movieData.soldSeatCount == 0">
                            <span class="movie-lang">
                                <el-select
                                    placeholder="请选择"
                                    v-model="langValue">
                                    <el-option
                                        v-for="(item, index) in langArr"
                                        :key="index"
                                        :label="item.languageName"
                                        :value="item.languageName"
                                    ></el-option>
                                
                                </el-select>
                            </span>
                            
                        </el-form-item>
                        <el-form-item label="语言：" v-else>
                            <span class="cinema-stock-edit-text">
                               {{langValue}}
                            </span>
                            
                        </el-form-item>
                        <el-form-item label="放映时间：" v-if="movieData.soldSeatCount == 0">
                            <div class="movie-time">
                                {{showPlanDate}}
                                <el-input class="plan-minute" v-model="planMinute" @change="timeChange" min="00" max="59"></el-input>
                                分
                                <!-- <el-time-picker
                                    v-model="playTime"
                                    @change="timePickerChange"
                                    :editable="false"
                                    :clearable="false"
                                    value-format="HHmmss"
                                    :picker-options="timeRange"
                                    placeholder="任意时间点">
                                </el-time-picker> -->
                            </div>
                        </el-form-item>
                        <el-form-item label="放映时间：" v-else>
                           {{showPlanDate}}
                        </el-form-item>
                        <el-form-item label="审核状态：">
                            <span class="cinema-stock-edit-text">
                                {{movieData.approveStatus == 'NOT_APPROVE' ? '未审核' : movieData.approveStatus == 'WAIT_APPROVE' ? '待审核' : movieData.approveStatus == 'REJECT' ? '已驳回' : '已审核'}}
                            </span>
                        </el-form-item>
                        <el-form-item label="对号入座：">
                           <el-checkbox v-model="mustRightSeat"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="影片版本：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.disVersion}}
                            </span>
                        </el-form-item>
                        <el-form-item  label="首映日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.dateShowFirst}}
                            </span>
                        </el-form-item>
                        <el-form-item label="落幕日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.dateShowOff}}
                            </span>
                        </el-form-item>
                    </el-form>
                </div>
            </el-collapse-item>
            <el-collapse-item
                v-else
                title="基础信息"
                name="1">
                <div class="basic-info movie-info">
                    <el-form
                        label-width="72px">
                        <el-form-item label="影厅：">
                            <span class="cinema-stock-edit-text">
                                {{movieData.hallName}}
                            </span>
                        </el-form-item>
                        <el-form-item label="放映影片：">
                            <span class="cinema-stock-edit-text">
                               {{movieData.movieName}}
                            </span>
                        </el-form-item>
                        <el-form-item label="影片时长：">
                            <span class="cinema-stock-edit-text">
                                {{movieData.timeLong}}分
                            </span>
                        </el-form-item>
                        <el-form-item label="语言：">
                           <span class="cinema-stock-edit-text">
                                {{langValue}}
                            </span>
                        </el-form-item>
                        <el-form-item label="放映时间：">
                           {{movieData.planTime}} - {{movieData.planTimeEnd}}
                        </el-form-item>
                        <el-form-item label="审核状态：">
                            <span class="cinema-stock-edit-text">
                                 {{movieData.approveStatus == 'NOT_APPROVE' ? '未审核' : movieData.approveStatus == 'WAIT_APPROVE' ? '待审核' : '已审核'}}
                            </span>
                        </el-form-item>
                        <el-form-item label="对号入座：">
                           {{movieData.mustRightSeat ? '是' : '否'}}
                        </el-form-item>
                        <el-form-item label="影片版本：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.disVersion}}
                            </span>
                        </el-form-item>
                        <el-form-item label="首映日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.dateShowFirst}}
                            </span>
                        </el-form-item>
                        <el-form-item label="落幕日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.dateShowOff}}
                            </span>
                        </el-form-item>
                    </el-form>
                </div>
            </el-collapse-item>
            <!-- 价格体系 -->
            <el-collapse-item
                v-if="isEditMode"
                title="价格体系"
                name="2">
                <div class="basic-info price-system edit">
                    <el-button type="text" class="export-priceplan-btn" @click="showPricePlanDialog">导入价格方案</el-button>
                    <el-tabs v-model="activeTab" type="card" @tab-click="tabClick">
                        <el-tab-pane label="柜台/自助" name="first">
                            <el-form
                                label-width="72px">
                                <el-form-item label="适用票类：">
                                    <!-- <el-checkbox-group v-model="ticketTypeSel" @change="chooseTicketTypeSel">
                                        <el-checkbox
                                            v-for="(type, i) in ticketData.ciTickettypes"
                                            :key="i"
                                            :label="type.uid"
                                            name="type"
                                        >{{type.name}}</el-checkbox>
                                    </el-checkbox-group> -->
                                    <div>
                                        <el-table
                                            :data="ticketData"> 
                                            <el-table-column
                                                prop="name"
                                                label="票类名称"
                                                width="100"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="票类价格"
                                                width="210">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-input type="number" :disabled="scope.row.switchStatus?false:true" maxlength="9" max="999999" @change="priceChange1(scope.row.price,scope.$index)" v-model="scope.row.price"></el-input><i class="rmb-hover">¥</i></span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="addFee"
                                                label="增值服务费">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-input type="number" :disabled="scope.row.switchStatus?false:true" maxlength="9" max="999999" @blur="tableFixed(scope)" v-model="scope.row.addFee"></el-input><i class="rmb-hover">¥</i></span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="开售状态"
                                                width="100">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-switch
                                                        v-model="scope.row.switchStatus"
                                                        :disabled="scope.row.baseFlag == 0"
                                                        active-color="#3B74FF"
                                                        inactive-color="#BFBFBF">
                                                        </el-switch>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                        <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="线上网售" name="second">
                            <el-form
                                label-width="72px">
                                <el-form-item label="适用渠道：">
                                    <!-- <el-checkbox-group v-model="channelSel" @change="chooseChannels">
                                        <el-checkbox
                                            v-for="(channel, i) in ticketData.CiChannels"
                                            :key="i"
                                            :label="channel.uId"
                                            name="type"
                                        >{{channel.shortName}}</el-checkbox>
                                    </el-checkbox-group> -->
                                    <div>
                                        <el-table
                                            :data="channelData"
                                            class="edit-cichannel-table">
                                            <el-table-column
                                                prop="name"
                                                label="代理商"
                                                width="100"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="渠道结算票价"
                                                width="210">
                                                <template slot-scope="scope">
                                                    <!-- <el-select
                                                        v-model="scope.row.selValue">
                                                        <el-option
                                                            v-for="(item, index) in scope.row.sel"
                                                            :key="index"
                                                            :value="item.value"
                                                            :label="item.label">
                                                        </el-option>
                                                    </el-select> -->
                                                    <span class="input-con"><el-input type="number" maxlength="9" :disabled="scope.row.switchStatus?false:true" max="999999" @change="priceChange2(scope.row.price,scope.$index)" v-model="scope.row.price"></el-input><i class="rmb-hover">¥</i></span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="addFee"
                                                label="增值服务费">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-input type="number" maxlength="9" :disabled="scope.row.switchStatus?false:true" max="999999" @blur="cichannelToFixed(scope)" v-model="scope.row.addFee"></el-input><i class="rmb-hover">¥</i></span>
                                                </template>
                                            </el-table-column>
                                            <!-- <el-table-column
                                                prop="netSaleAddPrice"
                                                label="网络代售费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.netSaleAddPrice}}</span>
                                                </template>
                                            </el-table-column> -->
                                            <!-- <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee) + parseFloat(scope.row.netSaleAddPrice)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column> -->
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="allPrice"
                                                label="开售状态"
                                                width="100">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-switch
                                                        v-model="scope.row.switchStatus"
                                                        active-color="#3B74FF"
                                                        inactive-color="#BFBFBF">
                                                        </el-switch>
                                                    </span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                        <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                                    </div>
                                </el-form-item>
                                
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="竞对票价参考" name="third">
                            <el-form
                                label-width="72px">
                                <div class="pirce-ref-title">线上网售票价对比<span>({{year}}/{{month}}/{{day}})</span></div>
                                <div class="pirce-ref-area">
                                    <div class="table-top-tip">
                                        <div class="table-info-tip"><span class="color-block"></span>最高票价</div>
                                        <div class="table-info-tip"><span class="color-block"></span>最低票价</div>
                                    </div>
                                    <div style="overflow: hidden;">
                                        <el-table
                                            :default-sort = "{prop: 'avgPrice', order: 'descending'}"
                                            :style="{width: !hasNoVieCinema ? '900px !important' : '29% !important', float: !hasNoVieCinema ? 'none' : 'left'}"
                                            :data="priceContrast"
                                            class="price-ref-table">
                                            <el-table-column
                                                prop="channelName"
                                                fixed="left"
                                                width="150"
                                                :label="movieData.movieName"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                fixed="left"
                                                width="150"
                                                sortable
                                                prop="myPirce"
                                                label="我的影院">
                                                <template slot-scope="scope">
                                                    <span :class="scope.row.order == 'low' ? 'low' : scope.row.order == 'top' ? 'top' : '' ">{{Number(scope.row.myPrice).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                v-if="!hasNoVieCinema"
                                                fixed="left"
                                                width="150"
                                                sortable
                                                prop="avgPrice"
                                                label="竞对平均票价">
                                                <template slot-scope="scope">
                                                    <span>{{Number(scope.row.avgPrice).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                v-for="(cinema, index) in vieCinemaList" 
                                                :key="cinema.cinemaCode"
                                                :class-name="'cinema-col'"
                                                width="150"
                                                :prop="cinema.cinemaCode"
                                                sortable>
                                                <template slot="header" slot-scope="scope">
                                                    <div class="cinema-th">
                                                        <p class="cinema-info" :title="cinema.cinemaName || cinema.cinemaCode">{{cinema.cinemaName || cinema.cinemaCode}}</p>
                                                        <p class="cinema-info">{{cinema.lang}}</p>
                                                        <p class="cinema-info">{{formatDateTime(cinema.startMills * 1000, 2)}} - {{formatDateTime(cinema.endTimeMills * 1000, 2)}}</p>
                                                    </div>
                                                        
                                                </template>   
                                                <template slot-scope="scope">
                                                    <span :class="scope.row.movieTickets[index].order == 'low' ? 'low' : scope.row.movieTickets[index].order == 'top' ? 'top' : ''">{{Number(scope.row.movieTickets[index].price).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>

                                        </el-table>
                                        <div  class="no-vie-cinema" v-if="hasNoVieCinema" :style="{width: tipBox.width + 'px', height: tipBox.height + 'px', borderLeft: 'none'}">
                                            <div class="center-tip">
                                                <p class="p1">您还没有设置竞对影院！</p>
                                                <p class="p2"><el-button type="primary" @click="setVieCinema">设置竞对影院</el-button></p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                    <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                                </div>
                                
                            </el-form>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="table-bottom-menu">
                        <div class="prcie-promise">
                            <el-checkbox
                                v-model="permitSaleBox"
                            >允许包厢单卖</el-checkbox>
                        </div>
                        <div class="prcie-promise">
                            <el-checkbox
                                v-model="permitDiscount"
                            >允许营销活动折扣、会员折扣</el-checkbox>
                        </div>
                        <div class="prcie-promise">
                           <p>已匹配的价格方案: {{this.movieData.priceProgramName}}</p>
                        </div>
                        <!-- <div class="canal-pirce-input">
                            <span>渠道代收费</span><em>¥</em><el-input>0.10</el-input>
                        </div> -->
                    </div>
                    <div class="table-bottom-menu" v-if="isEditMode">
                        <el-form label-width="130px" size="small" class="demo-ruleForm" style="width:100%">
                        <el-form-item label="分区定价：" class="m-t-10">
                            <el-select @change="zoningPricing" v-model="pricing" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in options"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                            </el-select>
                            <el-table :data="tableData" style="margin-top:10px;width: 302px" v-if="pricing == 1">
                            <el-table-column prop="name" label="分区" width="100">
                                <template slot-scope="scope">
                                <i :style="{background:scope.row.color}">&nbsp;&nbsp;&nbsp;&nbsp;</i>
                                <span>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="加减价（正数为加，负数为减）" width="200">
                                <template slot-scope="scope">
                                <span class="input-con">
                                    <el-input
                                    type="number"
                                    maxlength="9"
                                    placeholder="0"
                                    v-model="scope.row.price"
                                    @change="priceChang(scope.row.price,scope.$index)"
                                    ></el-input>
                                    <i class="rmb-hover">¥</i>
                                </span>
                                </template>
                            </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item label="执行动态调价：" class="m-t-10">
                            <el-select @change="dynamicPrice" v-model="pricing1" placeholder="请选择">
                            <el-option
                                v-for="(item,index) in options1"
                                :key="index"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                            </el-select>
                            <div v-if="pricing1==1" class="show">
                            <el-checkbox-group
                                v-model="checkList"
                                @change="checklist"
                                class="m-t-15"
                                style="width:300px;"
                            >
                                <el-checkbox
                                v-for="(item,index) in disVersionList2"
                                :key="index"
                                :label="item.idx"
                                >{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                            <div>
                                <p
                                style="width:800px;margin-top:10px;"
                                v-for="(item,index) in activeList"
                                :key="index"
                                >
                                 <el-input
                                    v-if="ifCheck[0]==0&&index == 0"
                                    type="number"
                                    style="width: 80px;"
                                    v-model="item.occupancyMin"
                                    placeholder="0"
                                    :class="{redBorder : activ == index && activ !=''}"
                                    @change="changeNumer(item.occupancyMin,index)"
                                ></el-input>
                                <el-input
                                    v-if="ifCheck[0]==0&&index>0"
                                    type="number"
                                    style="width: 80px;"
                                    v-model="item.occupancyMin"
                                    placeholder="0"
                                    disabled
                                    :class="{redBorder : activ == index && activ !=''}"
                                    @change="changeNumer(item.occupancyMin,index)"
                                ></el-input>
                                <span v-if="ifCheck[0]==0">%&nbsp;≤&nbsp;上座率&nbsp;{{fuhao}}&nbsp;</span>
                                <el-input
                                    v-if="ifCheck[0]==0"
                                    type="number"
                                    :class="{redBorder : active == index && active !=''}"
                                    style="width: 80px;"
                                    v-model="item.occupancyMax"
                                    placeholder="0"
                                    @change="changeNumer1(item.occupancyMax,index)"
                                ></el-input>
                                <span v-if="ifCheck[0]==0">%&nbsp;&nbsp;</span>
                                <span v-if="ifCheck[0]==0&&ifCheck[1]">且</span>
                                <span v-if="ifCheck[0]==1||ifCheck[1]==1">&nbsp;&nbsp;开映前&nbsp;</span>
                                <el-input
                                    v-if="ifCheck[0]==1||ifCheck[1]==1"
                                    type="number"
                                    style="width: 80px;"
                                    v-model="item.time"
                                    placeholder="0"
                                    :class="{redBorder : active2 == index && active2 !=''}"
                                    @change="changeTime(item.time,index)"
                                ></el-input>
                                <span v-if="ifCheck[0]==1||ifCheck[1]==1">小时；</span>
                                <el-select
                                    v-if="ifCheck[0]==0||ifCheck[0]==1"
                                    v-model="item.type"
                                    placeholder="请选择"
                                >
                                    <el-option
                                    v-for="(item,index) in opt1"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value"
                                    ></el-option>
                                </el-select>
                                <el-input
                                    v-if="ifCheck[0]==0||ifCheck[0]==1"
                                    type="number"
                                    style="width: 80px;"
                                    v-model="item.price"
                                    placeholder="0"
                                    :class="{redBorder : active1 == index && active1 !=''}"
                                    @change="changeNumer2(item.price,index)"
                                ></el-input>
                                <a v-if="(ifCheck[0]==0||ifCheck[0]==1)&&index>=1" @click="delRuler(index)">删除</a>
                                </p>
                                <a v-if="ifCheck[0]==0||ifCheck[0]==1" @click="addRuler">添加规则</a>
                            </div>
                            </div>
                        </el-form-item>
                        </el-form>
                    </div>
                </div>   
            </el-collapse-item>
            <el-collapse-item
                v-else
                title="价格体系"
                name="2">
                <div class="basic-info price-system">
                    <el-tabs v-model="activeTab" type="card">
                        <el-tab-pane label="柜台/自助" name="first">
                            <el-form
                                label-width="72px">
                                <el-form-item label="适用票类：">
                                    <div>
                                        <el-table
                                        :data="ticketData"
                                        >
                                            <el-table-column
                                                prop="name"
                                                label="票类"
                                                width="100"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="价格">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.price}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="addFee"
                                                label="增值服务费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.addFee}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="开售状态">
                                                <template slot-scope="scope">
                                                    <span class="input-con">{{scope.row.switchStatus ? '开售' : '停售'}}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                        <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                                    </div>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>


                        <el-tab-pane label="线上网售" name="second">
                            <el-form
                                label-width="72px">
                                <el-form-item label="适用渠道：">
                                    <div>
                                        <el-table
                                            :data="channelData"
                                            class="edit-cichannel-table">
                                            <el-table-column
                                                prop="name"
                                                label="渠道名称"
                                                width="100">
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="渠道结算票价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.price}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="addFee"
                                                label="增值服务费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.addFee}}</span>
                                                </template>
                                            </el-table-column>
                                            <!-- <el-table-column
                                                prop="netSaleAddPrice"
                                                label="网络代售费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.netSaleAddPrice}}</span>
                                                </template>
                                            </el-table-column> -->
                                            <!-- <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee) + parseFloat(scope.row.netSaleAddPrice)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column> -->
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="开售状态">
                                                <template slot-scope="scope">
                                                    <span class="input-con">{{scope.row.switchStatus ? '开售' : '停售'}}</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                        <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                        <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                                    </div>
                                </el-form-item>
                                
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="竞对票价参考" name="third">
                            <el-form
                                label-width="72px">
                                <div class="pirce-ref-title">线上网售票价对比<span>({{year}}/{{month}}/{{day}})</span></div>
                                <div class="pirce-ref-area">
                                    <div class="table-top-tip">
                                        <div class="table-info-tip"><span class="color-block"></span>最高票价</div>
                                        <div class="table-info-tip"><span class="color-block"></span>最低票价</div>
                                    </div>
                                    <el-table
                                        :default-sort = "{prop: 'avgPrice', order: 'descending'}"
                                        :data="priceContrast"
                                        class="price-ref-table">
                                        <el-table-column
                                            prop="channelName"
                                            fixed="left"
                                            width="150"
                                            :label="movieData.movieName"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            fixed="left"
                                            width="150"
                                            sortable
                                            prop="myPrice"
                                            label="我的影院">
                                            <template slot-scope="scope">
                                                <span :class="scope.row.order == 'low' ? 'low' : scope.row.order == 'top' ? 'top' : '' ">{{Number(scope.row.myPrice).toFixed(2)}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            fixed="left"
                                            width="150"
                                            sortable
                                            prop="avgPrice"
                                            label="竞对平均票价">
                                            <template slot-scope="scope">
                                                <span>{{Number(scope.row.avgPrice).toFixed(2)}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            v-for="(cinema, index) in vieCinemaList" 
                                            :key="cinema.cinemaCode"
                                            :class-name="'cinema-col'"
                                            width="150"
                                            :prop="cinema.cinemaCode"
                                            sortable>
                                            <template slot="header" slot-scope="scope">
                                                <div class="cinema-th">
                                                    <p class="cinema-info" :title="cinema.cinemaName || cinema.cinemaCode">{{cinema.cinemaName || cinema.cinemaCode}}</p>
                                                    <p class="cinema-info">{{cinema.lang}}</p>
                                                    <p class="cinema-info">{{formatDateTime(cinema.startMills * 1000, 2)}} - {{formatDateTime(cinema.endTimeMills * 1000, 2)}}</p>
                                                </div>
                                                    
                                            </template>   
                                            <template slot-scope="scope">
                                                <span :class="scope.row.movieTickets[index].order == 'low' ? 'low' : scope.row.movieTickets[index].order == 'top' ? 'top' : ''">{{Number(scope.row.movieTickets[index].price).toFixed(2)}}</span>
                                            </template>
                                        </el-table-column>

                                    </el-table>
                                    
                                    <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                                    <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                                </div>
                                
                            </el-form>
                        </el-tab-pane>

                    </el-tabs>
                    <div class="table-bottom-menu">
                        <div class="prcie-promise">
                            允许包厢单卖: <span>{{permitSaleBox ? '是' : '否'}}</span>
                        </div>
                        <div class="prcie-promise">
                            允许营销活动折扣、会员折扣: <span>{{permitDiscount ? '是' : '否'}}</span>
                        </div>
                        <div class="prcie-promise">
                           <p>已匹配的价格方案: {{this.movieData.priceProgramName}}</p>
                        </div>
                        <!-- <div class="prcie-promise">
                            <span>渠道代收费</span><em>¥</em><span>0.10</span>
                        </div> -->
                    </div>
                    <div class="table-bottom-menu">
                        <el-form label-width="80px">
                            <el-form-item label="分区定价：">
                                <div class="cinema-stock-scan-text" v-if="this.movieData.useRegionPrice == 1">
                                <span v-for="(item,index) in tableData" :key="index" class="m-r-10">
                                    <span v-if="item.price">{{item.name}} : {{item.price}}元</span>
                                </span>
                                </div>
                                <span class="cinema-stock-scan-text" v-else>否</span>
                            </el-form-item>
                            <el-form-item label="动态调价：">
                                <div class="cinema-stock-scan-text" v-if="this.movieData.useAdjustmentPrice == 1">
                                <span v-for="(item,index) in activeList" :key="index">
                                    <span
                                    v-if="item.occupancyMin||item.occupancyMax"
                                    >{{item.occupancyMin}}% ≤ 上座率 {{fuhao}} {{item.occupancyMax}}%</span>
                                    <span v-if="item.startTime">放映前 {{item.time}} 小时</span>
                                    出票价
                                    <span v-if="item.adjustmentType==1">
                                        <span v-if="item.price >0">+{{item.price}}元</span>
                                        <span v-if="item.price <0">{{item.price}}元</span>
                                    </span>
                                    <span v-if="item.adjustmentType==2">打折 {{item.percentage}}%</span>
                                    <br />
                                </span>
                                </div>
                                <span class="cinema-stock-scan-text" v-else>否</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>   
            </el-collapse-item>

            <!-- 分账信息 -->
            <el-collapse-item
                v-if="isEditMode"
                title="分账信息"
                name="3">
                <div class="basic-info checkout-account">
                    <el-form
                        label-width="100px"
                        :model="ruleForm" 
                        :rules="rules" 
                        ref="checkoutPriceForm">

                        <el-form-item label="最低票价：" prop="price">
                            
                            <div class="separate-accounts-price">
                                <el-input
                                    v-model="ruleForm.price"
                                    @change="toFixed"
                                ></el-input>
                                <span>元</span>
                            </div>
                        </el-form-item>

                        <el-form-item class="other-percent" prop="rate" label-width="110px" label="发行方分账比例：">
                            <div class="separate-accounts-price">
                                <el-input
                                    v-model="ruleForm.rate"
                                ></el-input>
                                <span>%</span>
                            </div>
                        </el-form-item>

                    </el-form>
                </div>
            </el-collapse-item>
            <el-collapse-item
                v-else
                title="分账信息"
                name="3">
                <div class="basic-info checkout-account">
                    <el-form
                        :model="ruleForm" 
                        label-width="100px">
                        <el-form-item label="最低票价：" >
                            <div class="separate-accounts-price">
                                <span>{{ruleForm.price}}</span>
                                <span>元</span>
                            </div>
                        </el-form-item>

                        <el-form-item class="other-percent" label-width="110px" label="发行方分账比例：">
                            <div class="separate-accounts-price">
                                <span>{{ruleForm.rate}}</span>
                                <span>%</span>
                            </div>
                        </el-form-item>

                    </el-form>
                </div>
            </el-collapse-item>
            <!-- 以下为 1期 需求之后 TODO -->

            <!-- 分区价格设置 -->
            <!-- <el-collapse-item
                title="分区加价设置"
                name="4">
                <div class="basic-info zone-add-price">
                    <el-form label-width="72px">
                        <el-form-item label="分区加价：">
                            <el-select
                                v-model="sectionPrice"
                            >
                                <el-option
                                    label="加价1"
                                    value="1"
                                ></el-option>
                                <el-option
                                    label="加价2"
                                    value="2"
                                ></el-option>
                            </el-select>
                            <el-button type="primary" plain>设置加价方案</el-button>
                            <el-input
                                class="input-new-tag"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm"
                                @blur="handleInputConfirm"
                            >
                            </el-input>
							<div>
								<el-button
									type="primary"
									plain
									class="button-new-tag">
									设置加价方案
								</el-button>
							</div>

                            <div class="tags-con">
                                <el-tag closable>贵宾区&nbsp;&nbsp;¥15</el-tag>
                            </div>
                        </el-form-item>
                        <el-form-item label="场次专售作为设置">
                            <p class="item-tip">（仅对以开放的销售渠道生效）</p>
                            <el-radio-group>
								<div class="radio-con">
                                	<el-radio label="应用"></el-radio>
									<el-button
										type="primary"
										plain>
										专卖作为设置
									</el-button>
								</div>
                                <div class="radio-con">
									<el-radio label="不应用"></el-radio>
								</div>
                            </el-radio-group>
                            <el-table
                                :data="tableData2"
                            >
                                <el-table-column
                                    prop="area"
                                    label="区域名称"
                                    width="100"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="seat"
                                    label="座位数"
                                    width="100"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="people"
                                    label="可售消费者"
									width="120"
                                >
                                </el-table-column>
                                <el-table-column
                                    prop="canle"
                                    label="可售渠道"
									width="295"
                                >
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                    </el-form>
                </div>
            </el-collapse-item> -->
            <!-- 上座浮动率调价 -->
            <!-- <el-collapse-item
                title="上座浮动率调价"
                name="5">
                <div class="basic-info float-price">
                    <el-form
                        label-width="72px"
                    >
                        <el-form-item label="调价规则">
							<div style="margin-bottom: 8px;">
                                <div class="dib-l">
                                    <el-input></el-input><span style="margin: 0 12px 0 8px">%</span><span>&le;</span><span style="margin:0 4px;">上座率</span><span style="margin-right: 12px;">&lt;</span>
                                    <el-input></el-input><span style="margin-left: 8px;">%</span>
                                </div>
                                <div class="dib-r">
                                    <span style="margin-right: 8px;">结算价: 加</span>
                                    <el-input></el-input><span style="margin: 0 12px;">元</span><el-button style="vertical-align: middle;">删除</el-button>
                                </div>
                            </div>
							<div style="margin-bottom: 8px;">
                                <div class="dib-l">
                                    <el-input></el-input><span style="margin: 0 12px 0 8px">%</span><span>&le;</span><span style="margin:0 4px;">上座率</span><span style="margin-right: 12px;">&lt;</span>
                                    <el-input></el-input><span style="margin-left: 8px;">%</span>
                                </div>
                                <div class="dib-r">
                                    <span style="margin-right: 8px;">结算价: 加</span>
                                    <el-input></el-input><span style="margin: 0 12px;">元</span><el-button style="vertical-align: middle;">删除</el-button>
                                </div>
                            </div>
                            <div class="add-price-rule"><span><i class="iconfont icon-neiye-tianjia-"></i>添加调价规则</span></div>
                        </el-form-item>
                    </el-form>
                </div>
            </el-collapse-item> -->


        </el-collapse>

        <el-dialog class="import-price-plan-dialog" title="导入价格方案" :visible.sync="pricePlanDialog" @close="closeDialogCb">
            <el-form>
                <el-form-item class="serach-con">
                    <div class="search-wrap">
                        <span>方案名称：</span>
                        <el-input
                            v-model="planName">
                        </el-input>
                    </div>
                    <!-- <div class="search-wrap">
                        <span>发行版本：</span>
                        <el-select
                            v-model="issueTypeValue">
                            <el-option
                                v-for="(item, index) in issueTypeData"
                                :key="index"
                                :value="item.keyCode"
                                :label="item.keyName">
                            </el-option>
                        </el-select>
                    </div> -->
                    <!-- <div class="search-wrap">
                        <span>影厅类型：</span>
                        <el-select
                            v-model="hallTypeValue">
                            <el-option
                                v-for="(item, index) in hallTypeData"
                                :key="index"
                                :value="item.keyCode"
                                :label="item.keyName">
                            </el-option>
                        </el-select>
                    </div> -->
                    <el-button type="primary" icon="el-icon-search" @click="importPricePlan(0, $event)">查询</el-button>
                </el-form-item>

                <el-form-item>
                    <el-table
                        class="edit-cichannel-table"
                         highlight-current-row
                         @current-change="selectedRow"
                        :data="importPlanData">
                        <el-table-column
                            prop="priceProgramName"
                            label="方案名称">
                        </el-table-column>
                        <el-table-column
                            label="适用影院">
                            <template slot-scope="scope">
                                {{scope.row.useRange ? '适用于所有影院' : '适用指定影院'}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="有效期">
                            <template slot-scope="scope">
                                {{scope.row.useDyFg ? '指定日期' : '长期有效'}}
                            </template>
                        </el-table-column>
                            <el-table-column
                            prop="disVersion"
                            label="发行版本">
                        </el-table-column>
                        <el-table-column
                            prop="hallType"
                            label="影厅类型">
                        </el-table-column>
                        <el-table-column
                            width="80"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button @click="toPricePlanDetail(scope.row.uid)" type="text">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="curPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total">
                    </el-pagination>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="pricePlanDialog = false">取 消</el-button>
                <el-button type="primary" @click="selectSinglePlan">确 定</el-button>
            </div>
        </el-dialog>

        

		<div class="bottom-handler-tool" :style="{width: fixedWidth + 'px'}">
			<div class="btn-area" v-if="isEditMode">
				<el-button type="primary" @click="savePlan" :disabled="pd">保存</el-button>
				<el-button @click="cancelHandle">取消</el-button>
			</div>
			<div class="btn-area" v-else>
				<el-button @click="closePage">关闭</el-button>
			</div>

		</div>

        <fixStepTool :stepData="stepData.stepList"></fixStepTool>

    </div>
</template>

<script>
import FixStepTool from "ctmSrc/components/fix-step-tool/fix-step-tool"
import fixStepMixin from "ctmSrc/mixins/fixStepTool"
import { getSchPlanLang, updateMoviePlan1, importPricePlan, hallTypeList, priceprogramScan1, getmoviePlanDetail1, initTimeLine, datePlanList, getRefCinema } from 'ctmSrc/http/interface'
export default {
    data() {

        var validatePrice = (rule, value, callback) => {
           setTimeout(() => {
                if (value <= 0 || value > 999.99 || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
                return callback(new Error('最低票价必须大于0小于1000的数字，且小数位不能超过2位!'))
            } else {
                callback()
            }
           }, 100)
        }
        var validateRate = (rule, value, callback) => {
            if (value < 0 || value > 100 || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
                return callback(new Error('分账比例必须输入范围为0-100,允许2位小数!'))
            } else {
                callback()
            }
        }

        return {
            activ:"",
            active1:"",
            active2:"",
            active:"",
            fuhao:"≤",
            pd:false,
            checkList: [],
            ifCheck: [],
            hidden: "hide",
            tableData: [],
            rulers: 0,
            pricing: 0,
            pricing1: 0,
            activeList: [
              {
                idx: 0,
                occupancyMax: null,
                occupancyMin: null,
                time: null,
                price: null,
                type:0
              }
            ],
            options: [
              {
                value: 0,
                label: "不执行分区定价"
              },
              {
                value: 1,
                label: "执行分区定价"
              }
            ],
            options1: [
              {
                value: 0,
                label: "不执行动态调价"
              },
              {
                value: 1,
                label: "执行动态调价"
              }
            ],
            opt1: [
              {
                value: 0,
                label: "出票价+N元"
              },
              {
                value: 1,
                label: "出票价-N元"
              },
              {
                value: 2,
                label: "出票价打折%"
              }
            ],
            disVersionList2: [
              { idx: 0, label: "上座率动态调价" },
              { idx: 1, label: "开映前多少小时动态调价" }
            ],
            planUid: '',
            referer: '',
            curPlanDate: '',
            nextPlanDate: '',
            year: '',
            month: '',
            day: '',
            planHour: '',
            planMinute: '',
            copyMinute: '',
            cinemaUid: '',
            // 排片时间间隔
            timeInterval: null,
            langValue: '',
            langArr: [],
            startTime: '00',
            sectionPrice: '1',
            isEditMode: true,    // 1. edit 2. view
            // 折叠区域
            activeNames: ["1", "2", "3"],
            activeTab: 'first',
            // stepData 固定格式
            // stepEl: 计算高度的 元素
            // stepList: 定制悬浮层信息
            stepData: {
                stepEl: ".el-collapse-item",
                stepList: [
                    {
                        name: "基础信息",
                        isactive: false
                    },
                    {
                        name: "价格体系",
                        isactive: false
                    },
                    {
                        name: "分账信息",
                        isactive: false
                    }
                ]
            },
            //  电影信息
            movieData: {},
            hallData: null,
            showPlanDate: '',
            showPlanTime: '',
            // {
            //     selectableRange: '9:00:00 - 9:59:59'
            // }
            timeRange: {
                selectableRange: '9:00:00 - 9:59:59'
            },
            // 是否对号入座
            mustRightSeat: '',
            // 允许营销活动折扣、会员折扣
            permitDiscount: '',
            // 是否包厢单卖
            permitSaleBox: '',
            // pricePlanDialog 价格方案导入模态框
            pricePlanDialog: false,
            planName: '',
            hallTypeData: [],
            issueTypeData: [],
            issueTypeValue: '',
            hallTypeCode: '',
            selectPlanData: {
                programUid: '',
                programName: '',
                isShow: false,
                data: []
            },
            // 导入价格方案 分页数据
            curPage: 1,
            pageSize: 10,
            total: 0,
            importPlanData: [],
            // 票类数据
            ticketData: [],
            channelData: [],
            // 渠道选中值
            channelSel: [],
            // 包厢单卖
            checked: true,
            // 允许营销活动折扣, 会员折扣
            checked2: true,
            // movieTypeCheckAll
            movieTypeCheckAll: false,
            // chcekbox 不确定控制器
            isIndeterminate: true,
            //  适用影片版本 checkList
            movieTypeCheckList: [],
            // 适用渠道
            ticketChannelList: [],
            //  beforeLeave 指示器
            leaveFlag: true,
            ruleForm: {
                price: '',
                rate: ''
            },
            // 分账信息 rules
            rules: {
                price: [
                    { validator: validatePrice, trigger: 'blur' }

                ],
                rate: [
                    { validator: validateRate, trigger: 'blur' }
                ]
            },
            // 经对影院 List
            vieCinemaList: [],
            // 竞对票价参考
            priceContrast: [],
            tipBox: {
                width: 0,
                height: 0
            },
            currentRow: null,
            hasNoVieCinema: false,
            fixedWidth: ''
        }
    },
    mixins: [fixStepMixin],
    created() {
      this.getRegionTypeList()
    },
    mounted() {
        this.fixedWidth = document.querySelector('.content-wrapper').offsetWidth
        this.dataInit()
    },
    methods: {
        dateAdd(startDate) {
            startDate =  startDate.slice(0,10)
            startDate = new Date(startDate);
            startDate = +startDate - 1000*60*60*24;
            startDate = new Date(startDate);
            var startMonth = startDate.getMonth()+1;
            if(startMonth<10){
            startMonth = '0'+startMonth
            }
            var startDay = startDate.getDate();
            if(startDay<10){
            startDay = '0'+startDay
            }
            var nextStartDate = startDate.getFullYear()+"-"+startMonth+"-"+startDay;
            return nextStartDate;
        },
        priceChange1(val, index) {
            let newVal = parseFloat(val);
            if (newVal < 0) {
                this.ticketData[index].price = this.ruleForm.price;
                this.$message({
                    message: "不得小于0",
                    type: "warning"
                });
            }
            if (newVal > 999.99) {
                this.ticketData[index].price = this.ruleForm.price;
                this.$message({
                    message: "不得高于999.99",
                    type: "warning"
                });
            }
            if(this.pricing== 1 && this.pricing1==1){
                var a = true;
                this.activeList.forEach(item =>{
                    this.tableData.forEach(i =>{
                        if(a){
                            if(i.price != null){
                                if(item.type == 0){
                                    var p =val*1 + item.price*1+i.price*1;
                                    if(p<this.ruleForm.price){
                                        this.ticketData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得小于最低票价",
                                            type: "warning"
                                        });
                                        a =false;
                                    }else if (p>999.99){
                                        this.ticketData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得高于999.99",
                                            type: "warning"
                                        });
                                        a=false;
                                    }else if(p<=999.99&&p>=this.ruleForm.price){
                                        this.ticketData[index].price = newVal.toFixed(2);
                                    }
                                }else if(item.type == 0){
                                    var p =val*1 + item.price*1+i.price*-1;
                                    if(p<this.ruleForm.price){
                                        this.ticketData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得小于最低票价",
                                            type: "warning"
                                        });
                                        a =false;
                                    }else if (p>999.99){
                                        this.ticketData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得高于999.99",
                                            type: "warning"
                                        });
                                        a=false;
                                    }else if(p<=999.99&&p>=this.ruleForm.price){
                                        this.ticketData[index].price = newVal.toFixed(2);
                                    }
                                }
                            }
                        }
                    })
                })
            }else if(this.pricing==1){
                this.tableData.forEach(item =>{
                    if(item.price != null){
                        var p = val*1 + item.price*1;
                        if(p<this.ruleForm.price){
                            this.ticketData[index].price = this.ruleForm.price;
                            this.$message({
                                message: "总和不得小于最低票价",
                                type: "warning"
                            });
                        }else if(p>999.99){
                            this.ticketData[index].price = this.ruleForm.price;
                            this.$message({
                                message: "总和不得高于999.99",
                                type: "warning"
                            });
                        }else if(p<=999.99&&p>=this.ruleForm.price){
                            this.ticketData[index].price = newVal.toFixed(2);
                        }
                    }
                })
            }else if(this.pricing1==1){
                var a = true;
                this.activeList.forEach(item =>{
                    if(item.type == 0){
                        if(a){
                            var p = val*1 + item.price*1;
                            if(p <this.ruleForm.price){
                                this.ticketData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                });
                                a =false;
                            }else if (p>999.99) {
                                this.ticketData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得高于999.99",
                                    type: "warning"
                                });
                                a=false;
                            }else if(p<=999.99&&p>=this.ruleForm.price){
                                this.ticketData[index].price = newVal.toFixed(2);
                            }
                        }
                    }else if(item.type == 1){
                        if(a){
                            var p = val*1 + item.price*-1;
                            if(p <this.ruleForm.price){
                                this.ticketData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                });
                                a =false;
                            }else if (p>999.99) {
                                this.ticketData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得高于999.99",
                                    type: "warning"
                                });
                                a=false;
                            }else if(p<=999.99&&p>=this.ruleForm.price){
                                this.ticketData[index].price = newVal.toFixed(2);
                            }
                        }
                    }
                })
            }else{
                if(val*1<this.ruleForm.price){
                    this.ticketData[index].price = this.ruleForm.price;
                    this.$message({
                        message: "票价不得小于最低票价",
                        type: "warning"
                    });
                }else{
                    this.ticketData[index].price = newVal.toFixed(2);
                }
            }
        },
        priceChange2(val, index) {
            let newVal = parseFloat(val);
            if (newVal < 0) {
                this.channelData[index].price = this.ruleForm.price;
                this.$message({
                    message: "不得小于0",
                    type: "warning"
                });
            }
            if (newVal > 999.99) {
                this.channelData[index].price = this.ruleForm.price;
                this.$message({
                    message: "不得高于999.99",
                    type: "warning"
                });
            }
            if(this.pricing==1 && this.pricing1==1){
                var a = true;
                this.activeList.forEach(item =>{
                    this.tableData.forEach(i =>{
                        if(a){
                            if(i.price != null){
                                if(item.type == 0){
                                    var p =val*1 + item.price*1+i.price*1;
                                    if(p<this.ruleForm.price){
                                        this.channelData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得小于最低票价",
                                            type: "warning"
                                        });
                                        a =false;
                                    }else if (p>999.99){
                                        this.channelData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得高于999.99",
                                            type: "warning"
                                        });
                                        a=false;
                                    }else if(p<=999.99&&p>=this.ruleForm.price){
                                        this.channelData[index].price = newVal.toFixed(2);
                                    }
                                }else if(item.type == 0){
                                    var p =val*1 + item.price*1+i.price*-1;
                                    if(p<this.ruleForm.price){
                                        this.channelData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得小于最低票价",
                                            type: "warning"
                                        });
                                        a =false;
                                    }else if (p>999.99){
                                        this.channelData[index].price = this.ruleForm.price;
                                        this.$message({
                                            message: "总和不得高于999.99",
                                            type: "warning"
                                        });
                                        a=false;
                                    }else if(p<=999.99&&p>=this.ruleForm.price){
                                        this.channelData[index].price = newVal.toFixed(2);
                                    }
                                }
                            }
                        }
                    })
                })
            }else if(this.pricing==1){
                this.tableData.forEach(item =>{
                    if(item.price != null){
                        var p = val*1 + item.price*1;
                        if(p<this.ruleForm.price){
                            this.channelData[index].price = this.ruleForm.price;
                            this.$message({
                                message: "总和不得小于最低票价",
                                type: "warning"
                            });
                        }else if(p>999.99){
                            this.channelData[index].price = this.ruleForm.price;
                            this.$message({
                                message: "总和不得高于999.99",
                                type: "warning"
                            });
                        }else if(p<=999.99&&p>=this.ruleForm.price){
                            this.channelData[index].price = newVal.toFixed(2);
                        }
                    }
                })
            }else if(this.pricing1==1){
                var a = true;
                this.activeList.forEach(item =>{
                    if(item.type == 0){
                        if(a){
                            var p = val*1 + item.price*1;
                            if(p <this.ruleForm.price){
                                this.channelData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                });
                                a =false;
                            }else if (p>999.99) {
                                this.channelData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得高于999.99",
                                    type: "warning"
                                });
                                a=false;
                            }else if(p<=999.99&&p>=this.ruleForm.price){
                                this.channelData[index].price = newVal.toFixed(2);
                            }
                        }
                    }else if(item.type == 1){
                        if(a){
                            var p = val*1 + item.price*-1;
                            if(p <this.ruleForm.price){
                                this.channelData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                });
                                a =false;
                            }else if (p>999.99) {
                                this.channelData[index].price = this.ruleForm.price;
                                this.$message({
                                    message: "总和不得高于999.99",
                                    type: "warning"
                                });
                                a=false;
                            }else if(p<=999.99&&p>=this.ruleForm.price){
                                this.channelData[index].price = newVal.toFixed(2);
                            }
                        }
                    }
                })
            }else{
                if(val*1<this.ruleForm.price){
                    this.channelData[index].price = this.ruleForm.price;
                    this.$message({
                        message: "票价不得小于最低票价",
                        type: "warning"
                    });
                }else{
                    this.channelData[index].price = newVal.toFixed(2);
                }
            }
        },
        del(idx) {
          this.$delete(this.disVersionList1, idx);
        },
        delRuler(idx) {
          if(this.activeList.length>1){
              this.$delete(this.activeList, idx);
          }
          this.active =''
          this.active1=''
          this.activ=''
          this.active2=''
          if(this.activeList.length==1){
            this.fuhao = '≤'
          }else{
            this.fuhao = '＜'
          }
        },
        add() {
          var a = this.disVersionList1.length;
          var b = a + 1;
          this.$set(this.disVersionList1, a, {
            idx: a,
            label: "第" + b + "周"
          });
        },
        addRuler() {
            var a = this.activeList.length ? this.activeList.length : 0;
            var x = true;
            if(this.ifCheck[0]==0){
                if(this.activeList[a*1-1].occupancyMin == null){
                    this.activ = a*1-1
                    if(a*1-1==0){
                        this.activ = '0'
                    }
                    x = false
                }
                if(this.activeList[a*1-1].occupancyMax == null){
                    this.active = a*1-1
                    if(a*1-1==0){
                        this.active = '0'
                    }
                    x= false
                }
            }
            if(this.ifCheck[0]==1||this.ifCheck[1]==1){
                if(this.activeList[a*1-1].time == null){
                    this.active2 = a*1-1
                    if(a*1-1==0){
                        this.active2 = '0'
                    }
                    x= false
                }
            }
            if(this.activeList[a*1-1].price == null){
                this.active1 = a*1-1
                if(a*1-1==0){
                    this.active1 = '0'
                }
                x= false
            }
            if(x){
                this.$set(this.activeList, a, {
                idx: a,
                occupancyMax: null,
                occupancyMin: a!=0?this.activeList[a*1-1].occupancyMax:null,
                type:0,
                time: null
                });
            }
          if(this.activeList.length==1){
            this.fuhao = '≤'
          }else{
            this.fuhao = '＜'
          }
        },
        checklist(value) {
          let channelArr = [];
          let resulValue = value;
          this.disVersionList2.forEach((item, index) => {
            resulValue.forEach((value, i) => {
              if (item.idx == value) {
                channelArr.push(item.idx);
              }
            });
          });
          this.ifCheck = channelArr;
        },
        //调价规则输入信息转换 且不可为0
        changeNumer(val, idx) {
          if(this.activeList[idx].occupancyMax){
            if(val*1 > this.activeList[idx].occupancyMax*1){
                this.activeList[idx].occupancyMin = null;
                this.$message({
                message: "最小上座率需小于最大上座率",
                type: "warning"
                });
                return;
            }
          }
          let newVal = parseFloat(val);
          if (newVal < 0) {
            this.activeList[idx].occupancyMin = null;
            return;
          }
          this.activeList[idx].occupancyMin = newVal.toFixed(1);
        },
        changeNumer1(val, idx) {
            if(this.activeList[idx].occupancyMin){
                if(val*1 <= this.activeList[idx].occupancyMin*1){
                    this.activeList[idx].occupancyMax = null;
                    this.$message({
                        message: "最大上座率需大于最小上座率",
                        type: "warning"
                    });
                    if(this.activeList[idx*1+1]){
                        this.activeList[idx*1+1].occupancyMin =null
                    }
                    return;
                }
            }
            let newVal = parseFloat(val);
            if (newVal < 0) {
                this.activeList[idx].occupancyMax = null;
                this.$message({
                message: "不得小于0",
                type: "warning"
                });
                if(this.activeList[idx*1+1]){
                this.activeList[idx*1+1].occupancyMin =null
                }
                return;
            }
            if(this.activeList[idx*1+1]){
                this.activeList[idx*1+1].occupancyMin = newVal.toFixed(1);
                if(this.activeList[idx*1+1].occupancyMin>=this.activeList[idx*1+1].occupancyMax){
                this.activeList[idx*1+1].occupancyMax =null
                }
            }
            this.active=''
            this.activeList[idx].occupancyMax = newVal.toFixed(1);
        },
        changeNumer2(val, idx) {
            let newVal = parseFloat(val);
            if (newVal < 0) {
                this.activeList[idx].price = null;
                this.$message({
                message: "不得小于0",
                type: "warning"
                });
                return;
            }else if(newVal > 999.99){
                this.activeList[idx].price = null;
                this.$message({
                message: "不得高于999.99",
                type: "warning"
                });
                return;
            }
            if(this.ticketData.length>0){
                var z = true;
                this.ticketData.forEach(item =>{
                    if(item.switchStatus){
                        if(this.pricing==1){
                            var a = true;
                            this.tableData.forEach(i =>{
                                if(a){
                                    if(this.activeList[idx].type==0){
                                        var p = val*1 + item.price*1 +i.price*1;
                                        if(p<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得小于最低票价",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }
                                        if(p >999.99){
                                            this.$message({
                                                message: "总和不得超过999.99",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }else if(this.ruleForm.price<=p&&p<=999.99){
                                            this.activeList[idx].price = newVal.toFixed(2);
                                            this.active1=''
                                        }
                                    }else if(this.activeList[idx].type==1){
                                        var p = val*-1 + item.price*1 +i.price*1;
                                        if(p<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得小于最低票价",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }
                                        if(p >999.99){
                                            this.$message({
                                                message: "总和不得超过999.99",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }else if(p>=this.ruleForm.price&&p<=999.99){
                                            this.activeList[idx].price = newVal.toFixed(2);
                                            this.active1=''
                                        }
                                    }
                                }
                            })
                        }else if(this.activeList[idx].type==0){
                            var p = val*1 + item.price*1 ;
                            if(p <this.ruleForm.price){
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }
                            if(p >999.99){
                                this.$message({
                                    message: "总和不得超过999.99",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }else if(p>=this.ruleForm.price&&p<=999.99){
                                z =false;
                                this.activeList[idx].price = newVal.toFixed(2);
                                this.active1=''
                            }
                        }else if(this.activeList[idx].type==1){
                            var p = val*-1 + item.price*1 
                            if(p <this.ruleForm.price){
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }
                            if(p >999.99){
                                this.$message({
                                    message: "总和不得超过999.99",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }else if(p<=999.99&&p>=this.ruleForm.price){
                                console.log(1)
                                this.activeList[idx].price = newVal.toFixed(2);
                                this.active1=''
                            }
                        }else{
                            this.activeList[idx].price = newVal.toFixed(2);
                            this.active1=''
                        }
                    }
                })
            }else{
                this.activeList[idx].price = newVal.toFixed(2);
                this.active1=''
            }
            if(this.channelData.length>0){
                var z = true;
                this.channelData.forEach(item =>{
                    if(item.switchStatus){
                        if(this.pricing==1){
                            var a = true;
                            this.tableData.forEach(i =>{
                                if(a){
                                    if(this.activeList[idx].type==0){
                                        var p = val*1 + item.price*1 +i.price*1;
                                        if(p<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得小于最低票价",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }
                                        if(p >999.99){
                                            this.$message({
                                                message: "总和不得超过999.99",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }else if(this.ruleForm.price<=p&&p<=999.99){
                                            this.activeList[idx].price = newVal.toFixed(2);
                                            this.active1=''
                                        }
                                    }else if(this.activeList[idx].type==1){
                                        var p = val*-1 + item.price*1 +i.price*1;
                                        if(p<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得小于最低票价",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }
                                        if(p >999.99){
                                            this.$message({
                                                message: "总和不得超过999.99",
                                                type: "warning"
                                            })
                                            a =false;
                                            z =false;
                                            this.activeList[idx].price = null;
                                        }else if(p>=this.ruleForm.price&&p<=999.99){
                                            this.activeList[idx].price = newVal.toFixed(2);
                                            this.active1=''
                                        }
                                    }
                                }
                            })
                        }else if(this.activeList[idx].type==0){
                            var p = val*1 + item.price*1 ;
                            if(p <this.ruleForm.price){
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }
                            if(p >999.99){
                                this.$message({
                                    message: "总和不得超过999.99",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }else if(p>=this.ruleForm.price&&p<=999.99){
                                z =false;
                                this.activeList[idx].price = newVal.toFixed(2);
                                this.active1=''
                            }
                        }else if(this.activeList[idx].type==1){
                            var p = val*-1 + item.price*1 
                            if(p <this.ruleForm.price){
                                this.$message({
                                    message: "总和不得小于最低票价",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }
                            if(p >999.99){
                                this.$message({
                                    message: "总和不得超过999.99",
                                    type: "warning"
                                })
                                z =false;
                                this.activeList[idx].price = null;
                            }else if(p<=999.99&&p>=this.ruleForm.price){
                                console.log(1)
                                this.activeList[idx].price = newVal.toFixed(2);
                                this.active1=''
                            }
                        }else{
                            this.activeList[idx].price = newVal.toFixed(2);
                            this.active1=''
                        }
                    }
                })
            }else{
                this.activeList[idx].price = newVal.toFixed(2);
                this.active1=''
            }
        },
        changeTime(val, idx) {
          let newVal = parseFloat(val);
          if (newVal < 0) {
            this.activeList[idx].time = null;
            return;
          }
          this.active2=''
          this.activeList[idx].time = newVal.toFixed(1);
        },
        dynamicPrice(val) {
          this.pricing1 =val;
          if (val == 1) {
            this.hidde = "show";
          } else if (val == 0) {
            this.hidde = "hide";
            this.activeList= [
              {
                idx: 0,
                occupancyMax: null,
                occupancyMin: null,
                time: null,
                price: null,
                type:0
              }
            ]
          }
        },
        zoningPricing(val) {
          if (val == 1) {
            this.hidden = "show";
            this.pricing = val;
          } else if (val == 0) {
            this.hidden = "hide";
            this.pricing = val;
          }
        },
        getRegionTypeList() {
          this.$ctmList
            .getRegionTypeList()
            .then(ret => {
              if (ret.code == 200) {
                this.tableData = ret.data;
                this.tableData.forEach(item => {
                  this.$set(item, "price", 0);
                  this.$set(item,'regionTypeUid',item.uid)
                  this.$delete(item,'uid')
                });
              }
            })
            .catch(() => {
              console.log("哪里出错了，检擦一下哥哥");
            });
        },
        priceChang(val, index) {
            let newVal = parseFloat(val);
            if(val >= 999.99){
                this.$message({
                message: "最高不得超过999.99",
                type: "warning"
                });
                this.tableData[index].price = 0;
            }
            if(this.ticketData.length>0){
                this.ticketData.forEach(item =>{
                    if(item.switchStatus){
                        if(this.pricing1==1){
                            this.activeList.forEach(i =>{
                                if(i.price != null){
                                    if(i.type == 0){
                                        if(i.price*1 +item.price*1 + val*1> 999.99){
                                            this.$message({
                                                message: "最高不得超过999.99",
                                                type: "warning"
                                            });
                                            this.tableData[index].price = 0;
                                        }else if(i.price*1 +item.price*1 + val*1<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得低于最低票价",
                                                type: "warning"
                                            });
                                            this.tableData[index].price = 0;
                                        }else{
                                            this.tableData[index].price = newVal.toFixed(2);
                                        }
                                    }else if(i.type == 1){
                                        if(i.price*-1 +item.price*1 + val*1<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得低于最低票价",
                                                type: "warning"
                                            });
                                            this.tableData[index].price = 0;
                                        }
                                    }else{
                                        this.tableData[index].price = newVal.toFixed(2);
                                    }
                                }
                            })
                        }else if(item.price*1 + val*1 > 999.99){
                            this.$message({
                                message: "最高不得超过999.99",
                                type: "warning"
                            });
                            this.tableData[index].price = 0;
                        }else if(item.price*1 + val*1 <this.ruleForm.price){
                            this.$message({
                                message: "总和不得低于最低票价",
                                type: "warning"
                            });
                            this.tableData[index].price = 0;
                        }else{
                            this.tableData[index].price = newVal.toFixed(2);
                        }
                    }
                })
            }else{
                this.tableData[index].price = newVal.toFixed(2);
            }
            if(this.channelData.length>0){
                this.channelData.forEach(item =>{
                    if(item.switchStatus){
                        if(this.pricing1==1){
                            this.activeList.forEach(i =>{
                                if(i.price != null){
                                    if(i.type == 0){
                                        if(i.price*1 +item.price*1 + val*1> 999.99){
                                            this.$message({
                                                message: "最高不得超过999.99",
                                                type: "warning"
                                            });
                                            this.tableData[index].price = 0;
                                        }else if(i.price*1 +item.price*1 + val*1<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得低于最低票价",
                                                type: "warning"
                                            });
                                            this.tableData[index].price = 0;
                                        }else{
                                            this.tableData[index].price = newVal.toFixed(2);
                                        }
                                    }else if(i.type == 1){
                                        if(i.price*-1 +item.price*1 + val*1<this.ruleForm.price){
                                            this.$message({
                                                message: "总和不得低于最低票价",
                                                type: "warning"
                                            });
                                            this.tableData[index].price = 0;
                                        }
                                    }else{
                                        this.tableData[index].price = newVal.toFixed(2);
                                    }
                                }
                            })
                        }else if(item.price*1 + val*1 > 999.99){
                            this.$message({
                                message: "最高不得超过999.99",
                                type: "warning"
                            });
                            this.tableData[index].price = 0;
                        }else if(item.price*1 + val*1 <this.ruleForm.price){
                            this.$message({
                                message: "总和不得低于最低票价",
                                type: "warning"
                            });
                            this.tableData[index].price = 0;
                        }else{
                            this.tableData[index].price = newVal.toFixed(2);
                        }
                    }
                })
            }else{
                this.tableData[index].price = newVal.toFixed(2);
            }
        },
        dataInit() {
            this.isEditMode = this.$route.query.mode ? this.$route.query.mode == 'edit' ? true : false : false
            this.planUid = this.$route.query.uid ? this.$route.query.uid : ''
            this.referer = this.$route.query.referer ? decodeURIComponent(this.$route.query.referer) : ''
            
            this.getmoviePlanDetail()
        },
        getPlanList() {
            datePlanList({
                planDate: `${this.year}-${this.month}-${this.day}`,
                cinemaUid: this.movieData.cinemaUid
            }).then(res => {
                if (res.code != 200) return this.error(res.msg)
                let hallData = res.data.filter(item => item.hallUid == this.movieData.hallUid && item.planUid != this.planUid)
                hallData.forEach(item => {
                    item.showTimeStart = item.startTime.split(':')[0] < 6 ? `${this.nextPlanDate} ${item.startTime}` : `${this.curPlanDate} ${item.startTime}`
                    item.showTimeEnd = item.endTime.split(':')[0] < 6 ? `${this.nextPlanDate} ${item.endTime}` : `${this.curPlanDate} ${item.endTime}`
                })
                this.hallData = hallData
            })
        },
        getmoviePlanDetail() {
            getmoviePlanDetail1({
                'planUid': this.planUid
            }).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.code == 200 && res.data) {
                    this.pricing = res.data.useRegionPrice;
                    this.pricing1 = res.data.useAdjustmentPrice;
                    if (res.data.priceAdjustmentList.length>0) {
                        if (
                            res.data.priceAdjustmentList[0].useOccupancyFlag == 1 &&
                            res.data.priceAdjustmentList[0].useStartTimeFlag == 0
                        ) {
                            this.ifCheck = ["0"];
                            this.checkList = [0];
                        } else if (
                            res.data.priceAdjustmentList[0].useStartTimeFlag == 1 &&
                            res.data.priceAdjustmentList[0].useOccupancyFlag == 0
                        ) {
                            this.ifCheck = ["1"];
                            this.checkList = [1];
                        } else if (
                            res.data.priceAdjustmentList[0].useOccupancyFlag == 1 &&
                            res.data.priceAdjustmentList[0].useStartTimeFlag == 1
                        ) {
                            this.ifCheck = ["0", "1"];
                            this.checkList = [0, 1];
                        }
                        this.activeList = res.data.priceAdjustmentList;
                        if(this.activeList.length==1){
                            this.fuhao = '≤'
                        }else{
                            this.fuhao = '＜'
                        }
                        this.activeList.forEach(item => {
                            if (item.adjustmentType == 1) {
                                if (item.price > 0) {
                                    this.$set(item,'type',0)
                                } else if (item.price < 0) {
                                    this.$set(item,'type',1)
                                    this.$set(item,'price',item.price*-1)
                                }
                            } else if (item.adjustmentType == 2) {
                                this.$set(item,'type',2)
                            }
                            if (item.percentage != null) {
                                this.$set(item, "price", item.percentage);
                            }
                            if (item.price != null) {
                                this.$set(item, "price", item.price);
                                item.price = item.price.toFixed(2)
                            }
                            if(item.occupancyMin || item.occupancyMin==0){
                                item.occupancyMin = item.occupancyMin.toFixed(1)
                            }
                            if(item.occupancyMax){
                                item.occupancyMax = item.occupancyMax.toFixed(1)
                            }
                            if(item.time){
                                item.time = item.time.toFixed(1)
                            }
                        });
                    }
                    if(res.data.priceRegionList.length>0){
                        this.pricing=1; 
                        var data = res.data.priceRegionList;
                        console.log(data)
                        this.tableData.forEach(item=>{
                            data.forEach(i=>{
                                if(item.regionTypeUid == i.regionTypeUid){
                                    this.$set(i,'color',item.color);
                                    this.$set(i,'name',item.name);
                                    if(i.price){
                                        var a = i.price.toFixed(2)
                                    }
                                    this.$set(i,'price',a||0);
                                }
                            })
                        })
                        this.tableData = data;
                    }
                    let {dateShowFirst, dateShowOff, disVersion, hallName, minPrice, movieLanguage, movieName, mustRightSeat, planTime, priceProgramName, publisherRate, timeLong, approveStatus, permitDiscount, permitSaleBox, movieUid, cinemaUid, hallUid, joinFlag, movieCode, priceProgramUid, planTimeEnd, hallTypeCode, disVersionCode, saleStatus, soldSeatCount, planInfoMovieTimeVoList, useAdjustmentPrice, useRegionPrice, priceAdjustmentList, priceRegionList} = res.data
                    this.movieData = {dateShowFirst, dateShowOff, disVersion, hallName, minPrice, movieLanguage, movieName, mustRightSeat, planTime, priceProgramName, publisherRate, timeLong, approveStatus, permitDiscount, permitSaleBox, movieUid, priceProgramUid, planTimeEnd, cinemaUid, hallUid, joinFlag, movieCode, hallTypeCode, disVersionCode, saleStatus, soldSeatCount, planInfoMovieTimeVoList, useAdjustmentPrice, useRegionPrice, priceAdjustmentList, priceRegionList}
                    // console.log(this.tableData)
                    this.notAllowChangeTime = (soldSeatCount != 0)
                    
                    // hallTypeList({name: 'SCH_MOVIE_DIS_VERSION'}).then(res => {
                    //     if (res.code == 200 && res.data) {
                    //         res.data.unshift({keyCode: '', keyName: '全部'})
                    //         this.issueTypeData = res.data
                    //         this.issueTypeValue = this.movieData.disVersionCode
                    //     } else {
                    //         this.error(res.msg)
                    //     }
                    // })
                    getRefCinema({
                        cinemaUid: this.movieData.cinemaUid
                    }).then(result => {
                        if (result.code != 200) return this.error(result.msg)
                        if (result.code == 200 && result.data) {
                            if (!result.data.length) {
                                this.hasNoVieCinema = true
                            }
                        }
                    
                    })
                    this.year = planTime.includes('T') ? planTime.split('T')[0].split('-')[0] : planTime.split(' ')[0].split('-')[0]
                    this.month = planTime.includes('T') ? planTime.split('T')[0].split('-')[1] : planTime.split(' ')[0].split('-')[1]
                    this.day = planTime.includes('T') ? planTime.split('T')[0].split('-')[2] : planTime.split(' ')[0].split('-')[2]
                    this.planHour = planTime.includes('T') ? planTime.split('T')[1].split(':')[0] : planTime.split(' ')[1].split(':')[0]
                    this.curPlanDate = this.planHour < 6 ? this.dateAdd(planTime) : this.formatDateTime(new Date(planTime).getTime(), 1)
                    this.nextPlanDate = this.formatDateTime(new Date(this.curPlanDate).getTime() + 1000 * 24 * 60 * 60, 1)
                    this.planMinute = planTime.includes('T') ? planTime.split('T')[1].split(':')[1] : planTime.split(' ')[1].split(':')[1]
                    this.copyMinute = this.planMinute

                    this.mustRightSeat = !!mustRightSeat
                    this.permitDiscount = !!permitDiscount
                    this.permitSaleBox = !!permitSaleBox
                    this.getTimeLine()
                    this.getPlanList()
                    // this.playTime = `${planTime.split(' ')[1].split(':')[0]}${planTime.split(' ')[1].split(':')[1]}00`
                    // this.copyPlayTime = this.playTime
                    // this.timeRange.selectableRange = `${planTime.split(' ')[1].split(':')[0]}:00:00 - ${planTime.split(' ')[1].split(':')[0]}:59:59`
                    this.showPlanDate = this.isEditMode ? `${this.year}年${this.month}月${this.day}日${this.planHour}时` : `${this.year}年${this.month}月${this.day}日${this.planHour}时${this.planMinute}分`
                    this.mustRightSeat = mustRightSeat ? true : false
                    this.getSchPlanLang({movieUid: this.movieData.movieUid})
                    this.ruleForm.price = minPrice
                    this.ruleForm.rate = publisherRate
                    this.hallTypeCode = hallTypeCode
                    // if (this.isEditMode) {
                        let relatedArr = [], concatArr = []
                        res.data.ticketList.forEach(item => {
                            if (res.data.baseTicketList.every(citem => citem.uid != item.uidBaseClass)) {
                                concatArr.push(item)
                            } else {
                                relatedArr.push(item)
                            }
                        })
                        concatArr.forEach(item => {
                            item.baseFlag = 1
                            item.switchStatus = item.saleStatus == 'SALE'
                        })
                        let ticketData = JSON.parse(JSON.stringify(res.data.baseTicketList)).concat(concatArr)
                        ticketData.forEach((item,index) => {
                            relatedArr.some(citem => {
                                if (citem.uidBaseClass == item.uid) {
                                    item.price = citem.price
                                    if(citem.price*1<this.ruleForm.price*1){
                                        item.price = this.ruleForm.price
                                    }
                                    item.addFee = citem.addFee
                                    item.switchStatus = citem.saleStatus == 'SALE'
                                    return true
                                }
                            })
                            if (!item.addFee) item.addFee = 0
                            // if(!this.isEditMode){
                            //     if (!item.price) item.price = 0
                            // }else{
                            //     if (!item.price){
                            //         item.price = this.ruleForm.price
                            //         if(index>1){
                            //             item.baseFlag=1
                            //         }
                            //     } 
                            // }
                            // console.log(item)
                            if(this.isEditMode){
                                if (!item.price||item.price*1==0){
                                    item.price = this.ruleForm.price
                                } 
                                if(item.baseFlag == null){
                                    item.baseFlag=1
                                }
                            }
                            if (!item.price) item.price = 0
                            // console.log(item)
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.price = parseFloat(item.price).toFixed(2)
                            if (!item.name) item.name = item.ticketName
                            if (!item.switchStatus) {
                                item.switchStatus = item.baseFlag == 0
                            }
                            // 避免 提交的时候 uid 出错  
                            // 原因为 ticketList 里 可能出现 base 里不存在的 票类
                            item.saveUid = item.uid ? item.uid : item.uidBaseClass
                        })
                        if (!this.isEditMode) ticketData = ticketData.filter(item => item.price != 0)

                        this.ticketData = ticketData
                        let relatedChannelArr = [], concatChannelArr = []
                        res.data.channelList.forEach(item => {
                            if (res.data.baseChannelList.every(citem => citem.uid != item.uidChannel)) {
                                concatChannelArr.push(item)
                            } else {
                                relatedChannelArr.push(item)
                            }
                        })
                        let channelData = JSON.parse(JSON.stringify(res.data.baseChannelList)).concat(concatChannelArr.map(item => {
                            item.switchStatus = item.saleStatus == 'SALE'
                            return item
                        }))
                        channelData.forEach(item => {
                            relatedChannelArr.some(citem => {
                                if (citem.uidChannel == item.uid) {
                                    item.addFee = citem.addFee
                                    item.price = citem.price
                                    if(citem.price*1<this.ruleForm.price*1){
                                        item.price = this.ruleForm.price
                                    }
                                    item.cinemaFee = citem.cinemaFee
                                    item.feeFg = citem.feeFg
                                    item.switchStatus = citem.saleStatus == 'SALE'
                                    return true
                                }
                            })
                            if(this.isEditMode){
                                if (!item.price||item.price*1==0){
                                    item.price = this.ruleForm.price
                                } 
                                if(item.baseFlag == null){
                                    item.baseFlag=1
                                }
                            }
                            // if(!this.isEditMode){
                            //     if (!item.price) item.price = 0
                            // }else{
                            //     if (!item.price) item.price = this.ruleForm.price
                            // }
                            if (!item.price) item.price = 0
                            if (!item.addFee) item.addFee = 0
                            if (!item.cinemaFee) item.cinemaFee = 0
                            if (!item.feeFg) item.feeFg = 0
                            if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                            item.price = parseFloat(item.price).toFixed(2)
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                            item.cinemaFee = parseFloat(item.cinemaFee).toFixed(2)
                            if (!item.name) item.name = item.channelName
                            if (!item.switchStatus) {
                                item.switchStatus = false
                            }
                            // 避免 提交的时候 uid 出错  
                            // 原因为 channelList 里 可能出现 base 里不存在的 票类
                            item.saveUid = item.uidChannel ? item.uidChannel : item.uid
                        })
                        if (!this.isEditMode) channelData = channelData.filter(item => item.price != 0)
                        this.channelData = channelData
                        
                    // } else {






                        // res.data.ticketList.forEach(item => {
                        //     item.addFee = parseFloat(item.addFee).toFixed(2)
                        //     item.price = parseFloat(item.price).toFixed(2)
                        // })
                        // this.ticketData = res.data.ticketList
                        // res.data.channelList.forEach(item => {
                        //     if (!item.price) item.price = 0
                        //     if (!item.addFee) item.addFee = 0
                        //     if (!item.cinemaFee) item.cinemaFee = 0
                        //     if (!item.feeFg) item.feeFg = 0
                        //     if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                        //     item.price = parseFloat(item.price).toFixed(2)
                        //     item.addFee = parseFloat(item.addFee).toFixed(2)
                        //     item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                        //     item.cinemaFee = parseFloat(item.cinemaFee).toFixed(2)
                        // })
                        // this.channelData = res.data.channelList
                    // }
                    // 票价参考

                    this.vieCinemaList = res.data.nearestMovieList.length ? res.data.nearestMovieList[0].movieTickets : []
                    if (!res.data.nearestMovieList || !res.data.nearestMovieList.length) {
                        res.data.nearestMovieList = [{
                            avgPrice: 0,
                            channelCode: "maoyan_movie_schedule",
                            channelName: "猫眼",
                            ctmChannelCode: "MTUSER", 
                            movieTickets: []
                        }, {
                            avgPrice: 0,
                            channelCode: "nuomi_movie_schedule",
                            channelName: "糯米",
                            ctmChannelCode: "BDUSER",
                            movieTickets: []
                        }]
                    }
                    res.data.nearestMovieList.forEach(item => {
                         this.channelData.some(channel => {
                             // 如果渠道开售状态为停售 我的影院也显示为0
                            if (channel.saveUid == item.ctmChannelCode && channel.switchStatus) {
                                item.myPrice = channel.price
                                return true
                            }   
                            
                         })
                         if (!item.myPrice) item.myPrice = 0.00
                     })
                    res.data.nearestMovieList.forEach(item => {
                        
                        let arr = []
                        arr.push(item.myPrice)
                        item.movieTickets.forEach(item => {
                            arr.push(item.price)
                        })
                        arr.sort((a,b) => { return a-b })
                        if (arr.length > 1) {
                            if (item.myPrice == arr[0]) {
                                item.order = 'low'
                            } else if (item.myPrice == arr[arr.length - 1]) {
                                item.order = 'top'
                            }
                            item.movieTickets.forEach(item => {
                                if (item.price == arr[0]) {
                                    item.order = 'low'
                                } else if (item.price == arr[arr.length - 1]) {
                                    item.order = 'top'
                                }
                            })
                        }
                    })
                    this.priceContrast = res.data.nearestMovieList
                    if (!this.priceContrast.lenth) {

                    }
                    
                        
                
                }
            })
        },
        // 获取时间间隔
        getTimeLine() {
            initTimeLine({
                'uidCinema': this.movieData.cinemaUid
            }).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.code == 200 && res.data) {
                    this.timeInterval = res.data.timeInterval
                    // this.timeFlag = true
                }
            })
        },
        getSchPlanLang(data) {
            getSchPlanLang(data).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.data && res.code == 200) {
                    this.langArr = res.data
                    this.langValue = this.movieData.movieLanguage
                }
            })
        },
        tabClick(tab) {
            if (tab.index == '2') {
                this.$nextTick(() => {
                        let width = 900 - document.querySelector('.price-system .price-ref-table').offsetWidth
                        let height = document.querySelector('.price-system .price-ref-table').offsetHeight
                        this.tipBox = {
                            width, height
                        }
                    })
            }
        },
        // 调整排片时间
        timeChange(val) {
            if (!this.timeInterval) {
                this.planMinute = this.copyMinute
                return this.error('暂未获取到排片时间间隔,请稍后再试')
            }
            if (!this.hallData) {
                    this.planMinute = this.copyMinute
                    return this.error('暂未获取到当前影厅排片数据,请稍后再试')
                }
            if (val < 0 || val >= 60 || !/^\+?[0-9][0-9]*$/.test(val)) {
                this.planMinute = this.copyMinute
                return this.error('必须为0-59之间的整数')
            }

            let tmpTimeStart = new Date(`${this.year}-${this.month}-${this.day} ${this.planHour}:${val}`).getTime(),
            tmpTimeEnd = tmpTimeStart + this.movieData.timeLong * 60 * 1000
            // 判��调整完成之后的时间是否与同影厅其他场次冲突
            if (this.hallData.some(item => (tmpTimeStart < (new Date(item.showTimeEnd).getTime() + this.timeInterval * 60 * 1000) && tmpTimeEnd > new Date(item.showTimeEnd).getTime()) || (tmpTimeEnd > (new Date(item.showTimeStart).getTime() - this.timeInterval * 60 * 1000) && tmpTimeStart < new Date(item.showTimeStart).getTime()))) {
                this.planMinute = this.copyMinute
                return this.error('放映时间区间无法容纳该放映计划，请重新设置放映时间!')
            }
            if (this.curPlanDate != this.formatDateTime(tmpTimeEnd, 1) && 
                        tmpTimeEnd > new Date(this.formatDateTime(`${this.nextPlanDate} 06:00`, 0)).getTime()) {
                this.planMinute = this.copyMinute
                return this.error('放映结束时间不能超过次日早上6点!')
            }
            let timeRight = this.checkTimeRight(tmpTimeStart)
            if (timeRight.planError) {
                this.planMinute = this.copyMinute
                return this.error('放映时间不在上下映时间内!')
            }
            let timeInfoCheck = this.checkTimeInfoRight(tmpTimeStart)
            if (timeInfoCheck.planError) {
                this.planMinute = this.copyMinute
                return this.error('放映时间不在允许的时间内!')
            }

            this.movieData.planTime = this.formatDateTime(tmpTimeStart, 0)
            this.movieData.planTimeEnd = this.formatDateTime(tmpTimeEnd, 0)
            this.planMinute = val < 10 ? `0${val}` : `${val}`
            this.copyMinute = this.planMinute
        },
        formatDateTime(timeStamp, type) { // type: 0 全格式 1 仅日 2 仅时间
            var date = new Date(timeStamp)
            let y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? `0${m}` : m
            let d = date.getDate()
            d = d < 10 ? `0${d}` : d
            let h = date.getHours()
            h = h < 10 ? `0${h}` : h
            let mm = date.getMinutes()
            mm = mm < 10 ? `0${mm}` : mm
            return type == 0 ? `${y}-${m}-${d} ${h}:${mm}` : type == 1 ? `${y}-${m}-${d}` : type == 2 ? `${h}:${mm}` : `${y}-${m}-${d} ${h}:${mm}`
        },
        // 导入价格方案
        showPricePlanDialog() {
            this.pricePlanDialog = true
            this.importPricePlan()
        },
        // 获取导入价格方案数据  curPage为当前分页
        importPricePlan(curPage) {
            this.curPage = curPage ? curPage : 1
            importPricePlan({
                "cinemaUid": this.movieData.cinemaUid,
                "movieUid": this.movieData.movieUid,
                "movieVersionCode": this.movieData.disVersionCode,
                "planDateTime": this.movieData.planTime,
                "priceProgramName": this.planName,
                "pageSize": this.pageSize,
                "currentPage":  this.curPage,
                "hallTypeCode": this.hallTypeCode
                }).then(res => {
                    if (res.code != 200) return this.error(res.msg)
                    if (res.code == 200 && res.data) {
                        this.total = res.data.total
                        res.data.list.forEach(item => {
                            if (!item.hallType) item.hallType = '适用全部影厅'
                        })
                        this.importPlanData = res.data.list
                    }
                })
        },
        // 表格单选事件
        selectedRow(val) {
            this.currentRow = val
        },
        handleCurrentChange(curPage) {
            this.importPricePlan(curPage)
        },
        //  全选/全部选 影片版本
        movieTypeAllChange(val) {
            this.movieTypeCheckList = val ? this.movieType.map((item, i) => i) : []
            this.isIndeterminate = false
        },
        //  控制全部选择是否打勾
        handleCheckedCitiesChange(value) {
            let checkedCount = value.length
            this.movieTypeCheckAll = checkedCount === this.movieType.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.movieType.length
        },
        // 控制表格行可选
        tableSelRule(row, index) {
            return !!row.price
        },
        toFixed() {
            let tmp = this.ruleForm.price
            if (!Number(tmp)) return
            this.ruleForm.price = Number(tmp).toFixed(2)
            // 同步价格方案里 有对应的 最低票价加价的 方案价格

        },
        tableFixed(scope) {
            let tmp1 = this.ticketData[scope.$index].price, tmp2 = this.ticketData[scope.$index].addFee
            this.ticketData[scope.$index].price = Number(tmp1).toFixed(2)
            this.ticketData[scope.$index].addFee = Number(tmp2).toFixed(2)   
        },
        cichannelToFixed(scope) {
            let tmp1 = this.channelData[scope.$index].price, tmp2 = this.channelData[scope.$index].addFee, tmp3 = this.channelData[scope.$index].netSaleAddPrice
            this.channelData[scope.$index].price = Number(tmp1).toFixed(2)
            this.channelData[scope.$index].addFee = Number(tmp2).toFixed(2)
            this.channelData[scope.$index].netSaleAddPrice = Number(tmp3).toFixed(2)
        },
        // close 导入价格方案弹窗
        closeDialogCb() {
            // this.hallTypeValue = ''
            // this.issueTypeValue = ''
            this.planName = ''
            this.curPage = 1
            this.importPlanData = []
        },
        // 选择 一个价格方案进行适配
        selectSinglePlan() {
            if (!this.currentRow) return this.pricePlanDialog = false
            this.selectPlanData.data = this.currentRow
            priceprogramScan1({uid: this.selectPlanData.data.uid}).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.code == 200 && res.data) {
                    if (!this.selectPlanData.isShow) this.selectPlanData.isShow = true
                    this.movieData.priceProgramName = res.data.ciPriceProgram.name;
                    this.selectPlanData.programName = res.data.ciPriceProgram.name
                    this.selectPlanData.programUid = res.data.ciPriceProgram.uid
                    this.ticketData.forEach(item => {
                        if (res.data.ttVoList && res.data.ttVoList.length) {
                            res.data.ttVoList.forEach(type => {
                                console.log(type.feeFlag, type.price)
                                if (item.saveUid == type.ttUid && type.movieVersionName == this.movieData.disVersion) {
                                    item.price = type.feeFlag ? type.price + Number(this.ruleForm.price) : type.price
                                    // item.addFee = type.addFee
                                    item.switchStatus = true
                                }
                            })
                        }
                        if (!item.price) item.price = 0
                        if (!item.addFee) item.addFee = 0
                        item.price = parseFloat(item.price).toFixed(2)
                        item.addFee = parseFloat(item.addFee).toFixed(2)
                    })
                    this.channelData.forEach(item => {
                        if (res.data.ciPriceSaleChannelVoList && res.data.ciPriceSaleChannelVoList.length) {
                            item.switchStatus = res.data.ciPriceSaleChannelVoList.some(channel => channel.uid == item.saveUid)  
                        }
                        item.price = 0 
                    })
                    this.channelData.forEach(item => {
                        if (res.data.priceNetSale && res.data.priceNetSale.length) {
                            res.data.priceNetSale.forEach(channel => {
                                if (channel.movieVersionName == this.movieData.disVersion && item.switchStatus) {
                                    console.log(channel.feeFlag, channel.price)
                                    item.price = channel.feeFlag ? channel.price + Number(this.ruleForm.price) : channel.price
                                }
                            })
                        }
                        if (!item.price) item.price = 0
                        item.price = parseFloat(item.price).toFixed(2)
                    })
                    this.permitDiscount = !!res.data.ciPriceProgram.permitDiscount
                    this.permitSaleBox = !!res.data.ciPriceProgram.permitSaleBox
                    this.pricePlanDialog = false
                    this.pricing = res.data.useRegionPrice;
                    this.pricing1 = res.data.useAdjustmentPrice;
                    if(this.activeList.length==1){
                        this.fuhao = '≤'
                    }else{
                        this.fuhao = '＜'
                    }
                    if (res.data.priceAdjustmentList.length>0) {
                        if (
                            res.data.priceAdjustmentList[0].useOccupancyFlag == 1 &&
                            res.data.priceAdjustmentList[0].useStartTimeFlag == 0
                        ) {
                            this.ifCheck = ["0"];
                            this.checkList = [0];
                        } else if (
                            res.data.priceAdjustmentList[0].useStartTimeFlag == 1 &&
                            res.data.priceAdjustmentList[0].useOccupancyFlag == 0
                        ) {
                            this.ifCheck = ["1"];
                            this.checkList = [1];
                        } else if (
                            res.data.priceAdjustmentList[0].useOccupancyFlag == 1 &&
                            res.data.priceAdjustmentList[0].useStartTimeFlag == 1
                        ) {
                            this.ifCheck = ["0", "1"];
                            this.checkList = [0, 1];
                        }
                        this.activeList = res.data.priceAdjustmentList;
                        this.activeList.forEach(item => {
                            if(item.uid){
                                this.$delete(item,'uid')
                            }
                            if (item.adjustmentType == 1) {
                                if (item.price > 0) {
                                    this.$set(item,'type',0)
                                } else if (item.price < 0) {
                                    this.$set(item,'type',1)
                                    this.$set(item,'price',item.price*-1)
                                }
                            } else if (item.adjustmentType == 2) {
                                this.$set(item,'type',2)
                            }
                            if (item.percentage != null) {
                                this.$set(item, "price", item.percentage);
                            }
                            if (item.price != null) {
                                this.$set(item, "price", item.price);
                                item.price = item.price.toFixed(2)
                            }
                            if(item.time){
                                item.time = item.time.toFixed(1)
                            }
                            if(item.occupancyMin || item.occupancyMin==0){
                                item.occupancyMin = item.occupancyMin.toFixed(1)
                            }
                            if(item.occupancyMax){
                                item.occupancyMax = item.occupancyMax.toFixed(1)
                            }
                        });
                        }
                        if(res.data.priceRegionList.length>0){
                        this.pricing=1; 
                        var data = res.data.priceRegionList;
                        this.tableData.forEach(item=>{
                            this.$delete(item,'uid')
                            data.forEach(i=>{
                                if(item.regionTypeUid == i.regionTypeUid){
                                    if(i.price){
                                        var a = i.price.toFixed(2)
                                    }
                                    this.$set(item,'price',a||null);
                                }
                            })
                        })
                    }
                }
            })
        },
        toPricePlanDetail(id) {
            this.$router.push({path: '/ticket/ticketPrice_Plan/Scan', query: {id}})
        },
        // ------------------  save & cancle --------------------------
        cancelHandle() {
            this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '保存',
                cancelButtonText: '放弃修改'
                })
                .then(() => {
                   this.savePlan()
                })
                .catch(action => {
                    if (action != 'cancel') return
                    this.leaveFlag = false
                    this.$store.commit("tagNav/removeTagNav", {
                        name: this.$route.name,
                        path: this.$route.path,
                        title: this.$route.meta.title,
                        query: this.$route.query
                    })
                    if (this.referer) {
                        this.$router.push({path: this.referer})
                    } else {
                        this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                    }
                        
                })
        },
        savePlan() {
            
            var p1 = new Promise((resolve, reject) => {
                if (this.ruleForm.price <= 0 || this.ruleForm.price > 999.99 || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(this.ruleForm.price)) {
                    reject('最低票价必须大于0且整数位小于1000的数字，且小数位不能超过2位!')
                } else {
                    resolve()
                }
                
            })

            var p2 = new Promise((resolve, reject) => {
                if (this.ruleForm.rate < 0 || this.ruleForm.rate > 100 || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(this.ruleForm.rate)) {
                    reject('分账比例必须输入范围为0-100,允许2位小数!')
                } else {
                    resolve()
                }
            })
             
            var p3 = new Promise((resolve, reject) => {
                let errorData = this.ticketData.filter(item => item.switchStatus).find(item => Number(item.price) < Number(this.ruleForm.price))
                let errorData2 = this.ticketData.filter(item => item.switchStatus).find(item => item.price > 999.99)

                if (!errorData && !errorData2) {
                    resolve()
                } else if (errorData) {
                    reject(`票类${errorData.name}的票价低于最低票价， 请修改重试`)
                } else {
                    reject(`票类${errorData2.name}的票价不在1-1000以内， 请修改重试`)
                }
            })
            var p4 = new Promise((resolve, reject) => {
                let errorData = this.channelData.filter(item => item.switchStatus).find(item => Number(item.price) < Number(this.ruleForm.price))
                let errorData2 = this.channelData.filter(item => item.switchStatus).find(item => Number(item.price) > 999.99)
                if (!errorData && !errorData2) {
                    resolve()
                } else if (errorData) {
                    reject(`渠道${errorData.name}的票价低于最低票价， 请修改重试`)
                } else {
                    reject(`渠道${errorData2.name}的票价不在1-1000以内， 请修改重试`)
                }                  
            })
            
            Promise.all([p1, p2, p3, p4]).then(() => {
                this.submitPlan()
            }).catch(res => {
                this.error(res)
            })
            
        },
        submitPlan() {
            this.pd = true;
            this.ticketData.forEach(item => {
                if(!item.switchStatus){
                    item.price = 0
                }
            })
            this.channelData.forEach(item => {
                if(!item.switchStatus){
                    item.price = 0
                }
            })
            let {cinemaUid, hallUid, joinFlag, movieCode, planTimeEnd} = this.movieData
            let planDate = this.curPlanDate, planTimeStart = this.movieData.planTime, minPrice = this.ruleForm.price, rate = this.ruleForm.rate, permitSaleBox = this.permitSaleBox ? 1 : 0, mustRightSeat = this.mustRightSeat ? 1 : 0, permitDiscount = this.permitDiscount ? 1 : 0, movieLanguage = this.langValue, planUid = this.planUid, priceProgramName = this.selectPlanData.isShow ? this.selectPlanData.programName : this.movieData.priceProgramName, priceProgramUid = this.selectPlanData.isShow ? this.selectPlanData.programUid: this.movieData.priceProgramUid,
            
            schPlanBaseTicketVoList = this.ticketData.filter(item => item.price > 0).map(item => {
                return {
                    addFee: item.addFee,
                    baseFlag: item.baseFlag,
                    price: item.price,
                    ticketName: item.name,
                    uidBaseClass: item.saveUid,
                    saleStatus: item.switchStatus ? 'SALE' : 'NOT_SALE'
                }
            }),
            schPlanFavTicketVoList = this.channelData.filter(item => item.price > 0).map(item => {
                return {
                    addFee: item.addFee,
                    channelName: item.name,
                    cinemaFee: item.cinemaFee,
                    // feeFg: item.feeFg,
                    feeFg: 0,
                    price: item.price,
                    uidChannel: item.saveUid,
                    saleStatus: item.switchStatus ? 'SALE' : 'NOT_SALE'
                }
            })
            if (this.ifCheck[0] == 0 && this.ifCheck[1] == 1) {
                var useOccupancyFlag = 1;
                var useStartTimeFlag = 1;
            } else if (this.ifCheck[0] == 1) {
                var useStartTimeFlag = 1;
                var useOccupancyFlag = 0;
            } else if (this.ifCheck[0] == 0) {
                var useOccupancyFlag = 1;
                var useStartTimeFlag = 0;
            } else {
                var useOccupancyFlag = 0;
                var useStartTimeFlag = 0;
            }
            this.activeList.forEach((item,index)=>{
                this.$set(item,'useOccupancyFlag',useOccupancyFlag)
                this.$set(item,'useStartTimeFlag',useStartTimeFlag)
                if(item.type == 0){
                    this.$set(item,'adjustmentType',1)
                    this.$set(item,'price',item.price * 1)
                }else if(item.type == 1){
                    this.$set(item,'adjustmentType',1)
                    this.$set(item,'price',item.price * -1)
                }else if(item.type == 2){
                    this.$set(item,'adjustmentType',2)
                    this.$set(item,'percentage',item.price * 1)
                    this.$delete(item,'price')
                }
            })
            var priceAdjustmentList = this.activeList;
            var priceRegionList = this.tableData;
            var useRegionPrice = this.pricing;
            var useAdjustmentPrice = this.pricing1;
            if(useAdjustmentPrice == 0){
                priceAdjustmentList =[];
            }
            if(useRegionPrice == 0){
                priceRegionList =[];
            }
            let saveData = {priceAdjustmentList,priceRegionList,useRegionPrice,useAdjustmentPrice,cinemaUid, hallUid, joinFlag, movieCode, movieLanguage, mustRightSeat, permitDiscount, permitSaleBox, planUid, priceProgramName, priceProgramUid, planTimeEnd,planDate, planTimeStart, minPrice, rate, schPlanBaseTicketVoList, schPlanFavTicketVoList}

            
            // var token = sessionStorage.getItem('token')
            // axios.post('http://192.168.101.83:2301/plan/update',
            //     {
            //         list: this.movieData.saleStatus == 'STOP' ? [Object.assign(saveData, {isNeedApprove: 1})] : [Object.assign(saveData, {isNeedApprove: 0})]
            //     },
            //     {
            //         headers:{
            //             'Cpm-User-Token': token
            //         }
            //     })
            //     .then(function (response) {
            //     console.log(response);
            //     })
            //     .catch(function (error) {
            //     console.log(error);
            //     });
            var a = this.activeList.length ? this.activeList.length : 0;
            var x =true;
            console.log(this.activeList)
            this.activeList.forEach((item,idx) =>{
                if(this.ifCheck[0]==0){
                if(item.occupancyMin ==null){
                    x=false;
                    this.activ = idx
                    if(idx==0){
                    this.activ = '0'
                    }
                }
                if(item.occupancyMax ==null){
                    x=false;
                    this.active = idx
                    if(idx==0){
                    this.active = '0'
                    }
                }
                }
                if(this.ifCheck[0]==1||this.ifCheck[1]==1){
                if(item.time ==null){
                    x=false;
                    this.active2 = idx
                    if(idx==0){
                    this.active2 = '0'
                    }
                }
                }
                if(item.price ==null){
                x=false;
                this.active1 = idx
                if(idx==0){
                    this.active1 = '0'
                }
                }
            })
            if(x){
                updateMoviePlan1({
                    list: this.movieData.saleStatus == 'STOP' ? [Object.assign(saveData, {isNeedApprove: 1})] : [Object.assign(saveData, {isNeedApprove: 0})]
                }).then(res => {
                    if (res.code != 200) {
                        return this.error(res.msg)
                        this.pd = false;
                    }
                    if(res.code == 200 && res.data) {
                        if (res.data.length) {
                            return this.warning('部分排片保存不成功, 请单独选择价格方案')
                        }
                        this.success('保存成功, 即将跳转至排片详情')
                        this.leaveFlag = false
                        // this.$store.commit("tagNav/removeTagNav", {
                        //     name: this.$route.name,
                        //     path: this.$route.path,
                        //     title: this.$route.meta.title
                        // })
                        
                        setTimeout(() => {
                            this.$store.commit("tagNav/removeTagNav", {
                                name: this.$route.name,
                                path: this.$route.path,
                                title: this.$route.meta.title,
                                query: this.$route.query
                            })
                            if (this.referer) {
                                this.$router.push({path: this.referer})
                            } else {
                                this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                            }
                            this.pd = false;
                        }, 1000)
                    }
                })
            }else{
                this.pd = false;
            }
            
        },
        closePage() {
            // this.$store.commit("tagNav/removeTagNav", {
            //     name: this.$route.name,
            //     path: this.$route.path,
            //     title: this.$route.meta.titlexxxxx
            // })
            // this.$router.push({path: this.$store.state.tagNav.openedPageList[this.$store.state.tagNav.openedPageList.length-1].path, query: this.$store.state.tagNav.openedPageList[this.$store.state.tagNav.openedPageList.length-1].query})   
            this.$store.commit("tagNav/removeTagNav", {
                name: this.$route.name,
                path: this.$route.path,
                title: this.$route.meta.title,
                query: this.$route.query
            })
            if (this.referer) {
                this.$router.push({path: this.referer})
            } else {
                this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
            }
        },
        // 跳转设置竞对影院
        setVieCinema() {
            this.$router.push({path: '/analysis/group/cinema/manage'})
        },
        // 校验 是否在 上下映时间内
        checkTimeRight(startTime) {
            return {
                planError: startTime >= new Date(this.movieData.dateShowOff).getTime() || startTime < new Date(this.movieData.dateShowFirst).getTime(),
                errorType: startTime >= new Date(this.movieData.dateShowOff).getTime() ? '超过影片下线日期，不能编排放映计划' : startTime < new Date(this.movieData.dateShowFirst).getTime() ? '未到影片首映日期，不能编排放映计划' : ''
            } 
        },
        // 校验 是否 在信息表时间内
        checkTimeInfoRight(startTime) {
            let planStartDate = this.formatDateTime(startTime, 1)

            return {
                planError: this.movieData.planInfoMovieTimeVoList ? this.movieData.planInfoMovieTimeVoList.length ? !this.movieData.planInfoMovieTimeVoList.some(item => 
                    (new Date (planStartDate).getTime() >= new Date(`${item.startDate}`).getTime() && new Date(planStartDate).getTime() <= new Date(item.endDate).getTime()) && (startTime >= new Date(`${planStartDate} ${item.startTime}`).getTime() && startTime <= new Date(`${planStartDate} ${item.endTime}`).getTime())) : false : false,
                errorType: '不在影片允许的排片时间内'
            }
        }
    },
    components: {
        fixStepTool: FixStepTool
    },
    computed: {
    }
}
</script>

<style lang="scss">
.el-message.hyy-toast {
	min-width: 192px;
	min-height: 48px;
	box-sizing: border-box;
	color: #fff;
	background:rgba(51,51,51,0.8);
	padding: 12px 48px;
	border-radius: 4px;
	& > i {
		width: 16px;
		height: 16px;
		color: #fff;
		margin-right: 10px;
	}
	& > p {
		font-size: 16px;
		line-height: 22px;
	}
}
.movie-plan_detail {
    padding-bottom: 30px;
    .redBorder{
        input{
            border:1px solid red;
        }
    }
    .basic-info {
		margin-left: 30px;
		// form css reset
		.el-form-item {
            margin-bottom: 14px;
		}
        .el-form-item__label {
            font-size: 12px;
            text-align: left;
        }
        .el-select,
        .el-textarea,
        .el-input__inner {
            width: 360px;
        }
        .cinema-stock-edit-text {
            font-size: 12px;
            color: #666;
        }
        .separate-accounts-date,
        .separate-accounts-price,
        .separate-accounts-action {
            display: inline-block;
            //   height: 32px;
        }
        .canal-pirce-input {
            .el-input {
                width: 48px;
                height: 20px;
                .el-input__inner {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 0 0 0 10px;
                }
            }
		}
        .el-form-item__content {
            font-size: 12px;
            color: #666;
        }
        //  基本信息
        &.movie-info {
            .el-form {
                width: 1000px;
                overflow: hidden;
            }
            .movie-time {
                // .el-select {
                //     width: 70px;
                //     height: 30px;
                //     position: relative;
                //     top: -2px;
                //     .el-input__inner {
                //         width: 70px;
                //         height: 30px;
                //     }
                //     .el-input {
                //         width: 70px;
                //         height: 30px;
                //         line-height: 30px;
                //     }
                // }
                .plan-minute {
                    width:40px;
                    font-size: 12px;
                    color: #666;
                    .el-input__inner {
                        width: 40px;
                        padding: 0 5px;
                        height: 20px;
                        line-height: 20px; 
                    }
                }
            }
            .movie-lang {
                .el-select {
                    position: relative;
                    top: -2px;
                    width: 200px;
                    height: 30px;
                    .el-input__inner {
                        width: 200px;
                        height: 30px;
                    }
                    .el-input {
                        width: 200px;
                        height: 30px;
                        line-height: 30px;
                    }
                }
            }
            .el-form-item {
                float: left;
                width: 40%;
                height: 34px;
            }
            .el-date-editor {
                width: 120px;
                .el-input__inner {
                    width: 120px;
                }
            }
        }
		//	价格体系
		&.price-system {
            position: relative;
            .export-priceplan-btn {
                position: absolute;
                left: 800px;
                top: 0;
                z-index: 999;
            }
            .el-tabs {
                width: 900px;
            }
			.el-button {
				padding: 0;
				width: 92px;
				height: 32px;
				line-height: 32px;
				span {
					font-size: 12px;
				}
			}
			.el-checkbox__inner {
				width: 12px;
				height: 12px;
			}
			.el-checkbox__input {
				width: 12px;
				height: 12px;
				&.is-checked {
					width: 12px;
					height: 12px;
                    .el-checkbox__inner::after {
                        top: 0;
                        left: 3px;
                        transform: rotate(45deg) scaleY(0.8);
                    }
				}
			}
			.el-checkbox__label {
				display: inline-block;
				height: 20px;
				line-height: 20px;
				font-size: 12px;
				color: #666;
				padding-left: 4px;
				vertical-align: middle;
			}
			.el-checkbox {
				margin-right: 12px;
			}
            .el-checkbox + .el-checkbox {
                margin-left: 0;
            }
            .pirce-ref-title {
                font-size: 12px;
                color: #333;
                margin-bottom: 16px;
                height: 16px;
                line-height: 16px;
                    span { 
                        font-size: 12px;
                        color: #666; 
                    }
            }
            .pirce-ref-area {
                position: relative;
                 padding-top: 25px;
                .table-top-tip {
                    position: absolute;
                    right:  0px;
                    top: 0;
                    & > div {
                        display: inline-block;
                        height: 16px;
                        line-height: 16px;
                        margin-right: 12px;
                        font-size: 12px;
                        .color-block {
                            display: inline-block;
                            width: 10px;
                            height: 10px;
                            margin-right: 8px;
                            background-color: #FF8900;   
                        }
                        &:nth-child(2) .color-block {
                            background-color: #3B74FF;
                        }
                    }
                }
                .cell {
                    .top {
                        color: #FF8900;
                        font-weight: 800;
                    }
                    .low {
                        color: #3B74FF;
                        font-weight: 800;   
                    }        
                }
            }
			.el-table {
				width: 900px !important;
                margin-bottom: 4px;
                &.price-ref-table {
                    .cinema-col {
                        .caret-wrapper {
                            top: 15px;
                        }
                    }
                    .cinema-th {
                        max-width: 100px;
                        display: inline-flex;
                        flex-direction: column;
                        align-items: left;
                        padding: 0;
                    .cinema-info {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        color: #333;
                        font-size: 12px;
                        margin-bottom: 3px;
                        height: 16px;
                        line-height: 16px;
                    }
                }
                }
                .el-select {
                    margin-right: 10px;
                    width: 150px;
                    height: 20px;
                    .el-input__suffix {
                        right: 0;
                    }
                    .el-select__caret {
                        font-size: 12px;
                    }
                    .el-input__inner {
                        width: 150px;
                        height: 20px;
                        padding-right: 20px;
                    }
                    .el-input {
                        width: 150px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                    }
                }
                .input-con {
                    position: relative;
                    display: inline-block;
                    font-size: 12px;
                    .rmb-hover {
                        position: absolute;
                        left: 10px;
                        top: 2px;
                        font-size: 12px;
                        font-style: normal;
                    }
                    .el-input__inner {
                        width: 150px;
                        height: 20px;
                        padding-left: 20px;
                        padding-right: 0px;
                    }
                    .el-input {
                        width: 80px;
                        height: 20px;
                        line-height: 20px;
                        font-size: 12px;
                    }
                }

			}
			.table-rule {
				color: #3f3f3f;
				font-size: 12px;
				height: 20px;
				line-height: 20px;
			}
			.prcie-promise {
                font-size: 12px;
                margin-bottom: 8px;
				columns: #666;
				height: 20px;
				line-height: 20px;
                span {
                    font-size: 12px;
                }
			}
			.table-bottom-menu {
				width: 432px;
				position: relative;
				margin-top: 10px;
				.canal-pirce-input {
					position: absolute;
					right: 0;
					bottom: 0;
					color: #666;
					font-size: 12px;
					height: 20px;
					line-height: 20px;
					span {
						display: inline-block;
						font-size: 12px;
						width: 72px;
						height: 20px;
						line-height: 20px;
						vertical-align: middle;
					}
					em {
						display: inline-block;
						height: 20px;
						line-height: 20px;
						margin-right: 6px;
						vertical-align: middle;
					}
					.el-input {
						width: 48px;
						height: 20px;
						vertical-align: middle;
						.el-input__inner {
							font-size: 12px;
							line-height: 20px;
							height: 20px;
						}
					}
				}
			}
            .el-checkbox-group {
                display: inline-block;
            }
            .check-all-type {
                margin-right: 12px;
            }
            .edit-cichannel-table {
                .cell {
                    span {
                        display: inline-block;
                        font-size: 12px;
                    }
                    .input-con {
                        width: 120px;
                    }
                }
                .el-select {
                    .el-input {
                    width: 150px;
                    .el-input__inner {
                        width: 150px;
                        padding-right: 20px;
                        font-size: 12px;
                        color: #666;
                    }
                }
                }
            }
            .no-vie-cinema {
                // width: 70%;
                // height: 100%;
                box-sizing: border-box;
                border: 1px solid #E5E5E5;
                background-color: #fff;
                position: relative;
                float: left;
                .center-tip {
                    width: 300px;
                    text-align: center;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    .p1 {
                        font-size: 14px;
                        color: #666666;
                        margin-bottom: 5px;
                    }
                    
                }
            }
		}
		// 分区加价设置
		&.zone-add-price {
			.button-new-tag {
				width: 105px;
				height: 32px;
				box-sizing: border-box;
				padding: 0;
				span {
					font-size: 12px;
				}
			}
			.tags-con {
				width: 360px;
				height: 36px;
				background-color: #f5f5f5;
				padding: 0 12px;
				box-sizing: border-box;
				border-radius: 5px;
				.el-tag {
					height: 20px;
					line-height: 20px;
					background-color: #fff;
					color: #666;
					border-color: #bcbcbc;
					.el-tag__close {
						color: #666;
						&:hover {
						background-color: #fff;
						color: #666;
						}
					}
				}
			}
			.item-tip {
				color: #666;
				font-size: 12px;
			}
			.el-radio-group {
				margin-bottom: 14px;
			}
			.radio-con {
				margin-bottom: 5px;
				.el-radio__original {
					color: #666;
					font-size: 12px;
				}
				.el-radio__label {
					font-size: 12px;
					color: #666;
				}
				.el-button {
					width: 90px;
					height: 20px;
					padding: 0;
					margin-left: 5px;
					span {
						font-size: 12px;
					}
				}
			}
			.el-table {
				width: 615px !important;
			}
		}
		// 上座浮动率调价
		&.float-price {
			.dib-l,
			.dib-r {
				display: inline-block;
				vertical-align: middle;
				& .el-input, & .el-input__inner {
					width: 64px;
					height: 32px;
				}
			}
			.add-price-rule {
				color: #3b74ff;
				span {
					cursor: pointer;
				}
				.iconfont {
					margin-right: 5px;
				}
			}
		}
		// 分账信息
		&.checkout-account {
            .el-form {
                width: 1000px;
                overflow: visible;
            }
			.el-form-item {
                float: left;
                width: 40%;
                // min-height: 50px;
                // height: 32px;
				// margin-bottom: 8px;
                &.is-error {
                    height: 58px;
                }
			}
			.separate-accounts-price {
				color: #666;
				span {
					font-size: 12px;
					}
				.el-input, .el-input__inner {
					width: 120px;
					height: 24px;
				}
			}
			.separate-accounts-date {
				margin-left: -12px;
				span {
					font-size: 12px;
					color: #666666;
				}
				.el-date-editor--daterange.el-input__inner {
					vertical-align: middle;
					width: 196px;
					height: 32px;
					.el-input__inner {
						height: 32px;
					}
				}
			}
			.separate-accounts-action {
				margin-left: 6px;
				.el-button {
					width: 40px;
					height: 32px;
					border: 1px solid #3b74ff;
					box-sizing: border-box;
					color: #3b74ff;
					vertical-align: middle;
					span {
						font-size: 12px;
					}
				}
				.el-button--mini {
					padding: 10px 5px 8px;
				}
			}
		}
	}
    // .el-collapse-item__arrow.is-active {
    //     transform: rotate(90deg);
	// }
    
	.bottom-handler-tool {
		height: 64px;
		// width: 100%;
		position: fixed;
		z-index: 999;
		bottom: 0;
		right: 0;
		background-color: #f5f5f5;
		.btn-area {
			width: 500px;
			margin: 0 auto;
			height: 64px;
			text-align: center;
			padding-top: 16px;
			box-sizing: border-box;
		}
	}
    // 导入价格方案
    .import-price-plan-dialog {
        .el-form-item {
            .search-wrap {
                display: inline-block; 
                margin-right: 10px;
                span {
                    color: #666;
                    font-size: 12px;
                }
            }
            .el-input {
                width: 120px;
                height: 20px;
                .el-input__inner {
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 0 0 0 10px;
                }
            }
            .el-select {
                margin-right: 10px;
                width: 120px;
                height: 20px;
                .el-input__suffix {
                    right: 0;
                }
                .el-select__caret {
                    font-size: 12px;
                }
                .el-input__inner {
                    width: 120px;
                    height: 20px;
                    padding-right: 20px;
                }
                .el-input {
                    width: 120px;
                    height: 20px;
                    line-height: 20px;
                    font-size: 12px;
                }
                .el-input__icon {
                    line-height: 20px;
                }
            }
        }
    }
    .show {
    display: block;
    .el-input__inner {
      width: 80px;
      box-sizing: border-box;
      padding-right: 0;
    }
    .el-select {
      width: 120px;
      .el-input__inner {
        width: 120px;
      }
    }
  }
}

</style>
