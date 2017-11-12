---
title: 'JCart : Iteration-8'
author: Siva
type: post
date: 2015-12-31T11:37:10+00:00
url: /2015/12/jcart-iteration-8/
post_views_count:
  - 8
categories:
  - Java
tags:
  - jcart

---
In this Iteration#8 we will implement showing the Customer Account and Order History functionality in our ShoppingCart application.

  * Customer MyAccount Page 
      * Profile
      * Order History

Once the customer is logged in our system he can click on MyAccount link at the top of the header and view his profile details and order history.

First let us write the Controller handler method in our CustomerController to show myAccount details.

<pre class="lang:java decode:true ">@Controller
public class CustomerController extends JCartSiteBaseController
{	
	@Autowired private CustomerService customerService;
	...
	...	
	
	@RequestMapping(value="/myAccount", method=RequestMethod.GET)
	protected String myAccount(Model model)
	{
		String email = getCurrentUser().getCustomer().getEmail();
		Customer customer = customerService.getCustomerByEmail(email);
		model.addAttribute("customer", customer);
		List&lt;Order&gt; orders = customerService.getCustomerOrders(email);
		model.addAttribute("orders", orders);
		return "myAccount";
	}
}</pre>

Now create the myAccount.html view to render customer details and customer order history.

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;
&lt;head&gt;
&lt;title&gt;My Account&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="single-product-area"&gt;
			&lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
			&lt;div class="container"&gt;
				&lt;div role="tabpanel"&gt;
					&lt;ul class="customer-tab" role="tablist"&gt;
						&lt;li role="presentation" class="active"&gt;&lt;a href="#profile"
							aria-controls="profile" role="tab" data-toggle="tab"&gt;Customer
								Info&lt;/a&gt;&lt;/li&gt;
						&lt;li role="presentation"&gt;&lt;a href="#orders"
							aria-controls="orders" role="tab" data-toggle="tab"&gt;Orders&lt;/a&gt;&lt;/li&gt;
					&lt;/ul&gt;
					&lt;div class="tab-content"&gt;
						&lt;div role="tabpanel" class="tab-pane fade in active" id="profile"&gt;
							&lt;h2&gt;Customer Info&lt;/h2&gt;
							&lt;form role="form" action="#" th:object="${customer}"
								method="post"&gt;								
								&lt;div class="form-group"&gt;
									&lt;label&gt;FirstName&lt;/label&gt; &lt;input type="text"
										class="form-control" th:field="*{firstName}"
										readonly="readonly" /&gt;
								&lt;/div&gt;
								&lt;div class="form-group"&gt;
									&lt;label&gt;LastName&lt;/label&gt; &lt;input type="text" class="form-control"
										th:field="*{lastName}" readonly="readonly" /&gt;
								&lt;/div&gt;
								&lt;div class="form-group"&gt;
									&lt;label&gt;Email&lt;/label&gt; &lt;input type="email" class="form-control"
										th:field="*{email}" readonly="readonly" /&gt;
								&lt;/div&gt;
								&lt;div class="form-group"&gt;
									&lt;label&gt;Phone&lt;/label&gt; &lt;input type="text" class="form-control"
										th:field="*{phone}" readonly="readonly" /&gt;
								&lt;/div&gt;
							&lt;/form&gt;
						&lt;/div&gt;
						&lt;div role="tabpanel" class="tab-pane fade" id="orders"&gt;
							&lt;h2&gt;Orders&lt;/h2&gt;
							&lt;table cellspacing="0" class="shop_table cart"&gt;
								&lt;thead&gt;
									&lt;tr&gt;
										&lt;th&gt;#&lt;/th&gt;
										&lt;th&gt;Order Number&lt;/th&gt;
										&lt;th&gt;Status&lt;/th&gt;
									&lt;/tr&gt;
								&lt;/thead&gt;
								&lt;tbody&gt;
									&lt;tr th:each="order,iterStat : ${orders}"&gt;
										&lt;td&gt;&lt;span th:text="${iterStat.count}"&gt;1&lt;/span&gt;&lt;/td&gt;
										&lt;td&gt;&lt;a href="#" th:text="${order.orderNumber}"
											th:href="@{/orders/{orderNumber}(orderNumber=${order.orderNumber})}"&gt;OrderNumber&lt;/a&gt;
										&lt;/td&gt;
										&lt;td&gt;&lt;span th:text="${order.status}"&gt;Status&lt;/span&gt;&lt;/td&gt;

									&lt;/tr&gt;
								&lt;/tbody&gt;
							&lt;/table&gt;
						&lt;/div&gt;
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>

Now you can login as customer and click on MyAccount and see the profile. When you click on Orders tab you can see the list of orders that customer is placed. Also you can click on Order Number to see more details of the Order.