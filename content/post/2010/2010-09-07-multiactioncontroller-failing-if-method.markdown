---
author: siva
comments: true
date: 2010-09-07 11:28:00+00:00
layout: post
slug: multiactioncontroller-failing-if-method
title: MultiActionController failing if the method name is "get"
wordpress_id: 292
categories:
- Spring
tags:
- Spring
---

I wrote a MultiActionController containing 3 method names "list", "get", "save".  
When i call the "get" method even though i am getting the desired results, in console the following stacktrace is printing.  
  
at java.lang.reflect.Method.invoke(Unknown Source)  
at org.springframework.web.servlet.mvc.multiaction.MultiActionController.getLastModified(MultiActionController.java:377)  
Caused by: java.lang.StackOverflowError  
  
I observed that when i rename the method to "getEntry" (anything other than "get") i am not getting any exception.  
  
For root cause visit: [Click](http://forum.springsource.org/showthread.php?p=318031&posted=1#post318031)
