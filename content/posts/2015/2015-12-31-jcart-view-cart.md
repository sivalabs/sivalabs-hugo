---
title: 'JCart : View Cart'
author: Siva
type: post
date: 2015-12-31T05:32:11+00:00
url: /2015/12/jcart-view-cart/
post_views_count:
  - 3
categories:
  - Java
tags:
  - jcart

---
In our earlier post we have implemented **Add To Cart** functionality. In this post we will implement showing the Cart Item details.

In out **mainLayout.html** header we have ShoppingCart icon showing the cart item count as follows:

<pre class="lang:xhtml decode:true ">&lt;div class="shopping-item"&gt;
	&lt;a href="#" th:href="@{/cart}"&gt;Cart &lt;i class="fa fa-shopping-cart"&gt;&lt;/i&gt; &lt;span id="cart-item-count" class="product-count"&gt;(0)&lt;/span&gt;&lt;/a&gt;
&lt;/div&gt;</pre>

When customer clicks on Cart icon we will show the Cart details. Let us implement the **&#8220;/cart&#8221;** url handler method in **CartController** as follows:

<pre class="lang:java decode:true ">@Controller
public class CartController extends JCartSiteBaseController
{
	....
	
	@RequestMapping(value="/cart", method=RequestMethod.GET)
	public String showCart(HttpServletRequest request, Model model)
	{
		Cart cart = getOrCreateCart(request);
		model.addAttribute("cart", cart);
		return "cart";
	}
}</pre>

Now let us create thymeleaf view template **cart.html** as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
      &lt;head&gt;
        &lt;title&gt;Cart&lt;/title&gt;
    &lt;/head&gt;
    &lt;body&gt;
    	&lt;div layout:fragment="content"&gt;
    
		    &lt;div class="single-product-area"&gt;
		        &lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
		        &lt;div class="container"&gt;
		            &lt;div class="row"&gt;
		                &lt;div class="woocommerce-info col-md-offset-2 col-md-8" th:if="${#lists.isEmpty(cart.items)}"&gt;
							&lt;h2&gt;Cart is Empty&lt;/h2&gt;
						&lt;/div&gt;
		                &lt;div class="col-md-offset-2 col-md-8" th:unless="${#lists.isEmpty(cart.items)}"&gt;
		                    &lt;div class="product-content-right"&gt;
		                        &lt;div class="woocommerce"&gt;
		                            &lt;form method="post" action="#"&gt;
		                                &lt;table cellspacing="0" class="shop_table cart"&gt;
		                                    &lt;thead&gt;
		                                        &lt;tr&gt;
		                                            &lt;th class="product-remove"&gt;&nbsp;&lt;/th&gt;
		                                            &lt;th class="product-thumbnail"&gt;&nbsp;&lt;/th&gt;
		                                            &lt;th class="product-name"&gt;Product&lt;/th&gt;
		                                            &lt;th class="product-price"&gt;Price&lt;/th&gt;
		                                            &lt;th class="product-quantity"&gt;Quantity&lt;/th&gt;
		                                            &lt;th class="product-subtotal"&gt;Total&lt;/th&gt;
		                                        &lt;/tr&gt;
		                                    &lt;/thead&gt;
		                                    &lt;tbody&gt;
		                                        &lt;tr class="cart_item" th:each="item : ${cart.items}"&gt;
		                                            &lt;td class="product-remove"&gt;
		                                                &lt;a title="Remove this item" class="remove" href="#" 
		                                                	th:onclick="'javascript:removeItemFromCart( \''+${item.product.sku}+'\');'"&gt;×&lt;/a&gt; 
		                                            &lt;/td&gt;
		
		                                            &lt;td class="product-thumbnail"&gt;
		                                                &lt;a href="#" th:href="@{/products/{sku}(sku=${item.product.sku})}"&gt;
		                                                	&lt;img width="145" height="145" alt="poster_1_up" 
		                                                	class="shop_thumbnail" src="assets/img/products/2.jpg"
		                                                	th:src="@{'/products/images/{id}.jpg'(id=${item.product.id})}"/&gt;
		                                                &lt;/a&gt;
		                                            &lt;/td&gt;
		
		                                            &lt;td class="product-name"&gt;
		                                                &lt;a href="#" th:href="@{/products/{sku}(sku=${item.product.sku})}"
		                                                	th:text="${item.product.name}"&gt;Product name&lt;/a&gt; 
		                                            &lt;/td&gt;
		
		                                            &lt;td class="product-price"&gt;
		                                                &lt;span class="amount" th:text="${item.product.price}"&gt;$15.00&lt;/span&gt; 
		                                            &lt;/td&gt;
		
		                                            &lt;td class="product-quantity"&gt;
		                                                &lt;div class="quantity buttons_added"&gt;
		                                                	&lt;input type="text" size="5" value="1" th:value="${item.quantity}" 
		                                                			th:onchange="'javascript:updateCartItemQuantity( \''+${item.product.sku}+'\' , '+this.value+');'"/&gt;                                                   
		                                                &lt;/div&gt;
		                                            &lt;/td&gt;
		
		                                            &lt;td class="product-subtotal"&gt;
		                                                &lt;span class="amount" th:text="${item.product.price * item.quantity}"&gt;$150.00&lt;/span&gt; 
		                                            &lt;/td&gt;
		                                        &lt;/tr&gt;
		                                        &lt;tr&gt;
		                                            &lt;td class="actions" colspan="6"&gt;
		                                                &lt;a class="add_to_cart_button" href="#" th:href="@{/checkout}"&gt;CHECKOUT&lt;/a&gt;
		                                            &lt;/td&gt;
		                                        &lt;/tr&gt;
		                                    &lt;/tbody&gt;
		                                &lt;/table&gt;
		                            &lt;/form&gt;
		
		                            &lt;div class="cart-collaterals"&gt;
					                     &lt;div class="cart_totals "&gt;
		                                &lt;h2&gt;Cart Totals&lt;/h2&gt;
		
		                                &lt;table cellspacing="0"&gt;
		                                    &lt;tbody&gt;
		                                        &lt;tr class="cart-subtotal"&gt;
		                                            &lt;th&gt;Cart Subtotal&lt;/th&gt;
		                                            &lt;td&gt;&lt;span class="amount" th:text="${cart.totalAmount}"&gt;$15.00&lt;/span&gt;&lt;/td&gt;
		                                        &lt;/tr&gt;
		
		                                        &lt;tr class="shipping"&gt;
		                                            &lt;th&gt;Shipping and Handling&lt;/th&gt;
		                                            &lt;td&gt;Free Shipping&lt;/td&gt;
		                                        &lt;/tr&gt;
		
		                                        &lt;tr class="order-total"&gt;
		                                            &lt;th&gt;Order Total&lt;/th&gt;
		                                            &lt;td&gt;&lt;strong&gt;&lt;span class="amount" th:text="${cart.totalAmount}"&gt;$15.00&lt;/span&gt;&lt;/strong&gt; &lt;/td&gt;
		                                        &lt;/tr&gt;
		                                    &lt;/tbody&gt;
		                                &lt;/table&gt;
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

