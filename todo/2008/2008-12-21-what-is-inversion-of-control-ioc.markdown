---
author: siva
comments: true
date: 2008-12-21 10:09:00+00:00
layout: post
slug: what-is-inversion-of-control-ioc
title: What is Inversion Of Control (IOC)?
wordpress_id: 312
categories:
- Design Patterns
- Spring
tags:
- Design Patterns
- Spring
---

**Inversion Of Control** is a design pattern which suggests the creation of collaborating objects and injecting them should not be done by the dependent object itself.  
  
For example, Suppose WhetherController(Servlet) is depend on WhetherService which is depend WhetherDAO.  
  
_**WhetherController .java**_  
**class WhetherController extends HttpServlet**  
**{ **  
**protected doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException **  
**{ **  
**WhetherService service = new WhetherService(); **  
**service.doSomething(params);**  
**….**  
**…. **  
**}**  
**} **  
  
_**WhetherService.java**_  
**class WhetherService**  
**{ **  
**public void doSomething(Map params) **  
**{ **  
**WhetherDAO dao = new WhetherDAO();**  
**dao.getWhetherReport(); **  
**}**  
**} **  
  
_**WhetherDAO.java**_  
**class WhetherDAO**  
**{ **  
**// code to interact with Database**  
**} **  
**  
  
**If you code as said above and if it is a big project you may use WhetherService/WhetherDAO in several classes. Later on, Suppose due to some reasons you need to change the WhetherService/WhetherDAO class as follows.  
  
**_WhetherService.java_**  
**class WhetherService**  
**{ **  
**private WhetherService whetherService = new WhetherService(); **  
**private WhetherService(){ } **  
**public WhetherService getWhetherService() **  
**{**  
**return whetherService; **  
**}**  
**} **  
  
_**WhetherDAO.java**_  
**class WhetherDAO**  
**{ **  
**private JDBCConnection connection = null; **  
**public WhetherDAO(JDBCConnection connection) **  
**{**  
**this.connection = connection; **  
**}**  
**// code to interact with Database**  
**} **  
  
Then as you are already using WhetherService/WhetherDAO classes in several places you need to make changes in several classes, which is cumbersome task.  
  
The mail flaw in this design is WhetherController servlet is taking the responsibilty of creating WhetherService instances and WhetherService class is taking the responsibilty of creating WhetherDAO objects. Thereby your classes are tightly coupled.  
  
  
To get rid of this problem, The IOC(Inversion Of Control) Design patetern suggests that have a Container which is responsible for creation of objects and their dependent objects and injecting them and serve them. When the client requested an object from the container, the container will give full fledzed objects with all dependencies set.  
  
Let us see how we can change the above design by following IOC design pattern.  
  
**_WhetherController .java_**  
  
**class WhetherController extends HttpServlet**  
**{ **  
**private WhetherService whetherService; **  
**public void setWhetherService(WhetherService whetherService) **  
**{**  
**this.whetherService = whetherService; **  
**} **  
  
**protected doPost(HttpServletRequest req, HttpServletResponse res) throws IOException,ServletException**  
**{ **  
**this.whetherService.doSomething(params); **  
**….**  
**…. **  
**} **  
**} **  
****  
**_WhetherService.java_**  
**class WhetherService**  
**{ **  
**private WhetherDAO whetherDAO ; **  
**public void setWhetherDAO(WhetherDAO whetherDAO) **  
**{**  
**this.whetherDAO =whetherDAO; **  
**} **  
****  
**public void doSomething(Map params) **  
**{**  
**this.whetherDAO.getWhetherReport();**  
**}**  
**} **  
  
**_WhetherDAO.java_**  
**class WhetherDAO**  
**{ **  
**private JDBCConnection connection = null; **  
**public WhetherDAO(JDBCConnection connection) **  
**{**  
**this.connection = connection; **  
**}**  
**// code to interact with Database**  
**} **  
  
**_Container.java_**  
  
**public class Container**  
**{ **  
**private static Map objectMap = new HashMap();  
static **  
**{ **  
**JDBCConnection connection = new JDBCConnection(); **  
**objectMap.put(”connection”,connection); **  
****  
**WhetherDAO whetherDAO = new WhetherDAO(connection); **  
**objectMap.put(”whetherDAO”,whetherDAO); **  
****  
**WhetherService whetherService = new WhetherService(); **  
**whetherService.setWhetherDAO(whetherDAO); **  
**objectMap.put(”whetherService”,whetherService); **  
****  
**} **  
****  
**public static Object getObject(String objectId) **  
**{**  
**Object obj = objectMap.get(objectId);**  
**if(obj==null) **  
**{ **  
**throw new RuntimeException(”Invalid objectId is given”); **  
**} return obj;**  
**} **  
**} **  
  
Now the WhetherController servlet can be changed as follows:  
  
**_WhetherController .java_**  
  
**class WhetherController extends HttpServlet**  
**{ **  
**private WhetherService whetherService;**  
****  
**public WhetherController() **  
**{ **  
**WhetherService whetherService =(WhetherService)**  
**Container.getObject(”whetherService”); **  
**setWhetherService(whetherService); **  
**} **  
****  
**public void setWhetherService(WhetherService whetherService)**  
**{ **  
**this.whetherService = whetherService; **  
**} **  
****  
**protected doPost(HttpServletRequest req, HttpServletResponse res) throws IOException,ServletException **  
**{ **  
**this.whetherService.doSomething(params); **  
**…. **  
**…. **  
**} **  
**}**  
  
Now if you need to change the way of object creation the only place we need to modify Container class only.  
  
Today there are several IOC container are available implemented using Java such as Spring, Pico etc.Among them Spring becomes very much popular as it is not only the IOC container.  
  
Spring became an Application Framework which provides several features in all the layers such as web/service/dao layers. Unlike the other frameworks like Struts/Hibernate, Spring is not limited to only Web/Persistence layers. And one more great feature of Spring is pluggability with other frameworks.  
  
Spring can be used with several other pupular frameworks like Struts1.x, Struts2,JSF, WebWork,IBatis,Hibernate, EJB etc.  
  
For more information on Spring,visit [http://static.springframework.org/spring/docs/2.5.x/reference/index.html](http://static.springframework.org/spring/docs/2.5.x/reference/index.html)
