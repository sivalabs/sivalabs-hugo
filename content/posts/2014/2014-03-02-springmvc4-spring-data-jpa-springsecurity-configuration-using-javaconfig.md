---
title: SpringMVC4 + Spring Data JPA + SpringSecurity configuration using JavaConfig
author: Siva
type: post
date: 2014-03-02T01:01:00+00:00
url: /2014/03/springmvc4-spring-data-jpa-springsecurity-configuration-using-javaconfig/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2014/03/springmvc4-spring-data-jpa.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/721275897719629077
post_views_count:
  - 183
categories:
  - Spring
tags:
  - Hibernate
  - JPA
  - SpringMVC
  - SpringSecurity

---
In this article we will see how to configure and integrate SpringMVC4, Spring Data JPA with Hibernate and SpringSecurity using JavaConfig.

1. First let&#8217;s configure all the necessary dependencies in **pom.xml**

<pre class="lang:xhtml brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
  &lt;modelVersion>4.0.0&lt;/modelVersion>
  &lt;groupId>com.sivalabs&lt;/groupId>
  &lt;artifactId>springmvc-datajpa-security-demo&lt;/artifactId>
  &lt;version>1.0&lt;/version>
  &lt;packaging>war&lt;/packaging> 
  
	&lt;properties>
		&lt;java.version>1.7&lt;/java.version>
		&lt;junit.version>4.11&lt;/junit.version>
		&lt;slf4j.version>1.7.5&lt;/slf4j.version>
		&lt;logback.version>1.0.13&lt;/logback.version>
		&lt;spring.version>4.0.0.RELEASE&lt;/spring.version>
		&lt;spring-data-jpa.version>1.4.1.RELEASE&lt;/spring-data-jpa.version>
		&lt;spring-security.version>3.2.0.RELEASE&lt;/spring-security.version>
		&lt;hibernate.version>4.2.6.Final&lt;/hibernate.version>
		&lt;aspectj.version>1.7.2&lt;/aspectj.version>
		&lt;mysql.version>5.1.26&lt;/mysql.version>
		&lt;jackson-json.version>2.3.1&lt;/jackson-json.version>
		&lt;commons-dbcp.version>1.2.2&lt;/commons-dbcp.version>
		&lt;commons-lang3.version>3.1&lt;/commons-lang3.version>
	&lt;/properties>
	
	&lt;build>
		&lt;finalName>${project.artifactId}&lt;/finalName>
		&lt;plugins>
			&lt;plugin>
				&lt;groupId>org.apache.maven.plugins&lt;/groupId>
				&lt;artifactId>maven-compiler-plugin&lt;/artifactId>
				&lt;version>3.1&lt;/version>
				&lt;configuration>
					&lt;source>${java.version}&lt;/source>
					&lt;target>${java.version}&lt;/target>
				&lt;/configuration>
			&lt;/plugin>
		&lt;/plugins>
	&lt;/build>

	&lt;dependencies>
	<!-- Logging dependencies -->
		&lt;dependency>
			&lt;groupId>org.slf4j&lt;/groupId>
			&lt;artifactId>jcl-over-slf4j&lt;/artifactId>
			&lt;version>${slf4j.version}&lt;/version>
		&lt;/dependency>

		&lt;dependency>
			&lt;groupId>org.slf4j&lt;/groupId>
			&lt;artifactId>slf4j-api&lt;/artifactId>
			&lt;version>${slf4j.version}&lt;/version>
		&lt;/dependency>
		
		&lt;dependency>
			&lt;groupId>ch.qos.logback&lt;/groupId>
			&lt;artifactId>logback-classic&lt;/artifactId>
			&lt;version>${logback.version}&lt;/version>
		&lt;/dependency>		

		

