---
title: 'SpringBoot : Working with MyBatis'
author: Siva
type: post
date: 2016-03-14T07:10:42+00:00
url: /springboot-working-with-mybatis/
categories:
  - Spring
tags:
  - SpringBoot

---
**MyBatis** is a SQL Mapping framework with support for custom SQL, stored procedures and advanced mappings.

> SpringBoot doesn’t provide official support for MyBatis integration, but MyBatis community built a SpringBoot starter for MyBatis.

<!--more-->


You can read about the SpringBoot MyBatis Starter release announcement at http://blog.mybatis.org/2015/11/mybatis-spring-boot-released.html and you can explore the source code on GitHub https://github.com/mybatis/mybatis-spring-boot.

### Create a SpringBoot Maven project and add the following MyBatis Starter dependency.


```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.0.0</version>
</dependency>
```

We will be reusing **User.java, schema.sql and data.sql** files created in my previous article [SpringBoot : Working with JdbcTemplate]({{< relref "2016-03-14-springboot-working-with-jdbctemplate.md" >}})

Create MyBatis SQL Mapper interface **UserMapper.java** with few database operations as follows:

```java
package com.sivalabs.demo.domain;

public interface UserMapper
{
    void insertUser(User user);
    User findUserById(Integer id);
    List<User> findAllUsers();
}
```

We need to create Mapper XML files to define the queries for the mapped SQL statements for the corresponding Mapper interface methods.

Create **UserMapper.xml** file in **src/main/resources/com/sivalabs/demo/mappers/** directory as follows:

```xml
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.sivalabs.demo.mappers.UserMapper">

    <resultMap id="UserResultMap" type="User">
        <id column="id" property="id" />
        <result column="name" property="name" />
        <result column="email" property="email" />
    </resultMap>

    <select id="findAllUsers" resultMap="UserResultMap">
        select id, name, email from users
    </select>

    <select id="findUserById" resultMap="UserResultMap">
        select id, name, email from users WHERE id=#{id}
    </select>

    <insert id="insertUser" parameterType="User" useGeneratedKeys="true" keyProperty="id">
        insert into users(name,email) values(#{name},#{email})
    </insert>
</mapper>
```

Few things to observe here are:

  * Namespace in Mapper XML should be same as Fully Qualified Name (FQN) for Mapper Interface
  * Statement id values should be same as Mapper Interface method names.
  * If the query result column names are different from bean property names we can use `<resultMap>` configuration to provide mapping between column names and their corresponding bean property names.&nbsp;

MyBatis also provides annotation based query configurations without requiring Mapper XMLs.
  
We can create **UserMapper.java** interface and configure the mapped SQLs using annotations as follows:

```java
public interface UserMapper
{
    @Insert("insert into users(name,email) values(#{name},#{email})")
    @SelectKey(statement="call identity()", keyProperty="id",
    before=false, resultType=Integer.class)
    void insertUser(User user);

    @Select("select id, name, email from users WHERE id=#{id}")
    User findUserById(Integer id);

    @Select("select id, name, email from users")
    List<User> findAllUsers();

}
```

SpringBoot MyBatis starter provides the following MyBatis configuration parameters which we can use to customize MyBatis settings.

```java
mybatis.config = mybatis config file name
mybatis.mapperLocations = mappers file locations
mybatis.typeAliasesPackage = domain object's package
mybatis.typeHandlersPackage = handler's package
mybatis.check-config-location = check the mybatis configuration exists
mybatis.executorType = mode of execution. Default is SIMPLE
```

Configure the **typeAliasesPackage** and **mapperLocations** in **application.properties**.

```java
mybatis.typeAliasesPackage=com.sivalabs.demo.domain
mybatis.mapperLocations=classpath*:**/mappers/*.xml
```

Create the entry point class **SpringbootMyBatisDemoApplication.java**.

```java
@SpringBootApplication
@MapperScan("com.sivalabs.demo.mappers")
public class SpringbootMyBatisDemoApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(SpringbootMyBatisDemoApplication.class, args);
    }
}
```

Observe that we have used **@MapperScan("com.sivalabs.demo.mappers")** annotation to specify where to look for Mapper interfaces.

Now create a JUnit test class and test our UserMapper methods.

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(SpringbootMyBatisDemoApplication.class)
public class SpringbootMyBatisDemoApplicationTests
{
    @Autowired
    private UserMapper userMapper;

    @Test
    public void findAllUsers() {
        List<User> users = userMapper.findAllUsers();
        assertNotNull(users);
        assertTrue(!users.isEmpty());
    }

    @Test
    public void findUserById() {
        User user = userMapper.findUserById(1);
        assertNotNull(user);
    }

    @Test
    public void createUser() {
        User user = new User(0, "Siva", "siva@gmail.com");
        userMapper.insertUser(user);
        User newUser = userMapper.findUserById(user.getId());
        assertEquals("Siva", newUser.getName());
        assertEquals("siva@gmail.com", newUser.getEmail());
    }
}
```

You can find the source code of the article at my GitHub repo https://github.com/sivaprasadreddy/springboot-tutorials

You can read more about MyBatis and Spring integration at http://blog.mybatis.org/p/products.html and http://www.mybatis.org/spring/.
