---
author: siva
comments: true
date: 2012-01-31 02:53:00+00:00
layout: post
slug: primefaces-3-tutorial-introduction-form-validation
title: 'PrimeFaces 3 Tutorial : Introduction & Form Validation'
wordpress_id: 248
categories:
- JSF
- PrimeFaces
tags:
- JSF
- PrimeFaces
---

PrimeFaces is a component library for JSF and has huge component support.  
Working with PrimeFaces is very much easy because there is a single jar, no mandatory other dependencies, no mandatory configuration is required.  
  
Ok, in this tutorial I am going to explain how to create a Maven based PrimeFaces project and create a simple registration for and validate the form.  
I am using JDK1.6.26 and Tomcat 7.0.32.  
  
  
**Step#1**  
Create Maven Project and add the following repositories, dependencies in pom.xml  
  

    
    <dependencies>  <br></br>  <dependency><br></br>   <groupId>com.sun.faces</groupId><br></br>   <artifactId>jsf-api</artifactId><br></br>   <version>2.1.6</version><br></br>   <scope>runtime</scope><br></br>  </dependency><br></br>  <dependency><br></br>   <groupId>com.sun.faces</groupId><br></br>   <artifactId>jsf-impl</artifactId><br></br>   <version>2.1.6</version><br></br>   <scope>runtime</scope><br></br>  </dependency><br></br>  <dependency><br></br>   <groupId>org.primefaces</groupId><br></br>   <artifactId>primefaces</artifactId><br></br>   <version>3.0</version><br></br>  </dependency><br></br>  <dependency><br></br>   <groupId>org.primefaces.themes</groupId><br></br>   <artifactId>bluesky</artifactId><br></br>   <version>1.0.2</version><br></br>  </dependency><br></br> </dependencies><br></br><br></br> <repositories><br></br>  <repository><br></br>   <id>maven2-repository.dev.java.net</id><br></br>   <name>Java.net Repository for Maven</name><br></br>   <url>http://download.java.net/maven/2</url><br></br>  </repository><br></br>  <repository><br></br>   <id>prime-repo</id><br></br>   <name>Prime Repo</name><br></br>   <url>http://repository.primefaces.org</url><br></br>  </repository><br></br> </repositories><br></br> <build><br></br>  <finalName>primefaces-demo</finalName><br></br> </build><br></br>

  
**Step#2**  
  