<!-- Spring dependencies -->		
		&lt;dependency>
			&lt;groupId>org.springframework&lt;/groupId>
			&lt;artifactId>spring-context-support&lt;/artifactId>
			&lt;exclusions>
				&lt;exclusion>
					&lt;groupId>commons-logging&lt;/groupId>
					&lt;artifactId>commons-logging&lt;/artifactId>
				&lt;/exclusion>
			&lt;/exclusions>
		&lt;/dependency>
		
		&lt;dependency>
			&lt;groupId>org.springframework&lt;/groupId>
			&lt;artifactId>spring-webmvc&lt;/artifactId>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework&lt;/groupId>
			&lt;artifactId>spring-test&lt;/artifactId>
		&lt;/dependency>
		

<!-- Spring Data JPA dependencies -->
		
		&lt;dependency>
			&lt;groupId>org.springframework.data&lt;/groupId>
			&lt;artifactId>spring-data-jpa&lt;/artifactId>
			&lt;version>${spring-data-jpa.version}&lt;/version>
		&lt;/dependency>

		&lt;dependency>
			&lt;groupId>org.hibernate&lt;/groupId>
			&lt;artifactId>hibernate-entitymanager&lt;/artifactId>
			&lt;version>${hibernate.version}&lt;/version>
		&lt;/dependency>
		
		

<!-- SpringSecurity dependencies -->
		&lt;dependency>
			&lt;groupId>org.springframework.security&lt;/groupId>
			&lt;artifactId>spring-security-core&lt;/artifactId>
			&lt;version>${spring-security.version}&lt;/version>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.security&lt;/groupId>
			&lt;artifactId>spring-security-web&lt;/artifactId>
			&lt;version>${spring-security.version}&lt;/version>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.security&lt;/groupId>
			&lt;artifactId>spring-security-config&lt;/artifactId>
			&lt;version>${spring-security.version}&lt;/version>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.security&lt;/groupId>
			&lt;artifactId>spring-security-taglibs&lt;/artifactId>
			&lt;version>${spring-security.version}&lt;/version>
		&lt;/dependency>	
		
		&lt;dependency>
			&lt;groupId>org.aspectj&lt;/groupId>
			&lt;artifactId>aspectjweaver&lt;/artifactId>
			&lt;version>${aspectj.version}&lt;/version>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.aspectj&lt;/groupId>
			&lt;artifactId>aspectjrt&lt;/artifactId>
			&lt;version>${aspectj.version}&lt;/version>
		&lt;/dependency>	

		

<!-- Testing dependencies -->
		&lt;dependency>
			&lt;groupId>junit&lt;/groupId>
			&lt;artifactId>junit&lt;/artifactId>
			&lt;version>${junit.version}&lt;/version>
			&lt;scope>test&lt;/scope>
		&lt;/dependency>		

		

<!-- DB dependencies -->
		&lt;dependency>
			&lt;groupId>mysql&lt;/groupId>
			&lt;artifactId>mysql-connector-java&lt;/artifactId>
			&lt;version>${mysql.version}&lt;/version>
		&lt;/dependency>
				
		&lt;dependency>
			&lt;groupId>commons-dbcp&lt;/groupId>
			&lt;artifactId>commons-dbcp&lt;/artifactId>
			&lt;version>${commons-dbcp.version}&lt;/version>
		&lt;/dependency>
				
		&lt;dependency>
			&lt;groupId>com.fasterxml.jackson.core&lt;/groupId>
			&lt;artifactId>jackson-databind&lt;/artifactId>
			&lt;version>${jackson-json.version}&lt;/version>
		&lt;/dependency>
		
		&lt;dependency>
		    &lt;groupId>javax.mail&lt;/groupId>
		    &lt;artifactId>mail&lt;/artifactId>
		    &lt;version>1.4.3&lt;/version>
	    &lt;/dependency>
	    
		

