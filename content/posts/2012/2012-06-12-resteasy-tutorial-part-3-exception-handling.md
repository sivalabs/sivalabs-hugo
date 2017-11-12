---
title: RESTEasy Tutorial Part 3 – Exception Handling
author: Siva
type: post
date: 2012-06-12T05:24:00+00:00
url: /2012/06/resteasy-tutorial-part-3-exception-handling/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/06/resteasy-tutorial-part-3-exception.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/4805140862069209688
post_views_count:
  - 38
categories:
  - JavaEE
tags:
  - JBoss
  - Maven
  - REST
  - RESTEasy
  - Spring
  - WebServices

---
&nbsp;

RESTEasy Tutorial Series

[RESTEasy Tutorial Part-1: Basics][1]

[RESTEasy Tutorial Part-2: Spring Integration][2]

[RESTEasy Tutorial Part 3 &#8211; Exception Handling][3]

Exception Handling is an obvious requirement while developing software application. If any error occured while processing user request we should show the user an error page with details like brief exception message, error code(optional), hints to correct the input and retry(optional) and actual root cause(optional). This is applicable to RESTful web services also.

But putting try-catch-finally blocks all around the code is not a good practice. We should design/code in such a way that if there is any unrecoverable error occured then the code should throw that exception and there should an exception handler to catch those exceptions and extract the error details and give a proper error response to the client with all the error details.

RESTEasy provides such ExceptionHandler mechanism which simplifies the ExceptionHandling process.

In this part I will show you how we can use RESTEasy&#8217;s ExceptionHandlers to handle Exceptions.

**Step#1: Create Application Specific Exceptions.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2916667.json">
</div>

**Step#2: Create ExceptionHandlers by implementing ExceptionMapper interface.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2916671.json">
</div>

**Step#3: Update UserResource.getUserXMLById() method to validate user input and throw respective exceptions**.

<div class="gist-oembed" data-gist="sivaprasadreddy/2916676.json">
</div>

**Step#4: Test the UserResource.getUserXMLById() service method by issueing following requests. **

<div class="gist-oembed" data-gist="sivaprasadreddy/2916687.json">
</div>

**
  
**

**<span style="color: red;">Important things to note:</span>**
  
As Spring is creating the necessary objects we should let Spring know about @Provider classes to get them registered with RESTEasy. We can do this in two ways.

a)Annotate Provider classes with @Component

b)Using component-scan&#8217;s include-filter.

**<context:component-scan base-package=&#8221;com.sivalabs.springdemo&#8221;>**
  
**         <context:include-filter expression=&#8221;javax.ws.rs.ext.Provider&#8221; type=&#8221;annotation&#8221;/>**
  
**</context:component-scan>**

 [1]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-1-basics.html
 [2]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-2-spring.html
 [3]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-3-exception.html