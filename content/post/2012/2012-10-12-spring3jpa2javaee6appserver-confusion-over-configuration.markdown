---
author: siva
comments: true
date: 2012-10-12 11:08:00+00:00
layout: post
slug: spring3jpa2javaee6appserver-confusion-over-configuration
title: Spring3+JPA2+JavaEE6AppServer = Confusion Over Configuration
wordpress_id: 235
categories:
- Hibernate
- Java
- JavaEE
- JBoss
- Spring
tags:
- Hibernate
- Java
- JavaEE
- JBoss
- Spring
---

Spring is great, JavaEE6 is great and latest JavaEE6 Application servers are also great. This post is not a rant on Spring Vs JavaEE6, but my experience of porting a Spring3+JPA2(Hibernate) application on JBoss AS-7.1 App Server.  
  
My application requirement is very simple: Developing a couple of SOAP based webservices using Spring3.1 and JPA2(Hibernate) and host it on JBoss AS 7.1.  
  
So I started creating a multi-module maven project with one jar module containing the service implementations using Spring & JPA and another war module which exposes those services as SOAP based webservices. But the key part is services needs to talk to multiple databases for some of the service methods.  
  
I am aware of JPA2 integration support from Spring without persistence.xml and cool packagesToScan attribute which makes life a bit easier. I configured 2 dataSources, 2 LocalContainerEntityManagerFactoryBeans, registered 2 JpaTransactionManagers and enabled Annotation based Transaction Management Support.    
  
  

    
    	<tx:annotation-driven transaction-manager="txnManager1"/><br></br>	<tx:annotation-driven transaction-manager="txnManager2"/><br></br>	<br></br>	<bean class="org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor"/><br></br>	<bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor"/><!-- This will throw error because it found multiple EntityManagerFactory beans --><br></br>	<br></br>	<bean id="txnManager1" <br></br>			class="org.springframework.orm.jpa.JpaTransactionManager"<br></br>       		p:entityManagerFactory-ref="emf1"/><br></br>    <br></br>    <bean id="txnManager2" <br></br>			class="org.springframework.orm.jpa.JpaTransactionManager"<br></br>       		p:entityManagerFactory-ref="emf2"/>       		<br></br>       <br></br>    <bean id="emf1" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"><br></br>       	<property name="persistenceUnitName" value="Sivalabs1PU"></property>       	<br></br>       	<property name="dataSource" ref="dataSource1"></property><br></br>       	<property name="jpaVendorAdapter"><br></br>       		<bean id="jpaAdapter" class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"<br></br>         			p:showSql="${hibernate.show_sql}"/><br></br>       	</property><br></br>       	<property name="jpaProperties"><br></br>       		<props><br></br>       			<prop key="hibernate.dialect">${hibernate.dialect}</prop><br></br>       			<prop key="hibernate.hbm2ddl.auto">${hibernate.hbm2ddl.auto}</prop><br></br>       		</props><br></br>       	</property><br></br>       	<property name="packagesToScan" value="com.sivalabs.springdemo.entities"></property><br></br>       	<property name="loadTimeWeaver"><br></br>          <bean class="org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver"/><br></br>        </property><br></br>        <br></br>    </bean> <br></br>    <br></br>   	<bean id="emf2" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"><br></br>       	<property name="persistenceUnitName" value="Sivalabs2PU"></property><br></br>       	<property name="dataSource" ref="dataSource2"></property><br></br>       	<property name="jpaVendorAdapter"><br></br>       		<bean id="jpaAdapter" class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"<br></br>         			p:showSql="${hibernate.show_sql}"/><br></br>       	</property><br></br>       	<property name="jpaProperties"><br></br>       		<props><br></br>       			<prop key="hibernate.dialect">${hibernate.dialect}</prop><br></br>       			<prop key="hibernate.hbm2ddl.auto">${hibernate.hbm2ddl.auto}</prop><br></br>       		</props><br></br>       	</property><br></br>       	<property name="packagesToScan" value="com.sivalabs.springdemo.entities"></property><br></br>       	<property name="loadTimeWeaver"><br></br>          <bean class="org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver"/><br></br>        </property><br></br>        <br></br>    </bean> <br></br>	<br></br>	<bean id="dataSource1" class="org.apache.commons.dbcp.BasicDataSource"><br></br>		<property name="driverClassName" value="${node1.jdbc.driverClassName}"></property><br></br>		<property name="url" value="${node1.jdbc.url}"></property><br></br>		<property name="username" value="${node1.jdbc.username}"></property><br></br>		<property name="password" value="${node1.jdbc.password}"></property><br></br>	</bean><br></br>	<br></br>	<bean id="dataSource2" class="org.apache.commons.dbcp.BasicDataSource"><br></br>		<property name="driverClassName" value="${node2.jdbc.driverClassName}"></property><br></br>		<property name="url" value="${node2.jdbc.url}"></property><br></br>		<property name="username" value="${node2.jdbc.username}"></property><br></br>		<property name="password" value="${node2.jdbc.password}"></property><br></br>	</bean><br></br>

  
