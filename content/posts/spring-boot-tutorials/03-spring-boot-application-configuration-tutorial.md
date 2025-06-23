---
title: "Spring Boot Application Configuration Tutorial"
author: Siva
images: ["/preview-images/spring-boot-configuration-tutorial.webp"]
type: post
draft: false
date: 2023-07-26T06:00:00+05:30
url: /spring-boot-application-configuration-tutorial
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
description: In this tutorial, you will learn how to configure your Spring Boot application using properties and YAML files for running in different environments.
---

In the previous [Spring Boot Testing Tutorial]({{< relref "02-spring-boot-testing-tutorial.md" >}}),
we have learned how to write unit, slice and integration tests for a Spring Boot application.

In this tutorial, you will learn how to configure your Spring Boot application using **properties** and **YAML** files 
for running the application in different environments.

## Externalizing Spring Boot Application Configuration
Any non-trivial application will have some configuration that you would like to make it configurable 
instead of hard-coding those values in the application code. 

Spring Boot provides [many ways to configure your application properties](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config),
among which we most likely use only the following approaches:

* Default properties in **src/main/resources/application.{properties/yml}**
* Profile-specific properties in **src/main/resources/application-{profile}.{properties/yml}**
* Overriding the default configuration using **Environment Variables** or **System Properties**

Typically, in our applications we will have 2 types of configuration properties:

* Spring Boot defined properties to configure services like DataSource, Kafka etc. 
  Ex: **spring.datasource.url**, **spring.datasource.username**, **spring.datasource.password**, etc

* Your application specific configuration properties.

## Configuring Default Properties
Spring Boot by default loads properties from **src/main/resources/application.{properties/yml}**.
For example, we can configure our application properties using **application.properties** file as follows:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=secret123

ftp.host=ftpsrv001
ftp.port=21
ftp.username=appuser1
ftp.password=secret321
```

The same configuration values can be configured using **application.yml** file as follows:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/postgres
    username: postgres
    password: secret123

ftp:
  host: ftpsrv001
  port: 21
  username: appuser1
  password: secret321
```

## Configuring Profile-specific Properties
Our application may run in different environments such as **local**, **dev**, **qa**, **staging** and **production**.
We may want to configure different values for different environments. 
In such cases, we can use Spring's profile concept to configure different values for different environments.

Let's say we want to configure different database connection properties based on running environment.
We can configure local database parameters in default **application.properties** file, 
**qa** and **staging** properties using qa and staging profiles specific properties files as follows:

**application.properties**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=secret123
```

**application-qa.properties**

```properties
spring.datasource.url=jdbc:postgresql://qadb:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=secret123
```

**application-staging.properties**

```properties
spring.datasource.url=jdbc:postgresql://stagingdb:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=secret123
```

When you run your application with a specific profile, then first properties from default profile will be loaded 
and then profile-specific properties will override them.

Instead of creating separate properties file for different profiles, you can put all profile properties in 
**application.properties** file and separate profile-specific configuration by using `"#---"` or `"!---"` separator as follows: 

**application.properties**

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=secret123

#---
spring.config.activate.on-profile=qa
spring.datasource.url=jdbc:postgresql://qadb:5432/postgres
spring.datasource.username=postgresqa
spring.datasource.password=secret1235

#---
spring.config.activate.on-profile=staging
spring.datasource.url=jdbc:postgresql://stagingdb:5432/postgres
spring.datasource.username=postgresstaging
spring.datasource.password=secret1236
```

If you are using YAML files, then you can configure different profile properties in the same **application.yml** file 
using `"---"` separator as follows:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/postgres
    username: postgres
    password: secret123
---
spring:
  config:
    activate:
      on-profile: "qa"
  datasource:
    url: jdbc:postgresql://qadb:5432/postgres
    username: postgres
    password: secret1235
