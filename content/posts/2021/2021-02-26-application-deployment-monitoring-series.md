---
title: SpringBoot Application deployment and monitoring series
author: Siva
images: ["/preview-images/space-center.webp"]
type: post
draft: false
date: 2021-02-26T04:59:17+05:30
url: /springboot-application-deployment-monitoring-series/
categories: [SpringBoot]
tags: [SpringBoot, DevOps]
---

Few years ago I wrote a series of blog posts on [Developing a simple e-commerce application from scratch to production using SpringBoot]({{< relref "2015-11-20-developing-a-simple-e-commerce-application-from-scratch-to-production-using-springboot.md" >}}).
Well, I covered most of the development stuff but left "to production" part because other things came up. Many things changed since then.

Now I want to write a series of articles focusing on deployment and monitoring.
So, I am planning to build a simple application using SpringBoot and deploy it in different ways.
Along the way I want to learn the things such as infrastructure provisioning, automated deployments and monitoring. 

Let me introduce the sample application that we are going to work on.

## Bookmarks Application

A web application to store bookmarks and users can upvote or downvote the bookmarks.
This application will be developed using microservices based approach.

* **bookmark-service:** A micro-service to manage bookmarks.
* **vote-service:** A micro-service to manage votes for bookmarks.
* **bookmarks-ui:** UI application and also act as API Gateway.

![Bookmarks App](/images/bookmarks-app.webp "Bookmarks")

You can find more details on what goes into each microservice and what APIs will be exposed below under **Services Overview** section.

## Goals
As I mentioned in my [My 2020 year review and plans for 2021]({{< relref "2021-01-21-my-2020-review-and-plans-for-2021.md" >}}), 
I would like to learn more about application deployment and monitoring. The best way to do it is build some application and 
automate the process of deployment and monitoring all by yourself. 

So, here is what I wanted to do:

* Create Build Pipelines using **Jenkins**
* ~~Deploy SpringBoot applications on VMs and **run as fatjars** on **Vagrant** box(using **Ansible**??)~~ 
* ~~Deploy SpringBoot applications on VMs and **run as Systemd services** on Vagrant box(using Ansible??)~~
* Run applications locally using docker-compose
* Implement monitoring using **Prometheus** and **Grafana**
* Implement **centralized logging** using **ELK/EFK** or **Loki**
* Deploy SpringBoot applications on **Kubernetes(Minikube)**
* Deploy SpringBoot applications on **AWS ECS** using **Terraform/Pulumi/AWS CDK**

## Important things to keep in mind
* The **application business logic is intentionally kept very low** because the focus is mainly on deployment automation and monitoring.
  Also, while I can simply add upvotes and downvotes as another 2 columns in bookmarks table without having **vote-service** altogether, 
  I made it separate service so that I can demonstrate **distributed tracing** using **Zipkin** or **Jaeger**. 
  
* **I am not a Linux power user**. To be more precise, except `ls`, `cat`, `tail -f` I google for every linux command and use it. 
  I am familiar with Linux permission system but can never remember what `755` means. 
  So, be prepared for what you are about to watch (you should read the last sentence with Game Of Thrones Ser Davos voice). 
  
* **I am not a DevOps expert either**. I have never setup production grade clusters or configured highly secured AWS infrastructure earlier.
  So, I will try to do as good as I can, but don't expect too much.

## Services Overview

### bookmark-service: 
A micro-service to manage bookmarks using the tech stack **Java 11, SpringBoot 2.x, Postgresql**

#### API Endpoints:

##### 1. Get Bookmarks

**Request:** GET http://localhost:8081/api/v1/bookmarks

**Response:**
```json
[
    {
         "id": 1,
         "title": "bookmark title",
         "url": "url",
         "upVotes": 1,
         "downVotes": 0,
         "createdAt": "",
         "updatedAt": ""
    },
    {
          "id": 2,
          "title": "bookmark title",
          "url": "url",
          "upVotes": 4,
         "downVotes": 2,
         "createdAt": "",
         "updatedAt": ""
    },
]
```

##### 2. Create Bookmark

**Request:** POST http://localhost:8081/api/v1/bookmarks

**RequestBody:**
```json
{
  "title": "bookmark title",
  "url": "url"
}
```

### vote-service: 
A micro-service to manage votes for bookmarks using the tech stack **Java 11, SpringBoot 2.x, Postgresql**

#### API Endpoints:

##### 1. Get votes for given Bookmarks

**Request:** GET http://localhost:8082/api/v1/votes?bookmarkIds=1,2,3

**Response:**
```json
[
    {
         "id": 1,
         "bookmark_id": 1,
         "upVotes": 1,
         "downVotes": 0,
         "createdAt": "",
         "updatedAt": ""
    },
    {
         "id": 2,
         "bookmark_id": 2,
         "upVotes": 4,
         "downVotes": 2,
         "createdAt": "",
         "updatedAt": ""
    }
]
```

##### 2. Up vote a Bookmark

**Request:** PUT http://localhost:8081/api/v1/bookmarks/{bookmarkId}/votes/up

##### 3. Down vote a Bookmark

**Request:** PUT http://localhost:8081/api/v1/bookmarks/{bookmarkId}/votes/down

### bookmarks-ui: 
A UI application to show bookmarks using tech stack **Java 11, SpringBoot 2.x, SpringCloud Gateway, Thymeleaf, Vue.js**.
However, note that it is not a full fledged Vue.js application, 
we will be using Vue.js just for 2-way data binding because life is too short to create UI component HTML as string from JSON response.

#### API Gateway
This application will also act as API Gateway.
The UI will make API calls using proxy URLs, and those calls will be routed to bookmark-service and vote-service.

```
* Path=/bookmarkssvc/** to http://localhost:8081 
* Path=/votessvc/** to http://localhost:8082
```

From UI(Vue.js) the following requests will be made:
* Fetch bookmarks `GET http://localhost:8080/bookmarkssvc/api/bookmarks`
* Create bookmark `POST http://localhost:8080/bookmarkssvc/api/bookmarks`
* Up vote `PUT http://localhost:8080/votessvc/api/bookmarks/{bookmarkId}/votes/up`
* Down vote `PUT http://localhost:8080/votessvc/api/bookmarks/{bookmarkId}/votes/down`

## Summary
I hope this series will make us learn few things about DevOps side of application development and deployment.
In the next article, we will start with some prerequisites and create bookmark-service development.
Stay tuned.