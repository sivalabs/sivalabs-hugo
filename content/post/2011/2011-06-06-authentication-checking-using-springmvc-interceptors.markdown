---
author: siva
comments: true
date: 2011-06-06 08:18:00+00:00
layout: post
slug: authentication-checking-using-springmvc-interceptors
title: Authentication Checking using SpringMVC Interceptors
wordpress_id: 269
categories:
- SpringMVC
tags:
- SpringMVC
---

For many web applications, some URLs need to protect from public access and some other URLs need to be protected based on the User Roles and privileges. To achieve this we can use Filters that comes with Servlet API or we can use JAAS(Java Authentication and Authorization Service).  
  
SpringMVC provides Interceptors which can be used to intercept the URL and pre-process, post-process the requests.  
  
Let us write a simple AuthenticationInterceptor to check whether the user is already logged in or not. If the User is already logged into the system we will let him continue otherwise we will redirect him to login page.  
  
  
**AuthenticationInterceptor .java**  
  

    
    package com.sivalabs.web.controllers;<br></br><br></br>import javax.servlet.http.HttpServletRequest;<br></br>import javax.servlet.http.HttpServletResponse;<br></br>import org.springframework.stereotype.Component;<br></br>import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;<br></br>import com.sivalabs.entities.User;<br></br><br></br>@Component<br></br>public class AuthenticationInterceptor extends HandlerInterceptorAdapter<br></br>{<br></br> @Override<br></br> public boolean preHandle(HttpServletRequest request,<br></br>   HttpServletResponse response, Object handler) throws Exception<br></br> {<br></br>  String uri = request.getRequestURI();<br></br>  if(!uri.endsWith("login.do") && !uri.endsWith("logout.do"))<br></br>  {<br></br>   User userData = (User) request.getSession().getAttribute("LOGGEDIN_USER");<br></br>   if(userData == null)<br></br>   {<br></br>    response.sendRedirect("login.do");<br></br>    return false;<br></br>   }   <br></br>  }<br></br>  return true;<br></br> }<br></br>}<br></br>

  
  
**LoginController.java**  
  

    
    package com.sivalabs.web.controllers;<br></br><br></br>@Controller<br></br>public class LoginController<br></br>{<br></br> @RequestMapping(value="/login", method=RequestMethod.POST)<br></br>    public ModelAndView login(@ModelAttribute("login")User user, <br></br>         BindingResult result, SessionStatus status,<br></br>         HttpServletRequest request)<br></br>    {<br></br>     String viewName = "login";<br></br>     ModelAndView mav = new ModelAndView(viewName);<br></br>     loginFormValidator.validate(user, result);<br></br>        if (result.hasErrors())<br></br>        {<br></br>            return mav;<br></br>        }<br></br>        User userData = userService.login(user);<br></br>        status.setComplete();<br></br>        <br></br>        if(userData == null){<br></br>         mav.getModel().put("ERROR", "Invalid UserName and Password");<br></br>        }else{<br></br>         viewName = "welcome";<br></br>         request.getSession().setAttribute("LOGGEDIN_USER", userData);<br></br>        }<br></br>        mav.setViewName(viewName);<br></br>        return mav;<br></br>    }<br></br>}<br></br>

  
  
**WEB-INF/dispatcher-servlet.xml**  
  

    
    <beans><br></br><br></br> <context:annotation-config/> <br></br> <context:component-scan base-package="com.sivalabs"/><br></br> <br></br> <bean class="org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter"/><br></br> <bean><br></br>  <property name="interceptors"><br></br>    <ref bean="authenticationInterceptor"/><br></br>  </property><br></br> </bean><br></br><br></br> <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" <br></br>  p:prefix="/WEB-INF/jsp/" p:suffix=".jsp"/><br></br></beans><br></br><br></br>

  
  
Now if we try to access any other URLs without logging into the application it will automatically redirect to login page.
