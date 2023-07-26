---
title: Testing SpringBoot Applications
author: Siva
images: ["/preview-images/spring-boot-1.webp"]
type: post
date: 2019-10-07T07:59:17+05:30
url: /spring-boot-testing/
categories:
  - SpringBoot
tags: [Spring, SpringBoot, Testing]
popular: true
---

**SpringBoot** is the most popular tech stack for building Java based REST APIs.
In this tutorial we will learn how to write tests for SpringBoot applications.

* Create SpringBoot Application
* Unit Testing using [JUnit 5](https://junit.org/junit5/docs/current/user-guide/) and [Mockito](https://site.mockito.org/)
* Integration Testing using [TestContainers](https://www.testcontainers.org/)
* Testing MicroService Integrations using [MockServer](http://www.mock-server.com/)

As we all know, we write unit tests for testing single component (a class) behaviour 
where as we write integration tests for testing a feature which may involve interaction with multiple components.

Most of the times one component will depend on other component(s), so while implementing unit tests we should mock 
the dependencies with the desired behaviour using frameworks like [Mockito](https://site.mockito.org/).

So, the question is how do we implement Unit Tests and Integration tests in SpringBoot application? Read on :-)

> Sample application Code for this article can be found at https://github.com/sivaprasadreddy/spring-boot-tutorials/tree/master/testing/springboot-testing-demo

## Create SpringBoot Application

Let us consider a scenario where we are building a REST API to manage users. 
If we follow typical 3-tier layered architecture we might have JPA entity **User**, Spring Data JPA Repository **UserRepository**, 
**UserService** and **UserController** implementing CRUD operations as follows:

First of all, create a SpringBoot application with the following dependencies:

#### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
		 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
	http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.sivalabs</groupId>
	<artifactId>springboot-testing-demo</artifactId>
	<packaging>jar</packaging>
	<version>1.0-SNAPSHOT</version>
	<name>springboot-testing-demo</name>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.1.8.RELEASE</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
    
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<java.version>1.8</java.version>
	</properties>

	<build>
		<plugins>						
			<plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
			<plugin>
				<artifactId>maven-failsafe-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-actuator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>
		<dependency>
	        <groupId>org.springframework.boot</groupId>
	        <artifactId>spring-boot-devtools</artifactId>
	        <optional>true</optional>
	    </dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>com.h2database</groupId>
			<artifactId>h2</artifactId>
			<scope>runtime</scope>
		</dependency>
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>
	</dependencies>
</project>
```

By default **spring-boot-starter-test** comes with **JUnit 4** as testing framework. 
We can **exclude JUnit4** and **add JUnit 5** dependencies as follows:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
        <exclusions>
            <exclusion>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-engine</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-params</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

Let us create JPA entity, repository, service and controller for User as follows:

#### User.java
```java
package com.sivalabs.myservice.entities;

import lombok.*;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import java.io.Serializable;

@Entity
@Table(name = "users")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User implements Serializable
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotEmpty(message = "Email should not be empty")
	@Column(nullable = false, unique = true, length = 100)
	private String email;

	@Column(nullable = false, length = 100)
	private String password;

	@Column(nullable = false, length = 100)
	private String name;

}
```

#### UserRepository.java
```java
package com.sivalabs.myservice.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sivalabs.myservice.entities.User;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>
{
	@Query("select u from User u where u.email=?1 and u.password=?2")
	Optional<User> login(String email, String password);

    Optional<User> findByEmail(String email);
}
```

#### UserService.java
```java
package com.sivalabs.myservice.services;

import com.sivalabs.myservice.exception.UserRegistrationException;
import com.sivalabs.myservice.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.sivalabs.myservice.entities.User;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService 
{
    private final UserRepository userRepository;

    @Autowired
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public Optional<User> login(String email, String password)
	{
		return userRepository.login(email, password);
	}
	
	public User createUser(User user)
	{
		Optional<User> userOptional = userRepository.findByEmail(user.getEmail());
		if(userOptional.isPresent()){
			throw new UserRegistrationException("User with email "+ user.getEmail()+" already exists");
		}
		return userRepository.save(user);
	}

	public User updateUser(User user)
	{
		return userRepository.save(user);
	}

	public List<User> findAllUsers() {
    	return userRepository.findAll();
	}

	public Optional<User> findUserById(Long id) {
    	return userRepository.findById(id);
	}

	public void deleteUserById(Long id) {
    	userRepository.deleteById(id);
	}
	
}
```

#### UserController.java
```java
package com.sivalabs.myservice.web.controllers;

import com.sivalabs.myservice.entities.User;
import com.sivalabs.myservice.services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public List<User> getAllUsers() {
		return userService.findAllUsers();
	}

	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable Long id) {
		return userService.findUserById(id)
				.map(ResponseEntity::ok)
				.orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public User createUser(@RequestBody @Validated User user) {
		return userService.createUser(user);
	}

	@PutMapping("/{id}")
	public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
		return userService.findUserById(id)
				.map(userObj -> {
					user.setId(id);
					return ResponseEntity.ok(userService.updateUser(user));
				})
				.orElseGet(() -> ResponseEntity.notFound().build());

	}

	@DeleteMapping("/{id}")
	public ResponseEntity<User> deleteUser(@PathVariable Long id) {
		return userService.findUserById(id)
				.map(user -> {
					userService.deleteUserById(id);
					return ResponseEntity.ok(user);
				})
				.orElseGet(() -> ResponseEntity.notFound().build());
	}
}
```

Nothing too fancy here, typical CRUD operations in SpringBoot application.

### ExceptionHandling using Zalando Problem Web
We are going to use [Zalando Problem Web](https://github.com/zalando/problem-spring-web) [SpringBoot starter](https://github.com/zalando/problem-spring-web/tree/master/problem-spring-web) to handle 
Exceptions so that it will automatically convert the application errors into JSON responses.

Just adding the following dependency is enough to start using Zalando Problem Web, and of course you can customize it if you want to.

```xml
<problem-spring-web.version>0.25.0</problem-spring-web.version>
...
...
<dependency>
    <groupId>org.zalando</groupId>
    <artifactId>problem-spring-web-starter</artifactId>
    <version>${problem-spring-web.version}</version>
    <type>pom</type>
