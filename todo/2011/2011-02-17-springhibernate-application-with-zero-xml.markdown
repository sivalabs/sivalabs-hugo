---
author: siva
comments: true
date: 2011-02-17 17:00:00+00:00
layout: post
slug: springhibernate-application-with-zero-xml
title: Spring+Hibernate Application with zero XML
wordpress_id: 279
categories:
- Hibernate
- Spring
- SpringMVC
tags:
- Hibernate
- Spring
- SpringMVC
---

Spring framework came up with Annotation support since 2.5 version which eases the development.  
Whether Annotation based approach better or XML approach is better is depends on the project and their personal preference.  
  
Let us see how we can write a Simple Application using Spring and Hibernate using Annotations, no xml at all.  
  
The configuration for JDBC datasource and Hibernate properties:  
  
**application.properties**  

    
    ################### JDBC Configuration ##########################<br></br>jdbc.driverClassName=org.hsqldb.jdbcDriver<br></br>jdbc.url=jdbc:hsqldb:file:db/SivaLabsDB;shutdown=true<br></br>jdbc.username=sa<br></br>jdbc.password=<br></br><br></br>################### Hibernate Configuration ##########################<br></br>hibernate.dialect=org.hibernate.dialect.HSQLDialect<br></br>hibernate.show_sql=true<br></br>hibernate.hbm2ddl.auto=update<br></br>hibernate.generate_statistics=true<br></br>

We can instantiate ApplicationContext from a java file having @Configuration annotation.  
  
