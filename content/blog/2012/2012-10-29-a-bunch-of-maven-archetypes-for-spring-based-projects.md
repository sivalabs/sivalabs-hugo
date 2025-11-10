---
title: A bunch of Maven Archetypes for Spring based Projects
author: Siva
type: post
date: 2012-10-29T12:18:00.000Z
url: /blog/a-bunch-of-maven-archetypes-for-spring-based-projects/
categories:
  - Spring
tags:
  - Maven
  - Spring
aliases:
  - /a-bunch-of-maven-archetypes-for-spring-based-projects/
---
Maven is a good project management tool that greatly reduces the amount of time we spend creating Java projects with a proper structure. With so many predefined Maven archetypes, it is even easier to create projects by simply selecting the archetype based on the technologies we need and the type (jar/war/ear) of project we want to create.

However, sometimes those predefined archetypes' structures may not suit our needs well, or we may need some more additions to the pre-configured dependencies/frameworks, etc.

Also, in Eclipse, the default Java compiler level is 1.5, and configuring it to 1.6 every time is frustrating.
So I thought of creating some custom archetypes for the most common combination of technologies/frameworks that I frequently use.

Yes, I am aware of **AppFuse**, which provides a lot more Maven archetypes. But the structure I follow is a bit different, so I thought of creating archetypes that suit my needs/style. 🙂

Most of my projects are Spring-based applications, so I have created the following templates so far:

**1. Quickstart Java App:**
A Simple Java Application with JDK 1.6, SLF4J (Logback/Log4J), and failsafe plugin configuration.

**2. Quickstart Web App:**
A Simple Web Application with JDK 1.6, Servlet 2.5, SLF4J (Logback/Log4J), and failsafe plugin configuration.

**3. Quickstart Spring App:**
A Java project with Spring 3.1.x, MySQL, JdbcTemplate, and Log4j/Logback configuration.

**4. Quickstart SpringMVC App:**
A Web project with SpringMVC 3.1.x, MySQL, JdbcTemplate, jQuery, and Log4j/Logback configuration.

**5. Quickstart SpringMVC-Tiles-SpringSecurity App:**
A Web project with SpringMVC 3.1.x, Apache Tiles, SpringSecurity 3.1.x, jQuery, and Log4j/Logback configuration.

**6. Quickstart SpringMVC-SiteMesh-SpringSecurity App:**
A Web project with SpringMVC 3.1.x, SiteMesh 2.x, SpringSecurity 3.1.x, jQuery, and Log4j/Logback configuration.

**7. Quickstart SpringMVC-JPA2(Hibernate) App:**
A Web project with SpringMVC 3.1.x, JPA2 (Hibernate 4.x), SpringDataJPA, Apache Tiles, jQuery, SpringSecurity, and Log4j/Logback configuration.

**8. Quickstart SpringMVC-MyBatis App:**
A Web project with SpringMVC 3.1.x, MyBatis, jQuery, and Log4j/Logback configuration.

**9. Quickstart Spring-JSF2(PrimeFaces)-JPA2(Hibernate) App:**
A Web project with Spring 3.1.x, JSF2 (PrimeFaces), JPA2 (Hibernate), SpringDataJPA, and Log4j/Logback configuration.

These are the archetypes I have completed so far and uploaded to my GitHub repository: <https://github.com/sivaprasadreddy/maven-archetype-templates>

**I have mentioned how to install them in your local repository in the README file.**

I am planning on writing some more template archetypes, including Spring RESTful Services, Spring-ApacheCXF App, Spring Integration, Spring-JavaEE6, etc.

Stay tuned 🙂
