import IPagination from "../Contracts/IPagination";
import * as express from "express";
// import querystring from "querystring"; // TODO: Encapsulate and separet on an lib to create new functionality

class Pagination implements IPagination
{
    private limit: number;
    private offset: number;
    private _url: string;
    private request: express.Request;
    private exist: boolean = false;

    constructor(request: express.Request)
    {
        this.request = request;
        this.limit = request.query.hasOwnProperty('pagination') ? Number(request.query.pagination.limit) : 10;
        this.offset = request.query.hasOwnProperty('pagination') ? Number(request.query.pagination.offset) : 0;
        this.exist = request.query.hasOwnProperty('pagination');
    }

    getLimit(): number
    {
        return this.limit;
    }

    getOffset(): number
    {
        return this.offset;
    }

    getCurrentUrl(): string
    {
        return this.exist ? this.request.get('host') + this.request.url : '';
    }

    // TODO: Refactoring with querystrings to reform query without harcoding URI
    getNextUrl(): string
    {
        let url = "";

        if (this.exist)
        {
            let offset = this.offset + this.limit;

            url = this.request.get('host') + this.request.url;
            const searchValue = 'pagination[offset]=' + this.request.query.pagination.offset;
            const newValue = 'pagination[offset]=' + offset;

            url = url.replace(searchValue, newValue);
        }

        return url;
    }

    getExist(): boolean
    {
        return this.exist;
    }
}

export default Pagination;