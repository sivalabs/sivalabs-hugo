---
author: siva
comments: true
date: 2011-09-29 17:55:00+00:00
layout: post
slug: developing-webservices-using-jax-ws
title: Developing WebServices using JAX-WS
wordpress_id: 260
categories:
- WebServices
tags:
- WebServices
---

Let us assume an enterprise is maintaining user authentication details in a centralized system. We need to create an AuthenticationService which will take credentials, validate them and return the status. The rest of the applications will use the AuthenticationService to authenticate the Users.  
  
**Create AuthenticationService interface as follows:**  
  

    
    package com.sivalabs.caas.services;<br></br><br></br>import javax.jws.WebService;<br></br><br></br>import com.sivalabs.caas.domain.AuthenticationStatus;<br></br>import com.sivalabs.caas.domain.Credentials;<br></br>import com.sivalabs.caas.exceptions.AuthenticationServiceException;<br></br><br></br>@WebService<br></br>public interface AuthenticationService<br></br>{<br></br>public AuthenticationStatus authenticate(Credentials credentials) throws AuthenticationServiceException;<br></br>}<br></br>

  
  
  

    
    package com.sivalabs.caas.domain;<br></br><br></br>/**<br></br> * @author siva<br></br> *<br></br> */<br></br>public class Credentials <br></br>{<br></br> private String userName;<br></br> private String password;<br></br> public Credentials() <br></br>{<br></br> }<br></br> public Credentials(String userName, String password) {<br></br>  super();<br></br>  this.userName = userName;<br></br>  this.password = password;<br></br> }<br></br> //setters and getters<br></br> <br></br>}<br></br>

  
  

    
    package com.sivalabs.caas.domain;<br></br><br></br>/**<br></br> * @author siva<br></br> *<br></br> */<br></br>public class AuthenticationStatus<br></br>{<br></br> private String statusMessage;<br></br> private boolean success;<br></br> //setters and getters<br></br> <br></br>}<br></br>

  
  

    
    package com.sivalabs.caas.exceptions;<br></br><br></br>/**<br></br> * @author siva<br></br> *<br></br> */<br></br>public class AuthenticationServiceException extends RuntimeException<br></br>{<br></br> <br></br> private static final long serialVersionUID = 1L;<br></br> public AuthenticationServiceException()<br></br> {<br></br> }<br></br> public AuthenticationServiceException(String msg)<br></br> {<br></br>  super(msg);<br></br> }<br></br>}

  
  
  
**Now let us implement the AuthenticationService.**  
  

    
    package com.sivalabs.caas.services;<br></br><br></br>import java.util.HashMap;<br></br>import java.util.Map;<br></br><br></br>import javax.jws.WebService;<br></br><br></br>import com.sivalabs.caas.domain.AuthenticationStatus;<br></br>import com.sivalabs.caas.domain.Credentials;<br></br>import com.sivalabs.caas.exceptions.AuthenticationServiceException;<br></br><br></br>/**<br></br> * @author siva<br></br> *<br></br> */<br></br>@WebService(endpointInterface="com.sivalabs.caas.services.AuthenticationService",<br></br>   serviceName="AuthenticationService", <br></br>   targetNamespace="http://sivalabs.blogspot.com/services/AuthenticationService")<br></br>public class AuthenticationServiceImpl implements AuthenticationService<br></br>{<br></br> private static final Map<string, string> CREDENTIALS = new HashMap<string, string>();<br></br> static<br></br> {<br></br>  CREDENTIALS.put("admin", "admin");<br></br>  CREDENTIALS.put("test", "test");  <br></br> }<br></br> <br></br> @Override<br></br> public AuthenticationStatus authenticate(Credentials credentials) throws AuthenticationServiceException<br></br> {<br></br>  if(credentials == null)<br></br>  {<br></br>   throw new AuthenticationServiceException("Credentials is null");<br></br>  }<br></br>  AuthenticationStatus authenticationStatus = new AuthenticationStatus();<br></br>  String userName = credentials.getUserName();<br></br>  String password = credentials.getPassword();<br></br>  <br></br>  if(userName==null || userName.trim().length()==0 || password==null || password.trim().length()==0)<br></br>  {<br></br>   authenticationStatus.setStatusMessage("UserName and Password should not be blank");<br></br>   authenticationStatus.setSuccess(false);<br></br>  }<br></br>  else<br></br>  {<br></br>   if(CREDENTIALS.containsKey(userName) && password.equals(CREDENTIALS.get(userName)))<br></br>   {<br></br>    authenticationStatus.setStatusMessage("Valid UserName and Password");<br></br>    authenticationStatus.setSuccess(true);<br></br>   }<br></br>   else<br></br>   {<br></br>    authenticationStatus.setStatusMessage("Invalid UserName and Password");<br></br>    authenticationStatus.setSuccess(false);<br></br>   }<br></br>  }<br></br>  return authenticationStatus;<br></br> }<br></br>}<br></br>

  
Here for simplicity we are checking the credentials against the static data stored in HashMap. In real applications this check will be done against database.  
  
**Now we are going to publish the WebService.**  
  

    
    package com.sivalabs.caas.publisher;<br></br><br></br>import javax.xml.ws.Endpoint;<br></br><br></br>import com.sivalabs.caas.services.AuthenticationServiceImpl;<br></br><br></br>public class EndpointPublisher<br></br>{<br></br> public static void main(String[] args)<br></br> {<br></br>  Endpoint.publish("http://localhost:8080/CAAS/services/AuthenticationService", new AuthenticationServiceImpl());<br></br> }<br></br><br></br>}<br></br>

Run this standalone class to publish the AuthenticationService.  
  
To check whether the Service published successfully point the browser to URL http://localhost:8080/CAAS/services/AuthenticationService?wsdl. If the service published successfully you will see the WSDL content.  
  
  
**Now let us create a Standalone test client to test the webservice.**  
  

    
    package com.sivalabs.caas.client;<br></br><br></br>import java.net.URL;<br></br><br></br>import javax.xml.namespace.QName;<br></br>import javax.xml.ws.Service;<br></br><br></br>import com.sivalabs.caas.domain.AuthenticationStatus;<br></br>import com.sivalabs.caas.domain.Credentials;<br></br>import com.sivalabs.caas.services.AuthenticationService;<br></br><br></br>/**<br></br> * @author siva<br></br> *<br></br> */<br></br>public class StandaloneClient<br></br>{<br></br><br></br> public static void main(String[] args) throws Exception<br></br> {<br></br>  URL wsdlUrl = new URL("http://localhost:8080/CAAS/services/AuthenticationService?wsdl");<br></br>  QName qName = new QName("http://sivalabs.blogspot.com/services/AuthenticationService", "AuthenticationService");<br></br>  Service service = Service.create(wsdlUrl,qName);<br></br>  AuthenticationService port = service.getPort(AuthenticationService.class);<br></br>  Credentials credentials=new Credentials();<br></br>  credentials.setUserName("admin1");<br></br>  credentials.setPassword("admin");<br></br>  AuthenticationStatus authenticationStatus = port.authenticate(credentials);<br></br>  System.out.println(authenticationStatus.getStatusMessage());<br></br>  <br></br>  credentials.setUserName("admin");<br></br>  credentials.setPassword("admin");<br></br>  authenticationStatus = port.authenticate(credentials);<br></br>  System.out.println(authenticationStatus.getStatusMessage());<br></br> }<br></br><br></br>}

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
  

    
    public static void main(String[] args) throws Exception<br></br>{<br></br>  AuthenticationService_Service service = new AuthenticationService_Service();<br></br>  com.sivalabs.caas.client.AuthenticationService authenticationServiceImplPort = service.getAuthenticationServiceImplPort();<br></br>  com.sivalabs.caas.client.Credentials credentials = new com.sivalabs.caas.client.Credentials();<br></br>  <br></br>  credentials.setUserName("admin1");<br></br>  credentials.setPassword("admin");<br></br>  com.sivalabs.caas.client.AuthenticationStatus authenticationStatus = authenticationServiceImplPort.authenticate(credentials);<br></br>  System.out.println(authenticationStatus.getStatusMessage());<br></br>  <br></br>  credentials.setUserName("admin");<br></br>  credentials.setPassword("admin");<br></br>  authenticationStatus = authenticationServiceImplPort.authenticate(credentials);<br></br>  System.out.println(authenticationStatus.getStatusMessage());<br></br>}

  
In next article I will show how to deploy this AuthenticationService in Tomcat.
