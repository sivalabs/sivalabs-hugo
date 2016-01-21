---
author: siva
comments: true
date: 2011-03-23 12:05:00+00:00
layout: post
slug: json-processing-using-jackson-java-json-processor
title: JSON processing using Jackson Java JSON Processor
wordpress_id: 277
categories:
- Java
- JavaScript
tags:
- Java
- JavaScript
---

JSON(Javascript Object Notation) is becoming more popular data exchange format.   
While developing Web applications using Javascript frameworks like YUI, ExtJS, DOJO etc   
we can use either XML or JSON to exchange the data between the client and server.  
Normally we get the response from the server in terms of java objects. Then in Servlets or Action classes we need to build the JSON from objects and send back to client.  
To build the JSON response from Java object we can use Jackson Java JSON Processor which very much easy to use.  
  
Let us see how we can use Jackson Java JSON Processor to convert a java object into JSON and vice versa.  
  
We can download the jackson-all-1.6.4.jar from http://jackson.codehaus.org.  
  
The key class which does the marshalling and unmarshalling is org.codehaus.jackson.map.ObjectMapper.  
  
Let us create a User javabean as follows:  

    
    package com.sivalabs.json;<br></br>import java.util.Date;<br></br><br></br>public class User<br></br>{<br></br> private String userId;<br></br> private UserName userName;<br></br> private Date dob;<br></br> <br></br> @Override<br></br> public String toString()<br></br> {<br></br>  return "User [dob=" + dob + ", userId=" + userId + ", userName="+ userName + "]";<br></br> }<br></br> //setters and getters<br></br> <br></br>}<br></br>

  

    
    package com.sivalabs.json;<br></br>public class UserName<br></br>{<br></br> private String firstname;<br></br> private String middlename;<br></br> private String lastname;<br></br> <br></br> @Override<br></br> public String toString()<br></br> {<br></br>  return "UserName [firstname=" + firstname + ", lastname=" + lastname+ ", middlename=" + middlename + "]";<br></br> }<br></br> //setters and getters <br></br>}<br></br>

  
Now let us create an instance of User and marshall it into JSON:  
  

    
    ObjectMapper mapper = new ObjectMapper();<br></br><br></br>UserName userName = new UserName();<br></br>userName.setFirstname("Katamreddy");<br></br>userName.setMiddlename("Siva");<br></br>userName.setLastname("PrasadReddy");<br></br><br></br>User user = new User();<br></br>user.setUserId("1");<br></br>user.setUserName(userName);<br></br>user.setDob(new Date());<br></br><br></br>Writer strWriter = new StringWriter();<br></br>mapper.writeValue(strWriter, user);<br></br>String userDataJSON = strWriter.toString();<br></br>System.out.println(userDataJSON);<br></br><br></br>

  
This will print the User data in JSON format as :  
{"userId":"1","userName":{"firstname":"Katamreddy","middlename":"Siva","lastname":"PrasadReddy"},"dob":1300878089906}  
  
Now let us unmarshall the following user data in json format into User Object:  
  

    
    <br></br>{<br></br> "userId":"100",<br></br> "userName":<br></br>  {<br></br>   "firstname":"K",<br></br>   "middlename":"Siva",<br></br>   "lastname":"Prasad"<br></br>  },<br></br> "dob":1300878089906<br></br>}<br></br><br></br>String userDataJSON = "{"userId":"100","userName":{"firstname":"K","middlename":"Siva","lastname":"Prasad"},"dob":1300878089906}";<br></br>User userFromJSON = mapper.readValue(userDataJSON, User.class);<br></br>System.out.println(userFromJSON);<br></br>

  
This will print the User object as :  
User [dob=Wed Mar 23 16:31:29 IST 2011, userId=100, userName=UserName [firstname=K, lastname=Prasad, middlename=Siva]]  
  
The Date value is marshalled as Timestamp which is the default behaviour. If you want you can change the DateFormat as follows:  
  

    
    DateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy");<br></br>SerializationConfig serConfig = mapper.getSerializationConfig();<br></br>serConfig.setDateFormat(dateFormat);<br></br>DeserializationConfig deserializationConfig = mapper.getDeserializationConfig();<br></br>deserializationConfig.setDateFormat(dateFormat);<br></br>mapper.configure(SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS, false);<br></br>

  
Then the User JSON will be :  
{"userId":"1","userName":{"firstname":"Katamreddy","middlename":"Siva","lastname":"PrasadReddy"},"dob":"03-23-2011"}  
  
We can also marshall a Java Object as json into a file as:  

    
    mapper.writeValue(new File("user.json"), user);<br></br>

  
This will create a file user.json as :  
{  
"userId":"100",  
"userName":  
 {  
  "firstname":"K",  
  "middlename":"Siva",  
  "lastname":"Prasad"  
 },  
"dob":1300878089906  
}  
  
We can build the User object from user,json as:  

    
    User user = mapper.readValue(new File("user.json"), User.class);<br></br>

  
For more information you can visit http://jackson.codehaus.org .
