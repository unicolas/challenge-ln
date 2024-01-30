import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Contact as ContactEntity } from '../src/contacts/entities/contact.entity';
import { ContactsController } from '../src/contacts/contacts.controller';
import { ContactsService } from '../src/contacts/contacts.service';
import {
  CONTACT_ENTITY_FULL,
  CONTACT_FULL_WITH_ID,
  CREATE_CONTACT_DTO,
  UPDATED_CONTACT_ENTITY_FULL,
  UPDATED_CONTACT_FULL,
} from '../src/contacts/contact-mock';

describe('ContactsController (e2e)', () => {
  let app: INestApplication;
  const repositoryMock = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    findBy: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ContactsController],
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(ContactEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('/contacts/1 (GET) - 200', async () => {
    repositoryMock.findOneBy.mockImplementation(() => CONTACT_ENTITY_FULL);

    const response = await request(app.getHttpServer())
      .get('/contacts/1')
      .expect(200);
    expect(response.body.id).toBe(CONTACT_FULL_WITH_ID.id);
    expect(response.body.name).toBe(CONTACT_FULL_WITH_ID.name);
    expect(response.body.company).toBe(CONTACT_FULL_WITH_ID.company);
    expect(response.body.profile_image).toBe(CONTACT_FULL_WITH_ID.profileImage);
    expect(response.body.phone_number.work).toBe(
      CONTACT_FULL_WITH_ID.phoneNumber.work,
    );
    expect(response.body.phone_number.personal).toBe(
      CONTACT_FULL_WITH_ID.phoneNumber.personal,
    );
    expect(response.body.address.line1).toBe(
      CONTACT_FULL_WITH_ID.address.line1,
    );
    expect(response.body.address.line2).toBe(
      CONTACT_FULL_WITH_ID.address.line2,
    );
    expect(response.body.address.city).toBe(CONTACT_FULL_WITH_ID.address.city);
    expect(response.body.address.state).toBe(
      CONTACT_FULL_WITH_ID.address.state,
    );
  });

  it('/contacts/1 (GET) - 404', async () => {
    repositoryMock.findOneBy.mockImplementation(() => null);

    const response = await request(app.getHttpServer())
      .get('/contacts/1')
      .expect(404);
    expect(response.body.message).toBe('Contact not found');
  });

  it('/contacts (POST) - 201', async () => {
    repositoryMock.save.mockImplementation(() => CONTACT_ENTITY_FULL);

    const response = await request(app.getHttpServer())
      .post('/contacts')
      .send(CREATE_CONTACT_DTO)
      .expect(201);
    expect(response.body.id).toBe(CONTACT_FULL_WITH_ID.id);
    expect(response.body.name).toBe(CONTACT_FULL_WITH_ID.name);
    expect(response.body.company).toBe(CONTACT_FULL_WITH_ID.company);
    expect(response.body.profile_image).toBe(CONTACT_FULL_WITH_ID.profileImage);
    expect(response.body.phone_number.work).toBe(
      CONTACT_FULL_WITH_ID.phoneNumber.work,
    );
    expect(response.body.phone_number.personal).toBe(
      CONTACT_FULL_WITH_ID.phoneNumber.personal,
    );
    expect(response.body.address.line1).toBe(
      CONTACT_FULL_WITH_ID.address.line1,
    );
    expect(response.body.address.line2).toBe(
      CONTACT_FULL_WITH_ID.address.line2,
    );
    expect(response.body.address.city).toBe(CONTACT_FULL_WITH_ID.address.city);
    expect(response.body.address.state).toBe(
      CONTACT_FULL_WITH_ID.address.state,
    );
  });

  it('/contacts (POST) - 400: Mandatory name', async () => {
    return request(app.getHttpServer()).post('/contacts').send({}).expect(400);
  });

  it('/contacts (POST) - 400: Wrong email format', async () => {
    return request(app.getHttpServer())
      .post('/contacts')
      .send({
        name: 'test',
        email: 'wrong@email',
      })
      .expect(400);
  });

  it('/contacts/1 (PATCH) - 200', async () => {
    repositoryMock.findOneBy.mockImplementation(() => CONTACT_ENTITY_FULL);
    repositoryMock.save.mockImplementation(() => UPDATED_CONTACT_ENTITY_FULL);

    const response = await request(app.getHttpServer())
      .patch('/contacts/1')
      .send({ email: 'pablolopez@gmail.com' })
      .expect(200);
    expect(response.body.id).toBe(UPDATED_CONTACT_FULL.id);
    expect(response.body.name).toBe(UPDATED_CONTACT_FULL.name);
    expect(response.body.company).toBe(UPDATED_CONTACT_FULL.company);
    expect(response.body.profile_image).toBe(UPDATED_CONTACT_FULL.profileImage);
    expect(response.body.phone_number.work).toBe(
      UPDATED_CONTACT_FULL.phoneNumber.work,
    );
    expect(response.body.phone_number.personal).toBe(
      UPDATED_CONTACT_FULL.phoneNumber.personal,
    );
    expect(response.body.address.line1).toBe(
      UPDATED_CONTACT_FULL.address.line1,
    );
    expect(response.body.address.line2).toBe(
      UPDATED_CONTACT_FULL.address.line2,
    );
    expect(response.body.address.city).toBe(UPDATED_CONTACT_FULL.address.city);
    expect(response.body.address.state).toBe(
      UPDATED_CONTACT_FULL.address.state,
    );
  });

  it('/contacts/1 (PATCH) - 404', async () => {
    repositoryMock.findOneBy.mockImplementation(() => null);

    const response = await request(app.getHttpServer())
      .patch('/contacts/1')
      .send({ email: 'pablolopez@gmail.com' })
      .expect(404);
    expect(response.body.message).toBe('Contact not found');
  });

  it('/contacts/1 (DELETE) - 204', async () => {
    repositoryMock.delete.mockImplementation(() => ({ affected: 1 }));

    return request(app.getHttpServer()).delete('/contacts/1').expect(204);
  });

  it('/contacts/1 (DELETE) - 404', async () => {
    repositoryMock.delete.mockImplementation(() => ({ affected: 0 }));

    const response = await request(app.getHttpServer())
      .delete('/contacts/1')
      .expect(404);
    expect(response.body.message).toBe('Contact not found');
  });

  it('/contacts?email=pablolopez@ln.com (GET) - 200', async () => {
    repositoryMock.findBy.mockImplementation(() => [CONTACT_ENTITY_FULL]);

    const response = await request(app.getHttpServer())
      .get('/contacts?email=pablolopez@ln.com')
      .expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(CONTACT_FULL_WITH_ID.id);
  });

  it('/contacts?city=CABA (GET) - 200', async () => {
    repositoryMock.findBy.mockImplementation(() => [CONTACT_ENTITY_FULL]);

    const response = await request(app.getHttpServer())
      .get('/contacts?city=CABA')
      .expect(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(CONTACT_FULL_WITH_ID.id);
  });

  it('/contacts?state=CABA&email=pablolopez@ln.com (GET) - 422', async () => {
    return request(app.getHttpServer())
      .get('/contacts?state=CABA&email=pablolopez@ln.com')
      .expect(422);
  });
});
