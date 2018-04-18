(function () {
	var lastRpcFetchTime = 0;
	var lastDiskFetchTime = 0;
	var lastMemFetchTime = 0;
	var totalMem = 0;
	var totalSwap = 0;

	// // 获取RPC、磁盘、内存数据
	// function fetchMassDataInterval() {
	// 	$.ajax({
	// 		type: "POST",
	// 		url: monitorWebBaseURL + "index/mass",
	// 		data: {
	// 			lastRpcFetchTime: lastRpcFetchTime + 1,
	// 			lastDiskFetchTime: lastDiskFetchTime + 1,
	// 			lastMemFetchTime: lastMemFetchTime + 1,
	// 		},
	// 		dataType: "json",
	// 		success: function (data) {
	// 			if (data.success) {
	// 				var rpcSum = data.dataObject.rpc.sum;
	// 				var rpcNum = data.dataObject.rpc.num;
	// 				var diskFree = data.dataObject.diskFree.sum;
	// 				var memFree = data.dataObject.memFree.sum;
	//
	// 				//更新页面指标信息
	// 				if (!isNaN(rpcSum) && rpcNum !== 0) {
	// 					$("#rpcDelayField").html((rpcSum / rpcNum).toFixed(1) + ' <small>ms</small>');
	// 				}
	// 				if (!isNaN(diskFree) && diskTotal !== 0) {
	// 					$("#diskRateField").html((100.0 * (diskTotal - diskFree) / diskTotal).toFixed(1) + '%');
	// 				}
	// 				if (!isNaN(memFree) && memTotal !== 0) {
	// 					$("#memRateField").html((100.0 * (memTotal - memFree) / memTotal).toFixed(1) + '%');
	// 				}
	//
	// 				//更新数据获取时间
	// 				lastRpcFetchTime = data.dataObject.rpc.processTime;
	// 				lastDiskFetchTime = data.dataObject.diskFree.processTime;
	// 				lastMemFetchTime = data.dataObject.memFree.processTime;
	// 			}
	// 		}
	// 	});
	// }

	// 定时刷新上述数据
	function timeTask() {
		// fetchMassDataInterval();
	}

	$(function () {
		// 获取一些一段时间内基本不会改变的指标
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "memory/basic",
			data: {},
			dataType: "json",
			success: function (data) {
				if (data.success) {
					if (!isNaN(data.dataObject.totalMem.sum)) {
						totalMem = data.dataObject.totalMem.sum;
					}
					if (!isNaN(data.dataObject.totalSwap.sum)) {
						totalSwap = data.dataObject.totalSwap.sum;
					}
					var totalMemSelector = $("#totalMem");
					totalMemSelector.html((totalMem / 1048576.0).toFixed(1) + " <small>GB</small>")
					totalMemSelector.data("totalMemValue", totalMem / 1048576.0);

					$("#totalSwap").html((totalSwap / 1048576.0).toFixed(1) + " <small>GB</small>")

					//开始此页面的定时任务
					timeTask(); //先执行一次，否则会有一定的延迟
					setInterval(timeTask, 8000);
				}
			}
		});
	});
})();