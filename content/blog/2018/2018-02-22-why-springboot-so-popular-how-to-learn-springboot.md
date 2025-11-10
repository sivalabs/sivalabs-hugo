---
title: Why SpringBoot is so popular and how to learn SpringBoot effectively?
author: Siva
images:
  - /preview-images/learn.webp
type: post
date: 2018-02-22T02:29:17.000Z
url: /blog/why-springboot-so-popular-how-to-learn-springboot/
categories:
  - springboot
tags:
  - springboot
aliases:
  - /why-springboot-so-popular-how-to-learn-springboot/
---


Spring Boot is the most popular and widely used Java framework.
This discussion of **“Why is Spring Boot so popular?”** occasionally comes up between me and
my friends/colleagues. Also, I get emails from various people asking, **“Spring is huge; how can I learn it quickly?”**.
In this post, I will try to answer these two questions.

<!--more-->

# Why is Spring Boot so popular?
There could be many reasons why Spring and Spring Boot are very popular, but in my opinion, the following are the key reasons:

## 1. Drastic increase in developer productivity
Spring Boot’s powerful auto-configuration mechanism makes it very easy to get started with a Spring-based application. More importantly, Spring Boot offers a wide array of Starters, which is more than sufficient for many applications.

You can create a REST API backed by a database by simply creating a project, selecting Web, Spring Data JPA/Mongo, etc., H2/EmbeddedMongo, and Spring Data REST starters, and then create your domain entity and Repository. That’s it; you have a fully functional REST API.

This lowers the entry barrier for newbies. For those who are familiar with how to configure all of these manually, have probably done it hundreds of times, and are tired of writing this boilerplate, Spring Boot is a gift.

## 2. Simplified Higher-Level Abstractions
One of the primary goals of Spring and Spring Boot is to make things easier. The Spring portfolio has its own powerful Web MVC framework and Spring Security framework, but the majority of its other projects are to provide higher-level abstractions to make using them easier.

For example, Spring Data JPA makes using JPA very easy by providing APIs to perform CRUD operations, sorting, and pagination without requiring you to implement all of them by yourself.

Spring AMQP or Spring for Kafka provides higher-level abstractions so that you can easily work with RabbitMQ or Kafka without writing low-level boilerplate code.

## 3. Microservices and Cloud-Native friendly
The microservice architecture is the latest hot trend now, and many organizations prefer a microservices architecture and want to deploy their applications in cloud environments like AWS, CloudFoundry, etc.

Usually, Spring Boot applications are built as self-contained deployment units (FAT JARs), and using its Profiles concept, we can deploy the same application in multiple environments without any code changes. In addition to that, Spring Cloud modules provide a great set of features required for building cloud-native microservices.

## 4. Addresses modern business needs
Modern application needs have changed and are continuously changing rapidly. We can’t wait for a 3 to 4-year release cycle to get new features. We need frameworks with rapid release cycles to support these business needs.

Spring at its core is just a Dependency Injection (DI) container. But the power of Spring comes from its rich set of portfolio projects. You want to use NoSQL databases, you want a robust Security framework, you want to integrate with Social platforms, you want to work with Big Data frameworks, you want to use Streaming platforms like Kafka… you are all covered.

![Spring Ecosystem](/images/spring-ecosystem.webp "Spring Ecosystem")

## 5. Spring Developer Community
This is the best part of the Spring framework. You can find a million blogs with fantastic blog posts on the Spring framework. You can almost find a solution to every problem on StackOverflow. You can reach out to the Spring Developer team via Twitter easily.

# Challenges with Spring and SpringBoot
When I talk to some people (both juniors and experienced developers), one thing they keep saying is, “Spring is huge and complex.” But I have the exact opposite opinion on it. After talking to them more about why they feel Spring is complex, I understood why they are feeling that way. It is the same reason why I feel learning JavaScript frameworks is complex.

