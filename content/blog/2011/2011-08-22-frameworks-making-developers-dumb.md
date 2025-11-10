---
title: Are frameworks making developers dumb?
author: Siva
type: post
date: 2011-08-22T01:16:00.000Z
url: /blog/frameworks-making-developers-dumb/
categories:
  - Thoughts
tags:
  - Interviews
  - Java
aliases:
  - /frameworks-making-developers-dumb/
---
Last week, I had to conduct interviews to hire senior Java developers with around 5 years of experience. But after the interview process was over, I felt like frameworks make developers' lives easier but, at the same time, make them dumber.

Everyone puts almost all the new frameworks on their resume, claiming they have "Strong, working experience on Spring, Hibernate, Web Services, etc.".

Here is how the interviews went.

**Me:** You have used Spring in your latest project. What are the advantages of using Spring?
**Interviewee:** We can configure beans in XML, and it will take care of instantiating and giving them to us.

**Me:** If Spring is only for creating objects, why is it required at all? I can directly instantiate the dependencies using "new". Why should I configure the class names in XML and get the object from Spring?

**Interviewee:** If tomorrow we want to create another implementation of our interface, we can create a new implementation and update the XML configuration to use the new impl. We don't need to change the Java class and compile it.
**Me:** But you are writing a new Java class, so obviously you need to compile the project.
Regarding the XML change, 99% of the time your XML will be packaged in a WAR or EAR file.
So you will run an ANT script and create the WAR with all the new changes.
Then your point of "if it is XML, I don't need to compile" is not valid.

**Interviewee:** Hmmm, but the Dependency Injection design pattern suggests following this way.
**Me:** OK. I am done with the interview. Our HR will get back to you. 🙂

Interview with another guy:

**Me:** Can you explain your latest project and what technologies you have used?
**Interviewee:** It is some XYZ System, and we are using Spring, Hibernate, and REST WebServices.
**Me:** Ok. Can you explain something about RESTful architecture?
**Interviewee:** We can develop a RESTful application by using @RequestMapping(value="/url", method="POST"). And we can also use PUT and DELETE methods.
**Me:** That's OK, but what is the concept of RESTful architecture?
**Interviewee:** That's what I am explaining. If you use @RequestMapping(value="/url", method="POST"), you can develop a RESTful application.

**Me:** Ok, how good are you at Hibernate?
**Interviewee:** I have been using Hibernate for the last 2 years. I am very good at using Hibernate.
**Me:** What are the advantages of using Hibernate over JDBC?
**Interviewee:** By using it, we don't need to write anything to interact with the database; Hibernate will take care of it.
**Me:** How does Hibernate come to know about your project requirements?
**Interviewee:** If we use Hibernate, it will take care of saving, updating, and fetching data from the database.
**Me:** Uffffffuuuuu… OK.. In your free time, do you read any technology-related blogs?
**Interviewee:** Yeah, why not? That's how I learn Hibernate in-depth.
**Me:** Very good, nice talking to you. Our HR will get back to you. 🙂

The interview process went on like this…

I strongly believe frameworks increase developer productivity. But developers should try to understand how the framework is doing things. You need not learn all the internal working mechanisms of frameworks. If you are really good at Servlets and JSP, then it is very easy to understand any Java Web framework like Struts, Spring MVC, etc. If you aren't good at the basics, then obviously for every other question, the reply would be... "the framework's annotation/xml will execute this."

I strongly recommend that people who want to start their career as a Java developer work on Core Java, Servlets, and JSP for some time. Then, one can understand the frameworks in a proper way.
