import {FileData} from './file-data.model';
import {findIndex} from 'lodash';

export interface CategoryNode {
    id: number;
    label: string;
    parentId: number;
    expanded: boolean;
    children?: CategoryNode[]|null;
}

export class Category {

    static createTree(categories: Category[], parent: CategoryNode|null = null, expanded = true): CategoryNode|null {
        if (categories.length === 0) {
            return null;
        }
        if (!parent) {
            const index = findIndex(categories, {name: 'root'});
            if (index > -1) {
                parent = Category.toTreeNode(categories[index], expanded);
            } else {
                parent = {
                    id: 0,
                    parentId: 0,
                    label: '',
                    expanded: true,
                    children: []
                };
            }
        }
        parent.children = [];
        const children = categories.filter(item => item.id !== 0 && item.parentId === parent.id);
        if (children.length > 0) {
            children.forEach((item) => {
                parent.children.push(Category.toTreeNode(item, expanded));
            });
            parent.children.forEach((categoryTreeNode) => {
                Category.createTree(categories, categoryTreeNode, expanded);
            });
        }
        if (parent.children.length === 0) {
            parent.children = null;
        }
        return parent;
    }

    static getCurrentNode(parentId: number, currentNode: CategoryNode): CategoryNode|null {
        if (!currentNode) {
            return null;
        }
        if (currentNode.id === parentId) {
            return currentNode;
        } else if (currentNode.children) {
            let treeNode = null;
            for (let i = 0; treeNode == null && i < currentNode.children.length; i++) {
                treeNode = Category.getCurrentNode(parentId, currentNode.children[i]);
            }
            return treeNode;
        }
        return null;
    }

    static toTreeNode(category: Category, expanded = true): CategoryNode {
        return {
            id: category.id,
            label: category.title,
            parentId: category.parentId || 0,
            expanded: expanded
        } as CategoryNode;
    }

    constructor(
        public id: number,
        public isFolder: boolean,
        public parentId: number,
        public name: string,
        public title: string,
        public description: string,
        public contentTypeName: string,
        public isActive: boolean,
        public clearCache?: boolean,
        public menuIndex?: number,
        public translations?: {[fieldName: string]: {[lang: string]: string}},
        public image?: FileData|null
    ) {
        if (typeof this.clearCache === 'undefined') {
            this.clearCache = false;
        }
        if (typeof this.translations === 'undefined') {
            this.translations = {};
        }
    }
}
