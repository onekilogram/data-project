(function () {

	var table = null;

	//从详情模板拷贝内容
	function generateDetail() {
		return $("#nodeDetailTemplate").html();
	}

	function fillInData(row) {
		var subRow = $(row.node()).next("tr");
		var nodeHostName = row.data().hostname;
		subRow.find(".overlay").show();
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "node/detail",
			data: {
				host: nodeHostName,
				nocache: new Date().getTime()
			},
			dataType: "json",
			success: function (data) {
				if (data != null) {
					// var cpuSpeed, cpuIdle, loadOne, loadFive, diskFree, diskTotal, memFree, memTotal, memBuffers,
					// 	memCached, memShared;

					var diskUsed = data["slave/disk_used"];
					var diskTotal = data["slave/disk_total"];
					var diskPercent = data["slave/disk_percent"];

					var cpusTotal = data["slave/cpus_total"];
					var cpusPercent = data["slave/cpus_percent"];
					var cpusUsed = data["slave/cpus_used"];

					var memTotalBytes = data["system/mem_total_bytes"];
					var memFreeBytes = data["system/mem_free_bytes"];
					var memUsed = data["slave/mem_used"];
					var memTotal = data["slave/mem_total"];
					var memPercent = data["slave/mem_percent"];

					var executorsRunning = data["slave/executors_running"];
					var executorsRegistering = data["slave/executors_registering"];
					var executorsTerminating = data["slave/executors_terminating"];
					var executorsTerminated = data["slave/executors_terminated"];

					var gpusTotal = data["slave/gpus_total"];
					var gpusPercent = data["slave/gpus_percent"];
					var gpusUsed = data["slave/gpus_used"];

					var tasksStarting = data["slave/tasks_starting"];
					var tasksGone = data["slave/tasks_gone"];
					var tasksLost = data["slave/tasks_lost"];
					var tasksStaging = data["slave/tasks_staging"];
					var tasksKilled = data["slave/tasks_killed"];
					var tasksFailed = data["slave/tasks_failed"];
					var tasksKilling = data["slave/tasks_killing"];
					var tasksFinished = data["slave/tasks_finished"];
					var tasksRunning = data["slave/tasks_running"];

					var frameworksActive = data["slave/frameworks_active"];

					var load1min = data["system/load_1min"];
					var load5min = data["system/load_5min"];
					var load15min = data["system/load_15min"];

					// 填入数据
					subRow.find(".cpuNum").html(cpusTotal.toFixed(1));
					subRow.find(".cpusUsed").html(cpusUsed.toFixed(1));
					subRow.find(".cpuPercent").html((100 * cpusPercent).toFixed(1) + "%");

					subRow.find(".loadOne").html(load1min.toFixed(2));
					subRow.find(".loadFive").html(load5min.toFixed(2));
					subRow.find(".loadFifteen").html(load15min.toFixed(2));

					subRow.find(".memTotal").html((memTotalBytes / 1024 / 1024 / 1024).toFixed(2) + " GB");
					subRow.find(".memFree").html((memFreeBytes / 1024 / 1024 / 1024).toFixed(2) + " GB");
					subRow.find(".memUsed").html(((memTotalBytes - memFreeBytes) / 1024 / 1024 / 1024).toFixed(2) + " GB");
					subRow.find(".memUsedRate").html((100 * (memTotalBytes - memFreeBytes) / memTotalBytes).toFixed(1) + "%");

					subRow.find(".diskTotal").html((diskTotal / 1024).toFixed(2) + "GB");
					subRow.find(".diskUsed").html((diskUsed / 1024).toFixed(2) + "GB");
					subRow.find(".diskUsedRate").html((100 * diskUsed / diskTotal).toFixed(1) + "%");

					subRow.find(".runningTask").html(tasksRunning.toFixed(0));
					subRow.find(".pendingTask").html(tasksStaging.toFixed(0));
					subRow.find(".failedTask").html(tasksFailed.toFixed(0));
					subRow.find(".finishedTask").html(tasksStaging.toFixed(0));

					subRow.find(".executorsRunning").html(executorsRunning.toFixed(0));
					subRow.find(".executorsRegistering").html(executorsRegistering.toFixed(0));
					subRow.find(".executorsTerminating").html(executorsTerminating.toFixed(0));
					subRow.find(".executorsTerminated").html(executorsTerminated.toFixed(0));

					subRow.find(".box-title.rowBoxTitle").html(nodeHostName);


					//显示饼图
					var memoryPieChart = echarts.init(subRow.find(".pieChart")[0]);
					memoryPieChart.setOption({
						tooltip: {
							trigger: 'item',
							formatter: "{a} <br/>{b}: {c} GB ({d}%)",
							position: ['25%', '90%']
						},
						legend: {
							orient: 'vertical',
							x: 'right',
							top: '20%',
							data: ['可用内存', '已用内存']
						},
						series: [
							{
								name: '内存使用',
								type: 'pie',
								radius: '55%',
								avoidLabelOverlap: false,
								roseType: "radius",
								center: ['35%', '50%'],
								label: {
									normal: {
										show: false,
									}
								},
								labelLine: {
									normal: {
										show: false
									}
								},
								itemStyle: {
									normal: {
										shadowBlur: 30,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								},
								data: [
									{value: (memFreeBytes / 1024 / 1024 / 1024).toFixed(2), name: '可用内存'},
									{
										value: ((memTotalBytes - memFreeBytes) / 1024 / 1024 / 1024).toFixed(2),
										name: '已用内存'
									},
								]
							}
						]
					});

					subRow.find(".overlay").hide();
				}
			}
		});
	}

	function fetchMasterInfo(){
		$.ajax({
			type: "POST",
			url: monitorWebBaseURL + "node/master",
			data: {},
			dataType: "json",
			success: function (data) {
				if (data != null) {
					$("#masterCpuNum").html(data.cpus_total);
					$("#masterLoad1").html(data.avg_load_1min);
					$("#masterLoad5").html(data.avg_load_5min);
					$("#masterLoad15").html(data.avg_load_15min);
					$("#masterHost").html("<span class='badge bg-blue'>" + data.masterHost + "</span>");
					$("#masterFreeMem").html((data.mem_free_bytes / 1048576).toFixed(1) + "MB");
					$("#masterTotalMem").html((data.mem_total_bytes / 1048576).toFixed(1) + "MB");
				}
			}
		});
	}

	$(function () {

		fetchMasterInfo();

		table = $('#nodeListTable').DataTable({
			"paging": true,
			"lengthChange": true,
			"aLengthMenu": [10, 25, 50],
			"searching": true,
			"ordering": true,
			"order": [[2, "asc"]], //默认按照主机名升序排序
			"info": true,
			"autoWidth": false,
			"language": {
				'emptyTable': '没有数据',
				'loadingRecords': '加载中...',
				'processing': '查询中...',
				'search': '搜索:',
				'lengthMenu': '每页 _MENU_ 条记录',
				'zeroRecords': '没有数据',
				'paginate': {
					'next': '下一页',
					'previous': '上一页'
				},
				'info': '第 _PAGE_ 页 / 共 _PAGES_ 页',
				'infoEmpty': '没有数据',
				'infoFiltered': '(从 _MAX_ 条记录中筛选)'
			},
			ajax: {
				url: monitorWebBaseURL + "node/list",
				dataType: "json",
				dataSrc: function (result) {
					var itemList = [];
					$.each(result,function (i,item) {
						if(item.nodeType === '主节点'){
							itemList.push(item);
							return;
						}
						itemList.push({
							nodeType:item.nodeType,
							disk:(item.resources.disk / 1024).toFixed(1) +"GB",
							mem:(item.resources.mem / 1024).toFixed(1) +"GB",
							cpus:item.resources.cpus,
							gpus:item.resources.gpus,
							hostname:item.hostname,
							port:item.port,
							registered_time:new Date(Math.round(item.registered_time) * 1000).customFormat("#YYYY#/#MM#/#DD# #hh#:#mm#:#ss#"),
							state:item.active == true?"活动的":"失联的",
						});
					});
					return itemList;
				}
			},
			columns: [
				{data: "nodeType"},
				{data: "state"},
				{data: "hostname"},
				{data: "cpus"},
				{data: "gpus"},
				{data: "mem"},
				{data: "disk"},
				{data: "registered_time"},
				{
					"class": 'details-control see-detail-span',
					"orderable": false,
					"data": null,
					"defaultContent": '<i class="fa fa-plus-square-o"></i>'
				}
			],
			"initComplete": function () {
				$('#nodeListTable tbody tr:eq(0) td.see-detail-span').click();
			}
		});

		// 添加查看节点详情的点击事件
		$('#nodeListTable').find('tbody').on('click', 'td.details-control', function () {
			var tr = $(this).closest('tr');
			var row = table.row(tr);
			if (row.child.isShown()) {
				row.child.hide();
				tr.removeClass('shown');
				$(tr).find("td.details-control i").removeClass('fa-minus-square');
				$(tr).find("td.details-control i").addClass('fa fa-plus-square-o');
			}
			else {
				row.child(generateDetail()).show();
				tr.addClass('shown');
				$(tr).find("td.details-control i").removeClass('fa fa-plus-square-o');
				$(tr).find("td.details-control i").addClass('fa fa-minus-square');

				var subRow = $(row.node()).next("tr");
				subRow.find(".refreshBtn").click(function () {
					fillInData(row);
				});

				// 填入数据
				fillInData(row);
			}
		});
	});
})();