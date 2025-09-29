---
title: 'Spring Security OAuth 2 Tutorial - 5 : Implicit & Resource Owner Password Credentials Flows'
author: Siva
images:
  - /preview-images/spring-security-oauth2-part5.webp
type: post
draft: false
date: 2023-09-27T03:30:00.000Z
url: /blog/spring-security-oauth2-tutorial-implicit-and-resource-owner-password-credentials-flow
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - SpringSecurity
  - OAuth2
description: In this tutorial, you will learn how OAuth 2.0 Implicit Flow and Resource Owner Password Credentials Flow works.
aliases:
  - /spring-security-oauth2-tutorial-implicit-and-resource-owner-password-credentials-flow
---

In the [Part 4: OAuth 2.0 Authorization Code Flow with PKCE]({{< relref "2023-09-27-spring-security-oauth2-tutorial-part4.md" >}}), 
we learned how to acquire **access_token** using **Authorization Code Flow with PKCE**. 

In this article, we will explore how to use **Implicit Flow** and **Resource Owner Password Credentials Flow**.

<!--more-->


## Implicit Flow
The **Implicit Flow** is a kind of shorter version of **Authorization Code Flow** where you will be directly getting **access_token**
using **authorization_endpoint** itself.

{{< box warning >}}
**IMPORTANT**

The **Implicit Flow** and **Resource Owner Password Credentials Flow** are **DEPRECATED**.

Unless you have a good reason, you shouldn't be using them.
{{< /box >}}

If you have been following this series, you know how to create a Client with certain **Authentication flows** enabled.
Instead of creating a new client, let's enable **Implicit flow** for **messages-webapp** client.

