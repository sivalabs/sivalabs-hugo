---
author: siva
comments: true
date: 2012-02-02 04:40:00+00:00
layout: post
slug: primefaces3-tutorial-form-validation-using-beanvalidation-apijsr-303
title: 'PrimeFaces3 Tutorial : Form Validation Using BeanValidation API(JSR-303)'
wordpress_id: 247
categories:
- JSF
- PrimeFaces
tags:
- JSF
- PrimeFaces
---

JSF2 has in-built support for form validations using Bean Validation API(JSR-303).  
In my previous article [PrimeFaces 3 Tutorial : Introduction & Form Validation ](http://sivalabs.blogspot.in/2012/01/primefaces-3-tutorial-introduction-form.html), I have explained how to validate forms using JSF tags inside JSF xhtml pages.  
Now Let us see how we can validate the forms using HibernateValidator which is reference implementation of JSR-303.  
  
**Note:** Integrating JSR-303 with JSF2 doesn't have anything to do with PrimeFaces 3.  
But I am planning to write a series of articles on PrimeFaces and JSR-303 integration is a part of it.   
Please bear with me. :-)  
  
**Step#1:** Add hibernate-validator dependency in pom.xml.  
  

    
    <dependency><br></br>  <groupId>javax.validation</groupId><br></br>  <artifactId>validation-api</artifactId><br></br>  <version>1.0.0.GA</version><br></br>  <scope>compile</scope><br></br> </dependency><br></br><br></br> <dependency><br></br>  <groupId>org.hibernate</groupId><br></br>  <artifactId>hibernate-validator</artifactId><br></br>  <version>4.0.0.GA</version><br></br>  <scope>compile</scope><br></br> </dependency><br></br>

  
Here actually we don't need to specify validation-api.jar dependency explicitely. hibernate-validator.jar dependency will pull the validation-api.jar as its dependency.  
  
**Step#2:**  
Now let us specify the validation constraints for our Registration Form using Annotations on RegistrationForm.java bean.  
  

    
    package com.sivalabs.pfdemo.mb.ui;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.Date;<br></br>import java.util.List;<br></br><br></br>public class RegistrationForm<br></br>{<br></br> <br></br> private Integer userId;<br></br> <br></br> @NotEmpty(message="UserName is required")<br></br> @Size(min=5, max=15, message="UsesrName should be of length from 5 to 15 chars")<br></br> private String userName;<br></br> <br></br> @NotEmpty(message="Password is required")<br></br> @Size(min=5, max=15, message="UsesrName should be of length from 5 to 15 chars")<br></br> private String password;<br></br> <br></br> @NotEmpty(message="FirstName is required")<br></br> @Size(min=5, max=15, message="UsesrName should be of length from 5 to 15 chars")<br></br> private String firstName;<br></br> <br></br> private String lastName;<br></br> <br></br> @Pattern(regexp="[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{2,3}", message="Invalid EmailId")<br></br> private String email;<br></br> private String phone;<br></br> private Date dob;<br></br> private String gender;<br></br> private List<String> interests = new ArrayList<String>();<br></br> private boolean subscribeToNewsLetter;<br></br>  <br></br> //setters/getters<br></br> <br></br>}<br></br>

  
**Step#3:**  
Now you don't need to mention about validation constrains in JSF xhtml pages anymore. And you don't need to configure anything explicitly to tell JSF to validate RegistrationForm.  
  

    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <br></br><html xmlns="http://www.w3.org/1999/xhtml"<br></br>      xmlns:h="http://java.sun.com/jsf/html"<br></br>      xmlns:f="http://java.sun.com/jsf/core"<br></br>      xmlns:ui="http://java.sun.com/jsf/facelets"<br></br>      xmlns:p="http://primefaces.org/ui"> <br></br><br></br><h:head><br></br><br></br></h:head> <br></br><h:body> <br></br> <h2>Registration Form</h2><br></br> <h:form><br></br>  <p:fieldset legend="Registration Form" widgetVar="regWidget" style="width: 600px;"><br></br>   <h:panelGrid columns="3" width="550" border="0"><br></br>    <h:outputLabel value="UserName" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.userName}" id="userName"/><br></br>    <p:message for="userName"/><br></br>    <br></br>    <br></br>    <h:outputLabel value="Password" /><br></br>    <p:password value="#{registrationBean.registrationForm.password}" id="password"/><br></br>    <p:message for="password" /><br></br>    <br></br>    <h:outputLabel value="FirstName" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.firstName}" id="firstName"/><br></br>    <p:message for="firstName" /><br></br>    <br></br>    <br></br>    <h:outputLabel value="LastName" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.lastName}" id="lastName"/><br></br>    <p:message for="lastName" /><br></br>    <br></br>    <h:outputLabel value="Email" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.email}" id="email"/><br></br>    <p:message for="email" /><br></br>    <br></br>    <h:outputLabel value="Phone" /><br></br>    <p:inputText value="#{registrationBean.registrationForm.phone}" id="phone"/><br></br>    <p:message for="phone" /><br></br>    <br></br>    <h:outputLabel value="DOB" /><br></br>    <p:calendar value="#{registrationBean.registrationForm.dob}"<br></br>       id="dob"<br></br>       converterMessage="Invalid Date"<br></br>       pattern="dd-MM-yyyy"><br></br>     <br></br>    </p:calendar><br></br>    <p:message for="dob" /><br></br>    <br></br>    <h:outputLabel value="Gender" /><br></br>    <h:selectOneRadio id="gender" <br></br>          value="#{registrationBean.registrationForm.gender}" ><br></br>     <f:selectItems value="#{registrationBean.genders}" <br></br>         var="gOp"<br></br>         itemLabel="#{gOp}"<br></br>         itemValue="#{gOp}"/><br></br>    </h:selectOneRadio><br></br>    <p:message for="gender" /><br></br>    <br></br>    <br></br>    <h:outputLabel value="Interests" /><br></br>    <p:selectManyCheckbox id="interests"<br></br>           value="#{registrationBean.registrationForm.interests}"<br></br>           layout="pageDirection"><br></br>     <f:selectItems value="#{registrationBean.interests}" var="intrOp"></f:selectItems><br></br>    </p:selectManyCheckbox><br></br>    <p:message for="interests" /><br></br>    <br></br>    <p:commandButton value="Register" action="#{registrationBean.register}" ajax="false"></p:commandButton><br></br>   </h:panelGrid><br></br>  </p:fieldset><br></br> <br></br> </h:form><br></br></h:body> <br></br></html><br></br>

  
With these changes your Registration Form will be working same as using JSF validation tags.  
  
**References:**  
http://sivalabs.blogspot.in/2012/01/primefaces-3-tutorial-introduction-form.html  
http://docs.jboss.org/hibernate/validator/4.1/reference/en-US/html_single/
