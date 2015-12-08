---
author: siva
comments: true
date: 2011-12-04 02:53:00+00:00
layout: post
slug: solution-for-jdk6-jboss-510ga-jax-ws
title: 'Solution for JDK6 + JBoss-5.1.0GA + JAX-WS integration error: java.lang.UnsupportedOperationException:
  setProperty must be overridden by all subclasses of SOAPMessage'
wordpress_id: 252
categories:
- JBoss
tags:
- JBoss
---

1.  Copy the following jars from JBOSS_HOME/client to JBOSS_HOME/lib/endorsed dir.  
a.  jbossws-native-jaxrpc.jar  
b.  jbossws-native-jaxws.jar  
c.  jbossws-native-jaxws-ext.jar  
d.  jbossws-native-saaj.jar  
  
2.  Delete saaj-impl.jar(if its already there) from JBOSS_HOME/lib/endorsed dir.
