---
title: SpringMVC3 Hibernate CRUD Sample Application
author: Siva
type: post
date: 2011-04-01T13:16:00+00:00
url: /2011/04/springmvc3-hibernate-crud-sample-application/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/04/springmvc3-hibernate-crud-sample.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2017995902396506055
post_views_count:
  - 105
categories:
  - Spring
tags:
  - Hibernate
  - Java
  - SpringMVC

---
To learn any web framework starting with a HelloWorld application is a good idea. Once we get familiarity with the framework configuration it would be better to do a CRUD(Create,Read,Update,Delete) application which covers various aspects of a web framework like Validations, Request URL Mappings, Request Parameter Binding,  
Pre-populating forms etc.

Now I am going to explain how to write a Simple CRUD application using SpringMVC3, Hibernate and MySQL.  
Our Application is ContactsManagements where you can view or search contacts, create new contacts, edit or delete existing contacts.

Step#1: Create the CONTACTS Table

<pre>CREATE TABLE  CONTACTS <br />(<br />  id int(10) unsigned NOT NULL AUTO_INCREMENT,<br />  name varchar(45) NOT NULL,<br />  address varchar(45) DEFAULT NULL,<br />  gender char(1) DEFAULT 'M',<br />  dob datetime DEFAULT NULL,<br />  email varchar(45) DEFAULT NULL,<br />  mobile varchar(15) DEFAULT NULL,<br />  phone varchar(15) DEFAULT NULL,<br />  PRIMARY KEY (id)<br />);<br /></pre>

Step#2: Copy the SpringMVC, Hibernate and their dependent jars into WEB-INF/lib folder.  
If you are using Maven you can mention the following dependencies.

<pre>&lt;dependencies><br />  &lt;dependency><br />    &lt;group>junit&lt;/groupid><br />    &lt;artifact>junit&lt;/artifactid><br />    &lt;version>4.8.1&lt;/version><br />    &lt;type>jar&lt;/type><br />    &lt;scope>compile&lt;/scope><br />   &lt;/dependency><br />   &lt;dependency><br />     &lt;group>org.springframework&lt;/groupid><br />     &lt;artifact>spring-web&lt;/artifactid><br />     &lt;version>3.0.5.RELEASE&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.springframework&lt;/groupid><br />     &lt;artifact>spring-core&lt;/artifactid><br />     &lt;version>3.0.5.RELEASE&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />     &lt;exclusions><br />      &lt;exclusion><br />       &lt;artifact>commons-logging&lt;/artifactid><br />       &lt;group>commons-logging&lt;/groupid><br />      &lt;/exclusion><br />     &lt;/exclusions><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>log4j&lt;/groupid><br />     &lt;artifact>log4j&lt;/artifactid><br />     &lt;version>1.2.14&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.springframework&lt;/groupid><br />     &lt;artifact>spring-tx&lt;/artifactid><br />     &lt;version>3.0.5.RELEASE&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>jstl&lt;/groupid><br />     &lt;artifact>jstl&lt;/artifactid><br />     &lt;version>1.1.2&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>taglibs&lt;/groupid><br />     &lt;artifact>standard&lt;/artifactid><br />     &lt;version>1.1.2&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.springframework&lt;/groupid><br />     &lt;artifact>spring-webmvc&lt;/artifactid><br />     &lt;version>3.0.5.RELEASE&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.springframework&lt;/groupid><br />     &lt;artifact>spring-aop&lt;/artifactid><br />     &lt;version>3.0.5.RELEASE&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>commons-digester&lt;/groupid><br />     &lt;artifact>commons-digester&lt;/artifactid><br />     &lt;version>2.1&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>commons-collections&lt;/groupid><br />     &lt;artifact>commons-collections&lt;/artifactid><br />     &lt;version>3.2.1&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.hibernate&lt;/groupid><br />     &lt;artifact>hibernate-core&lt;/artifactid><br />     &lt;version>3.3.2.GA&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>javax.persistence&lt;/groupid><br />     &lt;artifact>persistence-api&lt;/artifactid><br />     &lt;version>1.0&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>c3p0&lt;/groupid><br />     &lt;artifact>c3p0&lt;/artifactid><br />     &lt;version>0.9.1.2&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.springframework&lt;/groupid><br />     &lt;artifact>spring-orm&lt;/artifactid><br />     &lt;version>3.0.5.RELEASE&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.slf4j&lt;/groupid><br />     &lt;artifact>slf4j-api&lt;/artifactid><br />     &lt;version>1.6.1&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.slf4j&lt;/groupid><br />     &lt;artifact>slf4j-log4j12&lt;/artifactid><br />     &lt;version>1.6.1&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>cglib&lt;/groupid><br />     &lt;artifact>cglib-nodep&lt;/artifactid><br />     &lt;version>2.2&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>org.hibernate&lt;/groupid><br />     &lt;artifact>hibernate-annotations&lt;/artifactid><br />     &lt;version>3.4.0.GA&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>jboss&lt;/groupid><br />     &lt;artifact>javassist&lt;/artifactid><br />     &lt;version>3.7.ga&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />    &lt;dependency><br />     &lt;group>mysql&lt;/groupid><br />     &lt;artifact>mysql-connector-java&lt;/artifactid><br />     &lt;version>5.1.14&lt;/version><br />     &lt;type>jar&lt;/type><br />     &lt;scope>compile&lt;/scope><br />    &lt;/dependency><br />  &lt;/dependencies><br /></pre>

