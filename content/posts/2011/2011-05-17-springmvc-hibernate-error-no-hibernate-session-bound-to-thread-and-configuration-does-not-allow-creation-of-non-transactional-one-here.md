---
title: 'SpringMVC + Hibernate Error: No Hibernate Session bound to thread, and configuration does not allow creation of non-transactional one here'
author: Siva
type: post
date: 2011-05-17T02:14:00+00:00
url: /2011/05/springmvc-hibernate-error-no-hibernate-session-bound-to-thread-and-configuration-does-not-allow-creation-of-non-transactional-one-here/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/05/springmvc-hibernate-error-no-hibernate.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2228113042594037734
post_views_count:
  - 41
categories:
  - Spring
tags:
  - Hibernate
  - Java
  - Spring
  - SpringMVC

---
While developing a web application using SpringMVC and Hibernate I got &#8220;No Hibernate Session bound to thread Exception&#8221; becuase of some configuration issue.  
Here I am going to explain how I resolved the issue.

I used the SpringMVC/@Controller approach and configured the Web related Spring configuration in dispatcher-servlet.xml as follows:

<pre>&lt;beans><br /> &lt;context:annotation-config"/&gt;<br /> &lt;context:component-scan base-package="com.sivalabs"/&gt;<br /> <br /> &lt;bean>&lt;/bean><br /> &lt;bean>&lt;/bean><br /><br /> &lt;bean class="org.springframework.web.servlet.view.InternalResourceViewResolver" <br />   p:prefix="/WEB-INF/jsp/" p:suffix=".jsp">&lt;/bean><br />  <br /> &lt;bean id="messageSource" <br />   class="org.springframework.context.support.ResourceBundleMessageSource"<br />   p:basename="Messages">&lt;/bean><br /><br />&lt;/beans><br /></pre>

I have configured my business serices and DAOs in applicationContext.xml as follows:

<pre>&lt;beans><br /> <br /> &lt;context:component-scan base-package="com.sivalabs"/&gt;<br /> &lt;context:property-placeholder location="classpath:app-config.properties"/&gt;<br /> <br /> &lt;tx:annotation-driven/&gt;<br /> <br /> &lt;bean id="transactionManager" <br />   class="org.springframework.orm.hibernate3.HibernateTransactionManager"<br />   p:sessionFactory-ref="sessionFactory">&lt;/bean><br /> <br /> &lt;bean><br />     &lt;property name="dataSource" ref="dataSource">&lt;/property><br />     &lt;property name="mappingResources"><br />       &lt;list><br />         &lt;value>UserAccount.hbm.xml&lt;/value><br />         &lt;value>Contact.hbm.xml&lt;/value><br />       &lt;/list><br />     &lt;/property><br />     &lt;property name="hibernateProperties"><br />       &lt;props><br />   &lt;prop key="hibernate.dialect">${hibernate.dialect}&lt;/prop><br />   &lt;prop key="hibernate.show_sql">${hibernate.show_sql}&lt;/prop><br />   &lt;/props><br />     &lt;/property><br />   &lt;/bean><br /> <br /> &lt;bean><br />  .....<br />  .....<br /> &lt;/bean><br />&lt;/beans><br /></pre>

To enable the transaction management I have used @Transactional annotation on my business services.

<pre>package com.sivalabs.homeautomation.useraccounts;<br />@Service<br />@Transactional<br />public class UserAccountsService <br />{<br /> @Autowired<br /> private UserAccountsDAO userAccountsDAO;<br /> <br /> public UserAccount login(Credentials credentials) {<br />  return userAccountsDAO.login(credentials);<br /> }<br />}<br /></pre>

But when I invoked UserAccountsService.login() method I got the the below error:

<pre>org.hibernate.HibernateException: No Hibernate Session bound to thread, and configuration does not allow creation of non-transactional one here<br /> at org.springframework.orm.hibernate3.SpringSessionContext.currentSession(SpringSessionContext.java:63)<br /> at org.hibernate.impl.SessionFactoryImpl.getCurrentSession(SessionFactoryImpl.java:544)<br /> at com.sivalabs.homeautomation.useraccounts.UserAccountsDAO.login(UserAccountsDAO.java:30)<br /> at com.sivalabs.homeautomation.useraccounts.UserAccountsService.login(UserAccountsService.java:25)<br /> at com.sivalabs.homeautomation.useraccounts.LoginController.login(LoginController.java:51)<br /></pre>

Here I have enabled the Annotation based configuration using **<context:annotation-config/>**.  
I have configured the base package containing the Spring beans using **<context:component-scan base-package=&#8221;com.sivalabs&#8221;/>**.  
I have enabled the Annotation based Transaction Management using **<tx:annotation-driven/>** and @Transactional.

But still I am getting &#8220;No Hibernate Session bound to thread&#8221; Exception. Why?

Here is the reason:

In Spring reference documentation we can found the below mentioned important note:  
**  
&#8220;<tx:annotation-driven/> only looks for @Transactional on beans in the same application context it is defined in. This means that, if you put <tx:annotation-driven/> in a WebApplicationContext for a DispatcherServlet, it only checks for @Transactional beans in your controllers, and not your services.&#8221;**

**So when my application is started first it loads the beans configured in dispatcher-servlet.xml and then look in applicationContext.xml. As i mentioned &#8220;com.sivalabs&#8221; as my base-package to scan for Spring beans my business services and DAOs which are annotated with @Service, @Repository will also be loaded by the container. Later when Spring tries to load beans from applicationContext.xml it won&#8217;t load my services and DAOs as they are already loaded by parent ApplicaationContext. So the <tx:annotation-driven/> wont be applied for business services or DAOs annotated with @Transactional.**

**Solution1: If you are following package-by-layer approach:**  
Probably you may put all your controllers in one package say com.sivalabs.appname.web.controllers

Then change the **<context:annotation-config/>** configuration in dispatcher-servlet.xml as:

<pre>&lt;context:component-scan base-package="com.sivalabs.appname.web.controllers"/&gt;<br /></pre>

With this only the controllers annotated with @Controller in com.sivalabs.appname.web.controllers package will be loaded by parent ApplicationContext and rest of the services, DAOs will be loaded by child ApplicationContext.

**Solution2: If you are following package-by-feature approach:**  
If you follow the package-by-feature approach, you will put all the Controller, Service, DAOs related to one feature in one package.  
With this the Controllers, Services, DAOs will be spanned across the packages.

Then change the **<context:annotation-config/>** configuration in dispatcher-servlet.xml as:

<pre>&lt;context:component-scan base-package="com.sivalabs" use-default-filters="false"><br /> &lt;context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/&gt;<br />&lt;/context:component-scan><br /></pre>

With this only the controllers annotated with @Controller will be loaded by parent ApplicationContext.  
And the Services, DAOs will be loaded by child ApplicationContext and <tx:annotation-driven/> will be applied.