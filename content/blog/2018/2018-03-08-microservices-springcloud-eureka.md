---
title: 'MicroServices - Part 3 : Spring Cloud Service Registry and Discovery'
author: Siva
images: ["/preview-images/EurekaDashboard.webp"]
type: post
date: 2018-03-08T07:59:17+05:30
url: /microservices-springcloud-eureka/
categories:
  - microservices
  - springboot
  - springcloud
tags:
  - microservices
  - springboot
  - springcloud
---



In the microservices world, **Service Registry and Discovery** plays an important role because we most likely run multiple instances of services and 
we need a mechanism to call other services without hardcoding their hostnames or port numbers. 
In addition to that, in Cloud environments service instances may come up and go down anytime. 
So we need some automatic service registration and discovery mechanism. **Spring Cloud** provides **Service Registry and Discovery** features, as usual, 
with multiple options. We can use **Netflix Eureka** or **Consul** for Service Registry and Discovery. 


<!--more-->


In this post, we will learn how to use SpringCloud Netflix Eureka for Service Registry and Discovery.

**MicroServices using Spring Boot & Spring Cloud**

* [Part 1 : MicroServices : Spring Boot & Spring Cloud Overview]({{< relref "2018-03-02-microservices-using-springboot-spring-cloud-part-1-overview.md" >}})
* [Part 2 : MicroServices : Configuration Management with Spring Cloud Config and Vault]({{< relref "2018-03-05-microservices-part-2-configuration-management-spring-cloud-config-vault.md" >}})
* [Part 3 : MicroServices : Spring Cloud Service Registry and Discovery]({{< relref "2018-03-08-microservices-springcloud-eureka.md" >}})
* [Part 4 : MicroServices : Spring Cloud Circuit Breaker using Netflix Hystrix]({{< relref "2018-03-12-spring-cloud-netflix-circuit-breaker.md" >}})
* [Part 5 : MicroServices : Spring Cloud Zuul Proxy as API Gateway]({{< relref "2018-03-15-microservices-part-5-spring-cloud-zuul-proxy-as-api-gateway.md" >}})
* [Part 6 : MicroServices : Distributed Tracing with Spring Cloud Sleuth and Zipkin]({{< relref "2018-03-20-microservices-part-6-distributed-tracing-with-spring-cloud-sleuth-and-zipkin.md" >}})

In my previous post, [Part 2 : MicroServices : Configuration Management with Spring Cloud Config and Vault]({{< relref "2018-03-05-microservices-part-2-configuration-management-spring-cloud-config-vault.md" >}}), we learned how to store configuration parameters externally in a configuration server and how to securely store secrets in Vault.

**In this post, we are going to learn:**

* What is Service Registry and Discovery?
* Spring Cloud Netflix Eureka-based Service Registry
* Registering microservices as Eureka Clients
* Discovering other services using Eureka Client

# What is Service Registry and Discovery?
Suppose we have 2 microservices **catalog-service** and **inventory-service** and we are running 2 instances of inventory-service at http://localhost:8181/ and http://localhost:8282/. Now let’s say we want to invoke some inventory-service REST endpoint from catalog-service. Which URL should we hit? Generally, in these scenarios, we use a load balancer configuring these 2 URLs to be delegated to and we will invoke the REST endpoint on load balancer URL. Fine.

But, what if you want to spin up new instances dynamically based on load? Even if you are going to run only few server nodes, manually updating the server node details in load balancer configuration is error-prone and tedious. This is why we need automatic Service Registration mechanism and be able to invoke a service using some logical service id instead of using specific IP Address and port numbers.

We can use Netflix Eureka Server to create a Service Registry and make our microservices as Eureka Clients so that as soon as we start a microservice it will get registered with Eureka Server automatically with a logical Service ID. Then, the other microservices, which are also Eureka Clients, can use Service ID to invoke REST endpoints.

Spring Cloud makes it very easy to create a Service Registry and discovering other services using Load Balanced RestTemplate.

# Spring Cloud Netflix Eureka based Service Registry
Let us create a Service Registry using Netflix Eureka which is nothing but a SpringBoot application with **Eureka Server** starter.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

We need to add **@EnableEurekaServer** annotation to make our SpringBoot application a Eureka Server based Service Registry.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
 
@EnableEurekaServer
@SpringBootApplication
public class ServiceRegistryApplication {
 
    public static void main(String[] args) {
        SpringApplication.run(ServiceRegistryApplication.class, args);
    }
}
```

By default, each Eureka Server is also a Eureka client and needs at least one service URL to locate a peer. As we are going to have a single Eureka Server node (Standalone Mode), we are going to disable this client-side behavior by configuring the following properties in application.properties file.

**application.properties**

```properties
spring.application.name=service-registry
server.port=8761
eureka.instance.hostname=localhost
eureka.instance.client.registerWithEureka=false
eureka.instance.client.fetchRegistry=false
eureka.instance.client.serviceUrl.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/
```

Netflix Eureka Service provides UI where we can see all the details about registered services.

Now run **ServiceRegistryApplication** and access http://localhost:8761 which will display the UI similar to below screenshot.

![Eureka Dashboard](/images/EurekaDashboard.webp "Eureka Dashboard")

# Registering microservices as Eureka Clients
In [Part 2 : MicroServices : Configuration Management with Spring Cloud Config and Vault]({{< relref "2018-03-05-microservices-part-2-configuration-management-spring-cloud-config-vault.md" >}})
 we have created catalog-service. Let us make this service as a Eureka Client and register with the Eureka Server.

Add the **Eureka Discovery** starter to **catalog-service** which will add the following dependency.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

With **spring-cloud-starter-netflix-eureka-client** on classpath, we just need to configure **eureka.client.service-url.defaultZone** property in **application.properties** to automatically register with the Eureka Server.

```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

