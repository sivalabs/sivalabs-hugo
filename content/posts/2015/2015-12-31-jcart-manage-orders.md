---
title: 'JCart : Manage Orders'
author: Siva
type: post
date: 2015-12-31T09:21:17+00:00
url: /2015/12/jcart-manage-orders/
post_views_count:
  - 5
categories:
  - Java
tags:
  - jcart

---
For Managing Orders we need a provision to see all the list of orders and view an order details and updating the order status.

Let us start with implementing the back-end order service.

<pre class="lang:java decode:true ">@Service
@Transactional
public class OrderService
{
	@Autowired EmailService emailService;
	@Autowired OrderRepository orderRepository;
	
	...
	...
	
	public Order getOrder(String orderNumber)
	{
		return orderRepository.findByOrderNumber(orderNumber);
	}

	public List&lt;Order&gt; getAllOrders()
	{
		Sort sort = new Sort(Direction.DESC, "createdOn");
		return orderRepository.findAll(sort);
	}

	public Order updateOrder(Order order) {
		Order o = getOrder(order.getOrderNumber());
		o.setStatus(order.getStatus());
		Order savedOrder = orderRepository.save(o);
		return savedOrder;
	}
}
</pre>

Now let us implement OrderController to handle the requests to display list of orders, the selected order details and updating the Order status.

<pre class="lang:java decode:true ">@Controller
@Secured(SecurityUtil.MANAGE_ORDERS)
public class OrderController extends JCartAdminBaseController
{
	private static final String viewPrefix = "orders/";

	@Autowired protected EmailService emailService;
	@Autowired protected OrderService orderService;
	@Autowired private TemplateEngine templateEngine;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Orders";
	}
	
	
	@RequestMapping(value="/orders", method=RequestMethod.GET)
	public String listOrders(Model model) {
		List&lt;Order&gt; list = orderService.getAllOrders();
		model.addAttribute("orders",list);
		return viewPrefix+"orders";
	}
	
	@RequestMapping(value="/orders/{orderNumber}", method=RequestMethod.GET)
	public String editOrderForm(@PathVariable String orderNumber, Model model) {
		Order order = orderService.getOrder(orderNumber);
		model.addAttribute("order",order);
		return viewPrefix+"edit_order";
	}
	
	@RequestMapping(value="/orders/{orderNumber}", method=RequestMethod.POST)
	public String updateOrder(@ModelAttribute("order") Order order, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {		
		Order persistedOrder = orderService.updateOrder(order);
		this.sendOrderStatusUpdateEmail(persistedOrder);
		logger.debug("Updated order with orderNumber : {}", persistedOrder.getOrderNumber());
		redirectAttributes.addFlashAttribute("info", "Order updated successfully");
		return "redirect:/orders";
	}
	
	protected void sendOrderStatusUpdateEmail(Order order)
	{
		try {
			final Context ctx = new Context();
	        ctx.setVariable("order", order);
			final String htmlContent = this.templateEngine.process("order-status-update-email", ctx);
	        
			emailService.sendEmail(order.getCustomer().getEmail(), 
								   "QuilCartCart - Order Status Update", 
								   htmlContent);
		} catch (JCartException e) {
			logger.error(e);
		}
	}
}</pre>

We are using thymeleaf email template jcart-core/src/main/resources/email-templates/order-status-update-email.html for sending the Order Status Update email.

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns:th="http://www.thymeleaf.org"&gt;
  &lt;head&gt;
    &lt;title th:remove="all"&gt;Template for HTML email&lt;/title&gt;
    &lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;p th:text="${'Hello '+order.customer.firstName}"&gt;
      Hello Customer
    &lt;/p&gt;
    &lt;p&gt;
       Order Number : &lt;span th:text="${order.orderNumber}"&gt;Number&lt;/span&gt;&lt;br/&gt;
       Status: &lt;span th:text="${order.status}"&gt;Status&lt;/span&gt;
    &lt;/p&gt;
    &lt;p&gt;
      Regards, &lt;br /&gt;
      &lt;em&gt;The QuilCart Team&lt;/em&gt;
    &lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>

