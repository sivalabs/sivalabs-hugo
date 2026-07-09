---
title: "Don't Pollute Your Spring Boot Main EntryPoint Class"
author: Siva
images: ["/images/dont-pollute-springboot-main-class.webp"]
type: post
draft: false
date: 2026-06-16T04:59:17+05:30
url: /blog/dont-pollute-spring-boot-main-class
toc: false
categories: ["SpringBoot"]
tags: ["Java", "SpringBoot"]
---

Most Spring Boot applications start with a beautifully boring main class.

Then one day we need caching. We add `@EnableCaching`.

Then we need async processing. We add `@EnableAsync`.

Then scheduling. Then JPA auditing. Then maybe something else.

Before we know it, the main class has become the place where every framework feature goes to live.

At first glance, this feels harmless. The application starts. The feature works. Everybody moves on.

This works great... until a slice test gets involved.

Let's look at why adding every `@EnableXXX` annotation to the Spring Boot main class can make your tests more fragile, and what I prefer to do instead.

<!--more-->

## The Main Class Should Be Boring

In a typical Spring Boot application, the main class looks like this:

```java
package dev.sivalabs.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

This class has one job: start the application.

That is it.

But the quickest way to enable many Spring features is to add an annotation directly here:

```java
package dev.sivalabs.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

You will see this style in many projects. I have written this style too.

And to be fair, it works.

The problem is not that the application fails to start. The problem is that the main class is now carrying configuration for multiple technical concerns:

* caching
* async execution
* scheduling
* persistence auditing

Those concerns may not all be needed in every Spring ApplicationContext you create.

And tests create many different kinds of ApplicationContexts.

## Here's Where The Trouble Starts

Let's use a small example with Spring Data JPA auditing.

Suppose we have a `User` entity with `createdAt` and `updatedAt` fields:

```java
import jakarta.persistence.EntityListeners;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "created_at")
    @CreatedDate
    protected LocalDateTime createdAt;

    @Column(name = "updated_at")
    @LastModifiedDate
    protected LocalDateTime updatedAt;

    //setters & getters

}
```

The entity uses Spring Data JPA auditing through `@CreatedDate` and `@LastModifiedDate`.

Then we create a repository:

```java
interface UserRepository extends JpaRepository<User, Long> {
}
```

And a simple REST controller:

```java
@RestController
@RequestMapping("/api/users")
class UserController {

    private final UserRepository userRepository;

    UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    List<User> getAll() {
        return userRepository.findAll();
    }
}
```

To make auditing work, we need to enable it using `@EnableJpaAuditing`.

The easy option is to put it on the main class:

```java
@SpringBootApplication
@EnableJpaAuditing
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

Again, the application starts fine.

But now let's write a focused test for the web layer:

```java
@WebMvcTest(controllers = UserController.class)
class UserControllerTests {

    @MockitoBean
    UserRepository userRepository;

    @Autowired
    protected MockMvcTester mvc;

    @Test
    void shouldGetAllUsers() {
        given(userRepository.findAll()).willReturn(List.of());

        var testResult = mvc.get().uri("/api/users").exchange();

        assertThat(testResult).hasStatusOk();
    }
}
```

`@WebMvcTest` is intentionally narrow. It loads the MVC layer, not the entire application.

That is exactly why we use it. We want to test request mapping, validation, JSON serialization, HTTP status codes, exception handling, and controller behavior without starting the database layer.

We also provide the controller dependency using a mock:

```java
@MockitoBean
UserRepository userRepository;
```

So, in theory, JPA should not matter here.

But if `@EnableJpaAuditing` is sitting on the main class, the test can fail with an error like this:

```shell
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaAuditingHandler': Cannot resolve reference to bean 'jpaMappingContext' while setting constructor argument
....
....
....
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaMappingContext': JPA metamodel must not be empty
....
....
```

This is the annoying part.

We are testing a controller. We mocked the repository. We did not ask Spring to start JPA.

But JPA auditing still entered the room because we attached it to the main application configuration.

## So What's Actually Going On?

Spring Boot test slices like `@WebMvcTest` still need to find the application's boot configuration.

In a normal project, that usually means the class annotated with `@SpringBootApplication`.

If that class only says "this is my Spring Boot application", life is simple.

But if that class also enables JPA auditing, scheduling, async processing, caching, or other infrastructure, those choices become part of the boot configuration that test slices have to deal with.

In this specific case, `@EnableJpaAuditing` tries to create auditing infrastructure. That infrastructure expects JPA mapping support to be available. A web slice does not load the full JPA stack, so Spring ends up trying to create a persistence-related bean in a context where persistence was never supposed to exist.

That is how you get a JPA error from a controller test.

The framework is not being unreasonable. We gave it mixed signals.

## Move Feature Configuration To Its Own Place

The fix is simple: move `@EnableJpaAuditing` into a dedicated configuration class.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class PersistenceConfig {
    
}
```

And keep the main class clean:

```java
package dev.sivalabs.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

Now the application still enables JPA auditing during a normal application startup, because `PersistenceConfig` is part of component scanning.

But the main class no longer forces every test slice to carry that persistence concern as part of the boot configuration.

Run the `@WebMvcTest` again, and it should pass.

## This Is Not Just About JPA Auditing

JPA auditing is a good example because it fails loudly.

But the same smell appears with other annotations too:

```java
@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableScheduling
@EnableJpaAuditing
public class Application {
}
```

Each annotation may be perfectly valid.

The question is: should it live on the main class?

In most business applications, I prefer grouping these concerns into small configuration classes:

```java
@Configuration
@EnableCaching
class CacheConfig {
}
```

```java
@Configuration
@EnableAsync
class AsyncConfig {
}
```

```java
@Configuration
@EnableScheduling
class SchedulingConfig {
}
```

```java
@Configuration
@EnableJpaAuditing
class PersistenceConfig {
}
```

This is not about creating configuration classes for the sake of architecture theater.

It is about making each technical concern explicit, named, and easier to include or exclude when needed.

The main class should be the front door of the application.

Don't turn it into the storage room.
