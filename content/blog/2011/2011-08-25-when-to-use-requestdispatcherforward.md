---
title: When to use RequestDispatcher.forward() and response.sendRedirect()?
author: Siva
type: post
date: 2011-08-25T00:35:00.000Z
url: /blog/when-to-use-requestdispatcherforward/
categories:
  - JavaEE
tags:
  - java-ee
aliases:
  - /when-to-use-requestdispatcherforward/
---
Many people know how RequestDispatcher.forward() and response.sendRedirect() work.

RequestDispatcher.forward() is generally called server-side redirection and is used to forward to a resource within the same application. That resource could be a JSP or another servlet.

response.sendRedirect() is generally called client-side redirection, as it issues a new request from the browser. This method is used to redirect to another resource within the same application, to a resource in some other application running in the same web container, or to any other resource running in some other web container.

There is one more important thing to consider when choosing between forward() and sendRedirect().

Suppose you are on a new customer creation form, you have filled in the data, and you submit it to CreateCustomerServlet. In CreateCustomerServlet, you get all the data entered in the form, insert a row into the database, and show status.jsp, saying "Customer Created successfully."

Assume you use requestDispatcher.forward("status.jsp") to display the status page.
Then, in the browser, the URL remains http://localhost:8080/App/CreateCustomerServlet.

**Now, if the user presses the Refresh (F5) button on the browser, the web container starts executing the request from CreateCustomerServlet. Again, it will insert another duplicate row in the database and show the status page.**

**But in CreateCustomerServlet, if you use response.sendRedirect("status.jsp") to show the status page, the browser URL will be changed to http://localhost:8080/App/status.jsp.
Now, if the user presses F5, the container will start processing status.jsp only. It won't invoke CreateCustomerServlet.**

So if you are doing any data modifications like insertion, updation, or deletion, always use response.sendRedirect().
