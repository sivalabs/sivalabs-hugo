---
title: Should you use Lombok? Or, is it bad for you?
author: Siva
images: ["/preview-images/lombok.webp"]
type: post
draft: false
date: 2023-04-25T04:59:17+05:30
url: /should-you-use-lombok-or-is-it-bad-for-you/
categories: [Java]
tags: [Java, Lombok]
---

I'm a happy [Lombok](https://projectlombok.org/) library user. I found this library a decade ago, and I've been using it ever since.
I don't remember facing any major problems with it so far.

However, I see few people that I greatly admire and learn from, often complain that Lombok is very bad, and you should avoid it.
Obviously, I am curious to know what am I missing? I know a couple of scenarios where using Lombok brings some challenges.
Apart from it, I really enjoy using the Lombok library.

## Why I use Lombok?
I, like most others, spend a lot of time reading code and I like to read concise code.
I know I can generate the **setters**, **getters**, **toString()** etc from the IDE. 
But if I can have the same result by adding a couple of annotations, then I prefer that because it is easier to read.
I don't have to think about, are these simple setters/getters, or somebody sneaked some logic into these setters/getters.

Mostly, I use the following Lombok annotations:
* **@Setter, @Getter**
* **@NoArgsConstructor, @AllArgsConstructor, @RequiredArgsConstructor**
* **@Builder**

I know there are features in Lombok like **@SneakyThrows**, **@EqualsAndHashCode** etc which I don't usually use.
Implementing **equals()** and **hashCode()** should be a conscious choice, and I prefer either generating from IDE 
with appropriate fields selected or writing it by hand.

I'm well aware of the Java Records, and I use them when appropriate and use normal classes for other scenarios.
Also, if the Lombok generated setters/getters/toString() etc is not what you want, and you can write your own and Lombok will backoff.

* I never noticed any compilation slowness because of Lombok.
* I never experienced CI pipelines becoming slower because of Lombok.
* Lombok doesn't make me write anemic models, it's my choice.

## Problems with Lombok that I know of
* **Using @Data with JPA entities:** 
  When you have JPA entities with bi-directional relationships, then you may encounter StackOverflowErrors 
  if you blindly use **@Data** or **@ToString** or **@EqualsAndHashcode()**. 
  The solution is to understand why it happens and using the library properly.
* **Using with other annotation processors:** 
  This is a real pain and a good reason to avoid Lombok. Some annotation processors don't go well together (ex: [ErrorProne](https://errorprone.info/)) 
  and some do (ex: [MapStruct](https://mapstruct.org/)).
* **Lombok plugin not working with IDEs:** I remember facing a lot of difficulties installing Lombok plugin in Eclipse/STS. 
  I never faced any problem installing Lombok plugin in Intellij IDEA, but whenever a new version of IDE is released, 
  then Lombok used to break. But, now Lombok is bundled with IDE OOTB; these days I'm not facing those difficulties.  

## My reasons to continue using Lombok 
After seeing "Lombok is bad for you" tweets from a few well-known people in the community, 
even though I don't experience any challenges, I [de-lomboked a project](https://github.com/sivaprasadreddy/devzone/commit/f80ed9b634dbdae57aebd4df80bec970c01c5810) to see whether it is any better. 

It didn't bring me any joy, didn't make anything better. I had the exact same end result with plenty of boilerplate/verbose code.

**One common reason people say to avoid Lombok, which makes me giggle, BTW is: "You don't know what Lombok is doing under-the-hood".**

> Because all the developers know how Spring Data JPA findByUserNameAndPassword() exactly works.
> Everyone knows exactly how GraalVM turning java byte code into native code. Everyone knows exactly how Kubernetes Persistent Volumes work.

We don't have any problem using all the magic provided by those frameworks, but Lombok is bad for you. hmmm, I'm not convinced.

## Conclusion
As always, anyone can misuse a library or a framework and the remedy is "Education".
Learning how to use and how NOT to use will help.

I am all ears to know the practical problems you faced with Lombok so that I know when to avoid Lombok.

For example: 
* Hey, we were using lombok-1.18.8, and it has some bug which is slowing down the CI pipeline.
* We are using Lombok and MapStruct together, and in "this specific scenario" lombok generated code won't work.

Instead, "Hey, I know it is bad, and you have to take my word for a fact" doesn't really help.
Maybe Lombok is awful. Maybe not. 
Sharing the specific reasons will really help people to understand why Lombok, or any library for that matter, is good or bad.
If it is just a personal preference or a gut feeling, it is hard for others to feel it.
