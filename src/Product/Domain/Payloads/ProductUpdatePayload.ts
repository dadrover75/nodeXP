import IdPayload from '../../../Shared/InterfaceAdapters/IdPayload';
import ProductRepPayload from './ProductRepPayload';

interface ProductUpdatePayload extends IdPayload, ProductRepPayload {}

export default ProductUpdatePayload;
