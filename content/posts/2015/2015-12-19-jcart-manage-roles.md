---
title: 'JCart: Manage Roles'
author: Siva
type: post
date: 2015-12-19T03:16:38+00:00
url: /2015/12/jcart-manage-roles/
post_views_count:
  - 6
categories:
  - Java
tags:
  - jcart

---
In our previous post **Manage Privileges – List all privileges** we have implemented the functionality to show list of permissions. In this post we will implement Role management such as listing all Roles, creating new Role, editing Role permissions etc.

Basically a Role is nothing a but group of Permissions assigned so that giving access to a set of action to user will become easy by assigning Roles.

In this post we are going to see lot of code snippets, so I would suggest to clone the repo <a href="https://github.com/sivaprasadreddy/jcart" target="_blank">https://github.com/sivaprasadreddy/jcart</a>.

We already have **Role** JPA entity created and some sample data is already inserted using data.sql script.

## List all Roles

First let us create a Spring Data JPA repository for Role entity.

<pre class="brush: java">public interface RoleRepository extends JpaRepository&lt;Role, Integer&gt;
{
	Role findByName(String name);
}
</pre>

In **SecurityService** implement a method to return all the permissions.

<pre class="brush: java">@Service
@Transactional
public class SecurityService
{
	@Autowired UserRepository userRepository;
	@Autowired PermissionRepository permissionRepository;
	@Autowired RoleRepository roleRepository;
	...
	...
		
	public List&lt;Role&gt; getAllRoles() {
		return roleRepository.findAll();
	}

}
</pre>

Create a SpringMVC controller to handle all Role related actions.
  
This action should be available to only users who have &#8220;**ROLE\_MANAGE\_ROLES**&#8220;, so let us add @Secured annotation to **RoleController**.

<pre class="brush: java">@Controller
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
		List&lt;Role&gt; list = securityService.getAllRoles();
		model.addAttribute("roles",list);
		return viewPrefix+"roles";
	}
	
}
</pre>

Create thymeleaf view **jcart-admin/src/main/resources/templates/roles/roles.html**.

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout"&gt;

&lt;head&gt;
&lt;title&gt;Roles&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;

	&lt;div layout:fragment="content"&gt;
		&lt;div class="row"&gt;
			&lt;div class="col-md-12"&gt;
				&lt;div class="box"&gt;
					&lt;div class="box-header"&gt;
						&lt;h3 class="box-title"&gt;List of Roles&lt;/h3&gt;
						&lt;div class="box-tools"&gt;
							&lt;div class="input-group" style="width: 150px;"&gt;
								&lt;a class="btn btn-sm btn-default" th:href="@{/roles/new}"&gt;&lt;i
									class="fa fa-plus-circle"&gt;&lt;/i&gt; New Role&lt;/a&gt;
							&lt;/div&gt;
						&lt;/div&gt;
					&lt;/div&gt;
					&lt;div class="box-body table-responsive no-padding"&gt;
						&lt;table class="table table-hover"&gt;
							&lt;tr&gt;
								&lt;th style="width: 10px"&gt;#&lt;/th&gt;
								&lt;th&gt;Name&lt;/th&gt;
								&lt;th&gt;Description&lt;/th&gt;
								&lt;th&gt;Edit&lt;/th&gt;

							&lt;/tr&gt;
							&lt;tr th:each="role,iterStat : ${roles}"&gt;
								&lt;td&gt;&lt;a th:href="@{/roles/{id}(id=${role.id})}"&gt;&lt;span
										th:text="${iterStat.count}"&gt;1&lt;/span&gt;&lt;/a&gt;&lt;/td&gt;
								&lt;td th:text="${role.name}"&gt;Role Name&lt;/td&gt;
								&lt;td th:text="${role.description}"&gt;Role Description&lt;/td&gt;
								&lt;td&gt;&lt;a th:href="@{/roles/{id}(id=${role.id})}"
										class="btn btn-sm btn-default"&gt;
										&lt;i class="fa fa-edit"&gt;&lt;/i&gt;Edit
									&lt;/a&gt;
								&lt;/td&gt;
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

Observe that though we have not yet implemented functionality for adding new Role or view/edit Role we have added &#8220;New Role&#8221; button and links to view/edit Role info which we are going to implement next.

Now run **JCartAdminApplication.java** and login and go click on Roles menu in Left side navigation and you should be able to see list of all Roles.

## Create New Role

