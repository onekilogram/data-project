(function () {
	var header = '\
		<header class="main-header">\
			<!-- Logo -->\
		    <a href="' + monitorWebBaseURL + '" class="logo">\
		      <!-- mini logo for sidebar mini 50x50 pixels -->\
		      <span class="logo-mini"><b>M</b>O</span>\
		      <!-- logo for regular state and mobile devices -->\
		      <span class="logo-lg"><b>Cluster</b>MO</span>\
		    </a>\
		    \
		    <!-- Header Navbar: style can be found in header.less -->\
		    <nav class="navbar navbar-static-top">\
		      <!-- Sidebar toggle button-->\
		      <a href="#" class="sidebar-toggle" data-toggle="offcanvas" role="button">\
		        <span class="sr-only">开启/关闭右侧Slider</span>\
		      </a>\
		      <!-- 导航条右边菜单 -->\
		      <div class="navbar-custom-menu">\
		        <ul class="nav navbar-nav">\
		          <!-- 消息: 样式定义在dropdown.less-->\
		          <li class="dropdown messages-menu">\
		            <a href="#" class="dropdown-toggle" data-toggle="dropdown">\
		              <i class="fa fa-envelope-o"></i>\
		              <!-- <span class="label label-success">1</span> -->\
		            </a>\
		            <ul class="dropdown-menu">\
		              <li class="header">您有 1 条消息</li>\
		              <li>\
		                <!-- inner menu: contains the actual data -->\
		                <ul class="menu">\
		                  <li><!-- start message -->\
		                    <a href="#">\
		                      <div class="pull-left">\
		                        <img src="common/img/user2-160x160.jpg" class="img-circle" alt="User Image">\
		                      </div>\
		                      <h4>\
		                        Support Team\
		                        <small><i class="fa fa-clock-o"></i> 5 mins</small>\
		                      </h4>\
		                      <p>Why not buy a new awesome theme?</p>\
		                    </a>\
		                  </li>\
		                  <!-- end message -->\
		                </ul>\
		              </li>\
		              <li class="footer"><a href="#">查看所有</a></li>\
		            </ul>\
		          </li>\
		          <!-- Notifications: style can be found in dropdown.less -->\
		          <li class="dropdown notifications-menu">\
		            <a href="#" class="dropdown-toggle" data-toggle="dropdown">\
		              <i class="fa fa-bell-o"></i>\
		              <!-- <span class="label label-warning">10</span> -->\
		            </a>\
		            <ul class="dropdown-menu">\
		              <li class="header">您有 10 条通知</li>\
		              <li>\
		                <!-- inner menu: contains the actual data -->\
		                <ul class="menu">\
		                  <li>\
		                    <a href="#">\
		                      <i class="fa fa-users text-aqua"></i> 5 名新成员加入\
		                    </a>\
		                  </li>\
		                </ul>\
		              </li>\
		              <li class="footer"><a href="#">查看所有</a></li>\
		            </ul>\
		          </li>\
		          <!-- Tasks: style can be found in dropdown.less -->\
		          <li class="dropdown tasks-menu">\
		            <a href="#" class="dropdown-toggle" data-toggle="dropdown">\
		              <i class="fa fa-flag-o"></i>\
		              <!-- <span class="label label-danger">9</span> -->\
		            </a>\
		            <ul class="dropdown-menu">\
		              <li class="header">您有 9 个任务</li>\
		              <li>\
		                <!-- inner menu: contains the actual data -->\
		                <ul class="menu">\
		                  <li><!-- Task item -->\
		                    <a href="#">\
		                      <h3>\
		                        Design some buttons\
		                        <small class="pull-right">20%</small>\
		                      </h3>\
		                      <div class="progress xs">\
		                        <div class="progress-bar progress-bar-aqua" style="width: 20%" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">\
		                          <span class="sr-only">20% Complete</span>\
		                        </div>\
		                      </div>\
		                    </a>\
		                  </li>\
		                  <!-- end task item -->\
		                </ul>\
		              </li>\
		              <li class="footer">\
		                <a href="#">查看所有</a>\
		              </li>\
		            </ul>\
		          </li>\
		          <!-- User Account: style can be found in dropdown.less -->\
		          <li class="dropdown user user-menu">\
		            <a href="#" class="dropdown-toggle" data-toggle="dropdown">\
		              <img src="common/img/user2-160x160.jpg" class="user-image" alt="User Image">\
		              <span class="hidden-xs">汤姆</span>\
		            </a>\
		            <ul class="dropdown-menu">\
		              <!-- User image -->\
		              <li class="user-header">\
		                <img src="common/img/user2-160x160.jpg" class="img-circle" alt="User Image">\
		                <p>\
						  汤姆 - Web开发人员\
		                  <small>I miss my Jerry.</small>\
		                </p>\
		              </li>\
		              <!-- Menu Body -->\
		              <li class="user-body">\
		                <div class="row">\
		                  <div class="col-xs-4 text-center">\
		                    <a href="#">Followers</a>\
		                  </div>\
		                  <div class="col-xs-4 text-center">\
		                    <a href="#">Sales</a>\
		                  </div>\
		                  <div class="col-xs-4 text-center">\
		                    <a href="#">Friends</a>\
		                  </div>\
		                </div>\
		                <!-- /.row -->\
		              </li>\
		              <!-- Menu Footer-->\
		              <li class="user-footer">\
		                <div class="pull-left">\
		                  <a href="#" class="btn btn-default btn-flat">Profile</a>\
		                </div>\
		                <div class="pull-right">\
		                  <a href="'+monitorAssetBaseURL+'module/user/login.html" class="btn btn-default btn-flat">Sign out</a>\
		                </div>\
		              </li>\
		            </ul>\
		          </li>\
		          <!-- Control Sidebar Toggle Button -->\
		          <li>\
		            <a href="#" data-toggle="control-sidebar"><i class="fa fa-gears"></i></a>\
		          </li>\
		        </ul>\
		      </div>\
		    </nav>\
		</header>\
	';
	document.write(header);
})();
