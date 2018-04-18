package org.hit.hdfs.service;

import java.util.List;

import org.apache.hadoop.fs.FileStatus;

public interface HdfsFileService {

	List<FileStatus> getHdfsFile(String filePath);
}
