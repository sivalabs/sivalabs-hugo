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

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
      &lt;head&gt;
        &lt;title&gt;Category&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
    	&lt;div layout:fragment="content"&gt;
    		&lt;div class="single-product-area"&gt;
		        &lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
		        &lt;div class="container"&gt;
		        	
		            &lt;div class="row"&gt;
		            	&lt;div class="woocommerce-info"&gt; 
		            		&lt;a href="" th:href="@{/}"&gt;Home&lt;/a&gt; / 
		                    &lt;a href="" th:href="@{/categories/{name}(name=${category.name})}" 
		                    	th:text="${category.name}"&gt;Category Name&lt;/a&gt;
		                 &lt;/div&gt;
		                &lt;div class="col-md-3 col-sm-6" th:each="product : ${category.products}"&gt;
		                    &lt;div class="single-shop-product"&gt;
		                        &lt;div class="product-upper"&gt;
		                            &lt;img src="assets/img/products/2.jpg" alt="" 
		                            	 th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"/&gt;
		                        &lt;/div&gt;
		                        &lt;h2&gt;&lt;a href="#" th:href="@{/products/{sku}(sku=${product.sku})}" 
		                        		th:text="${product.name}"&gt;Product name&lt;/a&gt;&lt;/h2&gt;
		                        &lt;div class="product-carousel-price"&gt;
		                            &lt;ins th:text="${product.price}"&gt;$9.00&lt;/ins&gt;
		                        &lt;/div&gt;
		                        
		                        &lt;div class="product-option-shop"&gt;
		                            &lt;a class="add_to_cart_button" data-quantity="1" data-product_sku="" 
		                            	data-product_id="70" rel="nofollow" href="#"
		                            	th:onclick="'javascript:addItemToCart(\'' + ${product.sku} + '\');'"&gt;Add to cart&lt;/a&gt;
		                        &lt;/div&gt;                       
		                    &lt;/div&gt;
		                &lt;/div&gt;
		                
		            &lt;/div&gt;
		            
		        &lt;/div&gt;
		    &lt;/div&gt;
    	&lt;/div&gt;
    	
    &lt;/body&gt;
    
&lt;/html&gt;</pre>

Now when you click on Category Name you should be able to see all the products in that category.