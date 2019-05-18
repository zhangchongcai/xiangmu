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
                        <el-form-item label="语言：">
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
                        <el-form-item label="放映时间：">
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
                        <el-form-item label="审核状态：">
                            <span class="cinema-stock-edit-text">
                                {{movieData.approveStatus == 'NOT_APPROVE' ? '未审核' : movieData.approveStatus == 'WAIT_APPROVE' ? '待审核' : '已审核'}}
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
                            <div class="movie-time">
                            </div>
                           {{showPlanDate}}
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
                <div class="basic-info price-system">
                    <el-button type="text" class="export-priceplan-btn" @click="showPricePlanDialog">导入价格方案</el-button>
                    <el-tabs v-model="activeTab" type="card">
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
                                                    <span class="input-con"><el-input type="number" maxlength="9" max="999999" @blur="tableFixed(scope)" v-model="scope.row.price"></el-input><i class="rmb-hover">¥</i></span>
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
                                                    <span class="input-con"><el-input type="number" maxlength="9" max="999999" @blur="cichannelToFixed(scope)" v-model="scope.row.price"></el-input><i class="rmb-hover">¥</i></span>
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
                                                prop="netSaleAddPrice"
                                                label="网络代售费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.netSaleAddPrice}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee) + parseFloat(scope.row.netSaleAddPrice)).toFixed(2)}}</span>
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
                                        <div class="table-info-tip"><span class="color-block"></span>最价票价</div>
                                    </div>
                                    <el-table
                                        :data="priceContrast"
                                        class="price-ref-table">
                                        <el-table-column
                                            prop="channelName"
                                            fixed="left"
                                            :label="movieData.movieName"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            fixed="left"
                                            sortable
                                            label="我的影院">
                                            <template slot-scope="scope">
                                                <span :class="scope.row.order == 'low' ? 'low' : scope.row.order == 'top' ? 'top' : '' ">{{scope.row.avgPrice}}</span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column
                                            v-for="(cinema, index) in vieCinemaList" 
                                            :key="cinema.cinemaCode"
                                            :class-name="'cinema-col'"
                                            sortable>
                                            <template slot="header" slot-scope="scope">
                                                <div class="cinema-th">
                                                    <p class="cinema-info">{{cinema.cinemaCode}}</p>
                                                    <p class="cinema-info">{{cinema.lang}}</p>
                                                    <p class="cinema-info">{{formatDateTime(cinema.startMills, 2)}} - {{formatDateTime(cinema.endTimeMills, 2)}}</p>
                                                </div>
                                                    
                                            </template>   
                                            <template slot-scope="scope">
                                                <span :class="scope.row.movieTickets[index].order == 'low' ? 'low' : scope.row.movieTickets[index].order == 'top' ? 'top' : ''">{{scope.row.movieTickets[index].price}}</span>
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
                            <el-checkbox
                                v-model="permitSaleBox"
                            >允许包厢单卖</el-checkbox>
                        </div>
                        <div class="prcie-promise">
                            <el-checkbox
                                v-model="permitDiscount"
                            >允许营销活动折扣、会员折扣</el-checkbox>
                        </div>
                        <div class="prcie-promise" v-if="selectPlanData.isShow">
                           <p>已匹配的价格方案: {{selectPlanData.programName}}</p>
                        </div>
                        <!-- <div class="canal-pirce-input">
                            <span>渠道代收费</span><em>¥</em><el-input>0.10</el-input>
                        </div> -->
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
                                                prop="ticketName"
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
                                                prop="channelName"
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
                                             <el-table-column
                                                prop="netSaleAddPrice"
                                                label="网络代售费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.netSaleAddPrice}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addFee) + parseFloat(scope.row.netSaleAddPrice)).toFixed(2)}}</span>
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
                                <div>线上网售票价对比<span>({{year}}/{{month}}/{{day}})</span></div>
                                <div>
                                    <el-table
                                        :data="priceContrast"
                                        class="edit-cichannel-table">
                                        <el-table-column
                                            prop="channel"
                                            fixed="left"
                                            :label="movieData.movieName"
                                        >
                                        </el-table-column>
                                        <el-table-column
                                            prop="price"
                                            fixed="left"
                                            sortable
                                            label="我的影院">
                                        </el-table-column>
                                        <el-table-column
                                            prop="addFee"
                                            fixed="left"
                                            sortable
                                            label="竞对平均票价">
                                            
                                        </el-table-column>
                                        <el-table-column
                                            v-for="cinema in vieCinemaList" 
                                            :key="cinema.cinemaCode"    
                                            sortable>
                                            <template slot="header" slot-scope="scope">
                                                <p>{{cinema.cinemaCode}}</p>
                                                <p>{{cinema.lang}}</p>
                                                <p>{{cinema.startMills - cinema.endTimeMills}}</p>
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
                        <!-- <div class="prcie-promise">
                            <span>渠道代收费</span><em>¥</em><span>0.10</span>
                        </div> -->
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

                        <el-form-item class="other-percent" prop="rate" label="院方分账比例：">
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

                        <el-form-item class="other-percent" label="院方分账比例：">
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
                    <div class="search-wrap">
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
                    </div>
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
                                <el-button @click="toPricePlanDetail(scope.row.id)" type="text">查看</el-button>
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

        

		<div class="bottom-handler-tool">
			<div class="btn-area" v-if="isEditMode">
				<el-button type="primary" @click="savePlan">保存</el-button>
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
import FixStepTool from "ctm/components/fix-step-tool/fix-step-tool"
import fixStepMixin from "ctm/mixins/fixStepTool"
import { getSchPlanLang, getPriceSystem, savePlanAll, importPricePlan, hallTypeList, priceprogramScan, getmoviePlanDetail, initTimeLine, datePlanList  } from 'ctm/http/interface'
export default {
    data() {

        var validatePrice = (rule, value, callback) => {
           setTimeout(() => {
                if (value <= 0 || value > 1000000 || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
                return callback(new Error('最低票价必须大于0且整数位小于7位的数字，且小数位不能超过2位!'))
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
            planUid: '',
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
            priceContrast: []
        }
    },
    mixins: [fixStepMixin],
    created() {
    },
    mounted() {
        this.dataInit()
        window.onbeforeunload =  (e) => {
            if (this.$route.fullPath =="/ctm/moviePlan/detail") {
                e = e || window.event
                // 兼容IE8和Firefox 4之前的版本
                if (e) {
                    e.returnValue = '关闭提示'
                }
                // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
                return '关闭提示'
            } else {
                window.onbeforeunload = null
            }
        }

        // this.getPriceSystem({movieUid: this.movieData.movieUid, planUid: this.movieData.uid})
        
    },
    methods: {
        dataInit() {
            this.isEditMode = this.$route.query.mode ? this.$route.query.mode == 'edit' ? true : false : false
            this.planUid = this.$route.query.uid ? this.$route.query.uid : ''
            // 获取导入价格方案里的两个list
            if (this.isEditMode) {
                hallTypeList({name: 'SCH_MOVIE_DIS_VERSION'}).then(res => {
                    if (res.code == 200 && res.data) {
                        res.data.unshift({keyCode: '', keyName: '全部'})
                        this.issueTypeData = res.data
                        this.issueTypeValue = res.data[0].keyCode
                    }
                })
                // hallTypeList({name: 'CI_HALL_TYPE'}).then(res => {
                //     if (res.code == 200 && res.data) {
                //         res.data.unshift({keyCode: '', keyName: '全部'})
                //         this.hallTypeData = res.data
                //         this.hallTypeValue = res.data[0].keyCode
                //     }
                // })
            }
            this.getmoviePlanDetail()
        },
        getPlanList() {
            datePlanList({
                planDate: `${this.year}-${this.month}-${this.day}`,
                cinemaUid: this.movieData.cinemaUid
            }).then(res => {
                this.hallData = res.data.filter(item => item.hallUid == this.movieData.hallUid && item.planUid != this.planUid)
            })
        },
        getmoviePlanDetail() {
            getmoviePlanDetail({
                'id': this.planUid
            }).then(res => {
                if (res.code == 200 && res.data) {
                    let {dateShowFirst, dateShowOff, disVersion, hallName, minPrice, movieLanguage, movieName, mustRightSeat, planTime, priceProgramName, publisherRate, timeLong, approveStatus, permitDiscount, permitSaleBox, movieUid, cinemaUid, hallUid, joinFlag, movieCode, priceProgramUid, planTimeEnd, hallTypeCode} = res.data
                    this.movieData = {dateShowFirst, dateShowOff, disVersion, hallName, minPrice, movieLanguage, movieName, mustRightSeat, planTime, priceProgramName, publisherRate, timeLong, approveStatus, permitDiscount, permitSaleBox, movieUid, priceProgramUid, planTimeEnd, cinemaUid, hallUid, joinFlag, movieCode, hallTypeCode}
                    
                    this.year = planTime.includes('T') ? planTime.split('T')[0].split('-')[0] : planTime.split(' ')[0].split('-')[0]
                    this.month = planTime.includes('T') ? planTime.split('T')[0].split('-')[1] : planTime.split(' ')[0].split('-')[1]
                    this.day = planTime.includes('T') ? planTime.split('T')[0].split('-')[2] : planTime.split(' ')[0].split('-')[2]
                    this.planHour = planTime.includes('T') ? planTime.split('T')[1].split(':')[0] : planTime.split(' ')[1].split(':')[0]
                    this.curPlanDate = this.planHour < 6 ? this.formatDateTime(new Date(planTime).getTime() - 1000 * 24 * 60 * 60, 1) : this.formatDateTime(new Date(planTime).getTime(), 1)
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
                    if (this.isEditMode) {
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
                        ticketData.forEach(item => {
                            relatedArr.some(citem => {
                                if (citem.uidBaseClass == item.uid) {
                                    item.price = citem.price
                                    item.addFee = citem.addFee
                                    item.switchStatus = citem.saleStatus == 'SALE'
                                    return true
                                }
                            })
                            if (!item.addFee) item.addFee = 0
                            if (!item.price) item.price = 0
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.price = parseFloat(item.price).toFixed(2)
                            if (!item.name) item.name = item.ticketName
                            if (!item.switchStatus) {
                                item.switchStatus = item.baseFlag == 0
                            }
                        })
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
                                    item.price = citem.price
                                    item.cinemaFee = citem.cinemaFee
                                    item.feeFg = citem.feeFg
                                    item.switchStatus = citem.saleStatus == 'SALE'
                                    return true
                                }
                            })
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
                        })
                        this.channelData = channelData
                    } else {
                        res.data.ticketList.forEach(item => {
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.price = parseFloat(item.price).toFixed(2)
                        })
                        this.ticketData = res.data.ticketList
                        res.data.channelList.forEach(item => {
                            if (!item.price) item.price = 0
                            if (!item.addFee) item.addFee = 0
                            if (!item.cinemaFee) item.cinemaFee = 0
                            if (!item.feeFg) item.feeFg = 0
                            if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                            item.price = parseFloat(item.price).toFixed(2)
                            item.addFee = parseFloat(item.addFee).toFixed(2)
                            item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                            item.cinemaFee = parseFloat(item.cinemaFee).toFixed(2)
                        })
                        this.channelData = res.data.channelList
                    }
                    // 票价参考
                    this.vieCinemaList = res.data.nearestMovieList.length ? res.data.nearestMovieList[0].movieTickets : []
                    res.data.nearestMovieList.forEach(item => {
                        let arr = []
                        arr.push(item.avgPrice)
                        item.movieTickets.forEach(item => {
                            arr.push(item.price)
                        })
                        arr.sort((a,b) => { return a-b })
                        if (arr.length > 1) {
                            if (item.avgPrice == arr[0]) {
                                item.order = 'low'
                            } else if (item.avgPrice == arr[arr.length - 1]) {
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
                }
            })
        },
        // 获取时间间隔
        getTimeLine() {
            initTimeLine({
                'uidCinema': this.movieData.cinemaUid
            }).then(res => {
                if (res.code == 200 && res.data) {
                    this.timeInterval = res.data.timeInterval
                    // this.timeFlag = true
                }
            }).catch(
                msg => {
                    console.log(msg);
                }
            )
        },
        getSchPlanLang(data) {
            getSchPlanLang(data).then(res => {
                if (res.data && res.code == 200) {
                    this.langArr = res.data
                    this.langValue = this.movieData.movieLanguage
                }
            }).catch(res => {})
        },
        // // 选择时间事件
        // timePickerChange(val) {
        //     let formatVal = `${val.slice(0,4)}00`
        //     let hours = val.slice(0, 2), minute = val.slice(2, 4), tmpTimeStart = new Date(`${this.curPlanDate} ${hours}:${minute}`).getTime(),
        //     tmpTimeEnd = tmpTimeStart + this.movieData.timeLong * 60 * 1000
        //     // 判断调整完成之后的时间是否与同影厅其他场次冲突
        //     if (this.hallData.some(item => (tmpTimeStart < new Date(item.showTimeEnd).getTime() && tmpTimeEnd > new Date(item.showTimeEnd).getTime()) || (tmpTimeEnd > new Date(item.showTimeStart).getTime() && tmpTimeStart < new Date(item.showTimeStart).getTime()))) {
        //         this.playTime = this.copyPlayTime
        //         return this.error('放映时间区间无法容纳该放映计划，请重新设置放映时间!')
        //     }
        //     if (hours < 6 && this.formatDateTime(tmpTimeEnd).split(' ')[1].split(':')[0] >= 6) {
        //         this.playTime = this.copyPlayTime
        //         return this.error('放映结束时间不能超过早上6点!')
        //     }
        //     this.movieData.planTime = this.formatDateTime(tmpTimeStart)
        //     this.movieData.planTimeEnd = this.formatDateTime(tmpTimeEnd)
        //     this.copyPlayTime = this.playTime
        // },
        
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
            // 判断调整完成之后的时间是否与同影厅其他场次冲突
            if (this.hallData.some(item => (tmpTimeStart < (new Date(item.showTimeEnd).getTime() + this.timeInterval * 60 * 1000) && tmpTimeEnd > new Date(item.showTimeEnd).getTime()) || (tmpTimeEnd > (new Date(item.showTimeStart).getTime() + this.timeInterval * 60 * 1000) && tmpTimeStart < new Date(item.showTimeStart).getTime()))) {
                this.planMinute = this.copyMinute
                return this.error('放映时间区间无法容纳该放映计划，请重新设置放映时间!')
            }
            if (this.curPlanDate != this.formatDateTime(tmpTimeEnd, 1) && 
                        tmpTimeEnd > new Date(this.formatDateTime(`${this.nextPlanDate} 06:00`, 0)).getTime()) {
                this.planMinute = this.copyMinute
                return this.error('放映结束时间不能超过次日早上6点!')
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
                "movieVersionCode": this.issueTypeValue,
                "planDateTime": this.movieData.planTime,
                "priceProgramName": this.planName,
                "pageSize": this.pageSize,
                "currentPage":  this.curPage,
                "hallTypeCode": this.hallTypeCode
                }).then(res => {
                    if (res.code && res.data) {
                        this.total = res.data.total
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
            this.hallTypeValue = ''
            this.issueTypeValue = ''
            this.planName = ''
            this.curPage = 1
            this.importPlanData = []
        },
        // 选择 一个价格方案进行适配
        selectSinglePlan() {
            this.selectPlanData.data = this.currentRow
            priceprogramScan({id: this.selectPlanData.data.id}).then(res => {
                if (res.code == 200 && res.data) {
                    if (!this.selectPlanData.isShow) this.selectPlanData.isShow = true
                    this.selectPlanData.programName = res.data.ciPriceProgram.name
                    this.selectPlanData.programUid = res.data.ciPriceProgram.uid
                    this.ticketData.forEach(item => {
                        if (res.data.ttVoList && res.data.ttVoList.length) {
                            res.data.ttVoList.forEach(type => {
                                if (item.uid == type.ttUid) {
                                    item.price = type.price
                                    item.addFee = type.addFee
                                    item.switchStatus = true
                                }
                            })
                        }
                        if (!item.price) item.price = 0
                        if (!item.addPrice) item.addPrice = 0
                        item.price = parseFloat(item.price).toFixed(2)
                        item.addPrice = parseFloat(item.addPrice).toFixed(2)
                    })

                    this.channelData.forEach(item => {
                        if (res.data.priceNetSale && res.data.priceNetSale.length) {
                            res.data.priceNetSale.forEach(channel => {
                                if (item.uid == type.uid) {
                                    item.price = type.price
                                    item.switchStatus = true
                                }
                            })
                        }
                        if (!item.price) item.price = 0
                        item.price = parseFloat(item.price).toFixed(2)
                    })
                    this.permitDiscount = !!res.data.ciPriceProgram.permitDiscount
                    this.permitSaleBox = !!res.data.ciPriceProgram.permitSaleBox
                    this.pricePlanDialog = false
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
                    this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                })
        },
        savePlan() {
            
            var p1 = new Promise((resolve, reject) => {
                if (this.ruleForm.price <= 0 || this.ruleForm.price > 1000000 || !/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(this.ruleForm.price)) {
                    reject('最低票价必须大于0且整数位小于7位的数字，且小数位不能超过2位!')
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
                let errorData2 = this.ticketData.filter(item => item.switchStatus).find(item => item.price > 999999)

                if (!errorData && !errorData2) {
                    resolve()
                } else if (errorData) {
                    reject(`票类${errorData.name}的票价低于最低票价， 请修改重试`)
                } else {
                    reject(`票类${errorData2.name}的票价不在1-7位数之间， 请修改重试`)
                }
            })
            var p4 = new Promise((resolve, reject) => {
                let errorData = this.channelData.filter(item => item.switchStatus).find(item => Number(item.price) < Number(this.ruleForm.price))
                let errorData2 = this.channelData.filter(item => item.switchStatus).find(item => Number(item.price) > 999999)
                if (!errorData && !errorData2) {
                    resolve()
                } else if (errorData) {
                    reject(`渠道${errorData.name}的票价低于最低票价， 请修改重试`)
                } else {
                    reject(`渠道${errorData2.name}的票价不在1-7位数之间， 请修改重试`)
                }                  
            })
            
            Promise.all([p1, p2, p3, p4]).then(() => {
                this.submitPlan()
            }).catch(res => {
                this.error(res)
            })
            
        },
        submitPlan() {
            let {cinemaUid, hallUid, joinFlag, movieCode, planTimeEnd} = this.movieData
            let planDate = this.curPlanDate, planTimeStart = this.movieData.planTime, minPrice = this.ruleForm.price, rate = this.ruleForm.rate, permitSaleBox = this.permitSaleBox ? 1 : 0, mustRightSeat = this.mustRightSeat ? 1 : 0, permitDiscount = this.permitDiscount ? 1 : 0, movieLanguage = this.langValue, planUid = this.planUid, priceProgramName = this.selectPlanData.isShow ? this.selectPlanData.programName : this.movieData.priceProgramName, priceProgramUid = this.selectPlanData.isShow ? this.selectPlanData.programUid: this.movieData.priceProgramUid,
            schPlanBaseTicketVoList = this.ticketData.filter(item => item.price > 0).map(item => {
                return {
                    addFee: item.addFee,
                    baseFlag: item.baseFlag,
                    price: item.price,
                    ticketName: item.name,
                    uidBaseClass: item.uid,
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
                    uidChannel: item.uid,
                    saleStatus: item.switchStatus ? 'SALE' : 'NOT_SALE'
                }
            })
            let saveData = {cinemaUid, hallUid, joinFlag, movieCode, movieLanguage, mustRightSeat, permitDiscount, permitSaleBox, planUid, priceProgramName, priceProgramUid, planTimeEnd,planDate, planTimeStart, minPrice, rate, schPlanBaseTicketVoList, schPlanFavTicketVoList}
            savePlanAll({
                list: [saveData]
            }).then(res => {
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
                        this.$router.push({path: 'layout'})
                        // TODO 跳转至上个页面
                        // this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
                    }, 1000)
                }
            }).catch(res => {})
        },
        closePage() {
            // this.$store.commit("tagNav/removeTagNav", {
            //     name: this.$route.name,
            //     path: this.$route.path,
            //     title: this.$route.meta.titlexxxxx
            // })
            // this.$router.push({path: this.$store.state.tagNav.openedPageList[this.$store.state.tagNav.openedPageList.length-1].path, query: this.$store.state.tagNav.openedPageList[this.$store.state.tagNav.openedPageList.length-1].query})   
            this.$router.push({path: 'layout', query: {date: this.curPlanDate}})
        }
    },
    components: {
        fixStepTool: FixStepTool
    },
    computed: {
    },
    destroyed() {
      window.onbeforeunload = null
      this.$store.commit('deleteCurrentRow')
    },
    beforeRouteLeave (to, from, next) {
        if (!this.leaveFlag || !this.isEditMode) {
            next()
            return
        }
        const answer = window.confirm('确定不保存直接离开吗?')
        if (answer) {
            this.$store.commit("tagNav/removeTagNav", {
                name: this.$route.name,
                path: this.$route.path,
                title: this.$route.meta.title
            })
            next()
        } else {
            next(false)
        }
    }
};
</script>

<style lang="scss">
.movie-plan_detail {
    padding-bottom: 30px;
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
                        max-width: 140px;
                        display: inline-flex;
                        flex-direction: column;
                        align-items: left;
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
				width: 360px;
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
                min-height: 50px;
                // height: 32px;
				// margin-bottom: 8px;
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
		width: 100%;
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
}

</style>