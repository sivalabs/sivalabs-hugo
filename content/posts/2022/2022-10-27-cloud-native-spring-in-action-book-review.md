---
title: "Book Review : Cloud Native Spring in Action"
author: Siva
images: ["/raw-images/cnsia-book-cover.jpeg"]
type: post
draft: false
date: 2022-10-27T04:59:17+05:30
url: /cloud-native-spring-in-action-book-review/
categories: [Books]
tags: [SpringBoot, Cloud, Books]
---

I got a chance to review the upcoming [Cloud Native Spring in Action](https://www.manning.com/books/cloud-native-spring-in-action) book by [Thomas Vitale](https://twitter.com/vitalethomas) and here my review of the book.

![Cloud Native Spring in Action](/raw-images/cnsia-book-cover.jpeg "Cloud Native Spring in Action")

## TLDR:
If you know the basics of SpringBoot and want to master the advanced concepts and also understand what "Cloud Native" means and
how to build & deploy production grade SpringBoot applications on Kubernetes then this is the book you are looking for.


## Longer version:

There are many books on SpringBoot that are aimed towards complete beginners to intermediate skilled developers.
But **Cloud Native Spring in Action** book's target audience are developers who have basic knowledge on SpringBoot and looking forward to master the advanced concepts.

* The 1st chapter introduces you to the concept of "Cloud Native" application development and set the stage for coming chapters.
  If you are already familiar with **Cloud Native**, **Kubernetes** and **SpringBoot** then probably you can quickly skim through it.

* From the 2nd chapter onwards you can learn how to build SpringBoot based applications, containerize them using Buildpacks suuport and deploy them on Minikube cluster.

* Then onwards author shows how to build a [BookStore](https://github.com/PolarBookshop) application using microservices architecture using SpringBoot, SpringCloud and Kubernetes.

* Author clearly explained how to build microservices using relational databases like Postgresql using JDBC and R2DBC with Flyway migration tool.

* The next chapters teach you how to implement resiliency, fault-tolerant applications using:
  * Spring WebFlux and ProjectReactor
  * Resilience4j and SpringCloud CircuitBreaker
  * Event driven microservices using RabbitMQ
  * Serverless functions using Spring Cloud Functions

* My favourite topic/chapter among all is about implementing API Gateway using Spring Cloud Gateway. 
  Author explained how to implement API Gateway with resiliency/fault tolerance using Resilience4j, 
  added security using OAuth 2.0 with KeyCloak.

* Author also covered lot of concepts around deployment using"
  * GitHub Actions to build CI pipeline
  * docker-compose based local dev environment setup
  * Creating Kubernetes YAML manifest files and also using Kustomize to prepare production grade deployment manifests.

* Monitoring and Observability is very crucial in production. Author explained how to use Prometheus, Grafana, Loki, OpenTelemetry and Tempo to setup Observability stack.

* Finally, concluded with complete production deployment setup using Kustomize, ArgoCD and GitHub Actions.

## Couple of things that could be improved
* Many people are currently using Spring Cloud modules which can be replaced with some Kubernetes features such as Service Registry, Ribbon Load Balancer etc.
  Having a mapping from Spring Cloud features to Kubernetes would help the migration path. Something like https://dzone.com/articles/deploying-microservices-spring-cloud-vs-kubernetes
* KeyCloak server setup is done via CLI commands, but for beginners it would be easy to do it from UI. And, then showing how to export the realm and creating KeyCloak server using that realm config would have been great.

## Conclusion
> Overall the **Cloud Native Spring in Action** is a must-read for every developer who are interested to learn building production grade SpringBoot applications and deploy them on Cloud.

The sample code at https://github.com/PolarBookshop can be taken as a reference for building Cloud Native SpringBoot applications.
