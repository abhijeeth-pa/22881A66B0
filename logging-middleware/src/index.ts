import axios, { AxiosResponse } from 'axios';

// Valid stack values
export type Stack = 'backend' | 'frontend';

// Valid level values
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Valid package values for backend
export type BackendPackage = 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service';

// Valid package values for frontend
export type FrontendPackage = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style';

// Valid package values for both
export type CommonPackage = 'auth' | 'config' | 'middleware' | 'utils';

// Union type for all packages
export type Package = BackendPackage | FrontendPackage | CommonPackage;

// Log request interface
export interface LogRequest {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
}

// Log response interface
export interface LogResponse {
  logID: string;
  message: string;
}

// Configuration interface
export interface LoggerConfig {
  apiUrl: string;
  clientId: string;
  clientSecret: string;
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
}

class Logger {
  private config: LoggerConfig;
  private authToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  /**
   * Get authentication token for logging API
   */
  private async getAuthToken(): Promise<string> {
    // Check if we have a valid token
    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken;
    }

    try {
      const authResponse: AxiosResponse<{
        token_type: string;
        access_token: string;
        expires_in: number;
      }> = await axios.post(`${this.config.apiUrl}/auth`, {
        email: this.config.email,
        name: this.config.name,
        rollNo: this.config.rollNo,
        accessCode: this.config.accessCode,
        clientID: this.config.clientId,
        clientSecret: this.config.clientSecret
      });

      this.authToken = authResponse.data.access_token;
      this.tokenExpiry = Date.now() + (authResponse.data.expires_in * 1000);

      return this.authToken!;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      throw new Error('Authentication failed for logging service');
    }
  }

  /**
   * Send log to the test server
   */
  private async sendLog(logData: LogRequest): Promise<void> {
    try {
      const token = await this.getAuthToken();
      
      const response: AxiosResponse<LogResponse> = await axios.post(
        `${this.config.apiUrl}/logs`,
        logData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log successful submission for debugging
      console.log(`Log sent successfully: ${response.data.logID}`);
    } catch (error) {
      console.error('Failed to send log:', error);
      // Don't throw error to prevent application crashes
    }
  }

  /**
   * Main logging function
   * @param stack - The stack (backend/frontend)
   * @param level - The log level (debug/info/warn/error/fatal)
   * @param pkg - The package/module name
   * @param message - The log message
   */
  async log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
    // Validate inputs
    if (!stack || !level || !pkg || !message) {
      console.error('Invalid log parameters provided');
      return;
    }

    // Validate stack
    if (!['backend', 'frontend'].includes(stack)) {
      console.error(`Invalid stack value: ${stack}`);
      return;
    }

    // Validate level
    if (!['debug', 'info', 'warn', 'error', 'fatal'].includes(level)) {
      console.error(`Invalid level value: ${level}`);
      return;
    }

    // Validate package based on stack
    const backendPackages = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
    const frontendPackages = ['api', 'component', 'hook', 'page', 'state', 'style'];
    const commonPackages = ['auth', 'config', 'middleware', 'utils'];

    const validPackages = stack === 'backend' 
      ? [...backendPackages, ...commonPackages]
      : [...frontendPackages, ...commonPackages];

    if (!validPackages.includes(pkg)) {
      console.error(`Invalid package value for ${stack}: ${pkg}`);
      return;
    }

    const logData: LogRequest = {
      stack,
      level,
      package: pkg,
      message
    };

    // Send log asynchronously to avoid blocking
    this.sendLog(logData).catch(error => {
      console.error('Logging failed:', error);
    });
  }
}

// Global logger instance
let globalLogger: Logger | null = null;

/**
 * Initialize the logger with configuration
 */
export function initializeLogger(config: LoggerConfig): void {
  globalLogger = new Logger(config);
}

/**
 * Main Log function that can be used throughout the application
 */
export async function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void> {
  if (!globalLogger) {
    console.error('Logger not initialized. Call initializeLogger() first.');
    return;
  }

  await globalLogger.log(stack, level, pkg, message);
} 