package org.hit.hdfs.common;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * 定义了常用API的地址信息
 */
public class CONFIG {

    private static Logger log = LoggerFactory.getLogger(CONFIG.class);

    public static final String HDFS_URL;
    public static final String HDFS_User;
    
    static {
        Properties properties = new Properties();
        InputStream in = CONFIG.class.getClassLoader().getResourceAsStream("project.properties");
        try {
            properties.load(in);
        } catch (IOException e) {
            log.error("初始化API配置项失败", e);
        }
        HDFS_URL = properties.getProperty("hdfsurl").trim();
        HDFS_User = properties.getProperty("hdfsuser").trim();
    }
}
