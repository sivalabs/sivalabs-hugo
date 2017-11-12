---
title: PrimeFaces QuickStart Tutorial-Part1
author: Siva
type: post
draft: true
date: 2011-02-01T19:57:00+00:00
url: /2011/02/primefaces-quickstart-tutorial-part1/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/02/primefaces-quickstart-tutorial-part1.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/1655268373944454831
post_views_count:
  - 22
categories:
  - JavaEE
tags:
  - JSF
  - PrimeFaces

---
PrimeFaces is an open source component library for JSF 2.0 with morethan 100 rich components. PrimeFaces is far better than many other JSF component libraries because of the following reasons:

&nbsp;&nbsp;&nbsp; 1. Rich set of UI components (DataTable, AutoComplete, HtmlEditor, Charts etc).  
&nbsp;&nbsp;&nbsp; 2. No extra xml configuration is required and there is no required dependencies.  
&nbsp;&nbsp;&nbsp; 3. Built-in Ajax based on standard JSF 2.0 Ajax APIs.  
&nbsp;&nbsp;&nbsp; 4. Skinning Framework with 25+ built-in themes.  
&nbsp;&nbsp;&nbsp; 5. Awesome documentation with code examples.  
&nbsp;&nbsp;&nbsp;   
Let us build a sample application using PrimeFaces with the following features:  
1. A Login screen which accepts username and password and authenticate the user.  
2. Upon successful login user will be shown a User Search screen. Users can search for users by their name.The search results will be displayed in a DataTable with pagination, sorting and filtering support.  
3. Upon clicking on a row the user details will be displayed in a form.

First download JSF 2 jars from http://javaserverfaces.java.net/download.html  
Place the jsf-api-2.0.3.jar, jsf-impl-2.0.3.jar and jstl-1.0.2.jar jars in WEB-INF/lib folder.  
Download PrimeFaces from http://www.primefaces.org/downloads.html.  
Place primefaces-2.2.RC2.jar in WEB-INF/lib folder.

Configure FacesServlet in web.xml

<pre>&lt;web-app version="2.5"&gt;
<br />&nbsp;&nbsp;&nbsp; xmlns="http://java.sun.com/xml/ns/javaee"
<br />&nbsp;&nbsp;&nbsp; xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
<br />&nbsp;&nbsp;&nbsp; xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" &gt;
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; &lt;welcome-file-list>
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &lt;welcome-file>index.jsp&lt;/welcome-file>
<br />&nbsp;&nbsp;&nbsp; &lt;/welcome-file-list>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; &lt;servlet>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;servlet-name>Faces Servlet&lt;/servlet-name>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;servlet->javax.faces.webapp.FacesServlet&lt;/servlet-class>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;load-on-startup>1&lt;/load-on-startup>
<br />&nbsp;&nbsp;&nbsp; &lt;/servlet>
<br />
<br />&nbsp;&nbsp;&nbsp; &lt;servlet-mapping>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;servlet-name>Faces Servlet&lt;/servlet-name>
<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &lt;url-pattern>*.jsf&lt;/url-pattern>
<br />&nbsp;&nbsp;&nbsp; &lt;/servlet-mapping>
<br />&nbsp;&nbsp;&nbsp; 
<br />&lt;/web-app&gt;
<br />
<br /></pre>

Create faces-config.xml in WEB-INF folder.

<pre>&lt;faces-config xmlns="http://java.sun.com/xml/ns/javaee">
<br />&nbsp;&nbsp;&nbsp; xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
<br />&nbsp;&nbsp;&nbsp; xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-facesconfig_2_0.xsd"
<br />&nbsp;&nbsp;&nbsp; version="2.0"&gt;
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; &lt;/faces-config>
<br /></pre>

Welcome page index.jsp just forwards to login screen.

<pre>&lt;jsp:forward page="login.jsf">&lt;/jsp:forward>
<br /></pre>

Create login.xhtml page.

