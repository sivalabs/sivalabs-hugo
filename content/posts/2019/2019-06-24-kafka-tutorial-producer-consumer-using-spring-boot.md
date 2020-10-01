---
title: Kafka Tutorial - Producer and Consumer using SpringBoot
author: Siva
images: ["/preview-images/springboot-kafka.webp"]
type: post
date: 2019-06-24T07:59:17+05:30
url: /2019/06/kafka-tutorial-producer-consumer-using-spring-boot/
categories:
  - Kafka
tags: [Kafka, SpringBoot, Spring]
---
In the previous post [Kafka Tutorial - Java Producer and Consumer]({{< relref "2019-06-21-kafka-tutorial-java-producer-consumer.md" >}}) we have learned how to implement a Producer and Consumer for a Kafka topic using plain Java Client API.

In this post we are going to look at how to use Spring for Kafka which provides high level abstraction over Kafka Java Client API to make it easier to work with Kafka.

> You can find the source code for this article at https://github.com/sivaprasadreddy/kafka-tutorial

## Spring for Kafka without SpringBoot
First let us look at how to use Spring for Kafka without SpringBoot magic so that we will understand how to configure necessary components.

Create a maven based project and configure the dependencies as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.sivalabs</groupId>
    <artifactId>spring-kafka-sample</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka</artifactId>
            <version>2.2.6.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-test</artifactId>
            <version>5.1.7.RELEASE</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>ch.qos.logback</groupId>
            <artifactId>logback-classic</artifactId>
            <version>1.2.3</version>
        </dependency>
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>3.12.2</version>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.kafka</groupId>
            <artifactId>spring-kafka-test</artifactId>
            <version>2.2.6.RELEASE</version>
            <scope>test</scope>
        </dependency>

    </dependencies>
</project>
```

Next, let us configure the beans for Producer and Consumer using Spring's JavaConfig class as follows:

```java
package com.sivalabs.sample;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.*;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ComponentScan
@EnableKafka
public class KafkaConfig {

    public static final String TOPIC = "test-1";
    private String bootstrapServers = "localhost:9092";

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        return new DefaultKafkaConsumerFactory<>(consumerConfigs());
    }

    @Bean
    public Map<String, Object> consumerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        return props;
    }

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        return new DefaultKafkaProducerFactory<>(producerConfigs());
    }

    @Bean
    public Map<String, Object> producerConfigs() {
        Map<String, Object> props = new HashMap<>();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 33554432);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        return props;
    }

}
```

We have configured the **producerConfigs, ProducerFactory, KafkaTemplate** beans for Producer and **consumerConfigs, ConsumerFactory, ConcurrentKafkaListenerContainerFactory** beans for Consumer.

Now, we can send message to Kafka topic using **KafkaTemplate** using **kafkaTemplate.send(topicName, key, value)**.


```java
package com.sivalabs.sample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class MessageSender {

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    public void send(String key, String value) {
        kafkaTemplate.send(KafkaConfig.TOPIC, key, value);
    }
}
```

We can implement a Kafka topic listener using **@KafkaListener** annotation as follows:

```java
package com.sivalabs.sample;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class MessageListener {

    private static final Logger LOGGER = LoggerFactory.getLogger(MessageListener.class);

    @KafkaListener(topics = KafkaConfig.TOPIC)
    public void handle(ConsumerRecord<?, ?> cr) {
        LOGGER.info("Message: "+cr.key()+"="+cr.value());
    }
}
```

Well, this is how we can configure Kafka Producer and Consumer using Spring JavaConfiguration without using SpringBoot.
As you might have guessed, with SpringBoot auto-configuration the same application can be implemented with much less code.

## Spring for Kafka with SpringBoot

Let us create a SpringBoot application with Kafka starter. 

```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka-test</artifactId>
    <scope>test</scope>
</dependency>
```

SpringBoot provides **org.springframework.boot.autoconfigure.kafka.KafkaAutoConfiguration** which auto-configures **ProducerFactory, KafkaTemplate,ConsumerFactory, ConcurrentKafkaListenerContainerFactory** etc beans automatically. We just need to configure the following necessary properties in **application.properties** as follows:


```properties
spring.kafka.bootstrap-servers=localhost:9092

spring.kafka.consumer.group-id=demo-group
spring.kafka.consumer.auto-offset-reset=earliest
spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
spring.kafka.consumer.value-deserializer=org.apache.kafka.common.serialization.StringDeserializer

spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
spring.kafka.producer.value-serializer=org.apache.kafka.common.serialization.StringSerializer
```

That's it. Now we can send messages to a topic using **KafkaTemplate** and implement listeners using **@KafkaListener** as explained in earlier section.

> The SpringBoot auto-configuration for Kafka only works for single **ProducerFactory** and **ConsumerFactory**. If you want to configure multiple **ProducerFactory** and **ConsumerFactory** beans then you can disable **KafkaAutoConfiguration** and configure the beans by yourself as shown in [this github repo](https://github.com/sivaprasadreddy/kafka-tutorial/tree/master/spring-boot-multiple-producers-consumers).

## Summary
In this post we have learned how to implement a Kafka Producer and Consumer using **Spring for Kafka** with and without SpringBoot. In next post we will learn about working with Kafka using **Spring Cloud Streams with Kafka binder**.