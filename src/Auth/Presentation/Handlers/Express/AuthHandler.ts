import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { StatusCode } from '@digichanges/shared-experience';

import { inject } from 'inversify';
import { TYPES } from '../../../../Config/Injects/types';
import Responder from '../../../../App/Presentation/Shared/Http/Express/Responder';

import AuthorizeMiddleware from '../../Middlewares/Express/AuthorizeMiddleware';
import Permissions from '../../../../Config/Permissions';

import AuthRequest from '../../Requests/AuthRequest';
import ForgotPasswordRequest from '../../Requests/ForgotPasswordRequest';
import ChangeForgotPasswordRequest from '../../Requests/ChangeForgotPasswordRequest';
import RefreshTokenRequest from '../../Requests/RefreshTokenRequest';

import AuthTransformer from '../../Transformers/AuthTransformer';
import PermissionsTransformer from '../../Transformers/PermissionsTransformer';

import AuthController from '../../Controllers/AuthController';
import { AuthUser } from '../../Helpers/AuthUser';
import UserTransformer from '../../../../User/Presentation/Transformers/UserTransformer';
import moment from 'moment';
import DefaultTransformer from '../../../../App/Presentation/Transformers/DefaultTransformer';
import RegisterRequest from '../../Requests/RegisterRequest';
import UpdateMeRequest from '../../Requests/UpdateMeRequest';
import VerifyYourAccountRequest from '../../Requests/VerifyYourAccountRequest';
import RefreshTokenMiddleware from '../../Middlewares/Express/RefreshTokenMiddleware';
import MainConfig from '../../../../Config/mainConfig';

@controller('/api/auth')
class AuthHandler
{
    @inject(TYPES.Responder)
    private responder: Responder;
    private readonly controller: AuthController;

    constructor()
    {
        this.controller = new AuthController();
    }

    @httpGet('/me')
    public async me(@request() req: Request, @response() res: Response): Promise<void>
    {
        void await this.responder.send(AuthUser(req), null, res, StatusCode.HTTP_OK, new UserTransformer());
    }

    @httpPut('/me')
    public async updateMe(@request() req: Request, @response() res: Response): Promise<void>
    {
        const _request = new UpdateMeRequest(req.body, AuthUser(req));
        const payload = await this.controller.updateMe(_request);

        void await this.responder.send(payload, req, res, StatusCode.HTTP_OK, new UserTransformer());
    }

    @httpPost('/login')
    public async login(@request() req: Request, @response() res: Response): Promise<void>
    {
        const _request = new AuthRequest(req.body);

        const payload = await this.controller.login(_request);

        res.cookie(
            'refreshToken',
            payload.getRefreshHash(),
            {
                expires: moment.unix(payload.getExpires()).toDate(),
                maxAge: payload.getExpires(),
                path: '/api/auth',
                secure: MainConfig.getInstance().getConfig().setCookieSecure,
                httpOnly: true,
                sameSite: MainConfig.getInstance().getConfig().setCookieSameSite
            });

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, new AuthTransformer());
    }

    @httpPost('/signup')
    public async register(@request() req: Request, @response() res: Response): Promise<void>
    {
        const _request = new RegisterRequest(req.body);

        const payload = await this.controller.register(_request);

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, new DefaultTransformer());
    }

    @httpPost('/logout')
    public async logout(@request() req: any, @response() res: Response)
    {
        const _request = new RefreshTokenRequest(req.refreshToken);

        const payload = await this.controller.logout(_request, AuthUser(req, 'tokenDecode'));

        res.cookie('refreshToken', null);

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, new DefaultTransformer());
    }

    @httpPost('/refresh-token', RefreshTokenMiddleware)
    public async refreshToken(@request() req: any, @response() res: Response)
    {
        const _request = new RefreshTokenRequest(req.refreshToken);

        const payload = await this.controller.refreshToken(_request);

        res.cookie(
            'refreshToken',
            payload.getRefreshHash(),
            {
                expires: moment.unix(payload.getExpires()).toDate(),
                maxAge: payload.getExpires(),
                path: '/api/auth',
                secure: MainConfig.getInstance().getConfig().setCookieSecure,
                httpOnly: true,
                sameSite: MainConfig.getInstance().getConfig().setCookieSameSite
            });

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, new AuthTransformer());
    }

    @httpPost('/forgot-password')
    public async forgotPassword(@request() req: Request, @response() res: Response)
    {
        const _request = new ForgotPasswordRequest(req.body);

        const payload = await this.controller.forgotPassword(_request);

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, null);
    }

    @httpPost('/change-forgot-password')
    public async changeForgotPassword(@request() req: Request, @response() res: Response)
    {
        const _request = new ChangeForgotPasswordRequest(req.body);

        const payload = await this.controller.changeForgotPassword(_request);

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, null);
    }

    @httpPut('/verify-your-account/:confirmationToken')
    public async verifyYourAccount(@request() req: Request, @response() res: Response)
    {
        const _request = new VerifyYourAccountRequest(req.params.confirmationToken);

        const payload = await this.controller.verifyYourAccount(_request);

        void await this.responder.send(payload, req, res, StatusCode.HTTP_CREATED, new DefaultTransformer());
    }

    @httpGet('/permissions', AuthorizeMiddleware(Permissions.GET_PERMISSIONS))
    public async permissions(@request() req: Request, @response() res: Response)
    {
        const payload = this.controller.permissions();

        void await this.responder.send(payload, req, res, StatusCode.HTTP_OK, new PermissionsTransformer());
    }

    @httpPost('/sync-roles-permissions', AuthorizeMiddleware(Permissions.AUTH_SYNC_PERMISSIONS))
    public async syncRolesPermissions(@request() req: Request, @response() res: Response)
    {
        this.controller.syncRolesPermissions();

        void await this.responder.send({ message: 'Sync Successfully' }, req, res, StatusCode.HTTP_CREATED, null);
    }
}
