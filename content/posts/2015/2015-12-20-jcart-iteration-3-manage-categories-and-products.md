---
title: 'JCart Iteration-3 : Manage Categories and Products'
author: Siva
type: post
date: 2015-12-20T05:58:44+00:00
url: /2015/12/jcart-iteration-3-manage-categories-and-products/
post_views_count:
  - 6
categories:
  - Java
tags:
  - jcart

---
In this iteration we will start working on the key requirement of our JCart administration application, ie managing categories and products.

We will create various categories like Birds, Flowers, Vehicles etc. While creating products we will assign it to one of the category.

Managing Categories and Products also looks similar to Manage Roles and Users. But there are few new things we will learn like FileUploading etc.

### Create Spring Data JPA Repositories for Category and Product

```java
public interface CategoryRepository extends JpaRepository<Category, Integer> {
	Category getByName(String name);
}

public interface ProductRepository extends JpaRepository<Product, Integer> {
	Product findByName(String name);
	Product findBySku(String sku);
	@Query("select p from Product p where p.name like ?1 or p.sku like ?1 or p.description like ?1")
	List<Product> search(String query);
}
```

### Create CatalogService which contains all the catalog related service methods.

```java
@Service
@Transactional
public class CatalogService {
	@Autowired CategoryRepository categoryRepository;
	@Autowired ProductRepository productRepository;
	
	public List<Category> getAllCategories() {
		
		return categoryRepository.findAll();
	}
	
	public List<Product> getAllProducts() {
		
		return productRepository.findAll();
	}

	public Category getCategoryByName(String name) {
		return categoryRepository.getByName(name);
	}
	
	public Category getCategoryById(Integer id) {
		return categoryRepository.findOne(id);
	}

	public Category createCategory(Category category) {
		Category persistedCategory = getCategoryByName(category.getName());
		if(persistedCategory != null){
			throw new JCartException("Category "+category.getName()+" already exist");
		}
		return categoryRepository.save(category);
	}

	public Category updateCategory(Category category) {
		Category persistedCategory = getCategoryById(category.getId());
		if(persistedCategory == null){
			throw new JCartException("Category "+category.getId()+" doesn't exist");
		}
		persistedCategory.setDescription(category.getDescription());
		persistedCategory.setDisplayOrder(category.getDisplayOrder());
		persistedCategory.setDisabled(category.isDisabled());
		return categoryRepository.save(persistedCategory);
	}

	public Product getProductById(Integer id) {
		return productRepository.findOne(id);
	}
	
	public Product getProductBySku(String sku) {
		return productRepository.findBySku(sku);
	}
	
	public Product createProduct(Product product) {
		Product persistedProduct = getProductBySku(product.getName());
		if(persistedProduct != null){
			throw new JCartException("Product SKU "+product.getSku()+" already exist");
		}
		return productRepository.save(product);
	}
	
	public Product updateProduct(Product product) {
		Product persistedProduct = getProductById(product.getId());
		if(persistedProduct == null){
			throw new JCartException("Product "+product.getId()+" doesn't exist");
		}
		persistedProduct.setDescription(product.getDescription());
		persistedProduct.setDisabled(product.isDisabled());
		persistedProduct.setPrice(product.getPrice());
		persistedProduct.setCategory(getCategoryById(product.getCategory().getId()));
		return productRepository.save(persistedProduct);
	}

	public List<Product> searchProducts(String query) {
		return productRepository.search("%"+query+"%");
	}
}
```

### Let us create CategoryController to handle list all categories, create/update categories actions as follows:

