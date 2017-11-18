---
title: A Developers Perspective on Spring vs JavaEE
author: Siva
type: post
date: 2015-06-15T13:04:00+00:00
url: /2015/06/a-developers-perspective-on-spring-vs-javaee/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2015/06/a-developers-perspective-on-spring-vs.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/3966781392716511006
post_views_count:
  - 241
categories:
  - JavaEE
  - Spring
tags:
  - JavaEE
  - Spring

---
In Java community Spring vs JavaEE is a never ending debate. In such debates people form two groups consisting of evangelists, architects and hard core fans of one platform and debate endlessly. Those who participate in the debates may be architects who are responsible for platform selection. But what would developers think about this Spring vs JavaEE debate?

I am a Java developer who uses both Spring and JavaEE and I am not part of Spring or JavaEE fan club. Here I would like to share my own thoughts on this epic Spring vs JavaEE debate.

## 1. Business(sometimes political) Aspects  
In many organizations technology selection may not completely depends on developers choice. More specifically if you are working in so called giant enterprise organizations there are high chances that there is an Architecture Team who will decide what platform/language/framework/libraries to use in the projects.

In addition to that, large enterprises also considers the following aspects while choosing the technology platform:

  * Maturity of the platform/language/framework/libraries
  * Commercial support
  * Licensing cost&nbsp;etc etc

As a developer I can hardly influence the decision making process for any of the above aspects, especially when I am a developer in offshore development center. So I don't worry too much about these things.

## 2. If you are really good at Spring/JavaEE then learning the other one shouldn't be difficult 
I am always surprised when someone says I am JavaEE expert but I can't understand Spring or vice-versa. Both JavaEE and Spring work on the same core APIs (Servlet, JPA, JMS, BeanValidation etc), the difference is who is gluing the things together, Spring or AppServer.

Even though there are some different APIs for things like dependency injection (Spring DI, CDI), REST (JAX-RS, SpringMVC) etc they look and behave pretty similar to each other.

May be someone can say CDI is more typesafe than Spring DI. Doesn't Spring and CDI behaves similarly when:

  * Injection using @Autowired or @Inject works fine if there is only one Spring/CDI Bean
  * Injection fails when there are more than one Spring or CDI bean implementations by throwing errors saying "Found more than one eligible beans that can be inject"
  * Use @Produces or @Bean annotated method to provide custom made objects as bean providers

As long as they are behaving similarly I don't care whether they are implemented in more typesafe manner or used String based mappings in their internal implementations.

How can one be expert in Spring and can't understand JavaEE and vice-versa?? How much time it can take for a Spring expert to learn JavaEE??!!

## 3. Which is more "Average Joe developer" friendly  
I think by now many people should have realized that success of a technology may not be completely depends on its merits, but also based on developers adoption. The most important thing to realize is "Not every software developer is a rock star developer. There are more average joe developers than passionate, tech ninjas". So in order to people adapt any framework it should be "Average Joe Developer" friendly.

I think Spring is doing pretty good job at it by providing more tools like SpringBoot, User Guides etc. Spring Security, Spring Integration, Spring XD, Spring Social addresses the modern business needs very well. Also think about various templates provided by Spring which makes easy to do things without worrying about boilerplate coding.

JavaEE is also doing very well by introducing JBossForge, Wildfly Swarm etc to quickly get started. I came across few JavaEE based frameworks like Picketlink which addresses Security requirements, but I felt it is much more complex than it should be.

The point I am trying to convey is "You can do pretty much everything in JavaEE that you can do with Spring". The difference is which is giving more out-of-the-box to average joe developer.

## 4. Lame arguments without context  
Whenever Spring vs JavaEE debate arises people form two groups and debate endlessly. &nbsp;Unfortunately the debates focus on some useless or outdated points.

**XML heavy:&nbsp;**  
JavaEE fans first start saying Spring is XML heavy and I hate XML blah blah blah. If you are still using Spring older than version 2.5 and assuming it is still same XML based then my friend you should wake up and head to http://spring.io

**EJBs are bad (or) JSF is bad**  
Spring fans jump on to bashing EJB and JSF as if they are same as EJB 2.x or JSF 1.x. If they really look at EJB 3.x and JSF 2.x then they wouldn't argue on this at all. Don't judge EJB 3.x with your 6 years back EJB2.x experience.

**Heavy weight or light weight**  
My interpretation of this 'weight' thing is based on runtime footprint. To my knowledge, when you deploy your managed beans into JavaEE container then container will proxy it and inject all enterprise services (Transactions, Security etc) and in case of Spring it will be done by Spring AOP.  
I don't have any metrics to say which is more heavy weight Container Proxy or SpringAOP Proxy, but I guess there may not be significant difference.  

Some people consider the size of war file as its 'weight'. In that case compare (JavaEE AppServer + war) size with (SpringApp with 126 jars) and see which is light weight 🙂  

**JavaEE is standards based**  
Come on guys!!!!  

**Vendor lock-in**  
I think choosing a platform which doesn't make you stick with one particular vendor is good. But going with an option purely based on the ability to move to a different implementation is not correct. How many times in an year you switch from one server to another? Choosing a platform which doesn't lock you with a vendor is a 'nice to have' but it should not be major factor to choose your platform.

**We don't need external libraries**  
This is called "Arguing for the sake of arguing". Show me any real application without having any dependencies. If you say I will develop my own logging library, I will write my own HTTP client, I will develop my own common-utilities then you need to look for a little bit more lazy architect/developers who doesn't have "Re-invent all the wheels" sickness.  
 
## 5. Don't look at the crowd and say "You are all idiots because you are using X, you should migrate to Y"  
This is a common pattern that I observe on many community sites, especially on Reddit. Just post anything related to JavaEE vs Spring thing and there will be two groups who bash the other group like anything because other group are not using their favorite platform.  
 
Think for a minute. If Spring is not any good why so many people use it and love it. If JavaEE is not good why so many people switch from Spring to JavaEE. There is so many good things in each platform. Respect others for choosing whatever option they choose. If possible ask them the reasons why they went with one over the other and learn if you miss anything.  
 
Just saying "You all are idiots for not using my favorite option" doesn't make them use your favorite technology. In fact it triggers the thought to come up with list of points why your favorite platform sucks.  
 
If you really want them to switch to your favorite platform then show the reasons with code examples. Show them how easy it is to develop applications using your favorite platform with sample applications. Write more articles on commonly facing issues and how to resolve them. Get the "Average Joe Developer" on-board onto your favorite platform.  
 
As an enthusiastic Java developer I read the Spring vs JavaEE discussions hoping there might be few things which I don't know such as "in which areas one is better than the other". But I find 70% of discussions goes on lame arguments which is not very interesting to me.

I wish Spring and JavaEE camps to fight more and more and made their platform superior than the other. End of the day, no matter who win the debate ultimately developers will have more powerful platforms.  
 
