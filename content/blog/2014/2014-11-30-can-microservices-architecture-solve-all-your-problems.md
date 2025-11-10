---
title: Can MicroServices Architecture Solve All Your Problems?
author: Siva
type: post
date: 2014-11-30T01:21:00.000Z
url: /blog/can-microservices-architecture-solve-all-your-problems/
categories:
  - Thoughts
tags:
  - Thoughts
aliases:
  - /can-microservices-architecture-solve-all-your-problems/
---
IT is one field where you can find new things coming every day. These days, the whole developer community websites are flooded with MicroServices and Docker-related stuff. Among them, the idea of MicroServices is very exciting and encourages a better way of building software systems. But as with any architectural style, there will be pros and cons to every approach.

Before discussing the good and bad sides of the MicroServices approach, first, let me say what I understood about MicroServices.

> The MicroServices architecture encourages building small, focused subsystems that can be integrated into the whole system, preferably using the REST protocol.

Now let's discuss various aspects of the MicroServices architecture.

## The dream of every software architect/developer
First of all, the idea of MicroServices is not new at all. From the very beginning, our elders suggested writing classes focusing on a single responsibility and writing methods to do one particular thing and do it well. Also, we were encouraged to build separate modules that can perform some functionally related tasks. Then we bundle all these separate modules together and build an application, delegating the appropriate tasks to their respective modules. This is what we have been trying to do for many years.

But the idea of MicroServices took this approach to the next level, where you can deploy each module as an individual deployable unit, and each service can communicate with any other service based on some agreed-upon protocol (preferably REST, another trendy cool thing :-)).

### So what are the advantages of this MicroServices architecture?

There are plenty.

*   You will have many small services with manageable codebases that are easy to read and understand.
*   You can confidently refactor or rewrite an entire service because there won't be any impact on other services.
*   Each microservice can be deployed independently so that adding new features or upgrading any existing software/hardware platform won't affect other services.
*   You can easily adopt the next cool technology. If one of the microservices is a very critical service and performance is the highest priority, then we can write that particular service using Scala in order to leverage your multi-core hardware support.
*   If you are a service provider company, you can sell each service separately, possibly making better money compared to selling a whole monolithic product.
*   And the most important factor is, the term "MicroService" is cool. 🙂

## What is the other side of the MicroServices architecture?

As with any approach, MicroServices also has some downsides and an associated cost.

> Great power comes with great responsibility. -Uncle Ben

Let us see what the challenges are to implementing a system using a MicroServices architecture.

**The idea of MicroServices is very simple but very complex to implement in reality.**
In a monolithic system, the communication between various subsystems is mostly direct object communication. But in a MicroServices-based system, in order to communicate with other services, you may use REST services, which means additional HTTP call overhead and its inherent issues like network latency, possible communication failures, etc. So we need to consider various aspects while implementing inter-service communication logic, such as retry, fail-over, and service-down scenarios, etc.

**How good is your DevOps infrastructure?**
In order to go with a MicroServices architecture, an organization should have a good DevOps team to properly maintain the dozens of MicroService applications.
Does your organization have a DevOps culture? Or does your organization have the problem of a blame game between Devs and Ops? If your organization doesn't have a good DevOps culture and software/hardware resources, then a MicroServices architecture will be much more difficult to adopt.

## Are we fixing the actual problem at all?
Now many people are saying a MicroServices architecture is better than a Monolithic architecture.
**But is a Monolithic architecture the actual reason why many projects are failing? Will a MicroServices architecture save projects from failing? I guess NO.**

Think, what were the reasons for your previously failed projects. Did those projects fail because of technology issues or people issues?
I have never seen a project that failed because of the wrong technology selection or the wrong architectural approach. But I have seen many projects failing just because of problems with people.

_I feel there are more severe issues than architectural issues that are causing projects to fail, such as:_

*   Having developers without sufficient skills
*   Having developers who don't want to learn anything new
*   Having developers who don't have the courage to say, "NO, we can't do that in that time."
*   Having Architects who abandoned coding years ago
*   Having Architects who think they know everything and don't need to listen to their developers' pain
*   Having Managers who just blame the developers for not meeting the imposed deadlines without ever asking the developers for timelines

These are the real problems that are causing project failures.

**Now, do you think just moving to a MicroServices architecture will save IT without fixing these problems?**

Continuously innovating new ways of doing things is awesome and is required to move ahead. At the same time, assuming "the next cool methodology/technology will fix all the problems" is also wrong.

> So those of you who are just about to jump on the MicroServices boat... THINK. FIX THE REAL PROBLEMS FIRST. You can't fill a bottle that has a hole at its bottom.