</dependency>
```

Now let us see how we can write Unit Tests and Integration Tests for this functionality.

## Unit Testing using JUnit 5 and Mockito
Let us start writing unit tests for **UserService**.
*We should be able to write unit tests for UserService WITHOUT using any Spring features*.

We are going to create a mock **UserRepository** using **Mockito.mock()** and create UserService instance using the mock UserRepository instance.

```java
package com.sivalabs.myservice.services;

import com.sivalabs.myservice.entities.User;
import com.sivalabs.myservice.exception.UserRegistrationException;
import com.sivalabs.myservice.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;

class UserServiceTest {

    private UserService userService;
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository = mock(UserRepository.class);
        userService = new UserService(userRepository);
    }

    @Test
    void shouldSavedUserSuccessfully() {
        User user = new User(null, "siva@gmail.com","siva","Siva");
        given(userRepository.findByEmail(user.getEmail())).willReturn(Optional.empty());
        given(userRepository.save(user)).willAnswer(invocation -> invocation.getArgument(0));

        User savedUser = userService.createUser(user);

        assertThat(savedUser).isNotNull();

        verify(userRepository).save(any(User.class));
    }

    @Test
    void shouldThrowErrorWhenSaveUserWithExistingEmail() {
        User user = new User(1L, "siva@gmail.com","siva","Siva");
        given(userRepository.findByEmail(user.getEmail())).willReturn(Optional.of(user));

        assertThrows(UserRegistrationException.class, () -> {
            userService.createUser(user);
        });

        verify(userRepository, never()).save(any(User.class));
    }
}
```

I have created **UserRepository** mock object and **UserService** instance in **@BeforeEach** method so that every test has a clean setup.
Here we are not using any Spring or SpringBoot testing features such as **@SpringBootTest** because we don't have to for testing the behaviour of UserService.

I am not going to write tests for other methods because they are simply delegating the calls to **UserRepository**.

If you prefer to use annotations magic to create mock **UserRepository** and inject that mock into **UserService**, 
you can use **mockito-junit-jupiter** as follows: 

Add **mockito-junit-jupiter** dependency

```xml
<dependency>
    <groupId>org.mockito</groupId>
    <artifactId>mockito-junit-jupiter</artifactId>
    <scope>test</scope>
