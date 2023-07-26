---
title: SpringBoot application deployment and monitoring series - Part 3 - Run Services using DockerCompose
author: Siva
images: ["/preview-images/jenkins-setup.webp"]
type: post
draft: true
date: 2021-07-25T04:59:17+05:30
url: /springboot-application-deployment-monitoring-part-3-run-with-docker/
categories: [SpringBoot]
tags: [SpringBoot, DevOps, Jenkins, Docker, DockerCompose]
---

This is the 3rd part of our [journey to learn SpringBoot application deployment and monitoring series]({{< relref "2021-02-26-application-deployment-monitoring-series.md" >}}).
We are going to setup [Jenkins](https://www.jenkins.io/) build server and configure Pipelines for **vote-service, bookmark-service and bookmarks-ui** microservices.

In this article we are going to learn:
* Create docker-compose.yml with all services configured
* Run all services using docker-compose

You can find the GitHub repositories below:
* **devops-setup** https://github.com/sivaprasadreddy/devops-setup
* **bookmark-service** https://github.com/sivaprasadreddy/bookmark-service
* **vote-service** https://github.com/sivaprasadreddy/vote-service
* **bookmarks-ui** https://github.com/sivaprasadreddy/bookmarks-ui


## Summary 

