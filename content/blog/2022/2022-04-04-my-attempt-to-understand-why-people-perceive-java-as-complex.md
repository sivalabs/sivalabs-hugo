---
title: My attempt to understand why people perceive Java as complex
author: Siva
images:
  - /preview-images/group-discussion.webp
type: post
draft: false
date: 2022-04-03T23:29:17.000Z
url: /blog/my-attempt-to-understand-why-people-perceive-java-as-complex/
categories:
  - Java
tags:
  - Java
  - Thoughts
aliases:
  - /my-attempt-to-understand-why-people-perceive-java-as-complex/
---

I work as an Architect/TechLead/SeniorDeveloper depending on client engagement. 
And, **Java** is the primary programming language that I have used most of my career.
In recent years I got an opportunity to work with **Go**, **NodeJS** and **.Net Core** technologies too.
I find Java, especially with **SpringBoot**, a solid platform to build enterprise grade applications.

<!--more-->


Occasionally there comes a discussion of technology selection, and I noticed some people don't prefer/like Java.
Also, on social media I see a lot of jokes on Java's complexity. 
While I enjoy the humour out of it, it makes me wonder why so many people perceive Java as complex??!!
An annoying thing is some people who just started their careers and never worked with Java at all also has a strong opinion that "Java is complex"..

Some experienced developers also has the opinion that "Java is complex" based on their prior 2004 timeframe experience.
It is understandable though. How many of us who worked with JSF 1.x pledged to never touch a JSF project again in our lifetime??!!
Even though JSF 2 is lot better, still some people don't like to try JSF again. I think same is happening for "Java" as a whole.

But, **it would be a mistake just ruling out it is all because of past bad experience and not understanding why some people see Java as complex**.
Maybe there are problems which we are not seeing them as problems because we are habituated to it so much that we don't see them as problems anymore.
Also, there may be better programming language/platforms which we are not realizing.
It would be good to hear from the people so that we can make better decisions while picking tech stack for next project. 

So I asked this on Twitter:

{{< x user="sivalabs" id="1509905489911762950" >}}

I got plenty of replies from newbies, experts and some industry legends as well.

The interesting thing is along with criticism on Java issues, there is a lot of appreciation to Java platform as well.

I tried to categorize all those replies and added my view on it. 

So, here it goes :-)


## 1. Poor Getting Started Experience
As a developer with more than 15+ years of Java development experience I know my way around Java ecosystem.
I know which flavor of JDK I want to install, how to manage multiple JDK versions, what IDEs are available, 
build tools, the commonly used libraries etc.

Let's take a look at how a newbie getting started with Java experience looks like:

* I want to install Java and my initial google search makes me land on https://www.oracle.com/java/technologies/downloads/
* I am not sure whether Oracle JDK is free to use or commercial one, I want to use free open-source one.
* Upon exploring further I learned there are free alternatives like **OpenJDK, AdoptOpenJDK, Amazon Correto, Microsoft OpenJDK, Zulu, Temurin**. 
  What are the differences among those variations? God knows, anyway let me go with OpenJDK.
* Installed OpenJDK, set JAVA_HOME and added JAVA_HOME/bin to PATH, and I am good to go.
* Opened VS Code, created a .java file, copy-pasted infamous HelloWorld program and did **javac HelloWorld.java** nad **java HelloWorld** ... voila...
* Let me write a test. Google suggested to use **JUnit**.
* How to use JUnit library? Again upon a bit of googling most of the articles showed using JUnit with **Maven** or **Gradle**.
* What is Maven/Gradle? Okay, they are build tools. Let me install Maven/Gradle, done..cool.
* How to create a Maven/Gradle project? Most of the tutorials are showing project creation using Eclipse or Intellij Idea. So now I need to install an IDE.
* After creating a Maven/Gradle project from IDE it seems downloading half of the internet for my HelloWorld project...okay no problem..I have good internet connection.

It's not as easy as it can be, but it's not so much terrible either. Also, many of these tasks are one time setup.
However, there are some uncertainties, and gives an impression of Java needs complex setup and can't work with Java without heavy IDE setup.

Compare this to "Getting started experience" of a JavaScript/NodeJS developer.
* Install NodeJS based on your OS
* Build stuff
```shell
$ npm init --yes
$ npm install express
$ npm start
$ npm test
$ npm build
```

NodeJS comes with a built-in default package-manager **npm**, a way to manage 3rd party dependencies. 
If I am not happy with **npm** then I can go for **yarn** or **pnpm**, but I got the toolchain to perform common tasks out of the box.

This is way easier getting started experience compared to Java.

