---
author: siva
comments: true
date: 2011-02-02 01:27:00+00:00
layout: post
slug: primefaces-quickstart-tutorial-part1
title: PrimeFaces QuickStart Tutorial-Part1
wordpress_id: 282
categories:
- JSF
- PrimeFaces
tags:
- JSF
- PrimeFaces
---

PrimeFaces is an open source component library for JSF 2.0 with morethan 100 rich components. PrimeFaces is far better than many other JSF component libraries because of the following reasons:  
  
1. Rich set of UI components (DataTable, AutoComplete, HtmlEditor, Charts etc).  
2. No extra xml configuration is required and there is no required dependencies.  
3. Built-in Ajax based on standard JSF 2.0 Ajax APIs.  
4. Skinning Framework with 25+ built-in themes.  
5. Awesome documentation with code examples.  
  
Let us build a sample application using PrimeFaces with the following features:  
1. A Login screen which accepts username and password and authenticate the user.  
2. Upon successful login user will be shown a User Search screen. Users can search for users by their name.The search results will be displayed in a DataTable with pagination, sorting and filtering support.  
3. Upon clicking on a row the user details will be displayed in a form.  
  
First download JSF 2 jars from http://javaserverfaces.java.net/download.html  
Place the jsf-api-2.0.3.jar, jsf-impl-2.0.3.jar and jstl-1.0.2.jar jars in WEB-INF/lib folder.  
Download PrimeFaces from http://www.primefaces.org/downloads.html.  
Place primefaces-2.2.RC2.jar in WEB-INF/lib folder.  
  
Configure FacesServlet in web.xml  
  

    
    <web-app version="2.5">
    <br></br>    xmlns="http://java.sun.com/xml/ns/javaee"
    <br></br>    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    <br></br>    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" >
    <br></br>    
    <br></br>    <welcome-file-list>
    <br></br>        <welcome-file>index.jsp</welcome-file>
    <br></br>    </welcome-file-list>
    <br></br>        
    <br></br>    <servlet>
    <br></br>        <servlet-name>Faces Servlet</servlet-name>
    <br></br>        <servlet->javax.faces.webapp.FacesServlet</servlet-class>
    <br></br>        <load-on-startup>1</load-on-startup>
    <br></br>    </servlet>
    <br></br>
    <br></br>    <servlet-mapping>
    <br></br>        <servlet-name>Faces Servlet</servlet-name>
    <br></br>        <url-pattern>*.jsf</url-pattern>
    <br></br>    </servlet-mapping>
    <br></br>    
    <br></br></web-app>
    <br></br>
    <br></br>

Create faces-config.xml in WEB-INF folder.  

    
    <faces-config xmlns="http://java.sun.com/xml/ns/javaee">
    <br></br>    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    <br></br>    xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-facesconfig_2_0.xsd"
    <br></br>    version="2.0">
    <br></br>    
    <br></br>    </faces-config>
    <br></br>

  
Welcome page index.jsp just forwards to login screen.  

    
    <jsp:forward page="login.jsf"></jsp:forward>
    <br></br>

  
Create login.xhtml page.  
  

    
        
    <br></br><html xmlns="http://www.w3c.org/1999/xhtml"
    <br></br>xmlns:f="http://java.sun.com/jsf/core"
    <br></br>    xmlns:h="http://java.sun.com/jsf/html"
    <br></br>    xmlns:p="http://primefaces.prime.com.tr/ui">
    <br></br><h:head>
    <br></br>    <link href="themes/bluesky/skin.css" type="text/css" rel="stylesheet"></link></h:head>
    <br></br><h:body>
    <br></br>    </h:body>
    <br></br><center>
    <br></br>    <p:panel header="Login Form">        <h:form>
    <br></br>            <h:panelgr cellpadding="2" columns="2">
    <br></br>                <h:outputlabel value="UserName" for="#{userManagedBean.username}">
    <br></br>                <h:inputtext value="#{userManagedBean.username}" label="UserName"></h:inputtext>
    <br></br>                <h:outputlabel value="Password" for="#{userManagedBean.password}">
    <br></br>                <h:inputsecret value="#{userManagedBean.password}"></h:inputsecret>
    <br></br>                <h:commandbutton action="#{userManagedBean.login}" type="submit" value="Login"></h:commandbutton>
    <br></br>            </h:outputlabel>
    <br></br>        </h:outputlabel>
    <br></br>    </h:panelgrid>
    <br></br>    <div><h:messages></h:messages></div>    </h:form></p:panel></center>
    <br></br>
    <br></br></html>
    <br></br>

  
  
