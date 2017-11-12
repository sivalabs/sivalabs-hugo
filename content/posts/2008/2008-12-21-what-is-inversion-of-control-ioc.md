---
title: What is Inversion Of Control (IOC)?
author: Siva
type: post
date: 2008-12-21T04:39:00+00:00
url: /2008/12/what-is-inversion-of-control-ioc/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2008/12/what-is-inversion-of-control-ioc.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/2236738860360121078
post_views_count:
  - 3
categories:
  - Design Patterns
tags:
  - Design Patterns
  - Spring

---
**<span style="color: rgb(153, 0, 0);">Inversion Of Control</span>** is a design pattern which suggests the creation of collaborating objects and injecting them should not be done by the dependent object itself.

For example, Suppose WhetherController(Servlet) is depend on WhetherService which is depend WhetherDAO.

_**<span style="color: rgb(51, 51, 255);">WhetherController .java</span>**_  
**<span style="color: rgb(153, 51, 0);">class WhetherController extends HttpServlet</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">protected doPost(HttpServletRequest req, HttpServletResponse res) throws IOException, ServletException </span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">WhetherService service = new WhetherService(); </span>**  
**<span style="color: rgb(153, 51, 0);">service.doSomething(params);</span>**  
**<span style="color: rgb(153, 51, 0);">….</span>**  
**<span style="color: rgb(153, 51, 0);">…. </span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

<span style="color: rgb(51, 51, 255);"><em><strong>WhetherService.java</strong></em></span>  
**<span style="color: rgb(153, 51, 0);">class WhetherService</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">public void doSomething(Map params) </span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">WhetherDAO dao = new WhetherDAO();</span>**  
**<span style="color: rgb(153, 51, 0);">dao.getWhetherReport(); </span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

_**<span style="color: rgb(51, 51, 255);">WhetherDAO.java</span>**_  
**<span style="color: rgb(153, 51, 0);">class WhetherDAO</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">// code to interact with Database</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(102, 0, 0);"></span></p> 

</strong>If you code as said above and if it is a big project you may use WhetherService/WhetherDAO in several classes. Later on, Suppose due to some reasons you need to change the WhetherService/WhetherDAO class as follows.

**_<span style="color: rgb(51, 51, 255);">WhetherService.java</span>_**  
**<span style="color: rgb(153, 51, 0);">class WhetherService</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private WhetherService whetherService = new WhetherService(); </span>**  
**<span style="color: rgb(153, 51, 0);">private WhetherService(){ } </span>**  
**<span style="color: rgb(153, 51, 0);">public WhetherService getWhetherService() </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">return whetherService; </span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

_**<span style="color: rgb(51, 51, 255);">WhetherDAO.java</span>**_  
**<span style="color: rgb(153, 51, 0);">class WhetherDAO</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private JDBCConnection connection = null; </span>**  
**<span style="color: rgb(153, 51, 0);">public WhetherDAO(JDBCConnection connection) </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">this.connection = connection; </span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**  
**<span style="color: rgb(153, 51, 0);">// code to interact with Database</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

Then as you are already using WhetherService/WhetherDAO classes in several places you need to make changes in several classes, which is cumbersome task.

The mail flaw in this design is WhetherController servlet is taking the responsibilty of creating WhetherService instances and WhetherService class is taking the responsibilty of creating WhetherDAO objects. Thereby your classes are tightly coupled.

To get rid of this problem, The IOC(Inversion Of Control) Design patetern suggests that have a Container which is responsible for creation of objects and their dependent objects and injecting them and serve them. When the client requested an object from the container, the container will give full fledzed objects with all dependencies set.

Let us see how we can change the above design by following IOC design pattern.

<span style="color: rgb(51, 51, 255);"><strong><em>WhetherController .java</em></strong></span>

**<span style="color: rgb(153, 51, 0);">class WhetherController extends HttpServlet</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private WhetherService whetherService; </span>**  
**<span style="color: rgb(153, 51, 0);">public void setWhetherService(WhetherService whetherService) </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">this.whetherService = whetherService; </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