<pre>&nbsp;&nbsp;&nbsp; 
<br /><html xmlns="http://www.w3c.org/1999/xhtml"
<br />xmlns:f="http://java.sun.com/jsf/core"
<br />&nbsp;&nbsp;&nbsp; xmlns:h="http://java.sun.com/jsf/html"
<br />&nbsp;&nbsp;&nbsp; xmlns:p="http://primefaces.prime.com.tr/ui">
<br /><h:head>
<br />&nbsp;&nbsp;&nbsp; 

<link href="themes/bluesky/skin.css" rel="stylesheet" type="text/css" />
</link></h:head>

<br /><h:body>
<br />&nbsp;&nbsp;&nbsp; </h:body>
<br />

<center>
  <br />&nbsp;&nbsp;&nbsp; 
  
  <p:panel header="Login Form">
    &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:form>
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:panelgr cellpadding="2" columns="2">
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:outputlabel for="#{userManagedBean.username}" value="UserName">
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:inputtext label="UserName" value="#{userManagedBean.username}"></h:inputtext>
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:outputlabel for="#{userManagedBean.password}" value="Password">
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:inputsecret value="#{userManagedBean.password}"></h:inputsecret>
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; <h:commandbutton action="#{userManagedBean.login}" type="submit" value="Login"></h:commandbutton>
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; </h:outputlabel>
    <br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; </h:outputlabel>
    <br />&nbsp;&nbsp;&nbsp; </h:panelgrid>
    <br />&nbsp;&nbsp;&nbsp; 
    
    <div>
      <h:messages></h:messages>
    </div>&nbsp;&nbsp;&nbsp; </h:form></p:panel></center>
    
    
    <br />
    <br /></html>
    <br /></pre>
    
    
    <p>
      You can get the blusky theme from PrimeFaces bundle.
    </p>
    
    
    <p>
      Create home.xhtml which contains UserSearchForm, Results dataTable and UserDetails Panel.
    </p>
    
    
    <pre>	
