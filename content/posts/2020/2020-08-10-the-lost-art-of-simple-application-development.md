---
title: The lost art of "Simple Application Development"
author: Siva
images: ["/images/checklist.webp"]
type: post
draft: true
date: 2020-08-06T04:59:17+05:30
url: /2020/08/the-lost-art-of-simple-application-development/
categories:
  - Architecture
tags: [Thoughts, Architecture, Simplicity]
---

I am a software developer working in India. Many IT companies in India (at least the companies I worked for) 
are kind of considered as offshore development centers for their main offices in USA, UK etc. 
As a software developer working in an offshore development center I (and many other developers like me) 
usually don't have the luxury of choosing the tech stack or taking any architectural decisions. 

Most of the times our clients(other IT companies) already decides the tech stack and architecture, 
if not then our onsite architecture team take the architectural decisions. 
All we, developers at offshore development centers, have to do is to follow the decisions and meet the timelines.

At best, if you are in an organization with decent work culture you can talk to architects and even question some of their decisions.
Some times we may get valid reasons, and most of the times the reply would be 
"The decision is already taken by architecture board after careful consideration of various aspects" which is a polite way of saying "Shut up and get back to work" :-).

Luckily, I got a wonderful opportunity to work on a new project, and the responsibility of picking up the right tech stack and architectural approach is left to me. Yay!!!

I am very much aware of the latest technology trends such as Java 15, Kotlin, Ktor, SpringBoot, SpringCloud, Spring Cloud Data Streams, Reactive Programming, WebFlux, R2DBC, Docker, Kubernetes, ServiceMesh, Istio, 
Microservices, Serverless, Quarkus, Kafka, KafkaStream, OAuth2.0, Event Sourcing, Axon Framework, GoLang,  ReactJS, VueJS, Svelt, MicroFrontEnd, GraphQL, RxJS, Redis, ElasticSearch...
and I have decent working experience with some of these technologies as well.

I could go crazy with my tech stack selection, but I choose to go with the simplest tech stack (boring tech stack you could say) such as Java 11, SpringBoot, Postgresql, ReactJS and AWS.
Before telling about why I choose that tech stack I would like share some of my thoughts that made me to go in this route.

## Evolution of business needs and Tech landscape
When I started my career in 2006 most of the projects that I worked on are typical web and enterprise applications(banking, insurance domains) using J2EE, Spring, Hibernate etc.
There was no need for processing terabytes or petabytes of data, mobile friendly UI is a nice to have feature only.

Since then things changed a lot with the explosion of mobile usage, social networking platforms, IoT devices etc.
Millions and millions of users producing terabytes of data every minute, and many businesses see lot of opportunities in 
processing that data and getting some interesting insights on user behaviour so that they can offer better services and personalized experience.

There is a lot of technology innovation happened to fulfil those modern business needs. 
Now we have technology to process terabytes of data, understand user behaviour using machine leaning, deep learning etc.

**But, it seems people forget the fact that not every business operates at the scale of Google, Facebook, Twitter etc, 
and they don't have many of those complex scalability problems.**

## My experience with (unnecessary) complexity

### Over enthusiastic architects and developers
### political reasons

## Pragmatic thinking

### Business size and expected growth
### Performance
### Dev vs Prod environment management
### Cost vs Business Value

## Tech Stack Selection (and elimination)
### Monolith vs Microservices
### Event Sourcing
### No Redis Cache
### No ElasticSearch
### JWT vs OAuth Security
### AWS ECS Fargate
### Team Skills



