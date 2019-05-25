import Mock from 'mockjs'

// 生成数据列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'uid|36': '@character',
    'name': '@name',
    'baseFlag': '@integer(0,1)',
    'isDiscount': '@integer(0,1)',
    'seq': '@integer(1,99)',
    'ticketSampleUid': '@string',
    'ticketTypeCinemaInfo|2': {
      'ts_uid': '@string',
      'cinema_uid': '@string'
    },
    'useRange': '@integer(0,1)'
  }))
}

// 获取列表
export function list () {
  return {
    // isOpen: false,
    url: '/tickettype/list',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'data': {
        'records': dataList,
        'total': dataList.length,
        'size': 10,
        'current': 1,
        'pages': 1
      }
    }
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

// 修改
export function update () {
  return {
    // isOpen: false,
    url: '/tickettype/update',
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

