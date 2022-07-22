import { ParsedQs } from 'qs';
import { ICriteria } from '@digichanges/shared-experience';

import RequestCriteria from '../../../App/Presentation/Requests/RequestCriteria';

import ProductFilter from '../Criterias/ProductFilter';
import ProductSort from '../Criterias/ProductSort';
import Pagination from '../../../App/Presentation/Shared/Pagination';

class ProductRequestCriteria extends RequestCriteria implements ICriteria
{
    constructor(query: ParsedQs, url: string)
    {
        super(new ProductSort(query), new ProductFilter(query), new Pagination(query, url));
    }
}

export default ProductRequestCriteria;
