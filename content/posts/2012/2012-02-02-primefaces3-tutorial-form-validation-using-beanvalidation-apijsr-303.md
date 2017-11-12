---
title: 'PrimeFaces3 Tutorial : Form Validation Using BeanValidation API(JSR-303)'
author: Siva
type: post
date: 2012-02-01T23:10:00+00:00
url: /2012/02/primefaces3-tutorial-form-validation-using-beanvalidation-apijsr-303/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/02/primefaces3-tutorial-form-validation.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1529637189185353256
post_views_count:
  - 4
categories:
  - JavaEE
tags:
  - JSF
  - PrimeFaces

---
JSF2 has in-built support for form validations using Bean Validation API(JSR-303).  
In my previous article [PrimeFaces 3 Tutorial : Introduction & Form Validation ][1], I have explained how to validate forms using JSF tags inside JSF xhtml pages.  
Now Let us see how we can validate the forms using HibernateValidator which is reference implementation of JSR-303.

**Note:** Integrating JSR-303 with JSF2 doesn&#8217;t have anything to do with PrimeFaces 3.  
But I am planning to write a series of articles on PrimeFaces and JSR-303 integration is a part of it.   
Please bear with me. 🙂

**Step#1:** Add hibernate-validator dependency in pom.xml.

<pre>&lt;dependency&gt;<br />  &lt;groupId&gt;javax.validation&lt;/groupId&gt;<br />  &lt;artifactId&gt;validation-api&lt;/artifactId&gt;<br />  &lt;version&gt;1.0.0.GA&lt;/version&gt;<br />  &lt;scope&gt;compile&lt;/scope&gt;<br /> &lt;/dependency&gt;<br /><br /> &lt;dependency&gt;<br />  &lt;groupId&gt;org.hibernate&lt;/groupId&gt;<br />  &lt;artifactId&gt;hibernate-validator&lt;/artifactId&gt;<br />  &lt;version&gt;4.0.0.GA&lt;/version&gt;<br />  &lt;scope&gt;compile&lt;/scope&gt;<br /> &lt;/dependency&gt;<br /></pre>

Here actually we don&#8217;t need to specify validation-api.jar dependency explicitely. hibernate-validator.jar dependency will pull the validation-api.jar as its dependency.

**Step#2:**  
Now let us specify the validation constraints for our Registration Form using Annotations on RegistrationForm.java bean.

