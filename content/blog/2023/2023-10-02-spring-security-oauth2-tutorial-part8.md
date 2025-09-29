---
title: 'Spring Security OAuth 2 Tutorial - 8 : Securing Resource Server'
author: Siva
images:
  - /preview-images/spring-security-oauth2-part8.webp
type: post
draft: false
date: 2023-10-02T00:30:00.000Z
url: /blog/spring-security-oauth2-tutorial-securing-resource-server
toc: true
categories:
  - SpringBoot
tags:
  - SpringBoot
  - SpringSecurity
  - OAuth2
description: In this tutorial, we will create a Spring Boot Resource Server and secure it with Spring Security OAuth 2.0 using Keycloak.
aliases:
  - /spring-security-oauth2-tutorial-securing-resource-server
---

In the previous article, we have created **messages-webapp** and secured it with **Spring Security OAuth 2.0** using Authorization Code Flow.
In this article, we will create **messages-service**, which is a Spring Boot Resource Server, and secure it with Spring Security OAuth 2.0.

<!--more-->


{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub: 
https://github.com/sivaprasadreddy/spring-security-oauth2-microservices-demo
{{< /box >}}

## Create messages-service
You can generate **messages-service** using **Spring Initializr** by clicking on this [link](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.1.4&packaging=jar&jvmVersion=17&groupId=com.sivalabs&artifactId=messages-service&name=messages-service&packageName=com.sivalabs.messages&dependencies=web,validation,security,oauth2-resource-server).
We have selected the starters **Web**, **Validation**, **Security** and **OAuth2 Resource Server**.
Once the application is generated, open it in your favourite IDE.

### Configure OAuth 2.0 Resource Server Properties
The **messages-service** is Resource Server of **bearer-only** type.
That means if anybody invokes a secured API endpoint with valid **access_token** sent as **Authorization** header, 
then the service will give the response. Otherwise, it will not initiate the OAuth 2.0 Authorization flow, 
but simply return 401 or 403 HTTP status code.

The **bearer-only** type Resource Server need not be registered with the Authorization Server (Keycloak).
We just need to configure the **issuer-uri** in **application.properties** file as follows:

```properties
spring.application.name=messages-service
server.port=8181
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:9191/realms/sivalabs
```

### Implement API Endpoints
Let's implement our first API endpoint **/api/messages** which returns a list of messages.

Create **Message** class with the following content:

```java
package com.sivalabs.messages.domain;

import jakarta.validation.constraints.NotEmpty;

import java.time.Instant;

public class Message {
    private Long id;
    @NotEmpty
    private String content;
    @NotEmpty
    private String createdBy;
    private Instant createdAt;

    // constructors
    // setters and getters
}
```

Create **MessageRepository** class with the following content:

```java
package com.sivalabs.messages.repository;

import com.sivalabs.messages.model.Message;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Repository;

@Repository
public class MessageRepository {
    private static final AtomicLong ID = new AtomicLong(0L);
    private static final List<Message> MESSAGES = new ArrayList<>();

    @PostConstruct
    void init() {
        getDefaultMessages().forEach( p -> {
            p.setId(ID.incrementAndGet());
            MESSAGES.add(p);
        });
    }

    public List<Message> getMessages() {
        return MESSAGES;
    }

    public Message createMessage(Message message) {
        message.setId(ID.incrementAndGet());
        message.setCreatedAt(Instant.now());
        MESSAGES.add(message);
        return message;
    }

    private List<Message> getDefaultMessages() {
        List<Message> messages = new ArrayList<>();
        messages.add(new Message(null, "Test Message 1", "admin", Instant.now()));
        messages.add(new Message(null, "Test Message 2", "admin", Instant.now()));
        return messages;
    }
}
```
Our focus is on securing the API endpoints using OAuth 2, so we are not using any database to store the messages.
Instead, we are using a simple in-memory list to store the messages.

Create **MessageController** class with the following content:

```java
package com.sivalabs.messages.api;

import com.sivalabs.messages.domain.Message;
import com.sivalabs.messages.domain.MessageRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
class MessageController {
    private final MessageRepository messageRepository;

    MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping
    List<Message> getMessages() {
        return messageRepository.getMessages();
    }

    @PostMapping
    Message createMessage(@RequestBody @Valid Message message) {
        return messageRepository.createMessage(message);
    }
}
```

We have implemented two API endpoints **GET /api/messages** to fetch all messages and **POST /api/messages** to create a new message.

Now if we try to access http://localhost:8181/api/messages we will get 401 HTTP status code as we have not sent any **access_token**.
By default, Spring Security secured all the endpoints.

## Accessing Secured API Endpoints using Postman
Remember, we have seen how to get **access_token** using Postman in the previous [article](https://www.sivalabs.in/spring-security-oauth2-tutorial-authorization-code-flow/#authorization-code-flow-using-postman).

Let's get the **access_token** using Postman and invoke the **GET /api/messages** API endpoint.

* Open a New Request tab in Postman
* Select **GET** as **HTTP Method** and enter the URL **http://localhost:8181/api/messages**
* Go to the **Authorization** tab and select **OAuth 2.0** as **Type**.
* Under **Configure New Token** section:
    * **Grant Type**: Authorization Code
    * **Callback URL**: http://localhost:8080/login/oauth2/code/messages-webapp
    * **Auth URL**: http://localhost:9191/realms/sivalabs/protocol/openid-connect/auth
    * **Access Token URL**: http://localhost:9191/realms/sivalabs/protocol/openid-connect/token
    * **Client ID**: messages-webapp
    * **Client Secret**: qVcg0foCUNyYbgF0Sg52zeIhLYyOwXpQ
    * **Scope**: openid profile
    * **State**: randomstring
    * **Client Authentication**: Send as Basic Auth header
* Click on **Get New Access Token** button
* Postman will open a popup showing Keycloak Login page
* Login with the user credentials **siva/siva1234**
* Now you should be able to see the response with **Token Details**
* Click on **Use Token** button
* Now, click on **Send** button to invoke the API endpoint

You should be able to see the response with the list of messages.

So, using Postman, we first got the **access_token** and then invoked the API endpoint by sending the **access_token** 
as **Authorization** header.

## Customizing Security Configuration
By default, Spring Security OAuth 2.0 Resource Server implementation will secure all the endpoints.
But, we want to allow access to the **GET /api/messages** API endpoint without authentication.

So, let's customize the security configuration using the following **SecurityConfig** class:

```java
package com.sivalabs.messages.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(c ->
                c.requestMatchers(HttpMethod.GET, "/api/messages").permitAll()
                 .anyRequest().authenticated()
            )
            .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(CorsConfigurer::disable)
            .csrf(CsrfConfigurer::disable)
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(Customizer.withDefaults())
            );
        return http.build();
    }
}
```

As you can see, we have allowed access to the **GET /api/messages** API endpoint without authentication and 
secured all the rest of the endpoints. Also, we have configured the OAuth2 Resource Server to use **JWT** token based security 
with default configuration.

Now if you restart the application and access http://localhost:8181/api/messages you will be able to see the response without any authentication.
But, while invoking the **POST /api/messages** API endpoint, you need to configure **Authentication** as mentioned in the previous section.

{{< box info >}}
**How it works?**

We have configured the **issuer-uri**,http://localhost:9191/realms/sivalabs, in **application.properties** file.
When you start the application, Spring Security OAuth 2.0 uses the discovery endpoint (http://localhost:9191/realms/sivalabs/.well-known/openid-configuration) 
to fetch the **jwks_uri** and uses it to download the public key which is used to validate the JWT token.
{{< /box >}}

So, we are able to configure certail API endpoints publicly accessible without requiring authentication 
and secured the rest of the endpoints. But, what about the Role Based Access?

Remember, we want to allow only the users with **ROLE_ADMIN** to invoke the **POST /api/messages/archive** API endpoint.

But, before looking into that, let's see how to get the current user details.

## Getting Current User Details
We can get the current user details from **SecurityContextHolder** and extract various interesting information from it.
Let's implement an API endpoint **GET /api/me** to get the current user details as follows.

```java
package com.sivalabs.messages.api;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
class UserInfoController {

    @GetMapping("/api/me")
    Map<String, Object> currentUserDetails() {
        return getLoginUserDetails();
    }

    Map<String, Object> getLoginUserDetails() {
        Map<String, Object> map = new HashMap<>();
        JwtAuthenticationToken authentication =
                (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();

        map.put("username", jwt.getClaimAsString("preferred_username"));
        map.put("email", jwt.getClaimAsString("email"));
        map.put("name", jwt.getClaimAsString("name"));
        map.put("token", jwt.getTokenValue());
        map.put("authorities", authentication.getAuthorities());
        map.put("roles", getRoles(jwt));

        return map;
    }

    List<String> getRoles(Jwt jwt) {
        Map<String,Object> realm_access = (Map<String, Object>) jwt.getClaims().get("realm_access");
        if(realm_access != null && !realm_access.isEmpty()) {
            return  (List<String>) realm_access.get("roles");
        }
        return List.of();
    }
}
```

Now if we invoke the **GET /api/me** API endpoint from Postman by configuring the **Authorization** as we did earlier, 
we will get the current user details similar to the following:

```json
{
  
  "name": "Siva Katamreddy",
  "email": "siva@gmail.com",
  "username": "siva",
  "token": "eyJhbGciOiJSUzI1NiIsInR5c.....qgGIu8iF86azw",
  "roles": [
    "default-roles-sivalabs",
    "offline_access",
    "uma_authorization"
  ],
  "authorities": [
    {
      "authority": "SCOPE_openid"
    },
    {
      "authority": "SCOPE_email"
    },
    {
      "authority": "SCOPE_profile"
    }
  ]
}
```

If we go to https://jwt.io/ and paste the token value, we can see the decoded response as follows:

```json
{
  "exp": 1695919675,
  "iat": 1695919375,
  "auth_time": 1695914182,
  "jti": "64128bc7-8f4d-48ff-978f-93b0764f39cd",
  "iss": "http://localhost:9191/realms/sivalabs",
  "aud": "account",
  "sub": "ca1a2f34-1614-45dd-86c1-5eafff085d8a",
  "typ": "Bearer",
  "azp": "messages-webapp",
  "session_state": "3e5865f1-0f0e-4ada-b2a1-97e7b118af4d",
  "acr": "0",
  "allowed-origins": [
    "http://localhost:8080"
  ],
  "realm_access": {
    "roles": [
      "default-roles-sivalabs",
      "offline_access",
      "uma_authorization"
    ]
  },
  "resource_access": {
    "account": {
      "roles": [
        "manage-account",
        "manage-account-links",
        "view-profile"
      ]
    }
  },
  "scope": "openid email profile",
  "sid": "3e5865f1-0f0e-4ada-b2a1-97e7b118af4d",
  "email_verified": true,
  "name": "Siva Katamreddy",
  "preferred_username": "siva",
  "given_name": "Siva",
  "family_name": "Katamreddy",
  "email": "siva@gmail.com"
}
```

If we compare the **/api/me** API response with the decoded token data, the interesting things to observe are:
* The **roles** are derived from the **realm_access** claim in the JWT token.
* The **authorities** are derived from the **scope** claim in the JWT token.

The default **JwtAuthenticationConverter** implementation converts the **scope** claim into **authorities** adding **SCOPE_** prefix.

Keycloak sends the **roles** in the **realm_access** claim in the JWT token.
We have extracted the **roles** from the **realm_access** claim and added it to the response.

Now, let's create **ROLE_USER** and **ROLE_ADMIN** roles in Keycloak and assign them to the user **siva**.

* Go to Keycloak Admin Console and select the **sivalabs** realm
* Click on **Realm roles** and create **ROLE_USER** and **ROLE_ADMIN** roles
* Click on **Users** and select the user **siva**
* Click on **Role Mappings** and assign **ROLE_USER** and **ROLE_ADMIN** roles to the user **siva**

Now if we invoke the **GET /api/me** API endpoint from Postman, we will get the updated response as follows:

```json
{

  "name": "Siva Katamreddy",
  "email": "siva@gmail.com",
  "username": "siva",
  "token": "eyJhbGciOiJSUzI1NiIsInR5c.....qgGIu8iF86azw",
  "roles": [
    "default-roles-sivalabs",
    "offline_access",
    "uma_authorization",
    "ROLE_USER",
    "ROLE_ADMIN"
  ],
  "authorities": [
    {
      "authority": "SCOPE_openid"
    },
    {
      "authority": "SCOPE_email"
    },
    {
      "authority": "SCOPE_profile"
    }
  ]
}
```

What we just did is, figuring out the current user details and extracting the roles from the JWT token.
But, for Spring Security to treat roles as authorities, somehow we need to convert the roles into authorities.

To do that, we can create a custom **JwtAuthenticationConverter** by implementing 
**Converter<Jwt, AbstractAuthenticationToken>** as follows:

```java
package com.sivalabs.messages.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class KeycloakJwtAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {
    private final Converter<Jwt, Collection<GrantedAuthority>> delegate = new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        List<GrantedAuthority> authorityList = extractRoles(jwt);
        Collection<GrantedAuthority> authorities = delegate.convert(jwt);
        if (authorities != null) {
            authorityList.addAll(authorities);
        }
        return new JwtAuthenticationToken(jwt, authorityList);
    }

    private List<GrantedAuthority> extractRoles(Jwt jwt) {
        Map<String,Object> realm_access = (Map<String, Object>) jwt.getClaims().get("realm_access");
        if(realm_access == null || realm_access.isEmpty()) {
            return List.of();
        }
        List<String> roles = (List<String>) realm_access.get("roles");
        if (roles == null || roles.isEmpty()) {
            roles = List.of("ROLE_USER");
        }
        return roles.stream()
                        .filter(role -> role.startsWith("ROLE_"))
                        .map(SimpleGrantedAuthority::new).collect(Collectors.toList());
    }
}
```

What we did here:

* We are extracting the **roles** from the **realm_access** claim and converting them into **authorities**. 
  Note that we are considering the roles having **ROLE_** prefix only.
* We are converting the **scope** claim into **authorities** using Spring Security's **JwtGrantedAuthoritiesConverter**.
* We are combining the **authorities** from **scope** claim and **roles** from **realm_access** claim and creating a new **JwtAuthenticationToken**.

Now, let's register this custom **JwtAuthenticationConverter** in **SecurityConfig** as follows:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        ...
        ...
        .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter()))
        );
        return http.build();
    }
}
```

Now if we invoke the **GET /api/me** API endpoint from Postman, we will get the updated response as follows:

```json
{

  "name": "Siva Katamreddy",
  "email": "siva@gmail.com",
  "username": "siva",
  "token": "eyJhbGciOiJSUzI1NiIsInR5c.....qgGIu8iF86azw",
  "roles": [
    "default-roles-sivalabs",
    "offline_access",
    "uma_authorization",
    "ROLE_USER",
    "ROLE_ADMIN"
  ],
  "authorities": [
    {
      "authority": "ROLE_USER"
    },
    {
      "authority": "ROLE_ADMIN"
    },
    {
      "authority": "SCOPE_openid"
    },
    {
      "authority": "SCOPE_email"
    },
    {
      "authority": "SCOPE_profile"
    }
  ]
}
```

We don't actually need the **GET /api/me** API endpoint, but we just implemented it to understand how to get the current user details
and how to use a custom **JwtAuthenticationConverter** to map Keycloak roles as authorities.

## Verify the Role Based Access Control
Let's verify the Role Based Access Control by implementing the **POST /api/messages/archive** API endpoint.

Add the following endpoint to the **MessageController** class with the following content:

```java
@RestController
@RequestMapping("/api/messages")
class MessageController {
    private static final Logger log = LoggerFactory.getLogger(MessageController.class);
    ...
    ...

