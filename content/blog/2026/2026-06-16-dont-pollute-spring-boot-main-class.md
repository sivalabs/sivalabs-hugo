---
title: "Don't Pollute Spring Boot Main Entrypoint Class"
author: Siva
images: ["/images/dont-pollute-springboot-main-class.webp"]
type: post
draft: false
date: 2026-06-16T04:59:17+05:30
url: /dont-pollute-spring-boot-main-class
toc: false
categories: [SpringBoot]
tags: ["Java", "SpringBoot"]
---
One common mistake Spring Boot application developers do is enabling features by adding **@EnableXXX** annotation on the main entrypoint class.
In this article, let's explore why it is a bad practice and learn what is the recommended way.
<!--more-->

In a Spring Boot application you usually have one main entrypoint class as follows:

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

If you want to enable some features like caching, async processing, JPA Auditing, etc, then the quickest way to do is to add **@EnableXXX** annotations to the main entrypoint class.

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

This seems to be working just fine. However, there are some problems lurking around.

Let's understand the problem with an example.

Let's build a very simple REST API endpoint using Spring Data JPA and H2.

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

This is a JPA entity that is leveraging Spring Data JPA Auditing support by using **@CreatedDate** and **@LastModifiedDate**

Next, create Spring Data Repository and REST Controller.

```java
interface UserRepository extends JpaRepository<User, Long> {
}
```

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

We almost have everything except we need to enable Spring Data JPA Auditing support by using **@EnableJpaAuditing** on a Spring Configuration class.

You can simply add **@EnableJpaAuditing** to the main entrypoint class, and it just works fine.

```java
@SpringBootApplication
@EnableJpaAuditing
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

Now, let's say we want to write a slice test to test the **UserController** as follows:

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

The **@WebMvcTest** slice test annotation only loads the "web" layer components, and we have provided its dependency **UserRepository** using a Mock.

However, if you run this test, you will see the following error:

```shell
org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaAuditingHandler': Cannot resolve reference to bean 'jpaMappingContext' while setting constructor argument
....
....
....
Caused by: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'jpaMappingContext': JPA metamodel must not be empty
....
....
```

This error usually occurs when **@EnableJpaAuditing** is enabled, but Spring Data JPA's mapping infrastructure (**JpaMetamodelMappingContext**) is not available when the auditing bean is being created.

When the **@EnableJpaAuditing** is added on the main entrypoint class itself, bootstrapping Spring ApplicationContext failed because JPA infrastructure is not loaded as we are using **@WebMvcTest**.

The fix is simply moving **@EnableJpaAuditing** to its own Configuration class and removing it from the main entrypoint class.

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class PersistenceConfig {
    
}
```

Now run the test again and it should PASS.

The lesson is not to put all those **@EnableXXX** annotations on the main entrypoint class, instead create separate Configuration classes.
This helps in keeping hte separation of concerns and also helps in writing clean tests loading only what is necessary.
