---
title: 'PrimeFaces 3 Tutorial : Introduction & Form Validation'
author: Siva
type: post
date: 2012-01-30T21:23:00+00:00
url: /2012/01/primefaces-3-tutorial-introduction-form-validation/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2012/01/primefaces-3-tutorial-introduction-form.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2904432137546276329
post_views_count:
  - 28
categories:
  - JavaEE
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

<pre>&lt;dependencies&gt;  <br />  &lt;dependency&gt;<br />   &lt;groupId&gt;com.sun.faces&lt;/groupId&gt;<br />   &lt;artifactId&gt;jsf-api&lt;/artifactId&gt;<br />   &lt;version&gt;2.1.6&lt;/version&gt;<br />   &lt;scope&gt;runtime&lt;/scope&gt;<br />  &lt;/dependency&gt;<br />  &lt;dependency&gt;<br />   &lt;groupId&gt;com.sun.faces&lt;/groupId&gt;<br />   &lt;artifactId&gt;jsf-impl&lt;/artifactId&gt;<br />   &lt;version&gt;2.1.6&lt;/version&gt;<br />   &lt;scope&gt;runtime&lt;/scope&gt;<br />  &lt;/dependency&gt;<br />  &lt;dependency&gt;<br />   &lt;groupId&gt;org.primefaces&lt;/groupId&gt;<br />   &lt;artifactId&gt;primefaces&lt;/artifactId&gt;<br />   &lt;version&gt;3.0&lt;/version&gt;<br />  &lt;/dependency&gt;<br />  &lt;dependency&gt;<br />   &lt;groupId&gt;org.primefaces.themes&lt;/groupId&gt;<br />   &lt;artifactId&gt;bluesky&lt;/artifactId&gt;<br />   &lt;version&gt;1.0.2&lt;/version&gt;<br />  &lt;/dependency&gt;<br /> &lt;/dependencies&gt;<br /><br /> &lt;repositories&gt;<br />  &lt;repository&gt;<br />   &lt;id&gt;maven2-repository.dev.java.net&lt;/id&gt;<br />   &lt;name&gt;Java.net Repository for Maven&lt;/name&gt;<br />   &lt;url&gt;http://download.java.net/maven/2&lt;/url&gt;<br />  &lt;/repository&gt;<br />  &lt;repository&gt;<br />   &lt;id&gt;prime-repo&lt;/id&gt;<br />   &lt;name&gt;Prime Repo&lt;/name&gt;<br />   &lt;url&gt;http://repository.primefaces.org&lt;/url&gt;<br />  &lt;/repository&gt;<br /> &lt;/repositories&gt;<br /> &lt;build&gt;<br />  &lt;finalName&gt;primefaces-demo&lt;/finalName&gt;<br /> &lt;/build&gt;<br /></pre>

**Step#2**

Configure JSF2&#8217;s FacesServlet configurtion in web.xml