</dependency>
```

Use **@Mock** and **@InjectMocks** to create and inject mock objects as follows:

```java
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class UserServiceAnnotatedTest {

    @Mock
    private UserRepository userRepository;
        
    @InjectMocks
    private UserService userService;

    ...
    ...
}
```

### Now, shall we write tests for UserRepository? hmmmm...

The **UserRepository** is an interface extending **JpaRepository** and there is hardly any logic we implemented and 
we shouldn't be testing Spring Data JPA framework as I strongly believe Spring Data JPA team already tested it :-)

However, we added a couple of custom methods, one leveraging Query naming convention **findByEmail()** and another with custom JPQL query **login()**.
We should test these methods. If there are any syntactic errors Spring Data JPA throw errors on startup but we should test the logical errors by ourselves.

We could implement tests for **UserRepository** using SpringBoot's **@DataJpaTest** annotation with **In-memory database support**.
But running tests against in-memory database might give a false impression that it will also work on real production database as well.
So, I prefer to run tests against the production database type, in our case Postgresql.

We can use [TestContainers support to spin up a postgresql](https://www.testcontainers.org/modules/databases/postgres/) docker container and run the tests pointing to that database.
However I consider this as an Integration Test rather than Unit Test as we are talking to a real database.
So, we will see how to write Integration tests for UserRepository later.

### What about unit tests for Controller?
Yes, I want to write unit tests for controller and I want to check whether the REST endpoint is giving the proper 
HTTP ResponseCode or not, returning the expected JSON or not etc.

SpringBoot provides **@WebMvcTest** annotation to test Spring MVC Controllers. 
Also, **@WebMvcTest** based tests runs faster as it will load only the specified controller and its dependencies only without loading the entire application.

While loading the Controller using **@WebMvcTest** SpringBoot won't automatically load Zalando Problem Web AutoConfiguration.
So, we need to configure **ControllerAdvice** as follows:

```java
package com.sivalabs.myservice.common;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.zalando.problem.spring.web.advice.ProblemHandling;

