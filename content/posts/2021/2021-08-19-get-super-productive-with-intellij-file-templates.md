---
title: Get Super Productive with Intellij File Templates
author: Siva
images: ["/preview-images/career-lessons.webp"]
type: post
draft: false
date: 2021-08-19T04:59:17+05:30
url: /2021/08/get-super-productive-with-intellij-file-templates/
categories: [IDE]
tags: [Java, SpringBoot, IDE, Intellij, Productivity]
---

[Intellij IDEA](https://www.jetbrains.com/idea/) is the most popular IDE for **Java** development and there are tons of features to explore and become more productive.
We all know about [Live Templates](https://www.jetbrains.com/help/idea/using-live-templates.html) which can be used to expand a small expression to common code snippets.

Recently I came to know about **File Templates**, and I realized I can put it to good use and be more productive.

First let us discuss the problem I was trying to solve with File Templates.

I work with **SpringBoot** a lot, and I work on implementing REST APIs in most of my projects.

So how do I create a REST Controller?

* Create a Class, say **CustomerController**
* Add **@RestController** to make a Spring REST Controller
* Add **@RequestMapping("/api")** so that common prefix need not be repeated for every handler method in that controller
* Add Lombok's **@RequiredArgsConstructor** and **@Slf4j** to generate a Constructor with all the final fields and to have SLF4J logger.

This is pretty standard pattern that I follow, but it is too much manual typing.
I always wished if there is an option to create a Spring Rest Controller directly similar to how we create a Class.

Intellij IDEA File Templates can help to solve this problem.

## Creating Single File Templates

Let's create a Single File Template to create Spring REST Controller.

* Go to Preferences -> Editor -> File and Code Templates
* On Files tab click on + (Create Template)
* Enter Name as : **Spring REST Controller**, and leave Extension as **java**
* In the Content text box add the following content

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ${NAME} {

}

```

* Click OK

Nothing magical here, the first line is a **Velocity** template expression.
We are checking whether you are creating this class in a package or in default package then adding package statement if required.

* **${PACKAGE_NAME}** represents the package name in which you are creating this class.
* **${NAME}** represents the class name you are going to provide.

There are many more [Predefined template variables](https://www.jetbrains.com/help/idea/file-template-variables.html#predefined_template_variables) if you want to use.

Now if we go to create a new Class we can see a new option **Spring REST Controller**.

{{< figure src="/images/spring-rest-controller-ft.webp" height="450" width="480" >}}

If I give the class name as **ProductController** then class will be created with following content.

```java
package com.sivalabs.demo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

}
```

Wooohoooo!!!

Why to just stop at Controller alone, let's create template for Spring Data JPA Repositories and JPA Entity as well.

### Spring Data JPA Repository Template
Usually I name Spring Data JPA Repositories as **&lt;EntityName&gt;Repository**. Let's create a template for that.

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end
#set ($index = $NAME.indexOf('Repository'))
#set ($ENTITY= $NAME.substring(0, $index))

import org.springframework.data.jpa.repository.JpaRepository;

public interface ${NAME} extends JpaRepository<$ENTITY, Long> {
}
```

Except those **#set** directives everything else looks same only.
Those **#set** statements are Velocity directives, and we are defining variables here.
We are stripping of 'Repository' from the interface name and storing it in $ENTITY variable and using it as generic argument for **JpaRepository**.

### JPA entity Template
Let's create a bare minimum JPA Entity structure with Lombok's **@Setter** and **@Getter**

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Setter
@Getter
@Entity
@Table(name = "${NAME}")
public class ${NAME} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

}
```

Cool, now whenever you try to create a class you see these 3 options:

{{< figure src="/images/multiple-single-fts.webp" height="450" width="480" >}}

This is already looks nice, but **how about creating all Controller, Service, Repository and Entity in one go**?
Fantastic, isn't it?  Intellij IDEA also support Templates with multiple files.

## Templates with multiple files﻿
We can create a parent template and add child templates to it so that when you generate a class with parent template it will generate all child template classes as well.

Let's first define what is the requirement for us.

I want to generate API boilerplate code by just giving the JPA Entity name. 
Then IDE should generate the following:

* JPA entity class **some.parent.package.entities.MyEntity**
* Spring Data JPA Repository **some.parent.package.repositories.MyEntityRepository**
* Spring Service class **some.parent.package.services.MyEntityService**  
* Rest Controller **some.parent.package.controllers.MyEntityController**

### 1. Create a Parent Template

Create a Parent Template and give name as **Generate Boilerplate For Entity** and add the following in the content area.

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

#set( $CamelCaseName = "$NAME.substring(0,1).toLowerCase()$NAME.substring(1)" )

class Dummy{}
```

