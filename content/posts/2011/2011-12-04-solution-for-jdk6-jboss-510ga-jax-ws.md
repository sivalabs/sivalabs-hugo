---
title: 'Solution for JDK6 + JBoss-5.1.0GA + JAX-WS integration error: java.lang.UnsupportedOperationException: setProperty must be overridden by all subclasses of SOAPMessage'
author: Siva
type: post
date: 2011-12-03T21:23:00+00:00
url: /2011/12/solution-for-jdk6-jboss-510ga-jax-ws/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/12/solution-for-jdk6-jboss-510ga-jax-ws.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/713664766679427166
post_views_count:
  - 5
categories:
  - JavaEE
tags:
  - JBoss

---
1. &nbsp; &nbsp; Copy the following jars from JBOSS\_HOME/client to JBOSS\_HOME/lib/endorsed dir.  
&nbsp; &nbsp; &nbsp; &nbsp; a. &nbsp; &nbsp; jbossws-native-jaxrpc.jar  
&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;b. &nbsp; &nbsp; jbossws-native-jaxws.jar  
&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;c. &nbsp; &nbsp; jbossws-native-jaxws-ext.jar  
&nbsp;&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;d. &nbsp; &nbsp; jbossws-native-saaj.jar

2. &nbsp; &nbsp; Delete saaj-impl.jar(if its already there) from JBOSS_HOME/lib/endorsed dir.