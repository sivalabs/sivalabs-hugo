---
author: siva
comments: true
date: 2011-07-27 04:57:00+00:00
layout: post
slug: context-root-relative-urls-using-springs
title: 'Context root relative URLs using Spring''s '
wordpress_id: 266
categories:
- SpringMVC
tags:
- SpringMVC
---

While developing web applications the common problem is to reference the static resources like js, stylesheets,images in JSPs from the relative URLs.  
Suppose in your project you have the following structure.  
MyApp  
src  
WebContent  
home.jsp  
jsp  
createUser.jsp  
js  
util.js  
css  
style.css  
images  
logo.jpg  
WEB-INF  
...  
.......  
  
So here if your current URL is http://localhost:8080/MyApp/home.do, you need to reference static resources as follows:  
  

    
    <script type="text/javascript" src="js/util.js"/><br></br>

Suppose your current URL is http://localhost:8080/MyApp/jsp/createUser.do, you need to reference static resources as follows:  
  

    
    <script type="text/javascript" src="../js/util.js"/><br></br>

  
This becomes messy to reference the static resources like this.  
  
Spring framewrok is providing a custom tag <spring:url> to resolve this issue.  
<spring:url> tag resolves the path from context root. So you can always give the path for static resources from context root irrespective of current URL.  
  

    
    <%@taglib uri="http://www.springframework.org/tags" prefix="spring"%><br></br><script type="text/javascript" src='<spring:url value="/js/ajax.js" htmlEscape="true"/>'></script><br></br>

  
You can also pass the query parameters like this:  

    
    <s:url value="/messages/" var="messages_url" htmlEscape="true"><br></br><s:param name="name" value="siva"></s:param><br></br></s:url><br></br><a href="${messages_url}">Messages</a><br></br>

This results in <a href="/MyApp/messages/?name=siva">Messages</a>  
  
If you want to pass the param values as part of URI you can do like this:  

    
    <s:url value="/messages/{name}" var="messages_url" htmlEscape="true"><br></br><s:param name="name" value="siva"></s:param><br></br></s:url><br></br><a href="${messages_url}">Messages</a><br></br>

This results in <a href="/MyApp/messages/siva">Messages</a>  
  
This tag helped me a lot while developing web application following REST approach.
