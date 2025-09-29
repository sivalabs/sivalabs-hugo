---
title: 'MicroServices using Spring Boot & Spring Cloud – Part 1 : Overview'
author: Siva
images: ["/preview-images/e-learning.webp"]
type: post
date: 2018-03-02T07:59:17+05:30
url: /microservices-using-springboot-spring-cloud-part-1-overview/
categories:
  - microservices
  - springboot
  - springcloud
tags:
  - microservices
  - springboot
  - springcloud
popular: false
---


Nowadays MicroServices is the hot buzzword in software development and many organizations prefer building their enterprise applications 
using MicroServices architecture. In Java community, SpringBoot is the most widely used framework for building both monoliths and microservices. 
I am planning to write a series of articles covering how to build microservices using [SpringBoot](https://projects.spring.io/spring-boot/) 
and [SpringCloud](https://projects.spring.io/spring-cloud/).

<!--more-->


In this article we are going to learn about following:

* Monoliths
* what are MicroServices?
* Advantages of MicroServices
* Challenges with MicroServices
* Why SpringBoot & SpringCloud are a good choice for MicroServices?
* Introducing the application


# Monoliths
Traditionally we are building large enterprise applications in modularised fashion (??!!??) but finally deploy them together as a single deployment unit (EAR or WAR). These are called Monolithic applications.

There are some issues with the monolithic architecture such as:

* Large codebases become mess over the time
* Multiple teams working on single codebase become tedious
* It is not possible to scale up only certain parts of the application
* Technology updates/rewrites become complex and expensive tasks

However, IMHO, it is relatively easy to deploy and monitor Monoliths compared to MicroServices.

# MicroServices
A MicroService is a service built around a specific business capability which can be independently deployed. So, to build large enterprise applications we can identify the sub-domains of our main business domain and build each sub-domain as a MicroService using Domain Driven Design (DDD) techniques. But in the end, we need to make all these microservices work together to serve the end user as if it is a single application.

> You can read more about MicroServices on this famous Martin Fowler blog https://martinfowler.com/articles/microservices.html

## Advantages of MicroServices

* Comprehending smaller codebase is easy
* Can independently scale up highly used services
* Each team can focus on one (or few) MicroService(s)
* Technology updates/rewrites become simpler
 
## Challenges with MicroServices
* Getting correct sub-domain boundaries, in the beginning, is hard
* Need more skilled developers to handle distributed application complexities
* Managing MicroServices based applications without proper DevOps culture is next to impossible
* Local developer environment setup might become complex to test cross-service communications. Though using Docker/Kubernetes this can be mitigated to some extent.

# Why SpringBoot and SpringCloud are a good choice for MicroServices?

**Spring Boot** is the most popular and widely used Java framework for building MicroServices. These days many organizations prefer to deploy their applications in a Cloud environment instead of taking all the headache of maintaining a datacenter themselves. But we need to take good care of the various aspects to make our applications Cloud Native. There comes the beauty of Spring Cloud.

**Spring Cloud** is essentially an implementation of various design patterns to be followed while building Cloud Native applications. Instead of reinventing the wheel, we can simply take advantage of various Spring Cloud modules and focus on our main business problem than worrying about infrastructural concerns.

Following are just a few of Spring Cloud modules that can be used to address distributed application concerns:

**Spring Cloud Config Server:** To externalize configuration of applications in a central config server with the ability to update the configuration values without requiring to restart the applications. We can use Spring Cloud Config Server with git or Consul or ZooKeeper as config repository.

**Service Registry and Discovery:** As there could be many services and we need the ability to scale up or down dynamically, we need Service Registry and Discovery mechanism so that service-to-service communication should not depend on hard-coded hostnames and port numbers. Spring Cloud provides Netflix Eureka-based Service Registry and Discovery support with just minimal configuration. We can also use Consul or ZooKeeper for Service Registry and Discovery.

**Circuit Breaker:** In microservices based architecture, one service might depend on another service and if one service goes down then failures may cascade to other services as well. Spring Cloud provides Netflix Hystrix based Circuit Breaker to handle these kinds of issues.

**Spring Cloud Data Streams:** These days we may need to work with huge volumes of data streams using Kafka or Spark etc. Spring Cloud Data Streams provides higher-level abstractions to use those frameworks in an easier manner.

**Spring Cloud Security:** Some of the microservices needs to be accessible to authenticated users only and most likely we might want a Single Sign-On feature to propagate the authentication context across services. Spring Cloud Security provides authentication services using OAuth2.

**Distributed Tracing:** One of the pain-point with microservices is the ability to debug issues. One simple end-user action might trigger a chain of microservice calls, there should be a mechanism to trace the related call chains. We can use Spring Cloud Sleuth with Zipkin to trace the cross-service invocations.

**Spring Cloud Contract:** There is a high chance that separate teams work on different microservices. There should be a mechanism for teams to agree upon API endpoint contracts so that each team can develop their APIs independently. Spring Cloud Contract helps to create such contracts and validate them by both service provider and consumer.

These are just a few of Spring Cloud features. To explore more visit https://projects.spring.io/spring-cloud/.

> You may also like to read about [Why SpringBoot is so popular and how to learn SpringBoot effectively?](http://sivalabs.in/why-springboot-so-popular-how-to-learn-springboot/)

# Our Sample application
I strongly believe in learning by example. So, let us learn how to build MicroServices using Spring Boot and Spring Cloud with a sample application. I will deliberately keep the application business logic very simple so that we focus on understanding the SpringBoot and SpringCloud features.

We are going to build a simple shopping cart application and assume we are going to start with the following microservices:

* **catalog-service:** It provides REST API to provide catalog information like products.
* **inventory-service:** It provides REST API to manage product inventory.
* **cart-service:** It provides REST API to hold the customer cart details.
* **order-service:** It provides REST API to manage orders.
* **customer-service:** It provides REST API to manage customer information.
* **shoppingcart-ui:** It is customer facing front-end web application.

We are going to build various services and REST endpoints as we go through various microservice concepts.

> Stay tuned for the next post where we are going to create catalog-service and use spring-cloud-config server to have centralized configuration for all our microservices.

