import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { UserService } from './user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TestGlobalConfig } from 'test/test-config.spec';
import { UserController } from './user.controller';
import { IRegisterUserDTO, IUserService } from './user.service.interface';
import { IDBRepository } from 'database/dashboard.repository';
import { USER_DATA } from 'test/test.data.spec';
import { IAuthService } from 'auth/auth.service.interface';

describe('UserController', () => {
  let controller: UserController;
  let moduleRef: TestingModule;
  let repository: IDBRepository;

  const data = <IRegisterUserDTO>{
    ...USER_DATA,
    password: faker.string.alphanumeric(8),
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UserController],
      imports: [JwtModule],
      providers: [
        { provide: IUserService, useClass: UserService },
        {
          provide: IAuthService,
          useClass: jest.fn(() => TestGlobalConfig.mockService()),
        },
        {
          provide: IDBRepository,
          useClass: jest.fn(() => TestGlobalConfig.mockDataService()),
        },
      ],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
    repository = moduleRef.get<IDBRepository>(IDBRepository);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User Execptions', () => {
    it('should throw Conflict error on create', () => {
      const mockCreate = async () => {
        await controller.create(data, null as any);
      };
      void expect(mockCreate).rejects.toThrow(ConflictException);
    });

    it('should throw not found error on edit', () => {
      repository.users.findOne = jest.fn(() => undefined as any);
      const mockEdit = async () => {
        await controller.update({ ...data, id: undefined as any });
      };
      void expect(mockEdit).rejects.toThrow(NotFoundException);
    });

    it('should return false on remove', async () => {
      const resp = await controller.remove({ id: undefined as any });
      expect(resp).toBeFalsy();
    });
  });
});
