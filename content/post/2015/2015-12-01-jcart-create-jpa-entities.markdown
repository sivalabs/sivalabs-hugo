---
author: siva
comments: true
date: 2015-12-01 04:26:41+00:00
layout: post
Url: jcart-create-jpa-entities
title: 'JCart: Create JPA Entities'
wordpress_id: 503
categories:
- E-Commerce
tags:
- jcart
- SpringBoot
draft : true
---

We are going to create the JPA Entities for the database tables we designed.

    
    @Entity
    @Table(name="users")
    public class User
    {
    	@Id @GeneratedValue(strategy=GenerationType.AUTO)
    	private Integer id;
    	@Column(nullable=false)
    	@NotEmpty()
    	private String name;
    	@Column(nullable=false, unique=true)
    	@NotEmpty
    	@Email(message="{errors.invalid_email}")
    	private String email;
    	@Column(nullable=false)
    	@NotEmpty
    	@Size(min=4)
    	private String password;
    	private String passwordResetToken;
    	
    	@ManyToMany(cascade=CascadeType.MERGE)
    	@JoinTable(
    	      name="user_role",
    	      joinColumns={@JoinColumn(name="USER_ID", referencedColumnName="ID")},
    	      inverseJoinColumns={@JoinColumn(name="ROLE_ID", referencedColumnName="ID")})
    	private List<Role> roles;
    	//setters & getters
    }
    



    
    @Entity
    @Table(name="roles")
    public class Role
    {
    	@Id @GeneratedValue(strategy=GenerationType.AUTO)
    	private Integer id;
    	@Column(nullable=false, unique=true)
    	@NotEmpty
    	private String name;
    	@Column(length=1024)
    	private String description;
    	
    	@ManyToMany(mappedBy="roles")
    	private List<User> users;
    
    	@ManyToMany
    	  @JoinTable(
    	      name="role_permission",
    	      joinColumns={@JoinColumn(name="ROLE_ID", referencedColumnName="ID")},
    	      inverseJoinColumns={@JoinColumn(name="PERM_ID", referencedColumnName="ID")})
    	  private List<Permission> permissions;
    
    	 //setters & getters 
    }
    



    
    @Entity
    @Table(name="permissions")
    public class Permission
    {
    	@Id @GeneratedValue(strategy=GenerationType.AUTO)
    	private Integer id;
    	@Column(nullable=false, unique=true)
    	private String name;
    	@Column(length=1024)
    	private String description;
    	@ManyToMany(mappedBy="permissions")
    	private List<Role> roles;
    	
    	//setters & getters
    }
    



    
    @Entity
    @Table(name="addresses")
    public class Address implements Serializable
    {
    	private static final long serialVersionUID = 1L;
    	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    	private Integer id;
    	private String addressLine1;
    	private String addressLine2;
    	private String city;
    	private String state;
    	private String zipCode;
    	private String country;
    	
    	//setters & getters
    }
    



    
    @Entity
    @Table(name="categories")
    public class Category
    {
    	@Id @GeneratedValue(strategy=GenerationType.AUTO)
    	private Integer id;
    	@Column(nullable=false, unique=true)
    	@NotEmpty
    	private String name;
    	@Column(length=1024)
    	private String description;
    	@Column(name="disp_order")
    	private Integer displayOrder;
    	private boolean disabled;
    	@OneToMany(mappedBy="category")
    	private Set<Product> products;
    
    	//setters & getters	
    }
    



    
    @Entity
    @Table(name="products")
    public class Product implements Serializable
    {
    	private static final long serialVersionUID = 1L;
    	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    	@Column(name="id")
    	private Integer id;
    	@Column(nullable=false, unique=true)
    	private String sku;
    	@Column(nullable=false)
    	private String name;
    	private String description;
    	@Column(nullable=false)
    	private BigDecimal price = new BigDecimal("0.0");
    	private String imageUrl;
    	private boolean disabled;
    	@Temporal(TemporalType.TIMESTAMP)
    	@Column(name="created_on")
    	private Date createdOn = new Date();
    	
    	@ManyToOne
    	@JoinColumn(name="cat_id")
    	private Category category;
    	
    	//setters & getters
    }
    



    
    @Entity
    @Table(name="customers")
    public class Customer implements Serializable
    {
    	private static final long serialVersionUID = 1L;
    	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    	private Integer id;
    	@Column(name="firstname", nullable=false)
    	@NotEmpty
    	private String firstName;
    	@Column(name="lastname")
    	private String lastName;
    	@NotEmpty
    	@Email
    	@Column(name="email", nullable=false, unique=true)
    	private String email;
    	@NotEmpty
    	@Column(name="password", nullable=false)
    	private String password;
    	private String phone;
    
    	//setters & getters
    }
    



    
    @Entity
    @Table(name="orders")
    public class Order implements Serializable
    {
    	private static final long serialVersionUID = 1L;
    	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    	private Integer id;
    	@Column(nullable=false, unique=true)
    	private String orderNumber;
    	@OneToMany(cascade=CascadeType.ALL, mappedBy="order")
    	private Set<OrderItem> items;
    	@ManyToOne(cascade=CascadeType.MERGE)
    	@JoinColumn(name="cust_id")
    	private Customer customer;
    	@OneToOne(cascade=CascadeType.PERSIST)
    	@JoinColumn(name="delivery_addr_id")
    	private Address deliveryAddress;
    	@OneToOne(cascade=CascadeType.PERSIST)
    	@JoinColumn(name="billing_addr_id")
    	private Address billingAddress;
    	@OneToOne(cascade=CascadeType.PERSIST)
    	@JoinColumn(name="payment_id")
    	private Payment payment;
    	@Enumerated(EnumType.STRING)
    	private OrderStatus status;
    	@Temporal(TemporalType.TIMESTAMP)
    	@Column(name="created_on")
    	private Date createdOn;
    	
    	//setters & getters
    }
    



    
    @Entity
    @Table(name="order_items")
    public class OrderItem implements Serializable
    {
    	private static final long serialVersionUID = 1L;
    	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    	private Integer id;
    	@ManyToOne
    	@JoinColumn(name="product_id")
    	private Product product;
    	private BigDecimal price;
    	private int quantity;
    	@ManyToOne
    	@JoinColumn(name="order_id")
    	private Order order;
    	
    	//setters & getters
    }
    



    
    public enum OrderStatus
    {
    	NEW, IN_PROCESS, COMPLETED, FAILED
    }
    



    
    @Entity
    @Table(name="payments")
    public class Payment implements Serializable
    {
    	private static final long serialVersionUID = 1L;
    	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    	private Integer id;
    	@Column(name="cc_number")
    	private String ccNumber;
    	private String cvv;
    	private BigDecimal amount;
    	
    	//setters & getters
    }
    


As we have configured **spring.jpa.hibernate.ddl-auto=update** when we run the JCartCoreApplicationTest again all the tables will be automatically created/updated.

SpringBoot provides a nice and easy way to initialize the database with some seed data using **data.sql** file.
We can use **jcart-core/src/test/resources/data.sql** script [https://github.com/sivaprasadreddy/jcart/blob/master/jcart-core/src/test/resources/data.sql](https://github.com/sivaprasadreddy/jcart/blob/master/jcart-core/src/test/resources/data.sql) to populate some sample data.
