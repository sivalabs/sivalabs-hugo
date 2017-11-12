---
title: Deploying BroadleafCommerce 2.0 on JBoss AS 7
author: Siva
type: post
date: 2013-05-27T11:40:00+00:00
url: /2013/05/deploying-broadleafcommerce-20-on-jboss/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2013/05/deploying-broadleafcommerce-20-on-jboss.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/5309777057913787515
post_views_count:
  - 12
categories:
  - Spring
tags:
  - JBoss
  - Spring

---
First 2 steps are not really related to Broadleaf specific, but mentioned to make it easy to follow(copy/paste) the steps.

**Step#1: Configure DataSources in JBoss AS. **
  
**
  
**

<pre class="brush: xml">&lt;datasource jta="true" jndi-name="java:jboss/datasources/BroadleafDS" pool-name="BroadleafDS_Pool" enabled="true" use-java-context="true" use-ccm="true"&gt;
 &lt;connection-url&gt;jdbc:mysql://localhost:3306/broadleaf&lt;/connection-url&gt;
 &lt;driver&gt;mysql&lt;/driver&gt;
 &lt;security&gt;
  &lt;user-name&gt;root&lt;/user-name&gt;
  &lt;password&gt;admin&lt;/password&gt;
 &lt;/security&gt;
 &lt;timeout&gt;
  &lt;idle-timeout-minutes&gt;0&lt;/idle-timeout-minutes&gt;
  &lt;query-timeout&gt;600&lt;/query-timeout&gt;
 &lt;/timeout&gt;
&lt;/datasource&gt;
&lt;datasource jta="true" jndi-name="java:jboss/datasources/BroadleafSecureDS" pool-name="BroadleafSecureDS_Pool" enabled="true" use-java-context="true" use-ccm="true"&gt;
 &lt;connection-url&gt;jdbc:mysql://localhost:3306/broadleaf&lt;/connection-url&gt;
 &lt;driver&gt;mysql&lt;/driver&gt;
 &lt;security&gt;
  &lt;user-name&gt;root&lt;/user-name&gt;
  &lt;password&gt;admin&lt;/password&gt;
 &lt;/security&gt;
 &lt;timeout&gt;
  &lt;idle-timeout-minutes&gt;0&lt;/idle-timeout-minutes&gt;
  &lt;query-timeout&gt;600&lt;/query-timeout&gt;
 &lt;/timeout&gt;
&lt;/datasource&gt;
&lt;datasource jta="true" jndi-name="java:jboss/datasources/BroadleafCmsDS" pool-name="BroadleafCmsDS_Pool" enabled="true" use-java-context="true" use-ccm="true"&gt;
 &lt;connection-url&gt;jdbc:mysql://localhost:3306/broadleaf&lt;/connection-url&gt;
 &lt;driver&gt;mysql&lt;/driver&gt;
 &lt;security&gt;
  &lt;user-name&gt;root&lt;/user-name&gt;
  &lt;password&gt;admin&lt;/password&gt;
 &lt;/security&gt;
 &lt;timeout&gt;
  &lt;idle-timeout-minutes&gt;0&lt;/idle-timeout-minutes&gt;
  &lt;query-timeout&gt;600&lt;/query-timeout&gt;
 &lt;/timeout&gt;
&lt;/datasource&gt;</pre>

**Step#2: Update _core/src/main/resources/META-INF/persistence.xml_ as follows to use DataSources configured in JBossAS7. **

