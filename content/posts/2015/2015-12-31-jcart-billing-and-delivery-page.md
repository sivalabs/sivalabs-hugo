---
title: 'JCart : Billing and Delivery Page'
author: Siva
type: post
date: 2015-12-31T07:40:14+00:00
url: /2015/12/jcart-billing-and-delivery-page/
post_views_count:
  - 3
categories:
  - Java
tags:
  - jcart

---
Once the customer reviewed his cart items details and clicks on Checkout we should display Billing & Delivery page where customer enters delivery address details, payment details etc and place the order.

Let us create a **OrderDTO.java** as follows:

```java
public class OrderDTO implements Serializable
{
	private static final long serialVersionUID = 1L;

	@NotEmpty(message="FirstName is required")
	private String firstName;
	@NotEmpty(message="LastName is required")
	private String lastName;
	@NotEmpty(message="EmailId is required")
	@Email
	private String emailId;
	@NotEmpty(message="Phone is required")
	private String phone;
	
	@NotEmpty(message="Address Line1 is required")
	private String addressLine1;
	private String addressLine2;
	@NotEmpty(message="City is required")
	private String city;
	@NotEmpty(message="State is required")
	private String state;
	@NotEmpty(message="ZipCode is required")
	private String zipCode;
	@NotEmpty(message="Country is required")
	private String country;
	
	@NotEmpty(message="FirstName is required")
	private String billingFirstName;
	@NotEmpty(message="LastName is required")
	private String billingLastName;
	@NotEmpty(message="Address Line1 is required")
	private String billingAddressLine1;
	private String billingAddressLine2;
	@NotEmpty(message="City is required")
	private String billingCity;
	@NotEmpty(message="State is required")
	private String billingState;
	@NotEmpty(message="ZipCode is required")
	private String billingZipCode;
	@NotEmpty(message="Country is required")
	private String billingCountry;
	
	@NotEmpty(message="Credit Card Number is required")
	private String ccNumber;
	@NotEmpty(message="CVV is required")
	private String cvv;
	
	//setters & getters
}
```

Create **CheckoutController** to display the Billing & Delivery page as follows:

```java
@Controller
public class CheckoutController extends JCartSiteBaseController
{

	@Override
	protected String getHeaderTitle()
	{
		return "Checkout";
	}

	@RequestMapping(value="/checkout", method=RequestMethod.GET)
	public String checkout(HttpServletRequest request, Model model)
	{
		OrderDTO order = new OrderDTO();
		model.addAttribute("order", order);
		Cart cart = getOrCreateCart(request);
		model.addAttribute("cart", cart);
		return "checkout";
	}
}
```

