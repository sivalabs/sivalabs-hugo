---
author: siva
comments: true
date: 2011-03-29 07:45:00+00:00
layout: post
slug: springmvc-helloworld-tutorial
title: SpringMVC HelloWorld Tutorial
wordpress_id: 276
categories:
- Java
- Spring
- SpringMVC
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
Configure the Spring's FrontController class DispatcherServlet in web.xml.  
You can configure the other spring beans (if any) in XMLs and wireup using ContextLoaderListener as follows:  

    
    <web-app> <br></br> <servlet><br></br>  <servlet-name>dispatcher</servlet-name><br></br>  <servlet->org.springframework.web.servlet.DispatcherServlet</servlet-class><br></br>  <load-on-startup>1</load-on-startup><br></br> </servlet><br></br> <servlet-mapping><br></br>  <servlet-name>dispatcher</servlet-name><br></br>  <url-pattern>*.htm</url-pattern><br></br> </servlet-mapping><br></br><br></br> <listener><br></br>  <listener->org.springframework.web.context.ContextLoaderListener</listener-class><br></br> </listener><br></br> <context-param><br></br>  <param-name>contextConfigLocation</param-name><param-value>classpath:applicationContext.xml</param-value></context-param><br></br></web-app><br></br>

  
Step3:  
Create dispatcher-servlet.xml and put it in WEB-INF folder.  

    
    <beans><br></br><br></br> <context:annotation-config></context:annotation-config><br></br> <context:component-scan base-package="com.sivalabs"></context:component-scan><br></br> <br></br> <bean></bean><br></br>    <bean></bean><br></br> <br></br> <bean>  <br></br>  <property name="viewClass" value="org.springframework.web.servlet.view.JstlView"><br></br>  <property name="prefix" value="/WEB-INF/jsp/"></property><br></br>  <property name="suffix" value=".jsp"></property><br></br> </property><br></br> <br></br></bean><br></br></beans>

  
Step4:  
Create index.jsp as follows:  

    
    <html><br></br> <head><br></br>  <title>SpringMVC - HelloWorld</title><br></br> </head><br></br> <br></br> <body><br></br>  Enter your Name : <br></br>   <br></br>   </body><br></br></html><br></br>

Step5:  
Create a Controller which will handle the greetingController.htm request.  
  

    
    package com.sivalabs.springmvc.controllers;<br></br><br></br>import javax.servlet.http.HttpServletRequest;<br></br>import javax.servlet.http.HttpServletResponse;<br></br><br></br>import org.springframework.stereotype.Controller;<br></br>import org.springframework.web.bind.annotation.RequestMapping;<br></br>import org.springframework.web.servlet.ModelAndView;<br></br><br></br>/**<br></br> * @author SivaLabs<br></br> *<br></br> */<br></br>@Controller<br></br>public class GreetingController<br></br>{<br></br> @RequestMapping("/greetingController")<br></br> public ModelAndView greet(HttpServletRequest request, HttpServletResponse response)<br></br> {<br></br>  ModelAndView mav = new ModelAndView("welcome");<br></br>  String username = request.getParameter("username");<br></br>  mav.getModel().put("LOGGEDIN_USERNAME", username);<br></br>  return mav;  <br></br> }<br></br>}<br></br>

  
Step6:  
Create welcome.jsp to show the welcome message and put it in /WEB-INF/jsp folder.  

    
    <html><br></br> <head><br></br>  <title>SpringMVC - HelloWorld</title><br></br> </head><br></br> <br></br> <body><br></br>  Welcome ${LOGGEDIN_USERNAME}<br></br> </body><br></br></html> 
    
     
    
    For source code download at 

[SpringMVCHibernate.zip](https://sites.google.com/site/sivalabworks/sampleappdownloads/SpringMVCHibernate.zip?attredirects=0&d=1)
