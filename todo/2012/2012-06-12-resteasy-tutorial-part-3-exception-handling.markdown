---
author: siva
comments: true
date: 2012-06-12 10:54:00+00:00
layout: post
slug: resteasy-tutorial-part-3-exception-handling
title: RESTEasy Tutorial Part 3 - Exception Handling
wordpress_id: 238
categories:
- JBoss
- Maven
- REST
- RESTEasy
- Spring
- WebServices
tags:
- JBoss
- Maven
- REST
- RESTEasy
- Spring
- WebServices
---



RESTEasy Tutorial Series

[RESTEasy Tutorial Part-1: Basics](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-1-basics.html)

[RESTEasy Tutorial Part-2: Spring Integration](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-2-spring.html)

[RESTEasy Tutorial Part 3 - Exception Handling](http://www.sivalabs.in/2012/06/resteasy-tutorial-part-3-exception.html)

Exception Handling is an obvious requirement while developing software application. If any error occured while processing user request we should show the user an error page with details like brief exception message, error code(optional), hints to correct the input and retry(optional) and actual root cause(optional). This is applicable to RESTful web services also.

But putting try-catch-finally blocks all around the code is not a good practice. We should design/code in such a way that if there is any unrecoverable error occured then the code should throw that exception and there should an exception handler to catch those exceptions and extract the error details and give a proper error response to the client with all the error details.

RESTEasy provides such ExceptionHandler mechanism which simplifies the ExceptionHandling process.

In this part I will show you how we can use RESTEasy's ExceptionHandlers to handle Exceptions.

**Step#1: Create Application Specific Exceptions.**

[gist https://gist.github.com/sivaprasadreddy/2916667 /]

**Step#2: Create ExceptionHandlers by implementing ExceptionMapper interface.**

[gist https://gist.github.com/sivaprasadreddy/2916671 /]

**Step#3: Update UserResource.getUserXMLById() method to validate user input and throw respective exceptions**.

[gist https://gist.github.com/sivaprasadreddy/2916676 /]

**Step#4: Test the UserResource.getUserXMLById() service method by issueing following requests. **

[gist https://gist.github.com/sivaprasadreddy/2916687 /]

**
**

**Important things to note:**
As Spring is creating the necessary objects we should let Spring know about @Provider classes to get them registered with RESTEasy. We can do this in two ways.

a)Annotate Provider classes with @Component

b)Using component-scan's include-filter.

**<context:component-scan base-package="com.sivalabs.springdemo">**
**         <context:include-filter expression="javax.ws.rs.ext.Provider" type="annotation"/>**
**</context:component-scan>**
