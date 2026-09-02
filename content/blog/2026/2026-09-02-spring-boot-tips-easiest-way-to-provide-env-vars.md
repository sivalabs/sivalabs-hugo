---
title: "Spring Boot Tips: Easiest Way To Provide Environment Variables"
author: Siva
images:
  - /preview-images/sb-tips-env-vars.webp
type: post
draft: false
date: 2026-09-02T06:00:00+05:30
url: /blog/spring-boot-tips-easiest-way-to-provide-env-vars
toc: true
categories:
  - Spring Boot
tags:
  - Spring Boot
  - Tips
aliases:
  - /spring-boot-tips-easiest-way-to-provide-env-vars
---

Spring Boot has excellent support for [externalized configuration](https://docs.spring.io/spring-boot/reference/features/external-config.html). 
You can supply configuration through properties files, YAML files, environment variables, command-line arguments, and several other sources.

{{< box info >}}
**Spring Boot Configuration Management Best Practices**

Explore [Spring Boot Configuration Management Best Practices](https://blog.jetbrains.com/idea/2026/08/spring-boot-configuration-management-best-practices/) to learn more.
{{< /box >}}

That flexibility is useful, but local development still presents a small annoyance: where should you define environment variables?

You could export them from `.bashrc` or `.zshrc`, but then they affect every terminal session. 
You could configure them in your IDE, but each run configuration and each developer may need the same setup. 


For local development, I usually prefer a small file in the project directory.

<!--more-->

## Import a local properties file

Suppose the application needs a Telegram bot token and chat ID. 
Add the following to `application.properties`:

```properties
spring.config.import=optional:file:.env.properties

telegram.bot-token=${TELEGRAM_BOT_TOKEN}
telegram.chat-id=${TELEGRAM_CHAT_ID}
```

Then create `.env.properties` in the project root:

```properties
TELEGRAM_BOT_TOKEN=111111111111:ABCJDHRIJFL_NHFjnJKG
TELEGRAM_CHAT_ID=258745896
```

The `spring.config.import` property tells Spring Boot to load additional configuration from that file. 
The `file:` prefix means it is read from the filesystem, relative to the directory from which the application is started.
You can also use `classpath:.env.properties` if you want to place `.env.properties` in the classpath (ex: `src/main/resources`).

The `optional:` prefix is important. Without it, Spring Boot fails to start when the file is missing. 
With it, the application can still use environment variables supplied by your IDE, shell, container, or deployment platform.

## Prefer the conventional `.env` name?

Spring Boot normally uses a file extension to determine the configuration format. 
Because `.env` has no recognized extension, add a format hint:

```properties
spring.config.import=optional:file:.env[.properties]
```

The `[.properties]` suffix tells Spring Boot to parse `.env` as a Java properties file. 
Its contents remain the same:

```properties
TELEGRAM_BOT_TOKEN=111111111111:ABCJDHRIJFL_NHFjnJKG
TELEGRAM_CHAT_ID=258745896
```

This gives every developer one obvious place for local values while leaving production free to provide real environment variables.

{{< youtube bpQJpFXLFBk >}}

## One important precaution

These files often contain credentials. Do not commit them. 
Add the file you chose to `.gitignore`:

```gitignore
.env
.env.properties
```

If teammates need a template, commit an `.env.example` containing only placeholder values. 
That documents the required variables without leaking secrets.