After this I realized to bind Entitymanager with the correct PersistenceUnit I need to give persistenceUnitName to LocalContainerEntityManagerFactoryBean.    
  

    
    	<br></br>	<bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor"><br></br>		<property name="persistenceUnits" ><br></br>	     <map><br></br>	       <entry key="unit1" value="Sivalabs1PU"/><br></br>	       <entry key="unit2" value="Sivalabs2PU"/><br></br>	     </map><br></br>		</property><br></br>	</bean><br></br>	<br></br>	<bean id="emf1" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"><br></br>       	<property name="persistenceUnitName" value="Sivalabs1PU"></property><br></br>       	<property name="dataSource" ref="dataSource1"></property><br></br>       	....<br></br>		....        <br></br>    </bean> <br></br>    <br></br>   	<bean id="emf2" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"><br></br>       	<property name="persistenceUnitName" value="Sivalabs2PU"></property><br></br>       	<property name="dataSource" ref="dataSource2"></property><br></br>        ....<br></br>		....        <br></br>    </bean><br></br>

  
Then in my Service Bean EntityManagers and transaction managers are glued together as follows:     
  

    
    @Service<br></br>public class AdminUserService implements UserService<br></br>{<br></br>	@PersistenceContext(unitName="Sivalabs1PU")<br></br>	private EntityManager sivalabs1EM;<br></br>	@PersistenceContext(unitName="Sivalabs2PU")<br></br>	private EntityManager sivalabs2EM;<br></br>	<br></br>	@Override<br></br>	@Transactional("txnManager1")<br></br>	public List<User> getAllUsersFromSivalabs1DB() {<br></br>		return sivalabs1EM.createQuery("from User", User.class).getResultList();<br></br>	}<br></br><br></br>	@Override<br></br>	@Transactional("txnManager2")<br></br>	public List<User> getAllUsersFromSivalabs2DB() {<br></br>		return sivalabs2EM.createQuery("from User", User.class).getResultList();<br></br>	}<br></br>	<br></br>}<br></br>

With this setup now I got the Exception saying "No persistence unit with name 'Sivalabs1PU' found".  Then after some googling I created  META-INF/persistence.xml file as follows:    
  

    
    <persistence><br></br><br></br>   <persistence-unit name="Sivalabs1PU" transaction-type="RESOURCE_LOCAL">   		<br></br>   </persistence-unit><br></br>   <br></br>   <persistence-unit name="Sivalabs2PU"  transaction-type="RESOURCE_LOCAL">   		<br></br>   </persistence-unit><br></br>   <br></br></persistence><br></br>

  
Now the persistence unit name error got resolved and got other Exception saying "User is not mapped [from User]". The User class is annotated with @Entity and is in "**com.sivalabs.springdemo.entities**" package which I configured to "**packagesToScan**" attribute. I didn't understand why "packagesToScan" attribute is not working which is working fine without persistence.xml. So for time being I configured entity classes in persistence.xml file.    
  

    
    <persistence><br></br><br></br>   <persistence-unit name="Sivalabs1PU" transaction-type="RESOURCE_LOCAL">   	<br></br>		<class>com.sivalabs.springdemo.entities.User</class>   <br></br>   </persistence-unit><br></br>   <br></br>   <persistence-unit name="Sivalabs2PU"  transaction-type="RESOURCE_LOCAL">   	<br></br>		<class>com.sivalabs.springdemo.entities.User</class><br></br>   </persistence-unit><br></br>   <br></br></persistence><br></br>

  
Finally when I ran my JUnit Test which invokes AdminUserService methods everything looks good and working fine. Then I deployed the war file on JBoss AS 7.1 Server then again got a bunch of errors.  JBoss is complaining that "Connection cannot be null when 'hibernate.dialect' not set" .... "[PersistenceUnit: Sivalabs1PU] Unable to build EntityManagerFactory".  
  
After thinking for a couple of minutes, I understood that JBoss server is trying to do what it is supposed to do with "Convention Over Configuration" rules. JBoss is trying to create EntityManagerFactory because it found META-INF/persistence.xml in classpath. But as it doesn't contain jdbc connection details its throwing Error.   
  
Again after some googling I found we can rename persistence.xml to something else(spring-persistence.xml) and hook up this new name with Spring as follows:    
  

    
    	<bean id="emf1" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"><br></br>       	<property name="persistenceUnitName" value="Sivalabs1PU"></property><br></br>		<property name="persistenceXmlLocation" value="classpath:META-INF/spring-persistence.xml"/><br></br>       	<property name="dataSource" ref="dataSource1"></property><br></br>       	....<br></br>		....        <br></br>    </bean> <br></br>    <br></br>   	<bean id="emf2" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"><br></br>       	<property name="persistenceUnitName" value="Sivalabs2PU"></property><br></br>		<property name="persistenceXmlLocation" value="classpath:META-INF/spring-persistence.xml"/><br></br>       	<property name="dataSource" ref="dataSource2"></property><br></br>        ....<br></br>		....        <br></br>    </bean><br></br>

  
Finally I got this application working on my JBoss AS 7.1 successfully(Still I don't know how many other holes are there that I haven't yet found).  
  
But here I didn't understand few Spring concepts:  
_1. When I try to give persistenceUnitName why Spring is checking for that name to be existed in persistence.xml? Anyway that persistence.xml doesn't contain anything exception the unit-name!!_  
_  
__2. Why packagesToScan mechanism is failing when used with persistence.xml? Is it a Spring Bug?_  
  
Everything seems to be working fine except one thing is missing, a smile on my face which usually I have when working with Spring and Tomcat :-(  
  
I like Spring framework very much and I am using it since 2006 and I do enjoy while writing Spring code. That doesn't mean I don't like CDI, EJB3, JAX-RS :-)  
  
Anyway, with all the above exercise I feel like **Spring3+JPA2+JavaEE6AppServer=Confusion Over Configuration** and it is my(an average java developer) opinion only.  
  
_Again say one more time : Spring is great, JavaEE6 is great and latest JavaEE6 Application servers are also great :-)._
