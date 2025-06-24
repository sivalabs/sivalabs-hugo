---
title: "Spring Boot Flyway Database Migration Tutorial"
author: Siva
images: ["/preview-images/spring-boot-flyway-tutorial.webp"]
type: post
draft: false
date: 2023-08-08T06:00:00+05:30
url: /spring-boot-flyway-database-migration-tutorial
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
description: In this tutorial, you will learn how to use Flyway for performing database migrations in Spring Boot applications.
---

In the previous [Spring Boot JdbcTemplate Tutorial]({{< relref "06-spring-boot-jdbctemplate-tutorial.md" >}}) 
we have seen how to initialize database using **schema.sql** and **data.sql** scripts.
This may be useful for demos and quick prototypes, but for real world applications we should use a database migration tool.

<!--more-->


[Flyway](https://flywaydb.org/) is one of the most popular Java-based database migration libraries.
Database migrations can be performed using Flyway as a standalone library, 
using [flyway-maven-plugin](https://documentation.red-gate.com/fd/maven-goal-184127408.html) 
or using [Flyway Gradle plugin](https://documentation.red-gate.com/fd/gradle-task-184127407.html).

Spring Boot provides out-of-the-box support for Flyway database migrations.
Let us see how we can create a Spring Boot application using Spring Data JPA to interact with PostgreSQL database and 
Flyway for implementing database migrations.

First, go to https://start.spring.io/ and create a Spring Boot application by selecting **Spring Web**, 
**Spring Data JPA**, **PostgreSQL Driver**, **Flyway Migration**, and **Testcontainers** starters.

## Create Flyway Migration Scripts
Flyway follows the **V&lt;VERSION&gt;__&lt;DESCRIPTION&gt;.sql** naming convention for its versioned migration scripts.
Let's add the following two migration scripts under **src/main/resources/db/migration** folder. 

**V1__create_tables.sql**
```sql
create table bookmarks
(
    id         bigserial not null,
    title      varchar   not null,
    url        varchar   not null,
    created_at timestamp,
    primary key (id)
);
```


**V2__create_bookmarks_indexes.sql**
```sql
CREATE INDEX idx_bookmarks_title ON bookmarks(title);
```

## Setup Postgres Database using Testcontainers
Spring Boot 3.1.0 introduced support for [Testcontainers](https://testcontainers.com/) which we can use for writing integration tests 
and for local development also.

While generating the application, we have selected **PostgreSQL Driver**, and **Testcontainers** starters.
So, the generated application will have a **TestApplication.java** under **src/test/java/** similar to the following:

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
public class TestApplication {

  @Bean
  @ServiceConnection
  PostgreSQLContainer<?> postgresContainer() {
    return new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"));
  }

  public static void main(String[] args) {
    SpringApplication
            .from(Application::main)
            .with(TestApplication.class)
            .run(args);
  }
}
```

## Executing Flyway Migrations

Now you can run the **TestApplication** class from your IDE or run **./mvnw spring-boot:test-run** from the command line to start the application.
Then you should notice the following Flyway execution related logs as follows:

```shell
INFO 4009 --- [           main] tc.postgres:15-alpine                    : Container is started (JDBC URL: jdbc:postgresql://127.0.0.1:33331/test?loggerLevel=OFF)
INFO 4009 --- [           main] o.f.c.internal.license.VersionPrinter    : Flyway Community Edition 9.16.3 by Redgate
INFO 4009 --- [           main] o.f.c.internal.license.VersionPrinter    : See release notes here: https://rd.gt/416ObMi
INFO 4009 --- [           main] o.f.c.internal.license.VersionPrinter    : 
INFO 4009 --- [           main] o.f.c.i.database.base.BaseDatabaseType   : Database: jdbc:postgresql://127.0.0.1:33331/test (PostgreSQL 15.3)
INFO 4009 --- [           main] o.f.c.i.s.JdbcTableSchemaHistory         : Schema history table "public"."flyway_schema_history" does not exist yet
INFO 4009 --- [           main] o.f.core.internal.command.DbValidate     : Successfully validated 2 migrations (execution time 00:00.010s)
INFO 4009 --- [           main] o.f.c.i.s.JdbcTableSchemaHistory         : Creating Schema History table "public"."flyway_schema_history" ...
INFO 4009 --- [           main] o.f.core.internal.command.DbMigrate      : Current version of schema "public": << Empty Schema >>
INFO 4009 --- [           main] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "1 - create tables"
INFO 4009 --- [           main] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "2 - create bookmarks indexes"
INFO 4009 --- [           main] o.f.core.internal.command.DbMigrate      : Successfully applied 2 migrations to schema "public", now at version v2 (execution time 00:00.041s)
```

Flyway keeps track of all the applied migrations history in **flyway_schema_history** table by default.
If you check the data in **flyway_schema_history** table now, you can see the following rows:

```shell
| installed_rank | version | description              | type | script                           | checksum   | installed_by | installed_on               | execution_time | success |
|:---------------|:--------|:-------------------------|:-----|:---------------------------------|:-----------|:-------------|:---------------------------|:---------------|:--------|
| 1              | 1       | create tables            | SQL  | V1__create_tables.sql            | 1020037327 | test         | 2023-08-09 09:13:04.439012 | 6              | true    |
| 2              | 2       | create bookmarks indexes | SQL  | V2__create_bookmarks_indexes.sql | 732086927  | test         | 2023-08-09 09:13:04.456876 | 4              | true    |
```

If you keep the same database instance running and restart the application, then Flyway doesn't re-run the already applied migrations.
If you have added any new migrations, then only those migration scripts will be executed.

{{< box warning >}}
**Flyway Rules**

The following rules must be followed, otherwise Flyway will throw error while applying migrations:

* There should be no duplicate version numbers in flyway migration script file names. 
   
   Ex: **V1__init.sql**, **V1__indexes.sql**. Here version number 1 is used multiple times.
* Once a migration is applied, you should not change it's content.
{{< /box >}}

## Customizing Flyway Configuration
Spring Boot provides sensible defaults for Flyway migrations, 
but you can configure various Flyway configuration properties 
using **spring.flyway.{property-name}** properties in **application.properties** file.

### Flyway migrations for different databases
If you are building a product which can be used with different databases, then you can configure flyway migration locations as follows:

```properties
spring.flyway.locations=classpath:db/migration/{vendor}
```

Then you can place **mysql** specific scripts under **src/main/resources/db/migration/mysql** directory,
**postgresql** specific scripts under **src/main/resources/db/migration/postgresql**, etc.
You can check the vendor names in **org.springframework.boot.jdbc.DatabaseDriver** class.

In addition to this, some interesting flyway configuration properties are:

```properties
# disable flyway execution
spring.flyway.enabled=false

# If you have an existing database and start using Flyway for new database changes.
spring.flyway.baseline-on-migrate=true

# To customize flyway migrations tracking table name
spring.flyway.table=db_migrations

# In case of any flyway execution errors, clean up the database and re-run all the migrations
## NEVER USE THIS IN PRODUCTION. ONLY SUITABLE FOR PROTOTYPING
spring.flyway.clean-disabled=false
spring.flyway.clean-on-validation-error=true
```

## Java based Flyway Migrations
In addition to SQL scripts, you can also write database migrations using Java classes.
You can create **V3__InsertSampleData.java** in **db.migration** package as follows:

```java
package db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.SingleConnectionDataSource;

public class V3__InsertSampleData extends BaseJavaMigration {

  public void migrate(Context context) {
      JdbcTemplate jdbcTemplate = new JdbcTemplate(
        new SingleConnectionDataSource(context.getConnection(), true));
      
      Long userId = jdbcTemplate.query("...");
      // insert roles for userId
      jdbcTemplate.update("...");
  }
  
}
```

If the database changes involve complex logic which is difficult to write using plain SQL,
then Java based migrations come very handy.

You can use Flyway Database Migrations with different persistence technologies 
such as **JdbcTemplate**, **Spring Data Jdbc**, **Spring Data JPA**, **jOOQ**, etc.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
Spring Boot's out of the box support for Flyway Database Migrations made it really easy to implement 
a production-grade database migration process.

You can find the sample code for this tutorial in this 
[GitHub](https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series/tree/main/spring-boot-flyway-tutorial) repository.
