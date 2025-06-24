---
title: Kubernetes - Exposing Services to outside of Cluster using Ingress
author: Siva
images: ["/preview-images/Kubernetes_Ingress.webp"]
type: post
draft: false
date: 2021-09-22T04:59:17+05:30
url: /kubernetes-ingress/
categories: [Kubernetes]
tags: [Kubernetes, DevOps, Java, SpringBoot]
---

In the previous article [Kubernetes - Blue/Green Deployments]({{< relref "2021-09-14-kubernetes-blue-green-deployments.md" >}}) we have learned how to release a new version of application using **Blue/Green Deployments strategy**.

<!--more-->


* [1. Getting Started with Kubernetes]({{< relref "2021-09-01-getting-started-with-kubernetes.md" >}})
* [2. Kubernetes - Releasing a new version of the application using Deployment Rolling Updates]({{< relref "2021-09-07-kubernetes-deployment-rolling-updates.md" >}})
* [3. Kubernetes - Blue/Green Deployments]({{< relref "2021-09-14-kubernetes-blue-green-deployments.md" >}})
* [4. Kubernetes - Exposing Services to outside of Cluster using Ingress]({{< relref "2021-09-22-kubernetes-ingress.md" >}})

In this article, we are going to learn how to use **Ingress** to expose HTTP and HTTPS routes from outside the cluster to services within the cluster.

So far in this Kubernetes article series we have seen how to create **Deployments** and expose them as **Services** and access them in different ways based on Service type.
If it is a **ClusterIP** type Service then we ssh into Minikube and access the application. If it is a **NodePort** type Service then we accessed the application using Node IP (Minikube IP) and node port. 

But we don't expect the end-users to remember IP addresses and port numbers to access our services, right? We use easy to remember domain names such as **google.com**, **stackoverflow.com** etc which are mapped to IP Addresses. 

In Kubernetes world we can use **Ingress** to route the traffic based on various rules.

Let's say we have 2 versions of our sample application k8s-boot-demo, and we want to run both versions, and we want to make them available as follows:

* http://k8sdemo.com/v1/ should provide access to version v1
* http://k8sdemo.com/v2/ should provide access to version v2
* http://api.k8sdemo-v1.com/ should provide access to version v1
* http://api.k8sdemo-v2.com/ should provide access to version v2

Here we need to map same domain name with different path prefixes to different services. 
Also, we need to map two different domain names to different services.

Let us see how can use Ingress to achieving this requirement.

### 1. Configure Domain names in hosts file

As we don't own those domain names let us configure them locally in our hosts file (/etc/hosts) for local testing.
Get the Minikube IP and map the domain names to that IP.

```shell
$ minikube ip
192.168.99.103
```

**/etc/hosts**

```shell
255.255.255.255 broadcasthost
::1 localhost

192.168.99.103 k8sdemo.com
192.168.99.103 api.k8sdemo-v1.com
192.168.99.103 api.k8sdemo-v2.com
```

### 2. Deploy Ingress Controller on Kubernetes Cluster
Unlike other controllers Kubernetes doesn't come with a Ingress Controller pre-installed.
We need to select the Ingress Controller that is supported by the Cloud platform and depending on our choice/needs.
Please see https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/ to get a list of supported Ingress Controllers.

As we are using Minikube and minikube already comes with Nginx Ingress Controller as an Addon, we just need to enable it.

```shell
$ minikube addons enable ingress
```

You can learn more about Nginx Controller at https://kubernetes.github.io/ingress-nginx/

### 3. Deploy services

We are going to deploy the same service we built and used in previous articles. We will deploy both versions v1 and v2.
They can be same application or different application, doesn't matter.

Create k8s-boot-demo-v1 manifest file **app-v1.yaml** as follows: 

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-boot-demo-v1-deployment
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: k8s-boot-demo-v1
  template:
    metadata:
      labels:
        app: k8s-boot-demo-v1
    spec:
      containers:
        - name: k8s-boot-demo-v1
          image: sivaprasadreddy/k8s-boot-demo:v1
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              port: 8080
              path: /actuator/health/readiness
          livenessProbe:
            httpGet:
              port: 8080
              path: /actuator/health/liveness
          startupProbe:
            httpGet:
              port: 8080
              path: /actuator/health/readiness
            initialDelaySeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: k8s-boot-demo-v1-service
