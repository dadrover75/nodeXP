import { Query } from 'mongoose';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import IProductRepository from './IProductRepository';
import ProductFilter from '../../Presentation/Criterias/ProductFilter';
import MongoosePaginator from '../../../App/Presentation/Shared/Orm/MongoosePaginator';
import IProduct from '../Schemas/IProductDocument';

import BaseMongooseRepository from '../../../App/Infrastructure/Repositories/BaseMongooseRepository';
import IProductDomain from '../../Domain/Entities/IProductDomain';
import Product from '../../Domain/Entities/Product';

@injectable()
class ProductMongoRepository extends BaseMongooseRepository<IProductDomain, IProduct> implements IProductRepository
{
    constructor()
    {
        super(Product.name, ['createdBy', 'lastModifiedBy']);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: Query<IProduct[], IProduct> = this.repository.find();
        const filter = criteria.getFilter();

        if (filter.has(ProductFilter.NAME))
        {
            const name: string = filter.get(ProductFilter.NAME);
            const rSearch = new RegExp(name, 'g');

            void queryBuilder.where(ProductFilter.NAME).regex(rSearch);
        }

        void queryBuilder.populate(this.populate);

        return new MongoosePaginator(queryBuilder, criteria);
    }
}

export default ProductMongoRepository;
