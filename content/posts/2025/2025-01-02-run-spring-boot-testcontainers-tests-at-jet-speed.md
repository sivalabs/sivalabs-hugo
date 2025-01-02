---
title: "Spring Boot + Testcontainers Tests at Jet Speed"
author: Siva
images: ["/images/springboot-testcontainers-tests-fast.webp"]
type: post
draft: false
date: 2025-01-02T04:59:17+05:30
url: /run-spring-boot-testcontainers-tests-at-jet-speed
toc: true
categories: [SpringBoot]
tags: [SpringBoot, Testcontainers]
---

Spring Boot 3.1.0 introduced [support for Testcontainers](https://docs.spring.io/spring-boot/reference/testing/testcontainers.html) 
to simplify local development and testing. 
[Testcontainers](https://testcontainers.com/) helps in writing tests using real dependencies instead of mocks, but it may also increase the test execution time.

In this article, I will share some insights on **how to reduce test execution time while using Testcontainers**.

## Sample Spring Boot application
Let's assume you have created a Spring Boot project using [Spring Initializr](https://start.spring.io/#!type=maven-project&dependencies=web,data-jpa,flyway,testcontainers,postgresql) 
by selecting **Spring Web**, **Spring Data JPA**, **PostgreSQL**, **Flyway** and **Testcontainers**.

And, assume that you have implemented two API endpoints **GET /api/bookmarks** and **GET /api/users** by creating the following components:

**Bookmark JPA entity**

```java
@Entity
@Table(name = "bookmarks")
public class Bookmark {
    @Id
    private Long id;
    private String title;
    private String url;
    // code omitted for brevity
}
```

**BookmarkRepository (Spring Data JPA Repository)**

```java
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
  List<Bookmark> findAllByOrderByCreatedAtDesc();
}
```

**BookmarkController**

```java
@RestController
@RequestMapping("/api/bookmarks")
class BookmarkController {
    private final BookmarkRepository bookmarkRepository;
    BookmarkController(BookmarkRepository bookmarkRepository) {
        this.bookmarkRepository = bookmarkRepository;
    }

    @GetMapping
    List<Bookmark> getBookmarks() {
        return bookmarkRepository.findAllByOrderByCreatedAtDesc();
    }
}
```

**User JPA entity**

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    private Long id;
    private String name;
    private String email;
    // code omitted for brevity
}
```

**UserRepository (Spring Data JPA Repository)**

```java
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByOrderByNameAsc();
}
```

**UserController**

```java
@RestController
@RequestMapping("/api/users")
class UserController {
    private final UserRepository userRepository;
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    List<User> list() {
        return userRepository.findAllByOrderByNameAsc();
    }
}
```

We would like to write tests for:

* Testing the custom methods in repositories 
* Testing end-to-end APIs 

Now, let's explore different ways of writing tests using Testcontainers and understand the pros and cons of each approach.

## Inefficient use of ServiceConnection support

The Spring Boot's **@ServiceConnection** support simplifies registering the container connection properties obtained from 
the containers spun up by Testcontainers.

We can write four test classes using **@ServiceConnection** support as follows.

**BookmarkRepositoryTest.java**

```java
@DataJpaTest
@Testcontainers
class BookmarkRepositoryTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));

    @Autowired
    BookmarkRepository bookmarkRepository;

    @BeforeEach
    void setUp() {
        bookmarkRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllBookmarksOrderByCreatedAtDesc() {
        bookmarkRepository.save(new Bookmark("JetBrains Blog","https://blog.jetbrains.com"));
        bookmarkRepository.save(new Bookmark("IntelliJ IDEA Blog","https://blog.jetbrains.com/idea/"));

        List<Bookmark> bookmarks = bookmarkRepository.findAllByOrderByCreatedAtDesc();

        assertThat(bookmarks).hasSize(2);
        assertThat(bookmarks.get(0).getTitle()).isEqualTo("IntelliJ IDEA Blog");
        assertThat(bookmarks.get(1).getTitle()).isEqualTo("JetBrains Blog");
    }
}
```

**BookmarkControllerTest.java**

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class BookmarkControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @BeforeEach
    void setUp() {
        bookmarkRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllBookmarks() {
        bookmarkRepository.save(new Bookmark("JetBrains Blog","https://blog.jetbrains.com"));
        bookmarkRepository.save(new Bookmark("IntelliJ IDEA Blog","https://blog.jetbrains.com/idea/"));

        Bookmark[] bookmarks = restTemplate.getForObject("/api/bookmarks", Bookmark[].class);

        assertThat(bookmarks.length).isEqualTo(2);
        assertThat(bookmarks[0].getTitle()).isEqualTo("IntelliJ IDEA Blog");
        assertThat(bookmarks[1].getTitle()).isEqualTo("JetBrains Blog");
    }
}
```

