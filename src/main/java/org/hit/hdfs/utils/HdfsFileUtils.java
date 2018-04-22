package org.hit.hdfs.utils;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.BlockLocation;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.LocatedFileStatus;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.hdfs.DistributedFileSystem;
import org.apache.hadoop.hdfs.protocol.DatanodeInfo;
import org.hit.hdfs.common.CONFIG;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by kg on 2018/3/25.
 */
public class HdfsFileUtils {

	/**
	 * @return 得到hdfs的连接 FileSystem类
	 * @throws URISyntaxException
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static FileSystem getFileSystem()
			throws URISyntaxException, IOException, InterruptedException {
		// 获取FileSystem类的方法有很多种，这里只写一种
		Configuration config = new Configuration();
		URI uri = new URI(CONFIG.HDFS_URL);
		return FileSystem.get(uri, config,CONFIG.HDFS_User);// 第一位为uri，第二位为config，第三位是登录的用户
	}

	/**
	 * 列出某个目录下所有文件的信息
	 * 
	 * @param path
	 * @param hdfs
	 * @throws IOException
	 */
	public static void listFilesStatus(Path path, FileSystem hdfs) throws IOException {
		// 列出目录下的所有文件
		FileStatus[] files = hdfs.listStatus(path);
		List<FileStatus> list = new ArrayList<FileStatus>();
		// System.out.println("对象转换成json字符串 ：" + JSON.toJSON(files));
		for (int i = 0; i < files.length; i++) {
			FileStatus file = files[i];
			if (file.isFile()) {
				System.out.println("这是文件");
				long len = file.getLen(); // 文件长度
				String pathSource = file.getPath().toString();// 文件路径
				String fileName = file.getPath().getName(); // 文件名称
				String parentPath = file.getPath().getParent().toString();// 文件父路径
				Timestamp timestamp = new Timestamp(file.getModificationTime());// 文件最后修改时间
				long blockSize = file.getBlockSize(); // 文件块大小
				String group = file.getGroup(); // 文件所属组
				String owner = file.getOwner(); // 文件拥有者
				// file.get
				long accessTime = file.getAccessTime(); // 该文件上次访问时间
				short replication = file.getReplication(); // 文件副本数
				String permission = file.getPermission().toString();
				System.out.println("文件长度: " + len + "\n" + "文件路径: " + pathSource + "\n" + "文件名称: "
						+ fileName + "\n" + "文件父路径: " + parentPath + "\n" + "文件最后修改时间: " + timestamp
						+ "\n" + "文件块大小: " + blockSize + "\n" + "文件所属组: " + group + "\n" + "文件拥有者: "
						+ owner + "\n" + "该文件上次访问时间: " + accessTime + "\n" + "文件副本数: " + replication
						+ "\n" + "-------: " + permission + "\n"
						+ "==============================");

				list.add(file);
			} else if (file.isDirectory()) {
				System.out.println("这是文件夹");
				// System.out.println("文件父路径: "+file.getPath().toString());
				// 递归调用
				// listFilesStatus(file.getPath(),hdfs);
				list.add(file);
			} else if (file.isSymlink()) {
				System.out.println("这是链接文件");
			}
			Gson gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();
			System.out.println(gson.toJson(list));
			String json = gson.toJson(list);
			Type listType = new TypeToken<ArrayList<FileStatus>>() {
			}.getType();
			List<FileStatus> _list = gson.fromJson(json, listType);
			System.out.println("对象转换成json字符串 ：" + _list.size());
		}
	}

	/**
	 * @method: getFileStatus
	 * @Description: TODO(这里用一句话描述这个方法的作用)
	 * @param filePath
	 * @return List<FileStatus> 返回类型
	 * @throws URISyntaxException
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static List<FileStatus> getFileStatus(String filePath)
			throws URISyntaxException, IOException, InterruptedException {
		// 处理filePath
		FileSystem hdfs = getFileSystem();
		Path path = new Path(getRealFilePath(filePath));
		// 列出目录下的所有文件
		FileStatus[] files = hdfs.listStatus(path);
		List<FileStatus> list = new ArrayList<FileStatus>();
		// System.out.println("对象转换成json字符串 ：" + JSON.toJSON(files));

		for (int i = 0; i < files.length; i++) {
			FileStatus file = files[i];
			if (!file.isSymlink()) {
				list.add(file);
			}
		}
		return list;
	}

	/**
	 * @method: getBlockLocation
	 * @Description: TODO(这里用一句话描述这个方法的作用)
	 * @param filePath
	 * @return BlockLocation[] 返回类型
	 * @throws URISyntaxException
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static BlockLocation[] getBlockLocation(String filePath)
			throws URISyntaxException, IOException, InterruptedException {
		// 处理filePath
		FileSystem hdfs = getFileSystem();
		BlockLocation[] blkLocations = null;
		String realPath = getRealFilePath(filePath);
		System.out.println(realPath);
		FileStatus fileStatus = hdfs.getFileStatus(new Path(realPath));
		// 获取这个文件的基本信息
		System.out.println(fileStatus);

		if (fileStatus.isFile()) {
			System.out.println("这是个文件");
			blkLocations = hdfs.getFileBlockLocations(fileStatus, 0, fileStatus.getLen());
		}
		return blkLocations;
	}

	// 将路径转换
	public static String getRealFilePath(String filePath) {
		StringBuilder sBuilder = new StringBuilder();
		if (filePath.startsWith("/")) {
			return sBuilder.append(CONFIG.HDFS_URL).append(filePath).toString();
		} else if (filePath.startsWith("hdfs")) {
			return sBuilder.append(filePath).toString();
		} else {
			return sBuilder.append(CONFIG.HDFS_URL).append("/user/").append(CONFIG.HDFS_User)
					.append("/").append(filePath).toString();
		}
	}

	public static void main(String[] args) {

		Path path = new Path("/1.txt");
		try {
			// 得到 FileSystem 类
			FileSystem hdfs = getFileSystem();
			// 列出某个目录下所有文件的信息
			// listFilesStatus(path, hdfs);

			BlockLocation[] blockLocations = getBlockLocation("/MicroBenchmarks/lda_wiki1w_1");
			for (BlockLocation bloca : blockLocations) {
				System.out.println(bloca);
			}
			Gson gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();
			System.out.println(gson.toJson(blockLocations));

			// Configuration config = new Configuration();
			// FileSystem fs = FileSystem.get(config);
			// DistributedFileSystem hdfs2 = (DistributedFileSystem) fs;
			// DatanodeInfo[] dataNodeStats = hdfs2.getDataNodeStats();
			// String[] names = new String[dataNodeStats.length];
			// for (int i = 0; i < dataNodeStats.length; i++) {
			// System.out.println(dataNodeStats[i]);
			// }

			Configuration conf = new Configuration();
	        // conf.set("dfs.default.name", "hdfs://hadoopmaster:9000");
	        String uri = "hdfs://master:9000";
	        FileSystem fs = FileSystem.get(URI.create(uri), conf,"dbcluster");
	        DistributedFileSystem hdfs2 = (DistributedFileSystem) fs;
	        DatanodeInfo[] dataNodeStats = hdfs2.getDataNodeStats();
	        String[] names = new String[dataNodeStats.length];
	        for (int i = 0; i < dataNodeStats.length; i++) {
	            names[i] = dataNodeStats[i].getHostName();
	            System.out.println("node:" + i + ",name:" + names[i]);
	        }
			// fs.close();
	       /// Gson gson = new GsonBuilder().setPrettyPrinting().serializeNulls().create();
			System.out.println(gson.toJson(dataNodeStats));

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}