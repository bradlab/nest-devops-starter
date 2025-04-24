import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { AuthService } from './auth.service';
import { TestGlobalConfig } from 'test/test-config.spec';
import { IAuthService } from './auth.service.interface';
import { USER_MODEL_DATA } from 'test/test.data.spec';
import { User } from 'database/model/user.entity';
import { ISigninAccoutDTO } from '_shared/interface';
import { HashFactory } from '_shared/helper/hash.helper';
import { IDBRepository } from 'database/dashboard.repository';

describe('AuthService', () => {
  let service: IAuthService;
  let moduleRef: TestingModule;

  const password = faker.string.alphanumeric(8);
  const signinData: ISigninAccoutDTO = {
    phone: faker.phone.number(),
    email: faker.internet.email(),
    password,
  };
  const userData: Partial<User> = USER_MODEL_DATA;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        { provide: IAuthService, useClass: AuthService },
        {
          provide: JwtService,
          useClass: jest.fn(() => ({
            sign: () => faker.string.alphanumeric(50),
            verifyAsync: () => Promise.resolve({}),
            verify: () => ({}),
          })),
        },
        {
          provide: IDBRepository,
          useClass: jest.fn(() => TestGlobalConfig.mockDataService),
        },
      ],
    }).compile();

    service = moduleRef.get<IAuthService>(IAuthService);
    userData.password = await HashFactory.hashPwd(password);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('AuthService should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('On signin account', () => {
    it('Should throw unauthorized', async () => {
      service.search = jest.fn().mockImplementationOnce(() => undefined);
      const mockSignin = async () => {
        await service.signin(signinData);
      };
      void expect(mockSignin).rejects.toThrow(UnauthorizedException);
      expect(service.search).toBeCalled();
    });

    it('Should return a user object of the access token', async () => {
      service.search = jest
        .fn()
        .mockImplementationOnce(() =>
          TestGlobalConfig.mockRepositoryResponse(userData),
        );
      const login = await service.signin(signinData);
      expect(login).toBeTruthy();
      expect(login).toHaveProperty('accessToken');
      expect(login.accessToken).toEqual(expect.any(String));
    });
  });
});
