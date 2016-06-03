---
author: siva
comments: true
date: 2009-05-05 04:02:00+00:00
layout: post
slug: classnotfoundexception-org-hibernate-hql-ast-hqltoken-problem-with-hibernate3-and-weblogic-server10
title: 'ClassNotFoundException: org.hibernate.hql.ast.HqlToken Problem with Hibernate3
  and WebLogic Server10'
wordpress_id: 305
categories:
- Hibernate
tags:
- Hibernate
---

Hi,  
Recently i tried to develop an application using Spring and Hibernate. I deployed the application on Tomcat, JBoss servers and it is working fine.  
  
But when i tried to deploy it on WebLogic Server 10, i got into strange errors.  
When i execute session.find("from Account where id=?"), it is saying ClassNotFoundException: org.hibernate.hql.ast.HqlToken.  
  
When i googled for the solution i found the following :  
  
[this](http://forum.springsource.org/showthread.php?t=36860&highlight=HQLToken+classnotfound), [this](http://sachin-more.blogspot.com/2008/08/orghibernatequeryexception.html) and some more.  
  
But all are saying that WebLogic server is using some earlier version of ANTLR jar file causing this error.  
  
But when the Open Source Application servers like JBoss have taken care of these issues, why don't the commercial application server takes care of these kind of issues. Also I surprised when i know that this is a known issue with weblogic server from 8.x version and it is not yet fixed.