```java
@Controller
@Secured(SecurityUtil.MANAGE_CATEGORIES)
public class CategoryController extends JCartAdminBaseController
{
	private static final String viewPrefix = "categories/";
	
	@Autowired
	private CatalogService catalogService;
	
	@Autowired private CategoryValidator categoryValidator;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Categories";
	}
	
	@RequestMapping(value="/categories", method=RequestMethod.GET)
	public String listCategories(Model model) {
		List<Category> list = catalogService.getAllCategories();
		model.addAttribute("categories",list);
		return viewPrefix+"categories";
	}
	
	@RequestMapping(value="/categories/new", method=RequestMethod.GET)
	public String createCategoryForm(Model model) {
		Category category = new Category();
		model.addAttribute("category",category);
		
		return viewPrefix+"create_category";
	}

	@RequestMapping(value="/categories", method=RequestMethod.POST)
	public String createCategory(@Valid @ModelAttribute("category") Category category, BindingResult result,
			Model model, RedirectAttributes redirectAttributes) {
		categoryValidator.validate(category, result);
		if(result.hasErrors()){
			return viewPrefix+"create_category";
		}
		Category persistedCategory = catalogService.createCategory(category);
		logger.debug("Created new category with id : {} and name : {}", persistedCategory.getId(), persistedCategory.getName());
		redirectAttributes.addFlashAttribute("info", "Category created successfully");
		return "redirect:/categories";
	}
	
	@RequestMapping(value="/categories/{id}", method=RequestMethod.GET)
	public String editCategoryForm(@PathVariable Integer id, Model model) {
		Category category = catalogService.getCategoryById(id);
		model.addAttribute("category",category);
		return viewPrefix+"edit_category";
	}
	
	@RequestMapping(value="/categories/{id}", method=RequestMethod.POST)
	public String updateCategory(Category category, Model model, RedirectAttributes redirectAttributes) {
		Category persistedCategory = catalogService.updateCategory(category);
		logger.debug("Updated category with id : {} and name : {}", persistedCategory.getId(), persistedCategory.getName());
		redirectAttributes.addFlashAttribute("info", "Category updated successfully");
		return "redirect:/categories";
	}

}
```

### Next create the thymeleaf views for category management as follows:

**jcart-admin/src/main/resources/templates/categories/categories.html**

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
      <head>
        <title>Categories</title>
    </head>
    <body>
        
    	<div layout:fragment="content">
	        <div class="row">
            <div class="col-md-12">
              <div class="box">
                <div class="box-header">
                  <h3 class="box-title">List of Categories</h3>
                  <div class="box-tools">
                    <div class="input-group" style="width: 150px;">
                    	<a class="btn btn-sm btn-default" th:href="@{/categories/new}">
								<i class="fa fa-plus-circle"></i> New Category</a>
                    </div>
                  </div>
                </div>
                <div class="box-body table-responsive no-padding">
                  <table class="table table-hover">
                    <tr>
                      <th style="width: 10px">#</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Edit</th>
                    </tr>
                    <tr th:each="cat,iterStat : ${categories}">
                      <td th:text="${iterStat.count}">1</td>
                      <td th:text="${cat.name}">Category Name</td>
                      <td th:text="${cat.description}">Category Description</td>
                      <td><a th:href="@{/categories/{id}(id=${cat.id})}" class="btn btn-sm btn-default">
							<i class="fa fa-edit"></i> Edit</a></td>
                    </tr>
                    
                  </table>
                </div>
                
              </div>
              </div>
              </div>              
    	</div>    	
    </body>    
