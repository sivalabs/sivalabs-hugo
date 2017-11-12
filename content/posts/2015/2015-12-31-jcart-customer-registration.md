---
title: 'JCart : Customer Registration'
author: Siva
type: post
date: 2015-12-31T07:24:01+00:00
url: /2015/12/jcart-customer-registration/
post_views_count:
  - 3
categories:
  - Java
tags:
  - jcart

---
To facilitate new customer registration we will provide a new Registration form where customer provide his details and register with our system.

Let us implement the back-end customer service operations.

<pre class="lang:java decode:true ">public interface CustomerRepository extends JpaRepository&lt;Customer, Integer&gt;{
	Customer findByEmail(String email);
}</pre>

<pre class="lang:java decode:true ">@Service
@Transactional
public class CustomerService 
{
	@Autowired CustomerRepository customerRepository;
	
	public Customer getCustomerByEmail(String email) {
		return customerRepository.findByEmail(email);
	}

	public Customer createCustomer(Customer customer) {
		return customerRepository.save(customer);
	}
}</pre>

<pre class="lang:java decode:true ">@Component
public class CustomerValidator implements Validator
{
	@Autowired private CustomerService custmoerService;

	@Override
	public boolean supports(Class&lt;?&gt; clazz) {
		return Customer.class.isAssignableFrom(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {
		Customer customer = (Customer) target;
		Customer customerByEmail = custmoerService.getCustomerByEmail(customer.getEmail());
		if(customerByEmail != null){
			errors.rejectValue("email", "error.exists", 
			new Object[]{customer.getEmail()}, 
			"Email "+customer.getEmail()+" already in use");
		}
	}
	
}</pre>

Let us implement the **CustomerController** registration handler methods as follows:

<pre class="lang:java decode:true ">@Controller
public class CustomerController extends JCartSiteBaseController
{	
	@Autowired private CustomerService customerService;
	@Autowired private CustomerValidator customerValidator;
	@Autowired protected PasswordEncoder passwordEncoder;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Login/Register";
	}

	@RequestMapping(value="/register", method=RequestMethod.GET)
	protected String registerForm(Model model)
	{
		model.addAttribute("customer", new Customer());
		return "register";
	}
	
	@RequestMapping(value="/register", method=RequestMethod.POST)
	protected String register(@Valid @ModelAttribute("customer") Customer customer, 
		BindingResult result, Model model, RedirectAttributes redirectAttributes)
	{
		customerValidator.validate(customer, result);
		if(result.hasErrors()){
			return "register";
		}
		String password = customer.getPassword();
		String encodedPwd = passwordEncoder.encode(password);
		customer.setPassword(encodedPwd);
		
		Customer persistedCustomer = customerService.createCustomer(customer);
		logger.debug("Created new Customer with id : {} and email : {}", persistedCustomer.getId(), persistedCustomer.getEmail());
		redirectAttributes.addFlashAttribute("info", "Customer created successfully");
		return "redirect:/login";
	}
	
}</pre>

Finally let us create the **register.html** thymeleaf view as follows:

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
&lt;head&gt;
	&lt;title&gt;Register&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	&lt;div layout:fragment="content"&gt;
		&lt;div class="single-product-area"&gt;
			&lt;div class="zigzag-bottom"&gt;&lt;/div&gt;
			&lt;div class="container"&gt;
				
				&lt;div class="row"&gt;
					
					&lt;div class="col-md-offset-3 col-md-6" &gt;
						&lt;form id="login-form-wrap" th:action="@{/register}" th:object="${customer}" method="post"&gt;

							&lt;p class="form-row form-row-first"&gt;
								&lt;label for="firstName"&gt;FirstName &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="text" th:field="*{firstName}" class="input-text"/&gt;
								&lt;p th:if="${#fields.hasErrors('firstName')}" th:errors="*{firstName}" th:errorclass="text-danger"&gt;Incorrect data&lt;/p&gt;
							&lt;/p&gt;
							
							&lt;p class="form-row form-row-first"&gt;
								&lt;label for="lastName"&gt;LastName &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="text" th:field="*{lastName}" class="input-text"/&gt;
								&lt;p th:if="${#fields.hasErrors('lastName')}" th:errors="*{lastName}" th:errorclass="text-danger"&gt;Incorrect data&lt;/p&gt;
								
							&lt;/p&gt;
							
							&lt;p class="form-row form-row-first"&gt;
								&lt;label for="email"&gt;Email &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="email" th:field="*{email}" class="input-text" placeholder="Email"/&gt;
								&lt;p th:if="${#fields.hasErrors('email')}" th:errors="*{email}" th:errorclass="text-danger"&gt;Incorrect data&lt;/p&gt;
							&lt;/p&gt;
							&lt;p class="form-row form-row-last"&gt;
								&lt;label for="password"&gt;Password &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="password" th:field="*{password}" class="input-text" placeholder="Password"/&gt;
								&lt;p th:if="${#fields.hasErrors('password')}" th:errors="*{password}" th:errorclass="text-danger"&gt;Incorrect data&lt;/p&gt;
							&lt;/p&gt;
							
							&lt;p class="form-row form-row-first"&gt;
								&lt;label for="phone"&gt;Phone &lt;span class="required"&gt;*&lt;/span&gt;
								&lt;/label&gt;
								&lt;input type="text" th:field="*{phone}" class="input-text"/&gt;
								&lt;p th:if="${#fields.hasErrors('phone')}" th:errors="*{phone}" th:errorclass="text-danger"&gt;Incorrect data&lt;/p&gt;
							&lt;/p&gt;
							&lt;div class="clear"&gt;&lt;/div&gt;


							&lt;p class="form-row"&gt;
								&lt;input type="submit" value="Login" class="button"/&gt;
							&lt;/p&gt;
							
							&lt;p&gt;
								&lt;div th:if="${info!=null}" class="alert alert-warning alert-dismissable" &gt;
									&lt;p&gt;&lt;i class="icon fa fa-warning"&gt;&lt;/i&gt; &lt;span th:text="${info}"&gt;&lt;/span&gt;&lt;/p&gt;
								&lt;/div&gt;   
							&lt;/p&gt;
							&lt;p class="lost_password"&gt;
								Existing Customer? &lt;a href="#" th:href="@{/login}" th:text="#{label.login}"&gt;Login&lt;/a&gt;
							&lt;/p&gt;
							
							&lt;div class="clear"&gt;&lt;/div&gt;
						&lt;/form&gt;
						
					&lt;/div&gt;
				&lt;/div&gt;
				
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;
    
&lt;/html&gt;</pre>

Now new customers can click on Register link and register themselves. Once the registration is successful he can login and proceed to checkout the cart.