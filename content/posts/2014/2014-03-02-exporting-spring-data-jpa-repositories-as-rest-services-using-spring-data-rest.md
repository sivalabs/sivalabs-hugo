---
title: Exporting Spring Data JPA Repositories as REST Services using Spring Data REST
author: Siva
type: post
date: 2014-03-02T02:26:00+00:00
url: /2014/03/exporting-spring-data-jpa-repositories-as-rest-services-using-spring-data-rest/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/03/exporting-spring-data-jpa-repositories.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2222771119069867692
post_views_count:
  - 20
categories:
  - Spring
tags:
  - REST

---
Spring Data modules provides various modules to work with various types of datasources like RDBMS, NOSQL stores etc in unified way. In my previous article  [SpringMVC4 + Spring Data JPA + SpringSecurity configuration using JavaConfig][1] I have explained how to configure Spring Data JPA using JavaConfig.

Now in this post let us see how we can use Spring Data JPA repositories and export JPA entities as REST endpoints using Spring Data REST.

First let us configure spring-data-jpa and spring-data-rest-webmvc dependencies in our pom.xml.

<div class="gist-oembed" data-gist="sivaprasadreddy/9303075.json">
</div>

**Make sure you have latest released versions configured correctly, otherwise you will encounter the following error:**
  
<span style="color: red;">java.lang.ClassNotFoundException: org.springframework.data.mapping.SimplePropertyHandler</span>

Create JPA entities.

<div class="gist-oembed" data-gist="sivaprasadreddy/9303086.json">
</div>

Configure DispatcherServlet using **AbstractAnnotationConfigDispatcherServletInitializer**.

Observe that we have added **RepositoryRestMvcConfiguration.class** to **getServletConfigClasses()** method.
  
**RepositoryRestMvcConfiguration** is the one which does the heavy lifting of looking for Spring Data Repositories and exporting them as REST endpoints.

https://gist.github.com/sivaprasadreddy/9303094 /]

Create Spring Data JPA repositories for JPA entities.

<div class="gist-oembed" data-gist="sivaprasadreddy/9303133.json">
</div>

That&#8217;s it. Spring Data REST will take care of rest of the things.

You can use spring Rest Shell <https://github.com/spring-projects/rest-shell> or Chrome&#8217;s Postman Addon to test the exported REST services.

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

<span style="color: red;">Note: It seems there is an issue with rest-shell when the DispatcherServlet url mapped to &#8220;/&#8221; and issue list command it responds with &#8220;No resources found&#8221;.</span>

http://localhost:8080/spring-data-rest-demo/rest/>get users/

<div class="gist-oembed" data-gist="sivaprasadreddy/9303142.json">
</div>

<div>
  You can find the source code at <a href="https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/spring-data-rest-demo">https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/spring-data-rest-demo</a><br /> For more Info on Spring Rest Shell: <a href="https://github.com/spring-projects/rest-shell">https://github.com/spring-projects/rest-shell</a>
</div>

 [1]: http://www.sivalabs.in/2014/03/springmvc4-spring-data-jpa.html