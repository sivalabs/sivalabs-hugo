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
  
In our system each permission is more like access to a particular screen. For example, If a user has MANAGE_CATEGORIES permission then only he can access &#8220;Categories&#8221; screen. So these set of permission are something like implemented features set, hence we don't need any provision to add/update/delete permissions dynamically.

We already have Permission JPA entity created and some sample data is already inserted using data.sql script.

First let us create a Spring Data JPA repository for Permission entity.

```java
public interface PermissionRepository extends JpaRepository<Permission, Integer>
{

}
```

In SecurityService implement a method to return all the permissions.

```java
@Service
@Transactional
public class SecurityService
{
	@Autowired UserRepository userRepository;
	@Autowired PermissionRepository permissionRepository;
	...
	...
	public List<Permission> getAllPermissions() {
		return permissionRepository.findAll();
	}

}
```

Create a SpringMVC controller to handle all Permission related actions (in our case we only need list all permissions).
  
This action should be available to only users who have &#8220;ROLE\_MANAGE\_PERMISSIONS&#8221;, so let us add @Secured annotation to PermissionController.

Instead of using Strings let us create constants for Permissions as follows:

```java
public class SecurityUtil
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
```

> Observe that each permission is prefixed with &#8220;ROLE_&#8221; which is expected by Spring Security.

```java
@Controller
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
		List<Permission> list = securityService.getAllPermissions();
		model.addAttribute("permissions",list);
		return viewPrefix+"permissions";
	}
}
```

Now we left with one final step for this usecase, preparing thymeleaf view jcart-admin/src/main/resources/templates/permissions/permissions.html.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout">

<head>
<title>Permissions</title>
</head>
<body>

	<div layout:fragment="content">
		<div class="row">
			<div class="col-md-12">
				<div class="box">
					<div class="box-header">
						<h3 class="box-title">List of Permissions</h3>
					</div>
					<div class="box-body table-responsive no-padding">
						<table class="table table-hover">
							<tr>
								<th style="width: 10px">#</th>
								<th>Name</th>
								<th>Description</th>
							</tr>
							<tr th:each="perm,iterStat : ${permissions}">
								<td th:text="${iterStat.count}">1</td>
								<td th:text="${perm.name}">Permission Name</td>
								<td th:text="${perm.description}">Permission Description</td>
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

That's it. Now run JCartAdminApplication.java and login and go click on Permissions menu in Left side navigation and you should be able to see list of all permissions.

Next we will start implementing Role management which is little bit more interesting.

Stay tuned 🙂
