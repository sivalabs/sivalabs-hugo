---
title: 'JCart: Initial Code SetUp'
author: Siva
type: post
date: 2015-12-01T04:14:09+00:00
url: /2015/12/jcart-initial-code-setup/
post_views_count:
  - 32
categories:
  - Java
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

<pre class="brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	&lt;modelVersion>4.0.0&lt;/modelVersion>
	&lt;groupId>com.sivalabs&lt;/groupId>
	&lt;artifactId>jcart&lt;/artifactId>
	&lt;version>1.0&lt;/version>
	&lt;packaging>pom&lt;/packaging>
	
	&lt;properties>
		&lt;project.build.sourceEncoding>UTF-8&lt;/project.build.sourceEncoding>
		&lt;maven.compiler.source>1.8&lt;/maven.compiler.source>
		&lt;maven.compiler.target>1.8&lt;/maven.compiler.target>	
	&lt;/properties>
	
	&lt;modules>
		&lt;module>jcart-core&lt;/module>
		&lt;module>jcart-admin&lt;/module>
		&lt;module>jcart-site&lt;/module>	
	&lt;/modules>

	&lt;dependencyManagement>
		&lt;dependencies>
			&lt;dependency>
				&lt;groupId>org.springframework.boot&lt;/groupId>
				&lt;artifactId>spring-boot-dependencies&lt;/artifactId>
				&lt;version>1.3.0.RELEASE&lt;/version>
				&lt;type>pom&lt;/type>
				&lt;scope>import&lt;/scope>
			&lt;/dependency>	
		&lt;/dependencies>
	&lt;/dependencyManagement>    
&lt;/project>
</pre>

**jcart/jcart-core/pom.xml**

<pre class="brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	&lt;modelVersion>4.0.0&lt;/modelVersion>
	&lt;parent>
		&lt;groupId>com.sivalabs&lt;/groupId>
		&lt;artifactId>jcart&lt;/artifactId>
		&lt;version>1.0&lt;/version>
	&lt;/parent>
	&lt;artifactId>jcart-core&lt;/artifactId>

	&lt;dependencies>	
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-data-jpa&lt;/artifactId>
		&lt;/dependency>	
		&lt;dependency>
			&lt;groupId>mysql&lt;/groupId>
			&lt;artifactId>mysql-connector-java&lt;/artifactId>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.hibernate&lt;/groupId>
			&lt;artifactId>hibernate-validator&lt;/artifactId>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-test&lt;/artifactId>
			&lt;scope>test&lt;/scope>
		&lt;/dependency>
	&lt;/dependencies>
&lt;/project>
</pre>

**jcart/jcart-admin/pom.xml**

<pre class="brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	&lt;modelVersion>4.0.0&lt;/modelVersion>
	&lt;parent>
		&lt;groupId>com.sivalabs&lt;/groupId>
		&lt;artifactId>jcart&lt;/artifactId>
		&lt;version>1.0&lt;/version>
	&lt;/parent>
	&lt;artifactId>jcart-admin&lt;/artifactId>

	&lt;build>
	&lt;plugins>
		&lt;plugin>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-maven-plugin&lt;/artifactId>
		&lt;/plugin>
	&lt;/plugins>
	&lt;/build>

	&lt;dependencies>
		&lt;dependency>
			&lt;groupId>com.sivalabs&lt;/groupId>
			&lt;artifactId>jcart-core&lt;/artifactId>
			&lt;version>${project.version}&lt;/version>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-web&lt;/artifactId>
		&lt;/dependency>	
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-thymeleaf&lt;/artifactId>
		&lt;/dependency>	
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-test&lt;/artifactId>
			&lt;scope>test&lt;/scope>
		&lt;/dependency>	
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-devtools&lt;/artifactId>
			&lt;optional>true&lt;/optional>
		&lt;/dependency>	
	&lt;/dependencies>
&lt;/project>
</pre>

**jcart/jcart-site/pom.xml**

<pre class="brush: xml">&lt;project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	&lt;modelVersion>4.0.0&lt;/modelVersion>
	&lt;parent>
		&lt;groupId>com.sivalabs&lt;/groupId>
		&lt;artifactId>jcart&lt;/artifactId>
		&lt;version>1.0&lt;/version>
	&lt;/parent>
	&lt;artifactId>jcart-site&lt;/artifactId>

	&lt;build>
		&lt;plugins>
			&lt;plugin>
				&lt;groupId>org.springframework.boot&lt;/groupId>
				&lt;artifactId>spring-boot-maven-plugin&lt;/artifactId>
			&lt;/plugin>
		&lt;/plugins>
	&lt;/build>

	&lt;dependencies>
		&lt;dependency>
			&lt;groupId>com.sivalabs&lt;/groupId>
			&lt;artifactId>jcart-core&lt;/artifactId>
			&lt;version>${project.version}&lt;/version>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-web&lt;/artifactId>
		&lt;/dependency>
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-thymeleaf&lt;/artifactId>
		&lt;/dependency>	
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-starter-test&lt;/artifactId>
			&lt;scope>test&lt;/scope>
		&lt;/dependency>	
		&lt;dependency>
			&lt;groupId>org.springframework.boot&lt;/groupId>
			&lt;artifactId>spring-boot-devtools&lt;/artifactId>
			&lt;optional>true&lt;/optional>
		&lt;/dependency>	
	&lt;/dependencies>
&lt;/project>
</pre>

We are going to use MySQL database instead of an InMemory database like H2 or HSQL, so we will configure our datasource properties in **application.properties**. 

As we are using multi-module project structure, we will have a **jcart-core/src/main/resources/application.properties** file to put the common properties used by **jcart-core** module. Properties related to **jcart-admin** and **jcart-site** will be in **jcart-admin/src/main/resources/application-default.properties** and **jcart-site/src/main/resources/application-default.properties** respectively.

For more information on using properties files refer <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes#default-profile-applicationproperties" target="_blank">https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes#default-profile-applicationproperties</a>

**jcart-core/src/main/resources/application.properties**

<pre class="brush: java">spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/jcart
spring.datasource.username=root
spring.datasource.password=admin

spring.jpa.hibernate.ddl-auto=update
</pre>

The jcart-core module will be used along with jcart-admin and jcart-site modules, not as a stand-alone module. But in order to test the jcart-core module functionality let us create main entry point class **JCartCoreApplication** in src/test/java folder.

<pre class="brush: java">package com.sivalabs.jcart;
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
</pre>

<pre class="brush: java">package com.sivalabs.jcart;

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
</pre>

If this test case passed we can assume we have base setup ready.