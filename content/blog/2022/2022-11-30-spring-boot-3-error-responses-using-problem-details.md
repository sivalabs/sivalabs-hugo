---
title: 'Spring Boot 3 : Error Responses using Problem Details for HTTP APIs'
author: Siva
images:
  - /preview-images/springboot-3-problemdetails.webp
type: post
draft: false
date: 2022-11-29T23:29:17.000Z
url: /blog/spring-boot-3-error-reporting-using-problem-details
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Java
aliases:
  - /spring-boot-3-error-reporting-using-problem-details
---
Spring Framework 6 implemented the **Problem Details for HTTP APIs** specification, [RFC 7807](https://www.rfc-editor.org/rfc/rfc7807.html). 
In this article we will learn how to handle exceptions in SpringBoot 3 REST API(which uses Spring Framework 6) and provide error responses using **ProblemDetails** API.

<!--more-->


> We are going to reuse the SpringBoot 3 sample application [spring-boot-jpa-crud-demo](https://github.com/sivaprasadreddy/spring-boot-jpa-crud-demo) which we used for [Using Java Records with Spring Boot 3](https://www.sivalabs.in/using-java-records-with-spring-boot-3/) article.

Assume we have the following REST API endpoints to create a bookmark and fetch a bookmark by id.

```java

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService service;

    @PostMapping
    public ResponseEntity<Bookmark> save(@Valid @RequestBody Bookmark payload) {
        Bookmark bookmark = new Bookmark(null, payload.title(), payload.url(), Instant.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(bookmark));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Bookmark> getBookmarkById(@PathVariable Long id) {
        return service.getBookmarkById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new BookmarkNotFoundException(id));
    }
}
```

And, the **BookmarkNotFoundException** is a typical **RuntimeException** as follows:

```java
public class BookmarkNotFoundException extends RuntimeException {

    public BookmarkNotFoundException(Long bookmarkId) {
        super("Bookmark with id: "+ bookmarkId+" not found");
    }
}
```

Now, when you make an API call to create a bookmark with invalid data (title and url are required) using following cURL 
```shell
curl --location --request POST 'http://localhost:8080/api/bookmarks' \
--header 'Content-Type: application/json' \
--data-raw '{ "title":"", "url":"" }'
```

then you will get a default SpringBoot error response as follows:

```json
{
    "timestamp": "2022-11-30T04:42:14.282+00:00",
    "status": 400,
    "error": "Bad Request",
    "trace": "org.springframework.web.bind.MethodArgumentNotValidException: Validation failed for argument [0] in public org.springframework.http.ResponseEntity<com.sivalabs.bookmarks.domain.Bookmark> com.sivalabs.bookmarks.web.BookmarkController.save(com.sivalabs.bookmarks.domain.Bookmark) with 2 errors: [Field error in object 'bookmark' on field 'url': rejected value []; codes [NotEmpty.bookmark.url,NotEmpty.url,NotEmpty.java.lang.String,NotEmpty]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [bookmark.url,url]; arguments []; default message [url]]; default message [Url is mandatory]] [Field error in object 'bookmark' on field 'title': rejected value []; codes [NotEmpty.bookmark.title,NotEmpty.title,NotEmpty.java.lang.String,NotEmpty]; arguments [org.springframework.context.support.DefaultMessageSourceResolvable: codes [bookmark.title,title]; arguments []; default message [title]]; default message [Title is mandatory]] 
            at org.springframework.web.servlet.mvc.method.annotation.RequestResponseBodyMethodProcessor.resolveArgument(RequestResponseBodyMethodProcessor.java:144)
            at org.springframework.web.method.support.HandlerMethodArgumentResolverComposite.resolveArgument(HandlerMethodArgumentResolverComposite.java:122)
            at org.springframework.web.method.support.InvocableHandlerMethod.getMethodArgumentValues(InvocableHandlerMethod.java:181)
            ....
            ....
            ",
    "message": "Validation failed for object='bookmark'. Error count: 2",
    "errors": [
        {
            "codes": [
                "NotEmpty.bookmark.url",
                "NotEmpty.url",
                "NotEmpty.java.lang.String",
                "NotEmpty"
            ],
            "arguments": [
                {
                    "codes": [
                        "bookmark.url",
                        "url"
                    ],
                    "arguments": null,
                    "defaultMessage": "url",
                    "code": "url"
                }
            ],
            "defaultMessage": "Url is mandatory",
            "objectName": "bookmark",
            "field": "url",
            "rejectedValue": "",
            "bindingFailure": false,
            "code": "NotEmpty"
        },
        {
            "codes": [
                "NotEmpty.bookmark.title",
                "NotEmpty.title",
                "NotEmpty.java.lang.String",
                "NotEmpty"
            ],
            "arguments": [
                {
                    "codes": [
                        "bookmark.title",
                        "title"
                    ],
                    "arguments": null,
                    "defaultMessage": "title",
                    "code": "title"
                }
            ],
            "defaultMessage": "Title is mandatory",
            "objectName": "bookmark",
            "field": "title",
            "rejectedValue": "",
            "bindingFailure": false,
            "code": "NotEmpty"
        }
    ],
    "path": "/api/bookmarks"
}
```

> Prior to Spring Framework 6 many organizations use Zalando's [problem-spring-web](https://github.com/zalando/problem-spring-web) for returning RFC 7807 compliant error responses.
> If you want to learn How to use Problem Spring Web Library you can watch my video here

{{< youtube hVfajuyEJMQ >}}

Now let us see how to use ProblemDetails API to return RFC 7807 compliant responses.

## 1. Enable RFC 7807 responses
To enable RFC 7807 responses we need to create a global exception handler using **@ControllerAdvice** by extending **ResponseEntityExceptionHandler**.

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

}
```

Now when you make the same API call you will get the RFC 7807 compliant response with Header **"Content-Type=application/problem+json"** as follows:

```json
{
    "type": "about:blank",
    "title": "Bad Request",
    "status": 400,
    "detail": "Invalid request content.",
    "instance": "/api/bookmarks"
}
```

The **ResponseEntityExceptionHandler** implemented **@ExceptionHandler** methods for most of the Spring MVC built-in exceptions such as **MethodArgumentNotValidException**, **ServletRequestBindingException**, **HttpRequestMethodNotSupportedException** etc.
So, the **MethodArgumentNotValidException** is handled by the exception handler method and the appropriate error response is returned.

## 2. Handling Custom Exceptions
Let us see how to handle our own custom exceptions and return RFC 7807 compliant response using ProblemDetails API.

Let's make an HTTP API call fetch a bookmark with a non-existing id
```shell
curl --location --request GET 'http://localhost:8080/api/bookmarks/111'
```

then you will get the following response:

```json
{
    "timestamp": "2022-11-30T04:34:42.002+00:00",
    "status": 500,
    "error": "Internal Server Error",
    "trace": "com.sivalabs.bookmarks.domain.BookmarkNotFoundException: Bookmark with id: 111 not found  
              at com.sivalabs.bookmarks.web.BookmarkController.lambda$getBookmarkById$0(BookmarkController.java:31)
              at java.base/java.util.Optional.orElseThrow(Optional.java:403)
              at com.sivalabs.bookmarks.web.BookmarkController.getBookmarkById(BookmarkController.java:31)
              at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
              ....,
              ....
              ",
    "message": "Bookmark with id: 111 not found",
    "path": "/api/bookmarks/111"
}
```

To customise the error response we can create a ExceptionHandler in **GlobalExceptionHandler** and use ProblemDetail to return a customised response.

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BookmarkNotFoundException.class)
    ProblemDetail handleBookmarkNotFoundException(BookmarkNotFoundException e) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
        problemDetail.setTitle("Bookmark Not Found");
        problemDetail.setType(URI.create("https://api.bookmarks.com/errors/not-found"));
        return problemDetail;
    }
}
```

Now when you make the API call to fetch bookmark with non-existing id then you will get the following response:

```json
{
  "type": "https://api.bookmarks.com/errors/not-found",
  "title": "Bookmark Not Found",
  "status": 404,
  "detail": "Bookmark with id: 111 not found",
  "instance": "/api/bookmarks/111"
}
```
In addition to the standard fields **type, title, status, detail, instance** we can also include **custom properties** as follows:

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

We have added 2 custom properties **errorCategory** and **timestamp** which will be included in the response as follows:

```json
{
    "type": "https://api.bookmarks.com/errors/not-found",
    "title": "Bookmark Not Found",
    "status": 404,
    "detail": "Bookmark with id: 111 not found",
    "instance": "/api/bookmarks/111",
    "errorCategory": "Generic",
    "timestamp": "2022-11-30T05:21:59.828411Z"
}
```

In addition to **ProblemDetail**, you can also return an instance of **ErrorResponse** which is a contract to expose HTTP error response details including HTTP status, response headers, and a body in the format of RFC 7807.

> All Spring MVC exceptions such as MethodArgumentNotValidException, ServletRequestBindingException, HttpRequestMethodNotSupportedException etc implements ErrorResponse.

```java
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(BookmarkNotFoundException.class)
    ErrorResponse handleBookmarkNotFoundException(BookmarkNotFoundException e) {
        return ErrorResponse.builder(e, HttpStatus.NOT_FOUND, e.getMessage())
                .title("Bookmark not found")
                .type(URI.create("https://api.bookmarks.com/errors/not-found"))
                .property("errorCategory", "Generic")
                .property("timestamp", Instant.now())
                .build();
    }
}
```

## 3. Custom Exceptions extending ErrorResponseException
Instead of implementing **@ExceptionHandler** methods for our custom exceptions, we can extend from **ErrorResponseException** and just throw the Exception.

```java
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.ErrorResponseException;

import java.net.URI;
import java.time.Instant;

public class BookmarkNotFoundException extends ErrorResponseException {

    public BookmarkNotFoundException(Long bookmarkId) {
        super(HttpStatus.NOT_FOUND, asProblemDetail("Bookmark with id "+ bookmarkId+" not found"), null);
    }

    private static ProblemDetail asProblemDetail(String message) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, message);
        problemDetail.setTitle("Bookmark Not Found");
        problemDetail.setType(URI.create("https://api.bookmarks.com/errors/not-found"));
        problemDetail.setProperty("errorCategory", "Generic");
        problemDetail.setProperty("timestamp", Instant.now());
        return problemDetail;
    }
}
```

By making **BookmarkNotFoundException** extending **ErrorResponseException** we can simply throw **BookmarkNotFoundException** and 
SpringMVC will handle it and return the error response in RFC 7807 compliant format without requiring us to implement **@ExceptionHandler** method in **GlobalExceptionHandler**.

## Conclusion
By using Spring Framework's ProblemDetails API for error responses we can standardize on the response format which will be very beneficial 
when you have large number of microservices communicating with each other.