Step#3: Configure SpringMVC

a) Configure DispatcherServlet in web.xml

<pre>&lt;servlet><br />  &lt;servlet-name>dispatcher&lt;/servlet-name><br />  &lt;servlet->org.springframework.web.servlet.DispatcherServlet&lt;/servlet-class><br />  &lt;load-on-startup>1&lt;/load-on-startup><br /> &lt;/servlet><br /> <br /> &lt;servlet-mapping><br />  &lt;servlet-name>dispatcher&lt;/servlet-name><br />  &lt;url-pattern>*.do&lt;/url-pattern><br /> &lt;/servlet-mapping><br /><br /> &lt;listener><br />  &lt;listener->org.springframework.web.context.ContextLoaderListener&lt;/listener-class><br /> &lt;/listener><br /> &lt;context-param><br />     

<param-name />
contextConfigLocation&lt;/param-name>

<param-value />
classpath:applicationContext.xml&lt;/param-value>&lt;/context-param>
<br />  </pre>

b) Configure View Resolver in WEB-INF/dispatcher-servlet.xml

<pre>&lt;bean p:prefix="/jsp/" p:suffix=".jsp"><br /> &lt;/bean><br /> </pre>

c) Configure Annotation support, PropertyPlaceHolderConfigurer, ResourceBundleMessageSource in WEB-INF/classes/applicationContext.xml 

<pre>&lt;context:annotation-config>&lt;/context:annotation-config><br /> <br /> &lt;context:component-scan base-package="com.sivalabs">&lt;/context:component-scan><br /> <br /> &lt;mvc:annotation-driven> &lt;/mvc:annotation-driven> <br /> <br /> &lt;context:property-placeholder location="classpath:config.properties">&lt;/context:property-placeholder><br /> <br />    &lt;bean p:basename="Messages"><br /> &lt;/bean><br /></pre>

Step#4: Configure JDBC connection parameters and Hibernate properties in config.properties

<pre>################### JDBC Configuration ##########################<br />jdbc.driverClassName=com.mysql.jdbc.Driver<br />jdbc.url=jdbc:mysql://localhost:3306/sivalabs<br />jdbc.username=root<br />jdbc.password=admin<br /><br />################### Hibernate Configuration ##########################<br />hibernate.dialect=org.hibernate.dialect.MySQLDialect<br />hibernate.show_sql=true<br />#hibernate.hbm2ddl.auto=update<br />hibernate.generate_statistics=true<br /></pre>

Step#5: Configure DataSource, SessionFactory, TransactionManagement support in WEB-INF/classes/applicationContext.xml 

