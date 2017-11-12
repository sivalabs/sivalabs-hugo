---
title: Spring + Quartz + JavaMail Integration Tutorial
author: Siva
type: post
date: 2011-05-30T09:27:00+00:00
url: /2011/05/spring-quartz-javamail-integration-tutorial/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/05/spring-quartz-javamail-integration.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/7886957528314882780
post_views_count:
  - 97
categories:
  - Spring
tags:
  - Java
  - JavaMail
  - Quartz
  - Spring

---
Quartz is a job scheduling framework which is used to schedule the jobs to be executed on the specified time schedule.  
JavaMail is an API to send/recieve emails from Java Applications.

Spring has integration points to integrate Quartz and JavaMail which makes easy to use those APIs.

Lets create a small demo application to show how to integrate Spring + Quartz + JavaMail.

Our application is to send birthday wishes emails to friends everyday at 6 AM.

 **Email.java**

<pre>package com.sivalabs.reminders;<br /><br />import java.util.ArrayList;<br />import java.util.List;<br /><br />public class Email <br />{<br /> private String from;<br /> private String[] to;<br /> private String[] cc;<br /> private String[] bcc;<br /> private String subject;<br /> private String text;<br /> private String mimeType;<br /> private List&lt;Attachment&gt; attachments = new ArrayList&lt;Attachment&gt;();<br /> <br /> public String getFrom()<br /> {<br />  return from;<br /> }<br /> public void setFrom(String from)<br /> {<br />  this.from = from;<br /> }<br /> public String[] getTo()<br /> {<br />  return to;<br /> }<br /> public void setTo(String... to)<br /> {<br />  this.to = to;<br /> }<br /> public String[] getCc()<br /> {<br />  return cc;<br /> }<br /> public void setCc(String... cc)<br /> {<br />  this.cc = cc;<br /> }<br /> public String[] getBcc()<br /> {<br />  return bcc;<br /> }<br /> public void setBcc(String... bcc)<br /> {<br />  this.bcc = bcc;<br /> }<br /> public String getSubject()<br /> {<br />  return subject;<br /> }<br /> public void setSubject(String subject)<br /> {<br />  this.subject = subject;<br /> }<br /> public String getText()<br /> {<br />  return text;<br /> }<br /> public void setText(String text)<br /> {<br />  this.text = text;<br /> }<br /> public String getMimeType()<br /> {<br />  return mimeType;<br /> }<br /> public void setMimeType(String mimeType)<br /> {<br />  this.mimeType = mimeType;<br /> }<br /> public List&lt;Attachment&gt; getAttachments()<br /> {<br />  return attachments;<br /> }<br /> public void addAttachments(List&lt;Attachment&gt; attachments)<br /> {<br />  this.attachments.addAll(attachments);<br /> }<br /> public void addAttachment(Attachment attachment)<br /> {<br />  this.attachments.add(attachment);<br /> }<br /> public void removeAttachment(int index)<br /> {<br />  this.attachments.remove(index);<br /> }<br /> public void removeAllAttachments()<br /> {<br />  this.attachments.clear();<br /> }<br />}<br /></pre>

 **Attachment.java**

<pre>package com.sivalabs.reminders;<br /><br />public class Attachment<br />{<br /> private byte[] data;<br /> private String filename;<br /> private String mimeType;<br /> private boolean inline;<br /> <br /> public Attachment()<br /> {<br /> }<br /> <br /> public Attachment(byte[] data, String filename, String mimeType)<br /> {<br />  this.data = data;<br />  this.filename = filename;<br />  this.mimeType = mimeType;<br /> }<br /> public Attachment(byte[] data, String filename, String mimeType, boolean inline)<br /> {<br />  this.data = data;<br />  this.filename = filename;<br />  this.mimeType = mimeType;<br />  this.inline = inline;<br /> }<br /> public byte[] getData()<br /> {<br />  return data;<br /> }<br /> public void setData(byte[] data)<br /> {<br />  this.data = data;<br /> }<br /> public String getFilename()<br /> {<br />  return filename;<br /> }<br /> public void setFilename(String filename)<br /> {<br />  this.filename = filename;<br /> }<br /><br /> public String getMimeType()<br /> {<br />  return mimeType;<br /> }<br /><br /> public void setMimeType(String mimeType)<br /> {<br />  this.mimeType = mimeType;<br /> }<br /><br /> public boolean isInline()<br /> {<br />  return inline;<br /> }<br /><br /> public void setInline(boolean inline)<br /> {<br />  this.inline = inline;<br /> }<br /> <br />}<br /></pre>

 **EmailService.java**

