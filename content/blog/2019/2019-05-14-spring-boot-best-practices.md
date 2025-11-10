---
title: SpringBoot Best Practices
author: Siva
images:
  - /preview-images/spring-boot-1.webp
type: post
date: 2019-05-14T02:29:17.000Z
url: /blog/spring-boot-best-practices/
categories:
  - SpringBoot
tags:
  - SpringBoot
  - best-practices
popular: true
aliases:
  - /spring-boot-best-practices/
---

I have been working with [SpringBoot](https://spring.io/projects/spring-boot) for many years, and over time, I have worked with many Spring Boot-based codebases.
There are a few common mistakes that I observe in projects that use Spring Boot. So, I thought of writing down a few good practices that can be followed while using Spring Boot.

<!--more-->


## 1. Understand SpringBoot Core Concepts
I know this sounds very obvious, but I see many developers jumping into using Spring Boot without having any prior knowledge of Spring or Dependency Injection. So they just keep adding annotations and **@Bean** definitions here and there until it works.

SpringBoot is an opinionated framework with a powerful **auto-configuration** mechanism based on the **convention-over-configuration** philosophy. 
So, it is very important to understand the following things:

* **How to structure application code?**
A typical Spring Boot application has a main entry-point class that is annotated with the **@SpringBootApplication** annotation. Spring Boot automatically scans for Spring components from the entry-point class's package and its sub-packages.
Make sure to read and understand the section https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-structuring-your-code.

* **How does AutoConfiguration work?** 
The most important aspect of Spring Boot is its AutoConfiguration mechanism. Without properly understanding how AutoConfiguration works, it all looks like magic. You can read my blog post [How SpringBoot AutoConfiguration magic works?](https://sivalabs.in/how-springboot-autoconfiguration-magic/) to learn about how AutoConfiguration works.

## 2. Leverage SpringBoot's built-in customization features
SpringBoot auto-configures many beans based on various criteria, like the existence of a class in the classpath or the absence of a property, and also provides the ability to customize the configuration using properties.

I sometimes see people configuring the entire bean definition using **@Bean** just to customize one property of it, whereas they can simply customize it using a property in the **application.properties** file.

For example, if you want to customize the **DataSource** bean default values you can use **spring.datasource.\*** properties instead of configuring the **DataSource** bean by yourself.

You can see all the supported customization properties here 
https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#common-application-properties

## 3. Don't add unnecessary starters and turn off unnecessary features
One of the primary reasons for the popularity of Spring Boot is its getting-started experience. You can simply go to https://start.spring.io/, select the starters you want to add, and run the application. Spring Boot creates a lot of beans behind the scenes based on the starters we add, and hence it may increase the memory footprint and also increase the startup time. So, just add the starters you absolutely need.

SpringBoot automatically registers beans using AutoConfiguration. Sometimes we may not need all those features, and we can turn them off.

For example, if we are not planning to use JMX feature we can turn it off using **spring.jmx.enabled=false**.

## 4. Prefer constructor based dependency injection
We can autowire dependencies using **constructor-injection**, **setter-injection**, or **@Autowired** on the property itself.
Personally, I think constructor injection is the better option. So, I try to always define the dependencies as **final** variables so that it will force initialization in the constructor.

```java
@Service
@Transactional
public class CustomerService {
    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        Assert.notNull(customerRepository, "customerRepository mustn't be null");
        this.customerRepository = customerRepository;
    }
}
```

This way, it will be easier to instantiate **CustomerService** with the necessary dependencies for testing, if required.

## 5. Use TestContainers to test with real dependencies
One common pattern that I have observed in Spring Boot applications is using in-memory databases like H2 for testing and using other RDBMS like Postgres, Oracle, etc., for production. I think this is not a good practice for several reasons. 

First, the production database's behavior might be different from an in-memory database, and hence some bugs might not be detected during testing. Second, some features (e.g., JSONB) might not be supported by in-memory databases, whereas the production database supports them.

These days, most applications use Docker in some way or another. So, we can use [TestContainers](https://www.testcontainers.org/), which is a Docker-based library for testing with a real database similar to the production database.

You can refer to the following to learn how to use TestContainers for Integration Testing with Spring Boot:

* https://github.com/testcontainers/testcontainers-java/tree/master/examples/spring-boot
* https://www.baeldung.com/spring-boot-testcontainers-integration-test

## 6. Use Test Slice annotations to speed up tests
We write Unit tests to test the behavior of a single class and Integration tests to test the behavior of a logical group of components. So, generally we don't need the Spring magic for unit tests. We should be able to create an instance of the class (probably with mock dependencies) and test its behavior.

However, while unit testing Spring-based components like **Controllers** or **Spring Data Repositories**, we need the Spring ApplicationContext to be created. Spring Boot provides **@SpringBootTest** to load the ApplicationContext, and we can test the components. But the **@SpringBootTest** annotation loads all components in the application, which might take more time. 

For unit tests, we generally want to load only the component we want to test with mock dependencies, without loading any other unnecessary dependencies.

Spring Boot provides various other test annotations like **@WebMvcTest**, **@DataJpaTest**, etc., to load only a slice of the ApplicationContext components. So, it is better to unit test the Spring components by using slice-specific annotations rather than **@SpringBootTest**.

You can learn more about using Spring Boot Testing annotations with the following articles:

* https://pivotal.io/application-transformation-recipes/testing/spring-boot-testing-best-practices
* https://spring.io/guides/gs/testing-web/
* https://reflectoring.io/spring-boot-web-controller-test/

## 7. Use database migration tools
While using a relational database with Spring Boot and JPA, it is easier to get started with the auto-generation of the database schema from entity definitions. However, for complex applications, it is better to use database migration tools like [Flyway](https://flywaydb.org/) or [Liquibase](https://www.liquibase.org/). These tools will help in maintaining versioned database migration scripts, keeping track of the current state of the database, and determining which migration scripts need to be run.

## 8. Prefer Off the Shelf security solutions instead of rolling your own
Spring Security makes it easy to implement security, but still, implementing security properly with OAuth, SAML, etc., integrations is still very complex. Security is a very complex subject and needs a lot of expertise to be implemented properly. If it is at all possible to use off-the-shelf security solutions like [Okta](https://www.okta.com/), then use them instead of rolling your own security implementation.

## 9. Use dedicated configuration classes
In our projects, we may need to create several Spring Configuration classes to define or customize beans. For example, we may want to configure **Swagger**, **Jackson**, **AWS**, **ElasticSearch**, **Redis**, etc. Instead of configuring all of them in one configuration class, it would be better to have separate, dedicated Configuration classes for each one of them.

## 10. Avoid boilerplate code with custom SpringBoot starter
In some organizations, there will be some homegrown libraries to achieve some common functionality like security, secrets management, caching, etc. We can create a custom Spring Boot starter to auto-configure the library features so that we don't need to repeat the boilerplate code for every application. 

You can refer to my post [Creating a Custom Spring Boot Starter for Twitter4j](https://sivalabs.in/creating-custom-springboot-starter-for/) on how to create a custom Spring Boot starter.

For more info on creating our own Spring Boot starter, see https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-custom-starter