To learn how to create a new **Client**, please see [Create Client](https://www.sivalabs.in/spring-security-oauth2-tutorial-introduction/#create-client)

Open the following URL in the browser window:

```shell
http://localhost:9191/realms/sivalabs/protocol/openid-connect/auth?
  response_type=id_token%20token
  &client_id=messages-webapp
  &redirect_uri=http://localhost:8080/callback
  &scope=openid%20profile
  &state=randomstring
  &nonce=another_randomstring
```

* Then you will be redirected to Keycloak's Login page.
* Login with the user credentials **siva/siva1234**.
* Then you will be redirected the **Redirect URI** which has **access_token** and **id_token**.

```shell
http://localhost:8080/callback#
  state=randomstring
  &session_state=51692fdb-8b72-45b7-a341-fa73e97b5139
  &id_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU2MTUzOTQsImlhdCI6MTY5NTYxNDQ5NCwiYXV0aF90aW1lIjoxNjk1NjE0NDk0LCJqdGkiOiI2MjFmNTJmMC0wMDBmLTQ1ZmUtYWYzOC1iY2YzZWM2ZDk1MTEiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkxOTEvcmVhbG1zL3NpdmFsYWJzIiwiYXVkIjoibWVzc2FnZXMtd2ViYXBwIiwic3ViIjoiY2ExYTJmMzQtMTYxNC00NWRkLTg2YzEtNWVhZmZmMDg1ZDhhIiwidHlwIjoiSUQiLCJhenAiOiJtZXNzYWdlcy13ZWJhcHAiLCJub25jZSI6ImFub3RoZXJfcmFuZG9tc3RyaW5nIiwic2Vzc2lvbl9zdGF0ZSI6IjUxNjkyZmRiLThiNzItNDViNy1hMzQxLWZhNzNlOTdiNTEzOSIsImF0X2hhc2giOiJiamR6MC1NeWltQ0xrSzdqaWRRbHp3IiwiYWNyIjoiMSIsInNfaGFzaCI6IlJtVE5Ld0lYaTNXRFhzRFlObTQtUHciLCJzaWQiOiI1MTY5MmZkYi04YjcyLTQ1YjctYTM0MS1mYTczZTk3YjUxMzkiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IlNpdmEgS2F0YW1yZWRkeSIsInByZWZlcnJlZF91c2VybmFtZSI6InNpdmEiLCJnaXZlbl9uYW1lIjoiU2l2YSIsImZhbWlseV9uYW1lIjoiS2F0YW1yZWRkeSIsImVtYWlsIjoic2l2YUBnbWFpbC5jb20ifQ.TIcmVBti96HuZvrYe_14mVJlfopXI2PhdMdWBtPPASpJc-DKrL9argy08sYZKqJTTcmWwnIwKK2o1vddVxA4zUP2tnqqg6ymz1trN3J8r4h-WSvIp907vnS0R7iHei56L6MQX2DZLJ8pOdSmti8wg_9fu4gQJBE2sHRTlrlOP39dh8yohMGidM-Z5iFbLCIzOQXA6B6ewMZll5iwL3ssJ716Ve9cO4qHGCneRGpb3mO7jclY87YSGM-wqr6ur00ylQ_BCGyCdl-f-xskSeDX09iQKFSTX_acMxB7FNi21BL7dMx8_22XPFOwNkX8ha8Vb7eTRMYEMyB776i33FLu0A
  &access_token=eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU2MTUzOTQsImlhdCI6MTY5NTYxNDQ5NCwiYXV0aF90aW1lIjoxNjk1NjE0NDk0LCJqdGkiOiI1N2NiYmRkMC0wNGFmLTRlMDctYWZlNC02ZmQ5MmY0YjA2MzAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkxOTEvcmVhbG1zL3NpdmFsYWJzIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImNhMWEyZjM0LTE2MTQtNDVkZC04NmMxLTVlYWZmZjA4NWQ4YSIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1lc3NhZ2VzLXdlYmFwcCIsIm5vbmNlIjoiYW5vdGhlcl9yYW5kb21zdHJpbmciLCJzZXNzaW9uX3N0YXRlIjoiNTE2OTJmZGItOGI3Mi00NWI3LWEzNDEtZmE3M2U5N2I1MTM5IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc2l2YWxhYnMiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6IjUxNjkyZmRiLThiNzItNDViNy1hMzQxLWZhNzNlOTdiNTEzOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2l2YSBLYXRhbXJlZGR5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2l2YSIsImdpdmVuX25hbWUiOiJTaXZhIiwiZmFtaWx5X25hbWUiOiJLYXRhbXJlZGR5IiwiZW1haWwiOiJzaXZhQGdtYWlsLmNvbSJ9.XsYc69HnM9VaJZFF568nRiZhh8RYEw6Hq2WGnJ4jr3tmZvgMF0QK2RtlBT9BuX4A11XHjyNZqGYNf55x0k4bPXjhPzWI-lC0shhsKrXGYrnhVcComXxMbO_38ypRY_EMeBWRTXu0bvcKInYMjVoItfoLheH-kbcziK6O16yFGftOG-YYw0uVzs_DrOkjQjs1BS2L56yXcRgN72EBXMT-Cv6OLMTSj6WXjfg1nmRl0NRJdeZv0iafSolmqSpJeqXwPzM2hgZ2hPzaq90qipndQrZ05xesMtzXMNlev0ozYPN7xKSa7arHMYky8y4OMpCQDJzkSwekjUEQUSU9Sqg_VA
  &token_type=Bearer
  &expires_in=900
```

As you can see, the **access_token** and **id_token** are returned via the front-channel thru browser URL which not secure.

## Resource Owner Password Credentials Flow
In **Resource Owner Password Credentials Flow**, we will get **access_token** and **id_token** by using the resource owner (end user) credentials.

Instead of creating a new client, let's enable **Direct access grants**, which enables **Resource Owner Password Credentials Grant**, 
for **messages-webapp** client.

Now we can get the **access_token** and **id_token** using the token_endpoint with the following cURL command:

```shell
curl --location 'http://localhost:9191/realms/sivalabs/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'client_id=messages-webapp' \
--data-urlencode 'username=siva' \
--data-urlencode 'password=siva1234' \
--data-urlencode 'client_secret=qVcg0foCUNyYbgF0Sg52zeIhLYyOwXpQ' \
--data-urlencode 'scope=openid'
```

This should return the JSON response something like this:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU2MTU4NTYsImlhdCI6MTY5NTYxNTU1NiwianRpIjoiZmE4ZDRjZGUtMTk3NS00Mzc1LWJhMTAtMWVjYmJmZjIzZGFlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo5MTkxL3JlYWxtcy9zaXZhbGFicyIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJjYTFhMmYzNC0xNjE0LTQ1ZGQtODZjMS01ZWFmZmYwODVkOGEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtZXNzYWdlcy13ZWJhcHAiLCJzZXNzaW9uX3N0YXRlIjoiYjJiM2YzYTAtYTQwMi00MTdjLWJjOTQtMmMxNzcwZjY0YzE0IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vbG9jYWxob3N0OjgwODAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtc2l2YWxhYnMiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgZW1haWwgcHJvZmlsZSIsInNpZCI6ImIyYjNmM2EwLWE0MDItNDE3Yy1iYzk0LTJjMTc3MGY2NGMxNCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2l2YSBLYXRhbXJlZGR5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2l2YSIsImdpdmVuX25hbWUiOiJTaXZhIiwiZmFtaWx5X25hbWUiOiJLYXRhbXJlZGR5IiwiZW1haWwiOiJzaXZhQGdtYWlsLmNvbSJ9.J4UfeHwDT906wPa58pr9a_AIM8UqrBVB8mO1Dvt_FXNLO5DUHUPWv9X25htrHIkl6L4M_SeElOep8MfFBQWeLq-yjrkd7PsXZFh1bjqSscu0bdeIqMOgBdDKZz97XY6UYS5sWjzaws4KvYcbWvLp3athhMts0Jx1Tag57FPWF1SBXwe9ROLQIDmWbm7-jCqiU9GLmBYv9S03SqvXubAXbINDX63-8i7Uyj1NdrXSGARpELdaoc9WZiX28D1eclaPzyI4r3gJ7wxmpRQ-sBTLcC5fanm__Yfuwja0UgjhK6jtCUS_SuxL2uJv4fu3BiQYGyLGHPKmJ9e1ev9PWFU7CQ",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5N2E1NTU3Ni01MThlLTQ1MDItOWQyNi1jNzVmYjZhNGRhZWEifQ.eyJleHAiOjE2OTU2MTczNTYsImlhdCI6MTY5NTYxNTU1NiwianRpIjoiOTI0YmVhM2MtYWRmZC00NDUwLWFjZWYtM2U5M2Q3MDI3NzQxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo5MTkxL3JlYWxtcy9zaXZhbGFicyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9yZWFsbXMvc2l2YWxhYnMiLCJzdWIiOiJjYTFhMmYzNC0xNjE0LTQ1ZGQtODZjMS01ZWFmZmYwODVkOGEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoibWVzc2FnZXMtd2ViYXBwIiwic2Vzc2lvbl9zdGF0ZSI6ImIyYjNmM2EwLWE0MDItNDE3Yy1iYzk0LTJjMTc3MGY2NGMxNCIsInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiJiMmIzZjNhMC1hNDAyLTQxN2MtYmM5NC0yYzE3NzBmNjRjMTQifQ._1_ODyFLuiOt6kquAQM9MAJpVCBlD6XphSsdaI0d9YM",
  "token_type": "Bearer",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU2MTU4NTYsImlhdCI6MTY5NTYxNTU1NiwiYXV0aF90aW1lIjowLCJqdGkiOiJkMWRiMzZkMC1kYmMyLTRmYmUtODE4ZS1mMmNjMWUwNzU5NjMiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkxOTEvcmVhbG1zL3NpdmFsYWJzIiwiYXVkIjoibWVzc2FnZXMtd2ViYXBwIiwic3ViIjoiY2ExYTJmMzQtMTYxNC00NWRkLTg2YzEtNWVhZmZmMDg1ZDhhIiwidHlwIjoiSUQiLCJhenAiOiJtZXNzYWdlcy13ZWJhcHAiLCJzZXNzaW9uX3N0YXRlIjoiYjJiM2YzYTAtYTQwMi00MTdjLWJjOTQtMmMxNzcwZjY0YzE0IiwiYXRfaGFzaCI6IjZ4Rk1lTjR6a1Q1UkIzdE9lWFRteEEiLCJhY3IiOiIxIiwic2lkIjoiYjJiM2YzYTAtYTQwMi00MTdjLWJjOTQtMmMxNzcwZjY0YzE0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJTaXZhIEthdGFtcmVkZHkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzaXZhIiwiZ2l2ZW5fbmFtZSI6IlNpdmEiLCJmYW1pbHlfbmFtZSI6IkthdGFtcmVkZHkiLCJlbWFpbCI6InNpdmFAZ21haWwuY29tIn0.UPR78Ps7colWhBAHcGr6hvx4bQdEnvt6j9oDuFtRLTYRMCSb-dlG73ehWDov7AEczcPtfnoEamBgJ_5Hr9XQvA0oQ_9ye8JT6bPrUuUxB-CK6BPsdtyHNyV6jnxolkz26QYsfsB-fHBObnlwVZEKouiGwdGl08GR8xPlqZgK-f1Lo6kKnqLE4i6hdEzJP_z1N5-TE2pSQ-eqc792Mg5z2WB04ug5m2B_NSODVSnXZ_KzYwI7aEKgHBnDac9uisDJrSfqxr2V4lysyRMjUN4odK10hFBn0MdsI-Z1a7d3DKjssyBGZ9k0ZXNWfOBAtzZH7W5s7fLcOViPLYBxgTNUkw",
  "not-before-policy": 0,
  "session_state": "b2b3f3a0-a402-417c-bc94-2c1770f64c14",
  "scope": "openid email profile"
}
```

As you can see, with Resource Owner Password Credentials Flow, the end user needs to share their credentials 
with the client application, which is not recommended.

## Summary
In this part, we have learned how to get **access_token** using **Implicit Flow** and **Resource Owner Password Credentials Flow**.
Remember that **Implicit Flow** and **Resource Owner Password Credentials Flow** are DEPRECATED and not recommended to use anymore.

So far, we have learned how to use various OAuth 2 and OpenID Connect flows.
**Next, we will start building Spring Boot application(s) and protect them using Spring Security OAuth 2 and Keycloak.**
