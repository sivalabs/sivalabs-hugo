---
title: Can MicroServices Architecture Solve All Your Problems?
author: Siva
type: post
date: 2014-11-30T01:21:00+00:00
url: /can-microservices-architecture-solve-all-your-problems/
categories:
  - Thoughts
tags:
  - Thoughts
---
IT is one field where you can find new things coming everyday. Theses days the whole developer community websites are flooded with MicroServices and Docker related stuff. Among them the idea of MicroServices is very exciting and encourages better way of building software systems. But as with any architectural style there will be pros and cons to every approach.

Before discussing what are good and bad sides of MicroServices approach, first let me say what I understood about MicroServices.

> MicroServices architecture encourage to build small, focused subsystems which can be integrated into the whole system preferably using REST protocol.

Now lets discuss on various aspects of MicroServices architecture.

## The dream of every software architect/developer  
First of all the idea of MicroServices is not new at all. From the very beginning our elders suggest to write classes focusing on one Single Responsibility and write methods to do one particular thing and do it well. Also we were encouraged to build separate modules which can perform some functionally related tasks. Then we bundle all these separate modules together and build an application delegating the appropriate tasks to respective modules. This is what we try to do for many year. 

But the idea of MicroServices took this approach to next level where you can deploy each module as an individual deployable unit and each service can communicate with any other Service based on some agreed protocol (preferably REST, another trendy cool thing :-)).

### So what are the advantages of this MicroServices architectures?
 
There are plenty.

  * You will have many small services with manageable codebases which is easy to read and understand.
  * You can confidently refactor or rewrite entire service because there won't be any impact on other services.
  * Each microservice can be deployed independently so that adding new features or upgrading any existing software/hardware platform won't affect other services.
  * You can easily adopt the next cool technology. If one of microservices is very critical service and performance is the highest priority then we can write that particular service using Scala in order to leverage your multi-core hardware support.
  * If you are a service provider company you can sell each service separately possibly making better money compared to selling whole monolithic product.
  * And most important factor is, the term MicroService is cool 🙂

## What is the other side of MicroServices architecture?

As with any approach, MicroServices also has some down sides and associated cost.

> Great power comes with great responsibility. -Uncle Ben

Let us see what are the challenges to implement a system using MicroServices architecture.

**The idea of MicroServices is very simple but very complex to implement in reality.**  
In a monolithic system, the communication between various subsystems are mostly direct object communication. But in MicroServices based system, in order to communicate with other services you may use REST services which means additional HTTP call overhead and its inherent issues like network latency, possible communication failures etc. So we need to consider various aspects while implementing inter-service communication logic such as retry, fail-over and service down scenarios etc.

**How good is your DevOps infrastructure?**  
In order to go with MicroServices architecture, organization should have a good DevOps team to properly maintain the dozens of MicroService applications.  
Do your organization has DevOps culture? Or your organization has the problem of blame game between Devs and Ops? If your organization doesn't have a good DevOps culture and software/hardware resources then MicroServices architecture will be much more difficult to adopt.  

## Are we fixing the actual problem at all?  
Now many people are saying MicroServices architecture is better than Monolithic architecture. 
**But is Monolithic architecture is the actual reason why many projects are failing? Will MicroServices architecture save the projects from failing? I guess NO.**

Think, what were the reasons for your previously failed projects. Are those projects failed because of technology issues or people issues?  
I have never seen a project which is failed because of the wrong technology selection, or wrong architectural approach. But I have seen many projects failing just because of problems with people.

_I feel there are more severe issues than architecture issues which are causing projects to be failed such as:_

  * Having developers without sufficient skills
  * Having developers who don't want to learn anything new
  * Having developers who don't have courage to say &#8220;NO, we can't do that in that time&#8221;
  * Having Architects who abandoned coding years ago
  * Having Architects who think they know everything and don't need to listen to their developers pain
  * Having Managers who just blame the developers for not meeting the imposed deadlines without ever asking the&nbsp; developers for time-lines

These are the real problems which are really causing the project failures.

**Now do you think just moving to MicroServices architecture saves the IT without fixing these problems?**

Continuously innovating new ways of doing things is awesome and is required to move ahead. At the same time assuming &#8220;the next cool methodology/technology will fix all the problems is also wrong&#8221;.

> So those of you who are just about to jump on MicroServices boat..THINK. FIX THE REAL PROBLEMS FIRST. You can't fill a bottle which has a hole at it's bottom.
