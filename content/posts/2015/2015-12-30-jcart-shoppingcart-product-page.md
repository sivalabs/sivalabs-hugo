---
title: 'JCart : ShoppingCart Product Page'
author: Siva
type: post
date: 2015-12-30T14:25:35+00:00
url: /2015/12/jcart-shoppingcart-product-page/
post_views_count:
  - 3
categories:
  - Java
tags:
  - jcart

---
Customers can click on a product to view more details about the product either in Home Page or in Category Page.

Let us implement Controller method to show Product details as follows:

<pre class="lang:java decode:true ">@Controller
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
	
}</pre>

<pre class="lang:java decode:true ">@Service
@Transactional
public class CatalogService 
{
	@Autowired ProductRepository productRepository;
	
	....
	....
	
	public Product getProductBySku(String sku) {
		return productRepository.findBySku(sku);
	}
	
}</pre>

<pre class="lang:java decode:true ">public interface ProductRepository extends JpaRepository&lt;Product, Integer&gt; {

	Product findByName(String name);
	Product findBySku(String sku);
}</pre>

Now we will create the **product.html** thymeleaf template as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
&lt;head&gt;
	&lt;title&gt;Product&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
&lt;div layout:fragment="content"&gt;

&lt;div class="single-product-area"&gt;
	&lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
	&lt;div class="container"&gt;
		&lt;div class="row"&gt;
			
			&lt;div class="col-md-offset-2 col-md-8"&gt;
				&lt;div class="product-content-right"&gt;
					&lt;div class="product-breadcroumb"&gt;
						&lt;a href="" th:href="@{/}"&gt;Home&lt;/a&gt;
						&lt;a href="" th:href="@{/categories/{name}(name=${product.category.name})}"&gt;
						&lt;span th:text="${product.category.name}"&gt;Category Name&lt;/span&gt;&lt;/a&gt;
						&lt;a href="" th:href="@{/products/{sku}(sku=${product.sku})}"&gt;
						&lt;span th:text="${product.name}"&gt;ProductName&lt;/span&gt;&lt;/a&gt;
					&lt;/div&gt;
					
					&lt;div class="row"&gt;
						&lt;div class="col-sm-6"&gt;
							&lt;div class="product-images"&gt;
								&lt;div class="product-main-img"&gt;
									&lt;img src="assets/img/product-2.jpg" alt="" 
									th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"/&gt;
								&lt;/div&gt;
																	
							&lt;/div&gt;
						&lt;/div&gt;
						
						&lt;div class="col-sm-6"&gt;
							&lt;div class="product-inner"&gt;
								&lt;h2 class="product-name" th:text="${product.name}"&gt;ProductName&lt;/h2&gt;
								&lt;div class="product-inner-price"&gt;
									&lt;ins th:text="${product.price}"&gt;$9.00&lt;/ins&gt;
								&lt;/div&gt;    
								
								&lt;div&gt;
									&lt;button class="add_to_cart_button" type="submit" 
											th:onclick="'javascript:addItemToCart(\'' + ${product.sku} + '\');'"&gt;Add to cart&lt;/button&gt;
								&lt;/div&gt;   
								
								&lt;div class="product-inner-category"&gt;
									&lt;h2&gt;Product Description&lt;/h2&gt;  
									&lt;p th:text="${product.description}"&gt;
										Lorem ipsum dolor sit amet, consectetur adipiscing elit.&lt;br/&gt;
									&lt;/p&gt;
								&lt;/div&gt; 
								
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					
				&lt;/div&gt;                    
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
&lt;/div&gt;

&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

Now we can see the product details when clicked on Product from Home Page or Category Page.