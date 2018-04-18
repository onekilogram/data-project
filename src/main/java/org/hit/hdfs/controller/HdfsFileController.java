package org.hit.hdfs.controller;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/file")
public class HdfsFileController extends BaseController {
	
	/**
	 * 添加规则报警信息
	 */
	@ResponseBody
	@RequestMapping("getFile")
	public String addTriggerAlert(HttpServletRequest request) {
		
		try {
			String filePath = request.getParameter("filePath");
						
			if (!StringUtils.isNoneBlank(filePath)) {
				return responseControllerResultError("参数错误");
			} else {
				return responseControllerResultError("服务器异常");
			}
			//返回数据
			
			
			
			
			
			
			
			
		} catch (Exception e) {
			return responseControllerResultError("服务器异常");
		}
	}
	
	

}
