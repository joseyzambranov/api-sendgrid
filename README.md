E-Mail Address Validation
Email Address Validation is available to Email API Pro and Premier level accounts only. Prior to upgrading your account to Pro or Premier, you will not see the option to create an Email Validation API key. An Email Validation API key is separate from and in addition to your other keys, including a Full Access API key.

Email Address Validation provides real-time detailed information on the validity of email addresses. You can integrate this validation process into your platform's signup form and customize the best use of email address validation for your use case.

You can use this API to:

Indicate to users that the address they have entered into a form is invalid.
Drop invalid email addresses from your database.
Suppress invalid email addresses from your sending to decrease your bounce rate.
You can learn more about enabling Email Validation in our Email Validation documentation.

You can also view your Email Validation results and metrics in the Validation section of the Twilio SendGrid App. Again, these settings are available only after upgrading your account to Pro or higher.

Validate an email
POST /v3/validations/email
Base url: https://api.sendgrid.com

This endpoint allows you to validate an email address.

Authentication
 API Key