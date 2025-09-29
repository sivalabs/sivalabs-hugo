---
title: Spring Boot REST API Best Practices - Part 4
author: Siva
images:
  - /preview-images/spring-boot-rest-api-part-4.webp
type: post
draft: false
date: 2023-08-27T00:30:00.000Z
url: /blog/spring-boot-rest-api-best-practices-part-4
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Tutorials
description: In this tutorial, you will learn how to implement exception handling while creating Spring Boot REST APIs.
aliases:
  - /spring-boot-rest-api-best-practices-part-4
---

In this **Spring Boot REST API Best Practices** series, we have learned how to implement CRUD operations so far.
In this **Part-4**, we will explore how to **implement exception handling** for our APIs.

<!--more-->


* [Spring Boot REST API Best Practices - Part 1 : Implementing Get Collection API]({{< relref "09-spring-boot-rest-api-tutorial-part-1.md" >}})
* [Spring Boot REST API Best Practices - Part 2 : Implementing Create and Update APIs]({{< relref "10-spring-boot-rest-api-tutorial-part-2.md" >}})
* [Spring Boot REST API Best Practices - Part 3 : Implementing FindById and DeleteById APIs]({{< relref "11-spring-boot-rest-api-tutorial-part-3.md" >}})
* [Spring Boot REST API Best Practices - Part 4 : Exception Handling in REST APIs]({{< relref "12-spring-boot-rest-api-tutorial-part-4.md" >}}) (This article)

You can find the sample code for this tutorial in this
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.

As mentioned in the Part-3, if a request handling method in a controller throws an Exception, 
then Spring Boot will handle it and return the response using its default Exception Handling mechanism.

If all you care about is returning a proper HTTP Status code when an Exception is thrown, you can simply use 
**@ResponseStatus** annotation to specify which HTTP Status code should be used instead of default **INTERNAL_SERVER_ERROR - 500**.

```java
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BookmarkNotFoundException extends RuntimeException {
    
}

// --------------------------------------

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class InvalidBookmarkUrlException extends RuntimeException {

}
```

But most likely, you would like to return a customized error response body with an appropriate HTTP Status Code as the response.
So, let's see what are the different approaches to handle the exceptions to handling Exceptions and returning error responses.

## Different approaches to handling exceptions
We can handle exceptions in different ways, and depending on your use-case, you can choose one of the approaches that fit best for you.

