---
title: 'SpringBoot : Working with MyBatis'
author: Siva
type: post
date: 2016-03-14T07:10:42+00:00
url: /2016/03/springboot-working-with-mybatis/
post_views_count:
  - 81
categories:
  - Spring
tags:
  - SpringBoot

---
**MyBatis** is a SQL Mapping framework with support for custom SQL, stored procedures and advanced mappings.

<blockquote class="tr_bq">
    <span style="color: red;"><br />SpringBoot doesn’t provide official support for MyBatis integration, but MyBatis community built a SpringBoot starter for MyBatis.&nbsp;</span>
</blockquote>

You can read about the SpringBoot MyBatis Starter release announcement at <http://blog.mybatis.org/2015/11/mybatis-spring-boot-released.html> and you can explore the source code on GitHub <https://github.com/mybatis/mybatis-spring-boot>.

### Create a SpringBoot Maven project and add the following MyBatis Starter dependency.


{{< highlight xml >}}
&lt;dependency&gt;
    &lt;groupId&gt;org.mybatis.spring.boot&lt;/groupId&gt;
    &lt;artifactId&gt;mybatis-spring-boot-starter&lt;/artifactId&gt;
    &lt;version&gt;1.0.0&lt;/version&gt;
&lt;/dependency&gt;
{{< / highlight >}}

We will be reusing **User.java, schema.sql and data.sql** files created in my previous article [SpringBoot : Working with JdbcTemplate]({{< relref "2016-03-14-springboot-working-with-jdbctemplate.md" >}})

Create MyBatis SQL Mapper interface **UserMapper.java** with few database operations as follows:

{{< highlight java >}}
package com.sivalabs.demo.domain;

public interface UserMapper
{
    void insertUser(User user);
    User findUserById(Integer id);
    List&lt;User&gt; findAllUsers();
}
{{< / highlight >}}

We need to create Mapper XML files to define the queries for the mapped SQL statements for the corresponding Mapper interface methods.

Create **UserMapper.xml** file in **src/main/resources/com/sivalabs/demo/mappers/** directory as follows:

{{< highlight xml >}}
&lt;!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd"&gt;

&lt;mapper namespace="com.sivalabs.demo.mappers.UserMapper"&gt;

    &lt;resultMap id="UserResultMap" type="User"&gt;
        &lt;id column="id" property="id" /&gt;
        &lt;result column="name" property="name" /&gt;
        &lt;result column="email" property="email" /&gt;
    &lt;/resultMap&gt;

    &lt;select id="findAllUsers" resultMap="UserResultMap"&gt;
        select id, name, email from users
    &lt;/select&gt;

    &lt;select id="findUserById" resultMap="UserResultMap"&gt;
        select id, name, email from users WHERE id=#{id}
    &lt;/select&gt;

    &lt;insert id="insertUser" parameterType="User" useGeneratedKeys="true" keyProperty="id"&gt;
        insert into users(name,email) values(#{name},#{email})
    &lt;/insert&gt;
&lt;/mapper&gt;
{{< / highlight >}}

Few things to observe here are:

  * Namespace in Mapper XML should be same as Fully Qualified Name (FQN) for Mapper Interface
  * Statement id values should be same as Mapper Interface method names.
  * If the query result column names are different from bean property names we can use <resultMap> configuration to provide mapping between column names and their corresponding bean property names.&nbsp;

MyBatis also provides annotation based query configurations without requiring Mapper XMLs.
  
We can create **UserMapper.java** interface and configure the mapped SQLs using annotations as follows:

{{< highlight java >}}
public interface UserMapper
{
    @Insert("insert into users(name,email) values(#{name},#{email})")
    @SelectKey(statement="call identity()", keyProperty="id",
    before=false, resultType=Integer.class)
    void insertUser(User user);

    @Select("select id, name, email from users WHERE id=#{id}")
    User findUserById(Integer id);

    @Select("select id, name, email from users")
    List&lt;User&gt; findAllUsers();

}
{{< / highlight >}}

SpringBoot MyBatis starter provides the following MyBatis configuration parameters which we can use to customize MyBatis settings.

{{< highlight java >}}
mybatis.config = mybatis config file name
mybatis.mapperLocations = mappers file locations
mybatis.typeAliasesPackage = domain object's package
mybatis.typeHandlersPackage = handler's package
mybatis.check-config-location = check the mybatis configuration exists
mybatis.executorType = mode of execution. Default is SIMPLE
{{< / highlight >}}

Configure the **typeAliasesPackage** and **mapperLocations** in **application.properties**.

{{< highlight java >}}
mybatis.typeAliasesPackage=com.sivalabs.demo.domain
mybatis.mapperLocations=classpath*:**/mappers/*.xml
{{< / highlight >}}

Create the entry point class **SpringbootMyBatisDemoApplication.java**.

{{< highlight java >}}
@SpringBootApplication
@MapperScan("com.sivalabs.demo.mappers")
public class SpringbootMyBatisDemoApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(SpringbootMyBatisDemoApplication.class, args);
    }
}
{{< / highlight >}}

Observe that we have used **@MapperScan(&#8220;com.sivalabs.demo.mappers&#8221;)** annotation to specify where to look for Mapper interfaces.

Now create a JUnit test class and test our UserMapper methods.

{{< highlight java >}}
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(SpringbootMyBatisDemoApplication.class)
public class SpringbootMyBatisDemoApplicationTests
{
    @Autowired
    private UserMapper userMapper;

    @Test
    public void findAllUsers() {
        List&lt;User&gt; users = userMapper.findAllUsers();
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
{{< / highlight >}}

You can find the source code of the article at my GitHub repo&nbsp;<https://github.com/sivaprasadreddy/springboot-tutorials>

You can read more about MyBatis and Spring integration at <http://blog.mybatis.org/p/products.html>&nbsp;and&nbsp;<http://www.mybatis.org/spring/>.
