---
author: siva
comments: true
date: 2011-04-01 18:46:00+00:00
layout: post
slug: springmvc3-hibernate-crud-sample-application
title: SpringMVC3 Hibernate CRUD Sample Application
wordpress_id: 274
categories:
- Hibernate
- Java
- SpringMVC
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
  

    
    CREATE TABLE  CONTACTS <br></br>(<br></br>  id int(10) unsigned NOT NULL AUTO_INCREMENT,<br></br>  name varchar(45) NOT NULL,<br></br>  address varchar(45) DEFAULT NULL,<br></br>  gender char(1) DEFAULT 'M',<br></br>  dob datetime DEFAULT NULL,<br></br>  email varchar(45) DEFAULT NULL,<br></br>  mobile varchar(15) DEFAULT NULL,<br></br>  phone varchar(15) DEFAULT NULL,<br></br>  PRIMARY KEY (id)<br></br>);<br></br>

  
Step#2: Copy the SpringMVC, Hibernate and their dependent jars into WEB-INF/lib folder.  
If you are using Maven you can mention the following dependencies.  
  

    
    <dependencies><br></br>  <dependency><br></br>    <group>junit</groupid><br></br>    <artifact>junit</artifactid><br></br>    <version>4.8.1</version><br></br>    <type>jar</type><br></br>    <scope>compile</scope><br></br>   </dependency><br></br>   <dependency><br></br>     <group>org.springframework</groupid><br></br>     <artifact>spring-web</artifactid><br></br>     <version>3.0.5.RELEASE</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.springframework</groupid><br></br>     <artifact>spring-core</artifactid><br></br>     <version>3.0.5.RELEASE</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>     <exclusions><br></br>      <exclusion><br></br>       <artifact>commons-logging</artifactid><br></br>       <group>commons-logging</groupid><br></br>      </exclusion><br></br>     </exclusions><br></br>    </dependency><br></br>    <dependency><br></br>     <group>log4j</groupid><br></br>     <artifact>log4j</artifactid><br></br>     <version>1.2.14</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.springframework</groupid><br></br>     <artifact>spring-tx</artifactid><br></br>     <version>3.0.5.RELEASE</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>jstl</groupid><br></br>     <artifact>jstl</artifactid><br></br>     <version>1.1.2</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>taglibs</groupid><br></br>     <artifact>standard</artifactid><br></br>     <version>1.1.2</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.springframework</groupid><br></br>     <artifact>spring-webmvc</artifactid><br></br>     <version>3.0.5.RELEASE</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.springframework</groupid><br></br>     <artifact>spring-aop</artifactid><br></br>     <version>3.0.5.RELEASE</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>commons-digester</groupid><br></br>     <artifact>commons-digester</artifactid><br></br>     <version>2.1</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>commons-collections</groupid><br></br>     <artifact>commons-collections</artifactid><br></br>     <version>3.2.1</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.hibernate</groupid><br></br>     <artifact>hibernate-core</artifactid><br></br>     <version>3.3.2.GA</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>javax.persistence</groupid><br></br>     <artifact>persistence-api</artifactid><br></br>     <version>1.0</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>c3p0</groupid><br></br>     <artifact>c3p0</artifactid><br></br>     <version>0.9.1.2</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.springframework</groupid><br></br>     <artifact>spring-orm</artifactid><br></br>     <version>3.0.5.RELEASE</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.slf4j</groupid><br></br>     <artifact>slf4j-api</artifactid><br></br>     <version>1.6.1</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.slf4j</groupid><br></br>     <artifact>slf4j-log4j12</artifactid><br></br>     <version>1.6.1</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>cglib</groupid><br></br>     <artifact>cglib-nodep</artifactid><br></br>     <version>2.2</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>org.hibernate</groupid><br></br>     <artifact>hibernate-annotations</artifactid><br></br>     <version>3.4.0.GA</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>jboss</groupid><br></br>     <artifact>javassist</artifactid><br></br>     <version>3.7.ga</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>    <dependency><br></br>     <group>mysql</groupid><br></br>     <artifact>mysql-connector-java</artifactid><br></br>     <version>5.1.14</version><br></br>     <type>jar</type><br></br>     <scope>compile</scope><br></br>    </dependency><br></br>  </dependencies><br></br>

  
