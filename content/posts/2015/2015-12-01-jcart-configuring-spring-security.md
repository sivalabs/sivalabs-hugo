---
title: 'JCart: Configuring Spring Security'
author: Siva
type: post
date: 2015-12-01T05:27:15+00:00
url: /2015/12/jcart-configuring-spring-security/
post_views_count:
  - 18
categories:
  - Java
tags:
  - jcart
  - SpringBoot

---
Our JCart Administration site should only be accessible to authorized users only. So, we are going to use SpringSecurity to define the security constraints.

Let us add the following spring-security dependencies to **jcart-admin/pom.xml**.

{{< highlight xml >}}
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
	<groupId>org.thymeleaf.extras</groupId>
	<artifactId>thymeleaf-extras-springsecurity4</artifactId>
</dependency>
{{</ highlight >}}

If we have predefined set of Roles then we can specify the URL patterns and its required Roles something like this:

{{< highlight java >}}http
	.authorizeRequests()
	    .antMatchers("/login","/login/form**","/register","/logout").permitAll()
	    .antMatchers("/admin","/admin/**").hasRole("ADMIN")
	    .anyRequest().authenticated()
	    .and()
{{</ highlight >}}

But we need provision to dynamically create new roles as well, hence we can&#8217;t statically define constraints using role names.

But in our JCart application, we have fixed list of permissions and then grouped them as Roles. So we can configure SpringSecurity to use Method Level Security by checking the permissions. 

SpringSecurity don&#8217;t have the support for Permissions. So we will follow suggestion given here <a href="http://springinpractice.com/2010/10/27/quick-tip-spring-security-role-based-authorization-and-permissions" target="_blank">http://springinpractice.com/2010/10/27/quick-tip-spring-security-role-based-authorization-and-permissions</a> where we consider the Permissions as Roles.

### UserRepository to get User by Email

{{< highlight java >}}public interface UserRepository extends JpaRepository<User, Integer>
{
	User findByEmail(String email);
}
{{</ highlight >}}

### SecurityService &#8211; Facade to all Security Related Methods

{{< highlight java >}}@Service
@Transactional
public class SecurityService
{
	@Autowired UserRepository userRepository;
	
	public User findUserByEmail(String email)
	{
	     return userRepository.findByEmail(email);
	}
}
{{</ highlight >}}

### Wrapper for SpringSecurity User

{{< highlight java >}}public class AuthenticatedUser extends org.springframework.security.core.userdetails.User
{

	private static final long serialVersionUID = 1L;
	private User user;
	
	public AuthenticatedUser(User user)
	{
	    super(user.getEmail(), user.getPassword(), getAuthorities(user));
	    this.user = user;
	}
	
	public User getUser()
	{
	    return user;
	}
	
	private static Collection<? extends GrantedAuthority> getAuthorities(User user)
	{
	Set<String> roleAndPermissions = new HashSet<>();
	List<Role> roles = user.getRoles();
	
	for (Role role : roles)
	{
	roleAndPermissions.add(role.getName());
	List<Permission> permissions = role.getPermissions();
	for (Permission permission : permissions)
	{
	roleAndPermissions.add("ROLE_"+permission.getName());
	}
	}
	String[] roleNames = new String[roleAndPermissions.size()];
	Collection<GrantedAuthority> authorities = AuthorityUtils.createAuthorityList(roleAndPermissions.toArray(roleNames));
	return authorities;
	}
}
{{</ highlight >}}

### Custom UserDetailsService Implementation

{{< highlight java >}}@Service
@Transactional
public class CustomUserDetailsService implements UserDetailsService
{
	@Autowired
	private SecurityService securityService;
	
	@Override
	public UserDetails loadUserByUsername(String userName)
	throws UsernameNotFoundException {
	User user = securityService.findUserByEmail(userName);
	if(user == null){
	throw new UsernameNotFoundException("Email "+userName+" not found");
	}
	return new AuthenticatedUser(user);
	}

}
{{</ highlight >}}

### SpringSecurity Configuration

{{< highlight java >}}@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, proxyTargetClass = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private UserDetailsService customUserDetailsService;
	
	@Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
	@Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
        	.userDetailsService(customUserDetailsService)
        	.passwordEncoder(passwordEncoder());
    }
	
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        	.csrf().disable()
            .authorizeRequests()
            	.antMatchers("/resources/**", "/webjars/**","/assets/**").permitAll()
                .antMatchers("/", "/forgotPwd","/resetPwd").permitAll()
                .anyRequest().authenticated()
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
}
{{</ highlight >}}

### Access Denied Exception Handler

{{< highlight java >}}@Controller
public class ErrorController
{	
	@RequestMapping("/403")
	public String accessDenied()
	{
	return "error/accessDenied";
	}
	
}
{{</ highlight >}}

### Abstract Controller with Common Methods

Let us create a base Abstract Controller to have the common methods by all controllers.

