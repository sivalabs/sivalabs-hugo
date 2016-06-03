---
author: siva
comments: true
date: 2011-08-25 06:05:00+00:00
layout: post
slug: when-to-use-requestdispatcherforward
title: When to use RequestDispatcher.forward() and response.sendRedirect()?
wordpress_id: 262
categories:
- Servlets JSP
- Tips
tags:
- Servlets JSP
- Tips
---

Many people know about how RequestDispatcher.forward() and response.sendRedirect() works.  
  
RequestDispatcher.forward() is generally called Server side redirection and is used to forward to a resource within the same application. That resource could be a JSP or another Servlet.  
  
response.sendRedirect() is generally called as Client side redirection as it issues a new request from the browser. This method is used to redirect to another resource within the same application or to the resource in some other application running in the same web container or can redirect to any other resource running in someother web container.  
  
There is one more important thing to consider when to use forward() and sendRedirect().  
  
Suppose you are on a new customer creation form and you filled the data and sumit it to CreateCustomerServlet. In CreateCustomerServlet you get all the data entered in the form and insert a row in the database and showing status.jsp saying Customer Created successfully.  
  
Assume you use requestDispatcher.forward("status.jsp") to display the status page.  
Then in the browser the URL remains as http://localhost:8080/App/CreateCustomerServlet.  
  
**Now if the user press Refresh(F5) button on the browser the web container starts executing the request from CreateCustomerServlet. Again it will insert another duplicate row in database and show the status page.**  
  
**But in CreateCustomerServlet, if you use response.sendRedirect("status.jsp") to show status page the browser URL will be changed to http://localhost:8080/App/status.jsp.  
Now if the user press F5 the container will start processing the status.jsp only. It won't invoke CreateCustomerServlet.**  
  
So if you are doing any data modifications like insertion/updation/deletion always use response.sendRedirect().  
  
If you are using Struts-1.x you can use   
If you are using SpringMVC you can use new ModelAndView("redirect:status").  
  
  
For further information on this visit [http://en.wikipedia.org/wiki/Post/Redirect/Get](http://en.wikipedia.org/wiki/Post/Redirect/Get)  