**UserRepositoryTest.java**

```java
@DataJpaTest
@Testcontainers
class UserRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllUsersOrderByNameAsc() {
        userRepository.save(new User("Paul","paul@gmail.com"));
        userRepository.save(new User("John","john@gmail.com"));

        List<User> users = userRepository.findAllByOrderByNameAsc();

        assertThat(users).hasSize(2);
        assertThat(users.get(0).getName()).isEqualTo("John");
        assertThat(users.get(1).getName()).isEqualTo("Paul");
    }
}
```

**UserControllerTest.java**

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Testcontainers
class UserControllerTest {
    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllUsers() {
        userRepository.save(new User("Paul","paul@gmail.com"));
        userRepository.save(new User("John","john@gmail.com"));
        User[] users = restTemplate.getForObject("/api/users", User[].class);

        assertThat(users).hasSize(2);
        assertThat(users[0].getName()).isEqualTo("John");
        assertThat(users[1].getName()).isEqualTo("Paul");
    }
}
```

Each test class defines the **PostgreSQLContainer** and uses **@Testcontainers**, **@Container** and **@ServiceConnection** 
annotations to start a PostgreSQL container and register the datasource properties pointing to that database container.

Now if you run all the tests from console using **./mvnw test** you will see output similar to the following:

```shell
....
....
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.jetbrains.bookmarks.UserControllerTest
11:45:32.545 [main] INFO org.springframework.test.context.support.AnnotationConfigContextLoaderUtils -- Could not detect default configuration classes for test class [com.jetbrains.bookmarks.UserControllerTest]: UserControllerTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
11:45:32.567 [main] INFO org.testcontainers.images.PullPolicy -- Image pull policy will be performed by: DefaultPullPolicy()
11:45:32.567 [main] INFO org.testcontainers.utility.ImageNameSubstitutor -- Image name substitution will be performed by: DefaultImageNameSubstitutor (composite of 'ConfigurationFileImageNameSubstitutor' and 'PrefixingImageNameSubstitutor')
11:45:32.585 [main] INFO org.testcontainers.DockerClientFactory -- Testcontainers version: 1.20.4
11:45:32.668 [main] INFO org.testcontainers.dockerclient.DockerClientProviderStrategy -- Loaded org.testcontainers.dockerclient.UnixSocketClientProviderStrategy from ~/.testcontainers.properties, will try it first
11:45:32.771 [main] INFO org.testcontainers.dockerclient.DockerClientProviderStrategy -- Found Docker environment with local Unix socket (unix:///var/run/docker.sock)
11:45:32.772 [main] INFO org.testcontainers.DockerClientFactory -- Docker host IP address is localhost
11:45:32.785 [main] INFO org.testcontainers.DockerClientFactory -- Connected to docker: 
  Server Version: 27.3.1
  API Version: 1.47
  Operating System: OrbStack
  Total Memory: 16032 MB
11:45:32.846 [main] INFO tc.testcontainers/ryuk:0.11.0 -- Creating container for image: testcontainers/ryuk:0.11.0
11:45:32.982 [main] INFO tc.testcontainers/ryuk:0.11.0 -- Container testcontainers/ryuk:0.11.0 is starting: 9b677f097ae41635e81a77a47d20e8ef1ced81738dfe7f92e5bb600c7127b8ad
11:45:33.174 [main] INFO tc.testcontainers/ryuk:0.11.0 -- Container testcontainers/ryuk:0.11.0 started in PT0.327729S
11:45:33.177 [main] INFO org.testcontainers.utility.RyukResourceReaper -- Ryuk started - will monitor and terminate Testcontainers containers on JVM exit
11:45:33.177 [main] INFO org.testcontainers.DockerClientFactory -- Checking the system...
11:45:33.177 [main] INFO org.testcontainers.DockerClientFactory -- ✔︎ Docker server version should be at least 1.6.0
11:45:33.226 [main] INFO org.springframework.boot.test.context.SpringBootTestContextBootstrapper -- Found @SpringBootConfiguration com.jetbrains.bookmarks.BookmarksApplication for test class com.jetbrains.bookmarks.UserControllerTest
11:45:33.258 [main] INFO tc.postgres:17 -- Creating container for image: postgres:17
11:45:33.299 [main] INFO tc.postgres:17 -- Container postgres:17 is starting: ea792d9e7384db1e76a3a02d3e29e5a1001cc93dd42ef9135da05d8a46ea5015
11:45:34.433 [main] INFO tc.postgres:17 -- Container postgres:17 started in PT1.175057S
11:45:34.435 [main] INFO tc.postgres:17 -- Container is started (JDBC URL: jdbc:postgresql://localhost:33247/test?loggerLevel=OFF)
...
...
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.383 s -- in com.jetbrains.bookmarks.UserControllerTest
[INFO] Running com.jetbrains.bookmarks.BookmarkRepositoryTest
2025-01-02T11:45:36.871+05:30  INFO 43508 --- [bookmarks] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.jetbrains.bookmarks.BookmarkRepositoryTest]: BookmarkRepositoryTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2025-01-02T11:45:36.882+05:30  INFO 43508 --- [bookmarks] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.jetbrains.bookmarks.BookmarksApplication for test class com.jetbrains.bookmarks.BookmarkRepositoryTest
2025-01-02T11:45:36.883+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Creating container for image: postgres:17
2025-01-02T11:45:36.926+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Container postgres:17 is starting: 7036d558b85bc7461b3c6e13ce8854cc51f9f1454c2de050ea0b8eef97cc23b2
2025-01-02T11:45:37.586+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Container postgres:17 started in PT0.70296S
....
....
[INFO] Running com.jetbrains.bookmarks.BookmarkControllerTest
2025-01-02T11:45:38.031+05:30  INFO 43508 --- [bookmarks] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.jetbrains.bookmarks.BookmarkControllerTest]: BookmarkControllerTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2025-01-02T11:45:38.034+05:30  INFO 43508 --- [bookmarks] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.jetbrains.bookmarks.BookmarksApplication for test class com.jetbrains.bookmarks.BookmarkControllerTest
2025-01-02T11:45:38.035+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Creating container for image: postgres:17
2025-01-02T11:45:38.075+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Container postgres:17 is starting: 8ad96e283aedbfacef546788a070c1d993f105b55fdc25191a89451d5bf86c15
2025-01-02T11:45:39.218+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Container postgres:17 started in PT1.183377S
...
...
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.673 s -- in com.jetbrains.bookmarks.BookmarkControllerTest
[INFO] Running com.jetbrains.bookmarks.UserRepositoryTest
2025-01-02T11:45:39.705+05:30  INFO 43508 --- [bookmarks] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.jetbrains.bookmarks.UserRepositoryTest]: UserRepositoryTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2025-01-02T11:45:39.709+05:30  INFO 43508 --- [bookmarks] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.jetbrains.bookmarks.BookmarksApplication for test class com.jetbrains.bookmarks.UserRepositoryTest
2025-01-02T11:45:39.710+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Creating container for image: postgres:17
2025-01-02T11:45:39.753+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Container postgres:17 is starting: 6b7d9471caf985f15e47710b9e4331897a1915a353a3a922f4ec4fd643d1fe30
2025-01-02T11:45:41.102+05:30  INFO 43508 --- [bookmarks] [           main] tc.postgres:17                           : Container postgres:17 started in PT1.392548S
...
...
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.760 s -- in com.jetbrains.bookmarks.UserRepositoryTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
```

**There are few problems with this approach:**

* We are duplicating the container definition inn each class. If we need to upgrade postgresql container version to a newer version, you will need to update in a lot of places.
* If you search for **'Creating container for image: postgres:17'**, you will notice **four** occurrences, meaning each test class spun up a new postgresql docker container.
  As the project grows, there could be 100's of repositories and controllers.
  If a new container is started for every test class, then the test execution will take a very long time.

## Reuse Testcontainers configuration and leverage Spring Test Context cache
When we create the Spring Boot project with PostgreSQL and Testcontainers starters, 
the following **TestcontainersConfiguration** class is also created under **src/test/java**.

**TestcontainersConfiguration.java**

```java
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

	@Bean
	@ServiceConnection
	PostgreSQLContainer<?> postgresContainer() {
		return new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));
	}
}
```

Instead of defining **PostgreSQLContainer** in each test class, we can reuse the container definition in **TestcontainersConfiguration.java** as follows:

**BookmarkRepositoryTest.java**

```java
@DataJpaTest
@Import(TestcontainersConfiguration.class)
class BookmarkRepositoryTest {
    @Autowired
    BookmarkRepository bookmarkRepository;