spec:
  type: ClusterIP
  selector:
    app: k8s-boot-demo-v1
  ports:
    - name: app-port-mapping
      protocol: TCP
      port: 8080
      targetPort: 8080
```

Create k8s-boot-demo-v2 manifest file **app-v2.yaml** as follows:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: k8s-boot-demo-v2-deployment
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
  selector:
    matchLabels:
      app: k8s-boot-demo-v2
  template:
    metadata:
      labels:
        app: k8s-boot-demo-v2
    spec:
      containers:
        - name: k8s-boot-demo-v2
          image: sivaprasadreddy/k8s-boot-demo:v2
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              port: 8080
              path: /actuator/health/readiness
          livenessProbe:
            httpGet:
              port: 8080
              path: /actuator/health/liveness
          startupProbe:
            httpGet:
              port: 8080
              path: /actuator/health/readiness
            initialDelaySeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: k8s-boot-demo-v2-service
spec:
  type: ClusterIP
  selector:
    app: k8s-boot-demo-v2
  ports:
    - name: app-port-mapping
      protocol: TCP
      port: 8080
      targetPort: 8080
```

Deploy our services as follows:

```shell
$ kubectl apply -f app-v1.yaml
$ kubectl apply -f app-v2.yaml
$ kubectl get pods
```

### 4. Deploy Ingress Resources
Finally, the key part where we configure the rules mapping the domain names to Kubernetes services.

**ingress.yaml**

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: k8s-boot-demo-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    -  host: "k8sdemo.com"
       http:
         paths:
           - pathType: Prefix
             path: "/v1"
             backend:
               service:
                 name: k8s-boot-demo-v1-service
                 port:
                   number: 8080
           - pathType: Prefix
             path: "/v2"
             backend:
               service:
                 name: k8s-boot-demo-v2-service
                 port:
                   number: 8080

    - host: "api.k8sdemo-v1.com"
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: k8s-boot-demo-v1-service
                port:
                  number: 8080

    - host: "api.k8sdemo-v2.com"
      http:
        paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: k8s-boot-demo-v2-service
                port:
                  number: 8080
```

**Explanation of Ingress manifest:**

* We have configured **k8sdemo.com** host and used multiple paths configurations with different path prefixes to map to different services.
* We have configured **api.k8sdemo-v1.com** host and map it to Service version v1
* We have configured **api.k8sdemo-v2.com** host and map it to Service version v2

You can use suffixes and wildcards to fine tune the mappings, for more details see https://kubernetes.io/docs/concepts/services-networking/ingress/.

Also, different Ingress Controllers use different configurations to configure its inner workings. 
We have used **nginx.ingress.kubernetes.io/rewrite-target: /** annotation to [map to Target URI where the traffic must be redirected.](https://github.com/kubernetes/ingress-nginx/blob/main/docs/examples/rewrite/README.md)

Finally, we can test our services by using domain names as follows:

```shell
curl http://k8sdemo.com:80/v1/
{"app":"K8S SpringBoot Demo","version":"v1","hostName":"k8s-boot-demo-v1-deployment-657df6b8df-jqgj7"}
curl http://k8sdemo.com:80/v2/
{"version":"v2","app":"K8S SpringBoot Demo","hostName":"k8s-boot-demo-v2-deployment-55b6dfd4d4-69sgz"}
curl http://api.k8sdemo-v1.com:80/
{"app":"K8S SpringBoot Demo","version":"v1","hostName":"k8s-boot-demo-v1-deployment-657df6b8df-jqgj7"}
curl http://api.k8sdemo-v2.com:80/
{"version":"v2","app":"K8S SpringBoot Demo","hostName":"k8s-boot-demo-v2-deployment-55b6dfd4d4-69sgz"}
```

## Summary

We have seen how to use Ingress to expose the Services to outside of Kubernetes Cluster.
As we have used Minikube for local development and it already has Nginx Controller support as an Addon it is relatively easy to setup/enable Ingress.

But in production setup usually Kubernetes Administrators will configure the Ingress Controller based on the Cloud Platform and available choices.
We can use wildcards also to configure the mapping instead of listing down each host name to Service mapping.