/**
 * Created by liuyou on 2017/5/21.
 */

(function () {

	var appChart = null;
	var mapReduceRunningData = [];
	var sparkRunningData = [];

	// 获取应用运行数据
	function fetchAppDataInterval() {
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "index/app",
			data: {},
			dataType: "json",
			success: function (data) {
				if (data != null && data.mapReduceApp != null && data.sparkApp != null) {

					var mrRunning = 0, mrKilled = 0, mrAccepted = 0, mrNew = 0, mrSubmitted = 0, mrFinished = 0,
						mrNew_saving = 0, mrFailed = 0;
					var spRunning = 0, spKilled = 0, spAccepted = 0, spNew = 0, spSubmitted = 0, spFinished = 0,
						spNew_saving = 0, spFailed = 0;

					$.each(data.mapReduceApp.appStatInfo.statItem, function (i, item) {
						switch (item.state) {
							case 'RUNNING':
								mrRunning = item.count;
								break;
							case 'KILLED' :
								mrKilled = item.count;
								break;
							case 'ACCEPTED' :
								mrAccepted = item.count;
								break;
							case 'NEW' :
								mrNew = item.count;
								break;
							case 'SUBMITTED' :
								mrSubmitted = item.count;
								break;
							case 'FINISHED' :
								mrFinished = item.count;
								break;
							case 'NEW_SAVING' :
								mrNew_saving = item.count;
								break;
							case 'FAILED' :
								mrFailed = item.count;
						}
					});

					spRunning = data.sparkApp.length;

					var now = new Date().getTime();
					if (mapReduceRunningData.length >= 200) {
						mapReduceRunningData.shift();
					}
					if (sparkRunningData.length >= 200) {
						mapReduceRunningData.shift();
					}
					mapReduceRunningData.push([now, mrRunning]);
					sparkRunningData.push([now, spRunning]);

					// 填入数据
					appChart.setOption({
						series: [
							{
								name: '运行中的Map Reduce应用',
								data: mapReduceRunningData
							},
							{
								name: '运行中的Spark应用',
								data: sparkRunningData
							}
						]
					});

					$("#mrRunningNum").html(mrRunning);
					$("#mrFailedNum").html(mrFailed);
					$("#mrKilledNum").html(mrKilled);
					$("#mrFinishedNum").html(mrFinished);

					$("#spRunningNum").html(spRunning);

					$("#yarnAppField").html(spRunning + mrRunning);
				}
			}
		});
	}

	$(function () {

		// 基于准备好的dom，初始化echarts实例
		appChart = echarts.init(document.getElementById('applicationChart'));

		// 设置图表属性
		appChart.setOption({
			title: {
				text: 'Hadoop与Spark运行任务',
				top: 5,
				left: 5
			},
			grid: {
				height: 300,
				left: '3%',
				right: '4%',
				containLabel: true
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
					label: {
						backgroundColor: '#6a7985'
					}
				}
			},
			legend: {
				data: ['运行中的Map Reduce应用', '运行中的Spark应用'],
				top: 10
			},
			toolbox: {
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					restore: {},
					dataView: {},
					saveAsImage: {}
				},
				right: 30,
				top: 5
			},
			dataZoom: [
				{   // 这个dataZoom组件，默认控制x轴。
					type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
					start: 0,      // 左边在 10% 的位置。
					end: 100,         // 右边在 60% 的位置。
				}
			],
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
				max:20,
				minInterval: 1
			},
			series: [
				{
					name: '运行中的Map Reduce应用',
					type: 'line',
					areaStyle: {normal: {}},
					data: [],
					symbol: 'none'
				},
				{
					name: '运行中的Spark应用',
					type: 'line',
					areaStyle: {normal: {}},
					data: [],
					symbol: 'none'
				},
			]
		});

		// 加载提示动画
		appChart.showLoading();

		fetchAppDataInterval();

		// 关闭提示动画
		appChart.hideLoading();

		setInterval(fetchAppDataInterval, 8000);
	});
})();