   @PostMapping("/archive")
   Map<String,String> archiveMessages() {
      log.info("Archiving all messages");
      return Map.of("status", "success");
   }
}
```

Update the **SecurityConfig** class as follows:

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
          .authorizeHttpRequests(c ->
            c.requestMatchers(HttpMethod.GET, "/api/messages").permitAll()
             .requestMatchers(HttpMethod.POST, "/api/messages/archive").hasAnyRole("ADMIN")
             .anyRequest().authenticated()
          )
        ...
        ...
      
        return http.build();
    }
}
```

Now if we invoke the **POST /api/messages/archive** API endpoint from Postman by configuring the **Authorization** as we did earlier,
we will get the following response with HTTP status code 200.

```json
{
  "status": "success"
}
```

Now, go to Keycloak Admin Console and remove the **ROLE_ADMIN** role from the user **siva**.
Now try getting a new **access_token** and invoke the **POST /api/messages/archive** API endpoint from Postman.
You will get Forbidden 403 HTTP status code as the user **siva** doesn't have the **ROLE_ADMIN** role.

## Conclusion
In this article, we have created the **messages-service** Resource Server and secured it using 
Spring Security OAuth 2.0. We also learned how to implement Role Based Access Control. 

In the next article, we will integrate **messages-webapp** with **messages-service** Resource Server.
