---
title: Spring Boot Logging Tutorial
author: Siva
images:
  - /preview-images/spring-boot-logging-tutorial.webp
type: post
draft: false
date: 2023-07-28T00:30:00.000Z
url: /blog/spring-boot-logging-tutorial
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - Tutorials
description: In this tutorial, you will learn how to implement logging in your Spring Boot application using Logback and Log4j2.
aliases:
  - /spring-boot-logging-tutorial
---
Logging is a common and important requirement for running applications in production.
Spring Boot provides great support for application logging out of the box and offers various customization options.
In this tutorial, you will learn how to implement logging in your Spring Boot application using **Logback** and **Log4j2**. 

<!--more-->


{{< box info >}}
**Getting Started with Spring Boot**

If you are new to Spring Boot, refer [Getting Started with Spring Boot]({{< relref "01-getting-started-with-spring-boot.md" >}}) tutorial 
to learn how to create a Spring Boot project.
{{< /box >}}

## Spring Boot Default Logging Support
When you create a Spring Boot application with any starter added, they have a dependency on 
**spring-boot-starter** which in turn depends on **spring-boot-starter-logging** 
which transitively add **logback** dependencies for logging.

Spring Boot default logging configuration is already configured in **spring-boot-starter** with **CONSOLE** appender.
You can view the default configuration files (**defaults.xml**, **base.xml**, **console-appender.xml**, **file-appender.xml**) 
packaged in **spring-boot.jar** under the package **org/springframework/boot/logging/logback**.

So, by default Spring Boot is configured with Slf4j and Logback for logging and you can start logging in your application as follows:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
class CustomerService {
    private static final Logger log = LoggerFactory.getLogger(CustomerService.class);
    
    public Customer findById(Long id) {
        log.info("Fetching customer by id: {}", id);
        ...
    }
}
```

This will produce a **INFO** level log entry in your **CONSOLE** similar to the following:

```shell
2023-07-26T19:44:04.492+05:30  INFO 69881 --- [nio-8080-exec-1] c.s.demo.CustomerService      : Fetching customer by id: : 1
```

## Customizing Log levels
By default, Spring Boot is configured with **root** log level set to **INFO**.
You can configure the log level for **root** or for any specific package in **src/main/resources/application.properties** as follows:

```properties
logging.level.root=WARN
logging.level.com.sivalabs=DEBUG
logging.level.org.springframework=INFO
logging.level.org.hibernate.validator=DEBUG
```

## Enabling File Appender
Spring Boot already configured **RollingFileAppender**, but is disabled by default.
You can enable File Appender by simply configuring either **logging.file.name** or **logging.file.path** property in **application.properties** as follows:

```properties
# relative to the current directory
logging.file.name=product-service.log

# absolute path
logging.file.name=/var/log/product-service.log

# write logs to /var/log/product-service/spring.log file
logging.file.path=/var/log/product-service
```

Note that when you configure **logging.file.name** or **logging.file.path** properties, both **Console** and **File** Appenders are enabled.
If you want to disable Console appender and enable only File appender, or you want to have more control over logback configuration, 
you can create **src/main/resources/logback.xml** and configure the logging as per your needs. 

## Custom Logback configuration
If the Spring Boot logging customization options via **logging.*** properties are not sufficient, 
you can create your own **src/main/resources/logback.xml** file and Spring Boot will configure logging according to this configuration.

However, Spring Boot provides some logback extensions which helps you to use advanced configuration options.
In order to use these extensions, create the configuration file with name **logback-spring.xml** instead of **logback.xml**.

A sample **logback-spring.xml** file looks as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <include resource="org/springframework/boot/logging/logback/defaults.xml" />
    <include resource="org/springframework/boot/logging/logback/console-appender.xml" />

    <root level="INFO">
        <appender-ref ref="FILE" />
    </root>
    <logger name="org.springframework" level="WARN"/>
    <logger name="com.sivalabs" level="DEBUG"/>

</configuration>
```

Spring Boot Logback extensions comes handy if you want to use any Spring Boot property or customize logging based on Spring profiles.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <springProperty scope="context" 
                    name="logstashHost" 
                    source="logstash.host"
                    defaultValue="localhost"/>
    <include resource="org/springframework/boot/logging/logback/defaults.xml" />

    <springProfile name="docker">
        <include resource="org/springframework/boot/logging/logback/file-appender.xml" />
        <property name="LOG_FILE" value="/var/logs/myapp.log"/>

        <appender name="logstash" class="net.logstash.logback.appender.LogstashTcpSocketAppender">
            <destination>${logstashHost}</destination>
            ...
            ...
        </appender>
        
        <root level="INFO">
            <appender-ref ref="FILE" />
            <appender-ref ref="logstash" />
        </root>
    </springProfile>
    
    <springProfile name="!docker">
        <include resource="org/springframework/boot/logging/logback/console-appender.xml" />
        <root level="INFO">
            <appender-ref ref="CONSOLE" />
        </root>
    </springProfile>
    
    <logger name="com.sivalabs" level="DEBUG"/>
    <logger name="org.springframework" level="INFO"/>

</configuration>
```

In the above configuration, we have enabled appenders based on Spring profile using `<springProfile name="...">`.
If **docker** profile is enabled then we are using **FILE**, **Logstash** appenders.
If the **docker** profile is not activated then we are using **CONSOLE** appender only.
Also, notice that we are using **<springProperty .../>** to use the **logstash.host** property value to specify the Logstash host. 

{{< box tip >}}
**Tip:**

You can also watch my [How to implement Logging in SpringBoot applications](https://www.youtube.com/watch?v=tmj6QphzAPo) video.
{{< /box >}}

## Using Log4j2 instead of Logback
If you prefer to use **Log4j2** instead of **Logback**, you can exclude **spring-boot-starter-logging** from **spring-boot-starter**
and include **spring-boot-starter-log4j2** in **pom.xml** as follows.

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-logging</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
</dependency>
```

In case you are using **Gradle**, you can configure to use **log4j2** instead of **logback** as follows:

```groovy
configurations.all {
	exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'
}

dependencies {
    implementation('org.springframework.boot:spring-boot-starter-log4j2')
    ...
    ...
}
```

Spring Boot by default includes **log4j2.xml** configuration file in **org/springframework/boot/logging/log4j2/log4j2.xml**.
But if you want to provide a customized configuration, then you can create **src/main/resources/log4j2-spring.xml** as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Properties>
        <Property name="LOG_PATTERN">
            %d{yyyy-MM-dd HH:mm:ss.SSS} %-5p %c{1}:%L - %m%n
        </Property>
    </Properties>
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT" follow="true">
            <PatternLayout pattern="${LOG_PATTERN}"/>
        </Console>
    </Appenders>
    <Loggers>
        <Logger name="com.sivalabs" level="debug" additivity="false">
            <AppenderRef ref="Console" />
        </Logger>

        <Root level="info">
            <AppenderRef ref="Console" />
        </Root>
    </Loggers>
</Configuration>
```

If you use slf4j API to create logger objects, then you don't have to make any code changes.
The slf4j API will delegate the actual logging to log4j2.

{{< box info >}}
**Spring Boot Tutorials**

You can find more Spring Boot tutorials on [Spring Boot Tutorials]({{% relref "/pages/spring-boot-tutorials" %}}) page. 
{{< /box >}}

## Summary
Spring Boot makes it easy to implement logging by providing the default configuration with customization options.
In this tutorial, we have learned about Spring Boot default logging support using Slf4J and Logback and how to customize it.
Then we have explored how to use Log4j2 instead of default Logback implementation.
