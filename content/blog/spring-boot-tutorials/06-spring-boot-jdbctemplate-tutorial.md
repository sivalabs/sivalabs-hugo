---
title: Spring Boot JdbcTemplate Tutorial
author: Siva
images:
  - /preview-images/spring-boot-jdbctemplate-tutorial.webp
type: post
draft: false
date: 2023-08-01T00:30:00.000Z
url: /blog/spring-boot-jdbctemplate-tutorial
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Tutorials
description: In this tutorial, you will learn how to work with SQL databases using JdbcTemplate in Spring Boot applications.
aliases:
  - /spring-boot-jdbctemplate-tutorial
---

## Introducing Spring Boot JDBC Support
Spring's **JdbcTemplate** provides high-level abstraction on top of **DataSource** to perform database operations.
In addition to that Spring's declarative Transaction Management capabilities helps to manage database transactions 
in a simplified way without having to write boilerplate code.

<!--more-->


Spring Boot simplifies the configuration of **DataSource**, **TransactionManager**, etc. by using 
it's AutoConfiguration mechanism.

{{< box info >}}
**How SpringBoot AutoConfiguration magic works?**

If you want to learn more about Spring Boot AutoConfiguration, 
see [How SpringBoot AutoConfiguration magic works?]({{< relref "2016-03-13-how-springboot-autoconfiguration-magic.md" >}}).
{{< /box >}}

Let's see how we can perform CRUD operations using **JdbcTemplate** with PostgreSQL database.

First, go to https://start.spring.io/ and create a Spring Boot application by selecting **JDBC API**, **PostgreSQL Driver** 
and **Testcontainers** starters.

Imagine we are a building a simple application to manage bookmarks.
So, we are going to create **bookmarks** table with **id, title, url and created_at** columns.

## Initializing the Database
Spring Boot provides a convenient mechanism to initialize a database.
We can create **schema.sql** and **data.sql** files under **src/main/resources** which will be automatically executed 
upon starting the application.
However, this automatic script execution is enabled by default only when using in-memory databases like HSQL, H2, etc. but disabled otherwise.

We can enable the script initialization by adding the following property in **src/main/resources/application.properties** file.

```properties
spring.sql.init.mode=always
```

Now, let's create **src/main/resources/schema.sql** file as follows:

```sql
create table if not exists bookmarks
(
    id         bigserial not null,
    title      varchar   not null,
    url        varchar   not null,
    created_at timestamp,
    primary key (id)
);
```

To insert some sample data, create **src/main/resources/data.sql** file as follows:

```sql
truncate table bookmarks;
ALTER SEQUENCE bookmarks_id_seq RESTART WITH 1;

insert into bookmarks(title, url, created_at) values
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

{{< box tip >}}
**Use a DB Migration Tool**

Though Spring Boot provides easy way to initialize database using **schema.sql** and **data.sql**, 
prefer using a proper database migration tools like **Liquibase** or **Flyway**.
{{< /box >}}

## Implementing CRUD operations using JdbcTemplate
Let's start with creating a class representing a **Bookmark**.

```java
import java.time.Instant;

public record Bookmark(
        Long id,
        String title,
        String url,
        Instant createdAt) {}
```

We have used Java records to model our **Bookmark** domain object.

Now, let's create **BookmarkRepository** class injecting **JdbcTemplate** as follows:

```java
@Repository
public class BookmarkRepository {
    private final JdbcTemplate jdbcTemplate;

    public BookmarkRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
}
```

Let's start with implementing **findAll()** method to fetch all the records from the **bookmarks** table.

### Implementing findAll() method
When we query the database, it will return a **ResultSet**.
We can provide a **RowMapper** implementation to map the **ResultSet** data into our **Bookmark** domain object as follows:

```java
@Repository
public class BookmarkRepository {
    private final JdbcTemplate jdbcTemplate;

    public BookmarkRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Bookmark> findAll() {
        String sql = "select id, title, url, created_at from bookmarks";
        return jdbcTemplate.query(sql, INSTANCE);
    }

    static class BookmarkRowMapper implements RowMapper<Bookmark> {
        public static final BookmarkRowMapper INSTANCE = new BookmarkRowMapper();
        
        private BookmarkRowMapper(){}
        
