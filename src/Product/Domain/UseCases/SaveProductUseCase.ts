import ProductRepPayload from '../Payloads/ProductRepPayload';
import IProductDomain from '../Entities/IProductDomain';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';
import Product from '../Entities/Product';
import { containerFactory } from '../../../Shared/Decorators/ContainerFactory';
import { REPOSITORIES } from '../../../Config/Injects/repositories';
import IProductRepository from '../../Infrastructure/Repositories/IProductRepository';

class SaveProductUseCase
{
    @containerFactory(REPOSITORIES.IProductRepository)
    private repository: IProductRepository;

    async handle(payload: ProductRepPayload, authUser: IUserDomain): Promise<IProductDomain>
    {
        const product = new Product(payload);
        product.createdBy = authUser;

        return await this.repository.save(product);
    }
}

export default SaveProductUseCase;
