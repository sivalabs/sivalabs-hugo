---
title: Creating Custom SpringBoot Starter for Twitter4j
author: Siva
type: post
date: 2016-04-08T06:57:23+00:00
url: /2016/04/creating-custom-springboot-starter-for/
post_views_count:
  - 20
categories:
  - Spring
tags:
  - SpringBoot

---
**SpringBoot** provides lot of starter modules to get up and running quickly. SpringBoot’s auto-configure mechanism takes care of configuring SpringBeans on our behalf based on various criteria.

In addition to the springboot starters that comes out-of-the-box provided by Core Spring Team, we can also create our own starter modules.

In this post we will look into how to create a custom SpringBoot starter. To demonstrate it we are going to create **twitter4j-spring-boot-starter** which will auto-configure Twitter4J beans.

To accomplish this, we are going to create:

  1. &nbsp;**twitter4j-spring-boot-autoconfigure** module which contains Twitter4J AutoConfiguration bean definitions&nbsp;
  2. **twitter4j-spring-boot-starter** module which pulls in **twitter4j-spring-boot-autoconfigure** and **twitter4j-core** dependencies&nbsp;
  3. Sample application which uses **twitter4j-spring-boot-starter**&nbsp;


### Create Parent Module spring-boot-starter-twitter4j

First we are going to create a parent pom type module to define dependency versions and sub-modules.

{{< highlight xml >}}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                        http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.sivalabs</groupId>
    <artifactId>spring-boot-starter-twitter4j</artifactId>
    <packaging>pom</packaging>
    <version>1.0-SNAPSHOT</version>
    <name>spring-boot-starter-twitter4j</name>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <twitter4j.version>4.0.3</twitter4j.version>
        <spring-boot.version>1.3.2.RELEASE</spring-boot.version>
    </properties>

    <modules>
        <module>twitter4j-spring-boot-autoconfigure</module>
        <module>twitter4j-spring-boot-starter</module>
        <module>twitter4j-spring-boot-sample</module>
    </modules>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <dependency>
                <groupId>org.twitter4j</groupId>
                <artifactId>twitter4j-core</artifactId>
                <version>${twitter4j.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
{{< / highlight >}}

In this **pom.xml** we are defining the SpringBoot and Twitter4j versions in <dependencymanagement> section so that we don’t need to specify versions all over the places.&nbsp;</dependencymanagement>
  

### Create twitter4j-spring-boot-autoconfigure module

Create a child module with name **twitter4j-spring-boot-autoconfigure** in our parent maven module **spring-boot-starter-twitter4j**.&nbsp;

Add the maven dependencies such as spring-boot, **spring-boot-autoconfigure**, **twitter4j-core** and **junit** as follows:

{{< highlight xml >}}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
               http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sivalabs</groupId>
    <artifactId>twitter4j-spring-boot-autoconfigure</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>com.sivalabs</groupId>
        <artifactId>spring-boot-starter-twitter4j</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-autoconfigure</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-configuration-processor</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.twitter4j</groupId>
            <artifactId>twitter4j-core</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
</project>
{{< / highlight >}}


Note that we have specified **twitter4j-core** as **optional** dependency because **twitter4j-core** should be added to the project only when **twitter4j-spring-boot-starter** is added to the project.


### Create Twitter4jProperties to hold the Twitter4J config parameters&nbsp;

Create <b>Twitter4jProperties.java </b>to hold the Twitter4J OAuth config parameters.

{{< highlight java >}}
package com.sivalabs.spring.boot.autoconfigure;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;

@ConfigurationProperties(prefix= Twitter4jProperties.TWITTER4J_PREFIX)
public class Twitter4jProperties {

    public static final String TWITTER4J_PREFIX = "twitter4j";

    private Boolean debug = false;

    @NestedConfigurationProperty
    private OAuth oauth = new OAuth();

    public Boolean getDebug() {
        return debug;
    }

    public void setDebug(Boolean debug) {
        this.debug = debug;
    }

    public OAuth getOauth() {
        return oauth;
    }

    public void setOauth(OAuth oauth) {
        this.oauth = oauth;
    }

    public static class OAuth {

        private String consumerKey;
        private String consumerSecret;
        private String accessToken;
        private String accessTokenSecret;

        public String getConsumerKey() {
            return consumerKey;
        }
        public void setConsumerKey(String consumerKey) {
            this.consumerKey = consumerKey;
        }
        public String getConsumerSecret() {
            return consumerSecret;
        }
        public void setConsumerSecret(String consumerSecret) {
            this.consumerSecret = consumerSecret;
        }
        public String getAccessToken() {
            return accessToken;
        }
        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }
        public String getAccessTokenSecret() {
            return accessTokenSecret;
        }
        public void setAccessTokenSecret(String accessTokenSecret) {
            this.accessTokenSecret = accessTokenSecret;
        }
    }
}
{{< / highlight >}}
  
  
With this configuration object we can configure the twitter4j properties in <b>application.properties</b> as follows:
    
      
{{< highlight java >}}t
witter4j.debug=true
twitter4j.oauth.consumer-key=your-consumer-key-here
twitter4j.oauth.consumer-secret=your-consumer-secret-here
twitter4j.oauth.access-token=your-access-token-here
twitter4j.oauth.access-token-secret=your-access-token-secret-here
{{< / highlight >}}

