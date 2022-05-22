import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { AuthGuard } from './users/auth.guard';

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

  @UseGuards(AuthGuard)
  @Get('testEndpoint')
  async test() {
    console.log('called');
  }
}
