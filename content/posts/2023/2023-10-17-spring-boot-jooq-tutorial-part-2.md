---
title: "Spring Boot + jOOQ Tutorial - 2 : Implementing CRUD Operations"
author: Siva
images: ["/preview-images/spring-boot-jooq-tutorial-part-2.webp"]
type: post
draft: false
date: 2023-10-17T06:00:00+05:30
url: /spring-boot-jooq-tutorial-crud-operations
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, jOOQ]
description: In this tutorial, we will learn how to implement basic CRUD Operations using jOOQ.
---
In the [previous tutorial]({{< relref "2023-10-12-spring-boot-jooq-tutorial-part-1.md" >}}), we have seen how to generate jOOQ code using 
the [testcontainers-jooq-codegen-maven-plugin](https://github.com/testcontainers/testcontainers-jooq-codegen-maven-plugin) 
and use jOOQ Typesafe DSL to execute SQL queries.
In this tutorial, we will learn how to implement basic CRUD Operations using jOOQ.

{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub:
https://github.com/sivaprasadreddy/spring-boot-jooq-demo
{{< /box >}}

In this tutorial, we will see how to perform basic CRUD (**C**reate, **R**ead, **U**pdate, **D**elete) operations on **USERS** table using jOOQ.

## Implementing findAllUsers()
First, let us start with fetching all the user's details from the USERS table.
Assume we are only interested in the **id**, **name**, **email** and **password** columns of the USERS table.

Let's create **User** and **UserPreferences** records as follows:

```java
package com.sivalabs.bookmarks.models;

public record User(Long id, String name, String email, String password) { }
```

```java
package com.sivalabs.bookmarks.models;

public record UserPreferences(Long id, Long userId, String theme, String language) { }
```


Let's implement **findAllUsers()** method in **UserRepository** class as follows:

```java
package com.sivalabs.bookmarks.repositories;

import com.sivalabs.bookmarks.models.User;
import org.jooq.DSLContext;
import org.jooq.impl.SQLDataType;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.sivalabs.bookmarks.jooq.tables.Users.USERS;
import static org.jooq.impl.DSL.inline;

@Repository
class UserRepository {
    private final DSLContext dsl;

    UserRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public List<User> findAllUsers() {
        return dsl.select(USERS.ID, USERS.NAME, USERS.EMAIL,
                        inline(null, SQLDataType.VARCHAR).as("password")
                ).from(USERS)
                .fetch(r -> new User(
                        r.get(USERS.ID),
                        r.get(USERS.NAME),
                        r.get(USERS.EMAIL),
                        r.get(USERS.PASSWORD))
                );
    }
}
```

* We are querying the **USERS** table to only return the **id**, **name**, **email** and **password** columns.
* But we don't want to return the actual **password** value, so we are returning **null** for the **password** column.
* The **fetch()** method returns a list of **UsersRecord** objects, and we are converting them to **User** objects.

## Implementing findUserById()
Let's implement **findUserById()** method in **UserRepository** class as follows:

```java
public Optional<User> findUserById(Long id) {
    return dsl.select(USERS.ID, USERS.NAME, USERS.EMAIL,
                    inline(null, SQLDataType.VARCHAR).as("password")
            ).from(USERS)
            .where(USERS.ID.eq(id))
            .fetchOptional(r -> new User(
                    r.get(USERS.ID),
                    r.get(USERS.NAME),
                    r.get(USERS.EMAIL),
                    r.get(USERS.PASSWORD))
            );
}
```
The implementation is very similar to **findAllUsers()** method, 
except that we are using **fetchOptional()** method to return an **Optional** object.

## Implementing createUser()
Let's implement **createUser()** method in **UserRepository** class as follows:

```java
public User createUser(User user) {
    return dsl.insertInto(USERS)
            .set(USERS.NAME, user.name())
            .set(USERS.EMAIL, user.email())
            .set(USERS.PASSWORD, user.password())
            .returning()
            .fetchOne(record -> new User(
                    record.getId(),
                    record.getName(),
                    record.getEmail(),
                    null));
}
```

We are using **dsl.insertInto(USERS)** and then setting values for various columns using **set()** method.
This is one way of inserting a new record, and there are few other ways you can do it using jOOQ.
We are using **returning()** method to return the newly inserted row details and mapping it to the User object.

You can also use a slightly different approach/syntax as follows:

```java
public User createUser(User user){
    return dsl.insertInto(USERS,USERS.NAME,USERS.EMAIL,USERS.PASSWORD)
            .values(user.name(),user.email(),user.password())
            .returning()
            .fetchOne(record->new User(
                        record.getId(),
                        record.getName(),
                        record.getEmail(),
                        null));
}
```

## Implementing updateUser()
Let's implement **updateUser()** method in **UserRepository** class as follows:

```java
public void updateUser(User user) {
    dsl.update(USERS)
        .set(USERS.NAME, user.name())
        .where(USERS.ID.eq(user.id()))
        .execute();
}
```

Here we are only updating the **name** column of the **USERS** table.
The execute() method returns the number of rows updated.

## Implementing deleteUser()
Let's implement **deleteUser()** method in **UserRepository** class as follows:

```java
public void deleteUser(Long id) {
    dsl.deleteFrom(USERS)
        .where(USERS.ID.eq(id))
        .execute();
}
```

## Implementing Tests using Testcontainers

Let's write UserRepositoryTest to test the above CRUD operations.

```java
package com.sivalabs.bookmarks.repo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

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
        String username = userRepository.findUserById(1L);
        assertThat(username).isEqualTo("Admin");
    }
}
```

* We are using **@JooqTest** slice test annotation to test our repository class.
* We are using **@Testcontainers** and **@Container** annotations to start a PostgreSQL database and 
registering the DataSource properties using [ServiceConnection](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing.testcontainers.service-connections) support.
* We are using **@Sql** annotation to load the test data into the database.

## Conclusion
In this first part, we have set the stage for exploring jOOQ.
In the next part, we will learn how to implement basic CRUD operations using jOOQ.