---
title: Developing a simple e-commerce application from scratch to production using SpringBoot
author: Siva
type: post
date: 2015-11-20T14:18:35+00:00
url: /2015/11/developing-a-simple-e-commerce-application-from-scratch-to-production-using-springboot/
post_views_count:
  - 83
categories:
  - Java
  - Spring
tags:
  - E-Commerce
  - Java
  - jcart
  - Spring
  - SpringBoot
popular: true
---
We can find plenty of information on any technical topic, be it Java, .NET, Python or any frameworks like Spring, Hibernate, CDI, JSF etc. You can find hundreds of well written blogs on many of these topics. For example, you can find lot of tutorials on how to use SpringBoot or how to use various mappings in JPA/Hibernate or how to do form validations in JSF etc. Also, there are plenty of books published by well established publishers on most of the technologies.

But once the &#8220;Junior Developer&#8221; stage is crossed, many developers would like to learn more about how to design an application, how to modularize the code, what security aspects should be considered, what measures we should take while deploying into production and how to handle the production issues etc.

We can find articles on these topics in bits and pieces but not in an organized manner. So, I thought of starting a series of articles covering &#8220;**How to develop an application from scratch to production?**&#8220;. What I am going to do is I will start developing an application (neither a simple HelloWorld app nor a NextGenerationAwesome product, but a decent size application) and write a series of articles explaining how we can develop the application in a step by step manner.

### Why I am writing these article series?

**To help junior developers:**
  
Every week I receive at least couple of emails from software developers with 1 to 3 years of experiencing for a suggestion.

Those emails goes like this:

> I joined in XYZ company as a fresher and I have been there for the last 2+ years. They put me in a maintenance project where I mostly work on defect fixes and I never really worked on anything from scratch. Now I am not at all confident about my technical skills as I have not implemented anything on my own apart from fixing defects here and there. Here we don't see any new projects in near future. So I want to move to a different company, but I am having a very hard time in clearing the interviews.
> 
> So, could you please advise me how to learn Java the way people use it in real projects, not basic HelloWorld kind of samples? Could you suggest any books, blogs? Should I learn Spring, Hibernate to get a Job?

I feel very sad to see the people in this kind of situation because I know how painful it is. But also simply blaming the company for not giving an opportunity to build something from scratch won't help. Teaching you latest and greatest technologies may not be your organizations top priority.

Some people told they even joined some training institutes to learn Java while working as Java developers!!. But again they are disappointed because they got basic HelloWorld kind of training only, not the way projects are developed in organizations.

So, I thought of helping them by writing a series of articles explaining how the project development from scratch looks like.

**Material for my trainings**
  
I do give trainings on Core Java, Spring and JavaEE. I hope the projects that will be developed for this series may also be helpful for my Java trainings as well.

**I want to learn more** and Teaching is the best way to learn.

### What we are going to do?

We will develop an e-commerce application using Java technologies. We will start from the very beginning of Requirements Gathering and go through all the phases of Analysis, Design, Implementation and Deployment in a step by step manner.

&nbsp;

### Table of contents:

  1. [Introducing the application JCart]({{< relref "2015-11-21-introducing-the-application-jcart.md" >}})
      * High Level Requirements
      * Overview of System Architecture
  2. [Requirements Analysis]({{< relref "2015-11-21-jcart-requirements-analysis.md" >}})
  3. [Selecting The Technology Stack]({{< relref "2015-11-22-selecting-the-technology-stack-for-jcart.md" >}})
      * Platform, Frameworks
      * Application Server, Database
      * IDE, Build Tool, Version Control System (VCS)
      * Continuous Integration, Code Quality Checking
  4. [Release Planning]({{< relref "2015-11-24-jcart-release-planning.md" >}})
      * Plan Iterations & UseCases
      * Estimations & Release Schedules
  5. [Setting up the Development Environment]({{< relref "2015-11-24-setting-up-the-development-environment-for-jcart.md" >}})
  6. Building Administration/ShoppingCart WebApps
      * [Iteration - 1]({{< relref "2015-12-01-jcart-iteration-1.md" >}})
      * [Iteration - 2]({{< relref "2015-12-18-jcart-iteration-2.md" >}})
      * [Iteration - 3]({{< relref "2015-12-20-jcart-iteration-3-manage-categories-and-products.md" >}})
      * [Iteration - 4]({{< relref "2015-12-30-jcart-iteration-4.md" >}})
      * [Iteration - 5]({{< relref "2015-12-31-jcart-iteration-5.md" >}})
      * [Iteration - 6]({{< relref "2015-12-31-jcart-iteration-6.md" >}})
      * [Iteration - 7]({{< relref "2015-12-31-jcart-iteration-7.md" >}})
      * [Iteration - 8]({{< relref "2015-12-31-jcart-iteration-8.md" >}})
  7. Deploying to Production
      * Clustering and Load balancing
      * Setting up Monitoring Tools

&nbsp;

For this whole exercise we will build a ShoppingCart application &#8220;JCart&#8221; using SpringBoot, SpringMVC, Thymeleaf, JPA(Hibernate). I too have this habit of prefixing with J for everything I built with Java :-).

If everything goes as planned and once we finish this application, then probably I will try to implement the same application using JavaEE stack (CDI, EJB, JPA, JSF etc).

Stay tuned 🙂
