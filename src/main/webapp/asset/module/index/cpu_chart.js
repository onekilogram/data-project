/**
 * Created by liuyou on 2017/5/21.
 */

(function () {

	var cpuChart = null;
	var cpuData = [];

	// 获取CPU数据
	function fetchCpuDataInterval() {
		if (cpuData !== null && cpuData.length !== 0) {
			$.ajax({
				type: "POST",
				url: monitorWebBaseURL + "index/cpu",
				data: {
					limit: 2,
					start: cpuData[cpuData.length - 1][0] / 1000 + 1
				},
				dataType: "json",
				success: function (data) {
					if (data.success) {
						data.dataObject.reverse();
						$.each(data.dataObject, function (i, item) {
							cpuData.shift();
							cpuData.push([
								item.processTime * 1000,
								(100 - item.sum / item.num).toFixed(1)
							]);
						});

						// 填入数据
						cpuChart.setOption({
							series: {
								// 根据名字对应到相应的系列
								name: '平均使用率',
								data: cpuData
							}
						});
					}
				}
			});
		}
	}

	$(function () {

		// 基于准备好的dom，初始化echarts实例
		cpuChart = echarts.init(document.getElementById('cpuChart'));

		// 设置图表属性
		cpuChart.setOption({
			title: {
				text: '集群平均CPU使用率',
				top: 5,
				left: 5
			},
			grid: {
				height: 165
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
			visualMap: {
				top: 10,
				right: 10,
				pieces: [{
					gt: 0,
					lte: 20,
					color: '#660099'
				}, {
					gt: 20,
					lte: 50,
					color: '#ffde33'
				}, {
					gt: 50,
					lte: 70,
					color: '#ff9933'
				}, {
					gt: 70,
					lte: 100,
					color: '#ff0000'
				}],
				outOfRange: {
					color: '#999'
				},
				showLabel: false,
				show: false
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
				min: 0,
				max: 100,
				splitLine: {
					show: false
				}
			},
			series: [{
				name: '平均使用率',
				type: 'line',
				data: [],
				smooth: true,
				symbol: 'none',
				areaStyle: {
					normal: {}
				},
				markLine: {
					silent: true,
					data: [{
						yAxis: 20
					}, {
						yAxis: 50
					}, {
						yAxis: 70
					}, {
						yAxis: 100
					}]
				}
			}]
		});

		// 加载提示动画
		cpuChart.showLoading();
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "index/cpu",
			data: {
				limit: 100
			},
			dataType: "json",
			success: function (data) {
				if (data.success) {
					$.each(data.dataObject, function (i, item) {
						cpuData.unshift([
							item.processTime * 1000,
							(100 - item.sum / item.num).toFixed(1)
						]);
					});

					// 关闭提示动画
					cpuChart.hideLoading();

					// 填入数据
					cpuChart.setOption({
						series: {
							// 根据名字对应到相应的系列
							name: '平均使用率',
							data: cpuData
						}
					});
				}
				setInterval(fetchCpuDataInterval, 8000);
			}
		});
	});
})();

