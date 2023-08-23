---
title: "Spring Boot REST API Best Practices - Part 2"
author: Siva
images: ["/preview-images/spring-boot-rest-api-part-2.webp"]
type: post
draft: false
date: 2023-08-23T06:00:00+05:30
url: /spring-boot-rest-api-best-practices-part-2
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
description: In this tutorial, you will learn how to use create a Spring Boot REST API and best practices to implement Create and Update API endpoints.
---

In this **Spring Boot REST API Best Practices - Part-2**, I will explain some of the best practices we should follow 
while implementing **Create and Update API endpoints**.

This article is a continuation of [Spring Boot REST API Best Practices - Part 1]({{< relref "09-spring-boot-rest-api-tutorial-part-1.md" >}}).
So, if you haven't already, please read **Part-1** first. We are going to build the APIs on top of the code we have implemented in Part-1.

You can find the sample code for this tutorial in this
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.


## Implementing POST /api/bookmarks API endpoint
We may think of implementing the **POST /api/bookmarks** API endpoint as follows:

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
    //...
    //...
   
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    BookmarkDTO create(@RequestBody @Validated BookmarkDTO bookmark) {
      return bookmarkService.create(bookmark);
    }
}
```

At a glance this may looks fine.

* We are not using JPA entities to bind request payload or returning as response.
* We are returning the proper response code 201 when the bookmark resource is successfully created.

If we generate Open API documentation from this code using [springdoc-openapi](https://springdoc.org/) 
then the expected request payload will be shown as follows:

```json
{
   "id": 0,
   "title": "",
   "url": "",
   "createdAt": ""
}
```

When I look at the request payload, I have a bunch of questions:

* Should I generate the **id** from client side and send it in the payload, or it will be generated on the server-side?
* If I include the **id** in the request payload, does it override the bookmark details if an entity wth same **id** value exist or ignore the **id** and creates a new bookmark?
* Should I include **createdAt** or server will use the timestamp of the record insertion into DB?
* What if I set a future date for **createdAt**?

All these questions came up because we are not explicit in our contract.

The actual API behaviour we want is, the client should only send the **title** and **url**.
Then we will automatically generate the **id** and use the current timestamp as **createdAt** value.

To avoid the confusion and bring more clarity to what is the expected payload, 
it is better to create a request class for this specific API endpoint as follows:

```java
package com.sivalabs.bookmarks.api.models;

import jakarta.validation.constraints.NotEmpty;

public record CreateBookmarkRequest(
        @NotEmpty(message = "Title is required")
        String title,
        @NotEmpty(message = "URL is required")
        String url) {
}
```

The next question that comes to our mind is, should we return **BookmarkDTO** or **ResponseEntity&lt;BookmarkDTO&gt;**?

I would prefer to use **ResponseEntity** as return type if:
* I need to send different HTTP Status Codes for different kinds of failures or validation errors.
* I need to add headers.

Basically, if I want more fine-grained control over the response I would choose **ResponseEntity**, otherwise I simply return the response object. 

Now we have some clarity on how our Controller method implementation would look like. What about Service layer implementation?

Should we send **CreateBookmarkRequest** as input to **BookmarkService.create(...)** method? 
Or, create **BookmarkDTO** object from **CreateBookmarkRequest** and then send it to **BookmarkService.create(...)** method?

My preference is to create a new **CreateBookmarkCommand** class with **title** and **url** properties 
and send it to **BookmarkService.create(...)** method.
This may seem unnecessary because **CreateBookmarkRequest** and **CreateBookmarkCommand** are exactly same in this scenario.

But imagine this API endpoint can only be invoked by an authenticated user.
Then we may need to include **createdBy** property in the input to **BookmarkService.create(...)** method 
which is not available in **CreateBookmarkRequest**.
So, to keep each layer's responsibilities separate, I would use a separate command object.

```java
package com.sivalabs.bookmarks.domain;

public record CreateBookmarkCommand(String title, String url) {}
```

Here is the final implementation for **POST /api/bookmarks** API endpoint.

**BookmarkService.java**

```java
@Service
@Transactional(readOnly = true)
public class BookmarkService {
      private final BookmarkRepository repo;
      //...
      //...