**<span style="color: rgb(153, 51, 0);">protected doPost(HttpServletRequest req, HttpServletResponse res) throws IOException,ServletException</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">this.whetherService.doSomething(params); </span>**  
**<span style="color: rgb(153, 51, 0);">….</span>**  
**<span style="color: rgb(153, 51, 0);">…. </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**_<span style="color: rgb(51, 51, 255);">WhetherService.java</span>_**  
**<span style="color: rgb(153, 51, 0);">class WhetherService</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private WhetherDAO whetherDAO ; </span>**  
**<span style="color: rgb(153, 51, 0);">public void setWhetherDAO(WhetherDAO whetherDAO) </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">this.whetherDAO =whetherDAO; </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">public void doSomething(Map params) </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">this.whetherDAO.getWhetherReport();</span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

**_<span style="color: rgb(51, 51, 255);">WhetherDAO.java</span>_**  
**<span style="color: rgb(153, 51, 0);">class WhetherDAO</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private JDBCConnection connection = null; </span>**  
**<span style="color: rgb(153, 51, 0);">public WhetherDAO(JDBCConnection connection) </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">this.connection = connection; </span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**  
**<span style="color: rgb(153, 51, 0);">// code to interact with Database</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**

**_<span style="color: rgb(51, 51, 255);">Container.java</span>_**

**<span style="color: rgb(153, 51, 0);">public class Container</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private static Map<string,object> objectMap = new HashMap<string,object>();<br />static </string,object></string,object></span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">JDBCConnection connection = new JDBCConnection(); </span>**  
**<span style="color: rgb(153, 51, 0);">objectMap.put(”connection”,connection); </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">WhetherDAO whetherDAO = new WhetherDAO(connection); </span>**  
**<span style="color: rgb(153, 51, 0);">objectMap.put(”whetherDAO”,whetherDAO); </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">WhetherService whetherService = new WhetherService(); </span>**  
**<span style="color: rgb(153, 51, 0);">whetherService.setWhetherDAO(whetherDAO); </span>**  
**<span style="color: rgb(153, 51, 0);">objectMap.put(”whetherService”,whetherService); </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">public static Object getObject(String objectId) </span>**  
**<span style="color: rgb(153, 51, 0);">{</span>**  
**<span style="color: rgb(153, 51, 0);">Object obj = objectMap.get(objectId);</span>**  
**<span style="color: rgb(153, 51, 0);">if(obj==null) </span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">throw new RuntimeException(”Invalid objectId is given”); </span>**  
**<span style="color: rgb(153, 51, 0);">} return obj;</span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
<span style="color: rgb(153, 51, 0);"></span>  
Now the WhetherController servlet can be changed as follows:

<span style="color: rgb(51, 51, 255);"><strong><em>WhetherController .java</em></strong></span>

**<span style="color: rgb(153, 51, 0);">class WhetherController extends HttpServlet</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">private WhetherService whetherService;</span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">public WhetherController() </span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">WhetherService whetherService =(WhetherService)</span>**  
**<span style="color: rgb(153, 51, 0);">Container.getObject(”whetherService”); </span>**  
**<span style="color: rgb(153, 51, 0);">setWhetherService(whetherService); </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">public void setWhetherService(WhetherService whetherService)</span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">this.whetherService = whetherService; </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);"></span>**  
**<span style="color: rgb(153, 51, 0);">protected doPost(HttpServletRequest req, HttpServletResponse res) throws IOException,ServletException </span>**  
**<span style="color: rgb(153, 51, 0);">{ </span>**  
**<span style="color: rgb(153, 51, 0);">this.whetherService.doSomething(params); </span>**  
**<span style="color: rgb(153, 51, 0);">…. </span>**  
**<span style="color: rgb(153, 51, 0);">…. </span>**  
**<span style="color: rgb(153, 51, 0);">} </span>**  
**<span style="color: rgb(153, 51, 0);">}</span>**

Now if you need to change the way of object creation the only place we need to modify Container class only.

Today there are several IOC container are available implemented using Java such as Spring, Pico etc.Among them Spring becomes very much popular as it is not only the IOC container.

Spring became an Application Framework which provides several features in all the layers such as web/service/dao layers. Unlike the other frameworks like Struts/Hibernate, Spring is not limited to only Web/Persistence layers. And one more great feature of Spring is pluggability with other frameworks.

Spring can be used with several other pupular frameworks like Struts1.x, Struts2,JSF, WebWork,IBatis,Hibernate, EJB etc.

For more information on Spring,visit <http://static.springframework.org/spring/docs/2.5.x/reference/index.html>