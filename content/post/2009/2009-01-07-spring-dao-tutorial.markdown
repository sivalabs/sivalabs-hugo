---
author: siva
comments: true
date: 2009-01-07 14:27:00+00:00
layout: post
slug: spring-dao-tutorial
title: Spring DAO Tutorial
wordpress_id: 308
categories:
- Spring
tags:
- Spring
---

  


Employee .java

  


*************************

  


package com.spring.jdbc;  
import java.util.Date;  
public class Employee 

  


{ 

  


private Integer id; 

  


private String empId; 

  


private String name; 

  


private String gender; 

  


private Date dob; 

  


private String address; 

  


private String emailId; 

  


private String password; 

  


private String mobile; 

  


private String department; 

  


private String designation;  

  


  


public Integer getId() {  return id; } 

  


public void setId(Integer id) {  this.id = id; } 

  


public String getEmpId() {  return empId; }

  


public void setEmpId(String empId) {  this.empId = empId; } 

  


public String getName() {  return name; }

  


public void setName(String name) {  this.name = name; }

  


public String getGender() {  return gender; } 

  


public void setGender(String gender) {  this.gender = gender; } 

  


public Date getDob() {  return dob; } 

  


public void setDob(Date dob) {  this.dob = dob; } 

  


public String getAddress() {  return address; }

  


public void setAddress(String address) {  this.address = address; } 

  


public String getEmailId() {  return emailId; } 

  


public void setEmailId(String emailId) {  this.emailId = emailId; } 

  


public String getPassword() {  return password; } 

  


public void setPassword(String password) {  this.password = password; }

  


public String getMobile() {  return mobile; } 

  


public void setMobile(String mobile) {  this.mobile = mobile; } 

  


public String getDepartment() {  return department; } 

  


public void setDepartment(String department) {  this.department = department; } 

  


public String getDesignation() {  return designation; } 

  


public void setDesignation(String designation) {  this.designation = designation; } 

  


}

  


  


****************************

  


EmployeeDAO .java

  


***************************

  


package com.spring.jdbc;  
import java.util.List;  
public interface EmployeeDAO 

  


{ 

  


Employee getEmployee(String empId); 

  


Integer create(Employee employee); 

  


Boolean delete(String empId); 

  


Boolean update(Employee employee); 

  


List search(String empName); 

  


List getAllEmployees(); 

  


}

  


*********************************

  


EmployeeDAOImpl .java

  


-----------------------------

  


package com.spring.jdbc;  
import java.sql.ResultSet;import java.sql.SQLException;

  


import java.util.List;  
import org.springframework.dao.DataAccessException;

  


import org.springframework.jdbc.core.RowMapper;

  


import org.springframework.jdbc.core.support.JdbcDaoSupport;  
  
class EmployeeRowMapper implements RowMapper

  


{  
public Object mapRow(ResultSet rs, int arg1) throws SQLException  

  


{  Employee  employee = new Employee();   

  


employee.setId(rs.getInt("id"));  

  


employee.setEmpId(rs.getString("emp_id"));  

  


employee.setName(rs.getString("name"));  

  


employee.setGender(rs.getString("gender"));  

  


employee.setDob(rs.getDate("dob")) ;  

  


employee.setAddress(rs.getString("address")) ; 

  


employee.setEmailId(rs.getString("email_id")) ;  

  


employee.setPassword(rs.getString("password")) ;  

  


employee.setMobile(rs.getString("mobile")) ;  

  


employee.setDepartment(rs.getString("department")) ;  

  


employee.setDesignation(rs.getString("designation"));  return employee; } 

  


}

  


  


public class EmployeeDAOImpl extends JdbcDaoSupport implements EmployeeDAO

  


