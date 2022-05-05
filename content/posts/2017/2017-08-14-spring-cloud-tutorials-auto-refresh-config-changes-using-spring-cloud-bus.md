---
title: Spring Cloud Tutorials – Auto Refresh Config Changes using Spring Cloud Bus
author: Siva
type: post
date: 2017-08-14T12:30:43+00:00
url: /spring-cloud-tutorials-auto-refresh-config-changes-using-spring-cloud-bus/
aliases: /2017/08/spring-cloud-tutorials-auto-refresh-config-changes-using-spring-cloud-bus/
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
---
# Problem

In the previous article [Introduction to Spring Cloud Config Server]({{< relref "2017-08-14-spring-cloud-tutorials-introduction-to-spring-cloud-config-server.md" >}})  we have seen how to use Spring Cloud Config Server.

But, the problem is to reload the config changes in Config Client applications we need to trigger **/refresh** endpoint manually. This is not practical and viable if you have large number of applications.

# Solution

**Spring Cloud Bus** module can be used to link multiple applications with a message broker and we can broadcast configuration changes.

Let us see how we can use RabbitMQ as message broker and connect multiple applications to receive the configuration change events and refresh the bounded property values.

In previous post we have created **catalog-service** as a SpringBoot application which act as a Config Client.
  
Let us add **Cloud Bus AMQP** starter to **catalog-service/pom.xml**.

```xml
<dependency>
	<groupId>org.springframework.cloud</groupId>
	<artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

We are going to use RabbitMQ as message broker to broadcast config changes. We can install RabbitMQ on our local machine or run in a docker container. I am going to run rabbitmq in docker container using the following **docker-compose.yml** configuration.

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

Now run **docker-compose up** to start rabbitmq container.

Next we need to configure the RabbitMQ server details in catalog-service properties files.

**config-repo/catalogservice.properties**

```properties
spring.rabbitmq.host=localhost
spring.rabbitmq.port=5672
spring.rabbitmq.username=guest
spring.rabbitmq.password=guest
```

Now we can run **catalog-service** and to reload the configuration changes we can trigger POST &#8211; **http://localhost:8181/bus/refresh** instead of **http://localhost:8181/refresh**.

Next, let us create another SpringBoot application **order-service** which runs on port **8282** and configure Cloud Config Client, Cloud Bus AMQP same as catalog-service. The order-service is also connected to the same RabbitMQ message broker as catalog-service.

Now run order-service application which should be running at http://localhost:8282.

**Now if you update properties of both catalog-service and order-service and commit the changes, you just need to trigger /bus/refresh on any one application. This will automatically broadcast the config changes to all the services that subscribed to RabbitMQ and refresh the properties.**

Not only different applications, you may be running multiple instances of same application on different ports. The same process works in these cases also.

So, with Spring Cloud Bus AMQP it is easy to reload configuration changes for any number of applications with one single /bus/refresh request.

The source code for this article is at https://github.com/sivaprasadreddy/spring-cloud-tutorial.
