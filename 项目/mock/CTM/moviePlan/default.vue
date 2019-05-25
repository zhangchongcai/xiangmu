<template>
    <div class="movie-plan_default">
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
                                <el-time-picker
                                    v-model="playTime"
                                    @change="timePickerChange"
                                    :editable="false"
                                    :clearable="false"
                                    value-format="HHmmss"
                                    :picker-options="timeRange"
                                    placeholder="任意时间点">
                                </el-time-picker>
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
                                {{movieData.disversion}}
                            </span>
                        </el-form-item>
                        <el-form-item label="首映日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.disversion}}
                            </span>
                        </el-form-item>
                        <el-form-item label="落幕日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.disversion}}
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
                           {{showPlanTime}}
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
                                {{movieData.disversion}}
                            </span>
                        </el-form-item>
                        <el-form-item label="首映日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.disversion}}
                            </span>
                        </el-form-item>
                        <el-form-item label="落幕日期：">
                           <span class="cinema-stock-edit-text">
                                {{movieData.disversion}}
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
                                            :data="ticketData.ciTickettypes"> 
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
                                                prop="addPrice"
                                                label="增值服务费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.addPrice}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                label="最终售价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.addPrice)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="allPrice"
                                                label="开售状态"
                                                width="100">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-switch
                                                        v-model="scope.row.saleStatus"
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
                                            class="edit-cichannel-table"
                                            :data="ticketData.CiChannels">
                                            <el-table-column
                                                prop="shortName"
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
                                                prop="serviceMoney"
                                                label="增值服务费">
                                                <template slot-scope="scope">
                                                    <span class="input-con">¥&nbsp;{{scope.row.serviceMoney}}</span>
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
                                                    <span class="input-con">¥&nbsp;{{(parseFloat(scope.row.price) + parseFloat(scope.row.serviceMoney) + parseFloat(scope.row.netSaleAddPrice)).toFixed(2)}}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                prop="allPrice"
                                                label="开售状态"
                                                width="100">
                                                <template slot-scope="scope">
                                                    <span class="input-con"><el-switch
                                                        v-model="scope.row.saleStatus"
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
                    </el-tabs>
                    <div class="table-bottom-menu">
                        <div class="prcie-promise">
                            <el-checkbox
                                v-model="privateSaleControl"
                            >允许包厢单卖</el-checkbox>
                        </div>
                        <div class="prcie-promise">
                            <el-checkbox
                                v-model="permitDiscount"
                            >允许营销活动折扣、会员折扣</el-checkbox>
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
                                            :data="movieData.baseConfig.schPlanBaseTicketList">
                                            <el-table-column
                                                prop="ticketNameme"
                                                label="票类"
                                                width="100"
                                            >
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="价格">
                                                <template slot-scope="scope">
                                                    <span class="input-con">{{scope.row.price}}</span>
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
                                            class="edit-cichannel-table"
                                            :data="movieData.baseConfig.schPlanFavTicketlList">
                                            <el-table-column
                                                prop="channelName"
                                                label="渠道名称"
                                                width="100">
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="渠道结算票价">
                                                <template slot-scope="scope">
                                                    <span class="input-con">{{scope.row.price}}</span>
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
                    </el-tabs>
                    <div class="table-bottom-menu">
                        <div class="prcie-promise">
                            允许包厢单卖: <span>{{privateSaleControl ? '是' : '否'}}</span>
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
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool"
import fixStepMixin from "../../../mixins/CTM/fixStepTool.js"
import {
    MessageBox,
    Message
} from 'element-ui'
import { getSchPlanLang, getPriceSystem, saveMoviePlan } from '../../../../src/http/interface.js'
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
            year: '',
            month: '',
            day: '',
            playTime: new Date(),
            copyPlayTime: '',
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
            hallData: [],
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
            privateSaleControl: '',

            // 票类数据
            ticketData: {
                CiChannels: [],
                ciTickettypes: [],
                movieVersions: []
            },
            ticketTypeSel: [],
            ticketTypeShow: [],
            // 渠道选中值
            channelSel: [],
            channelTableShow: [],
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
            //  票类  checkList
            ticketTypeList: [],
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
            
            // 价格体系 柜台自助 选中
            counterTableMul: [],
            // 价格体系 线上网售选中
            netSaleTableMul: []
        }
    },
    mixins: [fixStepMixin],
    created() {
    },
    mounted() {
        this.dataInit()
        window.onbeforeunload =  (e) => {
            if (this.$route.fullPath =="/CTM/moviePlan/default") {
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
        
        this.getPriceSystem({movieUid: this.movieData.movieUid, planUid: this.movieData.uid, movieVersion: '2d', priceProgramUid: '9db4fff4-3ec3-4e61-a828-b0a05b148aa0'})
        this.getSchPlanLang({planUid: this.movieData.uid, movieUid: this.movieData.movieUid})
    },
    methods: {
        dataInit() {
            this.movieData = this.$store.state.moviePlan ? this.$store.state.moviePlan.current_item : {}                // {}
            this.hallData = this.$store.state.moviePlan ? this.$store.state.moviePlan.current_row.filter(item => item.uid!= this.movieData.uid) : []                //
            this.isEditMode = this.$store.state.moviePlan ? this.$store.state.moviePlan.type == 'edition' ? true : false : false
            this.year = this.movieData.showTimeStart.split(' ')[0].split('-')[0]
            this.month = this.movieData.showTimeStart.split(' ')[0].split('-')[1]
            this.day = this.movieData.showTimeStart.split(' ')[0].split('-')[2]
            this.showPlanDate = `${this.year}年${this.month}月${this.day}日`
            this.showPlanTime = `${this.year}年${this.month}月${this.day}日${this.movieData.startTime.hours}时${this.movieData.startTime.minute}分`
            this.mustRightSeat = !!this.movieData.mustRightSeat
            this.permitDiscount = !!this.movieData.permitDiscount
            this.privateSaleControl = !!this.movieData.privateSaleControl
            this.playTime = `${this.movieData.startTime.hours}${this.movieData.startTime.minute}00`
            this.copyPlayTime = this.playTime
            this.timeRange.selectableRange = `${this.movieData.startTime.hours}:00:00 - ${this.movieData.startTime.hours}:59:59`
            if(!this.movieData.baseConfig.schPlanBaseTicketList) this.movieData.baseConfig.schPlanBaseTicketList = [] 
            if(!this.movieData.baseConfig.schPlanFavTicketlList) this.movieData.baseConfig.schPlanFavTicketlList = [] 
            if(!this.movieData.baseConfig.schPlanSaleChannelList) this.movieData.baseConfig.schPlanSaleChannelList = [] 
            if (!this.isEditMode) {
                this.movieData.baseConfig.schPlanBaseTicketList.forEach(item => {
                    if (!item.price) item.price = 0
                    if (!item.addFee) item.addFee = 0
                    item.price = parseFloat(item.price).toFixed(2)
                    item.addFee = parseFloat(item.addFee).toFixed(2)
                })
                this.movieData.baseConfig.schPlanFavTicketlList.forEach(item => {
                    if(!item.price) item.price = 0
                    if(!item.addFee) item.addFee = 0
                    item.price = parseFloat(item.price).toFixed(2)
                    item.addFee = parseFloat(item.addFee).toFixed(2)
                    if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                    item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                })
            }
        },
        getSchPlanLang(data) {
            getSchPlanLang(data).then(res => {
                if (res.data && res.code == 200) {
                    this.langArr = res.data.allLanguage
                    this.langValue = res.data.schPlanLuanguage.movieLanguage
                }
            }).catch(res => {})
        },
        getPriceSystem(data) {
            getPriceSystem(data).then(res => {
                if (res.data && res.code == 200) {
                    if (res.data.priceAndRate[0].rate || res.data.priceAndRate[0].minPrice) {
                        this.ruleForm.price = res.data.priceAndRate[0].minPrice
                        this.ruleForm.rate = res.data.priceAndRate[0].rate
                    } else {
                        this.ruleForm.price = this.$store.state.moviePlan ? this.$store.state.moviePlan.pricePlan.price : ''
                        this.ruleForm.rate = this.$store.state.moviePlan ? this.$store.state.moviePlan.pricePlan.rate : ''
                    }
                    
                    if (this.isEditMode) {
                        res.data.ciTickettypes.forEach(item => {
                            if (this.movieData.baseConfig.schPlanBaseTicketList && this.movieData.baseConfig.schPlanBaseTicketList.length) {
                                if (this.movieData.baseConfig.schPlanBaseTicketList.every(type => item.uid != type.uidBaseClass)) {
                                    item.saleStatus = false
                                } else {
                                    this.movieData.baseConfig.schPlanBaseTicketList.forEach(type => {
                                        if (item.uid == type.uidBaseClass) {
                                            item.saleStatus = true
                                            item.price = type.price
                                            item.addPrice = type.addFee
                                        }
                                    })
                                }
                            }
                            if (!item.price) item.price = 0
                            if (!item.addPrice) item.addPrice = 0
                            item.price = parseFloat(item.price).toFixed(2)
                            item.addPrice = parseFloat(item.addPrice).toFixed(2)
                        })

                        res.data.CiChannels.forEach(item => {
                            if (this.movieData.baseConfig.schPlanFavTicketlList && this.movieData.baseConfig.schPlanFavTicketlList.length) {
                                if (this.movieData.baseConfig.schPlanFavTicketlList.every(type => item.uid != type.uidChannel)) {
                                    item.saleStatus = false
                                } else {
                                    this.movieData.baseConfig.schPlanFavTicketlList.forEach(type => {
                                        if (item.uid == type.uidChannel) {
                                            item.saleStatus = true
                                            item.price = type.price
                                            item.addPrice = type.addFee
                                        }
                                    })
                                }
                            }
                            if(!item.price) item.price = 0
                            if(!item.serviceMoney) item.serviceMoney = 0
                            item.price = parseFloat(item.price).toFixed(2)
                            item.serviceMoney = parseFloat(item.serviceMoney).toFixed(2)
                            if (!item.netSaleAddPrice) item.netSaleAddPrice = 0
                            item.netSaleAddPrice = parseFloat(item.netSaleAddPrice).toFixed(2)
                        })
                    }
                    this.ticketData = res.data
                }
            }).catch(res => {
            })
        },
        // 选择时间事件
        timePickerChange(val) {
            let formatVal = `${val.slice(0,4)}00`
            let hours = val.slice(0, 2), minute = val.slice(2, 4), tmpTimeStart = new Date(`${this.year}-${this.month}-${this.day} ${hours}:${minute}`).getTime(),
            tmpTimeEnd = tmpTimeStart + this.movieData.timeLong * 60 * 1000
            // 判断调整完成之后的时间是否与同影厅其他场次冲突
            if (this.hallData.some(item => (tmpTimeStart < new Date(item.showTimeEnd).getTime() && tmpTimeEnd > new Date(item.showTimeEnd).getTime()) || (tmpTimeEnd > new Date(item.showTimeStart).getTime() && tmpTimeStart < new Date(item.showTimeStart).getTime()))) {
                this.playTime = this.copyPlayTime
                return this.error('放映时间区间无法容纳该放映计划，请重新设置放映时间!')
            }
            this.movieData.showTimeStart = this.formatDateTime(tmpTimeStart)
            this.movieData.showTimeEnd = this.formatDateTime(tmpTimeEnd)
            this.movieData.startTime.hours = val.slice(0, 2)    
            this.movieData.startTime.minute = val.slice(2, 4)
            this.copyPlayTime = this.playTime
        },
        formatDateTime(timeStamp) {
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
            return `${y}-${m}-${d} ${h}:${mm}`
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
            let tmp1 = this.ticketData.ciTickettypes[scope.$index].price, tmp2 = this.ticketData.ciTickettypes[scope.$index].addPrice
            this.ticketData.ciTickettypes[scope.$index].price = Number(tmp1).toFixed(2)
            this.ticketData.ciTickettypes[scope.$index].addPrice = Number(tmp2).toFixed(2)   
        },
        cichannelToFixed(scope) {
            let tmp1 = this.ticketData.CiChannels[scope.$index].price
            this.ticketData.CiChannels[scope.$index].price = Number(tmp1).toFixed(2)
        },
        // ------------------ --------------------------
        
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
                    this.$router.push({path: '/CTM/moviePlan/layout', query: {date: `${this.year}-${this.month}-${this.day}`}})
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
                let errorData = this.ticketData.ciTickettypes.filter(item => item.saleStatus).find(item => Number(item.price) < Number(this.ruleForm.price))
                let errorData2 = this.ticketData.ciTickettypes.filter(item => item.saleStatus).find(item => item.price > 999999)

                if (!errorData && !errorData2) {
                    resolve()
                } else if (errorData) {
                    reject(`票类${errorData.name}的票价低于最低票价， 请修改重试`)
                } else {
                    reject(`票类${errorData2.name}的票价不在1-7位数之间， 请修改重试`)
                }
            })
            var p4 = new Promise((resolve, reject) => {
                let errorData = this.ticketData.CiChannels.filter(item => item.saleStatus).find(item => Number(item.price) < Number(this.ruleForm.price))
                let errorData2 = this.ticketData.CiChannels.filter(item => item.saleStatus).find(item => Number(item.price) > 999999)
                if (!errorData && !errorData2) {
                    resolve()
                } else if (errorData) {
                    reject(`渠道${errorData.shortName}的票价低于最低票价， 请修改重试`)
                } else {
                    reject(`渠道${errorData2.shortName}的票价不在1-7位数之间， 请修改重试`)
                }                  
            })
            
            Promise.all([p1, p2, p3, p4]).then(() => {
                this.submitPlan()
            }).catch(res => {
                this.error(res)
            })
            
        },
        submitPlan() {
            let {disVersion, displayName, hallCode, hallName, joinFlag, makeDate, movieCode, movieName, planDate, showTimeEnd, showTimeStart, timeLong, uidCinema, uidHall} = this.movieData
            //price, rate, uidMovie, uidPlan
            let arrPlan = [{
                disVersion, displayName, hallCode, hallName, joinFlag, makeDate, movieCode, movieName, planDate, showTimeEnd, showTimeStart, timeLong, uidCinema,uidHall,
                uidPlan: this.movieData.uid,
                movieLanguage: this.langValue,
                mustRightSeat: this.mustRightSeat ? 1 : 0,
                permitDiscount: this.permitDiscount ? 1 : 0,
                privateSaleControl: this.privateSaleControl ? 1 : 0,
                price: this.ruleForm.price.toString(),
                rate: this.ruleForm.rate.toString()
            }]
            let schPlanBaseTicketList = this.ticketData.ciTickettypes.filter(item => item.saleStatus).map(item => {
                return {
                    'addFee': item.addPrice,
                    'price': item.price,
                    'ticketName': item.name,
                    'uidBaseClass': item.uid,
                    'uidPlan': this.movieData.uid
                }
            }),
            schPlanSaleChannelList = this.ticketData.CiChannels.filter(item => item.saleStatus).map(item => {
                return {
                    'channelName': item.shortName,
                    'uidChannel': item.uid,
                    'uidPlan': this.movieData.uid
                }
            }),
            schPlanFavTicketlList = this.ticketData.CiChannels.filter(item => item.saleStatus).map(item => {
                return {
                    'channelName': item.shortName,
                    'uidChannel': item.uid,
                    'addFee': item.serviceMoney,
                    'price': item.price
                }
            })
            let saveData = {
                arrPlan, schPlanBaseTicketList, schPlanSaleChannelList, schPlanFavTicketlList
            }
            saveMoviePlan(saveData).then(res => {
                if(res.code == 200 && res.data) {
                    this.success('保存成功, 即将跳转至排片详情')
                    this.leaveFlag = false
                    // this.$store.commit("tagNav/removeTagNav", {
                    //     name: this.$route.name,
                    //     path: this.$route.path,
                    //     title: this.$route.meta.title
                    // })
                    setTimeout(() => {
                        this.$router.push({path: '/CTM/moviePlan/layout', query: {date: `${this.year}-${this.month}-${this.day}`}})
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
            this.$router.push({path: '/CTM/moviePlan/layout', query: {date: `${this.year}-${this.month}-${this.day}`}})
        }
    },
    components: {
        fixStepTool: FixStepTool
    },
    computed: {
    },
    destroyed() {
      window.onbeforeunload = null
    },
    beforeRouteLeave (to, from, next) {
        if (!this.leaveFlag || !this.isEditMode) {
            next()
            return
        }
        const answer = window.confirm('确定不保存直接离开吗?')
        if (answer) {
            // this.$store.commit("tagNav/removeTagNav", {
            //     name: this.$route.name,
            //     path: this.$route.path,
            //     title: this.$route.meta.title
            // })
            next()
        } else {
            next(false)
        }
    }
};
</script>

<style lang="scss">
.movie-plan_default {
    padding-bottom: 30px;
    .basic-info {
		margin-left: 30px;
		// form css reset

		.el-table {


			&::before {
				height: 0;
			}
			tr:nth-child(1n) {
				background-color: #fff;
				&:hover > td {
					background-color: #f2f4fd;
				}
			}
			tr:nth-child(2n) {
				background-color: #f5f5f5;
				&:hover > td {
					background-color: #f2f4fd;
				}
			}
			th, td {
				padding: 0;
				height: 38px;
				line-height: 38px;
				box-sizing: border-box;
				border: none;
			}
			th {
				background-color: rgb(242, 244, 253)
			}
			.el-table__header-wrapper {
				background-color: rgb(242, 244, 253)
			}
			.has-gutter {
				.cell {
					color: #333;
				}
			}
			.cell {
				font-size: 12px;
				color: #666;
            }
		}
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
                .el-select {
                    width: 70px;
                    height: 30px;
                    position: relative;
                    top: -2px;
                    .el-input__inner {
                        width: 70px;
                        height: 30px;
                    }
                    .el-input {
                        width: 70px;
                        height: 30px;
                        line-height: 30px;
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
                width: 50%;
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
			.el-table {
				width: 900px !important;
                margin-bottom: 4px;
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
                width: 50%;
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
	.el-collapse {
		border-bottom: none;
		padding-bottom: 64px;
	}
    //设置折叠框箭头和位置
    .el-collapse-item__arrow {
        margin: 0 8px 0;
        // transform: rotate(-90deg);
    }
    .el-collapse-item__header {
		display: inline-block;
		border-bottom: none;
		position: relative;
		padding: 7px 0;
        font-size: 14px;
		color: #333;
		&::after {
			left: 0;
			bottom: 0;
			width: 968px;
			height: 1px;
			content: '';
			position: absolute;
			background-color: #ebeef5;
			z-index: 1
		}
    }
    // .el-collapse-item__arrow.is-active {
    //     transform: rotate(90deg);
	// }
    .el-collapse-item__wrap {
		border: none;
		padding-top: 24px;
	}
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
}
</style>