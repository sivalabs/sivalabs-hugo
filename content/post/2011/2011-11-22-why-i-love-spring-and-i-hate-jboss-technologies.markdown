---
author: siva
comments: true
date: 2011-11-22 20:49:00+00:00
layout: post
slug: why-i-love-spring-and-i-hate-jboss-technologies
title: Why I love Spring and I hate JBoss technologies
wordpress_id: 253
categories:
- Spring
tags:
- Spring
---

I am using Spring framework for the last 3 years and I am very happy while working with Spring.  
In the very beginning when I started learning Spring I felt like "OMG, without doing much by myself I am getting so much of functionality".  
  
Once I configure basic infrastructure setup like DataSource, JMS, Email Config etc I am able to perform the actual tasks like database operations or sending emails using Templates very easily. I just liked Spring framework magic even without fully understanding how it works.  
  
Later I started digging into internals of Spring by looking at the source code and got a fair idea on Spring framework and I just loved it and now I addicted to Spring.  
  
**When I asked myself what makes me to like Spring so much I got the following reasons:**  
  
**1. **The most important reason for why I like Spring so much is its least surprise principle. In most of the times Spring behaves as expected and as documented in its reference documentation. For the beginners Spring has a number of sample applications for each of its modules like Spring core, MVC, Spring Data JPA etc. They just work fine. You run the Maven build and run the application it just work as expected.  
  
**2. **Detailed error descriptions. When Spring throws an error it will give you very detailed description about why the error occurred. This saves a lot of time and allows the developers to proceed further without getting frustrated in the beginning itself.  
  
**3. **Spring is moving towards the future(unlike JavaEE trying to catch the present).  
Recently I spent sometime on Groovy and Grails and they are amazing. We all know Spring is the underlying technology on which Grails is built.  
  
Suppose if an application can be developed by writing 1000 lines of code with Spring we can develop with 250 lines of code and with Grails we can finish it in 100 lines.  
  
Of course the number of lines is not a good metric to evaluate the quality of a framework, what I am saying is Grails already had built in support for the regular use cases. For example we can develop Rich User Interfaces using RichUI plugin very easily.  
  
I can list down other 100 reasons why I like it so much but these are the immediate things that comes to my mind.  
  
**Now why I hate JBoss:**  
  
Long time back I got to work on JSF1.x and at that time I tried to change my platform from Java to anything else which doesn't have JSF :-). But by Gods grace I got rid of the situation and still working on Java platform. After that I never tried JSF.  
  
Recently I am seeing many blogs like "How to migrate from Spring to JEE6", "Time to Migrate from Spring to JEE6", "Do we need Spring when JEE6 is providing everything". I know JEE6 far far better than earlier versions and it has many features inbuilt that Spring is providing.  
  
I felt like "Oh..JEE6 becomes that simple...I should give it a try". Then I spent sometime on reading JEE6, yeah now using JEE6 is pretty simple. I started doing very simple POC using JSF2, EJB3, CDI, JPA using Glassfish server. Amazingly with in 30 min I was able to complete the POC and its up and running. Wowwww..  
  
Then I started doing another POC using JSF2, EJB3, CDI, JPA but this time using JBoss6 as I thought of using RichFaces4(I know I can deploy RichFaces on Glassfish also but still I thought of using JBoss6).  
I followed their reference documentation and added the richfaces jars to classpath and deployed the application and then the show started.  
  
It gave errors as it depends on some Google classes which are not there on classpath. Then I search for the jar containing those classes and got so many jars list containing those classes. I tried with each jar and nothing worked.   
  
After a while I thought of downloading richfaces sample applications assuming either sample apps contains those jars or it may declare those dependencies in pom.xml. I downloaded the richfaces samples and eagerly unzipped it and opened the pom.xml for the dependencies. I doesn't declare the dependencies in the pom and it is referencing to a parent pm file. I thought oh ok, dependencies might be declared in parent pom file. Then i checked parent pom...f*ck..parent pom file is not there in the downloaded bundle. WTF.  
  
Then after googling for 20 min finally i found one article on what are the dependencies for using richfaces-4. Finally i was able to run my application.  
  
**By that time I was frustrated and my zeal to experiment on various cool UI widgets that RichFaces is giving was evaporated.**  
  
The reason why I am telling all this is   
"**I agree JBoss AS is great open source app server that comes for free, JBoss technologies like RichFaces, Drools etc etc may be awesome. But with your poor documentation, negligence on usability the developers are getting frustrated before tasting the sweetness of your great technologies. By poor documentation what I mean is when Richfaces depends on some other jars why don't you mention it in the documentation. You should mention it and if you can mention the maven dependency that would be great. By 'negligence on usability' what I mean is you gave a sample applications zip file referencing a parent pom file which is not bundled in that zip. Once you uploaded the samples if at-least once any of you tried to download and use the samples you might realize the absence of parent pom. You just uploaded samples without checking at-least once.**"  
  
With all this how I feel is unless my employer insisted me to use JSF/RichFaces/EJB3 I will never use them.  
When two(JEE6/Spring) technologies can do the same thing I would go with the technology(Spring) which just works as expected.  
  
**I wonder if anyone can write an application using JSF/EJB/CDI without having Google and StackOverFlow(because you will definitely face weird issues and after struggling so much of time you will find a solution in StackOverflow) :-)  
**  
**But I can write an application with just Spring reference documentation :-).   
  
"SPRING ROCKS"**
