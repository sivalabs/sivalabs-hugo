---
title: 'JCart : Customer Login'
author: Siva
type: post
date: 2015-12-31T07:20:06+00:00
url: /2015/12/jcart-customer-login/
post_views_count:
  - 2
categories:
  - Java
tags:
  - jcart

---
So far we have implemented the functionality where customers can browse the categories, add products to cart, view Cart and update/remove items.
  
But to checkout the cart the customer should login into the system. So if the customer is not yet loggedin we should redirect customer to login page. If customer is already registered with our system he can login or he should be able to register. So, we will start implementing Customer Login/Registration usecases.

Let us create login form thymeleaf view jcart-site/src/main/resources/templates/login.html as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
&lt;head&gt;
	&lt;title&gt;Login&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="single-product-area"&gt;
			&lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
			&lt;div class="container"&gt;
				
				&lt;div class="row"&gt;
					
					&lt;div class="col-md-offset-4 col-md-4" &gt;
						&lt;form id="login-form-wrap" th:action="@{/login}" method="post"&gt;


							&lt;p class="form-row form-row-first"&gt;
								&lt;label for="email"&gt;Email &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="text" id="username" name="username" class="input-text" placeholder="Email"/&gt;
							&lt;/p&gt;
							&lt;p class="form-row form-row-last"&gt;
								&lt;label for="password"&gt;Password &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="password" id="password" name="password" class="input-text" placeholder="Password"/&gt;
							&lt;/p&gt;
							&lt;div class="clear"&gt;&lt;/div&gt;


							&lt;p class="form-row"&gt;
								&lt;input type="submit" value="Login" class="button"/&gt;
							&lt;/p&gt;
							
							&lt;p&gt;
								&lt;div th:if="${param.error}" class="alert alert-danger alert-dismissable" &gt;
									&lt;p&gt;&lt;i class="icon fa fa-ban"&gt;&lt;/i&gt; &lt;span th:text="#{error.login_failed}"&gt;Invalid Email and Password.&lt;/span&gt;&lt;/p&gt;
								&lt;/div&gt;
								&lt;div th:if="${param.logout}" class="alert alert-info alert-dismissable" &gt;
									&lt;p&gt;&lt;i class="icon fa fa-info"&gt;&lt;/i&gt; &lt;span th:text="#{info.logout_success}"&gt;You have been logged out.&lt;/span&gt;&lt;/p&gt;
								&lt;/div&gt;		          
								&lt;div th:if="${info!=null}" class="alert alert-warning alert-dismissable" &gt;
									&lt;p&gt;&lt;i class="icon fa fa-warning"&gt;&lt;/i&gt; &lt;span th:text="${info}"&gt;&lt;/span&gt;&lt;/p&gt;
								&lt;/div&gt;   
							&lt;/p&gt;
							&lt;p class="lost_password"&gt;
								New Customer? &lt;a href="#" th:href="@{/register}" th:text="#{label.register}"&gt;Register&lt;/a&gt;
							&lt;/p&gt;
							
							&lt;div class="clear"&gt;&lt;/div&gt;
						&lt;/form&gt;
						
					&lt;/div&gt;
				&lt;/div&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;
    
&lt;/html&gt;</pre>

We are using SpringSecurity for Customer Authentication and we have already configured SpringSecurity in our previous post <a href="http://sivalabs.in/jcart-initial-code-setup-for-shoppingcart/" target="_blank">JCart : Initial code setup for ShoppingCart</a>

We have already created a couple of sample customer records using the seed data sql script **jcart-core/src/main/resources/data.sql**.
  
You can try to login using sivaprasadreddy.k@gmail.com/siva credentials. If login is successful it will redirect to **/checkout** url which we have not yet implemented, otherwise it will show login error.