Configure JSF2's FacesServlet configurtion in web.xml  

    
    <servlet><br></br>    <servlet-name>FacesServlet</servlet-name><br></br>    <servlet-class>javax.faces.webapp.FacesServlet</servlet-class><br></br>    <load-on-startup>1</load-on-startup><br></br>  </servlet><br></br>  <servlet-mapping><br></br>    <servlet-name>FacesServlet</servlet-name><br></br>    <url-pattern>/faces/*</url-pattern><br></br>  </servlet-mapping><br></br>  <servlet-mapping><br></br>    <servlet-name>FacesServlet</servlet-name><br></br>    <url-pattern>*.xhtml</url-pattern><br></br>  </servlet-mapping><br></br>  <context-param><br></br>    <param-name>javax.faces.STATE_SAVING_METHOD</param-name><br></br>    <param-value>client</param-value><br></br>  </context-param><br></br>  <!--Blusky theme for PrimeFaces --><br></br>  <context-param><br></br> <param-name>primefaces.THEME</param-name><br></br> <param-value>bluesky</param-value><br></br>  </context-param><br></br>

  
**Step#3**  
  
Create RegistrationForm bean.  
  

    
    package com.sivalabs.pfdemo.mb.ui;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.Date;<br></br>import java.util.List;<br></br><br></br>public class RegistrationForm<br></br>{<br></br> private Integer userId;<br></br> private String userName;<br></br> private String password;<br></br> private String firstName;<br></br> private String lastName;<br></br> private String email;<br></br> private String phone;<br></br> private Date dob;<br></br> private String gender;<br></br> private List<String> interests = new ArrayList<String>();<br></br> private boolean subscribeToNewsLetter;<br></br> <br></br> //setters/getters<br></br> <br></br>}<br></br>

  
Create RegistrationBean which is a Managed Bean.  
  

    
    package com.sivalabs.pfdemo.mb;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.List;<br></br><br></br>import javax.faces.bean.ManagedBean;<br></br>import javax.faces.bean.RequestScoped;<br></br><br></br>import com.sivalabs.pfdemo.mb.ui.RegistrationForm;<br></br><br></br>@ManagedBean<br></br>@RequestScoped<br></br>public class RegistrationBean<br></br>{<br></br> private RegistrationForm registrationForm = null;<br></br> private List<String> interests = null;<br></br> private List<String> genders = null;<br></br> <br></br> public RegistrationBean()<br></br> {<br></br>  this.interests = new ArrayList<String>();<br></br>  this.interests.add("Sports");<br></br>  this.interests.add("Gadgets");<br></br>  this.interests.add("Politics");<br></br>  this.interests.add("Technology");<br></br>  <br></br>  this.genders = new ArrayList<String>();<br></br>  this.genders.add("Male");<br></br>  this.genders.add("Female");<br></br> <br></br> }<br></br> <br></br> public String register()<br></br> {<br></br>  System.out.println("register.....");<br></br>  //store data in DB<br></br>  System.out.println(this.registrationForm);<br></br>  return "welcome";//go to welcome.xhtml<br></br> }<br></br> <br></br> public RegistrationForm getRegistrationForm()<br></br> {<br></br>  if(this.registrationForm == null){<br></br>   this.registrationForm = new RegistrationForm();<br></br>  }<br></br>  return registrationForm;<br></br> }<br></br><br></br> public void setRegistrationForm(RegistrationForm registrationForm)<br></br> {<br></br>  this.registrationForm = registrationForm;<br></br> }<br></br><br></br> public List<String> getInterests()<br></br> {<br></br>  return interests;<br></br> }<br></br><br></br> public void setInterests(List<String> interests)<br></br> {<br></br>  this.interests = interests;<br></br> }<br></br><br></br> public List<String> getGenders()<br></br> {<br></br>  return genders;<br></br> }<br></br><br></br> public void setGenders(List<String> genders)<br></br> {<br></br>  this.genders = genders;<br></br> }<br></br> <br></br>}<br></br>

  
**Step#4:** Create registration.xhtml JSF page.  
  

    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <br></br><html xmlns="http://www.w3.org/1999/xhtml"<br></br>      xmlns:h="http://java.sun.com/jsf/html"<br></br>      xmlns:f="http://java.sun.com/jsf/core"<br></br>      xmlns:ui="http://java.sun.com/jsf/facelets"<br></br>      xmlns:p="http://primefaces.org/ui"> <br></br><br></br><h:head><br></br><br></br></h:head> <br></br><h:body> <br></br> <h2>Registration Form</h2><br></br> <h:form><br></br>  <p:fieldset legend="Registration Form" widgetVar="regWidget" style="width: 600px;"><br></br>   <h:panelGrid columns="3" width="550" border="0"><br></br>    <h:outputLabel value="UserName" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.userName}" <br></br>       id="userName"<br></br>        required="true" <br></br>        requiredMessage="UserName is required"<br></br>        validatorMessage="UsesrName should be of length from 5 to 15 chars"<br></br>        ><br></br>     <f:validateLength minimum="5" maximum="15" for="userName"></f:validateLength><br></br>    </p:inputText><br></br>    <p:message for="userName"/><br></br>    <br></br>    <br></br>    <h:outputLabel value="Password" /><br></br>    <p:password value="#{registrationBean.registrationForm.password}"<br></br>       id="password"<br></br>       required="true" <br></br>       requiredMessage="Password is required"<br></br>       validatorMessage="Password should be of length from 5 to 15 chars"<br></br>       ><br></br>      <f:validateLength minimum="5" maximum="15" for="password"></f:validateLength><br></br>    </p:password><br></br>    <p:message for="password" /><br></br>    <br></br>    <h:outputLabel value="FirstName" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.firstName}"<br></br>       id="firstName"<br></br>       required="true" <br></br>       requiredMessage="FirstName is required"<br></br>       validatorMessage="FirstName should be of length from 5 to 15 chars"<br></br>       ><br></br>      <f:validateLength minimum="5" maximum="15" for="firstName"></f:validateLength><br></br>    </p:inputText><br></br>    <p:message for="firstName" /><br></br>    <br></br>    <br></br>    <h:outputLabel value="LastName" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.lastName}"<br></br>       id="lastName"></p:inputText><br></br>    <p:message for="lastName" /><br></br>    <br></br>    <h:outputLabel value="Email" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.email}"<br></br>       id="email"<br></br>       validatorMessage="Invalid Email"><br></br>     <f:validateRegex pattern="[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{2,3}"></f:validateRegex>   <br></br>    </p:inputText><br></br>    <p:message for="email" /><br></br>    <br></br>    <h:outputLabel value="Phone" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.phone}"<br></br>       id="phone"></p:inputText><br></br>    <p:message for="phone" /><br></br>    <br></br>    <h:outputLabel value="DOB" /><br></br>    <p:calendar value="#{registrationBean.registrationForm.dob}"<br></br>       id="dob"<br></br>       converterMessage="Invalid Date"<br></br>       pattern="dd-MM-yyyy"><br></br>     <br></br>    </p:calendar><br></br>    <p:message for="dob" /><br></br>    <br></br>    <h:outputLabel value="Gender" /><br></br>    <h:selectOneRadio id="gender" <br></br>          value="#{registrationBean.registrationForm.gender}" ><br></br>     <f:selectItems value="#{registrationBean.genders}" <br></br>         var="gOp"<br></br>         itemLabel="#{gOp}"<br></br>         itemValue="#{gOp}"/><br></br>    </h:selectOneRadio><br></br>    <p:message for="gender" /><br></br>    <br></br>    <br></br>    <h:outputLabel value="Interests" /><br></br>    <p:selectManyCheckbox id="interests"<br></br>           value="#{registrationBean.registrationForm.interests}"<br></br>           layout="pageDirection"><br></br>     <f:selectItems value="#{registrationBean.interests}" var="intrOp"></f:selectItems><br></br>    </p:selectManyCheckbox><br></br>    <p:message for="interests" /><br></br>    <br></br>    <p:commandButton value="Register" action="#{registrationBean.register}" ajax="false"></p:commandButton><br></br>   </h:panelGrid><br></br>  </p:fieldset><br></br> <br></br> </h:form><br></br></h:body> <br></br></html><br></br>

  
**Step#5:**  
Now go to http://localhost:8080/primfaces-demo/registration.xhtml  
  
**Here key things to note are:**  
1. We need to add primefaces taglib using xmlns:p="http://primefaces.org/ui"  
2. PrimeFaces Command Button/Links bydefault use Ajax submit. So to do non-ajax submit we should use ajax="false".  
3. To enable autocompletion for <p:> tags, right click on project --> Properties --> ProjectFacests --> Select Java Server Faces 2.0 checkbox and Apply.  
  
  
In the next article [PrimeFaces3 Tutorial : Form Validation Using BeanValidation API(JSR-303)](http://sivalabs.blogspot.in/2012/02/primefaces3-tutorial-form-validation.html)I have explained how to validate the forms using JSR-303 Bean Validation API.
