---
title: Spring3+JPA2+JavaEE6AppServer = Confusion Over Configuration
author: Siva
type: post
date: 2012-10-12T05:38:00+00:00
url: /2012/10/spring3jpa2javaee6appserver-confusion-over-configuration/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/10/spring3jpa2javaee6appserver-confusion.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/134170754527821297
post_views_count:
  - 7
categories:
  - JavaEE
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

&nbsp;I am aware of JPA2 integration support from Spring without persistence.xml and cool packagesToScan attribute which makes life a bit easier. I configured 2 dataSources, 2 LocalContainerEntityManagerFactoryBeans, registered 2 JpaTransactionManagers and enabled Annotation based Transaction Management Support. 



<pre>&lt;tx:annotation-driven transaction-manager="txnManager1"/&gt;<br />	&lt;tx:annotation-driven transaction-manager="txnManager2"/&gt;<br />	<br />	&lt;bean class="org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor"/&gt;<br />	&lt;bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor"/&gt;&lt;!-- This will throw error because it found multiple EntityManagerFactory beans --&gt;<br />	<br />	&lt;bean id="txnManager1" <br />			class="org.springframework.orm.jpa.JpaTransactionManager"<br />       		p:entityManagerFactory-ref="emf1"/&gt;<br />    <br />    &lt;bean id="txnManager2" <br />			class="org.springframework.orm.jpa.JpaTransactionManager"<br />       		p:entityManagerFactory-ref="emf2"/&gt;       		<br />       <br />    &lt;bean id="emf1" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"&gt;<br />       	&lt;property name="persistenceUnitName" value="Sivalabs1PU"&gt;&lt;/property&gt;       	<br />       	&lt;property name="dataSource" ref="dataSource1"&gt;&lt;/property&gt;<br />       	&lt;property name="jpaVendorAdapter"&gt;<br />       		&lt;bean id="jpaAdapter" class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"<br />         			p:showSql="${hibernate.show_sql}"/&gt;<br />       	&lt;/property&gt;<br />       	&lt;property name="jpaProperties"&gt;<br />       		&lt;props&gt;<br />       			&lt;prop key="hibernate.dialect"&gt;${hibernate.dialect}&lt;/prop&gt;<br />       			&lt;prop key="hibernate.hbm2ddl.auto"&gt;${hibernate.hbm2ddl.auto}&lt;/prop&gt;<br />       		&lt;/props&gt;<br />       	&lt;/property&gt;<br />       	&lt;property name="packagesToScan" value="com.sivalabs.springdemo.entities"&gt;&lt;/property&gt;<br />       	&lt;property name="loadTimeWeaver"&gt;<br />          &lt;bean class="org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver"/&gt;<br />        &lt;/property&gt;<br />        <br />    &lt;/bean&gt; <br />    <br />   	&lt;bean id="emf2" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"&gt;<br />       	&lt;property name="persistenceUnitName" value="Sivalabs2PU"&gt;&lt;/property&gt;<br />       	&lt;property name="dataSource" ref="dataSource2"&gt;&lt;/property&gt;<br />       	&lt;property name="jpaVendorAdapter"&gt;<br />       		&lt;bean id="jpaAdapter" class="org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter"<br />         			p:showSql="${hibernate.show_sql}"/&gt;<br />       	&lt;/property&gt;<br />       	&lt;property name="jpaProperties"&gt;<br />       		&lt;props&gt;<br />       			&lt;prop key="hibernate.dialect"&gt;${hibernate.dialect}&lt;/prop&gt;<br />       			&lt;prop key="hibernate.hbm2ddl.auto"&gt;${hibernate.hbm2ddl.auto}&lt;/prop&gt;<br />       		&lt;/props&gt;<br />       	&lt;/property&gt;<br />       	&lt;property name="packagesToScan" value="com.sivalabs.springdemo.entities"&gt;&lt;/property&gt;<br />       	&lt;property name="loadTimeWeaver"&gt;<br />          &lt;bean class="org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver"/&gt;<br />        &lt;/property&gt;<br />        <br />    &lt;/bean&gt; <br />	<br />	&lt;bean id="dataSource1" class="org.apache.commons.dbcp.BasicDataSource"&gt;<br />		&lt;property name="driverClassName" value="${node1.jdbc.driverClassName}"&gt;&lt;/property&gt;<br />		&lt;property name="url" value="${node1.jdbc.url}"&gt;&lt;/property&gt;<br />		&lt;property name="username" value="${node1.jdbc.username}"&gt;&lt;/property&gt;<br />		&lt;property name="password" value="${node1.jdbc.password}"&gt;&lt;/property&gt;<br />	&lt;/bean&gt;<br />	<br />	&lt;bean id="dataSource2" class="org.apache.commons.dbcp.BasicDataSource"&gt;<br />		&lt;property name="driverClassName" value="${node2.jdbc.driverClassName}"&gt;&lt;/property&gt;<br />		&lt;property name="url" value="${node2.jdbc.url}"&gt;&lt;/property&gt;<br />		&lt;property name="username" value="${node2.jdbc.username}"&gt;&lt;/property&gt;<br />		&lt;property name="password" value="${node2.jdbc.password}"&gt;&lt;/property&gt;<br />	&lt;/bean&gt;<br /></pre>

