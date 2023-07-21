---
title: "Getting Started with Spring Boot"
author: Siva
images: ["/preview-images/spring-boot-getting-started.webp"]
type: post
draft: false
date: 2023-07-21
url: /getting-started-with-spring-boot
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
---

## Introducing Spring Boot
Spring Boot is the most popular framework for building applications in the Java world. 
Spring Boot is an Opinionated and Convention Over Configuration based approach to 
building Spring framework based applications.

Using Spring Boot, you can build different kinds of applications such as 
monolithic applications, microservices, serverless applications, Batch applications, etc.

Let us take a quick look at what are the key features of Spring Boot that make it so popular.

## Spring Boot Key Features

### AutoConfiguration
Spring Boot takes an opinionated view of the application and auto-configures the components(a.k.a beans)
based on the default conventions without requiring you to configure everything explicitly.
However, you can customize or override the bean configurations in various ways if required.

For example, if you add **spring-boot-starter-data-jpa** dependency it will add **Hibernate** as the JPA implementation
as it is the most commonly used JPA provider. Also, Spring Boot tries to auto-configure the components required
for using Spring Data Jpa such as **DataSource, EntityManagerFactory, PlatformTransactionManager** etc.
If there is an in-memory JDBC driver in the classpath like **H2** or **HSQL** then Spring Boot will auto-configure
the **DataSource** with in-memory settings.

If you want to use any non in-memory databases like **MySQL**, **Postgresql** etc then you can add the respective JDBC driver jar
and configure the JDBC connection parameters in **application.properties** file. Then Spring Boot will use those properties
to configure DataSource bean as opposed to using default in-memory database.
You can even configure a DataSource bean by yourself using **@Bean** annotation then Spring Boot will backoff
and use the DataSource bean configured by you instead of auto-configuring it.

With Spring Boot's auto-configuration, the need for Spring application configuration is greatly reduced.

### Convention Over Configuration
Spring Boot relies upon various default conventions so that it can auto-configure the application.

For example, in most of the Spring based (not Spring Boot based) applications we use configuration properties
and register the **PropertySourcesPlaceholderConfigurer** bean. In Spring Boot you can put your configuration
properties in **src/main/resources/application.properties** file and Spring Boot will automatically register
**PropertySourcesPlaceholderConfigurer** bean loading the properties from that file. You don't have to
explicitly specify the properties file name.

Similarly, you might want to configure different values for properties based on environment (**dev, qa, staging, prod**).
You can configure your configuration properties in **application-{profile}.properties** where profile can be
**dev, qa, staging** and **prod**. Then you just need to enable the desired profile for Spring Boot to read values
from that specific profile properties file.

Spring Boot is very flexible to customize those conventions based on your project or team preferences.

### Dependencies Version Management

Typically, Spring Boot applications inherit from **spring-boot-starter-parent** which is configured with all
the compatible library versions so that you don't have to hunt for checking which library version is compatible
with which version of Spring. You can check **pom.xml** of **org.springframework.boot:spring-boot-dependencies** module to see
what are all the libraries pre-configured.

### Production Ready Monitoring Capabilities

Monitoring is an important aspect of any application running in production. Spring Boot provides production ready
monitoring capabilities via **Actuator**. You can get the application runtime information like **Memory usage, Disk Space, HealthCheck
of various components** etc via Actuator REST endpoints. Actuator uses **Micrometer** under-the-hood which you can use
to export all those application metrics to various monitoring services like **Prometheus, Datadog, Influx** etc.

### Embedded Servers Support

Traditionally, Java based web applications are built as **war** files and then deployed on a servlet containers or
application servers like **Tomcat, Wildfly, WebSphere** etc. The modern approach is to embed the server runtime within
the application itself so that you can take the artifact and run it without having to install and configure server externally.

Spring Boot provides support for embedding servlet containers like **Tomcat, Jetty, Undertow** and you can customize
various server properties in server-independent way. Spring Boot also provides various server-specific
customization properties as well.

### Spring Ecosystem

Spring Boot has a huge ecosystem of projects to support wide verity of application types.

