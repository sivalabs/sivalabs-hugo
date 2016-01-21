---
author: siva
comments: true
date: 2011-06-06 07:53:00+00:00
layout: post
slug: springmvc-3-tiles-222-integration
title: SpringMVC 3 + Tiles 2.2.2 Integration
wordpress_id: 270
categories:
- SpringMVC
tags:
- SpringMVC
---

Apache Tiles is a popular and mostly used templating framework for java based web application.   
Tiles became more popular because Struts 1.x uses Tiles as its default templating framework.  
SpringMVC which is an MVC framework, like Struts, also supports integration of Tiles as its templating framework.  
  
Let us see how we can integrate SpringMVC and Tiles.  
  
You can download Tiles binaries from http://tiles.apache.org/ .  
  
**Step#1: Add the following tiles jars to WEB-INF/lib folder.**  
  
tiles-api-2.2.2.jar  
tiles-core-2.2.2.jar  
tiles-jsp-2.2.2.jar  
tiles-servlet-2.2.2.jar  
tiles-template-2.2.2.jar  
  
  
**Step#2: Configure tiles integration in WEB-INF/dispatcher-servlet.xml**  
  

    
    <beans><br></br><br></br> <bean><br></br>   <property name="definitions"><br></br>     <list><br></br>       <value>/WEB-INF/tiles.xml</value><br></br>     </list><br></br>   </property><br></br> </bean><br></br><br></br> <bean><br></br>   <property name="viewClass" value="org.springframework.web.servlet.view.tiles2.TilesView"/><br></br> </bean> <br></br><br></br></beans><br></br>

  
  
**Step#3: Configure tiles definitions in WEB-INF/tiles.xml**  
  

    
     <br></br><tiles-definitions><br></br><br></br> <definition name="baseLayout" template="/jsp/layout/layout.jsp"><br></br>  <put-attribute name="title" value="SivaLabs" /><br></br>  <put-attribute name="header" value="/jsp/layout/header.jsp" /><br></br>  <put-attribute name="navigation" value="/jsp/layout/navigation.jsp" /><br></br>  <put-attribute name="body" value="" /><br></br>  <put-attribute name="footer" value="/jsp/layout/footer.jsp" /><br></br> </definition><br></br> <br></br> <definition extends="baseLayout" name="login"><br></br>  <put-attribute name="title" value="SivaLabs : Login" /><br></br>  <put-attribute name="navigation" value="" /><br></br>  <put-attribute name="body" value="/jsp/login.jsp" /><br></br> </definition><br></br>  <br></br> <definition extends="baseLayout" name="welcome"><br></br>  <put-attribute name="title" value="SivaLabs : Welcome" /><br></br>  <put-attribute name="body" value="/jsp/welcome.jsp" /><br></br> </definition><br></br>  <br></br></tiles-definitions><br></br>

  
**Step#4: Code the layout JSPs**  
  
**layout.jsp**  
  

    
    <%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%><br></br><html><br></br><head><br></br><title><tiles:insertAttribute name="title" ignore="true" /></title><br></br><br></br></head><br></br><body><br></br><br></br><table cellpadding="2" cellspacing="2" align="center" border="1" style="border-collapse: collapse; width: 800px;">    <tbody><br></br><tr><br></br>        <td colspan="2" height="30"><tiles:insertAttribute name="header" /></td><br></br>    </tr><br></br><tr><br></br>        <td width="150" valign="top" height="450"><br></br><br></br><tiles:insertAttribute name="navigation" /></td><br></br>        <td width="650" valign="top"><br></br><br></br><tiles:insertAttribute name="body" /></td><br></br>    </tr><br></br><tr><br></br>        <td colspan="2" height="30"><br></br><br></br><tiles:insertAttribute name="footer" /></td><br></br>    </tr><br></br></tbody></table><br></br></body><br></br></html><br></br>

  
**header.jsp**  
  

    
    <h2><br></br>SivaLabs : My Experiments On Technology</h2><br></br>

  
  
**footer.jsp**  
  

    
    <center><br></br> <b>© 2011 SivaLabs All Rights Reserved</b><br></br></center><br></br>

  
**navigation.jsp**  
  

    
    <a href="http://www.blogger.com/createUser.do">Create User</a><br></br><br></br><a href="http://www.blogger.com/listUsers.do">View Users</a><br></br><br></br><a href="http://www.blogger.com/logout.do">Logout</a>

  
**welcome.jsp**  
  

    
    <h2><br></br>Welcome to SpringMVC+Tiles Sample Application </h2><br></br>

  
  
**Step#5: **  
  
**WelcomeController.java**  
  

    
    package com.sivalabs.web.controllers;<br></br><br></br>import org.springframework.stereotype.Controller;<br></br>import org.springframework.web.bind.annotation.RequestMapping;<br></br><br></br>@Controller<br></br>public class WelcomeController<br></br>{<br></br> @RequestMapping("welcome")<br></br> public String welcome()<br></br> {<br></br>  return "welcome";<br></br> }<br></br>}<br></br>

  
Here the String "welcome" will be resolved as a tile name and display the UI as per "welcome" tile configuration.  
  
You can download the code from [https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-tiles](https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-tiles)
