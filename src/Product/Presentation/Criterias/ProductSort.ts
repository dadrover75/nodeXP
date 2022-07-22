import { Sort } from '@digichanges/shared-experience';

class ProductSort extends Sort
{
    static readonly NAME: string = 'name';
    static readonly TYPE: string = 'type';

    getFields(): any
    {
        return [
            ProductSort.NAME
        ];
    }

    getDefaultSorts(): any
    {
        return [
            { [ProductSort.NAME]: 'asc' }
        ];
    }
}

export default ProductSort;
