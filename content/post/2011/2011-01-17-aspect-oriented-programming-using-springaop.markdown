---
author: siva
comments: true
date: 2011-01-17 18:01:00+00:00
layout: post
slug: aspect-oriented-programming-using-springaop
title: Aspect Oriented Programming using SpringAOP
wordpress_id: 287
categories:
- Spring
tags:
- Spring
---

While developing software applications for a business we do recieve the requirements either from requirements gathering team or from business analysts. In general those requirements are functional requirements which represents the activities that the business is doing. while developing software applications, apart from the functional requirements we should also consider some other points like performance, transaction management, security, logging etc. These are called non-functional requirements.  
  
Suppose let us consider a BookStore application which is providing web access the store. User can browse the various categories of books, add the interested books to cart and finally checkout, do payment and get the books.  
  
For this app we might receive the requirements from business analyst as follows:  
1. A login/registration screen to enter into BookStore.  
2. Users should be able to browse through various categories of books  
3. Users should be able to search books by name, author name, publisher  
4. Users should be able to add/remove the books to/from his cart  
5. Users should be able to see what are all the items currently in his cart  
6. Users should be able to checkout and provide facility to pay the amount through some payment gateway  
7. A successful message will be shown to users with all the details of his purchases.  
8. A failure message will be shown to users with the cause of failure.  
9. BookStore administrator/manager should be able to provide the access to add/remove/update book details.  
  
  
All the above requirements comes under Functional Requirements. While implementing the above we should also take care of the following things even though they are not explicitly mentioned:  
  
1. Role based access to UI. Here only Administrators/Managers only can access have access to add/remove/update book details.[Role based Authorization]  
2. Atomicity in Purchasing. Suppose a user logged into the BookStore and add 5 books to his cart, checked out and did payment. In the back-end implementation we may need to enter this purchase details in 3 tables. If after inserting the data into 2 tables and system crashed the whole operation should be rolled-back.[Transaction Management].  
3. No one is perfect and no system is flawless. So if something went wrong and the development team has to figure it out what went wrong logging will be most useful. So logging should be implemented in such a way that developer should be able to figured it out where exactly it got failed and fix it.[Logging]  
  
The above implicit requirements are called non-functional requirements. In addition to the above Performance will obviously be a crucial non-functional requirement for many public facing websites.  
  
