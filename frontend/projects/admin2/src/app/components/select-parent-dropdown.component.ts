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
                    this.categoriesTree = this.filterNode(res, this.filterId);
                    if (!this.currentCategoryNode) {
                        this.currentCategoryNode = this.getTreeCurrentNode(this.categoriesTree);
                    }
                    this.loadingCategories = false;
                },
                error: () => {
                    this.loadingCategories = false;
                }
            });
    }
    
    filterNode(tree: TreeNode[], filterId: number | string): TreeNode[] {
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

    getTreeCurrentNode(tree: TreeNode[]): TreeNode | null {
        if (typeof this.currentId !== 'number') {
            return null;
        }
        let currentNode = null;
        for (const node of tree) {
            if (String(node.key) === String(this.currentId)) {
                currentNode = node;
                break;
            } else if (node.children && node.children.length > 0) {
                currentNode = this.getTreeCurrentNode(node.children);
                if (currentNode !== null) {
                    break;
                }
            }
        }
        return currentNode;
    }

    onCategorySelect(e: any): void {
        this.writeValue(e.node.key);
    }

    writeValue(value: number): void {
        if (typeof value !== 'number') {
            return;
        }
        if (this.currentId !== value) {
            this.currentId = value;
            if (!this.currentCategoryNode) {
                this.currentCategoryNode = this.getTreeCurrentNode(this.categoriesTree);
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
