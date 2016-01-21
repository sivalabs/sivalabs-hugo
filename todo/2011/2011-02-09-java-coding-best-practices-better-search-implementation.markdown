---
author: siva
comments: true
date: 2011-02-09 02:22:00+00:00
layout: post
slug: java-coding-best-practices-better-search-implementation
title: 'Java Coding Best Practices: Better Search Implementation'
wordpress_id: 280
categories:
- Best Practices
- Java
tags:
- Best Practices
- Java
---

In web applications searching for information based on the selected criteria and displaying the results is a very common requirement.  
Suppose we need to search users based on their name.  The end user will enter the username in the textbox and hit the search button and the user results will be fetched from database and display in a grid.  
In the first look it looks simple and we start to implement it as follows:  
  

    
    public class UserSearchAction extends Action<br></br>{<br></br> public ActionForward execute(...)<br></br> {<br></br>  SearchForm sf = (SearchForm)form;<br></br>  String searchName = sf.getSearchName();<br></br>  UserService userService = new UserService();<br></br>  List<User> searchResults = userService.search(searchName);<br></br>  //put search results in request and dsplay in JSP<br></br> }<br></br><br></br>}<br></br>
    
    public class UserService<br></br>{<br></br> public List<User> search(String username)<br></br> {<br></br>  // query the DB and get the results by applying filter on USERNAME column<br></br>  List<User> users = UserDAO.search(username);<br></br> }<br></br>}<br></br>

The above implementation works fine for the current requirement.  
  
Later client wants to display only 10 rows per page and display a message like "Displaying 1-10 of 35 Users".  
  
Now we need to change the above code for the change request.  

    
    public class UserSearchAction extends Action<br></br>{<br></br> public ActionForward execute(...)<br></br> {<br></br>  SearchForm sf = (SearchForm)form;<br></br>  String searchName = sf.getSearchName();<br></br>  UserService userService = new UserService();<br></br>  Map<String, Object> searchResultsMap = userService.search(searchName, start, pageSize);<br></br>  List<User> users = (List<User>)searchResultsMap.get("DATA");<br></br>  Integer count = (Integer)searchResultsMap.get("COUNT");<br></br>  //put search results in request and dsplay in JSP<br></br> }<br></br><br></br>}<br></br>
    
    public class UserService<br></br>{<br></br> public Map<String, Object> search(String username, int start, int pageSize)<br></br> {<br></br>  //Get the total number of results for this criteria<br></br>  int count = UserDAO.searchResultsCount(username);<br></br>  // query the DB and get the start to start+pageSize results by applying filter on USERNAME column<br></br>  List<User> users = UserDAO.search(username, start, pageSize);<br></br>  Map<String, Object> RESULTS_MAP = new HashMap<String, Object>();<br></br>  RESULTS_MAP.put("DATA",users);<br></br>  RESULTS_MAP.put("COUNT",count);<br></br>  return RESULTS_MAP;<br></br> }<br></br>}<br></br>

Later Client again wants to give an option to the end user to choose the search type either by UserID or by Username and show the paginated results.  
Now we need to change the above code for the change request.  

    
    public class UserSearchAction extends Action<br></br>{<br></br> public ActionForward execute(...)<br></br> {<br></br>  SearchForm sf = (SearchForm)form;<br></br>  String searchName = sf.getSearchName();<br></br>  String searchId = sf.getSearchId();<br></br>  UserService userService = new UserService();<br></br>  Map<String, Object> searchCriteriaMap = new HashMap<String, Object>();<br></br>  //searchCriteriaMap.put("SEARCH_BY","NAME");<br></br>  searchCriteriaMap.put("SEARCH_BY","ID");<br></br>  searchCriteriaMap.put("ID",searchId);<br></br>  searchCriteriaMap.put("START",start);<br></br>  searchCriteriaMap.put("PAGESIZE",pageSize);<br></br>    <br></br>  Map<String, Object> searchResultsMap = userService.search(searchCriteriaMap);<br></br>  List<User> users = (List<User>)searchResultsMap.get("DATA");<br></br>  Integer count = (Integer)searchResultsMap.get("COUNT");<br></br>  //put search results in request and dsplay in JSP<br></br> }<br></br><br></br>}<br></br>
    
    public class UserService<br></br>{<br></br> public Map<String, Object> search(Map<String, Object> searchCriteriaMap)<br></br> {<br></br>  return UserDAO.search(searchCriteriaMap);<br></br> }<br></br>}<br></br>
    
    public class UserDAO<br></br>{<br></br> public Map<String, Object> search(Map<String, Object> searchCriteriaMap)<br></br> {<br></br>  String SEARCH_BY = (String)searchCriteriaMap.get("SEARCH_BY"); <br></br>  int start = (Integer)searchCriteriaMap.get("START"); <br></br>  int pageSize = (Integer)searchCriteriaMap.get("PAGESIZE");<br></br>  if("ID".equals(SEARCH_BY))<br></br>  {<br></br>   int id = (Integer)searchCriteriaMap.get("ID"); <br></br>   //Get the total number of results for this criteria<br></br>   int count = UserDAO.searchResultsCount(id);<br></br>   // query the DB and get the start to start+pageSize results <br></br>   //by applying filter on USER_ID column<br></br>   List<User> users = search(id, start, pageSize);<br></br>  <br></br>  }<br></br>  else<br></br>  {<br></br>   String username = (String)searchCriteriaMap.get("USERNAME"); <br></br>   //Get the total number of results for this criteria<br></br>   int count = UserDAO.searchResultsCount(username);<br></br>   // query the DB and get the start to start+pageSize results <br></br>   //by applying filter on USERNAME column<br></br>   List<User> users = search(username, start, pageSize);<br></br>  <br></br>  }<br></br>  Map<String, Object> RESULTS_MAP = new HashMap<String, Object>();<br></br>  RESULTS_MAP.put("DATA",users);<br></br>  RESULTS_MAP.put("COUNT",count);<br></br>  return RESULTS_MAP;<br></br> }<br></br><br></br>}<br></br>

Finally the code became a big mess and completely violating the object oriented principles. There are lot of problems with the above code.  
1. For each change request the method signatures are changing  
2. Code needs to be changed for each enhancement like adding more search criteria  
  
We can design a better object model for this kind of search functionality which is Object Oriented and enhancable as follws.  
  
A generic SearchCriteria which holds common search criteria like pagination, sorting details.  

    
    package com.sivalabs.javabp;<br></br>public abstract class SearchCriteria<br></br>{<br></br> private boolean pagination = false;<br></br> private int pageSize = 25;<br></br> private String sortOrder = "ASC";<br></br> <br></br> public boolean isPagination()<br></br> {<br></br>  return pagination;<br></br> }<br></br> public void setPagination(boolean pagination)<br></br> {<br></br>  this.pagination = pagination;<br></br> }<br></br> public String getSortOrder()<br></br> {<br></br>  return sortOrder;<br></br> }<br></br> public void setSortOrder(String sortOrder)<br></br> {<br></br>  this.sortOrder = sortOrder;<br></br> }<br></br> public int getPageSize()<br></br> {<br></br>  return pageSize;<br></br> }<br></br> public void setPageSize(int pageSize)<br></br> {<br></br>  this.pageSize = pageSize;<br></br> }<br></br> <br></br>}<br></br>

  
A generic SearchResults object which holds the actual results and other detials like total available results count, page wise results provider etc.  
  

    
    package com.sivalabs.javabp;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.List;<br></br><br></br>public abstract class SearchResults<T><br></br>{<br></br> private int totalResults = 0;<br></br> private int pageSize = 25;<br></br> private List<T> results = null;<br></br> <br></br> public int getPageSize()<br></br> {<br></br>  return pageSize;<br></br> }<br></br> public void setPageSize(int pageSize)<br></br> {<br></br>  this.pageSize = pageSize;<br></br> } <br></br> public int getTotalResults()<br></br> {<br></br>  return totalResults;<br></br> }<br></br> private void setTotalResults(int totalResults)<br></br> {<br></br>  this.totalResults = totalResults;<br></br> }<br></br> <br></br> public List<T> getResults()<br></br> {<br></br>  return results;<br></br> }<br></br> public List<T> getResults(int page)<br></br> {<br></br>  if(page <= 0 || page > this.getNumberOfPages())<br></br>  {<br></br>   throw new RuntimeException<br></br>   ("Page number is zero or there are no that many page results.");<br></br>  }<br></br>  List<T> subList = new ArrayList<T>();<br></br>  int start = (page -1)*this.getPageSize();<br></br>  int end = start + this.getPageSize();<br></br>  if(end > this.results.size())<br></br>  {<br></br>   end = this.results.size();<br></br>  }<br></br>  for (int i = start; i < end; i++)<br></br>  {<br></br>   subList.add(this.results.get(i));<br></br>  }<br></br>  return subList;<br></br> }<br></br> <br></br> public int getNumberOfPages()<br></br> {<br></br>  if(this.results == null || this.results.size() == 0)<br></br>  {<br></br>   return 0;<br></br>  }<br></br>  return (this.totalResults/this.pageSize)+(this.totalResults%this.pageSize > 0 ? 1: 0);<br></br> }<br></br> public void setResults(List<T> aRresults)<br></br> {<br></br>  if(aRresults == null)<br></br>  {<br></br>   aRresults = new ArrayList<T>();<br></br>  }<br></br>  this.results = aRresults;<br></br>  this.setTotalResults(this.results.size());<br></br> }<br></br> <br></br>}<br></br>

A SearchCriteria class specific to User Search.  

    
    package com.sivalabs.javabp;<br></br><br></br>public class UserSearchCriteria extends SearchCriteria<br></br>{<br></br> public enum UserSearchType <br></br> {<br></br>  BY_ID, BY_NAME<br></br> };<br></br> <br></br> private UserSearchType searchType = UserSearchType.BY_NAME;<br></br> private int id;<br></br> private String username;<br></br>  <br></br> public UserSearchType getSearchType()<br></br> {<br></br>  return searchType;<br></br> }<br></br> public void setSearchType(UserSearchType searchType)<br></br> {<br></br>  this.searchType = searchType;<br></br> }<br></br> <br></br> public int getId()<br></br> {<br></br>  return id;<br></br> }<br></br> public void setId(int id)<br></br> {<br></br>  this.id = id;<br></br> }<br></br> public String getUsername()<br></br> {<br></br>  return username;<br></br> }<br></br> public void setUsername(String username)<br></br> {<br></br>  this.username = username;<br></br> }<br></br>}<br></br>

A SearchResults class specific to User Search.  

    
    package com.sivalabs.javabp;<br></br>import java.text.MessageFormat;<br></br><br></br>public class UserSearchResults<T> extends SearchResults<user><br></br>{<br></br> public static String getDataGridMessage(int start, int end, int total)<br></br> {<br></br>  return MessageFormat.format("Displaying {0} to {1} Users of {2}", start, end, total);<br></br> }<br></br> <br></br>}<br></br>

UserService takes the SearchCriteria, invokes the DAO and get the results, prepares the UserSearchResults and return it back.  

    
    package com.sivalabs.javabp;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.List;<br></br><br></br>import com.sivalabs.javabp.UserSearchCriteria.UserSearchType;<br></br>public class UserService<br></br>{<br></br> public SearchResults<user> search(UserSearchCriteria searchCriteria)<br></br> {<br></br>  UserSearchType searchType = searchCriteria.getSearchType();<br></br>  String sortOrder = searchCriteria.getSortOrder();<br></br>  System.out.println(searchType+":"+sortOrder);<br></br>  List<User> results = null;<br></br>  if(searchType == UserSearchType.BY_NAME)<br></br>  {<br></br>  //Use hibernate Criteria API to get and sort results <br></br>  //based on USERNAME field in sortOrder<br></br>   results = userDAO.searchUsers(...); <br></br>  }<br></br>  else if(searchType == UserSearchType.BY_ID)<br></br>  {<br></br>  //Use hibernate Criteria API to get and sort results <br></br>  //based on USER_ID field in sortOrder<br></br>   results = userDAO.searchUsers(...);<br></br>  }<br></br>  <br></br>  UserSearchResults<user> searchResults = new UserSearchResults<user>();<br></br>  searchResults.setPageSize(searchCriteria.getPageSize());<br></br>  searchResults.setResults(results);<br></br>  return searchResults;<br></br> }<br></br> <br></br>}<br></br>
    
    package com.sivalabs.javabp;<br></br>import com.sivalabs.javabp.UserSearchCriteria.UserSearchType;<br></br><br></br>public class TestClient<br></br>{<br></br> public static void main(String[] args)<br></br> {<br></br>  UserSearchCriteria criteria = new UserSearchCriteria();<br></br>  criteria.setPageSize(3);<br></br>  //criteria.setSearchType(UserSearchType.BY_ID);<br></br>  //criteria.setId(2);<br></br>  <br></br>  criteria.setSearchType(UserSearchType.BY_NAME);<br></br>  criteria.setUsername("s");  <br></br>  <br></br>  UserService userService = new UserService();<br></br>  SearchResults<user> searchResults = userService.search(criteria);<br></br>  <br></br>  System.out.println(searchResults.getTotalResults());<br></br>  System.out.println(searchResults.getResults().size()+":"+searchResults.getResults());<br></br>  System.out.println(searchResults.getResults(1).size()+":"+searchResults.getResults(1));<br></br> }<br></br>}<br></br>

  
With this approach if we want to add a new criteria like search by EMAIL we can do it as follows:  
1. Add BY_EMAIL criteria type to UserSearchType enum  
2. Add new property "email" to UserSearchCriteria  
3. criteria.setSearchType(UserSearchType.BY_EMAIL);  
criteria.setEmail("gmail");  
4. In UserService prepare the HibernateCriteria with email filter.  
  
Thats it :-)