<br />
<br />  
<br />&lt;html xmlns="http://www.w3c.org/1999/xhtml"
<br />	xmlns:f="http://java.sun.com/jsf/core"
<br />	xmlns:h="http://java.sun.com/jsf/html"
<br />	xmlns:p="http://primefaces.prime.com.tr/ui"&gt;
<br />&lt;h:head&gt;
<br />		&lt;link type="text/css" rel="stylesheet" href="themes/bluesky/skin.css" /&gt;
<br />&lt;/h:head&gt;
<br />&lt;h:body&gt;
<br />&lt;center&gt;
<br />	&lt;h:form&gt;
<br />		&lt;p:panel header="Users Search Form" style="width: 700;"&gt;
<br />		&lt;h:form&gt;
<br />			&lt;h:panelGrid columns="3" cellpadding="2"&gt;
<br />				&lt;h:outputLabel for="#{userManagedBean.searchUser}" value="UserName"/&gt;
<br />				&lt;h:inputText value="#{userManagedBean.searchUser}" label="UserName"&gt;&lt;/h:inputText&gt;
<br />				&lt;h:commandButton type="submit" value="Search" action="#{userManagedBean.searchUser}"&gt;&lt;/h:commandButton&gt;
<br />			&lt;/h:panelGrid&gt;
<br />		&lt;/h:form&gt;
<br />		&lt;/p:panel&gt;
<br />	
<br />	
<br />	&lt;p:dataTable var="user" value="#{userManagedBean.searchUsersResults}" 
<br />			selection="#{userManagedBean.selectedUser}" selectionMode="single" 
<br />			dynamic="true"
<br />			onRowSelectUpdate="userUpdateForm"
<br />			onRowUnselectUpdate="userUpdateForm"
<br />			rowSelectListener="#{userManagedBean.onUserSelect}"
<br />            rowUnselectListener="#{userManagedBean.onUserUnselect}"
<br />			paginator="true" rows="5" style="width: 700"&gt;
<br />			&lt;p:column sortBy="#{user.userId}" filterBy="#{user.userId}"&gt;
<br />				&lt;f:facet name="header"&gt;
<br />				&lt;h:outputText value="Id" /&gt;
<br />				&lt;/f:facet&gt;
<br />				&lt;h:outputText value="#{user.userId}" /&gt;
<br />				&lt;/p:column&gt;
<br />				&lt;p:column sortBy="#{user.username}" filterBy="#{user.username}"&gt;
<br />				&lt;f:facet name="header"&gt;
<br />				&lt;h:outputText value="Name" /&gt;
<br />				&lt;/f:facet&gt;
<br />				&lt;h:outputText value="#{user.username}" /&gt;
<br />				&lt;/p:column&gt;
<br />				&lt;p:column sortBy="#{user.emailId}" filterBy="#{user.emailId}"&gt;
<br />				&lt;f:facet name="header"&gt;
<br />				&lt;h:outputText value="Email" /&gt;
<br />				&lt;/f:facet&gt;
<br />				&lt;h:outputText value="#{user.emailId}" /&gt;
<br />				&lt;/p:column&gt;
<br />				&lt;p:column parser="date" sortBy="#{user.dob}" filterBy="#{user.dob}"&gt;
<br />				&lt;f:facet name="header"&gt;
<br />				&lt;h:outputText value="DOB" /&gt;
<br />				&lt;/f:facet&gt;
<br />				&lt;h:outputText value="#{user.dob}" &gt;
<br />					&lt;f:convertDateTime pattern="MM/dd/yyyy" /&gt;
<br />				&lt;/h:outputText&gt;
<br />			&lt;/p:column&gt;
<br />		&lt;/p:dataTable&gt;
<br />		&lt;p:panel id="userDetailsPanelId" header="Users Details" style="width: 700;"&gt;
<br />		&lt;h:panelGrid columns="2" cellpadding="2" id="userUpdateForm" border="0" &gt;
<br />				&lt;h:outputLabel for="#{userManagedBean.selectedUser.userId}" value="UserId"/&gt;
<br />				&lt;h:inputText value="#{userManagedBean.selectedUser.userId}" style="width: 100;" readonly="true"&gt;&lt;/h:inputText&gt;
<br />				
<br />				&lt;h:outputLabel for="#{userManagedBean.selectedUser.username}" value="Username"/&gt;
<br />				&lt;h:inputText value="#{userManagedBean.selectedUser.username}" readonly="true"&gt;&lt;/h:inputText&gt;
<br />				
<br />				&lt;h:outputLabel for="#{userManagedBean.selectedUser.emailId}" value="EmailId"/&gt;
<br />				&lt;h:inputText value="#{userManagedBean.selectedUser.emailId}" readonly="true"&gt;&lt;/h:inputText&gt;
<br />				
<br />				&lt;h:outputLabel for="#{userManagedBean.selectedUser.gender}" value="Gender"/&gt;
<br />				&lt;h:inputText value="#{userManagedBean.selectedUser.gender}" readonly="true"&gt;&lt;/h:inputText&gt;
<br />				
<br />				&lt;h:outputLabel for="#{userManagedBean.selectedUser.dob}" value="DOB"/&gt;
<br />				&lt;h:inputText value="#{userManagedBean.selectedUser.dob}" readonly="true"&gt;
<br />					&lt;f:convertDateTime pattern="MM/dd/yyyy" /&gt;
<br />				&lt;/h:inputText&gt;
<br />				
<br />			&lt;/h:panelGrid&gt;
<br />			&lt;/p:panel&gt;
<br />		&lt;/h:form&gt;		
<br />		&lt;/center&gt;
<br />&lt;/h:body&gt;
<br />&lt;/html&gt;
<br /></pre>
    
    
    <p>
      Create User.java domain class.
    </p>
    
    
    <pre>package com.primefaces.sample;
