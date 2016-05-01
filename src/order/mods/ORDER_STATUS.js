KISSY.add(function () {
	var ORDER_STATUS_MAP = {

		"00": {
			name: '等待支付',
			code: "00"
		},
		"10": {
			name: '等待服务',//订单已经支付
			code: "10"
		},
		"20": {
			name: '订单已取消',
			code: "20"
		},
		"30": {
			name: '服务进行中',
			code: "30"
		},
		"40": {
			name: '服务进行中',
			code: "40"
		},
		"50": {
			name: '服务进行中',
			code: "50"
		},
		"60": {
			name: '待确认',
			code: "60"
		},
		"90": {
			name: '服务完成',
			code: "90"
		}
	}

	return {
		kOrderStatusNeedPay: '00',     //等待支付
		kOrderStatusIsPay: '10',    //订单已经支付      等于那张图片上的等待服务
		kOrderStatusIsCancel: '20',    //订单已取消
		kOrderStatusDoing: '30',    //服务进行中
		kOrderStatusDoingTwo: '40',    //服务进行中
		kOrderStatusDoingThree: '50',    //服务进行中
		kOrderStatusNeedSure: '60',    //待确认
		kOrderStatusComplate: '90',    //服务完成
		status_map: ORDER_STATUS_MAP
	};
});