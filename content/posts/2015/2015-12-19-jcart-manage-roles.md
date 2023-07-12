---
title: 'JCart: Manage Roles'
author: Siva
type: post
date: 2015-12-19T03:16:38+00:00
url: /jcart-manage-roles/
categories:
  - Java
tags:
  - jcart

---
In our previous post **Manage Privileges – List all privileges** we have implemented the functionality to show list of permissions. In this post we will implement Role management such as listing all Roles, creating new Role, editing Role permissions etc.

Basically a Role is nothing a but group of Permissions assigned so that giving access to a set of action to user will become easy by assigning Roles.

In this post we are going to see lot of code snippets, so I would suggest to clone the repo <a href="https://github.com/sivaprasadreddy/jcart" target="_blank">https://github.com/sivaprasadreddy/jcart</a>.

We already have **Role** JPA entity created and some sample data is already inserted using data.sql script.

## List all Roles

First let us create a Spring Data JPA repository for Role entity.

```java
public interface RoleRepository extends JpaRepository<Role, Integer>
{
	Role findByName(String name);
}
```

In **SecurityService** implement a method to return all the permissions.

```java
@Service
@Transactional
public class SecurityService
{
	@Autowired UserRepository userRepository;
	@Autowired PermissionRepository permissionRepository;
	@Autowired RoleRepository roleRepository;
	...
	...
		
	public List<Role> getAllRoles() {
		return roleRepository.findAll();
	}

}
```

Create a SpringMVC controller to handle all Role related actions.
  
This action should be available to only users who have &#8220;**ROLE\_MANAGE\_ROLES**&#8220;, so let us add @Secured annotation to **RoleController**.

```java
@Controller
@Secured(SecurityUtil.MANAGE_ROLES)
public class RoleController extends JCartAdminBaseController
{
	private static final String viewPrefix = "roles/";
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Roles";
	}
		
	@RequestMapping(value="/roles", method=RequestMethod.GET)
	public String listRoles(Model model) {
		List<Role> list = securityService.getAllRoles();
		model.addAttribute("roles",list);
		return viewPrefix+"roles";
	}
	
}
```

Create thymeleaf view **jcart-admin/src/main/resources/templates/roles/roles.html**.

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout">

<head>
<title>Roles</title>
</head>
<body>

	<div layout:fragment="content">
		<div class="row">
			<div class="col-md-12">
				<div class="box">
					<div class="box-header">
						<h3 class="box-title">List of Roles</h3>
						<div class="box-tools">
							<div class="input-group" style="width: 150px;">
								<a class="btn btn-sm btn-default" th:href="@{/roles/new}"><i
									class="fa fa-plus-circle"></i> New Role</a>
							</div>
						</div>
					</div>
					<div class="box-body table-responsive no-padding">
						<table class="table table-hover">
							<tr>
								<th style="width: 10px">#</th>
								<th>Name</th>
								<th>Description</th>
								<th>Edit</th>

							</tr>
							<tr th:each="role,iterStat : ${roles}">
								<td><a th:href="@{/roles/{id}(id=${role.id})}"><span
										th:text="${iterStat.count}">1</span></a></td>
								<td th:text="${role.name}">Role Name</td>
								<td th:text="${role.description}">Role Description</td>
								<td><a th:href="@{/roles/{id}(id=${role.id})}"
										class="btn btn-sm btn-default">
										<i class="fa fa-edit"></i>Edit
									</a>
								</td>
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

Observe that though we have not yet implemented functionality for adding new Role or view/edit Role we have added &#8220;New Role&#8221; button and links to view/edit Role info which we are going to implement next.

Now run **JCartAdminApplication.java** and login and go click on Roles menu in Left side navigation and you should be able to see list of all Roles.

## Create New Role

In our List Roles screen we have added a button &#8220;New Role&#8221; which will take you to &#8220;roles/new&#8221; URL. Let us implement SpringMVC controller methods to handle showing new role form and role creation POST method.

While showing New Role form we should also show list of permission that we would like to add to the newly creating Role.

Also we want to validate the New Role form to check for any missing mandatory details.

First let us implement **RoleValidator** **jcart-admin/src/main/java/com/sivalabs/jcart/admin/web/validators/RoleValidator.java** as follows:

```java
package com.sivalabs.jcart.admin.web.validators;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

import com.sivalabs.jcart.entities.Role;
import com.sivalabs.jcart.security.SecurityService;


@Component
public class RoleValidator implements Validator
{
	@Autowired protected MessageSource messageSource;
	@Autowired protected SecurityService securityService;
	
	@Override
	public boolean supports(Class<?> clazz)
	{
		return Role.class.isAssignableFrom(clazz);
	}
	
	@Override
	public void validate(Object target, Errors errors)
	{
		Role role = (Role) target;
		String name = role.getName();
		Role RoleByName = securityService.getRoleByName(name);
		if(RoleByName != null){
			errors.rejectValue("name", "error.exists",
								new Object[]{name}, 
								"Role "+name+" already exists");
		}
	}	
}
```

