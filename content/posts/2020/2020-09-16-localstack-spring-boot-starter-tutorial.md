---
title: LocalStack SpringBoot Starter Tutorial
author: Siva
images: ["/images/localstack.webp"]
type: post
draft: false
date: 2020-09-16T04:59:17+05:30
url: /2020/09/localstack-spring-boot-starter-tutorial/
categories:
  - Java
tags: [Spring, SpringBoot, Localstack]
---

I was working on a SpringBoot application which is planned to deploy on AWS and, we were using S3, SQS and RDS services.

[LocalStack](https://github.com/localstack/localstack) provides an easy-to-use test/mocking framework 
for developing AWS based Cloud applications. 

I want to use Localstack mock services instead of using real AWS services for two purposes:

* To run integration tests
* To run application locally

We can use [Testcontainers](https://www.testcontainers.org/modules/localstack/) to spin up a *Localstack* docker container, 
but we need to configure Amazon service clients like `AmazonS3`, `AmazonSQSAsync` which is typical boilerplate that we copy-paste from project to project.
Instead of copy-pasting the code snippets, creating a SpringBoot starter which autoconfigures the Amazon service clients is a better approach and less error prone.
So, I have created [localstack-spring-boot-starter](https://github.com/sivalabs/localstack-spring-boot-starter)

## How to use localstack-spring-boot-starter?
The ideal way to use **localstack-spring-boot-starter** is to enable it with a specific profile such as `integration-test` or `local` 
then activate that profile based on the need.

> You can checkout the example applications on how to use localstack-spring-boot-starter https://github.com/sivalabs/localstack-spring-boot-starter/tree/master/examples

### 1. Project Setup

You can go to https://start.spring.io/ and generate a SpringBoot application and then add the following dependencies.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
		 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
						http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.sivalabs</groupId>
	<artifactId>localstack-spring-boot-sample</artifactId>
	<packaging>jar</packaging>
	<version>1.0-SNAPSHOT</version>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>2.3.3.RELEASE</version>
	</parent>

	<properties>
		<java.version>1.8</java.version>
		<aws-java-sdk.version>1.11.852</aws-java-sdk.version>
		<testcontainers.version>1.14.3</testcontainers.version>
		<localstack-starter.version>0.0.2</localstack-starter.version>
	</properties>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.testcontainers</groupId>
				<artifactId>testcontainers-bom</artifactId>
				<version>${testcontainers.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.testcontainers</groupId>
			<artifactId>localstack</artifactId>
		</dependency>
		<dependency>
			<groupId>io.github.sivalabs</groupId>
			<artifactId>localstack-spring-boot-starter</artifactId>
			<version>${localstack-starter.version}</version>
		</dependency>
		<dependency>
			<groupId>com.amazonaws</groupId>
			<artifactId>aws-java-sdk</artifactId>
			<version>${aws-java-sdk.version}</version>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

</project>
```

We have added `org.testcontainers:localstack`, `com.amazonaws:aws-java-sdk` and `localstack-spring-boot-starter` dependencies.

### 2. AWS Configuration

Create a Spring configuration class for configuring AWS client beans for production and non-production environments as follows:

```java
import io.github.sivalabs.localstack.EnableLocalStack;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
public class AppConfig {

    @Configuration
    @Profile("aws")
    public static class AwsConfig {
        private static final Regions REGION = Regions.US_EAST_1;
        
        @Bean
        @Primary
        public AmazonSQSAsync amazonSQSAsync() {
            return AmazonSQSAsyncClientBuilder.standard()
                .withRegion(REGION)
                .build();
        }
    
        @Bean
        @Primary
        public AmazonS3 amazonS3() {
            return AmazonS3ClientBuilder.standard()
                .withRegion(REGION)
                .build();
        }
    }

    @Configuration
    @Profile({"integration-test", "local"})
    @EnableLocalStack
    public static class LocalStackAwsConfig {

    }
}
```

In our AppConfig configuration class, we have two nested configuration classes, one for production(`aws`) and another one for non-prod(`integration-test` and `local`).
The `AwsConfig` is associated with `aws` profile and `LocalStackAwsConfig` is associated with `integration-test` and `local`.
The most important thing to notice here is that, `LocalStackAwsConfig` class is annotated with `@EnableLocalStack` which actually triggers the Localstack auto-configuration.

### 3. Localstack configuration

We need to specify which AWS services we want to use and, we can enable or disable specific service as follows:

```bash
localstack.enabled=true # default true
localstack.services=S3,SQS
localstack.s3.enabled=true # default true
localstack.sqs.enabled=false # default true
```

As of now, the following services are auto-configured using **AWS Java SDK V1**:
`SQS, S3, SNS, DYNAMODB, DYNAMODBSTREAMS, KINESIS, IAM, LAMBDA, CLOUDWATCH, SECRETSMANAGER`

### 4. Use AutoConfigured AWS Services
Now with Localstack auto-configuration we can inject `AmazonS3`, `AmazonSQS`, `AmazonSQSAsync` etc and use them in our application.

```java
@Service
@RequiredArgsConstructor
public class S3Service {
    private final AmazonS3 amazonS3;

    public Bucket createBucket(String bucketName) {
        return amazonS3.createBucket(bucketName);
    }
    
    public S3Object getObject(String bucketName, String key) {
        return amazonS3.getObject(bucketName, key);
    }

    public PutObjectResult store(String bucketName, String key, String value) {
        return amazonS3.putObject(bucketName, key, value);
    }
}
```

### 5. Run Integration Tests
We can write integration test by enabling `integration-test` profile using `@ActiveProfiles("integration-test")`.

```java
import com.amazonaws.services.s3.model.S3Object;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.io.ByteArrayInputStream;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("integration-test")
@Slf4j
class S3ServiceTest {
    private static final String bucketName = "mybucket";

    @Autowired
    private S3Service s3Service;

    @Test
    void shouldStoreAndRetrieveDataFromS3Bucket() {
        s3Service.createBucket(bucketName);
        log.info("Created S3 Bucket: {}", bucketName);
        s3Service.putObject(bucketName, "my-key-1", "my-value-1");
        S3Object s3Object = s3Service.getObject(bucketName, "my-key-1");
        assertThat(s3Object.getObjectContent()).hasSameContentAs(new ByteArrayInputStream("my-value-1".getBytes()));
    }
}
```

### 6. Run application locally
As we have enabled Localstack auto-configuration using **local** profile, we can start our application by enabling **local** profile as follows:

`java –jar -Dspring.profiles.active=local app.jar`

We can also run the application from IDE itself by setting environment variable SPRING_PROFILES_ACTIVE=local.

### 7. How to use with Spring Cloud AWS?
We can use `localstack-spring-boot-starter` with Spring Cloud AWS as well. To run Spring Cloud AWS application locally we need to disable following properties:

```bash
cloud.aws.region.auto=false
cloud.aws.stack.auto=false
```

### 8. Examples
* [Minimal SpringBoot application](https://github.com/sivalabs/localstack-spring-boot-starter/tree/v1.0.0/examples/localstack-spring-boot-sample)
* [SpringCloud AWS application](https://github.com/sivalabs/localstack-spring-boot-starter/tree/v1.0.0/examples/localstack-spring-cloud-aws-sample)

## 9. What's next?
As of now `localstack-spring-boot-starter` supports auto-configuration of AWS services based on AWS Java SDK v1.
Support for AWS Java SDK v2 is in progress. You can checkout the Java SDK v2 support in https://github.com/sivalabs/localstack-spring-boot-starter/tree/v1.0.0 branch.
Also, support for creating S3 buckets, SQS queues on application start up will also be in next release.

## 10. Want to contribute?
You are most welcome to contribute to this starter by implementing auto-configuration for more services supported by LocalStack.
You can also use this starter and report any bugs. Adding more example applications is also a nice thing to help others to get started.

I hope `localstack-spring-boot-starter` is useful and if you like it [give it a star](https://github.com/sivalabs/localstack-spring-boot-starter).
