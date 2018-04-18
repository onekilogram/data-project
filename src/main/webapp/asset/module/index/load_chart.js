/**
 * Created by liuyou on 2017/5/21.
 */

(function () {

    var loadChart = null;
    var loadData = [];
    var loadDataProcessed = false; //初始载入的负载数据是否是经过处理的

	//获得负载严重性的HTML标签表示
	function getLoadSeverity(lo) {
		if(!isNaN(lo)){
			var str = '<span class="badge bg-blue">'+lo+'</span>';
			if(lo<=1){
				return str+' <span class="badge bg-green">低</span>';
			} else if(lo>1 && lo<=2) {
				return str+' <span class="badge bg-yellow">中</span>';
			} else if(lo>2 && lo<3) {
				return str+' <span class="badge bg-orange">高</span>';
			} else if(lo>=3) {
				return str+' <span class="badge bg-red">极高</span>';
			}
		}
	}

    // 获取负载数据
    function fetchLoadDataInterval() {
        if (loadData !== null && loadData.length !== 0) {
            $.ajax({
                type: "POST",
                url: monitorWebBaseURL + "index/load",
                data: {
                    limit: 2,
                    start: loadData[loadData.length - 1][0] / 1000 + 1
                },
                dataType: "json",
                success: function (data) {
                    if (data.success) {
                        data.dataObject.reverse();
						if(indexJS.cpuNum === -1) { //如果cpuNum == -1，说明cpu核心数还未获得
							$.each(data.dataObject, function (i, item) {
								loadData.shift();
								loadData.push([
									item.processTime * 1000,
									item.sum
								]);
							});
						} else {

							//如果初始载入的负载数据未经过处理，此时处理
							if(!loadDataProcessed){
								$.each(loadData, function (i, item) {
									item[1] = (1.0 * item[1] / indexJS.cpuNum).toFixed(2)
								});
								loadDataProcessed = true;

								// 关闭提示动画
								loadChart.hideLoading();
							}

							//将此次获得的数据加入
							$.each(data.dataObject, function (i, item) {
								loadData.shift();
								loadData.push([
									item.processTime * 1000,
									(item.sum / indexJS.cpuNum * 1.0).toFixed(2)
									// (item.sum / item.num * 1.0).toFixed(2)
								]);
							});

							// 填入数据
							loadChart.setOption({
								series: {
									// 根据名字对应到相应的系列
									name: '负载',
									data: loadData
								}
							});
							$("#loadNum").html(getLoadSeverity(loadData[loadData.length-1][1]));
						}
                    }
                }
            });
        }
    }

    $(function () {

        // 基于准备好的dom，初始化echarts实例
        loadChart = echarts.init(document.getElementById('loadChart'));

        // 设置图表属性
        loadChart.setOption({
            title: {
                text: '集群负载',
                top: 5,
                left: 5
            },
            grid:{
                height: 185
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
				right: 20,
				top: 5
            },
            dataZoom: [
                {   // 这个dataZoom组件，默认控制x轴。
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    start: 50,      // 左边在 10% 的位置。
                    end: 100         // 右边在 60% 的位置。
                }
            ],
            visualMap: {
                top: 10,
                right: 10,
                pieces: [{
                    gt: 0,
                    lte: 1,
                    color: '#660099'
                }, {
                    gt: 1,
                    lte: 1.5,
                    color: '#ffde33'
                }, {
                    gt: 1.5,
                    lte: 2,
                    color: '#ff9933'
                }, {
                    gt: 2,
                    lte: 2.5,
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
                boundaryGap : false
            },
            yAxis: {
                type: 'value',
                min: 0,
				max: 3
            },
            series: [{
                name: '负载',
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
                        yAxis: 1
                    }, {
                        yAxis: 1.5
                    }, {
                        yAxis: 2
                    }, {
                        yAxis: 2.5
                    }]
                }
            }]
        });

        // 加载提示动画
        loadChart.showLoading();
        $.ajax({
            type: "POST",
            url: monitorWebBaseURL + "index/load",
            data: {
                limit: 100
            },
            dataType: "json",
            success: function (data) {
                if (data.success) {
					if(indexJS.cpuNum === -1) { //如果cpuNum == -1，说明cpu核心数还未获得
						loadDataProcessed = false;
						$.each(data.dataObject, function (i, item) {
							loadData.unshift([
								item.processTime * 1000,
								item.sum
							]);
						});

						//一般2秒之后cpu核心数肯定拿到了，为了避免用户等待过久的时间，直接调用一下增量函数完成后续处理
						setTimeout(fetchLoadDataInterval, 2000);
					} else {
						loadDataProcessed = true;
						$.each(data.dataObject, function (i, item) {
							loadData.unshift([
								item.processTime * 1000,
								(item.sum / indexJS.cpuNum * 1.0).toFixed(2)
								// (item.sum / item.num * 1.0).toFixed(2)
							]);
						});

						// 填入数据
						loadChart.setOption({
							series: {
								// 根据名字对应到相应的系列
								name: '负载',
								data: loadData
							}
						});

						// 关闭提示动画
						loadChart.hideLoading();
						$("#loadNum").html(getLoadSeverity(loadData[loadData.length-1][1]));
					}
                }
                setInterval(fetchLoadDataInterval, 12000);
            }
        });
    });
})();

