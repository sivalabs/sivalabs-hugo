---
title: "Spring Security OAuth 2 Tutorial - 9 : Invoking Secured Resource Server APIs from Client Application"
author: Siva
images: ["/preview-images/spring-security-oauth2-part9.webp"]
type: post
draft: false
date: 2023-10-06T06:00:00+05:30
url: /spring-security-oauth2-tutorial-integrating-client-and-resource-server
toc: true
categories: ["SpringBoot"]
tags: [SpringBoot, SpringSecurity, OAuth2]
description: In this tutorial, we will explore how to invoke the secured Resource Server API endpoints from the Client application.
---

In the previous articles, we have created **messages-webapp** and **messages-service** and invoked API endpoints using Postman.
In this article, we will learn how to invoke the secured **messages-service** API endpoints from the Client application **messages-webapp**.

{{< box info >}}
**Source Code:**

You can find the complete source code of this project on GitHub: 
https://github.com/sivaprasadreddy/spring-security-oauth2-microservices-demo
{{< /box >}}

## Show List of Messages
As **GET /api/messages** API endpoint in **messages-service** is publicly accessible, we can invoke it from **messages-webapp** without any authentication.

{{< box tip >}}
**RestTemplate vs RestClient**

I am going to use the good old **RestTemplate** to invoke the API endpoints in **messages-service**.
But once Spring Boot 3.2.0 is released, I would recommend to use **RestClient** instead.
{{< /box >}}

In **messages-webapp**, create **AppConfig** class with the following content:

```java
package com.sivalabs.messages.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
    }
}
```
We have registered a **RestTemplate** bean so that we can inject it into other components.

Create **SecurityHelper** class with the following content:

```java
package com.sivalabs.messages.domain;

import org.springframework.stereotype.Service;

@Service
public class SecurityHelper {

    public String getAccessToken() {
        String accessToken = null;
        // logic to get Access token
        return accessToken;
    }
}
```

We have just created a placeholder method **getAccessToken()** to return the **accessToken**, which we are going to implement later.

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

Create **MessageServiceClient** class with the following content:

```java
package com.sivalabs.messages.domain;

import com.sivalabs.messages.domain.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class MessageServiceClient {
    private static final Logger log = LoggerFactory.getLogger(MessageServiceClient.class);
    private static final String MESSAGE_SVC_BASE_URL = "http://localhost:8181";

    private final SecurityHelper securityHelper;
    private final RestTemplate restTemplate;

    public MessageServiceClient(SecurityHelper securityHelper, RestTemplate restTemplate) {
        this.securityHelper = securityHelper;
        this.restTemplate = restTemplate;
    }

    public List<Message> getMessages() {
        try {
            String url = MESSAGE_SVC_BASE_URL + "/api/messages";
            ResponseEntity<List<Message>> response = restTemplate.exchange(
                    url, HttpMethod.GET, null,
                    new ParameterizedTypeReference<>() {});
            return response.getBody();
        } catch (Exception e) {
            log.error("Error while fetching messages", e);
            return List.of();
        }
    }

    public void createMessage(Message message) {
        try {
            String url = MESSAGE_SVC_BASE_URL + "/api/messages";
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + securityHelper.getAccessToken());
            HttpEntity<?> httpEntity = new HttpEntity<>(message, headers);
            ResponseEntity<Message> response = restTemplate.exchange(
                    url, HttpMethod.POST, httpEntity,
                    new ParameterizedTypeReference<>() {});
            log.info("Create message response code: {}", response.getStatusCode());
        } catch (Exception e) {
            log.error("Error while creating message", e);
        }
    }
}
```

Now, update **HomeController** to fetch the list of messages from **messages-service** and display them on the home page.

```java
package com.sivalabs.messages.web;

import com.sivalabs.messages.domain.MessageServiceClient;
import com.sivalabs.messages.domain.Message;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class HomeController {
    private static final Logger log = LoggerFactory.getLogger(HomeController.class);

    private final MessageServiceClient messageServiceClient;

    public HomeController(MessageServiceClient messageServiceClient) {
        this.messageServiceClient = messageServiceClient;
    }

    @GetMapping("/")
    public String home(Model model, @AuthenticationPrincipal OAuth2User principal) {
        if(principal != null) {
          model.addAttribute("username", principal.getAttribute("name"));
        } else {
          model.addAttribute("username", "Guest");
        }
        List<Message> messages = messageServiceClient.getMessages();
        log.info("Message count: {}", messages.size());
        model.addAttribute("messages", messages);
        return "home";
    }
}
```

Update **home.html** to display the list of messages as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity">
<head>
    <title>Home</title>
