---
author: siva
comments: true
date: 2011-06-23 08:27:00+00:00
layout: post
slug: how-to-post-and-get-json-between-extjs-and-springmvc3
title: How to POST and GET JSON between EXTJS and SpringMVC3
wordpress_id: 267
categories:
- ExtJS
- SpringMVC
tags:
- ExtJS
- SpringMVC
---

After one month of evaluation of the frameworks and tools, i choose ExtJS for UI and Spring/SpringMVC for business layer for my pet project.  
  
Again by using ExtJS we can send data to server by form submits or as request parameters or in json format through Ajax requests. ExtJS uses JSON format in many situations to hold data. So I thought using JSON as data exchange format between EXTJS and Spring will be consistent.  
  
The following code snippets explains how we can use ExtJS and SpringMVC3 to exchange data in JSON format.  
  
1. Register MappingJacksonHttpMessageConverter in dispatcher-servlet.xml  

    
    <bean class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter"><br></br>     <br></br>  <property name="messageConverters"><br></br>     <list><br></br>        <bean class="org.springframework.http.converter.json.MappingJacksonHttpMessageConverter"/><br></br>     </list><br></br>   </property>     <br></br> </bean><br></br>

  
Don't forget to copy jackson-json jar(s) to WEB-INF/lib  
  
2. Trigger the POST request from ExtJS script as follows:  

    
    Ext.Ajax.request({<br></br>  url : 'doSomething.htm',<br></br>  method: 'POST',<br></br>  headers: { 'Content-Type': 'application/json' },                     <br></br>  params : { "test" : "testParam" },<br></br>  jsonData: {<br></br>      "username" : "admin",<br></br>      "emailId" : "admin@sivalabs.com"<br></br>        },<br></br>  success: function (response) {<br></br>         var jsonResp = Ext.util.JSON.decode(response.responseText);<br></br>         Ext.Msg.alert("Info","UserName from Server : "+jsonResp.username);<br></br>       },<br></br>  failure: function (response) {<br></br>      var jsonResp = Ext.util.JSON.decode(response.responseText);<br></br>      Ext.Msg.alert("Error",jsonResp.error);<br></br>       }<br></br> });<br></br> 

  
3. Write a Spring Controller to handle the "/doSomething.htm" reguest.  
  

    
    @Controller<br></br>public class DataController<br></br>{<br></br> @RequestMapping(value = "/doSomething", method = RequestMethod.POST)<br></br> @ResponseBody<br></br> public User handle(@RequestBody User user) throws IOException <br></br> {<br></br>  System.out.println("Username From Client : "+user.getUsername());<br></br>  System.out.println("EmailId from Client : "+user.getEmailId());<br></br>  user.setUsername("SivaPrasadReddy");<br></br>  user.setEmailId("siva@sivalabs.com");  <br></br>  return user;<br></br> }<br></br>}<br></br>

  
Any other better approaches?
