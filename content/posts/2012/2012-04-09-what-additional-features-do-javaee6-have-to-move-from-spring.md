---
title: What additional features do JavaEE6 have to move from Spring?
author: Siva
type: post
date: 2012-04-09T16:52:00+00:00
url: /2012/04/what-additional-features-do-javaee6-have-to-move-from-spring/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/04/what-additional-features-do-javaee6.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1195562737396828582
post_views_count:
  - 2
categories:
  - JavaEE
  - Spring
tags:
  - JavaEE
  - Spring

---
I am a senior java developer who has to work on the technologies chosen by the application architect.  
At the maximum I can express my opinion on a particular technology, I can&#8217;t make/influence technology selection decision. So I don&#8217;t have a choice of moving from Spring to JavaEE6 or from JavaEE6 to Spring on my official projects.

I strongly believe that as a Java developer I have to keep updated on (at least few) latest technologies.  
So I(many java developers) generally follow java community websites or blogs to have an idea on whats going on in java community. Specifically I do follow updates from some Java Champions or well known popular authors because they might have better vision on what is next big thing in Java space.

Few years back I have seen so many people talking about Spring. Then I started learning Spring and still I just love it. I have been using JavaEE5 for a couple of years and I didn&#8217;t find any feature which Spring is not providing. But recently I am seeing so many articles on &#8220;Moving from Spring to JavaEE6&#8221; for every couple of days. So I thought of giving it a try, I installed NetBeans7.1, Glassfish3.1 and did a simple POC. Its wonderful, I am able to write a simple app in just 10 min.  
Yes, JavaEE6 improved a lot over it predecessors.

**But again I am not seeing anything new which I can&#8217;t do with Spring.**  
OK, let me share my thoughts on the criteria that is chosen by &#8220;Moving from Spring to JavaEE6&#8221; article authors.

**1. So many Jars in WEB-INF/lib**  
Spring application has its dependencies in WEB-INF/lib and JavaEE6 app will have in server lib.  
Even for Spring app, we don&#8217;t need to go and manually download all those Jars, we can use Maven/Ivy or even we can start with an archetype template with all dependencies configured. And its only onetime Job.   
I am not sure will there be any performance improvement by having jars in server lib instead of WEB-INF/lib. If that is the case we can place Spring app dependencies in server lib.

What I am missing here?

**2. Type-safe Dependency Injection**  
From Spring 2.5 we have annotation based DI support using @Autowired and if you are still saying Spring is XML based please take a look at Spring 3.x.  
If you want to give a custom-name to spring bean(in case of multiple implementation for same Interface), you can.  
How is it different from JavaEE6&#8217;s CDI @Injext and @Named?

**3. Convention Over Configuration**  
EJB3 methods are transactional by default, just slap it with @Stateless.  
In Spring we can create a custom StereoType, say @TransactionalServe, like

@Service  
@Transactional  
public @interface TransactionalServe  
{

}  
and we can achieve Convention Over Configuration.  
Did I miss anything here?

**4. Spring depends on JavaEE**  
Of course Spring depends on JavaSE and JavaEE. Spring is just making the development easier.  
You can always use JavaEE APIs like JSF, JPA, JavaMail etc with Spring in easier way.  
Did anybody said Spring came to completely vanish JavaEE?? No.

**5. Standards based, App Server Support, License blah blah blah.**  
These are the things that developers don&#8217;t have much(any) control.  
From a developer perspective, we love whatever makes development easier.

So I am not seeing any valid reason to migrate an existing Spring app to JavaEE6. Till now I didn&#8217;t find one thing which CDI can do and Spring can&#8217;t do. For green field projects just to have depency injection we might not need Spring as we already have CDI in-built in JavaEE6.

**Does JavaEE6 address any of the following:**  
**1. Batch Processing:** Almost all the big enterprises have some batch jobs to run. Does JavaEE6 have any support for implementing them.  
Do you suggest to use Spring Batch or start from scratch in vanilla JavaEE6.  
**2. Social Network Integration:** These days it became very common requirement for web apps to integrate with Social Network sites.  
Again what do you have in JavaEE6 for this?  
**3. Environment Profiles:** In Spring I can have my mock services enabled in Testing profile and my real services in Production profile.  
I am aware of @Alternative, but can we configure more than 2 Alternatives without using String based injection?  
**4. Web application Security:** What is Spring-security&#8217;s counter part in JavaEE6?  
**5.** What about integration with **NoSQL, Flex, Mobile development** etc?

_JavaEE6 got CDI now, so suddenly Spring become legacy!!!! _

**Conclusion: Yeah JavaEE6 has cool stuff now(lately??) but it is not going to replace Spring anyway. Long live Spring.**