---
title: 'JCart : Initial code setup for ShoppingCart'
author: Siva
type: post
date: 2015-12-30T14:15:54+00:00
url: /2015/12/jcart-initial-code-setup-for-shoppingcart/
post_views_count:
  - 7
categories:
  - Java
tags:
  - jcart

---
First we will start with setting up the initial code using SpringBoot. We have already discussed in <a href="http://sivalabs.in/jcart-initial-code-setup/" target="_blank">JCart: Initial Code SetUp</a>  article about creating a maven module **jcart-site** which will be our ShoppingCart application. In that article we have shown what springboot dependencies to add as well.

Just to recap we will be using SpringBoot, SpringMVC, Thymeleaf, JPA for our ShoppingCart application.

**jcart-site/pom.xml**

<pre class="lang:xhtml decode:true ">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd"&gt;
	&lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;
	&lt;parent&gt;
		&lt;groupId&gt;com.sivalabs&lt;/groupId&gt;
		&lt;artifactId&gt;jcart&lt;/artifactId&gt;
		&lt;version&gt;1.0&lt;/version&gt;
	&lt;/parent&gt;
	&lt;artifactId&gt;jcart-site&lt;/artifactId&gt;

	&lt;build&gt;
		&lt;plugins&gt;
			&lt;plugin&gt;
				&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
				&lt;artifactId&gt;spring-boot-maven-plugin&lt;/artifactId&gt;
			&lt;/plugin&gt;
		&lt;/plugins&gt;
	&lt;/build&gt;

	&lt;dependencies&gt;
		&lt;dependency&gt;
			&lt;groupId&gt;com.sivalabs&lt;/groupId&gt;
			&lt;artifactId&gt;jcart-core&lt;/artifactId&gt;
			&lt;version&gt;${project.version}&lt;/version&gt;
		&lt;/dependency&gt;
		&lt;dependency&gt;
			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
			&lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
		&lt;/dependency&gt;
		&lt;dependency&gt;
			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
			&lt;artifactId&gt;spring-boot-starter-thymeleaf&lt;/artifactId&gt;
		&lt;/dependency&gt;
		&lt;dependency&gt;
			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
			&lt;artifactId&gt;spring-boot-starter-security&lt;/artifactId&gt;
		&lt;/dependency&gt;
		&lt;dependency&gt;
      		&lt;groupId&gt;org.thymeleaf.extras&lt;/groupId&gt;
      		&lt;artifactId&gt;thymeleaf-extras-springsecurity4&lt;/artifactId&gt;
    	&lt;/dependency&gt;
		&lt;dependency&gt;
			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
			&lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;
			&lt;scope&gt;test&lt;/scope&gt;
		&lt;/dependency&gt;		
		&lt;dependency&gt;
			&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
			&lt;artifactId&gt;spring-boot-devtools&lt;/artifactId&gt;
			&lt;optional&gt;true&lt;/optional&gt;
		&lt;/dependency&gt;
		&lt;dependency&gt;
			&lt;groupId&gt;commons-io&lt;/groupId&gt;
			&lt;artifactId&gt;commons-io&lt;/artifactId&gt;
			&lt;version&gt;2.3&lt;/version&gt;
		&lt;/dependency&gt;
	&lt;/dependencies&gt;
&lt;/project&gt;</pre>

For our JCart &#8211; Admin application we have used **AdminLTE** (<a href="https://almsaeedstudio.com/preview" target="_blank">https://almsaeedstudio.com/preview</a>) theme which is based on Bootstrap with nice coloring scheme. It looks good for Administration kind of applications but not so good for a public facing e-commerce application, IMHO.

