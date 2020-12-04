---
title: Quirks of Spring's @TestConfiguration
author: Siva
images: ["/preview-images/surprised.webp"]
type: post
draft: false
date: 2020-12-04T04:59:17+05:30
url: /2020/12/quirks-of-spring-testconfiguration/
categories: [SpringBoot]
tags: [SpringBoot]
---
If you know me you know that I am a big fan of Spring ecosystem.
I have been using Spring framework since 2007, and I am pretty familiar with many of its features.

Even if we are familiar with some technology once in a while we get stuck with small issues and end up spending hours and hours figuring out why something is not working as expected.

Spring framework is very flexible, and usually there are multiple ways to achieve the same thing.
Most of the times all different ways result in same behaviour, but sometimes it may exhibit different behaviour.

Recently I faced one such issue with Spring's `@TestConfiguration` feature, and I would like to share my learnings.

Let's start with creating a simple SpringBoot application, no need to add any starters, but you can add Lombok to avoid boilerplate.

Create a simple `MyService` class as follows:

```java
package com.sivalabs.myapp;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class MyService {
    private final String content;

    public String getContent() {
        return content;
    }
}
```

Create a Spring Configuration class `AppConfig` and register `MyService` as a bean.

```java
package com.sivalabs.myapp;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    public MyService myService() {
        return new MyService("content-prod");
    }
}
``` 

The main entrypoint class `Application.java`

```java
package com.sivalabs.myapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

Write the following SpringBoot integration test `ApplicationTest` as follows:

```java
package com.sivalabs.myapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ApplicationTest {
    @Autowired
    private MyService myService;
    
    @Test
    void contextLoads() {
        System.out.println(myService.getContent());
    }
}
```

There is nothing special so far and as you might have expected when you run the test it will print **content-prod**.

In our SpringBoot applications we might want to have different(mock) configurations for testing.

> One such usecase is we might want to use Localstack docker container for testing AWS related functionality.
For production use we register AmazonS3, AmazonSQS etc beans which talks to real AWS services 
whereas for testing we can configure those beans EndpointURI pointing to localstack http://localhost:4566.

Let's see how we can use Spring's `@TestConfiguration` feature to configure beans for testing.

As a good developer you can take a good look at the official documentation 
[Detecting Test Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/spring-boot-features.html#boot-features-testing-spring-boot-applications-detecting-config)
 before starting our exciting journey.

From docs:

```
If you want to customize the primary configuration, you can use a nested @TestConfiguration class. 
Unlike a nested @Configuration class, which would be used instead of your application’s primary configuration, 
a nested @TestConfiguration class is used in addition to your application’s primary configuration.
```
#### Case 1: Using top-level @TestConfiguration class

Create `TestConfig` class as follows:
 
```java
package com.sivalabs.myapp;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {
    @Bean
    public MyService myService() {
        return new MyService("content-testconfig-toplevel");
    }
}
```

Now if you run ApplicationTest again then you will see **content-prod** printed in the console.

Again, if you read the docs,

```
@TestConfiguration can be used on an inner class of a test to customize the primary configuration. 
When placed on a top-level class, @TestConfiguration indicates that classes in src/test/java should not be picked up by scanning. 
You can then import that class explicitly where it is required.
```

Ok, so if you are using `@TestConfiguration` for a top-level class it won't be picked up automatically, we need to import it explicitly.

```java
package com.sivalabs.myapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestConfig.class)
class ApplicationTest {
    @Autowired
    private MyService myService;
    
    @Test
    void contextLoads() {
        System.out.println(myService.getContent());
    }
}
```

If you run the test now, you will get the following error:

```
A bean with that name has already been defined in class path resource [com/sivalabs/myapp/TestConfig.class] and overriding is disabled.

Action:

