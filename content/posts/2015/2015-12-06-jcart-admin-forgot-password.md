---
title: 'JCart: Admin Forgot Password'
author: Siva
type: post
date: 2015-12-06T10:34:33+00:00
url: /jcart-admin-forgot-password/
categories:
  - Java
tags:
  - jcart
  - SpringBoot

---
We will provide a link to Forgot Password in Login page and create **jcart-admin/src/main/resources/templates/public/forgotPwd.html** template as follows:

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
      layout:decorator="layout/guestLayout">
  <head>
    <title>Forgot Password</title>
  </head>
  <body >
  	<div layout:fragment="content">
    
        <form action="forgotPwd"  th:action="@{/forgotPwd}" method="post">
          <input type="email" class="form-control" name="email" placeholder="Email"/>           
          <button type="submit" class="btn btn-primary btn-block btn-flat" th:text="#{label.submit}">Submit</button>
        </form>      
	</div>
  </body>
</html>
```

When Admin user enters the email address and submit we will generate a token, store it in our DB and generates a Reset Password Link and send it to their email. When user click on the link we will validate the token and if it is valid we will ask user to enter New Password.

```java
@Controller
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
		String htmlContent = "Please click below link to reset your password: <br/>"+resetPwdURL;
		emailService.sendEmail(email, getMessage(LABEL_PASSWORD_RESET_EMAIL_SUBJECT), htmlContent);
	}	
}
```

### Sending Emails using Thymeleaf Templates

Instead of preparing the email content by appending Strings, we can use Thymeleaf templates with place-holders and pass the values dynamically.

When we added thymeleaf-starter SpringBoot already registers **ServletContextTemplateResolver** bean automatically.
  
In order to register emailTemplateResolver let us configure the **ClassLoaderTemplateResolver** bean in **jcart-admin/src/main/java/com/sivalabs/jcart/admin/config/WebConfig.java**

```java
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
```

Create forgot password thymeleaf template **jcart-admin/src/main/resources/email-templates/forgot-password-email.html**

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <head>
    <title th:remove="all">Template for HTML email</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  </head>
  <body>
    <p>
      Hello,
    </p>
    <p>
       Please click the below link to reset your password.<br/>
       <a th:href="${resetPwdURL}">Reset Password</a>       
    </p>
    <p>
      Regards, <br />
      <em>The QuilCart Team</em>
    </p>
  </body>
</html>
```

Update the logic to use Email template as follows:

```java
@Autowired protected TemplateEngine templateEngine;	

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
```

For more information on sending emails using Thymeleaf templates see <a href="http://www.thymeleaf.org/doc/articles/springmail.html" target="_blank">http://www.thymeleaf.org/doc/articles/springmail.html</a>
