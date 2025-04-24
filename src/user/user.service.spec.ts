import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import { TestGlobalConfig } from 'test/test-config.spec';
import { UserService } from './user.service';
import { IRegisterUserDTO, IUserService } from './user.service.interface';
import { IAuthService } from '../auth/auth.service.interface';
import { IDBRepository } from 'database/dashboard.repository';
import { USER_DATA } from 'test/test.data.spec';

describe('UserService', () => {
  let service: IUserService;
  let moduleRef: TestingModule;
  let repository: IDBRepository;
  let authService: IAuthService;

  const id = faker.string.uuid();
  const firstname = faker.person.fullName();
  const lastname = faker.person.lastName();
  const email = faker.internet.email();
  const phone = faker.phone.number({ style: 'international' });

  const data = <IRegisterUserDTO>{
    ...USER_DATA, 
    password: faker.string.alphanumeric(8) 
  };

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
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
    service = await moduleRef.resolve<IUserService>(IUserService);
    authService =
      await moduleRef.resolve<IAuthService>(IAuthService);
    repository = await moduleRef.resolve<IDBRepository>(IDBRepository);
  });

  afterAll(async () => {
    await moduleRef?.close();
    jest.clearAllMocks();
  });

  it('UserService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('UserDataRepository should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('On fetch all users', () => {
    it('Should return empty array', async () => {
      // concurrent
      repository.users.find = jest
        .fn()
        .mockImplementationOnce(() => [])
        .mockImplementationOnce(async () => [
          await TestGlobalConfig.mockRepositoryResponse(data),
        ]);
      const users = await service.fetchAll();
      expect(repository.users.find).toHaveBeenCalled();
      expect(users).toBeInstanceOf(Array);
      expect(users).toHaveLength(0);
    });

    it('Should return an array of one user', async () => {
      const users = await service.fetchAll();
      expect(users).toHaveLength(1);
    });
  });

  describe('On fetch one user', () => {
    it('Should return an empty content', async () => {
      repository.users.findOne = jest
        .fn()
        .mockImplementationOnce(() => undefined)
        .mockImplementationOnce(() =>
          TestGlobalConfig.mockRepositoryResponse(data),
        );
      const user = await service.fetchOne(id);
      expect(repository.users.findOne).toHaveBeenCalledWith(
        id,
        expect.any(Object),
      );
      expect(user).toBeFalsy();
    });

    it('Should return a user object contain ID', async () => {
      const user = await service.fetchOne(id);
      expect(user).toBeTruthy();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('createdAt');
    });
  });

  describe('On user creation', () => {
    it('Should call repository methods', async () => {
      authService.search = jest.fn();
      repository.users.findOne = jest.fn(() => undefined as any);
      // const fact = await UserFactory.create(data);
      await service.add(data);
      expect(authService.search).toHaveBeenCalledWith({ email });
      expect(authService.search).toHaveBeenCalledWith({ phone });
      expect(repository.users.create).toHaveBeenCalledWith(
        expect.any(Object),
      );
    });

    it('Should expect correct data', async () => {
      const user = await service.add(data);
      expect(user).toBeDefined();
      expect(user.fullname).toBeTruthy();
      expect({
        firstname: user?.firstname,
        email: user.email,
      }).toStrictEqual({ firstname: data.firstname, email: data.email });
      expect(user.id).toBeDefined();
      expect(user.id).toBeTruthy();
      expect(user.id).toEqual(expect.any(String));
    });
  });

  describe('On user update', () => {
    it('Should call repository methods', async () => {
      repository.users.findOne = jest
        .fn()
        .mockImplementation(() =>
          TestGlobalConfig.mockRepositoryResponse(data),
        );
      await service.edit({ ...data, id });
      expect(repository.users.findOne).toHaveBeenCalled();
      expect(repository.users.update).toHaveBeenCalledWith(
        expect.objectContaining({ id: expect.any(String), ...data }),
      );
    });

    it('Should expect correct data', async () => {
      const email = faker.internet.email({
        firstName: firstname.toLowerCase(),
        lastName: lastname.toLowerCase(),
      });
      const user = await service.edit({ ...data, email, id });
      expect(user).toBeDefined();
      expect(user.email).toEqual(email);
      expect(user.id).toBeDefined();
      expect(user.id).toBeTruthy();
      expect(user.id).toEqual(expect.any(String));
    });
  });

  describe('On remove user', () => {
    it('Should return false response', async () => {
      repository.users.findOne = jest
        .fn()
        .mockImplementationOnce(() => undefined);
      const user = await service.remove(id);
      expect(repository.users.remove).not.toBeCalled();
      expect(user).toBeFalsy();
    });

    it('Should return a user object contain ID', async () => {
      repository.users.findOne = jest
        .fn()
        .mockImplementation(() =>
          TestGlobalConfig.mockRepositoryResponse(data),
        );
      const user = await service.remove(id);
      expect(repository.users.remove).toHaveBeenCalledWith(
        expect.objectContaining(data),
      );
      expect(user).toBeTruthy();
    });
  });
});
