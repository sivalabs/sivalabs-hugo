---
title: Why I am excited to join AtomicJar
author: Siva
images: ["/images/AtomicJar.webp"]
type: post
draft: false
date: 2022-11-01T04:59:17+05:30
url: /why-i-joined-atomicjar/
categories: [Career]
tags: [Testcontainers, AtomicJar, Career]
---

After working as a Developer/TechLead/Architect for around 16 years, I am joining [AtomicJar](https://www.atomicjar.com/) as a **Developer Advocate**.
Here are a few reasons why I am so excited about this new role and specifically why I am joining **AtomicJar**.

[![AtomicJar](/images/AtomicJar.webp "AtomicJar")](https://www.atomicjar.com/)

## 1. Developer Happiness
We talk about **Developer Productivity** and various tools and techniques that could improve the productivity all the times.
In addition to productivity, I am very keen on **Developer Happiness**. I strongly believe that people do their best work when they are happy.
When I think about what are some of the pain-points that make developers unhappy and stressful, the following two things come to my mind.

1. Many times we work on brown-field projects and not being in a position to say "does this tiny change break any other functionality?"
2. Need to fix a high-priority production bug, but we don't have an easier way to reproduce the problem before fixing it.

These are the 2 things I, (I hope many others also), suffered the most while working with large codebases.

When I think about how we can fix these problems, the solution is obviously having a TestSuite.
**But the modern applications are using a wide range of services like databases, message brokers, NoSQL data stores etc and writing integration tests is a challenge.**
That's when I found [Testcontainers](https://www.testcontainers.org/) which makes writing integration tests a breeze.

[![Testcontainers](/images/testcontainers-logo.webp "Testcontainers")](https://www.testcontainers.org/)

I like unit tests for verifying whether my units are working or not, but I care more about whether the whole system is working or not.
To me integration tests give more confidence whether a feature is working as expected or not by talking to the real services(databases, queues etc) instead of mocks.

Once I started using Testcontainers it became a default testing library in my toolbox.
With Testcontainers I can write integration tests so that it will be easier to know whether my tiny change is breaking any other functionality and also relatively easy to reproduce a production bug.

> **I love to share what I learned about Testcontainers with other developers and help them to build better quality software.
I am glad that as a Developer Advocate this is one of my primary goals.**

## 2. Ambitious Goal
Let's accept the fact that the modern software development became more complex these days.
In order to meet the complex application requirements such as high scalability, resiliency and fault-tolerance we are using wide range of tools and leveraging Cloud Computing capabilities.
This is adding lot of complexity on developer environment setup and is asking for more beefy hardware.

Many innovative solutions are coming up to handle this problem such as [Gitpod](https://www.gitpod.io/), Microsoft's [Codespaces](https://github.com/features/codespaces) etc.
There is going to be more focus on [improving the Developer Experience(DX)](https://www.atomicjar.com/2021/12/why-will-2022-be-the-year-of-devtools-2-0/) in the coming years.

**AtomicJar** is aiming to solve such a similar problem but for testing with [Testcontainers Cloud](https://www.testcontainers.cloud/) by providing a cloud based environment to run containers so that developers can run their integration tests much faster.
You can use Testcontainers Cloud on developer machines, CI environments and get faster feedback.

> **I truly believe Testcontainers Cloud is going to help developers in building better quality software and I want to be part of such an ambitious goal.**

## 3. Awesome Team
I haven't played chess for many years, but one thing that my chess teacher told me stuck with me forever.

> **Always play with a better player than you so that you will get better  and reach their level sooner or later.**

AtomicJar an amazing group of people whom I respect a lot and I have been following their work in OpenSource world for a long time.
It's truly an honour to work with such amazing talented folks.

If you haven't used Testcontainers yet, then I strongly recommend you to go to https://www.testcontainers.org/ 
and get a feel of how to write integrations tests in frictionless way using Testcontainers.