---
title: 'JCart : Manage Customers'
author: Siva
type: post
date: 2015-12-31T09:34:50+00:00
url: /2015/12/jcart-manage-customers/
post_views_count:
  - 5
categories:
  - Java
tags:
  - jcart

---
For Managing Customers we need a provision to see all the list of customers and view any Customers details.

Let us start with implementing the back-end Customer service.

<pre class="lang:java decode:true ">public interface CustomerRepository extends JpaRepository&lt;Customer, Integer&gt;
{

	Customer findByEmail(String email);

	@Query("select o from Order o where o.customer.email=?1")
	List&lt;Order&gt; getCustomerOrders(String email);

}</pre>

<pre class="lang:java decode:true ">@Service
@Transactional
public class CustomerService {
	@Autowired CustomerRepository customerRepository;
	
	public Customer getCustomerByEmail(String email) {
		return customerRepository.findByEmail(email);
	}

	public Customer createCustomer(Customer customer) {
		return customerRepository.save(customer);
	}

	public List&lt;Customer&gt; getAllCustomers() {
		return customerRepository.findAll();
	}

	public Customer getCustomerById(Integer id) {
		return customerRepository.findOne(id);
	}

	public List&lt;Order&gt; getCustomerOrders(String email) {
		return customerRepository.getCustomerOrders(email);
	}
}</pre>

Now let us implement CustomerController to handle the requests to display list of customers and the selected customer details.

<pre class="lang:java decode:true ">@Controller
@Secured(SecurityUtil.MANAGE_CUSTOMERS)
public class CustomerController extends JCartAdminBaseController
{
	private static final String viewPrefix = "customers/";
	
	@Autowired 
	private CustomerService customerService;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Customers";
	}
		
	@RequestMapping(value="/customers", method=RequestMethod.GET)
	public String listCustomers(Model model) {
		List&lt;Customer&gt; list = customerService.getAllCustomers();
		model.addAttribute("customers",list);
		return viewPrefix+"customers";
	}
	
	@RequestMapping(value="/customers/{id}", method=RequestMethod.GET)
	public String viewCustomerForm(@PathVariable Integer id, Model model) {
		Customer customer = customerService.getCustomerById(id);
		model.addAttribute("customer",customer);
		return viewPrefix+"view_customer";
	}		
}</pre>

Create the thymeleaf view template for showing list of customers customers.html as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	 xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;      
&lt;head&gt;
	&lt;title&gt;Customers&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;    	        
	&lt;div layout:fragment="content"&gt;
		&lt;div class="row"&gt;
		&lt;div class="col-md-12"&gt;
		  &lt;div class="box"&gt;
			&lt;div class="box-header"&gt;
			  &lt;h3 class="box-title"&gt;List of Customers&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body table-responsive no-padding"&gt;
			  &lt;table class="table table-hover"&gt;
				&lt;tr&gt;
				  &lt;th style="width: 10px"&gt;#&lt;/th&gt;
				  &lt;th&gt;Customer Name&lt;/th&gt;
				  &lt;th&gt;Email&lt;/th&gt;
				  &lt;th&gt;View&lt;/th&gt;                      
				&lt;/tr&gt;
				&lt;tr th:each="customer,iterStat : ${customers}"&gt;
				  &lt;td&gt;&lt;span th:text="${iterStat.count}"&gt;1&lt;/span&gt;&lt;/td&gt;
				  &lt;td th:text="${customer.firstName}"&gt;Customer Name&lt;/td&gt;
				  &lt;td th:text="${customer.email}"&gt;Customer Email&lt;/td&gt;
				  &lt;td&gt;&lt;a th:href="@{/customers/{id}(id=${customer.id})}" 
				  class="btn btn-sm btn-default"&gt;&lt;i class="fa fa-search"&gt;&lt;/i&gt; View&lt;/a&gt;&lt;/td&gt;
				&lt;/tr&gt;                    
			  &lt;/table&gt;
			&lt;/div&gt;                
		  &lt;/div&gt;
		&lt;/div&gt;
		&lt;/div&gt;		  
	&lt;/div&gt;    	
&lt;/body&gt;    
&lt;/html&gt;</pre>

Create the thymeleaf view template for showing customer details view_customer.html as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;

&lt;head&gt;
&lt;title&gt;Customer - View&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="box box-warning"&gt;
			&lt;div class="box-header with-border"&gt;
				&lt;h3 class="box-title"&gt;View Customer&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body"&gt;
				&lt;form role="form" action="#" th:object="${customer}" method="post"&gt;
					&lt;div class="form-group"&gt;
						&lt;label&gt;FirstName&lt;/label&gt; &lt;input type="text" class="form-control"
							th:field="*{firstName}" readonly="readonly" /&gt;
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
		&lt;/div&gt;
	&lt;/div&gt;

&lt;/body&gt;
&lt;/html&gt;</pre>

Now you can run the application and click on Customers menu item in left navigation. You can see list of customers and click on View button to view customer details.