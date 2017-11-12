---
title: JDBC DataSource Configuration in Tomcat
author: Siva
type: post
date: 2009-02-10T15:03:00+00:00
url: /2009/02/jdbc-datasource-configuration-in-tomcat/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2009/02/jdbc-datasource-configuration-in-tomcat.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/5946744285671238909
post_views_count:
  - 1
categories:
  - Java
tags:
  - Tomcat

---
Put a file named context.xml in META-INF folder which contains:

<?xml version=&#8221;1.0&#8243; encoding=&#8221;UTF-8&#8243;?>

<Context>  
<Resource name=&#8221;MySQLDS&#8221;   
type=&#8221;javax.sql.DataSource&#8221;   
driverClassName=&#8221;com.mysql.jdbc.Driver&#8221;   
password=&#8221;root&#8221;   
maxIdle=&#8221;2&#8243;   
maxWait=&#8221;5000&#8243;   
username=&#8221;root&#8221;   
url=&#8221;jdbc:mysql://localhost:3306/test&#8221;   
maxActive=&#8221;10&#8243;/>  
</Context>

Getting the DataSource:

Context context = new InitialContext();  
DataSource MYSQL_DATASOURCE = (DataSource) context.lookup(&#8220;java:comp/env/MySQLDS&#8221;);