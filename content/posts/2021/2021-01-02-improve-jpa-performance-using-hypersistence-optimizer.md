---
title: Improve JPA application performance using HypersistenceOptimizer
author: Siva
images: ["/preview-images/hypersistence-optimizer.webp"]
type: post
draft: false
date: 2021-01-02T04:59:17+05:30
url: /2021/01/improve-jpa-performance-using-hypersistence-optimizer/
categories: [Java]
tags: [JPA, Hibernate]
---

In Java world, [Hibernate/JPA](https://hibernate.org/) is the most popular ORM framework. 
Also, JPA/Hibernate is a [very controversial topic](https://www.reddit.com/r/java/comments/5nz5nq/reasons_jpa_and_hibernate_should_be_phased_out/) 
because [some people](https://www.reddit.com/r/java/comments/53p253/how_hibernate_almost_ruined_my_career/) [don't like](https://www.reddit.com/r/java/comments/6prjad/java_shower_thoughts_when_people_say_high/) it at all.
It is very understandable though. 

Many people start using JPA/Hibernate with minimal knowledge and keep adding logic (read as "annotations") as and when required to get the job done.
While checking the overall application performance, most of the time people realize it's because of poor performance of persistence layer. 

Some people simply blame Hibernate saying it's generating/executing too many unoptimised queries. 
Some people try to learn JPA/Hibernate a little more to optimize their code and overwhelmed by the sheer volume of things to know in order to properly use JPA/Hibernate. 

After using ORM frameworks like JPA/Hibernate and SQL oriented persistence frameworks like [MyBatis](https://mybatis.org/mybatis-3/) over a decade this is how I felt about JPA/Hibernate.

{{< tweet 1337038528723578880 >}}

Compared to JPA/Hibernate, the SQL oriented frameworks like [MyBatis](https://mybatis.org/mybatis-3/), [JOOQ](https://www.jooq.org/) may need more coding effort.
However, we have full control over what queries we want to execute, easy to understand what is going on and less time in debugging.

On the other hand, JPA/Hibernate provides lots of features but requires a significant amount of time to learn in order to efficiently use it.
It is very easy to shoot yourself in the foot with JPA. 
Just make child collection fetch strategy as **EAGER** to fix **LazyLoadingException** (like many newbies do), 
use **List** instead of **Set** and try to add/remove one element from collection and see the number of SQL queries generated.

Not only this, you need to understand **ID Generator Strategies**, **Mapping strategies**, **JPQL**, **Join Strategies**, **Batch Operations**, **LockModes** etc to properly use JPA/Hibernate.
Mastering JPA/Hibernate is definitely not an easy task and takes significant time and requires assistance from experts.
But, there is a tremendous reward for learning all these concepts which is **ultra productivity with minimal code**.

## Introducing Hypersistence Optimizer
Anybody working with JPA/Hibernate surely end up spending good amount of time on https://vladmihalcea.com/ blog which is One Stop Shop for anything related JPA/Hibernate.
[Vlad Mihalcea](https://twitter.com/vlad_mihalcea) built a product called [Hypersistence Optimizer](https://vladmihalcea.com/hypersistence-optimizer/) to provide "Expert's Assistance" for any JPA/Hibernate related issues.

Basically, Hypersistence Optimizer profiles your JPA/Hibernate code and give you a report of issues.
Not just reporting issues, but also explain what is the issue and how to fix it.

Let's see how to use HypersistenceOptimizer in a SpringBoot application.

You can get trial version or buy full version of HypersistenceOptimizer at https://vladmihalcea.com/hypersistence-optimizer/.
You can follow the [Installation Guide](https://vladmihalcea.com/hypersistence-optimizer/docs/installation-guide/) to setup HypersistenceOptimizer depending on your application type.

For a simple SpringBoot application we can setup as follows:

* Configure dependencies

**build.gradle**

```groovy
implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
runtimeOnly 'com.h2database:h2'
implementation "io.hypersistence:hypersistence-optimizer:2.2.0"
```

**pom.xml**
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.h2database</groupId>
        <artifactId>h2</artifactId>
    </dependency>
    <dependency>
        <groupId>io.hypersistence</groupId>
        <artifactId>hypersistence-optimizer</artifactId>
        <version>2.2.0</version>
    </dependency>
</dependencies>
```

* Copy `hypersistence-optimizer-2.2.0/config/META-INF` folder into your project `src/test/resources` folder.

* Configure `HypersistenceOptimizer` in your test config code`(src/test/java)`. 
  
```java
package com.sivalabs.devzone;

import io.hypersistence.optimizer.HypersistenceOptimizer;
import io.hypersistence.optimizer.core.config.JpaConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManagerFactory;

@Configuration
public class HypersistenceConfiguration {
    @Bean
    public HypersistenceOptimizer hypersistenceOptimizer(EntityManagerFactory entityManagerFactory) {
        return new HypersistenceOptimizer(new JpaConfig(entityManagerFactory));
    }
}
```

* Configure following in your `logback.xml`

```xml
<logger name="Hypersistence Optimizer" level="info"/>
```

* Write test

```java
package com.sivalabs.devzone;

import com.sivalabs.devzone.domain.models.LinksDTO;
import com.sivalabs.devzone.domain.services.LinkService;
import io.hypersistence.optimizer.HypersistenceOptimizer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class ApplicationTest {
    @Autowired
    private HypersistenceOptimizer hypersistenceOptimizer;

    @Autowired
    private LinkService linkService;

    @Test
    void shouldReturnPagedLinks() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "createdAt"));
        LinksDTO linksDTO = linkService.getAllLinks(pageable);
        assertThat(linksDTO.getData()).isNotEmpty();
    }

    @AfterEach
    void afterEach() {
        assertTrue(hypersistenceOptimizer.getEvents().isEmpty());
    }
}
```

Here the key part is, after each test we are verifying whether there are any issues found by HypersistenceOptimizer and make sure no issues found.

For example, let's assume we have a JPA entity with an enum as follows:

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
}
```

When you run the test you can see the following info in log and test will fail.

```
2021-01-02 12:18:53.127  WARN 49626 --- [    Test worker] Hypersistence Optimizer                  : MAJOR - EnumTypeStringEvent - The [role] enum attribute in the [com.sivalabs.devzone.domain.entities.User] entity uses the EnumType.STRING strategy, which has a bigger memory footprint than EnumType.ORDINAL. For more info about this event, check out this User Guide link - https://vladmihalcea.com/hypersistence-optimizer/docs/user-guide/#EnumTypeStringEvent
2021-01-02 12:18:53.151  INFO 49626 --- [    Test worker] org.hibernate.dialect.Dialect            : HHH000400: Using dialect: org.hibernate.dialect.H2Dialect
2021-01-02 12:18:53.163  WARN 49626 --- [    Test worker] Hypersistence Optimizer                  : 1 issues were found: 0 BLOCKER, 0 CRITICAL, 1 MAJOR, 0 MINOR
```

You can see that Hypersistence Optimizer found an issue with our Entity mappings and gives us the link https://vladmihalcea.com/hypersistence-optimizer/docs/user-guide/#EnumTypeStringEvent to know more about the issue 

>    ### EnumTypeStringEvent
>    The Java Enum can be mapped in two ways with JPA and Hibernate. By default, the Enum ordinal is used to materialize the Enum value in the database. However, to make it more readable, some developers choose to store the Enum name instead, which has a higher memory and disk footprint.
>    For more details about this topic, check out [this article](https://vladmihalcea.com/the-best-way-to-map-an-enum-type-with-jpa-and-hibernate/).

This is the pattern you will notice while using Hypersistence Optimizer. 

**You run the tests, Hypersistence Optimizer will detect if there are any issues and gives a brief description what is the issue and why it is an issue.
Then one of Vlad's blog post is linked to show you how to resolve that issue. Rinse and repeat.**

After using Hypersistence Optimizer for a couple of weeks this is how I feel about working with JPA and Hypersistence Optimizer.

{{< tweet 1337374516511559681 >}}

## Summary

While we enjoy so many open source frameworks and libraries for free, we should realize cost vs effort impact on software delivery.
On any given day I would suggest going with an off the shelf Security solution like [Okta](https://www.okta.com/), [Keycloak](https://www.keycloak.org/) etc rather than building your own OAuth Security solution.
It is wise for a company to buy a licence for the IDE if it drastically increases developer productivity.

In the same way, I would strongly suggest getting a Hypersistence Optimizer licence if you are building a JPA based application and performance is a key success factor.
While using Hypersistence Optimizer you not only fix your application issues but also gradually become a master of JPA/Hibernate itself.
Thanks Vlad for building such an awesome product and "Developer Experience" of using Hypersistence Optimizer is just amazing.
