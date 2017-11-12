---
title: 'JCart : ShoppingCart UI Layout Setup'
author: Siva
type: post
date: 2015-12-30T14:17:41+00:00
url: /2015/12/jcart-shoppingcart-ui-layout-setup/
post_views_count:
  - 8
categories:
  - Java
tags:
  - jcart

---
In this post we will setup the layout for our ShoppingCart UI using Thymeleaf templates.

Download the ustore theme zip file from <a href="https://www.freshdesignweb.com/ustora/" target="_blank">https://www.freshdesignweb.com/ustora/</a>  and copy the following directories/files into **jcart-site/src/main/resources/static/assets** folder.

  * css
  * fonts
  * img
  * js
  * style.css

Create Site layout thymeleaf template **jcart-site/src/main/resources/templates/layout/mainLayout.html** as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"&gt;
	  
&lt;head&gt;
    &lt;meta charset="utf-8"/&gt;
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge"/&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"/&gt;
    &lt;title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE"&gt;QuilCart&lt;/title&gt;
    
    &lt;!-- Google Fonts --&gt;
    &lt;link href='https://fonts.googleapis.com/css?family=Titillium+Web:400,200,300,700,600' rel='stylesheet' type='text/css'/&gt;
    &lt;link href='https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700,300' rel='stylesheet' type='text/css'/&gt;
    &lt;link href='https://fonts.googleapis.com/css?family=Raleway:400,100' rel='stylesheet' type='text/css'/&gt;
    
    &lt;link rel="stylesheet" th:href="@{/assets/css/bootstrap.min.css}"/&gt;
    &lt;link rel="stylesheet" th:href="@{/assets/css/font-awesome.min.css}"/&gt;    
    &lt;link rel="stylesheet" th:href="@{/assets/css/owl.carousel.css}"/&gt;
    &lt;link rel="stylesheet" th:href="@{/assets/style.css}"/&gt;
    &lt;link rel="stylesheet" th:href="@{/assets/css/responsive.css}"/&gt;    
  &lt;/head&gt;
  &lt;body&gt;
   
    &lt;div class="header-area"&gt;
        &lt;div class="container"&gt;
            &lt;div class="row"&gt;
                &lt;div class="col-md-offset-8 col-md-4"&gt;
                    &lt;div class="header-right"&gt;
                        &lt;ul class="list-unstyled list-inline"&gt;
                        	
                            &lt;li sec:authorize="${!isAuthenticated()}"&gt;&lt;a href="#" th:href="@{/login}"&gt;&lt;i class="fa fa-user"&gt;&lt;/i&gt; Login&lt;/a&gt;&lt;/li&gt;
                            &lt;li sec:authorize="${!isAuthenticated()}"&gt;&lt;a href="#" th:href="@{/register}"&gt;&lt;i class="fa fa-user"&gt;&lt;/i&gt; Register&lt;/a&gt;&lt;/li&gt;
                            &lt;li sec:authorize="${isAuthenticated()}"&gt;&lt;a href="#" th:href="@{/myAccount}"&gt;&lt;i class="fa fa-user"&gt;&lt;/i&gt; My Account&lt;/a&gt;&lt;/li&gt;
                            &lt;li sec:authorize="${isAuthenticated()}"&gt;&lt;a href="#" th:href="@{/logout}"&gt;&lt;i class="fa fa-user"&gt;&lt;/i&gt; Logout&lt;/a&gt;&lt;/li&gt;
                        &lt;/ul&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div class="site-branding-area"&gt;
        &lt;div class="container"&gt;
            &lt;div class="row"&gt;
                &lt;div class="col-sm-6"&gt;
                    &lt;div class="logo"&gt;
                        &lt;h1&gt;&lt;a href="#"&gt;&lt;img src="assets/img/quilcart.png" 
											 th:src="@{/assets/img/quilcart.png}" /&gt;&lt;/a&gt;&lt;/h1&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
                
                &lt;div class="col-sm-6"&gt;
                	
                    &lt;div class="shopping-item"&gt;
                        &lt;a href="#" th:href="@{/cart}"&gt;Cart &lt;i class="fa fa-shopping-cart"&gt;&lt;/i&gt; 
						&lt;span id="cart-item-count" class="product-count"&gt;(0)&lt;/span&gt;&lt;/a&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div class="mainmenu-area"&gt;
        &lt;div class="container"&gt;
            &lt;div class="row"&gt;
                &lt;div class="navbar-header"&gt;
                    &lt;button type="button" class="navbar-toggle" 
							data-toggle="collapse" data-target=".navbar-collapse"&gt;
                        &lt;span class="sr-only"&gt;Toggle navigation&lt;/span&gt;
                        &lt;span class="icon-bar"&gt;&lt;/span&gt;
                        &lt;span class="icon-bar"&gt;&lt;/span&gt;
                        &lt;span class="icon-bar"&gt;&lt;/span&gt;
                    &lt;/button&gt;
                &lt;/div&gt; 
                &lt;div class="navbar-collapse collapse"&gt;
                    &lt;ul class="nav navbar-nav"&gt;
                        &lt;li class="active"&gt;&lt;a href="#" th:href="@{/}"&gt;Home&lt;/a&gt;&lt;/li&gt;
                       &lt;!--  &lt;li&gt;&lt;a th:href="@{/}"&gt;New Arrivals&lt;/a&gt;&lt;/li&gt;
                        &lt;li&gt;&lt;a th:href="@{/}"&gt;Best Sellers&lt;/a&gt;&lt;/li&gt; --&gt;
                        
                    &lt;/ul&gt;
                    &lt;form class="navbar-form navbar-right" action="#" th:action="@{/products}"&gt;
			            &lt;input type="text" name="q" placeholder="Search products..."/&gt;
                        &lt;input type="submit" value="Search"/&gt;
			          &lt;/form&gt;
                &lt;/div&gt;  
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
    
    &lt;div class="product-big-title-area"&gt;
        &lt;div class="container"&gt;
            &lt;div class="row"&gt;
                &lt;div class="col-md-12"&gt;
                    &lt;div class="product-bit-title text-center"&gt;
                        &lt;h2&gt;Shop&lt;/h2&gt;
                    &lt;/div&gt;
                &lt;/div&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
	
    &lt;div layout:fragment="content"&gt;
    	&lt;p&gt;Main Content here....&lt;/p&gt;
    &lt;/div&gt;
       
   
    &lt;script src="https://code.jquery.com/jquery.min.js"&gt;&lt;/script&gt;
    &lt;script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"&gt;&lt;/script&gt;
    &lt;script th:src="@{'/assets/js/owl.carousel.min.js'}"&gt;&lt;/script&gt;
    &lt;script th:src="@{'/assets/js/jquery.sticky.js'}"&gt;&lt;/script&gt;
    &lt;script th:src="@{'/assets/js/jquery.easing.1.3.min.js'}"&gt;&lt;/script&gt;
    &lt;script th:src="@{'/assets/js/main.js'}"&gt;&lt;/script&gt;	  
    &lt;script th:src="@{'/assets/js/app.js'}"&gt;&lt;/script&gt;	  
    
    &lt;/body&gt;
&lt;/html&gt;</pre>

Now update our **home.html** template to use the layout as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
      &lt;head&gt;
        &lt;title&gt;Home&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
    	&lt;div layout:fragment="content"&gt;
    		&lt;h3&gt;Welcome to QuilCart&lt;/h3&gt;
    	&lt;/div&gt;
    	
    &lt;/body&gt;
    
&lt;/html&gt;</pre>

Now run the application and point your browser to **https://localhost:8443/home** and you should be able to see the home page with all the layout content as well.