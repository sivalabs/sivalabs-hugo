---
title: "Announcing FeatureTracker Application"
author: Siva
images: ["/images/feature-tracker.webp"]
type: post
draft: false
date: 2025-06-18T04:59:17+05:30
url: /blog/feature-tracker-application-announcement
aliases: ['/feature-tracker-application-announcement']
toc: false
categories: [Microservices]
tags: [Java, SpringBoot, IntelliJ, Microservices]
---

As a Java Developer Advocate at JetBrains, I frequently demonstrate IntelliJ IDEA features through videos and articles. To do this, I usually create small demo applications focused on specific features. While this works well initially, the number of such applications grows quickly. Soon, it becomes difficult to remember which app was built for what purpose, turning it into a maintenance headache.

<!--more-->

Some of the newer features in IntelliJ IDEA, like [Spring Debugger](https://www.jetbrains.com/help/idea/spring-debugger.html) and [Workspaces](https://blog.jetbrains.com/idea/2024/08/workspaces-in-intellij-idea/), require more complex applications to showcase their capabilities effectively.

* [Spring Debugger Features Preview in Tweets](https://x.com/intellijidea/status/1927686185247215911)
* [Workspaces in IntelliJ IDEA](https://blog.jetbrains.com/idea/2024/08/workspaces-in-intellij-idea/)
* [IDE Workspaces Development: Challenges and Plans](https://blog.jetbrains.com/idea/2025/03/ide-workspaces-development-challenges-and-plans/)

Although PetClinic is a popular demo application, I find it too small and limiting for my needs.

So, we decided to build a more realistic application using a wide range of technologies.

## Introducing Feature Tracker
Feature Tracker is a centralized platform for product teams and users to track the implementation status of features across multiple products, monitor release cycles, and identify areas for improvement. It also collects user feedback and provides insights into which features are most appreciated by users.

### Technical Architecture
Feature Tracker application will be developed following Microservices architecture principles and best practices. 

The following are some of the key services identified so far for the feature-tracker application:

#### Infrastructure Components
* **Keycloak**: Keycloak will be used as an OAuth 2.0 Authorization Server for microservices.
* **config-server**: Spring Cloud Config Server to provide centralized configuration management for microservices.
* **api-gateway**: Spring Cloud Gateway that will act as an API Gateway for all microservices.

#### Microservices
* **User Service**: Manages user profiles and fetches user information from Keycloak.

  **TechStack:** Java, Spring Boot, Spring Security OAuth, Keycloak, Maven

* **Feature Service**: Manages products, releases, and features.

  **TechStack:** Java, Spring Boot, PostgreSQL, Spring Data JPA, Flyway, Redis, Kafka, Spring Security OAuth, Testcontainers, Maven

* **Notifications Service**: Listens for events and sends notifications via email.

  **TechStack:** Kotlin, Spring Boot, Kafka, Email, Testcontainers, Gradle

* **Search Service**: Stores searchable data and provides APIs for faceted search.

  **TechStack:** Kotlin, Spring Boot, ElasticSearch, Testcontainers, Gradle

* **Media Service**: Manages storage for media files like images and videos.

  **TechStack:** Java, Spring Boot, Spring Security OAuth, AWS S3, LocalStack, Testcontainers, Gradle

* **Analytics Service**: Tracks metrics such as product usage and user engagement.

  **Tech Stack:** Java, Spring Boot, WebFlux, Kafka, Timeseries DB, Spring Security OAuth, Testcontainers, Maven

* **Angular Frontend**: Frontend UI using Angular SPA.

  **TechStack:** Angular, Keycloak-js, PrimeNG, TailwindCSS

## Getting Started with Feature Tracker
Feature Tracker is an open source application under **active development phase**.

The first version v0.0.1 of the Feature Tracker application is released.
All the code is available at https://github.com/feature-tracker.

This release includes:

* Initial setup of keyclaok, config-server, api-gateway
* Initial setup of feature-service, user-service, notification-service
* Initial setup of Angular Frontend

To get started with the Feature Tracker application, please follow the instructions at https://feature-tracker.github.io/.

**Demo of Feature Tracker 0.0.1**

{{< youtube we1afMhOLAQ >}}

## How to contribute?
* Run the application and let us know if you face any issues
* Review the code and create issues if there is something to be improved
* Create issues to request new features or share your ideas

Contributions are most welcome :)
