---
title: 'JCart : ShoppingCart Add Item To Cart'
author: Siva
type: post
date: 2015-12-31T05:27:23+00:00
url: /jcart-shoppingcart-add-item-to-cart/
categories:
  - Java
tags:
  - jcart

---
In our HomePage/CategoryPage/ProductPage we have a button **Add To Cart** as follows:

```html
<a class="add_to_cart_button" data-quantity="1" 
    data-product_sku="" data-product_id="70" 
	rel="nofollow" href="#"
	th:onclick="'javascript:addItemToCart(\'' + ${product.sku} + '\');'">
	    Add to cart
</a>
```

When customer clicks on **Add To Cart** button it will trigger **addItemToCart(sku)** JavaScript function passing the product SKU value.

Now create **jcart-site/src/main/resources/static/assets/js/app.js** and implement **addItemToCart(sku)** function as follows:

```javascript
function addItemToCart(sku)
{
	$.ajax ({ 
		url: '/cart/items', 
		type: "POST", 
		dataType: "json",
		contentType: "application/json",
		data : '{"sku":"'+ sku +'"}"',
		complete: function(responseData, status, xhttp){
			updateCartItemCount();			
		}
	}); 
}
```

This function triggers an Ajax call to **url '/cart/items'** using jQuery and if it is successful we are calling another JavaScript function **updateCartItemCount()**.

The **updateCartItemCount()** function updates the current Cart Items count in the page header section.

```html
<div class="shopping-item">
	<a href="#" th:href="@{/cart}">Cart <i class="fa fa-shopping-cart"></i> 
	<span id="cart-item-count" class="product-count">(0)</span></a>
</div>
```

```javascript
function updateCartItemCount()
{
	$.ajax ({ 
		url: '/cart/items/count', 
		type: "GET", 
		dataType: "json",
		contentType: "application/json",
		complete: function(responseData, status, xhttp){ 
			$('#cart-item-count').text('('+responseData.responseJSON.count+')');
		}
	});
}
```

The **updateCartItemCount()** function triggers an Ajax call to **url: '/cart/items/count'** to get the current Cart Item count. Once the response is received we are setting the count value.

We need to display the current Cart Item Count on all pages, so let us invoke **updateCartItemCount()** function in **app.js** for all the page load as follows:

```javascript
jQuery(document).ready(function($){
	updateCartItemCount();
});

function updateCartItemCount()
{
	...
}

function updateCartItemCount()
{
	...
}
```

Now let us implement the back-end functionality to handle Cart related operations.

First let us create the model objects to hold **Cart** and **LineItem** data.

```java
public class Cart
{
	private List<LineItem> items;
	private Customer customer;
	private Address deliveryAddress;
	private Payment payment;
	
	public Cart()
	{
		items = new ArrayList<LineItem>();
		customer = new Customer();
		deliveryAddress = new Address();
		payment = new Payment();
	}
	

	public void addItem(Product product)
	{
		for (LineItem lineItem : items)
		{
			if(lineItem.getProduct().getSku().equals(product.getSku())){
				lineItem.setQuantity(lineItem.getQuantity()+1);
				return;
			}
		}
		LineItem item = new LineItem(product, 1);
		this.items.add(item);		
	}
	
	public void updateItemQuantity(Product product, int quantity)
	{
		for (LineItem lineItem : items)
		{
			if(lineItem.getProduct().getSku().equals(product.getSku())){
				lineItem.setQuantity(quantity);
			}
		}
	}
	
	public void removeItem(String sku)
	{
		LineItem  item = null;
		for (LineItem lineItem : items)
		{
			if(lineItem.getProduct().getSku().equals(sku)){
				item = lineItem;
				break;
			}
		}
		if(item != null){
			items.remove(item);
		}
	}
	
	public void clearItems()
	{
		items = new ArrayList<LineItem>();
	}
	
	public int getItemCount()
	{
		int count = 0;
		for (LineItem lineItem : items) {
			count +=  lineItem.getQuantity();
		}
		return count;
	}
		
	public BigDecimal getTotalAmount()
	{
		BigDecimal amount = new BigDecimal("0.0");
		for (LineItem lineItem : items)
		{
			amount = amount.add(lineItem.getSubTotal());
		}
		return amount;
	}
	
	//setters & getters
	
}
```

```java
public class LineItem
{
	private Product product;
	private int quantity;
	
	public LineItem()
	{
	}
	
	public LineItem(Product product, int quantity)
	{
		this.product = product;
		this.quantity = quantity;
	}

	public BigDecimal getSubTotal()
	{
		return product.getPrice().multiply(new BigDecimal(quantity));
	}
	//setters & getters
}
```

We may need to get the current Cart object in one or more Controllers. So let us create a method **getOrCreateCart(HttpServletRequest)** in **JCartSiteBaseController** so that it will be available in all controllers.

```java
public abstract class JCartSiteBaseController
{
	....
	....
	
	protected Cart getOrCreateCart(HttpServletRequest request)
	{
		Cart cart = null;
		cart = (Cart) request.getSession().getAttribute("CART_KEY");
		if(cart == null){
			cart = new Cart();
			request.getSession().setAttribute("CART_KEY", cart);
		}
		return cart;
	}
}
```

Now let us implement the **CartController** as follows:

```java
@Controller
public class CartController extends JCartSiteBaseController
{
	@Autowired
	private CatalogService catalogService;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Cart";
	}
		
	@RequestMapping(value="/cart/items/count", method=RequestMethod.GET)
	@ResponseBody
	public Map<String, Object> getCartItemCount(HttpServletRequest request, 
	                                            Model model)
	{
		Cart cart = getOrCreateCart(request);
		int itemCount = cart.getItemCount();
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("count", itemCount);
		return map;
	}
		
	@RequestMapping(value="/cart/items", method=RequestMethod.POST)
	@ResponseBody
	public void addToCart(@RequestBody Product product, 
	                       HttpServletRequest request)
	{
		Cart cart = getOrCreateCart(request);
		Product p = catalogService.getProductBySku(product.getSku());
		cart.addItem(p);
	}
	
}
```

Now run the application and click on **Add To Cart** in **HomePage**/**CategoryPage**/**ProductPage**, 
the product should be added to **Cart** and the **Cart Item Count** in header should be updated accordingly.
