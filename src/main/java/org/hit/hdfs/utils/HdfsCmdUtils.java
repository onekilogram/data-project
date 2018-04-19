package org.hit.hdfs.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName HdfsCmdUtils
 * @Description TODO(这里用一句话描述这个类的作用)
 * @author kg
 */
public class HdfsCmdUtils {

	/**
	 * @method: execShellCmd 
	 * @Description: TODO(这里用一句话描述这个方法的作用) 
	 * @param command
	 * @return Map<String,ArrayList<String>> 返回类型
	 */
	public static Map<String, ArrayList<String>> execShellCmd(String command) {
		InputStreamReader stdISR = null;
		InputStreamReader errISR = null;
		Process process = null;
		// String command = "ls /home/kg/";
		Map<String, ArrayList<String>> map = new HashMap<String, ArrayList<String>>();
		map.put("out", new ArrayList<String>());
		map.put("err", new ArrayList<String>());
		try {
			process = Runtime.getRuntime().exec(command);
			// int exitValue = process.waitFor(); //执行完，再返回执行结果
			process.waitFor(); // 执行完，再返回执行结果
			String line = null;
			stdISR = new InputStreamReader(process.getInputStream());
			BufferedReader stdBR = new BufferedReader(stdISR);
			while ((line = stdBR.readLine()) != null) {
				System.out.println("STD line:" + line);
				map.get("out").add(line);
			}
			errISR = new InputStreamReader(process.getErrorStream());
			BufferedReader errBR = new BufferedReader(errISR);
			while ((line = errBR.readLine()) != null) {
				System.out.println("ERR line:" + line);
				map.get("err").add(line);
			}
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		} finally {
			try {
				if (stdISR != null) {
					stdISR.close();
				}
				if (errISR != null) {
					errISR.close();
				}
				if (process != null) {
					process.destroy();
				}
			} catch (IOException e) {
				System.out.println("执行命令：" + command + "有IO异常");
			}
		}
		return map;
	}

	public static void main (String [] args){
		execShellCmd("ls  /home");
	}
}
