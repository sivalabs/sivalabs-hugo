---
title: 'MyBatis Tutorial: Part-2: CRUD operations Using Annotations'
author: Siva
type: post
date: 2012-10-21T11:49:00+00:00
url: /mybatis-tutorial-part-2-crud-operations-using-annotations/
categories:
  - Java
tags:
  - MyBatis

---
In this post I will explain how to perform CRUD operations using MyBatis Annotation support without need of Queries configuration in XML mapper files.

[**MyBatis Tutorial: Part1 &#8211; CRUD Operations**]({{< relref "2012-10-21-mybatis-tutorial-part1-crud-operations.md" >}}) 
  
[**MyBatis Tutorial: Part-2: CRUD operations Using Annotations**]({{< relref "2012-10-21-mybatis-tutorial-part-2-crud-operations-using-annotations.md" >}}) 
  
[**MyBatis Tutorial: Part 3 &#8211; Mapping Relationships**]({{< relref "2012-10-21-mybatis-tutorial-part-3-mapping-relationships.md" >}}) 
  
[**MyBatis Tutorial : Part4 &#8211; Spring Integration**]({{< relref "2012-10-24-mybatis-tutorial-part4-spring-integration.md" >}}) 

Step#1: Create a table BLOG and a java domain Object Blog.

```sql
CREATE TABLE  blog 
(
      blog_id int(10) unsigned NOT NULL auto_increment,
      blog_name varchar(45) NOT NULL,
      created_on datetime NOT NULL,
      PRIMARY KEY  (blog_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```

```java
package com.sivalabs.mybatisdemo.domain;

import java.util.Date;

public class Blog 
{
     private Integer blogId;
     private String blogName;
     private Date createdOn;
     
     //Seeters and getters
     
     @Override
     public String toString() {
      return "Blog [blogId=" + blogId + ", blogName=" + blogName
        + ", createdOn=" + createdOn + "]";
     }
}
```

Step#2: Create UserMapper.java interface with SQL queries in Annotations.

```java
package com.sivalabs.mybatisdemo.mappers;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.sivalabs.mybatisdemo.domain.Blog;

public interface BlogMapper 
{
    @Insert("INSERT INTO BLOG(BLOG_NAME, CREATED_ON) 
             VALUES(#{blogName}, #{createdOn})")
    @Options(useGeneratedKeys=true, keyProperty="blogId")
    public void insertBlog(Blog blog);
 
    @Select("SELECT BLOG_ID AS blogId, BLOG_NAME as blogName, 
             CREATED_ON as createdOn FROM BLOG WHERE BLOG_ID=#{blogId}")
    public Blog getBlogById(Integer blogId);

    @Select("SELECT * FROM BLOG ")
    @Results({
      @Result(id=true, property="blogId", column="BLOG_ID"),
      @Result(property="blogName", column="BLOG_NAME"),
      @Result(property="createdOn", column="CREATED_ON")  
    })
    public List<Blog> getAllBlogs();
 
    @Update("UPDATE BLOG SET BLOG_NAME=#{blogName}, CREATED_ON=#{createdOn} 
             WHERE BLOG_ID=#{blogId}")
    public void updateBlog(Blog blog);

    @Delete("DELETE FROM BLOG WHERE BLOG_ID=#{blogId}")
    public void deleteBlog(Integer blogId);
}

```

Step#3: Configure BlogMapper in mybatis-config.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
 
 <properties resource="jdbc.properties"/>
 
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
      <mapper class="com.sivalabs.mybatisdemo.mappers.BlogMapper"/>
  </mappers>
</configuration>
```

Step#4: Create BlogService.java

```java
package com.sivalabs.mybatisdemo.service;

import java.util.List;
import org.apache.ibatis.session.SqlSession;
import com.sivalabs.mybatisdemo.domain.Blog;
import com.sivalabs.mybatisdemo.mappers.BlogMapper;

public class BlogService
{
     public void insertBlog(Blog blog) 
     {
          SqlSession sqlSession = MyBatisUtil
                .getSqlSessionFactory().openSession();
          try{
              BlogMapper blogMapper = sqlSession.getMapper(BlogMapper.class);
              blogMapper.insertBlog(blog);
              sqlSession.commit();
          }
          finally {
              sqlSession.close();
          }
     }

     public Blog getBlogById(Integer blogId) 
     {
          SqlSession sqlSession = MyBatisUtil
                .getSqlSessionFactory().openSession();
          try{
              BlogMapper blogMapper = sqlSession.getMapper(BlogMapper.class);
              return blogMapper.getBlogById(blogId);
          }
          finally {
            sqlSession.close();
          }
     }

     public List<Blog> getAllBlogs() 
     {
          SqlSession sqlSession = MyBatisUtil
                .getSqlSessionFactory().openSession();
          try {
              BlogMapper blogMapper = sqlSession.getMapper(BlogMapper.class);
              return blogMapper.getAllBlogs();
          } 
          finally {
            sqlSession.close();
          }
     }
 
     public void updateBlog(Blog blog) {
          SqlSession sqlSession = MyBatisUtil
                .getSqlSessionFactory().openSession();
          try{
              BlogMapper blogMapper = sqlSession.getMapper(BlogMapper.class);
              blogMapper.updateBlog(blog);
              sqlSession.commit();
          }
          finally {
              sqlSession.close();
          }  
     }

     public void deleteBlog(Integer blogId) 
     {
      SqlSession sqlSession = MyBatisUtil
            .getSqlSessionFactory().openSession();
      try{
          BlogMapper blogMapper = sqlSession.getMapper(BlogMapper.class);
          blogMapper.deleteBlog(blogId);
          sqlSession.commit();
      }
      finally {
          sqlSession.close();
      } 
     }

}
```

Step#5: Create JUnit Test for BlogService methods

```java
package com.sivalabs.mybatisdemo;

import java.util.Date;
import java.util.List;

import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;

import com.sivalabs.mybatisdemo.domain.Blog;
import com.sivalabs.mybatisdemo.service.BlogService;

public class BlogServiceTest 
{
    private static BlogService blogService;
 
    @BeforeClass
    public static void setup() 
    {
      blogService = new BlogService();
    }
 
    @AfterClass
    public static void teardown() 
    {
        blogService = null;
    }
 
    @Test
    public void testGetBlogById() 
    {
        Blog blog = blogService.getBlogById(1);
        Assert.assertNotNull(blog);
        System.out.println(blog);
    }
    
    @Test
    public void testGetAllBlogs() 
    {
         List<Blog> blogs = blogService.getAllBlogs();
         Assert.assertNotNull(blogs);
         for (Blog blog : blogs) 
         {
           System.out.println(blog);
         } 
    }
    
    @Test
    public void testInsertBlog() 
    {
         Blog blog = new Blog();
         blog.setBlogName("test_blog_"+System.currentTimeMillis());
         blog.setCreatedOn(new Date());
         
         blogService.insertBlog(blog);
         Assert.assertTrue(blog.getBlogId() != 0);
         Blog createdBlog = blogService.getBlogById(blog.getBlogId());
         Assert.assertNotNull(createdBlog);
         Assert.assertEquals(blog.getBlogName(), createdBlog.getBlogName());      
    }
    
    @Test
    public void testUpdateBlog() 
    {
        long timestamp = System.currentTimeMillis();
        Blog blog = blogService.getBlogById(2);
        blog.setBlogName("TestBlogName"+timestamp);
        blogService.updateBlog(blog);
        Blog updatedBlog = blogService.getBlogById(2);
        Assert.assertEquals(blog.getBlogName(), updatedBlog.getBlogName());
    }
    
    @Test
    public void testDeleteBlog() 
    {
        Blog blog = blogService.getBlogById(4);
        blogService.deleteBlog(blog.getBlogId());
        Blog deletedBlog = blogService.getBlogById(4);
        Assert.assertNull(deletedBlog);
    }
}
```
