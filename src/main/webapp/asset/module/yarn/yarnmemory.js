/**
 * Created by likeugo on 2017/6/4
 * 
 * 把
 * 
 */

(function() {

	var memChart = null;

	// var totalMB = []; //总的
	var reservedMB = []; // 预留
	var availableMB = []; // 可用
	var allocatedMB = [];// 已用
	var totalMB = 0;

	// 同理给container来一份
	var containerChar = null;
	var reserveContainer = []; // 预留
	var pandingContainer = []; // 待分配
	var allocatedContainer = [];// 已用
	var Container = 0;

	// 获取应用运行数据
	function fetchmemDataInterval() {
		$.ajax({
			type : "POST",
			url : monitorWebBaseURL + "index/cluster/metrics",
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null) {

					var reserved = 0, available = 0, allocated = 0;

					reserved = data.clusterMetrics.reservedMB;
					available = data.clusterMetrics.availableMB;
					allocated = data.clusterMetrics.allocatedMB;
					totalMB = data.clusterMetrics.totalMB;

					var now = new Date().getTime();

					if (reservedMB.length >= 20) {
						reservedMB.shift(); // 删除第一个
						availableMB.shift(); // 删除第一个
						allocatedMB.shift(); // 删除第一个

					}

					reservedMB.push([ now, reserved ]);
					availableMB.push([ now, available ]);
					allocatedMB.push([ now, allocated ]);

					// 更新当前状态
					$("#memReserved").html(reserved);
					$("#memAvailable").html(available);
					$("#memAllocated").html(allocated);
					$("#memTotal").html(totalMB);
					// 设置最大值

					// 填入数据
					memChart.setOption({
						series : [ {
							name : '可用',
							data : availableMB
						}, {
							name : '已用',
							data : allocatedMB
						}, {
							name : '预留',
							data : reservedMB
						} ]
					});

					// 给Container

					var reservedC = 0, pangdingC = 0, allocatedC = 0;

					reservedC = data.clusterMetrics.containersReserved;
					pangdingC = data.clusterMetrics.containersPending;
					allocatedC = data.clusterMetrics.containersAllocated;
					// Container = data.clusterMetrics.totalMB;

					if (reserveContainer.length >= 20) {
						reserveContainer.shift(); // 删除第一个
						pandingContainer.shift(); // 删除第一个
						allocatedContainer.shift(); // 删除第一个

					}

					reserveContainer.push([ now, reservedC ]);
					pandingContainer.push([ now, pangdingC ]);
					allocatedContainer.push([ now, allocatedC ]);

					// 更新当前状态
					$("#reservedC").html(reservedC);
					$("#pangdingC").html(pangdingC);
					$("#allocatedC").html(allocatedC);
					
					// 填入数据
					containerChar.setOption({
						series : [ {
							name : '待分配',
							data : pandingContainer
						}, {
							name : '已用',
							data : allocatedContainer
						}, {
							name : '预留',
							data : reserveContainer
						} ]
					});

				}
			}
		});
	}

	// 获取应用运行数据
	function fetchmemDataFour() {
		$.ajax({
			type : "POST",
			url : monitorWebBaseURL + "index/cluster/metrics",
			data : {},
			dataType : "json",
			success : function(data) {
				if (data != null) {

					var reserved = 0, available = 0, allocated = 0;

					reserved = data.clusterMetrics.reservedMB;
					available = data.clusterMetrics.availableMB;
					allocated = data.clusterMetrics.allocatedMB;
					totalMB = data.clusterMetrics.totalMB;

					var now = new Date().getTime();

					if (reservedMB.length >= 20) {
						reservedMB.shift(); // 删除第一个
						availableMB.shift(); // 删除第一个
						allocatedMB.shift(); // 删除第一个

					}
					 for(var i = 5;i>=0;i--){
                        reservedMB.push([ now-i*7000, reserved ]);
     					availableMB.push([ now-i*7000, available ]);
     					allocatedMB.push([ now-i*7000, allocated ]);
                    }
					// 更新当前状态
					$("#memReserved").html(reserved);
					$("#memAvailable").html(available);
					$("#memAllocated").html(allocated);
					$("#memTotal").html(totalMB);
					// 设置最大值

					// 填入数据
					memChart.setOption({
						series : [ {
							name : '可用',
							data : availableMB
						}, {
							name : '已用',
							data : allocatedMB
						}, {
							name : '预留',
							data : reservedMB
						} ]
					});

					// 给Container

					var reservedC = 0, pangdingC = 0, allocatedC = 0;

					reservedC = data.clusterMetrics.containersReserved;
					pangdingC = data.clusterMetrics.containersPending;
					allocatedC = data.clusterMetrics.containersAllocated;
					// Container = data.clusterMetrics.totalMB;

					if (reserveContainer.length >= 20) {
						reserveContainer.shift(); // 删除第一个
						pandingContainer.shift(); // 删除第一个
						allocatedContainer.shift(); // 删除第一个

					}
					 for(var i = 5;i>=0;i--){
	     				reserveContainer.push([ now-i*7000, reservedC ]);
	    				pandingContainer.push([ now-i*7000, pangdingC ]);
	    				allocatedContainer.push([ now-i*7000, allocatedC ]);
	                }
					// 更新当前状态
					$("#reservedC").html(reservedC);
					$("#pangdingC").html(pangdingC);
					$("#allocatedC").html(allocatedC);
					
					// 填入数据
					containerChar.setOption({
						series : [ {
							name : '待分配',
							data : pandingContainer
						}, {
							name : '已用',
							data : allocatedContainer
						}, {
							name : '预留',
							data : reserveContainer
						} ]
					});

				}
			}
		});
	}

	$(function() {

		// 基于准备好的dom，初始化echarts实例
		memChart = echarts.init(document.getElementById('memChart'));

		// 设置图表属性
		memChart.setOption({
			title : {
				text : '内存状态',
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
				data : [ '可用', '已用', '预留' ],
				// bottom:'bottom',
				top : '10px',
				left : '50%',
				width : '200px',

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
				name : '（MB）',
				type : 'value',
				min : 0,
				minInterval : 3
			},
			series : [ {
				name : '可用',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '已用',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '预留',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, ]
		});

		// 基于准备好的dom，初始化echarts实例
		containerChar = echarts.init(document.getElementById('containChart'));

		// 设置图表属性
		containerChar.setOption({
			title : {
				text : 'container状态',
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
				data : [ '待分配', '已用', '预留' ],
				// bottom:'bottom',
				top : '10px',
				left : '50%',
				width : '200px',

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
				minInterval : 3
			},
			series : [ {
				name : '待分配',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '已用',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '预留',
				type : 'line',
				// areaStyle: {normal: {}},
				data : []
			}, ]
		});

		// 加载提示动画
		memChart.showLoading();
		containerChar.showLoading();

		fetchmemDataFour();

		// 关闭提示动画
		memChart.hideLoading();

		containerChar.hideLoading();

		setInterval(fetchmemDataInterval, 8000);
	});
})();
