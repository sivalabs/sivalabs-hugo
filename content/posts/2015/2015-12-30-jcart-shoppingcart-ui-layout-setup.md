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

{{< highlight html >}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3">
	  
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title layout:title-pattern="$DECORATOR_TITLE - $CONTENT_TITLE">QuilCart</title>
    
    <!-- Google Fonts -->
    <link href='https://fonts.googleapis.com/css?family=Titillium+Web:400,200,300,700,600' rel='stylesheet' type='text/css'/>
    <link href='https://fonts.googleapis.com/css?family=Roboto+Condensed:400,700,300' rel='stylesheet' type='text/css'/>
    <link href='https://fonts.googleapis.com/css?family=Raleway:400,100' rel='stylesheet' type='text/css'/>
    
    <link rel="stylesheet" th:href="@{/assets/css/bootstrap.min.css}"/>
    <link rel="stylesheet" th:href="@{/assets/css/font-awesome.min.css}"/>    
    <link rel="stylesheet" th:href="@{/assets/css/owl.carousel.css}"/>
    <link rel="stylesheet" th:href="@{/assets/style.css}"/>
    <link rel="stylesheet" th:href="@{/assets/css/responsive.css}"/>    
  </head>
  <body>
   
    <div class="header-area">
        <div class="container">
            <div class="row">
                <div class="col-md-offset-8 col-md-4">
                    <div class="header-right">
                        <ul class="list-unstyled list-inline">
                        	
                            <li sec:authorize="${!isAuthenticated()}"><a href="#" th:href="@{/login}"><i class="fa fa-user"></i> Login</a></li>
                            <li sec:authorize="${!isAuthenticated()}"><a href="#" th:href="@{/register}"><i class="fa fa-user"></i> Register</a></li>
                            <li sec:authorize="${isAuthenticated()}"><a href="#" th:href="@{/myAccount}"><i class="fa fa-user"></i> My Account</a></li>
                            <li sec:authorize="${isAuthenticated()}"><a href="#" th:href="@{/logout}"><i class="fa fa-user"></i> Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="site-branding-area">
        <div class="container">
            <div class="row">
                <div class="col-sm-6">
                    <div class="logo">
                        <h1><a href="#"><img src="assets/img/quilcart.png" 
											 th:src="@{/assets/img/quilcart.png}" /></a></h1>
                    </div>
                </div>
                
                <div class="col-sm-6">
                	
                    <div class="shopping-item">
                        <a href="#" th:href="@{/cart}">Cart <i class="fa fa-shopping-cart"></i> 
						<span id="cart-item-count" class="product-count">(0)</span></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="mainmenu-area">
        <div class="container">
            <div class="row">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle" 
							data-toggle="collapse" data-target=".navbar-collapse">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div> 
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav">
                        <li class="active"><a href="#" th:href="@{/}">Home</a></li>
                       <!--  <li><a th:href="@{/}">New Arrivals</a></li>
                        <li><a th:href="@{/}">Best Sellers</a></li> -->
                        
                    </ul>
                    <form class="navbar-form navbar-right" action="#" th:action="@{/products}">
			            <input type="text" name="q" placeholder="Search products..."/>
                        <input type="submit" value="Search"/>
			          </form>
                </div>  
            </div>
        </div>
    </div>
    
    <div class="product-big-title-area">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="product-bit-title text-center">
                        <h2>Shop</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
	
    <div layout:fragment="content">
    	<p>Main Content here....</p>
    </div>
       
   
    <script src="https://code.jquery.com/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
    <script th:src="@{'/assets/js/owl.carousel.min.js'}"></script>
    <script th:src="@{'/assets/js/jquery.sticky.js'}"></script>
    <script th:src="@{'/assets/js/jquery.easing.1.3.min.js'}"></script>
    <script th:src="@{'/assets/js/main.js'}"></script>	  
    <script th:src="@{'/assets/js/app.js'}"></script>	  
    
    </body>
</html>
{{</ highlight >}}

Now update our **home.html** template to use the layout as follows:

{{< highlight html >}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
      <head>
        <title>Home</title>
    </head>
    <body>
    	<div layout:fragment="content">
    		<h3>Welcome to QuilCart</h3>
    	</div>
    	
    </body>
    
</html>
{{</ highlight >}}

Now run the application and point your browser to **https://localhost:8443/home** and you should be able to see the home page with all the layout content as well.
