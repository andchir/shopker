export interface Product {
    //[key: string]: number | string | string[];
    id: number;
    parentId: number;
    title?: string;
    isActive?: boolean;
}
