---
title: "Spring Boot + jOOQ Tutorial - 1 : Getting Started"
author: Siva
images: ["/preview-images/spring-boot-jooq-tutorial-part-1.webp"]
type: post
draft: false
date: 2023-10-12T06:00:00+05:30
url: /spring-boot-jooq-tutorial-getting-started
toc: true
categories: ["jOOQ"]
tags: [SpringBoot, jOOQ]
description: In this tutorial, we will learn how to get started with jOOQ for implementing persistence layer in a Spring Boot application.
---
[jOOQ](https://www.jooq.org/) is a Java persistence library that provides SQL DSL for writing typesafe SQL queries. 
It supports most of the popular databases like **MySQL**, **PostgreSQL**, **Oracle**, **SQL Server**, and many more. 
In this tutorial, we will learn how to get started with jOOQ for implementing persistence layer in a Spring Boot application.
You can also use jOOQ in other JVM based languages like **Kotlin**, **Scala**, etc.

* [jOOQ Tutorial - 1 : Getting Started]({{< relref "2023-10-12-spring-boot-jooq-tutorial-part-1.md" >}})
* [jOOQ Tutorial - 2 : Implementing CRUD Operations]({{< relref "2023-10-16-spring-boot-jooq-tutorial-part-2.md" >}})
* [jOOQ Tutorial - 3 : Fetching One-to-One Relationships]({{< relref "2023-10-19-spring-boot-jooq-tutorial-part-3.md" >}})
* [jOOQ Tutorial - 4 : Fetching One-to-Many Relationships]({{< relref "2023-10-23-spring-boot-jooq-tutorial-part-4.md" >}})
* [jOOQ Tutorial - 5 : Fetching Many-to-Many Relationships]({{< relref "2023-10-26-spring-boot-jooq-tutorial-part-5.md" >}})

In this jOOQ tutorial series, you will learn how to use jOOQ in a Spring Boot application for implementing:
* **Basic CRUD Operations**
* **Loading One-to-One Relationships**
* **Loading One-to-Many Relationships**
* **Loading Many-to-Many Relationships**

{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub:
https://github.com/sivaprasadreddy/spring-boot-jooq-demo
{{< /box >}}

## Prerequisites
* Install JDK 17 or later
* Install any container runtime like **Docker Desktop**, **OrbStack**, etc.
 
**NOTE:** **jOOQ** doesn't require Docker. 
But, we will use to use [Testcontainers](https://testcontainers.com/) for jOOQ code generation and testing, which needs a container runtime.

## Sample Database
We will use the following sample database for this tutorial.

{{< figure src="/images/jooq-demo-db.webp" >}}

## Create a Spring Boot Project
Let's create a Spring Boot project using [Spring Initializr](https://start.spring.io/) by selecting the starters
**JOOQ Access Layer**, **Flyway Migration**, **PostgreSQL Driver** and **Testcontainers**.

You can click on this [link](https://start.spring.io/#!type=maven-project&language=java&packaging=jar&jvmVersion=17&groupId=com.sivalabs&artifactId=spring-boot-jooq-demo&name=spring-boot-jooq-demo&packageName=com.sivalabs.bookmarks&dependencies=flyway,postgresql,testcontainers,jooq) to create a project with the required dependencies.

### Add Flyway Migration Scripts
We will use [Flyway](https://flywaydb.org/) for database schema migration.
Let's add the following SQL scripts under the **src/main/resources/db/migration** directory.

**V1__create_tables.sql**
```sql
CREATE TABLE user_preferences
(
    id         bigserial primary key,
    theme      varchar(255),
    language   varchar(255),
    created_at timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);

CREATE TABLE users
(
    id             bigserial primary key,
    name           varchar(255) not null,
    email          varchar(255) not null,
    password       varchar(255) not null,
    preferences_id bigint REFERENCES user_preferences (id),
    created_at     timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at     timestamp with time zone,
    CONSTRAINT user_email_unique UNIQUE (email)
);

CREATE TABLE bookmarks
(
    id         bigserial primary key,
    url        varchar(1024) not null,
    title      varchar(1024),
    created_by bigint        not null REFERENCES users (id),
    created_at timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone
);

CREATE TABLE tags
(
    id         bigserial primary key,
    name       varchar(100) not null,
    created_at timestamp with time zone default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    CONSTRAINT tag_name_unique UNIQUE (name)
);

CREATE TABLE bookmark_tag
(
    bookmark_id bigint not null REFERENCES bookmarks (id),
    tag_id      bigint not null REFERENCES tags (id)
);

ALTER SEQUENCE user_preferences_id_seq RESTART WITH 101;
ALTER SEQUENCE users_id_seq RESTART WITH 101;
ALTER SEQUENCE bookmarks_id_seq RESTART WITH 101;
ALTER SEQUENCE tags_id_seq RESTART WITH 101;
```

We are altering the sequences to start with 101, so that we can insert some test data with ids 1, 2, 3, etc.

## Using jOOQ to execute native SQL queries
When we add jOOQ starter, Spring Boot autoconfigures the jOOQ's **DSLContext** as a bean.
We can use the **DSLContext** bean to execute native SQL queries.

Let's create **UserRepository** class as follows:

```java
package com.sivalabs.bookmarks.repositories;

import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Repository;

@Repository
class UserRepository {
    private final DSLContext dsl;

    UserRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public String findUserNameById(Long id) {
        Record record =
                dsl.resultQuery("select * from users where id = ?", id)
                   .fetchOptional().orElseThrow();
        System.out.println(record);
        Object name = record.get("name");
        return (String) name;
    }
}
```

Before writing test, let's create an SQL script to add some test data to the database.

**src/test/resources/test-data.sql**

```sql
DELETE FROM bookmark_tag;
DELETE FROM bookmarks;
DELETE FROM tags;
DELETE FROM users;
DELETE FROM user_preferences;

INSERT INTO user_preferences (id, theme, language) VALUES
(1, 'Light', 'EN'),
(2, 'Dark', 'EN')
;

INSERT INTO users (id, email, password, name, preferences_id) VALUES
(1, 'admin@gmail.com', 'admin', 'Admin', 2),
(2, 'siva@gmail.com', 'siva', 'Siva', 1)
;

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
       (2, 2)
;
```

Let's create a simple test case to verify the above code.

```java
package com.sivalabs.bookmarks.repositories;

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

    @Container
    @ServiceConnection
    static final PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @Autowired
    UserRepository userRepository;

    @Test
    void findUserNameById() {
        String username = userRepository.findUserNameById(1L);
        assertThat(username).isEqualTo("Admin");
    }
}
```

We are using **@JooqTest** slice test annotation to test our repository class.
We are using **@Testcontainers** and **@Container** annotations to start a PostgreSQL database and 
registering the DataSource properties using [ServiceConnection](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.testing.testcontainers.service-connections) support.
Also, we are executing the **test-data.sql** script using **@Sql** annotation.

In our test, we are simply calling **userRepository.findUserNameById(1L)** and verifying the result.

{{< box tip >}}
**Logging SQL queries executed by jOOQ**

You can enable logging of SQL queries executed by jOOQ by adding the following property to **application.properties** file.

**logging.level.org.jooq.tools.LoggerListener=DEBUG**
{{< /box >}}

When we printed the jOOQ Record, we can see the following nicely formatted output in the console:

```shell
+----+-----+---------------+--------+--------------+--------------------------------+----------+
|  id|name |email          |password|preferences_id|created_at                      |updated_at|
+----+-----+---------------+--------+--------------+--------------------------------+----------+
|   1|Admin|admin@gmail.com|admin   |             1|2023-10-12T11:01:58.471277+05:30|{null}    |
+----+-----+---------------+--------+--------------+--------------------------------+----------+
```

So, we can use jOOQ to run native queries.

But, in the current implementation, you won't get any compilation error if you pass some string as **"id"** value. 
Also, you are getting the **"name"** value as **Object** type, and you need to convert it to desired type **String**.

This is where jOOQ's **Typesafe DSL** comes into the picture.
In order to use jOOQ Typesafe DSL, first we need to generate the jOOQ classes from our database schema.

## jOOQ Code Generation
We can use the [jOOQ Code Generation](https://www.jooq.org/doc/latest/manual/code-generation/) tool to generate the jOOQ classes from our database schema.
But to use the jOOQ Code Generation tool, we need to have an existing database up and running.

We can use the [Testcontainers](https://www.testcontainers.org/) to start a PostgreSQL database container and 
then we can use the jOOQ Code Generation tool to generate the jOOQ classes. 

There is [testcontainers-jooq-codegen-maven-plugin](https://github.com/testcontainers/testcontainers-jooq-codegen-maven-plugin) 
which can start a database container, run Flyway migrations and then generate jOOQ code.

Let's configure the **testcontainers-jooq-codegen-maven-plugin** in our **pom.xml** file as follows:

```xml
<properties>
    <testcontainers.version>1.19.1</testcontainers.version>
    <tc-jooq-codegen-plugin.version>0.0.3</tc-jooq-codegen-plugin.version>
</properties>

<build>
    <plugins>
        <plugin>
            <groupId>org.testcontainers</groupId>
            <artifactId>testcontainers-jooq-codegen-maven-plugin</artifactId>
            <version>${tc-jooq-codegen-plugin.version}</version>
            <dependencies>
                <dependency>
                    <groupId>org.testcontainers</groupId>
                    <artifactId>postgresql</artifactId>
                    <version>${testcontainers.version}</version>
                </dependency>
                <dependency>
                    <groupId>org.postgresql</groupId>
                    <artifactId>postgresql</artifactId>
                    <version>${postgresql.version}</version>
                </dependency>
            </dependencies>
            <executions>
                <execution>
                    <id>generate-jooq-sources</id>
                    <goals>
                        <goal>generate</goal>
                    </goals>
                    <phase>generate-sources</phase>
                    <configuration>
                        <database>
                            <type>POSTGRES</type>
                            <containerImage>postgres:16-alpine</containerImage>
                        </database>
                        <flyway>
                            <locations>
                                filesystem:${project.basedir}/src/main/resources/db/migration
                            </locations>
                        </flyway>
                        <jooq>
                            <generator>
                                <generate>
                                    <javaTimeTypes>true</javaTimeTypes>
                                </generate>
                                <database>
                                    <inputSchema>public</inputSchema>
                                    <includes>.*</includes>
                                    <excludes>
                                        flyway_schema_history
                                    </excludes>
                                </database>
                                <target>
                                    <clean>true</clean>
                                    <packageName>com.sivalabs.bookmarks.jooq</packageName>
                                    <directory>src/main/jooq</directory>
                                </target>
                            </generator>
                        </jooq>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>build-helper-maven-plugin</artifactId>
            <executions>
                <execution>
                    <phase>generate-sources</phase>
                    <goals>
                        <goal>add-source</goal>
                    </goals>
                    <configuration>
                        <sources>
                            <source>src/main/jooq</source>
                        </sources>
                    </configuration>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

We have configured the **testcontainers-jooq-codegen-maven-plugin** to generate jOOQ code in the **src/main/jooq** directory.
Then we have used the **build-helper-maven-plugin** to add the **src/main/jooq** directory as a source directory.

{{< box info >}}
**Should I check-in generated jOOQ code?**

You can also generate code in the **target/generated-sources/jooq** directory which will be automatically added as a source by Maven.
Then you don't need to use the **build-helper-maven-plugin**.

But, I personally prefer to generate code in the **src/main/jooq** directory and check-in the generated code into the source control.
{{< /box >}}

Now we can run the following command to generate the jOOQ code.

```shell
$ ./mvnw clean generate-sources
```

## Using jOOQ Typesafe DSL
Now let's rewrite our **UserRepository** class to use jOOQ Typesafe DSL.

```java
package com.sivalabs.bookmarks.repositories;

import com.sivalabs.bookmarks.jooq.tables.records.UsersRecord;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import static com.sivalabs.bookmarks.jooq.tables.Users.USERS;

@Repository
class UserRepository {
    private final DSLContext dsl;

    UserRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    public String findUserNameById(Long id) {
        UsersRecord usersRecord = dsl.selectFrom(USERS)
                .where(USERS.ID.eq(id))
                .fetchOptional().orElseThrow();
        return usersRecord.getName();
    }
}
```

As you can see, we are using the **UsersRecord** class generated by the jOOQ Code Generation tool.
Now, we will get a compilation error if we pass any other type than **Long** for the **"id"** parameter.
Also, we are getting the **"name"** value as **String** type.

So, jOOQ typesafe DSL is very useful for writing typesafe SQL queries.

## Conclusion
In this first part, we have set the stage for exploring jOOQ.
In the next part, we will learn how to implement basic CRUD operations using jOOQ.
