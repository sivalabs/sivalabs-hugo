---
title: JSON processing using Jackson Java JSON Processor
author: Siva
type: post
date: 2011-03-23T06:35:00+00:00
url: /2011/03/json-processing-using-jackson-java-json-processor/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/03/json-processing-using-jackson-java-json.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/835465468758367687
post_views_count:
  - 18
categories:
  - Java
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

<pre>package com.sivalabs.json;<br />import java.util.Date;<br /><br />public class User<br />{<br /> private String userId;<br /> private UserName userName;<br /> private Date dob;<br /> <br /> @Override<br /> public String toString()<br /> {<br />  return "User [dob=" + dob + ", userId=" + userId + ", userName="+ userName + "]";<br /> }<br /> //setters and getters<br /> <br />}<br /></pre>



<pre>package com.sivalabs.json;<br />public class UserName<br />{<br /> private String firstname;<br /> private String middlename;<br /> private String lastname;<br /> <br /> @Override<br /> public String toString()<br /> {<br />  return "UserName [firstname=" + firstname + ", lastname=" + lastname+ ", middlename=" + middlename + "]";<br /> }<br /> //setters and getters <br />}<br /></pre>

Now let us create an instance of User and marshall it into JSON:

<pre>ObjectMapper mapper = new ObjectMapper();<br /><br />UserName userName = new UserName();<br />userName.setFirstname("Katamreddy");<br />userName.setMiddlename("Siva");<br />userName.setLastname("PrasadReddy");<br /><br />User user = new User();<br />user.setUserId("1");<br />user.setUserName(userName);<br />user.setDob(new Date());<br /><br />Writer strWriter = new StringWriter();<br />mapper.writeValue(strWriter, user);<br />String userDataJSON = strWriter.toString();<br />System.out.println(userDataJSON);<br /><br /></pre>

This will print the User data in JSON format as :  
{&#8220;userId&#8221;:&#8221;1&#8243;,&#8221;userName&#8221;:{&#8220;firstname&#8221;:&#8221;Katamreddy&#8221;,&#8221;middlename&#8221;:&#8221;Siva&#8221;,&#8221;lastname&#8221;:&#8221;PrasadReddy&#8221;},&#8221;dob&#8221;:1300878089906}

Now let us unmarshall the following user data in json format into User Object:

<pre><br />{<br /> "userId":"100",<br /> "userName":<br />  {<br />   "firstname":"K",<br />   "middlename":"Siva",<br />   "lastname":"Prasad"<br />  },<br /> "dob":1300878089906<br />}<br /><br />String userDataJSON = "{"userId":"100","userName":{"firstname":"K","middlename":"Siva","lastname":"Prasad"},"dob":1300878089906}";<br />User userFromJSON = mapper.readValue(userDataJSON, User.class);<br />System.out.println(userFromJSON);<br /></pre>

This will print the User object as :  
User [dob=Wed Mar 23 16:31:29 IST 2011, userId=100, userName=UserName [firstname=K, lastname=Prasad, middlename=Siva]]

The Date value is marshalled as Timestamp which is the default behaviour. If you want you can change the DateFormat as follows:

<pre>DateFormat dateFormat = new SimpleDateFormat("MM-dd-yyyy");<br />SerializationConfig serConfig = mapper.getSerializationConfig();<br />serConfig.setDateFormat(dateFormat);<br />DeserializationConfig deserializationConfig = mapper.getDeserializationConfig();<br />deserializationConfig.setDateFormat(dateFormat);<br />mapper.configure(SerializationConfig.Feature.WRITE_DATES_AS_TIMESTAMPS, false);<br /></pre>

Then the User JSON will be :  
{&#8220;userId&#8221;:&#8221;1&#8243;,&#8221;userName&#8221;:{&#8220;firstname&#8221;:&#8221;Katamreddy&#8221;,&#8221;middlename&#8221;:&#8221;Siva&#8221;,&#8221;lastname&#8221;:&#8221;PrasadReddy&#8221;},&#8221;dob&#8221;:&#8221;03-23-2011&#8243;}

We can also marshall a Java Object as json into a file as:

<pre>mapper.writeValue(new File("user.json"), user);<br /></pre>

This will create a file user.json as :  
{   
&#8220;userId&#8221;:&#8221;100&#8243;,   
&#8220;userName&#8221;:    
{     
&#8220;firstname&#8221;:&#8221;K&#8221;,     
&#8220;middlename&#8221;:&#8221;Siva&#8221;,     
&#8220;lastname&#8221;:&#8221;Prasad&#8221;    
},   
&#8220;dob&#8221;:1300878089906  
}

We can build the User object from user,json as:

<pre>User user = mapper.readValue(new File("user.json"), User.class);<br /></pre>

For more information you can visit http://jackson.codehaus.org .