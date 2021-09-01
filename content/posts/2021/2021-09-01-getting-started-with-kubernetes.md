---
title: Getting Started with Kubernetes
author: Siva
images: ["/preview-images/Kubernetes_New.webp"]
type: post
draft: false
date: 2021-09-01T04:59:17+05:30
url: /2021/09/getting-started-with-kubernetes/
categories: [Kubernetes]
tags: [Kubernetes, DevOps, Java, SpringBoot]
---

Docker and Kubernetes has revolutionaized how we build and run the applications. 
In recent years containerization becomes new normal and many organizations start using Kubernetes as Container Orchestrator Platform.

I was curious about Kubernetes and played a bit with it 3 years ago but I thought let's wait and see is it going to be a real thing or just another over hyped technology.
Now I see Kubernetes everywhere, especially where microservice architecture being used for their systems. So, I finally decided to learn it properly and share my learnings along the way.

In this article we will learn:

* Creating a docker image from a SpringBoot application
* Understanding the Need for Kubernetes
* Local kubernetes setup using Minikube
* Overview of Kubernetes Objects
* Run the SpringBoot app in a Pod
* Scaling the application using Deployment
* Exposing the Deployment as a Service

## Creating a docker image from a SpringBoot application
We are going to build a simple SpringBoot application which we are going to use for this tutorial.
Go to [Spring Initializr](https://start.spring.io/) and select Web, Actuator and Lombok starters and generate the application.
You can click [Here](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.4&packaging=jar&jvmVersion=11&groupId=com.sivalabs&artifactId=k8s-boot-demo&name=k8s-boot-demo&description=Demo%20project%20for%20Spring%20Boot&packageName=com.sivalabs.k8sbootdemo&dependencies=lombok,web,actuator) to generate the application with desired starters already seleted.

Our SpringBoot application is going to be a very simple one as our goal here is to learn Kubernetes, not exploring SpringBoot's super powers.

Create a REST Controller as follows:

```java
package com.sivalabs.k8sbootdemo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@Slf4j
public class DemoController {

    @Value("${app.version}")
    private String version;

    @GetMapping({"", "/api/info"})
    public Map<String, String> apiInfo()
    {
        log.info("Request for apiInfo at : {}", LocalDateTime.now().toString());
        return Map.of("app", "K8S SpringBoot Demo", "version", version);
    }

    @GetMapping("/api/terminate")
    public String terminate()
    {
        log.info("Request for terminate at : {}", LocalDateTime.now().toString());
        System.exit(1); //give the developer a medal for writing this line in a web app
        return "I'll be BACK";
    }
}
```

Configure the following properties in src/main/resources/application.properties

```bash
spring.application.name=k8s-boot-demo
management.endpoints.web.exposure.include=*
app.version=v1
```

We can use SpringBoot Maven Plugin itself to build the Docker image or we can use Jib plugin.
Let's use Jib plugin to build the Docker Image and push it to DockerHub.

Add the following plugin in pom.xml

```xml

<properties>
    <java.version>11</java.version>
    <dockerhub.username>sivaprasadreddy</dockerhub.username>
    <docker.tag>v1</docker.tag>
</properties>
<build>
  <plugins>
    ...
    ...
    <plugin>
        <groupId>com.google.cloud.tools</groupId>
        <artifactId>jib-maven-plugin</artifactId>
        <version>2.7.0</version>
        <configuration>
            <from>
                <image>gcr.io/distroless/java:11</image>
            </from>
            <to>
                <image>${dockerhub.username}/${project.artifactId}:${docker.tag}</image>
            </to>
            <container>
                <ports>
                    <port>8080</port>
                </ports>
            </container>
        </configuration>
    </plugin>
  <plugins>
</build>
```

Before pushing the image to DockerHub, first you need to authenticate with DockerHub.

```bash
$ docker login

$ ./mvnw clean package jib:build
```

Now the docker image will be created and pushed to your DockerHub registry.

You can quickly verify it using the following command:

```
$ docker run -p 8080:8080 sivaprasadreddy/k8s-boot-demo:v1 
```

Now we should be able to access http://localhost:8080/api/info and see the following JSON response:

```json
{
    "version": "v1",
    "app": "K8S SpringBoot Demo"
}
```

## Understanding the Need for Kubernetes

In the previous step we were able to build a docker image from our SpringBoot application and also run it using Docker.
We have already verified that it is working fine by invoking an API endpoint.

Let's call another endpoint that we created `http://localhost:8080/api/terminate`

We won't see any response and if we check the console you can notice that the container exited.
If we look at the code of `/api/terminate` API handler method we are calling `System.exit(1)` which is killing the container.
Yes, that's a poor man's simulation of container crashed due to some problems like `OutOfMemory` etc...

Here the problem is once the container is crashed our application is dead. It won't restart itself or spin up another container automatically without human intervention.
While this is fine for a demo, but for running in production this is not acceptable.

In production environment we want to make sure always the application is up and running and also we want to run N instances to serve the high traffic.
This is where Container Orchestration tools like Kubernetes come into picture.

We can instruct Kubernetes to run 5 instances of our application and Kubernetes will take care of running 5 instances all the time.
If one container got crashed due to any issue then Kubernetes takes care of spinning up another container to make sure 5 containers are running as instructed.

That's enough of theory, let's get our hands on Kubernetes.

## Local kubernetes setup using Minikube

Let's install Minikube which can be used to create a single node kubernetes cluster locally.
You can checkout the [Minikube Docs](https://minikube.sigs.k8s.io/docs/start/) and follow the installation steps based on your OS.

For MacOS you can simply install using `brew install minikube`

Once minikube is installed create a cluster using the following command:

```bash
$ minikube start --memory 4096 --driver=virtualbox
```

We need to install kubectl commandline tool which will be used to communicate with the kubernetes cluster.

Follow the instructions at https://kubernetes.io/docs/tasks/tools/ to install kubectl based on your OS.

For MacOS you can simply install using `brew install kubectl`

Verify the installation:

```bash
$ kubectl version
$ minikube version
```

Now that we have the required tools installed, before jumping onto running containers we need to understand about few Kubernetes Objects.

## Overview of Kubernetes Objects

There are many Kubernetes Objects that we commonly use such as Pod, Deployment, Service, ConfigMap, Secrets, Persistent Volumes, Jobs, CronJobs, ServiceAccount etc.
Instead of dumping everything at once on your head we will explore them as and when required.

* **Pod:** A Pod is a smallest deployable unit which encapsulates one or more containers. Most of the times there will be only one container in a pod but there are cases where we need to run multiple containers in a single pod. 

* **Deployment:** A Deployment takes care of maintaining the desired state such as "there should be 3 replicas of this pod". Deployment uses ReplicaSets to scale up or down based on the desired state. Deployments can also be used to perform rolling updates, Blue/Green Deployments etc.

* **Service:** A Service exposes the deployment by providing a single interface (IP Address) to a set of Pods effectively working as a LoadBaalancer.

Knowing about these 3 Object types is enough to start with and we will learn about other Object types along the way.

## Run the SpringBoot app in a Pod

There are 2 ways we can deploy kubernetes objects:

1. Imperative way using `kubernetes run` or `kubernetes create` commands.
2. Declarative way using YAML Manifest files

While impertive way comes handy to run adhoc commands to explore things, Declarative way is more maintainable in real projects. So we are going to follow Declrative way using YAML files.

pod.yml

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: k8s-boot-demo-pod
spec:
  containers:
    - name: k8s-boot-demo
      image: sivaprasadreddy/k8s-boot-demo:v1
      imagePullPolicy: Always
      ports:
        - containerPort: 8080
```

Explaination of Pod definition:

* We are defining the object type as Pod using kind property
* We are giving a name to the pod in metadata section. We can also define the namespace and label etc which are optional.
* We are defining the container details as part of spec, for now we have only one container.

Let's deploy the pod on Minikube cluster:

```bash
$ kubectl apply -f pod.yaml
$ kubectl get pods
$ kubectl describe pods k8s-boot-demo-pod
$ kubectl logs k8s-boot-demo-pod
```

We are able to see our pod deployed successfully and see all the pod details using kubectl describe command and we can even see our SpringBoot application logs.

But we can't invoke any API endpoint as Pod is running within the container only and it is not accessible from outside of the cluster.

Well, there is a way. We can ssh into minikube and from there we can invoke the API.

```bash
$ minikube ssh
$ curl IP:8080/api/info
```

Cool, we are able to call our API Endpoint. Let's try to call /api/terminate endpoint.

```bash
$ minikube ssh
$ curl IP:8080/api/terminate
```

Now if you see the pod details it is in Running state and RESTARTS is 1. When the /api/terminate endpoint is called container got crashed and Kubernetes restarted the container 
as the default restartPolicy is Always.

Let's update restartPolicy to Never and see what happens when a container crashed.

```yaml
kind: Pod
apiVersion: v1
metadata:
  name: k8s-boot-demo-pod
spec:
  restartPolicy: Never
  containers:
    - name: k8s-boot-demo
      image: sivaprasadreddy/k8s-boot-demo:v2
      imagePullPolicy: Always
      ports:
        - containerPort: 8080
```

Only certain fields are allowed to update for an existing pod and restartPolicy is not one of them. 
So let's first delete the pod and recreate it.

```bash
$ kubectl delete -f pod.yaml
$ kubectl apply -f pod.yaml
$ kubectl get pod k8s-boot-demo-pod -o wide
```

Now if we ssh into minikube and invoke /api/terminate endpoint and see the pod status it will show as "Error" and the spring boot application is no longer running.

We learned how to run a pod and how it behave when a container got crashed depending on restartPolicy setting.

Now, let us see how we can scale up or scale down the number of pods using Deployments.

## Scaling the application using Deployment
## Exposing the Deployment as a Service