<pre>&lt;bean p:driverclassname="${jdbc.driverClassName}" p:password="${jdbc.password}" p:url="${jdbc.url}" p:username="${jdbc.username}"><br /> &lt;/bean>  <br /> <br /> &lt;bean><br />     &lt;property name="dataSource" ref="dataSource">&lt;/property><br />     &lt;property name="hibernateProperties"><br />       &lt;props>        <br />             &lt;prop key="hibernate.dialect">${hibernate.dialect}&lt;/prop>          <br />             &lt;prop key="hibernate.show_sql">${hibernate.show_sql}&lt;/prop><br />        &lt;/props><br />     &lt;/property><br />  &lt;property name="packagesToScan" value="com.sivalabs">&lt;/property><br /> &lt;/bean><br />  <br />  <br />    &lt;bean p:sessionfactory-ref="sessionFactory"><br /> &lt;/bean><br /> <br /> &lt;tx:annotation-driven transaction-manager="transactionManager">&lt;/tx:annotation-driven><br />    </pre>

Step#6: Configure the Labels, error messages in WEB-INF/classes/Messages.properties

<pre>App.Title=SivaLabs<br />typeMismatch.java.util.Date={0} is Invalid Date.<br />dob=DOB<br /></pre>

Step#7: Create the Entity class Contact.java

<pre>package com.sivalabs.contacts;<br /><br />import java.util.Date;<br /><br />import javax.persistence.Column;<br />import javax.persistence.Entity;<br />import javax.persistence.GeneratedValue;<br />import javax.persistence.GenerationType;<br />import javax.persistence.Id;<br />import javax.persistence.Table;<br /><br />import org.apache.commons.lang.builder.ToStringBuilder;<br /><br />@Entity<br />@Table(name="CONTACTS")<br />public class Contact<br />{<br /> @Id<br /> @GeneratedValue(strategy = GenerationType.AUTO)<br /> private int id;<br /> @Column private String name;<br /> @Column private String address; <br /> @Column private String gender; <br /> @Column private Date dob; <br /> @Column private String email;<br /> @Column private String mobile; <br /> @Column private String phone;<br /> <br /> @Override<br /> public String toString()<br /> {<br />  return ToStringBuilder.reflectionToString(this);<br /> }<br /> //setters & getters <br />}<br /></pre>

Step#8: Create the ContactsDAO.java which performs CRUD operations on CONTACTS table.

<pre>package com.sivalabs.contacts;<br /><br />import java.util.List;<br /><br />import org.hibernate.Criteria;<br />import org.hibernate.SessionFactory;<br />import org.hibernate.criterion.Restrictions;<br />import org.springframework.beans.factory.annotation.Autowired;<br />import org.springframework.stereotype.Repository;<br />import org.springframework.transaction.annotation.Transactional;<br /><br />@Repository<br />@Transactional<br />public class ContactsDAO<br />{<br /> @Autowired<br /> private SessionFactory sessionFactory;<br /> <br /> public Contact getById(int id)<br /> {<br />  return (Contact) sessionFactory.getCurrentSession().get(Contact.class, id);<br /> }<br /> <br /> @SuppressWarnings("unchecked")<br /> public List&lt;Contact&gt; searchContacts(String name)<br /> {<br />  Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Contact.class);<br />  criteria.add(Restrictions.ilike("name", name+"%"));<br />  return criteria.list();<br /> }<br /> <br /> @SuppressWarnings("unchecked")<br /> public List&lt;Contact&gt; getAllContacts()<br /> {<br />  Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Contact.class);<br />  return criteria.list();<br /> }<br /> <br /> public int save(Contact contact)<br /> {<br />  return (Integer) sessionFactory.getCurrentSession().save(contact);<br /> }<br /> <br /> public void update(Contact contact)<br /> {<br />  sessionFactory.getCurrentSession().merge(contact);<br /> }<br /> <br /> public void delete(int id)<br /> {<br />  Contact c = getById(id);<br />  sessionFactory.getCurrentSession().delete(c);<br /> }<br />}<br /></pre>

Step#9: Create ContactFormValidator.java which performs the validations on saving/updating a contact.

