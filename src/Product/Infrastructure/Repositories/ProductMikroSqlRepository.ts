import IProductRepository from './IProductRepository';
import Product from '../../Domain/Entities/Product';
import { injectable } from 'inversify';
import { ICriteria, IPaginator } from '@digichanges/shared-experience';

import Paginator from '../../../App/Presentation/Shared/Orm/MikroORMPaginator';
import ProductFilter from '../../Presentation/Criterias/ProductFilter';
import ProductSchema from '../Schemas/ProductMikroORM';

import BaseMikroORMRepository from '../../../App/Infrastructure/Repositories/BaseMikroORMRepository';
import { QueryBuilder } from '@mikro-orm/postgresql';

@injectable()
class ProductMikroSqlRepository extends BaseMikroORMRepository<Product> implements IProductRepository
{
    constructor()
    {
        super(Product.name, ProductSchema);
    }

    async list(criteria: ICriteria): Promise<IPaginator>
    {
        const queryBuilder: QueryBuilder = this.em.createQueryBuilder('Product', 'i');

        const filter = criteria.getFilter();

        void queryBuilder.where('1 = 1');

        if (filter.has(ProductFilter.NAME))
        {
            void queryBuilder.andWhere(`i.${ProductFilter.NAME} like ?`, [`${filter.get(ProductFilter.NAME)}`]);
        }

        return new Paginator(queryBuilder, criteria);
    }
}

export default ProductMikroSqlRepository;
