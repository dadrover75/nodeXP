import Koa from 'koa';
import Router from 'koa-router';
import { IPaginator, StatusCode } from '@digichanges/shared-experience';
import Responder from '../../../../App/Presentation/Shared/Http/Koa/Responder';
import IdRequest from '../../../../App/Presentation/Requests/IdRequest';
import UserController from '../../Controllers/UserControllers';
import IUserDomain from '../../../Domain/Entities/IUserDomain';
import UserRequestCriteria from '../../Requests/UserRequestCriteria';
import UserUpdateRequest from '../../Requests/UserUpdateRequest';
import UserSaveRequest from '../../Requests/UserSaveRequest';
import UserAssignRoleRequest from '../../Requests/UserAssignRoleRequest';
import ChangeMyPasswordRequest from '../../Requests/ChangeMyPasswordRequest';
import ChangeUserPasswordRequest from '../../Requests/ChangeUserPasswordRequest';
import UserTransformer from '../../Transformers/UserTransformer';
import AuthorizeMiddleware from '../../../../Auth/Presentation/Middlewares/Koa/AuthorizeMiddleware';
import Permissions from '../../../../Config/Permissions';
import ResponseMessageEnum from '../../../../App/Domain/Enum/ResponseMessageEnum';
import DefaultMessageTransformer from '../../../../App/Presentation/Transformers/DefaultMessageTransformer';

const routerOpts: Router.IRouterOptions = {
    prefix: '/api/users'
};

const UserHandler: Router = new Router(routerOpts);
const responder: Responder = new Responder();
const controller = new UserController();

UserHandler.post('/', AuthorizeMiddleware(Permissions.USERS_SAVE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserSaveRequest(ctx.request.body);

    const user: IUserDomain = await controller.save(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.CREATED));
});

UserHandler.get('/', AuthorizeMiddleware(Permissions.USERS_LIST), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserRequestCriteria(ctx.request.query, ctx.request.url);

    const paginator: IPaginator = await controller.list(_request);

    await responder.paginate(paginator, ctx, StatusCode.HTTP_OK, new UserTransformer());
});

UserHandler.get('/:id', AuthorizeMiddleware(Permissions.USERS_SHOW), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const user: IUserDomain = await controller.getOne(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_OK, new UserTransformer());
});

UserHandler.put('/:id', AuthorizeMiddleware(Permissions.USERS_UPDATE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserUpdateRequest(ctx.request.body, ctx.params.id, ctx.tokenDecode.userId);

    const user: IUserDomain = await controller.update(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
});

UserHandler.put('/assign-role/:id', AuthorizeMiddleware(Permissions.USERS_ASSIGN_ROLE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new UserAssignRoleRequest(ctx.request.body, ctx.params.id);

    const user: IUserDomain = await controller.assignRole(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
});

UserHandler.delete('/:id', AuthorizeMiddleware(Permissions.USERS_DELETE), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new IdRequest({ id: ctx.params.id });

    const user: IUserDomain = await controller.remove(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_OK, new UserTransformer());
});

UserHandler.post('/change-my-password', AuthorizeMiddleware(Permissions.USERS_CHANGE_MY_PASSWORD), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ChangeMyPasswordRequest(ctx.request.body, ctx.tokenDecode.userId);

    const user: IUserDomain = await controller.changeMyPassword(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
});

UserHandler.put('/change-user-password/:id', AuthorizeMiddleware(Permissions.USERS_CHANGE_USER_PASSWORD), async(ctx: Koa.ParameterizedContext & any) =>
{
    const _request = new ChangeUserPasswordRequest(ctx.request.body, ctx.params.id);

    const user: IUserDomain = await controller.changeUserPassword(_request);

    void await responder.send(user, ctx, StatusCode.HTTP_CREATED, new DefaultMessageTransformer(ResponseMessageEnum.UPDATED));
});

export default UserHandler;
