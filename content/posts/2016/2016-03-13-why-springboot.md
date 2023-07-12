---
title: Why SpringBoot?
author: Siva
type: post
date: 2016-03-13T07:02:10+00:00
url: /why-springboot/
aliases: /2016/03/why-springboot/
categories:
  - Spring
tags:
  - SpringBoot
popular: true
---
Spring is a very popular Java based framework for building web and enterprise applications. Unlike many other frameworks which focuses on only one area, Spring framework provides a wide verity of features addressing the modern business needs via its portfolio projects.

Spring framework provides flexibility to configure the beans in multiple ways such as **XML**, **Annotations** and **JavaConfig**. With the number of features increased the complexity also gets increased and configuring Spring applications becomes tedious and error-prone.

Spring team created SpringBoot to address the complexity of configuration.

But before diving into SpringBoot, we will take a quick look at Spring framework and see what kind of problems SpringBoot is trying to address.

**In this article we will cover:**

  * Overview of Spring framework
  * A web application using Spring MVC and JPA(Hibernate)
  * A quick taste of SpringBoot

## Overview of Spring framework
  
If you are a Java developer then there is a high chance that you might have heard about Spring framework and probably have used it in your projects. Spring framework was created primarily as a Dependency Injection container but it is much more than that.

**Spring is very popular because of several reasons:**

  * Spring’s dependency injection approach encourages writing testable code
  * Easy to use but powerful database transaction management capabilities
  * Spring simplifies integration with other Java frameworks like JPA/Hibernate ORM, Struts/JSF etc web frameworks
  * State of the art Web MVC framework for building web applications

Along with Spring framework there are many other Spring sister projects which helps to build applications addressing modern business needs:

  * Spring Data: Simplifies data access from relational and NoSQL data stores.
  * Spring Batch: Provides powerful batch processing framework.
  * Spring Security: Robust security framework to secure applications.
  * Spring Social: Supports integration with social networking sites like Facebook, Twitter, LinkedIn, GitHub etc.
  * Spring Integration: An implementation of Enterprise Integration Patterns to facilitate integration with other enterprise applications using lightweight messaging and declarative adapters.

There are many other interesting projects addressing various other modern application development needs. For more information take a look at <http://spring.io/projects>.

In the initial days, Spring framework provides XML based approach for configuring beans. Later Spring introduced XML based DSLs, Annotations and JavaConfig based approaches for configuring beans.

Let us take a quick look at how each of those configuration styles looks like.


### XML based configuration

```xml
<bean id="userService" class="com.sivalabs.myapp.service.UserService">
    <property name="userDao" ref="userDao"/>
</bean>

<bean id="userDao" class="com.sivalabs.myapp.dao.JdbcUserDao">
    <property name="dataSource" ref="dataSource"/>
</bean>

<bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
    <property name="driverClassName" value="com.mysql.jdbc.Driver"/>
    <property name="url" value="jdbc:mysql://localhost:3306/test"/>
    <property name="username" value="root"/>
    <property name="password" value="secret"/>
</bean>
```

### Annotation based configuration


```java
@Service
public class UserService
{
    private UserDao userDao;

    @Autowired
    public UserService(UserDao dao){
        this.userDao = dao;
    }
    ...
    ...
}
```

```java
@Repository
public class JdbcUserDao
{
    private DataSource dataSource;

    @Autowired
    public JdbcUserDao(DataSource dataSource){
        this.dataSource = dataSource;
    }
    ...
    ...
}
```

### JavaConfig based configuration

```java
@Configuration
public class AppConfig
{
    @Bean
    public UserService userService(UserDao dao){
        return new UserService(dao);
    }

    @Bean
    public UserDao userDao(DataSource dataSource){
        return new JdbcUserDao(dataSource);
    }

    @Bean
    public DataSource dataSource(){
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName("com.mysql.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://localhost:3306/test");
        dataSource.setUsername("root");
        dataSource.setPassword("secret");
        return dataSource;
    }
}
```

Wow… Spring provides many approaches for doing the same thing and we can even mix the approaches as well like you can use both JavaConfig and Annotation based configuration styles in the same application.

> That is a lot of flexibility and it is one way good and one way bad. People new to Spring framework may gets confused about which approach to follow. As of now the Spring team is suggesting to follow JavaConfig based approach as it gives more flexibility.

But there is no one-size fits all kind of solution. One has to choose the approach based on their own application needs.

