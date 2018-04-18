/**
 * 
 */
var DataNode = function(){
	var formatters = {
		'fmt_bytes': function (v) {
			var i=0;
			var UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'ZB'];
			while (v >= 1024 && i < UNITS.length) {
				v /= 1024;
				i += 1;
			}
			return Math.round(v * 100) / 100 + ' ' + UNITS[i];
		},
		'fmt_time': function (v) {
			if(s < 1000) return v+" ms";
		    var s = Math.floor(v / 1000);
		    var res = (v-s*1000).toFixed(2) + " ms";
		    if(s<60) return s+" sec," + res;
		    var m = Math.floor(s / 60);
		    res = (s-m*60) + " sec,"+res;
		    if(m<60) return m+" mins," + res;
		    var h = Math.floor(m / 60);
		    res = (m-h*60) + " mins,"+res;
		    if(h<24) return h+" hrs," + res;
		    var d = Math.floor(h / 24);
		    res = d+ " days,"+(h-24*d)+" hrs,"+res
		    return res;
		}
	}
	function twoLineCharts(text, metrics,diff, fmtFunction){
		var myChart = echarts.init(document.getElementById(text));
		myChart.showLoading();
		diff = diff || false;
		$.getJSON(monitorWebBaseURL+"datanode/loadData",{"metrics":metrics,"diff":diff}, function(data){
			if(data!=null){
				var colors = ['red','black'];
				var xAxisArray = [];
				var valueArray = [];
				var processTime = [];
				var lastData;
				if(diff) lastData = [];
				for(var i=0;i<2;i++){
					var length = data[i].timeseries.length;
					xAxisArray[i] = [];
					valueArray[i] = [];
					processTime[i] = data[i].timeseries[length-1].processTime;
					if(diff) lastData[i] = data[i].lastData;
					for (var j=0;j<length;j++){
						xAxisArray[i][j] = data[i].timeseries[j].time;
						valueArray[i][j] = data[i].timeseries[j].value;
					}
				}
				var option = {
						title : {
							text: text
						},
						tooltip : {
							trigger: 'none',
							axisPointer:{
								type : 'cross'
							}
						},
						color: colors,
						toolbox: {
							show : true,
							feature : {
								mark : {show: true},
								dataView : {show: true, readOnly: false},
								magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
								restore : {show: true},
								saveAsImage : {show: true}
							}
						},
						dataZoom : [
							{
								xAxisIndex: [0,1], 
								type : 'slider',
								start : 0,
								end : 100
							}
//							,{
//								type : 'inside',
//								start : 0,
//								end : 100
//							}
						],
						xAxis : [
							{
	        	        		type : 'category',
	        	        		axisTick:{
	        	        			alignWithLabel:true
	        	        		},
	        	        		axisLine:{
	        	        			onZero:false,
	        	        			lineStyle: {
	        	                        color: colors[0]
	        	                    }
	        	        		},
	        	        		axisPointer:{
	        	        			label:{
	        	        				formatter: function(value){
	        	        					if(!value.seriesData.length) return value.value;
	        	        					var res = value.seriesData[0].data;
	        	        					if(fmtFunction) res = fmtFunction(value.seriesData[0].data);
	        	        					return value.seriesData[0].seriesName+' at '+value.value+' : '+res;
	        	        				}
	        	        			}
	        	        		},
	        	        		//boundaryGap : true,
	        	        		data : xAxisArray[0]
							},{
								type : 'category',
								axisTick:{
	        	        			alignWithLabel:true
	        	        		},
	        	        		axisLine:{
	        	        			onZero:false,
	        	        			lineStyle: {
	        	                        color: colors[1]
	        	                    }
	        	        		},
	        	        		axisPointer:{
	        	        			label:{
	        	        				formatter: function(value){
	        	        					if(!value.seriesData.length) return value.value;
	        	        					var res = value.seriesData[0].data;
	        	        					if(fmtFunction) res = fmtFunction(value.seriesData[0].data);
	        	        					return value.seriesData[0].seriesName+' at '+value.value+' : '+res;
	        	        				}
	        	        			}
	        	        		},
	        	        		//boundaryGap : true,
	        	        		data : xAxisArray[1]
							}
						],
						yAxis : [
							{
								nameGap: 20,
								type : 'value',
								axisPointer:{
	        	        			label:{
	        	        				formatter: function(value){
	        	        					var res = value.value.toFixed(2);
	        	        					if(fmtFunction) res = fmtFunction(value.value);
	        	        					return res;
	        	        				}
	        	        			}
	        	        		},
								min: 0,
								boundaryGap: [0.2, 0.2]
							}
						],
						legend: {
							data:metrics
						},
						series : [
							{
								name:metrics[0],
								type:'line',
	        	        		smooth :'true',
								data:valueArray[0]
							},
							{
								name:metrics[1],
								type:'line',
								xAxisIndex:1,
	        	        		smooth :'true',
								data:valueArray[1]
							}
						]
	        		};
				if(fmtFunction){
					option.yAxis[0].axisLabel={};
					option.yAxis[0].axisLabel.formatter = function(value){
						return fmtFunction(value);
					};
				}
				myChart.hideLoading();
				myChart.setOption(option);
				setInterval(function (){ 
					$.getJSON(monitorWebBaseURL+"/datanode/addData",{"metrics":metrics,"processTime":processTime,"lastData":lastData,"diff":diff},function(data){
						if(data!=null && data!=""){
							var metric;
							for(var i=0 ; i<2;i++){
								metric =data[metrics[i]];
								if(metric!=null){
									for(var j=0; j<metric.addData.length;j++){
										//valueArray[i].shift();
										valueArray[i].push(metric.addData[j].value);
										//xAxisArray[i].shift();
										xAxisArray[i].push(metric.addData[j].time);
									}
									processTime[i] =metric.addData[metric.addData.length-1].processTime;
									if(diff) lastData[i] = metric.lastData;
								}
							}
							myChart.setOption({
								xAxis : [
									{
			        	        		type : 'category',
			        	        		boundaryGap : true,
			        	        		data : xAxisArray[0]
									},{
										type : 'category',
			        	        		boundaryGap : true,
			        	        		data : xAxisArray[1]
									}
								],
								series : [ {
									name:metrics[0],
									type:'line',
									data:valueArray[0]
								},
								{
									name:metrics[1],
									type:'line',
									data:valueArray[1]
								}]
							});
						}
					});
				}, 10000);
			}
		});
	}
	function bytesWritenandReadChart() {
		twoLineCharts("Bytes R/W",["BytesRead","BytesWritten"],"true",formatters.fmt_bytes);
	}
	function ReadandWriteBlockOpAvgTime() {
		twoLineCharts("Block R/W Ops Avg Time",["ReadBlockOpAvgTime","WriteBlockOpAvgTime"],null,formatters.fmt_time);
	}
	function ReadandWriteBlockOpNum() {
		twoLineCharts("Blocks R/W",["BlocksRead","BlocksWritten"],"true",null,null);
	}
	function datanodeInf() {
		$.getJSON(monitorWebBaseURL+"datanode/dataNodeInf", function(data){
			var datanodeInf = data.beans[0];
			var liveNodeInf = eval('('+datanodeInf.LiveNodes+')');
			var DeadNodeInf = eval('('+datanodeInf.DeadNodes+')');
			var DecomNodeInf = eval('('+datanodeInf.DecomNodes+')');
			var LiveNodeNum = 0, DeadNodeNum = 0, DecomNodeNum = 0;
			var indicator = [];
			var used = [];
			$.each(liveNodeInf, function(key, value){
				indicator[LiveNodeNum]={
					"text": key +'('+formatters.fmt_bytes(value.capacity)+')',
					"max" : value.capacity
				}
				used.push(value.used);
				LiveNodeNum += 1;
			})
			$.each(DeadNodeInf, function(key, value){
				DeadNodeNum += 1;
			})
			$.each(DecomNodeInf, function(key, value){
				DecomNodeNum += 1;
			})
			document.getElementById("LiveNodeNum").innerHTML = LiveNodeNum;
			document.getElementById("DecomNodeNum").innerHTML = DecomNodeNum;
			document.getElementById("DeadNodeNum").innerHTML = DeadNodeNum;
			document.getElementById("PercentUsed").innerHTML = Math.floor(datanodeInf.PercentUsed*100)/100+'%';
			
			var myChart = echarts.init(document.getElementById("clusterInf"));
			myChart.showLoading();
			var option = {
			title : {
				        text: '集群硬盘使用情况'
				    },
				    tooltip : {
				        trigger: 'item',
				        formatter : function(value){
							var res = value.name;
							var data =  value.value;
							for (var i = 0, l = indicator.length; i < l; i++) {
								res += '<br/>' + indicator[i].text+':'+formatters.fmt_bytes(data[i]);
							}
							return res;
				        }
				    },
				    legend: {
				        orient : 'vertical',
				        x : 'right',
				        y : 'bottom',
				        data:['实际使用量']
				    },
				    toolbox: {
				        show : true,
				        feature : {
				            mark : {show: true},
				            dataView : {show: true, readOnly: false},
				            restore : {show: true},
				            saveAsImage : {show: true}
				        }
				    },
				    radar : [
				       {
				           indicator : indicator,
				           shape : 'circle'
				        }
				    ],
				    calculable : true,
				    series : [
				        {
				            name: '集群硬盘使用情况',
				            type: 'radar',
							itemStyle: {normal: {areaStyle: {type: 'default'}}},
				            data : [
				                 {
				                    value : used,
				                    name : '实际使用量'
				                }
				            ]
				        }
				    ]
				};
			myChart.hideLoading();
			myChart.setOption(option);
			setInterval(function (){ 
				$.getJSON(monitorWebBaseURL+"datanode/dataNodeInf", function(data){
					if(data!=null && data!=""){
						var datanodeInf = data.beans[0];
						var liveNodeInf = eval('('+datanodeInf.LiveNodes+')');
						var DeadNodeInf = eval('('+datanodeInf.DeadNodes+')');
						var LiveNodeNum = 0, DeadNodeNum = 0;
						var indicator = [];
						var used = [];
						$.each(liveNodeInf, function(key, value){
							indicator[LiveNodeNum]={
								"text": key +'('+formatters.fmt_bytes(value.capacity)+')',
								"max" : value.capacity
							}
							used.push(value.used);
							LiveNodeNum += 1;
						})
						$.each(DeadNodeInf, function(key, value){
							DeadNodeNum += 1;
						})
						document.getElementById("LiveNodeNum").innerHTML = LiveNodeNum;
						document.getElementById("DeadNodeNum").innerHTML = DeadNodeNum;
						option.series[0].data[0].value = used;
						myChart.setOption(option);
					}
				});
			}, 10000);
		});
	}
	function initChart(){
		bytesWritenandReadChart();
		ReadandWriteBlockOpNum();
		ReadandWriteBlockOpAvgTime();
		datanodeInf();
		
	}
	return {
		init:function(){
			initChart();
		}
	}
}();