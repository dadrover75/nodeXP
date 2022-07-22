import ProductUpdatePayload from '../../Domain/Payloads/ProductUpdatePayload';
import IdRequest from '../../../App/Presentation/Requests/IdRequest';
import ProductRepRequest from './ProductRepRequest';
import { Mixin } from 'ts-mixer';

class ProductUpdateRequest extends Mixin(ProductRepRequest, IdRequest) implements ProductUpdatePayload
{
    constructor(data: Record<string, any>, id: string)
    {
        super(data);
        this._id = id;
    }
}

export default ProductUpdateRequest;
