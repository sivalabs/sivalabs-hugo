---
title: Kubernetes - Blue/Green Deployments
author: Siva
images:
  - /preview-images/Kubernetes_BG_Deployments.webp
type: post
draft: false
date: 2021-09-13T23:29:17.000Z
url: /blog/kubernetes-blue-green-deployments/
categories:
  - Kubernetes
tags:
  - Kubernetes
  - DevOps
  - Java
  - SpringBoot
aliases:
  - /kubernetes-blue-green-deployments/
---

In the previous article [Kubernetes - Releasing a new version of the application using Deployment Rolling Updates]({{< relref "2021-09-07-kubernetes-deployment-rolling-updates.md" >}}) we have learned how to release a new version of application using **Deployment Rolling Updates** and how to use **Readiness** and **Liveness** probes to route traffic to only fully initialized containers.

<!--more-->


* [1. Getting Started with Kubernetes]({{< relref "2021-09-01-getting-started-with-kubernetes.md" >}})
* [2. Kubernetes - Releasing a new version of the application using Deployment Rolling Updates]({{< relref "2021-09-07-kubernetes-deployment-rolling-updates.md" >}})
* [3. Kubernetes - Blue/Green Deployments]({{< relref "2021-09-14-kubernetes-blue-green-deployments.md" >}})
* [4. Kubernetes - Exposing Services to outside of Cluster using Ingress]({{< relref "2021-09-22-kubernetes-ingress.md" >}})

In this article, we are going to learn:
* What are the **problems with Kubernetes Rolling Updates**?
* What is **Blue/Green Deployments strategy**?
* How to **release a new version of application using Blue/Green Deployments strategy**?

## 1. What are the problems with Kubernetes Rolling Updates?
We have seen how we can use RollingUpdate strategy which is supported by Kubernetes out-of-the-box to deploy a new version of the application.
But it poses some problems on the application architecture and design such as:

* Application should be able to gracefully handle both versions in compatible way
* The application database changes should be backward compatible
* If the application has upstream/downstream service integrations then the data exchange formats should be backward compatible

While it is generally a good idea to keep new versions backward compatible we also need to keep in mind the cost of it.
You may have to add feature toggles and additional configuration to handle both versions at the same time which definitely increase the complexity and tech debt.

So, instead of immediately rolling out the new version by replacing the old version how about deploying the new version along side current version and test it thoroughly for a while and once we are confident with new version changes redirect the application traffic to new version? That is exacly what Blue/Green Deployment Strategy suggests.  

## 2. What is Blue/Green Deployments strategy?

Blue/Green deployment is a technique that reduces downtime and complexity by running two separate environments called Blue(current version) and Green(new version). At any moment of time only one of the environments is live and serves all the traffic. Once all the testing is done in Green(new version) environment then Green will be made as the Live environment and Blue becomes the Stand-By environment.


## 3. How to release a new version of application using Blue/Green Deployments strategy?
Unlike RollingUpdate strategy, Kubernetes doesn't have out-of-the-box support for Blue/Green Deployment Strategy.
However, achieving Blue/Green Deployments with Kubernetes is very easy using **labels**.

Let's say we have deployed our application with version v1 using the following Kubernetes manifest and is live now.

**k8s/deployment-blue.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-boot-demo-deployment-blue
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: k8s-boot-demo
      version: v1
      color: blue
  template:
    metadata:
      labels:
        app: k8s-boot-demo
        version: v1
        color: blue
    spec:
      containers:
        - name: k8s-boot-demo
          image: sivaprasadreddy/k8s-boot-demo:v1
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
```

* You can notice that our pod is associated with 3 labels **app: k8s-boot-demo, version: v1, color: blue**.
* The deployment is also configured with **selector.matchLabels** using same labels **app: k8s-boot-demo, version: v1, color: blue**.

Now let's create a Service to expose our version v1 deployment.

**k8s/service-live.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8s-boot-demo-service
spec:
  type: NodePort
  selector:
    app: k8s-boot-demo
    version: v1
  ports:
    - name: app-port-mapping
      protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 30090
```

