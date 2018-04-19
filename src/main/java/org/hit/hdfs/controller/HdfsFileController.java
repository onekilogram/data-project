package org.hit.hdfs.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.hadoop.fs.FileStatus;
import org.hit.hdfs.service.HdfsFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/file")
public class HdfsFileController extends BaseController {

	@Autowired
	private HdfsFileService hdfsFileService;

	/**
	 * 获得路径下所有文件和文件夹
	 */
	@ResponseBody
	@RequestMapping("getFile")
	public String getFile(HttpServletRequest request) {

		try {
			String filePath = request.getParameter("filePath");

			if (!StringUtils.isNoneBlank(filePath)) {
				return responseControllerResultError("参数错误");
			}

			List<FileStatus> fFileStatuslist = hdfsFileService.getHdfsFile(filePath);

			return responseControllerResultSuccess(fFileStatuslist);

		} catch (Exception e) {
			return responseControllerResultError("服务器异常");
		}
	}

	/**
	 * 获得某个文件的所有块
	 */
	@ResponseBody
	@RequestMapping("getFileBlocks")
	public String getFileBlocks(HttpServletRequest request) {

		try {
			String filePath = request.getParameter("filePath");

			if (!StringUtils.isNoneBlank(filePath)) {
				return responseControllerResultError("参数错误");
			}

			List<FileStatus> fFileStatuslist = hdfsFileService.getHdfsFile(filePath);

			return responseControllerResultSuccess(fFileStatuslist);

		} catch (Exception e) {
			return responseControllerResultError("服务器异常");
		}
	}

}
