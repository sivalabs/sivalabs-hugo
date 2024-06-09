---
title: "Thymeleaf Layouts using Fragment Expressions in Spring Boot GraalVM Native Image"
author: Siva
images: ["/preview-images/thymeleaf-layouts.webp"]
type: post
draft: false
date: 2024-06-09T04:59:17+05:30
url: /thymeleaf-layouts-using-fragment-expressions
toc: true
categories: [SpringBoot]
tags: [SpringBoot, Thymeleaf, GraalVM]
---

Typically, in Spring Boot + Thyemleaf applications, 
we use [thymeleaf-layout-dialect](https://github.com/ultraq/thymeleaf-layout-dialect) 
to define the common layout of the web pages and it works fine. 

But when we compile the Spring Boot application to GraalVM native image,
it is failing due to [this error](https://github.com/ultraq/thymeleaf-layout-dialect/issues/235).
I tried many suggestions mentioned in the above issue, but none of them worked for me. 

Then [Oliver Drotbohm](https://twitter.com/odrotbohm) suggested me [Flexible layouts](https://www.thymeleaf.org/doc/tutorials/3.1/usingthymeleaf.html#flexible-layouts-beyond-mere-fragment-insertion) 
approach to create layouts support natively provided by Thymeleaf itself.
This approach works fine with GraalVM native image as well.

In this article, we will see how to create layouts using Thymeleaf without using thymeleaf-layout-dialect.

## Create a Spring Boot Application
Generate a Spring Boot application with **Web**, **Thymeleaf** and **GraalVM Native Support** dependencies using [Spring Initializr](https://start.spring.io/).

## Create Layout Template

Create a layout template `layout.html` in `src/main/resources/templates` directory.

```html
<!DOCTYPE html>
<html lang="en"
      xmlns:th="http://www.thymeleaf.org"
      th:fragment="layout (title, content, pageScripts)" >
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>MyApp - <th:block th:insert="${title}"/></title>
</head>
<body>
<main>
    <div id="app" class="container">
        <div th:block th:replace="${content}">
            <p>Layout content</p>
        </div>
    </div>
</main>
<th:block th:replace="${pageScripts}">
</th:block>
</body>
</html>
```

**Few things to note here:**

* The root html tag has **th:fragment="layout (title, content, pageScripts)"** attribute, which gives a name to the fragment and defines the parameters it accepts.
* The layout has three parameters: **title**, **content**, and **pageScripts**.
  * The **title** parameter is used to set the title of the page.
  * The **content** parameter is used to include the content of the page.
  * The **pageScripts** parameter is used to include the page-specific scripts.
* Some applications follow a pattern for the **title** as **"AppName - PageName"**. So, I have used the same pattern here.

## Create a Page Template
Let's create a page template `home.html` in `src/main/resources/templates` directory which uses the layout.

```html
<!DOCTYPE html>
<html lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      th:replace="~{layout :: layout(title=~{::title/text()},
                    content=~{::#content}, pageScripts=~{})}">
<head>
    <title>Home</title>
</head>
<body>
<div id="content">
    <h1>This is Home Page</h1>
    <a href="/">Home Page</a>
    <a href="/about">About Page</a>
</div>
</body>
</html>
```

**Few things to note here:**

* The root html tag has **th:replace="~{layout :: layout(...)}"** attribute, 
  which is using the fragment expression to specify which fragment to replace with.
  Here we are referencing the filename `layout.html` and the fragment name `layout`.
* Then, we are passing all the parameter values with named arguments.
* The **title** parameter is specified using the fragment expression **~{::title/text()}**.
  This refers to the text content of the <title> element in the current page template.
* The **content** parameter is specified using the fragment expression **~{::#content}**.
  This refers to the content of the <div id="content"> element in the current page template.
* The **pageScripts** parameter is specified using the fragment expression **~{}**.
  This refers to an empty fragment that can be used for specifying no markup.

Instead of specifying the parameter values using named-arguments, you can also specify them using default positional arguments as follows:

```html
<html lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      th:replace="~{layout :: layout(~{::title/text()}, ~{::#content},~{})}">
...
</html>
```

## Create Another Page Template
Let's create another page template `about.html` in `src/main/resources/templates` directory which uses the layout.

```html
<!DOCTYPE html>
<html lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      th:replace="~{layout :: layout(~{::title/text()}, ~{::#content},~{::#pageScripts})}">
<head>
    <title>About</title>
</head>
<body>
<div id="content">
    <h1>This is About Page</h1>
    <a href="/">Home Page</a>
    <a href="/about">About Page</a>
</div>
<th:block id="pageScripts">
<script src="/webjars/jquery/3.7.1/jquery.js"></script>
</th:block>
</body>
</html>
```

**Few things to note here:**

* We are passing the layout fragment parameters using positional arguments.
* The **pageScripts** parameter is specified using the fragment expression **~{::#pageScripts}**.
  This refers to the content of the **<div id="pageScripts">** element in the current page template.
  For this specific page, we are including a script tag that loads jQuery from the webjars.

## Run the Application
First, let's verify that the application is working fine without any issues.
Run the Spring Boot application and access the home page at `http://localhost:8080/`.

Now, lets compile the application to GraalVM native image and run it.

```shell
#Maven
./mvnw spring-boot:build-image -Pnative -DskipTests -Dspring-boot.build-image.imageName=thymeleaf-demo

#Gradle
./gradlew bootBuildImage -Pnative -x test --imageName=thymeleaf-demo

docker run -p 8080:8080 thymeleaf-demo
```

Access the home page at `http://localhost:8080/` and about page at `http://localhost:8080/about`.
You should be able to see the pages without any issues.

## Conclusion
Though creating layouts using fragment expressions is a bit verbose compared to **thymeleaf-layout-dialect**,
it works fine with GraalVM native image.

One of the main problems with **thymeleaf-layout-dialect** is that it uses Groovy under the hood, which has some problems with GraalVM native image.
There is an attempt to port **thymeleaf-layout-dialect** to Java, https://github.com/zhanhb/thymeleaf-layout-dialect, 
You can try it if you are interested.
