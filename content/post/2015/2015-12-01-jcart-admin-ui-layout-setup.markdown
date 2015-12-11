---
author: siva
comments: true
date: 2015-12-01 04:38:56+00:00
layout: post
Url: jcart-admin-ui-layout-setup
title: 'JCart: Admin UI Layout SetUp'
wordpress_id: 507
categories:
- E-Commerce
tags:
- jcart
- SpringBoot
draft : true
---

As I am not really a good UI designer I searched for a free good looking UI website Admin templates and I found this fantastic template [https://almsaeedstudio.com/preview](https://almsaeedstudio.com/preview). We will be using this template for our Administration web application.

We are going to use Thymeleaf templates for our View layer. Thymeleaf offers facelets style templating mechanism. Basically we need 2 layout templates, one for unauthorized views like Login/ForgotPassword etc and another for authorized users.



## Setup AdminLTE Theme Resources



We are going to start with basic template and include what is necessary instead of dumping everything that comes with the theme.




	
  * Copy AdminLTE-2.3.0/bootstrap into jcart-admin/src/main/resources/static/assets folder.


	
  * Copy AdminLTE-2.3.0/dist into jcart-admin/src/main/resources/static/assets folder. You can keep dist/js/app.min.js and delete rest of the files from js directory.


	
  * Copy AdminLTE-2.3.0/plugins/jQuery into jcart-admin/src/main/resources/static/assets/plugins folder.






<blockquote>Note: I don't want to dump all the HTML content along with CSS styles on this post itself. Instead I will put only the key parts of the HTML content and give a link to the complete file on GitHub repository [https://github.com/sivaprasadreddy/jcart](https://github.com/sivaprasadreddy/jcart).</blockquote>





## GuestLayout Template



Create the guest layout thymeleaf template jcart-admin/src/main/resources/templates/layout/guestLayout.html as follows:


    
    
    
    <html xmlns="http://www.w3.org/1999/xhtml" 
    	  xmlns:th="http://www.thymeleaf.org">
      <head>
        <meta charset="utf-8"></meta>
        <meta content="IE=edge" http-equiv="X-UA-Compatible"></meta>
        <title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">JCart Admin</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport"></meta>
        <link th:href="@{/assets/bootstrap/css/bootstrap.min.css}" rel="stylesheet"></link>
        <link th:href="@{https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css}" rel="stylesheet"></link>
        <link th:href="@{https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css}" rel="stylesheet"></link>
        <link th:href="@{/assets/dist/css/AdminLTE.min.css}" rel="stylesheet"></link>
        
      </head>
      <body>
        	<div layout:fragment="content">
    	          
    	</div>
    
        <script th:src="@{'/assets/plugins/jQuery/jQuery-2.1.4.min.js'}"></script>
        <script th:src="@{'/assets/bootstrap/js/bootstrap.min.js'}"></script>
        
      </body>
    </html>
    



This is guest layout skeleton page. Observe the place holder <div layout:fragment="content"> ... </div> for the content to be dynamically included at runtime.



## Login Page



Create login view page **jcart-admin/src/main/resources/templates/public/login.html**


    
    
    
    <html xmlns="http://www.w3.org/1999/xhtml" 
    	  xmlns:th="http://www.thymeleaf.org"
          layout:decorator="layout/guestLayout">
      <head>
        <title>Log in</title>    
      </head>
      <body>
      	<div layout:fragment="content">
        
            <form action="home" th:action="@{/login}" method="post">
    	<p><input placeholder="Email" type="email" class="form-control" name="username"></input></p>
    	<p><input placeholder="Password" type="password" class="form-control" name="password"></input></p>
    	<p><button th:text="#{label.login}" type="submit" class="btn btn-primary btn-block btn-flat">LogIn</button></p>
    	          
    	<div th:if="${param.error}">
    	<p><span th:text="#{error.login_failed}">Invalid Email and Password.</span></p>
    	</div>
    	<div th:if="${param.logout}">
    	<p><span th:text="#{info.logout_success}">You have been logged out.</span></p>
    	</div>	          
    	<div th:if="${msg!=null}">
    	<p><span th:text="${msg}"></span></p>
    	</div>            
            </form>        
            <a th:href="@{/forgotPwd}" href="forgotPwd" th:text="#{label.forgot_password}">I forgot my password</a><br></br>   
    	
          </div>
       </body>
    </html>
    





### Things to observe here:


		
* We are specifying to use guestlayout template for this Login page by using layout:decorator="layout/guestLayout"


		
* We are using various Thymeleaf attributes like th:action, th:if, th:text to provide the dynamic content


		
* We are using th:text="#{some_message_key}" to provide all the labels dynamically from ResourceBundles jcart-admin/src/main/resources/messages.properties so that we can provide I18N feature easily.


		
* We are using ${param.someKey} to access HttpServletRequest parameters.


		
* We are using ${someKey} to access HttpServletRequest attributes.


		
* We are using th:action="@{/login}" and th:href="@{/forgotPwd}" for URLs so that we don't have to worry about Context Relative URL problems.


	
For more information on using Thymeleaf Layouts refer [http://www.thymeleaf.org/doc/articles/layouts.html](http://www.thymeleaf.org/doc/articles/layouts.html)



## Using ResourceBundles for Internationalization (I18N)


Create the default ResourceBundle **jcart-admin/src/main/resources/messages.properties**. 
For now we are supporting only English Locale.


    
    
    label.jcart_admin=JCart Admin
    label.email=Email
    label.password=Password
    label.login=Login
    label.submit=Submit
    label.forgot_password=I forgot my password
    info.logout_success=You have been logged out
    error.login_failed=Invalid Email and Password
    



Now create **JCartAdminApplication.java** which is starting point for our Administration application. 


    
    
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
    





## WebMVC Configuration


Create a Spring WebMVC Configuration class to configure things like ViewControllers, Interceptors etc.


    
    
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
    



Now we can run JCartAdminApplication as a Java Application and point your browser to [http://localhost:8080/login](http://localhost:8080/login)



## Authorized Users Layout



Create the main layout thymeleaf template **jcart-admin/src/main/resources/templates/layout/mainLayout.html** as follows:


    
    
    
    <html xmlns="http://www.w3.org/1999/xhtml" 
    	  xmlns:th="http://www.thymeleaf.org">
      <head>
        <meta charset="utf-8"></meta>
        <meta content="IE=edge" http-equiv="X-UA-Compatible"></meta>
        <title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">JCart Admin</title>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport"></meta>
        <link th:href="@{/assets/bootstrap/css/bootstrap.min.css}" rel="stylesheet"></link>
        <link th:href="@{https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css}" rel="stylesheet"></link>
        <link th:href="@{https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css}" rel="stylesheet"></link>
        <link th:href="@{/assets/dist/css/AdminLTE.min.css}" rel="stylesheet"></link>
        <link th:href="@{/assets/dist/css/skins/skin-blue.min.css}" rel="stylesheet"></link>
      </head>
      <body>
        <div class="wrapper">
    
          
          <header class="main-header">
    
            
            <a th:href="@{/home}" href="#" class="logo">
              ...
            </a>
    
            
            <nav role="navigation" class="navbar navbar-static-top">
              ...
            </nav>
          </header>
          
          <aside class="main-sidebar">
            
            <section class="sidebar">
    
              
              <div class="user-panel">
                ...
              </div>
    
              
              <ul class="sidebar-menu">
                <li><a th:href="@{'/home'}" href="#"><i class="fa fa-home"></i> <span>Home</span></a></li>
                <li><a th:href="@{'/categories'}" href="#"><i class="fa fa-folder-open"></i> <span>Categories</span></a></li>
                <li><a th:href="@{'/products'}" href="#"><i class="fa fa-file"></i> <span>Products</span></a></li>
                <li><a th:href="@{'/orders'}" href="#"><i class="fa fa-cart-arrow-down"></i> <span>Orders</span></a></li>
                <li><a th:href="@{'/customers'}" href="#"><i class="fa fa-smile-o"></i> <span>Customers</span></a></li>
                <li><a th:href="@{'/users'}" href="#"><i class="fa fa-users"></i> Users</a></li>
                <li><a th:href="@{'/roles'}" href="#"><i class="fa fa-user"></i> Roles</a></li>
                <li><a th:href="@{'/permissions'}" href="#"><i class="fa fa-shield"></i> Permissions</a></li>            
              </ul>
            </section>        
          </aside>
    
          
          <div class="content-wrapper">
            
            <div layout:fragment="pageHeader">
            	<section class="content-header">
    	        	<h1>Header Title</h1>	          	
    	        </section>
            </div>
    
            
            <section class="content">
              <div layout:fragment="content">
    	          
    	  </div>
    
            </section>
          </div>
    
          
          <footer class="main-footer">
            ...
          </footer>      
        </div>
    
        <script th:src="@{'/assets/plugins/jQuery/jQuery-2.1.4.min.js'}"></script>
        <script th:src="@{'/assets/bootstrap/js/bootstrap.min.js'}"></script>
        <script th:src="@{'/assets/dist/js/app.min.js'}"></script>
        
       </body>
    </html>
    




Create Home page thymeleaf view **jcart-admin/src/main/resources/templates/home.html** as follows:


    
    
    
    <html xmlns="http://www.w3.org/1999/xhtml" 
    	  xmlns:th="http://www.thymeleaf.org"
          layout:decorator="layout/mainLayout">
          
          <head>
            <title>Home</title>
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
    	        <p>Welcome User!</p>
        	</div>
       </body>
    </html>
    



Create a simple controller to display Home page.


    
    
    @Controller
    public class HomeController 
    {	
    	@RequestMapping("/home")
    	public String home(Model model)
    	{
    	return "home";
    	}
    }
    



Now you can run JCartAdminApplication as a Java Application and point your browser to [http://localhost:8080/home](http://localhost:8080/home).




## ResourceBundle for Hibernate Validation Errors



If you observe the JPA entities, we are using Hibernate Validation annotations for some of our Entity fields. SpringMVC has support for JSR-303 Bean Validation API. But by default Hibernate Validation looks for **ValidationMessages.properties** file in root classpath for failure message keys.
If you want to use **messages.properties** for both I18N and Hibernate Validation error messages you can register the Validator Bean as follows:


    
    
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
    



Now we have the layout templates ready and basic MVC configuration is in place. Next we will look into how to configure Spring Security.
