---
title: 'JCart: Admin UI Layout SetUp'
author: Siva
type: post
date: 2015-12-01T04:38:56+00:00
url: /jcart-admin-ui-layout-setup/
categories:
  - Java
tags:
  - jcart
  - SpringBoot

---
As I am not really a good UI designer I searched for a free good looking UI website Admin templates and I found this fantastic template <a href="https://almsaeedstudio.com/preview" target="_blank">https://almsaeedstudio.com/preview</a>. We will be using this template for our Administration web application.

We are going to use Thymeleaf templates for our View layer. Thymeleaf offers facelets style templating mechanism. Basically we need 2 layout templates, one for unauthorized views like Login/ForgotPassword etc and another for authorized users.

## Setup AdminLTE Theme Resources

We are going to start with basic template and include what is necessary instead of dumping everything that comes with the theme.

  * Copy AdminLTE-2.3.0/bootstrap into jcart-admin/src/main/resources/static/assets folder.
  * Copy AdminLTE-2.3.0/dist into jcart-admin/src/main/resources/static/assets folder. You can keep dist/js/app.min.js and delete rest of the files from js directory.
  * Copy AdminLTE-2.3.0/plugins/jQuery into jcart-admin/src/main/resources/static/assets/plugins folder.

Note: I don't want to dump all the HTML content along with CSS styles on this post itself. Instead I will put only the key parts of the HTML content and give a link to the complete file on GitHub repository <a href="https://github.com/sivaprasadreddy/jcart" target="_blank">https://github.com/sivaprasadreddy/jcart</a>.

## GuestLayout Template

Create the guest layout thymeleaf template jcart-admin/src/main/resources/templates/layout/guestLayout.html as follows:

```html
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org">
  <head>
    

<meta charset="utf-8" />

<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">
  JCart Admin
</title>
    

<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

<link rel="stylesheet" th:href="@{/assets/bootstrap/css/bootstrap.min.css}" />

<link rel="stylesheet" th:href="@{https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css}" />

<link rel="stylesheet" th:href="@{https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css}" />

<link rel="stylesheet" th:href="@{/assets/dist/css/AdminLTE.min.css}" />
</head>
  <body>
<div layout:fragment="content">
  <!-- Your Page Content Here -->
  	
</div>
  </body>
</html>
```

This is guest layout skeleton page. Observe the place holder ```<div layout:fragment="content"> ... </div>``` for the content to be dynamically included at runtime.

## Login Page

Create login view page **jcart-admin/src/main/resources/templates/public/login.html**

```html
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
      layout:decorator="layout/guestLayout">
  <head>
<title>
  Log in
</title>    
  </head>
  <body>
  	

<div layout:fragment="content">
  <a href="forgotPwd" th:href="@{/forgotPwd}" th:text="#{label.forgot_password}">I forgot my password</a><br />   
  	
        
</div>
   </body>
</html>
```

### Things to observe here:

  * We are specifying to use guestlayout template for this Login page by using layout:decorator="layout/guestLayout"
  * We are using various Thymeleaf attributes like th:action, th:if, th:text to provide the dynamic content
  * We are using th:text="#{some\_message\_key}" to provide all the labels dynamically from ResourceBundles jcart-admin/src/main/resources/messages.properties so that we can provide I18N feature easily.
  * We are using ${param.someKey} to access HttpServletRequest parameters.
  * We are using ${someKey} to access HttpServletRequest attributes.
  * We are using th:action="@{/login}" and th:href="@{/forgotPwd}" for URLs so that we don't have to worry about Context Relative URL problems.
For more information on using Thymeleaf Layouts refer <a href="http://www.thymeleaf.org/doc/articles/layouts.html" target="_blank">http://www.thymeleaf.org/doc/articles/layouts.html</a>

## Using ResourceBundles for Internationalization (I18N)

Create the default ResourceBundle **jcart-admin/src/main/resources/messages.properties**.
  
For now we are supporting only English Locale.

```properties
label.jcart_admin=JCart Admin
label.email=Email
label.password=Password
label.login=Login
label.submit=Submit
label.forgot_password=I forgot my password
info.logout_success=You have been logged out
error.login_failed=Invalid Email and Password
```

Now create **JCartAdminApplication.java** which is starting point for our Administration application. 

```java
package com.sivalabs.jcart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class JCartAdminApplication
{
	public static void main(String[] args)
	{
	SpringApplication.run(JCartAdminApplication.class, args);
	}
}
```

## WebMVC Configuration

Create a Spring WebMVC Configuration class to configure things like ViewControllers, Interceptors etc.

```java
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{   
	@Override
	public void addViewControllers(ViewControllerRegistry registry)
	{
	super.addViewControllers(registry);
        registry.addViewController("/login").setViewName("public/login");
	registry.addRedirectViewController("/", "/home");
	
	}
	
}
```