<pre>package com.sivalabs.reminders;<br /><br />import java.util.List;<br /><br />import javax.activation.DataSource;<br />import javax.mail.MessagingException;<br />import javax.mail.internet.MimeMessage;<br />import javax.mail.util.ByteArrayDataSource;<br /><br />import org.springframework.mail.javamail.JavaMailSenderImpl;<br />import org.springframework.mail.javamail.MimeMessageHelper;<br /><br />public class EmailService <br />{<br /> private JavaMailSenderImpl mailSender = null;<br /> public void setMailSender(JavaMailSenderImpl mailSender)<br /> {<br />  this.mailSender = mailSender;<br /> }<br /> <br /> public void sendEmail(Email email) throws MessagingException {<br />  MimeMessage mimeMessage = mailSender.createMimeMessage();<br />  // use the true flag to indicate you need a multipart message<br />  boolean hasAttachments = (email.getAttachments()!=null && <br />         email.getAttachments().size() > 0 );<br />  MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, hasAttachments);<br />  helper.setTo(email.getTo());<br />  helper.setFrom(email.getFrom());<br />  helper.setSubject(email.getSubject());<br />  helper.setText(email.getText(), true);<br />  <br />  List&lt;Attachment&gt; attachments = email.getAttachments();<br />     if(attachments != null && attachments.size() > 0)<br />     {<br />      for (Attachment attachment : attachments) <br />      {<br />          String filename = attachment.getFilename() ;<br />          DataSource dataSource = new ByteArrayDataSource(attachment.getData(), <br />                 attachment.getMimeType());<br />          if(attachment.isInline())<br />          {<br />           helper.addInline(filename, dataSource);<br />          }else{<br />           helper.addAttachment(filename, dataSource);<br />          }<br />   }<br />     }<br />  <br />  mailSender.send(mimeMessage);<br /> }<br />}<br /></pre>

 **BirthdayWisherJob.java**

<pre>package com.sivalabs.reminders;<br /><br />import java.io.InputStream;<br />import java.util.ArrayList;<br />import java.util.Date;<br />import java.util.List;<br /><br />import javax.mail.MessagingException;<br /><br />import org.quartz.JobExecutionContext;<br />import org.quartz.JobExecutionException;<br />import org.springframework.core.io.ClassPathResource;<br />import org.springframework.scheduling.quartz.QuartzJobBean;<br /><br />public class BirthdayWisherJob extends QuartzJobBean<br />{<br /> <br /> private EmailService emailService;<br /> public void setEmailService(EmailService emailService)<br /> {<br />  this.emailService = emailService;<br /> }<br /> <br /> @Override<br /> protected void executeInternal(JobExecutionContext context) throws JobExecutionException<br /> {<br />  System.out.println("Sending Birthday Wishes... ");<br />  List&lt;User&gt; usersBornToday = getUsersBornToday();<br />  for (User user : usersBornToday) <br />  {<br />   try <br />   {<br />    Email email = new Email();<br />    email.setFrom("admin@sivalabs.com");<br />    email.setSubject("Happy BirthDay");<br />    email.setTo(user.getEmail());<br />    email.setText("

<h1>
  Dear "+user.getName()+<br />      ", <br />Many Many Happy Returns of the day :-)
</h1>");

<br />     <br />    byte[] data = null;<br />    ClassPathResource img = new ClassPathResource("HBD.gif");<br />    InputStream inputStream = img.getInputStream();<br />    data = new byte[inputStream.available()];<br />    while((inputStream.read(data)!=-1));<br />   <br />    Attachment attachment = new Attachment(data, "HappyBirthDay", <br />      "image/gif", true);<br />    email.addAttachment(attachment);<br />   <br />    emailService.sendEmail(email);<br />   }<br />   catch (MessagingException e) <br />   {<br />    e.printStackTrace();<br />   }<br />   catch (Exception e) <br />   {<br />    e.printStackTrace();<br />   }<br />  }<br /> }<br /> <br /> private List&lt;User&gt; getUsersBornToday()<br /> {<br />  List&lt;User&gt; users = new ArrayList&lt;User&gt;();<br />  User user1 = new User("Siva Prasad", "sivaprasadreddy.k@gmail.com", new Date());<br />  users.add(user1);<br />  User user2 = new User("John", "abcd@gmail.com", new Date());<br />  users.add(user2);<br />  return users;<br /> }<br />}<br /><br /></pre>

**applicationContext.xml**

<pre>&lt;beans><br /><br /> &lt;bean><br /> &lt;property name="triggers"><br />  &lt;list><br />   &lt;ref bean="birthdayWisherCronTrigger" /&gt;<br />  &lt;/list><br /> &lt;/property><br /> &lt;/bean><br /> &lt;bean><br />  &lt;property name="jobDetail" ref="birthdayWisherJob" /&gt;<br />  &lt;!-- run every morning at 6 AM --&gt;<br />  &lt;property name="cronExpression" value="0/5 * * * * ?" /&gt;<br /> &lt;/bean><br /><br /> &lt;bean name="birthdayWisherJob"><br />  &lt;property name="jobClass" value="com.sivalabs.reminders.BirthdayWisherJob" /&gt;<br />  &lt;property name="jobDataAsMap"><br />   

<map>
  <br />    &lt;entry key="emailService" value-ref="emailService">&lt;/entry><br />   
</map>

<br />  &lt;/property><br /> &lt;/bean><br /> <br /> &lt;bean><br />  &lt;property name="mailSender" ref="mailSender">&lt;/property><br /> &lt;/bean><br /> <br /> &lt;bean><br />  &lt;property name="defaultEncoding" value="UTF-8"/&gt; <br />  &lt;property name="host" value="smtp.gmail.com" /&gt;<br />  &lt;property name="port" value="465" /&gt;<br />  &lt;property name="protocol" value="smtps" /&gt;<br />  &lt;property name="username" value="admin@gmail.com"/&gt;<br />  &lt;property name="password" value="*****"/&gt;<br />  &lt;property name="javaMailProperties"><br />   &lt;props><br />    &lt;prop key="mail.smtps.auth">true&lt;/prop><br />    &lt;prop key="mail.smtps.starttls.enable">true&lt;/prop><br />    &lt;prop key="mail.smtps.debug">true&lt;/prop><br />   &lt;/props><br />  &lt;/property><br /> &lt;/bean><br /> <br />&lt;/beans><br /></pre>

 **TestClient.java **

<pre>package com.sivalabs.reminders;<br /><br />import org.springframework.context.ApplicationContext;<br />import org.springframework.context.support.ClassPathXmlApplicationContext;<br /><br />public class TestClient {<br /><br /> <br /> public static void main(String[] args) <br /> {<br />  ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");  <br /> }<br /><br />}<br /><br /></pre>