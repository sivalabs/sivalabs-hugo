---
title: 'SpringBoot: Introducing SpringBoot'
author: Siva
type: post
date: 2014-07-02T00:03:00+00:00
url: /2014/07/springboot-introducing-springboot/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/07/springboot-introducing-springboot.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1731780949114076300
post_views_count:
  - 19
categories:
  - Spring
tags:
  - Java
  - Spring
  - SpringBoot

---
SpringBoot&#8230;there is a lot of buzz about SpringBoot nowadays. So what is SpringBoot?

> **SpringBoot is a new spring portfolio project which takes opinionated view of building production-ready Spring applications by drastically reducing the amount of configuration required. Spring Boot is taking the convention over configuration style to the next level by registering the default configurations automatically based on the classpath libraries available at runtime**.

Well.. you might have already read this kind of introduction to SpringBoot on many blogs. So let me elaborate on what SpringBoot is and how it helps developing Spring applications more quickly.

Spring framework was created by Rod Johnson when many of the Java developers are struggling with EJB 1.x/2.x for building enterprise applications. Spring framework makes developing the business components easy by using Dependency Injection and Aspect Oriented Programming concepts. Spring became very popular and many more Spring modules like SpringSecurity, Spring Batch, Spring Data etc become part of Spring portfolio. As more and more features added to Spring, configuring all the spring modules and their dependencies become a tedious task. Adding to that Spring provides atleast 3 ways of doing anything :-). Some people see it as flexibility and some others see it as confusing.

Slowly, configuring all the Spring modules to work together became a big challenge. Spring team came up with many approaches to reduce the amount of configuration needed by introducing Spring XML DSLs, Annotations and JavaConfig.

In the very beginning I remember configuring a big pile of jar version declarations in <properties> section and lot of <dependency> declarations. Then I learned creating maven archetypes with basic structure and minimum required configurations. This reduced lot of repetitive work, but not eliminated completely.

> **Whether you write the configuration by hand or generate by some automated ways, if there is code that you can see then you have to maintain it.**

So whether you use XML or Annotations or JavaConfig, you still need to configure(copy-paste) the same infrastructure setup one more time.

> **On the other hand, J2EE (which is dead long time ago) emerged as JavaEE and since JavaEE6 it became easy (compared to J2EE and JavaEE5) to develop enterprise applications using JavaEE platform. **

> **Also JavaEE7 released with all the cool CDI, WebSockets, Batch, JSON support etc things became even more simple and powerful as well. With JavaEE you don&#8217;t need so much XML configuration and your war file size will be in KBs (really??? for non-helloworld/non-stageshow apps also :-)). **

> **Naturally this &#8220;convention over configuration&#8221; and &#8220;you no need to glue APIs together yourself, JavaEE appServer already did it&#8221; arguments became the main selling points for JavaEE over Spring. Then Spring team addresses this problem with SpringBoot :-). **

> **Now its time to JavaEE to show whats the SpringBoot&#8217;s counterpart in JavaEE land 🙂 JBoss Forge?? I love this Spring vs JavaEE thing which leads to the birth of powerful tools which ultimately simplify the developers life 🙂**.

Many times we need similar kind of infrastructure setup using same libraries. For example, take a web application where you map DispatcherServlet url-pattern to &#8220;/&#8221;, implement RESTFul webservices using Jackson JSON library with Spring Data JPA backend. Similarly there could be batch or spring integration applications which needs similar infrastructure configuration.

**_SpringBoot to the rescue_**. SpringBoot look at the jar files available to the runtime classpath and register the beans for you with sensible defaults which can be overridden with explicit settings. Also _SpringBoot configure those beans only when the jars files available and you haven&#8217;t define any such type of bean_. Altogether SpringBoot provides common infrastructure without requiring any explicit configuration but lets the developer overrides if needed.

To make things more simpler, SpringBoot team provides many starter projects which are pre-configured with commonly used dependencies. For example Spring Data JPA starter project comes with JPA 2.x with Hibernate implementation along with Spring Data JPA infrastructure setup. Spring Web starter comes with Spring WebMVC, Embedded Tomcat, Jackson JSON, Logback setup.

