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

[**MyBatis Tutorial: Part1 &#8211; CRUD Operations**][1]
  
[**MyBatis Tutorial: Part-2: CRUD operations Using Annotations**][2]
  
[**MyBatis Tutorial: Part 3 &#8211; Mapping Relationships**][3]
  
[**MyBatis Tutorial : Part4 &#8211; Spring Integration**][4]

**Step1: **Create a Maven project and configure MyBatis dependencies.

<pre class="lang:xhtml decode:true brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
 http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;
 &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;

 &lt;groupId&gt;com.sivalabs&lt;/groupId&gt;
 &lt;artifactId&gt;mybatis-demo&lt;/artifactId&gt;
 &lt;version&gt;0.0.1-SNAPSHOT&lt;/version&gt;
 &lt;packaging&gt;jar&lt;/packaging&gt;

 &lt;name&gt;mybatis-demo&lt;/name&gt;
 &lt;url&gt;http://maven.apache.org&lt;/url&gt;

 &lt;properties&gt;
  &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
 &lt;/properties&gt;

 &lt;build&gt;
  &lt;plugins&gt;
   &lt;plugin&gt;
    &lt;groupId&gt;org.apache.maven.plugins&lt;/groupId&gt;
    &lt;artifactId&gt;maven-compiler-plugin&lt;/artifactId&gt;
    &lt;version&gt;2.3.2&lt;/version&gt;
    &lt;configuration&gt;
     &lt;source&gt;1.6&lt;/source&gt;
     &lt;target&gt;1.6&lt;/target&gt;
     &lt;encoding&gt;${project.build.sourceEncoding}&lt;/encoding&gt;
    &lt;/configuration&gt;
   &lt;/plugin&gt;
  &lt;/plugins&gt;
 &lt;/build&gt;

 &lt;dependencies&gt;
  &lt;dependency&gt;
   &lt;groupId&gt;junit&lt;/groupId&gt;
   &lt;artifactId&gt;junit&lt;/artifactId&gt;
   &lt;version&gt;4.10&lt;/version&gt;
   &lt;scope&gt;test&lt;/scope&gt;
  &lt;/dependency&gt;
  
  &lt;dependency&gt;
      &lt;groupId&gt;org.mybatis&lt;/groupId&gt;
      &lt;artifactId&gt;mybatis&lt;/artifactId&gt;
      &lt;version&gt;3.1.1&lt;/version&gt;
  &lt;/dependency&gt;
  &lt;dependency&gt;
             &lt;groupId&gt;mysql&lt;/groupId&gt;
             &lt;artifactId&gt;mysql-connector-java&lt;/artifactId&gt;
             &lt;version&gt;5.1.21&lt;/version&gt;
             &lt;scope&gt;runtime&lt;/scope&gt;
         &lt;/dependency&gt;
 &lt;/dependencies&gt;
&lt;/project&gt;</pre>

**Step#2: **Create the table USER and a Java domain Object User as follows:

<pre class="brush: xml">CREATE TABLE  user (
  user_id int(10) unsigned NOT NULL auto_increment,
  email_id varchar(45) NOT NULL,
  password varchar(45) NOT NULL,
  first_name varchar(45) NOT NULL,
  last_name varchar(45) default NULL,
  PRIMARY KEY  (user_id),
  UNIQUE KEY Index_2_email_uniq (email_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;</pre>

&nbsp;

<pre class="brush: java">package com.sivalabs.mybatisdemo.domain;
public class User 
{
 private Integer userId;
 private String emailId;
 private String password;
 private String firstName;
 private String lastName;
 
 @Override
 public String toString() {
  return "User [userId=" + userId + ", emailId=" + emailId
    + ", password=" + password + ", firstName=" + firstName
    + ", lastName=" + lastName + "]";
 }
 //setters and getters 
}</pre>

**Step#3:** Create MyBatis configuration files.

**a) Create jdbc.properties file in src/main/resources folder **

<pre class="brush: xml">jdbc.driverClassName=com.mysql.jdbc.Driver
  jdbc.url=jdbc:mysql://localhost:3306/mybatis-demo
  jdbc.username=root
  jdbc.password=admin
</pre>

**b) Create mybatis-config.xml file in src/main/resources folder **

<pre class="brush: xml">&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
  &lt;!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd"&gt;
  &lt;configuration&gt;
   &lt;properties resource="jdbc.properties"/&gt;
   &lt;typeAliases&gt;
    &lt;typeAlias type="com.sivalabs.mybatisdemo.domain.User" alias="User"&gt;&lt;/typeAlias&gt;
   &lt;/typeAliases&gt;
   &lt;environments default="development"&gt;
    &lt;environment id="development"&gt;
      &lt;transactionManager type="JDBC"/&gt;
      &lt;dataSource type="POOLED"&gt;    
     &lt;property name="driver" value="${jdbc.driverClassName}"/&gt;
     &lt;property name="url" value="${jdbc.url}"/&gt;
     &lt;property name="username" value="${jdbc.username}"/&gt;
     &lt;property name="password" value="${jdbc.password}"/&gt;
      &lt;/dataSource&gt;
    &lt;/environment&gt;
    &lt;/environments&gt;
    &lt;mappers&gt;
   &lt;mapper resource="com/sivalabs/mybatisdemo/mappers/UserMapper.xml"/&gt;
    &lt;/mappers&gt;
  &lt;/configuration&gt;
</pre>

**Step#4: **Create an interface UserMapper.java in src/main/java folder in com.sivalabs.mybatisdemo.mappers package.

<pre class="brush: java">package com.sivalabs.mybatisdemo.mappers;

  import java.util.List;
  import com.sivalabs.mybatisdemo.domain.User;

  public interface UserMapper 
  {

   public void insertUser(User user);
   
   public User getUserById(Integer userId);
   
   public List&lt;User&gt; getAllUsers();
   
   public void updateUser(User user);
   
   public void deleteUser(Integer userId);
   
  }

</pre>

**Step#5:** Create UserMapper.xml file in src/main/resources folder in com.sivalabs.mybatisdemo.mappers package.

<pre class="brush: xml">&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
&lt;!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd"&gt;
  
&lt;mapper namespace="com.sivalabs.mybatisdemo.mappers.UserMapper"&gt;

  &lt;select id="getUserById" parameterType="int" resultType="com.sivalabs.mybatisdemo.domain.User"&gt;
     SELECT 
      user_id as userId, 
      email_id as emailId , 
      password, 
      first_name as firstName, 
      last_name as lastName
     FROM USER 
     WHERE USER_ID = #{userId}
  &lt;/select&gt;
  &lt;!-- Instead of referencing Fully Qualified Class Names we can register Aliases in mybatis-config.xml and use Alias names. --&gt;
   &lt;resultMap type="User" id="UserResult"&gt;
    &lt;id property="userId" column="user_id"/&gt;
    &lt;result property="emailId" column="email_id"/&gt;
    &lt;result property="password" column="password"/&gt;
    &lt;result property="firstName" column="first_name"/&gt;
    &lt;result property="lastName" column="last_name"/&gt;   
   &lt;/resultMap&gt;
  
  &lt;select id="getAllUsers" resultMap="UserResult"&gt;
   SELECT * FROM USER
  &lt;/select&gt;
  
  &lt;insert id="insertUser" parameterType="User" useGeneratedKeys="true" keyProperty="userId"&gt;
   INSERT INTO USER(email_id, password, first_name, last_name)
    VALUES(#{emailId}, #{password}, #{firstName}, #{lastName})
  &lt;/insert&gt;
  
  &lt;update id="updateUser" parameterType="User"&gt;
    UPDATE USER 
    SET
     PASSWORD= #{password},
     FIRST_NAME = #{firstName},
     LAST_NAME = #{lastName}
    WHERE USER_ID = #{userId}
  &lt;/update&gt;
  
  &lt;delete id="deleteUser" parameterType="int"&gt;
    DELETE FROM USER WHERE USER_ID = #{userId}
  &lt;/delete&gt;
  
&lt;/mapper&gt;</pre>

**Step#6: **Create MyBatisUtil.java to instantiate SqlSessionFactory.

<pre class="brush: java">package com.sivalabs.mybatisdemo.service;

import java.io.IOException;
import java.io.Reader;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MyBatisUtil 
{
 private static SqlSessionFactory factory;

 private MyBatisUtil() {
 }
 
 static
 {
  Reader reader = null;
  try {
   reader = Resources.getResourceAsReader("mybatis-config.xml");
  } catch (IOException e) {
   throw new RuntimeException(e.getMessage());
  }
  factory = new SqlSessionFactoryBuilder().build(reader);
 }
 
 public static SqlSessionFactory getSqlSessionFactory() 
 {
  return factory;
 }
}</pre>

**Step#7: **Create UserService.java in src/main/java folder.

<pre class="lang:java decode:true brush: java ">package com.sivalabs.mybatisdemo.service;

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

	public List&lt;User&gt; getAllUsers()
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

}</pre>

**Step#8:** Create a JUnit Test class to test UserService methods.

<pre class="lang:java decode:true brush: java  ">package com.sivalabs.mybatisdemo;

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
		List&lt;User&gt; users = userService.getAllUsers();
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
}</pre>

 [1]: http://www.sivalabs.in/2012/10/mybatis-tutorial-part1-crud-operations.html
 [2]: http://www.sivalabs.in/2012/10/mybatis-tutorial-part-2-crud-operations.html
 [3]: http://www.sivalabs.in/2012/10/mybatis-tutorial-part-3-mapping.html
 [4]: http://www.sivalabs.in/2012/10/mybatis-tutorial-part4-spring.html