import { ValidationResult } from '../types';

export class ValidationService {
  /**
   * Validate URL format
   */
  static async validateUrl(url: string): Promise<ValidationResult> {
    const errors: string[] = [];
    
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol || !urlObj.hostname) {
        errors.push('Invalid URL format');
      }
    } catch (error) {
      errors.push('Invalid URL format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate shortcode format
   */
  static async validateShortcode(shortcode: string): Promise<ValidationResult> {
    const errors: string[] = [];
    
    // Check length (3-20 characters)
    if (shortcode.length < 3 || shortcode.length > 20) {
      errors.push('Shortcode must be between 3 and 20 characters');
    }
    
    // Check if alphanumeric
    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      errors.push('Shortcode must contain only alphanumeric characters');
    }
    
    // Check for reserved words
    const reservedWords = ['api', 'admin', 'login', 'logout', 'register', 'auth'];
    if (reservedWords.includes(shortcode.toLowerCase())) {
      errors.push('Shortcode contains reserved word');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate validity period
   */
  static async validateValidity(validity: number): Promise<ValidationResult> {
    const errors: string[] = [];
    
    if (validity < 1 || validity > 525600) { // 1 minute to 1 year
      errors.push('Validity must be between 1 minute and 1 year (525600 minutes)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 