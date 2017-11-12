---
title: Spring and Quartz Integration Using Custom Annotation
author: Siva
type: post
date: 2011-10-10T11:44:00+00:00
url: /2011/10/spring-and-quartz-integration-using-custom-annotation/
blogger_blog:
  - sivalabs.blogspot.com
blogger_author:
  - Siva Prasad Reddy
blogger_permalink:
  - /2011/10/spring-and-quartz-integration-using.html
blogger_internal:
  - /feeds/5739837119650074728/posts/default/6249489303692166722
post_views_count:
  - 15
categories:
  - Spring
tags:
  - Quartz
  - Spring

---
We know Spring has support for integrating with Quartz framework.  
But as of now Spring supports only static xml declarative approach only.  
If you want to see how to integrate Spring+Quartz you can refer [Spring + Quartz Integration ][1].

As part of my pet project requirement I got to schedule the Jobs dynamically and I though of following 2 options:  
1. Using Annotations for providing Job Metada   
2. Loading the Job Metadata from Database

For now I thought of going ahead with Annotation based approach and I want to integrate it with Spring as well.  
Here is how I did it.

1. Create a Custom Annotation QuartzJob

<pre>package com.sivalabs.springsamples.jobscheduler;<br /><br />import java.lang.annotation.Documented;<br />import java.lang.annotation.ElementType;<br />import java.lang.annotation.Retention;<br />import java.lang.annotation.RetentionPolicy;<br />import java.lang.annotation.Target;<br /><br />import org.springframework.stereotype.Component;<br /><br />@Target({ElementType.TYPE})<br />@Retention(RetentionPolicy.RUNTIME)<br />@Documented<br />@Component<br />@Scope("prototype")<br />public @interface QuartzJob <br />{<br /> <br /> String name();<br /> String group() default "DEFAULT_GROUP";<br /> String cronExp();<br />}<br /></pre>

2. Create an ApplicationListener to scan for all the Job implementation classes and schedule them using Quartz scheduler.

