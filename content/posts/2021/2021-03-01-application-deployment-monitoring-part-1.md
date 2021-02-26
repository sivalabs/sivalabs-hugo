---
title: Application deployment and monitoring series - Part 1 - Build Services
author: Siva
images: ["/preview-images/space-center.webp"]
type: post
draft: true
date: 2021-03-01T04:59:17+05:30
url: /2021/03/application-deployment-monitoring-part-1/
categories: [SpringBoot]
tags: [SpringBoot, DevOps]
---

This is the first part of our [journey to learn SpringBoot application deployment and monitoring series]({{< relref "2021-01-28-application-deployment-monitoring-series.md" >}}).
We will be using the following tools throughout the process, so please install them based on your operating system.

### Prerequisites
* Java 11, Maven (I would recommend using [SDKMAN](https://sdkman.io/) to install these tools)
* [Docker](https://www.docker.com/), [docker-compose](https://docs.docker.com/compose/)
* [VirtualBox](https://www.virtualbox.org/)
* [Vagrant](https://www.vagrantup.com/)
* [Ansible](https://www.ansible.com/)
* [Minikube](https://minikube.sigs.k8s.io/docs/)

I will be using MacOS, Intellij Idea and shell scripting. 
You can use your favorite IDE, but try to use *nix like environment (Linux or MacOS) to be able to run those shell scripts.

Let's define our goals for Iteration-1.

* Implement **bookmark-service**, **vote-service** and **bookmarks-ui** applications
* **Setup Jenkins** build server
* Create 3 **VMs using Virtualbox and Vagrant**
* Deploy services on VMs and run them as fatjars

## Implement services
As our bookmarks application is a simple application, and our main focus is on deployment automation,
I have implemented the services and pushed the code into following repositories on GitHub.

* bookmark-service https://github.com/sivaprasadreddy/bookmark-service
* vote-service https://github.com/sivaprasadreddy/vote-service
* bookmarks-ui https://github.com/sivaprasadreddy/bookmarks-ui

The **bookmark-service** and **vote-service** are pretty standard SpringBoot applications using
**Spring Data JPA, FlywayDB Migrations, Spring MVC REST APIs** with **Swagger UI** and **CORS** configured.

The **bookmarks-ui** is implemented as **Spring Cloud Gateway** and also contains UI.
There is only one HTML page which uses **VueJS** to fetch bookmarks, render them using 2 way data binding.
All the REST API calls invoke Gateway URLs which will forward the requests to **bookmark-service** and **vote-service**.

* **bookmark-service** runs at http://localhost:8081/
* **vote-service** runs at http://localhost:8082/
* **bookmarks-ui** runs at http://localhost:8080/

The SpringCloud Gateway routes are configured as follows:

```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: bookmarks_route
          uri: http://localhost:8081
          predicates:
            - Path=/bookmarkssvc/**
          filters:
            - StripPrefix=1
        - id: votes_route
          uri: http://localhost:8082
          predicates:
            - Path=/votessvc/**
          filters:
            - StripPrefix=1
```

So, from UI to load bookmarks we make call to **http://localhost:8080/bookmarkssvc/api/v1/bookmarks**. 
Then SpringCloud Gateway forwards this request to **http://localhost:8081/api/v1/bookmarks**.

Now that we have our services implemented, let's start setting up Jenkins build server 
and configure the Pipelines for our services.

## Summary 
In the next article we will work on creating a VM using **Vagrant** and setting up Jenkins build server in that VM.