**_Aaah..enough theory..lets jump onto coding._**

I am using latest STS-3.5.1 IDE which provides many more starter project options like Facebbok, Twitter, Solr etc than its earlier version.

Create a SpringBoot starter project by going to **File -> New -> Spring Starter Project** -> select **Web** and **Actuator **and provide the other required details and Finish.

This will create a Spring Starter Web project with the following **pom.xml** and **Application.java**

<div>
</div>

<pre class="brush: xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;
 &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;

 &lt;groupId&gt;com.sivalabs&lt;/groupId&gt;
 &lt;artifactId&gt;hello-springboot&lt;/artifactId&gt;
 &lt;version&gt;1.0-SNAPSHOT&lt;/version&gt;
    &lt;packaging&gt;jar&lt;/packaging&gt;

 &lt;name&gt;hello-springboot&lt;/name&gt;
 &lt;description&gt;Spring Boot Hello World&lt;/description&gt;

 &lt;parent&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-parent&lt;/artifactId&gt;
  &lt;version&gt;1.1.3.RELEASE&lt;/version&gt;
  &lt;relativePath/&gt;
 &lt;/parent&gt;

 &lt;dependencies&gt;
  &lt;dependency&gt;
   &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
   &lt;artifactId&gt;spring-boot-starter-actuator&lt;/artifactId&gt;
  &lt;/dependency&gt;
  &lt;dependency&gt;
   &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
   &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
  &lt;/dependency&gt;
  &lt;dependency&gt;
   &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
   &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;
   &lt;scope&gt;test&lt;/scope&gt;
  &lt;/dependency&gt;  
 &lt;/dependencies&gt;

 &lt;properties&gt;
  &lt;project.build.sourceEncoding&gt;UTF-8&lt;/project.build.sourceEncoding&gt;
  &lt;start-class&gt;com.sivalabs.springboot.Application&lt;/start-class&gt;
  &lt;java.version&gt;1.7&lt;/java.version&gt;
 &lt;/properties&gt;

 &lt;build&gt;
  &lt;plugins&gt;
   &lt;plugin&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;
   &lt;/plugin&gt;
  &lt;/plugins&gt;
 &lt;/build&gt;

&lt;/project&gt;
</pre>

<pre class="brush: java">package com.sivalabs.springboot;

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
</pre>

Go ahead and run this class as a standalone Java class. It will start the embedded Tomcat server on 8080 port. But we haven&#8217;t added any endpoints to access, lets go ahead and add a simple REST endpoint.

<pre class="brush: java">@Configuration
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
</pre>

<div>
</div>

Now point your browser to <http://localhost:8080/> and you should see the response &#8220;SpringBoot is up and running&#8221;.

<div>
</div>

<div>
  Remember while creating project we have added <b>Actuator </b>starter module also. With Actuator you can obtain many interesting facts about your application.
</div>

<div>
</div>

<div>
  Try accessing the following URLs and you can see lot of runtime environment configurations that are provided by SpringBoot.
</div>

<div>
</div>

<div>
  <a href="http://localhost:8080/beans">http://localhost:8080/beans</a>
</div>

<div>
  <a href="http://localhost:8080/metrics">http://localhost:8080/metrics</a>
</div>

<div>
  <a href="http://localhost:8080/trace">http://localhost:8080/trace</a>
</div>

<div>
  <a href="http://localhost:8080/env">http://localhost:8080/env</a>
</div>

<div>
  <a href="http://localhost:8080/mappings">http://localhost:8080/mappings</a>
</div>

<div>
  <a href="http://localhost:8080/autoconfig">http://localhost:8080/autoconfig</a>
</div>

<div>
  <a href="http://localhost:8080/dump">http://localhost:8080/dump</a>
</div>

<div>
</div>

<div>
  SpringBoot actuator deserves a dedicated blog post to cover its vast number of features, I will cover it in my upcoming posts.
</div>

<div>
</div>

<div>
  I hope this article provides some basic introduction to SpringBoot and how it simplifies the Spring application development. <b><i>More on SpringBoot in upcoming articles</i></b>.
</div>