---
title: 'Clean Code: Don’t mix different levels of abstractions'
author: Siva
type: post
date: 2013-12-29T00:53:00.000Z
url: /blog/clean-code-dont-mix-different-levels-of-abstractions/
categories:
  - Best-Practices
tags:
  - best-practices
  - Java
popular: true
aliases:
  - /clean-code-dont-mix-different-levels-of-abstractions/
---
We spend more time reading code than writing it. So if the code is more readable, it will obviously increase developer productivity.

Many people associate the readability of code with coding conventions like following standard naming conventions, closing files, DB resources, etc. When it comes to code reviews, most people focus on these trivial things only, like checking for naming convention violations or whether resources are properly released in a finally block.

Do we need "Senior Resources" on the team (I hate to call a human being a "Resource") to do these things? Tools like Findbugs, PMD, Checkstyle, and Sonar can do that for you. I agree that following a standard naming convention by all team members is a good thing. But that doesn't necessarily increase the readability of the code.

Let us take a simple example. I would like to implement a Fund Transfer use case, and the following are the rules to implement:

*   Source and target accounts should be valid accounts.
*   Check whether the source account has a sufficient amount.
*   Check whether the source account has a provision for Overdraft and check whether this transaction exceeds the overdraft limit.
*   Check for a duplicate transaction with the last transaction. If the source, target accounts, and amount are the same as the last transaction, consider it a duplicate transaction.
*   If everything is fine, then transfer the amount to the target account.

Assume we have the following implementation for the above use case:

```java
public class UglyMoneyTransferService 
{
	public void transferFunds(Account source, 
	                          Account target, 
	                          BigDecimal amount, 
	                          boolean allowDuplicateTxn) 
	                     throws IllegalArgumentException, RuntimeException 
	{	
	Connection conn = null;
	try {
		conn = DBUtils.getConnection();
		PreparedStatement pstmt = 
		    conn.prepareStatement("Select * from accounts where acno = ?");
		pstmt.setString(1, source.getAcno());
		ResultSet rs = pstmt.executeQuery();
		Account sourceAccount = null;
		if(rs.next()) {
			sourceAccount = new Account();
			//populate account properties from ResultSet
		}
		if(sourceAccount == null){
			throw new IllegalArgumentException("Invalid Source ACNO");
		}
		Account targetAccount = null;
		pstmt.setString(1, target.getAcno());
		rs = pstmt.executeQuery();
		if(rs.next()) {
			targetAccount = new Account();
			//populate account properties from ResultSet
		}
		if(targetAccount == null){
			throw new IllegalArgumentException("Invalid Target ACNO");
		}
		if(!sourceAccount.isOverdraftAllowed()) {
			if((sourceAccount.getBalance() - amount) < 0) {
				throw new RuntimeException("Insufficient Balance");
			}
		}
		else {
			if(((sourceAccount.getBalance()+sourceAccount.getOverdraftLimit()) - amount) < 0) {
				throw new RuntimeException("Insufficient Balance, Exceeding Overdraft Limit");
			}
		}
		AccountTransaction lastTxn = .. ; //JDBC code to obtain last transaction of sourceAccount
		if(lastTxn != null) {
			if(lastTxn.getTargetAcno().equals(targetAccount.getAcno()) && lastTxn.getAmount() == amount && !allowDuplicateTxn) {
			throw new RuntimeException("Duplicate transaction exception");//ask for confirmation and proceed
			}
		}
		sourceAccount.debit(amount);
		targetAccount.credit(amount);
		TransactionService.saveTransaction(source, target,  amount);
	}
	catch(Exception e){
		logger.error("",e);
	}
	finally {
		try { 
			conn.close(); 
		} 
		catch(Exception e){ 
			//Not everything is in your control..sometimes we have to believe in GOD/JamesGosling and proceed
		}
	}
}	
}
```

The above code is readable, right?…because:

