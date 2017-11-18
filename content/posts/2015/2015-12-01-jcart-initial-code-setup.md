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

{{< highlight xml >}}
<project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.sivalabs</groupId>
	<artifactId>jcart</artifactId>
	<version>1.0</version>
	<packaging>pom</packaging>
	
	<properties>
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
		<maven.compiler.source>1.8</maven.compiler.source>
		<maven.compiler.target>1.8</maven.compiler.target>	
	</properties>
	
	<modules>
		<module>jcart-core</module>
		<module>jcart-admin</module>
		<module>jcart-site</module>	
	</modules>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-dependencies</artifactId>
				<version>1.3.0.RELEASE</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>	
		</dependencies>
	</dependencyManagement>    
</project>
{{</ highlight >}}

**jcart/jcart-core/pom.xml**

{{< highlight xml >}}
<project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>com.sivalabs</groupId>
		<artifactId>jcart</artifactId>
		<version>1.0</version>
	</parent>
	<artifactId>jcart-core</artifactId>

	<dependencies>	
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-data-jpa</artifactId>
		</dependency>	
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
		</dependency>
		<dependency>
			<groupId>org.hibernate</groupId>
			<artifactId>hibernate-validator</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>
</project>
{{</ highlight >}}

**jcart/jcart-admin/pom.xml**

{{< highlight xml >}}
<project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>com.sivalabs</groupId>
		<artifactId>jcart</artifactId>
		<version>1.0</version>
	</parent>
	<artifactId>jcart-admin</artifactId>

	<build>
	<plugins>
		<plugin>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-maven-plugin</artifactId>
		</plugin>
	</plugins>
	</build>

	<dependencies>
		<dependency>
			<groupId>com.sivalabs</groupId>
			<artifactId>jcart-core</artifactId>
			<version>${project.version}</version>
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
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>	
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<optional>true</optional>
		</dependency>	
	</dependencies>
</project>
{{</ highlight >}}

**jcart/jcart-site/pom.xml**

{{< highlight xml >}}
<project xmlns="http://maven.apache.org/POM/4.0.0" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
	http://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>com.sivalabs</groupId>
		<artifactId>jcart</artifactId>
		<version>1.0</version>
	</parent>
	<artifactId>jcart-site</artifactId>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

	<dependencies>
		<dependency>
			<groupId>com.sivalabs</groupId>
			<artifactId>jcart-core</artifactId>
			<version>${project.version}</version>
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
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>	
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<optional>true</optional>
		</dependency>	
	</dependencies>
</project>
{{</ highlight >}}

We are going to use MySQL database instead of an InMemory database like H2 or HSQL, so we will configure our datasource properties in **application.properties**. 

As we are using multi-module project structure, we will have a **jcart-core/src/main/resources/application.properties** file to put the common properties used by **jcart-core** module. Properties related to **jcart-admin** and **jcart-site** will be in **jcart-admin/src/main/resources/application-default.properties** and **jcart-site/src/main/resources/application-default.properties** respectively.

For more information on using properties files refer <a href="https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes#default-profile-applicationproperties" target="_blank">https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-1.3-Release-Notes#default-profile-applicationproperties</a>

**jcart-core/src/main/resources/application.properties**

{{< highlight java >}}
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/jcart
spring.datasource.username=root
spring.datasource.password=admin

spring.jpa.hibernate.ddl-auto=update
{{</ highlight >}}

The jcart-core module will be used along with jcart-admin and jcart-site modules, not as a stand-alone module. But in order to test the jcart-core module functionality let us create main entry point class **JCartCoreApplication** in src/test/java folder.

{{< highlight java >}}
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
{{</ highlight >}}

{{< highlight java >}}
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
{{</ highlight >}}

If this test case passed we can assume we have base setup ready.