> It seems there is a limitation that Parent template should generate a class, otherwise it is failing. So generating a Dummy class.

We are setting template variable **$CamelCaseName** which is a camelCased value of entity.

Ex: If entity name is **UserAccount** then **$CamelCaseName** value is **userAccount**.

### 2. Create Child Template for JPA Entity

* Select the parent template and click on **Create Child Template File** button
* Enter File name as **entities/${NAME}**
* Enter Content as follows

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Setter
@Getter
@Entity
@Table(name = "${NAME}")
public class ${NAME} {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
}
```

We have given the File name as **entities/${NAME}** so that entity will be created in **entities** sub-package under the selected package.

### 2. Create Child Template for Spring Data JPA Repository

* Select the parent template and click on Create Child Template File button
* Enter File name as **repositories/${NAME}Repository**
* Enter Content as follows

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end

import org.springframework.data.jpa.repository.JpaRepository;
import ${PACKAGE_NAME}.entities.${NAME};

public interface ${NAME}Repository extends JpaRepository<${NAME}, Long> {
}
```


### 3. Create Child Template for Service

* Select the parent template and click on Create Child Template File button
* Enter File name as **services/${NAME}Service**
* Enter Content as follows

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end
#set( $CamelCaseName = "$NAME.substring(0,1).toLowerCase()$NAME.substring(1)" )

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ${PACKAGE_NAME}.repositories.${NAME}Repository;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class ${NAME}Service {
    private final ${NAME}Repository ${CamelCaseName}Repository;
    
}
```

### 4. Create Child Template for REST Controller

* Select the parent template and click on Create Child Template File button
* Enter File name as **controllers/${NAME}Controller**
* Enter Content as follows

```java
#if (${PACKAGE_NAME} && ${PACKAGE_NAME} != "")package ${PACKAGE_NAME};#end
#set( $CamelCaseName = "$NAME.substring(0,1).toLowerCase()$NAME.substring(1)" )

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ${PACKAGE_NAME}.services.${NAME}Service;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ${NAME}Controller {
    private final ${NAME}Service ${CamelCaseName}Service;
    
}
```

>If you are a keen observer you should have noticed that we are repeating the **$CamelCaseName** expression in multiple child templates.
According to [Intellij docs](https://www.jetbrains.com/help/idea/templates-with-multiple-files.html) variables defined in Parent template should have been available in Child templates. 
But, unfortunately they are rendering as empty values for me...probably a bug.

We are all set, now. Let's test it now.

If we go and try to create a class we will see the following option:

{{< figure src="/images/multiple-file-templates.webp" height="450" width="480" >}}

Now if you give the class name as **Customer** and select **Generate Boilerplate for Entity** then it will generate all Entity, Repository, Service and Controller.

This is amazing, and we can go on to create templates for other common classes we create.

## Few feature requests
There are few things that I would like Intellij IDEA to improve upon **File and Code templates**.

1. Ability to generate Multiple files without requiring Parent should generate a class or interface restriction. Because of this restriction we had to create that Dummy class.
2. Ability to show or hide the child templates in New Class Dialog. Also, child template names are being shown as **Generate Boilerplate for Entity.java.child.0**, **Generate Boilerplate for Entity.java.child.1** etc. If there is a way to give an alias for the child templates it would be nice.

Happy coding :-)