@Profile("test")
@ControllerAdvice
public final class ExceptionHandling implements ProblemHandling {

}
```

Now we can write tests for **UserController** by injecting a Mock **UserService** bean and invoke API endpoints using **MockMvc**.

As SpringBoot is creating the **UserController** instance we are creating mock **UserService** bean using Spring's **@MockBean** as opposed to plain Mockito's **@Mock**.

```java
package com.sivalabs.myservice.web.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sivalabs.myservice.entities.User;
import com.sivalabs.myservice.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.zalando.problem.ProblemModule;
import org.zalando.problem.violations.ConstraintViolationProblemModule;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = UserController.class)
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private List<User> userList;

    @BeforeEach
    void setUp() {
        this.userList = new ArrayList<>();
        this.userList.add(new User(1L, "user1@gmail.com", "pwd1","User1"));
        this.userList.add(new User(2L, "user2@gmail.com", "pwd2","User2"));
        this.userList.add(new User(3L, "user3@gmail.com", "pwd3","User3"));

        objectMapper.registerModule(new ProblemModule());
        objectMapper.registerModule(new ConstraintViolationProblemModule());
    }

    @Test
    void shouldFetchAllUsers() throws Exception {
        given(userService.findAllUsers()).willReturn(this.userList);

        this.mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(userList.size())));
    }

    @Test
    void shouldFindUserById() throws Exception {
        Long userId = 1L;
        User user = new User(userId, "newuser1@gmail.com", "pwd", "Name");
        given(userService.findUserById(userId)).willReturn(Optional.of(user));

        this.mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())))
        ;
    }

    @Test
    void shouldReturn404WhenFetchingNonExistingUser() throws Exception {
        Long userId = 1L;
        given(userService.findUserById(userId)).willReturn(Optional.empty());

        this.mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isNotFound());

    }

    @Test
    void shouldCreateNewUser() throws Exception {
        given(userService.createUser(any(User.class))).willAnswer((invocation) -> invocation.getArgument(0));

        User user = new User(null, "newuser1@gmail.com", "pwd", "Name");
        this.mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())))
                ;

    }

    @Test
    void shouldReturn400WhenCreateNewUserWithoutEmail() throws Exception {
        User user = new User(null, null, "pwd", "Name");

        this.mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(header().string("Content-Type", is("application/problem+json")))
                .andExpect(jsonPath("$.type", is("https://zalando.github.io/problem/constraint-violation")))
                .andExpect(jsonPath("$.title", is("Constraint Violation")))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.violations", hasSize(1)))
                .andExpect(jsonPath("$.violations[0].field", is("email")))
                .andExpect(jsonPath("$.violations[0].message", is("Email should not be empty")))
                .andReturn()
        ;
    }

    @Test
    void shouldUpdateUser() throws Exception {
        Long userId = 1L;
        User user = new User(userId, "user1@gmail.com", "pwd", "Name");
        given(userService.findUserById(userId)).willReturn(Optional.of(user));
        given(userService.updateUser(any(User.class))).willAnswer((invocation) -> invocation.getArgument(0));

        this.mockMvc.perform(put("/api/users/{id}", user.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())));

    }

    @Test
    void shouldReturn404WhenUpdatingNonExistingUser() throws Exception {
        Long userId = 1L;
        given(userService.findUserById(userId)).willReturn(Optional.empty());
        User user = new User(userId, "user1@gmail.com", "pwd", "Name");

        this.mockMvc.perform(put("/api/users/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isNotFound());

    }

    @Test
    void shouldDeleteUser() throws Exception {
        Long userId = 1L;
        User user = new User(userId, "user1@gmail.com", "pwd", "Name");
        given(userService.findUserById(userId)).willReturn(Optional.of(user));
        doNothing().when(userService).deleteUserById(user.getId());

        this.mockMvc.perform(delete("/api/users/{id}", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())));

    }

    @Test
    void shouldReturn404WhenDeletingNonExistingUser() throws Exception {
        Long userId = 1L;
        given(userService.findUserById(userId)).willReturn(Optional.empty());

        this.mockMvc.perform(delete("/api/users/{id}", userId))
                .andExpect(status().isNotFound());

    }

}
```

Now we have good amount of unit tests testing various components of our application.
But still there is a lot of chance for things to go wrong, may be we might have some property configuration issues, 
we might have some errors in our DB migration scripts etc etc.

So, lets write Integration Tests to have more confidence that our application is running properly.

## Integration Testing using TestContainer
SpringBoot provides excellent support for integration testing. We can use **@SpringBootTest** annotation 
to load the application context and test various components.

Let us start with writing integration tests for **UserController**. 
As I mentioned earlier we want to test using postgres database instead of in-memory database.

Add the following dependencies.

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <version>1.11.3</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>1.11.3</version>
    <scope>test</scope>
</dependency>
```

We can use TestContainers support for JUnit 5 as mentioned here https://www.testcontainers.org/test_framework_integration/junit_5/.
However, starting and stopping docker containers for every test or every test class might cause tests running slowly.
So, we are going to use Singleton Containers approach mentioned at https://www.testcontainers.org/test_framework_integration/manual_lifecycle_control/#singleton-containers