Consider renaming one of the beans or enabling overriding by setting spring.main.allow-bean-definition-overriding=true
```

Let's add `spring.main.allow-bean-definition-overriding=true` to `src/main/resources/application.properties` and run the test again.

You might be expecting **content-testconfig-toplevel** but **content-prod** gets printed.

Don't know why `MyService` defined in `TestConfig` didn't take priority.
Let's try adding `@Primary` to tell Spring to take this bean with high priority.

```java
package com.sivalabs.myapp;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestConfig {
    @Bean
    @Primary
    public MyService myService() {
        return new MyService("content-testconfig-toplevel");
    }
}
```

Run the test again, but still **content-prod** gets printed.

**Siva, you said you are good at Googling**

![You are goddamn right](/images/youre-goddamn-right.webp "You are goddamn right")

> For a software developer, searching for solutions on StackOverflow, GitHub issues, blogs, forums etc is an invaluable skill.

After a bit of googling someone on StackOverflow said, while overriding beans using `@TestConfiguration` the bean name should be different from actual bean name.
We can change bean name either by naming the method as `myServiceMock()` or using `@Bean(name = "myServiceMock")`.

```java
package com.sivalabs.myapp;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestConfig {
    @Bean
    @Primary
    public MyService myServiceMock() {
        return new MyService("content-testconfig-toplevel");
    }
}
```

Run the test again, now you can see **content-testconfig-toplevel** gets printed in the console.

#### Case 2: Using nested @TestConfiguration class
Instead of using top-level `@TestConfiguration` class we can also use nested class as follows:

```java
package com.sivalabs.myapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@SpringBootTest
class ApplicationTest {
    @Autowired
    private MyService myService;
    
    @Test
    void contextLoads() {
        System.out.println(myService.getContent());
    }

    @TestConfiguration
    static class TestConfig {
        @Bean
        @Primary
        public MyService myServiceMock() {
            return new MyService("content-testconfig-nested");
        }
    }
}
```

Run the test again, now you can see **content-testconfig-nested** gets printed in the console.

Now comes the interesting part. Remove `@Primary` annotation and rename `myServiceMock()` to `myService()` and run the test again.
It just works fine and **content-testconfig-nested** gets printed in the console.

> The `@TestConfiguration` is working differently when used on top-level class and nested-class.

#### Case 3: Using nested @TestConfiguration class from Parent class
It's common to have a `AbstractBaseIntegrationTest` with all the configurations for integration tests and inherit it.

Let's create `AbstractBaseIntegrationTest` as follows:

```java
package com.sivalabs.myapp;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@SpringBootTest
public class AbstractBaseIntegrationTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public MyService myService() {
            return new MyService("content-testconfig-parent-nested");
        }
    }
}
```

Update `ApplicationTest` to extend `AbstractBaseIntegrationTest` as follows:

```java
package com.sivalabs.myapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ApplicationTests extends AbstractBaseIntegrationTest {

    @Autowired
    private MyService myService;

    @Test
    void contextLoads() {
        System.out.println(myService.getContent());
    }
}
```

If you run the test now you can see **content-prod** gets printed in the console.
So, the nested `@TestConfiguration` class from the parent class is not being used.

One quick way to make it work is by adding `@ContextConfiguration` annotation to `AbstractBaseIntegrationTest`.

```java
import org.springframework.test.context.ContextConfiguration;

@SpringBootTest
@ContextConfiguration
public class AbstractBaseIntegrationTest {

    @TestConfiguration
    static class TestConfig {
        @Bean
        public MyService myService() {
            return new MyService("content-testconfig-parent-nested");
        }
    }
}
```

#### Case 4: Using top-level @TestConfiguration class from Parent class
This approach is kind of combination of Case 2 and Case 3.

We can create top-level `@TestConfiguration` class as follows:

```java
package com.sivalabs.myapp;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

@TestConfiguration
public class TestConfig {
    @Bean
    @Primary
    public MyService myServiceMock() {
        return new MyService("content-testconfig-toplevel");
    }
}
```

Import `TestConfig` in `AbstractBaseIntegrationTest` as follows:

```java
package com.sivalabs.myapp;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestConfig.class)
public class AbstractBaseIntegrationTest {

}
```

Finally, extend our IntegrationTest from `AbstractBaseIntegrationTest` class.

```java
package com.sivalabs.myapp;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

class ApplicationTests extends AbstractBaseIntegrationTest {

    @Autowired
    private MyService myService;

    @Test
    void contextLoads() {
        System.out.println(myService.getContent());
    }
}
```

If you run the test now you can see **content-testconfig-toplevel** gets printed in the console.

As you have noticed, using `@TestConfiguration` class in different ways is exhibiting different behaviours.
I hope Spring team will streamline the `@TestConfiguration` behaviour in future releases :-)
