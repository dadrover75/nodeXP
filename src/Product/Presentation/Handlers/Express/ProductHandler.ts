import { NextFunction, Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpDelete, httpGet, httpPost, httpPut, next, request, response } from 'inversify-express-utils';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';

import { TYPES } from '../../../../Config/Injects/types';
import Responder from '../../../../App/Presentation/Shared/Http/Express/Responder';
import AuthorizeMiddleware from '../../../../Auth/Presentation/Middlewares/Express/AuthorizeMiddleware';
import Permissions from '../../../../Config/Permissions';

import ProductTransformer from '../../Transformers/ProductTransformer';
import ProductRepRequest from '../../Requests/ProductRepRequest';
import IdRequest from '../../../../App/Presentation/Requests/IdRequest';
import ProductRequestCriteria from '../../Requests/ProductRequestCriteria';
import ProductUpdateRequest from '../../Requests/ProductUpdateRequest';
import IProductDomain from '../../../Domain/Entities/IProductDomain';

import ProductController from '../../Controllers/ProductController';
import { AuthUser } from '../../../../Auth/Presentation/Helpers/AuthUser';
import ResponseMessageEnum from '../../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../../App/Presentation/Transformers/DefaultMessageTransformer';

@controller('/api/products')
class ProductHandler
{
    @inject(TYPES.Responder)
    private responder: Responder;
    private readonly controller: ProductController;

    constructor()
    {
        this.controller = new ProductController();
    }

    @httpPost('/', AuthorizeMiddleware(Permissions.PRODUCTS_SAVE))
    public async save(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new ProductRepRequest(req.body);

        const product: IProductDomain = await this.controller.save(_request, AuthUser(req));

        void await this.responder.send(product, req, res, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.CREATED));
    }

    @httpGet('/', AuthorizeMiddleware(Permissions.PRODUCTS_LIST))
    public async list(@request() req: Request, @response() res: Response)
    {
        const _request = new ProductRequestCriteria(req.query, req.url);

        const paginator: IPaginator = await this.controller.list(_request);

        await this.responder.paginate(paginator, req, res, StatusCode.HTTP_OK, new ProductTransformer());
    }

    @httpGet('/:id', AuthorizeMiddleware(Permissions.PRODUCTS_SHOW))
    public async getOne(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new IdRequest({ id: req.params.id });

        const product: IProductDomain = await this.controller.getOne(_request);

        void await this.responder.send(product, req, res, StatusCode.HTTP_OK, new ProductTransformer());
    }

    @httpPut('/:id', AuthorizeMiddleware(Permissions.PRODUCTS_UPDATE))
    public async update(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new ProductUpdateRequest(req.body, req.params.id);

        const product: IProductDomain = await this.controller.update(_request, AuthUser(req));

        void await this.responder.send(product, req, res, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
    }

    @httpDelete('/:id', AuthorizeMiddleware(Permissions.PRODUCTS_DELETE))
    public async remove(@request() req: Request, @response() res: Response, @next() nex: NextFunction)
    {
        const _request = new IdRequest({ id: req.params.id });

        const product: IProductDomain = await this.controller.remove(_request);

        void await this.responder.send(product, req, res, StatusCode.HTTP_OK, new ProductTransformer());
    }
}

export default ProductHandler;

