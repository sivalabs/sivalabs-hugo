---
title: How to POST and GET JSON between EXTJS and SpringMVC3
author: Siva
type: post
date: 2011-06-23T02:57:00+00:00
url: /2011/06/how-to-post-and-get-json-between-extjs-and-springmvc3/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/06/how-to-post-and-get-json-between-extjs.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/4733516409774737199
post_views_count:
  - 51
categories:
  - JavaScript
tags:
  - ExtJS
  - SpringMVC

---
After one month of evaluation of the frameworks and tools, i choose ExtJS for UI and Spring/SpringMVC for business layer for my pet project.

Again by using ExtJS we can send data to server by form submits or as request parameters or in json format through Ajax requests. ExtJS uses JSON format in many situations to hold data. So I thought using JSON as data exchange format between EXTJS and Spring will be consistent.

The following code snippets explains how we can use ExtJS and SpringMVC3 to exchange data in JSON format.

1. Register MappingJacksonHttpMessageConverter in dispatcher-servlet.xml

<pre>&lt;bean class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter"><br />     <br />  &lt;property name="messageConverters"&gt;<br />     &lt;list&gt;<br />        &lt;bean class="org.springframework.http.converter.json.MappingJacksonHttpMessageConverter"/&gt;<br />     &lt;/list&gt;<br />   &lt;/property&gt;     <br /> &lt;/bean&gt;<br /></pre>

Don&#8217;t forget to copy jackson-json jar(s) to WEB-INF/lib

2. Trigger the POST request from ExtJS script as follows:

<pre>Ext.Ajax.request({<br />  url : 'doSomething.htm',<br />  method: 'POST',<br />  headers: { 'Content-Type': 'application/json' },                     <br />  params : { "test" : "testParam" },<br />  jsonData: {<br />      "username" : "admin",<br />      "emailId" : "admin@sivalabs.com"<br />        },<br />  success: function (response) {<br />         var jsonResp = Ext.util.JSON.decode(response.responseText);<br />         Ext.Msg.alert("Info","UserName from Server : "+jsonResp.username);<br />       },<br />  failure: function (response) {<br />      var jsonResp = Ext.util.JSON.decode(response.responseText);<br />      Ext.Msg.alert("Error",jsonResp.error);<br />       }<br /> });<br /> </pre>

3. Write a Spring Controller to handle the &#8220;/doSomething.htm&#8221; reguest.

<pre>@Controller<br />public class DataController<br />{<br /> @RequestMapping(value = "/doSomething", method = RequestMethod.POST)<br /> @ResponseBody<br /> public User handle(@RequestBody User user) throws IOException <br /> {<br />  System.out.println("Username From Client : "+user.getUsername());<br />  System.out.println("EmailId from Client : "+user.getEmailId());<br />  user.setUsername("SivaPrasadReddy");<br />  user.setEmailId("siva@sivalabs.com");  <br />  return user;<br /> }<br />}<br /></pre>

Any other better approaches?