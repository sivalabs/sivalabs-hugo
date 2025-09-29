---
title: Spring Boot REST API Best Practices - Part 1
author: Siva
images:
  - /preview-images/spring-boot-rest-api-part-1.webp
type: post
draft: false
date: 2023-08-21T00:30:00.000Z
url: /blog/spring-boot-rest-api-best-practices-part-1
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Tutorials
description: In this tutorial, you will learn how to create a Spring Boot REST API and use best practices to implement CRUD API endpoints.
aliases:
  - /spring-boot-rest-api-best-practices-part-1
---

In this **Spring Boot REST API Best Practices Series**, I will explain some of the best practices we should follow while implementing REST APIs.
Also, I will explain some of the common mistakes developers do and how to avoid them.

<!--more-->


* [Spring Boot REST API Best Practices - Part 1 : Implementing Get Collection API]({{< relref "09-spring-boot-rest-api-tutorial-part-1.md" >}}) (This article)
* [Spring Boot REST API Best Practices - Part 2 : Implementing Create and Update APIs]({{< relref "10-spring-boot-rest-api-tutorial-part-2.md" >}})
* [Spring Boot REST API Best Practices - Part 3 : Implementing FindById and DeleteById APIs]({{< relref "11-spring-boot-rest-api-tutorial-part-3.md" >}})
* [Spring Boot REST API Best Practices - Part 4 : Exception Handling in REST APIs]({{< relref "12-spring-boot-rest-api-tutorial-part-4.md" >}})

In this **Part-1**, we are going to implement our first API endpoint which is to fetch a list of resources.
We are going to explore some of the common mistakes developers do and how to avoid them.

## Create a Spring Boot application
First, let's go to https://start.spring.io/ and create a Spring Boot application by selecting **Spring Web**,
**Validation**, **Spring Data JPA**, **PostgreSQL Driver**, **Flyway Migration**, 
and **Testcontainers** starters.

Our sample application is going to be a very simple one, but I am going to follow the same practices 
that I would follow in a real-world application.

You can find the sample code for this tutorial in this
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.


The REST API we are going to build is to manage bookmarks.
A bookmark contains **id**, **title**, **url**, **createdAt** and **updatedAt** properties.

## Create Bookmark entity
Create the JPA entity **Bookmark** as follows:

```java
package com.sivalabs.bookmarks.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "bookmarks")
class Bookmark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String url;
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @Column(name = "updated_at", insertable = false)
    private Instant updatedAt;

    //constructors, setters & getters
}
```

Note that the entity class is not **public**, so it's visibility is limited to **com.sivalabs.bookmarks.domain** package.

## Create Flyway Migration Scripts
We are going to use Flyway for database migrations.
To learn more about Flyway checkout [Spring Boot Flyway Database Migration Tutorial]({{< relref "08-spring-boot-flyway-database-migration-tutorial.md" >}})

Let's create the following migration script under **src/main/resources/db/migration** directory. 

**V1__init.sql**
```sql
create table bookmarks
(
  id         bigserial primary key,
  title      varchar not null,
  url        varchar not null,
  created_at timestamp,
  updated_at timestamp
);

INSERT INTO bookmarks(title, url, created_at) VALUES
('How (not) to ask for Technical Help?','https://sivalabs.in/how-to-not-to-ask-for-technical-help', CURRENT_TIMESTAMP),
('Announcing My SpringBoot Tips Video Series on YouTube','https://sivalabs.in/announcing-my-springboot-tips-video-series', CURRENT_TIMESTAMP),
('Kubernetes - Exposing Services to outside of Cluster using Ingress','https://sivalabs.in/kubernetes-ingress', CURRENT_TIMESTAMP),
('Kubernetes - Blue/Green Deployments','https://sivalabs.in/kubernetes-blue-green-deployments', CURRENT_TIMESTAMP),
('Kubernetes - Releasing a new version of the application using Deployment Rolling Updates','https://sivalabs.in/kubernetes-deployment-rolling-updates', CURRENT_TIMESTAMP),
('Getting Started with Kubernetes','https://sivalabs.in/getting-started-with-kubernetes', CURRENT_TIMESTAMP),
('Get Super Productive with Intellij File Templates','https://sivalabs.in/get-super-productive-with-intellij-file-templates', CURRENT_TIMESTAMP),
('Few Things I learned in the HardWay in 15 years of my career','https://sivalabs.in/few-things-i-learned-the-hardway-in-15-years-of-my-career', CURRENT_TIMESTAMP),
('All the resources you ever need as a Java & Spring application developer','https://sivalabs.in/all-the-resources-you-ever-need-as-a-java-spring-application-developer', CURRENT_TIMESTAMP),
('GoLang from a Java developer perspective','https://sivalabs.in/golang-from-a-java-developer-perspective', CURRENT_TIMESTAMP),
('Imposing Code Structure Guidelines using ArchUnit','https://sivalabs.in/impose-architecture-guidelines-using-archunit', CURRENT_TIMESTAMP),
('SpringBoot Integration Testing using TestContainers Starter','https://sivalabs.in/spring-boot-integration-testing-using-testcontainers-starter', CURRENT_TIMESTAMP),
('Creating Yeoman based SpringBoot Generator','https://sivalabs.in/creating-yeoman-based-springboot-generator', CURRENT_TIMESTAMP),
('Testing REST APIs using Postman and Newman','https://sivalabs.in/testing-rest-apis-with-postman-newman', CURRENT_TIMESTAMP),
('Testing SpringBoot Applications','https://sivalabs.in/spring-boot-testing', CURRENT_TIMESTAMP)
;
```

