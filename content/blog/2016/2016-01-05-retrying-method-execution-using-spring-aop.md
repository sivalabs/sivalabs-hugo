---
title: Retrying Method Execution using Spring AOP
author: Siva
type: post
date: 2016-01-05T15:40:36.000Z
url: /blog/retrying-method-execution-using-spring-aop/
categories:
  - Spring
tags:
  - Spring
aliases:
  - /retrying-method-execution-using-spring-aop/
---
One of my blog follower sends an email asking me to show an example of **"RealWorld Usage of Spring AOP"**. He mentioned that in most of the examples the usage of **Spring AOP** is demonstrated for **logging method entry/exit** or **Transaction management** or **Security checks**. He wanted to know how Spring AOP is being used in **"Real Project for Real Problems"**.

So I would like to show how I have used Spring AOP for one of my project to handle a real problem.

<!--more-->


**We won't face some kind of problems in development phases and only come to know during Load Testing or in production environments only.**
  
**For example:**

  * Remote WebService invocation failures due to network latency issues
  * Database query failures because of Lock exceptions
  
    etc

In most of the cases just retrying the same operation is sufficient to solve these kind of failures.
  
Let us see how we can use Spring AOP to automatically retry the method execution if any exception occurs.

We can use Spring AOP **@Around** advice to create a proxy for those objects whose methods needs to be retried and implement the retry logic in **Aspect**.

Before jumping on to implementing these Spring Advice and Aspect, first let us write a simple utility to execute a **"Task"** which automatically retry for N times ignoring the given set of Exceptions.

```java
public interface Task<T> {
	T execute();
}
```

```java
import java.util.HashSet;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TaskExecutionUtil 
{
	
	private static Logger logger = LoggerFactory.getLogger(TaskExecutionUtil.class);

	@SafeVarargs
	public static <T> T execute(Task<T> task, 
								int noOfRetryAttempts, 
								long sleepInterval, 
								Class<? extends Throwable>... ignoreExceptions) 
	{
		
		if (noOfRetryAttempts < 1) {
			noOfRetryAttempts = 1;
		}
		Set<Class<? extends Throwable>> ignoreExceptionsSet = new HashSet<Class<? extends Throwable>>();
		if (ignoreExceptions != null && ignoreExceptions.length > 0) {
			for (Class<? extends Throwable> ignoreException : ignoreExceptions) {
				ignoreExceptionsSet.add(ignoreException);
			}
		}
		
		logger.debug("noOfRetryAttempts = "+noOfRetryAttempts);
		logger.debug("ignoreExceptionsSet = "+ignoreExceptionsSet);
		
		T result = null;
		for (int retryCount = 1; retryCount <= noOfRetryAttempts; retryCount++) {
			logger.debug("Executing the task. Attemp#"+retryCount);
			try {
				result = task.execute();
				break;
			} catch (RuntimeException t) {
				Throwable e = t.getCause();
				logger.error(" Caught Exception class"+e.getClass());
				for (Class<? extends Throwable> ignoreExceptionClazz : ignoreExceptionsSet) {
					logger.error(" Comparing with Ignorable Exception : "+ignoreExceptionClazz.getName());
					
					if (!ignoreExceptionClazz.isAssignableFrom(e.getClass())) {
						logger.error("Encountered exception which is not ignorable: "+e.getClass());
						logger.error("Throwing exception to the caller");
						
						throw t;
					}
				}
				logger.error("Failed at Retry attempt :" + retryCount + " of : " + noOfRetryAttempts);
				if (retryCount >= noOfRetryAttempts) {
					logger.error("Maximum retrial attempts exceeded.");
					logger.error("Throwing exception to the caller");
					throw t;
				}
				try {
					Thread.sleep(sleepInterval);
				} catch (InterruptedException e1) {
					//Intentionally left blank
				}
			}
		}
		return result;
	}

}
```

I hope this method is self explanatory. It is taking a **Task** and retries **noOfRetryAttempts** times in case method **task.execute()** throws any Exception and **ignoreExceptions** indicates what type of exceptions to be ignored while retrying.

Now let us create a Retry annotation as follows:

```java
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public  @interface Retry {
	
	public int retryAttempts() default 3;
	
	public long sleepInterval() default 1000L; //milliseconds
	
	Class<? extends Throwable>[] ignoreExceptions() default { RuntimeException.class };
	
}
```

We will use this **@Retry** annotation to demarcate which methods needs to be retried.

Now let us implement the Aspect which applies to the method with **@Retry** annotation.

```java
import java.lang.reflect.Method;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class MethodRetryHandlerAspect {
	
	private static Logger logger = LoggerFactory.getLogger(MethodRetryHandlerAspect.class);
	
	@Around("@annotation(com.sivalabs.springretrydemo.Retry)")
	public Object audit(ProceedingJoinPoint pjp) 
	{
		Object result = null;
		result = retryableExecute(pjp);
	    return result;
	}
	
	protected Object retryableExecute(final ProceedingJoinPoint pjp)
	{
		MethodSignature signature = (MethodSignature) pjp.getSignature();
		Method method = signature.getMethod();
		logger.debug("-----Retry Aspect---------");
		logger.debug("Method: "+signature.toString());

		Retry retry = method.getDeclaredAnnotation(Retry.class);
		int retryAttempts = retry.retryAttempts();
		long sleepInterval = retry.sleepInterval();
		Class<? extends Throwable>[] ignoreExceptions = retry.ignoreExceptions();
		
		Task<Object> task = new Task<Object>() {
			@Override
			public Object execute() {
				try {
					return pjp.proceed();
				} catch (Throwable e) {
					throw new RuntimeException(e);
				}
			}
		};
		return TaskExecutionUtil.execute(task, retryAttempts, sleepInterval, ignoreExceptions);
	}
}
```

That's it. We just need some test cases to actually test it.

First create **AppConfig.java** configuration class as follows:

```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@ComponentScan
@EnableAspectJAutoProxy
public class AppConfig {

}
```

And couple of dummy Service beans.

```java
import org.springframework.stereotype.Service;

@Service
public class ServiceA {
	
	private int counter = 1;
	
	public void method1() {
		System.err.println("----method1----");
	}
	
	@Retry(retryAttempts=5, ignoreExceptions={NullPointerException.class})
	public void method2() {
		System.err.println("----method2 begin----");
		if(counter != 3){
			counter++;
			throw new NullPointerException();
		}
		System.err.println("----method2 end----");		
	}
}
```

```java
import java.io.IOException;
import org.springframework.stereotype.Service;

@Service
public class ServiceB {
	
	@Retry(retryAttempts = 2, ignoreExceptions={IOException.class})
	public void method3() {
		System.err.println("----method3----");
		if(1 == 1){
			throw new ArrayIndexOutOfBoundsException();
		}
	}
	
	@Retry
	public void method4() {
		System.err.println("----method4----");
	}
}
```

Finally write a simple Junit test to invoke these methods.

```java
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes=AppConfig.class)
public class RetryTest 
{
	@Autowired ServiceA svcA;
	@Autowired ServiceB svcB;
	
	@Test
	public void testA()
	{
		svcA.method1();
	}
	
	@Test
	public void testB()
	{
		svcA.method2();
	}
	
	@Test(expected=RuntimeException.class)
	public void testC()
	{
		svcB.method3();
	}
	
	@Test
	public void testD()
	{
		svcB.method4();
	}
}
```

Yeah, I know I could have written these test methods a bit better, but I hope you got the idea.

Run the JUnit tests and observe the log statement to verify whether the method retry is happening in case of Exception or not.

**Case#1:** When invoking ServiceA.method1() is invoked MethodRetryHandlerAspect won't be applied at all.

**Case#2:** When invoking ServiceA.method2() is invoked, we are maintaining a counter and throwing NullPointerException for 2 times. But we have marked that method to ignore NullPointerExceptions. So it will continue to retry for 5 times. But 3rd time method will be executed normally and exits the method normally.

**Case#3:** When invoking ServiceB.method3() is invoked, we are throwing ArrayIndexOutOfBoundsException but that method is marked to ignore only IOException only.
  
So this method execution won't be retried and throws the Exception immediately.

**Case#4:** When invoking ServiceB.method4() is invoked, everything is fine so it should exit in the first attempt itself normally.

I hope this example demonstrate a good enough real world usage of Spring AOP 🙂
