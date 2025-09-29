---
title: 'Spring Security OAuth 2 Tutorial - 7 : Securing Spring MVC Client Application'
author: Siva
images:
  - /preview-images/spring-security-oauth2-part7.webp
type: post
draft: false
date: 2023-09-28T03:30:00.000Z
url: /blog/spring-security-oauth2-tutorial-securing-springmvc-client-application
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - SpringSecurity
  - OAuth2
description: In this tutorial, we will create a Spring MVC + Thymeleaf web application and secure it with Spring Security OAuth 2.0 using Keycloak.
aliases:
  - /spring-security-oauth2-tutorial-securing-springmvc-client-application
---

In this article, we will create **messages-webapp** which is a **Spring MVC + Thymeleaf** web application 
and secure it with **Spring Security OAuth 2.0** using **Keycloak**.

<!--more-->


{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub: 
https://github.com/sivaprasadreddy/spring-security-oauth2-microservices-demo
{{< /box >}}


## Setup Keycloak using Docker Compose
In the previous article, we have already seen how to setup Keycloak using Docker Compose.

Create **docker-compose.yml** file with the following content:

```yaml
version: '3.8'
name: spring-security-oauth2-microservices-demo
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

Run the following command to start the Keycloak instance:

```shell
$ docker compose up -d
```

Now you can access the Keycloak admin console at http://localhost:9191/ and login using the credentials **admin/admin1234**.

## Create Keycloak Realm, Client and Users
In the previous articles, we have learned how to create a realm, client and users.
Please follow the steps mentioned in https://www.sivalabs.in/spring-security-oauth2-tutorial-introduction/#create-new-realm 
to create a new realm, client and user with one change for **Valid redirect URIs**.

Set **Valid redirect URIs** value to **http://localhost:8080/login/oauth2/code/messages-webapp** instead of **http://localhost:8080/callback**.

Now you should have the following details:

* **Keycloak Realm:** sivalabs
* **Client Configuration:**
  * **Client ID:** messages-webapp
  * **Client Secret:** O3SVuBs0Z25kpYoRtL5C0FhLwAnIx1CW (you might have different value)
  * **Root URL**: http://localhost:8080
  * **Home URL**: http://localhost:8080
  * **Valid redirect URIs:** http://localhost:8080/login/oauth2/code/messages-webapp
  * **Valid post logout redirect URIs**: http://localhost:8080/
  * **Web origins**: http://localhost:8080
* **User:** siva/siva1234

{{< box info >}}
**NOTE:**

Did you observe the **Valid redirect URIs** value? It is different from what we have configured (http://localhost:8080/callback) in the previous articles.
Spring Security implemented authentication filter to handle the OAuth 2.0 Authorization Code Grant flow.

In Spring Security OAuth 2.0 implementation, the default value of **redirect-uri** is **{baseUrl}/login/oauth2/code/{registrationId}**.
We are going to use **messages-webapp** as the **registrationId** for our client application.
So, in Keycloak we need to configure the **Valid redirect URIs** as **http://localhost:8080/login/oauth2/code/messages-webapp**.
{{< /box >}}

{{< box warning >}}
**IMPORTANT:**

Make sure you have configured the **Root URL**, **Home URL**, **Valid redirect URIs**, 
**Valid post logout redirect URIs** and **Web origins** exactly as mentioned above.
Having an extra **"/"** at the end or not having **"/"** at the end may result in errors like **invalid_redirect_uri**.
{{< /box >}}

## Create messages-webapp
You can generate **messages-webapp** using **Spring Initializr** by clicking on this [link](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.1.4&packaging=jar&jvmVersion=17&groupId=com.sivalabs&artifactId=messages-webapp&name=messages-webapp&packageName=com.sivalabs.messages&dependencies=web,validation,oauth2-client,security,thymeleaf).
We have selected the starters **Web**, **Validation**, **OAuth2 Client**, **Security** and **Thymeleaf**.
Once the application is generated, open it in your favourite IDE.

### Configure OAuth 2.0 Client Registration Properties
An OAuth 2.0 Client application can use multiple Authentication Providers such as **Google**, **Facebook**, **GitHub**, **Okta**, **Keycloak**, etc.
In our case, we are going to use only one Authentication Provider which is **Keycloak**.

We need to configure the client application details using **spring.security.oauth2.client.registration.{registrationId}.\*** 
and **spring.security.oauth2.client.provider.{registrationId}.\*** properties in **application.properties** file. 
We will use **messages-webapp** as **registrationId** and configure the properties as follows:

```properties
spring.security.oauth2.client.registration.messages-webapp.client-id=messages-webapp
spring.security.oauth2.client.registration.messages-webapp.client-secret=O3SVuBs0Z25kpYoRtL5C0FhLwAnIx1CW
spring.security.oauth2.client.registration.messages-webapp.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.messages-webapp.scope=openid, profile
spring.security.oauth2.client.registration.messages-webapp.redirect-uri={baseUrl}/login/oauth2/code/messages-webapp

spring.security.oauth2.client.provider.messages-webapp.issuer-uri=http://localhost:9191/realms/sivalabs
#spring.security.oauth2.client.provider.messages-webapp.authorization-uri=http://localhost:9191/realms/sivalabs/protocol/openid-connect/auth
#spring.security.oauth2.client.provider.messages-webapp.token-uri=http://localhost:9191/realms/sivalabs/protocol/openid-connect/token
#spring.security.oauth2.client.provider.messages-webapp.jwk-set-uri=http://localhost:9191/realms/sivalabs/protocol/openid-connect/certs
#spring.security.oauth2.client.provider.messages-webapp.user-info-uri=http://localhost:9191/realms/sivalabs/protocol/openid-connect/userinfo
```

If you observe the above configuration, we have commented out the properties **authorization-uri**, **token-uri**, **jwk-set-uri** and **user-info-uri**.
Spring Security OAuth 2.0 Client implementation will automatically discover these endpoints using the **issuer-uri** by invoking 
**{issuer-uri}/.well-known/openid-configuration** endpoint.

If you go to [http://localhost:9191/realms/sivalabs/.well-known/openid-configuration](http://localhost:9191/realms/sivalabs/.well-known/openid-configuration) you can see the following response
containing all the endpoints information:

```json
{
    "issuer": "http://localhost:9191/realms/sivalabs",
    "authorization_endpoint": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/auth",
    "token_endpoint": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/token",
    "introspection_endpoint": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/token/introspect",
    "userinfo_endpoint": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/userinfo",
    "end_session_endpoint": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/logout",
    "frontchannel_logout_session_supported": true,
    "frontchannel_logout_supported": true,
    "jwks_uri": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/certs",
    "check_session_iframe": "http://localhost:9191/realms/sivalabs/protocol/openid-connect/login-status-iframe.html",
    "grant_types_supported": [
        "authorization_code",
        "implicit",
        "refresh_token",
        "password",
        "client_credentials",
        "urn:ietf:params:oauth:grant-type:device_code",
        "urn:openid:params:grant-type:ciba"
    ],
    ...,
  "response_types_supported": [
        "code",
        "none",
        "id_token",
        "token",
        "id_token token",
        "code id_token",
        "code token",
        "code id_token token"
    ],
    ...
    ...
}
```

### Implement Home Page
When we add **spring-boot-starter-security** dependency, Spring Security will automatically secure all the endpoints.
And we also added **spring-boot-starter-oauth2-client** dependency which will automatically configure OAuth 2.0 Client 
using the properties configured in **application.properties** .

Create **HomeController** class with the following content:

```java
@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model, @AuthenticationPrincipal OAuth2User principal) {
        model.addAttribute("username", principal.getAttribute("name"));
        return "home";
    }
}
```

We are injecting the authenticated user principal object using **@AuthenticationPrincipal** annotation.
The **OAuth2User** interface represents the authenticated user principal.

Create **home.html** file under **src/main/resources/templates** folder with the following content:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Home</title>
</head>
<body>
<div>
    <h1>Welcome <span th:text="${username}">username</span></h1>
</div>
</body>
</html>
```