In our List Roles screen we have added a button &#8220;New Role&#8221; which will take you to &#8220;roles/new&#8221; URL. Let us implement SpringMVC controller methods to handle showing new role form and role creation POST method.

While showing New Role form we should also show list of permission that we would like to add to the newly creating Role.

Also we want to validate the New Role form to check for any missing mandatory details.

First let us implement **RoleValidator** **jcart-admin/src/main/java/com/sivalabs/jcart/admin/web/validators/RoleValidator.java** as follows:

<pre class="brush: java">package com.sivalabs.jcart.admin.web.validators;

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
	public boolean supports(Class&lt;?&gt; clazz)
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
</pre>

One thing to notice here is we already have **BeanValidation** annotation **@NotEmpty** on **&#8220;name&#8221;** property which SpringMVC automatically checks for. But we also need to check whether the new is already in use or not by talking to database.

Also observe that we are using message keys from ResourceBundle **messages.properties** to have internationalization.

Add the following properties to **messages.properties**

<pre class="brush: java">error.required={0} is required
error.invalid={0} is invalid
error.exists={0} already exists
</pre>

Now we need to implement **getRoleByName()** and **createRole()** methods in our **SecurityService**.

<pre class="brush: java">@Service
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
		List&lt;Permission&gt; persistedPermissions = new ArrayList&lt;&gt;();
		List&lt;Permission&gt; permissions = role.getPermissions();
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
</pre>

I hope these 2 methods are self explanatory.

Now let us implement the request handler methods in **RoleController** as follows:

<pre class="brush: java">@Controller
@Secured(SecurityUtil.MANAGE_ROLES)
public class RoleController extends JCartAdminBaseController
{
	private static final String viewPrefix = "roles/";
	
	@Autowired protected SecurityService securityService;
	@Autowired private RoleValidator roleValidator;

	...
	...
	
	@ModelAttribute("permissionsList")
	public List&lt;Permission&gt; permissionsList(){
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
</pre>

We need to add List for both create Role and update Role forms as well. So added as a separate method with **@ModelAttribute** instead of adding List to Model in 2 places.

> Note that BindingResult result argument should be next to @ModelAttribute property to have validation errors population working properly.

Let us create the CreateRole thymeleaf view **jcart-admin/src/main/resources/templates/roles/create_role.html** as follows:

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
&lt;head&gt;
    &lt;title&gt;Roles - New&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
	
	&lt;div layout:fragment="content"&gt;
		
		  &lt;div class="box box-warning"&gt;
			&lt;div class="box-header with-border"&gt;
			  &lt;h3 class="box-title"&gt;Create New Role&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body"&gt;
			  &lt;form role="form" th:action="@{/roles}" th:object="${role}" method="post"&gt;
				&lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('name')}? 'has-error'"&gt;
				  &lt;label&gt;Name&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="name" th:field="*{name}" placeholder="Enter Role Name"/&gt;
				  &lt;p th:if="${#fields.hasErrors('name')}" th:errors="*{name}" th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				
				&lt;div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'"&gt;
				  &lt;label&gt;Description&lt;/label&gt;
				  &lt;textarea class="form-control" rows="3" name="description" th:field="*{description}" placeholder="Enter Role Description"&gt;&lt;/textarea&gt;
				  &lt;p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group"&gt;
					&lt;label&gt;Permissions&lt;/label&gt;
					&lt;div&gt;
					  &lt;p th:each="permission,rowStat : ${permissionsList}"&gt;
						&lt;input type="checkbox" th:field="*{permissions[__${rowStat.index}__].id}" th:value="${permission.id}" /&gt;
						&lt;label th:text="${permission.name}"&gt;Permission&lt;/label&gt;
					  &lt;/p&gt;
					&lt;/div&gt;
					
				&lt;/div&gt;
				
				&lt;div class="box-footer"&gt;
					&lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
				&lt;/div&gt;
			  &lt;/form&gt;
			&lt;/div&gt;
		  &lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;    
&lt;/html&gt;
</pre>

### Few things to observe:

