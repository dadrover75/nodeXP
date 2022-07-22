import { SuperAgentTest } from 'supertest';
import initTestServer from '../../initTestServer';
import { ICreateConnection } from '@digichanges/shared-experience';
import { ILoginResponse } from '../../Shared/InterfaceAdapters/Tests/ILogin';
import { IProductResponse, IListProductsResponse } from './types';
import MainConfig from '../../Config/mainConfig';

describe('Start Product Test', () =>
{
    let request: SuperAgentTest;
    let dbConnection: ICreateConnection;
    let token: string = null;
    let productId = '';
    let deleteResponse: any = null;

    beforeAll(async() =>
    {
        const configServer = await initTestServer();

        request = configServer.request;
        dbConnection = configServer.dbConnection;
    });

    afterAll((async() =>
    {
        await dbConnection.drop();
        await dbConnection.close();
    }));

    describe('Product Success', () =>
    {
        beforeAll(async() =>
        {
            const payload = {
                email: 'user@node.com',
                password: '12345678'
            };

            const response: ILoginResponse = await request
                .post('/api/auth/login?provider=local')
                .set('Accept', 'application/json')
                .send(payload);

            const { body: { data } } = response;

            token = data.token;
        });

        test('Add Product /products', async() =>
        {
            const payload = {
                name: 'Product 1',
                description: 'Product 1 description',
                price: 100,
                quantity: 10
            };

            const response: IProductResponse = await request
                .post('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);

            productId = data.id;
        });

        test('Get Product /products/:id', async() =>
        {
            const payload = {
                name: 'Product 1',
                description: 'Product 1 description',
                price: 100,
                quantity: 10
            };

            const response: IProductResponse = await request
                .get(`/api/products/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.description).toStrictEqual(payload.description);
            expect(data.price).toStrictEqual(payload.price);
            expect(data.quantity).toStrictEqual(payload.quantity);
        });

        test('Update Product /products/:id', async() =>
        {
            const payload = {
                name: 'Product 1 Updated',
                description: 'Product 1 description Updated',
                price: 101,
                quantity: 11
            };

            const response: IProductResponse = await request
                .put(`/api/products/${productId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            const { body: { data } } = response;

            expect(response.statusCode).toStrictEqual(201);
        });

        test('Delete Product /products/:id', async() =>
        {
            const payload = {
                name: 'Product 1 for delete',
                description: 'Product 1 description',
                price: 100,
                quantity: 10
            };

            const createResponse: IProductResponse = await request
                .post('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send(payload);

            deleteResponse = await request
                .delete(`/api/products/${createResponse.body.data.id}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data } } = deleteResponse;

            expect(deleteResponse.statusCode).toStrictEqual(200);

            expect(data.name).toStrictEqual(payload.name);
            expect(data.description).toStrictEqual(payload.description);
            expect(data.price).toStrictEqual(payload.price);
            expect(data.quantity).toStrictEqual(payload.quantity);
        });

        test('Get Products /products', async() =>
        {
            const config = MainConfig.getInstance();

            const response: IListProductsResponse = await request
                .get('/api/products?pagination[offset]=0&pagination[limit]=5')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(5);
            expect(pagination.total).toStrictEqual(11);
            expect(pagination.perPage).toStrictEqual(5);
            expect(pagination.currentPage).toStrictEqual(1);
            expect(pagination.lastPage).toStrictEqual(3);
            expect(pagination.from).toStrictEqual(0);
            expect(pagination.to).toStrictEqual(5);
            expect(pagination.path).toContain(config.getConfig().url.urlApi);
            expect(pagination.firstUrl).toContain('/api/products?pagination[offset]=0&pagination[limit]=5');
            expect(pagination.lastUrl).toContain('/api/products?pagination[offset]=10&pagination[limit]=5');
            expect(pagination.nextUrl).toContain('/api/products?pagination[offset]=5&pagination[limit]=5');
            expect(pagination.prevUrl).toStrictEqual(null);
            expect(pagination.currentUrl).toContain('/api/products?pagination[offset]=0&pagination[limit]=5');
        });

        test('Get Products /products without pagination', async() =>
        {
            const response: IListProductsResponse = await request
                .get('/api/products')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .send();

            const { body: { data, pagination } } = response;

            expect(response.statusCode).toStrictEqual(200);

            expect(data.length).toStrictEqual(11);
            expect(pagination).not.toBeDefined();
        });
    });

    // describe('Product Fails', () =>
    // {
    //     beforeAll(async() =>
    //     {
    //         const payload = {
    //             email: 'user@node.com',
    //             password: '12345678'
    //         };

    //         const response: ILoginResponse = await request
    //             .post('/api/auth/login?provider=local')
    //             .set('Accept', 'application/json')
    //             .send(payload);

    //         const { body: { data } } = response;

    //         token = data.token;
    //     });

    //     test('Add Product /products', async() =>
    //     {
    //         const payload = {
    //             name: 'Product 1',
    //             description: 'Product 1 description',
    //             price: '100',
    //             quantity: 10
    //         };

    //         const response: IProductResponse = await request
    //             .post('/api/products')
    //             .set('Accept', 'application/json')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send(payload);

    //         const { body: { message, errors: [error] } } = response;

    //         expect(response.statusCode).toStrictEqual(422);
    //         expect(message).toStrictEqual('Failed Request.');

    //         expect(error.property).toStrictEqual('price');
    //         expect(error.constraints.isInt).toStrictEqual('price must be an integer number');
    //     });

    //     test('Get product /products/:id', async() =>
    //     {
    //         const response: IProductResponse = await request
    //             .get(`/api/products/${productId}dasdasda123`)
    //             .set('Accept', 'application/json')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send();

    //         const { body: { message, errors: [error] } } = response;

    //         expect(response.statusCode).toStrictEqual(422);
    //         expect(message).toStrictEqual('Failed Request.');

    //         expect(error.property).toStrictEqual('id');
    //         expect(error.constraints.isUuid).toBeDefined();
    //         expect(error.constraints.isUuid).toStrictEqual('id must be a UUID');
    //     });

    //     test('Update Product /products/:id', async() =>
    //     {
    //         const payload = {
    //             name: 11,
    //             description: 'Product 1 description',
    //             price: 100,
    //             quantity: '10'
    //         };

    //         const response: IProductResponse = await request
    //             .put(`/api/products/${productId}`)
    //             .set('Accept', 'application/json')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send(payload);

    //         const { body: { message, errors: [errorName] } } = response;

    //         expect(response.statusCode).toStrictEqual(422);
    //         expect(message).toStrictEqual('Failed Request.');

    //         expect(errorName.property).toStrictEqual('name');
    //         expect(errorName.constraints.isString).toBeDefined();
    //         expect(errorName.constraints.isString).toStrictEqual('name must be a string');
    //     });

    //     test('Delete product error /products/:id', async() =>
    //     {
    //         const deleteErrorResponse: IProductResponse = await request
    //             .delete(`/api/products/${deleteResponse.body.data.id}`)
    //             .set('Accept', 'application/json')
    //             .set('Authorization', `Bearer ${token}`)
    //             .send();

    //         const { body: { message } } = deleteErrorResponse;

    //         expect(deleteErrorResponse.statusCode).toStrictEqual(400);
    //         expect(message).toStrictEqual('Product not found.');
    //     });
    // });
});

