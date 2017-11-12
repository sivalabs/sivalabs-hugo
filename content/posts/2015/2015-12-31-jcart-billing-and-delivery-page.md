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

<pre class="lang:java decode:true ">public class OrderDTO implements Serializable
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
}</pre>

Create **CheckoutController** to display the Billing & Delivery page as follows:

<pre class="lang:java decode:true ">@Controller
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
}</pre>

Finally create the **checkout.html** view as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
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
										
					&lt;h3 id="order_review_heading"&gt;Your order&lt;/h3&gt;

					&lt;div id="order_review" style="position: relative;"&gt;
						&lt;table class="shop_table"&gt;
							&lt;thead&gt;
								&lt;tr&gt;
									&lt;th class="product-name"&gt;Product&lt;/th&gt;
									&lt;th class="product-total"&gt;Total&lt;/th&gt;
								&lt;/tr&gt;
							&lt;/thead&gt;
							&lt;tbody&gt;
								&lt;tr class="cart_item" th:each="item : ${cart.items}"&gt;
									&lt;td class="product-name" &gt;
										&lt;span th:text="${item.product.name}" &gt;Product Name &lt;/span&gt; 
										&lt;strong class="product-quantity" th:text="'× '+${item.quantity}"&gt;× 1&lt;/strong&gt; &lt;/td&gt;
									&lt;td class="product-total"&gt;
										&lt;span class="amount" th:text="${item.product.price * item.quantity}"&gt;£15.00&lt;/span&gt; &lt;/td&gt;
								&lt;/tr&gt;
							&lt;/tbody&gt;
							&lt;tfoot&gt;
								&lt;tr class="cart-subtotal"&gt;
									&lt;th&gt;Cart Subtotal&lt;/th&gt;
									&lt;td&gt;&lt;span class="amount" th:text="${cart.totalAmount}"&gt;£15.00&lt;/span&gt;
									&lt;/td&gt;
								&lt;/tr&gt;
								&lt;tr class="shipping"&gt;
									&lt;th&gt;Shipping and Handling&lt;/th&gt;
									&lt;td&gt;

										Free Shipping
										&lt;input type="hidden" class="shipping_method" value="free_shipping" id="shipping_method_0" data-index="0" name="shipping_method[0]"/&gt;
									&lt;/td&gt;
								&lt;/tr&gt;

								&lt;tr class="order-total"&gt;
									&lt;th&gt;Order Total&lt;/th&gt;
									&lt;td&gt;&lt;strong&gt;&lt;span class="amount" th:text="${cart.totalAmount}"&gt;£15.00&lt;/span&gt;&lt;/strong&gt; &lt;/td&gt;
								&lt;/tr&gt;
							&lt;/tfoot&gt;
						&lt;/table&gt;
					&lt;/div&gt;
					
				&lt;form action="#" th:action="@{/orders}" class="checkout" method="post" th:object="${order}"&gt;

					&lt;div id="customer_details" class="col2-set"&gt;
						&lt;div class="col-1"&gt;
							&lt;div class="woocommerce-billing-fields"&gt;
								&lt;h3&gt;Billing Details&lt;/h3&gt;

								&lt;p id="billing_first_name_field" class="form-row form-row-first validate-required"&gt;
									&lt;label class="" for="billing_first_name"&gt;First Name &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="" th:field="*{billingFirstName}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingFirstName')}" th:errors="*{billingFirstName}" th:errorclass="text-danger"&gt;Incorrect firstName&lt;/p&gt;
								&lt;/p&gt;

								&lt;p id="billing_last_name_field" class="form-row form-row-last validate-required"&gt;
									&lt;label class="" for="billing_last_name"&gt;Last Name &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="" th:field="*{billingLastName}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingLastName')}" 
										th:errors="*{billingLastName}" th:errorclass="text-danger"&gt;Incorrect lastName&lt;/p&gt;
								&lt;/p&gt;
								&lt;p id="billing_email_field" class="form-row form-row-first validate-required validate-email"&gt;
									&lt;label class="" for="billing_email"&gt;Email Address &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="" th:field="*{emailId}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('emailId')}" 
										th:errors="*{emailId}" th:errorclass="text-danger"&gt;Incorrect emailId&lt;/p&gt;
								&lt;/p&gt;

								&lt;p id="billing_phone_field" class="form-row form-row-last validate-required validate-phone"&gt;
									&lt;label class="" for="billing_phone"&gt;Phone &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="" th:field="*{phone}"  class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('phone')}" 
										th:errors="*{phone}" th:errorclass="text-danger"&gt;Incorrect phone&lt;/p&gt;
								&lt;/p&gt;
								&lt;div class="clear"&gt;&lt;/div&gt;
								
								&lt;p id="billing_address_1_field" class="form-row form-row-wide address-field validate-required"&gt;
									&lt;label class="" for="billing_address_1"&gt;Address &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="Street address" th:field="*{billingAddressLine1}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingAddressLine1')}" th:errors="*{billingAddressLine1}" th:errorclass="text-danger"&gt;Incorrect addressLine1&lt;/p&gt;
								&lt;/p&gt;

								&lt;p id="billing_address_2_field" class="form-row form-row-wide address-field"&gt;
									&lt;input type="text" value="" placeholder="Apartment, suite, unit etc. (optional)" th:field="*{billingAddressLine2}"  class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingAddressLine2')}" th:errors="*{billingAddressLine2}" th:errorclass="text-danger"&gt;Incorrect addressLine2&lt;/p&gt;
								&lt;/p&gt;

								&lt;p id="billing_city_field" class="form-row form-row-wide address-field validate-required" data-o_class="form-row form-row-wide address-field validate-required"&gt;
									&lt;label class="" for="billing_city"&gt;Town / City &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="Town / City" th:field="*{billingCity}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingCity')}" th:errors="*{billingCity}" th:errorclass="text-danger"&gt;Incorrect city&lt;/p&gt;
								&lt;/p&gt;

								&lt;p id="billing_state_field" class="form-row form-row-first address-field validate-state" data-o_class="form-row form-row-first address-field validate-state"&gt;
									&lt;label class="" for="billing_state"&gt;State&lt;/label&gt;
									&lt;input type="text" th:field="*{billingState}" placeholder="State / County" value="" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingState')}" th:errors="*{billingState}" th:errorclass="text-danger"&gt;Incorrect state&lt;/p&gt;
								&lt;/p&gt;
								&lt;p id="billing_postcode_field" class="form-row form-row-last address-field validate-required validate-postcode" data-o_class="form-row form-row-last address-field validate-required validate-postcode"&gt;
									&lt;label class="" for="billing_postcode"&gt;Zip Code &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" value="" placeholder="Postcode / Zip" th:field="*{billingZipCode}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('billingZipCode')}" th:errors="*{billingZipCode}" th:errorclass="text-danger"&gt;Incorrect zipCode&lt;/p&gt;
								&lt;/p&gt;
								&lt;p id="billing_country_field" class="form-row form-row-wide address-field update_totals_on_change validate-required woocommerce-validated"&gt;
									&lt;label class="" for="billing_country"&gt;Country &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;select class="country_to_state country_select" th:field="*{billingCountry}"&gt;                                                    
										&lt;option value="IN"&gt;India&lt;/option&gt;
									&lt;/select&gt;
								&lt;/p&gt;
								&lt;div class="clear"&gt;&lt;/div&gt;                                            
							&lt;/div&gt;
						&lt;/div&gt;

						&lt;div class="col-2"&gt;
							&lt;div class="woocommerce-shipping-fields"&gt;
								&lt;h3 id="ship-to-different-address"&gt;
									&lt;label class="checkbox" for="ship-to-different-address-checkbox"&gt;Ship to same address?&lt;/label&gt;
									&lt;input type="checkbox" value="1" name="ship_to_different_address" checked="checked" 
											class="input-checkbox" id="ship-to-different-address-checkbox"/&gt;
								&lt;/h3&gt;
								&lt;div class="shipping_address" style="display: block;"&gt;                                                

									&lt;p id="shipping_first_name_field" class="form-row form-row-first validate-required"&gt;
										&lt;label class="" for="shipping_first_name"&gt;First Name &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
										&lt;/label&gt;
										&lt;input type="text" value="" placeholder="" th:field="*{firstName}" class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('firstName')}" th:errors="*{firstName}" th:errorclass="text-danger"&gt;Incorrect firstName&lt;/p&gt;
									&lt;/p&gt;

									&lt;p id="shipping_last_name_field" class="form-row form-row-last validate-required"&gt;
										&lt;label class="" for="shipping_last_name"&gt;Last Name &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
										&lt;/label&gt;
										&lt;input type="text" value="" placeholder="" th:field="*{lastName}" class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('lastName')}" 
											th:errors="*{lastName}" th:errorclass="text-danger"&gt;Incorrect lastName&lt;/p&gt;
									&lt;/p&gt;
									&lt;div class="clear"&gt;&lt;/div&gt;

									&lt;p id="shipping_address_1_field" class="form-row form-row-wide address-field validate-required"&gt;
										&lt;label class="" for="shipping_address_1"&gt;Address &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
										&lt;/label&gt;
										&lt;input type="text" value="" placeholder="Street address" th:field="*{addressLine1}"  class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('addressLine1')}" th:errors="*{addressLine1}" th:errorclass="text-danger"&gt;Incorrect addressLine1&lt;/p&gt;
									&lt;/p&gt;

									&lt;p id="shipping_address_2_field" class="form-row form-row-wide address-field"&gt;
										&lt;input type="text" value="" placeholder="Apartment, suite, unit etc. (optional)" th:field="*{addressLine2}" class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('addressLine2')}" th:errors="*{addressLine2}" th:errorclass="text-danger"&gt;Incorrect addressLine2&lt;/p&gt;
									&lt;/p&gt;

									&lt;p id="shipping_city_field" class="form-row form-row-wide address-field validate-required" data-o_class="form-row form-row-wide address-field validate-required"&gt;
										&lt;label class="" for="shipping_city"&gt;City &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
										&lt;/label&gt;
										&lt;input type="text" value="" placeholder="Town / City" th:field="*{city}" class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('city')}" th:errors="*{city}" th:errorclass="text-danger"&gt;Incorrect city&lt;/p&gt;
									&lt;/p&gt;

									&lt;p id="shipping_state_field" class="form-row form-row-first address-field validate-state" data-o_class="form-row form-row-first address-field validate-state"&gt;
										&lt;label class="" for="shipping_state"&gt;State&lt;/label&gt;
										&lt;input type="text" th:field="*{state}" placeholder="State / County" value="" class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('state')}" th:errors="*{state}" th:errorclass="text-danger"&gt;Incorrect state&lt;/p&gt;
									&lt;/p&gt;
									&lt;p id="shipping_postcode_field" class="form-row form-row-last address-field validate-required validate-postcode" data-o_class="form-row form-row-last address-field validate-required validate-postcode"&gt;
										&lt;label class="" for="shipping_postcode"&gt;Zip Code &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
										&lt;/label&gt;
										&lt;input type="text" value="" placeholder="Postcode / Zip" th:field="*{zipCode}" class="input-text "/&gt;
										&lt;p th:if="${#fields.hasErrors('zipCode')}" th:errors="*{zipCode}" th:errorclass="text-danger"&gt;Incorrect zipCode&lt;/p&gt;
									&lt;/p&gt;
									&lt;p id="shipping_country_field" class="form-row form-row-wide address-field update_totals_on_change validate-required woocommerce-validated"&gt;
										&lt;label class="" for="shipping_country"&gt;Country &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
										&lt;/label&gt;
										&lt;select class="country_to_state country_select" th:field="*{country}" &gt;
											&lt;option value="IN"&gt;India&lt;/option&gt;
										&lt;/select&gt;
									&lt;/p&gt;
									&lt;div class="clear"&gt;&lt;/div&gt;
								&lt;/div&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;                                
					&lt;div id="customer_details" class="col2-set"&gt;
						&lt;div class="col-1"&gt;
							&lt;div class="woocommerce-billing-fields"&gt;
								&lt;h3&gt;Payment Details&lt;/h3&gt;

								&lt;p id="cc_number" class="form-row form-row-first validate-required"&gt;
									&lt;label class="" for="cc_number"&gt;Credit Card Number &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" th:field="*{ccNumber}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('ccNumber')}" th:errors="*{ccNumber}" th:errorclass="text-danger"&gt;Invalid Credit Card&lt;/p&gt;
								&lt;/p&gt;
								
								&lt;p id="cc_cvv" class="form-row form-row-first validate-required"&gt;
									&lt;label class="" for="cc_cvv"&gt;CCV &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;
									&lt;/label&gt;
									&lt;input type="text" th:field="*{cvv}" class="input-text "/&gt;
									&lt;p th:if="${#fields.hasErrors('cvv')}" th:errors="*{cvv}" th:errorclass="text-danger"&gt;Invalid CVV&lt;/p&gt;
								&lt;/p&gt;
								&lt;p id="payment_expiry_date" class="form-row form-row-wide validate-required woocommerce-validated"&gt;
									&lt;label class="" for="shipping_country"&gt;Expiry Date &lt;abbr title="required" class="required"&gt;*&lt;/abbr&gt;&lt;/label&gt;
									&lt;div style="display: inline;"&gt;
									&lt;select style="width: 25%"&gt;
										&lt;option value="2015"&gt;2015&lt;/option&gt;
										&lt;option value="2016"&gt;2016&lt;/option&gt;
										&lt;option value="2017"&gt;2017&lt;/option&gt;
										&lt;option value="2018"&gt;2018&lt;/option&gt;
									&lt;/select&gt;
									
									&lt;select style="width: 25%"&gt;
										&lt;option value="1"&gt;Jan&lt;/option&gt;
										&lt;option value="2"&gt;Feb&lt;/option&gt;
										&lt;option value="3"&gt;Mar&lt;/option&gt;
										&lt;option value="4"&gt;Apr&lt;/option&gt;
									&lt;/select&gt;
									&lt;/div&gt;
								&lt;/p&gt;
								
							&lt;/div&gt;
						&lt;/div&gt;
				   &lt;/div&gt;

					&lt;div id="payment"&gt;
							
						 &lt;div class="form-row place-order"&gt;
							 &lt;input type="submit" data-value="Place order" value="Place order" id="place_order" name="woocommerce_checkout_place_order" class="button alt"/&gt;
						 &lt;/div&gt;

						 &lt;div class="clear"&gt;&lt;/div&gt;

				  &lt;/div&gt;
				&lt;/form&gt;

			&lt;/div&gt;                       
		&lt;/div&gt;                    
	&lt;/div&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