> Every now and then, I get tempted to learn NodeJS and one shiny new JavaScript framework like ReactJS or VueJS, etc. First, I try to make a list of things to learn so that I have a benchmark to say I have a decent knowledge of NodeJS/ReactJS, etc. After spending 4 to 6 hours and knowing there are 36,794 ways to do anything in JavaScript, I get lost in this ocean of JavaScript tools and options. Then I feel JavaScript is complex.
>
> What I should have done is stop chasing all frameworks/tools and learn bare-bones JS or ES6 first, and then pick one framework, say ReactJS, and one build tool, like WebPack, and just learn how to use them together properly.

In addition to this feeling that Spring is huge and complex, I also see the following reasons why people say Spring Boot is complex:

1.  **People directly jump on to Spring Boot without having any prior Spring knowledge**, and everything looks magical. It works great as long as you go with the defaults, but the moment you need to customize it, it feels complex.
2.  **Too many options**. When you look for help on some Spring-related issue, you will always find 100 options to solve it, and it is confusing which one to go with.
3.  IMHO, **some Spring modules are complex**. Some time back, I had to dig deeper into the Spring Security source code, and I feel it is very complex because it has customization hooks for almost everything.

## How to learn Spring and SpringBoot effectively?
I will give you some tips to learn Spring and Spring Boot, basically what I have followed while learning them.

### 1. Learn Iteratively
I don’t think one can sit and learn everything about a framework in one go. I follow an iterative approach.

**Iteration 1:** Follow some Quick Start Guide, create a project with all the dependencies set, and build a Todo application (Todo is the new HelloWorld, right? :-)). It gives you confidence when you successfully run a sample application.

**Iteration 2:** Read the official documentation.
It is very important to understand what problem this particular framework is trying to solve and in what scenarios this framework is suitable and where it is not a good choice. In this regard, the Spring framework documentation is awesome and very long too (800+ pages) :-).

**Iteration 3:** Build a moderately complex application.

**Iteration 4:** Dig deep into the framework’s source code and see how you can customize the framework.

### 2. First, learn the Spring Core framework
Please don’t jump onto Spring Boot if you don’t have prior knowledge of Spring. I would strongly suggest first learning the Spring framework without Spring Boot so that you know what magic Spring Boot is doing behind the scenes.

Get familiar with Spring DI concepts, Scopes, Annotations, Life Cycle callbacks, and bean configuration styles (annotations, @Beans, etc.). Know how Spring uses the Template pattern (JdbcTemplate, JmsTemplate, etc.) to avoid writing boilerplate code.

### 3. Learn how SpringBoot AutoConfiguration works
The power of Spring Boot comes from its AutoConfiguration mechanism, and it is not magic. Learn Spring’s `@Conditional` feature and explore some of Spring Boot’s AutoConfiguration classes like `DataSourceAutoConfiguration`, `JpaAutoConfiguration`, etc. You can easily understand how Spring Boot is automatically creating beans based on some criteria.

> You can read my blog post on "How SpringBoot AutoConfiguration magic works?" here: https://sivalabs.in/how-springboot-autoconfiguration-magic/

### 4. Follow the community and read blogs
This is the best part of the Spring framework: a huge community and thousands of blogs writing about Spring.
One simple way to find these awesome Spring blogs is to follow the "This Week in Spring" series by **Josh Long** ([@starbuxman](https://twitter.com/starbuxman)), posted on the
[Spring Blog](https://spring.io/blog) every Tuesday.

### 5. Practice, practice, and practice
Nothing can replace “practice.” No matter how much you read or how many Spring videos you watch on YouTube, the best way to learn is to use it.

These days, I hardly see Java projects not using Spring and Spring Boot. You can learn while working on a project, but I strongly suggest creating a pet project and implementing it using various Spring portfolio projects.

After all this, it still takes some time to learn. Take the time to master it. Be patient. Reach out to people if you get stuck. Read books and blogs. Practice, practice, and practice.

I hope this is helpful, and please share it if you like it. :-)