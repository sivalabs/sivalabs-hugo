---
title: Mock Table utility for CRUD operations
author: Siva
type: post
date: 2011-07-27T05:38:00+00:00
url: /2011/07/mock-table-utility-for-crud-operations/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/07/mock-table-utility-for-crud-operations.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/6182049892010302465
post_views_count:
  - 4
categories:
  - Java
tags:
  - Java

---
While learning a new technology we may need a database table to store the data.  
But creating a database, setting up jdbc connection and writing crud operation may be cumbersome.

So I thought it would be good to have some mock utility to represent a table which can be used just like a database table.

Here is what I came up with.

<pre>package com.sivalabs.sample.util;<br />import java.io.Serializable;<br /><br />public interface Identifiable&lt;K&gt; extends Serializable<br />{<br /> public void setId(K id);<br /> public K getId(); <br />}<br /></pre>

<pre>package com.sivalabs.sample.util;<br /><br />import java.util.Collection;<br />import java.util.HashMap;<br />import java.util.Map;<br /><br />public abstract class Table&lt;PK extends Object, T extends Identifiable&lt;PK&gt;&gt;<br />{<br /> protected final Map&lt;PK, T&gt; table = new HashMap&lt;PK, T&gt;();<br /> public abstract PK getNextId();<br /> <br /> protected Table()<br /> {<br /> }<br /> <br /> public void create(T obj)<br /> {<br />  if(table.containsKey(obj.getId()))<br />  {<br />   throw new RuntimeException("PrimaryKey ["+obj.getId()+"] already exists");<br />  }<br />  obj.setId(getNextId());<br />  table.put(obj.getId(), obj);<br /> }<br /> <br /> public Collection&lt;T&gt; getAll()<br /> {<br />  return table.values();<br /> }<br /> <br /> public T getById(PK id)<br /> {<br />  return table.get(id);<br /> }<br /> <br /> public void update(T obj)<br /> {<br />  if(!table.containsKey(obj.getId()))<br />  {<br />   throw new RuntimeException("PrimaryKey ["+obj.getId()+"] doesn't exists");<br />  }<br />  table.put(obj.getId(), obj);<br /> }<br /> <br /> public void delete(T obj)<br /> {<br />  delete(obj.getId());<br /> }<br /> <br /> public void delete(PK id)<br /> {<br />  if(!table.containsKey(id))<br />  {<br />   throw new RuntimeException("PrimaryKey ["+id+"] doesn't exists");<br />  }<br />  table.remove(id);<br /> }<br />}<br /></pre>

Let us create a pojo Message.java.

<pre>package com.sivalabs.sample;<br /><br />import java.util.Date;<br />import com.sivalabs.sample.util.Identifiable;<br /><br />public class Message implements Identifiable&lt;Integer&gt;<br />{<br /> private static final long serialVersionUID = 1L;<br /> <br /> private Integer id;<br /> private String text;<br /> private String postedBy;<br /> private Date postedDate = new Date();<br /> public Message()<br /> {<br /> }<br /> <br /> public Message(Integer id, String text, String postedBy, Date postedDate)<br /> {<br />  this.id = id;<br />  this.text = text;<br />  this.postedBy = postedBy;<br />  this.postedDate = postedDate;<br /> }<br /><br /> public Integer getId()<br /> {<br />  return id;<br /> }<br /> public void setId(Integer id)<br /> {<br />  this.id = id;<br /> } <br /> //setters, getters for text, postedBy, postedDate <br />}<br /></pre>

Now let us create a mock table for storing Messages.  
The Message table needs to extend Table and provide what is the type of primary key and what type of objects MessageTable is going to contain using generics <Integer, Message>.

<pre><br />package com.sivalabs.sample.util;<br />import java.util.concurrent.atomic.AtomicInteger;<br />import com.sivalabs.sample.Message;<br /><br />public class MessageTable extends Table&lt;Integer, Message&gt;<br />{<br /> private static final AtomicInteger ATOMIC_INTEGER = new AtomicInteger(0);<br /> @Override<br /> public Integer getNextId()<br /> {<br />  return ATOMIC_INTEGER.incrementAndGet();<br /> } <br />}<br /></pre>

Now let us create a MessageService which holds an instance of MessageTable and expose the CRUD operations to clients.

<pre>package com.sivalabs.sample;<br /><br />import java.util.Collection;<br />import java.util.Date;<br />import com.sivalabs.sample.util.MessageTable;<br /><br /><br />public class MessageService<br />{<br /> private static final MessageTable MESSAGE_TABLE = new MessageTable();<br /> static<br /> {<br />  MESSAGE_TABLE.create(new Message(1, "Message1 Text", "Siva", new Date()));<br />  MESSAGE_TABLE.create(new Message(2, "Message2 Text", "Prasad", new Date()));<br />  MESSAGE_TABLE.create(new Message(3, "Message3 Text", "Prasad", new Date()));<br />  MESSAGE_TABLE.create(new Message(4, "Message4 Text", "Siva", new Date()));  <br /> }<br /> <br /> public Collection&lt;Message&gt; getMessages()<br /> {<br />  return MESSAGE_TABLE.getAll();<br /> }<br /><br /> public Message getMessage(Integer id)<br /> {<br />  return MESSAGE_TABLE.getById(id);<br /> }<br /><br /> public void saveMessage(Message message)<br /> {<br />  MESSAGE_TABLE.create(message);<br /> }<br /><br /> public void updateMessage(Message message)<br /> {<br />  MESSAGE_TABLE.update(message);<br /> }<br /><br /> public void deleteMessage(Integer id)<br /> {<br />  MESSAGE_TABLE.delete(id);<br /> }<br />}<br /></pre>

Now if you want to create a mock table for another pojo User.java it is simple.

<pre><br />package com.sivalabs.sample.util;<br />import java.util.concurrent.atomic.AtomicInteger;<br />import com.sivalabs.sample.User;<br /><br />public class UserTable extends Table&lt;Integer, User&gt;<br />{<br /> private static final AtomicInteger ATOMIC_INTEGER = new AtomicInteger(0);<br /> @Override<br /> public Integer getNextId()<br /> {<br />  return ATOMIC_INTEGER.incrementAndGet();<br /> } <br />}<br /></pre>

If the primary key is always an auto incremented integer value we can move getNextId() method to Table.java. Then creating mock table becomes even more simpler.

<pre><br />package com.sivalabs.sample.util;<br />import com.sivalabs.sample.User;<br /><br />public class UserTable extends Table&lt;Integer, User&gt;<br />{<br />  <br />}<br /></pre>