When a service is registered with Eureka Server it keeps sending heartbeats for certain interval. If Eureka server didn’t receive heartbeat from any service instance it will assume service instance is down and take it out from the pool.

With this configuration in place, start catalog-service and visit http://localhost:8761. 
You should see catalog-service is registered with **SERVICE ID** as **CATALOG-SERVICE**. 
You can also notice the status as **UP(1)** which means the services are up and running and one instance of **catalog-service** is running.

Let us start another instance of catalog-service on a different port using the following command.

```shell
java -jar -Dserver.port=9797 target/catalog-service-0.0.1-SNAPSHOT-exec.jar
```

Now if you go to http://localhost:8761 you will notice that 2 instances of catalog-service got registered and you can see their hostname: port details as well.

# Discovering other services using Eureka Client
In the previous section, we have learned how to register a service as Eureka client and we also tried registering multiple instances of the same service.

Now we will create another microservice **inventory-service** which exposes a REST endpoint **http://localhost:8282/api/invenory/{productCode}** which will give the currently available quantity as a response.

```js
{
    productCode: "P001",
    availableQuantity: 250
}
```

Create **inventory-service** SpringBoot application with **Web, JPA, H2/MySQL, Actuator, Config Client and Eureka Discovery** starters.

Create a REST Controller to return Inventory details for a given product code.

```java
@RestController
@Slf4j
public class InventoryController {
    private final InventoryItemRepository inventoryItemRepository;
 
    @Autowired
    public InventoryController(InventoryItemRepository inventoryItemRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
    }
 
    @GetMapping("/api/inventory/{productCode}")
    public ResponseEntity<InventoryItem> findInventoryByProductCode(@PathVariable("productCode") String productCode) {
        log.info("Finding inventory for product code :"+productCode);
        Optional<InventoryItem> inventoryItem = inventoryItemRepository.findByProductCode(productCode);
        if(inventoryItem.isPresent()) {
            return new ResponseEntity(inventoryItem, HttpStatus.OK);
        } else {
            return new ResponseEntity(HttpStatus.NOT_FOUND);
        }
    }
}
```

> Please look at the GitHub Repository for the InventoryItem, InventoryItemRepository etc code.

Register **inventory-service** with Eureka server by configuring Eureka serviceUrl in **src/main/resources/bootstrap.properties**.

```properties
spring.application.name=inventory-service
server.port=8282
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```

Now build inventory-service and start 2 instances of it by running following commands.

```shell
java -jar -Dserver.port=9898 target/inventory-service-0.0.1-SNAPSHOT-exec.jar
 
java -jar -Dserver.port=9999 target/inventory-service-0.0.1-SNAPSHOT-exec.jar
```

Now you can visit Eureka Dashboard http://localhost:8761/ and see 2 instances of inventory-service registered.

Suppose we want to invoke inventory-service REST endpoint from catalog-service. 
We can use **RestTemplate** to invoke REST endpoint but there are 2 instances running.

We can register **RestTemplate** as a Spring bean with **@LoadBalanced** annotation. 
The RestTemplate with **@LoadBalanced** annotation will internally use **Ribbon LoadBalancer** to resolve the **ServiceID** 
and invoke REST endpoint using one of the available servers.

```java
@SpringBootApplication
public class CatalogServiceApplication {
 
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
 
    public static void main(String[] args) {
        SpringApplication.run(CatalogServiceApplication.class, args);
    }
}
```

Now we can use RestTemplate to invoke inventory-service endpoint at **http://inventory-service/api/inventory/{productCode}**.

```java
@Service
@Transactional
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate;
     
    @Autowired
    public ProductService(ProductRepository productRepository, RestTemplate restTemplate) {
        this.productRepository = productRepository;
        this.restTemplate = restTemplate;
    }
 
    public Optional<Product> findProductByCode(String code) {
        Optional<Product> productOptional = productRepository.findByCode(code);
        if(productOptional.isPresent()) {
            log.info("Fetching inventory level for product_code: "+code);
            ResponseEntity<ProductInventoryResponse> itemResponseEntity =
                    restTemplate.getForEntity("http://inventory-service/api/inventory/{code}",
                                                ProductInventoryResponse.class,
                                                code);
            if(itemResponseEntity.getStatusCode() == HttpStatus.OK) {
                Integer quantity = itemResponseEntity.getBody().getAvailableQuantity();
                log.info("Available quantity: "+quantity);
                productOptional.get().setInStock(quantity> 0);
            } else {
                log.error("Unable to get inventory level for product_code: "+code +
                ", StatusCode: "+itemResponseEntity.getStatusCode());
            }
        }
        return productOptional;
    }
}
```

```java
@Data
public class ProductInventoryResponse {
    private String productCode;
    private int availableQuantity;
}
```

Note that we have used http://inventory-service/api/inventory/{code} instead of http://localhost:9898/api/inventory/{code} or http://localhost:9999/api/inventory/{code} directly.

With this kind of automatic Service Registration and Discovery mechanism, we no need to worry about how many instances are running and what are their hostnames and ports etc.

> You can find the source code for this article at https://github.com/sivaprasadreddy/spring-boot-microservices-series

# Summary
In this post, we learned how to use Spring Cloud **Netflix Eureka** for **Service Registry and Discovery**. 
In next post, we will look at implementing **Circuit Breaker pattern using Netflix Hystrix**.

# References:
* [Spring Cloud Netflix](http://cloud.spring.io/spring-cloud-static/Finchley.M7/single/spring-cloud.html#_spring_cloud_netflix)
