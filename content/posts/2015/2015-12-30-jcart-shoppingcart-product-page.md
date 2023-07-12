---
title: 'JCart : ShoppingCart Product Page'
author: Siva
type: post
date: 2015-12-30T14:25:35+00:00
url: /jcart-shoppingcart-product-page/
categories:
  - Java
tags:
  - jcart

---
Customers can click on a product to view more details about the product either in Home Page or in Category Page.

Let us implement Controller method to show Product details as follows:

```java
@Controller
public class ProductController extends JCartSiteBaseController
{	
	@Autowired protected CatalogService catalogService;
	
	....
	....
	
	@RequestMapping("/products/{sku}")
	public String product(@PathVariable String sku, Model model)
	{
		Product product = catalogService.getProductBySku(sku);
		model.addAttribute("product", product);
		return "product";
	}
	
}
```

```java
@Service
@Transactional
public class CatalogService 
{
	@Autowired ProductRepository productRepository;
	
	....
	....
	
	public Product getProductBySku(String sku) {
		return productRepository.findBySku(sku);
	}
	
}  
```

```java
public interface ProductRepository extends JpaRepository<Product, Integer> {

	Product findByName(String name);
	Product findBySku(String sku);
}  
```

Now we will create the **product.html** thymeleaf template as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
<head>
	<title>Product</title>
</head>
<body>
<div layout:fragment="content">

<div class="single-product-area">
	<div class="zigzag-bottom"></div>
	<div class="container">
		<div class="row">
			
			<div class="col-md-offset-2 col-md-8">
				<div class="product-content-right">
					<div class="product-breadcroumb">
						<a href="" th:href="@{/}">Home</a>
						<a href="" th:href="@{/categories/{name}(name=${product.category.name})}">
						<span th:text="${product.category.name}">Category Name</span></a>
						<a href="" th:href="@{/products/{sku}(sku=${product.sku})}">
						<span th:text="${product.name}">ProductName</span></a>
					</div>
					
					<div class="row">
						<div class="col-sm-6">
							<div class="product-images">
								<div class="product-main-img">
									<img src="assets/img/product-2.jpg" alt="" 
									th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"/>
								</div>
																	
							</div>
						</div>
						
						<div class="col-sm-6">
							<div class="product-inner">
								<h2 class="product-name" th:text="${product.name}">ProductName</h2>
								<div class="product-inner-price">
									<ins th:text="${product.price}">$9.00</ins>
								</div>    
								
								<div>
									<button class="add_to_cart_button" type="submit" 
											th:onclick="'javascript:addItemToCart(\'' + ${product.sku} + '\');'">Add to cart</button>
								</div>   
								
								<div class="product-inner-category">
									<h2>Product Description</h2>  
									<p th:text="${product.description}">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br/>
									</p>
								</div> 
								
							</div>
						</div>
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

Now we can see the product details when clicked on Product from Home Page or Category Page.