Finally create the **checkout.html** view as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
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
										
					<h3 id="order_review_heading">Your order</h3>

					<div id="order_review" style="position: relative;">
						<table class="shop_table">
							<thead>
								<tr>
									<th class="product-name">Product</th>
									<th class="product-total">Total</th>
								</tr>
							</thead>
							<tbody>
								<tr class="cart_item" th:each="item : ${cart.items}">
									<td class="product-name" >
										<span th:text="${item.product.name}" >Product Name </span> 
										<strong class="product-quantity" th:text="'× '+${item.quantity}">× 1</strong> </td>
									<td class="product-total">
										<span class="amount" th:text="${item.product.price * item.quantity}">£15.00</span> </td>
								</tr>
							</tbody>
							<tfoot>
								<tr class="cart-subtotal">
									<th>Cart Subtotal</th>
									<td><span class="amount" th:text="${cart.totalAmount}">£15.00</span>
									</td>
								</tr>
								<tr class="shipping">
									<th>Shipping and Handling</th>
									<td>

										Free Shipping
										<input type="hidden" class="shipping_method" value="free_shipping" id="shipping_method_0" data-index="0" name="shipping_method[0]"/>
									</td>
								</tr>

								<tr class="order-total">
									<th>Order Total</th>
									<td><strong><span class="amount" th:text="${cart.totalAmount}">£15.00</span></strong> </td>
								</tr>
							</tfoot>
						</table>
					</div>
					
				<form action="#" th:action="@{/orders}" class="checkout" method="post" th:object="${order}">

					<div id="customer_details" class="col2-set">
						<div class="col-1">
							<div class="woocommerce-billing-fields">
								<h3>Billing Details</h3>

								<p id="billing_first_name_field" class="form-row form-row-first validate-required">
									<label class="" for="billing_first_name">First Name <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="" th:field="*{billingFirstName}" class="input-text "/>
									<p th:if="${#fields.hasErrors('billingFirstName')}" th:errors="*{billingFirstName}" th:errorclass="text-danger">Incorrect firstName</p>
								</p>

								<p id="billing_last_name_field" class="form-row form-row-last validate-required">
									<label class="" for="billing_last_name">Last Name <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="" th:field="*{billingLastName}" class="input-text "/>
									<p th:if="${#fields.hasErrors('billingLastName')}" 
										th:errors="*{billingLastName}" th:errorclass="text-danger">Incorrect lastName</p>
								</p>
								<p id="billing_email_field" class="form-row form-row-first validate-required validate-email">
									<label class="" for="billing_email">Email Address <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="" th:field="*{emailId}" class="input-text "/>
									<p th:if="${#fields.hasErrors('emailId')}" 
										th:errors="*{emailId}" th:errorclass="text-danger">Incorrect emailId</p>
								</p>

								<p id="billing_phone_field" class="form-row form-row-last validate-required validate-phone">
									<label class="" for="billing_phone">Phone <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="" th:field="*{phone}"  class="input-text "/>
									<p th:if="${#fields.hasErrors('phone')}" 
										th:errors="*{phone}" th:errorclass="text-danger">Incorrect phone</p>
								</p>
								<div class="clear"></div>
								
								<p id="billing_address_1_field" class="form-row form-row-wide address-field validate-required">
									<label class="" for="billing_address_1">Address <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="Street address" th:field="*{billingAddressLine1}" class="input-text "/>
									<p th:if="${#fields.hasErrors('billingAddressLine1')}" th:errors="*{billingAddressLine1}" th:errorclass="text-danger">Incorrect addressLine1</p>
								</p>

								<p id="billing_address_2_field" class="form-row form-row-wide address-field">
									<input type="text" value="" placeholder="Apartment, suite, unit etc. (optional)" th:field="*{billingAddressLine2}"  class="input-text "/>
									<p th:if="${#fields.hasErrors('billingAddressLine2')}" th:errors="*{billingAddressLine2}" th:errorclass="text-danger">Incorrect addressLine2</p>
								</p>

								<p id="billing_city_field" class="form-row form-row-wide address-field validate-required" data-o_class="form-row form-row-wide address-field validate-required">
									<label class="" for="billing_city">Town / City <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="Town / City" th:field="*{billingCity}" class="input-text "/>
									<p th:if="${#fields.hasErrors('billingCity')}" th:errors="*{billingCity}" th:errorclass="text-danger">Incorrect city</p>
								</p>

								<p id="billing_state_field" class="form-row form-row-first address-field validate-state" data-o_class="form-row form-row-first address-field validate-state">
									<label class="" for="billing_state">State</label>
									<input type="text" th:field="*{billingState}" placeholder="State / County" value="" class="input-text "/>
									<p th:if="${#fields.hasErrors('billingState')}" th:errors="*{billingState}" th:errorclass="text-danger">Incorrect state</p>
								</p>
								<p id="billing_postcode_field" class="form-row form-row-last address-field validate-required validate-postcode" data-o_class="form-row form-row-last address-field validate-required validate-postcode">
									<label class="" for="billing_postcode">Zip Code <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" value="" placeholder="Postcode / Zip" th:field="*{billingZipCode}" class="input-text "/>
									<p th:if="${#fields.hasErrors('billingZipCode')}" th:errors="*{billingZipCode}" th:errorclass="text-danger">Incorrect zipCode</p>
								</p>
								<p id="billing_country_field" class="form-row form-row-wide address-field update_totals_on_change validate-required woocommerce-validated">
									<label class="" for="billing_country">Country <abbr title="required" class="required">*</abbr>
									</label>
									<select class="country_to_state country_select" th:field="*{billingCountry}">                                                    
										<option value="IN">India</option>
									</select>
								</p>
								<div class="clear"></div>                                            
							</div>
						</div>

						<div class="col-2">
							<div class="woocommerce-shipping-fields">
								<h3 id="ship-to-different-address">
									<label class="checkbox" for="ship-to-different-address-checkbox">Ship to same address?</label>
									<input type="checkbox" value="1" name="ship_to_different_address" checked="checked" 
											class="input-checkbox" id="ship-to-different-address-checkbox"/>
								</h3>
								<div class="shipping_address" style="display: block;">                                                

									<p id="shipping_first_name_field" class="form-row form-row-first validate-required">
										<label class="" for="shipping_first_name">First Name <abbr title="required" class="required">*</abbr>
										</label>
										<input type="text" value="" placeholder="" th:field="*{firstName}" class="input-text "/>
										<p th:if="${#fields.hasErrors('firstName')}" th:errors="*{firstName}" th:errorclass="text-danger">Incorrect firstName</p>
									</p>

									<p id="shipping_last_name_field" class="form-row form-row-last validate-required">
										<label class="" for="shipping_last_name">Last Name <abbr title="required" class="required">*</abbr>
										</label>
										<input type="text" value="" placeholder="" th:field="*{lastName}" class="input-text "/>
										<p th:if="${#fields.hasErrors('lastName')}" 
											th:errors="*{lastName}" th:errorclass="text-danger">Incorrect lastName</p>
									</p>
									<div class="clear"></div>

									<p id="shipping_address_1_field" class="form-row form-row-wide address-field validate-required">
										<label class="" for="shipping_address_1">Address <abbr title="required" class="required">*</abbr>
										</label>
										<input type="text" value="" placeholder="Street address" th:field="*{addressLine1}"  class="input-text "/>
										<p th:if="${#fields.hasErrors('addressLine1')}" th:errors="*{addressLine1}" th:errorclass="text-danger">Incorrect addressLine1</p>
									</p>

									<p id="shipping_address_2_field" class="form-row form-row-wide address-field">
										<input type="text" value="" placeholder="Apartment, suite, unit etc. (optional)" th:field="*{addressLine2}" class="input-text "/>
										<p th:if="${#fields.hasErrors('addressLine2')}" th:errors="*{addressLine2}" th:errorclass="text-danger">Incorrect addressLine2</p>
									</p>

									<p id="shipping_city_field" class="form-row form-row-wide address-field validate-required" data-o_class="form-row form-row-wide address-field validate-required">
										<label class="" for="shipping_city">City <abbr title="required" class="required">*</abbr>
										</label>
										<input type="text" value="" placeholder="Town / City" th:field="*{city}" class="input-text "/>
										<p th:if="${#fields.hasErrors('city')}" th:errors="*{city}" th:errorclass="text-danger">Incorrect city</p>
									</p>

									<p id="shipping_state_field" class="form-row form-row-first address-field validate-state" data-o_class="form-row form-row-first address-field validate-state">
										<label class="" for="shipping_state">State</label>
										<input type="text" th:field="*{state}" placeholder="State / County" value="" class="input-text "/>
										<p th:if="${#fields.hasErrors('state')}" th:errors="*{state}" th:errorclass="text-danger">Incorrect state</p>
									</p>
									<p id="shipping_postcode_field" class="form-row form-row-last address-field validate-required validate-postcode" data-o_class="form-row form-row-last address-field validate-required validate-postcode">
										<label class="" for="shipping_postcode">Zip Code <abbr title="required" class="required">*</abbr>
										</label>
										<input type="text" value="" placeholder="Postcode / Zip" th:field="*{zipCode}" class="input-text "/>
										<p th:if="${#fields.hasErrors('zipCode')}" th:errors="*{zipCode}" th:errorclass="text-danger">Incorrect zipCode</p>
									</p>
									<p id="shipping_country_field" class="form-row form-row-wide address-field update_totals_on_change validate-required woocommerce-validated">
										<label class="" for="shipping_country">Country <abbr title="required" class="required">*</abbr>
										</label>
										<select class="country_to_state country_select" th:field="*{country}" >
											<option value="IN">India</option>
										</select>
									</p>
									<div class="clear"></div>
								</div>
							</div>
						</div>
					</div>                                
					<div id="customer_details" class="col2-set">
						<div class="col-1">
							<div class="woocommerce-billing-fields">
								<h3>Payment Details</h3>

								<p id="cc_number" class="form-row form-row-first validate-required">
									<label class="" for="cc_number">Credit Card Number <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" th:field="*{ccNumber}" class="input-text "/>
									<p th:if="${#fields.hasErrors('ccNumber')}" th:errors="*{ccNumber}" th:errorclass="text-danger">Invalid Credit Card</p>
								</p>
								
								<p id="cc_cvv" class="form-row form-row-first validate-required">
									<label class="" for="cc_cvv">CCV <abbr title="required" class="required">*</abbr>
									</label>
									<input type="text" th:field="*{cvv}" class="input-text "/>
									<p th:if="${#fields.hasErrors('cvv')}" th:errors="*{cvv}" th:errorclass="text-danger">Invalid CVV</p>
								</p>
								<p id="payment_expiry_date" class="form-row form-row-wide validate-required woocommerce-validated">
									<label class="" for="shipping_country">Expiry Date <abbr title="required" class="required">*</abbr></label>
									<div style="display: inline;">
									<select style="width: 25%">
										<option value="2015">2015</option>
										<option value="2016">2016</option>
										<option value="2017">2017</option>
										<option value="2018">2018</option>
									</select>
									
									<select style="width: 25%">
										<option value="1">Jan</option>
										<option value="2">Feb</option>
										<option value="3">Mar</option>
										<option value="4">Apr</option>
									</select>
									</div>
								</p>
								
							</div>
						</div>
				   </div>

					<div id="payment">
							
						 <div class="form-row place-order">
							 <input type="submit" data-value="Place order" value="Place order" id="place_order" name="woocommerce_checkout_place_order" class="button alt"/>
						 </div>

						 <div class="clear"></div>

				  </div>
				</form>

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