* Handling exceptions in the controller handler method
* Using Controller level **@ExceptionHandler**
* GlobalExceptionHandler using **@RestControllerAdvice**
  * Spring's **ProblemDetails** for HTTP APIs ([RFC 7807](https://www.rfc-editor.org/rfc/rfc7807.html)).
  * Using 3rd party libraries
    * [Error Handling Spring Boot Starter](https://github.com/wimdeblauwe/error-handling-spring-boot-starter) by [Wim Deblauwe](https://twitter.com/wimdeblauwe)
    * [problem-spring-web](https://github.com/zalando/problem-spring-web) by Zalando

## Handling exceptions in the controller handler method
This is the best approach if you want at most control over the exception handling logic for a particular API endpoint.

For example, in **POST /api/bookmarks** API endpoint implementation, if the bookmark URL already exists 
then, **BookmarkService** may throw **DuplicateBookmarkException**. 
If the bookmark title contains certain blocked words, then **BookmarkService** may throw **BookmarkTitleNotAllowedException**.
So, if you want to handle all those different exceptions in the controller handler method itself then you can follow this approach.

**BookmarkController.java**

```java
@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkService bookmarkService;
    //...
    //...

    @PostMapping
    ResponseEntity<BookmarkDTO> create(@RequestBody @Validated CreateBookmarkRequest request) {
        CreateBookmarkCommand cmd = new CreateBookmarkCommand(
                request.title(),
                request.url()
        );
        try {
            BookmarkDTO bookmark = bookmarkService.create(cmd);
            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/api/bookmarks/{id}")
                    .buildAndExpand(bookmark.id()).toUri();
            return ResponseEntity.created(location).body(bookmark);
        } catch(DuplicateBookmarkException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch(BookmarkTitleNotAllowedException e) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build();
        }
    }
}
```

## Using Controller level @ExceptionHandler
Sometimes we may end up handling the same type of Exceptions in the same manner from multiple API handler methods in a controller.
For example, the duplicate **url** check and **title** validation logic apply to both Create and Update API endpoints.
In such cases, instead of duplicating the try-catch logic in multiple places, we can use Controller level **@ExceptionHandler** as follows:

```java
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

    @PutMapping("/{id}")
    void update(@PathVariable(name = "id") Long id,
                @RequestBody @Validated UpdateBookmarkRequest request) {
        UpdateBookmarkCommand cmd = new UpdateBookmarkCommand(id, request.title(), request.url());
        bookmarkService.update(cmd);
    }

    @ExceptionHandler(DuplicateBookmarkException.class)
    public ResponseEntity<ApiError> handleDuplicateBookmarkException(DuplicateBookmarkException e) {
        ApiError error = new ApiError(e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(BookmarkTitleNotAllowedException.class)
    public ResponseEntity<ApiError> handleBookmarkTitleNotAllowedException(BookmarkTitleNotAllowedException e) {
        ApiError error = new ApiError(e.getMessage());
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }
}
```

In this approach, you don't have to duplicate the exception handling logic in multiple handler methods in the controller.
If **BookmarkTitleNotAllowedException** or **DuplicateBookmarkException** is thrown from **create(...)** or **update(...)** methods, 
they will be handled by the respective **@ExceptionHandler** methods. 

You can also handle multiple types of Exceptions in the same ExceptionHandler method using
**@ExceptionHandler({DuplicateBookmarkException.class, BookmarkTitleNotAllowedException.class})**.
In this case, the ExceptionHandler method should use the common base Exception class of 
**DuplicateBookmarkException** and **BookmarkTitleNotAllowedException** as a method parameter.

## GlobalExceptionHandler using @RestControllerAdvice
In the previous section, we have seen how to use **@ExceptionHandler** at the Controller level.
What if the same type of exceptions may occur in different Controllers, and we want to handle those Exceptions in the same way?
In such cases, we can use the Global Exception Handling approach by using **@RestControllerAdvice**.

Create **GlobalExceptionHandler** as follows:

```java
package com.sivalabs.bookmarks.api;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(DuplicateBookmarkException.class)
    public ResponseEntity<ApiError> handleDuplicateBookmarkException(DuplicateBookmarkException e) {
      ApiError error = new ApiError(e.getMessage());
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
  
    @ExceptionHandler(BookmarkTitleNotAllowedException.class)
    public ResponseEntity<ApiError> handleBookmarkTitleNotAllowedException(BookmarkTitleNotAllowedException e) {
      ApiError error = new ApiError(e.getMessage());
      return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(error);
    }
}
```

By using **ControllerAdvice** approach, we don't have to duplicate the same **@ExceptionHandler** logic in multiple Controllers.

{{< box tip >}}
**IMPORTANT** 

If you have an **@ExceptionHandler** handling the same Exception in both Controller and **GlobalExceptionHandler** then
Controller level **@ExceptionHandler** method takes priority.
{{< /box >}}

### Spring Boot Error Responses using Problem Details for HTTP APIs
Spring Framework 6 implemented the Problem Details for HTTP APIs specification, ([RFC 7807](https://www.rfc-editor.org/rfc/rfc7807.html)).

{{< box info >}}
**Spring Boot 3: Error Responses using Problem Details for HTTP APIs**

You can read the [Spring Boot 3 : Error Responses using Problem Details for HTTP APIs](https://www.sivalabs.in/spring-boot-3-error-reporting-using-problem-details/)
post to learn how to use ProblemDetails API for handling Exceptions.
{{< /box >}}

We can enable RFC 7807 responses either by adding the property **spring.mvc.problemdetails.enabled=true** 
or create a global exception handler using **@ControllerAdvice** by extending **ResponseEntityExceptionHandler**.

To quickly demonstrate, here is how you can use **ProblemDetails** API to return error responses in **RFC 7807** format.

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BookmarkNotFoundException.class)
    ProblemDetail handleBookmarkNotFoundException(BookmarkNotFoundException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        problemDetail.setTitle("Bookmark Not Found");
        problemDetail.setType(URI.create("https://api.bookmarks.com/errors/not-found"));
        problemDetail.setProperty("errorCategory", "Generic");
        problemDetail.setProperty("timestamp", Instant.now());
        return problemDetail;
    }
}
```

Now when an unhandled **BookmarkNotFoundException** is thrown, the following response will be returned:

```json
{
  "type": "https://api.bookmarks.com/errors/not-found",
  "title": "Bookmark Not Found",
  "status": 404,
  "detail": "Bookmark with id=111 not found",
  "instance": "/api/bookmarks/111",
  "errorCategory": "Generic",
  "timestamp": "2023-08-30T05:21:59.828411Z"
}
```

By extending **ResponseEntityExceptionHandler**, you can leverage the Spring's default Exception handling for various common exceptions 
such as **MethodArgumentNotValidException**, **BindException**, **MissingServletRequestParameterException**, etc.
If you want to customize the exception handling for any of those Exceptions,
then you can override those respective methods and implement your own logic.

### Using Error Handling Spring Boot Starter
We can use [Error Handling Spring Boot Starter](https://github.com/wimdeblauwe/error-handling-spring-boot-starter) 
that can handle Exceptions and return meaningful error responses without having to write custom code.

Add the following library dependency to your **pom.xml**:

```xml
<properties>
  <error-handling-spring-boot-starter.version>4.2.0</error-handling-spring-boot-starter.version>
</properties>

<dependency>
    <groupId>io.github.wimdeblauwe</groupId>
    <artifactId>error-handling-spring-boot-starter</artifactId>
    <version>${error-handling-spring-boot-starter.version}</version>
</dependency>
```

Now if you try to invoke **POST /api/bookmarks** API endpoint without providing **title** and **url** in the request payload:

```shell
curl --location 'http://localhost:8080/api/bookmarks' \
--header 'Content-Type: application/json' \
--data '{}'
```

Then you will get the following error response:

```json
{
    "code": "VALIDATION_FAILED",
    "message": "Validation failed for object='createBookmarkRequest'. Error count: 2",
    "fieldErrors": [
        {
            "code": "REQUIRED_NOT_EMPTY",
            "message": "URL is required",
            "property": "url",
            "rejectedValue": null,
            "path": "url"
        },
        {
            "code": "REQUIRED_NOT_EMPTY",
            "message": "Title is required",
            "property": "title",
            "rejectedValue": null,
            "path": "title"
        }
    ]
}
```

You can read the [documentation](https://github.com/wimdeblauwe/error-handling-spring-boot-starter#documentation) 
to learn more about **Error Handling Spring Boot Starter**.  

### Using Zalando's problem-spring-web library
Another popular library that can handle Exceptions and return error responses in RFC 7807 format is 
[problem-spring-web](https://github.com/zalando/problem-spring-web) created by Zalando.

You can learn how to use **problem-spring-web** library by watching my 
[Spring Boot Tips : Part 7 - Exception Handling in SpringBoot REST APIs using problem-spring-web](https://www.youtube.com/watch?v=hVfajuyEJMQ) video.

{{< youtube hVfajuyEJMQ >}}

You can find the sample code for this tutorial in this
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-rest-api-tutorial) repository.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
In this final part of **Spring Boot REST API Best Practices** series, we have explored how to implement exception handling using different approaches.

I hope this series is helpful in understanding how to implement Spring Boot REST APIs following some best practices.