<pre>package com.sivalabs.pfdemo.mb.ui;<br /><br />import java.util.ArrayList;<br />import java.util.Date;<br />import java.util.List;<br /><br />public class RegistrationForm<br />{<br /> <br /> private Integer userId;<br /> <br /> @NotEmpty(message="UserName is required")<br /> @Size(min=5, max=15, message="UsesrName should be of length from 5 to 15 chars")<br /> private String userName;<br /> <br /> @NotEmpty(message="Password is required")<br /> @Size(min=5, max=15, message="UsesrName should be of length from 5 to 15 chars")<br /> private String password;<br /> <br /> @NotEmpty(message="FirstName is required")<br /> @Size(min=5, max=15, message="UsesrName should be of length from 5 to 15 chars")<br /> private String firstName;<br /> <br /> private String lastName;<br /> <br /> @Pattern(regexp="[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{2,3}", message="Invalid EmailId")<br /> private String email;<br /> private String phone;<br /> private Date dob;<br /> private String gender;<br /> private List&lt;String&gt; interests = new ArrayList&lt;String&gt;();<br /> private boolean subscribeToNewsLetter;<br />  <br /> //setters/getters<br /> <br />}<br /></pre>

**Step#3:**  
Now you don&#8217;t need to mention about validation constrains in JSF xhtml pages anymore. And you don&#8217;t need to configure anything explicitly to tell JSF to validate RegistrationForm.

<pre>&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt; <br />&lt;html xmlns="http://www.w3.org/1999/xhtml"<br />      xmlns:h="http://java.sun.com/jsf/html"<br />      xmlns:f="http://java.sun.com/jsf/core"<br />      xmlns:ui="http://java.sun.com/jsf/facelets"<br />      xmlns:p="http://primefaces.org/ui"&gt; <br /><br />&lt;h:head&gt;<br /><br />&lt;/h:head&gt; <br />&lt;h:body&gt; <br /> &lt;h2&gt;Registration Form&lt;/h2&gt;<br /> &lt;h:form&gt;<br />  &lt;p:fieldset legend="Registration Form" widgetVar="regWidget" style="width: 600px;"&gt;<br />   &lt;h:panelGrid columns="3" width="550" border="0"&gt;<br />    &lt;h:outputLabel value="UserName" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.userName}" id="userName"/&gt;<br />    &lt;p:message for="userName"/&gt;<br />    <br />    <br />    &lt;h:outputLabel value="Password" /&gt;<br />    &lt;p:password value="#{registrationBean.registrationForm.password}" id="password"/&gt;<br />    &lt;p:message for="password" /&gt;<br />    <br />    &lt;h:outputLabel value="FirstName" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.firstName}" id="firstName"/&gt;<br />    &lt;p:message for="firstName" /&gt;<br />    <br />    <br />    &lt;h:outputLabel value="LastName" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.lastName}" id="lastName"/&gt;<br />    &lt;p:message for="lastName" /&gt;<br />    <br />    &lt;h:outputLabel value="Email" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.email}" id="email"/&gt;<br />    &lt;p:message for="email" /&gt;<br />    <br />    &lt;h:outputLabel value="Phone" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.phone}" id="phone"/&gt;<br />    &lt;p:message for="phone" /&gt;<br />    <br />    &lt;h:outputLabel value="DOB" /&gt;<br />    &lt;p:calendar value="#{registrationBean.registrationForm.dob}"<br />       id="dob"<br />       converterMessage="Invalid Date"<br />       pattern="dd-MM-yyyy"&gt;<br />     <br />    &lt;/p:calendar&gt;<br />    &lt;p:message for="dob" /&gt;<br />    <br />    &lt;h:outputLabel value="Gender" /&gt;<br />    &lt;h:selectOneRadio id="gender" <br />          value="#{registrationBean.registrationForm.gender}" &gt;<br />     &lt;f:selectItems value="#{registrationBean.genders}" <br />         var="gOp"<br />         itemLabel="#{gOp}"<br />         itemValue="#{gOp}"/&gt;<br />    &lt;/h:selectOneRadio&gt;<br />    &lt;p:message for="gender" /&gt;<br />    <br />    <br />    &lt;h:outputLabel value="Interests" /&gt;<br />    &lt;p:selectManyCheckbox id="interests"<br />           value="#{registrationBean.registrationForm.interests}"<br />           layout="pageDirection"&gt;<br />     &lt;f:selectItems value="#{registrationBean.interests}" var="intrOp"&gt;&lt;/f:selectItems&gt;<br />    &lt;/p:selectManyCheckbox&gt;<br />    &lt;p:message for="interests" /&gt;<br />    <br />    &lt;p:commandButton value="Register" action="#{registrationBean.register}" ajax="false"&gt;&lt;/p:commandButton&gt;<br />   &lt;/h:panelGrid&gt;<br />  &lt;/p:fieldset&gt;<br /> <br /> &lt;/h:form&gt;<br />&lt;/h:body&gt; <br />&lt;/html&gt;<br /></pre>

With these changes your Registration Form will be working same as using JSF validation tags.

**References:**  
http://sivalabs.blogspot.in/2012/01/primefaces-3-tutorial-introduction-form.html  
http://docs.jboss.org/hibernate/validator/4.1/reference/en-US/html_single/

 [1]: http://sivalabs.blogspot.in/2012/01/primefaces-3-tutorial-introduction-form.html