---
title: 'Update on SpringBoot : Learn By Example book'
author: Siva
type: post
date: 2016-07-30T02:53:50.000Z
url: /blog/update-springboot-learn-example-book/
categories:
  - Books
  - Spring
tags:
  - SpringBoot
aliases:
  - /update-springboot-learn-example-book/
---
I would like to let you know that I have updated/added the following sections to my [SpringBoot: Learn By Example][1] book.

{{< figure src="/images/sblbe.webp" alt="SpringBoot : Learn By Example"  width="250" height="200" >}}

## Additions to existing chapters:

*   **Working with Multiple Databases**
*   **Exposing JPA entities with bi-directional references through RESTful services**

<!--more-->

In some of our applications, we need to work with multiple databases. For example, we may have a primary database and a reporting database, where most of the application uses the primary database and the application reports will be generated out of the reporting database's data.

The section **Working with Multiple Databases** explains how to configure multiple databases while using JPA in a Spring Boot application.

As Spring Boot can't auto-configure components such as **TransactionManagers**, **EntityManagerFactoryBeans**, and **DataSourceInitializers** for multiple databases automatically, this section will show how to turn off the auto-configuration mechanism for a specific **AutoConfiguration** class and provide the required configuration explicitly.

## Added new chapter: Chapter 16: Deploying SpringBoot Applications.

*   **Running Spring Boot applications in production mode**
*   **Deploying a Spring Boot application on Heroku**
*   **Running a Spring Boot application on Docker**

In this new chapter, I have explained how to run the Spring Boot self-contained jar in production and how to override the configuration properties configured in **src/main/resources/application-\*.properties**.

This chapter also covers how we can deploy a **Spring Boot + JPA + Postgres** application on the [**Heroku**][2] platform by linking to our GitHub repository. We can enable automatic deployment so that whenever we push our changes to our GitHub repository, the updated application will be automatically deployed on Heroku.

Finally, we will learn how to run a **Spring Boot + JPA + Postgres** application on a [Docker][3] container. This chapter explains how to run both the **Postgres** server and the application in separate containers and link them. Then, we will also look into running the Docker containers using **Docker Compose** instead of starting them individually.

I hope you will enjoy these new additions. 🙂

 [1]: https://leanpub.com/springboot-learn-by-example/
 [2]: https://www.heroku.com/
 [3]: https://www.docker.com/
