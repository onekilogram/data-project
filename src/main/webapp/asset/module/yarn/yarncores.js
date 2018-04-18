/**
 * Created by likeugo on 2017/6/4
 */

(function () {

    var memChart = null;
    
    //var totalVirtualCores = []; //总的
    var reservedVirtualCores=[]; //预留
    var availableVirtualCores=[]; //可用
    var allocatedVirtualCores = [];//已用
    var totalVirtualCores = 0;
    
    
    
    
    // 获取应用运行数据
    function fetchmemDataInterval() {
        $.ajax({
            type: "POST",
            url: monitorWebBaseURL + "index/cluster/metrics",
            data: {},
            dataType: "json",
            success: function (data) {
                if (data != null) {

                    var reserved=0, available=0, allocated=0;

                    reserved = data.clusterMetrics.reservedVirtualCores;
                    available = data.clusterMetrics.availableVirtualCores;
                    allocated = data.clusterMetrics.allocatedVirtualCores;
                    totalVirtualCores =  data.clusterMetrics.totalVirtualCores;

                    var now = new Date().getTime();
                    if(reservedVirtualCores.length>=8){ 
                    	reservedVirtualCores.shift(); //删除第一个
                    	availableVirtualCores.shift(); //删除第一个
                    	allocatedVirtualCores.shift(); //删除第一个
                        
                    }
                    reservedVirtualCores.push([now,reserved]);
                    availableVirtualCores.push([now,available]);
                    allocatedVirtualCores.push([now,allocated]);

                 // 更新当前状态
					$("#coresReserved").html(reserved);
					$("#coresAvailable").html(available);
					$("#coresAllocated").html(allocated);
					$("#coresTotal").html(totalVirtualCores);
					
                    // 填入数据
                    memChart.setOption({
                        series: [
                            {
                                name: '可用',
                                data: availableVirtualCores
                            },
                            {
                                name: '已用',
                                data: allocatedVirtualCores
                            }
                            ,
                            {
                                name: '预留',
                                data: reservedVirtualCores
                            }
                        ]
                    });
                }
            }
        });
    }
    
 // 获取应用运行数据
    function fetchmemDataFour() {
        $.ajax({
            type: "POST",
            url: monitorWebBaseURL + "index/cluster/metrics",
            data: {},
            dataType: "json",
            success: function (data) {
                if (data != null) {

                    var reserved=0, available=0, allocated=0;

                    reserved = data.clusterMetrics.reservedVirtualCores;
                    available = data.clusterMetrics.availableVirtualCores;
                    allocated = data.clusterMetrics.allocatedVirtualCores;
                    totalVirtualCores =  data.clusterMetrics.totalVirtualCores;

                    var now = new Date().getTime();
                    if(reservedVirtualCores.length>=8){ 
                    	reservedVirtualCores.shift(); //删除第一个
                    	availableVirtualCores.shift(); //删除第一个
                    	allocatedVirtualCores.shift(); //删除第一个
                        
                    }
                    for(var i = 5;i>=0;i--){
                    	   reservedVirtualCores.push([now-i*7000,reserved]);
                           availableVirtualCores.push([now-i*7000,available]);
                           allocatedVirtualCores.push([now-i*7000,allocated]);
                    }
                 

                 // 更新当前状态
					$("#coresReserved").html(reserved);
					$("#coresAvailable").html(available);
					$("#coresAllocated").html(allocated);
					$("#coresTotal").html(totalVirtualCores);
					
                    // 填入数据
                    memChart.setOption({
                        series: [
                            {
                                name: '可用',
                                data: availableVirtualCores
                            },
                            {
                                name: '已用',
                                data: allocatedVirtualCores
                            }
                            ,
                            {
                                name: '预留',
                                data: reservedVirtualCores
                            }
                        ]
                    });
                }
            }
        });
    }

    $(function () {

        // 基于准备好的dom，初始化echarts实例
    	memChart = echarts.init(document.getElementById('coresChart'));

        // 设置图表属性
    	memChart.setOption({
            title: {
                text: '虚拟cores状态',
                top: 5,
                left: 5
            },
            grid:{
                height: 190,
                left: '3%',
                right: '4%',
                containLabel: true
           
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                }
            },
            legend: {
                data:['可用','已用','预留'],
                //bottom:'bottom',
                top:'10px',
                left:'50%',
                width:'200px',
                
            },
            toolbox: {
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none'
                    },
                    restore: {},
                    saveAsImage: {},
                    dataView:{}
                }
            },
            dataZoom: [
                {   // 这个dataZoom组件，默认控制x轴。
                    type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                    start: 50,      // 左边在 10% 的位置。
                    end: 100,         // 右边在 60% 的位置。
                }
            ],
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                },
                boundaryGap : false
            },
            yAxis: {
            	name : '数量（个）',
                type: 'value',
                min: 0,
                minInterval: 3
            },
            series: [
                {
                    name: '可用',
                    type: 'line',
                   // areaStyle: {normal: {}},
                    data: []
                },
                {
                    name: '已用',
                    type: 'line',
                   // areaStyle: {normal: {}},
                    data: []
                },
                {
                    name: '预留',
                    type: 'line',
                   // areaStyle: {normal: {}},
                    data: []
                },
            ]
        });

        // 加载提示动画
    	memChart.showLoading();

    	fetchmemDataFour();

        // 关闭提示动画
        memChart.hideLoading();

        setInterval(fetchmemDataInterval, 8000);
    });
})();

