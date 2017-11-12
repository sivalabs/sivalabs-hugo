---
title: 'JCart : ShoppingCart Product Search Results'
author: Siva
type: post
date: 2015-12-30T14:27:57+00:00
url: /2015/12/jcart-shoppingcart-product-search-results/
post_views_count:
  - 3
categories:
  - Java
tags:
  - jcart

---
In our main template we have a Search box to search for products. In this post we will implement the Product Search functionality. When customer search for a product we will search products based on name or SKU or description.

Let us implement the search handler method in **ProductController** as follows:

<pre class="lang:java decode:true ">@Controller
public class ProductController extends JCartSiteBaseController
{	
	@Autowired protected CatalogService catalogService;
	
	...
	...
	
	@RequestMapping("/products")
	public String searchProducts(@RequestParam(name="q", defaultValue="") String query, Model model)
	{
		List&lt;Product&gt; products = catalogService.searchProducts(query);
		model.addAttribute("products", products);
		return "products";
	}
	
}</pre>

Create the Search Results view **products.html** as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
&lt;head&gt;
	&lt;title&gt;Product Search Results&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="single-product-area"&gt;
			&lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
			&lt;div class="container"&gt;
				
				&lt;div class="row"&gt;
					&lt;div class="woocommerce-info"&gt; 
						&lt;span class=""&gt;Product Search Results&lt;/span&gt;
					 &lt;/div&gt;
					&lt;div class="col-md-3 col-sm-6" th:each="product : ${products}"&gt;
						&lt;div class="single-shop-product"&gt;
							&lt;div class="product-upper"&gt;
								&lt;img src="assets/img/products/2.jpg" alt="" 
										th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"/&gt;
							&lt;/div&gt;
							&lt;h2&gt;&lt;a href="#" th:href="@{/products/{sku}(sku=${product.sku})}" 
									th:text="${product.name}"&gt;Product Name&lt;/a&gt;&lt;/h2&gt;
							&lt;div class="product-carousel-price"&gt;
								&lt;ins th:text="${product.price}"&gt;$9.00&lt;/ins&gt;
							&lt;/div&gt;  
							
							&lt;div class="product-option-shop"&gt;
								&lt;a class="add_to_cart_button" data-quantity="1" data-product_sku="" data-product_id="70" 
									rel="nofollow" href="#"
									th:onclick="'javascript:addItemToCart(\'' + ${product.sku} + '\');'"&gt;Add to cart&lt;/a&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					
				&lt;/div&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;    
&lt;/html&gt;
</pre>

Now try to search by any product name or sku or description and you should be able to see the matching product results.