import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  
  @ValidatorConstraint({ name: 'isDomain', async: false })
  export class IsDomainConstraint implements ValidatorConstraintInterface {
    validate(email: string, args: ValidationArguments) {
      const domains = args.constraints as string[]; // Extract the array of allowed domains
      const emailParts = email.split('@');
      if (emailParts.length !== 2) {
        return false; // Invalid email format
      }
      const [, emailDomain] = emailParts;
      return domains.some((domain) => emailDomain.endsWith(domain)); // Check if email domain ends with any allowed domain
    }
  
    defaultMessage(args: ValidationArguments) {
      const domains = args.constraints as string[]; // Extract the array of allowed domains
      const allowedDomains = domains.join(', '); // Create a comma-separated list of allowed domains
      return `Email domain must be one of: ${allowedDomains}`;
    }
  }