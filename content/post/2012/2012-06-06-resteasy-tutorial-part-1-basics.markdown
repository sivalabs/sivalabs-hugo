---
author: siva
comments: true
date: 2012-06-06 15:37:00+00:00
layout: post
slug: resteasy-tutorial-part-1-basics
title: 'RESTEasy Tutorial Part-1: Basics'
wordpress_id: 240
categories:
- JBoss
- Maven
- REST
- RESTEasy
- WebServices
tags:
- JBoss
- Maven
- REST
- RESTEasy
- WebServices
---



RESTEasy Tutorial Series

[RESTEasy Tutorial Part-1: Basics](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-1-basics.html)

[RESTEasy Tutorial Part-2: Spring Integration](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-2-spring.html)

[RESTEasy Tutorial Part 3 - Exception Handling](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-3-exception.html)
RESTEasy is a JAX-RS implementation from JBoss/RedHat and is in-built in JBoss 6 onwards.
Here I am going to show you how to develop a Simple RESTful Web Services application using RESTEasy and JBossAS7.1.1.FINAL.

**Step#1: Configure RESTEasy dependencies using Maven.**

[gist https://gist.github.com/sivaprasadreddy/2882384 /]

**Step#2: Configure RESTEasy in web.xml**

[gist https://gist.github.com/sivaprasadreddy/2882393 /]

**Step#3: Create User domain class, MockUserTable class to store User objects in-memory for testing purpose and UserResource class to expose CRUD operations on User as RESTful webservices.**

[gist https://gist.github.com/sivaprasadreddy/2882408 /]

**Step#6: JUnit TestCase to test the REST Webservice.**

[gist https://gist.github.com/sivaprasadreddy/2882422 /]

**Step#7: To test the REST service we can use the REST Client Tool. **
You can download REST Client Tool at http://code.google.com/a/eclipselabs.org/p/restclient-tool/


**Important Things to Keep in mind:**
1. org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap Listener should be registered before any other listener.

2. You should configure **resteasy.servlet.mapping.prefix** <context-param> if the HttpServletDispatcher servlet url-pattern is anything other than **/***
**
**
3. Keep visiting my blog :-)
