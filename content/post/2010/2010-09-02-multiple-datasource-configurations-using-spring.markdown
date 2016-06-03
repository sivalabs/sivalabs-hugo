---
author: siva
comments: true
date: 2010-09-02 05:00:00+00:00
layout: post
slug: multiple-datasource-configurations-using-spring
title: Multiple DataSource configurations using Spring
wordpress_id: 294
categories:
- Spring
tags:
- Spring
---

While developing Java based applications we might frequently need to change the database properties based on the environment we are working like PRODUCTION, DEVELOPMENT OR UAT environments. In that situations the following approach will be useful and easy to configure database properties for each environment.  
  
If we want to change the environment we just need to change the ENV property value.  
  
<bean id="placeholderConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">  
<property name="ignoreResourceNotFound" value="true"></property>  
<property name="ignoreUnresolvablePlaceholders" value="true"></property>  
<property name="nullValue" value="NULL"></property>  
<property name="locations">  
<list>  
<value>jdbc.properties</value>  
</list>  
</property>  
</bean>  
  
<bean id="dataSource" class="com.spring.dao.JDBCConfig">  
<property name="driverClassName" value="${${Env}.jdbc.driverClassName}"></property>  
<property name="url" value="${${Env}.jdbc.url}"></property>  
<property name="username" value="${${Env}.jdbc.username1}"></property>  
<property name="password" value="${${Env}.jdbc.password}"></property>         
</bean>  
  
  
jdbc.properties  
*****************************  
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
