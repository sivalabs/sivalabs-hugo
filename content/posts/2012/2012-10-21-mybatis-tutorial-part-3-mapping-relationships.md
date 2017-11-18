---
title: 'MyBatis Tutorial: Part 3 – Mapping Relationships'
author: Siva
type: post
date: 2012-10-21T14:07:00+00:00
url: /2012/10/mybatis-tutorial-part-3-mapping-relationships/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/10/mybatis-tutorial-part-3-mapping.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1293821308785804593
post_views_count:
  - 99
categories:
  - Java
tags:
  - MyBatis

---
In this post let us see how to use MyBatis ResultMap configuration to map relationships.

[**MyBatis Tutorial: Part1 &#8211; CRUD Operations**]({{< relref "2012-10-21-mybatis-tutorial-part1-crud-operations.md" >}}) 
  
[**MyBatis Tutorial: Part-2: CRUD operations Using Annotations**]({{< relref "2012-10-21-mybatis-tutorial-part-2-crud-operations-using-annotations.md" >}}) 
  
[**MyBatis Tutorial: Part 3 &#8211; Mapping Relationships**]({{< relref "2012-10-21-mybatis-tutorial-part-3-mapping-relationships.md" >}}) 
  
[**MyBatis Tutorial : Part4 &#8211; Spring Integration**]({{< relref "2012-10-24-mybatis-tutorial-part4-spring-integration.md" >}}) 

To illustrate we are considering the following sample domain model:
  
There will be Users and each User may have a Blog and each Blog can contain zero or more posts.

The Database structure of the three tables are as follows:

{{< highlight sql >}}
CREATE TABLE user (
  user_id int(10) unsigned NOT NULL auto_increment,
  email_id varchar(45) NOT NULL,
  password varchar(45) NOT NULL,
  first_name varchar(45) NOT NULL,
  last_name varchar(45) default NULL,
  blog_id int(10) unsigned default NULL,
  PRIMARY KEY  (user_id),
  UNIQUE KEY Index_2_email_uniq (email_id),
  KEY FK_user_blog (blog_id),
  CONSTRAINT FK_user_blog FOREIGN KEY (blog_id) REFERENCES blog (blog_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE blog (
  blog_id int(10) unsigned NOT NULL auto_increment,
  blog_name varchar(45) NOT NULL,
  created_on datetime NOT NULL,
  PRIMARY KEY  (blog_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE post (
  post_id int(10) unsigned NOT NULL auto_increment,
  title varchar(45) NOT NULL,
  content varchar(1024) NOT NULL,
  created_on varchar(45) NOT NULL,
  blog_id int(10) unsigned NOT NULL,
  PRIMARY KEY  (post_id),
  KEY FK_post_blog (blog_id),
  CONSTRAINT FK_post_blog FOREIGN KEY (blog_id) REFERENCES blog (blog_id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

{{</ highlight >}}

Here I am going to explain how to fetch and map *-has-One and One-To-Many result mappings.

{{< highlight java >}}
package com.sivalabs.mybatisdemo.domain;

public class User 
{
     private Integer userId;
     private String emailId;
     private String password;
     private String firstName;
     private String lastName;
     private Blog blog;
     //setters and getters
}

{{</ highlight >}}

{{< highlight java >}}
package com.sivalabs.mybatisdemo.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class Blog 
{
     private Integer blogId;
     private String blogName;
     private Date createdOn;
     private List<Post> posts = new ArrayList<Post>();
     //setters and getters
}
{{</ highlight >}}

{{< highlight java >}}
package com.sivalabs.mybatisdemo.domain;

import java.util.Date;

public class Post 
{
     private Integer postId;
     private String title;
     private String content;
     private Date createdOn;
     //setters and getters
}
{{</ highlight >}}

In mybatis-config.xml, configure type aliases for beans.

{{< highlight xml >}}
<typeAliases>
  <typeAlias type="com.sivalabs.mybatisdemo.domain.User" alias="User"/>
  <typeAlias type="com.sivalabs.mybatisdemo.domain.Blog" alias="Blog"/>
  <typeAlias type="com.sivalabs.mybatisdemo.domain.Post" alias="Post"/>  
</typeAliases>
{{</ highlight >}}

  
### ***-has-One Result Mapping

In UserMapper.xml, configure sql queries and result maps as follows:

{{< highlight xml >}}
<mapper namespace="com.sivalabs.mybatisdemo.mappers.UserMapper">

 <resultMap type="User" id="UserResult">
    <id property="userId" column="user_id"/>
    <result property="emailId" column="email_id"/>
    <result property="password" column="password"/>
    <result property="firstName" column="first_name"/>
    <result property="lastName" column="last_name"/>
    <association property="blog" resultMap="BlogResult"/>
 </resultMap>
   
 <resultMap type="Blog" id="BlogResult">
    <id property="blogId" column="blog_id"/>
    <result property="blogName" column="BLOG_NAME"/>
    <result property="createdOn" column="CREATED_ON"/>    
 </resultMap>
 
 <select id="getUserById" parameterType="int" resultMap="UserResult">
     SELECT 
          U.USER_ID, U.EMAIL_ID, U.PASSWORD, U.FIRST_NAME, U.LAST_NAME, 
          B.BLOG_ID, B.BLOG_NAME, B.CREATED_ON
     FROM USER U LEFT OUTER JOIN BLOG B ON U.BLOG_ID=B.BLOG_ID
     WHERE U.USER_ID = #{userId}
 </select>
  
 <select id="getAllUsers" resultMap="UserResult">
    SELECT 
         U.USER_ID, U.EMAIL_ID, U.PASSWORD, U.FIRST_NAME, U.LAST_NAME, 
         B.BLOG_ID, B.BLOG_NAME, B.CREATED_ON
    FROM USER U LEFT OUTER JOIN BLOG B ON U.BLOG_ID=B.BLOG_ID
 </select>
  
</mapper>
{{</ highlight >}}

In JUnit Test, write a method to test the association loading.

{{< highlight java >}}
public void getUserById() 
{
     SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
     
     try{
          UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
          User user = userMapper.getUserById(1);
          System.out.println(user.getBlog());
     } 
     finally {
      sqlSession.close();
     }
}
{{</ highlight >}}

### One-To-Many Results Mapping

In BlogMapper.xml configure Blog to Posts relationship as follows:

{{< highlight xml >}}
<mapper namespace="com.sivalabs.mybatisdemo.mappers.BlogMapper">

 <resultMap type="Blog" id="BlogResult">
    <id property="blogId" column="blog_id"/>
    <result property="blogName" column="BLOG_NAME"/>
    <result property="createdOn" column="CREATED_ON"/>
    <collection property="posts" ofType="Post" 
        resultMap="PostResult" columnPrefix="post_"/>
 </resultMap>
   
 <resultMap type="Post" id="PostResult">
    <id property="postId" column="post_id"/>
    <result property="title" column="title"/>
    <result property="content" column="content"/>
    <result property="createdOn" column="created_on"/>
 </resultMap>
   
 <select id="getBlogById" parameterType="int" resultMap="BlogResult">
     SELECT 
          b.blog_id, b.blog_name, b.created_on, 
          p.post_id as post_post_id, p.title as post_title, 
          p.content as post_content, p.created_on as post_created_on
    FROM blog b left outer join post p on b.blog_id=p.blog_id
    WHERE b.BLOG_ID=#{blogId}
 </select>
  
 <select id="getAllBlogs" resultMap="BlogResult">
   SELECT 
        b.blog_id, b.blog_name, b.created_on as blog_created_on, 
        p.post_id as post_post_id, p.title as post_title, 
        p.content as post_content, p.created_on as post_created_on
    FROM blog b left outer join post p on b.blog_id=p.blog_id
 </select>
  
</mapper>
{{</ highlight >}}

In JUnit Test, write a test method to test blog-to-posts relationship mapping.

{{< highlight java >}}
public void getBlogById() 
{
     SqlSession sqlSession = MyBatisUtil.getSqlSessionFactory().openSession();
     
     try{
         BlogMapper blogMapper = sqlSession.getMapper(BlogMapper.class);
         Blog blog = blogMapper.getBlogById(1);
         System.out.println(blog);
         
         List<Post> posts = blog.getPosts();
         for (Post post : posts) {
            System.out.println(post);
         }
     }
     finally {
        sqlSession.close();
     }
}
{{</ highlight >}}

