import { Test } from '@nestjs/testing';
import { AppModule } from './app.module.js';

describe('AppModule', () => {
  it('compiles and boots', async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    const app = moduleRef.createNestApplication();
    await app.init();
    await app.close();
  });
});
