var indexJS = {
	cpuNum: -1,
	func: function () {
		var lastRpcFetchTime = 0;
		var lastDiskFetchTime = 0;
		var lastMemFetchTime = 0;
		var diskTotal = 0;
		var memTotal = 0;

		// 获取RPC、磁盘、内存数据
		function fetchMassDataInterval() {
			$.ajax({
				type: "POST",
				url: monitorWebBaseURL + "index/mass",
				data: {
					lastRpcFetchTime: lastRpcFetchTime + 1,
					lastDiskFetchTime: lastDiskFetchTime + 1,
					lastMemFetchTime: lastMemFetchTime + 1,
				},
				dataType: "json",
				success: function (data) {
					if (data.success) {
						var rpcSum = data.dataObject.rpc.sum;
						var rpcNum = data.dataObject.rpc.num;
						var diskFree = data.dataObject.diskFree.sum;
						var memFree = data.dataObject.memFree.sum;

						//更新页面指标信息
						if (!isNaN(rpcSum) && rpcNum !== 0) {
							$("#rpcDelayField").html((rpcSum / rpcNum).toFixed(1) + ' <small>ms</small>');
						}
						if (!isNaN(diskFree) && diskTotal !== 0) {
							$("#diskRateField").html((100.0 * (diskTotal - diskFree) / diskTotal).toFixed(1) + '%');
						}
						if (!isNaN(memFree) && memTotal !== 0) {
							$("#memRateField").html((100.0 * (memTotal - memFree) / memTotal).toFixed(1) + '%');
						}

						//更新数据获取时间
						lastRpcFetchTime = data.dataObject.rpc.processTime;
						lastDiskFetchTime = data.dataObject.diskFree.processTime;
						lastMemFetchTime = data.dataObject.memFree.processTime;
					}
				}
			});
		}

		// 获取集群总的从节点、存活从节点等信息
		function fetchAgentMetrics() {
			$.ajax({
				type: "POST",
				url: monitorWebBaseURL + "index/cluster/agent",
				data: {},
				dataType: "json",
				success: function (data) {
					if (data['master/slaves_connected'] !== undefined && data['master/slaves_disconnected'] !== undefined) {
						var totalNodes = data['master/slaves_connected'] + data['master/slaves_disconnected'];
						var activeNodes = data['master/slaves_connected'];

						//更新页面信息
						if (!isNaN(totalNodes) && !isNaN(activeNodes)) {
							$("#yarnNodeField").html(activeNodes + '/' + activeNodes);
						}
					}
				}
			});
		}

		$(function () {
			// 获取一些一段时间内基本不会改变的指标
			$.ajax({
				type: "POST",
				url: monitorWebBaseURL + "index/stable",
				data: {},
				dataType: "json",
				success: function (data) {
					if (data.success) {
						if (!isNaN(data.dataObject.diskTotal.sum)) {
							diskTotal = data.dataObject.diskTotal.sum;
						}
						if (!isNaN(data.dataObject.memTotal.sum)) {
							memTotal = data.dataObject.memTotal.sum;
						}
						if (!isNaN(data.dataObject.cpuNum.sum)) {
							indexJS.cpuNum = data.dataObject.cpuNum.sum;
						}

						//先执行一次，否则会有一定的延迟
						fetchMassDataInterval();
						fetchAgentMetrics();

						//开始此页面的定时任务
						setTimeout(function () {
							setInterval(fetchAgentMetrics, 8000);
						},4000);
						setInterval(fetchMassDataInterval, 8000);
					}
				}
			});

			$.ajax({
				type: "POST",
				url: monitorWebBaseURL + "alert/trigger/fetch",
				data: {
					limit:10
				},
				dataType: "json",
				success: function (data) {
					if (data.success) {
						var result = data.result;
						var triggerAlertL = "";
						$.each(result, function (i, item) {
							var alertTime = new Date(item.time).customFormat("#YYYY# / #MM# / #DD#");

							var severityColor;
							if(item.severity.toUpperCase() == 'LOW')
								severityColor = "bg-yellow";
							else if(item.severity.toUpperCase() == 'AVERAGE')
								severityColor = "bg-orange";
							else
								severityColor = "bg-red";

							var itemDes = item.triggerDes;
							if(itemDes.length>30){
								itemDes = itemDes.substring(0,30) + '...';
							}

							triggerAlertL += '\
								<li class="list-group-item" data-id="1" data-des="'+item.triggerDes+'" data-host="'+item.host+'" data-detail="'+item.info+'">\
									<span class="badge">'+alertTime+'</span>'+itemDes+'\
									<span class="badge '+severityColor+'">'+item.severity+'</span>\
								</li>';
						});
						$("#triggerAlertList").html(triggerAlertL);
						$("#alertBox").find(".overlay").hide();
					}
				}
			});

			$(".alertBlock .list-group").on("click", ".list-group-item", function () {
				var alertContent = $(this).data("detail");
				var host = $(this).data("host");
				var des = $(this).data("des");
				$("#alertDetailContent").html(alertContent);
				$("#alertContentModal").find(".modal-title").html(host+": "+des);
				$('#alertContentModal').modal({
					"backdrop": false
				});
			});
		});

		$("#yarnNodeInfoBox").click(function () {
			window.location = monitorAssetBaseURL + "module/node/node_list.html";
		});

		$("#yarnAppInfoBox").click(function () {
			window.location = monitorAssetBaseURL + "module/yarn/yarn.html";
		});

		$("#diskInfoBox").click(function () {
			window.location = monitorAssetBaseURL + "module/io/io.html";
		});

		$("#memInfoBox").click(function () {
			window.location = monitorAssetBaseURL + "module/memory/memory.html";
		});
	}
};
indexJS.func();