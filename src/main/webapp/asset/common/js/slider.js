var slider = '\
	  <aside class="main-sidebar">\
	    <!-- sidebar: style can be found in sidebar.less -->\
	    <section class="sidebar">\
	      <!-- sidebar menu: : style can be found in sidebar.less -->\
	      <ul class="sidebar-menu">\
	        <li class="header">功能导航</li>\
	        <li class="active treeview">\
	          <a href="javascript:void(0)">\
	            <i class="fa fa-dashboard"></i> <span>整体运行概览</span>\
	          </a>\
	          <ul class="treeview-menu">\
	            <li><a href="'+monitorWebBaseURL+'"><i class="fa fa-circle-o"></i> 首页</a></li>\
	            <li><a href="module/conf/alertconf.html"><i class="fa fa-circle-o"></i> 配置</a></li>\
	          </ul>\
	        </li>\
	        <li class="treeview active">\
	          <a href="javascript:void(0)">\
	            <i class="fa fa-files-o"></i>\
	            <span>硬件资源监测</span>\
	          </a>\
	          <ul class="treeview-menu">\
	            <li><a href="'+monitorAssetBaseURL+'module/cpu/cpuinfo.html"><i class="fa fa-circle-o"></i> CPU相关</a></li>\
	            <li><a href="'+monitorAssetBaseURL+'module/memory/memory.html"><i class="fa fa-circle-o"></i> 内存相关</a></li>\
	            <li><a href="'+monitorAssetBaseURL+'module/io/io.html"><i class="fa fa-circle-o"></i> I/O相关</a></li>\
	          </ul>\
	        </li>\
	        <li class="treeview active">\
	          <a href="javascript:void(0)">\
	            <i class="fa fa-pie-chart"></i>\
	            <span>集群监测</span>\
	          </a>\
	          <ul class="treeview-menu">\
	          	<li><a href="module/tsfile/tsfile.html"><i class="fa fa-circle-o"></i> IoTDB监控</a></li>\
	            <li><a href="'+monitorAssetBaseURL+'module/namenode/namenode.html"><i class="fa fa-circle-o"></i> HDFS相关</a></li>\
	            <li><a href="'+monitorAssetBaseURL+'module/yarn/yarn.html"><i class="fa fa-circle-o"></i> 应用相关</a></li>\
	            <li><a href="module/mesos/mesos.html"><i class="fa fa-circle-o"></i> 服务监控</a></li>\
	            <li><a href="module/node/node_list.html"><i class="fa fa-circle-o"></i> 节点状态</a></li>\
	            <li><a href="module/bug/rule.html"><i class="fa fa-circle-o"></i> 故障报警</a></li>\
	          </ul>\
	        </li>\
	        <li class="treeview active">\
	          <a href="javascript:void(0)">\
	            <i class="fa fa-laptop"></i>\
	            <span>历史数据分析</span>\
	          </a>\
	          <ul class="treeview-menu">\
	            <li><a href="module/history/historyjob.html"><i class="fa fa-circle-o"></i> 历史任务</a></li>\
	          </ul>\
	        </li>\
	        <li class="treeview active">\
	          <a href="javascript:void(0)">\
	            <i class="fa fa-edit"></i> <span>用户管理</span>\
	          </a>\
	          <ul class="treeview-menu">\
	            <li><a href="pages/forms/editors.html"><i class="fa fa-circle-o"></i> 用户列表</a></li>\
	          </ul>\
	        </li>\
	      </ul>\
	    </section>\
	    <!-- /.sidebar -->\
	  </aside>\
	';
(function(){
	document.write(slider);
})();
