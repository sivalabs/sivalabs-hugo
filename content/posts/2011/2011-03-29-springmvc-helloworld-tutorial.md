---
title: SpringMVC HelloWorld Tutorial
author: Siva
type: post
date: 2011-03-29T02:15:00+00:00
url: /2011/03/springmvc-helloworld-tutorial/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/03/springmvc-helloworld-tutorial.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2441733081027874947
post_views_count:
  - 2
categories:
  - Spring
tags:
  - Java
  - Spring
  - SpringMVC

---
Spring is a popular Application framework based on Inversion Of Control/DependencyInjection principle.  
SpringMVC is a framework following MVC architecture for building web applications. 

Let us see how to create simple Hello World application using SpringMVC.

Step1 :  
Copy the SpringMVC dependent libraries into WEB-INF/lib folder.  
You can download the latest Spring bundle at http://www.springsource.org/download

Step2:  
Configure the Spring&#8217;s FrontController class DispatcherServlet in web.xml.  
You can configure the other spring beans (if any) in XMLs and wireup using ContextLoaderListener as follows:

<pre>&lt;web-app> <br /> &lt;servlet><br />  &lt;servlet-name>dispatcher&lt;/servlet-name><br />  &lt;servlet->org.springframework.web.servlet.DispatcherServlet&lt;/servlet-class><br />  &lt;load-on-startup>1&lt;/load-on-startup><br /> &lt;/servlet><br /> &lt;servlet-mapping><br />  &lt;servlet-name>dispatcher&lt;/servlet-name><br />  &lt;url-pattern>*.htm&lt;/url-pattern><br /> &lt;/servlet-mapping><br /><br /> &lt;listener><br />  &lt;listener->org.springframework.web.context.ContextLoaderListener&lt;/listener-class><br /> &lt;/listener><br /> &lt;context-param><br />  

<param-name />
contextConfigLocation&lt;/param-name>

<param-value />
classpath:applicationContext.xml&lt;/param-value>&lt;/context-param>
<br />&lt;/web-app><br /></pre>

Step3:  
Create dispatcher-servlet.xml and put it in WEB-INF folder.

<pre>&lt;beans><br /><br /> &lt;context:annotation-config>&lt;/context:annotation-config><br /> &lt;context:component-scan base-package="com.sivalabs">&lt;/context:component-scan><br /> <br /> &lt;bean>&lt;/bean><br />    &lt;bean>&lt;/bean><br /> <br /> &lt;bean>  <br />  &lt;property name="viewClass" value="org.springframework.web.servlet.view.JstlView"><br />  &lt;property name="prefix" value="/WEB-INF/jsp/">&lt;/property><br />  &lt;property name="suffix" value=".jsp">&lt;/property><br /> &lt;/property><br /> <br />&lt;/bean><br />&lt;/beans></pre>

Step4:  
Create index.jsp as follows:

<pre>&lt;html&gt;<br /> &lt;head&gt;<br />  &lt;title&gt;SpringMVC - HelloWorld&lt;/title&gt;<br /> &lt;/head&gt;<br /> <br /> &lt;body&gt;<br />  Enter your Name : <br />   <br />   &lt;/body&gt;<br />&lt;/html&gt;<br /></pre>

Step5:  
Create a Controller which will handle the greetingController.htm request.

<pre>package com.sivalabs.springmvc.controllers;<br /><br />import javax.servlet.http.HttpServletRequest;<br />import javax.servlet.http.HttpServletResponse;<br /><br />import org.springframework.stereotype.Controller;<br />import org.springframework.web.bind.annotation.RequestMapping;<br />import org.springframework.web.servlet.ModelAndView;<br /><br />/**<br /> * @author SivaLabs<br /> *<br /> */<br />@Controller<br />public class GreetingController<br />{<br /> @RequestMapping("/greetingController")<br /> public ModelAndView greet(HttpServletRequest request, HttpServletResponse response)<br /> {<br />  ModelAndView mav = new ModelAndView("welcome");<br />  String username = request.getParameter("username");<br />  mav.getModel().put("LOGGEDIN_USERNAME", username);<br />  return mav;  <br /> }<br />}<br /></pre>

Step6:  
Create welcome.jsp to show the welcome message and put it in /WEB-INF/jsp folder.

<pre>&lt;html&gt;<br /> &lt;head&gt;<br />  &lt;title&gt;SpringMVC - HelloWorld&lt;/title&gt;<br /> &lt;/head&gt;<br /> <br /> &lt;body&gt;<br />  Welcome ${LOGGEDIN_USERNAME}<br /> &lt;/body&gt;<br />&lt;/html&gt;&nbsp;</pre>

<pre>&nbsp;</pre>

<pre>For source code download at </pre>

[SpringMVCHibernate.zip][1]

 [1]: https://sites.google.com/site/sivalabworks/sampleappdownloads/SpringMVCHibernate.zip?attredirects=0&d=1