---
author: siva
comments: true
date: 2009-01-03 06:41:00+00:00
layout: post
slug: spring-tutorial-part-1
title: Spring Tutorial Part 1
wordpress_id: 309
categories:
- Spring
tags:
- Spring
---

**Dependency Injection Using Spring:**  
The Spring Framework is an Application Framework fro developing Java based applications starting from stand alone applications to SOA style applications.  
Let us see how we can use Spring to develop a simple stand alone application using Spring.  
  
The requirement is to develop a UserService component which takes the credentials of the user and authenticate the credentails against the values stored in the database. The UserService component makes use of EntityManager, which takes care of all the database operations. The EntityManager in turn uses the UserDAO to perform the user login operation.  
  
**UserService.java  
****package com.springdemo.services;  
import com.springdemo.persistence.EntityManager;  
public class UserService  
{  
private EntityManager entityManager;  
public void setEntityManager(EntityManager em)  
{  
this.entityManager = em;  
}  
public EntityManager getEntityManager()  
{  
return this.entityManager;  
}  
public boolean login(String username, String password)  
{  
return this.getEntityManager().login(username, password);  
}  
}  
**  
**EntityManager.java**  
  
**package com.springdemo.persistence;  
import com.springdemo.dao.UserDAO;  
public class EntityManager  
{  
private UserDAO userDAO = null;  
public UserDAO getUserDAO()  
{  
return userDAO;  
}  
public void setUserDAO(UserDAO userDAO)  
{  
this.userDAO = userDAO;  
}  
public boolean login(String username, String password)  
{  
return this.getUserDAO().login(username, password);  
}  
}  
**  
**UserDAO.java**  
  
**package com.springdemo.dao;  
public class UserDAO  
{  
public boolean login(String username, String password)  
{   
****// checking with dummy values  
if(username!=null && username.equals("admin") && password!=null && password.equals("admin")){  
return true;  
}  
return false;  
}  
}   
**  
**applicationContext.xml**
    
    <br></br><strong><span><?</span><span>xml</span> <span>version="1.0" encoding="UTF-8"</span><span>?></span></strong>

  
**<beans xmlns="http://www.springframework.org/schema/beans"  
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
xmlns:aop="http://www.springframework.org/schema/aop"  
xmlns:tx="http://www.springframework.org/schema/tx"  
xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-2.0.xsd  
http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-2.0.xsd  
http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-2.0.xsd">  
  
<bean id="userService" class="com.springdemo.services.UserService">  
<property name="entityManager" ref="entityManager"></property>  
</bean>  
  
<bean id="entityManager" class="com.springdemo.persistence.EntityManager">  
<property name="userDAO" ref="userDAO"></property>  
</bean>  
  
<bean id="userDAO" class="com.springdemo.dao.UserDAO"> </bean>  
  
  
</beans>  
  
**

  
**TestClient.java**  
**package com.spring.core;  
import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  
public class  
{  
static final String CONFIG_FILE = "applicationContext.xml";  
public static void main(String[] args)  
{  
ApplicationContext context= new ClassPathXmlApplicationContext(CONFIG_FILE );  
UserService userService = (UserService) context.getBean("userService");  
boolean loginStatus = userService.login("admin", "admin");  
if(loginStatus==true)  
{  
System.out.println("Login success");  
}  
else  
{  
System.out.println("Login failed");  
}  
}  
}  
  
For more Information on Spring Framework:  
  
[http://static.springframework.org/spring/docs/2.5.x/reference/index.html](http://static.springframework.org/spring/docs/2.5.x/reference/index.html)  
  
[http://itblackbelt.wordpress.com/2006/09/04/introduction-to-the-spring-framework-by-rod-johnson/](http://itblackbelt.wordpress.com/2006/09/04/introduction-to-the-spring-framework-by-rod-johnson/)  
  
**
