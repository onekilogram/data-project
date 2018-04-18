/**
 * Created by likeugo on 2017/7/24
 * 
 */

(function() {

	var cpu_proc = null;

	var procRun = [];// 空闲比例
	var procTotal = [];// 用户进程空间内改变过优先级的进程占用CPU百分比

	// 获取应用运行数据
	function fetchCPUDataInterval(limit) {
		if (limit == null) {
			limit = 1;
		}
		$.ajax({
			type : "POST",
			url : monitorWebBaseURL + "cpu/fetchCPU_Proc",
			data : {
				'limit' : limit
			},
			dataType : "json",
			success : function(data) {
				if (data != null) {

					var procRuns = data.dataObject.procRun;
					var procTotals = data.dataObject.procTotal;

					procRuns.reverse();
					procTotal.reverse();

					for ( var i in procRuns) {
						procRun.push([ procRuns[i].processTime * 1000,
								(procRuns[i].sum+4) ]);
						procTotal.push([ procRuns[i].processTime * 1000,
								(procTotals[i].sum) ]);
					}

					if (procRun.length >= 200) {
						procRun.shift(); // 删除第一个
						procTotal.shift(); // 删除第一个
					}
					// 更新当前状态

					$("#procRunningNum").html(parseInt(procRuns[0].sum+4));
					$("#procTatalNum").html(parseInt(procTotals[0].sum));

					// 设置最大值
					// 填入数据
					cpu_proc.setOption({
						series : [ {
							name : '进程总数',
							data : procTotal
						}, {
							name : '进程正在运行',
							data : procRun
						}, ]
					});
				}
			}
		});
	}

	// 定时获得CPU数据，追加到原有的数据之后
	function fetchCPUDataIntervalByone() {
		$
				.ajax({
					type : "POST",
					url : monitorWebBaseURL + "cpu/fetchCPU_Proc",
					data : {
						'limit' : 1
					},
					dataType : "json",
					success : function(data) {
						if (data != null) {

							var procRuns = data.dataObject.procRun;
							var procTotals = data.dataObject.procTotal;

							procRuns.reverse();
							procTotals.reverse();

							for ( var i in procRuns) {
								if (procRun.length != 0
										&& procRun[procRun.length - 1][0] != procRuns[i].processTime * 1000) {
									procRun.push([
											procRuns[i].processTime * 1000,
											(procRuns[i].sum+4) ]);
									procTotal.push([
											procRuns[i].processTime * 1000,
											(procTotals[i].sum)]);
								}
							}
							if (procRun.length >= 200) {
								procRun.shift(); // 删除第一个
								procTotal.shift(); // 删除第一个
							}
							// 更新当前状态

							$("#procRunningNum")
									.html(parseInt(procRuns[0].sum+4));
							$("#procTatalNum")
									.html(parseInt(procTotals[0].sum));

							// 设置最大值
							// 填入数据
							cpu_proc.setOption({
								series : [ {
									name : '进程总数',
									data : procTotal
								}, {
									name : '进程正在运行',
									data : procRun
								}, ]
							});
						}
					}
				});
	}

	$(function() {

		// 基于准备好的dom，初始化echarts实例
		cpu_proc = echarts.init(document.getElementById('cpu_proc'));

		// 设置图表属性
		cpu_proc.setOption({
			title : {
				text : '进程状态',
				top : 5,
				left : 5
			},
			grid : {
				height : 300,
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
				data : [ '进程总数', '进程正在运行' ],
				top : '10px',

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
				name : '（个）',
				type : 'value',
				boundaryGap: false,
				min : 0,
				minInterval : 3,
			},
			series : [ {
				name : '进程总数',
				type : 'line',
				smooth: true,
				symbol: 'none',
				data : []
			}, {
				name : '进程正在运行',
				type : 'line',
				smooth: true,
				symbol: 'none',
				data : []
			}

			]
		});

		// 加载提示动画
		cpu_proc.showLoading();

		fetchCPUDataInterval(20);
		// 关闭提示动画
		cpu_proc.hideLoading();

		setInterval(fetchCPUDataIntervalByone, 8000);
	});
})();
