---
title: "Spring Boot Testing Tutorial"
author: Siva
images: ["/preview-images/spring-boot-testing-tutorial.webp"]
type: post
draft: false
date: 2023-07-24T06:00:00+05:30
url: /spring-boot-testing-tutorial
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, Tutorials]
description: In this tutorial, you will learn how to write unit, slice and integration tests for a Spring Boot application.
---

In the previous [Getting Started with Spring Boot]({{< relref "01-getting-started-with-spring-boot.md" >}}) tutorial,
we have learned how to create a Spring Boot application and built a simple REST API.

In this tutorial, you will learn how to write **unit**, **slice** and **integration tests** for your Spring Boot application.

## Testing Spring Boot applications
We should write Unit Tests to verify the business logic of a particular unit(a class, a method, or a set of classes),
and they shouldn't be talking to any external services like database, queues or other webservices etc.
If the unit we are testing depends on any of those external services, then we can provide mock implementations of
those dependencies and verify the unit's behaviour.

In addition to Unit Tests, we should write Integration Tests which exercise the behaviour of a sub-system or a component
by talking to the real services and dependent collaborators.

When we generate our Spring Boot application **spring-boot-starter-test** dependency is automatically added which transitively
adds the most commonly used testing libraries such as **SpringTest**, **JUnit5**, **Mockito**, **Assertj**, **JsonPath**,
**JsonAssert** to our application as test dependencies.

## Types of Tests

**Unit Tests:** These are the tests to verify the behaviour of a single unit, and ideally
they shouldn't depend on frameworks like Spring or Hibernate, etc.

**Slice Tests:** These are the tests to verify a slice of the application such as Web layer or
Persistence layer etc. Spring Boot provides support for testing slices of the application
using **@WebMvcTest**, **@DataJpaTest**, **@DataMongoTest** etc.

**Integration Tests:** These are the tests, which tests the application in a blackbox manner.
We pass in some input, and we expect specific output, we don't know or care how it works internally.
Spring Boot provides support for writing Integration Tests using **@SpringBootTest**.

{{< box info >}}
**Spring Boot Tutorial Series GitHub Code Repository:**
https://github.com/sivaprasadreddy/spring-boot-tutorials-blog-series
{{< /box >}}

## Unit Testing with JUnit 5 and Mockito
Let's start with writing Unit Tests for **GreetingService**.
We will use JUnit 5 and Mockito for writing unit tests.

**src/test/java/com/sivalabs/helloworld/GreetingServiceTest.java**
```java
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class) // (1)
class GreetingServiceTest {

    @Mock // (2)
    private ApplicationProperties properties;

    @InjectMocks // (3)
    private GreetingService greetingService;

    @BeforeEach // (4)
    void setUp() {
        given(properties.getGreeting()).willReturn("Hello");
    }

    @Test
    void shouldGreetWithDefaultNameWhenNameIsNotProvided() {
        given(properties.getDefaultName()).willReturn("World");

        String greeting = greetingService.sayHello(null);

        Assertions.assertEquals("Hello World", greeting); //JUnit 5 based assertion (5)
        assertThat(greeting).isEqualTo("Hello World"); //Assertj based assertion (6)
    }

    @Test
    void shouldGreetWithGivenName() {
        String greeting = greetingService.sayHello("John");

        assertThat(greeting).isEqualTo("Hello John");
    }
}
```

* **(1)** We are using **MockitoExtension** so that we can create mock objects and inject them using annotations.
* **(2)** The **@Mock** annotation will initialize properties with a mock implementation of **ApplicationProperties** class.
* **(3)** The **@InjectMocks** annotation will create an instance of **GreetingService** by injecting the dependencies (properties) using the defined mock objects.
* **(4)** The **@BeforeEach** annotated method will be executed before each test execution so that we can put any common test setup in there.
* **(5)** We are asserting the expected output with actual output using **JUnit 5** based assertions.
* **(6)** We are asserting the expected output with actual output using **Assertj** based assertions.

{{< box tip >}}
**TIP:**

While JUnit5 assertions such as **Assertions.assertEquals()** does the job, **Assertj** assertions are fluent, and you get various convenient assertion methods depending on the type of the object.

