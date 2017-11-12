---
title: 'JCart: Admin Forgot Password'
author: Siva
type: post
date: 2015-12-06T10:34:33+00:00
url: /2015/12/jcart-admin-forgot-password/
post_views_count:
  - 10
categories:
  - Java
tags:
  - jcart
  - SpringBoot

---
We will provide a link to Forgot Password in Login page and create **jcart-admin/src/main/resources/templates/public/forgotPwd.html** template as follows:

<pre class="brush: xml">&lt;!DOCTYPE html&gt;
&lt;html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
      layout:decorator="layout/guestLayout"&gt;
  &lt;head&gt;
    &lt;title&gt;Forgot Password&lt;/title&gt;
  &lt;/head&gt;
  &lt;body &gt;
  	&lt;div layout:fragment="content"&gt;
    
        &lt;form action="forgotPwd"  th:action="@{/forgotPwd}" method="post"&gt;
          &lt;input type="email" class="form-control" name="email" placeholder="Email"/&gt;           
          &lt;button type="submit" class="btn btn-primary btn-block btn-flat" th:text="#{label.submit}"&gt;Submit&lt;/button&gt;
        &lt;/form&gt;      
	&lt;/div&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

When Admin user enters the email address and submit we will generate a token, store it in our DB and generates a Reset Password Link and send it to their email. When user click on the link we will validate the token and if it is valid we will ask user to enter New Password.

<pre class="brush: java">@Controller
public class UserAuthController extends JCartAdminBaseController
{
	...
	
	@RequestMapping(value="/forgotPwd", method=RequestMethod.POST)
	public String handleForgotPwd(HttpServletRequest request, RedirectAttributes redirectAttributes)
	{
		String email = request.getParameter("email");
		try
		{
			//generates a token (UUID.randomUUID().toString()) and store it in USERS.PASSWORD_RESET_TOKEN column.
			String token = securityService.resetPassword(email);		
			String resetPwdURL = WebUtils.getURLWithContextPath(request)+"/resetPwd?email="+email+"&token="+token;
			this.sendForgotPasswordEmail(email, resetPwdURL);			
			redirectAttributes.addFlashAttribute("msg", getMessage(INFO_PASSWORD_RESET_LINK_SENT));
		} catch (JCartException e)
		{
			logger.error(e);
			redirectAttributes.addFlashAttribute("msg", e.getMessage());
		}
		return "redirect:/forgotPwd";
	}
	...
	...
	protected void sendForgorPasswordEmail(String email, String resetPwdURL)
	{
		String htmlContent = "Please click below link to reset your password: &lt;br/&gt;"+resetPwdURL;
		emailService.sendEmail(email, getMessage(LABEL_PASSWORD_RESET_EMAIL_SUBJECT), htmlContent);
	}	
}
</pre>

### Sending Emails using Thymeleaf Templates

Instead of preparing the email content by appending Strings, we can use Thymeleaf templates with place-holders and pass the values dynamically.

When we added thymeleaf-starter SpringBoot already registers **ServletContextTemplateResolver** bean automatically.
  
In order to register emailTemplateResolver let us configure the **ClassLoaderTemplateResolver** bean in **jcart-admin/src/main/java/com/sivalabs/jcart/admin/config/WebConfig.java**

<pre class="brush: java">@Bean 
public ClassLoaderTemplateResolver emailTemplateResolver(){ 
	ClassLoaderTemplateResolver emailTemplateResolver = new ClassLoaderTemplateResolver(); 
	emailTemplateResolver.setPrefix("email-templates/"); 
	emailTemplateResolver.setSuffix(".html"); 
	emailTemplateResolver.setTemplateMode("HTML5"); 
	emailTemplateResolver.setCharacterEncoding("UTF-8"); 
	emailTemplateResolver.setOrder(2);
	
	return emailTemplateResolver; 
}
</pre>

Create forgot password thymeleaf template **jcart-admin/src/main/resources/email-templates/forgot-password-email.html**

<pre class="brush: xml">&lt;!DOCTYPE html&gt;
&lt;html xmlns:th="http://www.thymeleaf.org"&gt;
  &lt;head&gt;
    &lt;title th:remove="all"&gt;Template for HTML email&lt;/title&gt;
    &lt;meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;p&gt;
      Hello,
    &lt;/p&gt;
    &lt;p&gt;
       Please click the below link to reset your password.&lt;br/&gt;
       &lt;a th:href="${resetPwdURL}"&gt;Reset Password&lt;/a&gt;       
    &lt;/p&gt;
    &lt;p&gt;
      Regards, &lt;br /&gt;
      &lt;em&gt;The QuilCart Team&lt;/em&gt;
    &lt;/p&gt;
  &lt;/body&gt;
&lt;/html&gt;
</pre>

Update the logic to use Email template as follows:

<pre class="brush: java">@Autowired protected TemplateEngine templateEngine;	

protected void sendForgorPasswordEmail(String email, String resetPwdURL)
{
	try {		
		// Prepare the evaluation context
		final Context ctx = new Context();
		ctx.setVariable("resetPwdURL", resetPwdURL);

		// Create the HTML body using Thymeleaf
		final String htmlContent = this.templateEngine.process("forgot-password-email", ctx);
		
		emailService.sendEmail(email, getMessage(LABEL_PASSWORD_RESET_EMAIL_SUBJECT), htmlContent);
	} catch (JCartException e) {
		logger.error(e);
	}
}
</pre>

For more information on sending emails using Thymeleaf templates see <a href="http://www.thymeleaf.org/doc/articles/springmail.html" target="_blank">http://www.thymeleaf.org/doc/articles/springmail.html</a>