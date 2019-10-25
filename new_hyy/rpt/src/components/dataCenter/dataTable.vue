<template>
  <div class="datacenter-main">
    <!-- <div class="group-btn">
      <div class="group-btn-list">
        <div class="group-btn-item" v-for="(item, index) in styleGroupArr" :key="`group_${index}`">
          <span>{{ item.groupColName }}</span>
          <i class="el-icon-close" @click="handleIconClick(index)"></i>
        </div>
      </div>
      <div class="grouop-btn-tips" v-if="styleGroupArr.length<7">
        <span>拖动表头添加分组(最多支持七个)</span>
      </div>
    </div>-->
    <el-table class="no-group-table table-wapper" stripe border row-key="id" v-if="styleGroupArr.length == 0" v-loading="tableLoading" ref="datatable" @cell-click="cellClick" :data="dataTableObj.noGroupTableData" :show-summary="reportCode == 'Q02' ? false : true" :summary-method="getSummaries" :header-row-style="headerRowStyle" :header-cell-style="headerCellStyle">
      <el-table-column v-for="(item, index) in tableStyleColArr" :key="`table_${index}${Math.random()}`" :prop="dataTableObj.noGroupStyleColArr[index].prop" :label="item.label" :width="item.width">
        <template slot="header" slot-scope="scope">
          <!-- <draggable
            v-model="tableStyleColArr"
            :options="{group:{name:'table', pull: 'clone'}}"
            element="div"
            >-->
          <div class="icon" style="height: 38px; line-height: 38px;">
            <span>{{ scope.column.label }}</span>
            <span style="width:15px; height: 38px; line-height: 38px;" class="select-icon" @click="handleSearchClick(scope.column, scope.$index)" v-if="item.colType === 1">
              <i :id="`${scope.$index}btn`" ref="search-icon" class="iconfont icon-baobiao-shaixuan" @mouseenter="handleMouseEnter(scope.$index)" @mouseleave="handleMouseLeave(scope.$index)" :style="{color: dataTableObj.searchBtnColor[`${reportCode}_${scope.$index}`]}" />
            </span>
            <span class="sort-icon" style="margin-left: 4px;">
              <i class="el-icon-caret-top nogroup-ascsort nogroup-sort" @click="noGroupAscSortClick(scope.column.property, scope.$index)" />
              <i class="el-icon-caret-bottom nogroup-descsort nogroup-sort" @click="noGroupDescSortClick(scope.column.property, scope.$index)" />
            </span>
          </div>
          <!-- </draggable> -->
        </template>
        <template slot-scope="scope">
          <span :style="`${dataTableObj.outsideUrlArr.some(item => item.prop == scope.column.property && item.outsideUrl !== '' && item.outsideUrl != null) ? 'text-decoration:underline;cursor:pointer' : 'text-decoration:none'}`">{{scope.row[scope.column.property]}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="group-table table-wrapper" v-if="styleGroupArr.length > 0 && !mergeTableObj.isMerged" v-loading="tableLoading" ref="groupDatatable">
      <div class="el-table__header-wrapper group-header-wrapper" :style="`width: ${dataTableObj.widthTotal + 8}px`">
        <table class="el-table" :style="`width: ${dataTableObj.widthTotal + 8}px`">
          <tr class="header-tr">
            <template v-for="(item,index) in tableStyleColArr">
              <th :width="item.width-1" :key="`groupTable1_${index}${Math.random()}`">
                <div class="cell" :style="{width: `${item.width-1}px`}">
                  <!-- <i v-if="index === 0" class="merge-button el-icon-menu"></i> -->
                  <div class="label">{{ item.label }}</div>
                  <div class="sort-icon">
                    <i class="el-icon-caret-top group-ascsort group-sort" @click="groupSortClick(item.colKey, 'ASC', index)"></i>
                    <i class="el-icon-caret-bottom group-descsort group-sort" @click="groupSortClick(item.colKey, 'DESC', index)"></i>
                  </div>
                </div>
              </th>
            </template>
          </tr>
        </table>
      </div>

      <div class="el-table__body-wrapper" :style="`width: ${dataTableObj.widthTotal + 8}px`">
        <table v-if="this.datatable.length > 0" class="el-table" :style="`width: ${dataTableObj.widthTotal + 8}px`">
          <!-- 第一分组 -->
          <template v-for="(item,index) in datatable">
            <tr class="el-table__row trName" :key="`groupTable2_${index}${Math.random()}`">
              <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                <div class="cell">
                  <div class="typestyle">
                    <i class="el-icon-circle-plus-outline new-icon" v-show="item.isShow == 'true'" @click="showChildTr(item.childGroupArr, item.groupColKey, item.groupColValue,index)"></i>
                    <i class="el-icon-remove-outline new-icon" v-show="item.isShow  == 'false'" @click="closeChildTr(index)"></i>
                  </div>
                  {{ item.groupColValue }}
                </div>
              </td>
            </tr>
            <template v-for="(children,index1) in item.childrenDatas1" v-if="item.childGroupArr.length == 0">
              <tr class="el-table__row trvalueKey1 trName1" :key="`groupTable3_${index1}${Math.random()}`">
                <template v-for="(el, idx) in children.rowData">
                  <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`groupTable4_${idx}${Math.random()}`">
                    <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                  </td>
                </template>
              </tr>
            </template>

            <!-- 第二分组 -->
            <template v-for="(children,index1) in item.childrenDatas1" v-if="item.childGroupArr.length != 0 ">
              <tr class="el-table__row trName1" :key="`groupTable5_${index1}${Math.random()}`">
                <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                  <div class="cell trName1-cell">
                    <div class="typestyle">
                      <i class="el-icon-circle-plus-outline new-icon" v-show="children.isShow == 'true'" @click="showChildTr1(children.childGroupArr,children.groupColKey,children.groupColValue,index1,index)"></i>
                      <i class="el-icon-remove-outline new-icon" v-show="children.isShow == 'false'" @click="closeChildTr1(index1,index)"></i>
                    </div>
                    {{ children.groupColValue }}
                  </div>
                </td>
              </tr>
              <template v-for="(children1,index2) in children.childrenDatas1" v-if="children.childGroupArr.length == 0 ">
                <tr class="el-table__row trvalueKey2 trName2" :key="`groupTable6_${index2}${Math.random()}`">
                  <template v-for="(el,idx) in children1.rowData">
                    <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`groupTable7_${idx}${Math.random()}`">
                      <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                    </td>
                  </template>
                </tr>
              </template>

              <!-- 第三分组 -->
              <template v-for="(children1,index2) in children.childrenDatas1" v-if="children.childGroupArr.length != 0 ">
                <tr class="el-table__row trName2" :key="`groupTable8_${index2}${Math.random()}`">
                  <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                    <div class="cell trName2-cell">
                      <div class="typestyle">
                        <i class="el-icon-circle-plus-outline new-icon" v-show="children1.isShow == 'true'" @click="showChildTr2(children1.childGroupArr,children1.groupColKey,children1.groupColValue,index2,index1,index)"></i>
                        <i class="el-icon-remove-outline new-icon" v-show="children1.isShow == 'false'" @click="closeChildTr2(index2,index1,index)"></i>
                      </div>
                      {{ children1.groupColValue }}
                    </div>
                  </td>
                </tr>
                <template v-for="(children2,index3) in children1.childrenDatas1" v-if="children1.childGroupArr.length == 0 ">
                  <tr class="el-table__row trvalueKey3 trName3" :key="`${index3}${Math.random()}`">
                    <template v-for="(el, idx) in children2.rowData">
                      <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`groupTable9_${idx}${Math.random()}`">
                        <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                      </td>
                    </template>
                  </tr>
                </template>

                <!-- 第四分组 -->
                <template v-if="children1.childGroupArr.length != 0 ">
                  <template v-for="(fourthItem,fourthIndex) in children1.childrenDatas1">
                    <tr class="el-table__row trName3" :key="`fourth_${fourthIndex}_${Math.random()}`">
                      <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                        <div class="cell trName3-cell">
                          <div class="typestyle">
                            <i class="el-icon-circle-plus-outline new-icon" v-show="fourthItem.isShow == 'true'" @click="showChildTr3(fourthItem.childGroupArr,fourthItem.groupColKey,fourthItem.groupColValue,fourthIndex,index2,index1,index)"></i>
                            <i class="el-icon-remove-outline new-icon" v-show="fourthItem.isShow == 'false'" @click="closeChildTr3(fourthIndex,index2,index1,index)"></i>
                          </div>
                          {{ fourthItem.groupColValue }}
                        </div>
                      </td>
                    </tr>
                    <template v-if="fourthItem.childGroupArr.length == 0">
                      <template v-for="(fourthChild,fourthChildIndex) in fourthItem.childrenDatas1">
                        <tr class="el-table__row trvalueKey4 trName4" :key="`fourthChild_${fourthChildIndex}_${Math.random()}`">
                          <template v-for="(el, idx) in fourthChild.rowData">
                            <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`fourth_child_detail_${idx}_${Math.random()}`">
                              <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                            </td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <!-- 第五分组 -->
                    <template v-if="fourthItem.childGroupArr.length != 0 ">
                      <template v-for="(fifthItem,fifthIndex) in fourthItem.childrenDatas1">
                        <tr class="el-table__row trName4" :key="`fifth${fifthIndex}_${Math.random()}`">
                          <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                            <div class="cell trName4-cell">
                              <div class="typestyle">
                                <i class="el-icon-circle-plus-outline new-icon" v-show="fifthItem.isShow == 'true'" @click="showChildTr4(fifthItem.childGroupArr,fifthItem.groupColKey,fifthItem.groupColValue,fifthIndex,fourthIndex,index2,index1,index)"></i>
                                <i class="el-icon-remove-outline new-icon" v-show="fifthItem.isShow == 'false'" @click="closeChildTr4(fifthIndex,fourthIndex,index2,index1,index)"></i>
                              </div>
                              {{ fifthItem.groupColValue }}
                            </div>
                          </td>
                        </tr>
                        <template v-if="fifthItem.childGroupArr.length == 0">
                          <template v-for="(fifthChild,fifthChildIndex) in fifthItem.childrenDatas1">
                            <tr class="el-table__row trvalueKey5 trName5" :key="`fifthChild_${fifthChildIndex}_${Math.random()}`">
                              <template v-for="(el, idx) in fifthChild.rowData">
                                <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`fifth_child_detail_${idx}_${Math.random()}`">
                                  <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                                </td>
                              </template>
                            </tr>
                          </template>
                        </template>
                        <!-- 第六分组 -->
                        <template v-if="fifthItem.childGroupArr.length != 0 ">
                          <template v-for="(sixthItem,sixthIndex) in fifthItem.childrenDatas1">
                            <tr class="el-table__row trName5" :key="`sixth${sixthIndex}_${Math.random()}`">
                              <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                                <div class="cell trName5-cell">
                                  <div class="typestyle">
                                    <i class="el-icon-circle-plus-outline new-icon" v-show="sixthItem.isShow == 'true'" @click="showChildTr5(sixthItem.childGroupArr,sixthItem.groupColKey,sixthItem.groupColValue,sixthIndex,fifthIndex,fourthIndex,index2,index1,index)"></i>
                                    <i class="el-icon-remove-outline new-icon" v-show="sixthItem.isShow == 'false'" @click="closeChildTr5(sixthIndex,fifthIndex,fourthIndex,index2,index1,index)"></i>
                                  </div>
                                  {{ sixthItem.groupColValue }}
                                </div>
                              </td>
                            </tr>
                            <template v-if="sixthItem.childGroupArr.length == 0">
                              <template v-for="(sixthChild,sixthChildIndex) in sixthItem.childrenDatas1">
                                <tr class="el-table__row trvalueKey5 trName5" :key="`sixthChild_${sixthChildIndex}_${Math.random()}`">
                                  <template v-for="(el, idx) in sixthChild.rowData">
                                    <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`sixth_child_detail_${idx}_${Math.random()}`">
                                      <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                                    </td>
                                  </template>
                                </tr>
                              </template>
                            </template>

                            <!-- 第七分组 -->
                            <template v-if="sixthItem.childGroupArr.length != 0 ">
                              <template v-for="(seventhItem,seventhIndex) in sixthItem.childrenDatas1">
                                <tr class="el-table__row trName6" :key="`seventh${seventhIndex}_${Math.random()}`">
                                  <td :colspan="styleColArr.length" :style="`width: ${dataTableObj.widthTotal + 8}px`">
                                    <div class="cell trName6-cell">
                                      <div class="typestyle">
                                        <i class="el-icon-circle-plus-outline new-icon" v-show="seventhItem.isShow == 'true'" @click="showChildTr6(seventhItem.childGroupArr,seventhItem.groupColKey,seventhItem.groupColValue,seventhIndex,sixthIndex,fifthIndex,fourthIndex,index2,index1,index)"></i>
                                        <i class="el-icon-remove-outline new-icon" v-show="seventhItem.isShow == 'false'" @click="closeChildTr6(seventhIndex,sixthIndex,fifthIndex,fourthIndex,index2,index1,index)"></i>
                                      </div>
                                      {{ seventhItem.groupColValue }}
                                    </div>
                                  </td>
                                </tr>
                                <template v-if="seventhItem.childGroupArr.length == 0">
                                  <template v-for="(seventhChild,seventhChildIndex) in seventhItem.childrenDatas1">
                                    <tr class="el-table__row trvalueKey6 trName6" :key="`seventhChild_${seventhChildIndex}_${Math.random()}`">
                                      <template v-for="(el, idx) in seventhChild.rowData">
                                        <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`seventh_child_detail_${idx}_${Math.random()}`">
                                          <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                                        </td>
                                      </template>
                                    </tr>
                                  </template>
                                </template>
                                <!-- 第七分组详情数据 -->
                                <tr class="el-table__row new-sunColor trvalueKey6 trName6" :key="`seventh_detail_${seventhIndex}_${Math.random()}`">
                                  <template v-for="(el, index) in seventhItem.rowData">
                                    <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`seventh_detail_item_${index}_${Math.random()}`">
                                      <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                                    </td>
                                  </template>
                                </tr>
                              </template>
                            </template>

                            <!-- 第六分组详情数据 -->
                            <tr class="el-table__row new-sunColor trvalueKey5 trName5" :key="`sixth_detail_${sixthIndex}_${Math.random()}`">
                              <template v-for="(el, index) in sixthItem.rowData">
                                <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`sixth_detail_item_${index}_${Math.random()}`">
                                  <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                                </td>
                              </template>
                            </tr>
                          </template>
                        </template>

                        <!-- 第五分组详情数据 -->
                        <tr class="el-table__row new-sunColor trvalueKey4 trName4" :key="`fifth_detail_${fifthIndex}_${Math.random()}`">
                          <template v-for="(el, index) in fifthItem.rowData">
                            <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`fifth_detail_item_${index}_${Math.random()}`">
                              <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                            </td>
                          </template>
                        </tr>
                      </template>
                    </template>
                    <!-- 第四分组详情数据 -->
                    <tr class="el-table__row new-sunColor trvalueKey3 trName3" :key="`fourth_detail_${fourthIndex}_${Math.random()}`">
                      <template v-for="(el, index) in fourthItem.rowData">
                        <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`fourth_detail_item_${index}_${Math.random()}`">
                          <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                        </td>
                      </template>
                    </tr>
                  </template>
                </template>

                <!-- 第三分组详情数据 -->
                <tr class="el-table__row new-sunColor trvalueKey2 trName2" :key="`groupTable10_${index2}${Math.random()}`">
                  <template v-for="(el, index) in children1.rowData">
                    <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`groupTable11_${index}${Math.random()}`">
                      <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                    </td>
                  </template>
                </tr>
              </template>

              <!-- 第二分组详情数据 -->
              <tr class="el-table__row new-sunColor trvalueKey1 trName1" :key="`groupTable12_${index1}${Math.random()}`">
                <template v-for="(el, itemIndex) in children.rowData">
                  <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`groupTable13_${itemIndex}${Math.random()}`">
                    <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                  </td>
                </template>
              </tr>
            </template>

            <!-- 第一分组详情数据 -->
            <tr class="el-table__row new-sunColor trvalueKey trName" :key="`groupTable14_${index}${Math.random()}`">
              <template v-for="(el,idx) in item.rowData">
                <td class="el-table_13_column_55" :width="el.colWidth-1" :key="`groupTable15_${idx}${Math.random()}`">
                  <div class="cell" :style="{width: `${el.colWidth-1}px` }">{{ el.colValue }}</div>
                </td>
              </template>
            </tr>
          </template>
        </table>
      </div>

      <div class="el-table__footer-wrapper" :style="`width: ${dataTableObj.widthTotal}px`" v-if="!(reportCode == 'Q02')">
        <table class="el-table" :style="`width: ${dataTableObj.widthTotal}px`">
          <tr>
            <td class="el-table_13_column_55" v-for="(summaryItem, idx) in this.summary" :width="summaryItem.colWidth" :key="`groupTable16_${idx}${Math.random()}`">
              <div class="cell" :style="{width: `${summaryItem.colWidth - 1}px`}">{{ summaryItem.colValue }}</div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="this.datatable.length === 0 && tableLoading === false && mergeTableObj.isMerged" class="no-data">没有数据</div>
    <table-searcher :dialogVisible="dialogVisible" :colKey="colKey" :colData="dataTableObj.colData" :tableSearcherObj="tableSearcherObj" @sendSelectStatus="getSelectStatus" @sendDialog1Visible="getDialog1Visible" @sendAdvancedData="getAdvancedData"></table-searcher>
    <table-filter :dialogVisible1="dialogVisible1" :searchData="dataTableObj.searchData" :colKey="colKey" :tableName="tableName" :reportCode="reportCode" :advancedData="dataTableObj.advancedData" :tableFilterObj="tableFilterObj" :querySearchData="tableFilterObj.inputData" @showDetailDialog="showDetailDialog" @sendSelectStatus="getSelectStatus" @setScrollStatus="setScrollStatus"></table-filter>
    <el-dialog title="子表查看" :visible.sync="sonTableDialogVisible" @close="closeDialog">
      <div class="choose_table">
        <div>
          <el-table :data="dataTableObj.noGroupTableData" :cell-style="{padding:0}" :row-style="{height:30}" :header-cell-style="{padding:0}" :height="354" ref="multipleTable" v-loading="sonTableLoading">
            <!-- <el-table-column
                v-for="(item, index) in sonTableTitle"
                :key="`sonTable_${index}${Math.random()}`"
                :prop="sonStyleColArr[index].prop"
                :label="item.colName"
                :width="item.width"
            ></el-table-column>-->
            <el-table-column v-for="(item, index) in tableStyleColArr" :key="`table_${index}${Math.random()}`" :prop="dataTableObj.noGroupStyleColArr[index].prop" :label="item.label" :width="item.width"></el-table-column>
          </el-table>
          <!-- <el-pagination
                @current-change="sonCurrentChange"
                background
                :current-page.sync="sonPagination.pageNum"
                :page-size="sonPagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="sonPagination.total"
                class="rpt-pagination"
          ></el-pagination>-->
          <div class="sonTable-pagination">
            <el-pagination @current-change="sonCurrentChange" background :current-page.sync="Pagination.pageNum" :page-size="Pagination.pageSize" layout="total, prev, pager, next, jumper" :total="Pagination.total" class="rpt-pagination"></el-pagination>
          </div>
        </div>
      </div>
      <div style="height:12px;background:transparent;"></div>
      <!-- <div class="btn-area">
          <el-button type="primary" @click="comfirmClick" style="margin-right:22px;">确定</el-button>
          <el-button @click="cancelClick">取消</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>
<script>
import datacenterBus from 'rptSrc/util/datacenterBus.js';
import TableSearcher from './dataCommon/tableSearcher';
import TableFilter from './dataCommon/tableFilter';
import { ascCompare, descCompare } from '../../util/complexSort.js';
import { messageAlertFunc } from 'rptSrc/util/commonFunc.js';
import Print from 'rptSrc/util/prints';
import Vue from 'vue';
import { mapState } from 'vuex';
import Draggable from 'vuedraggable';
import Sortable from 'sortablejs';

let szArray = arr => {
  const m = arr.slice(1);
  const t = m.push({ operation: '=' });
  return t;
};

let getDom = className => {
  return document.getElementsByClassName(className);
};

export default {
  props: {
    Pagination: Object,
    colArr: Array,
    baseQueryArr: Array,
    styleExtQueryArr: Array,
    datatable: Array,
    groupArr: Array,
    styleGroupArr: Array,
    styleColArr: Array,
    tableStyleColArr: Array,
    tableName: String,
    reportCode: String,
    tableLoading: Boolean,
    colSummary: Object, // 列汇总数据
    summary: Array, // 分组列汇总数据,
    dataTableObj: Object,
    tableFilterObj: Object,
    tableSearcherObj: Object,
    mergeTableObj: Object,
    sonTableLoading: Boolean,
    cinemaUid: String
  },
  data () {
    return {
      sonTableDialogVisible: false,
      sonTableData: [],
      sonPagination: {
        // 默认显示第几页
        currentPage: 1,
        // 每页显示多少调数据
        pagesize: 15,
        // 设置每页显示多少条
        page_sizes: [15, 20, 50, 100],
        // 数据总数
        total: 0
      },
      sonStyleColArr: [],
      sonTableTitle: [],
      sonTableParams: {},
      childGroupArr: [],
      tableData2: [],
      cValue1: {},
      cValue2: {},
      cValue3: {},
      cValue4: {},
      cValue5: {},
      cValue6: {},
      cValue7: {},
      show: true,
      colKey: '',
      colValue: '',
      dialogVisible: false,
      dialogVisible1: false,
      selectStatus: '',
      itemIndex: '',
      itemValue: '',
      count: 0,
      colspan: '',
      copys: '',
      scrollStatus: false,
      headerRowStyle: {
        width: this.dataTableObj.widthTotal,
        height: '36px',
        lineHeight: '36px',
        background: '#E7EBFF',
        boxSizing: 'border-box'
      },
      headerCellStyle: {
        background: '#E7EBFF',
        height: '36px',
        lineHeight: '36px',
        boxSizing: 'border-box'
      }
    };
  },
  components: {
    TableSearcher,
    TableFilter,
    Draggable
  },
  computed: mapState({
    isFilted: state => state.rpt.isFilted,
    colData: state => state.rpt.colData
  }),
  watch: {
    datatable: {
      handler (newVal, oldVal) {
        newVal.forEach((element, index) => {
          element.id = index;
        });
        this.dataTableObj.noGroupTableData = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    },
    tableStyleColArr: {
      handler (newVal, oldVal) {
        this.dataTableObj.outsideUrlArr = newVal.filter(
          element => element.outsideUrl != null
        );
        this.dataTableObj.noGroupStyleColArr = JSON.parse(
          JSON.stringify(newVal)
        );
        // this.tableHeaderArr = JSON.parse(JSON.stringify(newVal));
      },
      deep: true
    },
    isFilted (newVal, oldVal) {
      if (newVal) {
        let nogroupSort, groupSort;
        if (this.styleGroupArr.length === 0) {
          nogroupSort = getDom('nogroup-sort');
          for (let i = 0; i < nogroupSort.length; i++) {
            nogroupSort[i].style.color = '#999999';
          }
        } else {
          groupSort = getDom('group-sort');
          for (let i = 0; i < groupSort.length; i++) {
            groupSort[i].style.color = '#999999';
          }
        }
      }
    }
    // styleGroupArr: {
    //   handler(newVal, oldVal) {
    //     if (!this.mergeTableObj.isMerged) {
    //       const self = this;
    //       if (this.styleGroupArr.length == 0) {
    //         setTimeout(() => {
    //           let tableWrapper = getDom("el-table__header")[0];
    //           let th = tableWrapper.children[1].children[0];
    //           new Sortable(th, {
    //             group: { name: "table1", pull: "clone" },
    //             onEnd({ item }) {
    //               if (self.cinemaUid === "") {
    //                 console.log("aaa");
    //                 self.$message({
    //                   message: "请先选择影院",
    //                   iconClass: "iconfont icon-danchuang-jingtanhao",
    //                   customClass: "rpt-alert-message",
    //                   center: "true"
    //                 });
    //               } else {
    //                 console.log("bbb");
    //                 let headerItem =
    //                   item.children[0].children[0].children[0].innerText;
    //                 let temArray = [];
    //                 temArray.push(headerItem);
    //                 if (self.styleGroupArr.length == 0) {
    //                   self.tableStyleColArr.forEach((element, index) => {
    //                     if (element.colName == headerItem) {
    //                       self.styleGroupArr.push({
    //                         groupColKey: element.colKey,
    //                         groupColName: element.colName,
    //                         seq: 1
    //                       });
    //                       let deleteIndex = self.groupArr.findIndex(element1 => element1.groupColKey == element.colKey);
    //                       self.groupArr.splice(deleteIndex, 1);
    //                       self.groupArr.forEach((element, index) => {
    //                         element.seq = index + 1;
    //                       })
    //                     }
    //                   });
    //                 } else {
    //                   self.tableStyleColArr.forEach((element1, index) => {
    //                     if (element1.colName == headerItem) {
    //                       if (
    //                         !self.styleGroupArr.some(
    //                           element2 => element2.groupColName == headerItem
    //                         )
    //                       ) {
    //                         self.styleGroupArr.push({
    //                           groupColKey: element1.colKey,
    //                           groupColName: element1.colName,
    //                           seq: self.styleGroupArr.length + 1
    //                         });
    //                         let deleteIndex = self.groupArr.findIndex(element => element.groupColKey == element1.colKey);
    //                         self.groupArr.splice(deleteIndex, 1);
    //                         self.groupArr.forEach((element, index) => {
    //                           element.seq = index + 1;
    //                         })
    //                       }
    //                     }
    //                   });
    //                 }
    //               }
    //             }
    //           });
    //         }, 1000);
    //       } else {
    //         setTimeout(() => {
    //           let headerTR = getDom("header-tr")[0];
    //           let groupBtnList = getDom("group-btn-list")[0];
    //           console.log(headerTR);
    //           new Sortable(headerTR, {
    //             group: { name: "table2", pull: "clone" },
    //             onEnd({ item }) {
    //               console.log(item);
    //               if (self.styleGroupArr.length >= 7) {
    //                 self.$message({
    //                   message: "分组至多七个",
    //                   iconClass: "iconfont icon-danchuang-jingtanhao",
    //                   customClass: "rpt-alert-message",
    //                   center: "true"
    //                 });
    //               } else if (self.cinemaUid === "") {
    //                 self.$message({
    //                   message: "请先选择影院",
    //                   iconClass: "iconfont icon-danchuang-jingtanhao",
    //                   customClass: "rpt-alert-message",
    //                   center: "true"
    //                 });
    //               } else {
    //                 let headerItem = item.children[0].children[0].innerText;
    //                 let temArray = [];
    //                 temArray.push(headerItem);
    //                 if (self.styleGroupArr.length == 0) {
    //                   self.tableStyleColArr.forEach((element, index) => {
    //                     if (element.colName == headerItem) {
    //                       self.styleGroupArr.push({
    //                         groupColKey: element.colKey,
    //                         groupColName: element.colName,
    //                         seq: 1
    //                       });
    //                       let deleteIndex = self.groupArr.findIndex(element1 => element1.groupColKey == element.colKey);
    //                       self.groupArr.splice(deleteIndex, 1);
    //                       self.groupArr.forEach((element, index) => {
    //                         element.seq = index + 1;
    //                       })
    //                     }
    //                   });
    //                 } else {
    //                   self.tableStyleColArr.forEach((element1, index) => {
    //                     if (element1.colName == headerItem) {
    //                       console.log(self.styleGroupArr);
    //                       if (
    //                         self.styleGroupArr.every(
    //                           element2 => element2.groupColName !== headerItem
    //                         )
    //                       ) {
    //                         console.log(headerItem);
    //                         self.styleGroupArr.push({
    //                           groupColKey: element1.colKey,
    //                           groupColName: element1.colName,
    //                           seq: self.styleGroupArr.length + 1
    //                         });
    //                         let deleteIndex = self.groupArr.findIndex(element => element.groupColKey == element1.colKey);
    //                         self.groupArr.splice(deleteIndex, 1);
    //                         self.groupArr.forEach((element, index) => {
    //                           element.seq = index + 1;
    //                         })
    //                       }
    //                     }
    //                   });
    //                 }
    //               }
    //             }
    //           });
    //           new Sortable(groupBtnList, {
    //             group: { name: "table3", pull: "clone" },
    //             sort: true,
    //             onUpdate({ to, oldIndex, newIndex }) {
    //               let newItem = to.children[newIndex];
    //               let oldItem = to.children[oldIndex];
    //               to.removeChild(newItem);
    //               if (newIndex > oldIndex) {
    //                 to.insertBefore(newItem, oldItem);
    //               } else {
    //                 to.insertBefore(newItem, oldItem.nextSibling);
    //               }
    //               let item = self.styleGroupArr.splice(oldIndex, 1);
    //               self.styleGroupArr.splice(newIndex, 0, item[0]);

    //               self.styleGroupArr.forEach((element, index) => {
    //                 element.seq = index + 1;
    //               });
    //             }
    //           });
    //         }, 1000);
    //       }
    //     }
    //   }
    // }
  },
  methods: {
    handleIconClick (index) {
      let temItem = this.styleGroupArr[index];
      temItem.seq = this.groupArr.length + 1;
      this.styleGroupArr.splice(index, 1);
      this.groupArr.push(temItem);
      this.styleGroupArr.forEach((element, index) => {
        element.seq = index + 1;
      });
    },
    sonCurrentChange (currentPage) {
      this.sonPagination.currentPage = currentPage;
      this.getSonTableData();
    },
    closeDialog () {
      this.sonTableDialogVisible = false;
    },
    async cellClick (row, column, cell, event) {
      let currentTableHeader = this.styleColArr.filter(
        element => element.colKey == column.property
      )[0];
      if (
        currentTableHeader.outsideUrl != null &&
        currentTableHeader.outsideUrl !== ''
      ) {
        datacenterBus.$emit('setSonTableLoading', true);
        this.sonTableDialogVisible = true;
        let outsideSonUrl = currentTableHeader.outsideUrl
          .split('?')[0]
          .split('/')[3];
        let urlQuery = currentTableHeader.outsideUrl.split('?')[1].split('&');
        let outsideUrlQuery = [];
        let queryArr = [];
        urlQuery.forEach((element, index) => {
          let currentIndex = element.indexOf('=');
          let queryName = element.split('=')[0];
          let queryParam = element
            .split('=')[1]
            .substr(2, element.split('=')[1].length - 3);
          if (element[currentIndex + 1] == '$') {
            queryArr.push({
              operation: '=',
              queryColKey: queryName,
              queryColValue: row[queryParam]
            });
          }
          if (element[currentIndex + 1] == '#') {
            let baseQueryItem = this.baseQueryArr.filter(
              element => element.queryColKey == queryParam
            )[0];
            queryArr.push({
              operation: baseQueryItem.operation,
              queryColKey: queryName,
              queryColValue: baseQueryItem.queryColValue
            });
          }
        });
        queryArr = [
          {
            operation: '=',
            queryColKey: 'uid_cinema',
            queryColValue: '352249'
          },
          {
            operation: '=',
            queryColKey: 'coupon_code',
            queryColValue: '60307'
          },
          {
            operation: '>=,<=',
            queryColKey: 'show_time',
            queryColValue: '2019-07-28,2019-07-30'
          }
        ];
        this.sonTableParams = await this.$rptList.getSonTable(outsideSonUrl, {
          queryArr: queryArr
        });
        this.sonStyleColArr = this.sonTableParams.reportTableInfo.styleColArr;
        this.getSonTableData();
      }
    },
    async getSonTableData () {
      let params = {
        summaryFlag: 1,
        reportTableInfo: {
          reportCode: this.sonTableParams.reportTableInfo.reportCode,
          queryArr: queryArr,
          tableName: this.sonTableParams.reportTableInfo.tableName,
          colArr: this.sonTableParams.reportTableInfo.styleColArr,
          orderArr: []
        },
        pagingInfo: {
          startIndex: this.Pagination.currentPage,
          rows: this.Pagination.pagesize
        }
      };
      let sonRes = await this.$rptList.showReportData(params);
      this.sonTableData = JSON.parse(sonRes.data).list;
      this.sonPagination.total = JSON.parse(sonRes.data).totalNum;
      this.sonTableTitle = JSON.parse(sonRes.data).title;
      datacenterBus.$emit('setSonTableLoading', false);
    },
    showChildTr: function (a, b, c, d) {
      datacenterBus.$emit('tableLoading');
      this.cValue1 = { queryColKey: b, queryColValue: c, operation: '=' };
      let dValue = [];
      if (this.styleExtQueryArr != null) {
        dValue = JSON.parse(
          JSON.stringify(this.baseQueryArr.concat(this.styleExtQueryArr))
        );
      } else {
        dValue = JSON.parse(JSON.stringify(this.baseQueryArr));
      }
      dValue.push(this.cValue1);
      // 声明参数
      let param = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.tableStyleColArr,
          groupArr: a
        }
      };

      // 调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          this.$emit('newtableDataArrEvent', tableData2, d);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr: function (index) {
      this.$emit('closeNewtableDataArrEvent', index);
    },
    showChildTr1: function (a, b, c, d, e) {
      datacenterBus.$emit('tableLoading');
      this.cValue2 = { queryColKey: b, queryColValue: c, operation: '=' };
      const dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(this.cValue2, this.cValue1);

      // 声明参数
      let param = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.tableStyleColArr,
          groupArr: a
        }
      };

      // 调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          this.$emit('newtableDataArrEvent1', tableData2, d, e);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr1: function (index1, index) {
      this.$emit('closeNewtableDataArrEvent1', index1, index);
    },
    showChildTr2: function (a, b, c, d, e, f) {
      datacenterBus.$emit('tableLoading');
      this.cValue3 = { queryColKey: b, queryColValue: c, operation: '=' };
      const dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(this.cValue2, this.cValue1, this.cValue3);

      // 声明参数
      let param = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.tableStyleColArr,
          groupArr: a
        }
      };

      // 调用api，展示表格内容
      this.$rptList
        .showReportData(param)
        .then(data => {
          let tableData2 = JSON.parse(data.data);
          this.$emit('newtableDataArrEvent2', tableData2, d, e, f);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    closeChildTr2: function (index2, index1, index) {
      this.$emit('closeNewtableDataArrEvent2', index2, index1, index);
    },
    getGroupData (args, dValue, event) {
      datacenterBus.$emit('tableLoading');
      const params = {
        summaryFlag: 1,
        groupFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: dValue,
          tableName: this.tableName,
          colArr: this.tableStyleColArr,
          groupArr: args.childGroupArr
        }
      };
      this.$rptList
        .showReportData(params)
        .then(data => {
          this.$emit(event, JSON.parse(data.data), args);
        })
        .catch(msg => {
          console.log(msg);
        });
    },

    showChildTr3 (
      childGroupArr,
      groupColKey,
      groupColValue,
      fourthIndex,
      index2,
      index1,
      index
    ) {
      this.cValue4 = {
        queryColKey: groupColKey,
        queryColValue: groupColValue,
        operation: '='
      };
      let args = { childGroupArr, fourthIndex, index2, index1, index };
      let dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(this.cValue4, this.cValue3, this.cValue2, this.cValue1);
      this.getGroupData(args, dValue, 'newtableDataArrEvent3');
    },
    closeChildTr3 (fourthIndex, index2, index1, index) {
      this.$emit('closeNewtableDataArrEvent3', {
        fourthIndex,
        index2,
        index1,
        index
      });
    },
    showChildTr4 (
      childGroupArr,
      groupColKey,
      groupColValue,
      fifthIndex,
      fourthIndex,
      index2,
      index1,
      index
    ) {
      this.cValue5 = {
        queryColKey: groupColKey,
        queryColValue: groupColValue,
        operation: '='
      };
      let args = {
        childGroupArr,
        fifthIndex,
        fourthIndex,
        index2,
        index1,
        index
      };
      let dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(
        this.cValue5,
        this.cValue4,
        this.cValue3,
        this.cValue2,
        this.cValue1
      );
      this.getGroupData(args, dValue, 'newtableDataArrEvent4');
    },
    closeChildTr4 (fifthIndex, fourthIndex, index2, index1, index) {
      this.$emit('closeNewtableDataArrEvent4', {
        fifthIndex,
        fourthIndex,
        index2,
        index1,
        index
      });
    },
    showChildTr5 (
      childGroupArr,
      groupColKey,
      groupColValue,
      sixthIndex,
      fifthIndex,
      fourthIndex,
      index2,
      index1,
      index
    ) {
      this.cValue6 = {
        queryColKey: groupColKey,
        queryColValue: groupColValue,
        operation: '='
      };
      let args = {
        childGroupArr,
        sixthIndex,
        fifthIndex,
        fourthIndex,
        index2,
        index1,
        index
      };
      let dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(
        this.cValue6,
        this.cValue5,
        this.cValue4,
        this.cValue3,
        this.cValue2,
        this.cValue1
      );
      this.getGroupData(args, dValue, 'newtableDataArrEvent5');
    },
    closeChildTr5 (sixthIndex, fifthIndex, fourthIndex, index2, index1, index) {
      this.$emit('closeNewtableDataArrEvent5', {
        sixthIndex,
        fifthIndex,
        fourthIndex,
        index2,
        index1,
        index
      });
    },
    showChildTr6 (
      childGroupArr,
      groupColKey,
      groupColValue,
      seventhIndex,
      sixthIndex,
      fifthIndex,
      fourthIndex,
      index2,
      index1,
      index
    ) {
      this.cValue7 = {
        queryColKey: groupColKey,
        queryColValue: groupColValue,
        operation: '='
      };
      let args = {
        childGroupArr,
        seventhIndex,
        sixthIndex,
        fifthIndex,
        fourthIndex,
        index2,
        index1,
        index
      };
      let dValue = this.baseQueryArr.concat(this.styleExtQueryArr);
      dValue.push(
        this.cValue7,
        this.cValue6,
        this.cValue5,
        this.cValue4,
        this.cValue3,
        this.cValue2,
        this.cValue1
      );
      this.getGroupData(args, dValue, 'newtableDataArrEvent6');
    },
    closeChildTr6 (
      seventhIndex,
      sixthIndex,
      fifthIndex,
      fourthIndex,
      index2,
      index1,
      index
    ) {
      this.$emit('closeNewtableDataArrEvent6', {
        seventhIndex,
        sixthIndex,
        fifthIndex,
        fourthIndex,
        index2,
        index1,
        index
      });
    },
    noGroupAscSortClick (colKey, index) {
      messageAlertFunc(this, this.baseQueryArr.concat(this.styleExtQueryArr));
      this.sortClick(colKey, index, 'ASC');
    },
    noGroupDescSortClick (colKey, index) {
      messageAlertFunc(this, this.baseQueryArr.concat(this.styleExtQueryArr));
      this.sortClick(colKey, index, 'DESC');
    },
    // 无分组表格数据全排序
    sortClick (colKey, index, order) {
      let nogroupSort = getDom('nogroup-sort');
      let asc = getDom('nogroup-ascsort')[index];
      let desc = getDom('nogroup-descsort')[index];
      let queryArr = this.baseQueryArr.concat(this.tableFilterObj.colData);
      let sortArray = [
        {
          colKey: colKey,
          orderDesc: order
        }
      ];
      if (this.styleExtQueryArr != null) {
        queryArr = queryArr.concat(this.styleExtQueryArr);
      }
      let param = {
        summaryFlag: 1,
        reportTableInfo: {
          reportCode: this.reportCode,
          queryArr: queryArr,
          tableName: this.tableName,
          colArr: this.tableStyleColArr,
          orderArr: sortArray
        },
        pagingInfo: {
          startIndex: this.Pagination.currentPage,
          rows: this.Pagination.pagesize
        }
      };

      // 点击排序的箭头效果
      for (let i = 0; i < nogroupSort.length; i++) {
        nogroupSort[i].style.color = '#999999';
      }
      if (order === 'ASC') {
        asc.style.color = '#3b74ff';
      }
      if (order === 'DESC') {
        desc.style.color = '#3b74ff';
      }
      // 重置isFilted状态
      this.$store.commit('setIsFilted', false);
      this.$rptList
        .showReportData(param)
        .then(data => {
          var tableData = JSON.parse(data.data);
          this.$emit('tableDataArrEventNoGroup', tableData, sortArray);
        })
        .catch(msg => {
          console.log(msg);
        });
    },
    // 获取汇总行
    getSummaries: function (param) {
      let sumArr = [];
      for (var i = 0; i < this.tableStyleColArr.length; i++) {
        let colKey = this.tableStyleColArr[i].colKey;
        if (i == 0) {
          sumArr.push('合计');
        } else {
          if (typeof this.colSummary[colKey] == 'number') {
            sumArr.push(this.colSummary[colKey]);
          } else {
            sumArr.push(this.colSummary[colKey]);
          }
        }
      }
      return sumArr;
    },
    // 清空排序
    clearSort: function () {
      this.$refs.datatable.clearSort();
    },
    printTable: function () {
      Vue.use(Print);
      this.$print(this.$refs.datatable);
    },
    groupDatatable: function () {
      Vue.use(Print);
      this.$print(this.$refs.groupDatatable);
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    // 点击筛选查询按钮
    handleSearchClick (data, index) {
      this.scrollStatus = true;
      let queryArr = this.baseQueryArr.concat(this.styleExtQueryArr);
      messageAlertFunc(this, queryArr);
      this.dataTableObj.searchIconIndex = index;
      this.intemValue = data.property;
      if (
        this.selectStatus.status === true &&
        this.selectStatus.value === data.property
      ) {
        this.dataTableObj.searchBtnColor[`${this.reportCode}_${index}`] =
          '#3b74ff';
      }
      this.colKey = data.property;
      this.colValue = data.label;
      this.$rptList
        .getTableSearchData(
          this.tableName,
          this.colKey,
          this.reportCode,
          queryArr
        )
        .then(res => {
          this.dataTableObj.searchData = res.data.result;
          this.dataTableObj.searchData.unshift('空白', '无空白');
          this.dialogVisible1 = true;
          this.dialogVisible = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    showDetailDialog () {
      this.dialogVisible = true;
    },
    getDialog1Visible () {
      this.dialogVisible1 = false;
    },
    getAdvancedData (data) {
      data.forEach(element => {
        if (element.isAdvanced === true) {
          this.dataTableObj.advancedData.push(element);
        }
      });
    },
    // 控制表格筛选查询按钮样式
    getSelectStatus (data) {
      this.selectStatus = data;
      if (this.selectStatus.select === true) {
        this.dataTableObj.searchBtnColor[
          `${this.reportCode}_${this.dataTableObj.searchIconIndex}`
        ] = '#3b74ff';
      }
      if (this.selectStatus.select === false) {
        this.dataTableObj.searchBtnColor[
          `${this.reportCode}_${this.dataTableObj.searchIconIndex}`
        ] = '#999999';
      }
    },
    setScrollStatus (data) {
      this.scrollStatus = data;
    },
    // 排序方法
    sortCompare (data, order, sortParam, colKey) {
      // 提取要排序的列数据放到数据结构的第一级
      data.forEach(element1 => {
        element1.rowData.forEach(element2 => {
          if (element2.colKey === colKey) {
            sortParam = element2.colValue;
            element1.sortParam = sortParam;
          }
        });
      });

      if (order === 'ASC') {
        data.sort(ascCompare('sortParam'));
      }
      if (order === 'DESC') {
        data.sort(descCompare('sortParam'));
      }
      data.forEach(element => {
        delete element.sortParam;
      });
    },
    // 分组排序
    groupSortClick (colKey, order, index) {
      messageAlertFunc(this, this.baseQueryArr.concat(this.styleExtQueryArr));
      let sortParam, tableData;
      let groupSort = getDom('group-sort');
      let groupAsc = getDom('group-ascsort')[index];
      let groupDesc = getDom('group-descsort')[index];
      let data = JSON.parse(
        JSON.stringify({
          list: this.datatable,
          summary: this.summary
        })
      );

      for (let i = 0; i < groupSort.length; i++) {
        groupSort[i].style.color = '#999999';
      }
      if (order === 'ASC') {
        groupAsc.style.color = '#3b74ff';
      }
      if (order === 'DESC') {
        groupDesc.style.color = '#3b74ff';
      }
      // 重置isFilted状态
      this.$store.commit('setIsFilted', false);

      this.sortCompare(data.list, order, sortParam, colKey);

      tableData = {
        summary: data.summary,
        list: data.list
      };

      this.$emit('tableDataArrEventYesGroup', tableData);
    },
    handleMouseEnter (index) {
      if (
        this.dataTableObj.searchBtnColor[`${this.reportCode}_${index}`] !=
        '#3b74ff'
      ) {
 this.dataTableObj.searchBtnColor[`${this.reportCode}_${index}`] =
        '#333333'; 
}
    },
    handleMouseLeave (index) {
      if (
        this.dataTableObj.searchBtnColor[`${this.reportCode}_${index}`] !=
        '#3b74ff'
      ) {
 this.dataTableObj.searchBtnColor[`${this.reportCode}_${index}`] =
        '#999999'; 
}
    },
    setTableStyle (tableHeader, tableBody, table) {
      tableHeader.style = 'position: absolute; z-index: 100;';
      if (this.reportCode == 'Q02') {
        tableBody.style = 'display: block; margin: 38px 0 0 0; ';
      } else {
        tableBody.style = 'display: block; margin: 38px 0; ';
      }
      table.style = `overflow: auto;width:${this.dataTableObj.widthTotal +
        8}px;`;
    },
    initTableStyle (groupTable, tableHeader, tableBody, tableFooter, widthSum) {
      if (groupTable) {
        let scrollTop = groupTable ? groupTable.scrollTop : 0;
        groupTable.scrollTop = 0;
        groupTable.scrollLeft = 0;

        this.datatable.length !== 0
          ? (tableHeader.style = `width: ${widthSum}px; position: absolute; z-index: 100;`)
          : null;
        if (this.reportCode == 'Q02') {
          tableBody.style = `width: ${widthSum}px; margin: 38px 0 0 0;`;
        } else {
          tableBody.style = `width: ${widthSum}px; margin: 38px 0;`;
          this.datatable.length > 15 || this.datatable.length === 15
            ? (tableFooter.style = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;width: ${widthSum}px`)
            : (tableFooter.style =
              `position: absolute; bottom: 0; z-index: 100;width: ${widthSum}px`);
        }
        if (this.datatable.length === 0) {
          if (this.reportCode != 'Q02') {
            tableFooter.style = 'display: none;';
          }
          tableBody.style = 'height: 60px;';
          tableHeader.style = 'height: 38px;';
          groupTable.style = `overflow: hidden; height: auto;width: ${widthSum}px`;
        } else {
          // groupTable.style.width = `width: ${widthSum}px;`;
          groupTable.style.overflow = 'auto';
        }

        groupTable.addEventListener('scroll', () => {
          let scrollTop = groupTable.scrollTop;
          let headerStyleParams = `width: ${widthSum}px; transform:translate(0, ${scrollTop}px); position: absolute; z-index: 100;`;
          let footerStyleParams = `width: ${widthSum}px; transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
          tableHeader.style = headerStyleParams;
          if (this.reportCode == 'Q02') {
            tableBody.style = `width: ${widthSum}px; margin: 38px 0 0 0;`;
          } else {
            tableBody.style = `width: ${widthSum}px; margin: 38px 0;`;
            this.datatable.length !== 0
              ? (tableFooter.style = footerStyleParams)
              : null;
          }
        });
      }
    }
  },
  mounted () {
    this.$store.commit('setTableMountedStatus', true);
    this.isTableMounted = true;
    datacenterBus.$on('visibleEvent', data => {
      this.dialogVisible = data;
      this.dialogVisible1 = data;
    });
    datacenterBus.$on('sendSearchData', data => {
      this.dataTableObj.colData = data;
    });
    datacenterBus.$on('visibleStatus', data => {
      this.dialogVisible = false;
    });
    datacenterBus.$on('setScrollStatus', data => {
      this.scrollStatus = false;
    });

    let widthSum = 0;
    this.dataTableObj.widthArr = [];
    this.tableStyleColArr.forEach(element1 => {
      widthSum += element1.width;
    });
    this.dataTableObj.widthTotal = widthSum;
    this.colspan = this.tableStyleColArr.length;

    let groupTable = getDom('group-table')[0];

    if (groupTable) {
      let groupTableHeader = groupTable.children[0];
      let groupTableBody = groupTable.children[1];
      let groupTableFooter = groupTable.children[2];
      // groupTable.style.width = `${this.dataTableObj.widthTotal + 8}px`;
      this.initTableStyle(
        groupTable,
        groupTableHeader,
        groupTableBody,
        groupTableFooter,
        widthSum
      );
    }
  },
  destroyed () {
    datacenterBus.$off('setTableMountedStatus');
    datacenterBus.$off('visibleEvent');
    datacenterBus.$off('sendSearchData');
    datacenterBus.$off('visibleStatus');
    datacenterBus.$off('setScrollStatus');
  },
  updated () {
    let widthSum = 0;
    this.dataTableObj.widthArr = [];
    this.tableStyleColArr.forEach(element1 => {
      widthSum += element1.width;
    });
    this.dataTableObj.widthTotal = widthSum;
    this.colspan = this.tableStyleColArr.length;

    let groupTable = getDom('group-table')[0];
    let noGroupTable = getDom('no-group-table')[0];

    // 分组表格
    if (groupTable) {
      let groupTableHeader = groupTable.children[0];
      let groupTableBody = groupTable.children[1];
      let groupTableFooter = groupTable.children[2];
      this.initTableStyle(
        groupTable,
        groupTableHeader,
        groupTableBody,
        groupTableFooter,
        widthSum
      );
      datacenterBus.$emit('setNoGroupLoading', false);
    }

    // 未分组表格
    if (noGroupTable) {
      let noGroupTableHeader = noGroupTable.children[1];
      let noGroupTableBody = noGroupTable.children[2];
      let noGroupTableFooter = noGroupTable.children[3];

      let scrollTop = noGroupTable ? noGroupTable.scrollTop : 0;
      let scrollLeft = noGroupTable ? noGroupTable.scrollLeft : 0;
      if (!this.scrollStatus) {
        noGroupTable.scrollTop = 0;
        noGroupTable.scrollLeft = 0;
      }

      if (this.datatable.length >= 15) {
        this.setTableStyle(noGroupTableHeader, noGroupTableBody, noGroupTable);
        noGroupTableFooter.style = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
      } else if (this.datatable.length == 0) {
        noGroupTableHeader.style.position = 'static';
        noGroupTableHeader.style.width = `${this.dataTableObj.widthTotal +
          8}px`;
        noGroupTableFooter.style.display = 'none';
        noGroupTable.style = `overflow: hidden;width:${
          this.dataTableObj.widthTotal
          }px`;
      } else {
        this.setTableStyle(noGroupTableHeader, noGroupTableBody, noGroupTable);
        noGroupTableFooter.style =
          'position: absolute; bottom: 0; z-index: 100;';
      }

      noGroupTable.addEventListener('scroll', () => {
        let scrollTop = noGroupTable.scrollTop;
        let headerStyleParams = `transform:translate(0, ${scrollTop}px); position: absolute; z-index: 100;`;
        let footerStyleParams = `transform:translate(0, ${scrollTop}px); position: absolute; bottom: 0; z-index: 100;`;
        noGroupTableHeader.style = headerStyleParams;
        if (this.reportCode == 'Q02') {
          noGroupTableBody.style = 'margin: 38px 0 0 0';
        } else {
          noGroupTableBody.style = 'margin: 38px 0;';
        }
        this.datatable.length !== 0
          ? (noGroupTableFooter.style = footerStyleParams)
          : null;
      });
    }
  }
};
</script>

<style lang="scss">
.datacenter-main {
  .group-btn {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;

    .grouop-btn-tips {
      margin-left: 8px;
      padding: 0 6px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border: 1px dashed lightgray;
      border-radius: 4px;

      span,
      .el-icon-plus {
        color: #999999;
        font-size: 12px;
      }

      &:hover {
        border: 1px dashed #3b74ff;
      }
    }

    .group-btn-list {
      display: flex;
      align-items: center;
      height: 50px;

      .group-btn-item {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 8px;
        padding: 0 6px;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        color: #666666;
        background: #ffffff;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        box-sizing: border-box;

        .el-icon-close {
          margin-left: 4px;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  .no-data {
    margin-top: -50px;
    position: absolute;
    text-align: center;
    color: #bcbcbc;
    width: 100%;
    font-size: 12px;
    // font-family: "MicrosoftYaHei";
  }

  .el-table--border::after,
  .el-table--group::after {
    display: none;
  }

  //未分组表格样式
  .no-group-table {
    //滚动条的位置
    .el-table {
      overflow: auto;
    }
    .el-table__column-resize-proxy {
      display: none;
    }
    .el-table__header-wrapper,
    .el-table__body-wrapper,
    .el-table__footer-wrapper {
      overflow: visible;
    }

    .el-table::after {
      position: relative;
    }

    max-height: 654px;

    th {
      padding: 0;
    }

    .cell {
      // height: 36px;
      // line-height: 14px;
      display: flex;
      align-items: center;
      padding-left: 8px;
      padding-right: 8px;
      // font-family: "MicrosoftYaHei";
      font-size: 12px;
      color: #333333;
      word-break: break-all;

      .icon {
        display: flex;
        align-items: center;
        padding-left: 0;
        width: 100%;

        span {
          display: inline-block;
          // font-family: "MicrosoftYaHei";
        }

        .select-icon {
          i {
            font-size: 20px;
            color: #999999;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .sort-icon {
          display: inline-flex;
          flex-direction: column;

          i {
            font-size: 12px;
            color: #999999;
            line-height: 10px;
          }

          .nogroup-sort:hover {
            cursor: pointer;
          }
        }
      }
    }

    .el-table__header-wrapper {
      // position: absolute;
      // z-index: 100;
      box-sizing: border-box;
    }

    .el-table__body-wrapper {
      // margin: 38px 0;
      .el-table__empty-block {
        height: 60px;

        .el-table__empty-text {
          display: none;
        }
      }

      margin-bottom: 38px;

      tbody {
        td {
          padding: 0;
        }
      }
    }

    .el-table__footer-wrapper {
      tbody {
        td {
          height: 38px;
          padding: 0;
        }
      }
    }
  }

  //分组表格样式
  .group-table {
    position: relative;
    max-height: 646px;
    overflow: auto;
    border: 1px solid #e5e5e5;

    .el-table {
      display: grid;
      border: none !important;
    }

    .el-table__header-wrapper {
      .cell {
        position: relative;
        display: flex;
        height: 38px;
        // font-family: "MicrosoftYaHei";
        font-size: 12px;
        justify-content: start;
        align-items: center;
        padding: 0 8px;
        // .merge-button {
        //   position: absolute;
        //   top: 0;
        //   left: 0;
        //   font-size: 12px;
        //   color: red;
        // }
        .label {
          padding: 0;
          line-height: 38px;
          height: 38px;
          // font-family: "MicrosoftYaHei";
          font-size: 12px;
          color: #333333;
        }

        .sort-icon {
          display: inline-flex;
          flex-direction: column;
          align-items: center;

          i {
            font-size: 12px;
            color: #999999;
            line-height: 10px;

            &:hover {
              color: #333333;
              cursor: pointer;
            }
          }
        }
      }
    }

    .el-table__body-wrapper {
      margin-bottom: 38px;

      .cell {
        display: flex;
        align-items: center;
        line-height: 14px;
        // font-family: "MicrosoftYaHei";
        font-size: 12px;
        word-break: break-all;

        .typestyle {
          margin-right: 4px;

          .new-icon {
            &:hover {
              cursor: pointer;
            }
          }
        }
      }

      .el-table__row {
        border-bottom: 1px solid #e5e5e5;
      }

      .trName1 {
        .trName1-cell {
          margin-left: 8px;
        }
      }

      .trName2 {
        .trName2-cell {
          margin-left: 16px;
        }
      }

      .trName3 {
        .trName3-cell {
          margin-left: 24px;
        }
      }

      .trName4 {
        .trName4-cell {
          margin-left: 32px;
        }
      }

      .trName5 {
        .trName5-cell {
          margin-left: 40px;
        }
      }

      .trName6 {
        .trName6-cell {
          margin-left: 48px;
        }
      }
    }

    .el-table__footer-wrapper {
      td {
        background: #f2f4fd;
        box-sizing: border-box;
        .cell {
          // font-family: "MicrosoftYaHei";
          font-size: 12px;
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
/deep/ .el-dialog {
  width: 892px;
  height: 470px;
  border-radius: 4px;

  .el-dialog__header {
    padding: 14px 20px 10px;
  }

  .el-dialog__title {
    font-family: MicrosoftYaHei;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    line-height: 28px;
  }

  .el-dialog__headerbtn .el-dialog__close {
    font-size: 18px;
  }

  .el-dialog__header::after {
    content: "";
    display: block;
    width: 852px;
    height: 1px;
    background: #e5e5e5;
  }

  .el-dialog__body {
    padding: 0 20px 30px 20px;
  }

  .sonTable-pagination {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
}
</style>