{{< highlight java >}}public abstract class JCartAdminBaseController
{	
	@Autowired protected MessageSource messageSource;
	
	public String getMessage(String code)
	{
		return messageSource.getMessage(code, null, null);
	}
	
	public String getMessage(String code, String defaultMsg)
	{
		return messageSource.getMessage(code, null, defaultMsg, null);
	}
	
	@ModelAttribute("authenticatedUser")
    public AuthenticatedUser authenticatedUser(@AuthenticationPrincipal AuthenticatedUser authenticatedUser)
    {
        return authenticatedUser;
    }
	
	public static AuthenticatedUser getCurrentUser() {

	    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
	    if (principal instanceof AuthenticatedUser) {
	    	return ((AuthenticatedUser) principal);
	    }
	    // principal object is either null or represents anonymous user -
	    // neither of which our domain User object can represent - so return null
	    return null;
	}

	public static boolean isLoggedIn() {
	    return getCurrentUser() != null;
	}
}
{{</ highlight >}}

Observe how we injected Authenticated User object using **@AuthenticationPrincipal** and exposed as a ModelAttribute so that we can reference it in any of our templates. Also we have another method which return the AuthenticatedUser so that we can use it in any of our Controllers to access currently logged in user object, say to set CreatedBy/UpdatedBy objects on our JPA Entities.

Now our Controllers can extend the JCartAdminBaseController class as follows:

{{< highlight java >}}@Controller
public class HomeController extends JCartAdminBaseController
{
	...
}
{{</ highlight >}}

### Registering SpringSecurityDialect with Thymeleaf

In order to use SpringSecurity dialects features in Thymeleaf templates we need to register SpringSecurityDialect as an additional dialect. We can do this simply by registering a SpringSecurityDialect bean.

{{< highlight java >}}@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{   
	...
	
	@Bean
	public SpringSecurityDialect securityDialect() {
	    return new SpringSecurityDialect();
	}
}
{{</ highlight >}}

For more info read <a href="http://www.thymeleaf.org/doc/articles/springsecurity.html" target="_blank">http://www.thymeleaf.org/doc/articles/springsecurity.html</a>

### Using SpringSecurity in Thymeleaf Templates

Now we can show the Left Nav Menu options by checking whether the logged in user has the Permission or not.

{{< highlight html >}}
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3">

<body>
	<span sec:authentication="principal.user.name">User</span>
	

<p>
  Welcome <span th:text="${authenticatedUser.user.name}">User</span>!
</p>
	
	

<li sec:authorize="hasRole('ROLE_MANAGE_CATEGORIES')">
  <a href="#" th:href="@{'/categories'}"><i class="fa fa-folder-open"></i> <span>Categories</span></a>
  	
</li>
    

<li sec:authorize="hasRole('ROLE_MANAGE_PRODUCTS')">
  <a href="#" th:href="@{'/products'}"><i class="fa fa-file"></i> <span>Products</span></a>
  	
</li>
	
   </body>
</html>
{{</ highlight >}}

In our Controllers we can check for Permissions as follows:

{{< highlight java >}}@Controller
@Secured("ROLE_MANAGE_CATEGORIES")
public class CategoryController extends JCartAdminBaseController
{
	...
}
{{</ highlight >}}

### Registering a Filter After SpringSecurity Filter

I would like to show the currently selected Left Nav Menu link as Active. For that I thought of keep tracking the clicked URL and store the ACTIVE_MENU value in model and then conditionally apply Active style in Thymeleaf template.

For this I thought of registering a Filter filter after SpringSecurityFilter. But SpringSecurity Filter is registered with LOWEST_PRIORITY order automatically. So we need to get it done using the hack explained here <a href="http://stackoverflow.com/questions/25957879/filter-order-in-spring-boot" target="_blank">http://stackoverflow.com/questions/25957879/filter-order-in-spring-boot</a>

{{< highlight java >}}@Configuration
public class WebConfig extends WebMvcConfigurerAdapter
{  
	...
	...
	
	@Autowired 
	private PostAuthorizationFilter postAuthorizationFilter;
	    	
	@Bean
	public FilterRegistrationBean securityFilterChain(@Qualifier(AbstractSecurityWebApplicationInitializer.DEFAULT_FILTER_NAME) Filter securityFilter) {
	    FilterRegistrationBean registration = new FilterRegistrationBean(securityFilter);
	    registration.setOrder(Integer.MAX_VALUE - 1);
	    registration.setName(AbstractSecurityWebApplicationInitializer.DEFAULT_FILTER_NAME);
	    return registration;
	}

	@Bean
	public FilterRegistrationBean PostAuthorizationFilterRegistrationBean() {
	    FilterRegistrationBean registrationBean = new FilterRegistrationBean();
	    registrationBean.setFilter(postAuthorizationFilter);
	    registrationBean.setOrder(Integer.MAX_VALUE);
	    return registrationBean;
	}
}
{{</ highlight >}}

{{< highlight java >}}@Component
public class PostAuthorizationFilter extends OncePerRequestFilter
{	
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
	throws ServletException, IOException
	{
	String uri = request.getRequestURI();	
	String menu = ...;
	request.setAttribute("CURRENT_MENU", menu);
	
	chain.doFilter(request, response);
	}
	
}
{{</ highlight >}}

For complete PostAuthorizationFilter code, please check in github repository <a href="https://github.com/sivaprasadreddy/jcart" target="_blank">https://github.com/sivaprasadreddy/jcart</a>.

Now we have Spring Security configured for our application. In our next posts we will see how to protect Controller methods at class/method level.
