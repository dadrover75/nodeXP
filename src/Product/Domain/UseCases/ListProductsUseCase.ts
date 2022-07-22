import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IProductRepository from '../../Infrastructure/Repositories/IProductRepository';

class ListProductsUseCase
{
    @containerFactory(REPOSITORIES.IProductRepository)
    private repository: IProductRepository;

    async handle(payload: ICriteria): Promise<IPaginator>
    {
        return await this.repository.list(payload);
    }
}

export default ListProductsUseCase;
