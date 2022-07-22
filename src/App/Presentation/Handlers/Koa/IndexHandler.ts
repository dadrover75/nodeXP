import Koa from 'koa';
import Router from 'koa-router';
import Responder from '../../Shared/Http/Koa/Responder';
import { StatusCode } from '@digichanges/shared-experience';

const routerOpts: Router.IRouterOptions = {
    prefix: '/'
};

const IndexHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();

IndexHandler.get('/', async(ctx: Koa.ParameterizedContext & any) =>
{
    void await responder.send('AHORA CON PRODUCTOSSS!!!', ctx, StatusCode.HTTP_OK);
});

export default IndexHandler;
