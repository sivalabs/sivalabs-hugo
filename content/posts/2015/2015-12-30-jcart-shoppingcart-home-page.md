---
title: 'JCart : ShoppingCart Home Page'
author: Siva
type: post
date: 2015-12-30T14:20:00+00:00
url: /2015/12/jcart-shoppingcart-home-page/
post_views_count:
  - 13
categories:
  - Java
tags:
  - jcart

---
In our Home page we will show all the categories along with few of the products in each Category.
  
Let us update **HomeController** with two methods to show all the categories and the selected category products.

<pre class="lang:java decode:true ">@Controller
public class HomeController extends JCartSiteBaseController
{	
	
	@Autowired 
	protected CatalogService catalogService;
	
	@RequestMapping("/home")
	public String home(Model model)
	{
		List&lt;Category&gt; previewCategories = new ArrayList&lt;&gt;();
		List&lt;Category&gt; categories = catalogService.getAllCategories();
		for (Category category : categories)
		{
			Set&lt;Product&gt; products = category.getProducts();
			Set&lt;Product&gt; previewProducts = new HashSet&lt;&gt;();
			int noOfProductsToDisplay = 4;
			if(products.size() &gt; noOfProductsToDisplay){
				Iterator&lt;Product&gt; iterator = products.iterator();
				for (int i = 0; i &lt; noOfProductsToDisplay; i++)
				{
					previewProducts.add(iterator.next());
				}
			} else {
				previewProducts.addAll(products);
			}	
			category.setProducts(previewProducts);
			previewCategories.add(category);
		}
		model.addAttribute("categories", previewCategories);
		return "home";
	}
	
	@RequestMapping("/categories/{name}")
	public String category(@PathVariable String name, Model model)
	{
		Category category = catalogService.getCategoryByName(name);
		model.addAttribute("category", category);
		return "category";
	}
	
}</pre>

Now let us update the home page template **home.html** to render category details.

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;      
      &lt;head&gt;
        &lt;title&gt;Home&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
    	&lt;div layout:fragment="content"&gt;
    		&lt;div class="single-product-area"&gt;
		        &lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
		        &lt;div class="container"&gt;
		        	
		            &lt;div class="row" th:each="cat : ${categories}"&gt;
		            	&lt;div class="woocommerce-info"&gt; 
		            		&lt;a class="" th:href="@{/categories/{name}(name=${cat.name})}" 
		            			th:text="${'Category: '+cat.name}"&gt;Category Name&lt;/a&gt;
		                 &lt;/div&gt;
		                &lt;div class="col-md-3 col-sm-6" th:each="product : ${cat.products}"&gt;
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
    
&lt;/html&gt;</pre>

In the above **home.html** template we are using some of the URLs for which we haven&#8217;t implemented the handlers.

For example,
  
To display the product image : **th:src=&#8221;@{&#8216;/products/images/{id}.jpg'(id=${product.id})}&#8221;**
  
To show product details : **th:href=&#8221;@{/products/{sku}(sku=${product.sku})}&#8221;**
  
To add the product to Cart : **th:onclick=&#8221;&#8216;javascript:addItemToCart(\&#8221; + ${product.sku} + &#8216;\&#8217;);'&#8221;**

Let us implement the handler for displaying product image.

Create **ProductController.java** as follows:

<pre class="lang:java decode:true ">@Controller
public class ProductController extends JCartSiteBaseController
{	
	@Override
	protected String getHeaderTitle()
	{
		return "Product";
	}	
	
	@RequestMapping(value="/products/images/{productId}", method=RequestMethod.GET)
	public void showProductImage(@PathVariable String productId, HttpServletRequest request, HttpServletResponse response) {
		try {
			//WebUtils.IMAGES_DIR = "D:/jcart/products/";
			FileSystemResource file = new FileSystemResource(WebUtils.IMAGES_DIR +productId+".jpg");     
			response.setContentType("image/jpg");
			org.apache.commons.io.IOUtils.copy(file.getInputStream(), response.getOutputStream());
			response.flushBuffer();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}</pre>

> Copy the sample product images from **jcart-site/src/main/resources/static/assets/img/products** folder into the path **WebUtils.IMAGES_DIR(D:/jcart/products/**).

Now we should be able to see the Home page with all the categories and 4 products for each category.

In our next post we will implement the Category Page which shows all the products in the selected Category.