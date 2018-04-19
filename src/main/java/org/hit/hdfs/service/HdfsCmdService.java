package org.hit.hdfs.service;

import java.util.ArrayList;
import java.util.Map;

public interface HdfsCmdService {
	/**
	 * @Description: shell 执行cmd之后返回的结果 
	 * @param cmd
	 * @return List<String> 返回类型
	 */
	Map<String, ArrayList<String>> execShellCmd(String cmd);
}
