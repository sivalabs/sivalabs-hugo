---
title: 'SpringBoot : Working with JOOQ'
author: Siva
type: post
date: 2016-03-15T07:13:21.000Z
url: /blog/springboot-working-with-jooq/
categories:
  - Spring
tags:
  - jooq
  - SpringBoot
aliases:
  - /springboot-working-with-jooq/
---
In my previous article [SpringBoot : Working with MyBatis]({{< relref "2016-03-14-springboot-working-with-mybatis.md" >}}) we have learned how to use SpringBoot MyBatis Starter to quickly get up and running with Spring and MyBatis. In this article we are going to learn about how to use SpringBoot JOOQ Starter.

JOOQ (JOOQ Object Oriented Querying) is a persistence framework which embraces SQL.

<!--more-->


JOOQ provides the following features:

  * Building Typesafe SQL using DSL API
  * Typesafe database object referencing using Code Generation
  * Easy to use API for Querying and Data fetching
  * SQL logging and debugging
  * etc etc

SpringBoot provides a starter, **spring-boot-starter-jooq**, to be able to quickly integrate with JOOQ.

In this article we will see how to use **spring-boot-starter-jooq** using step by step approach.

### Step 1: Create SpringBoot Maven Project

Create a SpringBoot maven based project and configure **spring-boot-starter-jooq** dependency.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
                        http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sivalabs</groupId>
    <artifactId>springboot-jooq-demo</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.3.3.RELEASE</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <java.version>1.8</java.version>
    </properties>

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
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-jooq</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
    </dependencies>
</project>
```

We are going to use **H2** in-memory database first, later we will see how to use MySQL.

### Step 2: Create the database initialization scripts

We are going to create a simple database with 2 tables.
  
**src/main/resources/schema.sql**

```sql
DROP TABLE IF EXISTS POSTS;

