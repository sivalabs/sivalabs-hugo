---
author: siva
comments: true
date: 2011-05-30 14:57:00+00:00
layout: post
slug: spring-quartz-javamail-integration-tutorial
title: Spring + Quartz + JavaMail Integration Tutorial
wordpress_id: 271
categories:
- Java
- JavaMail
- Quartz
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
  
** Email.java**  
  

    
    package com.sivalabs.reminders;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.List;<br></br><br></br>public class Email <br></br>{<br></br> private String from;<br></br> private String[] to;<br></br> private String[] cc;<br></br> private String[] bcc;<br></br> private String subject;<br></br> private String text;<br></br> private String mimeType;<br></br> private List<Attachment> attachments = new ArrayList<Attachment>();<br></br> <br></br> public String getFrom()<br></br> {<br></br>  return from;<br></br> }<br></br> public void setFrom(String from)<br></br> {<br></br>  this.from = from;<br></br> }<br></br> public String[] getTo()<br></br> {<br></br>  return to;<br></br> }<br></br> public void setTo(String... to)<br></br> {<br></br>  this.to = to;<br></br> }<br></br> public String[] getCc()<br></br> {<br></br>  return cc;<br></br> }<br></br> public void setCc(String... cc)<br></br> {<br></br>  this.cc = cc;<br></br> }<br></br> public String[] getBcc()<br></br> {<br></br>  return bcc;<br></br> }<br></br> public void setBcc(String... bcc)<br></br> {<br></br>  this.bcc = bcc;<br></br> }<br></br> public String getSubject()<br></br> {<br></br>  return subject;<br></br> }<br></br> public void setSubject(String subject)<br></br> {<br></br>  this.subject = subject;<br></br> }<br></br> public String getText()<br></br> {<br></br>  return text;<br></br> }<br></br> public void setText(String text)<br></br> {<br></br>  this.text = text;<br></br> }<br></br> public String getMimeType()<br></br> {<br></br>  return mimeType;<br></br> }<br></br> public void setMimeType(String mimeType)<br></br> {<br></br>  this.mimeType = mimeType;<br></br> }<br></br> public List<Attachment> getAttachments()<br></br> {<br></br>  return attachments;<br></br> }<br></br> public void addAttachments(List<Attachment> attachments)<br></br> {<br></br>  this.attachments.addAll(attachments);<br></br> }<br></br> public void addAttachment(Attachment attachment)<br></br> {<br></br>  this.attachments.add(attachment);<br></br> }<br></br> public void removeAttachment(int index)<br></br> {<br></br>  this.attachments.remove(index);<br></br> }<br></br> public void removeAllAttachments()<br></br> {<br></br>  this.attachments.clear();<br></br> }<br></br>}<br></br>

  
** Attachment.java**  

    
    package com.sivalabs.reminders;<br></br><br></br>public class Attachment<br></br>{<br></br> private byte[] data;<br></br> private String filename;<br></br> private String mimeType;<br></br> private boolean inline;<br></br> <br></br> public Attachment()<br></br> {<br></br> }<br></br> <br></br> public Attachment(byte[] data, String filename, String mimeType)<br></br> {<br></br>  this.data = data;<br></br>  this.filename = filename;<br></br>  this.mimeType = mimeType;<br></br> }<br></br> public Attachment(byte[] data, String filename, String mimeType, boolean inline)<br></br> {<br></br>  this.data = data;<br></br>  this.filename = filename;<br></br>  this.mimeType = mimeType;<br></br>  this.inline = inline;<br></br> }<br></br> public byte[] getData()<br></br> {<br></br>  return data;<br></br> }<br></br> public void setData(byte[] data)<br></br> {<br></br>  this.data = data;<br></br> }<br></br> public String getFilename()<br></br> {<br></br>  return filename;<br></br> }<br></br> public void setFilename(String filename)<br></br> {<br></br>  this.filename = filename;<br></br> }<br></br><br></br> public String getMimeType()<br></br> {<br></br>  return mimeType;<br></br> }<br></br><br></br> public void setMimeType(String mimeType)<br></br> {<br></br>  this.mimeType = mimeType;<br></br> }<br></br><br></br> public boolean isInline()<br></br> {<br></br>  return inline;<br></br> }<br></br><br></br> public void setInline(boolean inline)<br></br> {<br></br>  this.inline = inline;<br></br> }<br></br> <br></br>}<br></br>

  
