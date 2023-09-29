---
title: "Spring Security OAuth 2 Tutorial - 10 : Service to Service Communication using Client Credentials Flow"
author: Siva
images: ["/preview-images/spring-security-oauth2-part10.webp"]
type: post
draft: false
date: 2023-10-10T06:00:00+05:30
url: /spring-security-oauth2-tutorial-service-to-service-communication-using-client-credentials-flow
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, SpringSecurity, OAuth2]
description: In this tutorial, we will explore how to implement Service to Service Communication using Client Credentials Flow.
---

In this article, we will learn how to implement **Service to Service Communication** using **Client Credentials Flow**.
We will create the **archival-service** in which we will use a scheduler job to invoke the **messages-service** APIs to archive the messages.
For implementing this, we will use **Client Credentials Flow**.

We will also implement **POST /api/messages/archive** API endpoint in **archival-service** which can only be called by users who have **ROLE_ADMIN** role.

Considering this, **archival-service** will act as a **Resource Server** and as a **Client** too.

* **Resource Server** - Exposes **POST /api/messages/archive** API endpoint which will be called from **messages-webapp**.
* **Client** - Invokes **messages-service** APIs to archive the messages.

{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub: 
https://github.com/sivaprasadreddy/spring-security-oauth2-microservices-demo
{{< /box >}}

## Create archival-service Client with Client Credentials Flow enabled in Keycloak

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

* Go to Service account roles tab and assign **ROLE_ADMIN** role.
* Click on the **Credentials** tab and copy the **Client secret** value.

In my case, the **Client secret** is **bL1a2V2kouKh4sBMX0UrSmc0d3qubD1a**.

## Create archival-service
You can generate **archival-service** using **Spring Initializr** by clicking on this [link](https://start.spring.io/#!type=maven-project&language=java&platformVersion=3.1.4&packaging=jar&jvmVersion=17&groupId=com.sivalabs&artifactId=archival-service&name=archival-service&packageName=com.sivalabs.archival&dependencies=web,validation,security,oauth2-resource-server,oauth2-client).
We have selected the starters **Web**, **Validation**, **Security**, **OAuth2 Client** and **OAuth2 Resource Server**.
Once the application is generated, open it in your favourite IDE.

Open **application.properties** and configure the following properties:

```properties
spring.application.name=archival-service
server.port=8282
OAUTH_SERVER=http://localhost:9191/realms/sivalabs

# Resource Server configuration
spring.security.oauth2.resourceserver.jwt.issuer-uri=${OAUTH_SERVER}

# Client configuration
spring.security.oauth2.client.registration.archival-service.provider=archival-service
spring.security.oauth2.client.registration.archival-service.client-id=archival-service
spring.security.oauth2.client.registration.archival-service.client-secret=bL1a2V2kouKh4sBMX0UrSmc0d3qubD1a
spring.security.oauth2.client.registration.archival-service.authorization-grant-type=client_credentials
spring.security.oauth2.client.registration.archival-service.scope=openid, profile
spring.security.oauth2.client.registration.archival-service.redirect-uri={baseUrl}/login/oauth2/code/archival-service

spring.security.oauth2.client.provider.archival-service.issuer-uri=${OAUTH_SERVER}
```

This configuration should be familiar to you if you have read the previous articles in this series.

* We have configured the Resource Server property **spring.security.oauth2.resourceserver.jwt.issuer-uri** to point to the Keycloak server.
* Next, we have configured the Client properties (**spring.security.oauth2.client.registration.archival-service**, 
**spring.security.oauth2.client.provider.archival-service.issuer-uri**) to point to the Keycloak server.

## Get Access Token using Client Credentials Flow
Now that we have configuration in place, let's see how to get the **access_token** using **Client Credentials Flow**.

Create **SecurityConfig** class with the following content:

```java
package com.sivalabs.archival.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;

@Configuration
public class SecurityConfig {

  @Bean
  public OAuth2AuthorizedClientManager authorizedClientManager(
          ClientRegistrationRepository clientRegistrationRepository,
          OAuth2AuthorizedClientService authorizedClientService) {

    return new AuthorizedClientServiceOAuth2AuthorizedClientManager(
            clientRegistrationRepository, authorizedClientService);
  }
}
```

We are registering a bean of type **OAuth2AuthorizedClientManager** by injecting the auto-configured  
**ClientRegistrationRepository** and **OAuth2AuthorizedClientService** beans.
We will use **OAuth2AuthorizedClientManager** to get the **access_token**.

Create **SecurityHelper** class with the following content:

```java
package com.sivalabs.archival.domain;

import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;

@Service
public class SecurityHelper {
    private final OAuth2AuthorizedClientManager authorizedClientManager;

    public SecurityHelper(OAuth2AuthorizedClientManager authorizedClientManager) {
        this.authorizedClientManager = authorizedClientManager;
    }

    public OAuth2AccessToken getOAuth2AccessToken() {
        String clientRegistrationId = "archival-service";
        OAuth2AuthorizeRequest authorizeRequest =
                OAuth2AuthorizeRequest.withClientRegistrationId(clientRegistrationId)
                        // This principal value is unnecessary, but if you don't give it a value,
                        // it throws an exception.
                        .principal("dummy")
                        .build();
        OAuth2AuthorizedClient authorizedClient =
                this.authorizedClientManager.authorize(authorizeRequest);
        return authorizedClient.getAccessToken();
    }
}
```

We are using the client registration id **archival-service** to create the **OAuth2AuthorizeRequest**.
Then we are invoking **authorize()** method on **OAuth2AuthorizedClientManager** to get the **OAuth2AuthorizedClient**, 
which internally performs the authentication.
Finally, we are returning the **OAuth2AccessToken** from the **OAuth2AuthorizedClient**.

Now, we can use this token to invoke the **messages-service** APIs.

## Create MessageServiceClient

Create **MessageServiceClient** class with the following content:

```java
package com.sivalabs.archival.domain;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MessageServiceClient {
    private static final Logger log = LoggerFactory.getLogger(MessageServiceClient.class);
    private static final String MESSAGES_SVC_URL = "http://localhost:8181";

    private final SecurityHelper securityHelper;
    private final RestTemplate restTemplate;

    public MessageServiceClient(SecurityHelper securityHelper, RestTemplate restTemplate) {
        this.securityHelper = securityHelper;
        this.restTemplate = restTemplate;
    }

    public void archiveMessages() {
        try {
            String url = MESSAGES_SVC_URL + "/api/messages/archive";
            OAuth2AccessToken oAuth2AccessToken = securityHelper.getOAuth2AccessToken();
            String accessToken = oAuth2AccessToken.getTokenValue();

            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            HttpEntity<?> httpEntity = new HttpEntity<>(headers);
            ResponseEntity<Void> response = restTemplate.exchange(
                    url, HttpMethod.POST, httpEntity,
                    new ParameterizedTypeReference<>() {});
            log.info("Archive messages response code: {}", response.getStatusCode());
        } catch (Exception e) {
            log.error("Error while invoking Archive messages API", e);
        }
    }
}
```

We are getting the **accessToken** from **SecurityHelper** and adding it to the **Authorization** header.
Then we are invoking the **POST /api/messages/archive** API endpoint using **RestTemplate**.

## Implement Scheduler Job to Archive Messages
Spring Boot provides **@Scheduled** annotation to implement scheduled jobs.
First, we need to enable scheduling by adding **@EnableScheduling** annotation to the **ArchivalServiceApplication** class.

Then we can create a scheduled job to archive the messages by adding **@Scheduled** annotation to a method as follows:

```java
package com.sivalabs.archivalservice.jobs;

import com.sivalabs.archivalservice.domain.MessageServiceClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class MessageArchivalJob {
    private static final Logger log = LoggerFactory.getLogger(MessageArchivalJob.class);

    private final MessageServiceClient messageServiceClient;

    public MessageArchivalJob(MessageServiceClient messageServiceClient) {
        this.messageServiceClient = messageServiceClient;
    }

    @Scheduled(fixedDelay = 30000)
    public void run() {
        log.info("Running MessageArchivalJob at {}", Instant.now());
        messageServiceClient.archiveMessages();
    }
}
```

We have configured the job to run every 30 seconds.

Now if you start the **archival-service** and **messages-service** , you should see the following logs:

```shell
Running MessageArchivalJob at 2023-09-29T14:48:11.606017Z
Archive messages response code: 200 OK
```

In the **messages-service** logs, you should see the following logs:

```shell
Archiving all messages
```

We haven't actually implemented the logic of archiving the messages, because that is not the focus of the article.
The important thing is we are able to get AccessToken using Client Credentials Flow and invoke the **messages-service** APIs.

{{< box info >}}
**Is it good using ROLE_ADMIN for Client Credentials Flow?**

In this article, we have assigned **ROLE_ADMIN** role to **archival-service** client and 
be able to invoke the **POST /api/messages/archive** API endpoint of **messages-service** 
which can only be allowed by users having **ROLE_ADMIN** role.

While technically, this works, it is not a good idea to use **ROLE_ADMIN** for Client Credentials Flow.
Instead, we should create a new role like **ROLE_ADMIN_JOB**, assign it to **archival-service** client 
and configure **messages-service** **POST /api/messages/archive** API endpoint to be accessible by users having 
either **ROLE_ADMIN** or **ROLE_ADMIN_JOB**.
{{< /box >}}

## Implement Archive Messages API Endpoint in archival-service
The last thing we want to implement is the **POST /api/messages/archive** API endpoint in **archival-service**.

Create **MessageArchivalController** class with the following content:

```java
package com.sivalabs.archivalservice.api;

import com.sivalabs.archivalservice.domain.MessageServiceClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
class MessageArchivalController {
    private final MessageServiceClient messageServiceClient;

    MessageArchivalController(MessageServiceClient messageServiceClient) {
        this.messageServiceClient = messageServiceClient;
    }

    @PostMapping("/api/messages/archive")
    Map<String, String> archiveMessages() {
        messageServiceClient.archiveMessages();
        return Map.of("status", "success");
    }
}
```

Nothing special about this controller, we are just invoking **messageServiceClient.archiveMessages()** method.
But, we need to protect this API endpoint to be accessible only by users having **ROLE_ADMIN** role.

Update **SecurityConfig** class as follows:

```java
package com.sivalabs.archivalservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.AuthorizedClientServiceOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(c ->
                c
                    .requestMatchers(HttpMethod.POST, "/api/messages/archive").hasRole("ADMIN")
                    .anyRequest().authenticated()
            )
            .sessionManagement(c -> c.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .cors(CorsConfigurer::disable)
            .csrf(CsrfConfigurer::disable)
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt.jwtAuthenticationConverter(new KeycloakJwtAuthenticationConverter()))
            );

        return http.build();
    }

    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientService authorizedClientService) {

        return new AuthorizedClientServiceOAuth2AuthorizedClientManager(
                        clientRegistrationRepository, authorizedClientService);
    }
}
```

This configuration should be familiar to you if you have read the previous articles in this series.
It is similar to the **messages-service** configuration, except we have configured the **/api/messages/archive** API endpoint to be accessible only by users having **ROLE_ADMIN** role.
We are also using **KeycloakJwtAuthenticationConverter** to convert the **realm_access.roles** to **GrantedAuthority**.
You can copy the same class from **messages-service** to **archival-service**.

## Invoke Archive Messages API Endpoint from messages-webapp
Now that we have implemented the **POST /api/messages/archive** API endpoint in **archival-service**,
we can invoke this API endpoint from **messages-webapp**.

Add **archiveMessages()** method in **MessageServiceClient** of **messages-webapp** as follows:

```java
@Service
public class MessageServiceClient {
    //...
  
    public void archiveMessages() {
        try {
          HttpHeaders headers = new HttpHeaders();
          headers.add("Authorization", "Bearer " + securityHelper.getAccessToken());
          HttpEntity<?> httpEntity = new HttpEntity<>(headers);
          ResponseEntity<Message> response = restTemplate.exchange(
                  "http://localhost:8282/api/messages/archive", HttpMethod.POST, httpEntity,
                  new ParameterizedTypeReference<>() {
                  });
          log.info("Archive messages response code: {}", response.getStatusCode());
        } catch (Exception e) {
          log.error("Error while invoking Archive messages", e);
        }
    }
}
```

Add **archiveMessages()** handler method in **HomeController** of **messages-webapp** as follows:

```java
@Controller
public class HomeController {
    //...
    
    @PostMapping("/messages/archive")
    String archiveMessages() {
        messageServiceClient.archiveMessages();
        return "redirect:/";
    }
}
```

Finally, add **Archive Messages** button in **home.html** as follows:

```html
<div sec:authorize="hasRole('ADMIN')">
    <form method="post" action="/messages/archive">
      <input type="submit" value="Archive Messages">
    </form>
</div>
```

Now, if you run all the services and login to **messages-webapp** with a user having **ROLE_ADMIN** assigned, you should see the **Archive Messages** button.
Upon clicking on this button, it should invoke the **POST /api/messages/archive** API endpoint of **archival-service**,
which internally should invoke the **POST /api/messages/archive** API endpoint of **messages-service**.


## Conclusion
In this Spring Security OAuth2 Tutorial series, we have learned:
* Various OAuth2 / OpenID Connect Flows
* How to implement OAuth2 / OpenID Connect Flows using Keycloak and Spring Boot

I hope this series is helpful to understand how OAuth 2.0 works and how to implement it using Spring Boot and Keycloak.