</html>
```

**jcart-admin/src/main/resources/templates/categories/create_category.html**

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
      <head>
        <title>Categories - New</title>
    </head>
    <body>
        
    	<div layout:fragment="content">
	        
              <div class="box box-warning">
                <div class="box-header with-border">
                  <h3 class="box-title">Create New Category</h3>
                </div>
                <div class="box-body">
                  <form role="form" th:action="@{/categories}" th:object="${category}" method="post">
                  	<p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
							th:class="text-red">Incorrect data</p>
                    
                    <div class="form-group" th:classappend="${#fields.hasErrors('name')}? 'has-error'">
                      <label>Name</label>
                      <input type="text" class="form-control" name="name" th:field="*{name}" 
							placeholder="Enter Category Name"/>
                      <p th:if="${#fields.hasErrors('name')}" th:errors="*{name}" 
							th:class="text-red">Incorrect data</p>
                    </div>
                    
                    <div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'">
                      <label>Description</label>
                      <textarea class="form-control" rows="3" name="description" 
							th:field="*{description}" placeholder="Enter Category Description"></textarea>
                      <p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" 
							th:class="text-red">Incorrect data</p>
                    </div>
					
					<div class="form-group" th:classappend="${#fields.hasErrors('displayOrder')}? 'has-error'">
                      <label>Display Order</label>
                      <input type="number" class="form-control" name="displayOrder" 
								th:field="*{displayOrder}" placeholder="Enter display order number"/>
                      <p th:if="${#fields.hasErrors('displayOrder')}" th:errors="*{displayOrder}" 
							th:class="text-red">Incorrect data</p>
                    </div>
					    				
					<div class="box-footer">
	                    <button type="submit" class="btn btn-primary">Submit</button>
	                </div>
                  </form>
                </div>
              </div>
    	</div>
    	
    </body>
    
</html>
```

**jcart-admin/src/main/resources/templates/categories/edit_category.html**

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" 
	  xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">
      
      <head>
        <title>Categories - Edit</title>
    </head>
    <body>
    	        
    	<div layout:fragment="content">
	        
              <div class="box box-warning">
                <div class="box-header with-border">
                  <h3 class="box-title">Edit Category</h3>
                </div>
                <div class="box-body">
                  <form role="form" th:action="@{/categories/{id}(id=${category.id})}" 
						th:object="${category}" method="post">
                  <p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
						th:class="text-red">Incorrect data</p>
                    
                    <div class="form-group">
                      <label>Name</label>
                      <input type="text" class="form-control" name="name" 
						th:field="*{name}" readonly="readonly"/>
                    </div>
                    
                    <div class="form-group">
                      <label>Description</label>
                      <textarea class="form-control" rows="3" name="description" 
						th:field="*{description}" placeholder="Enter Category Description"></textarea>
                    </div>
					
					<div class="form-group">
                      <label>Display Order</label>
                      <input type="number" class="form-control" name="displayOrder" 
							th:field="*{displayOrder}" placeholder="Enter display order number"/>
                    </div>
    				
					<div class="box-footer">
	                    <button type="submit" class="btn btn-primary">Submit</button>
	                </div>
                  </form>
                </div>
              </div>
    	</div>
    	
    </body>
    
</html>
```

Now you can run the application and test Category related functionality be performing adding new categories or editing existing categories.

## Product Management

While storing the product details in our database we store the product image on disk and store the path in products.image_url column.
  
So we will create a ProductForm class to hold the uploaded image **(org.springframework.web.multipart.MultipartFile)** and then convert that into **Product** JPA entity.

Create **ProductForm** class as follows:

```java
package com.sivalabs.jcart.admin.web.models;

import java.math.BigDecimal;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;
import com.sivalabs.jcart.entities.Category;
import com.sivalabs.jcart.entities.Product;

public class ProductForm 
{
	private Integer id;
	@NotEmpty
	private String sku;
	@NotEmpty
	private String name;
	private String description;
	@NotNull
	@DecimalMin("0.1")
	private BigDecimal price = new BigDecimal("0.0");
	private String imageUrl;
	private MultipartFile image;
	private boolean disabled;
	@NotNull
	private Integer categoryId;
	
	// setters & getters
	
	public Product toProduct() {
		Product p = new Product();
		p.setId(id);
		p.setName(name);
		p.setDescription(description);
		p.setDisabled(disabled);
		p.setPrice(price);
		p.setSku(sku);
		Category category = new Category();
		category.setId(categoryId);
		p.setCategory(category );
		return p;
	}
	