* **SpringMVC & Spring WebFlux**: You can build traditional web applications and REST APIs using **SpringMVC** or **Spring WebFlux**.
* **Spring Data**: Spring Data provides high-level abstraction over ORM and NoSQL data access libraries so that you don't need to implement boilerplate CRUD operations again and again.
* **Spring Security**: You can implement Authentication and Authorization using Spring Security. It also supports implementing **OAuth 2.0** based security.
* **Spring Batch**: You can build robust batch applications using SpringBatch.
* **Spring Integration**: Spring Integration implements many of the **Enterprise Integration Patterns** which you can use for integration with 3rd party services.
* **Spring Cloud**: Spring Cloud provides support for building Cloud Native applications following [12 Factor Application](https://12factor.net/) principles
* **Spring Cloud Streams**: You can build Data Pipelines for processing Stream based Data Sources like Kafka.

And, there are many more interesting projects. See https://spring.io/projects for more Spring ecosystem projects.

Let's build a simple REST API application using Spring Boot and explore some of its features.

## Getting Started with Spring Boot

Spring Boot applications can be created either using [Spring Initializr](https://start.spring.io/) or
[Spring Tool Suite](https://spring.io/tools) or [IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/)
or [NetBeans IDE](https://netbeans.apache.org/) with [Spring Boot Plugin](https://github.com/AlexFalappa/nb-springboot).

We are going to use [Spring Initializr](https://start.spring.io/) and provide the following project metadata.

* **Project**: Maven Project
* **Language**: Java
* **Spring Boot**: 3.1.1
* **Project Metadata**:
  * **Group**: com.sivalabs
  * **Artifact**: spring-boot-helloworld
  * **Name**: spring-boot-helloworld
  * **Description**: Spring Boot HelloWorld
  * **Package name**: com.sivalabs.helloworld
  * **Packaging**: jar
  * **Java**: 17
* Click on **ADD DEPENDENCIES** and add **Spring Web**, **Lombok** starters.
* Click on **GENERATE**

The generated Spring Boot application will be downloaded.
You can extract the zip file and import the project into your IDE.
I will be using IntelliJ IDEA, but you can use any of your favorite IDE.

{{< box info >}}
**Spring Boot Tutorial Series GitHub Code Repository:**
https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series
{{< /box >}}

You may be interested in **Better Alternatives To Generate Spring Boot Applications**

{{< youtube 2E8r-HVLZGY >}}

## Simple REST API using Spring Boot

What we are going to build is a simple REST API with one endpoint **GET /api/hello?name={name}** which returns the JSON response
**{ "greeting" : "Hello {name}"}**. We don't want to hard-code the greeting prefix **"Hello"**, we want it to be configurable.

Let us start with creating response model class **GreetingResponse** as follows:

**src/main/java/com/sivalabs/helloworld/GreetingResponse.java**
```java
record GreetingResponse(String greeting){}
```

Next, create **ApplicationProperties** class to bind the application configuration parameters.

**src/main/java/com/sivalabs/helloworld/ApplicationProperties.java**
```java
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app") // (1)
@Setter
@Getter
public class ApplicationProperties {
    private String greeting = "Hello";
    private String defaultName = "World";
}
```

* **(1)** We are binding the properties in **application.properties** file with common prefix **"app."** into **ApplicationProperties** class fields.

Create **GreetingService** and implement **sayHello(String name)** method as follows:

**src/main/java/com/sivalabs/helloworld/GreetingService.java**
```java
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service // (1)
@RequiredArgsConstructor // (2)
public class GreetingService {
    private final ApplicationProperties properties;  // (3)

    public String sayHello(String name) {
        String s = name == null ? properties.getDefaultName(): name;
        return String.format("%s %s", properties.getGreeting(), s);
    }
}
```

* **(1)** Declare **GreetingService** as Spring bean using **@Service** annotation.
* **(2)** Lombok's **@RequiredArgsConstructor** annotation will generate a constructor with all the **final** properties. In this case, it will generate a constructor with **ApplicationProperties** argument.
* **(3)** Injecting the **ApplicationProperties** instance as a dependency of **GreetingService** bean.

Create **HelloWorldController** and implement the **GET /api/hello** API endpoint as follows:

**src/main/java/com/sivalabs/helloworld/HelloWorldController.java**
```java
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController // (1)
@RequiredArgsConstructor
@Slf4j // (2)
public class HelloWorldController {
    private final GreetingService greetingService;

    @GetMapping("/api/hello") // (3)
    public GreetingResponse sayHello(
            @RequestParam(name = "name", required = false) String name) {
        log.info("Say Hello to Name: {}", name);
        String greeting = greetingService.sayHello(name);
        return new GreetingResponse(greeting);
    }
}
```

* **(1)** Declares the class as Spring Controller with request handler methods.
* **(2)** Using Lomkok's **@Slf4j** annotation to automatically create a SLF4J Logger instance instead of manually creating as **private static final Logger log = LoggerFactory.getLogger(HelloWorldController.class);**
* **(3)** The **sayHello()** method is annotated with **@GetMapping("/api/hello")** indicating it as a request handler method for **HTTP GET /api/hello** URL.

Let's configure the properties in **src/main/resources/application.properties** as follows:

```shell
app.greeting=Hello
app.default-name=World
```

Finally, we need to enable the configuration properties binding using **@EnableConfigurationProperties** as follows:

**src/main/java/com/sivalabs/helloworld/SpringBootHelloWorldApplication.java**
```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({ApplicationProperties.class}) // (1)
//@ConfigurationPropertiesScan // (2)
public class SpringBootHelloWorldApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootHelloWorldApplication.class, args);
    }
}
```

* **(1)** Explicitly enabling the configuration properties binding for **ApplicationProperties** class. If we have more such configuration-binding classes, we can list them all.
* **(2)** Instead of explicitly specifying all the configuration-binding classes, we can use **@ConfigurationPropertiesScan** annotation to scan for all the classes that are annotated with **@ConfigurationProperties**.

We can run the application from IDE by simply running the **main()** method in **SpringBootHelloWorldApplication**.

## Run application using Maven and Gradle
Spring Boot Maven and Gradle plugins provide the ability to run the application without requiring to build the artifact(jar or war).

Maven:

```shell
./mvnw spring-boot:run
```

Gradle:

```shell
./gradlew bootRun
```

## Run application as a FatJar
We can build the Spring Boot application as a fat-jar and run it using **java -jar** command.

**Maven:**

```shell
$ ./mvnw clean package
$ java -jar target/spring-boot-helloworld-0.0.1-SNAPSHOT.jar
```

**Gradle:**

```shell
$ ./gradlew clean build
$ java -jar build/libs/spring-boot-helloworld-0.0.1-SNAPSHOT.jar
```

We can verify the API endpoint using cURL as follows:

```shell
$ curl http://localhost:8080/api/hello
{"greeting":"Hello World"}

$ curl http://localhost:8080/api/hello?name=Siva
{"greeting":"Hello Siva"}
```

{{< box info >}}
**Spring Boot Tutorial Series**

**Next:** Spring Boot Testing Tutorial(Coming soon)
{{< /box >}}

## Summary
We have learned about Spring Boot, its ecosystem and some of its core features.
We have created a simple REST API using Spring Boot and tested using cURL.
