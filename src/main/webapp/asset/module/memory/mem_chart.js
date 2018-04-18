/**
 * Created by liuyou on 2017/5/21.
 */

(function () {

	var memChart = null;
	var timeGap = 7.5;
	var memFreeData = [];
	var swapFreeData = [];
	var memBufferData = [];
	var memCacheData = [];
	var memSharedData = [];

	var memFreeLastFetchTime = null;
	var swapFreeLastFetchTime = null;
	var memBufferLastFetchTime = null;
	var memCacheLastFetchTime = null;
	var memSharedLastFetchTime = null;

	var memInfoTable = null;

	// 更新内存使用率的页面展示
	function updateMemUsedUI() {
		var newestFree = memFreeData[memFreeData.length - 1][1];
		var totalMem = $("#totalMem").data("totalMemValue");
		if (totalMem != '') {
			var usedMem = (totalMem - newestFree).toFixed(1);
			$("#memUsedInfo").html(usedMem + "GB / " + totalMem.toFixed(1) + "GB");
			$("#memUsedProgressBar").css("width", (100 * usedMem / $("#totalMem").data("totalMemValue")) + "%");
			$("#memUsedRate").html((usedMem / $("#totalMem").data("totalMemValue") * 100).toFixed(1) + "%");
		}
	}

	// 更新数据表展示
	function updateDataTableUI() {

		var memInfoTableData = [];
		for (var i = 0; i < 5; i++) {
			var tempTime;
			if (i == 0) {
				tempTime = "最新";
			} else {
				tempTime = memFreeData[memFreeData.length - 1 - i][0];
				var d = new Date(tempTime);
				tempTime = d.customFormat("#hh#:#mm#:#ss#");
			}
			memInfoTableData.push([
				tempTime,
				memFreeData[memFreeData.length - 1 - i][1] + " GB",
				swapFreeData[swapFreeData.length - 1 - i][1] + " GB",
				memBufferData[memBufferData.length - 1 - i][1] + " GB",
				memCacheData[memCacheData.length - 1 - i][1] + " GB",
				memSharedData[memSharedData.length - 1 - i][1] + " GB"
			])
		}

		if (memInfoTable == null) {
			memInfoTable = $('#memInfoTable').DataTable({
				"paging": false,
				"ordering": false,
				"searching": false,
				"data": memInfoTableData,
				"info": false,
				"columns": [
					{"title": "时间 <i class='fa fa-refresh fa-spin fa-fw'></i>", "class": "center"},
					{"title": "空闲内存", "class": "center"},
					{"title": "空闲交换空间", "class": "center"},
					{"title": "Buffer", "class": "center"},
					{"title": "Cache", "class": "center"},
					{"title": "线程共享内存", "class": "center"}
				]
			});
		} else {
			memInfoTable.clear();
			memInfoTable.rows.add(memInfoTableData);
			memInfoTable.draw();
		}
	}

	// 获取内存数据
	function fetchCpuDataInterval() {
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "memory/dynamic",
			data: {
				limit: 2,
				memFreeLastFetchTime: memFreeLastFetchTime + 1,
				swapFreeLastFetchTime: swapFreeLastFetchTime + 1,
				memBufferLastFetchTime: memBufferLastFetchTime + 1,
				memCacheLastFetchTime: memCacheLastFetchTime + 1,
				memSharedLastFetchTime: memSharedLastFetchTime + 1
			},
			dataType: "json",
			success: function (data) {

				if (data.success) {

					data = data.dataObject;

					if(data.memFree == null) data.memFree = [];
					if(data.swapFree == null) data.swapFree = [];
					if(data.memBuffer == null) data.memBuffer = [];
					if(data.memCache == null) data.memCache = [];
					if(data.memShared == null) data.memShared = [];

					var maxLength = data.memFree.length;
					$.each(data, function (i, list) {
						if (list.length > maxLength) {
							maxLength = list.length;
						}
					});

					data.memFree.reverse();
					data.swapFree.reverse();
					data.memBuffer.reverse();
					data.memCache.reverse();
					data.memShared.reverse();

					for (var i = 0; i < maxLength; i++) {

						var maxTime = Math.max(
							i < data.memFree.length ? data.memFree[i].processTime - 0 : 0,
							i < data.swapFree.length ? data.swapFree[i].processTime - 0 : 0,
							i < data.memBuffer.length ? data.memBuffer[i].processTime - 0 : 0,
							i < data.memCache.length ? data.memCache[i].processTime - 0 : 0,
							i < data.memShared.length ? data.memShared[i].processTime - 0 : 0
						);

						if(maxTime == 0){
							maxTime = 0;
						}

						memFreeData.shift();
						memFreeData.push([
							maxTime * 1000,
							i < data.memFree.length ? (data.memFree[i].sum / 1048576.0).toFixed(1) : memFreeData[memFreeData.length - 1][1] //如果没有新数据，则显示老数据
						]);

						swapFreeData.shift();
						swapFreeData.push([
							maxTime * 1000,
							i < data.swapFree.length ? (data.swapFree[i].sum / 1048576.0).toFixed(1) : swapFreeData[swapFreeData.length - 1][1]
						]);

						memBufferData.shift();
						memBufferData.push([
							maxTime * 1000,
							i < data.memBuffer.length ? (data.memBuffer[i].sum / 1048576.0).toFixed(1) : memBufferData[memBufferData.length - 1][1]
						]);

						memCacheData.shift();
						memCacheData.push([
							maxTime * 1000,
							i < data.memCache.length ? (data.memCache[i].sum / 1048576.0).toFixed(1) : memCacheData[memCacheData.length - 1][1]
						]);

						memSharedData.shift();
						memSharedData.push([
							maxTime * 1000,
							i < data.memShared.length ? (data.memShared[i].sum / 1048576.0).toFixed(1) : memSharedData[memSharedData.length - 1][1]
						]);
					}
					updateMemUsedUI();

					if (data.memFree.length != 0) {
						memFreeLastFetchTime = data.memFree[data.memFree.length - 1].processTime;
					}
					if (data.swapFree.length != 0) {
						swapFreeLastFetchTime = data.swapFree[data.swapFree.length - 1].processTime;
					}
					if (data.memBuffer.length != 0) {
						memBufferLastFetchTime = data.memBuffer[data.memBuffer.length - 1].processTime;
					}
					if (data.memCache.length != 0) {
						memCacheLastFetchTime = data.memCache[data.memCache.length - 1].processTime;
					}
					if (data.memShared.length != 0) {
						memSharedLastFetchTime = data.memShared[data.memShared.length - 1].processTime;
					}

					// 填入数据
					memChart.setOption({
						series: [
							{
								name: '空闲内存',
								data: memFreeData
							},
							{
								name: '空闲交换空间',
								data: swapFreeData
							},
							{
								name: '内存缓存（Buffer）',
								data: memBufferData
							},
							{
								name: '文件缓存（Cache）',
								data: memCacheData
							},
							{
								name: '线程共享内存',
								data: memSharedData
							}
						]
					});
					updateDataTableUI();
				}
			}
		});
	}


	$(function () {

		// 基于准备好的dom，初始化echarts实例
		memChart = echarts.init(document.getElementById('memChart'));

		// 设置图表属性
		memChart.setOption({
			title: {
				text: '集群内存动态数据',
				top: 5,
				left: 5
			},
			grid: {
				height: 280
			},
			tooltip: {
				trigger: 'axis'
			},
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {},
					saveAsImage: {}
				},
				top: 5,
				right: 20
			},
			dataZoom: [
				{   // 这个dataZoom组件，默认控制x轴。
					type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
					start: 50,      // 左边在 10% 的位置。
					end: 100,         // 右边在 60% 的位置。
				}
			],
			legend: {
				data: ['空闲内存', '空闲交换空间', '内存缓存（Buffer）', '文件缓存（Cache）', '线程共享内存'],
				top: 10
			},
			xAxis: {
				type: 'time',
				splitLine: {
					show: false
				},
				boundaryGap: false
			},
			yAxis: {
				type: 'value',
				splitLine: {
					show: false
				}
			},
			series: [
				{
					name: '空闲内存',
					type: 'line',
					smooth: true,
					symbol: 'none',
				},
				{
					name: '空闲交换空间',
					type: 'line',
					smooth: true,
					symbol: 'none',
				},
				{
					name: '内存缓存（Buffer）',
					type: 'line',
					smooth: true,
					symbol: 'none',
				},
				{
					name: '文件缓存（Cache）',
					type: 'line',
					smooth: true,
					symbol: 'none',
				},
				{
					name: '线程共享内存',
					type: 'line',
					smooth: true,
					symbol: 'none',
				}
			]
		});

		// 加载提示动画
		memChart.showLoading();
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "memory/dynamic",
			data: {
				limit: 500
			},
			dataType: "json",
			success: function (data) {

				if (data.success) {
					var minLength = data.dataObject.memFree.length;
					$.each(data.dataObject, function (i, list) {
						if (list.length < minLength) {
							minLength = list.length;
						}
					});

					for (var i = 0; i < minLength; i++) {
						var maxTime = Math.max(
							i < data.dataObject.memFree.length ? data.dataObject.memFree[i].processTime - 0 : 0,
							i < data.dataObject.swapFree.length ? data.dataObject.swapFree[i].processTime - 0 : 0,
							i < data.dataObject.memBuffer.length ? data.dataObject.memBuffer[i].processTime - 0 : 0,
							i < data.dataObject.memCache.length ? data.dataObject.memCache[i].processTime - 0 : 0,
							i < data.dataObject.memShared.length ? data.dataObject.memShared[i].processTime - 0 : 0
						);
						memFreeData.unshift([
							maxTime * 1000,
							(data.dataObject.memFree[i].sum / 1048576.0).toFixed(1)
						]);

						swapFreeData.unshift([
							maxTime * 1000,
							(data.dataObject.swapFree[i].sum / 1048576.0).toFixed(1)
						]);

						memBufferData.unshift([
							maxTime * 1000,
							(data.dataObject.memBuffer[i].sum / 1048576.0).toFixed(1)
						]);

						memCacheData.unshift([
							maxTime * 1000,
							(data.dataObject.memCache[i].sum / 1048576.0).toFixed(1)
						]);

						memSharedData.unshift([
							maxTime * 1000,
							(data.dataObject.memShared[i].sum / 1048576.0).toFixed(1)
						]);
					}

					memFreeLastFetchTime = data.dataObject.memFree[0].processTime;
					swapFreeLastFetchTime = data.dataObject.swapFree[0].processTime;
					memBufferLastFetchTime = data.dataObject.memBuffer[0].processTime;
					memCacheLastFetchTime = data.dataObject.memCache[0].processTime;
					memSharedLastFetchTime = data.dataObject.memShared[0].processTime;

					// 关闭提示动画
					memChart.hideLoading();

					// 填入数据
					memChart.setOption({
						series: [
							{
								name: '空闲内存',
								data: memFreeData
							},
							{
								name: '空闲交换空间',
								data: swapFreeData
							},
							{
								name: '内存缓存（Buffer）',
								data: memBufferData
							},
							{
								name: '文件缓存（Cache）',
								data: memCacheData
							},
							{
								name: '线程共享内存',
								data: memSharedData
							}
						]
					});

					updateMemUsedUI();
					updateDataTableUI();
				}
				setInterval(fetchCpuDataInterval, 8000);
			}
		});
	});
})();