Let us create a base class **AbstractIntegrationTest** so that all our integration tests can extend without repeating the common configuration.

```java
package com.sivalabs.myservice.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;

import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@Slf4j
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
@ContextConfiguration(initializers = {AbstractIntegrationTest.Initializer.class})
public abstract class AbstractIntegrationTest {

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    private static PostgreSQLContainer sqlContainer;

    static {
        sqlContainer = new PostgreSQLContainer("postgres:10.7")
                .withDatabaseName("integration-tests-db")
                .withUsername("sa")
                .withPassword("sa");
        sqlContainer.start();
    }

    public static class Initializer
            implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + sqlContainer.getJdbcUrl(),
                    "spring.datasource.username=" + sqlContainer.getUsername(),
                    "spring.datasource.password=" + sqlContainer.getPassword()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }

}
```

We have used **@AutoConfigureMockMvc** to auto-configure **MockMvc**, 
and **@SpringBootTest(webEnvironment = RANDOM_PORT)** to start the server on a random available port.

We have started **PostgreSQLContainer** and used **@ContextConfiguration(initializers={AbstractIntegrationTest.Initializer.class})** 
to configure the dynamic database connection properties.

Now we can implement Integration Test for **UserController** as follows:

```java
package com.sivalabs.myservice.web.controllers;

import com.sivalabs.myservice.common.AbstractIntegrationTest;
import com.sivalabs.myservice.entities.User;
import com.sivalabs.myservice.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class UserControllerIT extends AbstractIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    private List<User> userList = null;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        userList = new ArrayList<>();
        this.userList.add(new User(1L, "user1@gmail.com", "pwd1","User1"));
        this.userList.add(new User(2L, "user2@gmail.com", "pwd2","User2"));
        this.userList.add(new User(3L, "user3@gmail.com", "pwd3","User3"));

        userList = userRepository.saveAll(userList);
    }

    @Test
    void shouldFetchAllUsers() throws Exception {
        this.mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.size()", is(userList.size())));
    }

    @Test
    void shouldFindUserById() throws Exception {
        User user = userList.get(0);
        Long userId = user.getId();

        this.mockMvc.perform(get("/api/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())))
        ;
    }

    @Test
    void shouldCreateNewUser() throws Exception {
        User user = new User(null, "user@gmail.com", "pwd", "name");
        this.mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())));

    }

    @Test
    void shouldReturn400WhenCreateNewUserWithoutEmail() throws Exception {
        User user = new User(null, null, "pwd", "Name");

        this.mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isBadRequest())
                .andExpect(header().string("Content-Type", is("application/problem+json")))
                .andExpect(jsonPath("$.type", is("https://zalando.github.io/problem/constraint-violation")))
                .andExpect(jsonPath("$.title", is("Constraint Violation")))
                .andExpect(jsonPath("$.status", is(400)))
                .andExpect(jsonPath("$.violations", hasSize(1)))
                .andExpect(jsonPath("$.violations[0].field", is("email")))
                .andExpect(jsonPath("$.violations[0].message", is("Email should not be empty")))
                .andReturn()
        ;
    }

    @Test
    void shouldUpdateUser() throws Exception {
        User user = userList.get(0);
        user.setPassword("newpwd");
        user.setName("NewName");

        this.mockMvc.perform(put("/api/users/{id}", user.getId())
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())));

    }

    @Test
    void shouldDeleteUser() throws Exception {
        User user = userList.get(0);

        this.mockMvc.perform(
                delete("/api/users/{id}", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(user.getEmail())))
                .andExpect(jsonPath("$.password", is(user.getPassword())))
                .andExpect(jsonPath("$.name", is(user.getName())));

    }

}
```

The **UserControllerIT** tests looks very similar to **UserControllerTest** with the difference being how we load the ApplicationContext.
While using **@SpringBootTest** SpringBoot will actually start the application by loading the entire application 
so that tests will fail if there is any mis-configuration.

