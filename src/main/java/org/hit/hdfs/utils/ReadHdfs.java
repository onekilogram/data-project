package org.hit.hdfs.utils;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;

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
 * Created by Administrator on 2017/5/25.
 */
public class ReadHdfs {
	public static void main(String[] args) {

		Path path = new Path("hdfs://master:9000/");
		// Path filePath = new
		// Path("hdfs://192.168.1.50:9000/hdfstest/people.txt");
		try {

			// 得到 FileSystem 类
			FileSystem hdfs = getFileSystem();

			// 列出某个目录下所有文件的信息
			listFilesStatus(path, hdfs);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 *
	 * @return 得到hdfs的连接 FileSystem类
	 * @throws URISyntaxException
	 * @throws IOException
	 * @throws InterruptedException
	 */
	public static FileSystem getFileSystem() throws URISyntaxException, IOException, InterruptedException {
		// 获取FileSystem类的方法有很多种，这里只写一种
		Configuration config = new Configuration();
		URI uri = new URI("hdfs://master:9000/");
		return FileSystem.get(uri, config);// 第一位为uri，第二位为config，第三位是登录的用户
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
				System.out.println("文件长度: " + len + "\n" + "文件路径: " + pathSource + "\n" + "文件名称: " + fileName + "\n"
						+ "文件父路径: " + parentPath + "\n" + "文件最后修改时间: " + timestamp + "\n" + "文件块大小: " + blockSize + "\n"
						+ "文件所属组: " + group + "\n" + "文件拥有者: " + owner + "\n" + "该文件上次访问时间: " + accessTime + "\n"
						+ "文件副本数: " + replication + "\n" + "-------: " + permission + "\n"
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

			for (FileStatus file1 : _list) {
				// FileStatus file = files[i];
				if (file1.isFile()) {
					System.out.println("这是文件");
					long len = file1.getLen(); // 文件长度
					String pathSource = file1.getPath().toString();// 文件路径
					String fileName = file1.getPath().getName(); // 文件名称
					String parentPath = file1.getPath().getParent().toString();// 文件父路径
					Timestamp timestamp = new Timestamp(file1.getModificationTime());// 文件最后修改时间
					long blockSize = file1.getBlockSize(); // 文件块大小
					String group = file1.getGroup(); // 文件所属组
					String owner = file1.getOwner(); // 文件拥有者
					// file.get
					long accessTime = file1.getAccessTime(); // 该文件上次访问时间
					short replication = file1.getReplication(); // 文件副本数
					String permission = file1.getPermission().toString();
					System.out.println("文件长度: " + len + "\n" + "文件路径: " + pathSource + "\n" + "文件名称: " + fileName + "\n"
							+ "文件父路径: " + parentPath + "\n" + "文件最后修改时间: " + timestamp + "\n" + "文件块大小: " + blockSize
							+ "\n" + "文件所属组: " + group + "\n" + "文件拥有者: " + owner + "\n" + "该文件上次访问时间: " + accessTime
							+ "\n" + "文件副本数: " + replication + "\n" + "-------: " + permission + "\n"
							+ "==============================");
				}

			}

			// System.out.println("对象转换成json字符串 ：" + JSON.toJSONString(list));
		}
	}

}