SEARCH BY: name, code, genre
Filter by: category, age range, 

EMAIL NOTIFICATIONS
AWS Image uploads
Staging & Prod server with CI/CD

BOOKS: 
Title
ImageUrl*
Code*
Description 
> Category: children
> Genre: fantasy
> Discount Id
> AgeRange
AmountInStock (default: 1, min: 0)
[createdAt]
[updatedAt]
Cover type: paper back, hard back
Price
[discountPrice]

LOCATIONS:
Name
Description
Delivery Price
[createdAt]
[updatedAt]

PURCHASE: (address must exist on user)
BookIds (relation)
UserId (relation)
CouponCode (nullable, not relation)
Location (nullable, location name, not relation)
[Books Price]
[Delivery Price]
[Total Price]
[isPaid]
[isEmailSentToAdmin]
[Notes]
[createdAt]
[updatedAt]

USER
FirstName, LastName
Address
Company Name (optional)
Country
Town
State
Phone
Password
> Email
[IsAdmin]

DISCOUNT
Book Ids
Name
couponCode?
Type (fixed/percentage)
Value
StartDate
EndDate
[Active]


ENDPOINTS
/Books
  / [Post]+ [DONE]
  / [Put]+ [DONE]
  / [Get]- [DONE]
  / [Delete]+
/Locations
  / [Get]- [DONE]
  / [Post]+ [DONE]
  / [Delete]+ [DONE]
  / [PUT]+ [DONE]
/Discounts
  / [Get]+ [DONE]
  / [Post]+ [DONE]
  / [Delete]+ [DONE]
  / [PUT]+ [DONE]
/Users
  / [Get] [DONE]
  / [PUT] [DONE]
  /Login [DONE]
  /Register [DONE]
  /begin-change-password [DONE]
  /finish-change-password [DONE]
/Purchase
  / calculate-price 
  / confirm-purchase
  / [GET]+
/Webhooks
  /Confirm-purchase -
 

what happens when user selects a book that's on sale for purchase, and then they provide a coupon code that's also on sale?
consider how book deletion should work, and how it affects purchases. Maybe dont allow book deletion at all.
occasionally run cron job to:
  - check for ending discounts and deactivate them, and update book prices
  - check for starting discounts and activate them, and update book prices
