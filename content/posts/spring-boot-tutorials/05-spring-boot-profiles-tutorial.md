---
title: "Spring Boot Profiles Tutorial"
author: Siva
images: ["/preview-images/spring-boot-profiles-tutorial.webp"]
type: post
draft: false
date: 2023-07-30T06:00:00+05:30
url: /spring-boot-profiles-tutorial
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
description: In this tutorial, you will learn how to use Profiles in your Spring Boot application to configure properties and beans differently for different environments.
---

## Introducing Spring Profiles
Typically, software applications run in different environments.
During development, it will be **local**, and then we may deploy it on **QA**, **Staging**, **Performance** 
and finally in **Production** environments.
You may have to configure your application with different configuration properties while running the application 
in different environments. 

For example, if you are using a database then you may configure the database connection properties to a locally running database 
during development. While deploying it on QA, Staging, Performance and Production environments, 
you will need to configure the database properties to that environment specific database.

Spring provides great support for externalizing the application properties so that we can configure different properties 
while running in different environments.

{{< box tip >}}
**Spring Boot Application Configuration Tutorial**

To learn more about how to configure application properties,
please refer [Spring Boot Application Configuration Tutorial]({{< relref "03-spring-boot-application-configuration-tutorial.md" >}}) tutorial.
{{< /box >}}

To make it even simpler, we can use Spring Profiles where we can configure our application properties using different profiles 
and then enable the desired profiles based on our needs.

## Profile specific configuration using properties
Let's assume we are building a Spring Boot application which uses PostgreSQL database.
We want to run our application locally pointing to PostgreSQL database running on our laptop.
Also, we want to deploy our application in QA and Production environments.

We can configure the default properties in **default** profile configuration file **src/main/resources/application.properties** as follows:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=postgres
```

We can configure any profile specific properties in **src/main/resources/application-{profile}.{properties/yml}** file
and Spring Boot automatically use profile specific properties when you activate that profile.
So, we can configure QA profile configuration properties in **src/main/resources/application-qa.properties** as follows:

```properties
spring.datasource.url=jdbc:postgresql://postgres_qa:5432/postgres
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

In **qa** profile configuration file we have configured the JDBC URL pointing to a remote database **postgres_qa**.
And, username and password are configured to use environment variables **DB_USERNAME**, **DB_PASSWORD** respectively.

Instead of creating separate properties file for different profiles, you can put all profile properties 
in **application.properties** file and separate profile-specific configuration by using `"#---"` or `"!---"` separator as follows:

**application.properties**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=postgres

#---
spring.config.activate.on-profile=qa
spring.datasource.url=jdbc:postgresql://postgres_qa:5432/postgres
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

## Profile specific configuration using Configuration classes
Profiles support not only limited to configuring properties.
We can also use Profiles to register beans in Spring Configuration classes a follows:

```java
@Configuration
class RepositoriesConfiguration {
    
    @Bean
    @Profile("jdbc")
    UserRepository jdbcUserRepository() {
        return new JdbcUserRepository();
    }

    @Bean
    @Profile("mongo")
    UserRepository mongoUserRepository() {
        return new MongoUserRepository();
    }
}
```

In this Spring configuration class, we have registered 2 different **UserRepository** beans but with different profiles.
Now, when the application is started using **"jdbc"** profile then **JdbcUserRepository** instance will be registered. 
If **"mongo"** profile is enabled then **MongoUserRepository** instance will be registered.

In addition to applying **@Profile** at the **@Bean** level, we can also use **@Profile** at the class level on **@Configuration** classes.
In that case, all the beans registered in that class will be associated with that profile and will be registered in the ApplicationContext 
only if that profile is active.

## Using Profile Expressions
You can associate more than one profile using **@Profile** annotation as follows:

```java
@Configuration
class RepositoriesConfiguration {
    @Bean
    @Profile({"mongo", "cloud"})
    UserRepository mongoUserRepository() {
        return new MongoUserRepository();
    }
}
```
In this example, the **MongoUserRepository** bean is registered with **"mongo"** and **"cloud"** profile.
If either **"mongo"** or **"cloud"** profile is activate then **MongoUserRepository** bean will be registered.

In addition to associating multiple profiles, we can also use **Profile Expressions** to implement complex bean registration needs.

```java
@Configuration
class RepositoriesConfiguration {
    @Bean
    @Profile({"mongo & cloud", "docker", "!jdbc"})
    UserRepository mongoUserRepository() {
        return new MongoUserRepository();
    }
}
```
As you can see, we can use the logical operators **&, | and !** operators also.
In the above example, the **MongoUserRepository** bean will be registered if at least one of the following condition is true:

* Enabled both **mongo** and **cloud** profiles
* Enabled **docker** profile
* Not enabled **jdbc** profile

{{< box info >}}
**Important:**

If you define a bean without associating to any profile then that bean is associated with **"default"** profile which is active by default.
{{< /box >}}

While Profile Expressions gives more power to configure profiles, **DON'T OVER USE PROFILES**.
Otherwise, soon you will find yourself wondering which bean is going to be registered in which scenario. 

{{< figure src="https://media.tenor.com/GXgi36aVH3gAAAAd/confused-meme-confused.gif" alt="confused" >}}


## How to activate Spring Profiles
Once we configured profile specific properties and beans, we need to activate the profile(s) in order to 
enable profile-specific configurations.

A common way to enable profile(s) is using **SPRING_PROFILES_ACTIVE** environment variable.

```shell
$ export SPRING_PROFILES_ACTIVE=mongo
$ java -jar app.jar

$ SPRING_PROFILES_ACTIVE=docker,jdbc java -jar app.jar
```

You can also enable profiles using **spring.profiles.active** System Property as follows:

```shell
$ java -Dspring.profiles.active=docker,jdbc -jar app.jar
```

In tests, you can enable profiles using **@ActiveProfiles** annotation as follows:

```java
@SpringBootTest
@ActiveProfiles({"test", "integration-test"})
class CustomerControllerTest {

  @Test
  void testSomething() {
      ...
  }
}
```

If you don't activate any profiles, then the **"default"** profile will be active, and you can see it in the application logs as follows: 

```shell
2023-07-29T09:55:53.709+05:30  INFO 4338 --- [  restartedMain] c.s.h.Application    : Starting Application using Java 17.0.4.1 with PID 4338...
2023-07-29T09:55:53.710+05:30  INFO 4338 --- [  restartedMain] c.s.h.Application    : No active profile set, falling back to 1 default profile: "default"
...
...
```

If you enable **"docker", "jdbc"** profiles and start the application, you can see the activated profiles in the application logs as follows:

```shell
2023-07-29T09:55:53.709+05:30  INFO 4338 --- [  restartedMain] c.s.h.Application    : Starting Application using Java 17.0.4.1 with PID 4338...
2023-07-29T09:55:53.710+05:30  INFO 4338 --- [  restartedMain] c.s.h.Application    : The following 2 profiles are active: "docker", "jdbc"
...
...
```

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{< relref "/spring-boot-tutorials" >}}) page. 
{{< /box >}}

## Summary
Spring Profiles are typically used for configuring environment specific properties,
but you can use profiles for any arbitrary criteria. 
While Spring Profiles comes handy, overusing them will make understanding the application 
configuration confusing in the long run. 

In this tutorial, we have learned how to use profiles to configure profile-specific properties,
register beans and activating the desired profiles.
