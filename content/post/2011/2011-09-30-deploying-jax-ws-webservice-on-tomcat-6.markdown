---
author: siva
comments: true
date: 2011-09-30 08:24:00+00:00
layout: post
slug: deploying-jax-ws-webservice-on-tomcat-6
title: Deploying JAX-WS WebService on Tomcat-6
wordpress_id: 259
categories:
- WebServices
tags:
- WebServices
---

Now we are going to see how to deploy JAX-WS WebService on Tomcat Server.  
We are going to deploy The AuthenticationService developed in http://sivalabs.blogspot.com/2011/09/developing-webservices-using-jax-ws.html on apache-tomcat-6.0.32.  
  
To deploy our AuthenticationService we need to add the following configuration.  
  
**1.web.xml**  
  

    
    <web-app><br></br> <listener><br></br>  <listener-class>com.sun.xml.ws.transport.http.servlet.WSServletContextListener</listener-class><br></br> </listener><br></br> <br></br> <servlet><br></br>  <servlet-name>authenticationService</servlet-name><br></br>  <servlet-class>com.sun.xml.ws.transport.http.servlet.WSServlet</servlet-class><br></br>  <load-on-startup>1</load-on-startup><br></br> </servlet><br></br> <servlet-mapping><br></br>  <servlet-name>authenticationService</servlet-name><br></br>  <url-pattern>/services/AuthenticationService</url-pattern><br></br> </servlet-mapping><br></br></web-app> <br></br>

  
**2. Create a new file WEB-INF/sun-jax-ws.xml**  
  

    
    <?xml version="1.0" encoding="UTF-8"?><br></br><endpoints<br></br>  xmlns="http://java.sun.com/xml/ns/jax-ws/ri/runtime"<br></br>  version="2.0"><br></br>  <br></br>  <endpoint<br></br>      name="AuthenticationService"<br></br>      implementation="com.sivalabs.caas.services.AuthenticationServiceImpl"<br></br>      url-pattern="/services/AuthenticationService"/><br></br>      <br></br></endpoints><br></br>

  
**3. Download the JAX-WS Reference Implementation from http://jax-ws.java.net/  
Copy all the jar files from jaxws-ri/lib folder to WEB-INF/lib.**  
  
Now deploy the application on Tomcat server.  
You don't need to publish the Service by our-self as we did using EndpointPublisher.  
Once the tomcat is up and running see the generated wsdl at http://localhost:8080/CAAS/services/AuthenticationService?wsdl.  
  
Now if you test the AuthenticationService using standalone client it will work fine.  

    
    public static void testAuthenticationService()throws Exception<br></br>{<br></br>  URL wsdlUrl = new URL("http://localhost:8080/CAAS/services/AuthenticationService?wsdl");<br></br>  QName qName = new QName("http://sivalabs.blogspot.com/services/AuthenticationService", "AuthenticationService");<br></br>  Service service = Service.create(wsdlUrl,qName);<br></br>  AuthenticationService port = service.getPort(AuthenticationService.class);<br></br>  Credentials credentials=new Credentials();<br></br>  credentials.setUserName("admin");<br></br>  credentials.setPassword("admin");<br></br>  AuthenticationStatus authenticationStatus = port.authenticate(credentials);<br></br>  System.out.println(authenticationStatus.getStatusMessage());<br></br>}<br></br>

  
**But if you try to test with the wsimport tool generated client code make sure that you dont have jax-ws-ri jars in Client classpath.**  
Otherwise you will get the below error:  
  

    
    Exception in thread "main" java.lang.NoSuchMethodError: javax.xml.ws.WebFault.messageName()Ljava/lang/String;<br></br> at com.sun.xml.ws.model.RuntimeModeler.processExceptions(RuntimeModeler.java:1162)<br></br> at com.sun.xml.ws.model.RuntimeModeler.processDocWrappedMethod(RuntimeModeler.java:898)<br></br>
