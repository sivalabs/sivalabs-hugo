---
title: CI/CD for SpringBoot applications using Travis-CI
author: Siva
images: ["/images/TravisCI-Mascot-1.png"]
type: post
date: 2018-01-24T07:59:17+05:30
url: /2018/01/ci-cd-springboot-applications-using-travis-ci/
categories:
  - travis-ci
  - springboot
tags:
  - travis-ci
  - springboot
---

In this article we are going to learn how we can use **Travis CI** for Continuous Integration and Continuous Deployment (CI/CD) 
of a **SpringBoot** application. We will learn how to run maven build goals, perform test coverage validation using JaCoCo plugin, 
Code Quality checks using **SonarCloud**, build Docker image and push it to **DockerHub** and finally deploy it to **Heroku**.

> The source code for this article is at https://github.com/sivaprasadreddy/jblogger

Last week I was talking to my friend about how easy it became to build a Java application and deploy it using SpringBoot. During the discussion one point came out about how much it cost to build a Java application and deploy it somewhere (cloud). So, I thought of exploring more about the free services that we can use to automate all the project development activities with minimal or no cost at all.

Few years ago I used **CloudBees** and **CloudFoundry** to build and deploy my pet projects which were offering free hosting service, but they are not providing free services anymore.

In the past I have used **Travis CI** for my java projects just for preliminary testing purpose, but looking at their documentation I realised they provide a lot more features.

So I thought of checking can I use Travis CI for my projects to do all the usual tasks such as:

* Checkout the latest code
* Compile and run Unit and Integration Tests
* Run JaCoCo code coverage and fail the build if desired percentage is not met
* Run SonarQube code quality checks
* Optionally, built Docker image and publish it to Docker Hub
* Deploy application on some free cloud hosting service like Heroku or OpenShift

After going through their documentation I realised that we can do all these tasks by using some of the free online services and Travis-CI integration with them.

* **GitHub** for code repository
* **SonarCloud** for free SonarQube service
* **Docker Hub** for publishing Docker images
* **Heroku** for deploying the application

Let us see how we can do all the above mentioned tasks using Travis-CI for a SpringBoot project.

## Step 1: Create SpringBoot project

Create a SpringBoot project either using http://start.spring.io or from your IDE. I am using Maven build tool, you can use Gradle also if you prefer. Now commit the project into your github repository.

## Step 2: Create .travis.yml file

In order to enable Travis-CI integration we need to create **.travis.yml** file in project root folder.
As we are creating the Maven based java project create .travis.yml file with following content:

**.travis.yml**

```yml
language: java
jdk: oraclejdk8
```

This minimal configuration is sufficient for Travis-CI to recognize our Maven based Java project and build it. 
If there is a build.gradle file in our project root folder Travis will treat it as Gradle project, or if there is pom.xml it will treat it as Maven project.  If both build.gradle and pom.xml are there then Gradle build script will take priority.

By default Travis will run **mvn test -B** for building the project. 
If Travis finds mvnw wrapper then it will be used like **./mvnw test -B**.


But if you want to run a different command or want to run multiple commands we can use script block to customize it.

Now commit and push the .travis.yml file to GitHub.

## Step 3: Enable Travis-CI for GitHub repository

Go to https://travis-ci.org/ and **Signin with GitHub**.

Now click on **Add New Repository** (+ symbol).

Enable Travis for the repository. After enabling Travis click on that repository and you can trigger build by selecting 
**More Options -> Trigger build**.

Now you can see that build is running and tests are executed and an email notification will be sent to your email regarding the build status.

## Step 4: Add JaCoCo Code Coverage check

