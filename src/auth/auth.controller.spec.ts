import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IAuthService } from './auth.service.interface';
import { TestGlobalConfig } from 'test/test-config.spec';
import { IDBRepository } from 'database/dashboard.repository';

describe('AuthController', () => {
  let controller: AuthController;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [JwtModule],
      providers: [
        { provide: IAuthService, useClass: AuthService },
        {provide: IDBRepository, useClass:jest.fn(() => TestGlobalConfig.mockDataService)}
        
      ],
    }).compile();

    controller = moduleRef.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('AuthController should be defined', () => {
    expect(controller).toBeDefined();
  });
});
