/**
 * Created by likeugo on 2017/7/25
 * 
 */

(function () {

	var ioBytesPktsChart = null;
	
	var timeGap = 7.5;
	var byteInData = [];
	var byteOutData = [];
	var pktsInData = [];
	var pktsOutData = [];

	var bytesinLastFetchTime = null;
	var bytesoutLastFetchTime = null;
	var pktsinLastFetchTime = null;
	var pktsoutLastFetchTime = null;

	var ioBytesPktsInfoTable = null;
	
	
	// 获取bytes和pkts数据
	function fetchBytesPktsDataInterval() {
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "io/fetchIOByte_Pkts",
			data: {
				limit: 1,
				bytesinLastFetchTime: bytesinLastFetchTime + 1,
				bytesoutLastFetchTime: bytesoutLastFetchTime + 1,
				pktsinLastFetchTime: pktsinLastFetchTime + 1,
				pktsoutLastFetchTime: pktsoutLastFetchTime + 1
			},
			dataType: "json",
			success: function (data) {

				if (data.success) {
					if (data.dataObject.BYTES_IN != null) {
						data.dataObject.BYTES_IN.reverse();
						$.each(data.dataObject.BYTES_IN, function (i, item) {
							byteInData.shift();
							byteInData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
							]);
						});
						bytesinLastFetchTime = data.dataObject.BYTES_IN[0].processTime;
					}
					if (data.dataObject.BYTES_OUT != null) {
						data.dataObject.BYTES_OUT.reverse();
						$.each(data.dataObject.BYTES_OUT, function (i, item) {
							byteOutData.shift();
							byteOutData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
								]);
						});
						bytesoutLastFetchTime = data.dataObject.BYTES_OUT[0].processTime;
					}
					if (data.dataObject.PKTS_IN != null) {
						data.dataObject.PKTS_IN.reverse();
						$.each(data.dataObject.PKTS_IN, function (i, item) {
							pktsInData.shift();
							pktsInData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
								]);
						});
						pktsinLastFetchTime = data.dataObject.PKTS_IN[0].processTime;
					}
					if (data.dataObject.PKTS_OUT != null) {
						data.dataObject.PKTS_OUT.reverse();
						$.each(data.dataObject.PKTS_OUT, function (i, item) {
							pktsOutData.shift();
							pktsOutData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
								]);
						});
						pktsoutLastFetchTime = data.dataObject.PKTS_OUT[0].processTime;
					}
					// 填入数据
					ioBytesPktsChart.setOption({
						xAxis:
							[
							{
								type: 'time',
								splitLine: {
									show: false
								},
								boundaryGap: false,
								//min:byteInData[byteInData.length/2][0]
								
							}
							,
							{
								gridIndex: 1,
								type: 'time',
								splitLine: { 
									show: false
								},
								boundaryGap: false,
								position: 'top',
								//min:byteInData[byteInData.length/2][0]
							}
							],
							
						series: [
							{
								name: '发送字节',
								data: byteInData
							},
							{
								name: '接受字节',
								data: byteOutData
							},
							{
								name: '发送数据包',
								data: pktsInData,
								xAxisIndex: 1,
					            yAxisIndex: 1
							},
							{
								name: '接受数据包',
								data: pktsOutData,
								xAxisIndex: 1,
					            yAxisIndex: 1
							}
						]
					});
					updateDataTableUI();
				}
			}
		});
	}
	
	// 更新数据表展示
	function updateDataTableUI() {

		var InfoTableData = [];
		
		for (var i = 0; i < 5; i++) {
			var tempTime;
			if (i == 0) {
				tempTime = "最新";
			} else {
				tempTime = byteInData[byteInData.length - 1 - i][0];
				var d = new Date(tempTime);
				tempTime = d.customFormat("#hh#:#mm#:#ss#");
			}
			InfoTableData.push([
				tempTime,
				byteInData[byteInData.length - 1 - i][1],
				byteOutData[byteOutData.length - 1 - i][1],
				pktsInData[pktsInData.length - 1 - i][1],
				pktsOutData[pktsOutData.length - 1 - i][1],
			])
		}

		if(ioBytesPktsInfoTable == null) {
			ioBytesPktsInfoTable = $('#ioBytesPktsInfoTable').DataTable({
				"paging": false,
				"ordering": false,
				"searching": false,
				"data": InfoTableData,
				"info": false,
				"columns": [
					{"title": "时间 <i class='fa fa-refresh fa-spin fa-fw'></i>", "class": "center"},
					{"title": "读取字节数  (bytes/s)", "class": "center"},
					{"title": "发送字节数  (bytes/s)", "class": "center"},
					{"title": "读取数据包量  (pkts/s)", "class": "center"},
					{"title": "发送数据包量  (pkts/s)", "class": "center"},
				]
			});
		} else {
			ioBytesPktsInfoTable.clear();
			ioBytesPktsInfoTable.rows.add(InfoTableData);
			ioBytesPktsInfoTable.draw();
		}
	}
	
    
	$(function () {
		

		// 基于准备好的dom，初始化echarts实例
		ioBytesPktsChart = echarts.init(document.getElementById('ioBytesPktsChart'));

		// 设置图表属性
		ioBytesPktsChart.setOption({
			title: {
				text: '网络数据监控',
				top: 5,
				left: 5
			},
			grid: {
				height: 260
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
//			dataZoom: [
//				{   // 这个dataZoom组件，默认控制x轴。
//					type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
//					start: 50,      // 左边在 10% 的位置。
//					end: 100,         // 右边在 60% 的位置。
//				}
//			],
			dataZoom: [
		        {
		            show: true,
		            realtime: true,
		            start: 50,
		            end: 100,
		            xAxisIndex: [0, 1]
		        },
		        {
		            type: 'slider',
		            realtime: true,
		            start: 50,
		            end: 100,
		            xAxisIndex: [0, 1]
		        }
		    ],
			legend: {
				data: ['发送字节', '接受字节', '发送数据包', '接受数据包'],
				top: 10
			},
			 grid: [{
			        left: 150,
			        right: 50,
			        height: '35%'
			    }, {
			        left: 150,
			        right: 50,
			        top: '60%',
			        height: '25%'
			    }],
			    
			xAxis:
			[
			{
				type: 'time',
				splitLine: {
					show: false
				},
				boundaryGap: false,
			}
			,
			{
				gridIndex: 1,
				type: 'time',
				splitLine: {
					show: false
				},
				boundaryGap: false,
				position: 'top'
			}
			],
			yAxis: 
			[
			{
				type: 'value',
				splitLine: {
					show: false
				},
				name : 'bytes/s',
			},
			{
				gridIndex: 1,
				type: 'value',
				splitLine: {
					show: false
				},
				inverse: true,
				name : '（pkts/s）',
				
			}
			],
//			 axisPointer: {
//			        link: {xAxisIndex: 'all'}
//			    },
			series: [
				{
					name: '发送字节',
					type: 'line',
					smooth: true,
					symbol: 'none',
				},
				{
					name: '接受字节',
					type: 'line',
					smooth: true,
					symbol: 'none',
				},
				{
					name: '发送数据包',
					type: 'line',
					smooth: true,
					symbol: 'none',
					xAxisIndex: 1,
		            yAxisIndex: 1,
				},
				{
					name: '接受数据包',
					type: 'line',
					smooth: true,
					symbol: 'none',
					xAxisIndex: 1,
		            yAxisIndex: 1,
				}
			]
		});

		// 加载提示动画
		ioBytesPktsChart.showLoading();
		
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "io/fetchIOByte_Pkts",
			data: {
				limit: 500
			},
			dataType: "json",
			success: function (data) {
				if (data.success) {

					if (data.dataObject.BYTES_IN != null) {
						data.dataObject.BYTES_IN.reverse();
						$.each(data.dataObject.BYTES_IN, function (i, item) {
							byteInData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
							]);
						});
						bytesinLastFetchTime = data.dataObject.BYTES_IN[0].processTime;
					}
					if (data.dataObject.BYTES_OUT != null) {
						data.dataObject.BYTES_OUT.reverse();
						$.each(data.dataObject.BYTES_OUT, function (i, item) {
							byteOutData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
								]);
						});
						bytesoutLastFetchTime = data.dataObject.BYTES_OUT[0].processTime;
					}
					if (data.dataObject.PKTS_IN != null) {
						data.dataObject.PKTS_IN.reverse();
						$.each(data.dataObject.PKTS_IN, function (i, item) {
							pktsInData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
								]);
						});
						pktsinLastFetchTime = data.dataObject.BYTES_IN[0].processTime;
					}
					if (data.dataObject.PKTS_OUT != null) {
						data.dataObject.PKTS_OUT.reverse();
						$.each(data.dataObject.PKTS_OUT, function (i, item) {
							pktsOutData.push([
								Math.round(item.processTime / timeGap) * timeGap * 1000,
								Math.round((item.sum))
								]);
						});
						pktsoutLastFetchTime = data.dataObject.BYTES_IN[0].processTime;
					}
					// 关闭提示动画
					ioBytesPktsChart.hideLoading();
					// 填入数据
					ioBytesPktsChart.setOption({
						xAxis:
							[
							{
								type: 'time',
								splitLine: {
									show: false
								},
								boundaryGap: false,
								//min:byteInData[0][0]
								
							}
							,
							{
								gridIndex: 1,
								type: 'time',
								splitLine: {
									show: false
								},
								boundaryGap: false,
								position: 'top',
								//min:byteInData[0][0]
							}
							],
							
						series: [
							{
								name: '发送字节',
								data: byteInData
							},
							{
								name: '接受字节',
								data: byteOutData
							},
							{
								name: '发送数据包',
								data: pktsInData,
								xAxisIndex: 1,
					            yAxisIndex: 1
							},
							{
								name: '接受数据包',
								data: pktsOutData,
								xAxisIndex: 1,
					            yAxisIndex: 1
							}
						]
					});
					updateDataTableUI();
					
				}
				setInterval(fetchBytesPktsDataInterval, 8000);
			}
		});
	});
	
})();