One thing to notice here is we already have **BeanValidation** annotation **@NotEmpty** on **&#8220;name&#8221;** property which SpringMVC automatically checks for. But we also need to check whether the new is already in use or not by talking to database.

Also observe that we are using message keys from ResourceBundle **messages.properties** to have internationalization.

Add the following properties to **messages.properties**

```properties
error.required={0} is required
error.invalid={0} is invalid
error.exists={0} already exists
```

Now we need to implement **getRoleByName()** and **createRole()** methods in our **SecurityService**.

```java
@Service
@Transactional
public class SecurityService
{
	public Role getRoleByName(String roleName)
	{
		return roleRepository.findByName(roleName);
	}
	
	public Role createRole(Role role)
	{
		Role roleByName = getRoleByName(role.getName());
		if(roleByName != null){
			throw new JCartException("Role "+role.getName()+" already exist"); //TODO; i18n
		}
		List<Permission> persistedPermissions = new ArrayList<>();
		List<Permission> permissions = role.getPermissions();
		if(permissions != null){
			for (Permission permission : permissions) {
				if(permission.getId() != null)
				{
					persistedPermissions.add(permissionRepository.findOne(permission.getId()));
				}
			}
		}
		
		role.setPermissions(persistedPermissions);
		return roleRepository.save(role);
	}
	
}
```

I hope these 2 methods are self explanatory.

Now let us implement the request handler methods in **RoleController** as follows:

```java
@Controller
@Secured(SecurityUtil.MANAGE_ROLES)
public class RoleController extends JCartAdminBaseController
{
	private static final String viewPrefix = "roles/";
	
	@Autowired protected SecurityService securityService;
	@Autowired private RoleValidator roleValidator;

	...
	...
	
	@ModelAttribute("permissionsList")
	public List<Permission> permissionsList(){
		return securityService.getAllPermissions();
	}
		
	@RequestMapping(value="/roles/new", method=RequestMethod.GET)
	public String createRoleForm(Model model) {
		Role role = new Role();
		model.addAttribute("role",role);
		return viewPrefix+"create_role";
	}

	@RequestMapping(value="/roles", method=RequestMethod.POST)
	public String createRole(@Valid @ModelAttribute("role") Role role, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {
		roleValidator.validate(role, result);
		if(result.hasErrors()){
			return viewPrefix+"create_role";
		}
		Role persistedRole = securityService.createRole(role);
		logger.debug("Created new role with id : {} and name : {}", persistedRole.getId(), persistedRole.getName());
		redirectAttributes.addFlashAttribute("info", "Role created successfully"); //TODO; i18n
		return "redirect:/roles";
	}

}
```

We need to add List for both create Role and update Role forms as well. So added as a separate method with **@ModelAttribute** instead of adding List to Model in 2 places.

> Note that BindingResult result argument should be next to @ModelAttribute property to have validation errors population working properly.

Let us create the CreateRole thymeleaf view **jcart-admin/src/main/resources/templates/roles/create_role.html** as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
<head>
    <title>Roles - New</title>
</head>
<body>
	
	<div layout:fragment="content">
		
		  <div class="box box-warning">
			<div class="box-header with-border">
			  <h3 class="box-title">Create New Role</h3>
			</div>
			<div class="box-body">
			  <form role="form" th:action="@{/roles}" th:object="${role}" method="post">
				<p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" th:class="text-red">Incorrect data</p>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('name')}? 'has-error'">
				  <label>Name</label>
				  <input type="text" class="form-control" name="name" th:field="*{name}" placeholder="Enter Role Name"/>
				  <p th:if="${#fields.hasErrors('name')}" th:errors="*{name}" th:class="text-red">Incorrect data</p>
				</div>
				
				
				<div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'">
				  <label>Description</label>
				  <textarea class="form-control" rows="3" name="description" th:field="*{description}" placeholder="Enter Role Description"></textarea>
				  <p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" th:class="text-red">Incorrect data</p>
				</div>
				
				<div class="form-group">
					<label>Permissions</label>
					<div>
					  <p th:each="permission,rowStat : ${permissionsList}">
						<input type="checkbox" th:field="*{permissions[__${rowStat.index}__].id}" th:value="${permission.id}" />
						<label th:text="${permission.name}">Permission</label>
					  </p>
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
```

### Few things to observe:

  * We are applying css error class if a field has error using th:classappend=&#8221;${#fields.hasErrors(&#8216;name')}? &#8216;has-error'&#8221;
  * Showing error if a field has error using <p th:if=&#8221;${#fields.hasErrors(&#8216;name')}&#8221; th:errors=&#8221;*{name}&#8221; th:class=&#8221;text-red&#8221;>Incorrect data</p>
  * We are iterating through List<Permission> showing them as checkboxes and binding the selected checkboxes (Permission Ids) to &#8220;id&#8221; property of List<Permission> permissions property in Role as follows:

```html
<p th:each="permission,rowStat : ${permissionsList}">
	<input type="checkbox" th:field="*{permissions[__${rowStat.index}__].id}" th:value="${permission.id}" />
	<label th:text="${permission.name}">Permission</label>
