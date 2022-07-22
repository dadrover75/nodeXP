import moment from 'moment';
import { Transformer } from '@digichanges/shared-experience';

import IProductDomain from '../../Domain/Entities/IProductDomain';
import IProductTransformer from './IProductTransformer';
import UserMinimalDataTransformer from '../../../User/Presentation/Transformers/UserMinimalDataTransformer';

class ProductTransformer extends Transformer
{
    private userTransformer: UserMinimalDataTransformer;

    constructor()
    {
        super();
        this.userTransformer = new UserMinimalDataTransformer();
    }

    public async transform(product: IProductDomain): Promise<IProductTransformer>
    {
        const createdBy = product.getCreatedBy();
        const lastModifiedBy = product.getLastModifiedBy();

        return {
            id: product.getId(),
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity,
            createdBy: createdBy ? await this.userTransformer.handle(createdBy) : null,
            lastModifiedBy: lastModifiedBy ? await this.userTransformer.handle(lastModifiedBy) : null,
            createdAt: moment(product.createdAt).utc().unix(),
            updatedAt: moment(product.updatedAt).utc().unix()
        };
    }
}

export default ProductTransformer;
