---
title: "Spring Boot REST API Best Practices - Part 3"
author: Siva
images: ["/preview-images/spring-boot-rest-api-part-3.webp"]
type: post
draft: false
date: 2023-08-26T06:00:00+05:30
url: /spring-boot-rest-api-best-practices-part-3
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
description: In this tutorial, you will learn how to implement API endpoints for finding and deleting a resource by ID.
---

In this **Spring Boot REST API Best Practices - Part-3**, we will see how to implement **FindById and DeleteById API endpoints**.

* [Spring Boot REST API Best Practices - Part 1 : Implementing Get Collection API]({{< relref "09-spring-boot-rest-api-tutorial-part-1.md" >}})
* [Spring Boot REST API Best Practices - Part 2 : Implementing Create and Update APIs]({{< relref "10-spring-boot-rest-api-tutorial-part-2.md" >}})
* [Spring Boot REST API Best Practices - Part 3 : Implementing FindById and DeleteById APIs]({{< relref "11-spring-boot-rest-api-tutorial-part-3.md" >}}) (This article)
* [Spring Boot REST API Best Practices - Part 4 : Exception Handling in REST APIs]({{< relref "12-spring-boot-rest-api-tutorial-part-4.md" >}})

You can find the sample code for this tutorial in this
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.


## Implementing GET /api/bookmarks/{id} API endpoint
We would like to implement the API endpoint to get a single resource for the given id with HTTP Status Code 200.
If the resource is not found for the given id then return HTTP Status Code 404, optionally with response body including the error message.

We can implement the **GET /api/bookmarks/{id}** API endpoint as follows:

**BookmarkRepository.java**

```java
interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    @Query("""
           SELECT
            new com.sivalabs.bookmarks.domain.BookmarkDTO(b.id, b.title, b.url, b.createdAt)
           FROM Bookmark b
           WHERE b.id = ?1
        """)
    Optional<BookmarkDTO> findBookmarkById(Long id);
}
```

**BookmarkService.java**

```java
@Service
@Transactional(readOnly = true)
public class BookmarkService {
      private final BookmarkRepository repo;
      //...
      //...

    public Optional<BookmarkDTO> findById(Long id) {
        return repo.findBookmarkById(id);
    }
}
```

**BookmarkController.java**

```java
@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkService bookmarkService;
    //...
    //...

    @GetMapping("/{id}")
    ResponseEntity<BookmarkDTO> findById(@PathVariable(name = "id") Long id) {
        return bookmarkService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
```
Now you can start the application and invoke the API endpoint using CURL as follows:

```shell
$ curl --location 'http://localhost:8080/api/bookmarks/1'
  
  // response
  {"id":1,"title":"SivaLabs blog","url":"https://sivalabs.in","createdAt":"2023-08-23T04:24:17.975268Z"}
```

## Implementing DELETE /api/bookmarks/{id} API endpoint
We will follow the similar pattern and implement the **DELETE /api/bookmarks/{id}** API endpoint for deleting a bookmark.

**BookmarkService.java**

```java
@Service
@Transactional(readOnly = true)
public class BookmarkService {
      private final BookmarkRepository repo;
      //...
      //...

    @Transactional
    public void delete(Long postId) {
        Bookmark entity = repo.findById(postId)
                .orElseThrow(()-> BookmarkNotFoundException.of(postId));
        repo.delete(entity);
    }
}
```

**BookmarkController.java**

```java
@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkService bookmarkService;
    //...
    //...

    @DeleteMapping("/{id}")
    void delete(@PathVariable(name = "id") Long id) {
        bookmarkService.delete(id);
    }
}
```

You can invoke the API endpoint using CURL as follows:

```shell
$ curl --location --request DELETE 'http://localhost:8080/api/bookmarks/17'
```

## Testing the API endpoint using RestAssured and Testcontainers

Let's write tests for our API endpoints as follows:

```java
package com.sivalabs.bookmarks.api.controllers;

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
    
    //...
    //...
    
    @Test
    void shouldGetBookmarkByIdSuccessfully() {
        CreateBookmarkCommand cmd = new CreateBookmarkCommand("SivaLabs blog", "https://sivalabs.in");
        BookmarkDTO bookmark = bookmarkService.create(cmd);

        given().contentType(ContentType.JSON)
                .when()
                .get("/api/bookmarks/{id}", bookmark.id())
                .then()
                .statusCode(200)
                .body("id", equalTo(bookmark.id()))
                .body("title", equalTo("SivaLabs blog"))
                .body("url", equalTo("https://sivalabs.in"))
                .body("createdAt", notNullValue())
                .body("updatedAt", nullValue());
    }

    @Test
    void shouldGet404WhenBookmarkNotExists() {
        Long nonExistingId = 99999L;
        given().contentType(ContentType.JSON)
                .when()
                .get("/api/bookmarks/{id}", nonExistingId)
                .then()
                .statusCode(404);
    }

    @Test
    void shouldDeleteBookmarkByIdSuccessfully() {
        CreateBookmarkCommand cmd = new CreateBookmarkCommand("SivaLabs blog", "https://sivalabs.in");
        BookmarkDTO bookmark = bookmarkService.create(cmd);

        given().contentType(ContentType.JSON)
                .when()
                .delete("/api/bookmarks/{id}", bookmark.id())
                .then()
                .statusCode(200);

        Optional<BookmarkDTO> optionalBookmark = bookmarkService.findById(bookmark.id());
        assertThat(optionalBookmark).isEmpty();
    }
}
```

Now you can run the tests using **./mvnw test** from the command-line.

## Exception handling - Pending
If you have noticed, we haven't handled the failure scenarios so far.
For example, if you try to create a new bookmark without passing the mandatory fields(**title**, **url**) 
or try to delete a bookmark with a non-existing id then you will get a response similar to the following:

```shell
$ curl --location --request DELETE 'http://localhost:8080/api/bookmarks/99999'
```

```json
{
    "timestamp": "2023-08-23T12:37:37.772+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "com.sivalabs.bookmarks.domain.BookmarkNotFoundException: Bookmark with id=17 not found 
              at com.sivalabs.bookmarks.domain.BookmarkNotFoundException.of(BookmarkNotFoundException.java:9)
              at com.sivalabs.bookmarks.domain.BookmarkService.lambda$delete$1(BookmarkService.java:65)
              at java.base/java.util.Optional.orElseThrow(Optional.java:403)
              at com.sivalabs.bookmarks.domain.BookmarkService.delete(BookmarkService.java:65)
              at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
              ...
              ...
              at java.base/java.lang.Thread.run(Thread.java:833)",
    "message": "Bookmark with id=17 not found",
    "path": "/api/bookmarks/17"
}
```

This is a default error response returned by Spring Boot. 
But, most likely we might want to customize the error response format.

**We will explore how to handle errors in the upcoming **Part-4** in this series.**

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
In this third part of **Spring Boot REST API Best Practices** series, we have learned how to implement
an API endpoints to find and delete a resource by given id.

You can find the sample code for this tutorial in this 
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.