<!-- Web dependencies -->
		&lt;dependency>
			&lt;groupId>javax.servlet&lt;/groupId>
			&lt;artifactId>javax.servlet-api&lt;/artifactId>
			&lt;version>3.0.1&lt;/version>
			&lt;scope>provided&lt;/scope>
		&lt;/dependency>

		&lt;dependency>
			&lt;groupId>taglibs&lt;/groupId>
			&lt;artifactId>standard&lt;/artifactId>
			&lt;version>1.1.2&lt;/version>
			&lt;scope>compile&lt;/scope>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>jstl&lt;/groupId>
			&lt;artifactId>jstl&lt;/artifactId>
			&lt;version>1.2&lt;/version>
			&lt;scope>compile&lt;/scope>
		&lt;/dependency>
	&lt;/dependencies>

	&lt;dependencyManagement>
		&lt;dependencies>
			&lt;dependency>
				&lt;groupId>org.springframework&lt;/groupId>
				&lt;artifactId>spring-framework-bom&lt;/artifactId>
				&lt;version>${spring.version}&lt;/version>
				&lt;type>pom&lt;/type>
				&lt;scope>import&lt;/scope>
			&lt;/dependency>		
		&lt;/dependencies>
	&lt;/dependencyManagement>
	
&lt;/project>

</pre>

2. Configure database connection properties and email settings in **application.properties**

<pre class="lang:xhtml brush: xml">################### DataSource Configuration ##########################

jdbc.driverClassName=com.mysql.jdbc.Driver
jdbc.url=jdbc:mysql://localhost:3306/test
jdbc.username=root
jdbc.password=admin

init-db=false

################### Hibernate Configuration ##########################

hibernate.dialect=org.hibernate.dialect.MySQLDialect
hibernate.show_sql=true
hibernate.hbm2ddl.auto=update

################### JavaMail Configuration ##########################
smtp.host=smtp.gmail.com
smtp.port=465
smtp.protocol=smtps
smtp.username=sivaprasadreddy.k@gmail.com
smtp.password=
support.email=sivaprasadreddy.k@gmail.com

</pre>

3. Configure common Service Layer beans such as **PropertySourcesPlaceholderConfigurer** and **JavaMailSender **etc in **com.sivalabs.springapp.config.AppConfig.java**

<pre class="lang:java brush: java">package com.sivalabs.springapp.config;

import java.util.Properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.Environment;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@ComponentScan(basePackages={"com.sivalabs.springapp"},
		excludeFilters=@ComponentScan.Filter(type=FilterType.REGEX, pattern={"com.sivalabs.springapp.web.*"}))
@PropertySource(value = { "classpath:application.properties" })
@EnableScheduling
@EnableAspectJAutoProxy
@EnableCaching
public class AppConfig 
{
	@Autowired
	private Environment env;

	@Bean
	public static PropertySourcesPlaceholderConfigurer placeHolderConfigurer()
	{
		return new PropertySourcesPlaceholderConfigurer();
	}
	
	@Bean
	public JavaMailSenderImpl javaMailSenderImpl() {
		JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
		mailSenderImpl.setHost(env.getProperty("smtp.host"));
		mailSenderImpl.setPort(env.getProperty("smtp.port", Integer.class));
		mailSenderImpl.setProtocol(env.getProperty("smtp.protocol"));
		mailSenderImpl.setUsername(env.getProperty("smtp.username"));
		mailSenderImpl.setPassword(env.getProperty("smtp.password"));

		Properties javaMailProps = new Properties();
		javaMailProps.put("mail.smtp.auth", true);
		javaMailProps.put("mail.smtp.starttls.enable", true);

		mailSenderImpl.setJavaMailProperties(javaMailProps);

		return mailSenderImpl;
	}
		
	@Bean
	public CacheManager cacheManager()
	{
		return new ConcurrentMapCacheManager();
	}
}

</pre>

Observe that we have excluded the package &#8220;**com.sivalabs.springapp.web.***&#8221; from component scanning using new **REGEX excludeFilter **type.
  
If we don&#8217;t exclude web related packages and tries to run JUnit test for service layer beans we will encounter the following Exception:

<span style="color: red;"><b>java.lang.IllegalArgumentException: A ServletContext is required to configure default servlet handling</b></span>

