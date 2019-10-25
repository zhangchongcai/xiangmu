<template>
  <div :class="isFullScreen ? 'movie-plan full' : 'movie-plan'">
    <div class="movie-plan-tool">
      <div class="plan-tool-l">
        <!-- <el-select
                    v-model="hall.value"
                    placeholder="请选择">
                    <el-option
                        v-for="item in hall.data"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>-->
        <el-button class="cinema-con-button" @click="$refs.frameSingleCinema.listAuthCommCinemas(), singleCinemaVisible = true" :title="innerData.name">{{innerData.name}}</el-button>
        <span class="plan-tool-l-break"></span>
        <div class="date-picker-con">
          <span class="date-picker-prev iconfont icon-neiye-qiehuanzuojiantou" @click="changeDay(0)"></span>
          <span class="date-picker-week">{{currentWeekDay}}</span>
          <el-date-picker v-model="dateValue" type="date" align="center" placeholder="选择日期" format="yyyy-MM-dd" value-format="timestamp" :editable="false" :clearable="false" :picker-options="pickerOptions" @change="dateChange"></el-date-picker>
          <span class="date-picker-next iconfont icon-neiye-qiehuanyoujiantou" @click="changeDay(1)"></span>
        </div>
        <span class="plan-tool-l-break"></span>
        <div class="price-plan">
          <span class="price-plan-label" style="vertical-align: middle;">价格方案：</span>
          <!-- :label="item.name + '-' + item.price + '元'" -->
          <el-select style="vertical-align: middle;" :disabled="!mode" v-model="pircePlanValue" @change="changePricePlan" placeholder="请选择">
            <el-option v-for="item in pricePlan" :key="item.priceProgramUid" :label="item.priceProgramName" :value="item.priceProgramUid"></el-option>
          </el-select>
        </div>
      </div>

      <div class="plan-tool-r">
        <div class="plan-menu-area" :style="{width: mode ? 'calc(100% - 60px)' : '100%'}">
          <div class="meun-area-l">
            <ul class="plan-menu-group">
              <li class="plan-single-menu" @click="planTicketOffice">
                <i class="iconfont icon-neiye-changcipiaofang plan-tool-icon"></i>
                <p class="plan-menu-name">场次票房</p>
              </li>
              <li v-if="mode" class="plan-single-menu" @click="planReference">
                <i class="iconfont icon-neiye-paipiancankao plan-tool-icon"></i>
                <p class="plan-menu-name">排片参考</p>
              </li>
              <!-- <li
                                v-if="mode"
                                class="plan-single-menu"
                            >
                                <i class="iconfont icon-neiye-kongchang plan-tool-icon"></i>
                                <p class="plan-menu-name">空场</p>
                            </li> -->
              <el-dropdown v-if="!mode" @command="showExportTable">
                <li class="plan-single-menu">
                  <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                  <p class="plan-menu-name">导出</p>
                </li>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">按影厅导出</el-dropdown-item>
                  <el-dropdown-item command="2">按影片导出</el-dropdown-item>
                  <el-dropdown-item command="3">按时间导出</el-dropdown-item>
                  <el-dropdown-item command="4">按排片导出</el-dropdown-item>
                  <el-dropdown-item command="5">按影片时间导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-if="!mode" @command="showExportTable1">
                <li class="plan-single-menu">
                  <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                  <p class="plan-menu-name">打印</p>
                </li>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">按影厅打印</el-dropdown-item>
                  <el-dropdown-item command="2">按影片打印</el-dropdown-item>
                  <el-dropdown-item command="3">按时间打印</el-dropdown-item>
                  <el-dropdown-item command="4">按排片打印</el-dropdown-item>
                  <el-dropdown-item command="5">按影片时间打印</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <li v-if="!mode" class="plan-single-menu">
                <i class="iconfont icon-neiye-dayin plan-tool-icon"></i>
                <p class="plan-menu-name">打印</p>
              </li>-->
              <li v-if="!mode" class="plan-single-menu" @click="changeFullScreen">
                <i class="iconfont icon-neiye-quanping plan-tool-icon"></i>
                <p class="plan-menu-name">{{isFullScreen ? '退出全屏' : '全屏'}}</p>
              </li>
            </ul>
          </div>
          <div class="meun-area-r" v-if="mode">
            <ul class="plan-menu-group">
              <li v-if="showType != 3" class="plan-single-menu" @click="deleteSelectPlan">
                <i class="iconfont icon-neiye-shanchu plan-tool-icon"></i>
                <p class="plan-menu-name">删除</p>
              </li>
              <li v-if="showType == 1" class="plan-single-menu" @click="editBatch">
                <i class="iconfont icon-neiye-piliangbianji plan-tool-icon"></i>
                <p class="plan-menu-name">批量设置票价</p>
              </li>
              <el-dropdown v-if="showType == 1" @command="showExportTable">
                <li class="plan-single-menu">
                  <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                  <p class="plan-menu-name">导出</p>
                </li>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">按影厅导出</el-dropdown-item>
                  <el-dropdown-item command="2">按影片导出</el-dropdown-item>
                  <el-dropdown-item command="3">按时间导出</el-dropdown-item>
                  <el-dropdown-item command="4">按排片导出</el-dropdown-item>
                  <el-dropdown-item command="5">按影片时间导出</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <el-dropdown v-if="showType == 1" @command="showExportTable1">
                <li class="plan-single-menu">
                  <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                  <p class="plan-menu-name">打印</p>
                </li>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">按影厅打印</el-dropdown-item>
                  <el-dropdown-item command="2">按影片打印</el-dropdown-item>
                  <el-dropdown-item command="3">按时间打印</el-dropdown-item>
                  <el-dropdown-item command="4">按排片打印</el-dropdown-item>
                  <el-dropdown-item command="5">按影片时间打印</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- <li class="plan-single-menu" v-if="showType == 1">
                <i class="iconfont icon-neiye-dayin plan-tool-icon"></i>
                <p class="plan-menu-name">打印</p>
              </li>-->
              <li v-if="mode && showType != 3" class="plan-single-menu" @click="saveCheckedPlan">
                <i class="iconfont icon-neiye-baocun plan-tool-icon"></i>
                <p class="plan-menu-name">保存</p>
              </li>
              <li v-if="mode && showType != 3" class="plan-single-menu" @click="subApproves">
                <i class="iconfont icon-neiye-tijiaoshenpi plan-tool-icon"></i>
                <p class="plan-menu-name">提交审批</p>
              </li>
              <li v-if="showType != 3" class="plan-single-menu" @click="changeFullScreen">
                <i class="iconfont icon-neiye-quanping plan-tool-icon"></i>
                <p class="plan-menu-name">{{isFullScreen ? '退出全屏' : '全屏'}}</p>
              </li>
            </ul>
          </div>
        </div>

        <el-popover v-if="mode" placement="bottom" width="696" trigger="hover">
          <ul class="plan-menu-group">
            <li class="plan-single-menu" @click="changeShowPricePlanName">
              <i class="iconfont plan-tool-icon" :class="!showPricePlanName ? 'icon-xianshijiagefangan' : 'icon-xianshipiaofangtongji'"></i>
              <p class="plan-menu-name">{{showPricePlanName ? '显示票房统计' : '显示价格方案'}}</p>
            </li>
            <li class="plan-single-menu" @click="showGoldTimeSet">
              <i class="iconfont icon-neiye-zhinengpaipian plan-tool-icon"></i>
              <p class="plan-menu-name">智能排片设置</p>
            </li>
            <li class="plan-single-menu" @click="filmStoreSet">
              <i class="iconfont icon-neiye-piankushezhi plan-tool-icon"></i>
              <p class="plan-menu-name">片库设置</p>
            </li>
            <li class="plan-single-menu" @click="salePause">
              <i class="iconfont icon-neiye-zantingxiaoshou plan-tool-icon"></i>
              <p class="plan-menu-name">暂停销售</p>
            </li>
            <li class="plan-single-menu" @click="recoverSale">
              <i class="iconfont icon-neiye-huifuxiaoshou plan-tool-icon"></i>
              <p class="plan-menu-name">恢复销售</p>
            </li>
            <li class="plan-single-menu" @click="directApprove">
              <i class="iconfont icon-neiye-zhijieshenhe plan-tool-icon"></i>
              <p class="plan-menu-name">直接审核</p>
            </li>
            <li class="plan-single-menu" @click="importPlan">
              <i class="iconfont icon-neiye-daoru plan-tool-icon"></i>
              <p class="plan-menu-name">导入</p>
            </li>
            <li class="plan-single-menu" @click="linkToComPlan">
              <i class="iconfont icon-neiye-guanlipaiqi plan-tool-icon"></i>
              <p class="plan-menu-name">管理排期</p>
            </li>
            <li class="plan-single-menu" @click="planClean">
              <i class="iconfont icon-neiye-qingchuzhongpai plan-tool-icon"></i>
              <p class="plan-menu-name">清除重排</p>
            </li>
            <el-dropdown v-if="mode && showType != 1" @command="showExportTable">
              <li class="plan-single-menu">
                <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                <p class="plan-menu-name">导出</p>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">按影厅导出</el-dropdown-item>
                <el-dropdown-item command="2">按影片导出</el-dropdown-item>
                <el-dropdown-item command="3">按时间导出</el-dropdown-item>
                <el-dropdown-item command="4">按排片导出</el-dropdown-item>
                <el-dropdown-item command="5">按影片时间导出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown v-if="mode && showType != 1" @command="showExportTable1">
              <li class="plan-single-menu">
                <i class="iconfont icon-neiye-daochu plan-tool-icon"></i>
                <p class="plan-menu-name">打印</p>
              </li>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">按影厅打印</el-dropdown-item>
                <el-dropdown-item command="2">按影片打印</el-dropdown-item>
                <el-dropdown-item command="3">按时间打印</el-dropdown-item>
                <el-dropdown-item command="4">按排片打印</el-dropdown-item>
                <el-dropdown-item command="5">按影片时间打印</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <li v-if="mode && showType != 1" class="plan-single-menu">
              <i class="iconfont icon-neiye-dayin plan-tool-icon"></i>
              <p class="plan-menu-name">打印</p>
            </li>-->
            <li v-if="showType != 1" class="plan-single-menu" @click="editBatch">
              <i class="iconfont icon-neiye-piliangbianji plan-tool-icon"></i>
              <p class="plan-menu-name">批量设置票价</p>
            </li>
            <li v-if="showType == 3" class="plan-single-menu" @click="deleteSelectPlan">
              <i class="iconfont icon-neiye-shanchu plan-tool-icon"></i>
              <p class="plan-menu-name">删除</p>
            </li>
            <li v-if="mode && showType == 3" class="plan-single-menu" @click="saveCheckedPlan">
              <i class="iconfont icon-neiye-baocun plan-tool-icon"></i>
              <p class="plan-menu-name">保存</p>
            </li>
            <li v-if="mode && showType == 3" class="plan-single-menu" @click="subApproves">
              <i class="iconfont icon-neiye-tijiaoshenpi plan-tool-icon"></i>
              <p class="plan-menu-name">提交审批</p>
            </li>
            <li v-if="showType == 3" class="plan-single-menu" @click="changeFullScreen">
              <i class="iconfont icon-neiye-quanping plan-tool-icon"></i>
              <p class="plan-menu-name">{{isFullScreen ? '退出全屏' : '全屏'}}</p>
            </li>
          </ul>
          <div v-if="mode" slot="reference" class="plan-more-menu">更多</div>
        </el-popover>
        <span v-if="mode" class="plan-tool-l-break"></span>
      </div>
    </div>

    <el-dialog :title="exportTypeName" :visible.sync="exportTableShow" @close="closeDialogCb">
      <el-form :model="form" id="doPrint">
        <el-table v-loading="exportTableLoading" v-if="curCommand == 1" :span-method="columnMethod" key="1" :data="exportTableData">
          <el-table-column prop="hallName" label="影厅名称"></el-table-column>
          <el-table-column prop="displayName" label="影片名称"></el-table-column>
          <el-table-column prop="timeLong" label="片长(分钟)"></el-table-column>
          <el-table-column prop="planDate" label="放映日期"></el-table-column>
          <el-table-column prop="startTime" label="放映时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="joinFlagName" label="连场标志"></el-table-column>
          <el-table-column prop="planShowInterval" label="间隔(分)"></el-table-column>
        </el-table>
        <el-table v-if="curCommand == 2" :span-method="columnMethod" v-loading="exportTableLoading" key="2" :data="exportTableData">
          <el-table-column prop="displayName" label="影片名称"></el-table-column>
          <el-table-column prop="hallName" label="影厅名称"></el-table-column>
          <el-table-column prop="planDate" label="放映日期"></el-table-column>
          <el-table-column prop="startTime" label="放映时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="joinFlagName" label="连场标志"></el-table-column>
        </el-table>
        <el-table v-if="curCommand == 3" v-loading="exportTableLoading" key="3" :data="exportTableData">
          <el-table-column prop="planDate" label="放映日期"></el-table-column>
          <el-table-column prop="startTime" label="放映时间"></el-table-column>
          <el-table-column prop="endTime" label="结束时间"></el-table-column>
          <el-table-column prop="displayName" label="影片名称"></el-table-column>
          <el-table-column prop="timeLong" label="片长(分钟)"></el-table-column>
          <el-table-column prop="hallName" label="影厅名称">`</el-table-column>
          <el-table-column prop="joinFlagName" label="连场标志"></el-table-column>
        </el-table>
        <el-table v-if="curCommand == 4" v-loading="exportTableLoading" key="4" :data="exportTableData">
          <el-table-column prop="planDate" label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="showTimeStart" label="放映时间"></el-table-column>
          <el-table-column prop="hallName" label="影厅名称">`</el-table-column>
          <el-table-column prop="movieCode" label="影片编码"></el-table-column>
          <el-table-column prop="displayName" label="影片名称"></el-table-column>
          <el-table-column prop="movieLanguage" label="语言"></el-table-column>
        </el-table>
        <el-table v-if="curCommand == 5" v-loading="exportTableLoading" key="5" :data="exportTableData">
          <el-table-column prop="planDate" label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index+1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="showTimeStart" label="放映时间"></el-table-column>
          <el-table-column prop="hallName" label="影厅名称">`</el-table-column>
          <el-table-column prop="movieCode" label="影片编码"></el-table-column>
          <el-table-column prop="displayName" label="影片名称"></el-table-column>
          <el-table-column prop="movieLanguage" label="语言"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exportTableShow = false">取 消</el-button>
        <el-button type="primary" @click="exportMoviePlan" v-if="code ==0">导 出</el-button>
        <el-button type="primary" @click="exportMoviePlan" v-if="code ==1">打 印</el-button>
      </div>
    </el-dialog>

    <el-dialog title="智能排片设置" :visible.sync="intelligentPlanSetting" class="int-plan-setting">
      <el-form :model="intSettingForm" :rules="rules" ref="intSetForm">
        <div class="form-child-head">
          黄金时段设置
          <span>(如节假日与平日冲突，则以节假日黄金时段为准)</span>
        </div>
        <el-form-item label="周一~周四：" :label-width="'80px'">
          <el-time-picker is-range format="HH:mm" v-model="intSettingForm.timeSetValue" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
        <el-form-item label="周五：" :label-width="'80px'">
          <el-time-picker is-range format="HH:mm" v-model="intSettingForm.timeSetValue1" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
        <el-form-item label="周六~周日：" :label-width="'80px'">
          <el-time-picker is-range format="HH:mm" v-model="intSettingForm.timeSetValue2" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
        <el-form-item label="节假日：" :label-width="'80px'">
          <el-time-picker is-range format="HH:mm" v-model="intSettingForm.timeSetValue3" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"></el-time-picker>
        </el-form-item>
        <el-form-item label="是否使用黄金时段推荐：">
          <el-radio-group v-model="intSettingForm.timeSetRadio">
            <el-radio disabled :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="form-child-head">
          周转次数设置
          <i class="iconfont"></i>
        </div>
        <el-form-item label="影厅周转次数：" class="turnover-count" prop="turnoverCount">
          <el-input v-model="intSettingForm.turnoverCount"></el-input>次
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="intelligentPlanSetting = false" class="dialog-btn-w80">取 消</el-button>
        <el-button type="primary" @click="saveGoldTimeSet" class="dialog-btn-w80">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="vieCinemaDialog" :show-close="false" width="30%">
      <span>尚未设置竞对影院，是否前往设置</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="setVieCinema">立即设置</el-button>
        <el-button @click="cancelSetVieCinema">暂不设置</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量设置票价" :visible.sync="editBatchDialog" @close="editBatchCloseDialogCb">
      <!-- 导入价格方案 -->
      <el-dialog class="import-price-plan-dialog" title="导入价格方案" :visible.sync="importPricePlanDialog" @close="importCloseDialogCb" append-to-body>
        <el-form>
          <el-form-item>
            <el-table class="edit-cichannel-table" highlight-current-row @current-change="selectedRow" :data="importPlanData">
              <el-table-column prop="name" label="方案名称"></el-table-column>
              <el-table-column label="适用影院">
                <template slot-scope="scope">{{scope.row.useRange ? '适用于所有影院' : '适用指定影院'}}</template>
              </el-table-column>
              <el-table-column label="有效期">
                <template slot-scope="scope">{{scope.row.useDyFg ? '指定日期' : '长期有效'}}</template>
              </el-table-column>
              <!-- <el-table-column
                                prop="disVersion"
                                label="发行版本">
              </el-table-column>-->
              <el-table-column label="影厅类型">
                <template slot-scope="scope">{{scope.row.useHallType ? '适用于所有影厅' : '适用于指定影厅'}}</template>
              </el-table-column>
              <el-table-column width="80" label="操作">
                <template slot-scope="scope">
                  <el-button @click="toPricePlanDetail(scope.row.uid)" type="text">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="importPricePlanDialog = false">取 消</el-button>
          <el-button type="primary" @click="selectSinglePlan">确 定</el-button>
        </div>
      </el-dialog>

      <el-button type="text" @click="showPricePlanDialog">导入价格方案</el-button>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="柜台/自助" name="first">
          <el-table class="edit-cichannel-table" :data="editBatchData.baseTicket" v-loading="editBatchLoading">
            <el-table-column prop="name" width="100"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <span class="input-con">
                  <el-select v-model="scope.row.selValue">
                    <el-option v-for="item in scope.row.select" :key="item.key" :value="item.key" :label="item.label"></el-option>
                  </el-select>
                </span>
                <span class="input-con" v-if="scope.row.selValue == 1">
                  价格：<el-input type="number" maxlength="9" v-model="scope.row.price" @change="formatNumber(scope.row.price,scope.$index,true,true)"></el-input>元 + 增值服务费: <el-input type="number" @change="formatNumber(scope.row.addFee,scope.$index,false,true)" maxlength="9" v-model="scope.row.addFee"></el-input>元 = 最终售价: {{((Number(scope.row.price) * 100 + Number(scope.row.addFee) * 100) / 100).toFixed(2)}}元
                </span>
                <!-- <span
                                    class="input-con"
                                    v-if="scope.row.selValue == 1"
                                >
                                    价格：
                                    <el-input
                                        type="number"
                                        maxlength="9"
                                        v-model="scope.row.price"
                                    ></el-input>
                                    元+增值服务费: {{scope.row.addFee}} 元 = 最终售价: {{((Number(scope.row.price) * 100 + Number(scope.row.addFee) * 100) / 100).toFixed(2)}}元
                                </span> -->
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="线上网售" name="second">
          <el-table class="edit-cichannel-table" :data="editBatchData.favTicket" v-loading="editBatchLoading">
            <el-table-column prop="name" width="100"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <span class="input-con">
                  <el-select v-model="scope.row.selValue">
                    <el-option v-for="(item) in scope.row.select" :key="item.key" :value="item.key" :label="item.label"></el-option>
                  </el-select>
                  <span class="input-con" v-if="scope.row.selValue == 1">
                    价格：<el-input type="number" maxlength="9" v-model="scope.row.price" @change="formatNumber(scope.row.price,scope.$index,true,false)"></el-input>元+增值服务费: <el-input type="number" maxlength="9" v-model="scope.row.addFee" @change="formatNumber(scope.row.addFee,scope.$index,false,false)"></el-input>元 = 最终售价: {{((Number(scope.row.price) * 100 + Number(scope.row.addFee) * 100) / 100).toFixed(2)}}元
                  </span>
                  <!-- <span
                                        class="input-con"
                                        v-if="scope.row.selValue == 1"
                                    >
                                        价格：
                                        <el-input
                                            type="number"
                                            maxlength="9"
                                            v-model="scope.row.price"
                                        ></el-input>
                                        元+增值服务费: {{scope.row.addFee}} 元 = 最终售价: {{((Number(scope.row.price) * 100 + Number(scope.row.addFee) * 100) / 100).toFixed(2)}}元
                                    </span> -->
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editBatchDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitSetPrice">确 定</el-button>
      </div>
    </el-dialog>

    <frame-singlecinema :framedialogVisible="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="handleSingleCallBack" ref="frameSingleCinema">
      <div slot="footerId">
        <el-button type="primary" @click="confirmCinemaSingleDialog(), singleCinemaVisible = false">确定</el-button>
        <el-button @click="singleCinemaVisible = false">取消</el-button>
      </div>
    </frame-singlecinema>

    <movie-plan ref="moviePlan" :price-plan="curPricePlan" :base-param="baseParam" :mode="mode" :showPricePlanName="showPricePlanName" @changeMode="changeMode"></movie-plan>
  </div>
</template>

<script>
import {
  getPricePlan,
  subApproves,
  getUserInfo,
  exportMoviePlan,
  getgoldTimeSet,
  setgoldTimeSet,
  getRefCinema,
  getTicketChannel,
  setBatchPirce,
  importBatchPricePlan,
  priceprogramScan,
  lockPlanCtrlPerson
} from 'ctmSrc/http/interface';
import moviePlan from './moviePlan';
// import frameSinglecinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
import { singleCinema } from 'base';
export default {
  data () {
    var turnoverCountValidate = (rule, value, callback) => {
      setTimeout(() => {
        if (
          value <= 0 ||
          value > 20 ||
          !/^\+?[1-9][0-9]*$/.test(value)
        ) {
          return callback(
            new Error('影厅周转次数需要是一个不大于20的正整数')
          );
        } else {
          callback();
        }
      }, 100);
    };
    return {
      code: '',
      // mode : 排片页 模式  1: edit 0: view
      mode: 1,
      dateValue: '',
      dateValueCopy: '',
      uidCinema: '',
      uidCinemaCopy: '',
      cinemaName: '',
      currentWeekDay: '',
      pricePlan: [],
      curPricePlan: {},
      hall: {
        data: [],
        value: ''
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date());
            }
          }
        ]
      },
      baseParam: {},
      pircePlanValue: '',
      isFullScreen: false,
      exportTableShow: false,
      curCommand: 0,
      exportExlUrl: '',
      blobUrl: '',
      exportTypeName: '',
      exportTableData: [],
      exportTableLoading: true,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      // 智能排片设置
      intelligentPlanSetting: false,
      intSettingForm: {
        timeSetValue: [
          new Date(2019, 6, 8, 18, 30),
          new Date(2019, 6, 8, 21, 30)
        ],
        timeSetValue1: [
          new Date(2019, 6, 8, 18, 30),
          new Date(2019, 6, 8, 21, 30)
        ],
        timeSetValue2: [
          new Date(2019, 6, 8, 18, 30),
          new Date(2019, 6, 8, 21, 30)
        ],
        timeSetValue3: [
          new Date(2019, 6, 8, 18, 30),
          new Date(2019, 6, 8, 21, 30)
        ],
        timeSetRadio: 0,
        turnoverCount: 1
      },
      rules: {
        turnoverCount: [
          {
            required: true,
            message: '请输入影厅周转次数',
            trigger: 'blur'
          },
          { validator: turnoverCountValidate, trigger: 'blur' }
        ]
      },
      // 没有竞对影院弹窗
      vieCinemaDialog: false,
      // 批量设置票价弹窗
      editBatchDialog: false,
      // 导入价格方案弹框
      importPricePlanDialog: false,
      // 批量设置票价tabs
      activeName: 'first',
      editBatchData: {
        baseTicket: [],
        favTicket: []
      },
      editBatchLoading: true,
      // 导入价格方案 分页数据
      importPricePlanPage: {
        curPage: 1,
        pageSize: 10,
        total: 0
      },
      importPlanData: [],
      // 批量设置票价实际可操作的数据(排除掉连场等)
      curSelectPlans: [],
      curImportPricePlan: {},
      innerDataSingle: {},
      singleCinemaVisible: false,
      singleCinemaType: 2,
      innerData: {
        id: '',
        name: ''
      },
      currentPriceRow: {},
      // 导入价格方案的数据
      selectPlanData: {
        programUid: '',
        programName: '',
        isShow: false,
        data: []
      },
      screenWidth: document.body.clientWidth, // 屏幕宽度
      timer: false,
      showType: 1, // 1. 1080p  2. 720p 3. 1024显示屏
      showPricePlanName: true
    };
  },
  watch: {
    // dateValue(dateValue) {
    //     console.log(dateValue)
    // },
    screenWidth (val) {
      if (!this.timer) {
        this.screenWidth = val;
        if (this.screenWidth < 1440 && this.screenWidth > 1280) {
          this.showType = 2;
        } else if (
          this.screenWidth <= 1280 &&
          this.screenWidth >= 1024
        ) {
          this.showType = 3;
        } else if (this.screenWidth >= 1440) {
          this.showType = 1;
        } else {
          this.showType = 3;
        }
        this.timer = true;

        setTimeout(() => {
          this.timer = false;
        }, 400);
      }
    }
  },
  created () {
    window.document.oncontextmenu = function () {
      return false;
    };
    window.document.onselectstart = function () {
      return false;
    }; // 取消字段选择功能

    window.document.onselectstart = function () {
      return false;
    }; // 取消字段选择功能
  },
  mounted () {
    // 监听窗口大小
    window.addEventListener('resize', this.changeScreen);
    let screenWidth = document.body.clientWidth;
    this.showType = screenWidth >= 1440 ? 1 : screenWidth > 1280 ? 2 : 3;
    this.dateInit();
    if (
      !(
        this.$store.state.planCinema.cinemaUid &&
        this.$store.state.planCinema.cinemaName
      )
    ) {
      this.getUserInfo();
    } else {
      this.uidCinema = this.$store.state.planCinema.cinemaUid;
      this.uidCinemaCopy = this.uidCinema;
      this.innerData.id = Number(this.uidCinema);
      this.innerData.name = this.$store.state.planCinema.cinemaName;
      this.baseParam = {
        planDate: this.formatDateTime(this.dateValue),
        uidCinema: this.uidCinema
      };
      this.getPricePlan();
    }
  },
  methods: {
    formatNumber (val, index, type, lei) {
      var a = val * 1;
      if (lei) {
        if (type) {
          if (a <= 0) {
            this.$set(this.editBatchData.baseTicket[index], 'price', 0);
          }
        } else {
          if (a <= 0) {
            this.$set(this.editBatchData.baseTicket[index], 'addFee', 0);
          }
        }
      } else {
        if (type) {
          if (a <= 0) {
            this.$set(this.editBatchData.favTicket[index], 'price', 0);
          }
        } else {
          if (a <= 0) {
            this.$set(this.editBatchData.favTicket[index], 'addFee', 0);
          }
        }
      }
    },
    getUserInfo () {
      getUserInfo({}).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data) {
          this.uidCinema = res.data.cinemaUid;
          this.uidCinemaCopy = this.uidCinema;
          this.innerData.id = Number(this.uidCinema);
          this.innerData.name = res.data.cinemaName;
          this.$store.commit('changeCurCinema', {
            cinemaUid: this.uidCinema,
            cinemaName: this.innerData.name
          });
          this.baseParam = {
            planDate: this.formatDateTime(this.dateValue),
            uidCinema: this.uidCinema
          };
          this.getPricePlan();
        }
      });
    },
    getPricePlan () {
      getPricePlan({
        cinemaUid: this.uidCinema,
        planDate: this.baseParam.planDate
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.data && res.code == 200) {
          res.data.unshift({
            priceProgramName: '自动匹配',
            priceProgramUid: ''
          });
          this.pricePlan = res.data;
          this.pircePlanValue = res.data[0].priceProgramUid;
          this.curPricePlan = res.data[0];
        }
      });
    },
    dateInit () {
      let curTime = this.$route.query.date
        ? new Date(this.$route.query.date)
        : new Date();
      this.mode = this.$route.query.mode === 'view' ? 0 : 1;
      this.dateValue = Date.parse(curTime);
      // 存储日期copy
      this.dateValueCopy = this.dateValue;
      this.currentWeekDay =
        '星期' + '日一二三四五六'.charAt(curTime.getDay());
    },
    dateChange (e) {
      // this.dateValue = e
      // if (this.mode) {
      //     this.cleanLockCache({
      //         cinemaUid: this.baseParam.uidCinema,
      //         makeDate: this.formatDateTime(this.dateValueCopy)
      //     })
      // }
      // 存储日期copy
      this.dateValueCopy = this.dateValue;
      let checkTime = new Date(e);
      this.currentWeekDay =
        '星期' + '日一二三四五六'.charAt(checkTime.getDay());
      this.baseParam = {
        planDate: this.formatDateTime(this.dateValue),
        uidCinema: this.uidCinema
      };
      this.getPricePlan();
      // this.$refs.moviePlan.$refs.filmPlan.hideControl()
    },
    changeScreen () {
      this.screenWidth = document.body.clientWidth;
    },
    // 左右键切换日期
    changeDay (flag) {
      if (flag) {
        this.dateValue += 24 * 60 * 60 * 1000;
        this.baseParam = {
          planDate: this.formatDateTime(this.dateValue),
          uidCinema: this.uidCinema
        };
        // if (this.mode) {
        //     this.cleanLockCache({
        //         cinemaUid: this.baseParam.uidCinema,
        //         makeDate: this.formatDateTime(this.dateValueCopy)
        //     })
        // }
        // 存储日期copy
        this.dateValueCopy = this.dateValue;
        let checkTime = new Date(this.dateValue);
        this.currentWeekDay =
          '星期' + '日一二三四五六'.charAt(checkTime.getDay());
        this.getPricePlan();
        // this.$refs.moviePlan.$refs.filmPlan.hideControl()
        return;
      }
      this.dateValue -= 24 * 60 * 60 * 1000;
      this.baseParam = {
        planDate: this.formatDateTime(this.dateValue),
        uidCinema: this.uidCinema
      };
      // if (this.mode) {
      //     this.cleanLockCache({
      //         cinemaUid: this.baseParam.uidCinema,
      //         makeDate: this.formatDateTime(this.dateValueCopy)
      //     })
      // }
      // 存储日期copy
      this.dateValueCopy = this.dateValue;
      let checkTime = new Date(this.dateValue);
      this.currentWeekDay =
        '星期' + '日一二三四五六'.charAt(checkTime.getDay());
      // this.$refs.moviePlan.$refs.filmPlan.hideControl()
      this.getPricePlan();
    },
    changePricePlan (val) {
      this.curPricePlan = this.pricePlan.find(
        item => item.priceProgramUid == val
      );
      this.$refs.moviePlan.$refs.filmPlan.userNeedSave = true;
      this.$refs.moviePlan.$refs.filmPlan.pricePlanIsChange = true;
    },
    // 全屏/非全屏模式
    changeFullScreen () {
      this.isFullScreen = !this.isFullScreen;
      if (this.isFullScreen) {
        this.success('点击退出全屏按钮退出全屏');
      }
    },
    // 展示 or 关闭 票房提示
    planTicketOffice () {
      if (this.$refs.moviePlan.$refs.filmBan.showBan) {
        this.$refs.moviePlan.closeLeftTool('ban');
      } else {
        this.$refs.moviePlan.showFlimBan();
      }
    },
    // 提交审批
    subApproves () {
      this.$refs.moviePlan.$refs.filmPlan.submitReview();
    },
    directApprove () {
      this.$refs.moviePlan.$refs.filmPlan.directApprove();
    },
    // 导入排期
    importPlan () {
      this.$refs.moviePlan.$refs.importPlan.handleDialogVisible(true);
    },
    // 删除 选中排片计划
    deleteSelectPlan () {
      this.$refs.moviePlan.$refs.filmPlan.deleteSelectPlan();
    },
    // 保存选中排片计划
    saveCheckedPlan () {
      this.$refs.moviePlan.savePlan();
    },
    // 时间戳转 日期 yyyy-mm-dd
    formatDateTime (timeStamp) {
      var date = new Date(timeStamp);
      let y = date.getFullYear();
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      let h = date.getHours();
      return `${y}-${m}-${d}`;
    },
    getHourMinute (timeStamp) {
      var date = new Date(timeStamp);
      let h = date.getHours();
      h = h < 10 ? `0${h}` : h;
      let mm = date.getMinutes();
      mm = mm < 10 ? `0${mm}` : mm;
      return `${h}:${mm}`;
    },
    // 获取要导出数据
    getExportData (command) {
      if (this.code == 0) {
        switch (command) {
          case '1':
            this.exportTypeName = '按影厅导出';
            break;
          case '2':
            this.exportTypeName = '按影片导出';
            break;
          case '3':
            this.exportTypeName = '按时间导出';
            break;
          case '4':
            this.exportTypeName = '按排片导出';
            break;
          default:
            this.exportTypeName = '按影片时间导出';
        }
      } else if (this.code == 1) {
        switch (command) {
          case '1':
            this.exportTypeName = '按影厅打印';
            break;
          case '2':
            this.exportTypeName = '按影片打印';
            break;
          case '3':
            this.exportTypeName = '按时间打印';
            break;
          case '4':
            this.exportTypeName = '按排片打印';
            break;
          default:
            this.exportTypeName = '按影片时间打印';
        }
      }
      exportMoviePlan({
        planDate: this.formatDateTime(this.dateValue),
        type: this.curCommand,
        uidCinema: this.uidCinema
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data) {
          setTimeout(() => {
            this.exportTableLoading = false;
          }, 200);
          this.exportExlUrl = `data:application/vnd.ms-excel;base64,${res.data.wbBase64String}`;
          this.blobUrl = res.data.wbBase64String;
          if (command == 1) {
            let count = 1,
              countArr = [],
              indexArr = [];
            res.data.plans.forEach((item, i) => {
              if (i) {
                if (
                  item.hallName ==
                  res.data.plans[i - 1].hallName
                ) {
                  count += 1;
                  item.merge = false;
                } else {
                  item.merge = true;
                  indexArr.push(i);
                  countArr.push(count);
                  count = 1;
                }
              } else {
                item.merge = true;
                indexArr.push(i);
              }
              if (i == res.data.plans.length - 1) {
                countArr.push(count);
              }
            });
            indexArr.forEach((item, i) => {
              res.data.plans[item].rowspan = countArr[i];
            });
          } else if (command == 2) {
            let count = 1,
              countArr = [],
              indexArr = [];
            res.data.plans.forEach((item, i) => {
              if (i) {
                if (
                  item.displayName ==
                  res.data.plans[i - 1].displayName
                ) {
                  count += 1;
                  item.merge = false;
                } else {
                  item.merge = true;
                  indexArr.push(i);
                  countArr.push(count);
                  count = 1;
                }
              } else {
                item.merge = true;
                indexArr.push(i);
              }
              if (i == res.data.plans.length - 1) {
                countArr.push(count);
              }
            });
            indexArr.forEach((item, i) => {
              res.data.plans[item].rowspan = countArr[i];
            });
          } else {
            //
          }
          res.data.plans.forEach((item, i) => {
            item.startTime = item.showTimeStart.includes('T')
              ? item.showTimeStart.split('T')[1]
              : item.showTimeStart.split(' ')[1];
            item.endTime = item.showTimeEnd.includes('T')
              ? item.showTimeEnd.split('T')[1]
              : item.showTimeEnd.split(' ')[1];
          });
          this.exportTableData = res.data.plans;
        }
      });
    },
    // 表格合并
    columnMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.merge) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 展示需要导出表格
    showExportTable (command) {
      if (this.$refs.moviePlan.$refs.filmPlan.userNeedSave) {
        return this.warning('请先保存放映计划，再导出');
      }
      this.code = 0;
      this.curCommand = command;
      this.getExportData(command);
      this.exportTableShow = true;
    },
    showExportTable1 (command) {
      if (this.$refs.moviePlan.$refs.filmPlan.userNeedSave) {
        return this.warning('请先保存放映计划，再打印');
      }
      this.code = 1;
      this.curCommand = command;
      this.getExportData(command);
      this.exportTableShow = true;
    },
    // 关闭导出dialog回调
    closeDialogCb () {
      this.exportTableData = [];
      this.exportTableLoading = true;
    },
    // 导出
    exportMoviePlan () {
      if (this.code == 0) {
        if (!this.exportTableData.length) {
          this.warning('没有可导出的放映计划数据');
          this.exportTableShow = false;
          return;
        }
        const fileName = `${this.cinemaName}${this.formatDateTime(
          this.dateValue
        )}${this.exportTypeName}.xls`;
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        // var url
        // if (typeof this.exportExlUrl == 'object' && this.exportExlUrl instanceof Blob) {
        //     url = URL.createObjectURL(this.exportExlUrl)
        // }
        // elink.href = url
        elink.href = this.exportExlUrl;
        if (!window.navigator.msSaveBlob) {
          // 非IE下载
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          // TODO 兼容IE10+浏览器下载
          // console.log('ie')
          // try {
          //         var blobObject = new Blob([window.atob(this.blobUrl, {type: "text/csv"})])
          //         window.navigator.msSaveBlob(blobObject, fileName)
          //     }
          // catch (e) {
          //     console.log(e)
          //     }
        }
        this.exportTableShow = false;
      } else if (this.code == 1) {
        if (!this.exportTableData.length) {
          this.warning('没有可打印的放映计划数据');
          this.exportTableShow = false;
          return;
        }
        let subOutputRankPrint = document.getElementById('doPrint');

        let newContent = subOutputRankPrint.innerHTML;
        let oldContent = document.body.innerHTML;
        document.body.innerHTML = newContent;
        window.print();
        window.location.reload();
        document.body.innerHTML = oldContent;

        return false;
      }
    },
    // 停售
    salePause () {
      this.$refs.moviePlan.$refs.filmPlan.planStop();
    },
    // 恢复销售
    recoverSale () {
      this.$refs.moviePlan.$refs.filmPlan.planOpen();
    },
    // 清空重排
    planClean () {
      this.$refs.moviePlan.$refs.filmPlan.planClean();
    },
    // 排片参考
    planReference () {
      let userNeedSave = this.$refs.moviePlan.$refs.filmPlan.userNeedSave;
      let pricePlanIsChange = this.$refs.moviePlan.$refs.filmPlan.pricePlanIsChange;
      // if (userNeedSave && pricePlanIsChange) {
      if (userNeedSave) {
        this.$refs.moviePlan.$refs.filmPlan.savePlan(
          null,
          this.linkToPlanRef
        );
      } else {
        this.linkToPlanRef();
      }
    },
    linkToComPlan () {
      let userNeedSave = this.$refs.moviePlan.$refs.filmPlan.userNeedSave;
      let pricePlanIsChange = this.$refs.moviePlan.$refs.filmPlan.pricePlanIsChange;
      // if (userNeedSave && pricePlanIsChange) {
      if (userNeedSave) {
        this.$refs.moviePlan.$refs.filmPlan.savePlan(null, () => {
          this.$router.push('/ticket/projectionPlan/manage');
        });
      } else {
        this.$router.push('/ticket/projectionPlan/manage');
      }
    },
    linkToPlanRef () {
      getRefCinema({
        cinemaUid: this.uidCinema
      }).then(result => {
        if (result.code != 200) return this.error(result.msg);
        if (result.code == 200 && result.data) {
          if (result.data.length) {
            this.$router.push({
              path: 'planReference',
              query: {
                cinemaUid: this.uidCinema,
                planDate: this.baseParam.planDate,
                goldTimeStart: this.$refs.moviePlan.goldTimeStart,
                goldTimeEnd: this.$refs.moviePlan.goldTimeEnd
              }
            });
          } else {
            this.vieCinemaDialog = true;
          }
        }
      });
    },
    cancelSetVieCinema () {
      this.$router.push({
        path: 'planReference',
        query: {
          cinemaUid: this.uidCinema,
          consultCinemaCode: this.$refs.moviePlan.consultCinemaCode,
          planDate: this.baseParam.planDate,
          goldTimeStart: this.$refs.moviePlan.goldTimeStart,
          goldTimeEnd: this.$refs.moviePlan.goldTimeEnd
        }
      });
    },
    setVieCinema () {
      this.vieCinemaDialog = false;
      this.$router.push({ path: '/analysis/group/cinema/manage' });
    },
    getgoldTimeSet () {
      getgoldTimeSet({ cinemaUid: this.uidCinema }).then(res => {
        if (res.code == 200) {
          if (!res.data) return;
          let intSettingForm = JSON.parse(
            JSON.stringify(this.intSettingForm)
          );
          let year = Number(this.baseParam.planDate.split('-')[0]),
            month = Number(this.baseParam.planDate.split('-')[1]),
            day = Number(this.baseParam.planDate.split('-')[2]);

          intSettingForm.timeSetValue = res.data.workingDayStart
            ? [
              new Date(
                year,
                month,
                day,
                Number(
                  res.data.workingDayStart.split(':')[0]
                ),
                Number(res.data.workingDayStart.split(':')[1])
              ),
              new Date(
                year,
                month,
                day,
                Number(res.data.workingDayEnd.split(':')[0]),
                Number(res.data.workingDayEnd.split(':')[1])
              )
            ]
            : [
              new Date(year, month, day, 8, 0),
              new Date(year, month, day, 9, 0)
            ];

          intSettingForm.timeSetValue1 = res.data.fridayStart
            ? [
              new Date(
                year,
                month,
                day,
                Number(res.data.fridayStart.split(':')[0]),
                Number(res.data.fridayStart.split(':')[1])
              ),
              new Date(
                year,
                month,
                day,
                Number(res.data.fridayEnd.split(':')[0]),
                Number(res.data.fridayEnd.split(':')[1])
              )
            ]
            : [
              new Date(year, month, day, 8, 0),
              new Date(year, month, day, 9, 0)
            ];

          intSettingForm.timeSetValue2 = res.data.weekendStart
            ? [
              new Date(
                year,
                month,
                day,
                Number(res.data.weekendStart.split(':')[0]),
                Number(res.data.weekendStart.split(':')[1])
              ),
              new Date(
                year,
                month,
                day,
                Number(res.data.weekendEnd.split(':')[0]),
                Number(res.data.weekendEnd.split(':')[1])
              )
            ]
            : [
              new Date(year, month, day, 8, 0),
              new Date(year, month, day, 9, 0)
            ];

          intSettingForm.timeSetValue3 = res.data.holidayStart
            ? [
              new Date(
                year,
                month,
                day,
                Number(res.data.holidayStart.split(':')[0]),
                Number(res.data.holidayStart.split(':')[1])
              ),
              new Date(
                year,
                month,
                day,
                Number(res.data.holidayEnd.split(':')[0]),
                Number(res.data.holidayEnd.split(':')[1])
              )
            ]
            : [
              new Date(year, month, day, 8, 0),
              new Date(year, month, day, 9, 0)
            ];

          intSettingForm.timeSetRadio = res.data.isGold;
          intSettingForm.turnoverCount = res.data.count;
          this.intSettingForm = intSettingForm;
        } else {
          this.error(res.msg);
        }
      });
    },
    showGoldTimeSet () {
      this.intelligentPlanSetting = true;
      this.getgoldTimeSet();
    },
    saveGoldTimeSet () {
      this.$refs['intSetForm'].validate(valid => {
        if (valid) {
          this.setGoldTimeSet();
        } else {
          return false;
        }
      });
    },
    setGoldTimeSet () {
      let set = this.intSettingForm;
      let workingDayStart = this.getHourMinute(
        set.timeSetValue[0].getTime()
      );
      let workingDayEnd = this.getHourMinute(
        set.timeSetValue[1].getTime()
      );
      let fridayStart = this.getHourMinute(set.timeSetValue1[0].getTime());
      let fridayEnd = this.getHourMinute(set.timeSetValue1[1].getTime());
      let weekendStart = this.getHourMinute(
        set.timeSetValue2[0].getTime()
      );
      let weekendEnd = this.getHourMinute(set.timeSetValue2[1].getTime());
      let holidayStart = this.getHourMinute(
        set.timeSetValue3[0].getTime()
      );
      let holidayEnd = this.getHourMinute(set.timeSetValue3[1].getTime());
      setgoldTimeSet({
        uidCinema: this.uidCinema,
        workingDayStart,
        workingDayEnd,
        fridayStart,
        fridayEnd,
        weekendStart,
        weekendEnd,
        holidayStart,
        holidayEnd,
        isGold: this.intSettingForm.timeSetRadio,
        count: this.intSettingForm.turnoverCount
      }).then(res => {
        if (res.code == 200) {
          this.success('设置成功');
          this.intelligentPlanSetting = false;
        } else {
          this.error(res.msg);
        }
      });
    },
    // 批量设置票价
    editBatch () {
      this.$refs.moviePlan.$refs.filmPlan.changePlanIndexInterval();
      if (
        this.$refs.moviePlan.$refs.filmPlan.plan_rooms.every(row =>
          row.every(plan => !plan.isSelect)
        )
      ) { return this.warning('请至少选中一个排片计划!'); };
      let selectPlans = this.$refs.moviePlan.$refs.filmPlan.plan_rooms.reduce(
        (arr, row) => {
          return arr.concat(row.filter(plan => plan.isSelect));
        },
        []
      );
      this.curSelectPlans = this.$refs.moviePlan.$refs.filmPlan.plan_rooms.reduce(
        (arr, row) => {
          return arr.concat(
            row.filter(
              plan =>
                plan.isSelect &&
                plan.approveStatus !== 'WAIT_APPROVE' &&
                plan.approveStatus !== 'APPROVED' &&
                !plan.joinFlag
            )
          );
        },
        []
      );
      if (selectPlans.length && !this.curSelectPlans.length) { return this.warning('当前选中的排片计划不可编辑'); };

      this.editBatchDialog = true;
      this.getTicketChannel();
    },
    getTicketChannel () {
      getTicketChannel({
        cinemaUid: this.uidCinema
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        res.data.baseTicket.forEach(item => {
          item.select = !item.baseFlag
            ? [
              {
                key: 0,
                label: '保存票类原有价格'
              },
              {
                key: 1,
                label: '统一调整票类价格'
              }
            ]
            : [
              {
                key: 0,
                label: '保存票类原有价格'
              },
              {
                key: 1,
                label: '统一调整票类价格'
              },
              {
                key: 2,
                label: '删除该票类价格'
              }
            ];
          item.selValue = 0;
          item.price = item.price ? item.price : 0;
          item.addFee = item.addFee ? item.addFee : 0;
        });
        res.data.favTicket.forEach(item => {
          item.select = [
            {
              key: 0,
              label: '保存票类原有价格'
            },
            {
              key: 1,
              label: '统一调整票类价格'
            },
            {
              key: 2,
              label: '删除该票类价格'
            }
          ];
          item.selValue = 0;
          item.price = item.price ? item.price : 0;
          item.addFee = item.addFee ? item.addFee : 0;
        });
        this.editBatchData = res.data;
        this.editBatchLoading = false;
      });
    },
    // 导入价格方案
    showPricePlanDialog () {
      this.importPricePlanDialog = true;
      this.importPricePlan();
    },
    // 获取导入价格方案数据  curPage为当前分页
    importPricePlan (curPage) {
      // this.curPage = curPage ? curPage : 1
      // importPricePlan({
      //     "cinemaUid": this.movieData.cinemaUid,
      //     "movieUid": this.movieData.movieUid,
      //     "movieVersionCode": this.issueTypeValue,
      //     "planDateTime": this.movieData.planTime,
      //     "priceProgramName": this.planName,
      //     "pageSize": this.exportPricePlanPage.pageSize,
      //     "currentPage":  this.exportPricePlanPage.curPage,
      //     "hallTypeCode": this.hallTypeCode
      //     }).then(res => {
      //         if (res.code && res.data) {
      //             this.total = res.data.total
      //             this.importPlanData = res.data.list
      //         }
      //     })
      let programeList = this.curSelectPlans.map(item => {
        return {
          cinemaUid: this.uidCinema,
          hallUid: item.hallUid,
          movieCode: item.movieCode,
          movieVersionCode: item.disversion,
          planDate: `${this.baseParam.planDate} ${item.startTime.hours}:${item.startTime.minute}`
        };
      });
      importBatchPricePlan({
        programeList
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        this.importPlanData = res.data;
      });
    },
    // close 导入价格方案弹窗
    importCloseDialogCb () {
      this.importPlanData = [];
      this.currentPriceRow = {};
    },
    // 选择 一个价格方案进行适配
    selectSinglePlan () {
      this.selectPlanData.data = this.currentPriceRow;
      priceprogramScan({ id: this.selectPlanData.data.id }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data) {
          if (!this.selectPlanData.isShow) { this.selectPlanData.isShow = true; };
          this.selectPlanData.programName =
            res.data.ciPriceProgram.name;
          this.selectPlanData.programUid = res.data.ciPriceProgram.uid;

          this.editBatchData.baseTicket.forEach(item => {
            if (res.data.ttVoList && res.data.ttVoList.length) {
              if (
                res.data.ttVoList.every(
                  type => type.ttUid != item.uid
                )
              ) {
                item.selValue = 2;
              } else {
                item.selValue = 1;
                res.data.ttVoList.forEach(type => {
                  this.curSelectPlans.forEach(i => {
                    if (item.uid == type.ttUid) {
                      if (type.movieVersionName == i.disversion) {
                        item.price = type.price;
                        item.addFee = type.addFee;
                      }
                    }
                  });
                });
              }
            }
            if (!item.price) item.price = 0;
            if (!item.addFee) item.addFee = 0;
            item.price = parseFloat(item.price).toFixed(2);
            item.addFee = parseFloat(item.addFee).toFixed(2);
          });

          this.editBatchData.favTicket.forEach(item => {
            if (
              res.data.priceNetSale &&
              res.data.priceNetSale.length
            ) {
              res.data.priceNetSale.forEach(channel => {
                this.curSelectPlans.forEach(i => {
                  res.data.ciPriceSaleChannelVoList.forEach(x => {
                    if (i.disversion == channel.movieVersionName) {
                      if (item.uid == x.uid) {
                        item.selValue = 1;
                        item.price = channel.price;
                        item.addFee = channel.addFee;
                      }
                    }
                  });
                });
              });
              // if (
              //     res.data.priceNetSale.every(
              //         channel => channel.uid != item.uid
              //     )
              // ) {
              //     item.selValue = 2
              // } else {
              //     item.selValue = 1
              //     res.data.priceNetSale.forEach(channel => {
              //         if (item.uid == channel.uid) {
              //             item.price = channel.price
              //             item.addFee = channel.addFee
              //         }
              //     })
              // }
            }
            if (!item.price) item.price = 0;
            if (!item.addFee) item.addFee = 0;
            item.price = parseFloat(item.price).toFixed(2);
            item.addFee = parseFloat(item.addFee).toFixed(2);
          });
          // 修改对应选中影片的状态
          this.curSelectPlans.forEach(plan => {
            plan.permitDiscount =
              res.data.ciPriceProgram.permitDiscount;
            plan.permitSaleBox =
              res.data.ciPriceProgram.permitSaleBox;
            plan.priceProgramName = this.selectPlanData.programName;
            plan.priceProgramUid = this.selectPlanData.programUid;
          });

          this.importPricePlanDialog = false;
        }
      });
    },
    toPricePlanDetail (uid) {
      this.$router.push({
        path: '/ticket/ticketPrice_Plan/scan',
        query: {
          id: uid
        }
      });
    },
    // 表格单选事件
    selectedRow (val) {
      this.currentPriceRow = val;
    },
    handleCurrentChange (curPage) {
      this.importPricePlan(curPage);
    },
    // 提交批量保存价格
    submitSetPrice () {
      this.setBatchPirce();
    },
    setBatchPirce () {
      console.log(this.selectPlanData, this.curPricePlan);
      let data = {
        planBaseTicketList: this.editBatchData.baseTicket.map(item => {
          return item.selValue != 1
            ? {
              setType: item.selValue,
              ticketName: item.name,
              uidBaseClass: item.uid,
              baseFlag: item.baseFlag
            }
            : {
              setType: item.selValue,
              ticketName: item.name,
              uidBaseClass: item.uid,
              price: item.price,
              addFee: item.addFee,
              baseFlag: item.baseFlag
            };
        }),
        planFavTicketList: this.editBatchData.favTicket.map(item => {
          return item.selValue != 1
            ? {
              setType: item.selValue,
              channelName: item.name,
              channelNature: item.nature,
              uidChannel: item.uid
            }
            : {
              setType: item.selValue,
              channelName: item.name,
              channelNature: item.nature,
              uidChannel: item.uid,
              price: item.price,
              addFee: item.addFee
            };
        }),
        planMovieList: this.curSelectPlans.map(plan => {
          let item = {
            uid: plan.planUid ? plan.planUid : '',
            uidCinema: this.baseParam.uidCinema,
            movieCode: plan.movieCode,
            uidHall: plan.hallUid,
            movieLanguage: plan.language,
            mustRightSeat:
              plan.mustRightSeat != undefined
                ? plan.mustRightSeat
                : 1,
            planDate: this.baseParam.planDate,
            showTimeStart:
              plan.startTime.hours < 6
                ? `${this.formatDateTime(
                  new Date(
                    this.baseParam.planDate
                  ).getTime() +
                  24 * 60 * 60 * 1000
                )} ${plan.startTime.hours}:${
                plan.startTime.minute
                }`
                : `${this.baseParam.planDate} ${plan.startTime.hours}:${plan.startTime.minute}`,
            showTimeEnd:
              plan.endTime.hours < 6
                ? `${this.formatDateTime(
                  new Date(
                    this.baseParam.planDate
                  ).getTime() +
                  24 * 60 * 60 * 1000
                )} ${plan.endTime.hours}:${
                plan.endTime.minute
                }`
                : `${this.baseParam.planDate} ${plan.endTime.hours}:${plan.endTime.minute}`,
            minPrice:
              plan.minPrice != undefined ? plan.minPrice : 0,
            rate: plan.rate != undefined ? plan.rate : 0,
            permitSaleBox: 1,
            permitDiscount: 0,
            joinFlag:
              plan.joinFlag != undefined ? plan.joinFlag : 0,
            priceProgramName: this.selectPlanData.isShow
              ? this.selectPlanData.programName
              : this.curPricePlan.priceProgramName,
            priceProgramUid: this.selectPlanData.isShow
              ? this.selectPlanData.programUid
              : this.curPricePlan.priceProgramUid,
            showNoInHall: plan.showNoInHall,
            planShowInterval: plan.planShowInterval,
            schPlanFavTicketVoList: [],
            schPlanBaseTicketVoList: []
          };
          return plan.joinFlag
            ? plan.newJoinFlag
              ? Object.assign(item, {
                planTimeVoList: [
                  {
                    percentPrice: 100,
                    showIndex: 1,
                    movieCode: plan.movieCode,
                    minPrice:
                      plan.minPrice != undefined
                        ? plan.minPrice
                        : 0,
                    rate:
                      plan.rate != undefined
                        ? plan.rate
                        : 0,
                    planTimeStart:
                      plan.startTime.hours < 6
                        ? `${this.formatDateTime(
                          new Date(
                            this.baseParam.planDate
                          ).getTime() +
                          24 * 60 * 60 * 1000
                        )} ${
                        plan.startTime.hours
                        }:${plan.startTime.minute}`
                        : `${this.baseParam.planDate} ${plan.startTime.hours}:${plan.startTime.minute}`,
                    planTimeEnd:
                      plan.endTime.hours < 6
                        ? `${this.formatDateTime(
                          new Date(
                            this.baseParam.planDate
                          ).getTime() +
                          24 * 60 * 60 * 1000
                        )} ${plan.endTime.hours}:${
                        plan.endTime.minute
                        }`
                        : `${this.baseParam.planDate} ${plan.endTime.hours}:${plan.endTime.minute}`
                  }
                ],
                intervalMinute: plan.intervalMinute,
                joinMovieName: plan.movieName
              })
              : Object.assign(item, {
                planTimeVoList: plan.planTimeVoList,
                intervalMinute: plan.intervalMinute,
                joinMovieName: plan.joinMovieName
              })
            : item;
        })
      };
      setBatchPirce(data).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data.length) {
          let planData = JSON.parse(
            JSON.stringify(
              this.$refs.moviePlan.$refs.filmPlan.plan_rooms
            )
          );
          planData.forEach((plan, i) => {
            plan.forEach(cPlan => {
              res.data.some(item => {
                if (
                  item.uidHall == cPlan.hallUid &&
                  `${cPlan.startTime.hours}:${cPlan.startTime.minute}` ==
                  item.showTimeStart.split(' ')[1]
                ) {
                  if (!cPlan.planUid) cPlan.planUid = item.uid;
                  cPlan.approveStatus = item.approveStatus;
                  cPlan.saleStatus = item.saleStatus;
                  cPlan.planStatus = item.planStatus;
                  cPlan.originFlag = {
                    positionX: cPlan.positionX,
                    positionY: this.$refs.moviePlan.$refs.filmPlan.innerPoistionY(
                      i
                    )
                  };
                  cPlan.plan_text = '新建';
                  cPlan.approve_text = '未审核';
                  cPlan.sale_text = '不可售';
                  cPlan.programName = item.priceProgramName;
                  cPlan.programUid = item.priceProgramUid;
                  return true;
                }
              });
            });
          });
          this.$refs.moviePlan.$refs.filmPlan.plan_rooms = planData;
          this.success('批量设置票价成功');
          // this.$refs.moviePlan.initMoviePlan()
          this.editBatchDialog = false;
          this.curSelectPlans = [];
        }
      });
    },
    editBatchCloseDialogCb () {
      this.selectPlanData = {
        programUid: '',
        programName: '',
        isShow: false,
        data: []
      };
      this.editBatchData = {
        baseTicket: [],
        favTicket: []
      };
    },
    handleSingleCallBack (opt) {
      this.innerData = opt.data;
      this.uidCinema = opt.data.id.toString();
      this.$store.commit('changeCurCinema', {
        cinemaUid: this.uidCinema,
        cinemaName: this.innerData.name
      });
      this.baseParam = {
        planDate: this.formatDateTime(this.dateValue),
        uidCinema: this.uidCinema
      };
      // if (this.uidCinemaCopy != opt.data.id.toString()) {
      //     if (this.mode) {
      //         this.cleanLockCache({
      //             cinemaUid: this.baseParam.uidCinema,
      //             makeDate: this.formatDateTime(this.dateValueCopy)
      //         })
      //     }
      // }
      this.uidCinemaCopy = this.uidCinema;
      this.getPricePlan();
      this.singleCinemaVisible = opt.framedialogVisible;
      // this.$refs.moviePlan.$refs.filmPlan.hideControl()
    },
    confirmCinemaSingleDialog () {
      this.$refs.frameSingleCinema.confirmData();
    },
    // 片库设置
    filmStoreSet () {
      this.$refs.moviePlan.showFilmStoreSet();
    },
    changeShowPricePlanName () {
      this.showPricePlanName = !this.showPricePlanName;
    },
    // 清除当前人锁定缓存
    // cleanLockCache(data) {
    //     data['operation'] = 'cancel'
    //     lockPlanCtrlPerson(data).then(res => {
    //         console.log(res, new Date())
    //     })
    // },
    // 切换模式
    changeMode (mode) {
      this.mode = mode === 'view' ? 0 : 1;
    }
  },
  destroyed () {
    window.document.oncontextmenu = null;
    window.document.onselectstart = null;
    window.removeEventListener('resize', this.changeScreen);
  },
  components: {
    moviePlan,
    frameSinglecinema: singleCinema
  },
  computed: {}
};
</script> 

<style lang="scss">
.dialog-btn-w80 {
  width: 80px;
  box-sizing: border-box;
  span {
    font-size: 12px;
  }
}
.movie-plan {
  transition: all 0.2s;
  background-color: #fff;
  overflow: hidden;
  height: 100%;
  &.full {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .movie-plan-tool {
    height: 56px;
    background-color: #f2f4fd;
    margin-bottom: 12px;
    .plan-tool-l {
      float: left;
      height: 56px;
      box-sizing: border-box;
      padding: 12px 0 0 8px;
      background-color: #edf1fd;
      border-right: 1px solid #fff;
      .plan-tool-l-break {
        float: left;
        width: 1px;
        height: 48px;
        background-color: rgb(199, 215, 254);
        position: relative;
        top: -8px;
        margin: 0 3px 0 10px;
      }
      // .el-select {
      //     float: left;
      // }
      // .el-select .el-input.is-focus .el-input__inner {
      //     border-color: #3b74ff;
      // }
      .cinema-con-button {
        float: left;
        width: 152px;
        height: 32px;
        font-size: 12px;
        color: #333;
        padding-left: 8px;
        border-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #fff;
        &:hover {
          background-color: #fff;
        }
        &:active {
          border-color: #3b74ff;
        }
      }
      .el-select .el-input--suffix {
        float: left;
        width: 152px;
        height: 32px;
        .el-input__inner {
          height: 32px !important;
          font-size: 12px;
          color: #333;
          padding-left: 8px;
          border-color: transparent;
        }

        .el-input__icon {
          line-height: 32px;
          font-size: 12px;
        }
      }
      .price-plan {
        width: 200px;
        padding-left: 10px;
        float: left;
        height: 100%;
        box-sizing: border-box;
        .price-plan-label {
          display: inline-block;
          height: 32px;
          line-height: 32px;
          width: 60px;
          font-size: 12px;
          color: #333;
          margin-right: 2px;
        }
        .el-select .el-input--suffix {
          width: 112px;
        }
      }
      .date-picker-con {
        font-size: 0;
        float: left;
        width: 189px;
        height: 32px;
        padding-left: 24px;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        .el-date-editor.el-input {
          width: 140px;
        }
        .date-picker-prev,
        .date-picker-next,
        .date-picker-week {
          position: absolute;
          width: 23px;
          height: 100%;
          top: 0;
          z-index: 9;
          text-align: center;
          line-height: 32px;
          color: rgb(103, 103, 103);
          font-size: 12px;
        }
        .date-picker-week {
          font-size: 12px;
          line-height: 32px;
          color: #666;
          width: 45px;
          text-align: left;
          left: 36px;
          pointer-events: none;
        }
        .date-picker-prev {
          left: 0;
        }
        .date-picker-next {
          right: 0;
        }
        .el-input__prefix {
          display: none;
        }
        .el-input__inner {
          width: 140px;
          height: 32px;
          color: #333;
          font-size: 12px;
          border-color: transparent;
          padding-left: 58px;
          padding-right: 0;
          cursor: pointer;
        }
        .el-input__inner:focus {
          border-color: #3b74ff;
        }
      }
    }
    .plan-tool-r {
      width: calc(100% - 578px);
      float: left;
      .plan-menu-area {
        float: left;
        height: 56px;
        overflow: hidden;
      }
      .plan-menu-area .meun-area-l {
        float: left;
        height: 100%;
      }
      .plan-menu-area .meun-area-r {
        float: right;
        height: 100%;
      }
      .plan-menu-group {
        display: inline-block;
        height: 56px;
        .plan-single-menu {
          text-align: center;
          height: 100%;
          box-sizing: border-box;
          // float: left;
          display: inline-block;
          padding-top: 10px;
          cursor: pointer;
          .plan-menu-name {
            padding: 4px 10px;
            font-size: 12px;
            color: #666;
            letter-spacing: 1px;
            line-height: 16px;
          }
          .plan-tool-icon {
            font-size: 14px;
            color: #3b74ff;
          }
          // &:hover {
          //     background-color: #3b74ff;
          //     .plan-menu-name,
          //     .plan-tool-icon {
          //         color: #fff;
          //     }
          // }
        }
      }
      .plan-more-menu {
        width: 48px;
        float: right;
        height: 100%;
        line-height: 56px;
        text-align: center;
        letter-spacing: 1px;
        color: #666;
        font-size: 12px;
        cursor: pointer;
      }
      .plan-tool-l-break {
        float: right;
        width: 1px;
        height: 48px;
        background-color: rgb(199, 215, 254);
        position: relative;
        top: 5px;
        margin: 0 5px 0 0;
      }
    }
  }
  .int-plan-setting {
    font-size: 12px;
    color: #666;
    .el-form-item__label {
      font-size: 12px;
      color: #666;
    }
    .form-child-head {
      font-size: 12px;
      color: #666;
      height: 16px;
      line-height: 16px;
      margin-bottom: 16px;
      span {
        font-size: 12px;
        color: #bcbcbc;
      }
    }
    .el-form-item {
      height: 32px;
      line-height: 32px;
      margin-bottom: 8px;
      padding-left: 26px;
      &.turnover-count {
        .el-input {
          width: 80px;
          height: 32px;
          line-height: 32px;
          font-size: 12px;
          margin-right: 8px;
        }
      }
    }
  }
  .el-table {
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
        // height: 20px;
        // line-height: 20px;
        // font-size: 12px;\
        display: inline-block;
        .el-input__inner {
          width: 80px;
        }
      }
    }
  }
  .edit-cichannel-table {
    .cell {
      span {
        display: inline-block;
        font-size: 12px;
      }
      .input-con {
        // width: 120px;
        vertical-align: middle;
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
.el-popover {
  padding: 0;
  .plan-single-menu {
    width: 76px;
    height: 67px;
    text-align: center;
    // height: 100%;
    box-sizing: border-box;
    float: left;
    padding-top: 8px;
    cursor: pointer;
    .plan-menu-name {
      padding: 4px 10px;
      font-size: 12px;
      color: #666;
      letter-spacing: 1px;
      line-height: 16px;
    }
    .plan-tool-icon {
      font-size: 14px;
      color: #3b74ff;
    }
    // &:hover {
    // 	background-color: #3b74ff;
    // 	.plan-menu-name,
    // 	.plan-tool-icon {
    // 		color: #fff;
    // 	}
    // }
  }
  .plan-menu-group {
    .el-dropdown {
      float: left;
    }
  }
}
.el-select-dropdown__item {
  box-sizing: border-box;
  height: 32px;
  line-height: 32px;
  padding: 0 8px;
  background-color: #fff;
  font-weight: normal;
  span {
    font-size: 12px;
    color: #666;
  }
  &.selected {
    font-weight: normal;
    span {
      color: #3b74ff;
    }
  }
  &.hover {
    background-color: #f5f5f5;
  }
}
.el-date-picker,
.el-date-picker.has-sidebar {
  width: 224px;
  border: none;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  .el-picker-panel__body {
    margin-left: 0;
    border-bottom: 1px solid #ebeef5;
  }
  .el-picker-panel__sidebar {
    width: 100%;
    height: 32px;
    bottom: -32px;
    left: 0;
    right: 0;
    top: auto;
    border: none;
    padding: 0;
    box-shadow: 0px 6px 12px 0 rgba(0, 0, 0, 0.1);
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
    .el-picker-panel__shortcut {
      text-align: center;
      color: #3b74ff;
      padding: 0;
    }
  }
  .el-date-picker__header {
    padding: 0px 6px;
    margin: 0;
    border-bottom: solid 1px #ebeef5;
    .el-date-picker__header-label {
      color: #666;
      font-size: 12px;
    }
    .el-picker-panel__icon-btn {
      color: #666;
      font-weight: 700;
    }
  }
  .el-picker-panel__content {
    width: 100%;
    margin: 0;
    th {
      width: 32px;
      height: 32px;
      padding: 0;
      line-height: 32px;
      font-size: 12px;
      color: #bcbcbc;
      border-bottom: none;
    }
    .el-date-table td {
      padding: 0;
      height: 32px;
      div {
        padding: 0;
        height: 100%;
        span {
          display: block;
          width: 100%;
          height: 100%;
          line-height: 32px;
          border-radius: 2px;
          font-size: 12px;
          color: #666;
        }
      }
    }
    .el-date-table td.today {
      span {
        color: #409eff;
      }
    }
    .el-date-table td.current {
      span {
        color: #fff;
      }
    }
    .el-date-table td:hover {
      background-color: #f2f4fd;
    }
    .el-date-table .prev-month span,
    .el-date-table .next-month span {
      color: #bcbcbc;
    }
    .el-date-table .prev-month:hover,
    .el-date-table .next-month:hover {
      background-color: #fff;
    }
  }
}
.el-dialog__footer {
  .footer-button-con {
    .el-button + .el-button {
      margin-left: 30px;
    }
  }
}
.el-popup-parent--hidden {
  .el-table td {
    border-bottom: 1px solid #f0f0f0 !important;
  }
  // .el-table--enable-row-transition .el-table__body td{
  //     border:1px solid #000;
  // }
  // .el-table th.is-leaf{
  //     border:1px solid #000;
  // }
}
</style>