</head>
<body>
<div>
    <p sec:authorize="!isAuthenticated()">
      <a href="/oauth2/authorization/messages-webapp">Login</a>
    </p>
    <h1>Welcome <span th:text="${username}">username</span></h1>

    <div id="messages" class="pt-2">
        <div class="message" th:each="message: ${messages}">
            <div class="alert alert-light" role="alert">
                <p th:text="${message.content}">content</p>
                <p>Posted By: <span th:text="${message.createdBy}">CreatedBy</span></p>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

Now, if you start the **messages-service** and **messages-webapp** and access http://localhost:8080, you should be able to see the list of messages.

Before moving to implementing the creating a new message functionality, let's see how to get the **access_token** to invoke **POST /api/messages** API endpoint of **messages-service**.

## Getting Access Token
We can get the current user details from **SecurityContextHolder** and extract various interesting information from it.

Let's implement the **getAccessToken()** method in **SecurityHelper** class as follows:

```java
package com.sivalabs.messages.domain;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class SecurityHelper {
    private final OAuth2AuthorizedClientService authorizedClientService;
  
    public SecurityHelper(OAuth2AuthorizedClientService authorizedClientService) {
      this.authorizedClientService = authorizedClientService;
    }
    
    public String getAccessToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(authentication instanceof OAuth2AuthenticationToken oauthToken)) {
          return null;
        }
        OAuth2AuthorizedClient client = authorizedClientService.loadAuthorizedClient(
                oauthToken.getAuthorizedClientRegistrationId(), oauthToken.getName());
  
        return client.getAccessToken().getTokenValue();
    }
}
```

We have injected the auto-configured **OAuth2AuthorizedClientService** bean, and we are loading the current AuthorizedClient, 
and then acquiring the accessToken.

## Create a New Message
Now that we have implemented the **getAccessToken()** method, **MessageServiceClient** already invokes the **POST /api/messages** API endpoint with the **access_token**,
let's add Create a New Message form in **home.html** and implement the handler in **HomeController**.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity">
<head>
    <title>Home</title>
</head>
<body>
<div>
    <p sec:authorize="!isAuthenticated()">
      <a href="/oauth2/authorization/messages-webapp">Login</a>
    </p>
    <h1>Welcome <span th:text="${username}">username</span></h1>

    <div sec:authorize="isAuthenticated()">
      <div class="card">
        <div class="card-body">
          <form method="post" action="/messages">
            <div class="mb-3">
              <label for="content" class="form-label">Message</label>
              <textarea class="form-control" id="content" name="content"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  
    <div id="messages" class="pt-2">
        <!-- Display messages -->
    </div>
    
</div>
</body>
</html>
```

We are showing the **Create New Message** form only if the user is authenticated.

In order to create a new message, we need the current user details like **username**.
Let's add a utility method in **SecurityHelper** to get the current user details.

```java
package com.sivalabs.messages.domain;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SecurityHelper {

    private final OAuth2AuthorizedClientService authorizedClientService;

    public SecurityHelper(OAuth2AuthorizedClientService authorizedClientService) {
        this.authorizedClientService = authorizedClientService;
    }

    public static Map<String, Object> getLoginUserDetails() {
        Map<String, Object> map = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(authentication instanceof OAuth2AuthenticationToken)) {
            return null;
        }
        DefaultOidcUser principal = (DefaultOidcUser) authentication.getPrincipal();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        List<String> roles = authorities.stream().map(GrantedAuthority::getAuthority).toList();
        OidcUserInfo userInfo = principal.getUserInfo();
        
        map.put("id", userInfo.getSubject());
        map.put("fullName", userInfo.getFullName());
        map.put("email", userInfo.getEmail());
        map.put("username", userInfo.getPreferredUsername());
        map.put("roles", roles);
        
        return map;
    }

    // other code omitted for brevity
}
```

As we are using OpenID Connect, the authenticated user principal is of type **DefaultOidcUser**.
We are extracting the user details from **DefaultOidcUser** and returning them as a **Map**.
To keep it simple, we are not using any DTO class to represent the user details, instead we are using a **Map**.

Add the following handler method in **HomeController** to create a new message:

```java
@Controller
public class HomeController {
    private final MessageServiceClient messageServiceClient;
    private final SecurityHelper securityHelper;
    
    // other code omitted for brevity
  