<pre>&lt;servlet&gt;<br />    &lt;servlet-name&gt;FacesServlet&lt;/servlet-name&gt;<br />    &lt;servlet-class&gt;javax.faces.webapp.FacesServlet&lt;/servlet-class&gt;<br />    &lt;load-on-startup&gt;1&lt;/load-on-startup&gt;<br />  &lt;/servlet&gt;<br />  &lt;servlet-mapping&gt;<br />    &lt;servlet-name&gt;FacesServlet&lt;/servlet-name&gt;<br />    &lt;url-pattern&gt;/faces/*&lt;/url-pattern&gt;<br />  &lt;/servlet-mapping&gt;<br />  &lt;servlet-mapping&gt;<br />    &lt;servlet-name&gt;FacesServlet&lt;/servlet-name&gt;<br />    &lt;url-pattern&gt;*.xhtml&lt;/url-pattern&gt;<br />  &lt;/servlet-mapping&gt;<br />  &lt;context-param&gt;<br />    &lt;param-name&gt;javax.faces.STATE_SAVING_METHOD&lt;/param-name&gt;<br />    &lt;param-value&gt;client&lt;/param-value&gt;<br />  &lt;/context-param&gt;<br />  &lt;!--Blusky theme for PrimeFaces --&gt;<br />  &lt;context-param&gt;<br /> &lt;param-name&gt;primefaces.THEME&lt;/param-name&gt;<br /> &lt;param-value&gt;bluesky&lt;/param-value&gt;<br />  &lt;/context-param&gt;<br /></pre>

**Step#3**

Create RegistrationForm bean.

<pre>package com.sivalabs.pfdemo.mb.ui;<br /><br />import java.util.ArrayList;<br />import java.util.Date;<br />import java.util.List;<br /><br />public class RegistrationForm<br />{<br /> private Integer userId;<br /> private String userName;<br /> private String password;<br /> private String firstName;<br /> private String lastName;<br /> private String email;<br /> private String phone;<br /> private Date dob;<br /> private String gender;<br /> private List&lt;String&gt; interests = new ArrayList&lt;String&gt;();<br /> private boolean subscribeToNewsLetter;<br /> <br /> //setters/getters<br /> <br />}<br /></pre>

Create RegistrationBean which is a Managed Bean.

<pre>package com.sivalabs.pfdemo.mb;<br /><br />import java.util.ArrayList;<br />import java.util.List;<br /><br />import javax.faces.bean.ManagedBean;<br />import javax.faces.bean.RequestScoped;<br /><br />import com.sivalabs.pfdemo.mb.ui.RegistrationForm;<br /><br />@ManagedBean<br />@RequestScoped<br />public class RegistrationBean<br />{<br /> private RegistrationForm registrationForm = null;<br /> private List&lt;String&gt; interests = null;<br /> private List&lt;String&gt; genders = null;<br /> <br /> public RegistrationBean()<br /> {<br />  this.interests = new ArrayList&lt;String&gt;();<br />  this.interests.add("Sports");<br />  this.interests.add("Gadgets");<br />  this.interests.add("Politics");<br />  this.interests.add("Technology");<br />  <br />  this.genders = new ArrayList&lt;String&gt;();<br />  this.genders.add("Male");<br />  this.genders.add("Female");<br /> <br /> }<br /> <br /> public String register()<br /> {<br />  System.out.println("register.....");<br />  //store data in DB<br />  System.out.println(this.registrationForm);<br />  return "welcome";//go to welcome.xhtml<br /> }<br /> <br /> public RegistrationForm getRegistrationForm()<br /> {<br />  if(this.registrationForm == null){<br />   this.registrationForm = new RegistrationForm();<br />  }<br />  return registrationForm;<br /> }<br /><br /> public void setRegistrationForm(RegistrationForm registrationForm)<br /> {<br />  this.registrationForm = registrationForm;<br /> }<br /><br /> public List&lt;String&gt; getInterests()<br /> {<br />  return interests;<br /> }<br /><br /> public void setInterests(List&lt;String&gt; interests)<br /> {<br />  this.interests = interests;<br /> }<br /><br /> public List&lt;String&gt; getGenders()<br /> {<br />  return genders;<br /> }<br /><br /> public void setGenders(List&lt;String&gt; genders)<br /> {<br />  this.genders = genders;<br /> }<br /> <br />}<br /></pre>

**Step#4:** Create registration.xhtml JSF page.

<pre>&lt;!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"&gt; <br />&lt;html xmlns="http://www.w3.org/1999/xhtml"<br />      xmlns:h="http://java.sun.com/jsf/html"<br />      xmlns:f="http://java.sun.com/jsf/core"<br />      xmlns:ui="http://java.sun.com/jsf/facelets"<br />      xmlns:p="http://primefaces.org/ui"&gt; <br /><br />&lt;h:head&gt;<br /><br />&lt;/h:head&gt; <br />&lt;h:body&gt; <br /> &lt;h2&gt;Registration Form&lt;/h2&gt;<br /> &lt;h:form&gt;<br />  &lt;p:fieldset legend="Registration Form" widgetVar="regWidget" style="width: 600px;"&gt;<br />   &lt;h:panelGrid columns="3" width="550" border="0"&gt;<br />    &lt;h:outputLabel value="UserName" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.userName}" <br />       id="userName"<br />        required="true" <br />        requiredMessage="UserName is required"<br />        validatorMessage="UsesrName should be of length from 5 to 15 chars"<br />        &gt;<br />     &lt;f:validateLength minimum="5" maximum="15" for="userName"&gt;&lt;/f:validateLength&gt;<br />    &lt;/p:inputText&gt;<br />    &lt;p:message for="userName"/&gt;<br />    <br />    <br />    &lt;h:outputLabel value="Password" /&gt;<br />    &lt;p:password value="#{registrationBean.registrationForm.password}"<br />       id="password"<br />       required="true" <br />       requiredMessage="Password is required"<br />       validatorMessage="Password should be of length from 5 to 15 chars"<br />       &gt;<br />      &lt;f:validateLength minimum="5" maximum="15" for="password"&gt;&lt;/f:validateLength&gt;<br />    &lt;/p:password&gt;<br />    &lt;p:message for="password" /&gt;<br />    <br />    &lt;h:outputLabel value="FirstName" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.firstName}"<br />       id="firstName"<br />       required="true" <br />       requiredMessage="FirstName is required"<br />       validatorMessage="FirstName should be of length from 5 to 15 chars"<br />       &gt;<br />      &lt;f:validateLength minimum="5" maximum="15" for="firstName"&gt;&lt;/f:validateLength&gt;<br />    &lt;/p:inputText&gt;<br />    &lt;p:message for="firstName" /&gt;<br />    <br />    <br />    &lt;h:outputLabel value="LastName" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.lastName}"<br />       id="lastName"&gt;&lt;/p:inputText&gt;<br />    &lt;p:message for="lastName" /&gt;<br />    <br />    &lt;h:outputLabel value="Email" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.email}"<br />       id="email"<br />       validatorMessage="Invalid Email"&gt;<br />     &lt;f:validateRegex pattern="[a-zA-Z0-9]+@[a-zA-Z]+.[a-zA-Z]{2,3}"&gt;&lt;/f:validateRegex&gt;   <br />    &lt;/p:inputText&gt;<br />    &lt;p:message for="email" /&gt;<br />    <br />    &lt;h:outputLabel value="Phone" /&gt;<br />    &lt;p:inputText value="#{registrationBean.registrationForm.phone}"<br />       id="phone"&gt;&lt;/p:inputText&gt;<br />    &lt;p:message for="phone" /&gt;<br />    <br />    &lt;h:outputLabel value="DOB" /&gt;<br />    &lt;p:calendar value="#{registrationBean.registrationForm.dob}"<br />       id="dob"<br />       converterMessage="Invalid Date"<br />       pattern="dd-MM-yyyy"&gt;<br />     <br />    &lt;/p:calendar&gt;<br />    &lt;p:message for="dob" /&gt;<br />    <br />    &lt;h:outputLabel value="Gender" /&gt;<br />    &lt;h:selectOneRadio id="gender" <br />          value="#{registrationBean.registrationForm.gender}" &gt;<br />     &lt;f:selectItems value="#{registrationBean.genders}" <br />         var="gOp"<br />         itemLabel="#{gOp}"<br />         itemValue="#{gOp}"/&gt;<br />    &lt;/h:selectOneRadio&gt;<br />    &lt;p:message for="gender" /&gt;<br />    <br />    <br />    &lt;h:outputLabel value="Interests" /&gt;<br />    &lt;p:selectManyCheckbox id="interests"<br />           value="#{registrationBean.registrationForm.interests}"<br />           layout="pageDirection"&gt;<br />     &lt;f:selectItems value="#{registrationBean.interests}" var="intrOp"&gt;&lt;/f:selectItems&gt;<br />    &lt;/p:selectManyCheckbox&gt;<br />    &lt;p:message for="interests" /&gt;<br />    <br />    &lt;p:commandButton value="Register" action="#{registrationBean.register}" ajax="false"&gt;&lt;/p:commandButton&gt;<br />   &lt;/h:panelGrid&gt;<br />  &lt;/p:fieldset&gt;<br /> <br /> &lt;/h:form&gt;<br />&lt;/h:body&gt; <br />&lt;/html&gt;<br /></pre>

**Step#5:**  
Now go to http://localhost:8080/primfaces-demo/registration.xhtml

**Here key things to note are:**  
1. We need to add primefaces taglib using xmlns:p="http://primefaces.org/ui"  
2. PrimeFaces Command Button/Links bydefault use Ajax submit. So to do non-ajax submit we should use ajax=&#8221;false&#8221;.  
3. To enable autocompletion for <p:> tags, right click on project &#8211;> Properties &#8211;> ProjectFacests &#8211;> Select Java Server Faces 2.0 checkbox and Apply.

In the next article [PrimeFaces3 Tutorial : Form Validation Using BeanValidation API(JSR-303)][1]I have explained how to validate the forms using JSR-303 Bean Validation API.

 [1]: http://sivalabs.blogspot.in/2012/02/primefaces3-tutorial-form-validation.html