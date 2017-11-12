---
title: 'RESTEasy Tutorial Part-2: Spring Integration'
author: Siva
type: post
date: 2012-06-06T11:49:00+00:00
url: /2012/06/resteasy-tutorial-part-2-spring-integration/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/06/resteasy-tutorial-part-2-spring.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1862574912206937448
post_views_count:
  - 22
categories:
  - JavaEE
tags:
  - JBoss
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
  
RESTEasy provides support for Spring integration which enables us to expose Spring beans as RESTful WebServices.

**Step#1: Configure RESTEasy+Spring dependencies using Maven.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2915901.json">
</div>

**Step#2: Configure RESTEasy+Spring in web.xml**

<pre class="brush: xml">&lt;web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
		xmlns="http://java.sun.com/xml/ns/javaee" 
		xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" 
		xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
		http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd" 
		id="WebApp_ID" version="3.0">
		
   &lt;listener>
    &lt;listener-class>org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap&lt;/listener-class>
  &lt;/listener>
  &lt;listener>
    &lt;listener-class>org.jboss.resteasy.plugins.spring.SpringContextLoaderListener&lt;/listener-class>
  &lt;/listener>
  &lt;servlet>
    &lt;servlet-name>Resteasy&lt;/servlet-name>
    &lt;servlet-class>org.jboss.resteasy.plugins.server.servlet.HttpServletDispatcher&lt;/servlet-class>
  &lt;/servlet>
  &lt;servlet-mapping>
    &lt;servlet-name>Resteasy&lt;/servlet-name>
    &lt;url-pattern>/rest/*&lt;/url-pattern>
  &lt;/servlet-mapping>
  &lt;context-param>
    

<param-name />
contextConfigLocation&lt;/param-name>
    

<param-value />
classpath:applicationContext.xml&lt;/param-value>
  &lt;/context-param>
  &lt;context-param>
    

<param-name />
resteasy.servlet.mapping.prefix&lt;/param-name>
    

<param-value />
/rest&lt;/param-value>
  &lt;/context-param>

<!--While using Spring integration set resteasy.scan to false or don't configure resteasy.scan parameter at all -->
  &lt;context-param>
        

<param-name />
resteasy.scan&lt;/param-name>
        

<param-value />
false&lt;/param-value>
    &lt;/context-param>
&lt;/web-app>
</pre>

**Step#3: Create a Spring Service class UserService and update UserResource to use UserService bean.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2915642.json">
</div>

**Step#4: Same JUnit TestCase to test the REST Webservice described in Part-1.**

<div class="gist-oembed" data-gist="sivaprasadreddy/2882422.json">
</div>

<div>
  <div>
    <b><span style="color: red;">Important Things to Keep in mind:</span></b>
  </div>
  
  <div>
    1. org.jboss.resteasy.plugins.server.servlet.ResteasyBootstrap Listener should be registered before any other listener.
  </div>
  
  <div>
  </div>
  
  <div>
    2. You should configure resteasy.servlet.mapping.prefix <context-param> if the HttpServletDispatcher servlet url-pattern is anything other than /*
  </div>
  
  <div>
    3. While using Spring integration set <b>resteasy.scan</b> to <b><i>false </i></b>or don&#8217;t configure <b>resteasy.scan</b> parameter at all.<br /> Otherwise you may get REST Resource instances(UserResource) from RestEasy instead of Spring container. While running JUnit Tests I observed this random behavior.</p>
  </div>
  
  <div>
    4. You should register REST Resource as Spring bean by annotating with @Component or @Service.
  </div>
</div>

<div>
</div>

 [1]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-1-basics.html
 [2]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-2-spring.html
 [3]: http://www.sivalabs.in/2012/06/resteasy-tutorial-part-3-exception.html