---
title: 'Spring Boot + jOOQ Tutorial - 5 : Fetching Many-to-Many Relationships'
author: Siva
images:
  - /preview-images/spring-boot-jooq-tutorial-part-5.webp
type: post
draft: false
date: 2023-10-26T00:30:00.000Z
url: /blog/spring-boot-jooq-tutorial-fetching-many-to-many-associations
toc: true
categories:
  - jOOQ
tags:
  - SpringBoot
  - jOOQ
description: In this tutorial, we will learn how to implement fetch Many-to-Many relationships using jOOQ.
aliases:
  - /spring-boot-jooq-tutorial-fetching-many-to-many-associations
---
In the [previous tutorial]({{< relref "2023-10-23-spring-boot-jooq-tutorial-part-4.md" >}}), 
we have learned how to fetch **One-to-Many** relationships using jOOQ.
In this tutorial, we will learn how to fetch **Many-to-Many** relationships using jOOQ.

<!--more-->


* [jOOQ Tutorial - 1 : Getting Started]({{< relref "2023-10-12-spring-boot-jooq-tutorial-part-1.md" >}})
* [jOOQ Tutorial - 2 : Implementing CRUD Operations]({{< relref "2023-10-16-spring-boot-jooq-tutorial-part-2.md" >}})
* [jOOQ Tutorial - 3 : Fetching One-to-One Relationships]({{< relref "2023-10-19-spring-boot-jooq-tutorial-part-3.md" >}})
* [jOOQ Tutorial - 4 : Fetching One-to-Many Relationships]({{< relref "2023-10-23-spring-boot-jooq-tutorial-part-4.md" >}})
* [jOOQ Tutorial - 5 : Fetching Many-to-Many Relationships]({{< relref "2023-10-26-spring-boot-jooq-tutorial-part-5.md" >}})

{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub:
https://github.com/sivaprasadreddy/spring-boot-jooq-demo
{{< /box >}}

In our sample database, we have **bookmarks** and **tags** tables.
Each bookmark can be associated with multiple bookmarks and vice-versa, 
so there is a **Many-to-Many** relationship between **bookmarks** and **tags** tables. 

Let's see how we can fetch a list of bookmarks along with the tags.

First, let's create **BookmarkWithTags** as a record.

```java 
package com.sivalabs.bookmarks.models;

import java.util.List;

public record BookmarkWithTags(Long id, String title, String url, List<TagInfo> tags) {
    public record TagInfo (Long id, String name){}
}
```

## Fetching Many-to-Many Relationships using MULTISET value constructor

We are going to use jOOQ's **MULTISET** value constructor to fetch the list of bookmarks along with tags.

Let's implement fetching bookmarks along with the tags as follows:

```java
package com.sivalabs.bookmarks.repositories;

import com.sivalabs.bookmarks.models.BookmarkWithTags;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.sivalabs.bookmarks.jooq.Tables.BOOKMARK_TAG;
import static com.sivalabs.bookmarks.jooq.tables.Bookmarks.BOOKMARKS;
import static com.sivalabs.bookmarks.jooq.tables.Tags.TAGS;
import static org.jooq.Records.mapping;
import static org.jooq.impl.DSL.multiset;
import static org.jooq.impl.DSL.select;

@Repository
public class BookmarkRepository {
    private final DSLContext dsl;

    public BookmarkRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<BookmarkWithTags> getBookmarksWithTags() {
        return dsl
                .select(
                    BOOKMARKS.ID, BOOKMARKS.TITLE, BOOKMARKS.URL,
                    multiset(
                            select(TAGS.ID, TAGS.NAME)
                                .from(TAGS)
                                .join(BOOKMARK_TAG)
                                .on(BOOKMARK_TAG.TAG_ID.eq(TAGS.ID))
                                .where(BOOKMARK_TAG.BOOKMARK_ID.eq(BOOKMARKS.ID))
                    ).as("tags").convertFrom(r -> r.map(mapping(BookmarkWithTags.TagInfo::new)))
                )
                .from(BOOKMARKS)
                .fetch(mapping(BookmarkWithTags::new));
    }
}
```

## Sample Test Data Setup
We have the following **src/test/resources/test-data.sql** file to insert test data into the database.

```sql
# OMITTING OTHER INSERT STATEMENTS FOR BREVITY

INSERT INTO tags(id, name)
VALUES (1, 'java'),
       (2, 'spring-boot'),
       (3, 'spring-cloud'),
       (4, 'devops'),
       (5, 'security')
;

INSERT INTO bookmarks(id, title, url, created_by, created_at)
VALUES (1, 'SivaLabs', 'https://sivalabs.in', 1, CURRENT_TIMESTAMP),
       (2, 'Spring Initializr', 'https://start.spring.io', 2, CURRENT_TIMESTAMP),
       (3, 'Spring Blog', 'https://spring.io/blog', 2, CURRENT_TIMESTAMP)
;

insert into bookmark_tag(bookmark_id, tag_id)
VALUES (1, 1),
       (1, 2),
       (1, 3),
       (2, 2),
       (3, 2),
       (3, 3),
       (3, 4)
;
```

## Test Loading the Many-to-Many Relationships 
Now, let's write a test case to verify the above method.

```java
package com.sivalabs.bookmarks.repositories;

import com.sivalabs.bookmarks.models.BookmarkWithTags;
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

import static org.assertj.core.api.Assertions.assertThat;

@JooqTest
@Import({BookmarkRepository.class})
@Testcontainers
@Sql("classpath:/test-data.sql")
class BookmarkRepositoryTest {

    @Autowired
    BookmarkRepository bookmarkRepository;

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
    void getBookmarksWithTags() {
        var bookmarksWithTags = bookmarkRepository.getBookmarksWithTags();
        assertThat(bookmarksWithTags).hasSize(3);

        var javaTag = new BookmarkWithTags.TagInfo(1L, "java");
        var springBootTag = new BookmarkWithTags.TagInfo(2L, "spring-boot");
        var springCloudTag = new BookmarkWithTags.TagInfo(3L, "spring-cloud");
        var devopsTag = new BookmarkWithTags.TagInfo(4L, "devops");

        var bookmark1 = new BookmarkWithTags(1L, "SivaLabs", "https://sivalabs.in",
                List.of(javaTag, springBootTag, springCloudTag));
        var bookmark2 = new BookmarkWithTags(2L, "Spring Initializr", "https://start.spring.io",
                List.of(springBootTag));
        var bookmark3 = new BookmarkWithTags(3L, "Spring Blog", "https://spring.io/blog",
                List.of(springBootTag, springCloudTag, devopsTag));

        assertThat(bookmarksWithTags).contains(bookmark1, bookmark2, bookmark3);
    }
}
```

If you run the test, it should pass.

## Conclusion
In this tutorial, we have learned how to fetch **Many-to-Many** relationships using jOOQ with the help of MULTISET value operator.