{  
public Integer create(Employee employee)

  


{  Integer id = null;  

  


if(this.getEmployee(employee.getEmpId())!=null) 

  


{   

  


throw new RuntimeException("Employee id "+employee.getEmpId()+" is already exist");  

  


} 

  


Object[] params = new Object[]{   

  


employee.getEmpId(),    

  


employee.getName(),  

  


 employee.getGender(),   

  


employee.getDob() ,    

  


employee.getAddress() ,   

  


employee.getEmailId() ,   

  


employee.getPassword() ,    

  


employee.getMobile() ,  

  


 employee.getDepartment() ,   

  


employee.getDesignation()      

  


};  

  


id = this.getJdbcTemplate().update(    "insert into employees(emp_id, name, gender, dob, address, email_id, password, mobile, department, designation) values(?,?,?,?,?,?,?,?,?,?)",     params);  

  


return id;

  


}  
public Boolean delete(String empId)  

  


{   

  


int count = this.getJdbcTemplate().update("delete from employees where emp_id=?", 

  


new Object[]{empId});  

  


Boolean flag = (count>0)? Boolean.TRUE : Boolean.FALSE; 

  


return flag;

  


}  
@SuppressWarnings("unchecked") 

  


public List getAllEmployees()  

  


{  

  


List empList = null;  

  


empList = this.getJdbcTemplate().query("select * from employees", 

  


new EmployeeRowMapper());  

  


return empList;

  


}  
@SuppressWarnings("unchecked") 

  


public Employee getEmployee(String empId)  

  


{  

  


Employee employee = null;  

  


try {  

  


employee = (Employee) this.getJdbcTemplate().queryForObject(     "select * from employees where emp_id=?",     new Object[]{empId},      

  


new EmployeeRowMapper());  

  


}

  


catch (DataAccessException e) 

  


{   

  


logger.info("No employee exist with empId : "+empId);  

  


}     

  


return employee;

  


}

  


  
@SuppressWarnings("unchecked") 

  


public List search(String empName)  

  


{  

  


List empList = null; 

  


empList = this.getJdbcTemplate().query("select * from employees where name like ?",   

  


new Object[]{"%"+empName+"%"},     new EmployeeRowMapper()); 

  


return empList; 

  


}

  


  
public Boolean update(Employee employee) 

  


{    

  


int count = this.getJdbcTemplate().update("update employees set name=?, gender=?, dob=?, address=?, email_id=?, password=?, mobile=?, department=?, designation=? where emp_id=?",     new Object[]{    

  


employee.getName(),    

  


employee.getGender(),   

  


employee.getDob() ,  

  


 employee.getAddress() ,   

  


employee.getEmailId() ,    

  


employee.getPassword() ,    

  


employee.getMobile() ,   

  


employee.getDepartment() ,    

  


employee.getDesignation(),    

  


employee.getEmpId()});  

  


Boolean flag = (count>0)? Boolean.TRUE : Boolean.FALSE;  

  


return flag; 

  


}  
}

  


  


***********************************************

  


EmployeeDaoTestClient 

  


----------------------------

  


package com.spring.jdbc;  
import java.util.Date;import java.util.List;  
import org.springframework.context.ApplicationContext;  
import com.spring.utilities.SpringUtility;  
public class EmployeeDaoTestClient 

  


{  
private static final String CONFIG_FILE = "com/spring/jdbc/spring-dao.xml";  
public static void main(String[] args)  

  


{  

  


ApplicationContext applicationContext = SpringUtility.getApplicationContext(CONFIG_FILE);  

  


EmployeeDAO employeeDAO = (EmployeeDAO) SpringUtility.getBean(applicationContext, "employeeDao"); 

  


Employee employee = null;  

  


List empList =null;  

  


Boolean flag = Boolean.FALSE;  

  


employee = new Employee();    

  


employee.setEmpId("1");  

  


employee.setName("abhishek");  

  


employee.setGender("M");  

  


employee.setDob(new Date()) ;  

  


employee.setAddress("Hyderabad") ;  

  


employee.setEmailId("[avanguma@adaequare.com](mailto:avanguma@adaequare.com)") ;  

  


employee.setPassword("abhi") ;  

  


employee.setMobile("934354666") ;  

  


employee.setDepartment("Java") ;  

  


employee.setDesignation("Software Engineer 1");    

  


Integer id = employeeDAO.create(employee);  

  


System.out.println(id);    

  


flag = employeeDAO.delete("125");  

  


System.out.println(flag

  


employee = employeeDAO.getEmployee("1");  

  


System.out.println(employee);    

  


employee.setName("V. Abhishek");  

  


flag =  employeeDAO.update(employee);  

  


System.out.println(flag);  

  


empList = employeeDAO.search("");  

  


if(empList!=null)  

  


{   

  


for (Employee emp : empList) 

  


{    System.out.println(emp); 

  


 }  

  


}   

  


  


empList = employeeDAO.getAllEmployees();  

  


if(empList!=null)  

  


{  

  


for (Employee emp : empList) 

  


{    System.out.println(emp);  

  


}  

  


}  
}  
}

  


***********************************************************************

  


jdbc.properties

  


------------------------------------  
mysql.driverClassName=com.mysql.jdbc.Driver  
mysql.url=jdbc:mysql://localhost:3306/spring_all_in_one  
mysql.username=root  
mysql.password=admin

  


*********************************

  


  


  


  


  