    @PostMapping("/messages")
    String createProduct(Message message) {
        Map<String, Object> loginUserDetails = SecurityHelper.getLoginUserDetails();
        message.setCreatedBy(loginUserDetails.get("username").toString());
        messageServiceClient.createMessage(message);
        return "redirect:/";
    }
}
```

Now, if you restart the **messages-webapp** and login into the application, you should be able to create a new message.

## Role Based Access Control
In the previous section, if we had printed the **loginUserDetails** map, we would have seen the following output:

```shell
{ 
  id = "ca1a2f34-1614-45dd-86c1-5eafff085d8a", 
  fullName = "Siva Katamreddy", 
  email = "siva@gmail.com", 
  username = "siva",
  roles = [
    OIDC_USER, 
    SCOPE_email, 
    SCOPE_openid, 
    SCOPE_profile
  ]
}
```
The **ROLE_ADMIN** and **ROLE_USER** are not listed under **roles**, just like we have noticed for the **messages-service** in the previous article.

In order to get the assigned roles as part of the claims, we need to update a setting in Keycloak.

* Go to Keycloak Admin Console -> Select **sivalabs** realm 
* **Client scopes** -> **roles** -> **Mappers** -> **realm_roles** -> **Add to ID token** -> **ON**.

Now the assigned roles will be placed inside the claims with the key **real_access**.

Similar to how we implemented a custom **JwtTokenConverter** in **messages-service**, 
we can implement a custom **GrantedAuthoritiesMapper** in **messages-webapp** to extract the roles from **real_access** claim.

Create **KeycloakAuthoritiesMapper** class with the following content:

```java
package com.sivalabs.messages.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

class KeycloakAuthoritiesMapper implements GrantedAuthoritiesMapper {

    @Override
    public Collection<? extends GrantedAuthority> mapAuthorities(
            Collection<? extends GrantedAuthority> authorities) {
        Set<GrantedAuthority> mappedAuthorities = new HashSet<>();

        authorities.forEach(authority -> {
            if (authority instanceof SimpleGrantedAuthority) {
                mappedAuthorities.add(authority);
            }
            else if (authority instanceof OidcUserAuthority oidcUserAuthority) {
                OidcIdToken idToken = oidcUserAuthority.getIdToken();
                Map<String, Object> claims = idToken.getClaims();
                Map<String,Object> realm_access = (Map<String, Object>) claims.get("realm_access");
                if(realm_access != null && !realm_access.isEmpty()) {
                    List<String> roles = (List<String>) realm_access.get("roles");
                    var list = roles.stream()
                            .filter(role -> role.startsWith("ROLE_"))
                            .map(SimpleGrantedAuthority::new).toList();
                    mappedAuthorities.addAll(list);
                }
            } else if (authority instanceof OAuth2UserAuthority oauth2UserAuthority) {
                Map<String, Object> userAttributes = oauth2UserAuthority.getAttributes();
                // Map the attributes found in userAttributes
                // to one or more GrantedAuthority's and add it to mappedAuthorities
            }
        });
        return mappedAuthorities;
    }
}
```

We are checking the authority type and extracting the roles from **realm_access** claim.
As we are using OpenID Connect flow, authority is of type **OidcUserAuthority**.
If we were using OAuth 2.0 flow, authority would be of type **OAuth2UserAuthority**.

We have extracted the **roles** from **realm_access** claim and mapped them to **SimpleGrantedAuthority**.

Now, update **SecurityConfig** in **messages-webapp** to use this custom **GrantedAuthoritiesMapper** as follows:

```java
package com.sivalabs.messages.config;


@Configuration
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
                //.oauth2Login(Customizer.withDefaults())
                .oauth2Login(oauth2 ->
                    oauth2.userInfoEndpoint(userInfo -> userInfo
                            .userAuthoritiesMapper(new KeycloakAuthoritiesMapper())))
            .logout(logout -> logout
                .logoutSuccessHandler(oidcLogoutSuccessHandler())
            );
        return http.build();
    }

    // other code omitted for brevity
}
```

Now if you restart the **messages-webapp** and **messages-service** and print the **loginUserDetails** map, 
you should see the following output:

```shell
{ 
  id = "ca1a2f34-1614-45dd-86c1-5eafff085d8a", 
  fullName = "Siva Katamreddy", 
  email = "siva@gmail.com", 
  username = "siva",
  roles = [
    SCOPE_email, 
    SCOPE_openid, 
    SCOPE_profile,
    ROLE_USER,
    ROLE_ADMIN
  ]
}
```

Now, we can use the **roles** to implement Role Based Access Control.

Let's update **home.html** to show the message **You are an ADMIN** only if the user has **ROLE_ADMIN** role.

```html
<h1>Welcome <span th:text="${username}">username</span></h1>
<div sec:authorize="isAuthenticated()">
    <div sec:authorize="hasRole('ADMIN')">
        <p>You are an ADMIN</p>
    </div>
    <div sec:authorize="!hasRole('ADMIN')">
        <p>You are NOT an ADMIN</p>
    </div>
</div>
<!-- other code omitted for brevity -->
```

Now if you login with a user who has **ROLE_ADMIN** assigned, you should see the message **You are an ADMIN**.
Otherwise, you should see the message **You are NOT an ADMIN**.

## Conclusion
In this article, we have learned how to invoke the **messages-service** Resource Server APIs from the **messages-webapp** Client application. 
We also learned how to customize the **GrantedAuthoritiesMapper** to convert roles as Authorities and implement Role Based Access Control. 

In the next article, we will create **archival-service** and learn how to invoke **messages-service** APIs using **Client Credentials Flow**.