Step#3: Configure SpringMVC  
  
a) Configure DispatcherServlet in web.xml  

    
    <servlet><br></br>  <servlet-name>dispatcher</servlet-name><br></br>  <servlet->org.springframework.web.servlet.DispatcherServlet</servlet-class><br></br>  <load-on-startup>1</load-on-startup><br></br> </servlet><br></br> <br></br> <servlet-mapping><br></br>  <servlet-name>dispatcher</servlet-name><br></br>  <url-pattern>*.do</url-pattern><br></br> </servlet-mapping><br></br><br></br> <listener><br></br>  <listener->org.springframework.web.context.ContextLoaderListener</listener-class><br></br> </listener><br></br> <context-param><br></br>     <param-name>contextConfigLocation</param-name><param-value>classpath:applicationContext.xml</param-value></context-param><br></br>  

  
b) Configure View Resolver in WEB-INF/dispatcher-servlet.xml  
  

    
    <bean p:suffix=".jsp" p:prefix="/jsp/"><br></br> </bean><br></br> 

  
c) Configure Annotation support, PropertyPlaceHolderConfigurer, ResourceBundleMessageSource in WEB-INF/classes/applicationContext.xml   

    
    <context:annotation-config></context:annotation-config><br></br> <br></br> <context:component-scan base-package="com.sivalabs"></context:component-scan><br></br> <br></br> <mvc:annotation-driven> </mvc:annotation-driven> <br></br> <br></br> <context:property-placeholder location="classpath:config.properties"></context:property-placeholder><br></br> <br></br>    <bean p:basename="Messages"><br></br> </bean><br></br>

  
Step#4: Configure JDBC connection parameters and Hibernate properties in config.properties  
  

    
    ################### JDBC Configuration ##########################<br></br>jdbc.driverClassName=com.mysql.jdbc.Driver<br></br>jdbc.url=jdbc:mysql://localhost:3306/sivalabs<br></br>jdbc.username=root<br></br>jdbc.password=admin<br></br><br></br>################### Hibernate Configuration ##########################<br></br>hibernate.dialect=org.hibernate.dialect.MySQLDialect<br></br>hibernate.show_sql=true<br></br>#hibernate.hbm2ddl.auto=update<br></br>hibernate.generate_statistics=true<br></br>

  
Step#5: Configure DataSource, SessionFactory, TransactionManagement support in WEB-INF/classes/applicationContext.xml   
  

    
    <bean p:driverclassname="${jdbc.driverClassName}" p:url="${jdbc.url}" p:password="${jdbc.password}" p:username="${jdbc.username}"><br></br> </bean>  <br></br> <br></br> <bean><br></br>     <property ref="dataSource" name="dataSource"></property><br></br>     <property name="hibernateProperties"><br></br>       <props>        <br></br>             <prop key="hibernate.dialect">${hibernate.dialect}</prop>          <br></br>             <prop key="hibernate.show_sql">${hibernate.show_sql}</prop><br></br>        </props><br></br>     </property><br></br>  <property name="packagesToScan" value="com.sivalabs"></property><br></br> </bean><br></br>  <br></br>  <br></br>    <bean p:sessionfactory-ref="sessionFactory"><br></br> </bean><br></br> <br></br> <tx:annotation-driven transaction-manager="transactionManager"></tx:annotation-driven><br></br>    

  
  
Step#6: Configure the Labels, error messages in WEB-INF/classes/Messages.properties  
  

    
    App.Title=SivaLabs<br></br>typeMismatch.java.util.Date={0} is Invalid Date.<br></br>dob=DOB<br></br>

  
