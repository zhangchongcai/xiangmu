import Mock from 'mockjs'

// 生成数据列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'uid|36': '@character',
    'ticketTypeName': '@name',
    'isStandard': '@integer(0,1)',
    'isDiscount': '@integer(0,1)',
    'ticketTypeSeq': '@integer(1,99)',
    'ticketSampleUid': '@string',
    'ticketTypeCinemaInfo|2': {
      'ts_uid': '@string',
      'cinema_uid': '@string'
    },
  }))
}

//电影类型
let movieType ={
  "code": 200,
  "data": [
      {
          "tenantId": 1,
          "delFlag": 0,
          "dicCode": "CI_HALL_TYPE",
          "id": 94,
          "keyCode": "3D",
          "keyDesc": "3D影厅",
          "keyName": "3D影厅",
          "syncTime": "2015-02-02T22:02:15",
          "uidSync": "25f7006b-ab27-11e4-af97-001d09003af1",
          "updateTime": "2015-02-02T17:02:15"
      },
      {
          "tenantId": 1,
          "delFlag": 0,
          "dicCode": "CI_HALL_TYPE",
          "id": 95,
          "keyCode": "MAX",
          "keyDesc": "巨幕影厅",
          "keyName": "巨幕影厅",
          "syncTime": "2015-02-02T22:02:15",
          "uidSync": "25f700db-ab27-11e4-af97-001d09003af1",
          "updateTime": "2015-02-02T17:02:15"
      },
      {
          "tenantId": 1,
          "delFlag": 0,
          "dicCode": "CI_HALL_TYPE",
          "id": 96,
          "keyCode": "MAX3D",
          "keyDesc": "3D巨幕影厅",
          "keyName": "3D巨幕影厅",
          "syncTime": "2015-02-02T22:02:15",
          "uidSync": "25f70151-ab27-11e4-af97-001d09003af1",
          "updateTime": "2015-02-02T17:02:15"
      },
      {
          "tenantId": 1,
          "delFlag": 0,
          "dicCode": "CI_HALL_TYPE",
          "id": 93,
          "keyCode": "Normal",
          "keyDesc": "普通影厅",
          "keyName": "普通影厅",
          "syncTime": "2015-02-02T22:02:15",
          "uidSync": "25f6fff7-ab27-11e4-af97-001d09003af1",
          "updateTime": "2015-02-02T17:02:15"
      }
  ],
  "msg": "操作成功",
  "status": "Ok",
  "timestamp": 1546655288025
}



// 获取类型
export function type () {
  return {
    // isOpen: false,
    url: '/dictionary/getByName',
    type: 'get',
    data: movieType
  }
}
// 获取列表
export function list () {
  return {
    // isOpen: false,
    url: '/cihall/find',
    type: 'post',
    data: Mock.mock({
      "code": 200,
      "data": {
          "current": 1,
          "pages": 1,
          "records|10": [
              {
                  "seatnum": 62818,
                  "syncTime": 1,
                  "tenantId": 1,
                  "updateUser": 1,
                  "addFeeType": 1,
                  "aliases": "",
                  "amount": 2,
                  "badSeatCount": 0,
                  "cinemaUid": "a405489f-adcc-42cd-b2ee-6789693aa481",
                  "code": "0000000000000002",
                  "createTime": "2018-07-02T13:40:00",
                  "createUser": "hai1",
                  "delFlag": 0,
                  "id": 12,
                  "isOnAddFee": 0,
                  "maxSeatVersion": 0,
                  "monopoly": 0,
                  "name": "ll",
                  "percentage": 0,
                  "screenWidth": 480,
                  "screenX": 150,
                  "seq": 1,
                  "shortCode": "75",
                  "status": 1,
                  "type": "2D",
                  "uid": "c24276cc2ba642eb85eab3129476592f",
                  "updateTime": "2019-01-02T16:20:23"
              }
          ],
          "searchCount": true,
          "size": 100,
          "total": 2
      },
      "msg": "操作成功",
      "status": "Ok",
      "timestamp": 1546417617221
  })
  }
}

// 添加
export function add () {
  return {
    // isOpen: false,
    url: '/tickettype/add',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200
    }
  }
}

// 查看
export function update () {
  return {
    // isOpen: false,
    url: '/cihall/getCiHallByUid',
    type: 'post',
    data: {
      "code": 200,
      "data": {
          "addFeeType": 1,
          "aliases": "",
          "amount": 2,
          "badSeatCount": 0,
          "cinemaUid": "a405489f-adcc-42cd-b2ee-6789693aa481",
          "code": "0000000000000002",
          "createTime": "2018-07-02T13:40:00",
          "createUser": "hai1",
          "delFlag": 0,
          "id": 12,
          "isOnAddFee": 0,
          "maxSeatVersion": 0,
          "monopoly": 0,
          "name": "ll",
          "percentage": 0,
          "screenWidth": 480,
          "screenX": 150,
          "seatnum": 38101,
          "seq": 1,
          "shortCode": "75",
          "status": 1,
          "syncTime": "测试内容fh8n",
          "tenantId": "测试内容5xvp",
          "type": "巨幕影厅",
          "uid": "c24276cc2ba642eb85eab3129476592f",
          "updateTime": "2019-01-02T16:20:23",
          "updateUser": "测试内容03l1"
      },
      "msg": "操作成功",
      "status": "Ok",
      "timestamp": 1546419657070
    }
  }
}
// 修改
export function edit () {
  return {
    // isOpen: false,
    url: '/cihall/updateCiHall',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200
    }
  }
}

// 删除
export function del () {
  return {
    // isOpen: false,
    url: '/tickettype/del',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200
    }
  }
}

// 获取全部影院列表
var allCinemaList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  allCinemaList.push(Mock.mock({
    'uid|36': '@character',
    'ticketTypeName': '@string'
  }))
}

export function alllist () {
  return {
    // isOpen: false,
    url: '/tickettype/allCinemaList',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'list': allCinemaList
    }
  }
}

// 获取部分影院列表
// 选择模板列表
var simpleList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  simpleList.push(Mock.mock({
    'uid|36': '@string',
    'name': '@name',
    'width|1-100': 1,
    'height|1-100': 1,
    'createtime': '@datetime',
    'createUserName': '@name'
  }))
}

export function simpleList () {
  return {
    // isOpen: false,
    url: '/ticketsample/query',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'page': {
        'totalCount': simpleList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': simpleList
      }
    }
  }
}

