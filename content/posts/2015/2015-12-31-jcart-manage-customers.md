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

```java
public interface CustomerRepository extends JpaRepository<Customer, Integer>
{
	Customer findByEmail(String email);

	@Query("select o from Order o where o.customer.email=?1")
	List<Order> getCustomerOrders(String email);
}
```

```java
@Service
@Transactional
public class CustomerService {
	@Autowired CustomerRepository customerRepository;
	
	public Customer getCustomerByEmail(String email) {
		return customerRepository.findByEmail(email);
	}

	public Customer createCustomer(Customer customer) {
		return customerRepository.save(customer);
	}

	public List<Customer> getAllCustomers() {
		return customerRepository.findAll();
	}

	public Customer getCustomerById(Integer id) {
		return customerRepository.findOne(id);
	}

	public List<Order> getCustomerOrders(String email) {
		return customerRepository.getCustomerOrders(email);
	}
}
```

Now let us implement CustomerController to handle the requests to display list of customers and the selected customer details.

```java
@Controller
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
		List<Customer> list = customerService.getAllCustomers();
		model.addAttribute("customers",list);
		return viewPrefix+"customers";
	}
	
	@RequestMapping(value="/customers/{id}", method=RequestMethod.GET)
	public String viewCustomerForm(@PathVariable Integer id, Model model) {
		Customer customer = customerService.getCustomerById(id);
		model.addAttribute("customer",customer);
		return viewPrefix+"view_customer";
	}		
}
```

Create the thymeleaf view template for showing list of customers customers.html as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	 xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
    layout:decorator="layout/mainLayout">    
<head>
	<title>Customers</title>
</head>
<body>  	    
	<div layout:fragment="content">
		<div class="row">
		<div class="col-md-12">
		  <div class="box">
			<div class="box-header">
			  <h3 class="box-title">List of Customers</h3>
			</div>
			<div class="box-body table-responsive no-padding">
			  <table class="table table-hover">
				<tr>
				  <th style="width: 10px">#</th>
				  <th>Customer Name</th>
				  <th>Email</th>
				  <th>View</th>            
				</tr>
				<tr th:each="customer,iterStat : ${customers}">
				  <td><span th:text="${iterStat.count}">1</span></td>
				  <td th:text="${customer.firstName}">Customer Name</td>
				  <td th:text="${customer.email}">Customer Email</td>
				  <td><a th:href="@{/customers/{id}(id=${customer.id})}" 
				  class="btn btn-sm btn-default"><i class="fa fa-search"></i> View</a></td>
				</tr>          
			  </table>
			</div>        
		  </div>
		</div>
		</div>		  
	</div>  	
</body>  
</html>
```

Create the thymeleaf view template for showing customer details view_customer.html as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout">

<head>
<title>Customer - View</title>
</head>
<body>
<div layout:fragment="content">
  <div class="box box-warning">
    <div class="box-header with-border">
      <h3 class="box-title">View Customer</h3>
    </div>
    <div class="box-body">
      <form role="form" action="#" th:object="${customer}" method="post">
        <div class="form-group">
          <label>FirstName</label> <input type="text" class="form-control"
            th:field="*{firstName}" readonly="readonly" />
        </div>

        <div class="form-group">
          <label>LastName</label> <input type="text" class="form-control"
            th:field="*{lastName}" readonly="readonly" />
        </div>

        <div class="form-group">
          <label>Email</label> <input type="email" class="form-control"
            th:field="*{email}" readonly="readonly" />
        </div>

        <div class="form-group">
          <label>Phone</label> <input type="text" class="form-control"
            th:field="*{phone}" readonly="readonly" />
        </div>
      </form>
    </div>
  </div>
</div>

</body>
</html>
```

Now you can run the application and click on Customers menu item in left navigation. You can see list of customers and click on View button to view customer details.