        @Override
        public Bookmark mapRow(ResultSet rs, int rowNum) throws SQLException {
            return new Bookmark(
                    rs.getLong("id"),
                    rs.getString("title"),
                    rs.getString("url"),
                    rs.getTimestamp("created_at").toInstant()
            );
        }
    }
}
```
We have created **BookmarkRowMapper** implementing **RowMapper** interface as a **Singleton**.
Then we have implemented **findAll()** method to fetch all rows from **bookmarks** table 
and mapped them into **Bookmark** objects using **BookmarkRowMapper**.

{{< box warning >}}
**IMPORTANT**

Fetching all rows from a table might lead to **OutOfMemoryException** if there are huge number of records.
Always prefer to use **pagination** to fetch only a subset of records and process them.
{{< /box >}}

### Implement findById() method
Let's implement **findById(Long id)** method to fetch a bookmark by **id** as follows:

```java
public Optional<Bookmark> findById(Long id) {
    String sql = "select id, title, url, created_at from bookmarks where id = ?";
    try {
        Bookmark bookmark = jdbcTemplate.queryForObject(sql, INSTANCE, id);
        return Optional.of(bookmark);
    } catch (EmptyResultDataAccessException e) {
        return Optional.empty();
    }
}
```

The **findById()** method is returning **Optional&lt;Bookmark&gt;** because a bookmark with given **id** may or may not exist.
We are using **jdbcTemplate.queryForObject(...)** method which throws **EmptyResultDataAccessException** if no records found.
So, we are handling the exception and returning **Optional.empty()**.

### Implement create() method
In **create()** method, we are going to insert a record into bookmarks table and return the auto_generated primary key value.

```java
public Long create(Bookmark bookmark) {
    KeyHolder keyHolder = new GeneratedKeyHolder();

    jdbcTemplate.update(connection -> {
        String sql = "insert into bookmarks(title, url, created_at) values(?,?,?)";
        PreparedStatement ps = connection.prepareStatement(sql, new String[] { "id" });
        ps.setString(1, bookmark.title());
        ps.setString(2, bookmark.url());
        ps.setTimestamp(3, Timestamp.from(bookmark.createdAt()));
        return ps;
    }, keyHolder);

    return (long) keyHolder.getKey();
}
```

Note that, in newer versions of PostgreSQL we are specifying the auto_generated keys 
using **connection.prepareStatement(sql, new String[] { "id" })**.
In previous versions, we can specify the same using **connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)**.

### Implement update() method
Let's implement **update()** method in such a way that if a bookmark exists by the given **id** then 
we need to update **title** and **url** columns. Otherwise, throw an Exception.

```java
public void update(Bookmark bookmark) {
    String sql = "update bookmarks set title = ?, url = ? where id = ?";
    int count = jdbcTemplate.update(sql, bookmark.title(), bookmark.url(), bookmark.id());
    if (count == 0) {
        throw new RuntimeException("Bookmark not found");
    }
}
```

The **jdbcTemplate.update(...)** method return the number of rows affected by the executed query.
If the count is 0 means there is no bookmark exists with the given id and hence we are throwing an Exception.

### Implement delete() method
Let's implement **delete()** method in such a way that if a bookmark exists by the given **id** then
delete that row, otherwise throw an Exception.

```java
public void delete(Long id) {
    String sql = "delete from bookmarks where id = ?";
    int count = jdbcTemplate.update(sql, id);
    if (count == 0) {
        throw new RuntimeException("Bookmark not found");
    }
}
```

## Testing Repository using Testcontainers
We should test our repositories interacting with PostgreSQL database using same type of database.
[Testcontainers](https://testcontainers.com) can help us to test our application with real dependencies instead of using mocks or in-memory variations such as H2.

{{< box tip >}}
**Tip:**

You can also watch my [Testing Database Repositories using Testcontainers](https://www.youtube.com/watch?v=sWWwVAJ2cCw) video.
{{< /box >}}

Let's write **BookmarkRepositoryTest** using Testcontainers as follows:

```java
package com.sivalabs.bookmarks.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@JdbcTest(properties = {
   "spring.test.database.replace=none",
   "spring.datasource.url=jdbc:tc:postgresql:15.2-alpine:///db"
})
class BookmarkRepositoryTest {

    @Autowired
    JdbcTemplate jdbcTemplate;

    BookmarkRepository bookmarkRepository;

    @BeforeEach
    void setUp() {
        bookmarkRepository = new BookmarkRepository(jdbcTemplate);
    }

    @Test
    void shouldFindAllBookmarks() {
        List<Bookmark> bookmarks = bookmarkRepository.findAll();
        assertThat(bookmarks).isNotEmpty();
        assertThat(bookmarks).hasSize(15);
    }

    @Test
    void shouldCreateBookmark() {
        Bookmark bookmark = new Bookmark(null, "My Title", "https://sivalabs.in", Instant.now());
        Long id = bookmarkRepository.save(bookmark);
        assertThat(id).isNotNull();
    }

    @Test
    void shouldGetBookmarkById() {
        Bookmark bookmark = new Bookmark(null, "My Title", "https://sivalabs.in", Instant.now());
        Long id = bookmarkRepository.save(bookmark);

        Optional<Bookmark> bookmarkOptional = bookmarkRepository.findById(id);
        assertThat(bookmarkOptional).isPresent();
    }

    @Test
    void shouldEmptyWhenBookmarkNotFound() {
        Optional<Bookmark> bookmarkOptional = bookmarkRepository.findById(9999L);
        assertThat(bookmarkOptional).isEmpty();
    }

    @Test
    void shouldUpdateBookmark() {
        Bookmark bookmark = new Bookmark(null, "My Title", "https://sivalabs.in", Instant.now());
        Long id = bookmarkRepository.save(bookmark);

        Bookmark updatedBookmark = new Bookmark(id, "My Updated Title", "https://www.sivalabs.in", bookmark.createdAt());
        bookmarkRepository.update(updatedBookmark);

        updatedBookmark = bookmarkRepository.findById(id).orElseThrow();
        assertThat(updatedBookmark.id()).isEqualTo(id);
        assertThat(updatedBookmark.title()).isEqualTo("My Updated Title");
        assertThat(updatedBookmark.url()).isEqualTo("https://www.sivalabs.in");
    }
    
    @Test
    void shouldDeleteBookmark() {
        Bookmark bookmark = new Bookmark(null, "My Title", "https://sivalabs.in", Instant.now());
        Long id = bookmarkRepository.save(bookmark);

        bookmarkRepository.delete(id);
    }
}
```

We are using Spring Boot Test Slice annotation **@JdbcTest** to test only Repository instead of loading the entire application.
Then we are using Testcontainers special JDBC URL support to spin up a PostgreSQL database using **postgres:15.2-alpine** image.
Then we have written various tests to test our CRUD operations.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
Spring's **JdbcTemplate** provides high-level abstraction to perform database operations without having to write boilerplate code.
We have learned how to implement CRUD operations using **JdbcTemplate** and also written tests using **Testcontainers**.

