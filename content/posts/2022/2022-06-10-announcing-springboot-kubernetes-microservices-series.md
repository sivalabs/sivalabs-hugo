---
title: Microservices using SpringBoot + Kubernetes Series
author: Siva
images: ["/preview-images/microservices-sb-k8s-1.webp"]
type: post
draft: false
date: 2022-06-10T04:59:17+05:30
url: /microservices-using-springboot-kubernetes-series/
categories: [SpringBoot]
tags: [Java, SpringBoot, Kubernetes]
---
**Microservices** and **Kubernetes** is a widely adopted combination by many organizations.
Because of this lot of developers are also interested in learning how to build microservices and deploy them onto Kubernetes.

**So, I am planning to write a series of articles on how to build an application with few microservices using SpringBoot and deploy them onto Kubernetes.**

The goal of this series is to learn:

* How to build microservices using SpringBoot?
* How to use **Resilience4j** to implement **CircuitBreaker** patterns, **Retry** and **Timeout**?
* How to use **Hashicorp Vault** to manage Secure Configuration Properties?
* How to implement an API Gateway using **Spring Cloud Gateway**?
* How to implement **Distributed Tracing using Sleuth and Zipkin**?
* How to implement **Centralized Logging using ELK stack**?
* How to implement **Monitoring using Prometheus and Grafana**?
* How to run the **microservices on Kubernetes**?
* How to provide application configuration using **ConfigMaps** and **Secrets**?
* How to use **Skaffold** to have better developer experience while running services on Kubernetes?

> If you are a complete beginner to Kubernetes then
I would recommend to go through my [Getting Started with Kubernetes](https://www.sivalabs.in/getting-started-with-kubernetes/) 4-part article series
to get familiar with Kubernetes and how to deploy SpringBoot application on Kubernetes.


## Microservices are new normal?
The word "Microservices" is not a hyped tech trend anymore, it became a new normal.
In the last few years all the applications I worked on are kind of Microservices only.
And I hear from many of my friends also working on extracting a sub-set of features from the existing applications into separate microservices.
In fact, I feel the "microservices" hype cycle reached to a stage where some companies are realizing "microservices are not for them" and they are on their way to settle down to "modular monoliths".
Nevertheless, Microservices architecture seems to be a preferred choice for many organizations.

## Docker revolution
On the other hand **Docker** revolutionised the way we package our applications and run them on Container Orchestration Platforms like **Kubernetes, Docker Swarm, Nomad** etc.
Among them Kubernetes dominates the Container Orchestration Platforms space and is supported by all major Cloud Platforms (**AWS, Azure, GCP**) very well.
While Kubernetes brings it own challenges, it brings the standardization of packaging the applications and running them in the same way irrespective programming languages you use.
Tools like **Helm** greatly simplifies creating the kubernetes deployment manifest files and make it easy to use/distribute as a Chart. 
Many organizations successfully leveraging the Kubernetes platform to achieve better CI/CD maturity level.

## Microservices + Kubernetes + Cloud = Match made in heaven ?
Microservices, Cloud Platforms and Kubernetes seems to go hand-in-hand. 
Running a large number of microservices without having the ability to spin up/down more resources on-demand is just too difficult and Cloud Platforms help in this regard.
Also, if you don't want to tie up heavily with a particular Cloud provider then Kubernetes seems to be an attractive choice.
If you stick to core Kubernetes features (not using features provided by custom kubernetes distributions like **OpenShift** or **Tanzu** etc) 
then it should be relatively easy to port onto another cloud platform. 
Of course, it is a call we need to take whether to leverage the additional benefits these custom kubernetes distributions provide 
or stick to plain kubernetes in the hope of someday we might have to switch to another cloud.

## SpringBoot : The most widely used Java microservice framework
In the Java world **SpringBoot** is still the most used framework for building microservices though there are good competitors(Quarkus and Micronaut) now.
Also, **SpringCloud** modules provides many features that help in running your microservices on Cloud platforms.
However, there is an overlap on the features provided by **Spring Cloud** and **Kubernetes**.

## SpringCloud and Kubernetes Feature Overlapping

### 1. Configuration Management
While SpringCloud provides Spring **Cloud Config Server** to manage centralized configuration with different backends(Git, DB etc) support, 
the preferred approach in Kubernetes is via **ConfigMaps** and **Secrets**.

### 2. Service Registry and Discovery
SpringCloud provides **Spring Cloud Consul** and **Spring Cloud Netflix Eureka** to provide service registration and discovery.
But Kubernetes supports service registration and discovery natively using **Services** and **Ingres**.

### 3. Spring Cloud Circuit Breaker
While building a microservice based architecture taking care of fault tolerance and resilience is a must. 
Also, ability to retry and fallback mechanism is very important to handle unexpected network latencies.
While SpringBoot provides **Resilience4J** integration to tackle these concerns, in the Kubernetes world **ServiceMesh** is used to handle these cross-cutting concerns. 

### 4. API Gateway
While Kubernetes **Services** & **Ingres** can play the role of API Gateway, 
**Spring Cloud Gateway** can provide much more functionality such as Authentication.

### 5. Distributed Tracing
While SpringCloud provides **Spring Cloud Sleuth** and **Zipkin** for distributed tracing, Kubernetes folks typically prefer **OpenTracing** and **Jaeger**.
Also, SpringBoot has integration with OpenTracing and Jaeger as well.
* https://github.com/micrometer-metrics/tracing
* https://github.com/opentracing-contrib/java-spring-jaeger

## The Sample Application 
We are going to build a simple BookStore application with following microservices:

1. **store-webapp:**
This is Web UI which customer can use to browse the available products and place an Order.  
**Tech Stack: Java 17, SpringBoot, Thymeleaf**

2. **api-gateway:** 
This service acts as API Gateway which store-webapp talks to.  
**Tech Stack: Java 17, SpringBoot, Spring Cloud Gateway**

3. **promotion-service:** 
This service store the promotions for products.  
**Tech Stack: Java 17, SpringBoot, MongoDB**

4. **product-service:** 
This service manages the products and exposes the REST API to fetch all available products. 
It fetches promotions from promotion-service and calculate the sale price.  
**Tech Stack: Java 17, SpringBoot, MongoDB**

5. **order-service:** 
This service manages the customer orders. Once it receives an order it will send a message to "new-orders" RabbitMQ queue. 
Also, it receives messages from "processed-orders" RabbitMQ queue and send an email notification to customer.  
**Tech Stack: Java 17, SpringBoot, Postgresql, RabbitMQ**

6. **delivery-service:** 
This service listens to "new-orders" RabbitMQ queue and tries to deliver the customer and 
send a message to "processed-orders" RabbitMQ queue.  
**Tech Stack: Java 17, SpringBoot, RabbitMQ**

![BookStore App](/images/boot-k8s-app.webp "BookStore")

## Development Tools
We are going to use the following tools during the development.

* [Docker](https://docs.docker.com/engine/install/), [docker-compose](https://docs.docker.com/compose/install/)
* [Minikube](https://minikube.sigs.k8s.io/docs/start/) or [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/)
* [Lens](https://k8slens.dev/)
* [Skaffold](https://skaffold.dev/)

We are going to build this application progressively, so make sure you have these tools installed on you computer.

## Summary

I hope this article series would be helpful to the developers who want to learn how to build microservices 
based application and deploy them on Kubernetes.