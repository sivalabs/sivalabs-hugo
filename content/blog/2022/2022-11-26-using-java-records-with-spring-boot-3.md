---
title: Using Java Records with Spring Boot 3
author: Siva
images:
  - /preview-images/java-records-with-sb3.webp
type: post
draft: false
date: 2022-11-25T23:29:17.000Z
url: /blog/using-java-records-with-spring-boot-3
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Java
aliases:
  - /using-java-records-with-spring-boot-3
---

Records were introduced in Java 14 as a preview feature and became a standard feature with JDK 16.
Records are a concise representation of immutable data class. 

<!--more-->


Prior to Records this is how we usually create an immutable class.

```java

import java.util.Objects;

class Person {
    private final Long id;
    private final String name;

    public Person(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Person person = (Person) o;
        return Objects.equals(id, person.id) && Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "Person{" + "id=" + id + ", name='" + name + '\'' + '}';
    }
}
```

While most of the time we usually generate **equals()**, **hashCode()** and **toString()** using either IDE generation or using **Lombok**, it is more noise in the code.
The same Person class can be written as a Record as follows:

```java
public record Person(Long id, String name){ }
```

That's it. The **equals()**, **hashCode()** and **toString()** methods will be auto generated for records.
However, note that getters doesn't follow the usual **getId(), getName()** pattern. 
Instead, it will generate accessor methods as **person.id()** and **person.name()**.

## Using Records with SpringBoot 3
[Spring Boot 3](https://spring.io/blog/2022/11/24/spring-boot-3-0-goes-ga) is released on 24-Nov-2022 which requires Java 17+.
Let us see how and where can we use Records with SpringBoot.

### Binding Application Properties
If you are familiar with SpringBoot application properties binding to a class, this look like this:

```java
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "app")
@Validated
class ApplicationProperties {
    @Min(1)
    @Max(100)
    private int pageSize;
    
    public int getPageSize() {
        return pageSize;
    }
    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }
}
```

SpringBoot 2.2.0 introduced support for **ConstructorBinding** which can be used to bind properties to an immutable class.

```java
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.ConstructorBinding;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "app")
@Validated
public class ApplicationProperties {
    @Min(1)
    @Max(100)
    private final int pageSize;

    @ConstructorBinding
    public ApplicationProperties(int pageSize) {
        this.pageSize = pageSize;
    }
    public int getPageSize() {
        return pageSize;
    }
}
```

Most likely you want your **ApplicationProperties** object to be immutable, and hence Records is a good choice here.
So, we can make **ApplicationProperties** as a Record and use it as follows:

```java
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@ConfigurationProperties(prefix = "app")
@Validated
public record ApplicationProperties(
        @Min(1)
        @Max(100)
        int pageSize
) {
}
```

This is very concise and also prevents accidentally modifying the configuration properties values.

## Binding to Http Request/Response Payloads
We usually create DTO classes with setters and getters to bind incoming HTTP request payload because frameworks needs a way to bind the request payload to the class properties.

SpringBoot by default uses [Jackson](https://github.com/FasterXML/jackson) library to convert request/response payloads to/from JSON and Jackson 2.12 introduced support for Records.
So, we can use Records to bind incoming request payloads and also return records as response.

Here is a Record with Bean Validation constraints applied:

```java
import jakarta.validation.constraints.NotEmpty;
import java.time.Instant;

public record Bookmark(
        Long id,
        @NotEmpty(message = "Title is mandatory")
        String title,
        @NotEmpty(message = "Url is mandatory")
        String url,
        Instant createdAt) {
}
```

We can use the Bookmark record with SpringMVC controller as follows:

```java
import com.sivalabs.bookmarks.domain.Bookmark;
import com.sivalabs.bookmarks.domain.BookmarkService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {
    private final BookmarkService service;

    @PostMapping
    public ResponseEntity<Bookmark> save(@Valid @RequestBody Bookmark bookmark) {
        Bookmark savedBookmark = service.save(bookmark);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBookmark);
    }
}
```

Here we are binding the JSON request payload to Bookmark record and also returning the Bookmark record as response payload which Jackson will convert to JSON.

> You can find a sample project demonstrating the Java records usage with SpringBoot 3 at https://github.com/sivaprasadreddy/spring-boot-jpa-crud-demo

# Conclusion
Java records are very useful to model the immutable data carrier objects with very concise syntax.
However, Records are not silver bullet solution for every scenario. There could be cases where a regular class is better suited than Records.
