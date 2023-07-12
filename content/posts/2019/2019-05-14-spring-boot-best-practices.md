---
title: SpringBoot Best Practices
author: Siva
images: ["/preview-images/spring-boot-1.webp"]
type: post
date: 2019-05-14T07:59:17+05:30
url: /spring-boot-best-practices/
aliases: /2019/05/spring-boot-best-practices/
categories:
  - SpringBoot
tags: [Spring, SpringBoot, BestPractices]
---

I have been working with [SpringBoot](https://spring.io/projects/spring-boot) for many years and over the time I worked with many SpringBoot based codebases.
There are few common mistakes that I observe in the projects that use SpringBoot. So, I thought of writing down few good practices that can be followed while using SpringBoot.

## 1. Understand SpringBoot Core Concepts
I know, this sounds very obvious but I see many developers jumping onto using SpringBoot without having any prior knowledge on Spring, Dependency Injection. So they just keep adding annotations and **@Bean** definitions here and there until it works.

SpringBoot is an opinionated framework with powerful **auto-configuration** mechanism based on **convention-over-configuration** philosophy. 
So, it is very important to understand the following things:

* **How to structure application code?**
A typical SpringBoot application has a main entry-point class which is annotated with **@SpringBootApplication** annotation. SpringBoot automatically scan for Spring components from the entry-point class's package and it's sub-packages.
Make sure to read and understand the section https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-structuring-your-code.

* **How AutoConfiguration works?** 
The most important aspect of SpringBoot is it's AutoConfiguration mechanism. Without properly understanding how AutoConfiguration works it all looks like magic. You can read my blog post [How SpringBoot AutoConfiguration magic works?](https://sivalabs.in/how-springboot-autoconfiguration-magic/) to learn about how AutoConfiguration works.

## 2. Leverage SpringBoot's built-in customization features
SpringBoot auto-configures many beans based on various criteria like existence of class in classpath, absence of a property and also provides the ability to customize the configuration using properties.

I see sometimes people configuring the entire bean definition using **@Bean** just to customize one property of it where as they can simply customize it using a property in **application.properties** file.

For example, if you want to customize the **DataSource** bean default values you can use **spring.datasource.\*** properties instead of configuring the **DataSource** bean by yourself.

You can see all the supported customization properties here 
https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#common-application-properties

## 3. Don't add unnecessary starters and turn off unnecessary features
One of the primary reason for the popularity of SpringBoot is its getting started experience. You can simply goto https://start.spring.io/ and select the starters you want to add and run the application. SpringBoot creates lot of beans behind the scenes based on the starters we add and hence it may increase the memory footprint and also increase the startup time. So, just add the starters you absolutely need.

SpringBoot automatically registers beans using AutoConfiguration. Sometimes we may not need all those features and we can turn them off. 

For example, if we are not planning to use JMX feature we can turn it off using **spring.jmx.enabled=false**.

## 4. Prefer constructor based dependency injection
We can autowire the dependencies using **constructor-injection** or **setter-injection** or **@Autowired** on property itself.
Personally I think Constructor injection is the better option. So, I try to always define the dependencies as **final** variables so that it will force to initialize in constructor.

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

This way it will be easier to instantiate **CustomerService** with necessary dependencies for testing if required.

## 5. Use TestContainers to test with real dependencies
One common pattern that I observed in SpringBoot applications is using in-memory databases like H2 for testing and using other RDBMS like Postgres, Oracle etc for production. I think it is not a good practice for several reasons. 

First, the production database behavior might be different than in-memory database and hence some bugs might not be detected during testing. Second, some features (ex: JSONB) might not be supported by in-memory databases where as production database supports.

These days most of the applications use Docker in some way or the other. So, we can use [TestContainers](https://www.testcontainers.org/) which is a docker based library for testing with a real database similar to production database.

You can refer the following to learn how to use TestContainers for Integration Testing with SpringBoot:

* https://github.com/testcontainers/testcontainers-java/tree/master/examples/spring-boot
* https://www.baeldung.com/spring-boot-testcontainers-integration-test

## 6. Use Test Slice annotations to speed up tests
We write Unit tests to test the behavior of single class and Integration tests to test the behavior of a logical group of components. So, generally we don't need the Spring magic for unit tests. We should be able to create an instance of the class (probably with mock dependencies) and test the behavior.

However, while unit testing Spring based components like **Controllers** or **Spring Data Repositories** we need Spring ApplicationContext to be created. SpringBoot provides **@SpringBootTest** to load ApplicationContext and we can test the components. But the **@SpringBootTest** annotation loads all components in the application which might take more time. 

For Unit tests we generally want to load only the component we want to test with mock dependencies without loading any other unnecessary dependencies.

SpringBoot provides various other test annotations like **@WebMvcTest**, **@DataJpaTest** etc to only load a slice of the ApplicationContext components. So, it is better to unit test the Spring components by using slice specific annotations rather than **@SpringBootTest**.

You can learn more about using SpringBoot Testing annotations with following articles:

* https://pivotal.io/application-transformation-recipes/testing/spring-boot-testing-best-practices
* https://spring.io/guides/gs/testing-web/
* https://reflectoring.io/spring-boot-web-controller-test/

## 7. Use database migration tools
While using a relational database with SpringBoot and JPA it is easier to get started with auto generation of database schema from entity definitions. However, for complex applications it is better to use Database Migration tools like [Flyway](https://flywaydb.org/) or [Liquibase](https://www.liquibase.org/). These tools will help in maintaining versioned database migration scripts and keep track of the current state of the database and determine what migration scripts need to be run.

## 8. Prefer Off the Shelf security solutions instead of rolling your own
Spring Security make it easy to implement security, but still implementing security properly with OAUTH, SAML etc integrations is still very complex. Security is a very complex subject and needs lot of expertise to properly implement it. If at all possible to use off the shelf security solutions like [Okta](https://www.okta.com/) then use them instead of rolling your own security implementation.

## 9. Use dedicated configuration classes
In our project we may need to create several Spring Configuration classes to define or customize the beans. For example we want to configure **Swagger**, **Jackson**, **AWS**, **ElasticSearch**, **Redis** etc. Instead of configuring all of them in one configuration class it would be better to have a separate dedicated Configuration classes for each one of them.

## 10. Avoid boilerplate code with custom SpringBoot starter
In some organizations there will be some home-grown libraries to achieve some common functionality like security, secrets management, caching etc. We can create custom SpringBoot starter to auto-configure the library features so that we don't need to repeat the boilerplate code for every application. 

You can refer my post [Creating Custom SpringBoot Starter for Twitter4j](https://sivalabs.in/creating-custom-springboot-starter-for/) on how to create a custom SpringBoot starter.

For more info on creating our own SpringBoot starter see https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#boot-features-custom-starter

