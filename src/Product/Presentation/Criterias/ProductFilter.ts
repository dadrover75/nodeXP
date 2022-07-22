import { Filter } from '@digichanges/shared-experience';

class ProductFilter extends Filter
{
    static readonly NAME: string = 'name';
    static readonly TYPE: string = 'type';

    getFields(): any
    {
        return [
            ProductFilter.NAME
        ];
    }

    getDefaultFilters(): any
    {
        return [];
    }
}

export default ProductFilter;
