---
title: "Running your own Spring Initializr and using it from IntelliJ IDEA"
author: Siva
images: ["/images/start-spring-io.webp"]
type: post
draft: false
date: 2024-09-07T04:59:17+05:30
url: /running-custom-spring-initializr
toc: false
categories: [SpringBoot]
tags: [SpringBoot, IntelliJIDEA]
---
If you ever worked with **Spring Boot**, then you are probably aware of [Spring Initializr](https://start.spring.io/).
The Spring Initializr is a web application that you can use to create a Spring Boot application.

Do you know Spring Initializr itself is an [open-source Spring Boot application](https://github.com/spring-io/start.spring.io)?
You can fork it, customize it, deploy on your infrastructure and use it to generate Spring Boot applications.

The next question would be what kind of customizations I can do? Why should I bother to host it myself?

Imagine you are working for a large enterprise organization that uses Spring Boot for building various applications.
To improve developer productivity, you might have created your own spring-boot starters that provide your domain-specific functionality.
Now, you may want to make those custom starters available in the Spring Initializr.
This is where you can customize the Spring Initializr to make those custom starters available in the starter list.
This is one of the usecase only, but you can customize other aspects of code generation as you see fit for your needs.

Let me demonstrate how you can customize the Spring Initializr to add a new dependency support.
While building Spring Boot applications, I often use [RestAssured](https://rest-assured.io/) for testing REST APIs.
Let's customize the Spring Initializr to add RestAssured dependency support.

## Run Spring Initializer Locally

1. Clone start.spring.io GitHub repository
    ```shell
    $ git clone https://github.com/spring-io/start.spring.io.git
    ```
2. Build and run the application as described in the README.
    ```shell
    $ ./mvnw clean install
    $ cd start-site
    $ ../mvnw spring-boot:run
    ```
3. Now you should be able to access locally running Spring Initializer at [http://localhost:8080](http://localhost:8080).
You can generate a Spring Boot application using this local service just like you would with https://start.spring.io.

{{< box warning >}}
**Slow Response for first requests**

When you run the Spring Initializer locally and try to generate the application, for the first time
it may take some time (10+ seconds). From the next time onwards, it will be faster.
{{< /box >}}

## Add RestAssured Dependency Support
All the dependencies(starters) that we see when we click on **ADD DEPENDENCIES** button 
are configured in the **start-site/src/main/resources/application.yml** file.

Now, let's add the following **RestAssured** dependency configuration under **Testing** group after **Testcontainers** configuration.

```yaml
...
...
- name: Testcontainers
  id: testcontainers
  description: Provide lightweight, throwaway instances of common databases, Selenium web browsers, or anything else that can run in a Docker container.
  groupId: org.testcontainers
  artifactId: junit-jupiter
  scope: test
  starter: false
  links:
    - rel: reference
      href: https://java.testcontainers.org/
- name: RestAssured
  id: rest-assured
  description: TestAssured for testing REST APIs
  groupId: io.rest-assured
  artifactId: rest-assured
  scope: test
  starter: false
  links:
    - rel: reference
      href: https://rest-assured.io/
...
...
```

Stop the running application and restart:

```shell
$ ../mvnw spring-boot:run
```

Now you should be able to see **RestAssured** dependency under **Testing** category.

{{< figure src="/images/local-spring-initializr.webp" alt="Spring Initializer" >}}

{{< box tip >}}
**Clear Browser Cache**

Your browser might have cached the previous responses and doesn't show you **RestAssured** dependency.
From your browser, try to **Empty Cache and Hard Reload**.
{{< /box >}}

Now, if you generate a Spring Boot application with **RestAssured** dependency selected, 
then your build file should have the **RestAssured** dependency added.

```xml
<!-- Maven -->
<dependency>
   <groupId>io.rest-assured</groupId>
   <artifactId>rest-assured</artifactId>
   <scope>test</scope>
</dependency>

<!-- Gradle -->
testImplementation 'io.rest-assured:rest-assured'
```

## Using Custom Spring Initializr from IntelliJ IDEA Ultimate Edition.
IntelliJ IDEA Ultimate Edition provides [extensive support for Spring Boot](https://www.jetbrains.com/idea/spring/) including a dedicated project wizard.
IntelliJ IDEA under the hood uses https://start.spring.io to create Spring Boot applications.
We can customize the default **Server URL** to **http://localhost:8080**.

{{< figure src="/images/spring-default-server-url.webp" alt="Spring Initializer Server URL" >}}

{{< figure src="/images/spring-local-server-url.webp" alt="Spring Initializer Local URL" >}}

Now we should be able to see **RestAssured** dependency as follows:

{{< figure src="/images/rest-assured-starter.webp" alt="Spring Initializer RestAssured starter" >}}

## Summary
Spring Initializr is a Spring Boot application that powers the widely used https://start.spring.io.
You can customize and extend its functionality to support your needs.
If your organization has custom starters, want to generate the initial application with some customizations,
you can host your own Spring Initializr.
You can also configure your IntelliJ IDEA to use your own custom Spring Initializr to generate Spring Boot applications.
