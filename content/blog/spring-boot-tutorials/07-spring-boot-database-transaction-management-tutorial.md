---
title: Spring Boot Database Transaction Management Tutorial
author: Siva
images:
  - /preview-images/spring-boot-database-transaction-management-tutorial.webp
type: post
draft: false
date: 2023-08-03T00:30:00.000Z
url: /blog/spring-boot-database-transaction-management-tutorial
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Tutorials
description: In this tutorial, you will learn how to handle database transactions while using SQL databases.
aliases:
  - /spring-boot-database-transaction-management-tutorial
---

Spring provides a high-level abstraction on top of **JDBC** with 
[JdbcTemplate]({{< relref "06-spring-boot-jdbctemplate-tutorial.md" >}}) 
to make it easier to perform database operations. 
Spring also provides a high-level abstraction on top of **JPA** 
with **Spring Data JPA** to make it easy to implement CRUD operations, sorting, pagination, etc.

<!--more-->


Whether you use **JdbcTemplate** or **JPA/Hibernate** or **Spring Data JPA**, you need to take care of 
handling database transactions.

A database transaction is a single unit of work, which either completes fully or does not complete at all, 
and leaves the database in a consistent state. While implementing database transactions you need to take 
**ACID (Atomicity, Consistency, Isolation, Durability)** properties into consideration.

Let's understand how we can handle database transactions in our Spring Boot applications.

## Transaction Handling using JDBC
First, let's take a quick look at how we usually handle database transactions in plain JDBC.

```java
class UserService {
    
    void register(User user) {
        String sql = "...";
        Connection conn = dataSource.getConnection(); // <1>
        try(conn) {  // <6>
            conn.setAutoCommit(false);  // <2>
            PreparedStatement pstmt = conn.prepareStatement(sql);
            pstmt.setString(1, user.getEmail());
            pstmt.setString(2, user.getPassword());
            pstmt.executeUpdate();  // <3>
            conn.commit();  // <4>
        } catch(SQLException e) {
            conn.rollback();  // <5>
        }
    }
}
```

In the above code snippet:

* **(1)** We obtained a database connection from DataSource connection pool
* **(2)** By default, every database operation will be running in its own transaction automatically.
  To take control of defining our transaction scope, we set AutoCommit to false.
* **(3)** Then we performed the necessary database operations.
* **(4)** If everything works fine then we are committing the transaction.
* **(5)** If any exception occurred then we rollback the transaction. 
* **(6)** As we are using **try-with-resources** syntax, the connection will be automatically closed.

In this implementation there is a good amount of **boilerplate code to handle database transaction**.

Spring simplifies database transaction handling mechanism by using **Aspect Oriented Programming (AOP)**
behind the scenes. We can implement database transaction handling in a declarative approach using **@Transactional** annotation 
or programmatically using **TransactionTemplate**. 

## Spring's declarative transaction handling using @Transactional annotation
Typically, in a 3-tier layered architecture, we will have a **Controller** in web layer, 
**Service** in business logic layer and **Repository** in data access layer. 

Generally, a **"Unit Of Work"** is modelled as a **Service** method and 
is considered to be a **"transactional boundary"**.

We can add Spring's **@Transactional** annotation on a Service layer method to define the transaction scope.
All the database operations in that method will be running in a single transaction.
If the method is executed successfully then the transaction will be committed.
If any **RuntimeException** occurs during the method execution then the transaction will be rolled back.

```java
@Service
class UserService {
    private final JdbcTemplate jdbcTemplate;
    
    @Transactional
    void register(User user) {
        String sql = "...";
        jdbcTemplate.update(sql);
    }
}
```

You can add **@Transactional** annotation on a method level to make that particular method transactional, 
or at class level to make all the public methods in that class as transactional.

When you add **@Transactional** annotation on a class or on any of its methods, **Spring creates a Proxy** for that class 
and apply the transaction handling logic using Spring AOP behind the scenes. 

{{< figure src="/images/spring-txn-proxy.webp" width="60%" height="40%" >}}

When you add **@Transactional** annotation, by default:

* The propagation level is set to **REQUIRED** which participates in the current transaction if exists, or starts a new transaction.
* Rollbacks the transaction if any **RuntimeException** is thrown by the method.
* Does NOT rollbacks the transaction if any **Checked Exception** is thrown by the method.

You can customize this behaviour by specifying the **@Transactional** attributes as follows:

```java
@Service
class UserService {
    private final JdbcTemplate jdbcTemplate;
    
    @Transactional(
            propagation = Propagation.REQUIRES_NEW,
            rollbackFor = DuplicateUserException.class,
            noRollbackFor = IllegalArgumentException.class)
    void register(User user) throws DuplicateUserException {
        String sql = "...";
        jdbcTemplate.update(sql);
    }
}

class DuplicateUserException extends Exception {}
```

