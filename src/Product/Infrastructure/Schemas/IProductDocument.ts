import { Document } from 'mongoose';
import IProductDomain from '../../Domain/Entities/IProductDomain';

interface IProductDocument extends Document, IProductDomain {}

export default IProductDocument;