Now run the application and add items to cart and click on Cart Icon which should display Cart page with all the Cart item details.

Observe that we have already added HTML markup and JavaScript function calls to update the Item quantity and removing an item. We will implement these functionalities in a moment.

Let us add the following two JavaScript functions to update item count and remove items.

<pre class="lang:js decode:true ">function updateCartItemQuantity(sku, quantity)
{
	$.ajax ({ 
		url: '/cart/items', 
		type: "PUT", 
		dataType: "json",
		contentType: "application/json",
		data : '{ "product" :{ "sku":"'+ sku +'"},"quantity":"'+quantity+'"}',
		complete: function(responseData, status, xhttp){ 
			updateCartItemCount();        	
			location.href = '/cart' 
		}
	});
}

function removeItemFromCart(sku)
{
	$.ajax ({ 
		url: '/cart/items/'+sku, 
		type: "DELETE", 
		dataType: "json",
		contentType: "application/json",
		complete: function(responseData, status, xhttp){ 
			updateCartItemCount();
			location.href = '/cart' 
		}
	});
}</pre>

Next we will implement the **CartController** handler methods as follows:

<pre class="lang:java decode:true ">@Controller
public class CartController extends JCartSiteBaseController
{
	...
	...
	
	@RequestMapping(value="/cart/items", method=RequestMethod.PUT)
	@ResponseBody
	public void updateCartItem(@RequestBody LineItem item, HttpServletRequest request, HttpServletResponse response)
	{
		Cart cart = getOrCreateCart(request);
		if(item.getQuantity() &lt;= 0){
			String sku = item.getProduct().getSku();
			cart.removeItem(sku);
		} else {
			cart.updateItemQuantity(item.getProduct(), item.getQuantity());
		}
	}
	
	@RequestMapping(value="/cart/items/{sku}", method=RequestMethod.DELETE)
	@ResponseBody
	public void removeCartItem(@PathVariable("sku") String sku, HttpServletRequest request)
	{
		Cart cart = getOrCreateCart(request);
		cart.removeItem(sku);
	}

}</pre>

Now that we have completed all the Cart related usecases. In our next post we will see how to implement Checkout functionality.