---
author: siva
comments: true
date: 2015-12-01 04:14:09+00:00
layout: post
slug: jcart-initial-code-setup
title: 'JCart: Initial Code SetUp'
wordpress_id: 498
categories:
- E-Commerce
tags:
- jcart
- SpringBoot
---

Let us create a root pom type maven project with 3 sub-modules jcart-core, jcart-admin and jcart-site.

**jcart-core** module will contain all the core logic excluding web related stuff.

**jcart-admin** module will contain all the administration related web functionality like Controllers, Security, Validators etc.

**jcart-site** module will contain all the shoppingcart related web functionality like Controllers, Security, Validators etc.


All these modules use SpringBoot, but as of now STS/IntellijIdea are not providing option to create multi-module SpringBoot application, we will be creating Maven modules and then configure SpringBoot dependencies manually.

**jcart/pom.xml**


    
    
    <project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemalocation="http://maven.apache.org/POM/4.0.0 
    	http://maven.apache.org/xsd/maven-4.0.0.xsd">
    	<modelversion>4.0.0</modelversion>
    	<groupid>com.sivalabs</groupid>
    	<artifactid>jcart</artifactid>
    	<version>1.0</version>
    	<packaging>pom</packaging>
    	
    	<properties>
    		<project.build.sourceencoding>UTF-8</project.build.sourceencoding>
    		<maven.compiler.source>1.8</maven.compiler.source>
    		<maven.compiler.target>1.8</maven.compiler.target>	
    	</properties>
    	
    	<modules>
    		<module>jcart-core</module>
    		<module>jcart-admin</module>
    		<module>jcart-site</module>	
    	</modules>
    
    	<dependencymanagement>
    		<dependencies>
    			<dependency>
    				<groupid>org.springframework.boot</groupid>
    				<artifactid>spring-boot-dependencies</artifactid>
    				<version>1.3.0.RELEASE</version>
    				<type>pom</type>
    				<scope>import</scope>
    			</dependency>	
    		</dependencies>
    	</dependencymanagement>    
    </project>
    



**jcart/jcart-core/pom.xml**


    
    
    <project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemalocation="http://maven.apache.org/POM/4.0.0 
    	http://maven.apache.org/xsd/maven-4.0.0.xsd">
    	<modelversion>4.0.0</modelversion>
    	<parent>
    		<groupid>com.sivalabs</groupid>
    		<artifactid>jcart</artifactid>
    		<version>1.0</version>
    	</parent>
    	<artifactid>jcart-core</artifactid>
    
    	<dependencies>	
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-data-jpa</artifactid>
    		</dependency>	
    		<dependency>
    			<groupid>mysql</groupid>
    			<artifactid>mysql-connector-java</artifactid>
    		</dependency>
    		<dependency>
    			<groupid>org.hibernate</groupid>
    			<artifactid>hibernate-validator</artifactid>
    		</dependency>
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-test</artifactid>
    			<scope>test</scope>
    		</dependency>
    	</dependencies>
    </project>
    



**jcart/jcart-admin/pom.xml**


    
    
    <project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemalocation="http://maven.apache.org/POM/4.0.0 
    	http://maven.apache.org/xsd/maven-4.0.0.xsd">
    	<modelversion>4.0.0</modelversion>
    	<parent>
    		<groupid>com.sivalabs</groupid>
    		<artifactid>jcart</artifactid>
    		<version>1.0</version>
    	</parent>
    	<artifactid>jcart-admin</artifactid>
    
    	<build>
    	<plugins>
    		<plugin>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-maven-plugin</artifactid>
    		</plugin>
    	</plugins>
    	</build>
    
    	<dependencies>
    		<dependency>
    			<groupid>com.sivalabs</groupid>
    			<artifactid>jcart-core</artifactid>
    			<version>${project.version}</version>
    		</dependency>
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-web</artifactid>
    		</dependency>	
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-thymeleaf</artifactid>
    		</dependency>	
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-test</artifactid>
    			<scope>test</scope>
    		</dependency>	
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-devtools</artifactid>
    			<optional>true</optional>
    		</dependency>	
    	</dependencies>
    </project>
    



