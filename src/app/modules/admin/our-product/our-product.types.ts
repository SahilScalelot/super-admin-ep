export interface InventoryProduct {
    _id            : string;
    ourproductname : string;
    description    : string;
    image          : string;
    socialmedia    : [];
    links          : [];
}

// "ourproductname": "Festum Evento",
// "description": "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.",
// "image": "638d985e28d5eafd9785e3a6/ourproduct/1.jpg",
// "socialmedia":[
//     {
//         "icon": "",
//         "url": "www.facebook.com"
//     }
// ],
// "links": [
//     {
//         "icon": "",
//         "url": "www.playstore.com"
//     },
//     {
//         "icon": "",
//         "url": "www.app.com"
//     }
// ]

export interface InventoryPagination
{
    page: number;
    limit: number;
    search: string;
    sortfield: string;
    sortoption: string;
}
