---
title: SpringMVC 3 + Tiles 2.2.2 Integration
author: Siva
type: post
date: 2011-06-06T02:23:00+00:00
url: /2011/06/springmvc-3-tiles-222-integration/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/06/springmvc-3-tiles-222-integration.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/6686275686763556882
post_views_count:
  - 19
categories:
  - Spring
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

<pre>&lt;beans><br /><br /> &lt;bean><br />   &lt;property name="definitions"><br />     &lt;list><br />       &lt;value>/WEB-INF/tiles.xml&lt;/value><br />     &lt;/list><br />   &lt;/property><br /> &lt;/bean><br /><br /> &lt;bean><br />   &lt;property name="viewClass" value="org.springframework.web.servlet.view.tiles2.TilesView"/&gt;<br /> &lt;/bean> <br /><br />&lt;/beans><br /></pre>

**Step#3: Configure tiles definitions in WEB-INF/tiles.xml**

<pre><br />&lt;tiles-definitions><br /><br /> &lt;definition name="baseLayout" template="/jsp/layout/layout.jsp"><br />  &lt;put-attribute name="title" value="SivaLabs" /&gt;<br />  &lt;put-attribute name="header" value="/jsp/layout/header.jsp" /&gt;<br />  &lt;put-attribute name="navigation" value="/jsp/layout/navigation.jsp" /&gt;<br />  &lt;put-attribute name="body" value="" /&gt;<br />  &lt;put-attribute name="footer" value="/jsp/layout/footer.jsp" /&gt;<br /> &lt;/definition><br /> <br /> &lt;definition extends="baseLayout" name="login"><br />  &lt;put-attribute name="title" value="SivaLabs : Login" /&gt;<br />  &lt;put-attribute name="navigation" value="" /&gt;<br />  &lt;put-attribute name="body" value="/jsp/login.jsp" /&gt;<br /> &lt;/definition><br />  <br /> &lt;definition extends="baseLayout" name="welcome"><br />  &lt;put-attribute name="title" value="SivaLabs : Welcome" /&gt;<br />  &lt;put-attribute name="body" value="/jsp/welcome.jsp" /&gt;<br /> &lt;/definition><br />  <br />&lt;/tiles-definitions><br /></pre>

**Step#4: Code the layout JSPs**

**layout.jsp**

<pre>&lt;%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles"%&gt;<br />&lt;html&gt;<br />&lt;head&gt;<br />&lt;title&gt;&lt;tiles:insertAttribute name="title" ignore="true" /&gt;&lt;/title&gt;<br /><br />&lt;/head&gt;<br />&lt;body&gt;<br /><br />

<table  class=" table table-hover" align="center" border="1" cellpadding="2" cellspacing="2" style="border-collapse: collapse; width: 800px;">
  <br />
  
  <tr>
    <br />        
    
    <td colspan="2" height="30">
      &lt;tiles:insertAttribute name="header" /&gt;
    </td>
    
    <br />    
  </tr>
  
  <br />
  
  <tr>
    <br />        
    
    <td height="450" valign="top" width="150">
      <br /><br />&lt;tiles:insertAttribute name="navigation" /&gt;
    </td>
    
    <br />        
    
    <td valign="top" width="650">
      <br /><br />&lt;tiles:insertAttribute name="body" /&gt;
    </td>
    
    <br />    
  </tr>
  
  <br />
  
  <tr>
    <br />        
    
    <td colspan="2" height="30">
      <br /><br />&lt;tiles:insertAttribute name="footer" /&gt;
    </td>
    
    <br />    
  </tr>
  
  <br />
</table>

<br />&lt;/body&gt;<br />&lt;/html&gt;<br /></pre>

**header.jsp**

<pre><h2>
  <br />SivaLabs : My Experiments On Technology
</h2>

<br /></pre>

**footer.jsp**

<pre><center>
  <br /> <b>© 2011 SivaLabs All Rights Reserved</b><br />
</center>

<br /></pre>

**navigation.jsp**

<pre><a href="http://www.blogger.com/createUser.do">Create User</a><br /><br /><a href="http://www.blogger.com/listUsers.do">View Users</a><br /><br /><a href="http://www.blogger.com/logout.do">Logout</a></pre>

**welcome.jsp**

<pre><h2>
  <br />Welcome to SpringMVC+Tiles Sample Application 
</h2>

<br /></pre>

**Step#5: **

**WelcomeController.java**

<pre>package com.sivalabs.web.controllers;<br /><br />import org.springframework.stereotype.Controller;<br />import org.springframework.web.bind.annotation.RequestMapping;<br /><br />@Controller<br />public class WelcomeController<br />{<br /> @RequestMapping("welcome")<br /> public String welcome()<br /> {<br />  return "welcome";<br /> }<br />}<br /></pre>

Here the String &#8220;welcome&#8221; will be resolved as a tile name and display the UI as per &#8220;welcome&#8221; tile configuration.

You can download the code from&nbsp;<https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-tiles>