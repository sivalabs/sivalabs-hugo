---
author: siva
comments: true
date: 2012-10-24 06:10:00+00:00
layout: post
slug: mybatis-tutorial-part4-spring-integration
title: 'MyBatis Tutorial : Part4 - Spring Integration'
wordpress_id: 231
categories:
- MyBatis
- Spring
tags:
- MyBatis
- Spring
---

[**MyBatis Tutorial: Part1 - CRUD Operations**](http://www.sivalabs.in/2012/10/mybatis-tutorial-part1-crud-operations.html)
[**MyBatis Tutorial: Part-2: CRUD operations Using Annotations**](http://www.sivalabs.in/2012/10/mybatis-tutorial-part-2-crud-operations.html)
[**MyBatis Tutorial: Part 3 - Mapping Relationships**](http://www.sivalabs.in/2012/10/mybatis-tutorial-part-3-mapping.html)
[**MyBatis Tutorial : Part4 - Spring Integration**](http://www.sivalabs.in/2012/10/mybatis-tutorial-part4-spring.html)

MyBatis-Spring is a subproject of MyBatis and provides Spring integration support which drastically simplifies the MyBatis usage. For those who are familiar with Spring's way of Dependency Injection process, using MyBatis-Spring is a very simple.

First let us see the process of using MyBatis without Spring.

1. Create SqlSessionFactory using SqlSessionFactoryBuilder by passing mybatis-config.xml which contains DataSource properties, List of Mapper XMLs and TypeAliases etc.

2. Create SqlSession object from SqlSessionFactory

3. Get Mapper instance from SqlSession and execute queries.

4. Commit or rollback the transaction using SqlSession object.

With MyBatis-Spring, most of the above steps can be configured in Spring ApplicationContext and SqlSession or Mapper instances can be injected into Spring Beans. Then we can use Spring's TransactionManagement features without writing transaction commit/rollback code all over the code.


Now let us see how we can configure MyBatis+Spring integration stuff.

**Step#1:** Configure MyBatis-Spring dependencies in pom.xml

    
      
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
          <groupId>org.mybatis</groupId>
          <artifactId>mybatis-spring</artifactId>
          <version>1.1.1</version>
      </dependency>
      <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-context-support</artifactId>
       <version>3.1.1.RELEASE</version>
      </dependency>
      <dependency>
       <groupId>org.springframework</groupId>
       <artifactId>spring-test</artifactId>
       <version>3.1.1.RELEASE</version>
       <scope>test</scope>
      </dependency>
      <dependency>
                 <groupId>mysql</groupId>
                 <artifactId>mysql-connector-java</artifactId>
                 <version>5.1.21</version>
                 <scope>runtime</scope>
             </dependency>
      <dependency>
       <groupId>cglib</groupId>
       <artifactId>cglib-nodep</artifactId>
       <version>2.2.2</version>
      </dependency>


**Step#2:** You don't need to configure Database properties in mybatis-config.xml.

We can configure DataSource in Spring Container and use it to build MyBatis SqlSessionFactory.

Instead of SqlSessionFactoryBuilder, MyBatis-Spring uses org.mybatis.spring.SqlSessionFactoryBean to build SqlSessionFactory.

We can pass dataSource, Mapper XML files locations, typeAliases etc to SqlSessionFactoryBean.

    
    
     <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
      <property name="driverClassName" value="${jdbc.driverClassName}"/>
      <property name="url" value="${jdbc.url}"/>
      <property name="username" value="${jdbc.username}"/>
      <property name="password" value="${jdbc.password}"/>
     </bean>
     
     <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <property name="typeAliasesPackage" value="com.sivalabs.mybatisdemo.domain"/>
        <property name="mapperLocations" value="classpath*:com/sivalabs/mybatisdemo/mappers/**/*.xml" />
     </bean>



**Step#3:** Configure SqlSessionTemplate which provides ThreadSafe SqlSession object.

    
     <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
       <constructor-arg index="0" ref="sqlSessionFactory" />
     </bean>



**Step#4:** To be able to inject Mappers directly we should register org.mybatis.spring.mapper.MapperScannerConfigurer and configure the package name where to find Mapper Interfaces.

    
     <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
       <property name="basePackage" value="com.sivalabs.mybatisdemo.mappers" />
     </bean>



**Step#5:** Configure TransactionManager to support Annotation based Transaction support.

    
     
     <tx:annotation-driven transaction-manager="transactionManager"/>
     
     <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
     </bean>



**Step#6:** Update the Service classes and register them in Spring container.

    
    package com.sivalabs.mybatisdemo.service;
    
    import java.util.List;
    import org.apache.ibatis.session.SqlSession;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    
    import com.sivalabs.mybatisdemo.domain.User;
    import com.sivalabs.mybatisdemo.mappers.UserMapper;
    
    @Service
    @Transactional
    public class UserService
    {
     @Autowired
     private SqlSession sqlSession; //This is to demonstrate injecting SqlSession object
     
     public void insertUser(User user) 
     {
      UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
      userMapper.insertUser(user);
     }
    
     public User getUserById(Integer userId) 
     {
      UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
      return userMapper.getUserById(userId);
     }
     
    }
    




    
    
    package com.sivalabs.mybatisdemo.service;
    
    import java.util.List;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import com.sivalabs.mybatisdemo.domain.Blog;
    import com.sivalabs.mybatisdemo.mappers.BlogMapper;
    
    @Service
    @Transactional
    public class BlogService
    {
     @Autowired
     private BlogMapper blogMapper; // This is to demonstratee how to inject Mappers directly
     
     public void insertBlog(Blog blog) {
      blogMapper.insertBlog(blog);
     }
     
     public Blog getBlogById(Integer blogId) {
      return blogMapper.getBlogById(blogId);
     }
     
     public List<Blog> getAllBlogs() {
      return blogMapper.getAllBlogs();
     }
    }



**Note:** When we can directly inject Mappers then why do we need to inject SqlSession objects? Because SqlSession object contains more fine grained method which comes handy at times.

For Example: If we want to get count of how many records got updated by an Update query we can use SqlSession as follows:

    
    int updatedRowCount = sqlSession.update("com.sivalabs.mybatisdemo.mappers.UserMapper.updateUser", user);
    


So far I didn't find a way to get the row update count without using SqlSession object.

**PS: You can have your interface insert/update/delete methods returning int, then MyBatis returns the number of records updated as an integer.**

**Step#7** Write JUnit Tests to test UserService and BlogService.

    
    
    package com.sivalabs.mybatisdemo;
    
    import java.util.List;
    
    import org.junit.Assert;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.test.context.ContextConfiguration;
    import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
    
    import com.sivalabs.mybatisdemo.domain.User;
    import com.sivalabs.mybatisdemo.service.UserService;
    
    @RunWith(SpringJUnit4ClassRunner.class)
    @ContextConfiguration(locations="classpath:applicationContext.xml")
    public class SpringUserServiceTest 
    {
     @Autowired
     private UserService userService;
     
        @Test
     public void testGetUserById() 
     {
      User user = userService.getUserById(1);
      Assert.assertNotNull(user);
      System.out.println(user);
      System.out.println(user.getBlog());
     }
            
        @Test
        public void testUpdateUser() 
        {
         long timestamp = System.currentTimeMillis();
      User user = userService.getUserById(2);
      user.setFirstName("TestFirstName"+timestamp);
         user.setLastName("TestLastName"+timestamp);
         userService.updateUser(user);
      User updatedUser = userService.getUserById(2);
      Assert.assertEquals(user.getFirstName(), updatedUser.getFirstName());
      Assert.assertEquals(user.getLastName(), updatedUser.getLastName());
     }
        
    }
    




    
    
    package com.sivalabs.mybatisdemo;
    
    import java.util.Date;
    import java.util.List;
    
    import org.junit.Assert;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.test.context.ContextConfiguration;
    import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
    
    import com.sivalabs.mybatisdemo.domain.Blog;
    import com.sivalabs.mybatisdemo.domain.Post;
    import com.sivalabs.mybatisdemo.service.BlogService;
    
    
    @RunWith(SpringJUnit4ClassRunner.class)
    @ContextConfiguration(locations="classpath:applicationContext.xml")
    public class SpringBlogServiceTest 
    {
     @Autowired
     private BlogService blogService;
     
     @Test
     public void testGetBlogById() 
     {
      Blog blog = blogService.getBlogById(1);
      Assert.assertNotNull(blog);
      System.out.println(blog);
      List<Post> posts = blog.getPosts();
      for (Post post : posts) {
       System.out.println(post);
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
        
    }
    
