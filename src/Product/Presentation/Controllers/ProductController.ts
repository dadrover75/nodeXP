import IProductDomain from '../../Domain/Entities/IProductDomain';

import SaveProductUseCase from '../../Domain/UseCases/SaveProductUseCase';
import ListProductsUseCase from '../../Domain/UseCases/ListProductsUseCase';
import GetProductUseCase from '../../Domain/UseCases/GetProductUseCase';
import RemoveProductUseCase from '../../Domain/UseCases/RemoveProductUseCase';
import UpdateProductUseCase from '../../Domain/UseCases/UpdateProductUseCase';
import ValidatorRequest from '../../../App/Presentation/Shared/ValidatorRequest';
import ProductRepPayload from '../../Domain/Payloads/ProductRepPayload';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';
import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import ProductUpdatePayload from '../../Domain/Payloads/ProductUpdatePayload';
import IUserDomain from '../../../User/Domain/Entities/IUserDomain';

class ProductController
{
    public async save(request: ProductRepPayload, authUser: IUserDomain): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new SaveProductUseCase();
        return await useCase.handle(request, authUser);
    }

    public async list(request: ICriteria): Promise<IPaginator>
    {
        await ValidatorRequest.handle(request);

        const useCase = new ListProductsUseCase();
        return await useCase.handle(request);
    }

    public async getOne(request: IdPayload): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new GetProductUseCase();
        return await useCase.handle(request);
    }

    public async update(request: ProductUpdatePayload, authUser: IUserDomain): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new UpdateProductUseCase();
        return await useCase.handle(request, authUser);
    }

    public async remove(request: IdPayload): Promise<IProductDomain>
    {
        await ValidatorRequest.handle(request);

        const useCase = new RemoveProductUseCase();
        return await useCase.handle(request);
    }
}

export default ProductController;
