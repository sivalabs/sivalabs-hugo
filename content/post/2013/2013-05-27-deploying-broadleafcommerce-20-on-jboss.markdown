---
author: siva
comments: true
date: 2013-05-27 11:40:00+00:00
layout: post
slug: deploying-broadleafcommerce-20-on-jboss
title: Deploying BroadleafCommerce 2.0 on JBoss AS 7
wordpress_id: 227
categories:
- JBoss
- Spring
tags:
- JBoss
- Spring
---

First 2 steps are not really related to Broadleaf specific, but mentioned to make it easy to follow(copy/paste) the steps.

**Step#1: Configure DataSources in JBoss AS. **
**
**

    
    
    <datasource jta="true" jndi-name="java:jboss/datasources/BroadleafDS" pool-name="BroadleafDS_Pool" enabled="true" use-java-context="true" use-ccm="true">
     <connection-url>jdbc:mysql://localhost:3306/broadleaf</connection-url>
     <driver>mysql</driver>
     <security>
      <user-name>root</user-name>
      <password>admin</password>
     </security>
     <timeout>
      <idle-timeout-minutes>0</idle-timeout-minutes>
      <query-timeout>600</query-timeout>
     </timeout>
    </datasource>
    <datasource jta="true" jndi-name="java:jboss/datasources/BroadleafSecureDS" pool-name="BroadleafSecureDS_Pool" enabled="true" use-java-context="true" use-ccm="true">
     <connection-url>jdbc:mysql://localhost:3306/broadleaf</connection-url>
     <driver>mysql</driver>
     <security>
      <user-name>root</user-name>
      <password>admin</password>
     </security>
     <timeout>
      <idle-timeout-minutes>0</idle-timeout-minutes>
      <query-timeout>600</query-timeout>
     </timeout>
    </datasource>
    <datasource jta="true" jndi-name="java:jboss/datasources/BroadleafCmsDS" pool-name="BroadleafCmsDS_Pool" enabled="true" use-java-context="true" use-ccm="true">
     <connection-url>jdbc:mysql://localhost:3306/broadleaf</connection-url>
     <driver>mysql</driver>
     <security>
      <user-name>root</user-name>
      <password>admin</password>
     </security>
     <timeout>
      <idle-timeout-minutes>0</idle-timeout-minutes>
      <query-timeout>600</query-timeout>
     </timeout>
    </datasource>



**Step#2: Update _core/src/main/resources/META-INF/persistence.xml_ as follows to use DataSources configured in JBossAS7. **


    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <persistence xmlns="http://java.sun.com/xml/ns/persistence"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
                 version="2.0">
                 
        <persistence-unit name="blPU" transaction-type="RESOURCE_LOCAL">
            <non-jta-data-source>java:jboss/datasources/BroadleafDS</non-jta-data-source>
            <exclude-unlisted-classes/>
        </persistence-unit>
        
        <persistence-unit name="blSecurePU" transaction-type="RESOURCE_LOCAL">
            <non-jta-data-source>java:jboss/datasources/BroadleafSecureDS</non-jta-data-source>
            <exclude-unlisted-classes/>
        </persistence-unit>
    
        <persistence-unit name="blCMSStorage" transaction-type="RESOURCE_LOCAL">
            <non-jta-data-source>java:jboss/datasources/BroadleafCmsDS</non-jta-data-source>
            <exclude-unlisted-classes/>
        </persistence-unit>
    </persistence>
    



**Step#3: Update site/src/main/webapp/WEB-INF/applicationContext.xml as follows: **

    
    
    <bean id="blMergedDataSources" class="org.springframework.beans.factory.config.MapFactoryBean">
     <property name="sourceMap">
      <map>
       <entry key="java:jboss/datasources/BroadleafDS" value-ref="webDS"/>
       <entry key="java:jboss/datasources/BroadleafSecureDS" value-ref="webSecureDS"/>
       <entry key="java:jboss/datasources/BroadleafCmsDS" value-ref="webStorageDS"/>
      </map>
     </property>
    </bean>
    


Now if you deploy the app you will get the following error:

ERROR Error creating bean with name 'blMergedDataSources' defined in resource loaded from byte array: Cannot resolve reference to bean 'webDS' while setting bean property 'sourceMap' with key [TypedStringValue: value [java:jboss/datasources/BroadleafDS], target type [null]]; nested exception is org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'webDS': Post-processing of the FactoryBean's object failed; nested exception is java.lang.IllegalArgumentException: warning no match for this type name: org.broadleafcommerce.profile.core.service.CustomerAddressService [Xlint:invalidAbsoluteTypeName]

