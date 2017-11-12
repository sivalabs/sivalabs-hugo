---
title: Context root relative URLs using Spring’s
author: Siva
type: post
date: 2011-07-26T23:27:00+00:00
url: /2011/07/context-root-relative-urls-using-springs/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/07/context-root-relative-urls-using.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/7736428821302819303
post_views_count:
  - 24
categories:
  - Spring
tags:
  - SpringMVC

---
While developing web applications the common problem is to reference the static resources like js, stylesheets,images in JSPs from the relative URLs.  
Suppose in your project you have the following structure.  
MyApp  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; src  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; WebContent  
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; home.jsp  
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; jsp  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; createUser.jsp  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; util.js  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; css  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; style.css  
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; images  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; logo.jpg  
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; WEB-INF  
&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &#8230;  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &#8230;&#8230;.

So here if your current URL is http://localhost:8080/MyApp/home.do, you need to reference static resources as follows:

<pre>&lt;script type="text/javascript" src="js/util.js"/&gt;<br /></pre>

Suppose your current URL is http://localhost:8080/MyApp/jsp/createUser.do, you need to reference static resources as follows:

<pre>&lt;script type="text/javascript" src="../js/util.js"/&gt;<br /></pre>

This becomes messy to reference the static resources like this.

Spring framewrok is providing a custom tag <spring:url> to resolve this issue.  
<spring:url> tag resolves the path from context root. So you can always give the path for static resources from context root irrespective of current URL.

<pre>&lt;%@taglib uri="http://www.springframework.org/tags" prefix="spring"%&gt;<br />&lt;script type="text/javascript" src='&lt;spring:url value="/js/ajax.js" htmlEscape="true"/&gt;'&gt;&lt;/script&gt;<br /></pre>

You can also pass the query parameters like this:

<pre>&lt;s:url value="/messages/" var="messages_url" htmlEscape="true"&gt;<br />&lt;s:param name="name" value="siva"&gt;&lt;/s:param&gt;<br />&lt;/s:url&gt;<br />&lt;a href="${messages_url}"&gt;Messages&lt;/a&gt;<br /></pre>

This results in <a href=&#8221;/MyApp/messages/?name=siva&#8221;>Messages</a>

If you want to pass the param values as part of URI you can do like this:

<pre>&lt;s:url value="/messages/{name}" var="messages_url" htmlEscape="true"&gt;<br />&lt;s:param name="name" value="siva"&gt;&lt;/s:param&gt;<br />&lt;/s:url&gt;<br />&lt;a href="${messages_url}"&gt;Messages&lt;/a&gt;<br /></pre>

This results in <a href=&#8221;/MyApp/messages/siva&#8221;>Messages</a>

This tag helped me a lot while developing web application following REST approach.