	public static ProductForm fromProduct(Product product)
	{
		ProductForm p = new ProductForm();
		p.setId(product.getId());
		p.setName(product.getName());
		p.setDescription(product.getDescription());
		p.setDisabled(product.isDisabled());
		p.setPrice(product.getPrice());
		p.setSku(product.getSku());
		p.setCategoryId(product.getCategory().getId());
		return p;
	}
}
```

We will use apache commons-io library to store/read the files from disk, so add the following maven dependency in jcart-admin/pom.xml

```html
<dependency>
	<groupId>commons-io</groupId>
	<artifactId>commons-io</artifactId>
	<version>2.3</version>
</dependency>
```

SpringBoot (SpringMVC) supports Servlet 3 javax.servlet.http.Part API for uploading files. for more details see Handling Multipart File Uploads <a href="http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-multipart-file-upload-configuration" target="_blank">http://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-multipart-file-upload-configuration</a>

### Implement the ProductController to handle product related actions.

```java
@Controller
@Secured(SecurityUtil.MANAGE_PRODUCTS)
public class ProductController extends JCartAdminBaseController
{
	private static final String viewPrefix = "products/";
	@Autowired
	private CatalogService catalogService;
	
	@Autowired private ProductFormValidator productFormValidator;
	
	@Override
	protected String getHeaderTitle()
	{
		return "Manage Products";
	}
	
	@ModelAttribute("categoriesList")
	public List<Category> categoriesList()
	{
		return catalogService.getAllCategories();
	}
	
	@RequestMapping(value="/products", method=RequestMethod.GET)
	public String listProducts(Model model) {
		model.addAttribute("products",catalogService.getAllProducts());
		return viewPrefix+"products";
	}

	@RequestMapping(value="/products/new", method=RequestMethod.GET)
	public String createProductForm(Model model) {
		ProductForm product = new ProductForm();
		model.addAttribute("product",product);
		return viewPrefix+"create_product";
	}

	@RequestMapping(value="/products", method=RequestMethod.POST)
	public String createProduct(@Valid @ModelAttribute("product") ProductForm productForm, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {
		productFormValidator.validate(productForm, result);
		if(result.hasErrors()){
			return viewPrefix+"create_product";
		}
		Product product = productForm.toProduct();
		Product persistedProduct = catalogService.createProduct(product);
		productForm.setId(product.getId());
		this.saveProductImageToDisk(productForm);
		logger.debug("Created new product with id : {} and name : {}", persistedProduct.getId(), persistedProduct.getName());
		redirectAttributes.addFlashAttribute("info", "Product created successfully");
		return "redirect:/products";
	}
	
	@RequestMapping(value="/products/{id}", method=RequestMethod.GET)
	public String editProductForm(@PathVariable Integer id, Model model) {
		Product product = catalogService.getProductById(id);
		model.addAttribute("product",ProductForm.fromProduct(product));
		return viewPrefix+"edit_product";
	}
	
	@RequestMapping(value="/products/images/{productId}", method=RequestMethod.GET)
	public void showProductImage(@PathVariable String productId, HttpServletRequest request, HttpServletResponse response) {
		try {
			FileSystemResource file = new FileSystemResource(WebUtils.IMAGES_DIR +productId+".jpg");
			response.setContentType("image/jpg");
			org.apache.commons.io.IOUtils.copy(file.getInputStream(), response.getOutputStream());
			response.flushBuffer();
		} catch (IOException e) {
			e.printStackTrace();
		}	      
	}
	
	@RequestMapping(value="/products/{id}", method=RequestMethod.POST)
	public String updateProduct(@Valid @ModelAttribute("product") ProductForm productForm, BindingResult result, 
			Model model, RedirectAttributes redirectAttributes) {
		productFormValidator.validate(productForm, result);
		if(result.hasErrors()){
			return viewPrefix+"edit_product";
		}
		Product product = productForm.toProduct();
		Product persistedProduct = catalogService.updateProduct(product);
		this.saveProductImageToDisk(productForm);
		logger.debug("Updated product with id : {} and name : {}", persistedProduct.getId(), persistedProduct.getName());
		redirectAttributes.addFlashAttribute("info", "Product updated successfully");
		return "redirect:/products";
	}
	
	private void saveProductImageToDisk(ProductForm productForm) {
		MultipartFile file = productForm.getImage();
		if (file!= null && !file.isEmpty()) {
			String name = WebUtils.IMAGES_DIR + productForm.getId() + ".jpg";
			try {
				byte[] bytes = file.getBytes();
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(name)));
				stream.write(bytes);
				stream.close();
			} catch (Exception e) {
				throw new JCartException(e);
			}
		}
	}
}
```

The left over things are preparing thymeleaf views for product management screens.

**jcart-admin/src/main/resources/templates/products/products.html**

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
	xmlns:th="http://www.thymeleaf.org"
	xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
	layout:decorator="layout/mainLayout">
<head>
<title>Products</title>
</head>
<body>

	<div layout:fragment="content">
		<div class="row">
			<div class="col-md-12">
				<div class="box">
					<div class="box-header">
						<h3 class="box-title">List of Products</h3>
						<div class="box-tools">
							<div class="input-group" style="width: 150px;">
								<a class="btn btn-sm btn-default" th:href="@{/products/new}"><i
									class="fa fa-plus-circle"></i> New Product</a>
							</div>
						</div>
					</div>
					<div class="box-body table-responsive no-padding">
						<table class="table table-hover">
							<tr>
								<th style="width: 10px">#</th>
								<th>Name</th>
								<th>Description</th>
								<th>Edit</th>
							</tr>
							<tr th:each="product,iterStat : ${products}">
								<td th:text="${iterStat.count}">1</td>
								<td th:text="${product.name}">Product Name</td>
								<td th:text="${product.description}">Product Description</td>
								<td><a th:href="@{/products/{id}(id=${product.id})}"
									class="btn btn-sm btn-default"><i class="fa fa-edit"></i>Edit</a>
								</td>
							</tr>

						</table>
					</div>

				</div>
			</div>
		</div>

	</div>

</body>

</html>
```