## Create Spring Data JPA Repository for Bookmark entity
Create the Spring Data JPA repository BookmarkRepository interface as follows:

```java
package com.sivalabs.bookmarks.domain;

import org.springframework.data.jpa.repository.JpaRepository;

interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
}
```

## Create BookmarkService
Let's create **BookmarkService** which is a transactional business service which will be exposed to outside the "domain" package.

```java
package com.sivalabs.bookmarks.domain;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class BookmarkService {
    private final BookmarkRepository repo;

    BookmarkService(BookmarkRepository repo) {
        this.repo = repo;
    }

}
```


{{< box tip >}}
**IMPORTANT CONSIDERATIONS:**

The following things are important to design our component as a cohesive component hiding the internal implementation details:

1. Notice that **Bookmark** entity and **BookmarkRepository** are not **public**. 
   They are **package-private** scoped classes/interfaces.
   They are supposed to be used by **BookmarkService** only and is hidden from outside 
   the **com.sivalabs.bookmarks.domain** package.

2. The **BookmarkService** is a transactional service layer component which will be used by **web layer** or **other service layer** components.
   The **BookmarkService** class is annotated with **@Transactional(readOnly = true)** which means 
   all the **public** methods are transactional and allows only **read-only** operations on the database.  
   We can override this read-only behaviour for the methods which needs to perform insert/update/delete database operations
   by adding **@Transactional** annotation.
{{< /box >}}

