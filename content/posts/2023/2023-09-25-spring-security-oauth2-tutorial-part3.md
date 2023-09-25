---
title: "Spring Security OAuth 2 Tutorial - 3 : Client Credentials Flow"
author: Siva
images: ["/preview-images/spring-security-oauth2-part3.webp"]
type: post
draft: false
date: 2023-09-25T06:00:00+05:30
url: /spring-security-oauth2-tutorial-client-credentials-flow
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, SpringSecurity, OAuth2]
description: In this tutorial, you will learn how OAuth 2.0 Client Credentials Flow works.
---
In the [Part 2: OAuth 2.0 Authorization Code Flow]({{< relref "2023-09-24-spring-security-oauth2-tutorial-part2.md" >}}), 
we learned how to authenticate a user using **Authorization Code Flow**. 
In this article, we will explore how to use **Client Credentials Flow** that is typically used for **Service-to-Service** 
communication without any user (Resource Owner) context.

## Client Credentials Flow
Sometimes a Resource Server needs to interact with another Resource Server without any user context.
For instance, **Resource Server A** may run a scheduled job that will invoke a secured REST API endpoint on **Resource Server B**.
In these kinds of scenarios, we can use **Client Credentials Flow** to get an **access_token** from **Authorization Server**.

## Create a Client with Client Credentials Flow enabled
In order to use **Client Credentials Flow** for a Client, **Client Credentials Grant** support should be enabled.
In Keycloak **Client Credentials Grant** can be enabled by enabling **Service accounts roles** Authentication flow.

{{< box info >}}
**OAuth2 Client multiple Grants**

An OAuth 2.0 client can have multiple grant types like Authorization Code, Client Credentials, Implicit, etc enabled.
{{< /box >}}

Let's create a new client named **archival-service**.

* **General Settings**:
  * **Client type**: OpenID Connect
  * **Client ID**: archival-service

* **Capability config**:
  * **Client authentication**: On
  * **Authorization**: Off
  * **Authentication flow**: Check **Service accounts roles** On and uncheck the rest of the checkboxes

* **Login settings**:
  * **Root URL**: http://localhost:8282
  * **Home URL**: http://localhost:8282
    
Once the client is created with the above configuration, you will be taken to the newly created Client's **Settings** page.
Click on the **Credentials** tab and copy the **Client secret** value.

In my case, the **Client secret** is **bL1a2V2kouKh4sBMX0UrSmc0d3qubD1a**.

## Getting Access Token using Client Credentials Flow

We can get **access_token** using **Client Credentials Flow** using the following cURL command:

```shell
curl --location 'http://localhost:9191/realms/sivalabs/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=archival-service' \
--data-urlencode 'client_secret=bL1a2V2kouKh4sBMX0UrSmc0d3qubD1a'
```

This should return a JSON response something like this:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU1NTU3NjgsImlhdCI6MTY5NTU1NTQ2OCwianRpIjoiZDQwZjEwZjYtMGVjNi00YzAyLWI2ZTktOGE5NzMyYmIwODUzIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo5MTkxL3JlYWxtcy9zaXZhbGFicyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwZjQyYjZkYi0yZWRjLTQyNDUtODAwNC04OWM0Mjg1NDY2MjQiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhcmNoaXZhbC1zZXJ2aWNlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgyODIiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc2l2YWxhYnMiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJjbGllbnRIb3N0IjoiMTkyLjE2OC4xMTcuMSIsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1hcmNoaXZhbC1zZXJ2aWNlIiwiY2xpZW50QWRkcmVzcyI6IjE5Mi4xNjguMTE3LjEiLCJjbGllbnRfaWQiOiJhcmNoaXZhbC1zZXJ2aWNlIn0.HUjqMP8lxHJfNhxlwtZm8pui_LafuEGf9LxXh5K5tWIQHO6DkfZBWqAhqYggv3mv1QsbRO4akEnldTzrstoFN-4xO_kxKFv10VZLdcUcKf_hhjoySFcKlp0eh1cBRn-C-YyDun5kNOg8kx38G_T7T6F1GMXPAAbMabngmhX2Ke_V4SJZsZvphNu15tmKXnqk8ZUyPRGWSfB9yb19JU79FmiE7RJPMAKSFyV5nHt1HxhSsE7NHeMaqUAn7M5bsQa6em-YxNp3oB2ROA_s0RsACHk41U3d3gARBpZcR2ad2kO0DL_jCV22I2uS4XJCpkvE1MMB5nD6CPwt3Re-8-gGjw",
  "expires_in": 300,
  "refresh_expires_in": 0,
  "token_type": "Bearer",
  "not-before-policy": 0,
  "scope": "email profile"
}
```

With this **access_token** a Resource Server can invoke another Resource Server secured API endpoints.


{{< box info >}}
**OAuth2 Roles and Permissions**

Just having access_token doesn't necessarily mean you can access any resource on a Resource Server.
The access_token should have required roles/privileges to be able to successfully invoke a REST API endpoints on another Resource Server.

We will talk about roles and permission in the upcoming articles in the series.
{{< /box >}}

## Client Credentials Flow using Postman

We can use [Postman](https://www.postman.com/) to get **access_token** using **Client Credentials Flow** as follows:

* Open a New Request tab in Postman
* Go to the **Authorization** tab and select **OAuth 2.0** as **Type**.
* Under **Configure New Token** section:
  * **Grant Type**: Client Credentials
  * **Access Token URL**: http://localhost:9191/realms/sivalabs/protocol/openid-connect/token
  * **Client ID**: archival-service
  * **Client Secret**: bL1a2V2kouKh4sBMX0UrSmc0d3qubD1a
  * **Scope**: openid profile
  * **Client Authentication**: Send as Basic Auth header
* Click on **Get New Access Token** button
* Now you should be able to see the response with **Token Details**

{{< figure src="/images/oauth2-client-credentials-flow-postman.webp" alt="OAuth2 Client Credentials Flow using Postman" >}}


## Summary
In this part, we have learned how to get **access_token** using **Client Credentials Flow**.
We also learned how to use Postman to do the same.

In the next part, we will explore how **OAuth 2.0 Authorization Code Flow with PKCE** works.