** Step#4: Create _jboss-deployment-structure.xml_ in site/src/main/webapp/WEB-INF/ folder. **
**
**

    
    
    <jboss-deployment-structure xmlns="urn:jboss:deployment-structure:1.0">
       <deployment>
          <dependencies>
             <module name="org.jboss.ironjacamar.jdbcadapters" />
          </dependencies>
          <exclusions>
                <module name="org.apache.commons.logging"/>
                <module name="org.apache.log4j"/>
                <module name="org.jboss.logging"/>
                <module name="org.jboss.logmanager"/>
                <module name="org.jboss.logmanager.log4j"/>
                <module name="org.slf4j"/>
          </exclusions>
       </deployment>
    </jboss-deployment-structure>
    



Now if you try to deploy the app you will get the following error because JBossAS7 comes with Hibernate4 and application is using some hibernate3 features.

    
    
     @CollectionOfElements
     @JoinTable(name = "BLC_CATEGORY_IMAGE", joinColumns = @JoinColumn(name = "CATEGORY_ID"))
     @MapKey(columns = { @Column(name = "NAME", length = 5, nullable = false) })
     @Column(name = "URL")
     @Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region="blStandardElements")
     @BatchSize(size = 50)
     @Deprecated
     protected Map<String, String> categoryImages = new HashMap<String, String>(10);
    



org.hibernate.MappingException: Could not determine type for: java.util.Map, at table: BLC_CATEGORY, for columns: [org.hibernate.mapping.Column(URL)] 

So let us install hibernate3 module in JBossAS7 and use it.

**Step#5: Install Hibernate 3 module in JBoss AS 7. **
**
**Copy the following jars(you can get these from site.war file) into _jboss-as-7.1.1.FINAL/modules/org/hibernate/3/_ folder.

**antlr-2.7.6.jar**
** commons-collections-3.2.1.jar**
** dom4j-1.6.1.jar**
** hibernate-commons-annotations-3.2.0.Final.jar**
** hibernate-core-3.6.10.Final.jar**
** hibernate-entitymanager-3.6.10.Final.jar**
** javassist-3.16.1-GA.jar**

Create **module.xml** in _jboss-as-7.1.1.FINAL/modules/org/hibernate/3/_ folder.

    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <module xmlns="urn:jboss:module:1.0" name="org.hibernate" slot="3">
        <resources>
            <resource-root path="hibernate-core-3.6.10.Final.jar"/>  
            <resource-root path="javassist-3.16.1-GA.jar"/>
            <resource-root path="antlr-2.7.6.jar"/>  
            <resource-root path="commons-collections-3.2.1.jar"/>  
            <resource-root path="dom4j-1.6.1.jar"/>  
            <!-- Insert other Hibernate 3 jars to be used here -->
      <resource-root path="hibernate-commons-annotations-3.2.0.Final.jar"/>
      <resource-root path="hibernate-entitymanager-3.6.10.Final.jar"/>
        </resources>
        <dependencies>
            <module name="org.jboss.as.jpa.hibernate" slot="3"/>
            <module name="asm.asm"/>
            <module name="javax.api"/>
            <module name="javax.persistence.api"/>
            <module name="javax.transaction.api"/>
            <module name="javax.validation.api"/>
            <!-- <module name="org.apache.ant"/> -->
            <module name="org.infinispan" optional="true"/>
            <module name="org.javassist"/>
            <module name="org.slf4j"/>
        </dependencies>
    </module>
    



**Step#6: Tell JBoss to use hibernate 3 module. Update core/src/main/resources/META-INF/persistence.xml **

    
    
    <?xml version="1.0" encoding="UTF-8"?>
    <persistence xmlns="http://java.sun.com/xml/ns/persistence"
                 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                 xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
                 version="2.0">
     <persistence-unit name="blPU" transaction-type="RESOURCE_LOCAL">
            <non-jta-data-source>java:jboss/datasources/BroadleafDS</non-jta-data-source>
            <exclude-unlisted-classes/>
            <properties>
             <property name="jboss.as.jpa.providerModule" value="org.hibernate:3" />
             <property name="jboss.as.jpa.managed" value="false" />
            </properties>
        </persistence-unit>
        
        <persistence-unit name="blSecurePU" transaction-type="RESOURCE_LOCAL">
            <non-jta-data-source>java:jboss/datasources/BroadleafSecureDS</non-jta-data-source>
            <exclude-unlisted-classes/>
            <properties>
             <property name="jboss.as.jpa.providerModule" value="org.hibernate:3" />
             <property name="jboss.as.jpa.managed" value="false" />
            </properties>
        </persistence-unit>
    
        <persistence-unit name="blCMSStorage" transaction-type="RESOURCE_LOCAL">
            <non-jta-data-source>java:jboss/datasources/BroadleafCmsDS</non-jta-data-source>
            <exclude-unlisted-classes/>
            <properties>
             <property name="jboss.as.jpa.providerModule" value="org.hibernate:3" />
             <property name="jboss.as.jpa.managed" value="false" />
            </properties>
        </persistence-unit>
    </persistence>
    



**Enjoy :-)**