##  Create Twitter4jAutoConfiguration to auto-configure Twitter4J 
  
  
Here comes the key part of our starter. <b>Twitter4jAutoConfiguration </b>configuration class contains the bean definitions that will be automatically configured based on some criteria.&nbsp;
  
What is that criteria?

* If <b>twitter4j.TwitterFactory</b>.class is on classpath&nbsp;
* If <b>TwitterFactory </b>bean is not already defined explicitly&nbsp;

So, the <b>Twitter4jAutoConfiguration</b> goes like this.

{{< highlight java >}}
package com.sivalabs.spring.boot.autoconfigure;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import twitter4j.Twitter;
import twitter4j.TwitterFactory;
import twitter4j.conf.ConfigurationBuilder;

@Configuration
@ConditionalOnClass({ TwitterFactory.class, Twitter.class })
@EnableConfigurationProperties(Twitter4jProperties.class)
public class Twitter4jAutoConfiguration {

    private static Log log = LogFactory.getLog(Twitter4jAutoConfiguration.class);

    @Autowired
    private Twitter4jProperties properties;

    @Bean
    @ConditionalOnMissingBean
    public TwitterFactory twitterFactory(){

        if (this.properties.getOauth().getConsumerKey() == null
            || this.properties.getOauth().getConsumerSecret() == null
            || this.properties.getOauth().getAccessToken() == null
            || this.properties.getOauth().getAccessTokenSecret() == null)
        {
            String msg = "Twitter4j properties not configured properly." + 
                         " Please check twitter4j.* properties settings in configuration file.";
            log.error(msg);
            throw new RuntimeException(msg);
        }

        ConfigurationBuilder cb = new ConfigurationBuilder();
        cb.setDebugEnabled(properties.getDebug())
          .setOAuthConsumerKey(properties.getOauth().getConsumerKey())
          .setOAuthConsumerSecret(properties.getOauth().getConsumerSecret())
          .setOAuthAccessToken(properties.getOauth().getAccessToken())
          .setOAuthAccessTokenSecret(properties.getOauth().getAccessTokenSecret());
        TwitterFactory tf = new TwitterFactory(cb.build());
        return tf;
    }

    @Bean
    @ConditionalOnMissingBean
    public Twitter twitter(TwitterFactory twitterFactory){
        return twitterFactory.getInstance();
    }

}
{{< / highlight >}}
            
            
We have used <b>@ConditionalOnClass({ TwitterFactory.class, Twitter.class })</b> to specify that this auto configuration should take place only when <b>TwitterFactory.class, Twitter.class </b>classes are present.

We have also used <b>@ConditionalOnMissingBean</b> on bean definition methods to specify consider this bean definition only if <b>TwitterFactory</b>/<b>Twitter </b>beans are not already defined explicitly.&nbsp;


Also note that we have annotated with <b>@EnableConfigurationProperties(Twitter4jProperties.class)</b> to enable support for ConfigurationProperties and injected <b>Twitter4jProperties </b>bean.&nbsp;

