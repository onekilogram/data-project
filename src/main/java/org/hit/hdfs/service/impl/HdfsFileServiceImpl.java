package org.hit.hdfs.service.impl;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import org.apache.hadoop.fs.BlockLocation;
import org.apache.hadoop.fs.FileStatus;
import org.hit.hdfs.service.HdfsFileService;
import org.hit.hdfs.utils.HdfsFileUtils;
import org.springframework.stereotype.Service;

@Service("hdfsFileService")
public class HdfsFileServiceImpl implements HdfsFileService {

	/**
	 * @Description: 获得filePath下所有的文件和文件夹 
	 * @param filePath
	 * @return List<FileStatus> 返回类型
	 */
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
//	BlockLocation[] blkLocations;
//	FileStatus file1 = null ;
//	if (file1 instanceof LocatedFileStatus) {
//		blkLocations = ((LocatedFileStatus) file1).getBlockLocations();
//	} else {
//		blkLocations = fs.getFileBlockLocations(file1, 0, 90);
//	}
	/**
	 * @Description: 获得filePath下所有的文件和文件夹 
	 * @param filePath
	 * @return List<FileStatus> 返回类型
	 */
	@Override
	public BlockLocation[] getBlockLocation(String filePath) {
		// TODO Auto-generated method stub
		try {
			return HdfsFileUtils.getBlockLocation(filePath);
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
