import {ITokenRepository} from "@digichanges/shared-experience";

import { lazyInject } from '../../../inversify.config'
import {REPOSITORIES} from "../../../repositories";
import ITokenDomain from "../../../InterfaceAdapters/IInfrastructure/ITokenDomain";

class SetTokenBlacklistUseCase
{
    @lazyInject(REPOSITORIES.ITokenRepository)
    private repository: ITokenRepository;

    async handle(token: ITokenDomain)
    {
        token.blackListed = true;
        await this.repository.save(token);
    }
}

export default SetTokenBlacklistUseCase;