Create the thymeleaf view template for showing list of orders orders.html as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;      
 &lt;head&gt;
	&lt;title&gt;Orders&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;			
	&lt;div layout:fragment="content"&gt;
		&lt;div class="row"&gt;
		&lt;div class="col-md-12"&gt;
		  &lt;div class="box"&gt;
			&lt;div class="box-header"&gt;
			  &lt;h3 class="box-title"&gt;List of Orders&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body table-responsive no-padding"&gt;
			  &lt;table class="table table-hover"&gt;
				&lt;tr&gt;
				  &lt;th style="width: 10px"&gt;#&lt;/th&gt;
				  &lt;th&gt;Order Number&lt;/th&gt;
				  &lt;th&gt;Customer Name&lt;/th&gt;
				  &lt;th&gt;Email&lt;/th&gt;
				  &lt;th&gt;Edit&lt;/th&gt;				  
				&lt;/tr&gt;
				&lt;tr th:each="order,iterStat : ${orders}"&gt;
				  &lt;td&gt;&lt;span th:text="${iterStat.count}"&gt;1&lt;/span&gt;&lt;/td&gt;
				  &lt;td th:text="${order.orderNumber}"&gt;Order Number&lt;/td&gt;
				  &lt;td th:text="${order.customer.firstName}"&gt;Customer Name&lt;/td&gt;
				  &lt;td th:text="${order.customer.email}"&gt;Customer Email&lt;/td&gt;
				  &lt;td&gt;&lt;a th:href="@{/orders/{orderNumber}(orderNumber=${order.orderNumber})}" 
						 class="btn btn-sm btn-default"&gt;&lt;i class="fa fa-edit"&gt;&lt;/i&gt; Edit&lt;/a&gt;&lt;/td&gt;
				&lt;/tr&gt;                    
			  &lt;/table&gt;
			&lt;/div&gt;			
		  &lt;/div&gt;
		 &lt;/div&gt;
	&lt;/div&gt;		  
	&lt;/div&gt;	
&lt;/body&gt;    
&lt;/html&gt;</pre>

Create the thymeleaf view template for showing order details edit_order.html as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;
&lt;head&gt;
&lt;title&gt;Orders - Edit&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="box box-warning"&gt;
			&lt;div class="box-header with-border"&gt;
				&lt;h3 class="box-title"&gt;Edit Order&lt;/h3&gt;
			&lt;/div&gt;
			&lt;!-- /.box-header --&gt;
			&lt;div class="box-body"&gt;
				&lt;form role="form"
					th:action="@{/orders/{orderNumber}(orderNumber=${order.orderNumber})}"
					th:object="${order}" method="post"&gt;
					&lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}"
						th:class="text-red"&gt;Incorrect data&lt;/p&gt;
					&lt;div&gt;
						&lt;div th:unless="${order}"&gt;
							&lt;h2&gt;No order found&lt;/h2&gt;
						&lt;/div&gt;
						&lt;div th:if="${order}"&gt;
							&lt;h3&gt;
								Order Number : &lt;span th:text="${order.orderNumber}"&gt;Number&lt;/span&gt;
							&lt;/h3&gt;
							&lt;h3&gt;Order Item Details&lt;/h3&gt;
							&lt;table class="table table-hover"&gt;
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
										&lt;td&gt;&lt;strong&gt;&lt;span class="amount"
												th:text="${order.totalAmount}"&gt;£15.00&lt;/span&gt;&lt;/strong&gt;&lt;/td&gt;
									&lt;/tr&gt;

								&lt;/tfoot&gt;
							&lt;/table&gt;
							&lt;div&gt;
								&lt;label&gt;Order Status&lt;/label&gt; &lt;select th:field="*{status}"&gt;
									&lt;option
										th:each="status: ${T(com.sivalabs.jcart.entities.OrderStatus).values()}"
										th:value="${status}" th:text="${status}"&gt;Status&lt;/option&gt;
								&lt;/select&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					&lt;div class="box-footer"&gt;
						&lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
					&lt;/div&gt;
				&lt;/form&gt;
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

Now you can run the application and click on Order menu item in left navigation. You can see list of order and click on Edit button to view order details or edit the order status.