After this I realized to bind Entitymanager with the correct PersistenceUnit I need to give persistenceUnitName to LocalContainerEntityManagerFactoryBean. 

<pre><br />	&lt;bean class="org.springframework.orm.jpa.support.PersistenceAnnotationBeanPostProcessor"&gt;<br />		&lt;property name="persistenceUnits" &gt;<br />	     &lt;map&gt;<br />	       &lt;entry key="unit1" value="Sivalabs1PU"/&gt;<br />	       &lt;entry key="unit2" value="Sivalabs2PU"/&gt;<br />	     &lt;/map&gt;<br />		&lt;/property&gt;<br />	&lt;/bean&gt;<br />	<br />	&lt;bean id="emf1" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"&gt;<br />       	&lt;property name="persistenceUnitName" value="Sivalabs1PU"&gt;&lt;/property&gt;<br />       	&lt;property name="dataSource" ref="dataSource1"&gt;&lt;/property&gt;<br />       	....<br />		....        <br />    &lt;/bean&gt; <br />    <br />   	&lt;bean id="emf2" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"&gt;<br />       	&lt;property name="persistenceUnitName" value="Sivalabs2PU"&gt;&lt;/property&gt;<br />       	&lt;property name="dataSource" ref="dataSource2"&gt;&lt;/property&gt;<br />        ....<br />		....        <br />    &lt;/bean&gt;<br /></pre>

Then in my Service Bean EntityManagers and transaction managers are glued together as follows: 

<pre>@Service<br />public class AdminUserService implements UserService<br />{<br />	@PersistenceContext(unitName="Sivalabs1PU")<br />	private EntityManager sivalabs1EM;<br />	@PersistenceContext(unitName="Sivalabs2PU")<br />	private EntityManager sivalabs2EM;<br />	<br />	@Override<br />	@Transactional("txnManager1")<br />	public List&lt;User&gt; getAllUsersFromSivalabs1DB() {<br />		return sivalabs1EM.createQuery("from User", User.class).getResultList();<br />	}<br /><br />	@Override<br />	@Transactional("txnManager2")<br />	public List&lt;User&gt; getAllUsersFromSivalabs2DB() {<br />		return sivalabs2EM.createQuery("from User", User.class).getResultList();<br />	}<br />	<br />}<br /></pre>

<pre></pre>

With this setup now I got the Exception saying &#8220;<span style="color: red;">No persistence unit with name &#8216;Sivalabs1PU&#8217; found</span>&#8220;. Then after some googling I created META-INF/persistence.xml file as follows: 

<pre>&lt;persistence&gt;<br /><br />   &lt;persistence-unit name="Sivalabs1PU" transaction-type="RESOURCE_LOCAL"&gt;   		<br />   &lt;/persistence-unit&gt;<br />   <br />   &lt;persistence-unit name="Sivalabs2PU"  transaction-type="RESOURCE_LOCAL"&gt;   		<br />   &lt;/persistence-unit&gt;<br />   <br />&lt;/persistence&gt;<br /></pre>