So with all the above functional requirements we can build the system decomposing the whole system into various components by taking care of non-functional requirements through out the components.  
  

    
    public class OrderService<br></br>{<br></br>    private OrderDAO orderDAO;<br></br>    <br></br>    public boolean placeOrder(Order order)<br></br>    {<br></br>        boolean flag =false;<br></br>        logger.info("Entered into OrderService.placeOrder(order) method");<br></br>        try<br></br>        {<br></br>            flag = orderDAO.saveOrder(order);<br></br>        }<br></br>        catch(Exception e)<br></br>        {<br></br>            logger.error("Error occured in OrderService.placeOrder(order) method");<br></br>        }<br></br>        logger.info("Exiting from OrderService.placeOrder(order) method");<br></br>        return flag;<br></br>    }<br></br>}<br></br>

  

    
    public class OrderDAO<br></br>{<br></br>    public boolean saveOrder(Order order)<br></br>    {<br></br>        boolean flag =false;<br></br>        logger.info("Entered into OrderDAO.saveOrder(order) method");<br></br>        Connectoin conn = null;<br></br>        try<br></br>        {<br></br>            conn = getConnection();//get database connection<br></br>            conn.setAutoCommit(false);<br></br>            // insert data into orders_master table which generates an order_id<br></br>            // insert order details into order_details table with the generated order_id<br></br>            // insert shipment details into order_shipment table<br></br>            conn.commit();<br></br>            conn.setAutoCommit(true);<br></br>            flag = true;<br></br>        }<br></br>        catch(Exception e)<br></br>        {<br></br>            logger.error("Error occured in OrderDAO.saveOrder(order) method");<br></br>            conn.rollback();<br></br>        }<br></br>        logger.info("Exiting from OrderDAO.saveOrder(order) method");<br></br>        return flag;<br></br>    }<br></br>}<br></br>

Here in the above code, the functional requirement implementation and non-functional requirement implementation is mingled in the same place.  
Logging is placed accross OrderService and OrderDAO classes. Transaction Management is spanned across DAOs.  
With this we will have several issues:  
1. The classes needs to be changed either to change functional or non-functional requirements.  
For Ex: At some point later in the development if the Team decides to log the Method Entry/Exit information along with TimeStamp we need to change almost all the classes.  
  
2. The Transaction Management code setting the auto-commit to false in the beginning, doing the DB operations, committing/rollbacking the operation logic will be duplicated across all the DAOs.  
  
Here if we see Method Entry/Exit logging is spanned across all the modules. Transaction Management is spanned across all the DAO's.  
These kind of requirements which span across the modules/components is called Cross Cutting Concerns.  
  
  
To better design the system we should separate out these cross cutting concerns from actual business logic so that it will be easier to change or enhance or maintain later point of time.  
  
Aspect Oriented Programming is a methodology which says separate the cross cutting concerns from actual business logic.  
  
So let us follow AOP methodology and redesign the above two classes separating the cross cutting concerns.  
  

    
    public interface IOrderService<br></br>{<br></br>    public boolean placeOrder(Order order);<br></br>}<br></br>
    
    public class OrderService implements IOrderService<br></br>{<br></br>    private OrderDAO orderDAO;<br></br>    <br></br>    public boolean placeOrder(Order order)<br></br>    {<br></br>        return orderDAO.saveOrder(order);<br></br>    }<br></br>}<br></br>
    
    public class OrderDAO<br></br>{<br></br>    public boolean saveOrder(Order order)<br></br>    {<br></br>        boolean flag =false;<br></br>        <br></br>        Connectoin conn = null;<br></br>        try<br></br>        {<br></br>            conn = getConnection();//get database connection<br></br>            // insert data into orders_master table which generates an order_id<br></br>            // insert order details into order_details table with the generated order_id<br></br>            // insert shipment details into order_shipment table<br></br>            flag = true;<br></br>        }<br></br>        catch(Exception e)<br></br>        {<br></br>            logger.error(e);            <br></br>        }        <br></br>        return flag;<br></br>    }<br></br>}<br></br>

Now lets create a LoggingInterceptor implementing how logging should be done and create a Proxy for OrderService which takes the call from caller, log the entry/exit entries using LoggingInterceptor and delegates to actual OrderService.  
  
By using Dynamic Proxies we can separate out implementation of cross cutting concerns(Logging) from actual business logic as follows.  

    
    public class LoggingInterceptor<br></br>{<br></br>    public void logEntry(Method m)<br></br>    {<br></br>        logger.info("Entered into "+m.getName()+" method");<br></br>    }<br></br>    public void logExit(Method m)<br></br>    {<br></br>        logger.info("Exiting from "+m.getName()+" method");<br></br>    }<br></br>}<br></br>
    
    public class OrderServiceProxy implements IOrderService extends LoggingInterceptor<br></br>{<br></br>    private OrderService orderService;<br></br>    <br></br>    public boolean placeOrder(Order order)<br></br>    {<br></br>        boolean flag =false;<br></br>        Method m = getThisMethod();//get OrderService.placeOrder() Method object<br></br>        logEntry(m);<br></br>        flag = orderService.placeOrder(order);<br></br>        logExit(m);<br></br>        return flag;<br></br>    }<br></br>}<br></br>

Now the OrderService caller(OrderController) can get the OrderServiceProxy and place the order as:  

    
    public class OrderController<br></br>{<br></br>    public void checkout()<br></br>    {<br></br>        Order order = new Order();<br></br>        //set the order details<br></br>        IOrderService orderService = getOrderServiceProxy();<br></br>        orderService.placeOrder(order);<br></br>    }<br></br>}<br></br>

We have several AOP frameworks to seperate out implementation of cross cutting concerns.  
a)Spring AOP  
b)AspectJ  
b)JBoss AOP   
  
Now lets see how we can separate out Logging from actual business logic using Spring AOP.  
  
Before going to use Spring AOP, first we need to understand the following:  
  
**JoinPoint::** A joinpoint is a point in the execution of the application where an aspect can be plugged in. This point could be a method being called, an exception being thrown, or even a field being modified.  
  
**Pointcut:** A pointcut definition matches one or more joinpoints at which advice should be woven. Often you specify these pointcuts using explicit class and method names or through regular expressions that define matching class and method name patterns.  
  
**Aspect:** An aspect is the merger of advice and pointcuts.  
  
**Advice:**The job of an aspect is called advice.  
  
SpringAOP supports several types of advices:  
1. Before: This advice weaves the aspect before method call.  
2. AfterReturning: This advice weaves the aspect after method call.  
3. AfterThrowing: This advice weaves the aspect when method throws an Exception.  
4. Around: This advice weaves the aspect before and after method call.  
  
Suppose we have the following ArithmeticCalculator interface and implementation classes.  

    
    package com.springapp.aop;<br></br>public interface ArithmeticCalculator<br></br>{<br></br>    public double add(double a, double b);<br></br>    public double sub(double a, double b);<br></br>    public double mul(double a, double b);<br></br>    public double div(double a, double b);<br></br>}<br></br>
    
    package com.springapp.aop;<br></br>import org.springframework.stereotype.Component;<br></br><br></br>@Component("arithmeticCalculator")<br></br>public class ArithmeticCalculatorImpl implements ArithmeticCalculator<br></br>{<br></br>    public double add(double a, double b)<br></br>    {<br></br>        double result = a + b;<br></br>        System.out.println(a + " + " + b + " = " + result);<br></br>        return result;<br></br>    }<br></br><br></br>    public double sub(double a, double b)<br></br>    {<br></br>        double result = a - b;<br></br>        System.out.println(a + " - " + b + " = " + result);<br></br>        return result;<br></br>    }<br></br><br></br>    public double mul(double a, double b)<br></br>    {<br></br>        double result = a * b;<br></br>        System.out.println(a + " * " + b + " = " + result);<br></br>        return result;<br></br>    }<br></br><br></br>    public double div(double a, double b)<br></br>    {<br></br>        if(b == 0)<br></br>        {<br></br>            throw new IllegalArgumentException("b value must not be zero.");<br></br>        }<br></br>        double result = a / b;<br></br>        System.out.println(a + " / " + b + " = " + result);<br></br>        return result;<br></br>    }<br></br>}<br></br>

The following LoggingAspect class shows various bit and pieces of applying Logging Advice using SpringAOP.  

    
    package com.springapp.aop;<br></br><br></br>import java.util.Arrays;<br></br>import org.apache.commons.logging.Log;<br></br>import org.apache.commons.logging.LogFactory;<br></br>import org.aspectj.lang.JoinPoint;<br></br>import org.aspectj.lang.ProceedingJoinPoint;<br></br>import org.aspectj.lang.annotation.AfterReturning;<br></br>import org.aspectj.lang.annotation.AfterThrowing;<br></br>import org.aspectj.lang.annotation.Around;<br></br>import org.aspectj.lang.annotation.Aspect;<br></br>import org.aspectj.lang.annotation.Before;<br></br>import org.aspectj.lang.annotation.Pointcut;<br></br>import org.springframework.core.annotation.Order;<br></br>import org.springframework.stereotype.Component;<br></br><br></br>@Aspect<br></br>@Component<br></br>public class LoggingAspect<br></br>{<br></br>    private Log log = LogFactory.getLog(this.getClass());<br></br>    <br></br>    @Pointcut("execution(* *.*(..))")<br></br>    protected void loggingOperation() {}<br></br>    <br></br>    @Before("loggingOperation()")<br></br>    @Order(1)<br></br>    public void logJoinPoint(JoinPoint joinPoint)<br></br>    {<br></br>        log.info("Join point kind : " + joinPoint.getKind());<br></br>        log.info("Signature declaring type : "+ joinPoint.getSignature().getDeclaringTypeName());<br></br>        log.info("Signature name : " + joinPoint.getSignature().getName());<br></br>        log.info("Arguments : " + Arrays.toString(joinPoint.getArgs()));<br></br>        log.info("Target class : "+ joinPoint.getTarget().getClass().getName());<br></br>        log.info("This class : " + joinPoint.getThis().getClass().getName());<br></br>    }<br></br>        <br></br>    @AfterReturning(pointcut="loggingOperation()", returning = "result")<br></br>    @Order(2)<br></br>    public void logAfter(JoinPoint joinPoint, Object result)<br></br>    {<br></br>        log.info("Exiting from Method :"+joinPoint.getSignature().getName());<br></br>        log.info("Return value :"+result);<br></br>    }<br></br>    <br></br>    @AfterThrowing(pointcut="execution(* *.*(..))", throwing = "e")<br></br>    @Order(3)<br></br>    public void logAfterThrowing(JoinPoint joinPoint, Throwable e)<br></br>    {<br></br>        log.error("An exception has been thrown in "+ joinPoint.getSignature().getName() + "()");<br></br>        log.error("Cause :"+e.getCause());<br></br>    }<br></br>    <br></br>    @Around("execution(* *.*(..))")<br></br>    @Order(4)<br></br>    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable<br></br>    {<br></br>        log.info("The method " + joinPoint.getSignature().getName()+ "() begins with " + Arrays.toString(joinPoint.getArgs()));<br></br>        try<br></br>        {<br></br>            Object result = joinPoint.proceed();<br></br>            log.info("The method " + joinPoint.getSignature().getName()+ "() ends with " + result);<br></br>            return result;<br></br>        } catch (IllegalArgumentException e)<br></br>        {<br></br>            log.error("Illegal argument "+ Arrays.toString(joinPoint.getArgs()) + " in "+ joinPoint.getSignature().getName() + "()");<br></br>            throw e;<br></br>        }        <br></br>    }<br></br>    <br></br>}<br></br>

**applicationContext.xml**  

    
        <context:annotation-config><br></br>    <context:component-scan base-package="com.springapp"></context:component-scan><br></br>    <aop:aspectj-autoproxy></aop:aspectj-autoproxy></context:annotation-config><br></br>

  
And standalone test client to est the functionality.  

    
    package com.springapp.aop;<br></br><br></br>import org.springframework.context.ApplicationContext;<br></br>import org.springframework.context.support.ClassPathXmlApplicationContext;<br></br><br></br>public class SpringAOPClient<br></br>{<br></br><br></br>    public static void main(String[] args)<br></br>    {<br></br>        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");<br></br>        ArithmeticCalculator calculator = (ArithmeticCalculator) context.getBean("arithmeticCalculator");<br></br>        double sum = calculator.add(12, 23);<br></br>        System.out.println(sum);<br></br>        double div = calculator.div(1, 10);<br></br>        System.out.println(div);<br></br>    }<br></br><br></br>}<br></br>

Required jars:  
  
Spring.jar(2.5.6 or above)  
commons-logging.jar  
aopalliance.jar  
  
aspectjrt.jar  
aspectjweaver.jar  
cglib-nodep-2.1_3.jar  
  
  
We can define the type of advice using @Before, @AfterReturning, @Around etc. We can define pointcuts in different ways.   
@Around("execution(* *.*(..))") means it is an Around advice which will be applied to all classes in all packages and all methods.  
Suppose if we want to apply only for all the services resides in com.myproj.services package, the pointcut would be  
@Around("execution(* com.myproj.services.*.*(..))"). "(..)" mean with any type of arguments.  
  
If we want to apply same pointcuts for many advices we can define a pointcut on a method and can refer that later as follows.  

    
        @Pointcut("execution(* *.*(..))")<br></br>    protected void loggingOperation() {}<br></br>    <br></br>    @Before("loggingOperation()")<br></br>    public void logJoinPoint(JoinPoint joinPoint)<br></br>    {<br></br>    }<br></br>    <br></br>

If multiple Advices has to be applied on same pointcut we can specify the order using @Order on which advices will be applied.  
In the above example @Before will be applied first then @Around will be applied when add() method is called.  
  
With AOP approach the code will be more cleaner and maintainable. SpringAOP is one way of implementing AOP and only supports Method invokation join point. AspectJ is even more powerful and can be applied on several joinputs in addition to Method invokation join point. Spring is also supporting AspectJ integration.
