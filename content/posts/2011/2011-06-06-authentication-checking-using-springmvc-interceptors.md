---
title: Authentication Checking using SpringMVC Interceptors
author: Siva
type: post
date: 2011-06-06T02:48:00+00:00
url: /2011/06/authentication-checking-using-springmvc-interceptors/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/06/authentication-checking-using-springmvc.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1502584569440413632
post_views_count:
  - 53
categories:
  - Spring
tags:
  - SpringMVC

---
For many web applications, some URLs need to protect from public access and some other URLs need to be protected based on the User Roles and privileges. To achieve this we can use Filters that comes with Servlet API or we can use JAAS(Java Authentication and Authorization Service).

SpringMVC provides Interceptors which can be used to intercept the URL and pre-process, post-process the requests.

Let us write a simple AuthenticationInterceptor to check whether the user is already logged in or not. If the User is already logged into the system we will let him continue otherwise we will redirect him to login page.

**AuthenticationInterceptor .java**

<pre class="brush: java;">package com.sivalabs.web.controllers;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import com.sivalabs.entities.User;

@Component
public class AuthenticationInterceptor extends HandlerInterceptorAdapter
{
 @Override
 public boolean preHandle(HttpServletRequest request,
   HttpServletResponse response, Object handler) throws Exception
 {
  String uri = request.getRequestURI();
  if(!uri.endsWith("login.do") && !uri.endsWith("logout.do"))
  {
   User userData = (User) request.getSession().getAttribute("LOGGEDIN_USER");
   if(userData == null)
   {
    response.sendRedirect("login.do");
    return false;
   }   
  }
  return true;
 }
}</pre>

**LoginController.java**

<pre class="brush: java;">package com.sivalabs.web.controllers;

@Controller
public class LoginController
{
 @RequestMapping(value="/login", method=RequestMethod.POST)
    public ModelAndView login(@ModelAttribute("login")User user, 
         BindingResult result, SessionStatus status,
         HttpServletRequest request)
    {
     String viewName = "login";
     ModelAndView mav = new ModelAndView(viewName);
     loginFormValidator.validate(user, result);
        if (result.hasErrors())
        {
            return mav;
        }
        User userData = userService.login(user);
        status.setComplete();
        
        if(userData == null){
         mav.getModel().put("ERROR", "Invalid UserName and Password");
        }else{
         viewName = "welcome";
         request.getSession().setAttribute("LOGGEDIN_USER", userData);
        }
        mav.setViewName(viewName);
        return mav;
    }
}</pre>

**WEB-INF/dispatcher-servlet.xml**

<pre class="brush: xml;">&lt;beans&gt;

    &lt;context:annotation-config/&gt; 
    &lt;context:component-scan base-package="com.sivalabs"/&gt;
 
     &lt;bean class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter"/&gt;
     &lt;bean class="org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping"&gt;
      &lt;property name="interceptors"&gt;
        &lt;ref bean="authenticationInterceptor"/&gt;
      &lt;/property&gt;
     &lt;/bean&gt;

     &lt;bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" 
      p:prefix="/WEB-INF/jsp/" p:suffix=".jsp"/&gt;
      
&lt;/beans&gt;

</pre>

Now if we try to access any other URLs without logging into the application it will automatically redirect to login page.