## Running application locally using Testcontainers
Spring Boot 3.1.0 introduced support for [Testcontainers](https://testcontainers.com/) which we can use for writing integration tests 
and for local development also.

While generating the application, we have selected **PostgreSQL Driver**, and **Testcontainers** starters.
So, the generated application will have a **TestApplication.java** under **src/test/java/** similar to the following:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestApplication {

  @Bean
  @ServiceConnection
  PostgreSQLContainer<?> postgresContainer() {
    return new PostgreSQLContainer<>(DockerImageName.parse("postgres:15.4-alpine"));
  }

  public static void main(String[] args) {
    SpringApplication
            .from(Application::main)
            .with(TestApplication.class)
            .run(args);
  }
}
```

We can start the application locally by running **TestApplication.java** from IDE or 
by running **./mvnw spring-boot:test-run** from the command-line.

Now we have all the basic code setup ready to start implementing our API endpoints.
Let's start with implementing get all bookmarks API endpoint.

## Implementing GET /api/bookmarks API endpoint
We may think of implementing the **GET /api/bookmarks** API endpoint as follows:

**BookmarkService.java**
```java
@Service
@Transactional(readOnly = true)
public class BookmarkService {
    private final BookmarkRepository repo;

    BookmarkService(BookmarkRepository repo) {
        this.repo = repo;
    }

    public List<Bookmark> findAll() {
        return repo.findAll();
    }
}
```

And, create the **BookmarkController**, and implement the API endpoint as follows:

```java
package com.sivalabs.bookmarks.api.controllers;

import com.sivalabs.bookmarks.domain.BookmarkService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkService bookmarkService;

    BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    List<Bookmark> findAll() {
        return bookmarkService.findAll();
    }
}
```

You may see this kind of implementation in many tutorials and examples, but this is a bad implementation.

**Problems with this implementation:**

1. We are exposing database entity as REST API response directly and in most of the cases it is a bad practice.
   If we have to make any changes to the entity then API response format will be changed too which might not be desirable. 
   So, we should create a DTO and expose only the necessary fields for that API.
   
2. If we are fetching the data only to return to the client, then it is better to use [DTO projections](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#projections) instead of loading entities.

3. The **findAll()** method will load all the records in the table and this may lead to **OutOfMemoryExceptions** if there are millions of records.
   If the table is ever-growing with new data, it is always advised to use **Pagination**. 

So, let's re-implement this API with **pagination** support and using **DTO projections**.

Let's create a **PagedResult** class that represents a generic paginated query result as follows:

```java
package com.sivalabs.bookmarks.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public record PagedResult<T>(
        List<T> data,
        long totalElements,
        int pageNumber,
        int totalPages,
        @JsonProperty("isFirst") boolean isFirst,
        @JsonProperty("isLast") boolean isLast,
        @JsonProperty("hasNext") boolean hasNext,
        @JsonProperty("hasPrevious") boolean hasPrevious) {}
```

Create **BookmarkDTO** as a record as follows:

```java
package com.sivalabs.bookmarks.domain;

import java.time.Instant;

public record BookmarkDTO(
        Long id,
        String title,
        String url,
        Instant createdAt) {}
```

Now, let's add a method to **BookmarkRepository** to fetch bookmarks with pagination and using DTO projection as follows:

```java
interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    @Query("""
               SELECT
                new com.sivalabs.bookmarks.domain.BookmarkDTO(b.id, b.title, b.url, b.createdAt)
               FROM Bookmark b
            """)
    Page<BookmarkDTO> findBookmarks(Pageable pageable);
}
```

Create a class to wrap all the query parameters as follows:

```java
public record FindBookmarksQuery(int pageNo, int pageSize) {}
```

This wrapper class **FindBookmarksQuery** will be convenient if you want to enhance the API 
with some filtering and sorting capabilities in the future.

Now, let's update the **BookmarkService** as follows:

```java
@Service
@Transactional(readOnly = true)
public class BookmarkService {
    private final BookmarkRepository repo;
  
    BookmarkService(BookmarkRepository repo) {
      this.repo = repo;
    }
  
    public PagedResult<BookmarkDTO> findBookmarks(FindBookmarksQuery query) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        //from user POV, page number starts from 1, but for Spring Data JPA page number starts from 0.
        int pageNo = query.pageNo() > 0 ? query.pageNo() - 1 : 0;
        Pageable pageable = PageRequest.of(pageNo, query.pageSize(), sort);
        Page<BookmarkDTO> page = repo.findBookmarks(pageable);
        return new PagedResult<>(
                page.getContent(),
                page.getTotalElements(),
                page.getNumber() + 1, // for user page number starts from 1
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.hasNext(),
                page.hasPrevious()
        );
    }
}
```

Finally, let's update the **BookmarkController** as follows:

```java
@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkService bookmarkService;

    BookmarkController(BookmarkService bookmarkService) {
        this.bookmarkService = bookmarkService;
    }

    @GetMapping
    PagedResult<BookmarkDTO> findBookmarks(
            @RequestParam(name = "page", defaultValue = "1") Integer pageNo,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize) {
        FindBookmarksQuery query = new FindBookmarksQuery(pageNo, pageSize);
        return bookmarkService.findBookmarks(query);
    }
}
```

Now if you run the application and access the [http://localhost:8080/api/bookmarks](http://localhost:8080/api/bookmarks) API endpoint 
then you will get the response similar to the following:

```json
{
    "isFirst": true,
    "isLast": false,
    "hasNext": true,
    "hasPrevious": false,
    "totalElements": 15,
    "pageNumber": 1,
    "totalPages": 2,
    "data": [
      {
        "id": 1,
        "title": "SivaLabs blog",
        "url": "https://wwww.sivalabs.in",
        "createdAt": "2023-08-22T10:24:58.956786"
      },
      ...
      ...
    ]
}
```

## Testing the API endpoint using RestAssured and Testcontainers
Let's be a good citizen by writing an automated test for our API endpoint.
We are going to use **RestAssured** for invoking the API endpoint and [Testcontainers](https://testcontainers.com) for provisioning the PostgreSQL database.

We should always make sure that database is in a known state so that we can write predictable assertions.
So, let's create **src/test/resources/test_data.sql** file with the following content:

```sql
TRUNCATE TABLE bookmarks;
ALTER SEQUENCE bookmarks_id_seq RESTART WITH 1;

INSERT INTO bookmarks(title, url, created_at) VALUES
('How (not) to ask for Technical Help?','https://sivalabs.in/how-to-not-to-ask-for-technical-help', CURRENT_TIMESTAMP),
('Announcing My SpringBoot Tips Video Series on YouTube','https://sivalabs.in/announcing-my-springboot-tips-video-series', CURRENT_TIMESTAMP),
('Kubernetes - Exposing Services to outside of Cluster using Ingress','https://sivalabs.in/kubernetes-ingress', CURRENT_TIMESTAMP),
('Kubernetes - Blue/Green Deployments','https://sivalabs.in/kubernetes-blue-green-deployments', CURRENT_TIMESTAMP),
('Kubernetes - Releasing a new version of the application using Deployment Rolling Updates','https://sivalabs.in/kubernetes-deployment-rolling-updates', CURRENT_TIMESTAMP),
('Getting Started with Kubernetes','https://sivalabs.in/getting-started-with-kubernetes', CURRENT_TIMESTAMP),
('Get Super Productive with Intellij File Templates','https://sivalabs.in/get-super-productive-with-intellij-file-templates', CURRENT_TIMESTAMP),
('Few Things I learned in the HardWay in 15 years of my career','https://sivalabs.in/few-things-i-learned-the-hardway-in-15-years-of-my-career', CURRENT_TIMESTAMP),
('All the resources you ever need as a Java & Spring application developer','https://sivalabs.in/all-the-resources-you-ever-need-as-a-java-spring-application-developer', CURRENT_TIMESTAMP),
('GoLang from a Java developer perspective','https://sivalabs.in/golang-from-a-java-developer-perspective', CURRENT_TIMESTAMP),
('Imposing Code Structure Guidelines using ArchUnit','https://sivalabs.in/impose-architecture-guidelines-using-archunit', CURRENT_TIMESTAMP),
('SpringBoot Integration Testing using TestContainers Starter','https://sivalabs.in/spring-boot-integration-testing-using-testcontainers-starter', CURRENT_TIMESTAMP),
('Creating Yeoman based SpringBoot Generator','https://sivalabs.in/creating-yeoman-based-springboot-generator', CURRENT_TIMESTAMP),
('Testing REST APIs using Postman and Newman','https://sivalabs.in/testing-rest-apis-with-postman-newman', CURRENT_TIMESTAMP),
('Testing SpringBoot Applications','https://sivalabs.in/spring-boot-testing', CURRENT_TIMESTAMP)
;
```

Now, we can add the annotation **@Sql("/test-data.sql")** to our test method 
so that before running the test the specified SQL script will be executed.

Let's write our API test as follows:

```java
package com.sivalabs.bookmarks.api.controllers;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class BookmarkControllerTests {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = 
            new PostgreSQLContainer<>(DockerImageName.parse("postgres:15.4-alpine"));

    @LocalServerPort
    private Integer port;

    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    @Sql("/test-data.sql")
    void shouldGetBookmarksByPage() {
        given().contentType(ContentType.JSON)
                .when()
                .get("/api/bookmarks?page=1&size=10")
                .then()
                .statusCode(200)
                .body("data.size()", equalTo(10))
                .body("totalElements", equalTo(15))
                .body("pageNumber", equalTo(1))
                .body("totalPages", equalTo(2))
                .body("isFirst", equalTo(true))
                .body("isLast", equalTo(false))
                .body("hasNext", equalTo(true))
                .body("hasPrevious", equalTo(false));
    }
}
```

Now you can run the test and see Testcontainers spinning up a PostgreSQL database and Spring Boot automatically configured 
to use that database while running the test.

We will explore how to implement **Create and Update Bookmark API endpoints** in the upcoming
[Spring Boot REST API Best Practices - Part 2]({{< relref "10-spring-boot-rest-api-tutorial-part-2.md" >}}) in this series.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
In this first part of **Spring Boot REST API Best Practices** series, we have learned how to implement
an API endpoint that will return a collection of resources by following some best practices such as pagination and DTO projections.

You can find the sample code for this tutorial in this 
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.