Also note that we have enabled Caching using **@EnableCaching**, so we should declare **CacheManager **bean.

4. Configure Persistence Layer beans in **com.sivalabs.springapp.config.PersistenceConfig.java** as follows:

<pre class="lang:java brush: java">package com.sivalabs.springapp.config;

import java.util.Properties;
import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;
import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.instrument.classloading.InstrumentationLoadTimeWeaver;
import org.springframework.jdbc.datasource.init.DataSourceInitializer;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.orm.hibernate4.HibernateExceptionTranslator;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(basePackages="com.sivalabs.springapp.repositories")
public class PersistenceConfig 
{
	@Autowired
	private Environment env;

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
		factory.setPackagesToScan("com.sivalabs.springapp.entities");

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
		databasePopulator.addScript(new ClassPathResource("db.sql"));
		dataSourceInitializer.setDatabasePopulator(databasePopulator);
		dataSourceInitializer.setEnabled(Boolean.parseBoolean(initDatabase));
		return dataSourceInitializer;
	}	
}

</pre>

Here we have configured DataSource and JPA EntityManagerFactory bean using Hibernate implementation.
  
Also we have configured DataSourceInitializer bean to initialize and populate our tables with seed data. We can enable/disable executing this **db.sql** script by changing init-db property value in application.properties.
  
And finally we have enabled Spring Data JPA repositories scanning using **@EnableJpaRepositories** to scan &#8220;**com.sivalabs.springapp.repositories**&#8221; package for JPA repository interfaces.

5. Now let us configure Web related beans in **com.sivalabs.springapp.web.config.WebMvcConfig.java**

<pre class="lang:java brush: java">package com.sivalabs.springapp.web.config;

import java.util.Properties;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.handler.SimpleMappingExceptionResolver;
import org.springframework.web.servlet.view.InternalResourceViewResolver;


@Configuration
@ComponentScan(basePackages = { "com.sivalabs.springapp.web"}) 
@EnableWebMvc
public class WebMvcConfig extends WebMvcConfigurerAdapter
{
	@Override
	public void addViewControllers(ViewControllerRegistry registry)
	{
		super.addViewControllers(registry);
		registry.addViewController("login/form").setViewName("login");		
		registry.addViewController("welcome").setViewName("welcome");
		registry.addViewController("admin").setViewName("admin");
	}

	@Bean
	public ViewResolver resolver()
	{
		InternalResourceViewResolver url = new InternalResourceViewResolver();
		url.setPrefix("/WEB-INF/jsp/");
		url.setSuffix(".jsp");
		return url;
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

	@Bean
	public SimpleMappingExceptionResolver simpleMappingExceptionResolver()
	{
		SimpleMappingExceptionResolver b = new SimpleMappingExceptionResolver();
		Properties mappings = new Properties();
		mappings.put("org.springframework.dao.DataAccessException", "error");
		b.setExceptionMappings(mappings);
		return b;
	}
}

</pre>

6. Configure DispatcherService using **AbstractAnnotationConfigDispatcherServletInitializer** convinient class.

<pre class="lang:java brush: java">package com.sivalabs.springapp.web.config;

import javax.servlet.Filter;
import org.springframework.orm.jpa.support.OpenEntityManagerInViewFilter;
import org.springframework.web.filter.DelegatingFilterProxy;
import org.springframework.web.servlet.support.AbstractAnnotationConfigDispatcherServletInitializer;
import com.sivalabs.springapp.config.AppConfig;

public class SpringWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer
{

	@Override
	protected Class<?>[] getRootConfigClasses()
	{
		return new Class

<?>[] { AppConfig.class};
	}

	@Override
	protected Class

<?>[] getServletConfigClasses()
	{
		return new Class

<?>[] { WebMvcConfig.class };
	}

	@Override
	protected String[] getServletMappings()
	{
		return new String[] { "/" };
	}

