---
title: Deploying JAX-WS WebService on Tomcat-6
author: Siva
type: post
date: 2011-09-30T02:54:00+00:00
url: /2011/09/deploying-jax-ws-webservice-on-tomcat-6/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/09/deploying-jax-ws-webservice-on-tomcat-6.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/6750839002845381938
post_views_count:
  - 13
categories:
  - JavaEE
tags:
  - WebServices

---
Now we are going to see how to deploy JAX-WS WebService on Tomcat Server.  
We are going to deploy The AuthenticationService developed in http://sivalabs.blogspot.com/2011/09/developing-webservices-using-jax-ws.html on apache-tomcat-6.0.32.

To deploy our AuthenticationService we need to add the following configuration.

**1.web.xml**

<pre>&lt;web-app&gt;<br /> &lt;listener&gt;<br />  &lt;listener-class&gt;com.sun.xml.ws.transport.http.servlet.WSServletContextListener&lt;/listener-class&gt;<br /> &lt;/listener&gt;<br /> <br /> &lt;servlet&gt;<br />  &lt;servlet-name&gt;authenticationService&lt;/servlet-name&gt;<br />  &lt;servlet-class&gt;com.sun.xml.ws.transport.http.servlet.WSServlet&lt;/servlet-class&gt;<br />  &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;<br /> &lt;/servlet&gt;<br /> &lt;servlet-mapping&gt;<br />  &lt;servlet-name&gt;authenticationService&lt;/servlet-name&gt;<br />  &lt;url-pattern&gt;/services/AuthenticationService&lt;/url-pattern&gt;<br /> &lt;/servlet-mapping&gt;<br />&lt;/web-app&gt; <br /></pre>

**2. Create a new file WEB-INF/sun-jax-ws.xml**

<pre>&lt;?xml&nbsp;version="1.0"&nbsp;encoding="UTF-8"?&gt;<br />&lt;endpoints<br />&nbsp;&nbsp;xmlns="http://java.sun.com/xml/ns/jax-ws/ri/runtime"<br />&nbsp;&nbsp;version="2.0"&gt;<br />&nbsp;&nbsp;<br />&nbsp;&nbsp;&lt;endpoint<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name="AuthenticationService"<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;implementation="com.sivalabs.caas.services.AuthenticationServiceImpl"<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;url-pattern="/services/AuthenticationService"/&gt;<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br />&lt;/endpoints&gt;<br /></pre>

**3. Download the JAX-WS Reference Implementation from http://jax-ws.java.net/  
Copy all the jar files from jaxws-ri/lib folder to WEB-INF/lib.**

Now deploy the application on Tomcat server.  
You don&#8217;t need to publish the Service by our-self as we did using EndpointPublisher.  
Once the tomcat is up and running see the generated wsdl at http://localhost:8080/CAAS/services/AuthenticationService?wsdl.

Now if you test the AuthenticationService using standalone client it will work fine.

<pre>public static void testAuthenticationService()throws Exception<br />{<br />  URL wsdlUrl = new URL("http://localhost:8080/CAAS/services/AuthenticationService?wsdl");<br />  QName qName = new QName("http://sivalabs.blogspot.com/services/AuthenticationService", "AuthenticationService");<br />  Service service = Service.create(wsdlUrl,qName);<br />  AuthenticationService port = service.getPort(AuthenticationService.class);<br />  Credentials credentials=new Credentials();<br />  credentials.setUserName("admin");<br />  credentials.setPassword("admin");<br />  AuthenticationStatus authenticationStatus = port.authenticate(credentials);<br />  System.out.println(authenticationStatus.getStatusMessage());<br />}<br /></pre>

**But if you try to test with the wsimport tool generated client code make sure that you dont have jax-ws-ri jars in Client classpath.**  
Otherwise you will get the below error:

<pre>Exception in thread "main" java.lang.NoSuchMethodError: javax.xml.ws.WebFault.messageName()Ljava/lang/String;<br /> at com.sun.xml.ws.model.RuntimeModeler.processExceptions(RuntimeModeler.java:1162)<br /> at com.sun.xml.ws.model.RuntimeModeler.processDocWrappedMethod(RuntimeModeler.java:898)<br /></pre>