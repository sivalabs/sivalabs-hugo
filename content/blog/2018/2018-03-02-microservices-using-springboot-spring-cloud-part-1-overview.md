---
title: 'MicroServices using Spring Boot & Spring Cloud – Part 1 : Overview'
author: Siva
images:
  - /preview-images/e-learning.webp
type: post
date: 2018-03-02T02:29:17.000Z
url: /blog/microservices-using-springboot-spring-cloud-part-1-overview/
categories:
  - microservices
  - springboot
  - springcloud
tags:
  - microservices
  - springboot
  - springcloud
popular: false
aliases:
  - /microservices-using-springboot-spring-cloud-part-1-overview/
---


Nowadays, "MicroServices" is the hot buzzword in software development, and many organizations prefer building their enterprise applications
using a MicroServices architecture. In the Java community, Spring Boot is the most widely used framework for building both monoliths and microservices.
I am planning to write a series of articles covering how to build microservices using [Spring Boot](https://projects.spring.io/spring-boot/)
and [Spring Cloud](https://projects.spring.io/spring-cloud/).

<!--more-->

In this article, we are going to learn about the following:

*   Monoliths
*   What are MicroServices?
*   Advantages of MicroServices
*   Challenges with MicroServices
*   Why are Spring Boot & Spring Cloud a good choice for MicroServices?
*   Introducing the application

# Monoliths
Traditionally, we have been building large enterprise applications in a modularized fashion (??!!??) but finally deploying them together as a single deployment unit (EAR or WAR). These are called Monolithic applications.

There are some issues with the monolithic architecture, such as:

*   Large codebases become a mess over time.
*   Multiple teams working on a single codebase becomes tedious.
*   It is not possible to scale up only certain parts of the application.
*   Technology updates/rewrites become complex and expensive tasks.

However, IMHO, it is relatively easy to deploy and monitor Monoliths compared to MicroServices.

# MicroServices
A MicroService is a service built around a specific business capability that can be independently deployed. So, to build large enterprise applications, we can identify the sub-domains of our main business domain and build each sub-domain as a MicroService using Domain-Driven Design (DDD) techniques. But in the end, we need to make all these microservices work together to serve the end user as if it is a single application.

> You can read more about MicroServices on this famous Martin Fowler blog: https://martinfowler.com/articles/microservices.html

## Advantages of MicroServices

*   Comprehending a smaller codebase is easy.
*   Can independently scale up highly used services.
*   Each team can focus on one (or a few) MicroService(s).
*   Technology updates/rewrites become simpler.

## Challenges with MicroServices
*   Getting correct sub-domain boundaries at the beginning is hard.
*   Need more skilled developers to handle distributed application complexities.
*   Managing MicroServices-based applications without a proper DevOps culture is next to impossible.
*   Local developer environment setup might become complex to test cross-service communications. Though using Docker/Kubernetes, this can be mitigated to some extent.

# Why are Spring Boot and Spring Cloud a good choice for MicroServices?

**Spring Boot** is the most popular and widely used Java framework for building MicroServices. These days, many organizations prefer to deploy their applications in a Cloud environment instead of taking on all the headaches of maintaining a datacenter themselves. But we need to take good care of the various aspects to make our applications Cloud-Native. Therein lies the beauty of Spring Cloud.

**Spring Cloud** is essentially an implementation of various design patterns to be followed while building Cloud-Native applications. Instead of reinventing the wheel, we can simply take advantage of various Spring Cloud modules and focus on our main business problem rather than worrying about infrastructural concerns.

The following are just a few of the Spring Cloud modules that can be used to address distributed application concerns:

**Spring Cloud Config Server:** To externalize the configuration of applications in a central config server with the ability to update the configuration values without needing to restart the applications. We can use Spring Cloud Config Server with Git, Consul, or ZooKeeper as a config repository.

**Service Registry and Discovery:** As there could be many services and we need the ability to scale up or down dynamically, we need a Service Registry and Discovery mechanism so that service-to-service communication does not depend on hard-coded hostnames and port numbers. Spring Cloud provides Netflix Eureka-based Service Registry and Discovery support with just minimal configuration. We can also use Consul or ZooKeeper for Service Registry and Discovery.

**Circuit Breaker:** In a microservices-based architecture, one service might depend on another service, and if one service goes down, then failures may cascade to other services as well. Spring Cloud provides a Netflix Hystrix-based Circuit Breaker to handle these kinds of issues.

**Spring Cloud Data Streams:** These days, we may need to work with huge volumes of data streams using Kafka, Spark, etc. Spring Cloud Data Streams provides higher-level abstractions to use those frameworks in an easier manner.

**Spring Cloud Security:** Some of the microservices need to be accessible to authenticated users only, and most likely we might want a Single Sign-On feature to propagate the authentication context across services. Spring Cloud Security provides authentication services using OAuth2.

**Distributed Tracing:** One of the pain points with microservices is the ability to debug issues. One simple end-user action might trigger a chain of microservice calls; there should be a mechanism to trace the related call chains. We can use Spring Cloud Sleuth with Zipkin to trace the cross-service invocations.

**Spring Cloud Contract:** There is a high chance that separate teams work on different microservices. There should be a mechanism for teams to agree upon API endpoint contracts so that each team can develop their APIs independently. Spring Cloud Contract helps to create such contracts and validate them by both the service provider and consumer.

These are just a few of the Spring Cloud features. To explore more, visit https://projects.spring.io/spring-cloud/.

> You may also like to read about [Why SpringBoot is so popular and how to learn SpringBoot effectively?](http://sivalabs.in/why-springboot-so-popular-how-to-learn-springboot/)

# Our Sample application
I strongly believe in learning by example. So, let us learn how to build MicroServices using Spring Boot and Spring Cloud with a sample application. I will deliberately keep the application's business logic very simple so that we can focus on understanding the Spring Boot and Spring Cloud features.

We are going to build a simple shopping cart application and assume we are going to start with the following microservices:

*   **catalog-service:** It provides a REST API to provide catalog information like products.
*   **inventory-service:** It provides a REST API to manage product inventory.
*   **cart-service:** It provides a REST API to hold the customer's cart details.
*   **order-service:** It provides a REST API to manage orders.
*   **customer-service:** It provides a REST API to manage customer information.
*   **shoppingcart-ui:** It is a customer-facing front-end web application.

We are going to build various services and REST endpoints as we go through various microservice concepts.

> Stay tuned for the next post, where we are going to create a catalog-service and use a spring-cloud-config server to have a centralized configuration for all our microservices.