	@Override
    protected Filter[] getServletFilters() {
       return new Filter[]{ new OpenEntityManagerInViewFilter()	  };
    }

}

</pre>

Here few things to note are we configured **AppConfig.class** as RootConfig classes and **WebMvcConfig.class** as ServletConfigClasses which is similar to how we configure in **web.xml** using ContextLoaderListener and DispatcherServlet&#8217;s contextConfigLocation .
  
Also we have registered **OpenEntityManagerInViewFilter** to enable lazy loading of JPA entity graphs in view rendering phase.

7. Let us configure SpringSecurity.

First let us create a **SecurityUser** class which extends our application specific **User** class and implements **org.springframework.security.core.userdetails.UserDetails**.

<pre class="lang:java brush: java">package com.sivalabs.springapp.web.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.sivalabs.springapp.entities.Role;
import com.sivalabs.springapp.entities.User;

public class SecurityUser extends User implements UserDetails
{

	private static final long serialVersionUID = 1L;
	public SecurityUser(User user) {
		if(user != null)
		{
			this.setId(user.getId());
			this.setName(user.getName());
			this.setEmail(user.getEmail());
			this.setPassword(user.getPassword());
			this.setDob(user.getDob());
			this.setRoles(user.getRoles());
		}		
	}
	
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		
		Collection&lt;GrantedAuthority> authorities = new ArrayList&lt;>();
		Set&lt;Role> userRoles = this.getRoles();
		
		if(userRoles != null)
		{
			for (Role role : userRoles) {
				SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role.getRoleName());
				authorities.add(authority);
			}
		}
		return authorities;
	}

	@Override
	public String getPassword() {
		return super.getPassword();
	}

	@Override
	public String getUsername() {
		return super.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}	
}
</pre>

We will implement a custom **UserDetailsService** and use Spring Data JPA repositories to load User details.

<pre class="lang:java brush: java">package com.sivalabs.springapp.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import com.sivalabs.springapp.entities.User;
import com.sivalabs.springapp.services.UserService;
import com.sivalabs.springapp.web.config.SecurityUser;

@Component
public class CustomUserDetailsService implements UserDetailsService
{
	@Autowired
	private UserService userService;
	
	@Override
	public UserDetails loadUserByUsername(String userName)
			throws UsernameNotFoundException {
		User user = userService.findUserByEmail(userName);
		if(user == null){
			throw new UsernameNotFoundException("UserName "+userName+" not found");
		}
		return new SecurityUser(user);
	}
}
</pre>

Now create **com.sivalabs.springapp.config.SecurityConfig.java** which contains SpeingSecurity related bean definitions.

<pre class="lang:java brush: java">package com.sivalabs.springapp.config;

import javax.sql.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
//import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;


@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
	@Autowired
	private DataSource dataSource;

	@Autowired
	private CustomUserDetailsService customUserDetailsService;

	@Override
    protected void configure(AuthenticationManagerBuilder registry) throws Exception {
	/*
        registry
        .inMemoryAuthentication()
        .withUser("siva")
          .password("siva")
          .roles("USER")
          .and()
        .withUser("admin")
          .password("admin")
          .roles("ADMIN","USER");
        */
        
        //registry.jdbcAuthentication().dataSource(dataSource);
	registry.userDetailsService(customUserDetailsService);
    }


	  @Override
	  public void configure(WebSecurity web) throws Exception {
	    web
	      .ignoring()
	         .antMatchers("/resources/**");
	  }

	  @Override
	  protected void configure(HttpSecurity http) throws Exception {
	    http
	    .csrf().disable()
	    .authorizeRequests()
	        .antMatchers("/login","/login/form**","/register","/logout").permitAll()
	        .antMatchers("/admin","/admin/**").hasRole("ADMIN")
	        .anyRequest().authenticated()
	        .and()
	    .formLogin()
	        .loginPage("/login/form")
	        .loginProcessingUrl("/login")
	        .failureUrl("/login/form?error")
	        .permitAll();
	  }
}