</p>
```

Now you can run the application and see the New Role creation working.

## Update Role

When user clicks on Edit button in List Roles screen we will take the user to Edit Role form where user can update the role description and assigned Permissions.

> Implementing the Edit Role screen is little bit tricky. We load the selected Role object which has a list of assigned Permission objects. But in screen we need to show all the available Permissions with the assigned permissions selected. As we are using indexed property binding ***{permissions[\_\_${rowStat.index}\_\_].id}** the role.permission objects index should match with the all List objects.

Let us implement the SecurityService methods **getRoleById()** and **updateRole()** as follows:

```java
@Service
@Transactional
public class SecurityService
{
	public Role updateRole(Role role)
	{
		Role persistedRole = getRoleById(role.getId());
		if(persistedRole == null){
			throw new JCartException("Role "+role.getId()+" doesn't exist");
		}
		persistedRole.setDescription(role.getDescription());
		List<Permission> updatedPermissions = new ArrayList<>();
		List<Permission> permissions = role.getPermissions();
		if(permissions != null){
			for (Permission permission : permissions) {
				if(permission.getId() != null)
				{
					updatedPermissions.add(permissionRepository.findOne(permission.getId()));
				}
			}
		}
		persistedRole.setPermissions(updatedPermissions);
		return roleRepository.save(persistedRole);
	}
	
	public Role getRoleById(Integer id) {
		return roleRepository.findOne(id);
	} 
}
```

Implement the EditRole and Update Role handler methods as follows:

```java
@Controller
@Secured(SecurityUtil.MANAGE_ROLES)
public class RoleController extends JCartAdminBaseController
{
	...
	...

	@RequestMapping(value="/roles/{id}", method=RequestMethod.GET)
	public String editRoleForm(@PathVariable Integer id, Model model) {
		Role role = securityService.getRoleById(id);
		Map<Integer, Permission> assignedPermissionMap = new HashMap<>();
		List<Permission> permissions = role.getPermissions();
		for (Permission permission : permissions)
		{
			assignedPermissionMap.put(permission.getId(), permission);
		}
		List<Permission> rolePermissions = new ArrayList<>();
		List<Permission> allPermissions = securityService.getAllPermissions();
		for (Permission permission : allPermissions)
		{
			if(assignedPermissionMap.containsKey(permission.getId())){
				rolePermissions.add(permission);
			} else {
				rolePermissions.add(null);
			}
		}
		role.setPermissions(rolePermissions);
		model.addAttribute("role",role);
		return viewPrefix+"edit_role";
	}
	
	@RequestMapping(value="/roles/{id}", method=RequestMethod.POST)
	public String updateRole(@ModelAttribute("role") Role role, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {		
		Role persistedRole = securityService.updateRole(role);
		logger.debug("Updated role with id : {} and name : {}", persistedRole.getId(), persistedRole.getName());
		redirectAttributes.addFlashAttribute("info", "Role updated successfully");
		return "redirect:/roles";
	}
	
}
```

Note that we are iterating through allPermissions and preparing another list to match indexes. Looks weird to me..but&#8230;!!!.

Create the edit Role thymeleaf view **jcart-admin/src/main/resources/templates/roles/edit_role.html** as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
<head>
	<title>Roles - Edit</title>
</head>
<body>
			
	<div layout:fragment="content">
		
		  <div class="box box-warning">
			<div class="box-header with-border">
			  <h3 class="box-title">Edit Role</h3>
			</div>
			<div class="box-body">
			  <form role="form" th:action="@{/roles/{id}(id=${role.id})}" th:object="${role}" method="post">
				<p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" th:class="text-red">Incorrect data</p>
				
				<div class="form-group">
				  <label>Name</label>
				  <input type="text" class="form-control" name="name" th:field="*{name}" readonly="readonly"/>
				</div>
								
				<div class="form-group">
				  <label>Description</label>
				  <textarea class="form-control" rows="3" name="description" th:field="*{description}" placeholder="Enter Role Description"></textarea>
				</div>
				
				<div class="form-group">
					<label>Permissions</label>
					<div>
					  <p th:each="permission,rowStat : ${permissionsList}">
						<input type="checkbox" th:field="*{permissions[__${rowStat.index}__].id}" th:value="${permission.id}" />
						<label th:text="${permission.name}">Permission</label>
					  </p>
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
```

Now we have completed all the actions related to Role management.
