import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../app.module.js';
import { corsOptions } from '../cors.js';

describe('GET /health', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.enableCors(corsOptions('http://localhost:3000'));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 with {"status":"ok"} as JSON', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('allows the web origin via CORS', async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .set('Origin', 'http://localhost:3000');
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3000');
  });

  it('does not allow other origins', async () => {
    const res = await request(app.getHttpServer()).get('/health').set('Origin', 'http://evil.test');
    expect(res.headers['access-control-allow-origin']).not.toBe('http://evil.test');
  });
});
