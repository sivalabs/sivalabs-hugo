---
author: siva
comments: true
date: 2011-07-27 05:38:00+00:00
layout: post
slug: mock-table-utility-for-crud-operations
title: Mock Table utility for CRUD operations
wordpress_id: 265
categories:
- Java
tags:
- Java
---

While learning a new technology we may need a database table to store the data.  
But creating a database, setting up jdbc connection and writing crud operation may be cumbersome.  
  
So I thought it would be good to have some mock utility to represent a table which can be used just like a database table.  
  
Here is what I came up with.  
  

    
    package com.sivalabs.sample.util;<br></br>import java.io.Serializable;<br></br><br></br>public interface Identifiable<K> extends Serializable<br></br>{<br></br> public void setId(K id);<br></br> public K getId(); <br></br>}<br></br>

  
  

    
    package com.sivalabs.sample.util;<br></br><br></br>import java.util.Collection;<br></br>import java.util.HashMap;<br></br>import java.util.Map;<br></br><br></br>public abstract class Table<PK extends Object, T extends Identifiable<PK>><br></br>{<br></br> protected final Map<PK, T> table = new HashMap<PK, T>();<br></br> public abstract PK getNextId();<br></br> <br></br> protected Table()<br></br> {<br></br> }<br></br> <br></br> public void create(T obj)<br></br> {<br></br>  if(table.containsKey(obj.getId()))<br></br>  {<br></br>   throw new RuntimeException("PrimaryKey ["+obj.getId()+"] already exists");<br></br>  }<br></br>  obj.setId(getNextId());<br></br>  table.put(obj.getId(), obj);<br></br> }<br></br> <br></br> public Collection<T> getAll()<br></br> {<br></br>  return table.values();<br></br> }<br></br> <br></br> public T getById(PK id)<br></br> {<br></br>  return table.get(id);<br></br> }<br></br> <br></br> public void update(T obj)<br></br> {<br></br>  if(!table.containsKey(obj.getId()))<br></br>  {<br></br>   throw new RuntimeException("PrimaryKey ["+obj.getId()+"] doesn't exists");<br></br>  }<br></br>  table.put(obj.getId(), obj);<br></br> }<br></br> <br></br> public void delete(T obj)<br></br> {<br></br>  delete(obj.getId());<br></br> }<br></br> <br></br> public void delete(PK id)<br></br> {<br></br>  if(!table.containsKey(id))<br></br>  {<br></br>   throw new RuntimeException("PrimaryKey ["+id+"] doesn't exists");<br></br>  }<br></br>  table.remove(id);<br></br> }<br></br>}<br></br>

  
Let us create a pojo Message.java.  
  

    
    package com.sivalabs.sample;<br></br><br></br>import java.util.Date;<br></br>import com.sivalabs.sample.util.Identifiable;<br></br><br></br>public class Message implements Identifiable<Integer><br></br>{<br></br> private static final long serialVersionUID = 1L;<br></br> <br></br> private Integer id;<br></br> private String text;<br></br> private String postedBy;<br></br> private Date postedDate = new Date();<br></br> public Message()<br></br> {<br></br> }<br></br> <br></br> public Message(Integer id, String text, String postedBy, Date postedDate)<br></br> {<br></br>  this.id = id;<br></br>  this.text = text;<br></br>  this.postedBy = postedBy;<br></br>  this.postedDate = postedDate;<br></br> }<br></br><br></br> public Integer getId()<br></br> {<br></br>  return id;<br></br> }<br></br> public void setId(Integer id)<br></br> {<br></br>  this.id = id;<br></br> } <br></br> //setters, getters for text, postedBy, postedDate <br></br>}<br></br>

  
Now let us create a mock table for storing Messages.  
The Message table needs to extend Table and provide what is the type of primary key and what type of objects MessageTable is going to contain using generics <Integer, Message>.  
  

    
    <br></br>package com.sivalabs.sample.util;<br></br>import java.util.concurrent.atomic.AtomicInteger;<br></br>import com.sivalabs.sample.Message;<br></br><br></br>public class MessageTable extends Table<Integer, Message><br></br>{<br></br> private static final AtomicInteger ATOMIC_INTEGER = new AtomicInteger(0);<br></br> @Override<br></br> public Integer getNextId()<br></br> {<br></br>  return ATOMIC_INTEGER.incrementAndGet();<br></br> } <br></br>}<br></br>

  
Now let us create a MessageService which holds an instance of MessageTable and expose the CRUD operations to clients.  
  

    
    package com.sivalabs.sample;<br></br><br></br>import java.util.Collection;<br></br>import java.util.Date;<br></br>import com.sivalabs.sample.util.MessageTable;<br></br><br></br><br></br>public class MessageService<br></br>{<br></br> private static final MessageTable MESSAGE_TABLE = new MessageTable();<br></br> static<br></br> {<br></br>  MESSAGE_TABLE.create(new Message(1, "Message1 Text", "Siva", new Date()));<br></br>  MESSAGE_TABLE.create(new Message(2, "Message2 Text", "Prasad", new Date()));<br></br>  MESSAGE_TABLE.create(new Message(3, "Message3 Text", "Prasad", new Date()));<br></br>  MESSAGE_TABLE.create(new Message(4, "Message4 Text", "Siva", new Date()));  <br></br> }<br></br> <br></br> public Collection<Message> getMessages()<br></br> {<br></br>  return MESSAGE_TABLE.getAll();<br></br> }<br></br><br></br> public Message getMessage(Integer id)<br></br> {<br></br>  return MESSAGE_TABLE.getById(id);<br></br> }<br></br><br></br> public void saveMessage(Message message)<br></br> {<br></br>  MESSAGE_TABLE.create(message);<br></br> }<br></br><br></br> public void updateMessage(Message message)<br></br> {<br></br>  MESSAGE_TABLE.update(message);<br></br> }<br></br><br></br> public void deleteMessage(Integer id)<br></br> {<br></br>  MESSAGE_TABLE.delete(id);<br></br> }<br></br>}<br></br>

  
  
Now if you want to create a mock table for another pojo User.java it is simple.  
  

    
    <br></br>package com.sivalabs.sample.util;<br></br>import java.util.concurrent.atomic.AtomicInteger;<br></br>import com.sivalabs.sample.User;<br></br><br></br>public class UserTable extends Table<Integer, User><br></br>{<br></br> private static final AtomicInteger ATOMIC_INTEGER = new AtomicInteger(0);<br></br> @Override<br></br> public Integer getNextId()<br></br> {<br></br>  return ATOMIC_INTEGER.incrementAndGet();<br></br> } <br></br>}<br></br>

  
If the primary key is always an auto incremented integer value we can move getNextId() method to Table.java. Then creating mock table becomes even more simpler.  
  

    
    <br></br>package com.sivalabs.sample.util;<br></br>import com.sivalabs.sample.User;<br></br><br></br>public class UserTable extends Table<Integer, User><br></br>{<br></br>  <br></br>}<br></br>
