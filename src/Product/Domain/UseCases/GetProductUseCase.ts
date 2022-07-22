import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import ProductDomain from '../Entities/IProductDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import ProductRepository from '../../Infrastructure/Repositories/IProductRepository';

class GetProductUseCase
{
    @containerFactory(REPOSITORIES.IProductRepository)
    private repository: ProductRepository;

    async handle(payload: IdPayload): Promise<ProductDomain>
    {
        return await this.repository.getOne(payload.id);
    }
}

export default GetProductUseCase;
