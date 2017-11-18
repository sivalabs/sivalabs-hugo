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

{{< highlight java >}}
public interface CustomerRepository extends JpaRepository<Customer, Integer>{
	Customer findByEmail(String email);
}
{{</ highlight >}}

{{< highlight java >}}
@Service
@Transactional
public class CustomerService 
{
	@Autowired 
	CustomerRepository customerRepository;
	
	public Customer getCustomerByEmail(String email) {
		return customerRepository.findByEmail(email);
	}

	public Customer createCustomer(Customer customer) {
		return customerRepository.save(customer);
	}
}
{{</ highlight >}}

{{< highlight java >}}
@Component
public class CustomerValidator implements Validator
{
	@Autowired 
	private CustomerService custmoerService;

	@Override
	public boolean supports(Class<?> clazz) {
		return Customer.class.isAssignableFrom(clazz);
	}

	@Override
	public void validate(Object target, Errors errors) {
		Customer customer = (Customer) target;
		Customer customerByEmail = custmoerService
		        .getCustomerByEmail(customer.getEmail());
		if(customerByEmail != null){
			errors.rejectValue("email", "error.exists", 
			new Object[]{customer.getEmail()}, 
			"Email "+customer.getEmail()+" already in use");
		}
	}
	
}
{{</ highlight >}}

Let us implement the **CustomerController** registration handler methods as follows:

{{< highlight java >}}
@Controller
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
	protected String register(
	    @Valid @ModelAttribute("customer") Customer customer, 
		BindingResult result, Model model, 
		RedirectAttributes redirectAttributes)
	{
		customerValidator.validate(customer, result);
		if(result.hasErrors()){
			return "register";
		}
		String password = customer.getPassword();
		String encodedPwd = passwordEncoder.encode(password);
		customer.setPassword(encodedPwd);
		
		Customer persistedCustomer = customerService.createCustomer(customer);
		logger.debug("Created new Customer with id : {} and email : {}", 
		    persistedCustomer.getId(), persistedCustomer.getEmail());
		redirectAttributes.addFlashAttribute("info", 
		            "Customer created successfully");
		return "redirect:/login";
	}
	
}
{{</ highlight >}}

Finally let us create the **register.html** thymeleaf view as follows:

{{< highlight html>}}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
<head>
	<title>Register</title>
</head>
<body>
	<div layout:fragment="content">
		<div class="single-product-area">
			<div class="zigzag-bottom"></div>
			<div class="container">
				
				<div class="row">
					
					<div class="col-md-offset-3 col-md-6" >
						<form id="login-form-wrap" th:action="@{/register}" th:object="${customer}" method="post">

							<p class="form-row form-row-first">
								<label for="firstName">FirstName <span class="required">*</span>
								</label>
								<input type="text" th:field="*{firstName}" class="input-text"/>
								<p th:if="${#fields.hasErrors('firstName')}" th:errors="*{firstName}" th:errorclass="text-danger">Incorrect data</p>
							</p>
							
							<p class="form-row form-row-first">
								<label for="lastName">LastName <span class="required">*</span>
								</label>
								<input type="text" th:field="*{lastName}" class="input-text"/>
								<p th:if="${#fields.hasErrors('lastName')}" th:errors="*{lastName}" th:errorclass="text-danger">Incorrect data</p>
								
							</p>
							
							<p class="form-row form-row-first">
								<label for="email">Email <span class="required">*</span>
								</label>
								<input type="email" th:field="*{email}" class="input-text" placeholder="Email"/>
								<p th:if="${#fields.hasErrors('email')}" th:errors="*{email}" th:errorclass="text-danger">Incorrect data</p>
							</p>
							<p class="form-row form-row-last">
								<label for="password">Password <span class="required">*</span>
								</label>
								<input type="password" th:field="*{password}" class="input-text" placeholder="Password"/>
								<p th:if="${#fields.hasErrors('password')}" th:errors="*{password}" th:errorclass="text-danger">Incorrect data</p>
							</p>
							
							<p class="form-row form-row-first">
								<label for="phone">Phone <span class="required">*</span>
								</label>
								<input type="text" th:field="*{phone}" class="input-text"/>
								<p th:if="${#fields.hasErrors('phone')}" th:errors="*{phone}" th:errorclass="text-danger">Incorrect data</p>
							</p>
							<div class="clear"></div>


							<p class="form-row">
								<input type="submit" value="Login" class="button"/>
							</p>
							
							<p>
								<div th:if="${info!=null}" class="alert alert-warning alert-dismissable" >
									<p><i class="icon fa fa-warning"></i> <span th:text="${info}"></span></p>
								</div>   
							</p>
							<p class="lost_password">
								Existing Customer? <a href="#" th:href="@{/login}" th:text="#{label.login}">Login</a>
							</p>
							
							<div class="clear"></div>
						</form>
						
					</div>
				</div>
				
			</div>
		</div>
	</div>
	
</body>
    
</html>
{{</ highlight >}}

Now new customers can click on Register link and register themselves. 
Once the registration is successful he can login and proceed to checkout the cart.
