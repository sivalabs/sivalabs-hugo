---
author: siva
comments: true
date: 2011-10-10 11:44:00+00:00
layout: post
slug: spring-and-quartz-integration-using-custom-annotation
title: Spring and Quartz Integration Using Custom Annotation
wordpress_id: 256
categories:
- Quartz
- Spring
tags:
- Quartz
- Spring
---

We know Spring has support for integrating with Quartz framework.  
But as of now Spring supports only static xml declarative approach only.  
If you want to see how to integrate Spring+Quartz you can refer [Spring + Quartz Integration ](http://sivalabs.blogspot.com/2011/05/spring-quartz-javamail-integration.html).  
  
As part of my pet project requirement I got to schedule the Jobs dynamically and I though of following 2 options:  
1. Using Annotations for providing Job Metada   
2. Loading the Job Metadata from Database  
  
For now I thought of going ahead with Annotation based approach and I want to integrate it with Spring as well.  
Here is how I did it.  
  
1. Create a Custom Annotation QuartzJob  
  

    
    package com.sivalabs.springsamples.jobscheduler;<br></br><br></br>import java.lang.annotation.Documented;<br></br>import java.lang.annotation.ElementType;<br></br>import java.lang.annotation.Retention;<br></br>import java.lang.annotation.RetentionPolicy;<br></br>import java.lang.annotation.Target;<br></br><br></br>import org.springframework.stereotype.Component;<br></br><br></br>@Target({ElementType.TYPE})<br></br>@Retention(RetentionPolicy.RUNTIME)<br></br>@Documented<br></br>@Component<br></br>@Scope("prototype")<br></br>public @interface QuartzJob <br></br>{<br></br> <br></br> String name();<br></br> String group() default "DEFAULT_GROUP";<br></br> String cronExp();<br></br>}<br></br>

  
2. Create an ApplicationListener to scan for all the Job implementation classes and schedule them using Quartz scheduler.  
  

    
    package com.sivalabs.springsamples.jobscheduler;<br></br><br></br>import java.util.ArrayList;<br></br>import java.util.List;<br></br>import java.util.Map;<br></br>import java.util.Set;<br></br><br></br>import org.quartz.Job;<br></br>import org.quartz.JobDetail;<br></br>import org.quartz.Scheduler;<br></br>import org.quartz.SchedulerException;<br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.context.ApplicationContext;<br></br>import org.springframework.context.ApplicationListener;<br></br>import org.springframework.context.event.ContextRefreshedEvent;<br></br>import org.springframework.core.annotation.AnnotationUtils;<br></br>import org.springframework.scheduling.quartz.CronTriggerBean;<br></br>import org.springframework.scheduling.quartz.JobDetailBean;<br></br><br></br>public class QuartJobSchedulingListener <br></br>    implements ApplicationListener<ContextRefreshedEvent><br></br>{ <br></br> @Autowired<br></br> private Scheduler scheduler;<br></br> <br></br> @Override<br></br> public void onApplicationEvent(ContextRefreshedEvent event)<br></br> {<br></br>  try <br></br>  {<br></br>    ApplicationContext applicationContext = event.getApplicationContext();<br></br>    List<CronTriggerBean> cronTriggerBeans = this.loadCronTriggerBeans(applicationContext);<br></br>    this.scheduleJobs(cronTriggerBeans);<br></br>  } <br></br>  catch (Exception e) <br></br>  {<br></br>    e.printStackTrace();<br></br>  }<br></br> }<br></br> <br></br> private List<CronTriggerBean> loadCronTriggerBeans(ApplicationContext applicationContext)<br></br> {<br></br>   Map<String, Object> quartzJobBeans = <br></br>    applicationContext.getBeansWithAnnotation(QuartzJob.class);<br></br>  <br></br>   Set<String> beanNames = quartzJobBeans.keySet();<br></br>  <br></br>   List<CronTriggerBean> cronTriggerBeans = new ArrayList<CronTriggerBean>();<br></br>  <br></br>   for (String beanName : beanNames) <br></br>   {<br></br>     CronTriggerBean cronTriggerBean = null;<br></br>     Object object = quartzJobBeans.get(beanName);<br></br>     System.out.println(object);<br></br>     try <br></br>     {<br></br>      cronTriggerBean = this.buildCronTriggerBean(object);<br></br>     } <br></br>     catch (Exception e) <br></br>     {<br></br>      e.printStackTrace();<br></br>     }<br></br>   <br></br>     if(cronTriggerBean != null)<br></br>     {<br></br>      cronTriggerBeans.add(cronTriggerBean);<br></br>     }<br></br>   }<br></br>   return cronTriggerBeans;<br></br> }<br></br> <br></br> public CronTriggerBean buildCronTriggerBean(Object job) throws Exception<br></br> {<br></br>   CronTriggerBean cronTriggerBean = null;<br></br>   QuartzJob quartzJobAnnotation = <br></br>     AnnotationUtils.findAnnotation(job.getClass(), QuartzJob.class);<br></br>     <br></br>   if(Job.class.isAssignableFrom(job.getClass()))<br></br>   {<br></br>     System.out.println("It is a Quartz Job");<br></br>     cronTriggerBean = new CronTriggerBean();<br></br>     cronTriggerBean.setCronExpression(quartzJobAnnotation.cronExp());    <br></br>     cronTriggerBean.setName(quartzJobAnnotation.name()+"_trigger");<br></br>     //cronTriggerBean.setGroup(quartzJobAnnotation.group());<br></br>     JobDetailBean jobDetail = new JobDetailBean();<br></br>     jobDetail.setName(quartzJobAnnotation.name());<br></br>     //jobDetail.setGroup(quartzJobAnnotation.group());<br></br>     jobDetail.setJobClass(job.getClass());<br></br>     cronTriggerBean.setJobDetail(jobDetail);   <br></br>   }<br></br>   else<br></br>   {<br></br>    throw new RuntimeException(job.getClass()+" doesn't implemented "+Job.class);<br></br>   }<br></br>   return cronTriggerBean;<br></br> }<br></br> <br></br> protected void scheduleJobs(List<CronTriggerBean> cronTriggerBeans)<br></br> {<br></br>  for (CronTriggerBean cronTriggerBean : cronTriggerBeans) <br></br>  {<br></br>    JobDetail jobDetail = cronTriggerBean.getJobDetail();<br></br>    try <br></br>    {<br></br>     scheduler.scheduleJob(jobDetail, cronTriggerBean);<br></br>    } <br></br>    catch (SchedulerException e) <br></br>    {<br></br>     e.printStackTrace();<br></br>    }   <br></br>  }<br></br> }<br></br>}<br></br>

  
3. Create a customized JobFactory to use Spring beans as Job implementation objects.  
  

    
    package com.sivalabs.springsamples.jobscheduler;<br></br><br></br>import org.quartz.Job;<br></br>import org.quartz.spi.TriggerFiredBundle;<br></br>import org.springframework.beans.BeanWrapper;<br></br>import org.springframework.beans.MutablePropertyValues;<br></br>import org.springframework.beans.PropertyAccessorFactory;<br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.context.ApplicationContext;<br></br>import org.springframework.scheduling.quartz.SpringBeanJobFactory;<br></br><br></br>public class SpringQuartzJobFactory extends SpringBeanJobFactory<br></br>{<br></br> @Autowired<br></br> private ApplicationContext ctx;<br></br><br></br> @Override<br></br> protected Object createJobInstance(TriggerFiredBundle bundle) throws Exception <br></br> {<br></br>     @SuppressWarnings("unchecked")<br></br>  Job job = ctx.getBean(bundle.getJobDetail().getJobClass());<br></br>     BeanWrapper bw = PropertyAccessorFactory.forBeanPropertyAccess(job);<br></br>     MutablePropertyValues pvs = new MutablePropertyValues();<br></br>     pvs.addPropertyValues(bundle.getJobDetail().getJobDataMap());<br></br>     pvs.addPropertyValues(bundle.getTrigger().getJobDataMap());<br></br>     bw.setPropertyValues(pvs, true);<br></br>     return job;<br></br> } <br></br>}<br></br>

  
4. Create the Job implementation classes and Annotate them using @QuartzJob  
  
  

    
    package com.sivalabs.springsamples.jobscheduler;<br></br><br></br>import java.util.Date;<br></br><br></br>import org.quartz.JobExecutionContext;<br></br>import org.quartz.JobExecutionException;<br></br>import org.springframework.beans.factory.annotation.Autowired;<br></br>import org.springframework.scheduling.quartz.QuartzJobBean;<br></br><br></br>@QuartzJob(name="HelloJob", cronExp="0/5 * * * * ?")<br></br>public class HelloJob extends QuartzJobBean<br></br>{  <br></br> @Override<br></br> protected void executeInternal(JobExecutionContext context)<br></br>   throws JobExecutionException<br></br> {<br></br>  System.out.println("Hello Job is running @ "+new Date());<br></br>  System.out.println(this.hashCode());  <br></br> }<br></br>}<br></br><br></br>

  
5. Configure the SchedulerFactoryBean and QuartJobSchedulingListener in applicationContext.xml  
  

    
    <beans><br></br> <context:annotation-config></context:annotation-config><br></br> <context:component-scan base-package="com.sivalabs"></context:component-scan><br></br> <br></br> <bean></bean><br></br> <bean><br></br>  <property name="jobFactory"><br></br>   <bean></bean><br></br>  </property><br></br> </bean><br></br> <br></br></beans><br></br>

  
6. Test Client  
  

    
    package com.sivalabs.springsamples;<br></br><br></br>import org.quartz.Job;<br></br>import org.springframework.context.ApplicationContext;<br></br>import org.springframework.context.support.ClassPathXmlApplicationContext;<br></br><br></br>import com.sivalabs.springsamples.jobscheduler.HowAreYouJob;<br></br>import com.sivalabs.springsamples.jobscheduler.InvalidJob;<br></br><br></br>public class TestClient<br></br>{<br></br> public static void main(String[] args)<br></br> {<br></br>  ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");<br></br>  System.out.println(context);  <br></br> }<br></br><br></br>}<br></br>