* Nothing much new here and the important thing to notice here is the **selector** labels. Only **app: k8s-boot-demo, version: v1** labels are associated with Service but not **color**.

Now we can deploy our resources and access them via NodePort as follows:

```shell
$ kubectl apply -f k8s/deployment-blue.yaml
$ kubectl apply -f k8s/service-live.yaml
$ minikube ip
192.168.99.103
$ curl 192.168.99.103:30090/api/info
{"version":"v1","app":"K8S SpringBoot Demo","hostName":"k8s-boot-demo-deployment-blue-7459fc4bd8-ptmxx"}
```

So far so good, we have our Blue environment up and running. 

Now let's deploy our new version v2 in a **Green** environment.

**k8s/deployment-green.yaml**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-boot-demo-deployment-green
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: k8s-boot-demo
      version: v2
      color: green
  template:
    metadata:
      labels:
        app: k8s-boot-demo
        version: v2
        color: green
    spec:
      containers:
        - name: k8s-boot-demo
          image: sivaprasadreddy/k8s-boot-demo:v2
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
```

* You can notice that our pod is associated with 3 labels **app: k8s-boot-demo, version: v2, color: green**.
* The deployment is also configured with **selector.matchLabels** using same labels **app: k8s-boot-demo, version: v2, color: green**.

Now let's create a Service to expose our version v2 deployment.

**k8s/service-preprod.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8s-boot-demo-service-preprod
spec:
  type: NodePort
  selector:
    app: k8s-boot-demo
    version: v2
  ports:
    - name: app-port-mapping
      protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 30092
```

The important thing to note here is we are creating a separate service named **k8s-boot-demo-service-preprod** and with selector labels **app: k8s-boot-demo, version: v2** and with **nodePort: 30092**.

```shell
$ kubectl apply -f k8s/deployment-green.yaml
$ kubectl apply -f k8s/service-preprod.yaml
$ kubectl get all
$ minikube ip
192.168.99.103
$ curl 192.168.99.103:30090/api/info
{"hostName":"k8s-boot-demo-deployment-blue-7459fc4bd8-rk8kt","app":"K8S SpringBoot Demo","version":"v1"}
$ curl 192.168.99.103:30092/api/info
{"version":"v2","app":"K8S SpringBoot Demo","hostName":"k8s-boot-demo-deployment-green-d7b94fdc5-5xxgw"}
```

Now our green environment is also up and running.

We are able to access and test our new version and as everything looks fine we want to make our green environment as Live.
All we need to do is to update label **version: v1** to **version: v2** in **k8s/service-live.yaml** and apply changes.

**k8s/service-live.yaml**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: k8s-boot-demo-service
spec:
  type: NodePort
  selector:
    app: k8s-boot-demo
    version: v2
  ports:
    - name: app-port-mapping
      protocol: TCP
      port: 8080
      targetPort: 8080
      nodePort: 30090
```

```shell
$ kubectl apply -f k8s/service-live.yaml
$ minikube ip
192.168.99.103
$ curl 192.168.99.103:30090/api/info
{"version":"v2","app":"K8S SpringBoot Demo","hostName":"k8s-boot-demo-deployment-green-d7b94fdc5-bhv9c"}
$ curl 192.168.99.103:30092/api/info
{"version":"v2","app":"K8S SpringBoot Demo","hostName":"k8s-boot-demo-deployment-green-d7b94fdc5-bhv9c"}
```

That's it. Now the service is pointing to the pods running version v2 of our application. And, immediately any requests to live Service will be pointing to new version.

## Summary
In this article we have learned how to release a new version using Blue/Green Deployments strategy to reduce the complexity of having to support both old and new version of the application at the same time.

So far we have been using a single node Minikube cluster and exposing the service using NodePort so that we can access the application using Minikube IP Address and NodePort. But in reality we will have multiple worker nodes and using NodePort is not a feasible approach. To overcome this issue we can use Ingress where we can access our services using a domain name instead of node IP addresses and port numbers. We will learn how to use Ingress in next article.