**jcart-admin/src/main/resources/templates/products/create_product.html**

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">      
<head>
	<title>Products - New</title>
</head>
<body>	
	<div layout:fragment="content">
		
		  <div class="box box-warning">
			<div class="box-header with-border">
			  <h3 class="box-title">Create New Product</h3>
			</div>
			<div class="box-body">
			  <form role="form" th:action="@{/products}" th:object="${product}" 
					method="post" enctype="multipart/form-data">
				<p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
					th:class="text-red">Incorrect data</p>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('name')}? 'has-error'">
				  <label>Name</label>
				  <input type="text" class="form-control" name="name" th:field="*{name}" 
					placeholder="Enter Product Name"/>
				  <p th:if="${#fields.hasErrors('name')}" th:errors="*{name}" 
					th:class="text-red">Incorrect data</p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('sku')}? 'has-error'">
				  <label>SKU</label>
				  <input type="text" class="form-control" name="sku" 
						th:field="*{sku}" placeholder="Enter Product SKU"/>
				  <p th:if="${#fields.hasErrors('sku')}" th:errors="*{sku}" 
					 th:class="text-red">Incorrect data</p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('price')}? 'has-error'">
				  <label>Price</label>
				  <input type="text" class="form-control" name="price" 
					 th:field="*{price}" placeholder="Enter Product Price"/>
				  <p th:if="${#fields.hasErrors('price')}" th:errors="*{price}" 
					th:class="text-red">Incorrect data</p>
				</div>
				
				
				<div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'">
				  <label>Description</label>
				  <textarea class="form-control" rows="3" name="description" 
					th:field="*{description}" placeholder="Enter Role Description"></textarea>
				  <p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" 
						th:class="text-red">Incorrect data</p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('image')}? 'has-error'">
				  <label for="image">Image</label>
				  <input type="file" class="form-control" name="image" th:field="*{image}"/>
				  <p th:if="${#fields.hasErrors('image')}" th:errors="*{image}" 
					th:class="text-red">Incorrect data</p>
				  <p class="help-block">Select JPG Image</p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('categoryId')}? 'has-error'">
					<label>Category</label>
					<div>
						<select class="form-control" th:field="*{categoryId}">
						  <option th:each="cat : ${categoriesList}" 
								  th:value="${cat.id}" 
								  th:text="${cat.name}">Category</option>
						</select>
					<p th:if="${#fields.hasErrors('categoryId')}" th:errors="*{categoryId}"
						th:class="text-red">Incorrect data</p>
					</div>
					
				</div>
				
				<div class="box-footer">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			  </form>
			</div>
		  </div>
	</div>
	
