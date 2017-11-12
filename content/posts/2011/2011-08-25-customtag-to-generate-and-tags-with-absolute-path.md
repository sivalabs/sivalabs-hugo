---
title: 'CustomTag to generate  and  tags with absolute path'
author: Siva
type: post
date: 2011-08-25T01:13:00+00:00
url: /2011/08/customtag-to-generate-and-tags-with-absolute-path/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/08/customtag-to-generate-and-tags-with.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/3735873734251889737
post_views_count:
  - 2
categories:
  - JavaEE
tags:
  - Servlets JSP

---
Generally we write our javascript and css styles in separate file and include them in JSPs using <script> and <style> tags.
  
To include those resource we can use either relative URL or absolute URL.

If you use absolute URL you need to include the context root name which is not a good practice.
  
Later if you want to change the context root name you need to update in several places.

If you use relative URL you may need to prefix the path with ../ or ../../ depending on your current URL which tedious process.

To get rid of this problem we can create a custom which takes absolute URL without including context root name and render the corresponding <script> or <style> tags.

<pre>package com.sivalabs.core.web.tags;

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

				text = "&lt;script type="text/javascript" src=""+absolutePath+""&gt;&lt;/script&gt;";

			}

			else if if("style".equalsIgnoreCase(type)

			{

				text = "&lt;LINK href=""+absolutePath+"" rel="stylesheet" type="text/css"&gt;";

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

		for (int i = 0; i &lt; len; i++)

		{

			if(str.charAt(i) != c)

			{

				return str.substring(i);

			}

		}

		return str;

	}

	

}
</pre>

Now we need to create the TLD sivalabs.tld and put it in WEB-INF dir.

<pre>&lt;?xml version="1.0" encoding="UTF-8" ?&gt;


&lt;taglib xmlns="http://java.sun.com/xml/ns/j2ee"

    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"

    xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee 

    http://java.sun.com/xml/ns/j2ee/web-jsptaglibrary_2_0.xsd"

    version="2.0"&gt;

    

    &lt;description&gt;A tag library for SivaLabs CustomTag handlers.&lt;/description&gt;

    &lt;tlib-version&gt;1.0&lt;/tlib-version&gt;

    &lt;short-name&gt;SivaLabsTagLibrary&lt;/short-name&gt;

    &lt;uri&gt;http://sivalabs.blogspot.com/tags&lt;/uri&gt;

    

    &lt;tag&gt;

		&lt;description&gt;Outputs the JavaScript include tag&lt;/description&gt;

	    &lt;name&gt;includeResource&lt;/name&gt;

		&lt;tag-class&gt;com.sivalabs.core.web.tags.IncludeResourceTag&lt;/tag-class&gt;

		&lt;body-content&gt;empty&lt;/body-content&gt;

		&lt;attribute&gt;

		    &lt;name&gt;path&lt;/name&gt;

		    &lt;required&gt;true&lt;/required&gt;

		    &lt;rtexprvalue&gt;true&lt;/rtexprvalue&gt;

		&lt;/attribute&gt;

		&lt;attribute&gt;

		    &lt;name&gt;type&lt;/name&gt;

		    &lt;required&gt;true&lt;/required&gt;

		    &lt;rtexprvalue&gt;true&lt;/rtexprvalue&gt;

		&lt;/attribute&gt;

    &lt;/tag&gt;


&lt;/taglib&gt;
</pre>

Now in JSPs you can use the custom tag as follows:

<pre>&lt;%@taglib uri="http://sivalabs.blogspot.com/tags" prefix="sl"%&gt;


&lt;html&gt;

&lt;head&gt;

	&lt;sl:includeResource type="style" path="resources/css/style.css"/&gt;

	&lt;sl:includeResource type="script" path="resources/js/util.js"/&gt;

&lt;/head&gt;

&lt;body&gt;

..

..

&lt;/body&gt;
</pre>

Now You can always use absolute path irrespective of current URL.