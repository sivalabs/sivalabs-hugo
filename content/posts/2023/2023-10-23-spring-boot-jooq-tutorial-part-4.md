---
title: "Spring Boot + jOOQ Tutorial - 4 : Fetching One-to-Many Relationships"
author: Siva
images: ["/preview-images/spring-boot-jooq-tutorial-part-4.webp"]
type: post
draft: false
date: 2023-10-23T06:00:00+05:30
url: /spring-boot-jooq-tutorial-fetching-one-to-many-associations
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, jOOQ]
description: In this tutorial, we will learn how to implement fetch One-to-Many relationships using jOOQ.
---
In the [previous tutorial]({{< relref "2023-10-20-spring-boot-jooq-tutorial-part-3.md" >}}), 
we have learned how to fetch **One-to-One** relationships using jOOQ.
In this tutorial, we will learn how to fetch **One-to-Many** relationships using jOOQ.

{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub:
https://github.com/sivaprasadreddy/spring-boot-jooq-demo
{{< /box >}}

In our sample database, we have **users** and **bookmarks** tables.
Each user can create multiple bookmarks, so there is a **One-to-Many** relationship between **users** and **bookmarks** tables. 

Let's see how we can fetch a User details along with the bookmarks created by the user.

First, let's create **UserWithBookmarks** as a record.

```java 
package com.sivalabs.bookmarks.models;

import java.util.List;

public record UserWithBookmarks(Long id, String name, String email, List<BookmarkInfo> bookmarks) {
    public record BookmarkInfo (Long id, String title, String url){}
}
```

## Fetching One-to-Many Relationships using MULTISET value constructor

We are going to use jOOQ's **MULTISET** value constructor to fetch the list of bookmarks created by the user.
You can more details about **MULTISET value constructor** here: https://www.jooq.org/doc/latest/manual/sql-building/column-expressions/multiset-value-constructor/.

Also, I highly recommend reading [How jOOQ 3.15’s New Multiset Operator Will Change How You Think About SQL](https://blog.jooq.org/jooq-3-15s-new-multiset-operator-will-change-how-you-think-about-sql/) article.

Let's implement fetching a user details along with the bookmarks created by that user.

```java
public Optional<UserWithBookmarks> getUserWithBookmarksById(Long userId) {
    return dsl
            .select(
                USERS.ID, USERS.NAME, USERS.EMAIL,
                multiset(
                    select(BOOKMARKS.ID, BOOKMARKS.TITLE, BOOKMARKS.URL)
                    .from(BOOKMARKS)
                    .where(BOOKMARKS.CREATED_BY.eq(USERS.ID))
                ).as("bookmarks").convertFrom(r -> r.map(mapping(UserWithBookmarks.BookmarkInfo::new)))
            )
            .from(USERS)
            .where(USERS.ID.eq(userId))
            .fetchOptional()
            .map(mapping(UserWithBookmarks::new));
}
```

## Sample Test Data Setup
We have the following **src/test/resources/test-data.sql** file to insert test data into the database.

```sql
# OMITTING OTHER INSERT STATEMENTS FOR BREVITY

INSERT INTO users (id, email, password, name, preferences_id)
VALUES (1, 'admin@gmail.com', 'admin', 'Admin', 2),
       (2, 'siva@gmail.com', 'siva', 'Siva', 1)
;
  
INSERT INTO bookmarks(id, title, url, created_by, created_at)
VALUES (1, 'SivaLabs', 'https://sivalabs.in', 1, CURRENT_TIMESTAMP),
       (2, 'Spring Initializr', 'https://start.spring.io', 2, CURRENT_TIMESTAMP),
       (3, 'Spring Blog', 'https://spring.io/blog', 2, CURRENT_TIMESTAMP)
;
```

## Test Loading the One-to-Many Relationships 
Now, let's write a test case to verify the above method.

```java
package com.sivalabs.bookmarks.repositories;

import com.sivalabs.bookmarks.models.User;
import com.sivalabs.bookmarks.models.UserWithBookmarks;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@JooqTest
@Import({UserRepository.class})
@Testcontainers
@Sql("classpath:/test-data.sql")
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
    void getUserWithBookmarks() {
        Optional<UserWithBookmarks> userOptional = userRepository.getUserWithBookmarksById(2L);
        assertThat(userOptional).isPresent();
        UserWithBookmarks user = userOptional.get();
        assertThat(user.id()).isEqualTo(2L);
        assertThat(user.name()).isEqualTo("Siva");
        assertThat(user.email()).isEqualTo("siva@gmail.com");

        assertThat(user.bookmarks()).hasSize(2);

        var bookmark1 = new UserWithBookmarks.BookmarkInfo(2L, "Spring Initializr", "https://start.spring.io");
        var bookmark2 = new UserWithBookmarks.BookmarkInfo(3L, "Spring Blog", "https://spring.io/blog");

        assertThat(user.bookmarks()).contains(bookmark1, bookmark2);
    }
}
```

If you run the test, it should pass.

## Conclusion
In this tutorial, we have learned how to fetch **One-to-Many** relationships using jOOQ with the help of MULTISET value operator.
In the next tutorial, we will learn how to fetch **Many-to-Many** relationships using jOOQ.
