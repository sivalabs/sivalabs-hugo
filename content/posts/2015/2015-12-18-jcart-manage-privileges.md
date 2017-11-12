---
title: 'JCart: Manage Privileges'
author: Siva
type: post
date: 2015-12-18T14:32:52+00:00
url: /2015/12/jcart-manage-privileges/
post_views_count:
  - 6
categories:
  - Java
tags:
  - jcart

---
This is the simplest usecase of entire JCart admin application :-). We need to show list of permissions configured in our system.
  
In our system each permission is more like access to a particular screen. For example, If a user has MANAGE_CATEGORIES permission then only he can access &#8220;Categories&#8221; screen. So these set of permission are something like implemented features set, hence we don&#8217;t need any provision to add/update/delete permissions dynamically.

We already have Permission JPA entity created and some sample data is already inserted using data.sql script.

First let us create a Spring Data JPA repository for Permission entity.

<pre class="brush: java">public interface PermissionRepository extends JpaRepository&lt;Permission, Integer&gt;
{

}
</pre>

In SecurityService implement a method to return all the permissions.

<pre class="brush: java">@Service
@Transactional
public class SecurityService
{
	@Autowired UserRepository userRepository;
	@Autowired PermissionRepository permissionRepository;
	...
	...
	public List&lt;Permission&gt; getAllPermissions() {
		return permissionRepository.findAll();
	}

}
</pre>

Create a SpringMVC controller to handle all Permission related actions (in our case we only need list all permissions).
  
This action should be available to only users who have &#8220;ROLE\_MANAGE\_PERMISSIONS&#8221;, so let us add @Secured annotation to PermissionController.

Instead of using Strings let us create constants for Permissions as follows:

<pre class="brush: java">public class SecurityUtil
{
	
	public static final String MANAGE_CATEGORIES = "ROLE_MANAGE_CATEGORIES";
	public static final String MANAGE_PRODUCTS = "ROLE_MANAGE_PRODUCTS";
	public static final String MANAGE_ORDERS = "ROLE_MANAGE_ORDERS";
	public static final String MANAGE_CUSTOMERS = "ROLE_MANAGE_CUSTOMERS";
	public static final String MANAGE_PAYMENT_SYSTEMS = "ROLE_MANAGE_PAYMENT_SYSTEMS";
	public static final String MANAGE_USERS = "ROLE_MANAGE_USERS";
	public static final String MANAGE_ROLES = "ROLE_MANAGE_ROLES";
	public static final String MANAGE_PERMISSIONS = "ROLE_MANAGE_PERMISSIONS";
	public static final String MANAGE_SETTINGS = "ROLE_MANAGE_SETTINGS";
	
}
</pre>

> Observe that each permission is prefixed with &#8220;ROLE_&#8221; which is expected by Spring Security.

<pre class="brush: java">@Controller
@Secured(SecurityUtil.MANAGE_PERMISSIONS)
public class PermissionController extends JCartAdminBaseController
{
	private static final String viewPrefix = "permissions/";
	
	@Autowired protected SecurityService securityService;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Permissions";
	}
	
	@RequestMapping(value="/permissions", method=RequestMethod.GET)
	public String listPermissions(Model model) {
		List&lt;Permission&gt; list = securityService.getAllPermissions();
		model.addAttribute("permissions",list);
		return viewPrefix+"permissions";
	}
}
</pre>

Now we left with one final step for this usecase, preparing thymeleaf view jcart-admin/src/main/resources/templates/permissions/permissions.html.

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;

&lt;head&gt;
&lt;title&gt;Permissions&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div layout:fragment="content"&gt;
		&lt;div class="row"&gt;
			&lt;div class="col-md-12"&gt;
				&lt;div class="box"&gt;
					&lt;div class="box-header"&gt;
						&lt;h3 class="box-title"&gt;List of Permissions&lt;/h3&gt;
					&lt;/div&gt;
					&lt;div class="box-body table-responsive no-padding"&gt;
						&lt;table class="table table-hover"&gt;
							&lt;tr&gt;
								&lt;th style="width: 10px"&gt;#&lt;/th&gt;
								&lt;th&gt;Name&lt;/th&gt;
								&lt;th&gt;Description&lt;/th&gt;
							&lt;/tr&gt;
							&lt;tr th:each="perm,iterStat : ${permissions}"&gt;
								&lt;td th:text="${iterStat.count}"&gt;1&lt;/td&gt;
								&lt;td th:text="${perm.name}"&gt;Permission Name&lt;/td&gt;
								&lt;td th:text="${perm.description}"&gt;Permission Description&lt;/td&gt;
							&lt;/tr&gt;

						&lt;/table&gt;
					&lt;/div&gt;
				&lt;/div&gt;
			&lt;/div&gt;
		&lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;
&lt;/html&gt;
</pre>

That&#8217;s it. Now run JCartAdminApplication.java and login and go click on Permissions menu in Left side navigation and you should be able to see list of all permissions.

Next we will start implementing Role management which is little bit more interesting.

Stay tuned 🙂