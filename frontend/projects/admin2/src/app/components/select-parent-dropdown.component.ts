import {Component, OnInit, Input, forwardRef, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
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
export class SelectParentDropdownComponent implements OnInit, OnChanges, ControlValueAccessor {

    private _disabled = false;
    loadingCategories = false;
    categoriesTree: TreeNode[] = [];
    currentCategoryNode: TreeNode;
    previousCategoryNode: TreeNode;

    @ViewChild('dropdownElement', { static: true }) dropdownElement;
    @Input() filterId: number = null;
    @Input() currentId: number = null;
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
    
    ngOnChanges(changes: SimpleChanges): void {
        if (changes && typeof changes.currentId !== 'undefined'
            && typeof changes.currentId.currentValue === 'number') {
                if (this.currentId !== changes.currentId.currentValue) {
                    this.currentId = changes.currentId.currentValue;
                    this.getCategoriesTree();
                }
        }
    }

    onChange: (value: number) => void = () => null;
    onTouched: () => void = () => null;

    getCategoriesTree(): void {
        this.loadingCategories = true;
        this.dataService.getTree()
            .subscribe({
                next: (res) => {
                    if (typeof this.currentId !== 'number') {
                        return;
                    }
                    this.categoriesTree = this.filterNode(res, this.filterId);
                    this.currentCategoryNode = this.getTreeCurrentNode(this.categoriesTree);
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
        if (e.node.key && e.node.key === this.filterId) {
            if (this.previousCategoryNode) {
                this.currentCategoryNode = JSON.parse(JSON.stringify(this.previousCategoryNode));
                this.currentId = this.currentCategoryNode['id'] || this.currentCategoryNode['key'];
            } else {
                this.currentCategoryNode = null;
                this.currentId = null;
            }
            return;
        }
        this.previousCategoryNode = {key: this.currentCategoryNode.key, label: this.currentCategoryNode.label};
        this.writeValue(e.node.key);
    }

    writeValue(value: number): void {
        if (typeof value !== 'number') {
            return;
        }
        this.currentId = value;
        this.onChange(value);
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
