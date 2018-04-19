package org.hit.hdfs.service.impl;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.hadoop.fs.FileStatus;
import org.hit.hdfs.service.HdfsFileService;
import org.hit.hdfs.utils.HdfsFileUtils;
import org.springframework.stereotype.Service;

@Service("hdfsFileService")
public class HdfsFileServiceImpl implements HdfsFileService {

	@Override
	public List<FileStatus> getHdfsFile(String filePath) {
		// TODO Auto-generated method stub
		try {
			return HdfsFileUtils.getFileStatus(filePath);
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}

}