  * We are applying css error class if a field has error using th:classappend=&#8221;${#fields.hasErrors(&#8216;name&#8217;)}? &#8216;has-error'&#8221;
  * Showing error if a field has error using <p th:if=&#8221;${#fields.hasErrors(&#8216;name&#8217;)}&#8221; th:errors=&#8221;*{name}&#8221; th:class=&#8221;text-red&#8221;>Incorrect data</p>
  * We are iterating through List<Permission> showing them as checkboxes and binding the selected checkboxes (Permission Ids) to &#8220;id&#8221; property of List<Permission> permissions property in Role as follows:

<pre class="brush: html">&lt;p th:each="permission,rowStat : ${permissionsList}"&gt;
	&lt;input type="checkbox" th:field="*{permissions[__${rowStat.index}__].id}" th:value="${permission.id}" /&gt;
	&lt;label th:text="${permission.name}"&gt;Permission&lt;/label&gt;
&lt;/p&gt;
</pre>

Now you can run the application and see the New Role creation working.

## Update Role

When user clicks on Edit button in List Roles screen we will take the user to Edit Role form where user can update the role description and assigned Permissions.

> Implementing the Edit Role screen is little bit tricky. We load the selected Role object which has a list of assigned Permission objects. But in screen we need to show all the available Permissions with the assigned permissions selected. As we are using indexed property binding ***{permissions[\_\_${rowStat.index}\_\_].id}** the role.permission objects index should match with the all List objects.

Let us implement the SecurityService methods **getRoleById()** and **updateRole()** as follows:

<pre class="brush: java">@Service
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
		List&lt;Permission&gt; updatedPermissions = new ArrayList&lt;&gt;();
		List&lt;Permission&gt; permissions = role.getPermissions();
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
</pre>

Implement the EditRole and Update Role handler methods as follows:

<pre class="brush: java">@Controller
@Secured(SecurityUtil.MANAGE_ROLES)
public class RoleController extends JCartAdminBaseController
{
	...
	...

	@RequestMapping(value="/roles/{id}", method=RequestMethod.GET)
	public String editRoleForm(@PathVariable Integer id, Model model) {
		Role role = securityService.getRoleById(id);
		Map&lt;Integer, Permission&gt; assignedPermissionMap = new HashMap&lt;&gt;();
		List&lt;Permission&gt; permissions = role.getPermissions();
		for (Permission permission : permissions)
		{
			assignedPermissionMap.put(permission.getId(), permission);
		}
		List&lt;Permission&gt; rolePermissions = new ArrayList&lt;&gt;();
		List&lt;Permission&gt; allPermissions = securityService.getAllPermissions();
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
</pre>

Note that we are iterating through allPermissions and preparing another list to match indexes. Looks weird to me..but&#8230;!!!.

Create the edit Role thymeleaf view **jcart-admin/src/main/resources/templates/roles/edit_role.html** as follows:

<pre class="brush: html">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout"&gt;
      
&lt;head&gt;
	&lt;title&gt;Roles - Edit&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
			
	&lt;div layout:fragment="content"&gt;
		
		  &lt;div class="box box-warning"&gt;
			&lt;div class="box-header with-border"&gt;
			  &lt;h3 class="box-title"&gt;Edit Role&lt;/h3&gt;
			&lt;/div&gt;
			&lt;div class="box-body"&gt;
			  &lt;form role="form" th:action="@{/roles/{id}(id=${role.id})}" th:object="${role}" method="post"&gt;
				&lt;p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" th:class="text-red"&gt;Incorrect data&lt;/p&gt;
				
				&lt;div class="form-group"&gt;
				  &lt;label&gt;Name&lt;/label&gt;
				  &lt;input type="text" class="form-control" name="name" th:field="*{name}" readonly="readonly"/&gt;
				&lt;/div&gt;
								
				&lt;div class="form-group"&gt;
				  &lt;label&gt;Description&lt;/label&gt;
				  &lt;textarea class="form-control" rows="3" name="description" th:field="*{description}" placeholder="Enter Role Description"&gt;&lt;/textarea&gt;
				&lt;/div&gt;
				
				&lt;div class="form-group"&gt;
					&lt;label&gt;Permissions&lt;/label&gt;
					&lt;div&gt;
					  &lt;p th:each="permission,rowStat : ${permissionsList}"&gt;
						&lt;input type="checkbox" th:field="*{permissions[__${rowStat.index}__].id}" th:value="${permission.id}" /&gt;
						&lt;label th:text="${permission.name}"&gt;Permission&lt;/label&gt;
					  &lt;/p&gt;
					&lt;/div&gt;
					
				&lt;/div&gt;
				
				&lt;div class="box-footer"&gt;
					&lt;button type="submit" class="btn btn-primary"&gt;Submit&lt;/button&gt;
				&lt;/div&gt;
			  &lt;/form&gt;
			&lt;/div&gt;
		  &lt;/div&gt;
	&lt;/div&gt;
	
&lt;/body&gt;    
&lt;/html&gt;
</pre>

Now we have completed all the actions related to Role management.