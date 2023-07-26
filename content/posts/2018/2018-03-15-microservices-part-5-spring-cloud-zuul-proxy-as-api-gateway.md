---
title: 'MicroServices - Part 5 : Spring Cloud Zuul Proxy as API Gateway'
author: Siva
images: ["/preview-images/proxy.webp"]
type: post
date: 2018-03-15T07:59:17+05:30
url: /microservices-part-5-spring-cloud-zuul-proxy-as-api-gateway/
categories:
  - microservices
  - springboot
  - springcloud
tags:
  - microservices
  - springboot
  - springcloud
---



In microservices architecture, there could be a number of API services and few UI components that are talking to APIs. As of now, many microservices based application still use monolithic front-ends where the entire UI is built as a single module. You may choose to go with micro-frontends where the UI is also decomposed into multiple microservice talking to APIs to get the relevant data. Instead of letting UI know about all our microservices details we can provide a unified proxy interface that will delegate the calls to various microservices based on URL pattern. In this post, we will learn how to create API Gateway using Spring Cloud Zuul Proxy.

**MicroServices using Spring Boot & Spring Cloud**

* [Part 1 : MicroServices : Spring Boot & Spring Cloud Overview]({{< relref "2018-03-02-microservices-using-springboot-spring-cloud-part-1-overview.md" >}})
* [Part 2 : MicroServices : Configuration Management with Spring Cloud Config and Vault]({{< relref "2018-03-05-microservices-part-2-configuration-management-spring-cloud-config-vault.md" >}})
* [Part 3 : MicroServices : Spring Cloud Service Registry and Discovery]({{< relref "2018-03-08-microservices-springcloud-eureka.md" >}})
* [Part 4 : MicroServices : Spring Cloud Circuit Breaker using Netflix Hystrix]({{< relref "2018-03-12-spring-cloud-netflix-circuit-breaker.md" >}})
* [Part 5 : MicroServices : Spring Cloud Zuul Proxy as API Gateway]({{< relref "2018-03-15-microservices-part-5-spring-cloud-zuul-proxy-as-api-gateway.md" >}})
* [Part 6 : MicroServices : Distributed Tracing with Spring Cloud Sleuth and Zipkin]({{< relref "2018-03-20-microservices-part-6-distributed-tracing-with-spring-cloud-sleuth-and-zipkin.md" >}})

**In this post we are going to learn:**

* Why do we need API Gateway?
* Implementing API Gateway using Spring Cloud Zuul Proxy
* Using Zuul Filters for cross-cutting concerns

# Why do we need API Gateway?
API Gateway, aka Edge Service, provides a unified interface for a set of microservices so that clients no need to know about all the details of microservices internals. However, there are some pros and cons of using API Gateway pattern in microservices architecture.

## Pros:

* Provides easier interface to clients
* Can be used to prevent exposing the internal microservices structure to clients
* Allows to refactor microservices without forcing the clients to refactor consuming logic
* Can centralize cross-cutting concerns like security, monitoring, rate limiting etc

## Cons:

* It could become a single point of failure if proper measures are not taken to make it highly available
* Knowledge of various microservice API may creep into API Gateway

# Implementing API Gateway using Spring Cloud Zuul Proxy

Spring Cloud provides Zuul proxy, similar to **Nginx**, that can be used to create API Gateway.

Let us create a front-end UI module **shoppingcart-ui** as a SpringBoot application which also acts as Zuul proxy. 

Create a SpringBoot project with **Web, Config Client, Eureka Discovery, Zuul** starters and annotate the main entry-point class with 
**@EnableZuulProxy**.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```

**ShoppingcartUiApplication.java**

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
 
@EnableZuulProxy
@SpringBootApplication
public class ShoppingcartUiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShoppingcartUiApplication.class, args);
    }
}
```

As we are using Eureka Discovery also, requests from the proxy with the URL patterns **/service-id/\*\*** will be routed to the service 
registered in Eureka Server with service id **service-id**.

For, ex: From UI application if we make a request to http://localhost:8080/catalog-service/products then it will lookup in 
Service Registry for ServiceID **catalog-service** and send the request with URL /products to one of the available catalog-service instances.

To make it happen we need to register “shoppingcart-ui” with Eureka Service Registry.

**bootstrap.properties**

```properties
spring.application.name=shoppingcart-ui
server.port=8080
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

With this configuration now we can fetch product information from catalog-service using jQuery as follows:

```js
$.ajax({
    url: '/catalog-service/products'
})
.done(function(data) {
    this.products = data;
}.bind(this));
```

Here from our UI application, we are making a call to http://localhost:8080/catalog-service/products. Assuming catalog-service is registered with ServiceID “catalog-service” and running on port 8181, this request will be forwarded to http://host:8181/products. But UI is completely unaware of where is the actual catalog-service running, its hostname port number etc.

We can also use a common prefix for URLs, like **/api**, for which we want Zuul to proxy by setting **zuul.prefix** property.

```shell
zuul.prefix=/api
```

Now from UI we can make a request to fetch products at http://localhost:8080/api/catalog-service/products. 
By default, Zuul will strip the prefix and forward the request.

You can also customize the path mappings of a service as follows:

```properties
zuul.routes.catalogservice.path=/catalog/**
zuul.routes.catalogservice.serviceId=catalog-service
```

With this configuration, you can use URL http://localhost:8080/api/catalog/products which will be forwarded to the service 
with serviceId catalog-service.

By default, all the services registered with Eureka Server will be exposed. You can use **zuul.ignored-services** property 
to disable this behavior and expose only the explicitly configured services.

```properties
zuul.ignored-services=*
 
zuul.routes.catalogservice.path=/catalog/**
zuul.routes.catalogservice.serviceId=catalog-service
 
zuul.routes.orderservice.path=/orders/**
zuul.routes.orderservice.serviceId=order-service
```

With this configuration only **catalog-service, order-service** is exposed through Zuul proxy but not **inventory-service**.

# Using Zuul Filters for cross-cutting concerns
As Zuul act as a proxy to all our microservices, we can use Zuul service to implement some cross-cutting concerns like security, rate limiting etc. One common use-case is forwarding the Authentication headers to all the downstream services.

Typically in microservices, we will use OAuth service for authentication and authorization. 
Once the client is authenticated OAuth service will generate a token which should be included in the requests making to other microservices so that client need not be authenticated for every service separately. We can use Zuul filter to implement features like this.

```java
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;
import javax.servlet.http.HttpServletRequest;
import java.util.UUID;
import static org.springframework.cloud.netflix.zuul.filters.support.FilterConstants.PRE_TYPE;
 
public class AuthHeaderFilter extends ZuulFilter {
    @Override
    public String filterType() {
        return PRE_TYPE;
    }
 
    @Override
    public int filterOrder() {
        return 0;
    }
 
    @Override
    public boolean shouldFilter() {
        return true;
    }
 
    @Override
    public Object run() throws ZuulException {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();
 
        if (request.getAttribute("AUTH_HEADER") == null) {
            //generate or get AUTH_TOKEN, ex from Spring Session repository
            String sessionId = UUID.randomUUID().toString();
             
            ctx.addZuulRequestHeader("AUTH_HEADER", sessionId);
        }
        return null;
    }
}
```

We are adding **AUTH_HEADER** as a request header using **RequestContext.addZuulRequestHeader()** which will be 
forwarded to downstream services. We need to register it as a Spring bean.

```java
@Bean
AuthHeaderFilter authHeaderFilter() {
    return new AuthHeaderFilter();
}
```

> You can find the source code for this article at https://github.com/sivaprasadreddy/spring-boot-microservices-series