Next, we are going to write test for **UserRepository** using **@DataJpaTest**. 
But we want to run tests against a real database not with in-memory database.
We can use **@AutoConfigureTestDatabase(replace=AutoConfigureTestDatabase.Replace.NONE)** to turn-off using in-memory database and use the configured database.

Let us create **PostgreSQLContainerInitializer** so that any repository tests can use this to configure dynamic postgres database properties.

```java
package com.sivalabs.myservice.common;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.testcontainers.containers.PostgreSQLContainer;

@Slf4j
public class PostgreSQLContainerInitializer
        implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private static PostgreSQLContainer sqlContainer;

    static {
        sqlContainer = new PostgreSQLContainer("postgres:10.7")
                .withDatabaseName("integration-tests-db")
                .withUsername("sa")
                .withPassword("sa");
        sqlContainer.start();
    }

    public void initialize (ConfigurableApplicationContext configurableApplicationContext){
        TestPropertyValues.of(
                "spring.datasource.url=" + sqlContainer.getJdbcUrl(),
                "spring.datasource.username=" + sqlContainer.getUsername(),
                "spring.datasource.password=" + sqlContainer.getPassword()
        ).applyTo(configurableApplicationContext.getEnvironment());
    }

}
```

Now we can create **UserRepositoryTest** as follows:

```java
package com.sivalabs.myservice.repositories;

import com.sivalabs.myservice.common.PostgreSQLContainerInitializer;
import com.sivalabs.myservice.entities.User;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ContextConfiguration;
import javax.persistence.EntityManager;
import java.util.Optional;
import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@DataJpaTest
@AutoConfigureTestDatabase(replace= AutoConfigureTestDatabase.Replace.NONE)
@ContextConfiguration(initializers = {PostgreSQLContainerInitializer.class})
class UserRepositoryTest {

    @Autowired
    EntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldReturnUserGivenValidCredentials() {
        User user = new User(null, "test@gmail.com", "test", "Test");
        entityManager.persist(user);
        
        Optional<User> userOptional = userRepository.login("test@gmail.com", "test");
        
        assertThat(userOptional).isNotEmpty();
    }
}
```

Well, I guess we learned something about how to write unit tests and integration tests using various SpringBoot features.

We are living in Microservices world and there is a high chance that our service might talk to other microservices.
How are we going to test those integration points? How are we going to verify the timeout scenarios?
Well, we can certainly use a Mock object and pray GOD that it will work fine in production :-)
Or we can use libraries like **MockServer** to simulate the service-to-service communication.

## Testing MicroService Integrations using MockServer
Assume from our application we want to fetch GitHub profile of a user. We can use GitHub REST API to fetch the user profile.
Also, we want to timeout the call after 2 seconds and if we don't get response by that time we want to return a default user response.

We can implement this using **Hystrix** as follows:

#### application.properties
```java
githuub.api.base-url=https://api.github.com
```

```java
package com.sivalabs.myservice.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Data
public class ApplicationProperties {

    @Value("${githuub.api.base-url}")
    private String githubBaseUrl;
}
```

Register **RestTemplate** bean and enable Hystrix CircuitBreaker using **@EnableCircuitBreaker**.

```java
package com.sivalabs.myservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableCircuitBreaker
public class Application
{
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}
```

Create **GithubUser** class which holds response from GitHub API.

```java
package com.sivalabs.myservice.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class GithubUser {
    private Long id;
    private String login;
    private String url;
    private String name;
    @JsonProperty("public_repos")
    private int publicRepos;
    private int followers;
    private int following;
}
```

Create **GithubService** which talks to GitHub REST API using **RestTemplate** as follows:

