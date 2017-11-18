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

{{< highlight java >}}
@Service
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

	public List<Order> getAllOrders()
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
{{</ highlight>}}

Now let us implement OrderController to handle the requests to display list of orders, the selected order details and updating the Order status.

{{< highlight java >}}
@Controller
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
		List<Order> list = orderService.getAllOrders();
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
}
{{</ highlight>}}

We are using thymeleaf email template jcart-core/src/main/resources/email-templates/order-status-update-email.html for sending the Order Status Update email.

{{< highlight html>}}
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <title th:remove="all">Template for HTML email</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <p th:text="${'Hello '+order.customer.firstName}">
      Hello Customer
    </p>
    <p>
       Order Number : <span th:text="${order.orderNumber}">Number</span><br/>
       Status: <span th:text="${order.status}">Status</span>
    </p>
    <p>
      Regards, <br />
      <em>The QuilCart Team</em>
    </p>
  </body>
</html>
{{</ highlight>}}

Create the thymeleaf view template for showing list of orders orders.html as follows:

{{< highlight html>}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">      
 <head>
	<title>Orders</title>
</head>
<body>			
	<div layout:fragment="content">
		<div class="row">
		<div class="col-md-12">
		  <div class="box">
			<div class="box-header">
			  <h3 class="box-title">List of Orders</h3>
			</div>
			<div class="box-body table-responsive no-padding">
			  <table class="table table-hover">
				<tr>
				  <th style="width: 10px">#</th>
				  <th>Order Number</th>
				  <th>Customer Name</th>
				  <th>Email</th>
				  <th>Edit</th>				  
				</tr>
				<tr th:each="order,iterStat : ${orders}">
				  <td><span th:text="${iterStat.count}">1</span></td>
				  <td th:text="${order.orderNumber}">Order Number</td>
				  <td th:text="${order.customer.firstName}">Customer Name</td>
				  <td th:text="${order.customer.email}">Customer Email</td>
				  <td><a th:href="@{/orders/{orderNumber}(orderNumber=${order.orderNumber})}" 
						 class="btn btn-sm btn-default"><i class="fa fa-edit"></i> Edit</a></td>
				</tr>                    
			  </table>
			</div>			
		  </div>
		 </div>
	</div>		  
	</div>	
</body>    
</html>
{{</ highlight>}}

Create the thymeleaf view template for showing order details edit_order.html as follows:

{{< highlight html>}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout">
<head>
<title>Orders - Edit</title>
</head>
<body>
	<div layout:fragment="content">
		<div class="box box-warning">
			<div class="box-header with-border">
				<h3 class="box-title">Edit Order</h3>
			</div>
			<!-- /.box-header -->
			<div class="box-body">
				<form role="form"
					th:action="@{/orders/{orderNumber}(orderNumber=${order.orderNumber})}"
					th:object="${order}" method="post">
					<p th:if="${#fields.hasErrors('global')}" th:errors="*{global}"
						th:class="text-red">Incorrect data</p>
					<div>
						<div th:unless="${order}">
							<h2>No order found</h2>
						</div>
						<div th:if="${order}">
							<h3>
								Order Number : <span th:text="${order.orderNumber}">Number</span>
							</h3>
							<h3>Order Item Details</h3>
							<table class="table table-hover">
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
										<td><strong><span class="amount"
												th:text="${order.totalAmount}">£15.00</span></strong></td>
									</tr>

								</tfoot>
							</table>
							<div>
								<label>Order Status</label> <select th:field="*{status}">
									<option
										th:each="status: ${T(com.sivalabs.jcart.entities.OrderStatus).values()}"
										th:value="${status}" th:text="${status}">Status</option>
								</select>
							</div>
						</div>
					</div>
					<div class="box-footer">
						<button type="submit" class="btn btn-primary">Submit</button>
					</div>
				</form>
			</div>
		</div>
	</div>
</body>
</html>
{{</ highlight>}}

Now you can run the application and click on Order menu item in left navigation. 
You can see list of order and click on Edit button to view order details or edit the order status.