OK, now that you had a glimpse of how various styles of Spring bean configurations looks like.

**You can find the source code of this article on GitHub at <a href="https://github.com/sivaprasadreddy/springboot-tutorials">https://github.com/sivaprasadreddy/springboot-tutorials</a>**

Let us take a quick look at the configuration of a typical SpringMVC + JPA/Hibernate web application configuration looks like.

## A web application using Spring MVC and JPA(Hibernate)

Before getting to know what is SpringBoot and what kind of features it provides, let us take a look at how a typical Spring web application configuration looks like, what are the pain points and then we will discuss about how SpringBoot addresses those problems.

**Step 1: Configure Maven Dependencies**

First thing we need to do is configure all the dependencies required in our **pom.xml**.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                        http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sivalabs</groupId>
    <artifactId>springmvc-jpa-demo</artifactId>
    <packaging>war</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>springmvc-jpa-demo</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>      
        <failOnMissingWebXml>false</failOnMissingWebXml>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>4.2.4.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.data</groupId>
            <artifactId>spring-data-jpa</artifactId>
            <version>1.9.2.RELEASE</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>jcl-over-slf4j</artifactId>
            <version>1.7.13</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-api</artifactId>
            <version>1.7.13</version>
        </dependency>
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
            <version>1.7.13</version>
        </dependency>
        <dependency>
            <groupId>log4j</groupId>
            <artifactId>log4j</artifactId>
            <version>1.2.17</version>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <version>1.4.190</version>
        </dependency>
        <dependency>
            <groupId>commons-dbcp</groupId>
            <artifactId>commons-dbcp</artifactId>
            <version>1.4</version>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.38</version>
        </dependency>
        <dependency>
            <groupId>org.hibernate</groupId>
            <artifactId>hibernate-entitymanager</artifactId>
            <version>4.3.11.Final</version>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf</groupId>
            <artifactId>thymeleaf-spring4</artifactId>
            <version>2.1.4.RELEASE</version>
        </dependency>
    </dependencies>
</project>
```

We have configured all our Maven jar dependencies to include Spring MVC, Spring Data JPA, JPA/Hibernate, Thymeleaf and Log4j.

**Step 2: Configure Service/DAO layer beans using JavaConfig.**

```java
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages="com.sivalabs.demo")
@PropertySource(value = { "classpath:application.properties" })
public class AppConfig 
{
    @Autowired
    private Environment env;

    @Bean
    public static PropertySourcesPlaceholderConfigurer placeHolderConfigurer()
    {
        return new PropertySourcesPlaceholderConfigurer();
    }
    
    @Value("${init-db:false}")
    private String initDatabase;
    