Step#7: Create the Entity class Contact.java  
  

    
    package com.sivalabs.contacts;<br></br><br></br>import java.util.Date;<br></br><br></br>import javax.persistence.Column;<br></br>import javax.persistence.Entity;<br></br>import javax.persistence.GeneratedValue;<br></br>import javax.persistence.GenerationType;<br></br>import javax.persistence.Id;<br></br>import javax.persistence.Table;<br></br><br></br>import org.apache.commons.lang.builder.ToStringBuilder;<br></br><br></br>@Entity<br></br>@Table(name="CONTACTS")<br></br>public class Contact<br></br>{<br></br> @Id<br></br> @GeneratedValue(strategy = GenerationType.AUTO)<br></br> private int id;<br></br> @Column private String name;<br></br> @Column private String address; <br></br> @Column private String gender; <br></br> @Column private Date dob; <br></br> @Column private String email;<br></br> @Column private String mobile; <br></br> @Column private String phone;<br></br> <br></br> @Override<br></br> public String toString()<br></br> {<br></br>  return ToStringBuilder.reflectionToString(this);<br></br> }<br></br> //setters & getters <br></br>}<br></br>

  
Step#8: Create the ContactsDAO.java which performs CRUD operations on CONTACTS table.  
  

    
    package com.sivalabs.contacts;<br></br><br></br>import java.util.List;<br></br><br></br>import org.hibernate.Criteria;<br></br>import org.hibernate.SessionFactory;<br></br>import org.hibernate.criterion.Restrictions;<br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.stereotype.Repository;<br></br>import org.springframework.transaction.annotation.Transactional;<br></br><br></br>@Repository<br></br>@Transactional<br></br>public class ContactsDAO<br></br>{<br></br> @Autowired<br></br> private SessionFactory sessionFactory;<br></br> <br></br> public Contact getById(int id)<br></br> {<br></br>  return (Contact) sessionFactory.getCurrentSession().get(Contact.class, id);<br></br> }<br></br> <br></br> @SuppressWarnings("unchecked")<br></br> public List<Contact> searchContacts(String name)<br></br> {<br></br>  Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Contact.class);<br></br>  criteria.add(Restrictions.ilike("name", name+"%"));<br></br>  return criteria.list();<br></br> }<br></br> <br></br> @SuppressWarnings("unchecked")<br></br> public List<Contact> getAllContacts()<br></br> {<br></br>  Criteria criteria = sessionFactory.getCurrentSession().createCriteria(Contact.class);<br></br>  return criteria.list();<br></br> }<br></br> <br></br> public int save(Contact contact)<br></br> {<br></br>  return (Integer) sessionFactory.getCurrentSession().save(contact);<br></br> }<br></br> <br></br> public void update(Contact contact)<br></br> {<br></br>  sessionFactory.getCurrentSession().merge(contact);<br></br> }<br></br> <br></br> public void delete(int id)<br></br> {<br></br>  Contact c = getById(id);<br></br>  sessionFactory.getCurrentSession().delete(c);<br></br> }<br></br>}<br></br>

  
