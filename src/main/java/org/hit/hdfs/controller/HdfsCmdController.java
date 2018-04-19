package org.hit.hdfs.controller;

import java.util.ArrayList;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.hit.hdfs.service.HdfsCmdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/cmd")
public class HdfsCmdController extends BaseController {
	@Autowired
	private HdfsCmdService hdfsCmdService;

	@ResponseBody
	@RequestMapping("shell")
	public String executeCmdShell(HttpServletRequest request) {
		try {
			String shell = request.getParameter("shell");
			if (!StringUtils.isNoneBlank(shell)) {
				return responseControllerResultError("参数错误");
			}
			Map<String, ArrayList<String>> map = hdfsCmdService.execShellCmd(shell);
			return responseControllerResultSuccess(map);
		} catch (Exception e) {
			return responseControllerResultError("服务器异常");
		}
	}
}
