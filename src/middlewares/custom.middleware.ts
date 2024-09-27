import { Injectable, NestMiddleware, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CustomMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CustomMiddleware.name);

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Log the incoming request method and URL
      this.logger.log(`Incoming Request: ${req.method} - ${req.originalUrl}`);
      
      // Add custom logic here, for example, checking headers, etc.
      // Example: Custom header validation
      // if (!req.headers['x-custom-header']) {
      //   throw new InternalServerErrorException('Missing custom header');
      // }

      // Pass to next middleware or controller
      next();
    } catch (error) {
      // Log the error if any
      this.logger.error(`Error processing request: ${error.message}`);
      
      // Respond with an error status and message
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}