<br />
<br />import java.util.Date;
<br />
<br />public class User
<br />{
<br />&nbsp;&nbsp;&nbsp; private Integer userId;
<br />&nbsp;&nbsp;&nbsp; private String username;
<br />&nbsp;&nbsp;&nbsp; private String emailId;
<br />&nbsp;&nbsp;&nbsp; private String phone;
<br />&nbsp;&nbsp;&nbsp; private Date dob;
<br />&nbsp;&nbsp;&nbsp; private String gender;
<br />&nbsp;&nbsp;&nbsp; private String address;
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public User()
<br />&nbsp;&nbsp;&nbsp; {}
<br />&nbsp;&nbsp;&nbsp; public User(Integer userId, String username, String emailId, String phone,
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Date dob, String gender, String address)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.userId = userId;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.username = username;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.emailId = emailId;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.phone = phone;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.dob = dob;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.gender = gender;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.address = address;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; //setter and getters&nbsp;&nbsp;&nbsp; 
<br />}
<br /></pre>
    
    
    <p>
      Create UserService.java which acts as a mock database table.
    </p>
    
    
    <pre>package com.primefaces.sample;
<br />
<br />import java.util.ArrayList;
<br />import java.util.Collection;
<br />import java.util.Date;
<br />import java.util.HashMap;
<br />import java.util.Map;
<br />import java.util.Set;
<br />
<br />public class UserService
<br />{
<br />&nbsp;&nbsp;&nbsp; private static final Map&lt;Integer, User&gt; USERS_TABLE = new HashMap&lt;Integer, User&gt;();
<br />&nbsp;&nbsp;&nbsp; static
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(1, new User(1, "Administrator", "admin@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(2, new User(2, "Guest", "guest@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(3, new User(3, "John", "John@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(4, new User(4, "Paul", "Paul@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(5, new User(5, "raju", "raju@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(6, new User(6, "raghav", "raghav@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(7, new User(7, "caren", "caren@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(8, new User(8, "Mike", "Mike@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(9, new User(9, "Steve", "Steve@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(10, new User(10, "Polhman", "Polhman@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(11, new User(11, "Rogermoor", "Rogermoor@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(12, new User(12, "Robinhood", "Robinhood@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(13, new User(13, "Sean", "Sean@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(14, new User(14, "Gabriel", "Gabriel@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(15, new User(15, "raman", "raman@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public Integer create(User user)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if(user == null)
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; throw new RuntimeException("Unable to create User. User object is null.");
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Integer userId = this.getMaxUserId();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; user.setUserId(userId);
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(userId, user);
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return userId;
<br />&nbsp;&nbsp;&nbsp; }
<br />
<br />&nbsp;&nbsp;&nbsp; public void delete(User user)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if(user == null)
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; throw new RuntimeException("Unable to delete User. User object is null.");
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.remove(user.getUserId());
<br />&nbsp;&nbsp;&nbsp; }
<br />
<br />&nbsp;&nbsp;&nbsp; public Collection&lt;User&gt; getAllUsers()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return USERS_TABLE.values();
<br />&nbsp;&nbsp;&nbsp; }
<br />
<br />&nbsp;&nbsp;&nbsp; public User getUser(Integer userId)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return USERS_TABLE.get(userId);
<br />&nbsp;&nbsp;&nbsp; }
<br />
<br />&nbsp;&nbsp;&nbsp; public Collection&lt;User&gt; searchUsers(String username)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String searchCriteria = (username == null)? "":username.toLowerCase().trim();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Collection&lt;User&gt; users = USERS_TABLE.values();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Collection&lt;User&gt; searchResults = new ArrayList&lt;User&gt;();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; for (User user : users)
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if(user.getUsername() != null && user.getUsername().toLowerCase().trim().startsWith(searchCriteria))
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; searchResults.add(user);
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return searchResults;
<br />&nbsp;&nbsp;&nbsp; }
<br />
<br />&nbsp;&nbsp;&nbsp; public void update(User user)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if(user == null || !USERS_TABLE.containsKey(user.getUserId()))
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; throw new RuntimeException("Unable to update User. User object is null or User Id ["+user.getUserId()+"] is invalid." );
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; USERS_TABLE.put(user.getUserId(), user);
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; protected Integer getMaxUserId()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Set&lt;Integer&gt; keys = USERS_TABLE.keySet();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; Integer maxId = 1;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; for (Integer key : keys)
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if(key &gt; maxId)
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; maxId = key;
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return maxId;
<br />&nbsp;&nbsp;&nbsp; }
<br />}
<br />
<br /></pre>
    
    
    <p>
      Create UserManagedBean.java
    </p>
    
    
    <pre>package com.primefaces.sample;
<br />
<br />import java.util.Collection;
<br />
<br />import javax.faces.application.FacesMessage;
<br />import javax.faces.bean.ApplicationScoped;
<br />import javax.faces.bean.ManagedBean;
<br />import javax.faces.context.FacesContext;
<br />
<br />import org.primefaces.event.SelectEvent;
<br />import org.primefaces.event.UnselectEvent;
<br />
<br />@ManagedBean
<br />@ApplicationScoped
<br />public class UserManagedBean
<br />{
<br />&nbsp;&nbsp;&nbsp; UserService userService = new UserService();
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; private String username;
<br />&nbsp;&nbsp;&nbsp; private String password;
<br />&nbsp;&nbsp;&nbsp; private String searchUser;
<br />&nbsp;&nbsp;&nbsp; private Collection&lt;User&gt; searchUsersResults;
<br />&nbsp;&nbsp;&nbsp; private User selectedUser;
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public String getUsername()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return username;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public void setUsername(String username)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.username = username;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public String getPassword()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return password;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public void setPassword(String password)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.password = password;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public User getSelectedUser()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if(selectedUser == null){
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; selectedUser = new User();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return selectedUser;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public void setSelectedUser(User selectedUser)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.selectedUser = selectedUser;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public Collection&lt;User&gt; getSearchUsersResults()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return searchUsersResults;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public void setSearchUsersResults(Collection&lt;User&gt; searchUsersResults)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.searchUsersResults = searchUsersResults;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public String getSearchUser()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return searchUser;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public void setSearchUser(String searchUser)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.searchUser = searchUser;
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public String login()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; if("test".equalsIgnoreCase(getUsername()) && "test".equals(getPassword()))
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return "home";
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; else
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; FacesContext context = FacesContext.getCurrentInstance();
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; context.addMessage("username", new FacesMessage("Invalid UserName and Password"));
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return "login";
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public String searchUser()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; String username = (this.searchUser == null)? "":this.searchUser.trim();&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; this.searchUsersResults = userService.searchUsers(username);
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; System.out.println(searchUsersResults);
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return "home";
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public String updateUser()
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; userService.update(this.selectedUser);
<br />&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; return "home";
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; public void onUserSelect(SelectEvent event)
<br />&nbsp;&nbsp;&nbsp; {&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; 
<br />&nbsp;&nbsp;&nbsp; }
<br />&nbsp;&nbsp;&nbsp; public void onUserUnselect(UnselectEvent event)
<br />&nbsp;&nbsp;&nbsp; {
<br />&nbsp;&nbsp;&nbsp; }
<br />}
<br /></pre>
    
    
    <p>
      That all we need to do. You can run the application and see the rich user interface with blusky theme.
    </p>
    
    
    <p>
      By default we don&#8217;t get automcomplete for PrimeFaces tag  in Eclipse. To enable AutoComplete,<br />Go to Window&#8211;>Preferences&#8211;>General&#8211;>ContentTypes<br />Select JSP and add .xhtml as file association.
    </p>
    
    
    <p>
      You can download the sample as an Eclipse project <a href="https://sites.google.com/site/sivalabworks/sampleappdownloads/PrimeFaces.zip?attredirects=0&d=1">Here</a>
    </p>