```java
package com.sivalabs.myservice.services;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import com.netflix.hystrix.contrib.javanica.annotation.HystrixProperty;
import com.sivalabs.myservice.config.ApplicationProperties;
import com.sivalabs.myservice.model.GithubUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class GithubService {
    private final ApplicationProperties properties;
    private final RestTemplate restTemplate;

    @Autowired
    public GithubService(ApplicationProperties properties, RestTemplate restTemplate) {
        this.properties = properties;
        this.restTemplate = restTemplate;
    }

    @HystrixCommand(fallbackMethod = "getDefaultUser", commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "2000")
    })
    public GithubUser getGithubUserProfile(String username) {
        log.info("GithubBaseUrl:"+properties.getGithubBaseUrl());
        return this.restTemplate.getForObject(properties.getGithubBaseUrl() + "/users/" + username, GithubUser.class);
    }

    GithubUser getDefaultUser(String username) {
        log.info("---------getDefaultUser-----------");
        GithubUser user = new GithubUser();
        user.setId(-1L);
        user.setLogin("guest");
        user.setName("Guest");
        user.setPublicRepos(0);
        return user;
    }
}
```

Let us create a **GithubController** with an endpoint to return the users GitHub profile.

```java
package com.sivalabs.myservice.web.controllers;

import com.sivalabs.myservice.model.GithubUser;
import com.sivalabs.myservice.services.GithubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/github")
public class GithubController {

    private final GithubService githubService;

    @Autowired
    public GithubController(GithubService githubService) {
        this.githubService = githubService;
    }

    @GetMapping("/users/{username}")
    public GithubUser getGithubUserProfile(@PathVariable String username) {
        return githubService.getGithubUserProfile(username);
    }
}
```

We can use **MockServer** to simulate the dependent microservice responses so that we can verify our application behaviour in various scenarios.

