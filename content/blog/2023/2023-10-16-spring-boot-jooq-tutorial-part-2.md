---
title: "Spring Boot + jOOQ Tutorial - 2 : Implementing CRUD Operations"
author: Siva
images: ["/preview-images/spring-boot-jooq-tutorial-part-2.webp"]
type: post
draft: false
date: 2023-10-16T06:00:00+05:30
url: /spring-boot-jooq-tutorial-crud-operations
toc: true
categories: ["jOOQ"]
tags: [SpringBoot, jOOQ]
description: In this tutorial, we will learn how to implement basic CRUD Operations using jOOQ.
---
In the [previous tutorial]({{< relref "2023-10-12-spring-boot-jooq-tutorial-part-1.md" >}}), we have seen how to generate jOOQ code using 
the [testcontainers-jooq-codegen-maven-plugin](https://github.com/testcontainers/testcontainers-jooq-codegen-maven-plugin) 
and use jOOQ Typesafe DSL to execute SQL queries.
In this tutorial, we will learn how to implement basic CRUD Operations using jOOQ.

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

In this tutorial, we will see how to perform basic CRUD (**C**reate, **R**ead, **U**pdate, **D**elete) operations on **USERS** table using jOOQ.

## Implementing findAllUsers()
First, let us start with fetching all the users from the **USERS** table.
Assume we are only interested in the **id**, **name**, **email** and **password** columns of the **USERS** table.
We will deal with fetching relations like **UserPreferences**, **Bookmarks** later.

Let's create **User** record as follows:

```java
package com.sivalabs.bookmarks.models;

public record User(Long id, String name, String email, String password) { }
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
        return dsl
                .select(USERS.ID, USERS.NAME, USERS.EMAIL,USERS.PASSWORD)
                .from(USERS)
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
* The **fetch()** method returns a list of **UsersRecord** objects, and we are converting them to **User** objects.

If the **User** record has a constructor which takes all the selected column value types as arguments 
(in this case, Long, String, String, String), then we can use the following syntax:

```java
public List<User> findAllUsers() {
    return dsl
        .select(USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD)
        .from(USERS)
        .fetch(r -> r.into(User.class));
}
```

Here the **UsersRecord** fields are mapped into a **User** object using **Reflection**.

Instead, you can use **org.jooq.Records.mapping()** to map the **UsersRecord** fields to a **User** object as follows:

```java
import static org.jooq.Records.mapping;

public List<User> findAllUsers(){
    return dsl.select(USERS.ID,USERS.NAME,USERS.EMAIL,USERS.PASSWORD)
            .from(USERS)
            //using a lambda
            .fetch(mapping((id,name,email,password) -> new User(id,name,email,password)));
    
            //using a constructor reference
            //.fetch(mapping(User::new));
        
            //using a factory method reference
            //.fetch(mapping(User::create));
}

// factory method in User class
public record User (Long id, String name, String email, String password
) {
    public static User create(Long id, String name, String email, String password) {
        return new User(id, name, email, password);
    }
}
```

If you want to select all the columns from the **USERS** table, and we have a corresponding constructor, 
then we can use the following syntax:

```java
public record User (Long id, String name, String email, String password,
                    Long userPreferencesId, LocalDateTime createdAt, LocalDateTime updatedAt) { }

public List<User> findAllUsers(){
    return dsl.selectFrom(USERS).fetch(r->r.into(User.class));
}
```

**But the best practice is to select only the columns/data you need for the usecase and map the result to a DTO/record.**

## Implementing findUserById()
Let's implement **findUserById()** method in **UserRepository** class as follows:

```java
public Optional<User> findUserById(Long id) {
    return dsl
            .select(USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD)
            .from(USERS)
            .where(USERS.ID.eq(id))
        .fetchOptional()
        //using reflection
        //.map(r -> r.into(User.class));
        // using factory method
        .map(mapping(User::create));
}
```
The implementation is very similar to **findAllUsers()** method, 
except that we are using **fetchOptional()** method to return an **Optional** object.

If you want to load all the columns from the **USERS** table, and you have a corresponding **User** constructor, 
then you can use the following syntax:

```java
public Optional<User> findUserById(Long id){
    return dsl.fetchOptional(USERS,USERS.ID.eq(id))
            .map(r -> r.into(User.class));
}
```

If you have many **findByXXX()** methods which have the same select columns, and the same mapping logic,
then you can extract it into a method as follows:

```java
public Optional<User> findUserById(Long id) {
    return getSelectUserSpec()
            .where(USERS.ID.eq(id))
            .fetchOptional(new UserRecordMapper());
}
        
public Optional<User> findUserByEmail(String email) {
    return getSelectUserSpec()
            .where(USERS.EMAIL.equalIgnoreCase(email))
            .fetchOptional(new UserRecordMapper());
}

private SelectJoinStep<Record4<Long, String, String, String>> getSelectUserSpec() {
        return dsl.select(USERS.ID, USERS.NAME, USERS.EMAIL, USERS.PASSWORD)
        .from(USERS);
}

static class UserRecordMapper
        implements RecordMapper<Record4<Long, String, String, String>, User> {
    @Override
    public User map(Record4<Long, String, String, String> userRecord) {
        return new User(
                userRecord.get(USERS.ID),
                userRecord.get(USERS.NAME),
                userRecord.get(USERS.EMAIL),
                userRecord.get(USERS.PASSWORD)
        );
    }
}
```

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
                    record.getPassword()));
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
            .fetchOne(record -> new User(
                        record.getId(),
                        record.getName(),
                        record.getEmail(),
                        record.getPassword()));
}
```

Another approach using **UsersRecord** (**UpdatableRecord**) object:

```java
public User createUser(User user){
    UsersRecord record=dsl.newRecord(USERS);
    record.setName(user.name());
    record.setEmail(user.email());
    record.setPassword(user.password());
    record.store();
    
    return new User(record.getId(),
                    record.getName(),
                    record.getEmail(),
                    record.getPassword());
}
```

Yet another approach using **UsersRecord** populating data from a **User** object:

```java
public User createUser(User user){
    UsersRecord record = dsl.newRecord(USERS,user);
    record.store();
    return new User(record.getId(),
                    record.getName(),
                    record.getEmail(),
                    record.getPassword());
}
```

Check **org.jooq.Record.from(Object source)**, which is internally called by **dsl.newRecord(USERS, user)**, 
API docs for knowing the mapping rules.

{{< box info >}}
**Persisting Associated Objects**

Unlike JPA, there is no support for automatic persisting associated objects in jOOQ.

For ex, if **User** has **UserPreferences**, then you need to persist **UserPreferences** separately.
{{< /box >}}

## Implementing updateUser()
Let's implement **updateUser()** method in **UserRepository** class as follows:

```java
public void updateUser(User user) {
    dsl.update(USERS)
        .set(USERS.NAME, user.name())
        .where(USERS.ID.eq(user.id()))
        .execute();
    
    //Another approach to check for record existence before updating
    /*
    dsl.fetchOptional(USERS, USERS.ID.eq(user.id()))
            .ifPresent(record -> {
                record.setName(user.name());
                record.store();
            });
    */
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
    void findAllUsers() {
        List<User> users = userRepository.findAllUsers();
        assertThat(users).hasSize(2);
        //more assertions
    }

    @Test
    void findUserById() {
        Optional<User> userOptional = userRepository.findUserById(1L);
        assertThat(userOptional).isPresent();
        assertThat(userOptional.get().id()).isEqualTo(1L);
        assertThat(userOptional.get().name()).isEqualTo("Admin");
        assertThat(userOptional.get().email()).isEqualTo("admin@gmail.com");
        assertThat(userOptional.get().password()).isEqualTo("admin");
    }

    @Test
    void createUser() {
        User user = new User(null, "SivaLabs", "sivalabs@gmail.com", "siva1234");

        User savedUser = userRepository.createUser(user);
        assertThat(savedUser.id()).isNotNull();
        assertThat(savedUser.name()).isEqualTo("SivaLabs");
        assertThat(savedUser.email()).isEqualTo("sivalabs@gmail.com");
        assertThat(savedUser.password()).isEqualTo("siva1234");
    }

    @Test
    void updateUser() {
        User user = createTestUser();
        User updateUser = new User(user.id(), "TestName1", user.email(), user.password());
        userRepository.updateUser(updateUser);

        User updatedUser = userRepository.findUserById(updateUser.id()).orElseThrow();

        assertThat(updatedUser.id()).isEqualTo(updateUser.id());
        assertThat(updatedUser.name()).isEqualTo("TestName1");
        assertThat(updatedUser.email()).isEqualTo(user.email());
        assertThat(updatedUser.password()).isEqualTo(user.password());
    }

    @Test
    void deleteUser() {
        User user = createTestUser();
        userRepository.deleteUser(user.id());

        Optional<User> optionalUser = userRepository.findUserById(user.id());
        assertThat(optionalUser).isEmpty();
    }

    private User createTestUser() {
        String uuid = UUID.randomUUID().toString();
        User user = new User(null, uuid, uuid+"@gmail.com", "Secret");
        return userRepository.createUser(user);
    }
}
```

## Conclusion
In this second part, we have learned how to implement basic CRUD operations using jOOQ.
In the next part, we will explore how to **fetch One-to-One associations** such as **User** and **UserPreferences**.
