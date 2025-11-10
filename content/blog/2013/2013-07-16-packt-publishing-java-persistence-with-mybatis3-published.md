---
title: Packt Publishing “Java Persistence With MyBatis3” published
author: Siva
type: post
date: 2013-07-16T10:01:00.000Z
url: /blog/packt-publishing-java-persistence-with-mybatis3-published/
categories:
  - Books
tags:
  - MyBatis
aliases:
  - /packt-publishing-java-persistence-with-mybatis3-published/
---
Hurray… My first book, **Java Persistence with MyBatis3**, is published. I would like to thank Packt Publishers for giving me this opportunity to write about my favorite framework, MyBatis.

For most software applications, data persistence is a key and important aspect. In the Java world, we have many ways of implementing the persistence layer, starting from low-level JDBC to fancy ORM frameworks.
JDBC is too low-level an API and requires writing a lot of boilerplate code. On the other hand, we have full-fledged ORM frameworks like JPA (Hibernate, EclipseLink, etc.) which hide the complexity of working with SQL directly by letting developers work with objects and generate SQL based on the RDBMS (Dialect) being used. But each approach has its own set of pros and cons; there is no one-size-fits-all solution. Many large applications are using Hibernate successfully, and many other applications got screwed up by using Hibernate/JPA incorrectly. It is not a problem with JPA/Hibernate; it is simply because JPA/Hibernate may not be the best fit for those applications, or developers don't understand them properly.

**So what if I don't want to use a low-level JDBC API and can't go for full-fledged ORMs? MyBatis to the rescue.**

MyBatis is an SQL Mapper framework that simplifies data persistence logic by hiding all the low-level JDBC code and provides an easy-to-use API. Nothing more, nothing less... No magic… You need to write SQL by yourself. (Whenever I hear someone saying, "By using ORM frameworks, we don't need to know SQL; we can use HQL, and the ORM will take care of it," I just LOL.)

So what exactly does MyBatis offer you?
**1. Manage Resources:** Based on the provided configuration, MyBatis takes care of creating a Connection (pool), Statement/PreparedStatement/CallableStatement, and ResultSet, and closing them once the task is done.

**2. SQL Results <-> Java Beans:** For a SELECT statement, MyBatis will take care of looping through the ResultSet and populating Java Objects. For DML statements, we can pass Java Objects as inputs, and MyBatis will unwrap the data and put it in placeholders based on the provided mapping.

**3. Supports Mapping of One-To-Many/One-To-One mapping:** MyBatis supports mapping of an SQL ResultSet into a Java Object graph based on One-To-Many/One-To-One mapping.

**4. Caching Support:** Caching SQL results is a very common requirement for any non-trivial application. MyBatis provides in-built support for Caching. In addition to that, MyBatis provides support for popular cache libraries like EHCache, HazelCast, etc.

**5. Integration with other frameworks:** MyBatis is very lightweight and works well with popular IoC frameworks like Spring and Guice.

**6. Annotation-based Mappers:** For those XML haters, MyBatis also provides annotation-based mapping.

> **I feel that just as Gradle is the sweet spot between Ant and Maven, MyBatis is the sweet spot between JDBC and ORMs (JPA/Hibernate/EclipseLink).**

{{< figure src="/images/6801OScov.webp"  width="250" height="200" >}}

The **Java Persistence With MyBatis3** book covers:

**Chapter 1 – Getting Started with MyBatis:**
Introduces the MyBatis persistence framework and explains the advantages of using MyBatis instead of plain JDBC. We will also look at how to create a project, install MyBatis framework dependencies with and without the Maven build tool, and configure and use MyBatis.

**Chapter 2 – Bootstrapping MyBatis:**
Covers how to bootstrap MyBatis using XML and Java API-based configuration. We will also learn various MyBatis configuration options, such as type aliases, type handlers, global settings, and so on.

**Chapter 3 – SQL Mappers Using XML:**
This chapter goes in-depth into writing SQL-mapped statements using Mapper XML files. We will learn how to configure simple statements, statements with one-to-one and one-to-many relationships, and map results using ResultMaps. We will also learn how to build dynamic queries, paginated results, and custom ResultSet handling.

**Chapter 4 – SQL Mappers Using Annotations:**
This chapter covers writing SQL-mapped statements using annotations. We will learn how to configure simple statements and statements with one-to-one and one-to-many relationships. We will also look into building dynamic queries using SqlProvider annotations.

**Chapter 5 – Integration with Spring:**
This chapter covers how to integrate MyBatis with the Spring framework. We will learn how to install Spring libraries, register MyBatis beans in the Spring ApplicationContext, inject SqlSession and Mapper beans, and use Spring's annotation-based transaction handling mechanism with MyBatis.

Please let me know if anyone is interested in reviewing the book.