You can get the blusky theme from PrimeFaces bundle.  
  
Create home.xhtml which contains UserSearchForm, Results dataTable and UserDetails Panel.  
  

    
    	
    <br></br>
    <br></br>  
    <br></br><html xmlns="http://www.w3c.org/1999/xhtml"
    <br></br>	xmlns:f="http://java.sun.com/jsf/core"
    <br></br>	xmlns:h="http://java.sun.com/jsf/html"
    <br></br>	xmlns:p="http://primefaces.prime.com.tr/ui">
    <br></br><h:head>
    <br></br>		<link type="text/css" rel="stylesheet" href="themes/bluesky/skin.css" />
    <br></br></h:head>
    <br></br><h:body>
    <br></br><center>
    <br></br>	<h:form>
    <br></br>		<p:panel header="Users Search Form" style="width: 700;">
    <br></br>		<h:form>
    <br></br>			<h:panelGrid columns="3" cellpadding="2">
    <br></br>				<h:outputLabel for="#{userManagedBean.searchUser}" value="UserName"/>
    <br></br>				<h:inputText value="#{userManagedBean.searchUser}" label="UserName"></h:inputText>
    <br></br>				<h:commandButton type="submit" value="Search" action="#{userManagedBean.searchUser}"></h:commandButton>
    <br></br>			</h:panelGrid>
    <br></br>		</h:form>
    <br></br>		</p:panel>
    <br></br>	
    <br></br>	
    <br></br>	<p:dataTable var="user" value="#{userManagedBean.searchUsersResults}" 
    <br></br>			selection="#{userManagedBean.selectedUser}" selectionMode="single" 
    <br></br>			dynamic="true"
    <br></br>			onRowSelectUpdate="userUpdateForm"
    <br></br>			onRowUnselectUpdate="userUpdateForm"
    <br></br>			rowSelectListener="#{userManagedBean.onUserSelect}"
    <br></br>            rowUnselectListener="#{userManagedBean.onUserUnselect}"
    <br></br>			paginator="true" rows="5" style="width: 700">
    <br></br>			<p:column sortBy="#{user.userId}" filterBy="#{user.userId}">
    <br></br>				<f:facet name="header">
    <br></br>				<h:outputText value="Id" />
    <br></br>				</f:facet>
    <br></br>				<h:outputText value="#{user.userId}" />
    <br></br>				</p:column>
    <br></br>				<p:column sortBy="#{user.username}" filterBy="#{user.username}">
    <br></br>				<f:facet name="header">
    <br></br>				<h:outputText value="Name" />
    <br></br>				</f:facet>
    <br></br>				<h:outputText value="#{user.username}" />
    <br></br>				</p:column>
    <br></br>				<p:column sortBy="#{user.emailId}" filterBy="#{user.emailId}">
    <br></br>				<f:facet name="header">
    <br></br>				<h:outputText value="Email" />
    <br></br>				</f:facet>
    <br></br>				<h:outputText value="#{user.emailId}" />
    <br></br>				</p:column>
    <br></br>				<p:column parser="date" sortBy="#{user.dob}" filterBy="#{user.dob}">
    <br></br>				<f:facet name="header">
    <br></br>				<h:outputText value="DOB" />
    <br></br>				</f:facet>
    <br></br>				<h:outputText value="#{user.dob}" >
    <br></br>					<f:convertDateTime pattern="MM/dd/yyyy" />
    <br></br>				</h:outputText>
    <br></br>			</p:column>
    <br></br>		</p:dataTable>
    <br></br>		<p:panel id="userDetailsPanelId" header="Users Details" style="width: 700;">
    <br></br>		<h:panelGrid columns="2" cellpadding="2" id="userUpdateForm" border="0" >
    <br></br>				<h:outputLabel for="#{userManagedBean.selectedUser.userId}" value="UserId"/>
    <br></br>				<h:inputText value="#{userManagedBean.selectedUser.userId}" style="width: 100;" readonly="true"></h:inputText>
    <br></br>				
    <br></br>				<h:outputLabel for="#{userManagedBean.selectedUser.username}" value="Username"/>
    <br></br>				<h:inputText value="#{userManagedBean.selectedUser.username}" readonly="true"></h:inputText>
    <br></br>				
    <br></br>				<h:outputLabel for="#{userManagedBean.selectedUser.emailId}" value="EmailId"/>
    <br></br>				<h:inputText value="#{userManagedBean.selectedUser.emailId}" readonly="true"></h:inputText>
    <br></br>				
    <br></br>				<h:outputLabel for="#{userManagedBean.selectedUser.gender}" value="Gender"/>
    <br></br>				<h:inputText value="#{userManagedBean.selectedUser.gender}" readonly="true"></h:inputText>
    <br></br>				
    <br></br>				<h:outputLabel for="#{userManagedBean.selectedUser.dob}" value="DOB"/>
    <br></br>				<h:inputText value="#{userManagedBean.selectedUser.dob}" readonly="true">
    <br></br>					<f:convertDateTime pattern="MM/dd/yyyy" />
    <br></br>				</h:inputText>
    <br></br>				
    <br></br>			</h:panelGrid>
    <br></br>			</p:panel>
    <br></br>		</h:form>		
    <br></br>		</center>
    <br></br></h:body>
    <br></br></html>
    <br></br>

  
