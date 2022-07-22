import ProductUpdatePayload from '../Payloads/ProductUpdatePayload';
import IProductDomain from '../Entities/IProductDomain';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IProductRepository from '../../Infrastructure/Repositories/IProductRepository';

class UpdateProductUseCase
{
    @containerFactory(REPOSITORIES.IProductRepository)
    private repository: IProductRepository;

    async handle(payload: ProductUpdatePayload, authUser: IUserDomain): Promise<IProductDomain>
    {
        const product: IProductDomain = await this.repository.getOne(payload.id);
        product.updateBuild(payload);
        product.lastModifiedBy = authUser;

        return await this.repository.update(product);
    }
}

export default UpdateProductUseCase;
