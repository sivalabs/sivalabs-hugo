---
title: A path to become a Polyglot Programmer
author: Siva
images:
  - /images/polyglot-programmer.webp
type: post
draft: true
date: 2024-07-01T23:29:17.000Z
url: /blog/a-path-to-become-polyglot-programmer
toc: false
categories:
  - Learning
tags:
  - Learning
aliases:
  - /a-path-to-become-polyglot-programmer
---

Nowadays, we are using a wide range of technologies and tools for building modern software systems.
As software developers, we need to keep upskilling ourselves to be able to build the software efficiently.

One question that often pops up is, **should I become a Generalist or a Specialist?**

<!--more-->

**Personally, I highly recommend to be a generalist at the beginning of your career 
so that you can get some experience in building software end-to-end.
Then you can choose your most interesting area to specialize in.**

While there is more demand for generalists (a.k.a fullstack developers.... I know, I know it's a mindset),
there is definitely a need for specialists to solve some specific challenges.

If you choose to be a specialist and if it works for you, that's great.
But many people don't have a choice or like to be a generalist.

Many IT companies are using multiple programming languages, frameworks, and tools 
that are better suited for the project they are building.
Sometimes you may have to work with multiple programming languages in the same projects.
Often you work with a backend developed in Java or Go or Python, etc and build UI using JavaScript or TypeScript etc.
You may have some Serverless workloads for which you might prefer to use Node.js or Go.

**Let's be honest. Mastering every programming language or framework out there is highly difficult, if not impossible.
The good news is you don't have to master everything. You can go far enough knowing just the "Essentials".**

As I said, there can be many reasons why one wants to become a polyglot programmer:

* Working at a service-based company which gets client projects using different programming languages, and you need to pick up a language ASAP.
* Working at a product-based company that builds tools/libraries/SDKs for different programming languages.
* Working as a freelancer and limiting to a specific language will limit the work opportunities.
* Working at a small startup where you may have to do something about everything

I like to be a polyglot programmer for some of the reasons mentioned above.
The way I try to learn is by building a small application covering some common usecases.

Though I won't become a master by building a small sample app in a new language,
it will help me in:

* Getting familiar with the basic syntax of the language
* Get familiar with build tools, dependency management tools, etc
* Get to know the ecosystem

I have come to know about [RealWorld](https://github.com/gothinkster/realworld) which is a great way to learn new technologies.

> "The mother of all demo apps" — Exemplary fullstack Medium.com clone powered by React, Angular, Node, Django, and many more.

I use a similar approach to learning, but with a trimmed down version of the application called [DevZone](https://github.com/fullstack-devzone/fullstack-devzone)

You can find what is the DevZone application, its features and the API endpoint requirements in this [repository](https://github.com/fullstack-devzone/fullstack-devzone).

I have implemented DevZone Backend and Frontend using different languages/frameworks:

## Backend API Implementations

| Name                                                                                                | Description                                                                           |
|-----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| [devzone-api-springboot](https://github.com/fullstack-devzone/devzone-api-springboot)               | Spring Boot, Spring Data JPA, Spring Security, Postgres, Gradle, Testcontainers       |
| [devzone-api-quarkus](https://github.com/fullstack-devzone/devzone-api-quarkus)                     | Quarkus, Hibernate ORM Panache, Postgres, Quarkus JWT Security, Maven, Testcontainers |
| [devzone-api-springboot-kotlin](https://github.com/fullstack-devzone/devzone-api-springboot-kotlin) | Spring Boot, JdbcClient, Spring Security, Gradle Kotlin DSL, Testcontainers           |
| [devzone-api-golang](https://github.com/fullstack-devzone/devzone-api-golang)                       | Go, Gin, pgx, Postgres, golang-migrate, golang-jwt, Testcontainers                    |
| [devzone-api-nestjs](https://github.com/fullstack-devzone/devzone-api-nestjs)                       | NestJS, Passport JWT, TypeORM, Postgres                                               |

## Frontend UI Implementations

| Name                                                                                            | Description                            |
|-------------------------------------------------------------------------------------------------|----------------------------------------|
| [devzone-ui-angular](https://github.com/fullstack-devzone/devzone-ui-angular)                   | Angular 18, Bootstrap                  |
| [devzone-ui-react-typescript](https://github.com/fullstack-devzone/devzone-ui-react-typescript) | React 17, Axios, Bootstrap, TypeScript |

Some of them are 85% done and are in WIP.
I can spin up any Backend instance and any Frontend instance, and they should work.

> **NOTE:**
> Though, I created API and UI as separate apps, nothing prevents me from building a fullstack app using SpringBoot + HTMX or Spring Boot+Vaadin.
> The goal is to learn new technologies.

This way of learning helped me to quickly explore things like:

* Let's apply Hexagonal Architecture and see if it is better.
* Let's see Gradle Kotlin DSL got any better.
* How to live reload Go application
* What are the challenges with using jOOQ with Kotlin
* How cool is Quarkus DevService UI
* Is npm good enough, or should I go for yarn, pnpm, etc.
* etc etc

I enjoy learning things and knowing different languages helped me look at few things in a different way.
I like Go, but it's not my first favourite language. 
After working with Go for some time, I realize how much we over-engineer few things in Java.
It's not Java's fault BTW.

**Anyway, I hope these resources might help some of you. If you would like to contribute, you are most welcome :-)**

**But REMEMBER:**

> Just having strong knowledge in one programming language, Shell scripting, SQL, HTTP/Web Fundamentals, you can be an awesome developer.

Happy learning :-)
