---
title: 'JCart : ShoppingCart Home Page'
author: Siva
type: post
date: 2015-12-30T14:20:00+00:00
url: /jcart-shoppingcart-home-page/
categories:
  - Java
tags:
  - jcart

---
In our Home page we will show all the categories along with few of the products in each Category.
  
Let us update **HomeController** with two methods to show all the categories and the selected category products.

```java
@Controller
public class HomeController extends JCartSiteBaseController
{	
	
	@Autowired 
	protected CatalogService catalogService;
	
	@RequestMapping("/home")
	public String home(Model model)
	{
		List<Category> previewCategories = new ArrayList<>();
		List<Category> categories = catalogService.getAllCategories();
		for (Category category : categories)
		{
			Set<Product> products = category.getProducts();
			Set<Product> previewProducts = new HashSet<>();
			int noOfProductsToDisplay = 4;
			if(products.size() > noOfProductsToDisplay){
				Iterator<Product> iterator = products.iterator();
				for (int i = 0; i < noOfProductsToDisplay; i++)
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
	
}
```

Now let us update the home page template **home.html** to render category details.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">      
      <head>
        <title>Home</title>
    </head>
    <body>
    	<div layout:fragment="content">
    		<div class="single-product-area">
		        <div class="zigzag-bottom"></div>
		        <div class="container">
		        	
		            <div class="row" th:each="cat : ${categories}">
		            	<div class="woocommerce-info"> 
		            		<a class="" th:href="@{/categories/{name}(name=${cat.name})}" 
		            			th:text="${'Category: '+cat.name}">Category Name</a>
		                 </div>
		                <div class="col-md-3 col-sm-6" th:each="product : ${cat.products}">
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

In the above **home.html** template we are using some of the URLs for which we haven't implemented the handlers.

For example,
  
To display the product image : **th:src="@{'/products/images/{id}.jpg'(id=${product.id})}"**
  
To show product details : **th:href="@{/products/{sku}(sku=${product.sku})}"**
  
To add the product to Cart : **th:onclick="'javascript:addItemToCart(\" + ${product.sku} + '\');'"**

Let us implement the handler for displaying product image.

Create **ProductController.java** as follows:

```java
@Controller
public class ProductController extends JCartSiteBaseController
{	
	@Override
	protected String getHeaderTitle()
	{
		return "Product";
	}	
	
	@RequestMapping(value="/products/images/{productId}", method=RequestMethod.GET)
	public void showProductImage(@PathVariable String productId, 
	                              HttpServletRequest request, 
	                              HttpServletResponse response) {
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
}
```

Copy the sample product images from **jcart-site/src/main/resources/static/assets/img/products** folder into the path **WebUtils.IMAGES_DIR(D:/jcart/products/**).

Now we should be able to see the Home page with all the categories and 4 products for each category.

In our next post we will implement the Category Page which shows all the products in the selected Category.