```

## Using Environment Variables
A common approach is defining the default and profile-specific properties in the configuration files which will be packaged inside the jar file 
and then override those values using Environment Variables if required.

Spring Boot support [Relaxed Binding](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config.typesafe-configuration-properties.relaxed-binding)
which allows us to use environment variables with capitalized variable names separated with underscores follows:

* The **spring.datasource.url** property value can be overriden by environment variable **SPRING_DATASOURCE_URL**.
* The **app.jwt.expiryDuration** property value can be overriden by environment variable **APP_JWT_EXPIRY_DURATION**.

## How to use the configured properties from application?
There are multiple ways we can use the configured properties values.
In the above examples, we have configured DataSource properties which will be used by Spring Boot to create **DataSource** bean.

Let us see how can use the configured FTP server details.

### Using Environment
You can access all your application properties using Spring's **Environment** abstraction.
You can inject **Environment** bean and access the properties as follows:

```java
import org.springframework.core.env.Environment;

@Service
class MyService {
    private final Environment environment;
    
    public MyService(Environment environment) {
        this.environment = environment;
    }
    
    void upload(File file) {
      String host = environment.getProperty("ftp.host", "localhost");
      Integer port = environment.getProperty("ftp.port", Integer.class, 21);
      String username = environment.getRequiredProperty("ftp.username");
      String password = environment.getRequiredProperty("ftp.password");
      ...
      ...
    }
}
```

As you can see, we can obtain the configured values using **environment.getProperty("...")**.
You can also use other overloaded methods to specify default value, dataType of the property etc.
When you use **environment.getRequiredProperty("...")** and if the property value is **null** then it will throw **IllegalStateException**.

Instead of using Spring's **Environment** abstraction, which ties your code to the Spring framework, 
you can inject the property values directly using **@Value** annotation.

### Using @Value("${property.name}")
You can inject the property values using **@Value** annotation as follows:

```java
@Service
class MyService {
    private final String ftpHost;
    private final Integer ftpPort;
    private final String ftpUsername;
    private final String ftpPassword;
    
    public MyService(@Value("${ftp.host:localhost}") String ftpHost,
                     @Value("${ftp.port:21}") Integer ftpPort,
                     @Value("${ftp.username}") String ftpUsername,
                     @Value("${ftp.password}") String ftpPassword
                     ) {
        this.ftpHost = ftpHost;
        this.ftpPort = ftpPort;
        this.ftpUsername = ftpUsername;
        this.ftpPassword = ftpPassword;
    }
    
    void upload(File file) {
      ...
      ...
    }
}
```

We have used Spring property reference syntax **@Value("${property.name}")** to inject the configured value.
Optionally, we can also specify a default value using **@Value("${property.name:defaultValue}")** syntax.

You can also inject the property value using Field Injection, by highly discouraged.

```java
@Service
class MyService {
    @Value("${ftp.host:localhost}")
    private String ftpHost;
    
    @Value("${ftp.port:21}")
    private Integer ftpPort;
    
    @Value("${ftp.username}")
    private String ftpUsername;
    
    @Value("${ftp.password}")
    private String ftpPassword;
    
}
```

While using the **@Value("${property.name}")** approach works, it is very verbose.
There is an alternative way to use the configured properties using Typesafe Configuration Properties binding.

### Using Typesafe Configuration Properties Binding
Instead of binding each property value separately using **@Value**, we can create a class with the properties and 
let the Spring framework bind the configured values into an instance of that configuration properties class 
by using **@ConfigurationProperties** as follows:

```java
@ConfigurationProperties(prefix = "ftp")
public class FtpProperties {
    private String host;
    private Integer port;
    private String username;
    private String password;
}
```

Once we defined the configuration properties class, we need to enable the binding using **@EnableConfigurationProperties(FtpProperties.class)**.
This is typically done on the application main entrypoint class as follows:

```java
@SpringBootApplication
@EnableConfigurationProperties(FtpProperties.class)
public class MyApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyApplication.class, args);
  }
}
```

We can have as many configuration properties class as we want and register them using
**@EnableConfigurationProperties({FtpProperties.class, SomeProperties.class, OtherProperties.class})**.
Instead of specifying each configuration properties class explicitly, we can use **@ConfigurationPropertiesScan**
which will scan for all the classes that are annotated with **@ConfigurationProperties** and automatically register them.

```java
@SpringBootApplication
@ConfigurationPropertiesScan
public class MyApplication {

