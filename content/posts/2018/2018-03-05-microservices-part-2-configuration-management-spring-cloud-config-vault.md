---
title: 'MicroServices - Part 2 : Configuration Management with Spring Cloud Config and Vault'
author: Siva
images: ["/preview-images/configuration.webp"]
type: post
date: 2018-03-05T07:59:17+05:30
url: /2018/03/microservices-part-2-configuration-management-spring-cloud-config-vault/
categories:
  - microservices
  - springboot
  - springcloud
tags:
  - microservices
  - springboot
  - springcloud
---



In [MicroServices using Spring Boot & Spring Cloud – Part 1 : Overview](http://sivalabs.in/2018/03/microservices-using-springboot-spring-cloud-part-1-overview/),
 we took a brief look at what are micro-services and how we can use **SpringBoot** and **SpringCloud** to build micro-services.

In this post, we are going to learn:

* What is the need for Spring Cloud Config and Vault?
* Create our first micro-service: catalog-service
* Create Spring Cloud Config Server
* Using Vault for storing sensitive data

**MicroServices using Spring Boot & Spring Cloud**

* [Part 1 : MicroServices : Spring Boot & Spring Cloud Overview]({{< relref "2018-03-02-microservices-using-springboot-spring-cloud-part-1-overview.md" >}})
* [Part 2 : MicroServices : Configuration Management with Spring Cloud Config and Vault]({{< relref "2018-03-05-microservices-part-2-configuration-management-spring-cloud-config-vault.md" >}})
* [Part 3 : MicroServices : Spring Cloud Service Registry and Discovery]({{< relref "2018-03-08-microservices-springcloud-eureka.md" >}})
* [Part 4 : MicroServices : Spring Cloud Circuit Breaker using Netflix Hystrix]({{< relref "2018-03-12-spring-cloud-netflix-circuit-breaker.md" >}})
* [Part 5 : MicroServices : Spring Cloud Zuul Proxy as API Gateway]({{< relref "2018-03-15-microservices-part-5-spring-cloud-zuul-proxy-as-api-gateway.md" >}})
* [Part 6 : MicroServices : Distributed Tracing with Spring Cloud Sleuth and Zipkin]({{< relref "2018-03-20-microservices-part-6-distributed-tracing-with-spring-cloud-sleuth-and-zipkin.md" >}})

# What is the need for Spring Cloud Config and Vault?
SpringBoot already provides a lot of options to [externalize configuration properties](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-external-config). 
However, once the application is started you can’t change those property values at runtime. 
You need to update the properties and restart the application to take those changes into effect.

In the microservices world, there could be a large number of microservices and multiple instances of those microservices are running. 
Updating configuration properties and restarting all those instances manually or even with automated scripts may not be feasible. 
Spring Cloud Config addresses this problem.

We can create a Spring Cloud Config Server which provides the configuration values for all of our microservices. 
We can use **git**, **svn**, **database** or **Consul** as a backend to store the configuration parameters. 
Then we can configure the location of Spring Cloud Config server in our microservice so that it will load all the properties 
when we start the application. In addition to that, whenever we update the properties we can invoke **/refresh** REST endpoint 
in our microservice so that it will reload the configuration changes without requiring to restart the application.

In our applications, we also need to configure various sensitive data like database credentials, keys, tokens etc. 
Obviously, we don’t want to store them in plain text. A better approach would be to store them in an encrypted format 
and Spring Cloud Config Server provides the ability to encrypt and decrypt the data. 
Even better we should use secure data storage tools like [Vault](https://www.vaultproject.io/). 
Spring Cloud also provides the integration with Vault so that we can store any sensitive configuration properties in Vault.


I have already written a couple of tutorials on Spring Cloud Config Server which you can refer to:

* [Introduction to Spring Cloud Config Server](http://sivalabs.in/2017/08/spring-cloud-tutorials-introduction-to-spring-cloud-config-server/)
* [Auto Refresh Config Changes using Spring Cloud Bus](http://sivalabs.in/2017/08/spring-cloud-tutorials-auto-refresh-config-changes-using-spring-cloud-bus/)

# Create our first micro-service: catalog-service
Let us start with our first microservice ie, catalog-service. 
Create a SpringBoot app with **Web, JPA, MySQL, Actuator, DevTools, Lombok** starters. 
Nothing fancy here so far, a typical SpringBoot application.

> You can find the source code for this article at https://github.com/sivaprasadreddy/spring-boot-microservices-series

First, let’s implement a REST endpoint to give products data and later refactor it to use Cloud Config Server.

We are going to use Docker and run MySQL as a Docker container.

**docker-compose.yml**

```yml
version: '3'
services:
  mysqldb:
     image: mysql:5.7
     container_name: mysqldb
     ports:
       - "3306:3306"
     environment:
       MYSQL_ROOT_PASSWORD: admin
       MYSQL_DATABASE: catalog
```
       
Configure datasource properties in **application.properties** as follows:

```properties
server.port=8181
logging.level.com.sivalabs=debug
 
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/catalog?useSSL=false
spring.datasource.username=root
spring.datasource.password=admin
 
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
 
//expose all the Actuator endpoints
management.endpoints.web.exposure.include=*
```

Create JPA entity **Product.java** as follows:

```java
import lombok.Data;
import javax.persistence.*;
 
@Data
@Entity
@Table(name = "products")
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false, unique = true)
    private String code;
    @Column(nullable = false)
    private String name;
    private String description;
    private double price;
}
```

Create Spring Data JPA repository **ProductRepository.java** as follows:

```java
import com.sivalabs.catalogservice.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
 
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCode(String code);
}
```

Create **ProductService** which just delegate to **ProductRepository** for now. 
We can directly inject Repository into our web layer components (Controllers) but going forward there could be business logic which I don’t like to put in either Controller or in Repository.

```java
import com.sivalabs.catalogservice.entities.Product;
import com.sivalabs.catalogservice.repositories.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
 
@Service
@Transactional
@Slf4j
public class ProductService {
    private final ProductRepository productRepository;
 
    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
 
    public List<Product> findAllProducts() {
        return productRepository.findAll();
    }
 
    public Optional<Product> findProductByCode(String code) {
        return productRepository.findByCode(code);
    }
}
```

Finally, create our REST controller **ProductController.java**

```java
import com.sivalabs.catalogservice.entities.Product;
import com.sivalabs.catalogservice.exceptions.ProductNotFoundException;
import com.sivalabs.catalogservice.services.ProductService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 
import java.util.List;
 
@RestController
@RequestMapping("/api/products")
@Slf4j
public class ProductController {
 
    private final ProductService productService;
 
    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }
 
    @GetMapping("")
    public List<Product> allProducts() {
        return productService.findAllProducts();
    }
 
    @GetMapping("/{code}")
    public Product productByCode(@PathVariable String code) {
        return productService.findProductByCode(code)
                .orElseThrow(() -> new ProductNotFoundException("Product with code ["+code+"] doesn't exist"));
    }
}
```

Create **ProductNotFoundException** extending **RuntimeException** and annotate with **@ResponseStatus(HttpStatus.NOT_FOUND)**.

```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
 
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException() {
    }
 
    public ProductNotFoundException(String message) {
        super(message);
    }
 
    public ProductNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
 
    public ProductNotFoundException(Throwable cause) {
        super(cause);
    }
}
```


Let’s insert some sample products into our database.

src/main/resources/data.sql

```sql
DELETE FROM products;
 
insert into products(id, code, name, description, price) VALUES
(1, 'P001', 'Product 1', 'Product 1 description', 25),
(2, 'P002', 'Product 2', 'Product 2 description', 32),
(3, 'P003', 'Product 3', 'Product 3 description', 50)
;
```

Okay, now we can start our SpringBoot application and hit http://localhost:8181/api/products. You should be able to see the JSON response with products info.

# Create Spring Cloud Config Server

we are going to create Spring Cloud Config Server using Git backend. Spring Cloud Config Server is nothing but a SpringBoot project. Create a SpringBoot project with Config Server starter.

Configure the location of git repository where we are going to store all our configuration files in the **application.properties** file.

```properties
spring.config.name=configserver
server.port=8888
 
spring.cloud.config.server.git.uri=https://github.com/sivaprasadreddy/microservices-config-repo
spring.cloud.config.server.git.clone-on-start=true
 
management.endpoints.web.exposure.include=*
```

Now annotate the entry point class with **@EnableConfigServer**.

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
 
@EnableConfigServer
@SpringBootApplication
public class ConfigServerApplication {
 
  public static void main(String[] args) {
    SpringApplication.run(ConfigServerApplication.class, args);
  }
}
```


That’s it. This is all you need to do to create Spring Cloud Config Server and you just need to add application-specific config files in the git repository.

> If you have mentally prepared to write a bunch of code to create Spring Cloud Config Server, sorry to disappoint you :-).

# Refactor catalog-service to use Config Server

Our catalog-service will become a client for Config Server. So, let us add **Config Client** starter to **catalog-service** which will add the following dependency.

```xml
<dependency>
   <groupId>org.springframework.cloud</groupId>
   <artifactId>spring-cloud-starter-config</artifactId>
</dependency>
```

Make sure you also add the **spring-cloud-dependencies** BOM and in `<properties>` section.

While using Spring Cloud Config Server the properties loading process happens at multiple stages, first loading **bootstrap.properties/yml** and then from config server.

So, let’s rename **application.properties** to **bootstrap.properties** and update it to have the following properties.

```properties
spring.application.name=catalog-service
server.port=8181
management.endpoints.web.exposure.include=*
spring.cloud.config.uri=http://localhost:8888
```


Here, we have configured the location of our Config Server and gave the name as **catalog-service** to our application using **spring.application.name**.

Now we need to add all the properties of our **catalog-service** in **catalog-service.properties** and commit/push it to our git repo microservices-config-repo.

**microservices-config-repo/catalog-service.properties**

```properties
logging.level.com.sivalabs=debug
 
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/catalog?useSSL=false
spring.datasource.username=root
spring.datasource.password=admin
 
spring.datasource.initialization-mode=always
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```


You can also add separate config files for different files like **catalog-service-qa.properties, catalog-service-prod.properties** etc.

Now first start Config Server application and then catalog-service application. 
This should work fine. You can check the console logs that catalog-service is fetching the properties from 
config server http://localhost:8888/ at startup.

Now we are getting little close to our goal but we are still storing the credentials in plain text. 
Let’s move the sensitive config properties to Vault.

# Using Vault for storing sensitive data

Vault is a tool for securely storing and accessing secrets. You can read more about Vault here https://www.vaultproject.io/intro/index.html. Vault comes as a single binary which you can download from https://www.vaultproject.io/downloads.html.

Now start Vault in dev mode using the following command:

**$ vault server -dev**

In the console, you can see the information about how to use Vault and Root token.
Open a new terminal window, set VAULT_ADDR environment variable.

**$ export VAULT_ADDR=’http://127.0.0.1:8200′**

> NOTE: The vault dev mode is only for development purpose and is not meant for production usage.

We can write secrets to Vault using **vault write secret/somename key1=value1 key2=value2**
We can also put all our secrets in a JSON file and write from the file as well. 
Let us create a JSON file with MySQL database credentials and write to Vault.

**catalog-service-credentials.json**

```json
{ 
    "spring.datasource.username": "root", 
    "spring.datasource.password": "admin"
}
```

**$ vault write secret/catalog-service @catalog-service-credentials.json**

You can verify the values by running vault read **secret/catalog-service**.

> We can automate this whole process of setting up Vault and initializing with secrets using Docker. Please look at the source repository on github to know how to do it, well one way of doing it.

Now that Vault is configured and initialized with secrets. Let us refactor **catalog-service** to use Vault.

Add Vault Configuration starter to **catalog-service** which will add the following dependency.

```xml
<dependency>
 <groupId>org.springframework.cloud</groupId>
 <artifactId>spring-cloud-starter-vault-config</artifactId>
</dependency>
```

Remove the following credentials from **microservices-config-repo/catalog-service.properties** and commit it.

```properties
spring.datasource.username=root
spring.datasource.password=admin
```

Add Vault configuration properties in **bootstrap.properties**.

```properties
spring.cloud.vault.host=localhost
spring.cloud.vault.port=8200
spring.cloud.vault.scheme=http
spring.cloud.vault.authentication=token
spring.cloud.vault.token=934f9eae-31ff-a8ef-e1ca-4bea9e07aa09
```

We have configured the Vault properties, using token-based authentication and configured the Root Taken that is printed in the console log 
when you started the vault server.

We are all set. We moved the service properties into external config server and sensitive data into Vault.

Now start the Config Server and **catalog-service** and it should work just fine.

# Summary
In this post, we learned how to use Spring Cloud Config to externalize the configuration properties and Vault to store secrets. 
You can use Spring Cloud Bus to Auto Refresh Config Changes as described in 
[Spring Cloud Tutorials – Auto Refresh Config Changes using Spring Cloud Bus](http://sivalabs.in/2017/08/spring-cloud-tutorials-auto-refresh-config-changes-using-spring-cloud-bus/).

You can find the source code for this article at https://github.com/sivaprasadreddy/spring-boot-microservices-series

In next article, we will take a look at how to use **Netflix Eureka for Service Registry and Service Discovery**.

# References:
* [Spring Cloud Reference Documentation](http://cloud.spring.io/spring-cloud-static/Finchley.M7/single/spring-cloud.html)
* [Vault Getting Started](https://www.vaultproject.io/intro/getting-started/install.html)
* [Spring Blog: Managing Secrets with Vault](https://spring.io/blog/2016/06/24/managing-secrets-with-vault)

