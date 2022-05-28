import {Component, OnInit, Input, forwardRef, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {TreeNode} from 'primeng/api';

import {CategoriesService} from '../catalog/services/categories.service';

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
    @Input()

    static getTreeCurrentNode(tree: TreeNode[], currentId: number|string): TreeNode | null {
        if (typeof currentId !== 'number') {
            return null;
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
    
    set disabled(value: boolean) {
        this._disabled = value;
    }
    get disabled(): boolean {
        return this._disabled;
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
                    if (!this.currentCategoryNode) {
                        this.currentCategoryNode = SelectParentDropdownComponent.getTreeCurrentNode(this.categoriesTree, this.currentId);
                    }
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

    writeValue(value: number|null): void {
        if (typeof value !== 'number') {
            return;
        }
        if (this.currentId !== value) {
            this.currentId = value;
            if (!this.currentCategoryNode) {
                this.currentCategoryNode = SelectParentDropdownComponent.getTreeCurrentNode(this.categoriesTree, this.currentId);
            }
            this.onChange(value);
        }
    }

    registerOnChange(fn: (_: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