    @BeforeEach
    void setUp() {
        bookmarkRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllBookmarksOrderByCreatedAtDesc() {
        //...
    }
}
```

**BookmarkControllerTest.java**

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
class BookmarkControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @BeforeEach
    void setUp() {
        bookmarkRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllBookmarks() {
        //...
    }
}
```

**UserRepositoryTest.java**

```java
@DataJpaTest
@Import(TestcontainersConfiguration.class)
class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllUsersOrderByNameAsc() {
        //...
    }
}
```

**UserControllerTest.java**

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
class UserControllerTest {
    @Autowired
    UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAllInBatch();
    }

    @Test
    void shouldGetAllUsers() {
        //...
    }
}
```

In this approach, we avoided duplicating the container definition by importing the same **TestcontainersConfiguration**
using **@Import(TestcontainersConfiguration.class)**.

Now, if you run all the tests again using **./mvnw test**, and search for **Creating container for image: postgres:17**, 
you will see only **two** occurrences of this log statement.

The reason for postgresql container being created only 2 times is [Spring Test Context Caching](https://docs.spring.io/spring-framework/reference/testing/testcontext-framework/ctx-management/caching.html).

We are using the same context configuration for both the controller tests, hence the context created for the first controller test is reused for the second controller test as well.
Similarly, the first repository test will create the context loading all the JPA entities and repositories, and the same context is cached and reused by the second repository test class as well.

You can set the following logging property to see how many contexts have been created.

```properties
logging.level.org.springframework.test.context.cache=debug
```

Now if you run the tests using **./mvnw test**, you can see the following log statements showing how many contexts are created.

```shell
2025-01-02T18:44:40.386+05:30  INFO 7182 --- [bookmarks] [           main] c.j.bookmarks.UserControllerTest         : Started UserControllerTest in 3.766 seconds (process running for 4.253)
2025-01-02T18:44:40.387+05:30 DEBUG 7182 --- [bookmarks] [           main] org.springframework.test.context.cache   : Spring test ApplicationContext cache statistics: [DefaultContextCache@55a4a0ab size = 1, maxSize = 32, parentContextCount = 0, hitCount = 0, missCount = 1, failureCount = 0]
...
...
2025-01-02T18:44:42.551+05:30  INFO 7182 --- [bookmarks] [           main] c.j.bookmarks.BookmarkRepositoryTest     : Started BookmarkRepositoryTest in 1.589 seconds (process running for 6.418)
2025-01-02T18:44:42.551+05:30 DEBUG 7182 --- [bookmarks] [           main] org.springframework.test.context.cache   : Spring test ApplicationContext cache statistics: [DefaultContextCache@55a4a0ab size = 2, maxSize = 32, parentContextCount = 0, hitCount = 14, missCount = 2, failureCount = 0]
...
...
[INFO] Running com.jetbrains.bookmarks.BookmarkControllerTest
2025-01-02T18:44:42.567+05:30  INFO 7182 --- [bookmarks] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.jetbrains.bookmarks.BookmarkControllerTest]: BookmarkControllerTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2025-01-02T18:44:42.569+05:30  INFO 7182 --- [bookmarks] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.jetbrains.bookmarks.BookmarksApplication for test class com.jetbrains.bookmarks.BookmarkControllerTest
2025-01-02T18:44:42.569+05:30 DEBUG 7182 --- [bookmarks] [           main] org.springframework.test.context.cache   : Spring test ApplicationContext cache statistics: [DefaultContextCache@55a4a0ab size = 2, maxSize = 32, parentContextCount = 0, hitCount = 30, missCount = 2, failureCount = 0]
...
...
[INFO] Running com.jetbrains.bookmarks.UserRepositoryTest
2025-01-02T18:44:42.590+05:30  INFO 7182 --- [bookmarks] [           main] t.c.s.AnnotationConfigContextLoaderUtils : Could not detect default configuration classes for test class [com.jetbrains.bookmarks.UserRepositoryTest]: UserRepositoryTest does not declare any static, non-private, non-final, nested classes annotated with @Configuration.
2025-01-02T18:44:42.594+05:30  INFO 7182 --- [bookmarks] [           main] .b.t.c.SpringBootTestContextBootstrapper : Found @SpringBootConfiguration com.jetbrains.bookmarks.BookmarksApplication for test class com.jetbrains.bookmarks.UserRepositoryTest
2025-01-02T18:44:42.594+05:30 DEBUG 7182 --- [bookmarks] [           main] org.springframework.test.context.cache   : Spring test ApplicationContext cache statistics: [DefaultContextCache@55a4a0ab size = 2, maxSize = 32, parentContextCount = 0, hitCount = 46, missCount = 2, failureCount = 0]
```

If you use different configurations for different tests, then Spring can't reuse the same cached context and will create a new context.

You can explore this behavior by activating a specific profile or injected Mock bean(s) only in one of the tests.

Update the **UserControllerTest.java** as follows:

```java
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import(TestcontainersConfiguration.class)
class UserControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @MockitoBean
    private BookmarkRepository bookmarkRepository;

    // code omitted for brevity

}
```

In this **UserControllerTest** class, we are injecting a mock **BookmarkRepository** bean, 
whereas we are injecting a real **BookmarkRepository** bean in **BookmarkControllerTest**.java.
So, both the tests can't use the same context. Now if you run all the tests, 
you will notice that **three** postgresql containers will be created.

## Using Testcontainers Singleton Containers Pattern
Spring's Test Context Caching helps to reduce the number of contexts being created, which in turn reduces the number of containers being created.
We can further reduce the number of times the containers are created using [Testcontainers Singleton Containers Pattern](https://java.testcontainers.org/test_framework_integration/manual_lifecycle_control/#singleton-containers).

With singleton containers pattern, the containers will be created only once per a JVM instance(basically static fields) and can be reused by all the test classes.

To use the singleton containers pattern with Spring Boot's ServiceConnection support, 
update the **TestcontainersConfiguration.java** as follows:

```java
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

	static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(DockerImageName.parse("postgres:17"));

	@Bean
	@ServiceConnection
	PostgreSQLContainer<?> postgresContainer() {
		return postgres;
	}
}
```

Here the **PostgreSQLContainer** is defined as a **static** field and is returning the same instance from the **@ServiceConnection** bean definition method.
So, Spring Boot will reuse the same container for all the tests that imports **TestcontainersConfiguration**.

Now, if you run all the tests again using **./mvnw test**, and search for **Creating container for image: postgres:17**,
you will see only **one** occurrence of this log statement.

This greatly reduces the test execution time. However, we need to be mindful about a few things.

* Using singleton containers with parallel test execution might result in flaky test behavior. 
  As the same container(s) will be used by multiple tests in parallel, the test data setup can be corrupted by other tests running in parallel.
* The tests should be implemented with proper test data setup and cleanup, leaving the containers in a predictable state. 
  Anyway, this is a good approach to be followed whether we use the singleton container pattern or not.

## Summary
Testcontainers greatly simplifies writing tests using real services as test dependencies instead of relying on mocks.
But a common complaint is using Testcontainers will increase the test execution time as it needs to spin up docker containers.

I would say even if it takes a few more (milli)seconds, it is better to write tests that give more confidence in our implementation. 
Writing ultrafast unit tests with mocks which doesn't ensure your code works as expected with real dependencies is not very useful.

I hope this article helps you to understand how to use Testcontainers more efficiently and reduce the time taken for test suite execution.
