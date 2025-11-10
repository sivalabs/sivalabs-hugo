---
title: Spring Cloud Tutorials – Auto Refresh Config Changes using Spring Cloud Bus
author: Siva
type: post
date: 2017-08-14T12:30:43.000Z
url: /blog/spring-cloud-tutorials-auto-refresh-config-changes-using-spring-cloud-bus/
categories:
  - Java
  - Spring
tags:
  - Spring
  - SpringBoot
  - SpringCloud
keywords:
  - Spring
  - SpringBoot
  - SpringCloud
aliases:
  - /spring-cloud-tutorials-auto-refresh-config-changes-using-spring-cloud-bus/
---
In the previous article, [Introduction to Spring Cloud Config Server]({{< relref "2017-08-14-spring-cloud-tutorials-introduction-to-spring-cloud-config-server.md" >}}), we have seen how to use Spring Cloud Config Server.

But the problem is that to reload the config changes in Config Client applications, we need to trigger the **/refresh** endpoint manually. This is not practical or viable if you have a large number of applications.

<!--more-->

# Solution

The **Spring Cloud Bus** module can be used to link multiple applications with a message broker, and we can broadcast configuration changes.

Let us see how we can use RabbitMQ as a message broker and connect multiple applications to receive configuration change events and refresh the bound property values.

In the previous post, we created **catalog-service** as a Spring Boot application that acts as a Config Client.

Let us add the **Cloud Bus AMQP** starter to **catalog-service/pom.xml**.

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

We are going to use RabbitMQ as a message broker to broadcast config changes. We can install RabbitMQ on our local machine or run it in a Docker container. I am going to run RabbitMQ in a Docker container using the following **docker-compose.yml** configuration.

```yml
version: '2'

services:
  rabbitmq:
      container_name: rabbitmq-server
      image: 'rabbitmq:management'
      environment:
        - RABBITMQ_DEFAULT_USER=guest
        - RABBITMQ_DEFAULT_PASS=guest
      ports:
        - "5672:5672"
        - "15672:15672"
```

Now run **docker-compose up** to start the RabbitMQ container.

Next, we need to configure the RabbitMQ server details in the `catalog-service` properties files.

**config-repo/catalogservice.properties**

```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

Now we can run **catalog-service**, and to reload the configuration changes, we can trigger POST – **http://localhost:8181/bus/refresh** instead of **http://localhost:8181/refresh**.

Next, let us create another Spring Boot application, **order-service**, which runs on port **8282** and configure the Cloud Config Client and Cloud Bus AMQP the same as `catalog-service`. The `order-service` is also connected to the same RabbitMQ message broker as `catalog-service`.

Now run the `order-service` application, which should be running at http://localhost:8282.

**Now, if you update the properties of both `catalog-service` and `order-service` and commit the changes, you just need to trigger `/bus/refresh` on any one application. This will automatically broadcast the config changes to all the services that are subscribed to RabbitMQ and refresh the properties.**

Not only different applications, but you may also be running multiple instances of the same application on different ports. The same process works in these cases also.

So, with Spring Cloud Bus AMQP, it is easy to reload configuration changes for any number of applications with one single `/bus/refresh` request.

The source code for this article is at https://github.com/sivaprasadreddy/spring-cloud-tutorial.
