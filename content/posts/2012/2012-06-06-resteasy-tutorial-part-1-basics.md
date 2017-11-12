---
title: 'RESTEasy Tutorial Part-1: Basics'
author: Siva
type: post
date: 2012-06-06T10:07:00+00:00
url: /2012/06/resteasy-tutorial-part-1-basics/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/06/resteasy-tutorial-part-1-basics.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/5823752216471491977
post_views_count:
  - 51
categories:
  - JavaEE
tags:
  - JBoss
  - Maven
  - REST
  - RESTEasy
  - WebServices

---
&nbsp;

RESTEasy Tutorial Series

[RESTEasy Tutorial Part-1: Basics][1]

[RESTEasy Tutorial Part-2: Spring Integration][2]

[RESTEasy Tutorial Part 3 &#8211; Exception Handling][3]
  
RESTEasy is a JAX-RS implementation from JBoss/RedHat and is in-built in JBoss 6 onwards.
  
Here I am going to show you how to develop a Simple RESTful Web Services application using RESTEasy and JBossAS7.1.1.FINAL.

**Step#1: Configure RESTEasy dependencies using Maven.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2882384.json">
</div>

**Step#2: Configure RESTEasy in web.xml**

<div class="gist-oembed" data-gist="sivaprasadreddy/2882393.json">
</div>

**Step#3: Create User domain class, MockUserTable class to store User objects in-memory for testing purpose and UserResource class to expose CRUD operations on User as RESTful webservices.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2882408.json">
</div>

**Step#6: JUnit TestCase to test the REST Webservice.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2882422.json">
</div>

**Step#7: To test the REST service we can use the REST Client Tool. **
  
You can download REST Client Tool at http://code.google.com/a/eclipselabs.org/p/restclient-tool/

**<span style="color: red;">Important Things to Keep in mind:</span>**
  
1. org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap Listener should be registered before any other listener.

2. You should configure **resteasy.servlet.mapping.prefix** <context-param> if the HttpServletDispatcher servlet url-pattern is anything other than **/***
  
**
  
**
  
3. Keep visiting my blog 🙂

 [1]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-1-basics.html
 [2]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-2-spring.html
 [3]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-3-exception.html