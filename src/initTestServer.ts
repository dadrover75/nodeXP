import 'reflect-metadata';

import supertest from 'supertest';

import { ICreateConnection, ITokenRepository } from '@digichanges/shared-experience';

import DatabaseFactory from './Shared/Factories/DatabaseFactory';
import EventHandler from './Shared/Events/EventHandler';
import { REPOSITORIES } from './Config/Injects/repositories';
import TokenMongooseRepository from './Auth/Infrastructure/Repositories/TokenMongooseRepository';
import TokenTypeORMRepository from './Auth/Infrastructure/Repositories/TokenTypeORMRepository';
import { validateEnv } from './Config/validateEnv';
import container from './inversify.config';
import ITokenDomain from './Auth/Domain/Entities/ITokenDomain';
import SeedFactory from './Shared/Factories/SeedFactory';
import AppFactory from './Shared/Factories/AppFactory';
import Locales from './App/Presentation/Shared/Locales';
import { FACTORIES } from './Config/Injects/factories';
import INotificationFactory from './Notification/Shared/INotificationFactory';
import MockNotificationFactory from './Notification/Tests/MockNotificationFactory';
import MainConfig from './Config/mainConfig';

const initTestServer = async(): Promise<any> =>
{
    validateEnv();

    const databaseFactory: DatabaseFactory = new DatabaseFactory();
    const dbConnection: ICreateConnection = databaseFactory.create();

    dbConnection.initConfigTest(process.env.MONGO_URL);
    await dbConnection.create();

    const eventHandler = EventHandler.getInstance();
    await eventHandler.setListeners();

    void Locales.getInstance();

    const mainConfig = MainConfig.getInstance().getConfig();

    container.unbind(REPOSITORIES.ITokenRepository);
    container.bind<ITokenRepository<ITokenDomain>>(REPOSITORIES.ITokenRepository).to(mainConfig.dbConfig.default === 'Mongoose'
        ? TokenMongooseRepository
        : TokenTypeORMRepository
    );

    container.unbind(FACTORIES.INotificationFactory);
    container.bind<INotificationFactory>(FACTORIES.INotificationFactory).to(MockNotificationFactory);

    const app = AppFactory.create('AppKoa', {
        viewRouteEngine: `${process.cwd()}/dist/src/App/Presentation/Views`,
        serverPort: 8088
    });

    app.initConfig();
    app.build();

    const application = app.callback();
    const request: supertest.SuperAgentTest = supertest.agent(application);

    const seed = new SeedFactory();
    await seed.init();

    return { request, dbConnection };
};

export default initTestServer;