Add the Maven JaCoCo plugin to pom.xml with options like what is the desired code coverage percentage, packages/classes to ignore etc.

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.7.9</version>
    <configuration>
        <excludes>
            <exclude>com/sivalabs/jblogger/entities/*</exclude>
            <exclude>com/sivalabs/jblogger/*Application</exclude>
        </excludes>
    </configuration>
    <executions>
        <execution>
            <id>default-prepare-agent</id>
            <goals>
                <goal>prepare-agent</goal>
            </goals>
        </execution>
        <execution>
            <id>default-prepare-agent-integration</id>
            <goals>
                <goal>prepare-agent-integration</goal>
            </goals>
        </execution>
        <execution>
            <id>default-report</id>
            <phase>verify</phase>
            <goals>
                <goal>report</goal>
            </goals>
        </execution>
        <execution>
            <id>default-report-integration</id>
            <goals>
                <goal>report-integration</goal>
            </goals>
        </execution>
        <execution>
            <id>default-check</id>
            <goals>
                <goal>check</goal>
            </goals>
            <configuration>
                <rules>
                    <!-- implementation is needed only for Maven 2 -->
                    <rule implementation="org.jacoco.maven.RuleConfiguration">
                        <element>BUNDLE</element>
                        <limits>
                            <!-- implementation is needed only for Maven 2 -->
                            <limit implementation="org.jacoco.report.check.Limit">
                                <counter>COMPLEXITY</counter>
                                <value>COVEREDRATIO</value>
                                <minimum>0.60</minimum>
                            </limit>
                        </limits>
                    </rule>
                </rules>
            </configuration>
        </execution>
    </executions>
</plugin>
```

## Step 5: Run Unit and Integration Tests

As I mentioned earlier, by default Travis run **mvn test -B** which will **only run Unit tests**.

We want to run Unit tests and Integration tests separately by using **maven-failsafe-plugin**. 
We will follow the convention by naming **Unit tests** as **\*Test.java/\*Tests.java** and **Integration tests** as **\*IT.java**.

Add **maven-failsafe-plugin** as mentioned below:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <configuration>
        <includes>
            <include>**/*IT.java</include>
        </includes>
    </configuration>
    <executions>
        <execution>
            <id>failsafe-integration-tests</id>
            <phase>integration-test</phase>
            <goals>
                <goal>integration-test</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

While configuring the maven-failsafe-plugin for SpringBoot project I hit this issue https://github.com/spring-projects/spring-boot/issues/6254 .
To fix this issue I have added the **classifier** configuration to spring-boot-maven-plugin as follows:

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <classifier>exec</classifier>
    </configuration>
</plugin>
```

Now we are going to use **script** block to specify our custom maven goal to run instead of default goal.

**.travis.yml**

```yml
language: java
jdk: oraclejdk8
 
script:
- ./mvnw clean install -B
```

## Step 6: SonarQube code quality checks using SonarCloud

SonarCloud , which built on **SonarQube**, offers free code quality checks for Open Source projects.

**Login with GitHub** and go to **My Account -> Security** and generate a new token for your project and save it somewhere. 
Now click on **Organizations** tab and create an Organization with some unique key.

Travis-CI provides ability to encrypt sensitive data (https://docs.travis-ci.com/user/encryption-keys/) so that we can encrypt any keys, password and configure in .travis.yml file.

`> sudo gem install travis`

From project root folder run the following command to encrypt data:

**travis encrypt SOMEVAR="secretvalue"**

This will generate output like

**secure: "…. encrypted data …."**

We can add all the secrets as global environment variables as follows:

```yml
env:
  global:
  - secure: "....encrypted data....."
```

Now let us encrypt SonarCloud Token as follows:

**travis encrypt SONAR_TOKEN="my-sonar-token-here"**

Finally, let us add SonarCloud support as an AddOn (https://docs.travis-ci.com/user/sonarcloud/) as follows:

```yml
language: java
jdk: oraclejdk8
 
env:
  global:
  - secure: "....encrypted sonar token here....."
 
addons:
  sonarcloud:
    organization: "sivaprasadreddy-github"
    token:
      secure: $SONAR_TOKEN
 
script:
- ./mvnw clean install -B
- ./mvnw clean org.jacoco:jacoco-maven-plugin:prepare-agent package sonar:sonar
```

Note that we used **$SONAR_TOKEN** to refer to encrypted token variable and added one more command to run in **script** block to run **sonar:sonar** goal.

## Step 7: Build Docker image and publish to DockerHub

Travis CI builds can run and build Docker images, and can also push images to Docker repositories. 
For more information read https://docs.travis-ci.com/user/docker/

Create **Dockerfile** in project root folder for our SpringBoot application as follows:

```Dockerfile
FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD target/jblogger-0.0.1-SNAPSHOT.jar app.jar
RUN sh -c 'touch /app.jar'
ENV JAVA_OPTS="-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8787,suspend=n"
EXPOSE 8080 8787
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -Dspring.profiles.active=docker -jar /app.jar" ]
```

To use Docker add the following settings to **.travis.yml**:

```yml
sudo: required
 