### How Java Pros do it?
Luckily there is much easier way to get started with Java using [SDKMAN](https://sdkman.io/).

```shell
$ curl -s "https://get.sdkman.io" | bash
$ source "$HOME/.sdkman/bin/sdkman-init.sh"
$ sdk list java
$ sdk install java 17-open
$ sdk install maven
$ sdk install gradle
$ sdk install jbang
$ gradle init <- For gradle project
$ mvn archetype:generate -DgroupId=com.mycompany -DartifactId=my-app -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false <- for creating maven project
```

SDKMAN also provide support for installing various other tools like **Maven**, **Gradle**, **JBang** etc.
If you want to play with Java for learning purpose I would recommend using **[JBang](https://www.jbang.dev/)**.

While most of the Java developers use full-blown powerful IDES like **Intellij IDEA** or **Eclipse** or **NetBeans**, you can work with Java using **VS Code** too.

## 2. Core Standard Library is not enough
Another common compliant was Java's Core Standard Library is not enough and many tasks needs some external library, and it's true.

* There is no built-in testing library, no built-in JSON (un)marshalling support, etc.
* While Java NIO is a big improvement, still File I/O is complex and verbose in Java compared to other languages.
* No built-in (Kotlin like) support for immutable data structures

### My view
* Java has good Standard Library such as Collections, Streams, Java NIO etc. 
* File I/O, JDBC etc still feels very low-level and verbose
* There are good 3rd party libraries like **commons-lang, commons-io, Jackson, Gson, Vavr, Eclipse Collections** to perform these tasks
* Adding a 3rd party library doesn't look like a big problem to me.
* The challenge is when there are too many choices it confuses newbies which one is right to pick.

## 3. Java is Verbose
This is the most common remark on Java that **Java is the most verbose language**.  
This simply reveals that you haven't yet worked with Go language :-)

### My view
Yes, people hate setters, getters etc but I don't see it as a deal-breaker. There is **Lombok** and **Records** to avoid writing boilerplate.
By using right libraries it is possible to write not-too-verbose Java code. 

In fact, I strongly feel Java has the right balance of verbosity vs conciseness.
Usually Java based enterprise applications are maintained for years and what is considered as "verbose" is what actually helping people to understand it.
I heard stories from my friends who inherited Scala/NodeJS codebases developed 3 years ago, and they have stories to tell about verbosity vs conciseness.

One of the reply says it all:
> I'll take legacy Java over legacy Node.js any day.

## 4. Complex "enterprisy" stuff
Another common theme was complex enterprise stuff like **ClassLoaders, JNDI, OSGI, JMX, Reflection, AOP, ByteWeaving, Dynamic Proxies, application servers** etc.

### My view
A decade ago I worked with EJB 2 with ear packaging, and I know how frustrating to deal with ClassLoader issues.
Also, I had first-hand experience dealing with class loader issues while deploying a Spring application in Application Server like JBoss/WildFly.

Luckily I am not working with EJBs, OSGI, JMX, application servers in the last 7 or 8 years.
In the modern Java world the applications are being built as fat jars and the frameworks are taking care of doing AOP, ByteWeaving, Dynamic Proxies etc.

Unless you are still working on legacy applications, I don't think you will be dealing with these issues with modern Java tech stack. 

## 5. Complexity for Library authors
The power users, library authors deal with whole new level of complexity compared to typical business application developers.

Some challenges that are mentioned with Java for advanced users are:

* Class loading, 
* Type erasure, 
* Exception semantics for functional interfaces
* Reflection
* Primitives
* Nulls
* Default mutability
* Multi-threading
* Universal equality

I can't say much about this because I haven't built any complex libraries.

In addition to these few more concerns are:
* High memory footprint for microservices
* [Streaming arch layered on an aging ecosystem w poorly understood ramifications](https://stackoverflow.com/questions/21163108/custom-thread-pool-in-java-8-parallel-stream)

## 6. Too much abstraction
This is unarguably the most frustrating part for newbies. 
While the modern frameworks make it easy to build applications for those who know what is happening behind the scenes, it is all black magic for newbies. 
Most of the frameworks are abstractions on top of abstractions on top of abstractions. 
When they try to learn a little more about something it is like peeling an onion.

## 7. Poor/Non-native FP Support
While Java adds some functional programming support from Java 8 onwards, Java is definitely not designed as Functional Programming language at its core.
Some people mentioned they can build software using FP in much better way than using OOP. 
You can apply some FP concepts like Pure functions, Immutability in Java as well, but it won't be as natural as in FP languages like Clojure or Haskell.

## 8. Miscellaneous reasons
* Higher chance of working with Legacy applications
* Bad interview experiences

The reason I asked "why you think Java is complex?" is to understand others point of view, and I got more visibility on why some people feel so.
While I don't agree with few things and some are not a deal-breaker for me, it definitely helped me to understand some genuine concerns.

IMO, any language/framework/library is created to solve one primary problem and along the way it may get some more non-primary features as well.
Java is designed as Object-Oriented language, and it will not be as good as Clojure or Haskell if you want it to be a Functional Programming Language.
Each programming language has it's niche areas like Python for Machine Learning, Go/Rust for Systems Programming, Java/NodeJS for enterprise application development etc.

Java's niche is in building large enterprise applications, not to print "Hello World!!!" in console.
The Java ecosystem grew addressing the enterprise needs, and improving developer productivity. 

In a typical enterprise business application you need to build complex business processes by integrating with several other external systems, 
you need to interact with relational databases, NoSQL databases, messaging systems, cache providers, Cloud Services etc.

Show me a more productive platform to build such enterprise applications rapidly? My money is on **Java/SpringBoot/Quarkus/Micronaut**.

Yes, you need to learn/know a shitload of things to make effective use of such rapid application development platform. 
That is the price you may need to pay to achieve that productivity.

But, that is not the only approach. you can go in another direction of picking the only-needed libraries and stitch them together by yourself.
Add cross-cutting logic all over the place, add monitoring capabilities, write cloud service adapters by yourself. 
This may result in good light-weight system that requires minimal cognitive load for developers.

# Summary
Don't simply discard any programming language/platform just because there are "Language X is complex" memes/jokes on the internet.
Don't just keep repeating "Language X is complex" because you heard someone else saying it based on their 2004 timeframe experience.
Try it yourself, you may like it or may not. It's worth taking a look at old things to know are they still bad, or they improved a lot over the years.
