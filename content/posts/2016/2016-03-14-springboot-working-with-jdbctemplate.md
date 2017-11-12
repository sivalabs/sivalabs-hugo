---
title: 'SpringBoot : Working with JdbcTemplate'
author: Siva
type: post
date: 2016-03-14T07:08:22+00:00
url: /2016/03/springboot-working-with-jdbctemplate/
post_views_count:
  - 469
categories:
  - Spring
tags:
  - SpringBoot

---
Spring provides a nice abstraction on top of JDBC API using **JdbcTemplate** and also provides great transaction management capabilities 
using annotation based approach.

First let’s take a quick look at how we generally use Spring’s **JdbcTemplate** (**without SpringBoot**) by registering **DataSource**, 
**TransactionManager** and **JdbcTemplate** beans and optionally we can register **DataSourceInitializer** bean to initialize our database.

{{< highlight java >}}
@Configuration
@ComponentScan
@EnableTransactionManagement
@PropertySource(value = { "classpath:application.properties" })
public class AppConfig 
{
    @Autowired
    private Environment env;

    @Value("${init-db:false}")
    private String initDatabase;
    
    @Bean
    public static PropertySourcesPlaceholderConfigurer placeHolderConfigurer()
    {
        return new PropertySourcesPlaceholderConfigurer();
    }    

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource)
    {
        return new JdbcTemplate(dataSource);
    }

    @Bean
    public PlatformTransactionManager transactionManager(DataSource dataSource)
    {
        return new DataSourceTransactionManager(dataSource);
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
{{< / highlight >}}

With this configuration in place, we can inject **JdbcTemplate** into Data Access components to interact with databases.

{{< highlight java >}}
public class User
{
    private Integer id;
    private String name;
    private String email;

    // setters & getters
}
{{< / highlight >}}

{{< highlight java >}}
@Repository
public class UserRepository
{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly=true)
    public List&lt;User&gt; findAll() {
        return jdbcTemplate.query("select * from users", new UserRowMapper());
    }
}
{{< / highlight >}}

{{< highlight java >}}
class UserRowMapper implements RowMapper&lt;User&gt;
{
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException 
    {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));

        return user;
    }
}
{{< / highlight >}}

You might have observed that most of the times we use this similar kind of configuration in our applications.

Now let us see how to use **JdbcTemplate** without requiring to configure all these beans manually by using **SpringBoot**.

## Using JdbcTemplate with SpringBoot

By using SpringBoot we can take advantage of auto configuration feature and eliminate the need to configure beans by ourselves.

**Create a SpringBoot maven based project and add spring-boot-starter-jdbc module.**

{{< highlight xml >}}
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-jdbc&lt;/artifactId&gt;
&lt;/dependency&gt;
{{< / highlight >}}

By adding **spring-boot-starter-jdbc** module, we get the following auto configuration:


  * The spring-boot-starter-jdbc module transitively pulls tomcat-jdbc-{version}.jar which is used to configure the DataSource bean.
  * If you have not defined any DataSource bean explicitly and if you have any embedded database driver in classpath such as H2, HSQL or Derby then SpringBoot will automatically registers DataSource bean using in-memory database settings.
  * If you haven’t registered any of the following type beans then SpringBoot will register them automatically. 
    * **PlatformTransactionManager (DataSourceTransactionManager)**
    * **JdbcTemplate**
    * **NamedParameterJdbcTemplate** 
  * We can have **schema.sql** and **data.sql** files in root classpath which SpringBoot will automatically use to initialize database.In addition to schema.sql and data.sql, Spring Boot will load **schema-${platform}.sql** and **data-${platform}.sql** files if they are available in root classpath.
  
Here platform value is the value of the property spring.datasource.platform which can be **hsqldb, h2, oracle, mysql, postgresql** etc.
You can customize the default names of the scripts using the following properties:
        
* **spring.datasource.schema=create-db.sql**
* **spring.datasource.data=seed-data.sql**
        
SpringBoot uses **spring.datasource.initialize** property value, which is **true** by default, to determine whether to initialize database or not. If you want to turn off the database initialization you can set **spring.datasource.initialize=false**

If there are any errors in executing the scripts then application will fail to start. If you want to continue then you can set **spring.datasource.continueOnError=true**.</li> </ul> 

Let us add **H2** database driver to our **pom.xml**.
        
{{< highlight xml >}}
&lt;dependency&gt;
    &lt;groupId&gt;com.h2database&lt;/groupId&gt;
    &lt;artifactId&gt;h2&lt;/artifactId&gt;
&lt;/dependency&gt;
{{< / highlight >}}
        
Create **schema.sql** in **src/main/resources** as follows:
        
{{< highlight sql >}}
CREATE TABLE users
(
    id int(11) NOT NULL AUTO_INCREMENT,
    name varchar(100) NOT NULL,
    email varchar(100) DEFAULT NULL,
    PRIMARY KEY (id)
);
{{< / highlight >}}
        
Create **data.sql** in **src/main/resources** as follows:

