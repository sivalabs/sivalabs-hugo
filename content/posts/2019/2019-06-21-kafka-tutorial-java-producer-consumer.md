---
title: Kafka Tutorial - Java Producer and Consumer
author: Siva
images: ["/preview-images/kafka.webp"]
type: post
date: 2019-06-21T07:59:17+05:30
url: /kafka-tutorial-java-producer-consumer/
categories:
  - Kafka
tags: [Kafka]
---

[Kafka](https://kafka.apache.org/), depending on how you use it, can be seen as a Message Broker, Event Store or a Streaming Platform etc. Kafka became a preferred technology for many of the modern applications because of various reasons like:

* Kafka can be used as an Event Store if you are using Event Driven Microservices architecture
* Kafka can be used as a Message Broker to enable communication across multiple applications
* Kafka can be used as Streaming platform for processing events in realtime
etc etc.

You can learn more about Kafka from it's official documentation https://kafka.apache.org/documentation/.

> If you like to learn from video tutorials I would suggest to watch https://www.learningjournal.guru/courses/kafka/kafka-foundation-training/.

In this post, We are going to use Kafka as a Message Broker and learn how to send and receive messages to and from Kafka topics using Java Client API.

## Kafka Installation
You can download Kafka distribution from https://kafka.apache.org/downloads and start Kafka server as follows.

[Kafka uses ZooKeeper](https://www.cloudkarafka.com/blog/2018-07-04-cloudkarafka_what_is_zookeeper.html) for Controller election, Configuration Of Topics, Membership of the cluster etc and is bundled with Kafka distribution. So, first we need to start ZooKeeper as follows:

```bash
kafka_2.12-2.2.0> bin/zookeeper-server-start.sh config/zookeeper.properties
```

Once the ZooKeeper started successfully, start Kafka server as follows:

```bash
kafka_2.12-2.2.0> bin/kafka-server-start.sh config/server.properties
```

Instead of installing Kafka as described above, if you prefer using Docker to spin up Kafka server you can use the following docker-compose configuration. You can also find various docker-compose configurations at https://github.com/confluentinc/cp-docker-images/tree/5.2.2-post/examples.

**docker-compose.yml**

```yml
version: '3.1'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:5.2.2
    hostname: zookeeper
    container_name: zookeeper
    ports:
      - "2181:2181"
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
      ZOOKEEPER_TICK_TIME: 2000

  broker:
    image: confluentinc/cp-enterprise-kafka:5.2.2
    hostname: broker
    container_name: broker
    depends_on:
      - zookeeper
    ports:
      - "29092:29092"
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: 'zookeeper:2181'
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://broker:29092,PLAINTEXT_HOST://localhost:9092
      KAFKA_METRIC_REPORTERS: io.confluent.metrics.reporter.ConfluentMetricsReporter
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_GROUP_INITIAL_REBALANCE_DELAY_MS: 0
      CONFLUENT_METRICS_REPORTER_BOOTSTRAP_SERVERS: broker:29092
      CONFLUENT_METRICS_REPORTER_ZOOKEEPER_CONNECT: zookeeper:2181
      CONFLUENT_METRICS_REPORTER_TOPIC_REPLICAS: 1
      CONFLUENT_METRICS_ENABLE: 'true'
      CONFLUENT_SUPPORT_CUSTOMER_ID: 'anonymous'
```

You can start the Zookeeper and Kafka docker containers using **docker-compose up**.

## Working with Kafka Java Client API

With the Kafka setup in place, let us create a Maven/Gradle project and add the following dependency.

**Maven:**
```xml
<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>2.2.0</version>
</dependency>
```

**Gradle:**
```xml
compile group: 'org.apache.kafka', name: 'kafka-clients', version: '2.2.0'
```

### Kafka Topic Producer
 A message to a Kafka topic typically contains a key, value and optionally a set of headers.
 While creating a producer we need to specify Key and Value Serializers so that the API knows how to serialize those values.

 Let us create **MessageProducer** class as follows:

```java
package com.sivalabs.kafkasample;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.header.internals.RecordHeader;
import org.apache.kafka.common.header.internals.RecordHeaders;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

public class MessageProducer {

    public static final String TOPIC_NAME = "topic-1";

    public static void main(String[] args) throws Exception {

        Properties producerProperties = new Properties();
        producerProperties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        producerProperties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongSerializer.class.getName());
        producerProperties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        producerProperties.put(ProducerConfig.ACKS_CONFIG, "all");

        Producer<Long, String> producer = new KafkaProducer<>(producerProperties);

        try {
            Long counter = 1L;
            while (true) {
                Headers headers = new RecordHeaders();
                headers.add(new RecordHeader("header-1", "header-value-1".getBytes()));
                headers.add(new RecordHeader("header-2", "header-value-2".getBytes()));
                ProducerRecord<Long, String> record = new ProducerRecord<Long, String>(TOPIC_NAME, null, counter, "A sample message", headers);

                producer.send(record);
                System.out.println("Send record#"+counter);
                counter++;
                TimeUnit.SECONDS.sleep(3);
            }
        } finally {
            producer.close();
        }
    }
}
```

We have created an instance of Properties to populate producer configuration properties like bootstrap servers, key and value serializer types. We are planning to send **Long/String** key/value pair so we used **LongSerializer** and **StringSerializer** respectively. Then we created **KafkaProducer** instance using **producerProperties**. A message to be sent to a topic is represented as an instance of **ProducerRecord**. Finally we send the message using **KafkaProducer.send()** method.

We have configured **ProducerConfig.ACKS_CONFIG** to **all** so that the message is considered successfully written to Kafka topic only when the full set of in-sync replicas acknowledged.

### Kafka Topic Consumer
Let us create a Consumer to read from Kafka **topic-1** as follows:

```java
package com.sivalabs.kafkasample;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.errors.WakeupException;
import org.apache.kafka.common.serialization.LongDeserializer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;
import java.util.concurrent.TimeUnit;

public class MessageConsumer {

    public static final String TOPIC_NAME = "topic-1";

    public static void main(String[] args) {

        Properties consumerProperties = new Properties();
        consumerProperties.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        consumerProperties.put(ConsumerConfig.GROUP_ID_CONFIG, "demo-group");
        consumerProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, LongDeserializer.class.getName());
        consumerProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        consumerProperties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consumerProperties.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, false);
        consumerProperties.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, 10);

        KafkaConsumer<Long, String> kafkaConsumer = new KafkaConsumer<>(consumerProperties);
        kafkaConsumer.subscribe(Collections.singletonList(TOPIC_NAME));

        try {
            while (true) {
                ConsumerRecords<Long, String> records = kafkaConsumer.poll(Duration.ofMillis(3000));
                System.out.println("Fetched " + records.count() + " records");
                for (ConsumerRecord<Long, String> record : records) {
                    System.out.println("Received: " + record.key() + ":" + record.value());
                    record.headers().forEach(header -> {
                        System.out.println("Header key: " + header.key() + ", value:" + header.value());
                    });
                }
                kafkaConsumer.commitSync();
                TimeUnit.SECONDS.sleep(5);
            }
        }catch (Exception e) {
            e.printStackTrace();
        } finally {
            kafkaConsumer.close();
        }
    }
}
```

Similar to Producer, we have created a Properties instance with consumer configuration properties. We have created a **KafkaConsumer** and subscribed to a single topic **test-topic**.

We are polling for new message with a timeout value of 1000 milli seconds and printing each message key and value. Along with it we are also printing the headers of each message. When we poll if there are no new messages then it would return an empty list.

We have configured **ConsumerConfig.AUTO_OFFSET_RESET_CONFIG** property to **earliest** so when we start the consumer it will start reading the messages from the last acknowledged offset.

We have turned off the default automatic acknowledgement mechanism by setting **ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG** to **false** and as we read the message we are acknowledging with **kafkaConsumer.commitSync()**.

Also we are limiting the max number of records to read per poll to 10 by configuring  **ConsumerConfig.MAX_POLL_RECORDS_CONFIG** property.

## Summary
In this post we have learned how to create a simple Producer and Consumer for a Kafka topic using Java Client API. In the next article we will learn how to implement a Kafka Producer and Consumer using **Spring for Kafka**.