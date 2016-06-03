---
author: siva
comments: true
date: 2014-07-02 05:33:00+00:00
layout: post
slug: springboot-introducing-springboot
title: 'SpringBoot: Introducing SpringBoot'
wordpress_id: 218
categories:
- Java
- Spring
- SpringBoot
tags:
- Java
- Spring
- SpringBoot
---

SpringBoot...there is a lot of buzz about SpringBoot nowadays. So what is SpringBoot?


<blockquote>**SpringBoot is a new spring portfolio project which takes opinionated view of building production-ready Spring applications by drastically reducing the amount of configuration required. Spring Boot is taking the convention over configuration style to the next level by registering the default configurations automatically based on the classpath libraries available at runtime**.</blockquote>


Well.. you might have already read this kind of introduction to SpringBoot on many blogs. So let me elaborate on what SpringBoot is and how it helps developing Spring applications more quickly.

Spring framework was created by Rod Johnson when many of the Java developers are struggling with EJB 1.x/2.x for building enterprise applications. Spring framework makes developing the business components easy by using Dependency Injection and Aspect Oriented Programming concepts. Spring became very popular and many more Spring modules like SpringSecurity, Spring Batch, Spring Data etc become part of Spring portfolio. As more and more features added to Spring, configuring all the spring modules and their dependencies become a tedious task. Adding to that Spring provides atleast 3 ways of doing anything :-). Some people see it as flexibility and some others see it as confusing.

Slowly, configuring all the Spring modules to work together became a big challenge. Spring team came up with many approaches to reduce the amount of configuration needed by introducing Spring XML DSLs, Annotations and JavaConfig.

In the very beginning I remember configuring a big pile of jar version declarations in <properties> section and lot of <dependency> declarations. Then I learned creating maven archetypes with basic structure and minimum required configurations. This reduced lot of repetitive work, but not eliminated completely.


<blockquote>**Whether you write the configuration by hand or generate by some automated ways, if there is code that you can see then you have to maintain it.**</blockquote>


So whether you use XML or Annotations or JavaConfig, you still need to configure(copy-paste) the same infrastructure setup one more time.


<blockquote>**On the other hand, J2EE (which is dead long time ago) emerged as JavaEE and since JavaEE6 it became easy (compared to J2EE and JavaEE5) to develop enterprise applications using JavaEE platform. **</blockquote>




<blockquote>**Also JavaEE7 released with all the cool CDI, WebSockets, Batch, JSON support etc things became even more simple and powerful as well. With JavaEE you don't need so much XML configuration and your war file size will be in KBs (really??? for non-helloworld/non-stageshow apps also :-)). **</blockquote>




<blockquote>**Naturally this "convention over configuration" and "you no need to glue APIs together yourself, JavaEE appServer already did it" arguments became the main selling points for JavaEE over Spring. Then Spring team addresses this problem with SpringBoot :-). **</blockquote>




<blockquote>**Now its time to JavaEE to show whats the SpringBoot's counterpart in JavaEE land :-) JBoss Forge?? I love this Spring vs JavaEE thing which leads to the birth of powerful tools which ultimately simplify the developers life :-)**.</blockquote>


Many times we need similar kind of infrastructure setup using same libraries. For example, take a web application where you map DispatcherServlet url-pattern to "/", implement RESTFul webservices using Jackson JSON library with Spring Data JPA backend. Similarly there could be batch or spring integration applications which needs similar infrastructure configuration.

**_SpringBoot to the rescue_**. SpringBoot look at the jar files available to the runtime classpath and register the beans for you with sensible defaults which can be overridden with explicit settings. Also _SpringBoot configure those beans only when the jars files available and you haven't define any such type of bean_. Altogether SpringBoot provides common infrastructure without requiring any explicit configuration but lets the developer overrides if needed.

To make things more simpler, SpringBoot team provides many starter projects which are pre-configured with commonly used dependencies. For example Spring Data JPA starter project comes with JPA 2.x with Hibernate implementation along with Spring Data JPA infrastructure setup. Spring Web starter comes with Spring WebMVC, Embedded Tomcat, Jackson JSON, Logback setup.

**_Aaah..enough theory..lets jump onto coding._**

I am using latest STS-3.5.1 IDE which provides many more starter project options like Facebbok, Twitter, Solr etc than its earlier version.

Create a SpringBoot starter project by going to **File -> New -> Spring Starter Project** -> select **Web** and **Actuator **and provide the other required details and Finish.


This will create a Spring Starter Web project with the following **pom.xml** and **Application.java**




    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
     <modelVersion>4.0.0</modelVersion>
    
     <groupId>com.sivalabs</groupId>
     <artifactId>hello-springboot</artifactId>
     <version>1.0-SNAPSHOT</version>
        <packaging>jar</packaging>
    
     <name>hello-springboot</name>
     <description>Spring Boot Hello World</description>
    
     <parent>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-parent</artifactId>
      <version>1.1.3.RELEASE</version>
      <relativePath/>
     </parent>
    
     <dependencies>
      <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-actuator</artifactId>
      </dependency>
      <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
      </dependency>
      <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
      </dependency>  
     </dependencies>
    
     <properties>
      <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
      <start-class>com.sivalabs.springboot.Application</start-class>
      <java.version>1.7</java.version>
     </properties>
    
     <build>
      <plugins>
       <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
       </plugin>
      </plugins>
     </build>
    
    </project>
    




    
    
    package com.sivalabs.springboot;
    
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
    import org.springframework.context.annotation.ComponentScan;
    import org.springframework.context.annotation.Configuration;
    
    @Configuration
    @ComponentScan
    @EnableAutoConfiguration
    public class Application {
    
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    


Go ahead and run this class as a standalone Java class. It will start the embedded Tomcat server on 8080 port. But we haven't added any endpoints to access, lets go ahead and add a simple REST endpoint.


    
    
    @Configuration
    @ComponentScan
    @EnableAutoConfiguration
    @Controller
    public class Application {
    
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        } 
     
     @RequestMapping(value="/")
     @ResponseBody
     public String bootup()
     {
      return "SpringBoot is up and running";
     }
    }
    





Now point your browser to [http://localhost:8080/](http://localhost:8080/) and you should see the response "SpringBoot is up and running".





Remember while creating project we have added **Actuator **starter module also. With Actuator you can obtain many interesting facts about your application.







Try accessing the following URLs and you can see lot of runtime environment configurations that are provided by SpringBoot.







[http://localhost:8080/beans](http://localhost:8080/beans)




[http://localhost:8080/metrics](http://localhost:8080/metrics)




[http://localhost:8080/trace](http://localhost:8080/trace)




[http://localhost:8080/env](http://localhost:8080/env)




[http://localhost:8080/mappings](http://localhost:8080/mappings)




[http://localhost:8080/autoconfig](http://localhost:8080/autoconfig)




[http://localhost:8080/dump](http://localhost:8080/dump)







SpringBoot actuator deserves a dedicated blog post to cover its vast number of features, I will cover it in my upcoming posts.







I hope this article provides some basic introduction to SpringBoot and how it simplifies the Spring application development. **_More on SpringBoot in upcoming articles_**.
