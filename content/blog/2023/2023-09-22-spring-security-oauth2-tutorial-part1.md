---
title: "Spring Security OAuth 2 Tutorial - 1 : Getting familiar with OAuth 2 concepts"
author: Siva
images: ["/preview-images/spring-security-oauth2-part1.webp"]
type: post
draft: false
date: 2023-09-22T06:00:00+05:30
url: /spring-security-oauth2-tutorial-introduction
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, SpringSecurity, OAuth2]
description: In this tutorial, you will learn the basic concepts of OAuth 2.0 using Keycloak.
---
Security is a complex topic to understand in-depth. In addition to that, implementing security for complex microservices based systems 
using [OAuth 2.0](https://datatracker.ietf.org/doc/html/rfc6749) and 
[OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) specs is even harder. 
Frameworks and libraries, like [Spring Security](https://spring.io/projects/spring-security), help to reduce the complexity,
but still there is a steep learning curve to understand how to properly implement security.

<!--more-->


In this **Spring Security OAuth2 Tutorial series**, I would like to share my learning on implementing security 
for a simple microservices based application using [Spring Security OAuth2](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html). 

There are many Identity Provider solutions like **Keycloak**, **Okta**, **Auth0**, etc.
In this series, we are going to use [Keycloak](https://www.keycloak.org/), which is an Open Source Identity and Access Management solution.

{{< box warning >}}
**I am NOT a Security/OAuth2 Expert**

I am certainly not an expert on Security, OAuth2, Keycloak.
I am sharing my learning based on my understanding of the concepts.
If you think any of the concepts or explanations is incorrect, please feel free to let me know.
{{< /box >}}


* [Spring Security OAuth 2 Tutorial - 1 : Getting familiar with OAuth 2 concepts]({{< relref "2023-09-22-spring-security-oauth2-tutorial-part1.md" >}})
* [Spring Security OAuth 2 Tutorial - 2 : Authorization Code Flow]({{< relref "2023-09-24-spring-security-oauth2-tutorial-part2.md" >}})
* [Spring Security OAuth 2 Tutorial - 3 : Client Credentials Flow]({{< relref "2023-09-25-spring-security-oauth2-tutorial-part3.md" >}})
* [Spring Security OAuth 2 Tutorial - 4 : Authorization Code Flow with PKCE]({{< relref "2023-09-27-spring-security-oauth2-tutorial-part4.md" >}})
* [Spring Security OAuth 2 Tutorial - 5 : Implicit & Resource Owner Password Credentials Flows]({{< relref "2023-09-27-spring-security-oauth2-tutorial-part5.md" >}})
* [Spring Security OAuth 2 Tutorial - 6 : Microservices Sample Project Setup]({{< relref "2023-09-28-spring-security-oauth2-tutorial-part6.md" >}})
* [Spring Security OAuth 2 Tutorial - 7 : Securing Spring MVC Client Application]({{< relref "2023-09-28-spring-security-oauth2-tutorial-part7.md" >}})
* [Spring Security OAuth 2 Tutorial - 8 : Securing Resource Server]({{< relref "2023-10-02-spring-security-oauth2-tutorial-part8.md" >}})
* [Spring Security OAuth 2 Tutorial - 9 : Invoking Secured Resource Server APIs from Client Application]({{< relref "2023-10-06-spring-security-oauth2-tutorial-part9.md" >}})
* [Spring Security OAuth 2 Tutorial - 10 : Service to Service Communication using Client Credentials Flow]({{< relref "2023-10-09-spring-security-oauth2-tutorial-part10.md" >}})

We are not going to jump right into the implementation of Spring Security OAuth2.
Instead, we will learn one thing at a time in slow pace so that it won't be overwhelming.

## Understand the basics of OAuth 2.0 and OpenID Connect
The first step in the journey of learning OAuth 2.0 and OpenID Connect is to understand some core concepts
such as what are the various roles in OAuth2, what are the various Grant Types and which one to use when.

Instead of me repeating what I learned from this great video, I highly recommend watching this video
to get a clear understanding of OAuth 2.0 and OpenID Connect concepts.

**OAuth 2.0 and OpenID Connect (in plain English)**

{{< youtube 996OiexHze0 >}}

To quickly summarize, in an OAuth2 system there are various components that play different roles and there are different approaches to authenticate a user.

### OAuth2.0 Roles

* **Resource Owner:** The resource owner is typically the end user, who authorizes an application (Client) to access his/her account.
* **Resource Server:** Server hosting the protected resources. This is the API you want to access.
* **Client:** An application (which Resource Owner is using) requesting access to a protected resource on behalf of the Resource Owner.
* **Authorization Server:** Server that authenticates the Resource Owner and issues access tokens after successful authorization.

### OAuth2.0 Grant Types
* Authorization Code Flow
* Authorization Code Flow with PKCE
* Client Credentials Flow
* Implicit Flow (not recommended)
* Resource Owner Password Flow (not recommended)

OAuth 2.0 only concerns about **Authorization**, but not **Authentication**.
**OpenID Connect** specification is created to address **Authentication** which is built as a layer on top of OAuth 2.0.

We will discuss more on which grant type to use when in the upcoming parts of this series.

## Installing Keycloak
As mentioned earlier, we are going to use Keycloak for implementing OAuth2.0/OpenID Connect based security.
Let's get started with the installation of Keycloak using docker compose. 

```yaml
version: '3.8'

services:
  keycloak:
    image: quay.io/keycloak/keycloak:22.0.3
    command: ['start-dev']
    container_name: keycloak
    hostname: keycloak
    environment:
      - KEYCLOAK_ADMIN=admin
      - KEYCLOAK_ADMIN_PASSWORD=admin1234
    ports:
      - "9191:8080"
```

Now start the Keycloak container as follows:

```shell
$ docker compose up -d
```

We started the keycloak container in dev mode and configured Admin User credentials using environment variables.
The container's port 8080 is mapped to host's port 9191.

Now you can access the Keycloak Admin Console at [http://localhost:9191](http://localhost:9191).

## Create new Realm
From the Keycloak's documentation:
> A realm manages a set of users, credentials, roles, and groups. 
> A user belongs to and logs into a realm. Realms are isolated from one another and can only manage 
> and authenticate the users that they control.

You can create a new realm to isolate a set of clients, users, roles, etc from others.

Once you login into Admin Console using the credentials **admin/admin1234**, 
there is a dropdown in the top left corner that provides an option to create a new realm. 

Enter **Realm name** as **sivalabs**, keep **Enabled** **On** and click on **Create**.

Upon successful creation, the new realm should be automatically selected. 
If not, select the **sivalabs** realm from the dropdown.

## Create Client
To create a new client, click on **Clients** on the left side nav menu and click on **Create client** button. 

* **General Settings**:
  * **Client type**: OpenID Connect
  * **Client ID**: messages-webapp

* **Capability config**:
  * **Client authentication**: On
  * **Authorization**: Off
  * **Authentication flow**: Check **Standard flow** On and uncheck the rest of the checkboxes

* **Login settings**:
  * **Root URL**: http://localhost:8080
  * **Home URL**: http://localhost:8080
  * **Valid redirect URIs**: http://localhost:8080/callback
  * **Valid post logout redirect URIs**: http://localhost:8080
  * **Web origins**: http://localhost:8080

Once the client is created with the above configuration, you will be taken to the newly created Client's **Settings** page.
Click on the **Credentials** tab and copy the **Client secret** value.

In my case, the **Client secret** is **qVcg0foCUNyYbgF0Sg52zeIhLYyOwXpQ**.

{{< box info >}}
**Keycloak Client AccessType**

If you have used Keycloak's earlier versions, you might know that there was an option called **AccessType** 
with possible values of **public**, **confidential**, **bearer-only**. In the new version, there is no explicit **AccessType** field.  

* If **Client authentication** is **Off** then it is **public** client.
* If **Client authentication** is **On**, then it is **confidential** client.
* If **Client authentication** is **On**, but none of the **Authentication flow** options is enabled, then it is **bearer-only** client.

Now you might wonder, what are **public**, **confidential**, **bearer-only** clients?

* A **public** client is a user-facing application which doesn't have a server backend, like Single Page Applications. They can't securely store any sensitive data such as **Client secret**.
* A **confidential** client is a web application which runs on a backend server, like a Spring MVC application. They can securely store sensitive data such as **Client secret**.
* A **bearer-only** client is typically a backend only application (API) which expects **access_token** from the caller. If they don't provide a valid **access_token** then it will simply return **Unauthorized** response and does not initiate authentication flow.
{{< /box >}}

## Create User
Now, let's create a User. Click on **Users** on the left side nav menu, and click on **Add user** button.

Create a user with the following details:

* **Username**: siva
* **Email**: siva@gmail.com
* **Email verified**: Yes
* **First name**: Siva
* **Last name**: Katamreddy

Once the user is created, go to the **Credentials** tab and set the **Password** to **siva1234** with **Temporary: Off**.

Now you should be able to login into **sivalabs** realm using the **siva** user's credentials.

Go to [http://localhost:9191/realms/sivalabs/account/](http://localhost:9191/realms/sivalabs/account/) and SignIn with the credentials **siva/siva1234**.

## Summary
Okay, now we have the initial setup ready to explore OAuth 2.0 and OpenID Connect.

In the next [Spring Security OAuth 2 Tutorial - 2 : Authorization Code Flow]({{< relref "2023-09-24-spring-security-oauth2-tutorial-part2.md" >}}) article, we are going to explore **how to get Access Token using Authorization Code Flow**.
