---
author: siva
comments: true
date: 2009-05-05 05:01:00+00:00
layout: post
slug: bugs-in-ibatis
title: Bugs in IBatis
wordpress_id: 304
categories:
- IBatis
tags:
- IBatis
---

Hi,  
I have been using IBatis for a while and it is really a good ORM solution for small scale applications.  
  
But i found some of the bugs/issues in using IBatis and they are:  
Bug#1. If you have a property with the first character as lower case letter and second character as upper case letter and when you define a property map  for that bean, IBatis will throw an Exception saying that there is no such property in that bean.  
  
For example:  
If i have a class as  
  
public class User  
{  
  private String uId;  
  public void setUId(String uId){  
         this.uId = uId;  
  }  
  puvlic String getUId(){  
        return this.uId;  
 }  
  
}  
  
And if you configure  as  
  
<parameterMap class="User" id="UserParamMap">  
     <parameter property="uId"/>       
 </parameterMap>  
  
Then IBatis is throwing the following exception:  
Caused by: com.ibatis.common.beans.ProbeException: There is no READABLE property named 'uId' in class 'User'.  
  
This is because of the setter/getter semantics used by IBatis.  
If the property name uId is changed to userId it will work.  
  
Bug#2.  
The bug details are posted  [Here](http://forum.springsource.org/showthread.php?t=67261)
