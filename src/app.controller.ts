import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('auth/verify_email/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    const isEmailVerified = await this.appService.verifyEmail(token);
    if (isEmailVerified) {
      res.redirect(process.env.FRONTEND_URL);
    }
  }

  @Get('/')
  sayHello(@Res() res: Response) {
    res.status(200).send('Sosha API Gateway...');
  }
}