      @Transactional
      public BookmarkDTO create(CreateBookmarkCommand cmd) {
         Bookmark bookmark = new Bookmark();
         bookmark.setTitle(cmd.title());
         bookmark.setUrl(cmd.url());
         bookmark.setCreatedAt(Instant.now());
         return BookmarkDTO.from(repo.save(bookmark));
      }
}
```

**BookmarkController.java**


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
    //...
    //...
   
    @PostMapping
    ResponseEntity<BookmarkDTO> create(@RequestBody @Validated CreateBookmarkRequest request) {
         CreateBookmarkCommand cmd = new CreateBookmarkCommand(request.title(), request.url());
         BookmarkDTO bookmark = bookmarkService.create(cmd);
         URI location = ServletUriComponentsBuilder
                          .fromCurrentRequest()
                          .path("/api/bookmarks/{id}")
                          .buildAndExpand(bookmark.id()).toUri();
         return ResponseEntity.created(location).body(bookmark);
   }
}
```
Now you can start the application and invoke the API endpoint using CURL as follows:

```shell
$ curl --location 'http://localhost:8080/api/bookmarks' \
   --header 'Content-Type: application/json' \
   --data '{
       "title": "SivaLabs blog",
       "url": "https://sivalabs.in"
  }'
  
  // response
  {"id":17,"title":"SivaLabs blog","url":"https://sivalabs.in","createdAt":"2023-08-23T04:24:17.975268Z"}
```

## Implementing PUT /api/bookmarks/{id} API endpoint
We will follow the similar pattern and implement the **PUT /api/bookmarks/{id}** API endpoint for updating a bookmark.

**UpdateBookmarkCommand.java**

```java
package com.sivalabs.bookmarks.domain;

public record UpdateBookmarkCommand(
        Long id,
        String title,
        String url) {
}
```

**BookmarkNotFoundException.java**

```java
package com.sivalabs.bookmarks.domain;

public class BookmarkNotFoundException extends RuntimeException {
   public BookmarkNotFoundException(Long id) {
      super(String.format("Bookmark with id=%d not found", id));
   }

   public static BookmarkNotFoundException of(Long id) {
      return new BookmarkNotFoundException(id);
   }
}
```

**BookmarkService.java**

```java
package com.sivalabs.bookmarks.domain;

@Service
@Transactional(readOnly = true)
public class BookmarkService {
    private final BookmarkRepository repo;

    //...
    //...
    @Transactional
    public void update(UpdateBookmarkCommand cmd) {
        Bookmark bookmark = repo.findById(cmd.id())
                .orElseThrow(() -> BookmarkNotFoundException.of(cmd.id()));
        bookmark.setTitle(cmd.title());
        bookmark.setUrl(cmd.url());
        bookmark.setUpdatedAt(Instant.now());
        repo.save(bookmark);
    }
}
```

**UpdateBookmarkRequest.java**

```java
package com.sivalabs.bookmarks.api.models;

import jakarta.validation.constraints.NotEmpty;

public record UpdateBookmarkRequest(
        @NotEmpty(message = "Title is required")
        String title,
        @NotEmpty(message = "URL is required")
        String url) {
}
```

**BookmarkController.java**

```java
package com.sivalabs.bookmarks.api.controllers;

@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkService bookmarkService;

    @PutMapping("/{id}")
    void update(@PathVariable(name = "id") Long id,
                @RequestBody @Validated UpdateBookmarkRequest request) {
        UpdateBookmarkCommand cmd = new UpdateBookmarkCommand(id, request.title(), request.url());
        bookmarkService.update(cmd);
    }
}
```

You can try invoking this endpoint using CURL as follows:

```shell
$ curl -v --location --request PUT 'http://localhost:8080/api/bookmarks/17' \
   --header 'Content-Type: application/json' \
   --data '{
       "title": "SivaLabs - TechBlog",
       "url": "https://www.sivalabs.in"
   }'
```

There are a couple of things that can be improved in the current implementation:
* **Exception Handling** - This we will tackle in the upcoming part in this series.
* Inserting and updating the **createdAt** and **updatedAt** column values.

In the current implementation, we are manually setting the **createdAt** and **updatedAt** values as follows:

```java
bookmark.setCreatedAt(Instant.now());

bookmark.setUpdatedAt(Instant.now());
```

But instead of manually setting these values, we can leverage some of the JPA and Spring Data JPA features 
to automatically set these values while inserting or updating the entities.

### Using @PrePersist and @PreUpdate
We can use JPA's **@PrePersist** and **@PreUpdate** annotations to automatically set the **createdAt** and **updatedAt** values as follows:

```java
@Entity
class Bookmark {
   ... 
   ... 
   @Column(name = "created_at", nullable = false, updatable = false)
   private Instant createdAt;
   @Column(name = "updated_at", insertable = false)
   private Instant updatedAt;

   @PreUpdate
   @PrePersist
   public void updateTimeStamps() {
      updatedAt = Instant.now();
      if (createdAt == null) {
         createdAt = Instant.now();
      }
   }
}
```

### Using Spring Data JPA's @CreatedDate and @LastModifiedDate
You can also use Spring Data JPA's **@CreatedDate** and **@LastModifiedDate** annotations 
to automatically set the **createdAt** and **updatedAt** values as follows:

```java
@Entity
class Bookmark {
   ... 
   ... 
   @Column(name = "created_at", nullable = false, updatable = false)
   @CreatedDate
   private Instant createdAt;
   
   @Column(name = "updated_at", insertable = false)
   @LastModifiedDate
   private Instant updatedAt;
}
```

**Hibernate** also provides **@CreationTimestamp** and **@UpdateTimestamp** annotations for similar purpose.
But I prefer to use one of the above-mentioned 2 approaches to keep the code independent of underlying persistence implementation framework.

{{< box tip >}}
**Which Java DataType to use for storing Date or Timestamp in Database?**

Please read this excellent [StackOverflow Answer](https://stackoverflow.com/a/32443004/755932) to find 
which Java datatype is more suitable for storing **Date** or **Timestamp** values in the database.
{{< /box >}}

## Testing the API endpoint using RestAssured and Testcontainers

Let's write tests for our API endpoints as follows:

```java
package com.sivalabs.bookmarks.api.controllers;

import com.sivalabs.bookmarks.domain.BookmarkDTO;
import com.sivalabs.bookmarks.domain.BookmarkService;
import com.sivalabs.bookmarks.domain.CreateBookmarkCommand;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.matchesRegex;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.nullValue;
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

    @Autowired
    private BookmarkService bookmarkService;
   
    @BeforeEach
    void setUp() {
        RestAssured.port = port;
    }

    @Test
    void shouldCreateBookmarkSuccessfully() {
       given().contentType(ContentType.JSON)
              .body(
                """
                 {
                     "title": "SivaLabs blog",
                     "url": "https://sivalabs.in"
                 }
               """)
              .when()
              .post("/api/bookmarks")
              .then()
              .statusCode(201)
              .header("Location", matchesRegex(".*/api/bookmarks/[0-9]+$"))
              .body("id", notNullValue())
              .body("title", equalTo("SivaLabs blog"))
              .body("url", equalTo("https://sivalabs.in"))
              .body("createdAt", notNullValue())
              .body("updatedAt", nullValue());
    }

    @Test
    void shouldUpdateBookmarkSuccessfully() {
       CreateBookmarkCommand cmd = new CreateBookmarkCommand("SivaLabs blog", "https://sivalabs.in");
       BookmarkDTO bookmark = bookmarkService.create(cmd);

       given().contentType(ContentType.JSON)
              .body(
                """
                 {
                     "title": "SivaLabs - Tech Blog",
                     "url": "https://www.sivalabs.in"
                 }
               """)
              .when()
              .put("/api/bookmarks/{id}", bookmark.id())
              .then()
              .statusCode(200);
    }
}
```

Now you can run the tests using **./mvnw test** from the command-line.

We will explore how to implement **FindById and DeleteById API endpoints** in the upcoming **Part-3** in this series.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{< relref "/spring-boot-tutorials" >}}) page. 
{{< /box >}}

## Summary
In this second part of **Spring Boot REST API Best Practices** series, we have learned how to implement
an API endpoints to create and update a resource by following some best practices.

You can find the sample code for this tutorial in this 
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.
