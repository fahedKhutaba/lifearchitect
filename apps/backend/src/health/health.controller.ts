import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@lifearchitect/contracts';

@Controller('health')
export class HealthController {
  @Get()
  getHealth(): HealthResponse {
    return { status: 'ok' };
  }
}
