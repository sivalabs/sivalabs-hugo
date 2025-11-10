---
title: My Review of Vlad Mihalcea’s High-Performance Java Persistence book
author: Siva
type: post
date: 2017-11-05T04:59:17.000Z
url: /blog/my-review-of-vlad-mihalceas-high-performance-java-persistence-book/
categories:
  - Books
tags:
  - Books
aliases:
  - /my-review-of-vlad-mihalceas-high-performance-java-persistence-book/
---
In the Java world, JPA/Hibernate is the most popular and widely used framework.
When it comes to the overall performance of a software system, the database persistence layer plays a crucial role.
The tricky part with JPA/Hibernate is that it is very easy to get started but very, very hard to master.
This is where **Vlad Mihalcea**'s **High-Performance Java Persistence** book helps you a lot.

<!--more-->

![High-Performance Java Persistence](/images/VladBook.webp "High-Performance Java Persistence")

The "High-Performance Java Persistence" book is not just another Hibernate book saying,
"Put this annotation here and call that method there, and you are done."

Vlad went all the way to explain how things work in databases and JDBC, such as
database connection management, response time and throughput, batch updates, caching,
transaction management, etc., in a very detailed way.

For many of us, it is a bit overwhelming to understand it in one go, so I read it multiple times,
and every time I read it, I gain more and more insights about how things work under the hood.

Vlad Mihalcea is a master of Hibernate, and we all know it. He covered almost everything about
JPA/Hibernate that you can imagine... in a very detailed way… with a lot of code examples.
Be it JPA mappings, Identifier generation strategies, relationship configurations, batch operations,
fetching/projections, lazy loading, Caching, etc., you are covered.

Just because we are using an ORM in our application, we should not use it for all database operations.
For some things, like reporting or very complex queries, it is better to go with plain JDBC or
use some SQL-focused libraries like jOOQ or MyBatis. In this book, jOOQ is covered with
sufficient details on how to perform complex queries, work with stored procedures, etc.

To put it in one sentence:

> The **High-Performance Java Persistence** book is the one single book you need to know everything about the Java Persistence Layer.
