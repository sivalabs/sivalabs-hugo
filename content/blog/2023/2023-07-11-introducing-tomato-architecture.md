---
title: "Tomato Architecture - A Pragmatic Approach to Software Design"
author: Siva
images: ["/preview-images/tomato-architecture.webp"]
type: post
draft: false
date: 2023-07-11T04:59:17+05:30
url: /tomato-architecture-pragmatic-approach-to-software-design
categories: [Architecture]
tags: [Architecture]
toc: true
---

After a couple of years into software development, I wanted to improve my skills by learning more about Software Architecture and Design. 

<!--more-->


As you might guess, various sources suggested learning:
* [Design Patterns](https://refactoring.guru/design-patterns)
* [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
* [Onion Architecture](https://jeffreypalermo.wpcomstaging.com/2008/07/the-onion-architecture-part-1/)
* [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
* [Ports & Adapters Architecture](http://wiki.c2.com/?PortsAndAdaptersArchitecture)
* [DDD (Domain Driven Design)](https://martinfowler.com/bliki/DomainDrivenDesign.html)

I have read various books and blog posts to learn these concepts, 
and I feel **Clean/Onion/Hexagonal/Ports&Adapters Architectures are very similar 
with a common goal of "protecting the core domain logic" from "external dependencies"**.

## The challenges in learning DDD, Clean/Onion/Hexagonal Architectures
I started reading [DDD Blue book](https://www.amazon.com/exec/obidos/ASIN/0321125215/domainlanguag-20) and I couldn't go too far with too much abstract explanation.
Then I read [DDD Red book](https://www.amazon.com/Implementing-Domain-Driven-Design-Vaughn-Vernon/dp/0321834577) and it's easier read than Blue book, but still many concepts are not very clear to me.
Then I read [Domain Driven Design Quickly](https://www.infoq.com/minibooks/domain-driven-design-quickly/) book available on InfoQ.

I understand the need for using ubiquitous language and modeling the business logic where it belongs etc.
But overall, I was a bit confused wondering am I already following DDD???

In my Java/Spring applications, I have been following many concepts like **Entities, Aggregates, Value Objects, Repositories, Application Services** etc.
But some people were saying this is **Anemic Domain Model** with the **Transaction Script Pattern**, and it is bad.
Then, if I ask how to rewrite this following proper DDD, they won't give an answer. 
They tell you to read one of the 3 books mentioned above.

And, there is another group of people where if you ask how to apply DDD, then they suggest using 
the whole pack of **CQRS**, **Even Driven Architecture**, **Event Sourcing**, etc.

One fine day, I realized that many people simply parrot what they read without understanding it.

> **Litmus Test:**
> Ask them to explain something without telling "Martin Fowler / Uncle Bob/ Eric Evans said so".

## Motivations for Tomato Architecture
Following are some of the motivations that make me think about coming up with 
**Pragmatic Guidelines for Software Architecture**.

### There is No Silver Bullet Architecture
Duh, tell me something we don't already know, you might say.

True, we all know that, and yet we try to apply the silver bullet solutions 
(Clean / Onion / Hexagonal / Ports&Adapters Architectures) wherever possible.

A SaaS Product might need to be designed with a loose coupling in mind so that you can offer a choice to your clients 
which database they want to use.

But when an enterprise application is solving their own specific problem, then trying to introduce an abstraction 
with a hope that some day in the future, they can switch to another database/message-broker 
is unnecessary and over-engineering in many cases.

### Wrong pursuit of Testability
I don't know whether it is one of core principe or a by-product, but many people say
**Clean/Onion/Hexagonal/Ports&Adapters Architectures enables us to test our application using Unit Tests without depending on 
external services like databases, FileSystem, Message Brokers, etc.**

Maybe this _"Testability using Unit Tests without depending on external services like databases, FileSystem, Message Brokers, etc"_ 
is a good thing for certain types of applications. But in my experience, most of the enterprise business applications 
heavily depend on various external services like databases, FileSystem, Message Brokers, etc. 

No matter how many 1000s of unit tests you have, you will not have confidence in your software 
without having an Integration Test suite which actually talks to those real external dependencies.

So, I would say introducing the abstractions/indirections so that you can "unit test" your application 
without using any external services may not be a bright idea.
Instead, I would prefer to remove those abstractions and write more integration tests 
to ensure the correctness of the application functionality.

### Simplicity and Readability Wins in the Long Run
I hope we all will at least agree on this. Typically, enterprise software systems run for a long time(decades).
Simple and readable code is much easier to maintain and enhance in the long run.

Usually, developers join the team and leave after a while and new members join.
In such an environment, keeping the architecture as simple and boring as possible is very beneficial than 
making the project a playground for the over-enthusiastic developers/architects to flourish their resumes.

## Introducing Tomato Architecture

{{< figure src="/images/tomato-arc-logo.webp" alt="tomato-architecture-logo" >}}

There is absolutely nothing new in the [Tomato Architecture](https://github.com/sivaprasadreddy/tomato-architecture) that I am going to describe now.
It is just a **few good coding practices and architectural decisions to keep things simple** 
and bring back some sanity to prevent over-engineering.

Again, "Tomato" in the "Tomato Architecture" doesn't mean anything. Just like "Hexagon" in "Hexagonal Architecture" doesn't mean anything.
Don't dwell too much on the name.

> **IMPORTANT:**
> I have mostly worked on building enterprise applications solving their specific business problems.
> The guidelines I am going to propose as part of Tomato Architecture are aimed at such applications.

### Key Principles
* Think what is best for your software over blindly following suggestions by popular people.
* Strive to keep things simple instead of over-engineering the solution by guessing the requirements for the next decade.
* Do R&D, pick a technology and embrace it instead of creating abstractions with replaceability in mind.
* Make sure your solution is working as a whole, not just individual units.

### Architecture Diagram

{{< figure src="/images/tomato-architecture.webp" alt="tomato-architecture" >}}

### Implementation Guidelines

#### 1. Package by feature
A common pattern to organize code into packages is by splitting based on technical layers such as controllers, services, repositories, etc.
If you are building a Microservice which is already focusing on a specific module or business capability, then this approach might be fine.

If you are building a monolith or modular-monolith then it is strongly recommended to first split by features instead of technical layers.

For more info read: https://phauer.com/2020/package-by-feature/

#### 2. Keep "Application Core" independent of delivery mechanism (Web, Scheduler Jobs, CLI)
The Application Core should expose APIs that can be invoked from a main() method.
In order to achieve that, the "Application Core" should not depend on its invocation context.
Which means the "Application Core" should not depend on any HTTP/Web layer libraries.
Similarly, if your Application Core is being used from Scheduled Jobs or CLI then
any Scheduling logic or CLI command execution logic should never leak into Application Core.

#### 3. Separate the business logic execution from input sources (Web Controllers, Message Listeners, Scheduled Jobs etc)

The input sources such as Web Controllers, Message Listeners, Scheduled Jobs, etc should be a thin layer extracting the data
from request and delegate the actual business logic execution to "Application Core".

**DON'T DO THIS**

```java
@RestController
class CustomerController {
    private final CustomerService customerService;
    
    @PostMapping("/api/customers")
    void createCustomer(@RequestBody Customer customer) {
       if(customerService.existsByEmail(customer.getEmail())) {
           throw new EmailAlreadyInUseException(customer.getEmail());
       }
       customer.setCreateAt(Instant.now());
       customerService.save(customer);
    }
}
```

**INSTEAD, DO THIS**

```java
@RestController
class CustomerController {
    private final CustomerService customerService;
    
    @PostMapping("/api/customers")
    void createCustomer(@RequestBody Customer customer) {
       customerService.save(customer);
    }
}

@Service
@Transactional
class CustomerService {
   private final CustomerRepository customerRepository;

   void save(Customer customer) {
      if(customerRepository.existsByEmail(customer.getEmail())) {
         throw new EmailAlreadyInUseException(customer.getEmail());
      }
      customer.setCreateAt(Instant.now());
      customerRepository.save(customer);
   }
}
```

With this approach, whether you try to create a Customer from a REST API call or from a CLI,
all the business logic is centralized in Application Core.

**DON'T DO THIS**

```java
@Component
class OrderProcessingJob {
    private final OrderService orderService;
    
    @Scheduled(cron="0 * * * * *")
    void run() {
       List<Order> orders = orderService.findPendingOrders();
       for(Order order : orders) {
           this.processOrder(order);
       }
    }
    
    private void processOrder(Order order) {
       ...
       ...
    }
}
```

**INSTEAD, DO THIS**

```java
@Component
class OrderProcessingJob {
   private final OrderService orderService;

   @Scheduled(cron="0 * * * * *")
   void run() {
      List<Order> orders = orderService.findPendingOrders();
      this.processOrders(orders);
   }
}

@Service
@Transactional
class OrderService {

   public void processOrders(List<Order> orders) {
       ...
       ...
   }
}
```

With this approach, you can decouple order processing logic from scheduler
and can test independently without triggering through Scheduler.

#### 4. Don't let the "External Service Integrations" influence the "Application Core" too much
From the Application Core we may talk to database, message brokers or 3rd party web services, etc.
Care must be taken such that business logic executors not heavily depend on External Service Integrations.

For example, assume you are using Spring Data JPA for persistence, and
from your **CustomerService** you would like fetch customers using pagination.

**DON'T DO THIS**

```java
@Service
@Transactional
class CustomerService {
   private final CustomerRepository customerRepository;

   PagedResult<Customer> getCustomers(Integer pageNo) {
      Pageable pageable = PageRequest.of(pageNo, PAGE_SIZE, Sort.of("name"));
      Page<Customer> cusomersPage = customerRepository.findAll(pageable);
      return convertToPagedResult(cusomersPage);
   }
}
```

**INSTEAD, DO THIS**

```java
@Service
@Transactional
class CustomerService {
   private final CustomerRepository customerRepository;

   PagedResult<Customer> getCustomers(Integer pageNo) {
      return customerRepository.findAll(pageNo);
   }
}

@Repository
class JpaCustomerRepository {

   PagedResult<Customer> findAll(Integer pageNo) {
      Pageable pageable = PageRequest.of(pageNo, PAGE_SIZE, Sort.of("name"));
      return ...;
   }
}
```

This way any persistence library changes will only affect repository layer only.

#### 5. Keep domain logic in domain objects
If you have domain object state change methods that affect only that object or a method to calculate something
from the state of the object, then those methods belong to that domain object.

**DON'T DO THIS**

```java

class Cart {
    List<LineItem> items;
}

@Service
@Transactional
class CartService {

   CartDTO getCart(UUID cartId) {
      Cart cart = cartRepository.getCart(cartId);
      BigDecimal cartTotal = this.calculateCartTotal(cart);
      ...
   }
   
   private BigDecimal calculateCartTotal(Cart cart) {
      ...
   }
}
```

**INSTEAD, DO THIS**

```java

class Cart {
    List<LineItem> items;

   public BigDecimal getTotal() {
      ...
   }
}

@Service
@Transactional
class CartService {

   CartDTO getCart(UUID cartId) {
      Cart cart = cartRepository.getCart(cartId);
      BigDecimal cartTotal = cart.getTotal();
      ...
   }
}
```

#### 6. No unnecessary interfaces
Don't create interfaces with the hope that someday we might add another implementation for this interface.
If that day ever comes, then with the powerful IDEs we have now it is just a matter of extracting the interface in a couple of keystrokes.

If the reason for creating an interface is for testing with Mock implementation,
we have mocking libraries like Mockito which is capable of mocking classes without implementing interfaces.

So, unless there is a good reason, don't create interfaces.

#### 7. Embrace the framework's power and flexibility
Usually, the libraries and frameworks are created to address the common requirements that are required for majority of the applications.
So, when you choose a library/framework to build your application faster, then you should embrace it.

Instead of leveraging the power and flexibility offered by the selected framework,
creating an indirection or abstraction on top of the selected framework with the hope
that someday you might switch the framework to a different one is usually a very bad idea.

For example, Spring Framework provides declarative support for handling database transactions, caching, method-level security etc.
Introducing our own similar annotations and re-implementing the same features support
by delegating the actual handling to the framework is unnecessary.

Instead, it's better to either directly use the framework's annotations or compose the annotation with additional semantics if needed.

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Transactional
public @interface UseCase {
   @AliasFor(
        annotation = Transactional.class
   )
   Propagation propagation() default Propagation.REQUIRED;
}
```

#### 8. Test not only units, but whole features

We should definitely write unit tests to test the units(business logic), by mocking external dependencies if required.
But it is more important to verify whether the whole feature is working properly or not.

Even if our unit tests are running in milliseconds, can we go to production with confidence? Of course not.
We should verify the whole feature is working or not by testing with the actual external dependencies such as database or message brokers.
That gives us more confidence.

I wonder this whole idea of "We should have core domain completely independent of external dependencies" philosophy
came from the time when testing with real dependencies is very challenging or not possible at all.

Luckily, we have better technology now (ex: [Testcontainers](https://testcontainers.com/)) to test with real dependencies.
Testing with real dependencies might take slightly more time, but compared to the benefits, that's a negligible cost.

## Summary
The **Tomato Architecture** guidelines and principles came from my own experience of working with 
enterprise business applications with unnecessary complex abstractions. 

As I already mentioned, there is nothing new in these guidelines and I believe it's a good thing.
No need to learn one more fancy thing. 
The whole idea is to keep it simple, and I can tell you from my own experience that working with simple codebases is a joy.

In the beginning of our careers, we all have that craving for building complex systems with fancy and trendy technologies.
But if you stay longer in software development, you will start appreciating simple and boring stuff more and more.
