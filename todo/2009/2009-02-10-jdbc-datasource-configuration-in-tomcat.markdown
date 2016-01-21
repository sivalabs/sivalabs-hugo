---
author: siva
comments: true
date: 2009-02-10 15:03:00+00:00
layout: post
slug: jdbc-datasource-configuration-in-tomcat
title: JDBC DataSource Configuration in Tomcat
wordpress_id: 306
categories:
- Tomcat
tags:
- Tomcat
---

Put a file named context.xml in META-INF folder which contains:  
  
<?xml version="1.0" encoding="UTF-8"?>  
  
<Context>  
<Resource      name="MySQLDS"     
type="javax.sql.DataSource"   
driverClassName="com.mysql.jdbc.Driver"   
password="root"    
maxIdle="2"   
maxWait="5000"    
username="root"    
url="jdbc:mysql://localhost:3306/test"     
maxActive="10"/>  
</Context>  
  
Getting the DataSource:  
  
Context context = new InitialContext();  
DataSource MYSQL_DATASOURCE = (DataSource) context.lookup("java:comp/env/MySQLDS");
