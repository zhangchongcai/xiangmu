import Mock from 'mockjs'

// 生成数据列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'uid|36': '@string',
    'name': '@name',
    'width|1-100': 1,
    'height|1-100': 1,
    'createtime': '@datetime',
    'createUserName': '@name'
  })) 
}

// 获取列表
export function list () {
  return {
    // isOpen: false,
    url: '/ticketsample/query',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200,
      'page': {
        'totalCount': dataList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': dataList
      }
    }
  }
}

// 删除
export function del () {
  return {
    // isOpen: false,
    url: '/ticketsample/del',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 200
    }
  }
}