Now we need to configure our custom <b>Twitter4jAutoConfiguration </b>in <b>src/main/resources/META-INF/spring.factories</b> file as follows:

<b>org.springframework.boot.autoconfigure.EnableAutoConfiguration=com.sivalabs.spring.boot.autoconfigure.Twitter4jAutoConfiguration</b>&nbsp;


## Create twitter4j-spring-boot-starter module

Create a child module with name twitter4j-spring-boot-starter in our parent maven module spring-boot-starter-twitter4j.

{{< highlight xml >}}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                        http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sivalabs</groupId>
    <artifactId>twitter4j-spring-boot-starter</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>com.sivalabs</groupId>
        <artifactId>spring-boot-starter-twitter4j</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>


    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter</artifactId>
        </dependency>
        <dependency>
            <groupId>com.sivalabs</groupId>
            <artifactId>twitter4j-spring-boot-autoconfigure</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>org.twitter4j</groupId>
            <artifactId>twitter4j-core</artifactId>
        </dependency>

    </dependencies>

</project>
{{< / highlight >}}
                    
Note that in this maven module we are actually pulling in <b>twitter4j-core</b> dependency.

We don’t need to add any code in this module, but optionally we can specify what are the dependencies we are going to provide through this starter in <b>src/main/resources/META-INF/spring.provides</b> file as follows:


<b>provides: twitter4j-core&nbsp;</b>

That’s all for our starter.&nbsp;

Let us create a sample using our brand new starter <b>twitter4j-spring-boot-starter</b>.&nbsp;

## Create twitter4j-spring-boot-sample sample application

Let us create a simple SpringBoot application and add our <b>twitter4j-spring-boot-starter</b> dependency.

{{< highlight xml >}}
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                        http://maven.apache.org/maven-v4_0_0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.sivalabs</groupId>
    <artifactId>twitter4j-spring-boot-sample</artifactId>
    <packaging>jar</packaging>
    <version>1.0-SNAPSHOT</version>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.3.2.RELEASE</version>
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
            <groupId>com.sivalabs</groupId>
            <artifactId>twitter4j-spring-boot-starter</artifactId>
            <version>1.0-SNAPSHOT</version>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
{{< / highlight >}}
                        
Create the entry-point class <b>SpringbootTwitter4jDemoApplication </b>as follows:
  
{{< highlight java >}}
package com.sivalabs.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringbootTwitter4jDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootTwitter4jDemoApplication.class, args);
    }
}
{{< / highlight >}}
                            
                           
Create <b>TweetService </b>as follows:


{{< highlight java >}}
package com.sivalabs.demo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import twitter4j.ResponseList;
import twitter4j.Status;
import twitter4j.Twitter;
import twitter4j.TwitterException;

@Service
public class TweetService {

    @Autowired
    private Twitter twitter;

    public List<String> getLatestTweets(){
        List<String> tweets = new ArrayList<>();
        try {
            ResponseList<Status> homeTimeline = twitter.getHomeTimeline();
            for (Status status : homeTimeline) {
                tweets.add(status.getText());
            }
        } catch (TwitterException e) {
            throw new RuntimeException(e);
        }
        return tweets;
    }
}
{{< / highlight >}}
                                
                               
Now create a Test to verify our Twitter4j AutoConfigutation.

<span style="color: red;">Before that make sure you have set your twitter4j oauth configuration parameter to your actual values. You can get them from <b>https://apps.twitter.com/</b></span>

{{< highlight java >}}
package com.sivalabs.demo;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import twitter4j.TwitterException;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(SpringbootTwitter4jDemoApplication.class)
public class SpringbootTwitter4jDemoApplicationTest  {


    @Autowired
    private TweetService tweetService;

    @Test
    public void testGetTweets() throws TwitterException {
        List<String> tweets = tweetService.getLatestTweets();
        for (String tweet : tweets) {
            System.err.println(tweet);
        }
    }

}
{{< / highlight >}}
  
Now you should be able to see the latest tweets on your console output.&nbsp;

You can find the code on GitHub <b><a href="https://github.com/sivaprasadreddy/twitter4j-spring-boot-starter">https://github.com/sivaprasadreddy/twitter4j-spring-boot-starter</a></b>