To learn more about using AssertJ, you can watch [Why using Assertj assertions much better?](https://www.youtube.com/watch?v=Ri_fiEr3wMg) video. 
{{< /box >}}

## Testing application slices using Spring's Test Slice annotations

Now let's write a test for **HelloWorldController** using **@WebMvcTest**.

With **@WebMvcTest** only the web layer components such as Controllers, Interceptors, etc will be loaded into ApplicationContext.
So we need to add dependent beans by some means such as using **@MockBean** or configuring dependent beans using **@TestConfiguration**.

In our unit test we used Mockito's **@Mock** annotation to create a mock bean, but here we are using Spring's **@MockBean** instead of **@Mock**.
While using **@WebMvcTest** the test instance and **ApplicationContext** creation is taken care by Spring,
which is unaware of plain mock objects created by **@Mock**. When you use Spring's **@MockBean** that mock bean will become part of
ApplicationContext and will be injected into the Controller.

**src/test/java/com/sivalabs/helloworld/HelloWorldControllerTest.java**
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.is;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = HelloWorldController.class) // (1)
class HelloWorldControllerTest {
    @Autowired
    private MockMvc mockMvc; // (2)

    @MockBean
    private GreetingService greetingService; // (3)

    @Test
    void shouldReturnGreetingSuccessfully() throws Exception {
        given(greetingService.sayHello("Siva")).willReturn("Hello Siva"); // (4)

        mockMvc.perform(get("/api/hello?name={name}", "Siva"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.greeting", is("Hello Siva"))); // (5)
    }
}
```

* **(1)** Using **@WebMvcTest(controllers = HelloWorldController.class)** we are only testing the web layer controller and loading only **HelloWorldController**.
* **(2)** While using **@WebMvcTest** annotation **MockMvc** will be autoconfigured, and we can autowire and use it to invoke API endpoints.
* **(3)** Using **@MockBean** we are injecting a mock **GreetingService** bean into **HelloWorldController**.
* **(4)** Setting up the mock behaviour on mock **GreetingService** bean.
* **(5)** Invoking **GET /api/hello** API and asserting the Http Response Code and body using **jsonPath** assertions.


{{< box info >}}
**NOTE:**

As Slice tests only load a small subset of Spring components, they will be faster than integration tests written using **@SpringBootTest**.
{{< /box >}}

## Integration Tests using @SpringBootTest

Finally, let's write an integration test which loads the entire application then make an API call and test the results.

**src/test/java/com/sivalabs/helloworld/SpringBootHelloWorldApplicationTests.java**
```java
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.CoreMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT) // (1)
@AutoConfigureMockMvc  // (2)
class SpringBootHelloWorldApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturnGreetingSuccessfully() throws Exception {
        mockMvc.perform(get("/api/hello?name={name}", "Siva"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.greeting", is("Hello Siva")));
    }
}
```

* **(1)** We are using **@SpringBootTest** to load the entire application and also specified **webEnvironment= SpringBootTest.WebEnvironment.RANDOM_PORT** to start the application on a random available port so that there won't be any port conflicts with any running applications. This is especially very useful while running tests on build servers like Jenkins where multiple application builds run in parallel.
* **(2)** While using **@SpringBootTest** the **MockMvc** bean won't be autoconfigured, so we are using **@AutoConfigureMockMvc** to configure the **MockMvc** bean.

{{< box tip >}}
**NOTE:**

We have just scratched the surface of testing a Spring Boot application.
We will explore more testing techniques in upcoming posts as we go on.

You can also watch my [Java Testing Made Easy: Learn to write Unit, Integration, E2E & Performance Tests](https://www.youtube.com/watch?v=FGoLvCc6BeI&list=PLuNxlOYbv61jtHHFHBOc9N7Dg5jn013ix) video series.
{{< /box >}}

## Run tests
We can run tests using the build tool as follows:

Maven:

```shell
./mvnw verify
```

Gradle:

```shell
./gradlew test
```

{{< box info >}}
**Spring Boot Tutorial Series**

**Previous:** [Getting Started with Spring Boot]({{< relref "01-getting-started-with-spring-boot.md" >}})

**Next:** **Spring Boot Application Configuration Tutorial** (Coming Soon)
{{< /box >}}

## Summary
We have learned how to write unit tests using JUnit 5 and Mockito.
Then we learned about testing a slice of the application using Spring Boot Test Slice support.
Finally, we have learned how to write an integration test by bootstrapping the entire application.
