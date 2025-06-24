---
title: "Spring Boot + jOOQ Tutorial - 3 : Fetching One-to-One Relationships"
author: Siva
images: ["/preview-images/spring-boot-jooq-tutorial-part-3.webp"]
type: post
draft: false
date: 2023-10-19T06:00:00+05:30
url: /spring-boot-jooq-tutorial-fetching-one-to-one-associations
toc: true
categories: ["jOOQ"]
tags: [SpringBoot, jOOQ]
description: In this tutorial, we will learn how to implement fetch One-to-One relationships using jOOQ.
---
In the [previous tutorial]({{< relref "2023-10-16-spring-boot-jooq-tutorial-part-2.md" >}}), 
we have learned how to implement basic CRUD Operations using jOOQ.
In this tutorial, we will learn how to fetch **One-to-One** relationships using jOOQ.

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

Generally, when we are displaying a list of records, we will display minimal information about the record, and 
when the user clicks on the record, we will display the complete information about the record.

In our sample application, let's say we will display the list of users with minimal information like **id**, **name**, and **email**.
When the user clicks on the user, we will display the complete information about the user including the user preferences.

So, let's update our **findUserById()** method to fetch the user preferences as well.

First, let's create **UserPreferences** as a record.

```java 
public record UserPreferences(Long id, String theme, String language) {
}
```

Update the **User** class to include the **UserPreferences**.

```java
package com.sivalabs.bookmarks.models;

public record User (
     Long id,
     String name,
     String email,
     String password,
     UserPreferences preferences
) {
    public User(Long id, String name, String email, String password) {
        this(id, name, email, password, null);
    }

    public static User create(Long id, String name, String email, String password) {
        return new User(id, name, email, password, null);
    }
}
```

In SQL, we can fetch the user preferences using the **LEFT OUTER JOIN** query as shown below:

```sql
SELECT u.id, u.name, u.email, u.password, up.id as "preferences_id", up.theme, up.language
FROM users u LEFT OUTER JOIN user_preferences up ON u.preferences_id = up.id
WHERE u.id = 1;
```

Let's implement the above query using jOOQ.

```java
public Optional<User> findUserById(Long id) {
    return dsl
            .select(
                USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD,
                USER_PREFERENCES.ID, USER_PREFERENCES.THEME, USER_PREFERENCES.LANGUAGE)
            .from(USERS.leftOuterJoin(USER_PREFERENCES).on(USERS.PREFERENCES_ID.eq(USER_PREFERENCES.ID)))
            .where(USERS.ID.eq(id))
            .fetchOptional(record -> new User(
                    record.get(USERS.ID),
                    record.get(USERS.NAME),
                    record.get(USERS.EMAIL),
                    record.get(USERS.PASSWORD),
                    new UserPreferences(
                            record.get(USER_PREFERENCES.ID),
                            record.get(USER_PREFERENCES.THEME),
                            record.get(USER_PREFERENCES.LANGUAGE)
                    )
            ));
}
```

Now, let's update our test case to verify the above method.

```java
package com.sivalabs.bookmarks.repositories;

import com.sivalabs.bookmarks.models.User;
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
    void findUserById() {
        Optional<User> userOptional = userRepository.findUserById(1L);
        assertThat(userOptional).isPresent();
        assertThat(userOptional.get().id()).isEqualTo(1L);
        assertThat(userOptional.get().name()).isEqualTo("Admin");
        assertThat(userOptional.get().email()).isEqualTo("admin@gmail.com");
        assertThat(userOptional.get().password()).isEqualTo("admin");
        assertThat(user.preferences().id()).isEqualTo(2L);
        assertThat(user.preferences().theme()).isEqualTo("Dark");
        assertThat(user.preferences().language()).isEqualTo("EN");
    }
}
```

If you run the test, it should pass.

## Using Implicit Join Path
The jOOQ generated code provides a better way to fetch the One-to-One relationships using 
the implicit join path to the associated table like **USERS.userPreferences().ID, USERS.userPreferences().THEME**, etc.

Let's update our **findUserById()** method to use the implicit join path.

```java
public Optional<User> findUserById(Long id) {
    return dsl
            .select(
                USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD,
                USERS.userPreferences().ID, USERS.userPreferences().THEME, USERS.userPreferences().LANGUAGE)
            .from(USERS)
            .where(USERS.ID.eq(id))
            .fetchOptional(record -> new User(
                record.get(USERS.ID),
                record.get(USERS.NAME),
                record.get(USERS.EMAIL),
                record.get(USERS.PASSWORD),
                new UserPreferences(
                    record.get(USER_PREFERENCES.ID),
                    record.get(USER_PREFERENCES.THEME),
                    record.get(USER_PREFERENCES.LANGUAGE)
                )
            ));
}
```

## Using Row Value Expressions
We can also fetch the One-to-One relationships using jOOQ's row value expression as follows:

```java
public Optional<User> findUserById(Long id) {
    return dsl
            .select(
                USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD,
                row(
                    USERS.userPreferences().ID,
                    USERS.userPreferences().THEME,
                    USERS.userPreferences().LANGUAGE
                ).mapping(UserPreferences::new).as("preferences"))
            .from(USERS)
            .where(USERS.ID.eq(id))
            .fetchOptional()
            .map(mapping((userId, name, email, password, preferences) ->
                            new User(userId, name, email, password, preferences)));
}
```

You might want to fetch the same information for other methods as well such as **findUserByEmail()**.
In that case, you can extract the select clause and result mapping into separate methods as shown in 
the **Part-2 Implementing findUserById()** section.

## Conclusion
In this tutorial, we have learned how to fetch **One-to-One** relationships using jOOQ.
In the next tutorial, we will learn how to fetch **One-to-Many** relationships using jOOQ.
