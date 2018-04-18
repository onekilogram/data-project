/**
 * Created by likeugo on 2017/7/24
 * 
 */

(function() {

	var cpuChart = null;

	var cpuIdle = [];// 空闲比例
	var cpuNice = [];// 用户进程空间内改变过优先级的进程占用CPU百分比
	var cpuSystem = [];// 内核空间所占CPU
	var cpuUser = [];// 用户空间所占CPU
	var cpuWio = [];// 等待I/O所占CPU

	// 获取应用运行数据
	function fetchCPUDataInterval(limit) {
		if(limit==null){
			limit=1;
		}
		$
				.ajax({
					type : "POST",
					url : monitorWebBaseURL + "cpu/fetchCPU_Ratio",
					data : {
						'limit' : limit
					},
					dataType : "json",
					success : function(data) {
						if (data != null) {

							var cpuIdles = data.dataObject.cpuIdle;
							var cpuNices = data.dataObject.cpuNice;
							var cpuSystems = data.dataObject.cpuSystem;
							var cpuUsers = data.dataObject.cpuUser;
							var cpuWios = data.dataObject.cpuWio;

							 cpuIdles.reverse();
							 cpuNices.reverse();
							 cpuSystems.reverse();
							 cpuUsers.reverse();
							 cpuWios.reverse();
							 
							var now = new Date().getTime();

							for ( var i in cpuIdles) {
								cpuIdle.push([
										cpuIdles[i].processTime * 1000,
										(100-cpuIdles[i].sum / cpuIdles[i].num)
												.toFixed(2) ]);
								cpuNice.push([
									cpuIdles[i].processTime * 1000,
										(cpuNices[i].sum / cpuNices[i].num)
												.toFixed(2) ]);
								cpuSystem.push([
									cpuIdles[i].processTime * 1000,
										(cpuSystems[i].sum / cpuSystems[i].num)
												.toFixed(2) ]);
								cpuUser.push([
									cpuIdles[i].processTime * 1000,
										(cpuUsers[i].sum / cpuUsers[i].num)
												.toFixed(2) ]);
								cpuWio.push([
									cpuIdles[i].processTime * 1000,
										(cpuWios[i].sum / cpuWios[i].num)
												.toFixed(2) ]);
							}

							if (cpuIdle.length >= 200) {
								cpuIdle.shift(); // 删除第一个
								cpuNice.shift(); // 删除第一个
								cpuSystem.shift(); // 删除第一个
								cpuUser.shift(); // 删除第一个
								cpuWio.shift(); // 删除第一个
							}
							// 更新当前状态
							$("#cpuIdle2").html(
									(100-cpuIdles[limit-1].sum / cpuIdles[limit-1].num)
									.toFixed(2)+"%");
							$("#cpuNice").html(
									(cpuNices[limit-1].sum / cpuNices[limit-1].num)
											.toFixed(2)+"%");
							$("#cpuSystem").html(
									(cpuSystems[limit-1].sum / cpuSystems[limit-1].num)
											.toFixed(2)+"%");
							$("#cpuUser").html(
									(cpuUsers[limit-1].sum / cpuUsers[limit-1].num)
											.toFixed(2)+"%");
							$("#cpuWio").html(
									(cpuWios[limit-1].sum / cpuWios[limit-1].num)
											.toFixed(2)+"%");

							// 设置最大值
							// 填入数据
							cpuChart.setOption({
								series : [ {
									name : 'CPU使用率',
									data : cpuIdle
								}, {
									name : '内核',
									data : cpuSystem
								},

								{
									name : '用户',
									data : cpuUser
								},

								{
									name : '等待I/O',
									data : cpuWio
								}
//								, {
//									name : '用户进程',
//									data : cpuNice
//								}
								]
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
					url : monitorWebBaseURL + "cpu/fetchCPU_Ratio",
					data : {
						'limit' : 1
					},
					dataType : "json",
					success : function(data) {
						if (data != null) {

							var cpuIdles = data.dataObject.cpuIdle;
							var cpuNices = data.dataObject.cpuNice;
							var cpuSystems = data.dataObject.cpuSystem;
							var cpuUsers = data.dataObject.cpuUser;
							var cpuWios = data.dataObject.cpuWio;

							 cpuIdles.reverse();
							 cpuNices.reverse();
							 cpuSystems.reverse();
							 cpuUsers.reverse();
							 cpuWios.reverse();
							 
							var now = new Date().getTime();

							for ( var i in cpuIdles) {
								if(cpuIdle.length!=0 && cpuIdle[cpuIdle.length-1][0]<cpuIdles[i].processTime * 1000)
								{
									cpuIdle.push([
										cpuIdles[i].processTime * 1000,
										(100-cpuIdles[i].sum / cpuIdles[i].num)
												.toFixed(2) ]);
								cpuNice.push([
									cpuIdles[i].processTime * 1000,
										(cpuNices[i].sum / cpuNices[i].num)
												.toFixed(2) ]);
								cpuSystem.push([
									cpuIdles[i].processTime * 1000,
										(cpuSystems[i].sum / cpuSystems[i].num)
												.toFixed(2) ]);
								cpuUser.push([
									cpuIdles[i].processTime * 1000,
										(cpuUsers[i].sum / cpuUsers[i].num)
												.toFixed(2) ]);
								cpuWio.push([
									cpuIdles[i].processTime * 1000,
										(cpuWios[i].sum / cpuWios[i].num)
												.toFixed(2) ]);
								}
							}
							if (cpuIdle.length >= 200) {
								cpuIdle.shift(); // 删除第一个
								cpuNice.shift(); // 删除第一个
								cpuSystem.shift(); // 删除第一个
								cpuUser.shift(); // 删除第一个
								cpuWio.shift(); // 删除第一个
							}
							// 更新当前状态
							$("#cpuIdle2").html(
									(100-cpuIdles[0].sum / cpuIdles[0].num)
									.toFixed(2)+"%");
							$("#cpuNice").html(
									(cpuNices[0].sum / cpuNices[0].num)
											.toFixed(2)+"%");
							$("#cpuSystem").html(
									(cpuSystems[0].sum / cpuSystems[0].num)
											.toFixed(2)+"%");
							$("#cpuUser").html(
									(cpuUsers[0].sum / cpuUsers[0].num)
											.toFixed(2)+"%");
							$("#cpuWio").html(
									(cpuWios[0].sum / cpuWios[0].num)
											.toFixed(2)+"%");

							// 设置最大值
							// 填入数据
							cpuChart.setOption({
								series : [ {
									name : 'CPU使用率',
									data : cpuIdle
								}, {
									name : '内核',
									data : cpuSystem
								},

								{
									name : '用户',
									data : cpuUser
								},

								{
									name : '等待I/O',
									data : cpuWio
								}
//								, {
//									name : '用户进程',
//									data : cpuNice
//								} 
								]
							});
						}
					}
				});
	}
	
	$(function() {

		// 基于准备好的dom，初始化echarts实例
		cpuChart = echarts.init(document.getElementById('cpu_ratio'));

		// 加载提示动画
		cpuChart.showLoading();
		
		// 设置图表属性
		cpuChart.setOption({
			title : {
				text : 'CPU状态',
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
			//	data : [ 'CPU使用率', '内核', '用户', 'I/O', '用户进程' ],
				data : [ 'CPU使用率', '内核', '用户', '等待I/O' ],
				// bottom:'bottom',
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
				name : '（%）',
				type : 'value',
				boundaryGap: false,
				min:0,
				minInterval : 3
			},
			series : [ {
				name : 'CPU使用率',
				type : 'line',
				symbol: 'none',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '内核',
				type : 'line',
				symbol: 'none',
				// areaStyle: {normal: {}},
				data : []
			}, {
				name : '用户',
				type : 'line',
				symbol: 'none',
				// areaStyle: {normal: {}},
				data : []
			},

			{
				name : '等待I/O',
				type : 'line',
				symbol: 'none',
				// areaStyle: {normal: {}},
				data : []
			},

//			{
//				name : '用户进程',
//				type : 'line',
//				// areaStyle: {normal: {}},
//				data : []
//			},

			]
		});

		fetchCPUDataInterval(50);
		// 关闭提示动画
		//cpuChart.hideLoading();
		setTimeout(function(){ cpuChart.hideLoading(); }, 1000);

		setInterval(fetchCPUDataIntervalByone, 8000);
	});
})();
