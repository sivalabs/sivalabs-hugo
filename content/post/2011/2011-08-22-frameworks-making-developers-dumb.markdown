---
author: siva
comments: true
date: 2011-08-22 06:46:00+00:00
layout: post
slug: frameworks-making-developers-dumb
title: Are frameworks making developers dumb?
wordpress_id: 264
categories:
- Interviews
- Java
tags:
- Interviews
- Java
---

Last week I got to take interviews to hire senior java developers with around 5 years of experience. But after the interview process is over I felt like the frameworks makes developers life easier but at the same time  making them dumb.  
  
Everyone puts almost all the new frameworks on their resume claiming they have "Strong, working experience on Spring, Hibernate, Web Services etc".  
  
Here is how the interviews went on.  
  
**Me:** You have used Spring in your latest project. What are the advantages of using Spring?  
**Interviewee:** We can configure beans in XML and it will take care of instantiating and give it to us.  
  
**Me: **If Spring is for only creating objects why is it required at all, I can directly instantiate the dependencies using "new". Why should I configure the class names in XML and get the object from Spring?  
  
**Interviewee:** If tomorrow we want to create another implementation of our interface we can create new implementation and update the XML configuration to use new impl. We don't need to change Java class and compile them.  
**Me:** But you are writing a new Java class, so obviously you need to compile the project.  
Regarding XML change, 99% of the times your XML will be packaged in war or ear file.   
So you will run ANT script and create the war with the all the new changes.  
Then your point of "if it is XML i don't need to compile" is not a valid point.  
  
**Interviewee:** Hmmm, But the Dependency Injection design pattern suggests to follow this way.  
**Me:** OK. I am done with the interview. Our HR will get back to you. :-)  
  
Interview with another guy:  
  
**Me:** Can you explain about your latest project and what technologies have you used?  
**Interviewee:** It is some XYZ System and we are using Spring, Hibernate, REST WebServices.  
**Me:** Ok. Can you explain something about RESTful architecture?  
**Interviewee:** We can develop RESTful application by using @RequestMapping(value="/url", method="POST"). And also we can use PUT, DELETE methods.  
**Me:** That OK, but what is the concept of RESTful architecture?  
**Interviewee: **That's what I am explaining. If you use @RequestMapping(value="/url", method="POST") you can develop RESTful application.  
  
**Me:** Ok, How good are you in Hibernate?  
**Interviewee:** I am using Hibernate for the last 2 years. I am very good in using Hibernate.  
**Me:** What are the advantages of using Hibernate over JDBC?  
**Interviewee:** By using we don't need to write anything to interact with database, Hibernate will take care of.  
**Me:** How Hibernate comes to know about your project requirement?  
**Interviewee:** If we use Hibernate it will take care saving, updating and fetching data from database.  
**Me:** Uffffffuuuuu... OK.. In your free time do you read any technology related blogs?  
**Interviewee:** Yeah, why not. That how I learn Hibernate in-depth.  
**Me :** Very Good, nice talking to you. Our HR will get back to you. :-)  
  
Interview process went on like this...  
  
I strongly believe frameworks will increase developer productivity. But the developers should try to understand how the framework is doing the stuff. You need not learn all the internal working mechanisms of frameworks. If you are really good at Servlets and JSP then it is very easy to understand any Java Web framework like Struts, SpringMVC etc.If you aren't good at the basics then obviously for every other question  reply would be.. "framework's annotation/xml will execute this"   
  
I strongly recommend the people who want to start their career as a Java developer to work on Core Java, Servlets, JSP for sometime.Then only one can understand the frameworks in proper way.   
  

