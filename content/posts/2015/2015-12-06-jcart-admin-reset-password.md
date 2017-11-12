---
title: 'JCart: Admin Reset Password'
author: Siva
type: post
date: 2015-12-06T10:41:22+00:00
url: /2015/12/jcart-admin-reset-password/
post_views_count:
  - 11
categories:
  - Java
tags:
  - jcart
  - SpringBoot

---
Once the Admin User clicked on Password Reset Link that we sent via Email, we will validate the Token and if is valid then we will show a form to enter New Password, otherwise shows an error. 

<pre class="brush: java">@Controller
public class UserAuthController extends JCartAdminBaseController
{
	...
	@RequestMapping(value="/resetPwd", method=RequestMethod.GET)
	public String resetPwd(HttpServletRequest request, Model model, RedirectAttributes redirectAttributes)
	{
		String email = request.getParameter("email");
		String token = request.getParameter("token");
		
		boolean valid = securityService.verifyPasswordResetToken(email, token);
		if(valid){
			model.addAttribute("email", email);
			model.addAttribute("token", token);			
			return "public/resetPwd";	
		} else {
			redirectAttributes.addFlashAttribute("msg", getMessage(ERROR_INVALID_PASSWORD_RESET_REQUEST));
			return "redirect:/login";
		}		
	}
	....
}
</pre>

Create reset password template **jcart-admin/src/main/resources/templates/public/resetPwd.html**

<pre class="brush: xml">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
      layout:decorator="layout/guestLayout"&gt;
  &lt;head&gt;
    &lt;title&gt;Reset Password&lt;/title&gt;
  &lt;/head&gt;
  &lt;body&gt;
  	&lt;div layout:fragment="content"&gt;    
        &lt;form action="resetPwd" th:action="@{/resetPwd}" method="post"&gt;
           &lt;input type="hidden" name="email" th:value="${email}"/&gt;
           &lt;input type="hidden" name="token" th:value="${token}"/&gt;           
          
           &lt;input type="password" class="form-control" name="password" placeholder="New Password"/&gt;            
           &lt;input type="password" class="form-control" name="confPassword" placeholder="Confirm Password"/&gt;           
           &lt;button type="submit" class="btn btn-primary btn-block btn-flat" th:text="#{label.submit}"&gt;Submit&lt;/button&gt;                      
        &lt;/form&gt;                   
	&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

Implement resetPwd handler method as follows:

<pre class="brush: java">@Controller
public class UserAuthController extends JCartAdminBaseController
{
	....
	@RequestMapping(value="/resetPwd", method=RequestMethod.POST)
	public String handleResetPwd(HttpServletRequest request, RedirectAttributes redirectAttributes)
	{
		try
		{
			String email = request.getParameter("email");
			String token = request.getParameter("token");
			String password = request.getParameter("password");
			String confPassword = request.getParameter("confPassword");
			if(!password.equals(confPassword))
			{
				model.addAttribute("email", email);
				model.addAttribute("token", token);	
				model.addAttribute("msg", getMessage(ERROR_PASSWORD_CONF_PASSWORD_MISMATCH));
				return "public/resetPwd";
			}
			String encodedPwd = passwordEncoder.encode(password);
			securityService.updatePassword(email, token, encodedPwd);
			
			redirectAttributes.addFlashAttribute("msg", getMessage(INFO_PASSWORD_UPDATED_SUCCESS));
		} catch (JCartException e)
		{
			logger.error(e);
			redirectAttributes.addFlashAttribute("msg", getMessage(ERROR_INVALID_PASSWORD_RESET_REQUEST));
		}
		return "redirect:/login";
	}
	...
}
</pre>