Now if you run the application and access http://localhost:8080/ you will be redirected to the Keycloak login page.
Once you login successfully using **siva/siva1234** credentials, you will be redirected to the home page, 
and you can see the username in the home page.

### Customize Security Configuration
As we discussed earlier, Spring Security will automatically secure all the endpoints.
But, we want to allow access to the home page without authentication.
So, we need to customize the security configuration to allow access to the home page.

Create **SecurityConfig** class with the following content:

```java
package com.sivalabs.messages.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(c ->
                    c.requestMatchers("/").permitAll()
                    .anyRequest().authenticated()
            )
            .cors(CorsConfigurer::disable)
            .csrf(CsrfConfigurer::disable)
            .oauth2Login(Customizer.withDefaults());
        return http.build();
    }
}
```

As we made Home page accessible to all, the **@AuthenticationPrincipal** could be **null**.
Let's update the **HomeController** to handle this scenario.

```java
@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model, @AuthenticationPrincipal OAuth2User principal) {
        if(principal != null) {
            model.addAttribute("username", principal.getAttribute("name"));
        } else {
            model.addAttribute("username", "Guest");
        }
        return "home";
    }
}
```

Now, if we restart the application and access http://localhost:8080/ we will see the home page without any authentication.

Now we need a way to login into the application. We can add a **Login** link in the home page as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity">
<head>
  <title>Home</title>