Next we need to implement the back-end services for Order related operations.

```java
public interface OrderRepository extends JpaRepository<Order, Integer>
{
	Order findByOrderNumber(String orderNumber);
}
```

```java
@Service
@Transactional
public class OrderService
{	
	@Autowired OrderRepository orderRepository;
	
	public Order createOrder(Order order)
	{
		order.setOrderNumber(String.valueOf(System.currentTimeMillis()));
		Order savedOrder = orderRepository.save(order);
		return savedOrder;
	}
	
	public Order getOrder(String orderNumber)
	{
		return orderRepository.findByOrderNumber(orderNumber);
	}

}
```

```java
@Controller
public class OrderController extends JCartSiteBaseController
{

	@Autowired private CustomerService customerService;
	@Autowired protected OrderService orderService;
	@Autowired protected EmailService emailService;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Order";
	}

	@RequestMapping(value="/orders", method=RequestMethod.POST)
	public String placeOrder(@Valid @ModelAttribute("order") OrderDTO order, 
			BindingResult result, Model model, HttpServletRequest request)
	{
		Cart cart = getOrCreateCart(request);
		if (result.hasErrors()) {
			model.addAttribute("cart", cart);
			return "checkout";
        }
		
		Order newOrder = new Order();
		
		String email = getCurrentUser().getCustomer().getEmail();
		Customer customer = customerService.getCustomerByEmail(email);
		newOrder.setCustomer(customer);
		Address address = new Address();
		address.setAddressLine1(order.getAddressLine1());
		address.setAddressLine2(order.getAddressLine2());
		address.setCity(order.getCity());
		address.setState(order.getState());
		address.setZipCode(order.getZipCode());
		address.setCountry(order.getCountry());
		
		newOrder.setDeliveryAddress(address);
		
		Address billingAddress = new Address();
		billingAddress.setAddressLine1(order.getAddressLine1());
		billingAddress.setAddressLine2(order.getAddressLine2());
		billingAddress.setCity(order.getCity());
		billingAddress.setState(order.getState());
		billingAddress.setZipCode(order.getZipCode());
		billingAddress.setCountry(order.getCountry());
		
		newOrder.setBillingAddress(billingAddress);
		
		Set<OrderItem> orderItems = new HashSet<OrderItem>();
		List<LineItem> lineItems = cart.getItems();
		for (LineItem lineItem : lineItems)
		{
			OrderItem item = new OrderItem();
			item.setProduct(lineItem.getProduct());
			item.setQuantity(lineItem.getQuantity());
			item.setPrice(lineItem.getProduct().getPrice());
			item.setOrder(newOrder);
			orderItems.add(item);
		}
		
		newOrder.setItems(orderItems);
		
		Payment payment = new Payment();
		payment.setCcNumber(order.getCcNumber());
		payment.setCvv(order.getCvv());
		
		newOrder.setPayment(payment);
		Order savedOrder = orderService.createOrder(newOrder);
		
		this.sendOrderConfirmationEmail(savedOrder);
		
		request.getSession().removeAttribute("CART_KEY");
		return "redirect:orderconfirmation?orderNumber="+savedOrder.getOrderNumber();
	}
	
	protected void sendOrderConfirmationEmail(Order order)
	{
		try {
			emailService.sendEmail(order.getCustomer().getEmail(), 
					"QuilCartCart - Order Confirmation", 
					"Your order has been placed successfully.\n"
					+ "Order Number : "+order.getOrderNumber());
		} catch (JCartException e) {
			logger.error(e);
		}
	}
	
	@RequestMapping(value="/orderconfirmation", method=RequestMethod.GET)
	public String showOrderConfirmation(@RequestParam(value="orderNumber")String orderNumber, Model model)
	{
		Order order = orderService.getOrder(orderNumber);
		model.addAttribute("order", order);
		return "orderconfirmation";
	}

}
```