In the above code snippet, we specified propagation level to be **REQUIRES_NEW** instead of the default **REQUIRED**.
The **REQUIRES_NEW** propagation level, suspends the current transaction if one exists, 
starts a new transaction, executes the database operations, commits the transaction 
and, then resumes the previously suspended transaction.

Also, we specified to rollback the transaction if **DuplicateUserException** occurs even though it is a **Checked Exception**.
And, we specified not to rollback the transaction if **IllegalArgumentException** occurs even though it is a **RuntimeException**.

{{< youtube jviq49ukATo >}}

## Spring's programmatic transaction handling using TransactionTemplate
Spring also provides a programmatic approach to handle database transactions using **TransactionTemplate** as follows:

```java
@Service
class UserService {
    private final TransactionTemplate transactionTemplate;

    void register(User user) {
        transactionTemplate.execute(status -> {
            String sql = "...";
            jdbcTemplate.update(sql);
            
            // If anything goes wrong, rollback
            //status.setRollbackOnly();

            return result;
        });
    }
}
```

You can use **TransactionTemplate** if you want to have more control over transaction management.

## A common mistake while using @Transactional annotation
We need to understand how proxies work to avoid mis-configuring the transaction handling logic.

Let's take an example scenario where a Controller calls a transactional method which in turn calls 
other transactional method.

```shell
UserController  --> UserService --> AccountService
```

Let's assume we have the user registration process implemented as follows:

```java
@Controller
class UserController {
    private final UserService userService;
    
    @PostMapping("/register")
    String register() {
        User user = ...;
        userService.register(user);
        return "...";
    }
}

//--------------------------------------------------------------

@Service
class UserService {
    private final UserRepository userRepository;
    private final AccountService accountService;
    
    @Transactional
    public void register(User user) {
        userRepository.save(user);
        
        Account account = ...;
        accountService.create(account);

        UserPreferences preferences = ...;
        userRepository.savePreferences(preferences);
    }
}

//--------------------------------------------------------------

@Service
class AccountService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void create(Account account) {
        ...
    }
}
```
In the above example scenario, from the **UserController** we are calling **UserService.register(..)** method
which is annotated with **@Transactional**. As there is no new transaction in progress, a new transaction will be created.
The user details will be saved into the database within the current transaction.
After that we are calling **AccountService.create(account)** which is annotated with **@Transactional(propagation = Propagation.REQUIRES_NEW)**.
Now the current transaction which is in progress will be temporarily suspended and a new transaction will be started.
The account creation will be executed in that new transaction and if no exception occurred that transaction will be committed immediately.
Then the previous transaction will be resumed and saves the user preferences. 

If a **RuntimeException** occurs while saving preferences then only user record insertion will be rolled back, 
but not account creation as account creation happened in a separate transaction which is already committed successfully.

**This will work as expected.**

But, imagine the account creation method is also in **UserService** as follows:

```java
@Controller
class UserController {
    private final UserService userService;
    
    @PostMapping("/register")
    String register() {
        User user = ...;
        userService.register(user);
        return "...";
    }
}

//--------------------------------------------------------------

@Service
class UserService {
    private final UserRepository userRepository;
    
    @Transactional
    public void register(User user) {
        userRepository.save(user);
        
        Account account = ...;
        this.create(account);

        UserPreferences preferences = ...;
        userRepository.savePreferences(preferences);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void create(Account account) {
        ...
    }
}
```

We may assume the account creation logic will be executed in a new transaction 
because we have configured **REQUIRES_NEW** propagation level. **But this does NOT work.**

When you added **@Transactional** annotation on **UserService**, a proxy is created, and that proxy is injected into the **UserController**.
When **userService.register(..)** method is called from **UserController**, you are calling the **register()** method on the proxy.
The proxy will apply the transaction handling logic according to the **@Transactional** semantics and then 
delegates the execution of actual logic to the actual **UserService** instance.

Now, from within the **UserService.register()** method when the **create(account)** method is called, 
it will be a local method call on the actual **UserService** object which is unaware of transaction handling.

{{< figure src="/images/spring-txn-gotcha.webp" width="80%" height="60%" >}}

In the above scenario, the **create(account)** logic will also be executed in the same 
parent transaction that is created when you called **UserService.register()** method.

So, if you want to run a method with different transaction semantics the better way is to move that method into a separate class.
There are alternative ways such as injecting the same class dependency into itself lazily, but it is not a recommended approach.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
Spring's transaction handling support greatly helps in implementing persistence layer logic 
without polluting with low-level transaction handling boilerplate code. 

We have looked at a common mistake often beginners make when one transactional method calls 
another method with different transactional semantics in the same class and talked about a possible solution.