CREATE TABLE POSTS (
  ID int(11) NOT NULL AUTO_INCREMENT,
  TITLE varchar(200) NOT NULL,
  CONTENT LONGTEXT DEFAULT NULL,
  CREATED_ON datetime DEFAULT NULL,
  PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS COMMENTS;

CREATE TABLE COMMENTS (
  ID int(11) NOT NULL AUTO_INCREMENT,
  POST_ID int(11) NOT NULL, 
  NAME varchar(200) NOT NULL,
  EMAIL varchar(200) NOT NULL,
  CONTENT LONGTEXT DEFAULT NULL,
  CREATED_ON datetime DEFAULT NULL,
  PRIMARY KEY (ID),
  FOREIGN KEY (POST_ID) REFERENCES POSTS(ID)
);
```

We will populate some sample data using **data.sql** script.

**src/main/resources/data.sql** 

```sql
insert into posts(id, title, content, created_on) 
values(1, 'Post 1', 'This is post 1', '2016-01-03');

insert into posts(id, title, content, created_on) 
values(2, 'Post 2', 'This is post 2', '2016-01-05');

insert into posts(id, title, content, created_on) 
values(3, 'Post 3', 'This is post 3', '2016-01-07');

insert into comments(id, post_id, name, email, content, created_on) 
values(1, 1, 'User1', 'user1@gmail.com', 'This is comment 1 on post 1', '2016-01-07');

insert into comments(id, post_id, name, email, content, created_on) 
values(2, 1, 'User2', 'user2@gmail.com', 'This is comment 2 on post 1', '2016-01-07');

insert into comments(id, post_id, name, email, content, created_on) 
values(3, 2, 'User1', 'user1@gmail.com', 'This is comment 1 on post 2', '2016-01-07');
```

### Step 3: Configure JOOQ Maven Codegen Plugin to generate database artifacts

We will use Maven profiles to configure the **jooq-codegen-maven** configuration properties based on database type.

```xml
<profiles>
    <profile>
        <id>h2</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.jooq</groupId>
                    <artifactId>jooq-codegen-maven</artifactId>
                    <executions>
                        <execution>
                            <goals>
                                <goal>generate</goal>
                            </goals>
                        </execution>
                    </executions>
                    <dependencies>
                        <dependency>
                            <groupId>com.h2database</groupId>
                            <artifactId>h2</artifactId>
                            <version>${h2.version}</version>
                        </dependency>
                    </dependencies>
                    <configuration>
                        <jdbc>
                            <driver>org.h2.Driver</driver>
                            <url>jdbc:h2:~/springbootjooq</url>
                        </jdbc>
                        <generator>
                            <name>org.jooq.util.DefaultGenerator</name>
                            <database>
                                <name>org.jooq.util.h2.H2Database</name>
                                <includes>.*</includes>
                                <excludes />
                                <inputSchema>PUBLIC</inputSchema>
                            </database>
                            <target>
                                <packageName>com.sivalabs.demo.jooq.domain</packageName>
                                <directory>gensrc/main/java</directory>
                            </target>
                        </generator>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
    <profile>
        <id>mysql</id>
        <build>
            <plugins>
                <plugin>
                    <groupId>org.jooq</groupId>
                    <artifactId>jooq-codegen-maven</artifactId>
                    <executions>
                        <execution>
                            <goals>
                                <goal>generate</goal>
                            </goals>
                        </execution>
                    </executions>
                    <dependencies>
                        <dependency>
                            <groupId>mysql</groupId>
                            <artifactId>mysql-connector-java</artifactId>
                            <version>${mysql.version}</version>
                        </dependency>
                    </dependencies>
                    <configuration>
                        <jdbc>
                            <driver>com.mysql.jdbc.Driver</driver>
                            <url>jdbc:mysql://localhost:3306/test</url>
                            <user>root</user>
                            <password>admin</password>
                        </jdbc>
                        <generator>
                            <name>org.jooq.util.DefaultGenerator</name>
                            <database>
                                <name>org.jooq.util.mysql.MySQLDatabase</name>
                                <includes>.*</includes>
                                <excludes />
                                <inputSchema>test</inputSchema>
                            </database>
                            <target>
                                <packageName>com.sivalabs.demo.jooq.domain</packageName>
                                <directory>gensrc/main/java</directory>
                            </target>
                        </generator>
                    </configuration>
                </plugin>
            </plugins>
        </build>
    </profile>
</profiles>
```

We have configured two profile (**h2** and **mysql**) with appropriate JDBC configuration parameters.

We have specified to generate the code artifacts and place it in **com.sivalabs.demo.jooq.domain** package within **gensrc/main/java directory**.

We can run the maven build activating **h2** or **mysql** profile as follows:
  
**mvn clean install -P h2** (or) **mvn clean install -P mysql**


### Step 4: Configure Maven build-helper-maven-plugin Plugin to add the generated source as sources folder

We will configure the **build-helper-maven-plugin** plugin such that maven will add the JOOQ generated code resides in **gensrc/main/java** directory as source folder.

```xml
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>build-helper-maven-plugin</artifactId>
    <executions>
        <execution>
            <phase>generate-sources</phase>
            <goals>
                <goal>add-source</goal>
            </goals>
            <configuration>
                <sources>
                    <source>gensrc/main/java</source>
                </sources>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### Step 5: Create domain objects.

We can use these domain object to pass data across the layer and JOOQ generated database artifacts to talk to database.

```java
public class Post
{
    private Integer id;
    private String title;
    private String content;
    private Timestamp createdOn;
    private List<Comment> comments = new ArrayList<>();
    //setters & getters

}
```

```java
public class Comment
{
    private Integer id;
    private Post post;
    private String name;
    private String email;
    private String content;
    private Timestamp createdOn;
    //setters & getters
}
```

### Step 6: Implement the data persistence methods using JOOQ as follows

```java
package com.sivalabs.demo;

import static com.sivalabs.demo.jooq.domain.tables.Posts.POSTS;
import static com.sivalabs.demo.jooq.domain.tables.Comments.COMMENTS;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sivalabs.demo.entities.Comment;
import com.sivalabs.demo.entities.Post;
import com.sivalabs.demo.jooq.domain.tables.records.CommentsRecord;
import com.sivalabs.demo.jooq.domain.tables.records.PostsRecord;

@Service
@Transactional
public class BlogService
{
    @Autowired
    private DSLContext dsl;
    
    public Post createPost(Post post){
        PostsRecord postsRecord = dsl.insertInto(POSTS)
                .set(POSTS.TITLE, post.getTitle())
                .set(POSTS.CONTENT, post.getContent())
                .set(POSTS.CREATED_ON, post.getCreatedOn())
                .returning(POSTS.ID)
                .fetchOne();
            
        post.setId(postsRecord.getId());
        return post;
    }
    
    public List<Post> getAllPosts(){        
        List<Post> posts = new ArrayList<>();       
        Result<Record> result = dsl.select().from(POSTS).fetch();
        for (Record r : result) {
            posts.add(getPostEntity(r));
        }
        return posts ;
    }

    public Post getPost(Integer postId){
        Record record = dsl.select().
                                from(POSTS)
                                .where(POSTS.ID.eq(postId))
                                .fetchOne();
        if(record != null)
        {
            Post post = getPostEntity(record);
            
            Result<Record> commentRecords = dsl.select().
                                        from(COMMENTS)
                                        .where(COMMENTS.POST_ID.eq(postId))
                                        .fetch();
            
            for (Record r : commentRecords) {
                post.addComment(getCommentEntity(r));
            }
            return post;
        }
        return null;
    }
    
    
    public Comment createComment(Comment comment){
        CommentsRecord commentsRecord = dsl.insertInto(COMMENTS)
                .set(COMMENTS.POST_ID, comment.getPost().getId())
                .set(COMMENTS.NAME, comment.getName())
                .set(COMMENTS.EMAIL, comment.getEmail())
                .set(COMMENTS.CONTENT, comment.getContent())
                .set(COMMENTS.CREATED_ON, comment.getCreatedOn())
                .returning(COMMENTS.ID)
                .fetchOne();
            
        comment.setId(commentsRecord.getId());
        return comment;
    }
    
    public void deleteComment(Integer commentId){
        dsl.deleteFrom(COMMENTS)
                .where(COMMENTS.ID.equal(commentId))
                .execute();
    }
    
    private Post getPostEntity(Record r){
        Integer id = r.getValue(POSTS.ID, Integer.class);
        String title = r.getValue(POSTS.TITLE, String.class);
        String content = r.getValue(POSTS.CONTENT, String.class);
        Timestamp createdOn = r.getValue(POSTS.CREATED_ON, Timestamp.class);
        return new Post(id, title, content, createdOn);
    }
    
    private Comment getCommentEntity(Record r) {
        Integer id = r.getValue(COMMENTS.ID, Integer.class);
        Integer postId = r.getValue(COMMENTS.POST_ID, Integer.class);
        String name = r.getValue(COMMENTS.NAME, String.class);
        String email = r.getValue(COMMENTS.EMAIL, String.class);
        String content = r.getValue(COMMENTS.CONTENT, String.class);
        Timestamp createdOn = r.getValue(COMMENTS.CREATED_ON, Timestamp.class);
        return new Comment(id, postId, name, email, content, createdOn);
    }
}
```

Observe that we are auto-wiring **DSLContext** instance into our Spring Bean and using it to build the TypeSafe queries.

### Step 7: Create Entry point class and JUnit test


```java
@SpringBootApplication
public class SpringbootJooqDemoApplication
{
    public static void main(String[] args) {
        SpringApplication.run(SpringbootJooqDemoApplication.class, args);
    }
}
```

```java
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(SpringbootJooqDemoApplication.class)
public class SpringbootJooqDemoApplicationTests
{

    @Autowired
    private BlogService blogService;
    
    @Test
    public void findAllPosts()  {
        List<Post> posts = blogService.getAllPosts();
        assertNotNull(posts);
        assertTrue(!posts.isEmpty());
        for (Post post : posts)
        {
            System.err.println(post);
        }
    }
    
    @Test
    public void findPostById()  {
        Post post = blogService.getPost(1);
        assertNotNull(post);
        System.out.println(post);
        List<Comment> comments = post.getComments();
        System.out.println(comments);
        
    }
    
    @Test
    public void createPost() {
        Post post = new Post(0, "My new Post", 
                            "This is my new test post", 
                            new Timestamp(System.currentTimeMillis()));
        Post savedPost = blogService.createPost(post);
        Post newPost = blogService.getPost(savedPost.getId());
        assertEquals("My new Post", newPost.getTitle());
        assertEquals("This is my new test post", newPost.getContent());
    }
    
    @Test
    public void createComment() {
        Integer postId = 1;
        Comment comment = new Comment(0, postId, "User4", 
                                "user4@gmail.com", "This is my new comment on post1", 
                                new Timestamp(System.currentTimeMillis()));
        Comment savedComment = blogService.createComment(comment);
        Post post = blogService.getPost(postId);
        List<Comment> comments = post.getComments();
        assertNotNull(comments);
        for (Comment comm : comments)
        {
            if(savedComment.getId() == comm.getId()){
                assertEquals("User4", comm.getName());
                assertEquals("user4@gmail.com", comm.getEmail());
                assertEquals("This is my new comment on post1", comm.getContent());
            }
        }
        
    }
    
}
```

Assuming you have generated code using **H2** profile, we can run the JUnit test with out any further configuration.

But if you have generated code using **mysql** profile then you will have to configure the following properties in **application.properties**.

```properties
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=admin

spring.jooq.sql-dialect=MYSQL
```

> Note that we should use correct **SqlDialect** for the database otherwise you may get SQL syntax errors at runtime.

You can find the source code of this article at my GitHub repository https://github.com/sivaprasadreddy/springboot-tutorials/tree/master/database/springboot-jooq-demo

For more info on **JOOQ** you can look at http://www.jooq.org/learn/
