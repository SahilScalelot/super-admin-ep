export interface InventoryProduct {
    _id          : string;
    category_name : string;
    event_type   : string;
}

export interface InventoryPagination
{
    page: number;
    limit: number;
    search: string;
    sortfield: string;
    sortoption: string;
}
