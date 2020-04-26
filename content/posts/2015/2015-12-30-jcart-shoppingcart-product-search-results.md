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

```java
@Controller
public class ProductController extends JCartSiteBaseController
{	
	@Autowired 
	protected CatalogService catalogService;
	...
	...
	
	@RequestMapping("/products")
	public String searchProducts(@RequestParam(name="q", defaultValue="") String query, 
	    Model model)
	{
		List<Product> products = catalogService.searchProducts(query);
		model.addAttribute("products", products);
		return "products";
	}
	
}
```

Create the Search Results view **products.html** as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
<head>
	<title>Product Search Results</title>
</head>
<body>
	<div layout:fragment="content">
		<div class="single-product-area">
			<div class="zigzag-bottom"></div>
			<div class="container">
				
				<div class="row">
					<div class="woocommerce-info"> 
						<span class="">Product Search Results</span>
					 </div>
					<div class="col-md-3 col-sm-6" th:each="product : ${products}">
						<div class="single-shop-product">
							<div class="product-upper">
								<img src="assets/img/products/2.jpg" alt="" 
										th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"/>
							</div>
							<h2><a href="#" th:href="@{/products/{sku}(sku=${product.sku})}" 
									th:text="${product.name}">Product Name</a></h2>
							<div class="product-carousel-price">
								<ins th:text="${product.price}">$9.00</ins>
							</div>  
							
							<div class="product-option-shop">
								<a class="add_to_cart_button" data-quantity="1" data-product_sku="" data-product_id="70" 
									rel="nofollow" href="#"
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
```

Now try to search by any product name or sku or description and you should be able to see the matching product results.