<pre>package com.sivalabs.springsamples.jobscheduler;<br /><br />import java.util.ArrayList;<br />import java.util.List;<br />import java.util.Map;<br />import java.util.Set;<br /><br />import org.quartz.Job;<br />import org.quartz.JobDetail;<br />import org.quartz.Scheduler;<br />import org.quartz.SchedulerException;<br />import org.springframework.beans.factory.annotation.Autowired;<br />import org.springframework.context.ApplicationContext;<br />import org.springframework.context.ApplicationListener;<br />import org.springframework.context.event.ContextRefreshedEvent;<br />import org.springframework.core.annotation.AnnotationUtils;<br />import org.springframework.scheduling.quartz.CronTriggerBean;<br />import org.springframework.scheduling.quartz.JobDetailBean;<br /><br />public class QuartJobSchedulingListener <br />    implements ApplicationListener&lt;ContextRefreshedEvent&gt;<br />{ <br /> @Autowired<br /> private Scheduler scheduler;<br /> <br /> @Override<br /> public void onApplicationEvent(ContextRefreshedEvent event)<br /> {<br />  try <br />  {<br />    ApplicationContext applicationContext = event.getApplicationContext();<br />    List&lt;CronTriggerBean&gt; cronTriggerBeans = this.loadCronTriggerBeans(applicationContext);<br />    this.scheduleJobs(cronTriggerBeans);<br />  } <br />  catch (Exception e) <br />  {<br />    e.printStackTrace();<br />  }<br /> }<br /> <br /> private List&lt;CronTriggerBean&gt; loadCronTriggerBeans(ApplicationContext applicationContext)<br /> {<br />   Map&lt;String, Object&gt; quartzJobBeans = <br />    applicationContext.getBeansWithAnnotation(QuartzJob.class);<br />  <br />   Set&lt;String&gt; beanNames = quartzJobBeans.keySet();<br />  <br />   List&lt;CronTriggerBean&gt; cronTriggerBeans = new ArrayList&lt;CronTriggerBean&gt;();<br />  <br />   for (String beanName : beanNames) <br />   {<br />     CronTriggerBean cronTriggerBean = null;<br />     Object object = quartzJobBeans.get(beanName);<br />     System.out.println(object);<br />     try <br />     {<br />      cronTriggerBean = this.buildCronTriggerBean(object);<br />     } <br />     catch (Exception e) <br />     {<br />      e.printStackTrace();<br />     }<br />   <br />     if(cronTriggerBean != null)<br />     {<br />      cronTriggerBeans.add(cronTriggerBean);<br />     }<br />   }<br />   return cronTriggerBeans;<br /> }<br /> <br /> public CronTriggerBean buildCronTriggerBean(Object job) throws Exception<br /> {<br />   CronTriggerBean cronTriggerBean = null;<br />   QuartzJob quartzJobAnnotation = <br />     AnnotationUtils.findAnnotation(job.getClass(), QuartzJob.class);<br />     <br />   if(Job.class.isAssignableFrom(job.getClass()))<br />   {<br />     System.out.println("It is a Quartz Job");<br />     cronTriggerBean = new CronTriggerBean();<br />     cronTriggerBean.setCronExpression(quartzJobAnnotation.cronExp());    <br />     cronTriggerBean.setName(quartzJobAnnotation.name()+"_trigger");<br />     //cronTriggerBean.setGroup(quartzJobAnnotation.group());<br />     JobDetailBean jobDetail = new JobDetailBean();<br />     jobDetail.setName(quartzJobAnnotation.name());<br />     //jobDetail.setGroup(quartzJobAnnotation.group());<br />     jobDetail.setJobClass(job.getClass());<br />     cronTriggerBean.setJobDetail(jobDetail);   <br />   }<br />   else<br />   {<br />    throw new RuntimeException(job.getClass()+" doesn't implemented "+Job.class);<br />   }<br />   return cronTriggerBean;<br /> }<br /> <br /> protected void scheduleJobs(List&lt;CronTriggerBean&gt; cronTriggerBeans)<br /> {<br />  for (CronTriggerBean cronTriggerBean : cronTriggerBeans) <br />  {<br />    JobDetail jobDetail = cronTriggerBean.getJobDetail();<br />    try <br />    {<br />     scheduler.scheduleJob(jobDetail, cronTriggerBean);<br />    } <br />    catch (SchedulerException e) <br />    {<br />     e.printStackTrace();<br />    }   <br />  }<br /> }<br />}<br /></pre>

3. Create a customized JobFactory to use Spring beans as Job implementation objects.

<pre>package com.sivalabs.springsamples.jobscheduler;<br /><br />import org.quartz.Job;<br />import org.quartz.spi.TriggerFiredBundle;<br />import org.springframework.beans.BeanWrapper;<br />import org.springframework.beans.MutablePropertyValues;<br />import org.springframework.beans.PropertyAccessorFactory;<br />import org.springframework.beans.factory.annotation.Autowired;<br />import org.springframework.context.ApplicationContext;<br />import org.springframework.scheduling.quartz.SpringBeanJobFactory;<br /><br />public class SpringQuartzJobFactory extends SpringBeanJobFactory<br />{<br /> @Autowired<br /> private ApplicationContext ctx;<br /><br /> @Override<br /> protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception <br /> {<br />     @SuppressWarnings("unchecked")<br />  Job job = ctx.getBean(bundle.getJobDetail().getJobClass());<br />     BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(job);<br />     MutablePropertyValues pvs = new MutablePropertyValues();<br />     pvs.addPropertyValues(bundle.getJobDetail().getJobDataMap());<br />     pvs.addPropertyValues(bundle.getTrigger().getJobDataMap());<br />     bw.setPropertyValues(pvs, true);<br />     return job;<br /> } <br />}<br /></pre>

4. Create the Job implementation classes and Annotate them using @QuartzJob



<pre>package com.sivalabs.springsamples.jobscheduler;<br /><br />import java.util.Date;<br /><br />import org.quartz.JobExecutionContext;<br />import org.quartz.JobExecutionException;<br />import org.springframework.beans.factory.annotation.Autowired;<br />import org.springframework.scheduling.quartz.QuartzJobBean;<br /><br />@QuartzJob(name="HelloJob", cronExp="0/5 * * * * ?")<br />public class HelloJob extends QuartzJobBean<br />{  <br /> @Override<br /> protected void executeInternal(JobExecutionContext context)<br />   throws JobExecutionException<br /> {<br />  System.out.println("Hello Job is running @ "+new Date());<br />  System.out.println(this.hashCode());  <br /> }<br />}<br /><br /></pre>

5. Configure the SchedulerFactoryBean and QuartJobSchedulingListener in applicationContext.xml

<pre>&lt;beans><br /> &lt;context:annotation-config>&lt;/context:annotation-config><br /> &lt;context:component-scan base-package="com.sivalabs">&lt;/context:component-scan><br /> <br /> &lt;bean>&lt;/bean><br /> &lt;bean><br />  &lt;property name="jobFactory"><br />   &lt;bean>&lt;/bean><br />  &lt;/property><br /> &lt;/bean><br /> <br />&lt;/beans><br /></pre>

6. Test Client

<pre>package com.sivalabs.springsamples;<br /><br />import org.quartz.Job;<br />import org.springframework.context.ApplicationContext;<br />import org.springframework.context.support.ClassPathXmlApplicationContext;<br /><br />import com.sivalabs.springsamples.jobscheduler.HowAreYouJob;<br />import com.sivalabs.springsamples.jobscheduler.InvalidJob;<br /><br />public class TestClient<br />{<br /> public static void main(String[] args)<br /> {<br />  ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");<br />  System.out.println(context);  <br /> }<br /><br />}<br /></pre>

 [1]: http://sivalabs.blogspot.com/2011/05/spring-quartz-javamail-integration.html