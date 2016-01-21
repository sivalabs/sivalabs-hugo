---
author: siva
comments: true
date: 2012-06-06 17:19:00+00:00
layout: post
slug: resteasy-tutorial-part-2-spring-integration
title: 'RESTEasy Tutorial Part-2: Spring Integration'
wordpress_id: 239
categories:
- JBoss
- REST
- RESTEasy
- Spring
- WebServices
tags:
- JBoss
- REST
- RESTEasy
- Spring
- WebServices
---



RESTEasy Tutorial Series

[RESTEasy Tutorial Part-1: Basics](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-1-basics.html)

[RESTEasy Tutorial Part-2: Spring Integration](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-2-spring.html)

[RESTEasy Tutorial Part 3 - Exception Handling](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-3-exception.html)
RESTEasy provides support for Spring integration which enables us to expose Spring beans as RESTful WebServices.

**Step#1: Configure RESTEasy+Spring dependencies using Maven.**

[gist https://gist.github.com/sivaprasadreddy/2915901 /]

**Step#2: Configure RESTEasy+Spring in web.xml**


    
    
    <web-app xmlns="http://java.sun.com/xml/ns/javaee" version="3.0" xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemalocation="http://java.sun.com/xml/ns/javaee 
    		http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" id="WebApp_ID">
    		
       <listener>
        <listener-class>org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap</listener-class>
      </listener>
      <listener>
        <listener-class>org.jboss.resteasy.plugins.spring.SpringContextLoaderListener</listener-class>
      </listener>
      <servlet>
        <servlet-name>Resteasy</servlet-name>
        <servlet-class>org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher</servlet-class>
      </servlet>
      <servlet-mapping>
        <servlet-name>Resteasy</servlet-name>
        <url-pattern>/rest/*</url-pattern>
      </servlet-mapping>
      <context-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:applicationContext.xml</param-value>
      </context-param>
      <context-param>
        <param-name>resteasy.servlet.mapping.prefix</param-name>
        <param-value>/rest</param-value>
      </context-param>
    
      <context-param>
            <param-name>resteasy.scan</param-name>
            <param-value>false</param-value>
        </context-param>
    </web-app>
    



**Step#3: Create a Spring Service class UserService and update UserResource to use UserService bean.**

[gist https://gist.github.com/sivaprasadreddy/2915642 /]

**Step#4: Same JUnit TestCase to test the REST Webservice described in Part-1.**

[gist https://gist.github.com/sivaprasadreddy/2882422 /]






**Important Things to Keep in mind:**




1. org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap Listener should be registered before any other listener.







2. You should configure resteasy.servlet.mapping.prefix <context-param> if the HttpServletDispatcher servlet url-pattern is anything other than /*





3. While using Spring integration set **resteasy.scan** to **_false _**or don't configure **resteasy.scan** parameter at all.
Otherwise you may get REST Resource instances(UserResource) from RestEasy instead of Spring container. While running JUnit Tests I observed this random behavior.






4. You should register REST Resource as Spring bean by annotating with @Component or @Service.