** EmailService.java**  

    
    package com.sivalabs.reminders;<br></br><br></br>import java.util.List;<br></br><br></br>import javax.activation.DataSource;<br></br>import javax.mail.MessagingException;<br></br>import javax.mail.internet.MimeMessage;<br></br>import javax.mail.util.ByteArrayDataSource;<br></br><br></br>import org.springframework.mail.javamail.JavaMailSenderImpl;<br></br>import org.springframework.mail.javamail.MimeMessageHelper;<br></br><br></br>public class EmailService <br></br>{<br></br> private JavaMailSenderImpl mailSender = null;<br></br> public void setMailSender(JavaMailSenderImpl mailSender)<br></br> {<br></br>  this.mailSender = mailSender;<br></br> }<br></br> <br></br> public void sendEmail(Email email) throws MessagingException {<br></br>  MimeMessage mimeMessage = mailSender.createMimeMessage();<br></br>  // use the true flag to indicate you need a multipart message<br></br>  boolean hasAttachments = (email.getAttachments()!=null && <br></br>         email.getAttachments().size() > 0 );<br></br>  MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, hasAttachments);<br></br>  helper.setTo(email.getTo());<br></br>  helper.setFrom(email.getFrom());<br></br>  helper.setSubject(email.getSubject());<br></br>  helper.setText(email.getText(), true);<br></br>  <br></br>  List<Attachment> attachments = email.getAttachments();<br></br>     if(attachments != null && attachments.size() > 0)<br></br>     {<br></br>      for (Attachment attachment : attachments) <br></br>      {<br></br>          String filename = attachment.getFilename() ;<br></br>          DataSource dataSource = new ByteArrayDataSource(attachment.getData(), <br></br>                 attachment.getMimeType());<br></br>          if(attachment.isInline())<br></br>          {<br></br>           helper.addInline(filename, dataSource);<br></br>          }else{<br></br>           helper.addAttachment(filename, dataSource);<br></br>          }<br></br>   }<br></br>     }<br></br>  <br></br>  mailSender.send(mimeMessage);<br></br> }<br></br>}<br></br>

  
  
** BirthdayWisherJob.java**  

    
    package com.sivalabs.reminders;<br></br><br></br>import java.io.InputStream;<br></br>import java.util.ArrayList;<br></br>import java.util.Date;<br></br>import java.util.List;<br></br><br></br>import javax.mail.MessagingException;<br></br><br></br>import org.quartz.JobExecutionContext;<br></br>import org.quartz.JobExecutionException;<br></br>import org.springframework.core.io.ClassPathResource;<br></br>import org.springframework.scheduling.quartz.QuartzJobBean;<br></br><br></br>public class BirthdayWisherJob extends QuartzJobBean<br></br>{<br></br> <br></br> private EmailService emailService;<br></br> public void setEmailService(EmailService emailService)<br></br> {<br></br>  this.emailService = emailService;<br></br> }<br></br> <br></br> @Override<br></br> protected void executeInternal(JobExecutionContext context) throws JobExecutionException<br></br> {<br></br>  System.out.println("Sending Birthday Wishes... ");<br></br>  List<User> usersBornToday = getUsersBornToday();<br></br>  for (User user : usersBornToday) <br></br>  {<br></br>   try <br></br>   {<br></br>    Email email = new Email();<br></br>    email.setFrom("admin@sivalabs.com");<br></br>    email.setSubject("Happy BirthDay");<br></br>    email.setTo(user.getEmail());<br></br>    email.setText("<h1>Dear "+user.getName()+<br></br>      ", <br></br>Many Many Happy Returns of the day :-)</h1>");<br></br>     <br></br>    byte[] data = null;<br></br>    ClassPathResource img = new ClassPathResource("HBD.gif");<br></br>    InputStream inputStream = img.getInputStream();<br></br>    data = new byte[inputStream.available()];<br></br>    while((inputStream.read(data)!=-1));<br></br>   <br></br>    Attachment attachment = new Attachment(data, "HappyBirthDay", <br></br>      "image/gif", true);<br></br>    email.addAttachment(attachment);<br></br>   <br></br>    emailService.sendEmail(email);<br></br>   }<br></br>   catch (MessagingException e) <br></br>   {<br></br>    e.printStackTrace();<br></br>   }<br></br>   catch (Exception e) <br></br>   {<br></br>    e.printStackTrace();<br></br>   }<br></br>  }<br></br> }<br></br> <br></br> private List<User> getUsersBornToday()<br></br> {<br></br>  List<User> users = new ArrayList<User>();<br></br>  User user1 = new User("Siva Prasad", "sivaprasadreddy.k@gmail.com", new Date());<br></br>  users.add(user1);<br></br>  User user2 = new User("John", "abcd@gmail.com", new Date());<br></br>  users.add(user2);<br></br>  return users;<br></br> }<br></br>}<br></br><br></br>

  
**applicationContext.xml**  

    
    <beans><br></br><br></br> <bean><br></br> <property name="triggers"><br></br>  <list><br></br>   <ref bean="birthdayWisherCronTrigger" /><br></br>  </list><br></br> </property><br></br> </bean><br></br> <bean><br></br>  <property name="jobDetail" ref="birthdayWisherJob" /><br></br>  <!-- run every morning at 6 AM --><br></br>  <property name="cronExpression" value="0/5 * * * * ?" /><br></br> </bean><br></br><br></br> <bean name="birthdayWisherJob"><br></br>  <property name="jobClass" value="com.sivalabs.reminders.BirthdayWisherJob" /><br></br>  <property name="jobDataAsMap"><br></br>   <map><br></br>    <entry value-ref="emailService" key="emailService"></entry><br></br>   </map><br></br>  </property><br></br> </bean><br></br> <br></br> <bean><br></br>  <property ref="mailSender" name="mailSender"></property><br></br> </bean><br></br> <br></br> <bean><br></br>  <property name="defaultEncoding" value="UTF-8"/> <br></br>  <property name="host" value="smtp.gmail.com" /><br></br>  <property name="port" value="465" /><br></br>  <property name="protocol" value="smtps" /><br></br>  <property name="username" value="admin@gmail.com"/><br></br>  <property name="password" value="*****"/><br></br>  <property name="javaMailProperties"><br></br>   <props><br></br>    <prop key="mail.smtps.auth">true</prop><br></br>    <prop key="mail.smtps.starttls.enable">true</prop><br></br>    <prop key="mail.smtps.debug">true</prop><br></br>   </props><br></br>  </property><br></br> </bean><br></br> <br></br></beans><br></br>

  
** TestClient.java **  

    
    package com.sivalabs.reminders;<br></br><br></br>import org.springframework.context.ApplicationContext;<br></br>import org.springframework.context.support.ClassPathXmlApplicationContext;<br></br><br></br>public class TestClient {<br></br><br></br> <br></br> public static void main(String[] args) <br></br> {<br></br>  ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");  <br></br> }<br></br><br></br>}<br></br><br></br>