    @Bean
    public PlatformTransactionManager transactionManager()
    {
        EntityManagerFactory factory = entityManagerFactory().getObject();
        return new JpaTransactionManager(factory);
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean entityManagerFactory()
    {
        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();

        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setGenerateDdl(Boolean.TRUE);
        vendorAdapter.setShowSql(Boolean.TRUE);

        factory.setDataSource(dataSource());
        factory.setJpaVendorAdapter(vendorAdapter);
        factory.setPackagesToScan("com.sivalabs.demo");

        Properties jpaProperties = new Properties();
        jpaProperties.put("hibernate.hbm2ddl.auto", env.getProperty("hibernate.hbm2ddl.auto"));
        factory.setJpaProperties(jpaProperties);

        factory.afterPropertiesSet();
        factory.setLoadTimeWeaver(new InstrumentationLoadTimeWeaver());
        return factory;
    }

    @Bean
    public HibernateExceptionTranslator hibernateExceptionTranslator()
    {
        return new HibernateExceptionTranslator();
    }
    
    @Bean
    public DataSource dataSource()
    {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
        dataSource.setUrl(env.getProperty("jdbc.url"));
        dataSource.setUsername(env.getProperty("jdbc.username"));
        dataSource.setPassword(env.getProperty("jdbc.password"));
        return dataSource;
    }
    
    @Bean
    public DataSourceInitializer dataSourceInitializer(DataSource dataSource) 
    {
        DataSourceInitializer dataSourceInitializer = new DataSourceInitializer();
        dataSourceInitializer.setDataSource(dataSource);
        ResourceDatabasePopulator databasePopulator = new ResourceDatabasePopulator();
        databasePopulator.addScript(new ClassPathResource("data.sql"));
        dataSourceInitializer.setDatabasePopulator(databasePopulator);
        dataSourceInitializer.setEnabled(Boolean.parseBoolean(initDatabase));
        return dataSourceInitializer;
    }   
}
```


In our AppConfig.java configuration class we have done the following:

  * Marked it as as a Spring Configuration class using **@Configuration** annotation.
  * Enabled Annotation based transaction management using **@EnableTransactionManagement**
  * Configured **@EnableJpaRepositories** to indicate where to look for Spring Data JPA repositories
  * Configured PropertyPlaceHolder bean using **@PropertySource** annotation and **PropertySourcesPlaceholderConfigurer** bean definition which loads properties from **application.properties** file.
  * Defined beans for **DataSource**, JPA **EntityManagerFactory**, **JpaTransactionManager**.
  * Configured **DataSourceInitializer** bean to initialize the database by executing **data.sql** script on application start up.

we need to configure property placeholder values in **application.properties** in src/main/resources as follows:


```properties
jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/test
jdbc.username=root
jdbc.password=admin
init-db=true
hibernate.dialect=org.hibernate.dialect.MySQLDialect
hibernate.show_sql=true
hibernate.hbm2ddl.auto=update
```

we can create a simple sql script **data.sql** to populate sample data into **USER** table.

```sql
delete from user;
insert into user(id, name) values(1,'Siva');
insert into user(id, name) values(2,'Prasad');
insert into user(id, name) values(3,'Reddy');
```

We can create **log4j.properties** file with basic configuration as follows:

```properties
log4j.rootCategory=INFO, stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%5p %t %c{2}:%L - %m%n

log4j.category.org.springframework=INFO
log4j.category.com.sivalabs=DEBUG
```

**Step 3: Configure Spring MVC web layer beans**

We will have to configure Thymeleaf **ViewResolver**, static **ResourceHandlers**, **MessageSource** for i18n etc.

```java
@Configuration
@ComponentScan(basePackages = { "com.sivalabs.demo"}) 
@EnableWebMvc
public class WebMvcConfig extends WebMvcConfigurerAdapter
{
    @Bean
    public TemplateResolver templateResolver() {
        TemplateResolver templateResolver = new ServletContextTemplateResolver();
        templateResolver.setPrefix("/WEB-INF/views/");
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode("HTML5");
        templateResolver.setCacheable(false);
        return templateResolver;
    }

    @Bean
    public SpringTemplateEngine templateEngine() {
        SpringTemplateEngine templateEngine = new SpringTemplateEngine();
        templateEngine.setTemplateResolver(templateResolver());
        return templateEngine;
    }

    @Bean
    public ThymeleafViewResolver viewResolver() {
        ThymeleafViewResolver thymeleafViewResolver = new ThymeleafViewResolver();
        thymeleafViewResolver.setTemplateEngine(templateEngine());
        thymeleafViewResolver.setCharacterEncoding("UTF-8");
        return thymeleafViewResolver;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry)
    {
        registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
    }

    @Override
    public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer)
    {
        configurer.enable();
    }

    @Bean(name = "messageSource")
    public MessageSource configureMessageSource()
    {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:messages");
        messageSource.setCacheSeconds(5);
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }
}
```

In our **WebMvcConfig.java** configuration class we have done the following:

  * Marked it as as a Spring Configuration class using **@Configuration** annotation.
  * Enabled Annotation based Spring MVC configuration using **@EnableWebMvc**
  * Configured Thymeleaf ViewResolver by registering **TemplateResolver**, **SpringTemplateEngine**, **ThymeleafViewResolver** beans.
  * Registered ResourceHandlers bean to indicate requests for static resources with URI **/resources/**** will be served from the location **/resources/** directory.
  * Configured **MessageSource** bean to load i18n messages from ResourceBundle **messages-{country-code}.properties** from classpath.

For now we do not have any messages to be configured, so create an empty **messages.properties** file in **src/main/resources** folder.

**Step 4: Register Spring MVC FrontController servlet DispatcherServlet.**

Prior to Servlet 3.x specification we have to register Servlets/Filters in **web.xml**. Since Servlet 3.x specification we can register Servlets/Filters programatically using **ServletContainerInitializer**.

Spring MVC provides a convenient class **AbstractAnnotationConfigDispatcherServletInitializer** to register **DispatcherServlet**.

```java
public class SpringWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer
{

