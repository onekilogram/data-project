package org.hit.hdfs.service.impl;

import java.util.ArrayList;
import java.util.Map;

import org.hit.hdfs.service.HdfsCmdService;
import org.hit.hdfs.utils.HdfsCmdUtils;
import org.springframework.stereotype.Service;
@Service("hdfsCmdService")
public class HdfsCmdServiceImpl implements HdfsCmdService {

	@Override
	public Map<String, ArrayList<String>> execShellCmd(String cmd) {
		// TODO Auto-generated method stub
		return HdfsCmdUtils.execShellCmd(cmd);
	}
	
}
