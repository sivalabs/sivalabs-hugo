---
title: Developing WebServices using JDK6/JAX-WS is simple. Is it true?
author: Siva
type: post
date: 2011-10-03T01:23:00+00:00
url: /2011/10/developing-webservices-using-jdk6jax-ws-is-simple-is-it-true/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/10/developing-webservices-using-jdk6jax-ws.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2813576881226748648
post_views_count:
  - 9
categories:
  - JavaEE
tags:
  - WebServices

---
In many articles, blogs we can see how to develop WebServices using with JDK6&#8217;s JAX-WS in-built support in just 5 minutes.

We can simply write a POJO and annotate it with @WebService, publish it with Endpoint.publish(&#8230;) and you can see the generated wsdl by pointing your browser to http://localhost:8080/JAXWS/helloService?wsdl.

Immediately we can write a client and call helloPort.sayHello(&#8220;siva&#8221;) and you will get &#8220;Hello Siva!!!&#8221; response from your HelloWebService.

In the first look it feels like developing web services is very simple using JDK6&#8217;s in-built JAX-WS support.

With that confidence immediately I thought of writing a bit more complex WebService and deploy it on Tomcat.

As we can find number of articles on how to develop/deploy JAX-WS webservices on Tomcat Server, I started writing my next ABitComplexService and deployed on Tomcat and saw the generated WSDL file.

Then I generated client stubs using wsimport and invoked webservice methods and it worked fine&#8230; 🙂

Then I though of invoking the webservice from a simple web project and put the client code in a new Web web project and and call the web service.

**Now the show begins 🙂**

Then I got an opportunity to know what is JDK&#8217;s endorsed directory, how App Servers have their specific endorsed directories etc etc.

I got weird errors like:

**Exception in thread &#8220;main&#8221; javax.xml.ws.soap.SOAPFaultException: javax.xml.ws.WebFault.messageName()Ljava/lang/String;** 

**java.lang.ClassCastException: com.sun.xml.bind.v2.runtime.JAXBContextImpl cannot be cast to com.sun.xml.bind.api.JAXBRIContext**

After struggling for sometime I copied jaxws-api.jar/jaxb-api.jar to endorsed directories and finally get it worked.

Now I wanted to make it a bit more complicated and thought of creating another WebService and deploy on JBoss Server and call it from the first WebService deployed on Tomcat.

Now I have:

**1. MySecondWS webservice deployed on JBoss.**  
**2. MyFirstWS webservice deployed on Tomcat. It is a Service Provider and Consumer(for MySecondWS) as well.**  
**3. MyWebClient a Dynamic Web Project. Its a client for MyFirstWS.**

Here as MyFirstWS webservice is a Service provider I have all the JAX-WS RI jars in WEB-INF/lib directory.

All set and I deployed all the Apps on their servers and hit the Submit button triggering MyFirstWS webservice call().

I got weird errors like NullPointerExceptions, MetadataModelExceptions etc.

After some trials I have identified the pattern that if **I invoke the client from a project which has JAXWS-RI jars in its classpath I am getting this error.**

But I need to develop a WebService which is both Service Provider and Consumer&#8230;   
For the Service Producer I need to have those Jars in my classpath and at the same time to be Service Consumer I shouldn&#8217;t have those jars in my WEB-INF/lib.

So what to do? Yes, I know I need some more time to Google and I can find a way how to do this as this is very common requirement. But I feel like Developing Web Services using JDK6&#8217;s JAX-WS in-build support is not as easy as Advertised(My opinion only).

**Anyway this weekend I understood two things:**  
**1. Developing (Real)WebServices with JAX-WS is not that simple as advertised in the Articles/Blogs.**  
**2. You can easily waste your week-ends by entering into Java-Jar-Hell 🙂**