</head>
<body>
<div >
  <p sec:authorize="!isAuthenticated()">
    <a href="/oauth2/authorization/messages-webapp">Login</a>
  </p>

  <h1>Welcome <span th:text="${username}">username</span></h1>

</div>
</body>
</html>
```

We are checking whether user is already loggged in or not and conditionally showing the Login link. 
And, we are using the Spring Security OAuth 2.0 default login URL **/oauth2/authorization/{registrationId}** to initiate the OAuth 2.0 Authorization Code Grant flow.

Now if you access http://localhost:8080/ you will see the Login link. 
Click on the Login link and you will be redirected to the Keycloak login page.
Once you login successfully, you will be redirected to the home page and you can see the username in the home page.

### Implement Logout
By default, Spring Security OAuth 2.0 Client implementation configures the logout functionality
such that you can initiate logout by calling the URL **/logout**. Then the HTTP Session will be invalidated, 
clears the **SecurityContextHolder**, and then redirect to the configured **Valid post logout redirect URIs**.

If you want to customize the logout functionality, then you can update **SecurityConfig** as follows:

```java
package com.sivalabs.messages.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
  private final ClientRegistrationRepository clientRegistrationRepository;

  public SecurityConfig(ClientRegistrationRepository clientRegistrationRepository) {
    this.clientRegistrationRepository = clientRegistrationRepository;
  }

  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .authorizeHttpRequests(c ->
                    c.requestMatchers("/").permitAll()
                            .anyRequest().authenticated()
            )
            .cors(CorsConfigurer::disable)
            .csrf(CsrfConfigurer::disable)
            .oauth2Login(Customizer.withDefaults())
            .logout(logout -> logout
                    .clearAuthentication(true)
                    .invalidateHttpSession(true)
                    .logoutSuccessHandler(oidcLogoutSuccessHandler())
            );
    return http.build();
  }

  private LogoutSuccessHandler oidcLogoutSuccessHandler() {
    OidcClientInitiatedLogoutSuccessHandler oidcLogoutSuccessHandler =
            new OidcClientInitiatedLogoutSuccessHandler(this.clientRegistrationRepository);
    oidcLogoutSuccessHandler.setPostLogoutRedirectUri("{baseUrl}/");
    return oidcLogoutSuccessHandler;
  }
}
```

## Conclusion
In this article, we have created the **messages-webapp** Client application and secured it using 
Spring Security OAuth 2.0 Authorization Code Flow. 

In the next article, we will create the **messages-service** Resource Server and secure it using Spring Security OAuth 2.0, 
and call its APIs from **messages-webapp**.