</pre>

Update **SpringWebAppInitializer** which we created eariler to add **SecurityConfig** configuration class.

<pre class="lang:java brush: java">public class SpringWebAppInitializer extends AbstractAnnotationConfigDispatcherServletInitializer
{
	@Override
	protected Class<?>[] getRootConfigClasses()
	{
		return new Class

<?>[] { AppConfig.class};
		//As we have SecurityConfig.java in same package as AppConfig.java 
                // and enabled ComponentScan to scan "com.sivalabs.springapp.config" we don't need to explicitely configure it.
		//otherwise we should add SecurityConfig.class to getRootConfigClasses()
		//return new Class

<?>[] { AppConfig.class, SecurityConfig.class};
	}
	...
	...
	@Override
    protected Filter[] getServletFilters() {
       return new Filter[]{ 
    		   new DelegatingFilterProxy("springSecurityFilterChain"),
    		   new OpenEntityManagerInViewFilter()};
    } 

}	

</pre>

As per our SpringSecurity custom Form Login configuration, we will use the following login form in **login.jsp**.

<pre class="lang:xhtml brush: xml">
&lt;%@taglib uri="http://www.springframework.org/tags"  prefix="spring"%>
&lt;%@taglib uri="http://www.springframework.org/tags/form" prefix="form" %>
&lt;%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
&lt;%@ taglib uri="http://java.sun.com/jstl/core_rt" prefix="c" %>
&lt;c:url var="rootURL" value="/"/>



		

<div class="col-md-6 col-md-offset-2">
  &lt;c:if test="${param.error != null}">
               
  
  <div class="alert alert-danger">
    Invalid UserName and Password.
                 
  </div>
           &lt;/c:if>
           &lt;c:if test="${param.logout != null}">
               
  
  <div class="alert alert-success">
    You have been logged out.
                 
  </div>
           &lt;/c:if>	
           
</div>  
            
     

<div class="row">
  <div class="col-md-6 col-md-offset-2">
    <h2>
      User Login Form
    </h2>
    			&lt;form:form id="loginForm" method="post" action="${rootURL}login" modelAttribute="user" 
    		class="form-horizontal" role="form" cssStyle="width: 800px; margin: 0 auto;">
    		  
    
    <div class="form-group">
      <label for="username" class="col-sm-2 control-label">UserName*</label>
      		    
      
      <div class="col-sm-4">
        <input type="text" id="username" name="username" class="form-control" placeholder="UserName" />
        		    
      </div>
      		  
    </div>
    		  
    
    <div class="form-group">
      <label for="password" class="col-sm-2 control-label">Password*</label>
      		    
      
      <div class="col-sm-4">
        <input type="password" id="password" name="password" class="form-control" placeholder="Password" />
        		    
      </div>
      		  
    </div>
    		  
    
    <div class="form-group">
      <div class="col-sm-offset-2 col-sm-4">
        <input type="submit" class="btn btn-primary" value="Login" />
        		    
      </div>
      		  
    </div>
    		  
    		&lt;/form:form>
    	
  </div>
  
</div>	



</pre>

Once we successfully login we can obtain the authenticated use details using **** and secure parts of the view using **** as follows:

<pre class="lang:xhtml brush: xml"><h3>
  Email: &lt;sec:authentication property="name"/>
</h3>


<h3>
  &lt;sec:authorize access="hasRole('ROLE_ADMIN')">
  		<a href="admin">Administration</a>
  	&lt;/sec:authorize>
  
</h3>


<p>
  <a href="logout">Logout</a>
</p>
&lt;/body>
</pre>

You can find the source code at github <https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo>

<span style="color: red;"><b>There are few issues while running the same application on JBoss AS 7.1. I have made few changes to run on JBossAS7.1 and published code at <a href="https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo-jboss7">https://github.com/sivaprasadreddy/sivalabs-blog-samples-code/tree/master/springmvc-datajpa-security-demo-jboss7</a></b></span>