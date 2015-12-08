---
author: siva
comments: true
date: 2011-01-11 01:24:00+00:00
layout: post
slug: infrastructure-glue-to-java-apps
title: Infrastructure glue to Java Apps
wordpress_id: 288
categories:
- Java
tags:
- Java
---

Java is better programming language for building web and enterprize applications with its matured APIs and tons of frameworks to make easier and faster the development. Now we have 100s of frameworks in each area like for web app development we have Struts 1.x/2.x, SpringMVC, JSF etc, for middle tier we have Spring, EJB3, for Ajax based apps we have Dojo, ExtJS, YUI, GWT, Wicket etc.  
  
Even though we have plenty of options to choose the right framework for our application and got most of the required functionality out of it, we still need to write some code for the following irrespective of what framework we are using.  
  
1. Configuration Management  
2. XML Marshalling/Unmarshalling  
3. Converting JSON to Java and Java to JSON  
4. Emailing support  
  
The good news is even for the above mentioned tasks also we have plenty of options.  
I just wanted to put down what are the options we have for the above things. It could be helpful for many if not aware of them.  
  
1. Configuration Management:  
I remember how many times i have written(at least copy pasted) code to load a properties file and provide some convenient methods like getString(), getInt() etc methods. I wondered after knowing that there are some tools to automate this process. The following are the ones i found so far:  
a)[Common-Configuration](http://commons.apache.org/configuration/userguide/user_guide.html)  
b)[JFig](http://jfig.sourceforge.net/)   
c)[JConfig](http://www.jconfig.org/GettingStarted.html)   
  
2. XML Marshalling/Unmarshalling:  
a) [XStream ](http://xstream.codehaus.org/tutorial.html)  
b) [Castor ](http://www.castor.org/reference/html-single/index.html)  
c) [JAXB](http://jaxb.java.net/tutorial) [http://www.vogella.de/articles/JAXB/article.html](http://www.vogella.de/articles/JAXB/article.html)  
  
3. Converting JSON to Java and Java to JSON:  
a) [Jackson JSON Processor](http://jackson.codehaus.org/Tutorial)   
4. Emailing support:  
a) [Spring Email support ](http://static.springsource.org/spring/docs/3.0.x/spring-framework-reference/html/mail.html)  
b) [Commons-email](http://commons.apache.org/email/userguide.html)
