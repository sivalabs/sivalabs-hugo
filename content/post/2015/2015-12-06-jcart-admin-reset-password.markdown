---
author: siva
comments: true
date: 2015-12-06 10:41:22+00:00
layout: post
Url: jcart-admin-reset-password
title: 'JCart: Admin Reset Password'
wordpress_id: 541
tags:
- jcart
- SpringBoot
draft : true
---

Once the Admin User clicked on Password Reset Link that we sent via Email, we will validate the Token and if is valid then we will show a form to enter New Password, otherwise shows an error. 


    
    
    @Controller
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
    



Create reset password template **jcart-admin/src/main/resources/templates/public/resetPwd.html**


    
    
    <!DOCTYPE html>
    <html xmlns="http://www.w3.org/1999/xhtml" 
    	  xmlns:th="http://www.thymeleaf.org"
          layout:decorator="layout/guestLayout">
      <head>
        <title>Reset Password</title>
      </head>
      <body>
      	<div layout:fragment="content">    
            <form action="resetPwd" th:action="@{/resetPwd}" method="post">
               <input type="hidden" name="email" th:value="${email}"/>
               <input type="hidden" name="token" th:value="${token}"/>           
              
               <input type="password" class="form-control" name="password" placeholder="New Password"/>            
               <input type="password" class="form-control" name="confPassword" placeholder="Confirm Password"/>           
               <button type="submit" class="btn btn-primary btn-block btn-flat" th:text="#{label.submit}">Submit</button>                      
            </form>                   
    	</div>
      </body>
    </html>
    



Implement resetPwd handler method as follows:


    
    
    @Controller
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
    