    @Override
    protected Class<?>[] getRootConfigClasses()
    {
        return new Class<?>[] { AppConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses()
    {
        return new Class<?>[] { WebMvcConfig.class };
    }

    @Override
    protected String[] getServletMappings()
    {
        return new String[] { "/" };
    }

    @Override
    protected Filter[] getServletFilters() {
       return new Filter[]{ new OpenEntityManagerInViewFilter() };
    }
}
```

In our **SpringWebAppInitializer.java** configuration class we have done the following:

  * We have configured **AppConfig.class** as **RootConfirationClasses** which will become the parent **ApplicationContext** that contains bean definitions shared by all child (**DispatcherServlet**) contexts.
  * We have configured **WebMvcConfig.class** as **ServletConfigClasses** which is child **ApplicationContext** that contains WebMvc bean definitions.
  * We have configured **”/”** as **ServletMapping** means all the requests will be handled by **DispatcherServlet**.
  * We have registered **OpenEntityManagerInViewFilter** as a Servlet Filter so that we can lazy load the JPA Entity lazy collections while rendering the view.

**Step 5: Create a JPA Entity and Spring Data JPA Repository**

Create a JPA entity **User.java** and a Spring Data JPA repository for User entity.

```java
@Entity
public class User
{
    @Id @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;
    private String name;

    //setters and getters
}
```

```java
public interface UserRepository extends JpaRepository<User, Integer>
{
}
```

**Step 6: Create a SpringMVC Controller**

Create a SpringMVC controller to handle URL **"/"** and render list of users.

```java
@Controller
public class HomeController
{
    @Autowired UserRepository userRepo;

    @RequestMapping("/")
    public String home(Model model)
    {
        model.addAttribute("users", userRepo.findAll());
        return "index";
    }
}
```

**Step 7: Create a thymeleaf view /WEB-INF/views/index.html to render list of Users.**

```xml
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
      xmlns:th="http://www.thymeleaf.org">
<head>
<meta charset="utf-8"/>
<title>Home</title>
</head>
<body>
    <table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            <tr th:each="user : ${users}">
                <td th:text="${user.id}">Id</td>
                <td th:text="${user.name}">Name</td>
            </tr>
        </tbody>
    </table>
</body>
</html>
```

We are all set now to run the application. But before that we need to download and configure the server like 
**Tomcat** or **Jetty** or **Wildfly** etc in your IDE.

You can download Tomcat 8 and configure in your favourite IDE,run the application and point your browser to 
**http://localhost:8080/springmvcjpa-demo**. You should see the list of users details in a table.

Yay…We did it.

**But wait..Isn’t it too much work to just show a list of user details pulled from a database table?
Let us be honest and fair. All this configuration is not just for this one use-case. 
This configuration is basis for rest of the application also.**

**But again, this is too much of work to do if you want to quickly get up and running. 
Another problem with it is, assume you want to develop another SpringMVC application with similar technical stack?**

**Well, you copy-paste the configuration and tweak it. Right? But remember one thing: if you have to do the same thing again and again,
you should find an automated way to do it.**

Apart from writing the same configuration again and again, do you see any other problems here?

**Well, let me list our what are the problems I am seeing here.**

  * You need to hunt for all the **compatible libraries** for the specific Spring version and configure them.
  * 95% of the times we configure the **DataSource**, **EntitymanagerFactory**, **TransactionManager** etc beans in the same way. Wouldn’t it be great if Spring can do it for me automatically.
  * Similarly we configure SpringMVC beans like **ViewResolver**, **MessageSource** etc in the same way most of the times.

> If Spring can automatically do it for me that would be awesome!!!.

Imagine, what if Spring is capable of configuring beans automatically? 
What if you can customize the automatic configuration using simple customizable properties?
For example, instead of mapping DispatcherServlet url-pattern to “/” you want to map it to “/app/”. 
Instead of putting thymeleaf views in “/WEB-INF/views” folder you may want to place them in “/WEB-INF/templates/” folder.
So basically you want Spring to do things automatically but provide the flexibility to override the default configuration in a simpler way?
Well, you are about to enter into the world of SpringBoot where your dreams come true!!!

## A quick taste of SpringBoot
  
Welcome to SpringBoot!. SpringBoot do what exactly you are looking for. It will do things automatically for you but allows you to override the defaults if you want to.

Instead of explaining in theory I prefer to explain by example.

So let us implement the same application that we built earlier but this time using SpringBoot.

**Step 1: Create a Maven based SpringBoot Project**

Create a Maven project and configure the dependencies as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                        http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sivalabs</groupId>
    <artifactId>hello-springboot</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>hello-springboot</name>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.3.2.RELEASE</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
    </dependencies>
</project>
```

Wow our **pom.xml** suddenly become so small!!.

**Step 2: Configure datasource/JPA properties in application.properties in src/main/resources as follows.**

```properties
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=admin
spring.datasource.initialize=true
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

you can copy the same **data.sql** file into **src/main/resources** folder.

**Step 3: Create a JPA Entity and Spring Data JPA Repository Interface for the entity.**

Create **User.java, UserRepository.java** and **HomeController.java** same as in **springmvc-jpa-demo** application.

**Step 4: Create Thymeleaf view to show list of users**

Copy **/WEB-INF/views/index.html** that we created in **springmvc-jpa-demo** application into **src/-main/resources/templates** folder in our new project.

**Step 5: Create SpringBoot EntryPoint Class.**

Create a Java class **Application.java** with main method as follows:

```java
@SpringBootApplication
public class Application
{
    public static void main(String[] args)
    {
        SpringApplication.run(Application.class, args);
    }
}
```

Now run **Application.java** as a Java Application and point your browser to **http://localhost:8080/**.

You should see the list of users in table format. Coool!!!

Ok ok, I hear you are shouting “What is going on???”.

Let me explain what just happened.

**1. Easy dependency Management**

  * First thing to observe is we are using some dependencies named like **spring-boot-starter-***.
  
    Remember I said “95% of the times I use same configuration”. So when you add **springboot-starter-web** dependency by default it will pull all the commonly used libraries while developing Spring MVC applications such as **spring-webmvc, jackson-json, validation-api** and **tomcat**.
  * We have added **spring-boot-starter-data-jpa** dependency. This pulls all the **spring-data-jpa** dependencies and also adds **Hibernate** libraries because majority of the applications use Hibernate as JPA implementation.

**2. Auto Configuration**

  * Not only the **spring-boot-starter-web** adds all these libraries but also configures the commonly registered beans like **DispatcherServlet, ResourceHandlers, MessageSource** etc beans with sensible defaults.
  * We also added **spring-boot-starter-thymeleaf** which not only adds the thymeleaf library dependencies but also configures **ThymeleafViewResolver** beans as well automatically.
  * We haven’t defined any of the **DataSource, EntityManagerFactory, TransactionManager** etc beans but they are automatically gets created. **How?** 
  
  If we have any in-memory database drivers like **H2** or **HSQL** in our classpath then SpringBoot will automatically creates an in-memory **DataSource** and then registers **EntityManagerFactory, TransactionManager** beans automatically with sensible defaults.But we are using MySQL, so we need to explicitly provide MySQL connection details. We have configured those MySQL connection details in **application.properties** file and SpringBoot creates a **DataSource** using these properties.

**3. Embedded Servlet Container Support**

The most important and surprising thing is we have created a simple Java class annotated with some magical annotation **@SpringBootApplication** having a main method and by running that main we are able to run the application and access it at **http://localhost:8080/**.

**Where is the servlet container comes from?**
  
We have added **spring-boot-starter-web** which pull the **spring-boot-starter-tomcat** automatically and when we run the main() method it started tomcat as an **embedded container** so that we don’t have to deploy our application on any externally installed tomcat server.

By the way have you observe that our packaging type in **pom.xml** is **‘jar’ not ‘war’**. Wonderful!

**Ok, but what if I want to use Jetty server instead of tomcat?**
  
Simple, exclude **spring-bootstarter-tomcat** from **spring-boot-starter-web** and include **spring-boot-starter-jetty**.

That’s it.
  
But, this looks all magical!!!

I can imagine what you are thinking. You are thinking like SpringBoot looks cool and it is doing lot of things automatically for me. But still I am not fully understand how it is all really working behind the scenes. Right?

I can understand. Watching magic show is fun normally, but not in Software Development. Don’t worry, we will be looking at each of those things and explain in-detail how things are happening behind the scenes in future articles. But I don’t want to overwhelm you by dumping everything on to your hear right now in this article.

### Summary

In this article we had a quick overview of various Spring configuration styles and understand the complexity of configuring Spring applications. Also, we had a quick look at SpringBoot by creating a simple web application.

In next article we will deep dive into SpringBoot and understand how it works.

[How SpringBoot AutoConfiguration Works?]({{< relref "2016-03-13-how-springboot-autoconfiguration-magic.md" >}})

