---
title: 'JCart : View Cart'
author: Siva
type: post
date: 2015-12-31T05:32:11+00:00
url: /jcart-view-cart/
categories:
  - Java
tags:
  - jcart

---
In our earlier post we have implemented **Add To Cart** functionality. In this post we will implement showing the Cart Item details.

In out **mainLayout.html** header we have ShoppingCart icon showing the cart item count as follows:

```html
<div class="shopping-item">
	<a href="#" th:href="@{/cart}">Cart <i class="fa fa-shopping-cart"></i> 
	    <span id="cart-item-count" class="product-count">(0)</span>
	</a>
</div>
```

When customer clicks on Cart icon we will show the Cart details. Let us implement the **&#8220;/cart&#8221;** url handler method in **CartController** as follows:

```java
@Controller
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
}
```

Now let us create thymeleaf view template **cart.html** as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
      <head>
        <title>Cart</title>
    </head>
    <body>
    	<div layout:fragment="content">
    
		    <div class="single-product-area">
		        <div class="zigzag-bottom"></div>
		        <div class="container">
		            <div class="row">
		                <div class="woocommerce-info col-md-offset-2 col-md-8" th:if="${#lists.isEmpty(cart.items)}">
							<h2>Cart is Empty</h2>
						</div>
		                <div class="col-md-offset-2 col-md-8" th:unless="${#lists.isEmpty(cart.items)}">
		                    <div class="product-content-right">
		                        <div class="woocommerce">
		                            <form method="post" action="#">
		                                <table cellspacing="0" class="shop_table cart">
		                                    <thead>
		                                        <tr>
		                                            <th class="product-remove">&nbsp;</th>
		                                            <th class="product-thumbnail">&nbsp;</th>
		                                            <th class="product-name">Product</th>
		                                            <th class="product-price">Price</th>
		                                            <th class="product-quantity">Quantity</th>
		                                            <th class="product-subtotal">Total</th>
		                                        </tr>
		                                    </thead>
		                                    <tbody>
		                                        <tr class="cart_item" th:each="item : ${cart.items}">
		                                            <td class="product-remove">
		                                                <a title="Remove this item" class="remove" href="#" 
		                                                	th:onclick="'javascript:removeItemFromCart( \''+${item.product.sku}+'\');'">×</a> 
		                                            </td>
		
		                                            <td class="product-thumbnail">
		                                                <a href="#" th:href="@{/products/{sku}(sku=${item.product.sku})}">
		                                                	<img width="145" height="145" alt="poster_1_up" 
		                                                	class="shop_thumbnail" src="assets/img/products/2.jpg"
		                                                	th:src="@{'/products/images/{id}.jpg'(id=${item.product.id})}"/>
		                                                </a>
		                                            </td>
		
		                                            <td class="product-name">
		                                                <a href="#" th:href="@{/products/{sku}(sku=${item.product.sku})}"
		                                                	th:text="${item.product.name}">Product name</a> 
		                                            </td>
		
		                                            <td class="product-price">
		                                                <span class="amount" th:text="${item.product.price}">$15.00</span> 
		                                            </td>
		
		                                            <td class="product-quantity">
		                                                <div class="quantity buttons_added">
		                                                	<input type="text" size="5" value="1" th:value="${item.quantity}" 
		                                                			th:onchange="'javascript:updateCartItemQuantity( \''+${item.product.sku}+'\' , '+this.value+');'"/>                                                   
		                                                </div>
		                                            </td>
		
		                                            <td class="product-subtotal">
		                                                <span class="amount" th:text="${item.product.price * item.quantity}">$150.00</span> 
		                                            </td>
		                                        </tr>
		                                        <tr>
		                                            <td class="actions" colspan="6">
		                                                <a class="add_to_cart_button" href="#" th:href="@{/checkout}">CHECKOUT</a>
		                                            </td>
		                                        </tr>
		                                    </tbody>
		                                </table>
		                            </form>
		
		                            <div class="cart-collaterals">
					                     <div class="cart_totals ">
		                                <h2>Cart Totals</h2>
		
		                                <table cellspacing="0">
		                                    <tbody>
		                                        <tr class="cart-subtotal">
		                                            <th>Cart Subtotal</th>
		                                            <td><span class="amount" th:text="${cart.totalAmount}">$15.00</span></td>
		                                        </tr>
		
		                                        <tr class="shipping">
		                                            <th>Shipping and Handling</th>
		                                            <td>Free Shipping</td>
		                                        </tr>
		
		                                        <tr class="order-total">
		                                            <th>Order Total</th>
		                                            <td><strong><span class="amount" th:text="${cart.totalAmount}">$15.00</span></strong> </td>
		                                        </tr>
		                                    </tbody>
		                                </table>
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

Now run the application and add items to cart and click on Cart Icon which should display Cart page with all the Cart item details.

Observe that we have already added HTML markup and JavaScript function calls to update the Item quantity and removing an item. We will implement these functionalities in a moment.

Let us add the following two JavaScript functions to update item count and remove items.

```javascript
function updateCartItemQuantity(sku, quantity)
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
}
```

Next we will implement the **CartController** handler methods as follows:

```java
@Controller
public class CartController extends JCartSiteBaseController
{
	...
	...
	
	@RequestMapping(value="/cart/items", method=RequestMethod.PUT)
	@ResponseBody
	public void updateCartItem(@RequestBody LineItem item, 
	                            HttpServletRequest request, 
	                            HttpServletResponse response)
	{
		Cart cart = getOrCreateCart(request);
		if(item.getQuantity() <= 0){
			String sku = item.getProduct().getSku();
			cart.removeItem(sku);
		} else {
			cart.updateItemQuantity(item.getProduct(), item.getQuantity());
		}
	}
	
	@RequestMapping(value="/cart/items/{sku}", method=RequestMethod.DELETE)
	@ResponseBody
	public void removeCartItem(@PathVariable("sku") String sku, 
	                            HttpServletRequest request)
	{
		Cart cart = getOrCreateCart(request);
		cart.removeItem(sku);
	}

}
```

Now that we have completed all the Cart related usecases. In our next post we will see how to implement Checkout functionality.