Step#9: Create ContactFormValidator.java which performs the validations on saving/updating a contact.  
  

    
    package com.sivalabs.contacts;<br></br><br></br>import org.springframework.stereotype.Component;<br></br>import org.springframework.validation.Errors;<br></br>import org.springframework.validation.ValidationUtils;<br></br>import org.springframework.validation.Validator;<br></br><br></br>@Component("contactFormValidator")<br></br>public class ContactFormValidator implements Validator<br></br>{<br></br> @SuppressWarnings("unchecked")<br></br> @Override<br></br> public boolean supports(Class clazz)<br></br> {<br></br>  return Contact.class.isAssignableFrom(clazz);<br></br> }<br></br><br></br> @Override<br></br> public void validate(Object model, Errors errors)<br></br> {<br></br>  ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name","required.name", "Name is required.");<br></br> }<br></br>}<br></br>

  
Step#10: Create ContactsControllers.java which processes all the CRUD requests.  
  

    
    package com.sivalabs.contacts;<br></br><br></br>import java.text.SimpleDateFormat;<br></br>import java.util.Date;<br></br>import java.util.List;<br></br><br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.beans.propertyeditors.CustomDateEditor;<br></br>import org.springframework.stereotype.Controller;<br></br>import org.springframework.validation.BindingResult;<br></br>import org.springframework.web.bind.WebDataBinder;<br></br>import org.springframework.web.bind.annotation.InitBinder;<br></br>import org.springframework.web.bind.annotation.ModelAttribute;<br></br>import org.springframework.web.bind.annotation.RequestMapping;<br></br>import org.springframework.web.bind.annotation.RequestMethod;<br></br>import org.springframework.web.bind.annotation.RequestParam;<br></br>import org.springframework.web.bind.support.SessionStatus;<br></br>import org.springframework.web.servlet.ModelAndView;<br></br><br></br>@Controller<br></br>public class ContactsControllers<br></br>{<br></br> @Autowired<br></br> private ContactsDAO contactsDAO;<br></br> <br></br> @Autowired<br></br> private ContactFormValidator validator;<br></br>  <br></br> @InitBinder<br></br> public void initBinder(WebDataBinder binder) <br></br> {<br></br>  SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");<br></br>  dateFormat.setLenient(false);<br></br>  binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));<br></br> }<br></br>  <br></br> @RequestMapping("/searchContacts")<br></br> public ModelAndView searchContacts(@RequestParam(required= false, defaultValue="") String name)<br></br> {<br></br>  ModelAndView mav = new ModelAndView("showContacts");<br></br>  List<Contact> contacts = contactsDAO.searchContacts(name.trim());<br></br>  mav.addObject("SEARCH_CONTACTS_RESULTS_KEY", contacts);<br></br>  return mav;<br></br> }<br></br> <br></br> @RequestMapping("/viewAllContacts")<br></br> public ModelAndView getAllContacts()<br></br> {<br></br>  ModelAndView mav = new ModelAndView("showContacts");<br></br>  List<Contact> contacts = contactsDAO.getAllContacts();<br></br>  mav.addObject("SEARCH_CONTACTS_RESULTS_KEY", contacts);<br></br>  return mav;<br></br> }<br></br> <br></br> @RequestMapping(value="/saveContact", method=RequestMethod.GET)<br></br> public ModelAndView newuserForm()<br></br> {<br></br>  ModelAndView mav = new ModelAndView("newContact");<br></br>  Contact contact = new Contact();<br></br>  mav.getModelMap().put("newContact", contact);<br></br>  return mav;<br></br> }<br></br> <br></br> @RequestMapping(value="/saveContact", method=RequestMethod.POST)<br></br> public String create(@ModelAttribute("newContact")Contact contact, BindingResult result, SessionStatus status)<br></br> {<br></br>  validator.validate(contact, result);<br></br>  if (result.hasErrors()) <br></br>  {    <br></br>   return "newContact";<br></br>  }<br></br>  contactsDAO.save(contact);<br></br>  status.setComplete();<br></br>  return "redirect:viewAllContacts.do";<br></br> }<br></br> <br></br> @RequestMapping(value="/updateContact", method=RequestMethod.GET)<br></br> public ModelAndView edit(@RequestParam("id")Integer id)<br></br> {<br></br>  ModelAndView mav = new ModelAndView("editContact");<br></br>  Contact contact = contactsDAO.getById(id);<br></br>  mav.addObject("editContact", contact);<br></br>  return mav;<br></br> }<br></br> <br></br> @RequestMapping(value="/updateContact", method=RequestMethod.POST)<br></br> public String update(@ModelAttribute("editContact") Contact contact, BindingResult result, SessionStatus status)<br></br> {<br></br>  validator.validate(contact, result);<br></br>  if (result.hasErrors()) {<br></br>   return "editContact";<br></br>  }<br></br>  contactsDAO.update(contact);<br></br>  status.setComplete();<br></br>  return "redirect:viewAllContacts.do";<br></br> }<br></br>  <br></br> @RequestMapping("deleteContact")<br></br> public ModelAndView delete(@RequestParam("id")Integer id)<br></br> {<br></br>  ModelAndView mav = new ModelAndView("redirect:viewAllContacts.do");<br></br>  contactsDAO.delete(id);<br></br>  return mav;<br></br> } <br></br>}<br></br>

  
Step#11: Instead of writing the JSTL tag library declerations in all the JSPs, declare them in one JSP and include that JSP in other JSPs.  
taglib_includes.jsp  
  

    
    <%@taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%><br></br><%@taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%><br></br><br></br><%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%><br></br><%@taglib uri="http://www.springframework.org/tags" prefix="spring"%><br></br>

  
Step#12: Create the JSPs.  
  
a)showContacts.jsp  

    
    <%@include file="taglib_includes.jsp" %><br></br><br></br><html><br></br><head><br></br><br></br><title><spring:message code="App.Title"></spring:message> </title><br></br><br></br></head><br></br><body style="font-family: Arial; font-size:smaller;"><br></br> <center><br></br> <table bordercolor="#006699" style="border-collapse: collapse; width: 500px;" border="0"><tbody><br></br><tr>     <td>Enter Contact Name</td>      <td><br></br><br></br>  <br></br><br></br>  </td></tr><br></br></tbody></table><table bordercolor="#006699" style="border-collapse: collapse; width: 500px;" border="1"><tbody><br></br><tr bgcolor="lightblue">    <th>Id</th>    <th>Name</th>       <th>Address</th>     <th>Mobile</th>    <th></th>   </tr><br></br><c:if test="${empty SEARCH_CONTACTS_RESULTS_KEY}"> </c:if><br></br><tr>    <td colspan="4">No Results found</td>   </tr><br></br><c:if test="${! empty SEARCH_CONTACTS_RESULTS_KEY}">    <c:foreach var="contact" items="${SEARCH_CONTACTS_RESULTS_KEY}"> </c:foreach></c:if><br></br><tr>     <td><c:out value="${contact.id}"></c:out></td>     <td><c:out value="${contact.name}"></c:out></td>     <td><c:out value="${contact.address}"></c:out> </td>     <td><c:out value="${contact.mobile}"></c:out></td>     <td><br></br><br></br> <a href="http://www.blogger.com/updateContact.do?id=$%7Bcontact.id%7D">Edit</a><br></br><br></br>  <a href="javascript:deleteContact('deleteContact.do?id=$%7Bcontact.id%7D');">Delete</a></td>    </tr><br></br></tbody></table></center><br></br>  <br></br></body><br></br></html><br></br>

  
b)newContact.jsp  
  

    
    <%@include file="taglib_includes.jsp" %><br></br><br></br><html><br></br><head><br></br> <br></br> <title><spring:message code="App.Title"></spring:message> </title><br></br></head><br></br><body style="font-family: Arial; font-size:smaller;"><br></br><br></br><table bordercolor="#006699" style="border-collapse: collapse; width: 750px;" align="center" height="500" bgcolor="lightblue" border="1"><tbody><br></br><tr>   <td align="center"><h3>Edit Contact Form</h3></td>  </tr><br></br><tr align="center" valign="top">     <td align="center"><br></br><br></br><form:form action="saveContact.do" commandname="newContact" method="post"></form:form><table bordercolor="#006699" cellpadding="2" style="border-collapse: collapse; width: 500px;" cellspacing="2" border="0"><tbody><br></br><tr>       <td width="100" align="right">Name</td>       <td width="150"><br></br><br></br><form:input path="name"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="name"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">DOB</td>       <td><form:input path="dob"></form:input></td>       <td align="left"><form:errors cssstyle="color:red" path="dob"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Gender</td>       <td><br></br><br></br><form:select path="gender"><form:option value="M" label="Male"><form:option value="F" label="Female"></form:option></form:option></form:select></td>       <td> </td>            </tr><br></br><tr>       <td width="100" align="right">Address</td>       <td><form:input path="address"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="address"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Email</td>       <td><form:input path="email"></form:input></td>       <td align="left"><form:errors cssstyle="color:red" path="email"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Mobile</td>       <td><form:input path="mobile"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="mobile"></form:errors></td>      </tr><br></br><tr>       <td colspan="3" align="center"><br></br><br></br><br></br><br></br> <br></br><br></br><br></br><br></br> <br></br><br></br></td>      </tr><br></br></tbody></table></td>       </tr><br></br></tbody></table></body><br></br></html><br></br>

  
a)editContact.jsp  
  

    
    <%@include file="taglib_includes.jsp" %><br></br><br></br><html><br></br><head><br></br> <br></br> <title><spring:message code="App.Title"></spring:message> </title><br></br></head><br></br><body style="font-family: Arial; font-size:smaller;"><br></br><br></br><table bordercolor="#006699" style="border-collapse: collapse; width: 750px;" align="center" height="500" bgcolor="lightblue" border="1"><tbody><br></br><tr>   <td align="center"><h3>Edit Contact Form</h3></td>  </tr><br></br><tr align="center" valign="top">     <td align="center"><br></br><br></br><form:form action="updateContact.do" commandname="editContact" method="post"></form:form><table bordercolor="#006699" cellpadding="2" style="border-collapse: collapse; width: 500px;" cellspacing="2" border="0"><tbody><br></br><tr>       <td width="100" align="right">Id</td>       <td width="150"><br></br><br></br><form:input path="id" readonly="true"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="id"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Name</td>       <td><br></br><br></br><form:input path="name"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="name"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">DOB</td>       <td><form:input path="dob"></form:input></td>       <td align="left"><form:errors cssstyle="color:red" path="dob"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Gender</td>       <td><br></br><br></br><form:select path="gender"><form:option value="M" label="Male"><form:option value="F" label="Female"></form:option></form:option></form:select></td>       <td> </td>            </tr><br></br><tr>       <td width="100" align="right">Address</td>       <td><form:input path="address"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="address"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Email</td>       <td><form:input path="email"></form:input></td>       <td align="left"><form:errors cssstyle="color:red" path="email"></form:errors></td>      </tr><br></br><tr>       <td width="100" align="right">Mobile</td>       <td><form:input path="mobile"></form:input></td>       <td align="left"><br></br><br></br><form:errors cssstyle="color:red" path="mobile"></form:errors></td>      </tr><br></br><tr valign="bottom">       <td colspan="3" align="center"><br></br><br></br><br></br><br></br> <br></br><br></br>      <br></br><br></br> <br></br><br></br></td>      </tr><br></br></tbody></table></td>       </tr><br></br></tbody></table></body><br></br></html><br></br>

  
Step#13: Write the javascript file js/contacts.js containing the utility methods  
  

    
    function go(url)<br></br>{<br></br> window.location = url;<br></br>}<br></br><br></br>function deleteContact(url)<br></br>{<br></br> var isOK = confirm("Are you sure to delete?");<br></br> if(isOK)<br></br> {<br></br>  go(url);<br></br> }<br></br>}<br></br>

Step#14: The welcome file index.jsp  

    
    <%<br></br>response.sendRedirect("viewAllContacts.do");<br></br>%><br></br>

  
Step#15: Start the server and point your browser URL to http://localhost:8080/SpringMVCHibernate  
  
You can download the source code at  
[SpringMVCHibernate.zip](https://sites.google.com/site/sivalabworks/sampleappdownloads/SpringMVCHibernate.zip?attredirects=0&d=1)
