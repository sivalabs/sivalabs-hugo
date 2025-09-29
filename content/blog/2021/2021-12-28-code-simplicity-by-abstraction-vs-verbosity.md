---
title: Code simplicity by Abstraction vs Verbosity
author: Siva
images:
  - /preview-images/dev-thinking.webp
type: post
draft: false
date: 2021-12-27T23:29:17.000Z
url: /blog/code-simplicity-by-abstraction-vs-verbosity/
categories:
  - GoLang
tags:
  - GoLang
  - Java
  - Thoughts
aliases:
  - /code-simplicity-by-abstraction-vs-verbosity/
---
Java is and has been the primary programming language I have used throughout my career.
If I want to build something quick for a prototype or if I need to pick the tech stack with a tight deadline then Java is my first choice.
Especially after Java 8 it becomes more and more feature rich and powerful. 

<!--more-->


On top of it with frameworks like [SpringBoot](https://spring.io/projects/spring-boot), [Quarkus](https://quarkus.io/) and [Micronaut](https://micronaut.io/) building enterprise grade applications becomes a breeze.
**When people from Non-Java community complain about Java being verbose and complex, I actually don't get it.**

In the recent years I got a chance to work with [Go](https://go.dev/) and [DotNet Core](https://dotnet.microsoft.com/en-us/) in my official projects.
In addition to that I worked with **NodeJS** and **Python** a bit for my personal use.

I understand why many people like **NodeJS** and **Python** because they are kind of **Batteries Included**.
For the same task in Java you might need to include external libraries whereas in Python/NodeJS the standard library itself provide most of the commonly used features in a non-verbose way.
If you are familiar with **Kotlin** then you feel right at home while working with **C#**. 

Go is an interesting language and I have shared [my opinion on Go](https://www.sivalabs.in/golang-from-a-java-developer-perspective/) a while ago when I first worked with it.

**My first impression of Go**

{{< figure src="/images/java-is-verbose.webp" >}}

Have you ever seen a movie and doesn't like it much but a couple of scenes are top-notch which makes you watch the same movie again just to see those awesome scenes?
I had that kind of experience with Go. I didn't like it much when I first used it, but few things about Go stuck with me. One of it being Simplicity.

Okay, let's take a look at the following Java/SpringBoot code.

```java
@Service
@Transactional
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final AddressRepository addressRepository;

    public void createCustomer(Customer customer) {
        customerRepository.save(customer);
        addressRepository.saveCustomerAddress(customer.getAddress());
    }
}
```

This snippet of code shouldn't need any explanation for any Java developer who used SpringBoot at-least once.
But there is a lot going on here.

* The **CustomerService** is marked as a Spring bean which can be injected into other Spring beans
* Since Spring 4.x no need to add **@Autowired** annotation on constructor. If there is only one constructor it will be automatically used to create the bean.
* The class is annotated with **@Transactional** which means when someone calls **createCustomer()** method a DB transactions will be started and committed upon successful completion.
* If **customerRepository.save()** or **addressRepository.saveCustomerAddress()** method throws any **RuntimeException** then transaction will be automatically rolled-back.
* If **CustomerService.createCustomer()** is being called from another transactional method from a different class then instead of starting a new transaction it will run in the parent transaction.

While this looks familiar and easy to read, there are lots of things happening under the hood.

> To fully understand how this simple method behave, one needs to have all the above-mentioned **"How Spring & SpringBoot works behind the scenes"** knowledge.

Here I am showing SpringBoot code as an example, but it is the same for Quarkus or Micronaut frameworks also.

Let's take a look at the following Go code which does same as above:

```golang
type CustomerService struct {
   customerRepository CustomerRepository
   addressRepository AddressRepository
}

func (c CustomerService) createCustomer(customer Customer) error {
    // Get a Tx for making transaction requests.
    tx, err := db.BeginTx(ctx, nil)
    if err != nil {
        return err
    }
    // Defer a rollback in case anything fails.
    defer tx.Rollback()
    
    err := customerRepository.save(tx, customer)
    if err != nil {
        return err
    }
    err = addressRepository.saveCustomerAddress(tx, customer.Address)
    if err != nil {
        return err
    }
    // Commit the transaction.
    if err = tx.Commit(); err != nil {
        return err
    }
    return nil
}
```

Well, this is a typical Go implementation of the same functionality we implemented above.
Assuming it does what it intends to do, at a first glance this is what I feel:

* It's a lot verbose with error check for every 3rd statement
* DB transaction handling is all over the place, and we may need to repeat the same for all the DB interacting methods.
* Business logic and low-level technical details(error/transaction handling) are tangled

> But, there is no hidden-magic. A 20+ years experienced dev can read and understand this code in the same as 
a six-month experienced grad can read and understand it.

**I know, I know...You are shouting at me "there is no magic...it is magic only if you don't understand how it works"**

This point leads me to the next point I want to discuss.
But first let's not jump to the conclusions of which language is better because that is not the intention of this article.

## What is the biggest challenge developers facing during software development?
We all know that we spend more time reading existing code than writing new code. 
In a typical long-term enterprise application development, existing developers leave and new developers join the project and the biggest challenge is making sense of existing code. If the code is simple then it is easy to understand. 

**But quantifying "code simplicity" is not easy.** What looks simpler to you, might look complex to me and vice-versa. 
So we(developers and community) try our best to find ways to write code as simple as possible.
Different communities take different approach based on the context, timing, need etc.

Here is my opinion on how Java and Go take a different approach to attain code simplicity.

### Java's approach : Abstractions
I feel Java's standard library is too low-level and verbose to perform many common tasks like reading a file, making an HTTP call etc.
To avoid the boilerplate and verbosity, libraries like **commons-lang**, **Guava** etc are created providing higher-level abstractions shielding all the low-level details from developer.

On top of it, many enterprise application needs a common set of features like **logging**, **configuration**, **monitoring** etc. 
So frameworks are created to address these common needs abstracting away the common application level boilerplate code.

> Over the time there are abstractions on top of abstractions on top of abstractions...

Well, those abstractions help you build the application faster by taking care of application-level boilerplate code and letting you focusing on business logic.

> The only expectation from the developers is "Understand how those abstractions work under the hood and be productive with the frameworks/libraries" 

**In my view this is where things are going wrong terribly.** 

Now every company wants fullstack developers who can write front-end, back-end and a bit of infra-as-code too.
There is no time to learn properly how all these abstractions work under the hood. 
To meet the delivery timelines developers want to get things done as quickly as possible.
Add these 2 annotations over there and these 4 lines of configuration over here and if it is working then it's done. 
If encountered any error, apply the first suggestion from stackoverflow and if it works then it's done.
The work is done but without any clue on how it actually works. 

Over the time this mode of working puts a fear in the head saying "Java is complex".

### Go's approach : Clarity/Verbose over Clever
The Go community prefer to keep code simple by means of "no-magic" which means no annotation, no reflection, no ORMs etc.
There are good number of libraries for ORM, Http Routers etc but Go community prefers "If at all possible stick with Standard Library" approach.

Go community seems to prefer writing more clear and verbose code than creating clever higher abstractions.
The best part is with Go's standard library you can achieve most of the application needs without needing external dependencies, of course with more lines of code.

> The trade-off for verbosity is "Anybody with a bit of Go familiarity can easily read any idiomatic Go code and understand it"

If you are a Go admirer by now you might get pissed-off reading "verbosity" again and again and ask what do you mean by verbosity?
Well, the error checks for almost every 3rd line, the way we can check if a map contains a key etc all looks verbose to me. Personal opinion.

Based on my limited experience with Go, I am liking it so much because of it's "boring" nature.
To learn Go I am reading many articles and open source codebases on GitHub and there aren't too many new things to learn.

**After seeing few Go code repositories I was like 'meh, the next one will be similar with same core features with different business logic'.
From the enterprise long-term application development point of view this is an awesome thing. Less magic to learn and easy to onboard new developers.**

## How can we make Java "Simpler"?
Java is the preferred choice in large enterprises for a reason. Speed of development and quick to market.
I can confidently say you can create production grade Java application using SpringBoot/Quarkus/Micronaut in few hours, not in weeks or months.
As these frameworks already provides the application skeleton with batteries included all you need to do is write business logic.

If I can take few ideas from Go and brought them to Java, specifically to SpringBoot, then those would be:

* No ORMs unless it is simple CRUD application. I prefer to spend the one-time cost of writing more code than recurring debugging cost. I would prefer [JOOQ](https://www.jooq.org/) over **JPA**.
* I know backwards compatibility is one of the key reasons for Java/SpringBoot's success. But I like to strip of few things from SpringBoot
  * Support for XML config, I don't see any greenfield projects using XML config. XML support could be extracted as a separate module.
  * No need for [loading config properties from 14 different sources](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
  * Some simpler ways to use and debug AOP ( if you ever tried to debug AOP code then you know what I am talking about)
  * **Quarkus** like **live-reloading** and **continuous testing**
* Do we really need **"com.mycompany.myproject.mymodule"** packaging structure for private business applications? For opensource libraries yes, but for business applications??

## Summary
Once you start working with multiple languages you may start questioning the status quo. 
You may look at things a bit differently and bring back some good habits to your beloved programming language.
I think "Code Simplicity" is an undervalued trait of software development and, we need to put more focus on code readability and simplicity.

If you are a Java developer who never tried Go, I highly recommend taking a look at Go. 
You may or may not like Go entirely but there will be few things you will fall in love with.

Having said all this, **"Java is and will always be my favourite language"** and it feels good to learn things from other languages.

Wish you all a very happy new year :-)
