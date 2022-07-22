import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import IProductDomain from '../Entities/IProductDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IProductRepository from '../../Infrastructure/Repositories/IProductRepository';

class RemoveProductUseCase
{
    @containerFactory(REPOSITORIES.IProductRepository)
    private repository: IProductRepository;

    async handle(payload: IdPayload): Promise<IProductDomain>
    {
        const { id } = payload;
        return await this.repository.delete(id);
    }
}

export default RemoveProductUseCase;