We can use [TestContainers support to spin up MockServer](https://www.testcontainers.org/modules/mockserver/) docker container as follows:

Add the following dependencies:

```xml
<dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>mockserver</artifactId>
    <version>1.11.3</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.mock-server</groupId>
    <artifactId>mockserver-netty</artifactId>
    <version>5.5.1</version>
    <scope>test</scope>
</dependency>
```

In **AbstractIntegrationTest** add **MockServerContainer** configuration as follows:

```java
import org.mockserver.client.MockServerClient;
import org.testcontainers.containers.MockServerContainer;

@Slf4j
@ActiveProfiles("test")
@SpringBootTest(webEnvironment = RANDOM_PORT)
@AutoConfigureMockMvc
@ContextConfiguration(initializers = {AbstractIntegrationTest.Initializer.class})
public abstract class AbstractIntegrationTest {
    ...
    ...
    private static MockServerContainer mockServerContainer;

    static {
        ....
        ....
        mockServerContainer = new MockServerContainer();
        mockServerContainer.start();
    }

    protected MockServerClient mockServerClient = new MockServerClient(
            mockServerContainer.getContainerIpAddress(),
            mockServerContainer.getServerPort());


    public static class Initializer
            implements ApplicationContextInitializer<ConfigurableApplicationContext> {
        public void initialize(ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues.of(
                    "spring.datasource.url=" + sqlContainer.getJdbcUrl(),
                    "spring.datasource.username=" + sqlContainer.getUsername(),
                    "spring.datasource.password=" + sqlContainer.getPassword(),
                    "githuub.api.base-url=" + mockServerContainer.getEndpoint()
            ).applyTo(configurableApplicationContext.getEnvironment());
        }
    }

}
```

Note that we are stating **MockServerContainer** and injecting the endpoint URL with **"githuub.api.base-url="+mockServerContainer.getEndpoint()**.
Also, we have created **MockServerClient** which we are going to use for setting up expected responses.

```java
package com.sivalabs.myservice.web.controllers;

import com.sivalabs.myservice.common.AbstractIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockserver.model.Header;
import org.mockserver.verify.VerificationTimes;

import java.util.concurrent.TimeUnit;

import static org.hamcrest.CoreMatchers.is;
import static org.mockserver.model.HttpRequest.request;
import static org.mockserver.model.HttpResponse.response;
import static org.mockserver.model.JsonBody.json;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GithubControllerIT extends AbstractIntegrationTest {

    @BeforeEach
    void setup() {
        mockServerClient.reset();
    }

    @Test
    void shouldGetGithubUserProfile() throws Exception {
        String username = "sivaprasadreddy";
        mockGetUserFromGithub(username);
        this.mockMvc.perform(get("/api/github/users/{username}", username))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.login", is(username)))
                .andExpect(jsonPath("$.name", is("K. Siva Prasad Reddy")))
                .andExpect(jsonPath("$.public_repos", is(50)))
                ;
        verifyMockServerRequest("GET", "/users/.*", 1);
    }

    private void mockGetUserFromGithub(String username) {
        mockServerClient.when(
            request().withMethod("GET").withPath("/users/.*"))
            .respond(
                response()
                    .withStatusCode(200)
                    .withHeaders(new Header("Content-Type", "application/json; charset=utf-8"))
                    .withBody(json("{ " +
                            "\"login\": \""+username+"\", " +
                            "\"name\": \"K. Siva Prasad Reddy\", " +
                            "\"public_repos\": 50 " +
                            "}"))
            );
    }

    private void verifyMockServerRequest(String method, String path, int times) {
        mockServerClient.verify(
                request()
                        .withMethod(method)
                        .withPath(path),
                VerificationTimes.exactly(times)
        );
    }
}
```

Note that we are setting up expected JSON response for **\<githuub.api.base-url\>/users/.\*** URL pattern on **mockServerClient**.
So, when we make a call to **http://localhost:8080/api/github/users/{username}** GithubController will in-turn call GithubService which makes a call to 
**\<githuub.api.base-url\>/users/{username}** and return the mock JSON response that we set using **mockServerClient**.

We can also simulate the failures and timeout scenarios as follows:

```java
@Test
void shouldGetDefaultUserProfileWhenFetchingFromGithubFails() throws Exception {
    mockGetUserFromGithubFailure();
    this.mockMvc.perform(get("/api/github/users/{username}", "dummy"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.login", is("guest")))
            .andExpect(jsonPath("$.name", is("Guest")))
            .andExpect(jsonPath("$.public_repos", is(0)))
    ;
    verifyMockServerRequest("GET", "/users/.*", 1);
}

@Test
void shouldGetDefaultUserProfileWhenFetchingFromGithubTimeout() throws Exception {
    mockGetUserFromGithubDelayResponse();
    this.mockMvc.perform(get("/api/github/users/{username}", "dummy"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.login", is("guest")))
            .andExpect(jsonPath("$.name", is("Guest")))
            .andExpect(jsonPath("$.public_repos", is(0)))
    ;
    verifyMockServerRequest("GET", "/users/.*", 1);
}

private void mockGetUserFromGithubDelayResponse() {
    mockServerClient.when(
        request().withMethod("GET").withPath("/users/.*"))
        .respond(response().withStatusCode(200).withDelay(TimeUnit.SECONDS, 10));
}

private void mockGetUserFromGithubFailure() {
    mockServerClient.when(
        request().withMethod("GET").withPath("/users/.*"))
        .respond(response().withStatusCode(404));
}
```

In **shouldGetDefaultUserProfileWhenFetchingFromGithubFails()** test we are setting up the mockServer to respond 
with **404 error** to verify **Hystrix fallback** method is working or not.

Similarly, In shouldGetDefaultUserProfileWhenFetchingFromGithubTimeout() test we are setting up the mockServer to respond 
with **delay of 10 SECONDS** to verify whether **Hystrix timeout** is working or not.

Make sure to reset **mockServerClient** using **mockServerClient.reset()** for every test in **@BeforeEach** method to reset any expectations set in previous test run.

> Sample application Code for this article can be found at https://github.com/sivaprasadreddy/spring-boot-tutorials/tree/master/testing/springboot-testing-demo

I hope we have covered many common testing scenarios in SpringBoot applications.

Thank you reading the article, your feedback is welcome. 
If you find this article useful please share it on Twitter.