**jcart/jcart-site/pom.xml**

    
    
    <project xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://maven.apache.org/POM/4.0.0" xsi:schemalocation="http://maven.apache.org/POM/4.0.0 
    	http://maven.apache.org/xsd/maven-4.0.0.xsd">
    	<modelversion>4.0.0</modelversion>
    	<parent>
    		<groupid>com.sivalabs</groupid>
    		<artifactid>jcart</artifactid>
    		<version>1.0</version>
    	</parent>
    	<artifactid>jcart-site</artifactid>
    
    	<build>
    		<plugins>
    			<plugin>
    				<groupid>org.springframework.boot</groupid>
    				<artifactid>spring-boot-maven-plugin</artifactid>
    			</plugin>
    		</plugins>
    	</build>
    
    	<dependencies>
    		<dependency>
    			<groupid>com.sivalabs</groupid>
    			<artifactid>jcart-core</artifactid>
    			<version>${project.version}</version>
    		</dependency>
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-web</artifactid>
    		</dependency>
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-thymeleaf</artifactid>
    		</dependency>	
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-starter-test</artifactid>
    			<scope>test</scope>
    		</dependency>	
    		<dependency>
    			<groupid>org.springframework.boot</groupid>
    			<artifactid>spring-boot-devtools</artifactid>
    			<optional>true</optional>
    		</dependency>	
    	</dependencies>
    </project>
    



We are going to use MySQL database instead of an InMemory database like H2 or HSQL, so we will configure our datasource properties in **application.properties**. 

As we are using multi-module project structure, we will have a **jcart-core/src/main/resources/application.properties** file to put the common properties used by **jcart-core** module. Properties related to **jcart-admin** and **jcart-site** will be in **jcart-admin/src/main/resources/application-default.properties** and **jcart-site/src/main/resources/application-default.properties** respectively.

For more information on using properties files refer [https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes#default-profile-applicationproperties](https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes#default-profile-applicationproperties)

**jcart-core/src/main/resources/application.properties**


    
    
    spring.datasource.driver-class-name=com.mysql.jdbc.Driver
    spring.datasource.url=jdbc:mysql://localhost:3306/jcart
    spring.datasource.username=root
    spring.datasource.password=admin
    
    spring.jpa.hibernate.ddl-auto=update
    



The jcart-core module will be used along with jcart-admin and jcart-site modules, not as a stand-alone module. But in order to test the jcart-core module functionality let us create main entry point class **JCartCoreApplication** in src/test/java folder.


    
    
    package com.sivalabs.jcart;
    import org.springframework.boot.SpringApplication;
    import org.springframework.boot.autoconfigure.SpringBootApplication;
    
    @SpringBootApplication
    public class JCartCoreApplication
    {
    	public static void main(String[] args)
    	{
    	SpringApplication.run(JCartCoreApplication.class, args);
    	}
    
    }
    




    
    
    package com.sivalabs.jcart;
    
    import java.sql.SQLException;
    import javax.sql.DataSource;
    import org.junit.Test;
    import org.junit.runner.RunWith;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.boot.test.SpringApplicationConfiguration;
    import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
    import static org.junit.Assert.*;
    
    @RunWith(SpringJUnit4ClassRunner.class)
    @SpringApplicationConfiguration(classes = JCartCoreApplication.class)
    public class JCartCoreApplicationTest
    {
    	@Autowired DataSource dataSource;
    	
    	@Test
    	public void testDummy() throws SQLException
    	{
    	String schema = dataSource.getConnection().getCatalog();
    	assertEquals("jcart", schema);
    	}	
    }
    



If this test case passed we can assume we have base setup ready.