Now the persistence unit name error got resolved and got other Exception saying &#8220;<span style="color: red;">User is not mapped [from User]</span>&#8220;. The User class is annotated with @Entity and is in &#8220;**com.sivalabs.springdemo.entities**&#8221; package which I configured to &#8220;**packagesToScan**&#8221; attribute. I didn&#8217;t understand why &#8220;packagesToScan&#8221; attribute is not working which is working fine without persistence.xml. So for time being I configured entity classes in persistence.xml file. 

<pre>&lt;persistence&gt;<br /><br />   &lt;persistence-unit name="Sivalabs1PU" transaction-type="RESOURCE_LOCAL"&gt;   	<br />		&lt;class&gt;com.sivalabs.springdemo.entities.User&lt;/class&gt;   <br />   &lt;/persistence-unit&gt;<br />   <br />   &lt;persistence-unit name="Sivalabs2PU"  transaction-type="RESOURCE_LOCAL"&gt;   	<br />		&lt;class&gt;com.sivalabs.springdemo.entities.User&lt;/class&gt;<br />   &lt;/persistence-unit&gt;<br />   <br />&lt;/persistence&gt;<br /></pre>

Finally when I ran my JUnit Test which invokes AdminUserService methods everything looks good and working fine. Then I deployed the war file on JBoss AS 7.1 Server then again got a bunch of errors. JBoss is complaining that <span style="color: red;">&#8220;Connection cannot be null when &#8216;hibernate.dialect&#8217; not set&#8221; &#8230;. &#8220;[PersistenceUnit: Sivalabs1PU] Unable to build EntityManagerFactory&#8221;.</span>

After thinking for a couple of minutes, I understood that JBoss server is trying to do what it is supposed to do with &#8220;Convention Over Configuration&#8221; rules. JBoss is trying to create EntityManagerFactory because it found META-INF/persistence.xml in classpath. But as it doesn&#8217;t contain jdbc connection details its throwing Error.&nbsp; 

Again after some googling I found we can rename persistence.xml to something else(spring-persistence.xml) and hook up this new name with Spring as follows: 

<pre>&lt;bean id="emf1" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"&gt;<br />       	&lt;property name="persistenceUnitName" value="Sivalabs1PU"&gt;&lt;/property&gt;<br />		&lt;property name="persistenceXmlLocation" value="classpath:META-INF/spring-persistence.xml"/&gt;<br />       	&lt;property name="dataSource" ref="dataSource1"&gt;&lt;/property&gt;<br />       	....<br />		....        <br />    &lt;/bean&gt; <br />    <br />   	&lt;bean id="emf2" class="org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean"&gt;<br />       	&lt;property name="persistenceUnitName" value="Sivalabs2PU"&gt;&lt;/property&gt;<br />		&lt;property name="persistenceXmlLocation" value="classpath:META-INF/spring-persistence.xml"/&gt;<br />       	&lt;property name="dataSource" ref="dataSource2"&gt;&lt;/property&gt;<br />        ....<br />		....        <br />    &lt;/bean&gt;<br /></pre>

Finally I got this application working on my JBoss AS 7.1 successfully(Still I don&#8217;t know how many other holes are there that I haven&#8217;t yet found).

But here I didn&#8217;t understand few Spring concepts:  
_<span style="color: #cc0000;">1. When I try to give persistenceUnitName why Spring is checking for that name to be existed in persistence.xml? Anyway that persistence.xml doesn&#8217;t contain anything exception the unit-name!!</span>_  
_<span style="color: #cc0000;"><br /></span>__<span style="color: #cc0000;">2. Why packagesToScan mechanism is failing when used with persistence.xml? Is it a Spring Bug?</span>_

Everything seems to be working fine except one thing is missing, a smile on my face which usually I have when working with Spring and Tomcat 🙁

I like Spring framework very much and I am using it since 2006 and I do enjoy while writing Spring code. That doesn&#8217;t mean I don&#8217;t like CDI, EJB3, JAX-RS 🙂

&nbsp;Anyway, with all the above&nbsp;exercise&nbsp;I feel like <span style="color: red;"><b>Spring3+JPA2+JavaEE6AppServer=Confusion Over Configuration</b></span> and it is my(an average java developer) opinion only.

<span style="color: #cc0000; font-size: large;"><i>Again say one more time : Spring is great, JavaEE6 is great and latest JavaEE6 Application servers are also great :-).</i></span>