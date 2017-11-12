---
title: 'Java Coding Best Practices: Better Search Implementation'
author: Siva
type: post
date: 2011-02-08T20:52:00+00:00
url: /2011/02/java-coding-best-practices-better-search-implementation/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/02/java-coding-best-practices-better.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/4373588248946522572
post_views_count:
  - 10
categories:
  - Best Practices
tags:
  - Best Practices
  - Java

---
In web applications searching for information based on the selected criteria and displaying the results is a very common requirement.  
Suppose we need to search users based on their name. The end user will enter the username in the textbox and hit the search button and the user results will be fetched from database and display in a grid.  
In the first look it looks simple and we start to implement it as follows:

<pre>public class UserSearchAction extends Action<br />{<br /> public ActionForward execute(...)<br /> {<br />  SearchForm sf = (SearchForm)form;<br />  String searchName = sf.getSearchName();<br />  UserService userService = new UserService();<br />  List&lt;User> searchResults = userService.search(searchName);<br />  //put search results in request and dsplay in JSP<br /> }<br /><br />}<br /></pre>

<pre>public class UserService<br />{<br /> public List&lt;User&gt; search(String username)<br /> {<br />  // query the DB and get the results by applying filter on USERNAME column<br />  List&lt;User&gt; users = UserDAO.search(username);<br /> }<br />}<br /></pre>

The above implementation works fine for the current requirement.

Later client wants to display only 10 rows per page and display a message like &#8220;Displaying 1-10 of 35 Users&#8221;.

Now we need to change the above code for the change request.

<pre>public class UserSearchAction extends Action<br />{<br /> public ActionForward execute(...)<br /> {<br />  SearchForm sf = (SearchForm)form;<br />  String searchName = sf.getSearchName();<br />  UserService userService = new UserService();<br />  Map&lt;String, Object&gt; searchResultsMap = userService.search(searchName, start, pageSize);<br />  List&lt;User&gt; users = (List&lt;User&gt;)searchResultsMap.get("DATA");<br />  Integer count = (Integer)searchResultsMap.get("COUNT");<br />  //put search results in request and dsplay in JSP<br /> }<br /><br />}<br /></pre>

<pre>public class UserService<br />{<br /> public Map&lt;String, Object&gt; search(String username, int start, int pageSize)<br /> {<br />  //Get the total number of results for this criteria<br />  int count = UserDAO.searchResultsCount(username);<br />  // query the DB and get the start to start+pageSize results by applying filter on USERNAME column<br />  List&lt;User&gt; users = UserDAO.search(username, start, pageSize);<br />  Map&lt;String, Object&gt; RESULTS_MAP = new HashMap&lt;String, Object&gt;();<br />  RESULTS_MAP.put("DATA",users);<br />  RESULTS_MAP.put("COUNT",count);<br />  return RESULTS_MAP;<br /> }<br />}<br /></pre>

Later Client again wants to give an option to the end user to choose the search type either by UserID or by Username and show the paginated results.  
Now we need to change the above code for the change request.

<pre>public class UserSearchAction extends Action<br />{<br /> public ActionForward execute(...)<br /> {<br />  SearchForm sf = (SearchForm)form;<br />  String searchName = sf.getSearchName();<br />  String searchId = sf.getSearchId();<br />  UserService userService = new UserService();<br />  Map&lt;String, Object&gt; searchCriteriaMap = new HashMap&lt;String, Object&gt;();<br />  //searchCriteriaMap.put("SEARCH_BY","NAME");<br />  searchCriteriaMap.put("SEARCH_BY","ID");<br />  searchCriteriaMap.put("ID",searchId);<br />  searchCriteriaMap.put("START",start);<br />  searchCriteriaMap.put("PAGESIZE",pageSize);<br />    <br />  Map&lt;String, Object&gt; searchResultsMap = userService.search(searchCriteriaMap);<br />  List&lt;User&gt; users = (List&lt;User&gt;)searchResultsMap.get("DATA");<br />  Integer count = (Integer)searchResultsMap.get("COUNT");<br />  //put search results in request and dsplay in JSP<br /> }<br /><br />}<br /></pre>

<pre>public class UserService<br />{<br /> public Map&lt;String, Object&gt; search(Map&lt;String, Object&gt; searchCriteriaMap)<br /> {<br />  return UserDAO.search(searchCriteriaMap);<br /> }<br />}<br /></pre>

<pre>public class UserDAO<br />{<br /> public Map&lt;String, Object&gt; search(Map&lt;String, Object&gt; searchCriteriaMap)<br /> {<br />  String SEARCH_BY = (String)searchCriteriaMap.get("SEARCH_BY"); <br />  int start = (Integer)searchCriteriaMap.get("START"); <br />  int pageSize = (Integer)searchCriteriaMap.get("PAGESIZE");<br />  if("ID".equals(SEARCH_BY))<br />  {<br />   int id = (Integer)searchCriteriaMap.get("ID"); <br />   //Get the total number of results for this criteria<br />   int count = UserDAO.searchResultsCount(id);<br />   // query the DB and get the start to start+pageSize results <br />   //by applying filter on USER_ID column<br />   List&lt;User&gt; users = search(id, start, pageSize);<br />  <br />  }<br />  else<br />  {<br />   String username = (String)searchCriteriaMap.get("USERNAME"); <br />   //Get the total number of results for this criteria<br />   int count = UserDAO.searchResultsCount(username);<br />   // query the DB and get the start to start+pageSize results <br />   //by applying filter on USERNAME column<br />   List&lt;User&gt; users = search(username, start, pageSize);<br />  <br />  }<br />  Map&lt;String, Object&gt; RESULTS_MAP = new HashMap&lt;String, Object&gt;();<br />  RESULTS_MAP.put("DATA",users);<br />  RESULTS_MAP.put("COUNT",count);<br />  return RESULTS_MAP;<br /> }<br /><br />}<br /></pre>

Finally the code became a big mess and completely violating the object oriented principles. There are lot of problems with the above code.  
1. For each change request the method signatures are changing  
2. Code needs to be changed for each enhancement like adding more search criteria

We can design a better object model for this kind of search functionality which is Object Oriented and enhancable as follws.

A generic SearchCriteria which holds common search criteria like pagination, sorting details.

<pre>package com.sivalabs.javabp;<br />public abstract class SearchCriteria<br />{<br /> private boolean pagination = false;<br /> private int pageSize = 25;<br /> private String sortOrder = "ASC";<br /> <br /> public boolean isPagination()<br /> {<br />  return pagination;<br /> }<br /> public void setPagination(boolean pagination)<br /> {<br />  this.pagination = pagination;<br /> }<br /> public String getSortOrder()<br /> {<br />  return sortOrder;<br /> }<br /> public void setSortOrder(String sortOrder)<br /> {<br />  this.sortOrder = sortOrder;<br /> }<br /> public int getPageSize()<br /> {<br />  return pageSize;<br /> }<br /> public void setPageSize(int pageSize)<br /> {<br />  this.pageSize = pageSize;<br /> }<br /> <br />}<br /></pre>

A generic SearchResults object which holds the actual results and other detials like total available results count, page wise results provider etc.

<pre>package com.sivalabs.javabp;<br /><br />import java.util.ArrayList;<br />import java.util.List;<br /><br />public abstract class SearchResults&lt;T&gt;<br />{<br /> private int totalResults = 0;<br /> private int pageSize = 25;<br /> private List&lt;T&gt; results = null;<br /> <br /> public int getPageSize()<br /> {<br />  return pageSize;<br /> }<br /> public void setPageSize(int pageSize)<br /> {<br />  this.pageSize = pageSize;<br /> } <br /> public int getTotalResults()<br /> {<br />  return totalResults;<br /> }<br /> private void setTotalResults(int totalResults)<br /> {<br />  this.totalResults = totalResults;<br /> }<br /> <br /> public List&lt;T&gt; getResults()<br /> {<br />  return results;<br /> }<br /> public List&lt;T&gt; getResults(int page)<br /> {<br />  if(page &lt;= 0 || page > this.getNumberOfPages())<br />  {<br />   throw new RuntimeException<br />   ("Page number is zero or there are no that many page results.");<br />  }<br />  List&lt;T&gt; subList = new ArrayList&lt;T&gt;();<br />  int start = (page -1)*this.getPageSize();<br />  int end = start + this.getPageSize();<br />  if(end > this.results.size())<br />  {<br />   end = this.results.size();<br />  }<br />  for (int i = start; i &lt; end; i++)<br />  {<br />   subList.add(this.results.get(i));<br />  }<br />  return subList;<br /> }<br /> <br /> public int getNumberOfPages()<br /> {<br />  if(this.results == null || this.results.size() == 0)<br />  {<br />   return 0;<br />  }<br />  return (this.totalResults/this.pageSize)+(this.totalResults%this.pageSize > 0 ? 1: 0);<br /> }<br /> public void setResults(List&lt;T&gt; aRresults)<br /> {<br />  if(aRresults == null)<br />  {<br />   aRresults = new ArrayList&lt;T&gt;();<br />  }<br />  this.results = aRresults;<br />  this.setTotalResults(this.results.size());<br /> }<br /> <br />}<br /></pre>

A SearchCriteria class specific to User Search.

<pre>package com.sivalabs.javabp;<br /><br />public class UserSearchCriteria extends SearchCriteria<br />{<br /> public enum UserSearchType <br /> {<br />  BY_ID, BY_NAME<br /> };<br /> <br /> private UserSearchType searchType = UserSearchType.BY_NAME;<br /> private int id;<br /> private String username;<br />  <br /> public UserSearchType getSearchType()<br /> {<br />  return searchType;<br /> }<br /> public void setSearchType(UserSearchType searchType)<br /> {<br />  this.searchType = searchType;<br /> }<br /> <br /> public int getId()<br /> {<br />  return id;<br /> }<br /> public void setId(int id)<br /> {<br />  this.id = id;<br /> }<br /> public String getUsername()<br /> {<br />  return username;<br /> }<br /> public void setUsername(String username)<br /> {<br />  this.username = username;<br /> }<br />}<br /></pre>

A SearchResults class specific to User Search.

<pre>package com.sivalabs.javabp;<br />import java.text.MessageFormat;<br /><br />public class UserSearchResults&lt;T&gt; extends SearchResults&lt;user><br />{<br /> public static String getDataGridMessage(int start, int end, int total)<br /> {<br />  return MessageFormat.format("Displaying {0} to {1} Users of {2}", start, end, total);<br /> }<br /> <br />}<br /></pre>

UserService takes the SearchCriteria, invokes the DAO and get the results, prepares the UserSearchResults and return it back.

<pre>package com.sivalabs.javabp;<br /><br />import java.util.ArrayList;<br />import java.util.List;<br /><br />import com.sivalabs.javabp.UserSearchCriteria.UserSearchType;<br />public class UserService<br />{<br /> public SearchResults&lt;user> search(UserSearchCriteria searchCriteria)<br /> {<br />  UserSearchType searchType = searchCriteria.getSearchType();<br />  String sortOrder = searchCriteria.getSortOrder();<br />  System.out.println(searchType+":"+sortOrder);<br />  List&lt;User&gt; results = null;<br />  if(searchType == UserSearchType.BY_NAME)<br />  {<br />  //Use hibernate Criteria API to get and sort results <br />  //based on USERNAME field in sortOrder<br />   results = userDAO.searchUsers(...); <br />  }<br />  else if(searchType == UserSearchType.BY_ID)<br />  {<br />  //Use hibernate Criteria API to get and sort results <br />  //based on USER_ID field in sortOrder<br />   results = userDAO.searchUsers(...);<br />  }<br />  <br />  UserSearchResults&lt;user> searchResults = new UserSearchResults&lt;user>();<br />  searchResults.setPageSize(searchCriteria.getPageSize());<br />  searchResults.setResults(results);<br />  return searchResults;<br /> }<br /> <br />}<br /></pre>

<pre>package com.sivalabs.javabp;<br />import com.sivalabs.javabp.UserSearchCriteria.UserSearchType;<br /><br />public class TestClient<br />{<br /> public static void main(String[] args)<br /> {<br />  UserSearchCriteria criteria = new UserSearchCriteria();<br />  criteria.setPageSize(3);<br />  //criteria.setSearchType(UserSearchType.BY_ID);<br />  //criteria.setId(2);<br />  <br />  criteria.setSearchType(UserSearchType.BY_NAME);<br />  criteria.setUsername("s");  <br />  <br />  UserService userService = new UserService();<br />  SearchResults&lt;user> searchResults = userService.search(criteria);<br />  <br />  System.out.println(searchResults.getTotalResults());<br />  System.out.println(searchResults.getResults().size()+":"+searchResults.getResults());<br />  System.out.println(searchResults.getResults(1).size()+":"+searchResults.getResults(1));<br /> }<br />}<br /></pre>

With this approach if we want to add a new criteria like search by EMAIL we can do it as follows:  
1. Add BY_EMAIL criteria type to UserSearchType enum  
2. Add new property &#8220;email&#8221; to UserSearchCriteria  
3. criteria.setSearchType(UserSearchType.BY_EMAIL);  
criteria.setEmail(&#8220;gmail&#8221;);  
4. In UserService prepare the HibernateCriteria with email filter.

Thats it 🙂