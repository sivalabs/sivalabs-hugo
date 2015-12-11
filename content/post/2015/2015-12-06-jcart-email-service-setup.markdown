---
author: siva
comments: true
date: 2015-12-06 10:23:36+00:00
layout: post
Url: jcart-email-service-setup
title: 'JCart: Email Service SetUp'
wordpress_id: 535
tags:
- jcart
- SpringBoot
draft : true
---

We are going to implement Admin User Forgot Password functionality where we need to send the Password Reset link to User email address. So let us look at how to configure Email server and send emails.

Spring provides support for sending Emails using **JavaMailSender**. SpringBoot makes it even easier by providing a starter for emailing support.

As we need Emailing feature in both Admin and ShoppingCart modules, we will implement the emailing functionality in jcart-core module.

Add the following dependency to **jcart-core/pom.xml**

    
    
    <dependency>
    	<groupId>org.springframework.boot</groupId>
    	<artifactId>spring-boot-starter-mail</artifactId>
    </dependency>
    




Add the following properties in _jcart-core/src/main/resources/application.properties_

    
    
    ################### JavaMail Configuration ##########################
    
    ## If you want to use GMail ##
    spring.mail.host=smtp.gmail.com
    spring.mail.port=465
    spring.mail.protocol=smtps
    spring.mail.username=sivalabs.blogspot@gmail.com
    spring.mail.password=secret
    spring.mail.properties.mail.transport.protocol=smtps
    spring.mail.properties.mail.smtps.auth=true
    spring.mail.properties.mail.smtps.starttls.enable=true
    spring.mail.properties.mail.smtps.timeout=2000
    
    ## If you want to use YahooMail ##
    #spring.mail.host=smtp.mail.yahoo.com
    #spring.mail.port=465
    #spring.mail.username=sivaprasadreddy_k@yahoo.co.in
    #spring.mail.password=secret
    #spring.mail.properties.mail.transport.protocol=smtps
    #spring.mail.properties.mail.smtp.auth=true
    #spring.mail.properties.mail.smtp.starttls.enable=true
    
    support.email=sivalabs.blogspot@gmail.com
    



Let us create **EmailService **class as follows:


    
    
    @Component
    public class EmailService 
    {
    	@Autowired 
    	JavaMailSender javaMailSender;
    	
    	@Value("${support.email}") 
    	String supportEmail;
    	
        public void sendEmail(String to, String subject, String content)
    	{
            try
    		{
            	// Prepare message using a Spring helper
                final MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
                final MimeMessageHelper message = new MimeMessageHelper(mimeMessage, "UTF-8");
                message.setSubject(subject);
                message.setFrom(supportEmail);
                message.setTo(to);
                message.setText(content, true /* isHtml */);
                
    			javaMailSender.send(message.getMimeMessage());
    		} 
            catch (MailException | MessagingException e)
    		{
            	logger.error(e);
    			throw new JCartException("Unable to send email");
    		}
    	}	
    }
    



Write a simple Test to check whether it is working or not.


    
    
    @RunWith(SpringJUnit4ClassRunner.class)
    @SpringApplicationConfiguration(classes = JCartCoreApplication.class)
    public class JCartCoreApplicationTest
    {
    	@Autowired EmailService emailService;
    
    	@Test
    	public void testSendEmail()
    	{
    		emailService.sendEmail("admin@gmail.com", "JCart - Test Mail", "This is a test email from JCart");
    	}	
    }
    