{{< highlight sql >}}
insert into users(id, name, email) values(1,'Siva','siva@gmail.com');
insert into users(id, name, email) values(2,'Prasad','prasad@gmail.com');
insert into users(id, name, email) values(3,'Reddy','reddy@gmail.com');
{{< / highlight >}}
        
Now you can inject **JdbcTemplate** into **UserRepository** as follows:

{{< highlight java >}}
@Repository
public class UserRepository
{
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly=true)
    public List&lt;User&gt; findAll() {
        return jdbcTemplate.query("select * from users", 
                new UserRowMapper());
    }

    @Transactional(readOnly=true)
    public User findUserById(int id) {
        return jdbcTemplate.queryForObject(
            "select * from users where id=?",
            new Object[]{id}, new UserRowMapper());
    }

    public User create(final User user) 
    {
        final String sql = "insert into users(name,email) values(?,?)";

        KeyHolder holder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, user.getName());
                ps.setString(2, user.getEmail());
                return ps;
            }
        }, holder);

        int newUserId = holder.getKey().intValue();
        user.setId(newUserId);
        return user;
    }
}

class UserRowMapper implements RowMapper&lt;User&gt;
{
    @Override
    public User mapRow(ResultSet rs, int rowNum) throws SQLException {
        User user = new User();
        user.setId(rs.getInt("id"));
        user.setName(rs.getString("name"));
        user.setEmail(rs.getString("email"));
        return user;
    }
}
{{< / highlight >}}
        
Create the entry point **SpringbootJdbcDemoApplication.java**.

{{< highlight java >}}
@SpringBootApplication
public class SpringbootJdbcDemoApplication
{
    public static void main(String[] args)
    {
        SpringApplication.run(SpringbootJdbcDemoApplication.class, args);
    }
}
{{< / highlight >}}
        
Let us create a JUnit Test class to test our UserRepository methods.

{{< highlight java >}}
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(SpringbootJdbcDemoApplication.class)
public class SpringbootJdbcDemoApplicationTests
{
    @Autowired
    private UserRepository userRepository;

    @Test
    public void findAllUsers() {
        List&lt;User&gt; users = userRepository.findAll();
        assertNotNull(users);
        assertTrue(!users.isEmpty());
    }

    @Test
    public void findUserById() {
        User user = userRepository.findUserById(1);
        assertNotNull(user);
    }

    @Test
    public void createUser() {
        User user = new User(0, "John", "john@gmail.com");
        User savedUser = userRepository.create(user);
        User newUser = userRepository.findUserById(savedUser.getId());
        assertNotNull(newUser);
        assertEquals("John", newUser.getName());
        assertEquals("john@gmail.com", newUser.getEmail());
    }
}
{{< / highlight >}}
        

<blockquote class="tr_bq">
    <span style="color: red;">By default SpringBoot features such as external properties, logging etc are available in 
    the ApplicationContext only if you use <b>SpringApplication</b>. So, SpringBoot provides <b>@SpringApplicationConfiguration</b> annotation 
    to configure the ApplicationContext for tests which uses <b>SpringApplication </b>behind the scenes</span>.
</blockquote>

We have learned how to get started quickly with Embedded database. 

**What if we want to use Non-Embedded databases like MySQL, Oracle or PostgreSQL etc?**.

We can configure the database properties in application.properties file so that SpringBoot will use those jdbc parameters to configure DataSource bean.

{{< highlight properties >}}
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=admin
{{< / highlight >}}
        
For any reason if you want to have more control and configure **DataSource** bean by yourself then you can configure DataSource bean in a Configuration class. If you register DataSource bean then SpringBoot will not configure DataSource automatically using AutoConfiguration.

**What if you want to use another Connection Pooling library?**

SpringBoot by default pulls in **tomcat-jdbc-{version}.jar** and uses **org.apache.tomcat.jdbc.pool.DataSource** to configure **DataSource** bean.

SpringBoot checks the availability of the following classes and uses the first one that is available in classpath.

  * org.apache.tomcat.jdbc.pool.DataSource
  * com.zaxxer.hikari.HikariDataSource
  * org.apache.commons.dbcp.BasicDataSource
  * org.apache.commons.dbcp2.BasicDataSource

For example, If you want to use **HikariDataSource** then you can exclude **tomcat-jdbc** and add **HikariCP** dependency as follows:

{{< highlight xml >}}
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-jdbc&lt;/artifactId&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
        &lt;groupId&gt;org.apache.tomcat&lt;/groupId&gt;
        &lt;artifactId&gt;tomcat-jdbc&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;

&lt;dependency&gt;
    &lt;groupId&gt;com.zaxxer&lt;/groupId&gt;
    &lt;artifactId&gt;HikariCP&lt;/artifactId&gt;
&lt;/dependency&gt;
{{< / highlight >}}
        
With this dependency configuration SpringBoot will use **HikariCP** to configure **DataSource** bean.

You can find the source code of the article at my GitHub repo <https://github.com/sivaprasadreddy/springboot-tutorials>
