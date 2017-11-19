---
title: 'Update on SpringBoot : Learn By Example book'
author: Siva
type: post
date: 2016-07-30T02:53:50+00:00
url: /2016/07/update-springboot-learn-example-book/
post_views_count:
  - 17
categories:
  - Books
  - Spring
tags:
  - SpringBoot

---
I would like to let you know that I have updated/added the following sections to my [SpringBoot : Learn By Example][1] book.

<img class="size-medium aligncenter" src="/images/sblbe.png" alt="springboot_learn_by_example" width="250" height="200" />

## Additions to existing chapters:

  * **Working with Multiple Databases**
  * **Exposing JPA entities with bi-directional references through RESTful services**

In some of our applications we need to work with multiple databases. For example, we may have a primary database and a reporting database where most the application uses primary database and the application reports will be generated out of reporting database data.

The section **Working with Multiple Databases** explains how to configure multiple databases while using JPA in a SpringBoot application.

As SpringBoot can&#8217;t auto-configure components such as **TransactionManager**s, **EntityManagerFactoryBean**s, **DataSourceInitializer**s for multiple databases automatically, this section will show how to turn-off auto-configuration mechanism for a specific **AutoConfiguration** class and provide the required configuration explicitly.

## Added new chapter : Chapter 16: Deploying SpringBoot Applications.

  * **Running SpringBoot applications in production mode**
  * **Deploying SpringBoot application on Heroku**
  * **Running SpringBoot application on Docker**

In this new chapter I have explained how to run the SpringBoot self-contained jar in production and how to override the configuration properties configured in **src/main/resources/application-*.properties**.

This chapter also covers how we can deploy **SpringBoot + JPA + Postgres** application on [**Heroku**][2] platform by linking to our GitHub repository. We can enable automatic deployment so that whenever we push our changes to our Github repository the updated application will be automatically deployed on Heroku.

Finally, we will learn how to run a **SpringBoot + JPA + Postgres** application on [Docker][3] container. This chapter explains how to run both **Postgres** server and application in separate containers and link them. Then, we will also look into running the docker containers using **DockerCompose** instead of starting them individually.

I hope you will enjoy these new additions. 🙂

 [1]: https://leanpub.com/springboot-learn-by-example/
 [2]: https://www.heroku.com/
 [3]: https://www.docker.com/
