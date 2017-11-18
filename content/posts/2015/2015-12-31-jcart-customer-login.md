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

{{< highlight html>}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
<head>
	<title>Login</title>
</head>
<body>
	<div layout:fragment="content">
		<div class="single-product-area">
			<div class="zigzag-bottom"></div>
			<div class="container">
				
				<div class="row">
					
					<div class="col-md-offset-4 col-md-4" >
						<form id="login-form-wrap" th:action="@{/login}" method="post">


							<p class="form-row form-row-first">
								<label for="email">Email <span class="required">*</span>
								</label>
								<input type="text" id="username" name="username" class="input-text" placeholder="Email"/>
							</p>
							<p class="form-row form-row-last">
								<label for="password">Password <span class="required">*</span>
								</label>
								<input type="password" id="password" name="password" class="input-text" placeholder="Password"/>
							</p>
							<div class="clear"></div>


							<p class="form-row">
								<input type="submit" value="Login" class="button"/>
							</p>
							
							<p>
								<div th:if="${param.error}" class="alert alert-danger alert-dismissable" >
									<p><i class="icon fa fa-ban"></i> <span th:text="#{error.login_failed}">Invalid Email and Password.</span></p>
								</div>
								<div th:if="${param.logout}" class="alert alert-info alert-dismissable" >
									<p><i class="icon fa fa-info"></i> <span th:text="#{info.logout_success}">You have been logged out.</span></p>
								</div>		          
								<div th:if="${info!=null}" class="alert alert-warning alert-dismissable" >
									<p><i class="icon fa fa-warning"></i> <span th:text="${info}"></span></p>
								</div>   
							</p>
							<p class="lost_password">
								New Customer? <a href="#" th:href="@{/register}" th:text="#{label.register}">Register</a>
							</p>
							
							<div class="clear"></div>
						</form>
						
					</div>
				</div>
				
			</div>
		</div>
	</div>
	
</body>
    
</html>
{{</ highlight >}}

We are using SpringSecurity for Customer Authentication and we have already configured SpringSecurity in 
our previous post [JCart : Initial code setup for ShoppingCart]({{< relref "2015-12-30-jcart-initial-code-setup-for-shoppingcart.md" >}}) 

We have already created a couple of sample customer records using the seed data sql script **jcart-core/src/main/resources/data.sql**.
  
You can try to login using sivaprasadreddy.k@gmail.com/siva credentials. If login is successful it will redirect to **/checkout** url which we have not yet implemented, otherwise it will show login error.
