---
author: siva
comments: true
date: 2014-03-02 06:31:00+00:00
layout: post
slug: springmvc4-spring-data-jpa-springsecurity-configuration-using-javaconfig
title: SpringMVC4 + Spring Data JPA + SpringSecurity configuration using JavaConfig
wordpress_id: 220
categories:
- Hibernate
- JPA
- SpringMVC
- SpringSecurity
tags:
- Hibernate
- JPA
- SpringMVC
- SpringSecurity
---

In this article we will see how to configure and integrate SpringMVC4, Spring Data JPA with Hibernate and SpringSecurity using JavaConfig.

1. First let's configure all the necessary dependencies in **pom.xml**

[gist https://gist.github.com/sivaprasadreddy/9302291 /]

2. Configure database connection properties and email settings in **application.properties**

[gist https://gist.github.com/sivaprasadreddy/9302302 /]

3. Configure common Service Layer beans such as **PropertySourcesPlaceholderConfigurer** and **JavaMailSender **etc in **com.sivalabs.springapp.config.AppConfig.java**

[gist https://gist.github.com/sivaprasadreddy/9302313 /]

Observe that we have excluded the package "**com.sivalabs.springapp.web.***" from component scanning using new **REGEX excludeFilter **type.
If we don't exclude web related packages and tries to run JUnit test for service layer beans we will encounter the following Exception:

**java.lang.IllegalArgumentException: A ServletContext is required to configure default servlet handling**

Also note that we have enabled Caching using **@EnableCaching**, so we should declare **CacheManager **bean.

4. Configure Persistence Layer beans in **com.sivalabs.springapp.config.PersistenceConfig.java** as follows:

[gist https://gist.github.com/sivaprasadreddy/9302322 /]

Here we have configured DataSource and JPA EntityManagerFactory bean using Hibernate implementation.
Also we have configured DataSourceInitializer bean to initialize and populate our tables with seed data. We can enable/disable executing this **db.sql** script by changing init-db property value in application.properties.
And finally we have enabled Spring Data JPA repositories scanning using **@EnableJpaRepositories** to scan "**com.sivalabs.springapp.repositories**" package for JPA repository interfaces.

5. Now let us configure Web related beans in **com.sivalabs.springapp.web.config.WebMvcConfig.java**

[gist https://gist.github.com/sivaprasadreddy/9302326 /]

6. Configure DispatcherService using **AbstractAnnotationConfigDispatcherServletInitializer** convinient class.

[gist https://gist.github.com/sivaprasadreddy/9302337 /]

Here few things to note are we configured **AppConfig.class** as RootConfig classes and **WebMvcConfig.class** as ServletConfigClasses which is similar to how we configure in **web.xml** using ContextLoaderListener and DispatcherServlet's contextConfigLocation .
Also we have registered **OpenEntityManagerInViewFilter** to enable lazy loading of JPA entity graphs in view rendering phase.

7. Let us configure SpringSecurity.

First let us create a **SecurityUser** class which extends our application specific **User** class and implements **org.springframework.security.core.userdetails.UserDetails**.

[gist https://gist.github.com/sivaprasadreddy/9302340 /]

We will implement a custom **UserDetailsService** and use Spring Data JPA repositories to load User details.

[gist https://gist.github.com/sivaprasadreddy/9302345 /]

Now create **com.sivalabs.springapp.config.SecurityConfig.java** which contains SpeingSecurity related bean definitions.

[gist https://gist.github.com/sivaprasadreddy/9302351 /]

Update **SpringWebAppInitializer** which we created eariler to add **SecurityConfig** configuration class.

[gist https://gist.github.com/sivaprasadreddy/9302357 /]

As per our SpringSecurity custom Form Login configuration, we will use the following login form in **login.jsp**.

[gist https://gist.github.com/sivaprasadreddy/9302375 /]

Once we successfully login we can obtain the authenticated use details using **** and secure parts of the view using **** as follows:

[gist https://gist.github.com/sivaprasadreddy/9302382 /]

You can find the source code at github [https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo](https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo)

**There are few issues while running the same application on JBoss AS 7.1. I have made few changes to run on JBossAS7.1 and published code at [https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo-jboss7](https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo-jboss7)**