</body>
    
</html>
```

**jcart-admin/src/main/resources/templates/products/edit_product.html**

```html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:th="http://www.thymeleaf.org"
	  xmlns:sec="http://www.thymeleaf.org/thymeleaf-extras-springsecurity3"
      layout:decorator="layout/mainLayout">      
<head>
	<title>Products - Edit</title>
</head>
<body>
    	        
	<div layout:fragment="content">		
		  <div class="box box-warning">
			<div class="box-header with-border">
			  <h3 class="box-title">Edit Product</h3>
			</div>
			<div class="box-body">
			  <form role="form" th:action="@{/products/{id}(id=${product.id})}" 
					th:object="${product}" method="post"  enctype="multipart/form-data">
				<p th:if="${#fields.hasErrors('global')}" th:errors="*{global}" 
					th:class="text-red">Incorrect data</p>
				
				<div class="form-group">
				  <label>Name</label>
				  <input type="text" class="form-control" name="name" th:field="*{name}" readonly="readonly"/>
				</div>
				
				<div class="form-group">
				  <label>SKU</label>
				  <input type="text" class="form-control" name="sku" th:field="*{sku}" readonly="readonly"/>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('price')}? 'has-error'">
				  <label>Price</label>
				  <input type="text" class="form-control" name="price" th:field="*{price}" 
					placeholder="Enter Product Price"/>
				  <p th:if="${#fields.hasErrors('price')}" th:errors="*{price}" 
					th:class="text-red">Incorrect data</p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('description')}? 'has-error'">
				  <label>Description</label>
				  <textarea class="form-control" rows="3" name="description" th:field="*{description}" 
					placeholder="Enter Role Description"></textarea>
				  <p th:if="${#fields.hasErrors('description')}" th:errors="*{description}" 
					 th:class="text-red">Incorrect data</p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('image')}? 'has-error'">
				  <label for="image">Image</label>
				  <input type="file" class="form-control" name="image" th:field="*{image}"/>
				  <p th:if="${#fields.hasErrors('image')}" th:errors="*{image}" th:class="text-red">Incorrect data</p>
				  <p class="help-block">Select JPG Image</p>
				  <p>
					<img alt="" src="image.jpg" th:src="@{'/products/images/{imageUrl}.jpg'(imageUrl=${product.id})}" 
						height="200" width="250"/>
				  </p>
				</div>
				
				<div class="form-group" th:classappend="${#fields.hasErrors('categoryId')}? 'has-error'">
					<label>Category</label>
					<div>
						<select class="form-control" th:field="*{categoryId}">
						  <option th:each="cat : ${categoriesList}" 
								  th:value="${cat.id}" 
								  th:text="${cat.name}">Category</option>
						</select>
					<p th:if="${#fields.hasErrors('categoryId')}" th:errors="*{categoryId}" 
						th:class="text-red">Incorrect data</p>
					</div>
					
				</div>
									
				<div class="box-footer">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			  </form>
			</div>
		  </div>
	</div>
	
</body>    
</html>
```

> That's a lot of code snippets, I know it is difficult to read that much of code on blog!!
  
> I would encourage you to checkout the code from github repo into your IDE.

Though initially we consider to implement multi language and multi currency support we are postponing these requirements as they are not high priority for this first release.

Next we will start building the consumer facing ShoppingCart application in Iteration-4.