Create User.java domain class.  

    
    package com.primefaces.sample;
    <br></br>
    <br></br>import java.util.Date;
    <br></br>
    <br></br>public class User
    <br></br>{
    <br></br>    private Integer userId;
    <br></br>    private String username;
    <br></br>    private String emailId;
    <br></br>    private String phone;
    <br></br>    private Date dob;
    <br></br>    private String gender;
    <br></br>    private String address;
    <br></br>    
    <br></br>    public User()
    <br></br>    {}
    <br></br>    public User(Integer userId, String username, String emailId, String phone,
    <br></br>            Date dob, String gender, String address)
    <br></br>    {
    <br></br>        this.userId = userId;
    <br></br>        this.username = username;
    <br></br>        this.emailId = emailId;
    <br></br>        this.phone = phone;
    <br></br>        this.dob = dob;
    <br></br>        this.gender = gender;
    <br></br>        this.address = address;
    <br></br>    }
    <br></br>    //setter and getters    
    <br></br>}
    <br></br>

Create UserService.java which acts as a mock database table.  

    
    package com.primefaces.sample;
    <br></br>
    <br></br>import java.util.ArrayList;
    <br></br>import java.util.Collection;
    <br></br>import java.util.Date;
    <br></br>import java.util.HashMap;
    <br></br>import java.util.Map;
    <br></br>import java.util.Set;
    <br></br>
    <br></br>public class UserService
    <br></br>{
    <br></br>    private static final Map<Integer, User> USERS_TABLE = new HashMap<Integer, User>();
    <br></br>    static
    <br></br>    {
    <br></br>        USERS_TABLE.put(1, new User(1, "Administrator", "admin@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(2, new User(2, "Guest", "guest@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(3, new User(3, "John", "John@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(4, new User(4, "Paul", "Paul@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(5, new User(5, "raju", "raju@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(6, new User(6, "raghav", "raghav@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(7, new User(7, "caren", "caren@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(8, new User(8, "Mike", "Mike@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(9, new User(9, "Steve", "Steve@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(10, new User(10, "Polhman", "Polhman@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(11, new User(11, "Rogermoor", "Rogermoor@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(12, new User(12, "Robinhood", "Robinhood@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(13, new User(13, "Sean", "Sean@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(14, new User(14, "Gabriel", "Gabriel@gmail.com", "9247469543", new Date(), "M", "Hyderabad"));
    <br></br>        USERS_TABLE.put(15, new User(15, "raman", "raman@gmail.com", "9000510456", new Date(), "M", "Hyderabad"));
    <br></br>        
    <br></br>    }
    <br></br>    public Integer create(User user)
    <br></br>    {
    <br></br>        if(user == null)
    <br></br>        {
    <br></br>            throw new RuntimeException("Unable to create User. User object is null.");
    <br></br>        }
    <br></br>        Integer userId = this.getMaxUserId();
    <br></br>        user.setUserId(userId);
    <br></br>        USERS_TABLE.put(userId, user);
    <br></br>        return userId;
    <br></br>    }
    <br></br>
    <br></br>    public void delete(User user)
    <br></br>    {
    <br></br>        if(user == null)
    <br></br>        {
    <br></br>            throw new RuntimeException("Unable to delete User. User object is null.");
    <br></br>        }
    <br></br>        USERS_TABLE.remove(user.getUserId());
    <br></br>    }
    <br></br>
    <br></br>    public Collection<User> getAllUsers()
    <br></br>    {
    <br></br>        return USERS_TABLE.values();
    <br></br>    }
    <br></br>
    <br></br>    public User getUser(Integer userId)
    <br></br>    {
    <br></br>        return USERS_TABLE.get(userId);
    <br></br>    }
    <br></br>
    <br></br>    public Collection<User> searchUsers(String username)
    <br></br>    {
    <br></br>        String searchCriteria = (username == null)? "":username.toLowerCase().trim();
    <br></br>        Collection<User> users = USERS_TABLE.values();
    <br></br>        Collection<User> searchResults = new ArrayList<User>();
    <br></br>        for (User user : users)
    <br></br>        {
    <br></br>            if(user.getUsername() != null && user.getUsername().toLowerCase().trim().startsWith(searchCriteria))
    <br></br>            {
    <br></br>                searchResults.add(user);
    <br></br>            }
    <br></br>        }
    <br></br>        return searchResults;
    <br></br>    }
    <br></br>
    <br></br>    public void update(User user)
    <br></br>    {
    <br></br>        if(user == null || !USERS_TABLE.containsKey(user.getUserId()))
    <br></br>        {
    <br></br>            throw new RuntimeException("Unable to update User. User object is null or User Id ["+user.getUserId()+"] is invalid." );
    <br></br>        }
    <br></br>        USERS_TABLE.put(user.getUserId(), user);
    <br></br>    }
    <br></br>    
    <br></br>    protected Integer getMaxUserId()
    <br></br>    {
    <br></br>        Set<Integer> keys = USERS_TABLE.keySet();
    <br></br>        Integer maxId = 1;
    <br></br>        for (Integer key : keys)
    <br></br>        {
    <br></br>            if(key > maxId)
    <br></br>            {
    <br></br>                maxId = key;
    <br></br>            }
    <br></br>        }
    <br></br>        return maxId;
    <br></br>    }
    <br></br>}
    <br></br>
    <br></br>

Create UserManagedBean.java  

    
    package com.primefaces.sample;
    <br></br>
    <br></br>import java.util.Collection;
    <br></br>
    <br></br>import javax.faces.application.FacesMessage;
    <br></br>import javax.faces.bean.ApplicationScoped;
    <br></br>import javax.faces.bean.ManagedBean;
    <br></br>import javax.faces.context.FacesContext;
    <br></br>
    <br></br>import org.primefaces.event.SelectEvent;
    <br></br>import org.primefaces.event.UnselectEvent;
    <br></br>
    <br></br>@ManagedBean
    <br></br>@ApplicationScoped
    <br></br>public class UserManagedBean
    <br></br>{
    <br></br>    UserService userService = new UserService();
    <br></br>    
    <br></br>    private String username;
    <br></br>    private String password;
    <br></br>    private String searchUser;
    <br></br>    private Collection<User> searchUsersResults;
    <br></br>    private User selectedUser;
    <br></br>    
    <br></br>    public String getUsername()
    <br></br>    {
    <br></br>        return username;
    <br></br>    }
    <br></br>    public void setUsername(String username)
    <br></br>    {
    <br></br>        this.username = username;
    <br></br>    }
    <br></br>    public String getPassword()
    <br></br>    {
    <br></br>        return password;
    <br></br>    }
    <br></br>    public void setPassword(String password)
    <br></br>    {
    <br></br>        this.password = password;
    <br></br>    }
    <br></br>    
    <br></br>    public User getSelectedUser()
    <br></br>    {
    <br></br>        if(selectedUser == null){
    <br></br>            selectedUser = new User();
    <br></br>        }
    <br></br>        return selectedUser;
    <br></br>    }
    <br></br>    
    <br></br>    public void setSelectedUser(User selectedUser)
    <br></br>    {
    <br></br>        this.selectedUser = selectedUser;
    <br></br>    }
    <br></br>    public Collection<User> getSearchUsersResults()
    <br></br>    {
    <br></br>        return searchUsersResults;
    <br></br>    }
    <br></br>    public void setSearchUsersResults(Collection<User> searchUsersResults)
    <br></br>    {
    <br></br>        this.searchUsersResults = searchUsersResults;
    <br></br>    }
    <br></br>    public String getSearchUser()
    <br></br>    {
    <br></br>        return searchUser;
    <br></br>    }
    <br></br>    public void setSearchUser(String searchUser)
    <br></br>    {
    <br></br>        this.searchUser = searchUser;
    <br></br>    }
    <br></br>    
    <br></br>    public String login()
    <br></br>    {
    <br></br>        if("test".equalsIgnoreCase(getUsername()) && "test".equals(getPassword()))
    <br></br>        {
    <br></br>            return "home";
    <br></br>        }
    <br></br>        else
    <br></br>        {
    <br></br>            FacesContext context = FacesContext.getCurrentInstance();
    <br></br>            context.addMessage("username", new FacesMessage("Invalid UserName and Password"));
    <br></br>            return "login";
    <br></br>        }
    <br></br>    }
    <br></br>    
    <br></br>    public String searchUser()
    <br></br>    {
    <br></br>        String username = (this.searchUser == null)? "":this.searchUser.trim();        
    <br></br>        this.searchUsersResults = userService.searchUsers(username);
    <br></br>        System.out.println(searchUsersResults);
    <br></br>        return "home";
    <br></br>    }
    <br></br>    
    <br></br>    public String updateUser()
    <br></br>    {
    <br></br>        userService.update(this.selectedUser);
    <br></br>        return "home";
    <br></br>    }
    <br></br>    
    <br></br>    public void onUserSelect(SelectEvent event)
    <br></br>    {        
    <br></br>    }
    <br></br>    public void onUserUnselect(UnselectEvent event)
    <br></br>    {
    <br></br>    }
    <br></br>}
    <br></br>

That all we need to do. You can run the application and see the rich user interface with blusky theme.  
  
By default we don't get automcomplete for PrimeFaces tag  in Eclipse. To enable AutoComplete,  
Go to Window-->Preferences-->General-->ContentTypes  
Select JSP and add .xhtml as file association.  
  
  
You can download the sample as an Eclipse project [Here](https://sites.google.com/site/sivalabworks/sampleappdownloads/PrimeFaces.zip?attredirects=0&d=1)  