services:
  - docker
```

Now we can run Docker commands in our build.

Once the build is successful we may want to build the Docker image and push it to Docker Hub. 
We can leverage **after_success** section to perform this action.

We need to login into DockerHub before pushing the image, we are going to configure DockerHub credentials by encrypting them.

```shell
travis encrypt DOCKER_USER=”dockerhub-username”
travis encrypt DOCKER_PASS=”dockerhub-password”
```

Add these 2 secrets to **env.global** section of .travis.yml.

Now we can add our docker commands to build image and publish to dockerhub in **after_success** section as follows:

```yml
after_success:
- docker login -u $DOCKER_USER -p $DOCKER_PASS
- export TAG=`if [ "$TRAVIS_BRANCH" == "master" ]; then echo "latest"; else echo $TRAVIS_BRANCH; fi`
- export IMAGE_NAME=sivaprasadreddy/jblogger
- docker build -t $IMAGE_NAME:$COMMIT .
- docker tag $IMAGE_NAME:$COMMIT $IMAGE_NAME:$TAG
- docker push $IMAGE_NAME

```

## Step 8: Deploy to Heroku

Travis CI provides options to deploy on a wide range of platforms including Heroku, OpenShift, AWS, Azure etc. 
Travis CI can automatically deploy your Heroku application after a successful build.

We are going to deploy our SpringBoot application on Heroku using Travis https://docs.travis-ci.com/user/deployment/heroku/. Before deploying our application to Heroku first we need to login to https://www.heroku.com/ and create an application from Dashboard.

Now create **Procfile** in root folder of the project as follows:

```shell
web java -Dserver.port=$PORT -Dspring.profiles.active=heroku $JAVA_OPTS -jar target/jblogger-0.0.1-SNAPSHOT-exec.jar
```

First we need to get the Heroku API Key and add it as encrypted secret.

**travis encrypt HEROKU_API_KEY="your-heroku-api-key-here"**

We can deploy to Heroku from Travis by adding **deploy** section as follows:

```yml
deploy:
  provider: heroku
  api_key: $HEROKU_API_KEY
  app: jblogger
```

Now the complete .travis.yml file will look like follows:

```yml
sudo: required
language: java
jdk: oraclejdk8
 
services:
- docker
 
env:
  global:
  - secure: "encrypted-sonar-token"
  - secure: "encrypted-dockerhub-username"
  - secure: "encrypted-dockerhub-password"
  - secure: "encrypted-heroku-api-key"
  - COMMIT=${TRAVIS_COMMIT::7}
 
addons:
  sonarcloud:
    organization: "sivaprasadreddy-github"
    token:
      secure: $SONAR_TOKEN
 
script:
- ./mvnw clean install -B
- ./mvnw clean org.jacoco:jacoco-maven-plugin:prepare-agent package sonar:sonar
 
after_success:
- docker login -u $DOCKER_USER -p $DOCKER_PASS
- export TAG=`if [ "$TRAVIS_BRANCH" == "master" ]; then echo "latest"; else echo $TRAVIS_BRANCH&amp;amp;amp;amp;amp;amp;amp;lt;span data-mce-type="bookmark" style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;" class="mce_SELRES_start"&amp;amp;amp;amp;amp;amp;amp;gt;&amp;amp;amp;amp;amp;amp;amp;lt;/span&amp;amp;amp;amp;amp;amp;amp;gt;; fi`
- export IMAGE_NAME=sivaprasadreddy/jblogger
- docker build -t $IMAGE_NAME:$COMMIT .
- docker tag $IMAGE_NAME:$COMMIT $IMAGE_NAME:$TAG
- docker push $IMAGE_NAME
 
deploy:
  provider: heroku
  api_key: $HEROKU_API_KEY
  app: jblogger
```

Once the build is successful and deployed on Heroku you should be able to access the application at `https://<app>.herokuapp.com/`.

I just covered the most commonly performed tasks in Java applications only, but Travis-CI can perform lot more. 
Checkout the TravisCI documentation at https://docs.travis-ci.com/.