As I said earlier I am not a UI designer, so again I have googled for free e-commerce templates and found **Ustora HTML5 ECommerce Template** (<a href="https://www.freshdesignweb.com/ustora/" target="_blank">https://www.freshdesignweb.com/ustora/</a>)
  
which looks good to me. So we will be using this template for our ShoppingCart screens.

### Configuring HTTPS/SSL

As we discussed in <a href="http://sivalabs.in/jcart-configuring-https-ssltls/" target="_blank">JCart-Admin Configuring HTTPS/SSL</a> post we will generate the keystore file and copy it to **jcart-site/src/main/resources/** directory.

Configure the SSL related configuration properties in **jcart-site/src/main/resources/application-default.properties**

**server.port=8443**
  
 **server.ssl.key-store=classpath:jcartsitekeystore.p12**
  
 **server.ssl.key-store-password=jcartsite**
  
 **server.ssl.keyStoreType=PKCS12**
  
 **server.ssl.keyAlias=jcartsitetomcat**

### WebMVC Configuration

We will create **com.sivalabs.jcart.site.config.WebConfig.java** for configuring SpringMVC components like ViewControllers, Interceptors, TemplateResolvers, SpringSecurityDialect and EmbeddedTomcatConnector as follows:

<pre class="lang:java decode:true ">@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{

	@Value("${server.port:8443}") private int serverPort;
	
	@Autowired
    private MessageSource messageSource;

    @Override
    public Validator getValidator() {
        LocalValidatorFactoryBean factory = new LocalValidatorFactoryBean();
        factory.setValidationMessageSource(messageSource);
        return factory;
    }
    
	@Override
	public void addViewControllers(ViewControllerRegistry registry)
	{
		super.addViewControllers(registry);
        registry.addViewController("/login").setViewName("login");
        registry.addViewController("/register").setViewName("register");
		registry.addRedirectViewController("/", "/home");
		
	}
	
	@Override
	public void addInterceptors(InterceptorRegistry registry)
	{
		super.addInterceptors(registry);
	}

	@Bean 
    public ClassLoaderTemplateResolver emailTemplateResolver(){ 
		ClassLoaderTemplateResolver emailTemplateResolver = new ClassLoaderTemplateResolver(); 
		emailTemplateResolver.setPrefix("email-templates/"); 
		emailTemplateResolver.setSuffix(".html"); 
		emailTemplateResolver.setTemplateMode("HTML5"); 
		emailTemplateResolver.setCharacterEncoding("UTF-8"); 
		emailTemplateResolver.setOrder(2);
		
		return emailTemplateResolver; 
    }
	
	@Bean
	public SpringSecurityDialect securityDialect() {
	    return new SpringSecurityDialect();
	}

	@Bean
	public EmbeddedServletContainerFactory servletContainer() {
		TomcatEmbeddedServletContainerFactory tomcat = new TomcatEmbeddedServletContainerFactory() {
			@Override
			protected void postProcessContext(Context context) {
				SecurityConstraint securityConstraint = new SecurityConstraint();
				securityConstraint.setUserConstraint("CONFIDENTIAL");
				SecurityCollection collection = new SecurityCollection();
				collection.addPattern("/*");
				securityConstraint.addCollection(collection);
				context.addConstraint(securityConstraint);
			}
		};

		tomcat.addAdditionalTomcatConnectors(initiateHttpConnector());
		return tomcat;
	}

	private Connector initiateHttpConnector() {
		Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
		connector.setScheme("http");
		connector.setPort(8080);
		connector.setSecure(false);
		connector.setRedirectPort(serverPort);

		return connector;
	}
}</pre>

Note that for ShoppingCart application we will be running embedded tomcat server on **https://host:8443** and call to **http://host:8080** port will be redirected to **https://host:8443**.

### Configuring SpringSecurity

As it is a public facing e-commerce site customers can browse through catalog products and add products to cart without requiring to login. But in order to checkout we will redirect the customer to login if he/she is not already loggedin. Also there are some URL that we would like to protect like customer&#8217;s **MyAccount** page, **Order History** page etc.

So, for ShoppingCart application, Customer would become the user.

**Create SpringSecurity User Wrapper AuthenticatedUser**

<pre class="lang:java decode:true ">package com.sivalabs.jcart.admin.security;

import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import com.sivalabs.jcart.entities.Customer;

public class AuthenticatedUser extends org.springframework.security.core.userdetails.User
{

	private static final long serialVersionUID = 1L;
	private Customer customer;
	
	public AuthenticatedUser(Customer customer)
	{
		super(customer.getEmail(), customer.getPassword(), getAuthorities(customer));
		this.customer = customer;
	}
	public Customer getCustomer()
	{
		return customer;
	}
	private static Collection&lt;? extends GrantedAuthority&gt; getAuthorities(Customer customer)
	{
		Collection&lt;GrantedAuthority&gt; authorities = AuthorityUtils.createAuthorityList("ROLE_USER");
		return authorities;
	}
}</pre>

**Create Spring Data JPA Repository for Customer Entity jcart-core/src/main/java/com/sivalabs/jcart/customers/CustomerRepository.java as follows:**

<pre class="lang:java decode:true ">public interface CustomerRepository extends JpaRepository&lt;Customer, Integer&gt; {
	Customer findByEmail(String email);
}</pre>

**Create jcart-core/src/main/java/com/sivalabs/jcart/customers/CustomerService.java to implement all Customer related operations.**

<pre class="lang:java decode:true ">@Service
@Transactional
public class CustomerService 
{
	@Autowired 
	private CustomerRepository customerRepository;
	
	public Customer getCustomerByEmail(String email) {
		return customerRepository.findByEmail(email);
	}
	
}</pre>

**Create com.sivalabs.jcart.admin.security.CustomUserDetailsService.java which implements SpringSecurity&#8217;s UserDetailsService.**

<pre class="lang:java decode:true ">@Service
@Transactional
public class CustomUserDetailsService implements UserDetailsService
{
	@Autowired CustomerService customerService;
	
	@Override
	public UserDetails loadUserByUsername(String email)
			throws UsernameNotFoundException {
		Customer customer = customerService.getCustomerByEmail(email);
		if(customer == null){
			throw new UsernameNotFoundException("Email "+email+" not found");
		}
		return new AuthenticatedUser(customer);
	}

}
</pre>

**Create com.sivalabs.jcart.site.security.WebSecurityConfig.java to configure SpringSecurity configuration.**

<pre class="lang:java decode:true ">@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, proxyTargetClass = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private UserDetailsService customUserDetailsService;
	
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        	.csrf().disable()
            .authorizeRequests()
            	.antMatchers("/resources/**", "/webjars/**","/assets/**").permitAll()
                .antMatchers("/", "/register", "/forgotPwd","/resetPwd").permitAll()
                .antMatchers("/myAccount","/checkout","/orders").authenticated()
                .and()
            .formLogin()
                .loginPage("/login")
                .defaultSuccessUrl("/home")
                .failureUrl("/login?error")
                .permitAll()
                .and()
            .logout()
            	.logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            	.permitAll()
                .and()
            .exceptionHandling().accessDeniedPage("/403");
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
        	.userDetailsService(customUserDetailsService)
        	.passwordEncoder(passwordEncoder());
    }
}
</pre>

Finally, let us create a simple **HomeController** to handle /home request and render **home.html** view.

<pre class="lang:java decode:true ">@Controller
public class HomeController
{		
	@RequestMapping("/home")
	public String home(Model model)
	{
		return "home";
	}	
}</pre>

<pre class="lang:xhtml decode:true ">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"&gt;
	  
&lt;head&gt;
    &lt;meta charset="utf-8"/&gt;
    &lt;meta http-equiv="X-UA-Compatible" content="IE=edge"/&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"/&gt;
    &lt;title&gt;QuilCart&lt;/title&gt;
    
&lt;/head&gt;
&lt;body&gt;
   &lt;h3&gt;Welcome to QuilCart&lt;/h3&gt;	    
&lt;/body&gt;
&lt;/html&gt;</pre>

Now run the application and point your browser to **http://localhost:8080**. It should automatically redirect you to **https://localhost:8443/home** and show home.html view.

In our next post we will setup the UI Layout using Thymeleaf templates and start developing screens.