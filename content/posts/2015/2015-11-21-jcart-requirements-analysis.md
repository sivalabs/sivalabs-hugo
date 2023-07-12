---
title: JCart Requirements Analysis
author: Siva
type: post
date: 2015-11-21T11:29:54+00:00
url: /jcart-requirements-analysis/
categories:
  - Java
tags:
  - E-Commerce

---
For building our JCart e-commerce application we will develop two web applications, one for ShoppingCart and another one for Administration. Let us explore the requirements of both ShoppingCart and Administration websites in detail.

### <span style="color: #800000;">ShoppingCart Site Requirements</span>

<span style="color: #003366;"><strong>Home Page:</strong></span> This page shows list of categories and few products in each category. From this screen customers can click on any Category name to see all the products in that particular category or can add a product to cart.

<span style="color: #003366;"><strong>Category Page:</strong></span> This page displays all the products in the selected category with pagination. Each product will be displayed along with a Add To Cart button.

<span style="color: #003366;"><strong>Product Page:</strong></span> This page displays detailed information of the product along with one or more images of the product and shows Add To Cart button.

<span style="color: #003366;"><strong>Search Results Page:</strong></span> In the header section we will provide a search box where customers can search for products. The search results will be displayed with pagination. Each product will be displayed along with a Add To Cart button.

<span style="color: #003366;"><strong>Login/Registration Pages:</strong></span> Customers should be able to login/register with our system so that they can view their profile and order history.

<span style="color: #003366;"><strong>Cart:</strong></span> In header section there will be Cart Icon showing the no. of items currently added to cart. When Cart icon is clicked we need to show the cart page with all the Items details. Customers should be able to update product quantities or remove products and the cart totals should be updated automatically.

<span style="color: #003366;"><strong>Billing & Delivery Page:</strong></span> This page will be displayed once the customer clicked Checkout button in Cart page. If the customer is already registered with our system he should login otherwise a registration form will be displayed. Customer should register by providing Email and Password. After successfully login, customer should provide Delivery Address, Payment details like CreditCard number, CVV, Expiry Date etc.

<span style="color: #003366;"><strong>Order Confirmation:</strong></span> Once the customer provided all the valid details and clicked on Submit button an Order should be placed and should display the Order Confirmation page with details including the Products, Delivery Address etc. An order confirmation email should be sent to customer with estimated delivery time.

<span style="color: #003366;"><strong>My Account Page:</strong></span> Customer should be able to login into the system and see his profile details, order history, outstanding order details.

### <span style="color: #800000;">Administration Site Requirements</span>

<span style="color: #003366;"><strong>Security:</strong> </span>We should provide Roles and Permission based security for our Administration website.
  
<span style="color: #003366;"><strong>Privilege Management:</strong></span> Ability to configure and manage all the privileges within the system. Each privilege represent the ability to perform an action.
  
For ex: **MANAGE_CATEGORIES** represents the ability to create new Categories, update existing categories.

<span style="color: #003366;"><strong>Role Management:</strong> </span>Ability to create various roles with one or more assigned privileges.
  
For ex:
  
**  ROLE\_SUPER\_ADMIN** &#8211; Users with this role can do anything within the system.
  
**  ROLE_ADMIN** &#8211; Users with this role can create other users (except other SUPER_ADMIN or ADMIN), and can do Category Management, Product Management etc.
  
**  ROLE\_CMS\_ADMIN**: Users with this role can manage Categories, Products etc.

<span style="color: #003366;"><strong>Category Management:</strong></span> A category represent a logical grouping of related products.
  
Category management includes:

  * Create new categories
  * Update existing categories
  * Disable/enable categories

<span style="color: #003366;"><strong>Product Management: </strong></span>In our system product is a quilling toy.
  
Product management includes

  * Create new products
  * <span style="line-height: 1.5;">Update existing products</span>
  * Delete products

**<span style="color: #003366;">Order Management:</span>**Authorised users can see the list of order, update status or cancel orders.
  
If an order is cancelled then refund should be triggered and a cancellation email should be sent to customer.

<span style="color: #003366;"><strong>Customer Management: </strong></span>Admin users should be able to view the customer details like their addresses, email ids etc for contacting them.

  * List all the customers
  * Search customers by email or name
  * View customer profile
  * Customer order history

<span style="color: #003366;"><strong>Site Settings: </strong></span>We need to have some site level configurations like Currency and Locale.
  
**<span style="color: #003366;">Locale & Currency:</span>**We should be able to use different locale and currencies for our e-commerce system. So the implementation should consider the I18N and dynamic currency change using live currency converter or using some conversion ratio.

By looking at the above mentioned features you might be thinking these are all very basic features of any e-commerce system and lot of features like Promotions/Offers Management, Fulfilment Systems, Inventory management etc are not being considered. YES, you are right. We are not considering many aspects of a typical e-commerce system because WE DON'T NEED THEM FOR OUR APPLICATION.

As I mentioned in the project requirement, we are enabling customers to place orders through online and the items will be delivered manually by the person who makes those quilling toys and the administrator will mark that order as fulfilled. If our application become famous and we are being flooded with orders then we can think of automating these manual tasks as well. As simple as that :-).