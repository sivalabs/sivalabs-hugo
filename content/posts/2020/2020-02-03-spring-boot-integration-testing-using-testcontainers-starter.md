---
title: SpringBoot Integration Testing using TestContainers Starter
author: Siva
images: ["/images/testcontainers.webp"]
type: post
date: 2020-02-03T04:59:17+05:30
url: /2020/02/spring-boot-integration-testing-using-testcontainers-starter/
categories:
  - SpringBoot
tags: [SpringBoot, Testcontainers]
---

One of the many reasons for huge popularity of Spring and SpringBoot is 
it's great support for [Testing](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-testing).
We can write unit tests using [Mockito](https://site.mockito.org/) without requiring any Spring features. 
And, we can write Integration Tests using Spring testing support by creating Spring ApplicationContext. 

> Read [Guide to Testing SpringBoot Applications](https://sivalabs.in/2019/10/spring-boot-testing/)
    
While running integration tests we might need to interact with external services like relational databases, NoSQL datastores, Kafka etc. 
We can spin up those external services as Docker containers and run tests against them.

## Testcontainers

**From Testcontainers docs:**

> Testcontainers is a Java library that supports JUnit tests, providing lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.

We can use Testcontainers to spin up a [Singleton docker container](https://www.testcontainers.org/test_framework_integration/manual_lifecycle_control/#singleton-containers) 
in a SpringBoot integration test as follows:

```java
@SpringBootTest
@ContextConfiguration(initializers = {UserServiceIntegrationTest.Initializer.class})
class UserServiceIntegrationTest {
    private static PostgreSQLContainer sqlContainer;
    
    static {
        sqlContainer = new PostgreSQLContainer("postgres:10.7")
                .withDatabaseName("integration-tests-db")
                .withUsername("sa")
                .withPassword("sa");
        sqlContainer.start();
    }

    static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
              "spring.datasource.url=" + sqlContainer.getJdbcUrl(),
              "spring.datasource.username=" + sqlContainer.getUsername(),
              "spring.datasource.password=" + sqlContainer.getPassword()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }

    @Autowired
    private UserService userService;
    
    @Test
    void shouldGetAllUsers() {
        // test userService.getAllUsers()
    }   

}
```

This is such a very common requirement in SpringBoot applications, so the community built 
[Testcontainers SpringBoot starter](https://github.com/testcontainers/testcontainers-spring-boot) to make it more easy.

## Testcontainers SpringBoot starter
The Testcontainers SpringBoot starter depends on **spring-cloud-starter**. 
If you are NOT already using any SpringCloud starters in the application then include **spring-cloud-starter** as a **test** dependency.

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter</artifactId>
    <scope>test</scope>
</dependency>
```

Now include data service library depending on what data service you need.
For example if you want to use **Postgresql** docker container then add the following dependency:

```xml
<dependency>
    <groupId>com.playtika.testcontainers</groupId>
    <artifactId>embedded-postgresql</artifactId>
    <scope>test</scope>
</dependency>
```
When you add the **embedded-postgresql** dependency then following properties will be added to the Environment:

* embedded.postgresql.port
* embedded.postgresql.host
* embedded.postgresql.schema
* embedded.postgresql.user
* embedded.postgresql.password

We can use these properties to configure datasource properties for testing.

**Usually we want to spin up docker containers for integration tests but not for unit tests.
So we can disable it by default and only enable during integration tests by using profile based configuration.**

**src/test/resources/bootstrap.properties**

```properties
embedded.postgresql.enabled=false
```

**src/test/resources/bootstrap-integration-test.properties**

```properties
embedded.postgresql.enabled=true
spring.datasource.driver-class-name=org.postgresql.Driver
spring.datasource.url=jdbc:postgresql://${embedded.postgresql.host}:${embedded.postgresql.port}/${embedded.postgresql.schema}
spring.datasource.username=${embedded.postgresql.user}
spring.datasource.password=${embedded.postgresql.password}
```

Now we can run integration tests with **integration-test** profile using **@ActiveProfiles** as follows:

```java
@SpringBootTest
@ActiveProfiles("integration-test")
class UserServiceIntegrationTest {
    
    @Autowired
    private UserService userService;
    
    @Test
    void shouldGetAllUsers() {
        // test userService.getAllUsers()
    }   

}
```

We may want to use specific version of a docker image, then you can configure it as follows:

**src/test/resources/bootstrap-integration-test.properties**

```properties
embedded.postgresql.dockerImage=postgres:10.7
embedded.postgresql.enabled=true
```

The Testcontainers SpringBoot starter already provide support for most commonly used containers like 
Postgresql, MariaDB, MongoDB, Redis, RabbitMQ, Kafka, Elasticsearch etc.

To my surprise there is no direct support for MySQL as of now. But there is a simple workaround 
for this as described here https://github.com/testcontainers/testcontainers-spring-boot/issues/151.