Next we need to implement the back-end services for Order related operations.

<pre class="lang:java decode:true ">public interface OrderRepository extends JpaRepository&lt;Order, Integer&gt;
{
	Order findByOrderNumber(String orderNumber);
}</pre>

<pre class="lang:java decode:true ">@Service
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

}</pre>

<pre class="lang:java decode:true ">@Controller
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
		
		Set&lt;OrderItem&gt; orderItems = new HashSet&lt;OrderItem&gt;();
		List&lt;LineItem&gt; lineItems = cart.getItems();
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

}</pre>

Create the template **orderconfirmation.html** for showing order confirmation as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;
&lt;head&gt;
&lt;title&gt;Order Confirmation&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="single-product-area"&gt;
			&lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
			&lt;div class="container"&gt;
				&lt;div class="row"&gt;

					&lt;div class="woocommerce-info col-md-offset-2 col-md-8"&gt;
						&lt;div th:unless="${order}" &gt;
							&lt;h2&gt;No order found&lt;/h2&gt;
						&lt;/div&gt;
						&lt;div th:if="${order}" &gt;
							&lt;h2&gt;Your order has been placed successfully.&lt;/h2&gt;
							&lt;h2&gt;
								Order Number : &lt;span th:text="${order.orderNumber}"&gt;Number&lt;/span&gt;
							&lt;/h2&gt;
							&lt;table class="table"&gt;
								&lt;thead&gt;
									&lt;tr&gt;
										&lt;th&gt;Name&lt;/th&gt;
										&lt;th&gt;Quantity&lt;/th&gt;
										&lt;th&gt;Cost&lt;/th&gt;
									&lt;/tr&gt;
								&lt;/thead&gt;
								&lt;tbody&gt;
									&lt;tr th:each="item : ${order.items}"&gt;
										&lt;td th:text="${item.product.name}"&gt;product.name&lt;/td&gt;
										&lt;td th:text="${item.quantity}"&gt;&lt;/td&gt;
										&lt;td th:text="${item.price * item.quantity}"&gt;price&lt;/td&gt;
									&lt;/tr&gt;
								&lt;/tbody&gt;
								&lt;tfoot&gt;
									&lt;tr class="cart-subtotal"&gt;
										&lt;th&gt;Order Subtotal&lt;/th&gt;
										&lt;td&gt;&lt;span class="amount" th:text="${order.totalAmount}"&gt;£15.00&lt;/span&gt;
										&lt;/td&gt;
									&lt;/tr&gt;

									&lt;tr class="shipping"&gt;
										&lt;th&gt;Shipping and Handling&lt;/th&gt;
										&lt;td&gt;Free Shipping&lt;/td&gt;
									&lt;/tr&gt;

									&lt;tr class="order-total"&gt;
										&lt;th&gt;Order Total&lt;/th&gt;
										&lt;td&gt;&lt;strong&gt;&lt;span class="amount" th:text="${order.totalAmount}"&gt;£15.00&lt;/span&gt;&lt;/strong&gt; &lt;/td&gt;
									&lt;/tr&gt;

								&lt;/tfoot&gt;
							&lt;/table&gt;
						&lt;/div&gt;
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

Now you can add items to cart, view cart item details, and checkout by providing delivery and billing info and finally place order. Once the order is successfully placed it will display the order confirmation page.

&nbsp;