<pre class="brush: xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;persistence xmlns="http://java.sun.com/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
             version="2.0"&gt;
             
    &lt;persistence-unit name="blPU" transaction-type="RESOURCE_LOCAL"&gt;
        &lt;non-jta-data-source&gt;java:jboss/datasources/BroadleafDS&lt;/non-jta-data-source&gt;
        &lt;exclude-unlisted-classes/&gt;
    &lt;/persistence-unit&gt;
    
    &lt;persistence-unit name="blSecurePU" transaction-type="RESOURCE_LOCAL"&gt;
        &lt;non-jta-data-source&gt;java:jboss/datasources/BroadleafSecureDS&lt;/non-jta-data-source&gt;
        &lt;exclude-unlisted-classes/&gt;
    &lt;/persistence-unit&gt;

    &lt;persistence-unit name="blCMSStorage" transaction-type="RESOURCE_LOCAL"&gt;
        &lt;non-jta-data-source&gt;java:jboss/datasources/BroadleafCmsDS&lt;/non-jta-data-source&gt;
        &lt;exclude-unlisted-classes/&gt;
    &lt;/persistence-unit&gt;
&lt;/persistence&gt;
</pre>

**Step#3: Update site/src/main/webapp/WEB-INF/applicationContext.xml as follows: **

<pre class="brush: xml">&lt;bean id="blMergedDataSources" class="org.springframework.beans.factory.config.MapFactoryBean"&gt;
 &lt;property name="sourceMap"&gt;
  &lt;map&gt;
   &lt;entry key="java:jboss/datasources/BroadleafDS" value-ref="webDS"/&gt;
   &lt;entry key="java:jboss/datasources/BroadleafSecureDS" value-ref="webSecureDS"/&gt;
   &lt;entry key="java:jboss/datasources/BroadleafCmsDS" value-ref="webStorageDS"/&gt;
  &lt;/map&gt;
 &lt;/property&gt;
&lt;/bean&gt;
</pre>

Now if you deploy the app you will get the following error:

ERROR Error creating bean with name &#8216;blMergedDataSources&#8217; defined in resource loaded from byte array: Cannot resolve reference to bean &#8216;webDS&#8217; while setting bean property &#8216;sourceMap&#8217; with key [TypedStringValue: value [java:jboss/datasources/BroadleafDS], target type [null]]; nested exception is org.springframework.beans.factory.BeanCreationException: <span style="color: red;">Error creating bean with name &#8216;webDS&#8217;: Post-processing of the FactoryBean&#8217;s object failed; nested exception is java.lang.IllegalArgumentException: warning no match for this type name: org.broadleafcommerce.profile.core.service.CustomerAddressService [Xlint:invalidAbsoluteTypeName]</span>

** Step#4: Create _jboss-deployment-structure.xml_ in site/src/main/webapp/WEB-INF/ folder. **
  
**
  
**

<pre class="brush: xml">&lt;jboss-deployment-structure xmlns="urn:jboss:deployment-structure:1.0"&gt;
   &lt;deployment&gt;
      &lt;dependencies&gt;
         &lt;module name="org.jboss.ironjacamar.jdbcadapters" /&gt;
      &lt;/dependencies&gt;
      &lt;exclusions&gt;
            &lt;module name="org.apache.commons.logging"/&gt;
            &lt;module name="org.apache.log4j"/&gt;
            &lt;module name="org.jboss.logging"/&gt;
            &lt;module name="org.jboss.logmanager"/&gt;
            &lt;module name="org.jboss.logmanager.log4j"/&gt;
            &lt;module name="org.slf4j"/&gt;
      &lt;/exclusions&gt;
   &lt;/deployment&gt;
&lt;/jboss-deployment-structure&gt;
</pre>

Now if you try to deploy the app you will get the following error because JBossAS7 comes with Hibernate4 and application is using some hibernate3 features.

<pre class="brush: java">@CollectionOfElements
 @JoinTable(name = "BLC_CATEGORY_IMAGE", joinColumns = @JoinColumn(name = "CATEGORY_ID"))
 @MapKey(columns = { @Column(name = "NAME", length = 5, nullable = false) })
 @Column(name = "URL")
 @Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region="blStandardElements")
 @BatchSize(size = 50)
 @Deprecated
 protected Map&lt;String, String&gt; categoryImages = new HashMap&lt;String, String&gt;(10);
</pre>

