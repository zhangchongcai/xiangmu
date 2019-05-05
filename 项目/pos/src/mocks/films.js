let Mock = require('mockjs')

let template = Mock.mock({
	'data|10': [{
        'id|+1': 1,
        'film_name': '@ctitle(3,8)',
        'lan': "国语",
        'screen': '巨幕',//库存数量  
        'hall|2': [{
        	'play_time': '@time("HH:mm")',
        	'play_hall': '@integer(1, 9)号厅',
        	'total': '@integer(120, 144)',
        	'sell': '@integer(0, 144)',
        	'hall_id|+1': 1
        }]
      }]
})

Mock.mock( '/films', 'get', template)