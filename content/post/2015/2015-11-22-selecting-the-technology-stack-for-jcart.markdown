---
author: siva
comments: true
date: 2015-11-22 05:17:20+00:00
layout: post
Url: selecting-the-technology-stack-for-jcart
title: Selecting The Technology Stack for JCart
wordpress_id: 185
categories:
- E-Commerce
- Spring
tags:
- E-Commerce
- Java
- Spring
- SpringBoot
draft : true
---

Selecting the right technology stack is very crucial and plays an important role in project success. Many of the architects (unknowingly??!!) try to make complex designs by trying to use all kinds of latest and greatest stuff. On the other hand some architects try to be in their comfort zone by limiting their technology stack to the technologies with which they are comfortable. Both approaches are dangerous. One should understand the business needs and pick the technologies that are necessary for project.

**Java Platform:** We will be using **Java 8** for JCart so that we can leverage the good features introduced in Java8 like **Streams**, **DateTime** API etc.

**Frameworks:** This is where people go religious about their favourite frameworks. We should consider various factors while choosing the tech stack for any project.



	
  * Needs of the project requirements

	
  * Maturity and stability of the technologies

	
  * Team skills

	
  * Community/Commercial support


For JCart project we need:

	
  * Request-Response oriented MVC web framework for ShoppingCart site. I prefer stateless architecture for public facing web apps.

	
  * Component oriented MVC web framework for Administration site. I prefer UI Component Oriented framework for internal applications like Administration web apps.

	
  * Security framework supporting Role Based Access Control (RBAC)

	
  * A high-level Data Persistence framework

	
  * Other miscellaneous features like Emailing, Scheduling etc


In Java land, JavaEE and Spring are the most popular tech stacks for building applications. Both are very mature and have wonderful community support.

**Spring provides:**



	
  * Request-Response oriented SpringMVC web framework

	
  * Spring doesn't provide any Component Oriented MVC framework. But we can integrate Spring with JSF or Vaadin which are Component Oriented Web MVC Frameworks

	
  * SpringSecurity provides RBAC security

	
  * Spring Data projects provides a very nice abstraction over various Data Access Technologies

	
  * Spring provides support for Emailing and Quartz Scheduler integrations as well.


**JavaEE provides:**



	
  * As of JavaEE7 there is no Request-Response Oriented framework provided by JavaEE. But in upcoming JavaEE8 version a new MVC framework will be released as [JSR 371](https://jcp.org/en/jsr/detail?id=371) . The reference implementation for MVC 1.0 is [Ozark](https://ozark.java.net/index.html). You can find more details on it at [https://ozark.java.net/index.html](https://ozark.java.net/index.html)

	
  * Component Oriented Web MVC framework JSF

	
  * IMHO, Security features provided by JavaEE 7 are not sufficient for many of the applications. But the good news is in the upcoming JavaEE8, [JSR 375: Java EE Security API](https://jcp.org/en/jsr/detail?id=375) will be released.

	
  * JPA ORM framework which you can use with any of the popular implementations like Hibernate, EclipseLink etc. In addition to that you can use **[Apache DeltaSpike](https://deltaspike.apache.org/)**  modules to make things more easier.

	
  * JavaEE also provides support for Emailing and Scheduling features.


Coming to the Team skills, we are more hands-on with Spring technologies than pure JavaEE stack. We can work with both JavaEE and Spring, but we are more productive with Spring. If our team members are more hands-on with JavaEE we would have chosen JavaEE.

So, we are going to use Spring and some of its portfolio projects like Spring Security, Spring Data, Spring Boot etc.


<blockquote>**Note:** As I mentioned, a Component Oriented framework would be more suitable for JCart Administration web app, we will be using SpringMVC with Thymeleaf only. This is a compromise we are making considering the team skills and scope of the project.

**Secret:** Let me tell you a little secret. Come close. The reason I mentioned above for not using any Component Oriented Frameworks is not true. The actual reason is, after completing this application using Spring stack, I am planning to build the same app using pure JavaEE stack (CDI, EJB, JPA, JSF etc). There I am planning to use JSF/PrimeFaces for Administration web app. So we will be hands-on with both Thymeleaf and JSF/PrimeFaces :-)</blockquote>




### What are the tools we will be using?





	
  * **Version Control System:** We will be using **Git** VCS and host our code on **Github**.

	
  * **Build Tool:** I know **Gradle** is so hot these days but I am happy with **Maven**. We will be using Maven for our application.

	
  * **IDE:** As we are using Maven which is IDE agnostic we can use any of our favourite IDE. But our application is heavily depends on Spring technologies we will be using **[STS](https://spring.io/tools/sts)**. Those of you Intellij IDEA fan boys can happily use **Intellij IDEA** :-)

	
  * **Server:** **Tomcat** as embedded server.

	
  * **Database:** **MySQL**. But ideally we should be able to use our application with other databases like Postgres.

	
  * **Tools:** **Jenkins** for CI, **SonarQube** for code quality checking.

	
  * **Production:** While deploying our application in production we may want to use **Apache** or **Ngnix** as our load balancer and use monitoring tools like **Zabbix**. As I am not an expert in this area we will come back and spend some time to take a deep look at the options and pick the tools.




### What about MicroServices, Docker and Cloud stuff?


As I said earlier, we are choosing the technologies based on our project needs. We are not **Netflix**, we are not **LinkedIn** and we are not building the NextAwesomeTechProductOnEarch. Our project needs are simple, our team size is small and we are not going to deploy our application on 128 containers on Cloud, so we are not going to use any fancy container technologies like **Docker**/**Kubertness**. If at all we got scalability problems where we may need to deploy our application on hundreds of servers, that's a good to have problem.


<blockquote>**Remember:** Adding new software/framework/library to a project is easy..Removing is lot harder than you thing. So be careful while adding another software/framework/library.</blockquote>
