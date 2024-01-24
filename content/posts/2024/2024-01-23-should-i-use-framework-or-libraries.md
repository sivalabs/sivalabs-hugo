---
title: "Should I use a framework or libraries?"
author: Siva
images: ["/preview-images/framework-vs-libraries.webp"]
type: post
draft: false
date: 2024-01-23T04:59:17+05:30
url: /should-i-use-framework-or-libraries
categories: [Tech, Architecture]
tags: [Tech, Architecture]
---

In the software development world, trends come and go, and often we go through the same cycle again and again.
It seems 2024 is the year of **"Framework vs Libraries"** debate. I mean this debate is not new, but it is getting louder again.

For example, most of the Go community prefers to use libraries instead of a framework.
The Java community is divided into two groups, one prefers to use Spring Boot or Quarkus or Micronaut, and the other prefers to use libraries.

I would like to share my thoughts on this topic.

## What is a Framework vs Libraries debate?
For building an application, you can use a framework which provides core foundation, 
and you can implement your application following the framework's guidelines.
The framework provides integration points with libraries to build your application.

Or you can use only the necessary libraries to build your application, and you are responsible to integrate all the libraries properly.

There are pros and cons to each approach.

### Using libraries
Some developers prefer to use the necessary libraries and integrate them to build an application.

**Pros:**
* You use only the required libraries for your application.
* You have better control over the application design.
* This approach might result in a smaller application size and memory footprint.

**Cons:**
* You are responsible for integrating all the libraries and making them work together properly.
* New team members need to learn how the libraries are integrated in each application.
* Badly integrated libraries can result in performance issues, memory leaks, security vulnerabilities, etc.

### Using a framework
Some developers prefer to use a framework that provides a core foundation and integration support with most commonly used libraries.

**Pros:**
* As the framework provides a core foundation, you can focus on building your application.
* The framework authors already spent time integrating the libraries, well tested and documented.
* Hiring/Onboarding new team members is relatively easy as they can leverage their existing knowledge of the framework.

**Cons:**
* The framework might have a lot of features that you don't need for your application, but will result in consuming more CPU/Memory resources.
* You need to follow the framework's way of doing things, which sometimes imposes restrictions on your application design.
* Customizing the framework to meet your application needs might require extensive knowledge on internals of the framework.

## My Preference
As always, the correct and not very useful answer to any **"this vs that"** question is **"It depends"**.

Personally, I prefer to use a framework for building applications unless the performance is the most important factor.

In my experience, most of the teams consist of developers with varying levels of experience and skills.
In such cases, using a framework helps to onboard new team members quickly and reduces the learning curve.
Unless the team is highly skilled in the libraries they are using, they are going to create a home-grown less efficient framework anyway.

Also, not every application has to cater to millions of users under sub-second performance requirements.
Most of the applications are built to solve a business problem, and the performance requirements are not that high.

Using a proven battle-tested framework helps to build applications quickly and focus on solving the business problem.
There will be enough resources to learn and get help from the community.

There is a flip side to this approach too. Some frameworks have a steep learning curve, and it might take some time to properly learn and use it.
I have seen many people horribly misusing the framework and creating a mess.

I prefer to invest some time in learning the framework and use it properly.
So, unless there is a strong reason to use libraries and glue things together myself, I prefer to use a framework.

What is your preference and why? Please share your thoughts in the comments section below.
