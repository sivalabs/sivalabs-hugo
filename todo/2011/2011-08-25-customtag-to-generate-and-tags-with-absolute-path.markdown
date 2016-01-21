---
author: siva
comments: true
date: 2011-08-25 06:43:00+00:00
layout: post
slug: customtag-to-generate-and-tags-with-absolute-path
title: CustomTag to generate  and  tags with absolute path
wordpress_id: 261
categories:
- Servlets JSP
tags:
- Servlets JSP
---

Generally we write our javascript and css styles in separate file and include them in JSPs using <script> and <style> tags.
To include those resource we can use either relative URL or absolute URL.

If you use absolute URL you need to include the context root name which is not a good practice.
Later if you want to change the context root name you need to update in several places.

If you use relative URL you may need to prefix the path with ../ or ../../ depending on your current URL which tedious process.

To get rid of this problem we can create a custom which takes absolute URL without including context root name and render the corresponding <script> or <style> tags.

    
    package com.sivalabs.core.web.tags;
    
    import java.io.IOException;
    
    import javax.servlet.jsp.JspException;
    
    import javax.servlet.jsp.tagext.TagSupport;
    
    
    /**
    
     * @author K. Siva Prasad Reddy
    
     */
    
    public class IncludeResourceTag extends TagSupport
    
    {
    
    	private static final long serialVersionUID = 1L;
    
    	
    
    	private String path;
    
    	private String type;//script or style
    
    	
    
    	@Override
    
    	public int doStartTag() throws JspException
    
    	{
    
    		try
    
    		{
    
    			String absolutePath = getAbsolutePath(pageContext);
    
    			String text = null;
    
    			if("script".equalsIgnoreCase(type)
    
    			{
    
    				text = "<script type="text/javascript" src=""+absolutePath+""></script>";
    
    			}
    
    			else if if("style".equalsIgnoreCase(type)
    
    			{
    
    				text = "<LINK href=""+absolutePath+"" rel="stylesheet" type="text/css">";
    
    			}
    
    			pageContext.getOut().write(text);
    
    		} 
    
    		catch (IOException e)
    
    		{
    
    			e.printStackTrace();
    
    		}
    
    		return SKIP_BODY;
    
    	}
    
    	
    
    	@Override
    
    	public int doEndTag() throws JspException
    
    	{		
    
    		return EVAL_PAGE;
    
    	}
    
    	
    
    	public String getPath()
    
    	{
    
    		return path;
    
    	}
    
    	public void setPath(String path)
    
    	{
    
    		this.path = path;
    
    	}
    
    	
    
    	public String getType()
    
    	{
    
    		return type;
    
    	}
    
    	public void setType(String type)
    
    	{
    
    		this.type = type;
    
    	}
    
    	
    
    	public static String getAbsolutePath(PageContext pageContext)
    
    	{
    
    		HttpServletRequest request = (HttpServletRequest) pageContext.getRequest();
    
    		String contextRoot = request.getContextPath();
    
    		String cleanPath = stripStartingChars(path, '/');		
    
    		return (contextRoot+"/"+path);
    
    	}
    
    	
    
    	public static String stripStartingChars(String str, char c)
    
    	{
    
    		int len = str.length();
    
    		for (int i = 0; i < len; i++)
    
    		{
    
    			if(str.charAt(i) != c)
    
    			{
    
    				return str.substring(i);
    
    			}
    
    		}
    
    		return str;
    
    	}
    
    	
    
    }
    


Now we need to create the TLD sivalabs.tld and put it in WEB-INF dir.

    
    <?xml version="1.0" encoding="UTF-8" ?>
    
    
    <taglib xmlns="http://java.sun.com/xml/ns/j2ee"
    
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    
        xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee 
    
        http://java.sun.com/xml/ns/j2ee/web-jsptaglibrary_2_0.xsd"
    
        version="2.0">
    
        
    
        <description>A tag library for SivaLabs CustomTag handlers.</description>
    
        <tlib-version>1.0</tlib-version>
    
        <short-name>SivaLabsTagLibrary</short-name>
    
        <uri>http://sivalabs.blogspot.com/tags</uri>
    
        
    
        <tag>
    
    		<description>Outputs the JavaScript include tag</description>
    
    	    <name>includeResource</name>
    
    		<tag-class>com.sivalabs.core.web.tags.IncludeResourceTag</tag-class>
    
    		<body-content>empty</body-content>
    
    		<attribute>
    
    		    <name>path</name>
    
    		    <required>true</required>
    
    		    <rtexprvalue>true</rtexprvalue>
    
    		</attribute>
    
    		<attribute>
    
    		    <name>type</name>
    
    		    <required>true</required>
    
    		    <rtexprvalue>true</rtexprvalue>
    
    		</attribute>
    
        </tag>
    
    
    </taglib>
    


Now in JSPs you can use the custom tag as follows:

    
    <%@taglib uri="http://sivalabs.blogspot.com/tags" prefix="sl"%>
    
    
    <html>
    
    <head>
    
    	<sl:includeResource type="style" path="resources/css/style.css"/>
    
    	<sl:includeResource type="script" path="resources/js/util.js"/>
    
    </head>
    
    <body>
    
    ..
    
    ..
    
    </body>
    


Now You can always use absolute path irrespective of current URL.