1.  We have followed naming conventions like camel-casing variable names.
2.  We have all the open braces ({) on the method definition line.
3.  We have closed the DB Connection in a `finally` block.
4.  We have logged the exception instead of using `System.err.println()`.

And most importantly, it is working as expected.

_**So is it readable and clean code? In my opinion, absolutely not. There are many issues in the above code from a readability perspective.**_

**1. Mixing DB interaction code with business logic.**

**2. Throwing `IllegalArgumentException`, `RuntimeException`, etc., from business methods instead of business-specific exceptions.**

**3. Most importantly, the code is mixed with different levels of abstractions.**

Let me explain what I mean by "different levels of abstractions."

Firstly, from a business perspective, a fund transfer means validating source/target accounts, checking for sufficient balance, checking for an overdraft limit, checking for a duplicate transaction, and making the fund transfer.

From a technical point of view, there are various tasks like fetching Account details from the DB, performing all the business-related checks, throwing Exceptions if there are any violations, properly closing the resources, etc.

But in the above code, everything is mixed together.

_While reading the code, you start looking at JDBC code, and your brain is working in Technical mode. After getting the Account object from the ResultSet, you are checking for null and throwing an Exception if it is null, which is a business requirement. So immediately, you need to switch your mind to Business mode and think, "OK, if the account is invalid, we want to abort the operation immediately."_

_Though you managed to switch between Technical and Business modes, what about making an enhancement to one particular subtask, like "A fund transfer is considered a duplicate only if it matches the last transaction that happened within an hour"? To make that enhancement, you have to go through the entire method because you haven't modularized your sub-tasks, and there is no separation of concerns._

Let's rewrite the above method as follows:

```java
class FundTransferTxn
{
	private Account sourceAccount; 
	private Account targetAccount;
	private BigDecimal amount;
	private boolean allowDuplicateTxn;
	//setters & getters
}

public class CleanMoneyTransferService 
{
	public void transferFunds(FundTransferTxn txn) {
		Account sourceAccount = validateAndGetAccount(txn.getSourceAccount().getAcno());
		Account targetAccount = validateAndGetAccount(txn.getTargetAccount().getAcno());
		checkForOverdraft(sourceAccount, txn.getAmount());
		checkForDuplicateTransaction(txn);
		makeTransfer(sourceAccount, targetAccount, txn.getAmount());
	}
	
	private Account validateAndGetAccount(String acno){
		Account account = AccountDAO.getAccount(acno);
		if(account == null){
			throw new InvalidAccountException("Invalid ACNO :"+acno);
		}
		return account;
	}
	
	private void checkForOverdraft(Account account, BigDecimal amount){
		if(!account.isOverdraftAllowed()){
			if((account.getBalance() - amount) < 0)	{
				throw new InsufficientBalanceException("Insufficient Balance");
			}
		}
		else{
			if(((account.getBalance()+account.getOverdraftLimit()) - amount) < 0){
				throw new ExceedingOverdraftLimitException("Insufficient Balance, Exceeding Overdraft Limit");
			}
		}
	}
	
	private void checkForDuplicateTransaction(FundTransferTxn txn){
		AccountTransaction lastTxn = TransactionDAO.getLastTransaction(txn.getSourceAccount().getAcno());
		if(lastTxn != null)	{
			if(lastTxn.getTargetAcno().equals(txn.getTargetAccount().getAcno()) 
					&& lastTxn.getAmount() == txn.getAmount() 
					&& !txn.isAllowDuplicateTxn())	{
				throw new DuplicateTransactionException("Duplicate transaction exception");
			}
		}
	}
	
	private void makeTransfer(Account source, Account target, BigDecimal amount){
		sourceAccount.debit(amount);
		targetAccount.credit(amount);
		TransactionService.saveTransaction(source, target,  amount);
	}	
}
```

The above improved method does exactly what the initial version is doing, but now it looks a lot better than the earlier version.

*   We have divided the entire task into sub-tasks and implemented each sub-task in a separate method.
*   We have delegated DB interactions to DAOs.
*   We are throwing business-specific Exceptions instead of Java language Exceptions.
*   All in all, we have separated the levels of abstractions.

_At the first level, we have the highest level of abstraction in the `transferFunds(FundTransferTxn txn)` method. By looking at this method, we can understand what we are doing as part of the Fund Transfer operation without worrying much about implementation or technical details._

_At the second level, we have business logic implementation methods `checkForOverdraft`, `checkForDuplicateTransaction`, etc., which perform business logic, again without worrying much about technical details._

_At the lowest level, we have technical implementation details in `AccountDAO` and `TransactionDAO`, which contain DB interaction logic._

So the reader (future developer/maintainer) of your code can easily understand what you are doing at a high level and can dig into the method in which he is interested.

As I said earlier, if we have to make the change to consider the transaction as a duplicate only if it happened within an hour, we can easily understand that `checkForDuplicateTransaction()` is the one we have to look into and make the change.

Happy coding!!
