---
title: 'MyBatis Tutorial: Part1 – CRUD Operations'
author: Siva
type: post
date: 2012-10-21T11:10:00+00:00
url: /2012/10/mybatis-tutorial-part1-crud-operations/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/10/mybatis-tutorial-part1-crud-operations.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/3198252148295035486
post_views_count:
  - 80
categories:
  - Java
tags:
  - Java
  - MyBatis

---
MyBatis is an SQL Mapper tool which greatly simplifies the database programing when compared to using JDBC directly.

[**MyBatis Tutorial: Part1 &#8211; CRUD Operations**]({{< relref "2012-10-21-mybatis-tutorial-part1-crud-operations.md" >}}) 
  
[**MyBatis Tutorial: Part-2: CRUD operations Using Annotations**]({{< relref "2012-10-21-mybatis-tutorial-part-2-crud-operations-using-annotations.md" >}}) 
  
[**MyBatis Tutorial: Part 3 &#8211; Mapping Relationships**]({{< relref "2012-10-21-mybatis-tutorial-part-3-mapping-relationships.md" >}}) 
  
[**MyBatis Tutorial : Part4 &#8211; Spring Integration**]({{< relref "2012-10-24-mybatis-tutorial-part4-spring-integration.md" >}}) 

**Step1:** Create a Maven project and configure MyBatis dependencies.

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
 http://maven.apache.org/xsd/maven-4.0.0.xsd">
 <modelVersion>4.0.0</modelVersion>

 <groupId>com.sivalabs</groupId>
 <artifactId>mybatis-demo</artifactId>
 <version>0.0.1-SNAPSHOT</version>
 <packaging>jar</packaging>

 <name>mybatis-demo</name>
 <url>http://maven.apache.org</url>

 <properties>
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
 </properties>

 <build>
  <plugins>
   <plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>2.3.2</version>
    <configuration>
     <source>1.6</source>
     <target>1.6</target>
     <encoding>${project.build.sourceEncoding}</encoding>
    </configuration>
   </plugin>
  </plugins>
 </build>

 <dependencies>
  <dependency>
   <groupId>junit</groupId>
   <artifactId>junit</artifactId>
   <version>4.10</version>
   <scope>test</scope>
  </dependency>
  <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>3.1.1</version>
  </dependency>
  <dependency>
     <groupId>mysql</groupId>
     <artifactId>mysql-connector-java</artifactId>
     <version>5.1.21</version>
     <scope>runtime</scope>
  </dependency>
 </dependencies>
</project>
```

**Step#2:** Create the table USER and a Java domain Object User as follows:

```sql
CREATE TABLE  user (
  user_id int(10) unsigned NOT NULL auto_increment,
  email_id varchar(45) NOT NULL,
  password varchar(45) NOT NULL,
  first_name varchar(45) NOT NULL,
  last_name varchar(45) default NULL,
  PRIMARY KEY  (user_id),
  UNIQUE KEY Index_2_email_uniq (email_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```


```java
package com.sivalabs.mybatisdemo.domain;
public class User 
{
    private Integer userId;
    private String emailId;
    private String password;
    private String firstName;
    private String lastName;
    //setters and getters 
    
    @Override
    public String toString() {
        return "User [userId=" + userId + ", emailId=" + emailId
        + ", password=" + password + ", firstName=" + firstName
        + ", lastName=" + lastName + "]";
    }
    
}
```

**Step#3:** Create MyBatis configuration files.

**a) Create jdbc.properties file in src/main/resources folder**

```properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/mybatis-demo
jdbc.username=root
jdbc.password=admin
```

**b) Create mybatis-config.xml file in src/main/resources folder**

```xml
<?xml version="1.0" encoding="UTF-8" ?>
  <!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd">
  <configuration>
  
   <properties resource="jdbc.properties"/>
   
   <typeAliases>
    <typeAlias type="com.sivalabs.mybatisdemo.domain.User" alias="User"/>
   </typeAliases>
   
   <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">    
         <property name="driver" value="${jdbc.driverClassName}"/>
         <property name="url" value="${jdbc.url}"/>
         <property name="username" value="${jdbc.username}"/>
         <property name="password" value="${jdbc.password}"/>
      </dataSource>
    </environment>
   </environments>
   <mappers>
        <mapper resource="com/sivalabs/mybatisdemo/mappers/UserMapper.xml"/>
    </mappers>
  </configuration>
```

**Step#4:** Create an interface UserMapper.java in src/main/java folder in com.sivalabs.mybatisdemo.mappers package.

```java
package com.sivalabs.mybatisdemo.mappers;

import java.util.List;
import com.sivalabs.mybatisdemo.domain.User;

public interface UserMapper 
{

    public void insertUser(User user);
    
    public User getUserById(Integer userId);
    
    public List<User> getAllUsers();
    
    public void updateUser(User user);
    
    public void deleteUser(Integer userId);

}

```

**Step#5:** Create UserMapper.xml file in src/main/resources folder in com.sivalabs.mybatisdemo.mappers package.

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
  
<mapper namespace="com.sivalabs.mybatisdemo.mappers.UserMapper">

  <select id="getUserById" parameterType="int" 
            resultType="com.sivalabs.mybatisdemo.domain.User">
     SELECT 
          user_id as userId, 
          email_id as emailId , 
          password, 
          first_name as firstName, 
          last_name as lastName
     FROM USER 
     WHERE USER_ID = #{userId}
  </select>
  
  <!-- Instead of referencing Fully Qualified Class Names 
        we can register Aliases in mybatis-config.xml and use Alias names. -->
  <resultMap type="User" id="UserResult">
        <id property="userId" column="user_id"/>
        <result property="emailId" column="email_id"/>
        <result property="password" column="password"/>
        <result property="firstName" column="first_name"/>
        <result property="lastName" column="last_name"/>   
  </resultMap>
  
  <select id="getAllUsers" resultMap="UserResult">
        SELECT * FROM USER
  </select>
  
  <insert id="insertUser" parameterType="User" useGeneratedKeys="true" 
            keyProperty="userId">
        INSERT INTO USER(email_id, password, first_name, last_name)
        VALUES(#{emailId}, #{password}, #{firstName}, #{lastName})
  </insert>
  
  <update id="updateUser" parameterType="User">
      UPDATE USER 
      SET
         PASSWORD= #{password},
         FIRST_NAME = #{firstName},
         LAST_NAME = #{lastName}
      WHERE USER_ID = #{userId}
  </update>
  
  <delete id="deleteUser" parameterType="int">
      DELETE FROM USER WHERE USER_ID = #{userId}
  </delete>
  
</mapper>
```

**Step#6:** Create MyBatisUtil.java to instantiate SqlSessionFactory.

```java
package com.sivalabs.mybatisdemo.service;

import java.io.IOException;
import java.io.Reader;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MyBatisUtil 
{
    private static SqlSessionFactory factory;

    private MyBatisUtil() {}
 
    static
    {
          Reader reader = null;
          try {
             reader = Resources.getResourceAsReader("mybatis-config.xml");
          } 
          catch (IOException e) {
            throw new RuntimeException(e.getMessage());
          }
          factory = new SqlSessionFactoryBuilder().build(reader);
    }
 
    public static SqlSessionFactory getSqlSessionFactory() 
    {
        return factory;
    }
}
```

**Step#7:** Create UserService.java in src/main/java folder.

```java
package com.sivalabs.mybatisdemo.service;

import java.util.List;
import org.apache.ibatis.session.SqlSession;
import com.sivalabs.mybatisdemo.domain.User;
import com.sivalabs.mybatisdemo.mappers.UserMapper;

public class UserService
{

	public void insertUser(User user)
	{
		SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
		try
		{
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			userMapper.insertUser(user);
			sqlSession.commit();
		} finally
		{
			sqlSession.close();
		}
	}

	public User getUserById(Integer userId)
	{
		SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
		try
		{
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			return userMapper.getUserById(userId);
		} finally
		{
			sqlSession.close();
		}
	}

	public List<User> getAllUsers()
	{
		SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
		try
		{
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			return userMapper.getAllUsers();
		} finally
		{
			sqlSession.close();
		}
	}

	public void updateUser(User user)
	{
		SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
		try
		{
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			userMapper.updateUser(user);
			sqlSession.commit();
		} finally
		{
			sqlSession.close();
		}
	}

	public void deleteUser(Integer userId)
	{
		SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
		try
		{
			UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
			userMapper.deleteUser(userId);
			sqlSession.commit();
		} finally
		{
			sqlSession.close();
		}
	}

}
```

**Step#8:** Create a JUnit Test class to test UserService methods.

```java
package com.sivalabs.mybatisdemo;

import java.util.List;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import com.sivalabs.mybatisdemo.domain.User;
import com.sivalabs.mybatisdemo.service.UserService;

public class UserServiceTest
{
	private static UserService userService;

	@BeforeClass
	public static void setup()
	{
		userService = new UserService();
	}

	@AfterClass
	public static void teardown()
	{
		userService = null;
	}

	@Test
	public void testGetUserById()
	{
		User user = userService.getUserById(1);
		Assert.assertNotNull(user);
		System.out.println(user);
	}

	@Test
	public void testGetAllUsers()
	{
		List<User> users = userService.getAllUsers();
		Assert.assertNotNull(users);
		for (User user : users)
		{
			System.out.println(user);
		}
	}

	@Test
	public void testInsertUser()
	{
		User user = new User();
		user.setEmailId("test_email_" + System.currentTimeMillis() + "@gmail.com");
		user.setPassword("secret");
		user.setFirstName("TestFirstName");
		user.setLastName("TestLastName");

		userService.insertUser(user);
		Assert.assertTrue(user.getUserId() != 0);
		User createdUser = userService.getUserById(user.getUserId());
		Assert.assertNotNull(createdUser);
		Assert.assertEquals(user.getEmailId(), createdUser.getEmailId());
		Assert.assertEquals(user.getPassword(), createdUser.getPassword());
		Assert.assertEquals(user.getFirstName(), createdUser.getFirstName());
		Assert.assertEquals(user.getLastName(), createdUser.getLastName());
	}

	@Test
	public void testUpdateUser()
	{
		long timestamp = System.currentTimeMillis();
		User user = userService.getUserById(2);
		user.setFirstName("TestFirstName" + timestamp);
		user.setLastName("TestLastName" + timestamp);
		userService.updateUser(user);
		User updatedUser = userService.getUserById(2);
		Assert.assertEquals(user.getFirstName(), updatedUser.getFirstName());
		Assert.assertEquals(user.getLastName(), updatedUser.getLastName());
	}

	@Test
	public void testDeleteUser()
	{
		User user = userService.getUserById(4);
		userService.deleteUser(user.getUserId());
		User deletedUser = userService.getUserById(4);
		Assert.assertNull(deletedUser);
	}
}
```
