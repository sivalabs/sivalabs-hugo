---
title: Solution for “Eclipse is running in a JRE, but a JDK is required” problem
author: Siva
type: post
date: 2011-02-21T06:44:00+00:00
url: /2011/02/solution-for-eclipse-is-running-in-jre/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/02/solution-for-eclipse-is-running-in-jre.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/3909006486185628411
post_views_count:
  - 1
categories:
  - IDE
tags:
  - IDE
  - Maven

---
Hi,
  
When i installed Maven2 Plugin for eclipse i was getting the below error message when i startup my Eclipse IDE.
  
After that when I tried to perform Maven operations thrugh Eclipse I got some errors saying &#8220;&#8230;/tools.jar&#8221; is not there.

I did the below things to get rid of that problem.

open the eclipse.ini file and add the below argument.
  
-vm
  
C:/Siva/Java/jdk1.6.0_04/bin/javaw.exe

Note: The VM configuration should be in two lines and in between &#8211;lancher and -vmargs.
  
&#8211;launcher.XXMaxPermSize
  
256m
  
-vm
  
C:/Siva/Java/jdk1.6.0_04/bin/javaw.exe
  
-vmargs
  
-Dosgi.requiredJavaVersion=1.5
  
-Xms40m
  
-Xmx512m