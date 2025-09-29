---
title: A Tip for Debugging Tricky Software Bugs or Issues
author: Siva
images:
  - /preview-images/debugging.webp
type: post
draft: false
date: 2023-05-17T23:29:17.000Z
url: /blog/a-tip-for-debugging-tricky-software-bugs-issues/
categories:
  - Tips
tags:
  - Debugging
  - Tips
aliases:
  - /a-tip-for-debugging-tricky-software-bugs-issues/
---

While building software, once in a while we face some weird issue which is supposed to just work fine 
according to our understanding, but it is not working, and we don't have any clue. 

<!--more-->


We spent hours and hours trying to understand what the hell is going wrong and why it is not working.
Even worse, the exact same code is working fine in a small demo application. 
We all have been into this situation at some point in our careers, right?

After being into this kind of situation several times, I usually follow an approach to debug and fix the issue, 
which I am going to share in this article.

Typically, these kinds of tricky issues happen because of a combination of several things.

For example, if a Java library is working fine in a small demo project but not in your actual client project, 
then that could be because of the other libraries in your classpath.

But figuring out exactly which combination of libraries or configuration is causing the issue 
in a large project where hundreds of libraries are being used is very difficult.

So, whenever I am working on a project, I **create a small demo project with the same tech stack as my client project**, without implementing any features.
Then I try to implement the same use-case, in its simplest way, which is not working in my client project.
This helps me to figure out whether that library is actually working in the way I am expecting or not.
If it's working fine, then I keep adding other libraries/configurations to my demo project that are being used in my client project **one by one**
until I get the same issue.

This helps me to nail down which combination of libraries/configurations is causing the issue.
Most of the time, in Java projects, this could be because of conflicting library versions pulled transitively from different libraries.

Once you find out the root cause, fixing is not that difficult with the help of Google and StackOverflow.
Most likely, you may not be the first one who faced this problem. 
Somebody might have faced a similar issue already and figured out a solution or a workaround.

I work with [Testcontainers](https://testcontainers.com/) quite a bit, and sometimes I need to reproduce some issues reported by other developers to help them fix the issue.
In order to do that, first I need to reproduce that issue locally. 

That is the reason I created https://github.com/sivaprasadreddy/testcontainers-samples repository 
with commonly used technologies in combination with commonly used services (databases, message brokers etc).

These samples helped a lot while exploring the 
[new features introduced in Spring Boot 3.1.0](https://docs.spring.io/spring-boot/docs/3.1.0-SNAPSHOT/reference/htmlsingle/#features.testing.testcontainers), 
and I was able to find out some bugs and reported them too.

So, the bottom line is, **Always have a reproducer application with the same tech stack**.

## Bonus Tip

#### Make sure you are updating the file that you are thinking you are updating.

This might sound silly, but it is not very uncommon to do this mistake. 
We may have some configuration file somewhere in our filesystem, 
and for some unknown reason we make a copy of that file.
Then, we keep updating the wrong file and banging our heads shouting at the computer "Why don't you work"!!!

Before ruling out by saying "I am smart enough not to make this mistake", 
make sure you are updating the file that you are thinking you are updating :-).

Happy debugging!