Create the template **orderconfirmation.html** for showing order confirmation as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout">
<head>
<title>Order Confirmation</title>
</head>
<body>
	<div layout:fragment="content">
		<div class="single-product-area">
			<div class="zigzag-bottom"></div>
			<div class="container">
				<div class="row">

					<div class="woocommerce-info col-md-offset-2 col-md-8">
						<div th:unless="${order}" >
							<h2>No order found</h2>
						</div>
						<div th:if="${order}" >
							<h2>Your order has been placed successfully.</h2>
							<h2>
								Order Number : <span th:text="${order.orderNumber}">Number</span>
							</h2>
							<table class="table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Quantity</th>
										<th>Cost</th>
									</tr>
								</thead>
								<tbody>
									<tr th:each="item : ${order.items}">
										<td th:text="${item.product.name}">product.name</td>
										<td th:text="${item.quantity}"></td>
										<td th:text="${item.price * item.quantity}">price</td>
									</tr>
								</tbody>
								<tfoot>
									<tr class="cart-subtotal">
										<th>Order Subtotal</th>
										<td><span class="amount" th:text="${order.totalAmount}">£15.00</span>
										</td>
									</tr>

									<tr class="shipping">
										<th>Shipping and Handling</th>
										<td>Free Shipping</td>
									</tr>

									<tr class="order-total">
										<th>Order Total</th>
										<td><strong><span class="amount" th:text="${order.totalAmount}">£15.00</span></strong> </td>
									</tr>

								</tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
```

Now you can add items to cart, view cart item details, and checkout by providing delivery and billing info and finally place order. Once the order is successfully placed it will display the order confirmation page.

&nbsp;
