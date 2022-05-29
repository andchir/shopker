import {Component, OnInit, Input, forwardRef, ViewChild, Output, EventEmitter} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {TreeNode} from 'primeng/api';

import {CategoriesService} from '../catalog/services/categories.service';
import {FileData} from '../catalog/models/file-data.model';

@Component({
    selector: 'app-select-parent-dropdown',
    templateUrl: 'templates/select-parent-dropdown.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SelectParentDropdownComponent),
            multi: true
        }
    ]
})
export class SelectParentDropdownComponent implements OnInit, ControlValueAccessor {

    private _disabled = false;
    loadingCategories = false;
    categoriesTree: TreeNode[] = [];
    currentCategoryNode: TreeNode;
    previousCategoryNode: TreeNode;
    currentId: number = null;

    @ViewChild('dropdownElement', { static: true }) dropdownElement;
    @Input() filterId: number = null;
    @Input() showHeaderButtons = false;
    @Input() rootTitle = 'ROOT_FOLDER';
    @Input() inputId = 'fieldParent';
    @Output() onAction = new EventEmitter<any>();

    _onChange: (value: FileData) => void = () => null;
    _onTouched: () => void = () => null;
    
    static getTreeCurrentNode(tree: TreeNode[], currentId: number|string): TreeNode | null {
        if (typeof currentId !== 'number') {
            currentId = 0;
        }
        let currentNode = null;
        for (const node of tree) {
            if (String(node.key) === String(currentId)) {
                currentNode = node;
                break;
            } else if (node.children && node.children.length > 0) {
                currentNode = this.getTreeCurrentNode(node.children, currentId);
                if (currentNode !== null) {
                    break;
                }
            }
        }
        return currentNode;
    }

    static filterNode(tree: TreeNode[], filterId: number | string): TreeNode[] {
        if (!filterId) {
            return tree;
        }
        const index = tree.findIndex((node) => {
            return String(node.key) === String(filterId);
        });
        if (index > -1) {
            tree.splice(index, 1);
        } else {
            tree.forEach((node) => {
                if (node.children) {
                    this.filterNode(node.children, filterId);
                }
            });
        }
        return tree;
    }

    constructor(
        public dataService: CategoriesService
    ) {
    }

    ngOnInit(): void {
        this.getCategoriesTree();
    }

    onChange: (value: number) => void = () => null;
    onTouched: () => void = () => null;

    getCategoriesTree(): void {
        this.loadingCategories = true;
        this.dataService.getTree()
            .subscribe({
                next: (res) => {
                    this.categoriesTree = SelectParentDropdownComponent.filterNode(res, this.filterId);
                    this.currentCategoryNode = SelectParentDropdownComponent.getTreeCurrentNode(this.categoriesTree, this.currentId);
                    this.loadingCategories = false;
                },
                error: () => {
                    this.loadingCategories = false;
                }
            });
    }

    onCategorySelect(): void {
        const value = this.currentCategoryNode ? parseInt(String(this.currentCategoryNode.key), 10) : null;
        this.writeValue(value);
    }

    goToRootCategory(): void {
        this.callAction('root');
    }

    deleteCategoryItemConfirm(): void {
        this.callAction('delete', this.currentId);
    }

    callAction(action: string, categoryId?: number): void {
        const parentId = this.currentCategoryNode && this.currentCategoryNode.parent
            ? this.currentCategoryNode.parent.key
            : 0;
        this.onAction.emit([action, this.currentId, parentId]);
    }

    expandAll(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.categoriesTree.forEach(node => {
            this.expandRecursive(node, true);
        });
    }

    collapseAll(event?: MouseEvent): void {
        if (event) {
            event.preventDefault();
        }
        this.categoriesTree.forEach(node => {
            this.expandRecursive(node, false);
        });
    }

    private expandRecursive(node: TreeNode, isExpand: boolean): void {
        node.expanded = isExpand;
        if (node.children) {
            node.children.forEach(childNode => {
                this.expandRecursive(childNode, isExpand);
            });
        }
    }

    writeValue(value: number|null): void {
        if (typeof value !== 'number') {
            return;
        }
        if (this.currentId !== value) {
            this.currentId = value;
            this.currentCategoryNode = SelectParentDropdownComponent.getTreeCurrentNode(this.categoriesTree, this.currentId);
            this.onChange(value);
        }
    }

    registerOnChange(fn: (_: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