AppConfig.java  

    
    package com.sivalabs.springmvc.config;<br></br><br></br>import org.springframework.beans.factory.config.PropertyPlaceholderConfigurer;<br></br>import org.springframework.context.annotation.Bean;<br></br>import org.springframework.context.annotation.Configuration;<br></br>import org.springframework.context.annotation.Import;<br></br>import org.springframework.core.io.ClassPathResource;<br></br><br></br>/**<br></br> * @author SivaLabs<br></br> *<br></br> */<br></br>@Import({RepositoryConfig.class})<br></br>@Configuration<br></br>public class AppConfig<br></br>{<br></br>    //<context:property-placeholder location="classpath:application.properties"></context:property-placeholder><br></br>    @Bean<br></br>    public PropertyPlaceholderConfigurer getPropertyPlaceholderConfigurer()<br></br>    {<br></br>        PropertyPlaceholderConfigurer ppc = new PropertyPlaceholderConfigurer();<br></br>        ppc.setLocation(new ClassPathResource("application.properties"));<br></br>        ppc.setIgnoreUnresolvablePlaceholders(true);<br></br>        return ppc;<br></br>    }<br></br>}<br></br>

Here @Import({RepositoryConfig.class}) means xml version of **<import resource="applicationContext-dao.xml"></import>**  

    
    package com.sivalabs.springmvc.config;<br></br><br></br>import java.util.HashMap;<br></br>import java.util.Map;<br></br>import java.util.Properties;<br></br><br></br>import javax.sql.DataSource;<br></br><br></br>import org.hibernate.SessionFactory;<br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.beans.factory.annotation.Value;<br></br>import org.springframework.context.annotation.Bean;<br></br>import org.springframework.context.annotation.Configuration;<br></br>import org.springframework.jdbc.datasource.DriverManagerDataSource;<br></br>import org.springframework.orm.hibernate3.HibernateTemplate;<br></br>import org.springframework.orm.hibernate3.HibernateTransactionManager;<br></br>import org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean;<br></br>import org.springframework.orm.hibernate3.support.IdTransferringMergeEventListener;<br></br>import org.springframework.transaction.annotation.AnnotationTransactionAttributeSource;<br></br>import org.springframework.transaction.interceptor.TransactionAttributeSource;<br></br>import org.springframework.transaction.interceptor.TransactionInterceptor;<br></br><br></br>/**<br></br> * @author SivaLabs<br></br> *<br></br> */<br></br>@Configuration<br></br>public class RepositoryConfig<br></br>{<br></br>    //${jdbc.driverClassName}<br></br>    @Value("${jdbc.driverClassName}")     private String driverClassName;<br></br>    @Value("${jdbc.url}")                 private String url;<br></br>    @Value("${jdbc.username}")             private String username;<br></br>    @Value("${jdbc.password}")             private String password;<br></br>    <br></br>    @Value("${hibernate.dialect}")         private String hibernateDialect;<br></br>    @Value("${hibernate.show_sql}")     private String hibernateShowSql;<br></br>    @Value("${hibernate.hbm2ddl.auto}") private String hibernateHbm2ddlAuto;<br></br>        <br></br>    @Bean()    <br></br>    public DataSource getDataSource()<br></br>    {<br></br>        DriverManagerDataSource ds = new DriverManagerDataSource();        <br></br>        ds.setDriverClassName(driverClassName);<br></br>        ds.setUrl(url);<br></br>        ds.setUsername(username);<br></br>        ds.setPassword(password);        <br></br>        return ds;<br></br>    }<br></br>    <br></br>    @Bean<br></br>    @Autowired <br></br>    public HibernateTransactionManager transactionManager(SessionFactory sessionFactory)<br></br>    {<br></br>        HibernateTransactionManager htm = new HibernateTransactionManager();<br></br>        htm.setSessionFactory(sessionFactory);<br></br>        return htm;<br></br>    }<br></br>    <br></br>    @Bean<br></br>    @Autowired<br></br>    public HibernateTemplate getHibernateTemplate(SessionFactory sessionFactory)<br></br>    {<br></br>        HibernateTemplate hibernateTemplate = new HibernateTemplate(sessionFactory);<br></br>        return hibernateTemplate;<br></br>    }<br></br>        <br></br>    @Bean<br></br>    public AnnotationSessionFactoryBean getSessionFactory()<br></br>    {<br></br>        AnnotationSessionFactoryBean asfb = new AnnotationSessionFactoryBean();<br></br>        asfb.setDataSource(getDataSource());<br></br>        asfb.setHibernateProperties(getHibernateProperties());        <br></br>        asfb.setPackagesToScan(new String[]{"com.sivalabs"});<br></br>        return asfb;<br></br>    }<br></br><br></br>    @Bean<br></br>    public Properties getHibernateProperties()<br></br>    {<br></br>        Properties properties = new Properties();<br></br>        properties.put("hibernate.dialect", hibernateDialect);<br></br>        properties.put("hibernate.show_sql", hibernateShowSql);<br></br>        properties.put("hibernate.hbm2ddl.auto", hibernateHbm2ddlAuto);<br></br>        <br></br>        return properties;<br></br>    }<br></br>    <br></br>}<br></br>

  
Create an Entity User as follows:  

    
    package com.sivalabs.springmvc.entities;<br></br><br></br>import javax.persistence.Entity;<br></br>import javax.persistence.GeneratedValue;<br></br>import javax.persistence.GenerationType;<br></br>import javax.persistence.Id;<br></br><br></br>/**<br></br> * @author SivaLabs<br></br> *<br></br> */<br></br><br></br>@Entity<br></br>public class User<br></br>{<br></br>    @Id<br></br>    @GeneratedValue(strategy = GenerationType.AUTO)<br></br>    private Integer id;<br></br>    private String name;<br></br>    private String address;<br></br>    <br></br>    public User()<br></br>    {<br></br>    }<br></br>    public User(Integer id, String name, String address)<br></br>    {<br></br>        this.id = id;<br></br>        this.name = name;<br></br>        this.address = address;<br></br>    }<br></br>    <br></br>    @Override<br></br>    public String toString()<br></br>    {<br></br>        return "User [address=" + address + ", id=" + id + ", name=" + name+ "]";<br></br>    }<br></br>    public Integer getId()<br></br>    {<br></br>        return id;<br></br>    }<br></br>    public void setId(Integer id)<br></br>    {<br></br>        this.id = id;<br></br>    }<br></br>    public String getName()<br></br>    {<br></br>        return name;<br></br>    }<br></br>    public void setName(String name)<br></br>    {<br></br>        this.name = name;<br></br>    }<br></br>    public String getAddress()<br></br>    {<br></br>        return address;<br></br>    }<br></br>    public void setAddress(String address)<br></br>    {<br></br>        this.address = address;<br></br>    }<br></br>    <br></br>}<br></br>

Create UserRepository to perform DB operations using Hibernate.  

    
    package com.sivalabs.springmvc.repositories;<br></br><br></br>import java.util.List;<br></br><br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.orm.hibernate3.HibernateTemplate;<br></br>import org.springframework.stereotype.Repository;<br></br>import org.springframework.transaction.annotation.Transactional;<br></br><br></br>import com.sivalabs.springmvc.entities.User;<br></br><br></br>/**<br></br> * @author SivaLabs<br></br> *<br></br>*/<br></br><br></br>@Transactional<br></br>@Repository<br></br>public class UserRepository<br></br>{<br></br>    @Autowired<br></br>    private HibernateTemplate hibernateTemplate;<br></br>    <br></br>    public List<User> getAllUsers()<br></br>    {<br></br>        return this.hibernateTemplate.loadAll(User.class);<br></br>    }<br></br>    <br></br>    public Integer createUser(User user)<br></br>    {<br></br>        User mergeUser = this.hibernateTemplate.merge(user);<br></br>        return mergeUser.getId();<br></br>    }<br></br>}<br></br>

  
Create a UserService class which is responsible for performing User operations.  

    
    package com.sivalabs.springmvc.services;<br></br><br></br>import java.util.List;<br></br><br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.stereotype.Service;<br></br><br></br>import com.sivalabs.springmvc.entities.User;<br></br>import com.sivalabs.springmvc.repositories.UserRepository;<br></br><br></br>/**<br></br> * @author SivaLabs<br></br> *<br></br> */<br></br><br></br>@Service<br></br>public class UserService<br></br>{<br></br>    @Autowired<br></br>    private UserRepository userRepository;<br></br>    <br></br>    public List<User> getAllUsers()<br></br>    {<br></br>        return this.userRepository.getAllUsers();<br></br>    }<br></br>    <br></br>    public Integer createUser(User user)<br></br>    {<br></br>        return this.userRepository.createUser(user);<br></br>    }<br></br>}<br></br>

  
Now let us create ApplicationContext from AppConfig.java and test the functionality.  

    
    package com.sivalabs.test;<br></br><br></br>import java.util.List;<br></br><br></br>import org.springframework.context.ApplicationContext;<br></br>import org.springframework.context.annotation.AnnotationConfigApplicationContext;<br></br>import org.springframework.context.support.ClassPathXmlApplicationContext;<br></br><br></br>import com.sivalabs.springmvc.entities.User;<br></br>import com.sivalabs.springmvc.services.UserService;<br></br><br></br>public class ContainerTest<br></br>{<br></br>    public static void main(String[] args)<br></br>    {<br></br>        AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();<br></br>        ctx.scan("com.sivalabs");//This will load the configured components UserService, UserRepository, <br></br>        ctx.refresh();<br></br>        <br></br>        System.out.println(ctx);<br></br>        UserService userService = ctx.getBean("userService", UserService.class);<br></br>        <br></br>        List<User> allUser = userService.getAllUsers();<br></br>        for (User u : allUser)<br></br>        {<br></br>            System.out.println(u);<br></br>        }<br></br>        <br></br>        User user = new User(null, "K.siva reddy", "hyderabad");<br></br>        Integer id = userService.createUser(user);<br></br>        System.out.println("Newly created User Id="+id);<br></br>        allUser = userService.getAllUsers();<br></br>        for (User u : allUser)<br></br>        {<br></br>            System.out.println(u);<br></br>        }<br></br>    }<br></br><br></br>}<br></br>

**See how application development is much more easier now with Annotations.**
