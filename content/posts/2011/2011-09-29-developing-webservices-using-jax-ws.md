---
title: Developing WebServices using JAX-WS
author: Siva
type: post
date: 2011-09-29T12:25:00+00:00
url: /2011/09/developing-webservices-using-jax-ws/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/09/developing-webservices-using-jax-ws.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1607635582265884941
post_views_count:
  - 3
categories:
  - JavaEE
tags:
  - WebServices

---
Let us assume an enterprise is maintaining user authentication details in a centralized system. We need to create an AuthenticationService which will take credentials, validate them and return the status. The rest of the applications will use the AuthenticationService to authenticate the Users.

**Create AuthenticationService interface as follows:**

<pre>package com.sivalabs.caas.services;<br /><br />import javax.jws.WebService;<br /><br />import com.sivalabs.caas.domain.AuthenticationStatus;<br />import com.sivalabs.caas.domain.Credentials;<br />import com.sivalabs.caas.exceptions.AuthenticationServiceException;<br /><br />@WebService<br />public interface AuthenticationService<br />{<br />public AuthenticationStatus authenticate(Credentials credentials) throws AuthenticationServiceException;<br />}<br /></pre>



<pre>package com.sivalabs.caas.domain;<br /><br />/**<br /> * @author siva<br /> *<br /> */<br />public class Credentials <br />{<br /> private String userName;<br /> private String password;<br /> public Credentials() <br />{<br /> }<br /> public Credentials(String userName, String password) {<br />  super();<br />  this.userName = userName;<br />  this.password = password;<br /> }<br /> //setters and getters<br /> <br />}<br /></pre>

<pre>package com.sivalabs.caas.domain;<br /><br />/**<br /> * @author siva<br /> *<br /> */<br />public class AuthenticationStatus<br />{<br /> private String statusMessage;<br /> private boolean success;<br /> //setters and getters<br /> <br />}<br /></pre>

<pre>package com.sivalabs.caas.exceptions;<br /><br />/**<br /> * @author siva<br /> *<br /> */<br />public class AuthenticationServiceException extends RuntimeException<br />{<br /> <br /> private static final long serialVersionUID = 1L;<br /> public AuthenticationServiceException()<br /> {<br /> }<br /> public AuthenticationServiceException(String msg)<br /> {<br />  super(msg);<br /> }<br />}</pre>

**Now let us implement the AuthenticationService.**

<pre>package com.sivalabs.caas.services;<br /><br />import java.util.HashMap;<br />import java.util.Map;<br /><br />import javax.jws.WebService;<br /><br />import com.sivalabs.caas.domain.AuthenticationStatus;<br />import com.sivalabs.caas.domain.Credentials;<br />import com.sivalabs.caas.exceptions.AuthenticationServiceException;<br /><br />/**<br /> * @author siva<br /> *<br /> */<br />@WebService(endpointInterface="com.sivalabs.caas.services.AuthenticationService",<br />   serviceName="AuthenticationService", <br />   targetNamespace="http://sivalabs.blogspot.com/services/AuthenticationService")<br />public class AuthenticationServiceImpl implements AuthenticationService<br />{<br /> private static final Map&lt;string, string&gt; CREDENTIALS = new HashMap&lt;string, string&gt;();<br /> static<br /> {<br />  CREDENTIALS.put("admin", "admin");<br />  CREDENTIALS.put("test", "test");  <br /> }<br /> <br /> @Override<br /> public AuthenticationStatus authenticate(Credentials credentials) throws AuthenticationServiceException<br /> {<br />  if(credentials == null)<br />  {<br />   throw new AuthenticationServiceException("Credentials is null");<br />  }<br />  AuthenticationStatus authenticationStatus = new AuthenticationStatus();<br />  String userName = credentials.getUserName();<br />  String password = credentials.getPassword();<br />  <br />  if(userName==null || userName.trim().length()==0 || password==null || password.trim().length()==0)<br />  {<br />   authenticationStatus.setStatusMessage("UserName and Password should not be blank");<br />   authenticationStatus.setSuccess(false);<br />  }<br />  else<br />  {<br />   if(CREDENTIALS.containsKey(userName) && password.equals(CREDENTIALS.get(userName)))<br />   {<br />    authenticationStatus.setStatusMessage("Valid UserName and Password");<br />    authenticationStatus.setSuccess(true);<br />   }<br />   else<br />   {<br />    authenticationStatus.setStatusMessage("Invalid UserName and Password");<br />    authenticationStatus.setSuccess(false);<br />   }<br />  }<br />  return authenticationStatus;<br /> }<br />}<br /></pre>

Here for simplicity we are checking the credentials against the static data stored in HashMap. In real applications this check will be done against database.

**Now we are going to publish the WebService.**

<pre>package com.sivalabs.caas.publisher;<br /><br />import javax.xml.ws.Endpoint;<br /><br />import com.sivalabs.caas.services.AuthenticationServiceImpl;<br /><br />public class EndpointPublisher<br />{<br /> public static void main(String[] args)<br /> {<br />  Endpoint.publish("http://localhost:8080/CAAS/services/AuthenticationService", new AuthenticationServiceImpl());<br /> }<br /><br />}<br /></pre>

Run this standalone class to publish the AuthenticationService.

To check whether the Service published successfully point the browser to URL http://localhost:8080/CAAS/services/AuthenticationService?wsdl. If the service published successfully you will see the WSDL content.

**Now let us create a Standalone test client to test the webservice.**

<pre>package com.sivalabs.caas.client;<br /><br />import java.net.URL;<br /><br />import javax.xml.namespace.QName;<br />import javax.xml.ws.Service;<br /><br />import com.sivalabs.caas.domain.AuthenticationStatus;<br />import com.sivalabs.caas.domain.Credentials;<br />import com.sivalabs.caas.services.AuthenticationService;<br /><br />/**<br /> * @author siva<br /> *<br /> */<br />public class StandaloneClient<br />{<br /><br /> public static void main(String[] args) throws Exception<br /> {<br />  URL wsdlUrl = new URL("http://localhost:8080/CAAS/services/AuthenticationService?wsdl");<br />  QName qName = new QName("http://sivalabs.blogspot.com/services/AuthenticationService", "AuthenticationService");<br />  Service service = Service.create(wsdlUrl,qName);<br />  AuthenticationService port = service.getPort(AuthenticationService.class);<br />  Credentials credentials=new Credentials();<br />  credentials.setUserName("admin1");<br />  credentials.setPassword("admin");<br />  AuthenticationStatus authenticationStatus = port.authenticate(credentials);<br />  System.out.println(authenticationStatus.getStatusMessage());<br />  <br />  credentials.setUserName("admin");<br />  credentials.setPassword("admin");<br />  authenticationStatus = port.authenticate(credentials);<br />  System.out.println(authenticationStatus.getStatusMessage());<br /> }<br /><br />}</pre>

<pre></pre>

**Instead of writing StandaloneClient by our-self we can generate the Client using wsimport commandline tool.**  
wsimport tool is there in JDK/bin directory.  
Go to your project src directory and execute the following command.  
**wsimport -keep -p com.sivalabs.caas.client http://localhost:8080/CAAS/services/AuthenticationService?wsdl**

It will generate the following java and class files in com.sivalabs.caas.client package.

Authenticate.java  
AuthenticateResponse.java  
AuthenticationService_Service.java  
AuthenticationService.java  
AuthenticationServiceException_Exception.java  
AuthenticationServiceException.java  
AuthenticationStatus.java  
Credentials.java  
ObjectFactory.java  
package-info.java

**Now you can use the generated Java files to test the Service.**

<pre>public static void main(String[] args) throws Exception<br />{<br />  AuthenticationService_Service service = new AuthenticationService_Service();<br />  com.sivalabs.caas.client.AuthenticationService authenticationServiceImplPort = service.getAuthenticationServiceImplPort();<br />  com.sivalabs.caas.client.Credentials credentials = new com.sivalabs.caas.client.Credentials();<br />  <br />  credentials.setUserName("admin1");<br />  credentials.setPassword("admin");<br />  com.sivalabs.caas.client.AuthenticationStatus authenticationStatus = authenticationServiceImplPort.authenticate(credentials);<br />  System.out.println(authenticationStatus.getStatusMessage());<br />  <br />  credentials.setUserName("admin");<br />  credentials.setPassword("admin");<br />  authenticationStatus = authenticationServiceImplPort.authenticate(credentials);<br />  System.out.println(authenticationStatus.getStatusMessage());<br />}</pre>

In next article I will show how to deploy this AuthenticationService in Tomcat.