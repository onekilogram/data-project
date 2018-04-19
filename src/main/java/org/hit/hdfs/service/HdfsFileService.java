package org.hit.hdfs.service;

import java.util.List;

import org.apache.hadoop.fs.BlockLocation;
import org.apache.hadoop.fs.FileStatus;

public interface HdfsFileService {
	/**
	 * @Description: 获得filePath下所有的文件和文件夹 
	 * @param filePath
	 * @return List<FileStatus> 返回类型
	 */
	List<FileStatus> getHdfsFile(String filePath);
	
	BlockLocation[] getBlockLocation(String filePath);
}