  public static void main(String[] args) {
    SpringApplication.run(MyApplication.class, args);
  }
}
```

However, a common approach is having one configuration properties class 
and using nested classes for a different group of properties as follows:

```java
@ConfigurationProperties(prefix = "app")
public class ApplicationProperties {
    private final FtpProperties ftp = new FtpProperties();
    private final Jwt jwt = new Jwt();
    
    public static class FtpProperties {
      private String host;
      private Integer port;
      private String username;
      private String password;
      //setters & getters
    }

  public static class Jwt {
    private String secret;
    private Long expiryDuration;
    //setters & getters
  }
  
}
```

Now you can configure your application properties with **app.** prefix as follows:

```properties
app.ftp.host=ftpsrv001
app.ftp.port=21
app.ftp.username=appuser1
app.ftp.password=secret321

app.jwt.secret=supersecret
app.jwt.expiryDuration=3600000
```

### Using Java records for Configuration Properties Binding
Usually, once the application is started and configuration properties class is initialized by Spring,
we don't change the property values in that object. In that case, Java record is a better fit than a regular class.

Let's see how we can use Java records as configuration properties class.

```java
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "app")
public record ApplicationProperties(
    FtpProperties ftp,
    Jwt jwt){

    public record FtpProperties(
        @DefaultValue("localhost")
        String host,
        @DefaultValue("21")
        Integer port,
        String username,
        String password){
    }
    
    public record Jwt(
        String secret, 
        Long expiryDuration){
    }
}
```

Using records for binding configuration properties will help you 
to prevent accidental modification of the values as you can't change the values of a record.

## Validating Configuration Binding Properties

We can use Java Bean Validation API to validate the configuration property values so that we can fail-fast in case of invalid configuration 
during the application startup.

In order to use Java Bean Validation API we need to add the following dependency:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

Now we can use Bean Validation annotations like **@NotNull**, **@NotEmpty**, **@Min**, **@Max** as follows:

```java
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "app")
@Validated
public class ApplicationProperties {
    @Valid
    private final FtpProperties ftp = new FtpProperties();
    
    @Valid
    private final Jwt jwt = new Jwt();
    
    public static class FtpProperties {
      @NotEmpty  
      private String host;
      private Integer port;
      @NotEmpty
      private String username;
      @NotEmpty
      private String password;
      //setters & getters
    }

  public static class Jwt {
    @NotEmpty
    private String secret;
    @NotNull
    @Min(30000)
    private Long expiryDuration;
    //setters & getters
  }
  
}
```

Note that, in order to trigger the validation, we need to add **@Validated** annotation on top-level class, 
and to validate properties of the nested class properties, we need to add **@Valid** on the property declaration.

{{< box tip >}}
**Tip:**

You can also watch my [Spring Boot Tips : Part 2 - Managing Application Configuration Properties In The Right Way](https://www.youtube.com/watch?v=4OX7hbAGuRE) video.
{{< /box >}}

## Advanced Configuration Options
In addition to the approaches described above, Spring Boot supports more advanced options to configure the application properties.

* [Spring Cloud Config Server](https://spring.io/projects/spring-cloud-config)
* [Spring Cloud Vault](https://spring.io/projects/spring-cloud-vault)
* [AWS Secrets Manager and Parameter Store](https://docs.awspring.io/spring-cloud-aws/docs/3.0.1/reference/html/index.html#spring-cloud-aws-secrets-manager)
* [Kubernetes ConfigMaps and Secrets](https://spring.io/projects/spring-cloud-kubernetes)

These configuration options will be explained in separate tutorials in the future.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page.
{{< /box >}}

## Summary
We have learned how to externalize our application configuration using default properties, profile-specific properties and also environment variables.
We also looked at how to consume those configured properties from our application.
Finally, we learned how to validate our application configuration using Java Bean Validation API annotations.

