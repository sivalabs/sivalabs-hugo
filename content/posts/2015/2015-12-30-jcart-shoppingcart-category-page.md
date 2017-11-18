---
title: 'JCart : ShoppingCart Category Page'
author: Siva
type: post
date: 2015-12-30T14:23:06+00:00
url: /2015/12/jcart-shoppingcart-category-page/
post_views_count:
  - 5
categories:
  - Java
tags:
  - jcart

---
In our Home Page we displayed all the Categories along with few products per each category. When customer clicks on any Category Name we should display Category Page which shows all the products in that Category.

We already have **HomeController.category()** method to handle the URL **/categories/{name}**.
  
So let us create **category.html** thymeleaf template as follows:

{{< highlight html>}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
      <head>
        <title>Category</title>
    </head>
    <body>
    	<div layout:fragment="content">
    		<div class="single-product-area">
		        <div class="zigzag-bottom"></div>
		        <div class="container">
		        	
		            <div class="row">
		            	<div class="woocommerce-info"> 
		            		<a href="" th:href="@{/}">Home</a> / 
		                    <a href="" th:href="@{/categories/{name}(name=${category.name})}" 
		                    	th:text="${category.name}">Category Name</a>
		                 </div>
		                <div class="col-md-3 col-sm-6" th:each="product : ${category.products}">
		                    <div class="single-shop-product">
		                        <div class="product-upper">
		                            <img src="assets/img/products/2.jpg" alt="" 
		                            	 th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"/>
		                        </div>
		                        <h2><a href="#" th:href="@{/products/{sku}(sku=${product.sku})}" 
		                        		th:text="${product.name}">Product name</a></h2>
		                        <div class="product-carousel-price">
		                            <ins th:text="${product.price}">$9.00</ins>
		                        </div>
		                        
		                        <div class="product-option-shop">
		                            <a class="add_to_cart_button" data-quantity="1" data-product_sku="" 
		                            	data-product_id="70" rel="nofollow" href="#"
		                            	th:onclick="'javascript:addItemToCart(\'' + ${product.sku} + '\');'">Add to cart</a>
		                        </div>                       
		                    </div>
		                </div>
		                
		            </div>
		            
		        </div>
		    </div>
    	</div>
    	
    </body>
    
</html>
{{</ highlight >}}

Now when you click on Category Name you should be able to see all the products in that category.
