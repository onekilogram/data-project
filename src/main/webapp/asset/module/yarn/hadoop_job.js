/**
 * Created by likeugo on 2017/6/4
 */

(function() {

	var appChart = null;
	var sparkChart = null;
	var mapReduceRunningData = []; //运行
	var mapReduceKilledData = []; //kill
	var mapReduceAcceptedData = []; //接受
	var mapReduceNewData = [];//新的
	var mapReduceSubmittedData = [];//提交
	var mapReduceFinishedData = [];//已完成
	var mapReduceNew_savingData = []; //
	var mapReduceFailedData = []; //失败
	var mr_max = 0;

	var sparkRunningData = []; //运行
	var sparkKilledData = []; //kill
	var sparkAcceptedData = []; //接受
	var sparkNewData = [];//新的
	var sparkSubmittedData = [];//提交
	var sparkFinishedData = [];//已完成
	var sparkNew_savingData = []; //
	var sparkFailedData = []; //失败
	var sp_max = 0;

	// 获取应用运行数据
	function fetchAppDataInterval() {
		$
				.ajax({
					type : "POST",
					url : monitorWebBaseURL + "index/app",
					data : {},
					dataType : "json",
					success : function(data) {
						if (data != null) {

							var mrRunning = 0, mrKilled = 0, mrAccepted = 0, mrNew = 0, mrSubmitted = 0, mrFinished = 0, mrNew_saving = 0, mrFailed = 0;
							var spRunning = 0, spKilled = 0, spAccepted = 0, spNew = 0, spSubmitted = 0, spFinished = 0, spNew_saving = 0, spFailed = 0;

							$.each(data.mapReduceApp.appStatInfo.statItem,
									function(i, item) {
										switch (item.state) {
										case 'RUNNING':
											mrRunning = item.count;
											break;
										case 'KILLED':
											mrKilled = item.count;
											break;
										case 'ACCEPTED':
											mrAccepted = item.count;
											break;
										case 'NEW':
											mrNew = item.count;
											break;
										case 'SUBMITTED':
											mrSubmitted = item.count;
											break;
										case 'FINISHED':
											mrFinished = item.count;
											break;
										case 'NEW_SAVING':
											mrNew_saving = item.count;
											break;
										case 'FAILED':
											mrFailed = item.count;
										}
									});

//							$.each(data.sparkApp.appStatInfo.statItem,
//									function(i, item) {
//										switch (item.state) {
//										case 'RUNNING':
//											spRunning = item.count;
//											break;
//										case 'KILLED':
//											spKilled = item.count;
//											break;
//										case 'ACCEPTED':
//											spAccepted = item.count;
//											break;
//										case 'NEW':
//											spNew = item.count;
//											break;
//										case 'SUBMITTED':
//											spSubmitted = item.count;
//											break;
//										case 'FINISHED':
//											spFinished = item.count;
//											break;
//										case 'NEW_SAVING':
//											spNew_saving = item.count;
//											break;
//										case 'FAILED':
//											spFailed = item.count;
//										}
//									});
							
							spRunning = spRunning = data.sparkApp.length;

							$("#hadoopAppCount").html(mrRunning);

							$("#sparkAppCount").html(spRunning);

							var now = new Date().getTime();
							if (mapReduceRunningData.length >= 200) { //running
								mapReduceRunningData.shift(); //删除第一个
								mapReduceKilledData.shift(); //删除第一个
								mapReduceAcceptedData.shift();
								mapReduceNewData.shift(); //删除第一个
								mapReduceSubmittedData.shift();//提交
								mapReduceFinishedData.shift();//已完成
								mapReduceNew_savingData.shift(); //
								mapReduceFailedData.shift(); //失败
							}
							if (sparkRunningData.length >= 200) {
								sparkRunningData.shift(); //删除第一个
//								sparkKilledData.shift(); //删除第一个
//								sparkAcceptedData.shift();
//								sparkNewData.shift(); //删除第一个
//								sparkSubmittedData.shift();//提交
//								sparkFinishedData.shift();//已完成
//								sparkNew_savingData.shift(); //
//								sparkFailedData.shift(); //失败
							}

							mapReduceRunningData.push([ now, mrRunning ]);
							mapReduceKilledData.push([ now, mrKilled ]);
							mapReduceAcceptedData.push([ now, mrAccepted ]);
							mapReduceNewData.push([ now, mrNew ]);
							mapReduceSubmittedData.push([ now, mrSubmitted ]);
							mapReduceFinishedData.push([ now, mrFinished ]);
							mapReduceNew_savingData.push([ now, mrNew_saving ]);
							mapReduceFailedData.push([ now, mrFailed ]);

							sparkRunningData.push([ now, spRunning ]);
//							sparkKilledData.push([ now, spKilled ]);
//							sparkAcceptedData.push([ now, spAccepted ]);
//							sparkNewData.push([ now, spNew ]);
//							sparkSubmittedData.push([ now, spSubmitted ]);
//							sparkFinishedData.push([ now, spFinished ]);
//							sparkNew_savingData.push([ now, spNew_saving ]);
//							sparkFailedData.push([ now, spFailed ]);

							//更新当前状态
							$("#mrRunningNum").html(mrRunning);
							$("#mrFailedNum").html(mrFailed);
							$("#mrKilledNum").html(mrKilled);
							$("#mrFinishedNum").html(mrFinished);

							$("#spRunningNum").html(spRunning);
//							$("#spFailedNum").html(spFailed);
//							$("#spKilledNum").html(spKilled);
//							$("#spFinishedNum").html(spFinished);

							//选择一个较大的值
							if (mrRunning > mr_max) {
								mr_max = mrRunning + 2;
							}
							if (mrKilled > mr_max) {
								mr_max = mrKilled + 2;
							}
							if (mrAccepted > mr_max) {
								mr_max = mrAccepted + 2;
							}
							if (mrNew > mr_max) {
								mr_max = mrNew + 2;
							}
							if (mrSubmitted > mr_max) {
								mr_max = mrSubmitted + 2;
							}
//							if (mrFinished > mr_max) {
//								mr_max = mrFinished + 2;
//							}
							if (mrNew_saving > mr_max) {
								mr_max = mrNew_saving + 2;
							}
							if (mrFailed > mr_max) {
								mr_max = mrFailed + 2;
							}

							//选择一个较大的值
							if (spRunning > sp_max) {
								sp_max = spRunning + 2;
							}
//							if (spKilled > sp_max) {
//								sp_max = spKilled + 2;
//							}
//							if (spAccepted > sp_max) {
//								sp_max = spAccepted + 2;
//							}
//							if (spNew > sp_max) {
//								sp_max = spNew + 2;
//							}
//							if (spSubmitted > sp_max) {
//								sp_max = spSubmitted + 2;
//							}
//							if (spFinished > sp_max) {
//								sp_max = spFinished + 2;
//							}
//							if (spNew_saving > sp_max) {
//								sp_max = spNew_saving + 2;
//							}
//							if (spFailed > sp_max) {
//								sp_max = spFailed + 2;
//							}

							// sparkRunningData.push([now,spRunning]);

							// 填入数据
							appChart.setOption({
								yAxis : {
									type : 'value',
									min : 0,
									minInterval : 1,
									max : mr_max
								},
								series : [ {
									name : '运行中',
									data : mapReduceRunningData
								}, {
									name : '失败',
									data : mapReduceFailedData
								}, {
									name : '杀掉',
									data : mapReduceKilledData
								} ]
							});

							// 填入数据
							sparkChart.setOption({
								yAxis : {
									name : '数量（个）',
									type : 'value',
									min : 0,
									minInterval : 1,
									max : sp_max
								},
								series : [ {
									name : '运行中',
									data : sparkRunningData,
									symbol: 'none'
								}
//								, {
//									name : '失败',
//									data : sparkFailedData
//								}, {
//									name : '杀掉',
//									data : sparkKilledData
//								} 
								]
							});

						}
					}
				});
	}
	// 获取应用运行数据
	function fetchAppDataFour() {
		$
				.ajax({
					type : "POST",
					url : monitorWebBaseURL + "index/app",
					data : {},
					dataType : "json",
					success : function(data) {
						if (data != null) {

							var mrRunning = 0, mrKilled = 0, mrAccepted = 0, mrNew = 0, mrSubmitted = 0, mrFinished = 0, mrNew_saving = 0, mrFailed = 0;
							var spRunning = 0, spKilled = 0, spAccepted = 0, spNew = 0, spSubmitted = 0, spFinished = 0, spNew_saving = 0, spFailed = 0;

							$.each(data.mapReduceApp.appStatInfo.statItem,
									function(i, item) {
										switch (item.state) {
										case 'RUNNING':
											mrRunning = item.count;
											break;
										case 'KILLED':
											mrKilled = item.count;
											break;
										case 'ACCEPTED':
											mrAccepted = item.count;
											break;
										case 'NEW':
											mrNew = item.count;
											break;
										case 'SUBMITTED':
											mrSubmitted = item.count;
											break;
										case 'FINISHED':
											mrFinished = item.count;
											break;
										case 'NEW_SAVING':
											mrNew_saving = item.count;
											break;
										case 'FAILED':
											mrFailed = item.count;
										}
									});

//							$.each(data.sparkApp.appStatInfo.statItem,
//									function(i, item) {
//										switch (item.state) {
//										case 'RUNNING':
//											spRunning = item.count;
//											break;
//										case 'KILLED':
//											spKilled = item.count;
//											break;
//										case 'ACCEPTED':
//											spAccepted = item.count;
//											break;
//										case 'NEW':
//											spNew = item.count;
//											break;
//										case 'SUBMITTED':
//											spSubmitted = item.count;
//											break;
//										case 'FINISHED':
//											spFinished = item.count;
//											break;
//										case 'NEW_SAVING':
//											spNew_saving = item.count;
//											break;
//										case 'FAILED':
//											spFailed = item.count;
//										}
//									});
							
							spRunning = spRunning = data.sparkApp.length;

							$("#hadoopAppCount").html(mrRunning);

							$("#sparkAppCount").html(spRunning);

							var now = new Date().getTime();
							if (mapReduceRunningData.length >= 200) { //running
								mapReduceRunningData.shift(); //删除第一个
								mapReduceKilledData.shift(); //删除第一个
								mapReduceAcceptedData.shift();
								mapReduceNewData.shift(); //删除第一个
								mapReduceSubmittedData.shift();//提交
								mapReduceFinishedData.shift();//已完成
								mapReduceNew_savingData.shift(); //
								mapReduceFailedData.shift(); //失败
							}
							if (sparkRunningData.length >= 200) {
								sparkRunningData.shift(); //删除第一个
//								sparkKilledData.shift(); //删除第一个
//								sparkAcceptedData.shift();
//								sparkNewData.shift(); //删除第一个
//								sparkSubmittedData.shift();//提交
//								sparkFinishedData.shift();//已完成
//								sparkNew_savingData.shift(); //
//								sparkFailedData.shift(); //失败
							}
                            
							for(var i =5;i>=0;i--){
								
								mapReduceRunningData.push([ now-i*7000, mrRunning ]);
								mapReduceKilledData.push([ now-i*7000, mrKilled ]);
								mapReduceAcceptedData.push([ now-i*7000, mrAccepted ]);
								mapReduceNewData.push([ now-i*7000, mrNew ]);
								mapReduceSubmittedData.push([ now-i*7000, mrSubmitted ]);
								mapReduceFinishedData.push([ now-i*7000, mrFinished ]);
								mapReduceNew_savingData.push([ now-i*7000, mrNew_saving ]);
								mapReduceFailedData.push([ now-i*7000, mrFailed ]);

								sparkRunningData.push([ now-i*7000, spRunning ]);
							}
						
//							sparkKilledData.push([ now, spKilled ]);
//							sparkAcceptedData.push([ now, spAccepted ]);
//							sparkNewData.push([ now, spNew ]);
//							sparkSubmittedData.push([ now, spSubmitted ]);
//							sparkFinishedData.push([ now, spFinished ]);
//							sparkNew_savingData.push([ now, spNew_saving ]);
//							sparkFailedData.push([ now, spFailed ]);

							//更新当前状态
							$("#mrRunningNum").html(mrRunning);
							$("#mrFailedNum").html(mrFailed);
							$("#mrKilledNum").html(mrKilled);
							$("#mrFinishedNum").html(mrFinished);

							$("#spRunningNum").html(spRunning);
//							$("#spFailedNum").html(spFailed);
//							$("#spKilledNum").html(spKilled);
//							$("#spFinishedNum").html(spFinished);

							//选择一个较大的值
							if (mrRunning > mr_max) {
								mr_max = mrRunning + 2;
							}
							if (mrKilled > mr_max) {
								mr_max = mrKilled + 2;
							}
							if (mrAccepted > mr_max) {
								mr_max = mrAccepted + 2;
							}
							if (mrNew > mr_max) {
								mr_max = mrNew + 2;
							}
							if (mrSubmitted > mr_max) {
								mr_max = mrSubmitted + 2;
							}
//							if (mrFinished > mr_max) {
//								mr_max = mrFinished + 2;
//							}
							if (mrNew_saving > mr_max) {
								mr_max = mrNew_saving + 2;
							}
							if (mrFailed > mr_max) {
								mr_max = mrFailed + 2;
							}

							//选择一个较大的值
							if (spRunning > sp_max) {
								sp_max = spRunning + 2;
							}
//							if (spKilled > sp_max) {
//								sp_max = spKilled + 2;
//							}
//							if (spAccepted > sp_max) {
//								sp_max = spAccepted + 2;
//							}
//							if (spNew > sp_max) {
//								sp_max = spNew + 2;
//							}
//							if (spSubmitted > sp_max) {
//								sp_max = spSubmitted + 2;
//							}
//							if (spFinished > sp_max) {
//								sp_max = spFinished + 2;
//							}
//							if (spNew_saving > sp_max) {
//								sp_max = spNew_saving + 2;
//							}
//							if (spFailed > sp_max) {
//								sp_max = spFailed + 2;
//							}

							// sparkRunningData.push([now,spRunning]);

							// 填入数据
							appChart.setOption({
								yAxis : {
									type : 'value',
									min : 0,
									minInterval : 1,
									max : mr_max
								},
								series : [ {
									name : '运行中',
									data : mapReduceRunningData
								}, {
									name : '失败',
									data : mapReduceFailedData
								}, {
									name : '杀掉',
									data : mapReduceKilledData
								} ]
							});

							// 填入数据
							sparkChart.setOption({
								yAxis : {
									name : '数量（个）',
									type : 'value',
									min : 0,
									minInterval : 1,
									max : sp_max
								},
								series : [ {
									name : '运行中',
									data : sparkRunningData,
									symbol: 'none',
									//areaStyle: {normal: {}}
								}
//								, {
//									name : '失败',
//									data : sparkFailedData
//								}, {
//									name : '杀掉',
//									data : sparkKilledData
//								} 
								]
							});

						}
					}
				});
	}
	$(function() {

		// 基于准备好的dom，初始化echarts实例
		appChart = echarts.init(document.getElementById('hadoopAppChart'));
		sparkChart = echarts.init(document.getElementById('sparkAppChart'));
		// 设置图表属性
		appChart.setOption({
			title : {
				text : 'MapReduce运行任务',
				top : 5,
				left : 5
			},
			grid : {
				height : 190,
				left : '3%',
				right : '4%',
				containLabel : true

			},
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'cross',
					label : {
						backgroundColor : '#6a7985'
					}
				}
			},
			legend : {
				data : [ '运行中', '失败', '杀掉' ],
				//bottom:'bottom',
				top : '10px',
				left : '35%',

			},
			toolbox : {
				feature : {
					dataZoom : {
						yAxisIndex : 'none'
					},
					restore : {},
					saveAsImage : {},
					dataView : {}
				}
			},
			dataZoom : [ { // 这个dataZoom组件，默认控制x轴。
				type : 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
				start : 50, // 左边在 10% 的位置。
				end : 100, // 右边在 60% 的位置。
			} ],
			xAxis : {
				type : 'time',
				splitLine : {
					show : false
				},
				boundaryGap : false
			},
			yAxis : {
				name : '数量（个）',
				type : 'value',
				min : 0,
				minInterval : 1
			},
			series : [ {
				name : '运行中',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '失败',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '杀掉',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, ]
		});

		//以下是spark
		sparkChart.setOption({
			title : {
				text : 'spark运行任务',
				top : 5,
				left : 5
			},
			grid : {
				height : 190,
				left : '3%',
				right : '4%',
				containLabel : true

			},
			tooltip : {
				trigger : 'axis',
				axisPointer : {
					type : 'cross',
					label : {
						backgroundColor : '#6a7985'
					}
				}
			},
			legend : {
				data : [ '运行中'],
//				data : [ '运行中', '失败', '杀掉' ],
				//bottom:'bottom',
				top : '10px',
				left : '25%'

			},
			toolbox : {
				feature : {
					dataZoom : {
						yAxisIndex : 'none'
					},
					restore : {},
					saveAsImage : {},
					dataView : {}
				}
			},
			dataZoom : [ { // 这个dataZoom组件，默认控制x轴。
				type : 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
				start : 50, // 左边在 10% 的位置。
				end : 100, // 右边在 60% 的位置。
			} ],
			xAxis : {
				type : 'time',
				splitLine : {
					show : false
				},
				boundaryGap : false
			},
			yAxis : {
				type : 'value',
				min : 0,
				minInterval : 1
			},
			series : [ {
				name : '运行中',
				type : 'line',
				symbol: 'none',
				//areaStyle: {normal: {}},
				data : []
			}
//			, {
//				name : '失败',
//				type : 'line',
//				// areaStyle: {normal: {}},
//				data : []
//			}, {
//				name : '杀掉',
//				type : 'line',
//				// areaStyle: {normal: {}},
//				data : []
//			},
			]
		});

		// 加载提示动画
		appChart.showLoading();
		sparkChart.showLoading();

		fetchAppDataFour();//获得四个
		setTimeout(fetchAppDataInterval, 2000);
		// 关闭提示动画
		appChart.hideLoading();
		sparkChart.hideLoading();

		setInterval(fetchAppDataInterval, 8000);

	});
})();