<span style="color: red;">org.hibernate.MappingException: Could not determine type for: java.util.Map, at table: BLC_CATEGORY, for columns: [org.hibernate.mapping.Column(URL)] </span>

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

<pre class="brush: xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;module xmlns="urn:jboss:module:1.0" name="org.hibernate" slot="3"&gt;
    &lt;resources&gt;
        &lt;resource-root path="hibernate-core-3.6.10.Final.jar"/&gt;  
        &lt;resource-root path="javassist-3.16.1-GA.jar"/&gt;
        &lt;resource-root path="antlr-2.7.6.jar"/&gt;  
        &lt;resource-root path="commons-collections-3.2.1.jar"/&gt;  
        &lt;resource-root path="dom4j-1.6.1.jar"/&gt;  
        &lt;!-- Insert other Hibernate 3 jars to be used here --&gt;
  &lt;resource-root path="hibernate-commons-annotations-3.2.0.Final.jar"/&gt;
  &lt;resource-root path="hibernate-entitymanager-3.6.10.Final.jar"/&gt;
    &lt;/resources&gt;
    &lt;dependencies&gt;
        &lt;module name="org.jboss.as.jpa.hibernate" slot="3"/&gt;
        &lt;module name="asm.asm"/&gt;
        &lt;module name="javax.api"/&gt;
        &lt;module name="javax.persistence.api"/&gt;
        &lt;module name="javax.transaction.api"/&gt;
        &lt;module name="javax.validation.api"/&gt;
        &lt;!-- &lt;module name="org.apache.ant"/&gt; --&gt;
        &lt;module name="org.infinispan" optional="true"/&gt;
        &lt;module name="org.javassist"/&gt;
        &lt;module name="org.slf4j"/&gt;
    &lt;/dependencies&gt;
&lt;/module&gt;
</pre>

**Step#6: Tell JBoss to use hibernate 3 module. Update core/src/main/resources/META-INF/persistence.xml **

<pre class="brush: xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;persistence xmlns="http://java.sun.com/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://java.sun.com/xml/ns/persistence http://java.sun.com/xml/ns/persistence/persistence_2_0.xsd"
             version="2.0"&gt;
 &lt;persistence-unit name="blPU" transaction-type="RESOURCE_LOCAL"&gt;
        &lt;non-jta-data-source&gt;java:jboss/datasources/BroadleafDS&lt;/non-jta-data-source&gt;
        &lt;exclude-unlisted-classes/&gt;
        &lt;properties&gt;
         &lt;property name="jboss.as.jpa.providerModule" value="org.hibernate:3" /&gt;
         &lt;property name="jboss.as.jpa.managed" value="false" /&gt;
        &lt;/properties&gt;
    &lt;/persistence-unit&gt;
    
    &lt;persistence-unit name="blSecurePU" transaction-type="RESOURCE_LOCAL"&gt;
        &lt;non-jta-data-source&gt;java:jboss/datasources/BroadleafSecureDS&lt;/non-jta-data-source&gt;
        &lt;exclude-unlisted-classes/&gt;
        &lt;properties&gt;
         &lt;property name="jboss.as.jpa.providerModule" value="org.hibernate:3" /&gt;
         &lt;property name="jboss.as.jpa.managed" value="false" /&gt;
        &lt;/properties&gt;
    &lt;/persistence-unit&gt;

    &lt;persistence-unit name="blCMSStorage" transaction-type="RESOURCE_LOCAL"&gt;
        &lt;non-jta-data-source&gt;java:jboss/datasources/BroadleafCmsDS&lt;/non-jta-data-source&gt;
        &lt;exclude-unlisted-classes/&gt;
        &lt;properties&gt;
         &lt;property name="jboss.as.jpa.providerModule" value="org.hibernate:3" /&gt;
         &lt;property name="jboss.as.jpa.managed" value="false" /&gt;
        &lt;/properties&gt;
    &lt;/persistence-unit&gt;
&lt;/persistence&gt;
</pre>

**Enjoy 🙂**