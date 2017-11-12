---
title: Multiple DataSource configurations using Spring
author: Siva
type: post
date: 2010-09-02T05:00:00+00:00
url: /2010/09/multiple-datasource-configurations-using-spring/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2010/09/multiple-datasource-configurations.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/401422966371302639
post_views_count:
  - 10
categories:
  - Spring
tags:
  - Spring

---
While developing Java based applications we might frequently need to change the database properties based on the environment we are working like PRODUCTION, DEVELOPMENT OR UAT environments. In that situations the following approach will be useful and easy to configure database properties for each environment.

If we want to change the environment we just need to change the ENV property value.

<bean id=&#8221;placeholderConfigurer&#8221; class=&#8221;org.springframework.beans.factory.config.PropertyPlaceholderConfigurer&#8221;>  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<property name=&#8221;ignoreResourceNotFound&#8221; value=&#8221;true&#8221;></property>  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<property name=&#8221;ignoreUnresolvablePlaceholders&#8221; value=&#8221;true&#8221;></property>  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<property name=&#8221;nullValue&#8221; value=&#8221;NULL&#8221;></property>  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<property name=&#8221;locations&#8221;>  
<list>  
<value>jdbc.properties</value>  
</list>  
</property>  
</bean>

<bean id=&#8221;dataSource&#8221; class=&#8221;com.spring.dao.JDBCConfig&#8221;>  
<property name=&#8221;driverClassName&#8221; value=&#8221;${${Env}.jdbc.driverClassName}&#8221;></property>  
<property name=&#8221;url&#8221; value=&#8221;${${Env}.jdbc.url}&#8221;></property>  
<property name=&#8221;username&#8221; value=&#8221;${${Env}.jdbc.username1}&#8221;></property>  
<property name=&#8221;password&#8221; value=&#8221;${${Env}.jdbc.password}&#8221;></property>   
</bean>

jdbc.properties  
\***\***\***\***\***\***\***\***\*****  
Env=PROD

jdbc.driverClassName=${${Env}.jdbc.driverClassName}  
jdbc.url=${${Env}.jdbc.url}  
jdbc.username=${${Env}.jdbc.username}  
jdbc.password=${${Env}.jdbc.password}

######### JDBC Configuration for DEV Environment ###############  
DEV.jdbc.driverClassName=com.mysql.jdbc.Driver  
DEV.jdbc.url=jdbc:mysql://localhost:3306/devportal  
DEV.jdbc.username=DEVuser  
DEV.jdbc.password=DEVpwd

######### JDBC Configuration for UAT Environment ############  
UAT.jdbc.driverClassName=com.mysql.jdbc.Driver  
UAT.jdbc.url=jdbc:mysql://localhost:3306/UATportal  
UAT.jdbc.username=UATuser  
UAT.jdbc.password=UATpwd

########## JDBC Configuration for PROD Environment ############  
PROD.jdbc.driverClassName=com.mysql.jdbc.Driver  
PROD.jdbc.url=jdbc:mysql://localhost:3306/portal  
PROD.jdbc.username=root  
PROD.jdbc.password=admin