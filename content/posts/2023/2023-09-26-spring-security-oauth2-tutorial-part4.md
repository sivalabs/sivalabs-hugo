---
title: "Spring Security OAuth 2 Tutorial - 4 : Authorization Code Flow with PKCE"
author: Siva
images: ["/preview-images/spring-security-oauth2-part4.webp"]
type: post
draft: false
date: 2023-09-26T06:00:00+05:30
url: /spring-security-oauth2-tutorial-authorization-code-flow-with-pkce
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, SpringSecurity, OAuth2]
description: In this tutorial, you will learn how OAuth 2.0 Authorization Code Flow with PKCE works.
---
In the [Part 3: OAuth 2.0 Client Credentials Flow]({{< relref "2023-09-25-spring-security-oauth2-tutorial-part3.md" >}}), 
we learned how to acquire **access_token** using **Client Credentials Flow**. 
In this article, we will explore how to use **Authorization Code Flow with PKCE**.

## Authorization Code Flow with PKCE
The **Authorization Code Flow with PKCE** is an OpenId Connect flow primarily designed to secure native, 
mobile applications and Single Page Applications (SPA).
The PKCE, typically pronounced as "pixy", is an acronym for **Proof Key for Code Exchange**.

{{< box info >}}
**IMPORTANT**

The **Authorization Code Flow with PKCE** can be used to secure web apps running on server as well.
In this scenario, PKCE acts as an additional layer of protection.
{{< /box >}}

## Create a "public" Client
Let's create a new client named **messages-spa**.

* **General Settings**:
  * **Client type**: OpenID Connect
  * **Client ID**: messages-spa

* **Capability config**:
  * **Client authentication**: Off
  * **Authorization**: Off
  * **Authentication flow**: Check **Standard flow** On and uncheck the rest of the checkboxes

* **Login settings**:
  * **Root URL**: http://localhost:3000
  * **Home URL**: http://localhost:3000
  * **Valid redirect URIs**: http://localhost:3000/callback
  * **Valid post logout redirect URIs**: http://localhost:3000
  * **Web origins**: http://localhost:3000
    
Once the client is created with the above configuration, you will be taken to the newly created Client's **Settings** page.
Click on the **Advanced** tab, go to **Advanced Settings** section and update **Proof Key for Code Exchange Code Challenge Method** value to **S256**.

## Getting Access Token using Authorization Code Flow with PKCE
In **Authorization Code Flow with PKCE**, first we get an **authorization_code** via **Redirect URL** on front-channel (browser url).

First, we need to generate a **code verifier** which is a cryptographically random string using the characters A-Z, a-z, 0-9, 
and the punctuation characters -._~ (hyphen, period, underscore, and tilde), between 43 and 128 characters long.

Once the **code verifier** is generated, generate the **code challenge** which is a BASE64-URL-encoded string of the SHA256 hash of the code verifier.

You can use https://www.oauth.com/playground/authorization-code-with-pkce.html to generate code verifier and code challenge.

* **code verifier:** M7Q3C-V-_BafRd251gvQLhHw5lYRUYuAlbtT7BCF8cnDiHSV
* **code challenge:** gD2zOSHT__2UcU_BkXqqMld3b7TQ764LaPUOXMSDCMw

Now open the following URL in a browser window:

```shell
http://localhost:9191/realms/sivalabs/protocol/openid-connect/auth?
  response_type=code
  &client_id=messages-spa
  &redirect_uri=http://localhost:3000/callback
  &state=randomstring
  &response_mode=query
  &scope=openid
  &code_challenge=gD2zOSHT__2UcU_BkXqqMld3b7TQ764LaPUOXMSDCMw
  &code_challenge_method=S256
```

* Then you will be redirected to Keycloak's Login page.
* Login with the user credentials **siva/siva1234**.
* Then you will be redirected the **Redirect URI** which has **code** as a query parameter.

```shell

http://localhost:3000/callback?
  state=randomstring
  &session_state=d0da5382-4408-4548-af53-fe4fb948c18c
  &code=052aa7cf-a868-4b95-aa59-6a75eaff26d8.d0da5382-4408-4548-af53-fe4fb948c18c.63de5a66-e986-46ca-9b0f-3944529f3ad9
```

The **authorization_code** is **052aa7cf-a868-4b95-aa59-6a75eaff26d8.d0da5382-4408-4548-af53-fe4fb948c18c.63de5a66-e986-46ca-9b0f-3944529f3ad9**.

Now that we have **authorization_code**, we can get **access_token** using **token_endpoint** as follows:

```shell
curl --location 'http://localhost:9191/realms/sivalabs/protocol/openid-connect/token' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=authorization_code' \
--data-urlencode 'client_id=messages-spa' \
--data-urlencode 'redirect_uri=http://localhost:3000/callback' \
--data-urlencode 'code_verifier=M7Q3C-V-_BafRd251gvQLhHw5lYRUYuAlbtT7BCF8cnDiHSV' \
--data-urlencode 'code=052aa7cf-a868-4b95-aa59-6a75eaff26d8.d0da5382-4408-4548-af53-fe4fb948c18c.63de5a66-e986-46ca-9b0f-3944529f3ad9'
```

Here we are sending the original **code_verifier** which should match with the **code_verifier** sent in authorization_code request.

This should return the JSON response something like this:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU1NzAyNjcsImlhdCI6MTY5NTU2OTk2NywiYXV0aF90aW1lIjoxNjk1NTY5OTQxLCJqdGkiOiJkNzNjOTk4MS1jYzhmLTQ2NzItODcwYy03YzI2OTQ3ZDY3ZTkiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkxOTEvcmVhbG1zL3NpdmFsYWJzIiwiYXVkIjoiYWNjb3VudCIsInN1YiI6ImNhMWEyZjM0LTE2MTQtNDVkZC04NmMxLTVlYWZmZjA4NWQ4YSIsInR5cCI6IkJlYXJlciIsImF6cCI6Im1lc3NhZ2VzLXNwYSIsInNlc3Npb25fc3RhdGUiOiJmZDU1YTdmZi0xNTI2LTQ4MjYtODM1OS00MTFkZTU0ZmJhMWYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1zaXZhbGFicyIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6Im9wZW5pZCBlbWFpbCBwcm9maWxlIiwic2lkIjoiZmQ1NWE3ZmYtMTUyNi00ODI2LTgzNTktNDExZGU1NGZiYTFmIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJTaXZhIEthdGFtcmVkZHkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzaXZhIiwiZ2l2ZW5fbmFtZSI6IlNpdmEiLCJmYW1pbHlfbmFtZSI6IkthdGFtcmVkZHkiLCJlbWFpbCI6InNpdmFAZ21haWwuY29tIn0.f4Ic6ggLBteou71NHzBWaCdcxKaaXnCSM38Glg3Xs1ruQz7uMtMJKewJOpZmCwrvodg0xCF0TZEl-wKWz3CnWEFFE92nIGGp3BIL42Coc4f8_aB_M0YvH3hUQznswYgZLcqvpN3k3e4yA70NfU9LWbNJudBkaLBYCDgPv62_t5620TPyg4cYxjcf2HHoCG4pU3Ms5DX-Zu6tc-aa3RT0uXp7CNzgQF3yqP0kmyu9SY8hkhLV05hdtsc5Szj0mH0e8T55IajM8Z_eYCi20VFaBehohM_Zr6FsP_S69numxhHLBy06JgQd9zUV8DpMPhOC0R4oTla4RpmPZo0B5ApFmw",
  "expires_in": 300,
  "refresh_expires_in": 1774,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5N2E1NTU3Ni01MThlLTQ1MDItOWQyNi1jNzVmYjZhNGRhZWEifQ.eyJleHAiOjE2OTU1NzE3NDEsImlhdCI6MTY5NTU2OTk2NywianRpIjoiNDYwMzlmNGQtMjBjZi00OWUxLTk2ZWEtNjI4NmI0MjdiOWQ2IiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo5MTkxL3JlYWxtcy9zaXZhbGFicyIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTE5MS9yZWFsbXMvc2l2YWxhYnMiLCJzdWIiOiJjYTFhMmYzNC0xNjE0LTQ1ZGQtODZjMS01ZWFmZmYwODVkOGEiLCJ0eXAiOiJSZWZyZXNoIiwiYXpwIjoibWVzc2FnZXMtc3BhIiwic2Vzc2lvbl9zdGF0ZSI6ImZkNTVhN2ZmLTE1MjYtNDgyNi04MzU5LTQxMWRlNTRmYmExZiIsInNjb3BlIjoib3BlbmlkIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiJmZDU1YTdmZi0xNTI2LTQ4MjYtODM1OS00MTFkZTU0ZmJhMWYifQ.QGgw00X_biM0kMLFDEG14UhjCaDBSuk1K8euqTxQpWk",
  "token_type": "Bearer",
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJMeVVPTDg4LVBGM3BYQzFpN3BIeGdFZTJwaWZJY3RyTXJiNklHOElmRTlVIn0.eyJleHAiOjE2OTU1NzAyNjcsImlhdCI6MTY5NTU2OTk2NywiYXV0aF90aW1lIjoxNjk1NTY5OTQxLCJqdGkiOiJjYjViMTQ0Ni0zOGQxLTQwN2ItYjIwYy03ZjQ0Mjg1MmZhYmYiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjkxOTEvcmVhbG1zL3NpdmFsYWJzIiwiYXVkIjoibWVzc2FnZXMtc3BhIiwic3ViIjoiY2ExYTJmMzQtMTYxNC00NWRkLTg2YzEtNWVhZmZmMDg1ZDhhIiwidHlwIjoiSUQiLCJhenAiOiJtZXNzYWdlcy1zcGEiLCJzZXNzaW9uX3N0YXRlIjoiZmQ1NWE3ZmYtMTUyNi00ODI2LTgzNTktNDExZGU1NGZiYTFmIiwiYXRfaGFzaCI6ImRETGgycU1RdU5FT3F4MkRSYVR3cGciLCJhY3IiOiIxIiwic2lkIjoiZmQ1NWE3ZmYtMTUyNi00ODI2LTgzNTktNDExZGU1NGZiYTFmIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJTaXZhIEthdGFtcmVkZHkiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzaXZhIiwiZ2l2ZW5fbmFtZSI6IlNpdmEiLCJmYW1pbHlfbmFtZSI6IkthdGFtcmVkZHkiLCJlbWFpbCI6InNpdmFAZ21haWwuY29tIn0.BTuFqcyrjB99R9kBfeLbVRSL5EMtgwS-BSgue77eGmFZxoBMV6UXM2qjWCoF9Wdozy2xmOQcqehvNGpnvR34YHfdrCxymuIZ7jIp7LvNW8sf5ZzsqnCq2OLCKPH4pyWFPqAGfvBYXqzhammNjPITKTKHH11nIcGnDGt7bhfDf-iDj3saDf0CZNkyOmh1Udi3Bkl3O4OBERWbg9xpsNGVks0SDONkDtLSL0IO1ODfgJRq1ZASRdn2i67EMDh5kpLnpKHPj7a1rMZyIUTdhbF4_sODWj3D6STFZxS_FjhcXdjYHLvtLdQBIOmHDjTqEXpwNp5OrVBtEvjgMj4ERNyoMw",
  "not-before-policy": 0,
  "session_state": "fd55a7ff-1526-4826-8359-411de54fba1f",
  "scope": "openid email profile"
}
```

With this **access_token** a Resource Server can invoke another Resource Server secured API endpoints.

{{< box info >}}
**How is PKCE secure?**

When I first looked at the PKCE flow, I was wondering how exactly PKCE is secure?
Anybody can create code verifier and code challenge, and there is no need to know client_secret.

This [How is PKCE secure?](https://security.stackexchange.com/questions/239946/how-is-pkce-secure)
question is exactly what I had in my mind. Please read the answers to understand how PKCE Flow is secure.

Another interesting question worth reading [What is PKCE actually protecting?](https://security.stackexchange.com/questions/175465/what-is-pkce-actually-protecting). 
{{< /box >}}

## Authorization Code Flow with PKCE using Postman

We can use [Postman](https://www.postman.com/) to get **access_token** using **Authorization Code Flow with PKCE** as follows:

* Open a New Request tab in Postman
* Go to the **Authorization** tab and select **OAuth 2.0** as **Type**.
* Under **Configure New Token** section:
  * **Grant Type**: Authorization Code (With PKCE)
  * **Callback URL**: http://localhost:3000/callback
  * **Auth URL**: http://localhost:9191/realms/sivalabs/protocol/openid-connect/auth
  * **Access Token URL**: http://localhost:9191/realms/sivalabs/protocol/openid-connect/token
  * **Client ID**: messages-spa
  * **Client Secret**: "" (leave it as blank)
  * **Code Challenge Method**: S256
  * **Code Verifier**: M7Q3C-V-_BafRd251gvQLhHw5lYRUYuAlbtT7BCF8cnDiHSV
  * **Scope**: profile
  * **State**: randomstring
  * **Client Authentication**: Send as Basic Auth header
* Click on **Get New Access Token** button
* Postman will show Keycloak's Login page in a popup
* Login with the credentials **siva/siva1234**
* Now you should be able to see the response with **Token Details**

{{< figure src="/images/oauth2-code-flow-pkce-postman.webp" alt="OAuth2 Authorization Code Flow with PKCE using Postman" >}}

If you specify **"openid profile"** as **scope** then you will also get **id_token**.

## Summary
In this part, we have learned how to get **access_token** using **Authorization Code Flow with PKCE**.
We also learned how to use Postman to do the same.

In the next part, we will explore how **OAuth 2.0 Implicit Flow** and **Resource Owner Password Flow** works.