<pre>package com.sivalabs.contacts;<br /><br />import org.springframework.stereotype.Component;<br />import org.springframework.validation.Errors;<br />import org.springframework.validation.ValidationUtils;<br />import org.springframework.validation.Validator;<br /><br />@Component("contactFormValidator")<br />public class ContactFormValidator implements Validator<br />{<br /> @SuppressWarnings("unchecked")<br /> @Override<br /> public boolean supports(Class clazz)<br /> {<br />  return Contact.class.isAssignableFrom(clazz);<br /> }<br /><br /> @Override<br /> public void validate(Object model, Errors errors)<br /> {<br />  ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name","required.name", "Name is required.");<br /> }<br />}<br /></pre>

Step#10: Create ContactsControllers.java which processes all the CRUD requests.

<pre>package com.sivalabs.contacts;<br /><br />import java.text.SimpleDateFormat;<br />import java.util.Date;<br />import java.util.List;<br /><br />import org.springframework.beans.factory.annotation.Autowired;<br />import org.springframework.beans.propertyeditors.CustomDateEditor;<br />import org.springframework.stereotype.Controller;<br />import org.springframework.validation.BindingResult;<br />import org.springframework.web.bind.WebDataBinder;<br />import org.springframework.web.bind.annotation.InitBinder;<br />import org.springframework.web.bind.annotation.ModelAttribute;<br />import org.springframework.web.bind.annotation.RequestMapping;<br />import org.springframework.web.bind.annotation.RequestMethod;<br />import org.springframework.web.bind.annotation.RequestParam;<br />import org.springframework.web.bind.support.SessionStatus;<br />import org.springframework.web.servlet.ModelAndView;<br /><br />@Controller<br />public class ContactsControllers<br />{<br /> @Autowired<br /> private ContactsDAO contactsDAO;<br /> <br /> @Autowired<br /> private ContactFormValidator validator;<br />  <br /> @InitBinder<br /> public void initBinder(WebDataBinder binder) <br /> {<br />  SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");<br />  dateFormat.setLenient(false);<br />  binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));<br /> }<br />  <br /> @RequestMapping("/searchContacts")<br /> public ModelAndView searchContacts(@RequestParam(required= false, defaultValue="") String name)<br /> {<br />  ModelAndView mav = new ModelAndView("showContacts");<br />  List&lt;Contact&gt; contacts = contactsDAO.searchContacts(name.trim());<br />  mav.addObject("SEARCH_CONTACTS_RESULTS_KEY", contacts);<br />  return mav;<br /> }<br /> <br /> @RequestMapping("/viewAllContacts")<br /> public ModelAndView getAllContacts()<br /> {<br />  ModelAndView mav = new ModelAndView("showContacts");<br />  List&lt;Contact&gt; contacts = contactsDAO.getAllContacts();<br />  mav.addObject("SEARCH_CONTACTS_RESULTS_KEY", contacts);<br />  return mav;<br /> }<br /> <br /> @RequestMapping(value="/saveContact", method=RequestMethod.GET)<br /> public ModelAndView newuserForm()<br /> {<br />  ModelAndView mav = new ModelAndView("newContact");<br />  Contact contact = new Contact();<br />  mav.getModelMap().put("newContact", contact);<br />  return mav;<br /> }<br /> <br /> @RequestMapping(value="/saveContact", method=RequestMethod.POST)<br /> public String create(@ModelAttribute("newContact")Contact contact, BindingResult result, SessionStatus status)<br /> {<br />  validator.validate(contact, result);<br />  if (result.hasErrors()) <br />  {    <br />   return "newContact";<br />  }<br />  contactsDAO.save(contact);<br />  status.setComplete();<br />  return "redirect:viewAllContacts.do";<br /> }<br /> <br /> @RequestMapping(value="/updateContact", method=RequestMethod.GET)<br /> public ModelAndView edit(@RequestParam("id")Integer id)<br /> {<br />  ModelAndView mav = new ModelAndView("editContact");<br />  Contact contact = contactsDAO.getById(id);<br />  mav.addObject("editContact", contact);<br />  return mav;<br /> }<br /> <br /> @RequestMapping(value="/updateContact", method=RequestMethod.POST)<br /> public String update(@ModelAttribute("editContact") Contact contact, BindingResult result, SessionStatus status)<br /> {<br />  validator.validate(contact, result);<br />  if (result.hasErrors()) {<br />   return "editContact";<br />  }<br />  contactsDAO.update(contact);<br />  status.setComplete();<br />  return "redirect:viewAllContacts.do";<br /> }<br />  <br /> @RequestMapping("deleteContact")<br /> public ModelAndView delete(@RequestParam("id")Integer id)<br /> {<br />  ModelAndView mav = new ModelAndView("redirect:viewAllContacts.do");<br />  contactsDAO.delete(id);<br />  return mav;<br /> } <br />}<br /></pre>

Step#11: Instead of writing the JSTL tag library declerations in all the JSPs, declare them in one JSP and include that JSP in other JSPs.  
taglib_includes.jsp

<pre>&lt;%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%&gt;<br />&lt;%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%&gt;<br /><br />&lt;%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%&gt;<br />&lt;%@taglib uri="http://www.springframework.org/tags" prefix="spring"%&gt;<br /></pre>

Step#12: Create the JSPs.

a)showContacts.jsp

<pre>&lt;%@include file="taglib_includes.jsp" %&gt;<br /><br />&lt;html&gt;<br />&lt;head&gt;<br /><br />&lt;title&gt;&lt;spring:message code="App.Title">&lt;/spring:message> &lt;/title&gt;<br /><br />&lt;/head&gt;<br />&lt;body style="font-family: Arial; font-size:smaller;"&gt;<br /> 

<center>
  <br /> 
  
  <table  class=" table table-hover" border="0" bordercolor="#006699" style="border-collapse: collapse; width: 500px;">
    <br />
    
    <tr>
      <td>
        Enter Contact Name
      </td>      
      
      <td>
        <br /><br />&nbsp;&nbsp;<br /><br />&nbsp;&nbsp;
      </td>
    </tr>
    
    <br />
  </table>
  
  <table  class=" table table-hover" border="1" bordercolor="#006699" style="border-collapse: collapse; width: 500px;">
    <br />
    
    <tr bgcolor="lightblue">
      <th>
        Id
      </th>    
      
      <th>
        Name
      </th>       
      
      <th>
        Address
      </th>     
      
      <th>
        Mobile
      </th>    
      
      <th>
        
      </th>   
    </tr>
    
    <br />&lt;c:if test="${empty SEARCH_CONTACTS_RESULTS_KEY}"> &lt;/c:if><br />
    
    <tr>
      <td colspan="4">
        No Results found
      </td>   
    </tr>
    
    <br />&lt;c:if test="${! empty SEARCH_CONTACTS_RESULTS_KEY}">    &lt;c:foreach items="${SEARCH_CONTACTS_RESULTS_KEY}" var="contact"> &lt;/c:foreach>&lt;/c:if><br />
    
    <tr>
      <td>
        &lt;c:out value="${contact.id}">&lt;/c:out>
      </td>     
      
      <td>
        &lt;c:out value="${contact.name}">&lt;/c:out>
      </td>     
      
      <td>
        &lt;c:out value="${contact.address}">&lt;/c:out> 
      </td>     
      
      <td>
        &lt;c:out value="${contact.mobile}">&lt;/c:out>
      </td>     
      
      <td>
        <br /><br />&nbsp;<a href="http://www.blogger.com/updateContact.do?id=$%7Bcontact.id%7D">Edit</a><br /><br />&nbsp;&nbsp;<a href="javascript:deleteContact('deleteContact.do?id=$%7Bcontact.id%7D');">Delete</a>
      </td>    
    </tr>
    
    <br />
  </table>
</center>

<br />  <br />&lt;/body&gt;<br />&lt;/html&gt;<br /></pre>

b)newContact.jsp

<pre><%@include file="taglib_includes.jsp" %><br /><br /><html><br /><head><br /> <br /> <title><spring:message code="App.Title"></spring:message> </title><br /></head><br /><body style="font-family: Arial; font-size:smaller;"><br /><br />

<table  class=" table table-hover" align="center" bgcolor="lightblue" border="1" bordercolor="#006699" height="500" style="border-collapse: collapse; width: 750px;">
  <br />
  
  <tr>
    <td align="center">
      <h3>
        Edit Contact Form
      </h3>
    </td>  
  </tr>
  
  <br />
  
  <tr align="center" valign="top">
    <td align="center">
      <br /><br />
      
      <form:form action="saveContact.do" commandname="newContact" method="post">
        </form:form>
        
        <table  class=" table table-hover" border="0" bordercolor="#006699" cellpadding="2" cellspacing="2" style="border-collapse: collapse; width: 500px;">
          <br />
          
          <tr>
            <td align="right" width="100">
              Name
            </td>       
            
            <td width="150">
              <br /><br />
              
              <form:input path="name">
                </form:input></td>       
                
                <td align="left">
                  <br /><br />
                  
                  <form:errors cssstyle="color:red" path="name">
                    </form:errors></td>      </tr><br />
                    
                    <tr>
                      <td align="right" width="100">
                        DOB
                      </td>       
                      
                      <td>
                        <form:input path="dob">
                          </form:input></td>       
                          
                          <td align="left">
                            <form:errors cssstyle="color:red" path="dob">
                              </form:errors></td>      </tr><br />
                              
                              <tr>
                                <td align="right" width="100">
                                  Gender
                                </td>       
                                
                                <td>
                                  <br /><br />
                                  
                                  <form:select path="gender">
                                    <form:option label="Male" value="M">
                                      <form:option label="Female" value="F">
                                        </form:option></form:option></form:select></td>       
                                        
                                        <td>
                                          
                                        </td>            </tr>
                                        
                                        <br />
                                        
                                        <tr>
                                          <td align="right" width="100">
                                            Address
                                          </td>       
                                          
                                          <td>
                                            <form:input path="address">
                                              </form:input></td>       
                                              
                                              <td align="left">
                                                <br /><br />
                                                
                                                <form:errors cssstyle="color:red" path="address">
                                                  </form:errors></td>      </tr><br />
                                                  
                                                  <tr>
                                                    <td align="right" width="100">
                                                      Email
                                                    </td>       
                                                    
                                                    <td>
                                                      <form:input path="email">
                                                        </form:input></td>       
                                                        
                                                        <td align="left">
                                                          <form:errors cssstyle="color:red" path="email">
                                                            </form:errors></td>      </tr><br />
                                                            
                                                            <tr>
                                                              <td align="right" width="100">
                                                                Mobile
                                                              </td>       
                                                              
                                                              <td>
                                                                <form:input path="mobile">
                                                                  </form:input></td>       
                                                                  
                                                                  <td align="left">
                                                                    <br /><br />
                                                                    
                                                                    <form:errors cssstyle="color:red" path="mobile">
                                                                      </form:errors></td>      </tr><br />
                                                                      
                                                                      <tr>
                                                                        <td align="center" colspan="3">
                                                                          <br /><br /><br /><br />&nbsp;<br /><br /><br /><br />&nbsp;<br /><br />
                                                                        </td>      
                                                                      </tr>
                                                                      
                                                                      <br /></tbody></table></td>       </tr><br /></tbody></table></body><br /></html><br /></pre>
                                                                      
                                                                      
                                                                      <p>
                                                                        a)editContact.jsp
                                                                      </p>
                                                                      
                                                                      
                                                                      <pre><%@include file="taglib_includes.jsp" %><br /><br /><html><br /><head><br /> <br /> <title><spring:message code="App.Title"></spring:message> </title><br /></head><br /><body style="font-family: Arial; font-size:smaller;"><br /><br />

<table  class=" table table-hover" align="center" bgcolor="lightblue" border="1" bordercolor="#006699" height="500" style="border-collapse: collapse; width: 750px;">
  <br />
  
  <tr>
    <td align="center">
      <h3>
        Edit Contact Form
      </h3>
    </td>  
  </tr>
  
  <br />
  
  <tr align="center" valign="top">
    <td align="center">
      <br /><br />
      
      <form:form action="updateContact.do" commandname="editContact" method="post">
        </form:form>
        
        <table  class=" table table-hover" border="0" bordercolor="#006699" cellpadding="2" cellspacing="2" style="border-collapse: collapse; width: 500px;">
          <br />
          
          <tr>
            <td align="right" width="100">
              Id
            </td>       
            
            <td width="150">
              <br /><br />
              
              <form:input path="id" readonly="true">
                </form:input></td>       
                
                <td align="left">
                  <br /><br />
                  
                  <form:errors cssstyle="color:red" path="id">
                    </form:errors></td>      </tr><br />
                    
                    <tr>
                      <td align="right" width="100">
                        Name
                      </td>       
                      
                      <td>
                        <br /><br />
                        
                        <form:input path="name">
                          </form:input></td>       
                          
                          <td align="left">
                            <br /><br />
                            
                            <form:errors cssstyle="color:red" path="name">
                              </form:errors></td>      </tr><br />
                              
                              <tr>
                                <td align="right" width="100">
                                  DOB
                                </td>       
                                
                                <td>
                                  <form:input path="dob">
                                    </form:input></td>       
                                    
                                    <td align="left">
                                      <form:errors cssstyle="color:red" path="dob">
                                        </form:errors></td>      </tr><br />
                                        
                                        <tr>
                                          <td align="right" width="100">
                                            Gender
                                          </td>       
                                          
                                          <td>
                                            <br /><br />
                                            
                                            <form:select path="gender">
                                              <form:option label="Male" value="M">
                                                <form:option label="Female" value="F">
                                                  </form:option></form:option></form:select></td>       
                                                  
                                                  <td>
                                                    
                                                  </td>            </tr>
                                                  
                                                  <br />
                                                  
                                                  <tr>
                                                    <td align="right" width="100">
                                                      Address
                                                    </td>       
                                                    
                                                    <td>
                                                      <form:input path="address">
                                                        </form:input></td>       
                                                        
                                                        <td align="left">
                                                          <br /><br />
                                                          
                                                          <form:errors cssstyle="color:red" path="address">
                                                            </form:errors></td>      </tr><br />
                                                            
                                                            <tr>
                                                              <td align="right" width="100">
                                                                Email
                                                              </td>       
                                                              
                                                              <td>
                                                                <form:input path="email">
                                                                  </form:input></td>       
                                                                  
                                                                  <td align="left">
                                                                    <form:errors cssstyle="color:red" path="email">
                                                                      </form:errors></td>      </tr><br />
                                                                      
                                                                      <tr>
                                                                        <td align="right" width="100">
                                                                          Mobile
                                                                        </td>       
                                                                        
                                                                        <td>
                                                                          <form:input path="mobile">
                                                                            </form:input></td>       
                                                                            
                                                                            <td align="left">
                                                                              <br /><br />
                                                                              
                                                                              <form:errors cssstyle="color:red" path="mobile">
                                                                                </form:errors></td>      </tr><br />
                                                                                
                                                                                <tr valign="bottom">
                                                                                  <td align="center" colspan="3">
                                                                                    <br /><br /><br /><br />&nbsp;<br /><br />      <br /><br />&nbsp;<br /><br />
                                                                                  </td>      
                                                                                </tr>
                                                                                
                                                                                <br /></tbody></table></td>       </tr><br /></tbody></table></body><br /></html><br /></pre>
                                                                                
                                                                                
                                                                                <p>
                                                                                  Step#13: Write the javascript file js/contacts.js containing the utility methods
                                                                                </p>
                                                                                
                                                                                
                                                                                <pre>function go(url)<br />{<br /> window.location = url;<br />}<br /><br />function deleteContact(url)<br />{<br /> var isOK = confirm("Are you sure to delete?");<br /> if(isOK)<br /> {<br />  go(url);<br /> }<br />}<br /></pre>
                                                                                
                                                                                
                                                                                <p>
                                                                                  Step#14: The welcome file index.jsp
                                                                                </p>
                                                                                
                                                                                
                                                                                <pre>&lt;%<br />response.sendRedirect("viewAllContacts.do");<br />%&gt;<br /></pre>
                                                                                
                                                                                
                                                                                <p>
                                                                                  Step#15: Start the server and point your browser URL to http://localhost:8080/SpringMVCHibernate
                                                                                </p>
                                                                                
                                                                                
                                                                                <p>
                                                                                  You can download the source code at<br /><a href="https://sites.google.com/site/sivalabworks/sampleappdownloads/SpringMVCHibernate.zip?attredirects=0&d=1">SpringMVCHibernate.zip</a>
                                                                                </p>