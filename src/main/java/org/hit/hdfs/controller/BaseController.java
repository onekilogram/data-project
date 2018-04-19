package org.hit.hdfs.controller;

import com.alibaba.fastjson.JSON;
import com.google.gson.GsonBuilder;import afu.org.checkerframework.checker.oigj.qual.OIGJMutabilityBottom;

import org.apache.commons.lang3.StringUtils;
import org.hit.hdfs.common.ControllerResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * 适用SpringMVC的的一些数据传递方法
 */
public class BaseController {

	public static final String DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";

	/**
	 * 获得当前登录用户的id
	 *
	 * @param request
	 * @return
	 */
	protected Integer getCurrentUserId(HttpServletRequest request) {
		return (Integer) request.getSession().getAttribute("userId");
	}

	/**
	 * 从请求中获得Long类型的参数
	 * 
	 * @param request
	 * @param name
	 */
	protected Long getLongParameterFromRequest(HttpServletRequest request, String name, Long defVal) {
		String tmp = request.getParameter(name);
		if (StringUtils.isEmpty(tmp)) {
			return defVal;
		}
		return Long.parseLong(tmp);
	}

	/**
	 * 从请求中获得Integer类型的参数
	 * 
	 * @param request
	 * @param name
	 */
	protected Integer getIntegerParameterFromRequest(HttpServletRequest request, String name, Integer defVal) {
		String tmp = request.getParameter(name);
		if (StringUtils.isEmpty(tmp)) {
			return defVal;
		}
		return Integer.parseInt(tmp);
	}

	/**
	 * JSON输出
	 *
	 * @param obj
	 */
	public String responseJson(Object obj) {
		//return JSON.toJSONString(obj);
		return new GsonBuilder().setPrettyPrinting().serializeNulls().create().toJson(obj);
	}

	/**
	 * ActionResult错误返回
	 */
	protected String responseControllerResultError(String errorMessage) {
		ControllerResult actionResult = new ControllerResult();
		actionResult.setSuccess(false);
		actionResult.setMsg(errorMessage);
		return responseJson(actionResult);
	}

	/**
	 * ActionResult成功返回
	 */
	protected String responseControllerResultSuccess(Object obj) {
		ControllerResult actionResult = new ControllerResult();
		actionResult.setSuccess(true);
		actionResult.setDataObject(obj);
		return responseJson(actionResult);
	}

	/**
	 * 将某个对象转换成json格式并发送到客户端
	 *
	 * @param response
	 * @param obj
	 * @throws Exception
	 */
	protected void sendJsonMessage(HttpServletResponse response, Object obj) throws Exception {
		response.setContentType("application/json; charset=utf-8");
		PrintWriter writer = response.getWriter();
		writer.print(responseJson(obj));
		writer.close();
		response.flushBuffer();
	}

}
