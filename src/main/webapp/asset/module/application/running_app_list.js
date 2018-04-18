(function () {

	var table = null;

	//从详情模板拷贝内容
	function generateDetail(data) {
		var tp = $("#nodeDetailTemplate");
		tp.find(".m_clusterId").html(data.clusterId);
		tp.find(".m_queue").html(data.queue);
		tp.find(".m_trackingUI").html(data.trackingUI);
		tp.find(".m_trackingUrl").html('<a href="'+data.trackingUrl+'" class="trackingUrl">'+data.trackingUrl+'</a>');
		tp.find(".m_amContainerLogs").html('<a href="'+data.amContainerLogs+'" class="trackingUrl">'+data.amContainerLogs+'</a>');
		tp.find(".m_amHostHttpAddress").html('<a href="'+data.amHostHttpAddress+'" class="trackingUrl">'+data.amHostHttpAddress+'</a>');
		tp.find(".m_allocatedMB").html(data.allocatedMB);
		tp.find(".m_allocatedVCores").html(data.allocatedVCores);
		tp.find(".m_runningContainers").html(data.runningContainers);
		tp.find(".m_memorySeconds").html(data.memorySeconds);
		tp.find(".m_vcoreSeconds").html(data.vcoreSeconds);

		tp.find(".overlay").hide();
		return tp.html();
	}

	$(function () {
		table = $('#appListTable').DataTable({
			"paging": true,
			"lengthChange": true,
			"aLengthMenu": [5, 10, 20],
			"searching": true,
			"ordering": true,
			"order": [[5, "desc"]], //按照提交时间降序
			"info": true,
			"autoWidth": false,
			"language": {
				'emptyTable': '没有正在运行的应用',
				'loadingRecords': '加载中...',
				'processing': '查询中...',
				'search': '搜索:',
				'lengthMenu': '每页 _MENU_ 条记录',
				'zeroRecords': '没有正在运行的应用',
				'paginate': {
					'next': '下一页',
					'previous': '上一页'
				},
				'info': '第 _PAGE_ 页 / 共 _PAGES_ 页',
				'infoEmpty': '没有数据',
				'infoFiltered': '(从 _MAX_ 条记录中筛选)'
			},
			ajax: {
				url: monitorWebBaseURL + "app/list",
				dataType: "json",
				dataSrc: function (result) {
					if (result.apps !== null)
						return result.apps.app;
					else
						return [];
				}
			},
			columns: [
				{data: "id"},
				{data: "user"},
				{data: "name"},
				{data: "applicationType"},
				{
					"data": 'progress',
					"render": function (data, type, row) {
						return '<div class="progress" style="margin-top: 0">\
									<div class="progress-bar progress-bar-success progress-bar-striped" role="progressbar" aria-valuenow="' + data + '" aria-valuemin="0" aria-valuemax="100" style="min-width: 2em;width: ' + data + '%">\
										' + data.toFixed(1) + '%\
									</div>\
								</div>';
					}
				},
				{
					"data": 'startedTime',
					"render": function (data, type, row) {
						var d = new Date(data);
						return d.customFormat("#YYYY#/#MM#/#DD# #hh#:#mm#:#ss#");
					}
				},
				{
					"data": 'elapsedTime',
					"render": function (data, type, row) {
						var totalSeconds = 0;
						var totalMins = 0;
						var totalHours = 0;
						var totalDays = 0;

						totalDays = Math.floor(data / 1000 / 60 / 60 / 24);
						data -= totalDays * 1000 * 60 * 60 * 24;
						totalHours = Math.floor(data / 1000 / 60 / 60);
						data -= totalHours * 1000 * 60 * 60;
						totalMins = Math.floor(data / 1000 / 60);
						data -= totalMins * 1000 * 60;
						totalSeconds = Math.floor(data / 1000);

						var str = "";
						if (totalDays !== 0) str = str + totalDays + "d:";
						if (totalHours !== 0) str = str + totalHours + "h:";
						if (totalMins !== 0) str = str + totalMins + "m:";
						str = str + totalSeconds + "s";
						return str;
					}
				}
			],
			"createdRow": function (row, data, index) {
				row = table.row(row);
				if (!row.child.isShown()) {
					row.child(generateDetail(data)).show();
				}
			}
		});

		setInterval(function () {
			table.ajax.reload(null, false);
		}, 5000);
	});
})();