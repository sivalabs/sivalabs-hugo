---
title: Next level of Don’t Repeat Yourself(DRY) principle
author: Siva
type: post
date: 2011-01-30T13:16:00+00:00
url: /2011/01/next-level-of-dont-repeat-yourselfdry-principle/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/01/next-level-of-dont-repeat-yourselfdry.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2042000747601628116
post_views_count:
  - 6
categories:
  - Misc
tags:
  - Best Practices
  - Design Patterns
  - Java

---
We are building the software applications using various languages for several years. Over the time new frameworks, new tools, new methodologies have came up. Especially in Java platform, now we have plenty of choices in each area following various design patterns and principles like MVC, FrontController etc.

We have many development principles like KISS(Keep It Simple Stupid), DRY(Don&#8217;t Repeat Yourself) which encourages to write better code which is maintainable. Especially DRY principle is a very good one which every developer should understand and follow.

The DRY principle is stated as **&#8220;Every piece of knowledge must have a single, unambiguous, authoritative representation within a system.&#8221; **

So the DRY principle is saying that if you need to write same piece of code at many places instead of copy-pasting make it as a separate method and use it wherever it is required. This is applying DRY at code level.

I really really appreciate the Jakartha-Commons Utils authors for practically implementing DRY principle. Whenever i need a utility like some String operation, Date calculation, Regular expressions, Properties loading etc etc I just open the Jakartha-Commons website and i am sure i can find there what i need.  
Even though each application has its own set of business requirements there are many things which are common to web/enterprise applications. Especially infrastructure code might be similar to many applications.

**Now I think it is time to take DRY priciple to the next level, I mean to apply at functional level.**

Let us see where we can apply DRY at functional level. The following are some of the things where we can build reusable components/small projects which we can directly use with other projects.

**1. An application multi-level menu bar:**  
I have seen many applications having a horizantal menu bar at the top of the page with single/multi level sub-menus. The menu bar can be build using Javascript or custom tags. What I am suggesting is if we can build a CustomTag to generate a Menu bar from an xml configuration and a style sheet that component can be used in any of hte projects.

For Ex:

we can create an xml structure for our menu as follows and create a customtag to parse that xml and render a menu bar with default stylesheet. If user is proved a custom stylesheet that custom tag will use that.

<pre>&lt;menubar><br />&nbsp;&nbsp;&nbsp; <br /><br />

<menu>
  <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;index>1&lt;/index><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;name>File&lt;/name><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;index>1&lt;/index><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;name>New&lt;/name><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;index>2&lt;/index><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;name>Save&lt;/name><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; .....<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; .....<br />&nbsp;&nbsp;&nbsp; &lt;/item>&lt;/item>&lt;/item>&lt;/item>
</menu>

<br />&nbsp;&nbsp;&nbsp; <br />

<menu>
  <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;index>2&lt;/index><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;name>Edit&lt;/name><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;index>1&lt;/index><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;name>Cut&lt;/name><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;item><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;index>2&lt;/index><br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;name>Copy&lt;/name>&lt;/item><br />&lt;/menubar><br />
</menu>

<br /></pre>

**2. Role-based authentication and authorization system:**  
I involved in many projects where the application users will have one or more roles and each role has one or more privileges. Each privilege is nothing but an action that a use will do in appliation. The whole application events will driven by role based authorization. And also there could be a requirement to create user groups and assign privileges to user groups instead of individual users.

I think this Role based Authorization System can also be built as a component which we can plug in to any project.

**3. Job Scheduling:**  
For many enterprises there could be several batch jobs that should be run on perticular schedules. I think there a need to build a job scheduling web application with the following features:  
&nbsp;&nbsp;&nbsp; a) A web based UI to create and schedule new jobs   
&nbsp;&nbsp;&nbsp; b) Provision to track the status of the running jobs   
&nbsp;&nbsp;&nbsp; c) Provision to run jobs in adhoc manner  
&nbsp;&nbsp;&nbsp; d) Provision to reschedule, terminate a job  
&nbsp;&nbsp;&nbsp; e) Informing the concerned groups about the status of jobs through emails  
&nbsp;&nbsp;&nbsp; f) Automatic email notifications on job failures

we can build a web application with the above mentioned features and leaving business logic implementation in the jobs for the developers.

**4. Sophisticated logging system:**  
While developing the application logging plays a vital role in debugging the problems. We can use AOP for logging in a better way with cleaner approach. Many times the developer needs to check what parameters are sending to methods and where it is throwing an exception. 

For this we can write MethodParamsDumbperAspect using SpringAOP+AspectJ which will display the method parameter values using reflection/commons-beanutils. Only thing a developer need to configure is the base package name.

**5. Configurable and customizable work-flow engine**:  
I have seen many intranet portals having HelpDesk applications with the following features.

1. A customer will raise a request.  
2. The system will identify the workflow to process the request and the request will be routed to the concern person.  
3. The requester can view the status of his request as each stpe is in progress.

Like this there are many WorkFlow based systems. We can build a generic workflow engine where in the administrator can setup the metadata like Request Types, Steps for each request, Request Status codes etc.

**So here my point is all these days we followed DRY in writing code. Let us take it to the next level in building components/sub-projects. If an architect or developer got a requirement to build a reusable component, it would be great if he/she can publish his/her approach (and code if possible) so that the other developers across the java community can use the approach/code instead of reinventing the wheel.**

I am planning to build a JobScheduling Server with the above mentioned features. If anyone is interested you can join me 🙂