Now we can run JCartAdminApplication as a Java Application and point your browser to <a href="http://localhost:8080/login" target="_blank">http://localhost:8080/login</a>

## Authorized Users Layout

Create the main layout thymeleaf template **jcart-admin/src/main/resources/templates/layout/mainLayout.html** as follows:

```html
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org">
  <head>
<meta charset="utf-8" />

<meta http-equiv="X-UA-Compatible" content="IE=edge" />

<title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">
  JCart Admin
</title>
    
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />

<link rel="stylesheet" th:href="@{/assets/bootstrap/css/bootstrap.min.css}" />

<link rel="stylesheet" th:href="@{https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css}" />

<link rel="stylesheet" th:href="@{https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css}" />

<link rel="stylesheet" th:href="@{/assets/dist/css/AdminLTE.min.css}" />

<link rel="stylesheet" th:href="@{/assets/dist/css/skins/skin-blue.min.css}" />
</head>
  <body>
    

<div class="wrapper">
  <!-- Main Header -->
        <header class="main-header">
  
          
  
  <!-- Logo -->
          
  
  <a href="#" th:href="@{/home}" class="logo">
            ...
          </a>
  
          <!-- Header Navbar -->
          <nav class="navbar navbar-static-top" role="navigation">
            ...
          </nav>
        </header>
        
  
  <!-- Left side column. contains the logo and sidebar -->
        <aside class="main-sidebar">
          
  
  <!-- sidebar: style can be found in sidebar.less -->
          <section class="sidebar">
  
            
  
  <!-- Sidebar user panel (optional) -->
            
  
  <div class="user-panel">
    ...
              
  </div>
  
            
  
  <!-- Sidebar Menu -->
            
  
  <ul class="sidebar-menu">
    <li>
      <a href="#" th:href="@{'/home'}"><i class="fa fa-home"></i> <span>Home</span></a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/categories'}"><i class="fa fa-folder-open"></i> <span>Categories</span></a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/products'}"><i class="fa fa-file"></i> <span>Products</span></a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/orders'}"><i class="fa fa-cart-arrow-down"></i> <span>Orders</span></a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/customers'}"><i class="fa fa-smile-o"></i> <span>Customers</span></a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/users'}"><i class="fa fa-users"></i> Users</a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/roles'}"><i class="fa fa-user"></i> Roles</a>
    </li>
                
    
    <li>
      <a href="#" th:href="@{'/permissions'}"><i class="fa fa-shield"></i> Permissions</a>
    </li>            
              
  </ul>
          </section>        
        </aside>
  
        
  
  <!-- Content Wrapper. Contains page content -->
        
  
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
            
    
    <div layout:fragment="pageHeader">
      <section class="content-header">
      	        	
      
      <h1>
        Header Title
      </h1>	          	
      	        </section>
              
    </div>
    
            
    
    <!-- Main content -->
            <section class="content">
              
    
    <div layout:fragment="content">
      <!-- Your Page Content Here -->
      	  
    </div>
    
            </section>
          
  </div>
  
        
  
  <!-- Main Footer -->
        <footer class="main-footer">
          ...
        </footer>      
      
</div>

   </body>
</html>
```

Create Home page thymeleaf view **jcart-admin/src/main/resources/templates/home.html** as follows:

```html
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
      layout:decorator="layout/mainLayout">
      
      <head>
        

<title>
  Home
</title>
    </head>
  <body>
    	

<div layout:fragment="pageHeader">
  <section class="content-header">
          	
  
  <h1>
    JCart Administration
                	<small>Manage JCart Site Content</small>
              	
  </h1>
          </section>
          
</div>
    	

<div layout:fragment="content">
  <p>
    Welcome User!
  </p>
      	
</div>
   </body>
</html>
```

Create a simple controller to display Home page.

```java@Controller
public class HomeController 
{	
	@RequestMapping("/home")
	public String home(Model model)
	{
	return "home";
	}
}
```

Now you can run JCartAdminApplication as a Java Application and point your browser to <a href="http://localhost:8080/home" target="_blank">http://localhost:8080/home</a>.

## ResourceBundle for Hibernate Validation Errors

If you observe the JPA entities, we are using Hibernate Validation annotations for some of our Entity fields. SpringMVC has support for JSR-303 Bean Validation API. But by default Hibernate Validation looks for **ValidationMessages.properties** file in root classpath for failure message keys.
  
If you want to use **messages.properties** for both I18N and Hibernate Validation error messages you can register the Validator Bean as follows:

```java
@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{  
	...
	...
	
	@Autowired
    private MessageSource messageSource;

    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
        factory.setValidationMessageSource(messageSource);
        return factory;
    }
	
}
```

Now we have the layout templates ready and basic MVC configuration is in place. Next we will look into how to configure Spring Security.
