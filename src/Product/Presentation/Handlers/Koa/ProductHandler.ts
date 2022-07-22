import Koa from 'koa';
import Router from 'koa-router';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../../App/Presentation/Shared/Http/Koa/Responder';
import ProductController from '../../Controllers/ProductController';
import ProductTransformer from '../../Transformers/ProductTransformer';
import ProductRepRequest from '../../Requests/ProductRepRequest';
import { AuthUser } from '../../../../Auth/Presentation/Helpers/AuthUser';
import IdRequest from '../../../../App/Presentation/Requests/IdRequest';
import ProductRequestCriteria from '../../Requests/ProductRequestCriteria';
import ProductUpdateRequest from '../../Requests/ProductUpdateRequest';
import AuthorizeMiddleware from '../../../../Auth/Presentation/Middlewares/Koa/AuthorizeMiddleware';
import Permissions from '../../../../Config/Permissions';
import ResponseMessageEnum from '../../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../../App/Presentation/Transformers/DefaultMessageTransformer';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/products'
};

const ProductHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller: ProductController = new ProductController();

ProductHandler.post('/', AuthorizeMiddleware(Permissions.PRODUCTS_SAVE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const request = new ProductRepRequest(ctx.request.body);

    const product = await controller.save(request, AuthUser(ctx));

    void await responder.send(product, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.CREATED));
});

ProductHandler.get('/', AuthorizeMiddleware(Permissions.PRODUCTS_LIST), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ProductRequestCriteria(ctx.request.query, ctx.request.url);

    const paginator: IPaginator = await controller.list(_request);

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new ProductTransformer());
});

ProductHandler.get('/:id', AuthorizeMiddleware(Permissions.PRODUCTS_SHOW), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const product = await controller.getOne(_request);

    void await responder.send(product, ctx, StatusCode.HTTP_OK, new ProductTransformer());
});

ProductHandler.put('/:id', AuthorizeMiddleware(Permissions.PRODUCTS_UPDATE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ProductUpdateRequest(ctx.request.body, ctx.params.id);

    const product = await controller.update(_request, AuthUser(ctx));

    void await responder.send(product, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
});

ProductHandler.delete('/:id', AuthorizeMiddleware(Permissions.PRODUCTS_DELETE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const product = await controller.remove(_request);

    void await responder.send(product, ctx, StatusCode.HTTP_OK, new ProductTransformer());
});

export default ProductHandler;
