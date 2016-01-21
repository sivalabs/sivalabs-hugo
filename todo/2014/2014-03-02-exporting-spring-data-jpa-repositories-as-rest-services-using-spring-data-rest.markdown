---
author: siva
comments: true
date: 2014-03-02 07:56:00+00:00
layout: post
slug: exporting-spring-data-jpa-repositories-as-rest-services-using-spring-data-rest
title: Exporting Spring Data JPA Repositories as REST Services using Spring Data REST
wordpress_id: 219
categories:
- REST
tags:
- REST
---

Spring Data modules provides various modules to work with various types of datasources like RDBMS, NOSQL stores etc in unified way. In my previous article  [SpringMVC4 + Spring Data JPA + SpringSecurity configuration using JavaConfig](http://www.sivalabs.in/2014/03/springmvc4-spring-data-jpa.html) I have explained how to configure Spring Data JPA using JavaConfig.

Now in this post let us see how we can use Spring Data JPA repositories and export JPA entities as REST endpoints using Spring Data REST.

First let us configure spring-data-jpa and spring-data-rest-webmvc dependencies in our pom.xml.

[gist https://gist.github.com/sivaprasadreddy/9303075 /]

**Make sure you have latest released versions configured correctly, otherwise you will encounter the following error:**
java.lang.ClassNotFoundException: org.springframework.data.mapping.SimplePropertyHandler

Create JPA entities.

[gist https://gist.github.com/sivaprasadreddy/9303086 /]

Configure DispatcherServlet using **AbstractAnnotationConfigDispatcherServletInitializer**.

Observe that we have added **RepositoryRestMvcConfiguration.class** to **getServletConfigClasses()** method.
**RepositoryRestMvcConfiguration** is the one which does the heavy lifting of looking for Spring Data Repositories and exporting them as REST endpoints.

https://gist.github.com/sivaprasadreddy/9303094 /]

Create Spring Data JPA repositories for JPA entities.

[gist https://gist.github.com/sivaprasadreddy/9303133 /]

That's it. Spring Data REST will take care of rest of the things.

You can use spring Rest Shell [https://github.com/spring-projects/rest-shell](https://github.com/spring-projects/rest-shell) or Chrome's Postman Addon to test the exported REST services.

D:rest-shell-1.2.1.RELEASEbin>rest-shell
http://localhost:8080:>

Now we can change the baseUri using baseUri command as follows:
http://localhost:8080:>baseUri http://localhost:8080/spring-data-rest-demo/rest/
http://localhost:8080/spring-data-rest-demo/rest/>


http://localhost:8080/spring-data-rest-demo/rest/>list
rel         href
======================================================================================
users       http://localhost:8080/spring-data-rest-demo/rest/users{?page,size,sort}
roles       http://localhost:8080/spring-data-rest-demo/rest/roles{?page,size,sort}
contacts    http://localhost:8080/spring-data-rest-demo/rest/contacts{?page,size,sort}

Note: It seems there is an issue with rest-shell when the DispatcherServlet url mapped to "/" and issue list command it responds with "No resources found".

http://localhost:8080/spring-data-rest-demo/rest/>get users/

[gist https://gist.github.com/sivaprasadreddy/9303142 /]



You can find the source code at [https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/spring-data-rest-demo](https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/spring-data-rest-demo)
For more Info on Spring Rest Shell: [https://github.com/spring-projects/rest-shell](https://github.com/spring-projects/rest-shell)
