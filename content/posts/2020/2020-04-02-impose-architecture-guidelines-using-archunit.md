---
title: Imposing Code Structure Guidelines using ArchUnit
author: Siva
images: ["/images/ArchUnit-Logo.png"]
type: post
date: 2020-04-02T04:59:17+05:30
url: /2020/04/impose-architecture-guidelines-using-archunit/
categories:
  - Java
tags:
  - Java, BestPractices
---
While building the software we all agree, as a team, to follow a set of guidelines which are typically considered as best practices.
But during the development, developers might violate those guidelines unknowingly or ignorance.
Typically we rely upon **code reviews** or code quality checking tools like **SonarQube**, **PMD** etc to check for such violations.
But some of the guidelines could be opinionated decisions which might not be able to automate using SonarQube, PMD etc.

For example, typically I would like to follow the guidelines mentioned below for my Java based applications:

1. **Follow 3-tier layering structure** (Web, Service, Repository layers) where any layer can only talk to the immediate lower layer and lower layer must not talk to upper layer.
   i.e, Web layer can talk to Service layer, Service layer can talk to Repository layer. But Repository layer can't talk to Service or Web layer, Service layer can't talk to Web layer.

2. If the application is big we might want to follow **Package-By-Feature** where only the Web and Service components are public and rest of the components should be package-private in each feature package.

3. While using Spring dependency injection, **Don't use Field based injection** and prefer Constructor based injection.

Like this there could be many guidelines we want to follow. The good news is we can impose these guidelines as verifiable JUnit tests using [ArchUnit](https://www.archunit.org/).

![ArchUnit](/images/ArchUnit-Logo.png "ArchUnit")

Here is the [ArchUnit UserGuide](https://www.archunit.org/userguide/html/000_Index.html)

Let us see how we can use ArchUnit for testing our architecture guidelines.

Add the following **archunit-junit5** dependency.

```xml
<dependency>
    <groupId>com.tngtech.archunit</groupId>
    <artifactId>archunit-junit5</artifactId>
    <version>0.13.1</version>
    <scope>test</scope>
</dependency>
```

Let us see how we can apply various guidelines that I mentioned above.

### Rule 1: Services and Repositories should not talk to Web layer

```java
package com.sivalabs.moviebuffs;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.*;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {
      JavaClasses importedClasses = new ClassFileImporter()
          .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
          .importPackages("com.sivalabs.moviebuffs");

      noClasses()
          .that().resideInAnyPackage("com.sivalabs.moviebuffs.core.service..")
            .or().resideInAnyPackage("com.sivalabs.moviebuffs.core.repository..")
          .should()
            .dependOnClassesThat()
            .resideInAnyPackage("com.sivalabs.moviebuffs.web..")
          .because("Services and repositories should not depend on web layer")
          .check(importedClasses);
    }

}
```

The ArchUnit provides DSL that's pretty clear to understand the intent of the test. The above test code reads like English sentence and easy to understand what we are testing.

### Rule 2: Should follow Layered Architecture

In a typical SpringBoot application, **Service** layer depends on **Repository** layer, **Web** and **Config** layers depends on **Service** layer. **We don't want Web or Config layer directly talk to Repository layer.**

We can impose that restriction with the following test.

```java
@Test
void shouldFollowLayeredArchitecture() {
  JavaClasses importedClasses = new ClassFileImporter()
          .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
          .importPackages("com.sivalabs.moviebuffs");

  layeredArchitecture()
      .layer("Web").definedBy("..web..")
      .layer("Config").definedBy("..config..")
      .layer("Service").definedBy("..service..")
      .layer("Persistence").definedBy("..repository..")

      .whereLayer("Web").mayNotBeAccessedByAnyLayer()
      .whereLayer("Service").mayOnlyBeAccessedByLayers("Config", "Web")
      .whereLayer("Persistence").mayOnlyBeAccessedByLayers("Service")
      .check(importedClasses);
}
```

### Rule 3: Spring's @Autowired should NOT be used with Field based injection

```java
@Test
void shouldNotUseFieldInjection() {
    JavaClasses importedClasses = new ClassFileImporter()
          .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
          .importPackages("com.sivalabs.moviebuffs");

    noFields()
      .should().beAnnotatedWith(Autowired.class)
      .check(importedClasses);
}
```

### Rule 4: Should follow Naming convention

We might want to follow some naming conventions like all service class names should end with **Service** etc.

```java
@Test
void shouldFollowNamingConvention() {
    JavaClasses importedClasses = new ClassFileImporter()
        .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
        .importPackages("com.sivalabs.moviebuffs");
    classes()
        .that().resideInAPackage("com.sivalabs.moviebuffs.core.repository")
        .should().haveSimpleNameEndingWith("Repository")
        .check(importedClasses);

    classes()
        .that().resideInAPackage("com.sivalabs.moviebuffs.core.service")
        .should().haveSimpleNameEndingWith("Service")
        .check(importedClasses);
}
```

### Rule 5: Should use JUnit 5 only

We might want to use **JUnit 5** as our testing framework. But JUnit 4 dependency might have pulled into classpath as a transitive dependency (cough... **Testcontainers**... cough) and we might accidentally import JUnit4 classes/annotation such as **@Test**, **Assert** etc by mistake.

We can restrict the usage of JUnit 4 classes as follows:

```java
@Test
void shouldNotUseJunit4Classes() {
    JavaClasses classes = new ClassFileImporter()
        .importPackages("com.sivalabs.moviebuffs");

    noClasses()
        .should().accessClassesThat().resideInAnyPackage("org.junit")
        .because("Tests should use Junit5 instead of Junit4")
        .check(classes);

    noMethods().should().beAnnotatedWith("org.junit.Test")
        .orShould().beAnnotatedWith("org.junit.Ignore")
        .because("Tests should use Junit5 instead of Junit4")
        .check(classes);
}
```

I just described only a few of the possibilities and you can get as creative as you want :wink:

Please read the official [ArchUnit UserGuide](https://www.archunit.org/userguide/html/000_Index.html) on what are all the cool things you can do with **ArchUnit**.
