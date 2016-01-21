---
author: siva
comments: true
date: 2013-07-16 15:31:00+00:00
layout: post
slug: packt-publishing-java-persistence-with-mybatis3-published
title: Packt Publishing "Java Persistence With MyBatis3" published
wordpress_id: 226
categories:
- MyBatis
tags:
- MyBatis
---

Hurray...My first book "**Java Persistence with MyBatis3**" is published. I would like to thank Packt Publishers for giving me this opportunity to write on my favorite framework MyBatis.  
  
For most of the software applications data persistence is a key and important aspect. In Java land we have many ways of implementing persistence layer starting from low level JDBC to fancy ORM frameworks.  
JDBC is too low level API and needs to write a lot of boilerplate code. On the other hand we have full fledged ORM frameworks like JPA(Hibernate, EclipseLink etc) which hides the complexity of working with SQL directly by letting developers work with Objects and generate SQL based on the RDBMS(Dialect) being used. But each approach has its own set of pros and cons, there is no one size fits all solutions. There are many large applications that are using Hibernate successfully and there are many other applications which got screwed up by using Hibernate/JPA incorrectly. It is not the problem with JPA/Hibernate, it is simply because JPA/Hibernate may not be best fit for those applications or developers don't understood them properly.  
  
**_So what if I don't want to use low level JDBC API and can't go for full fledged ORMs? MyBatis to the rescue._**  
  
MyBatis is a SQL Mapper framework which simplify data persistence logic by hiding all the low level JDBC code and provides easy to use API. Nothing more, nothing less..No magic... You need to write SQL by yourself.(Whenever I hear someone saying "By using ORM frameworks we don't need to know SQL, we can use HQL and ORM will take care of it", I just LOL)  
  
So what exactly MyBatis offers you?  
**1. Manage Resources:** Based on the provided configuration, MyBatis takes care of creating Connection(pool), Statement/PreparedStatement/CallableStatement, ResultSet and closing them once the task is done.  
  
**2. SQL Results <-> Java Beans:** For SELECT statement MyBatis will take care of looping through ResultSet and populating Java Objects. For DML statements we can pass Java Objects as inputs and MyBatis will unwrap the data and put in placeholders based on provided mapping.  
  
**3. Supports Mapping of One-To-Many/One-To-One mapping:** MyBatis supports mapping of SQL ResultSet into Java Object graph based on One-To-Many/One-To-One mapping.  
  
**4. Caching Support:** Caching SQL results is very common requirement for any non trivial applications. MyBatis provides in-built support for Caching. In addition to that MyBatis provides support for popular cache libraries like EHCache, HazelCast etc.  
  
**5. Integration with other frameworks:** MyBatis is very lightweight and works well with popular IOC frameworks like Spring, Guice.  
  
**6. Annotation based Mappers:** For those XML haters, MyBatis provides Annotation based mapping also.  
  


<blockquote>**I feel like as Gradle is sweet spot in between Ant and Maven, MyBatis is sweetspot between JDBC and ORMs(JPA/Hibernate/EclipseLink).**</blockquote>

  


[![](http://3.bp.blogspot.com/-RSbCcKxZOrs/UeVeVBS3OMI/AAAAAAAAAxw/61v9fORNoO4/s320/MyBatis.jpg)](http://3.bp.blogspot.com/-RSbCcKxZOrs/UeVeVBS3OMI/AAAAAAAAAxw/61v9fORNoO4/s1600/MyBatis.jpg)

  
[http://www.packtpub.com/java-persistence-with-mybatis-3/book](http://www.packtpub.com/java-persistence-with-mybatis-3/book)  
  
**Java Persistence With MyBatis3** book covers:  
  
**Chapter 1 - Getting Started with MyBatis:**  
Introduces MyBatis persistence framework and explains the advantages of using MyBatis instead of plain JDBC. We will also look at how to create a project, install MyBatis framework dependencies with and without the Maven build tool, configure, and use MyBatis.  
  
**Chapter 2 - Bootstrapping MyBatis:**  
Covers how to bootstrap MyBatis using XML and Java API-based configuration. We will also learn various MyBatis configuration options such as type aliases, type handlers, global settings, and so on.  
  
**Chapter 3 - SQL Mappers Using XML: **  
This chapter goes in-depth into writing SQL mapped statements using the Mapper XML files. We will learn how to configure simple statements, statements with one-to-one, one-to-many relationships and mapping results using ResultMaps. We will also learn how to build dynamic queries, paginated results, and custom ResultSet handling.  
  
**Chapter 4 - SQL Mappers Using Annotations:**  
This chapter covers writing SQL mapped statements using annotations. We will learn how to configure simple statements, statements with one-to-one and one-to-many relationships. We will also look into building dynamic queries using SqlProvider annotations.  
  
**Chapter 5 - Integration with Spring:**  
This chapter covers how to integrate MyBatis with Spring framework. We will learn how to install Spring libraries, register MyBatis beans in Spring ApplicationContext, inject SqlSession and Mapper beans, and use Spring's annotation-based transaction handling mechanism with MyBatis.  
  
If anybody is interested in reviewing the book, please let me know.  


  

