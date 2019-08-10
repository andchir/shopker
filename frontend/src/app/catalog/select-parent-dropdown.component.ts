import {Component, OnInit, Input, forwardRef, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {TreeNode} from 'primeng/primeng';
import {cloneDeep} from 'lodash';

import {CategoriesService} from './services/categories.service';

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
            .subscribe((data) => {
                this.categoriesTree = data;
                this.currentCategoryNode = this.getTreeCurrentNode(this.categoriesTree);
                this.loadingCategories = false;
            }, (err) => {
                this.loadingCategories = false;
            });
    }

    getTreeCurrentNode(tree: TreeNode[]): TreeNode | null {
        let currentNode = null;
        for (const node of tree) {
            if (node['id'] === this.currentId) {
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
        if (e.node.id && e.node.id === this.filterId) {
            if (this.previousCategoryNode) {
                this.currentCategoryNode = cloneDeep(this.previousCategoryNode);
                this.currentId = this.currentCategoryNode['id'];
            } else {
                this.currentCategoryNode = null;
                this.currentId = null;
            }
            return;
        }
        this.previousCategoryNode = cloneDeep(this.currentCategoryNode);
        this.writeValue(e.node.id);
        this.dropdownElement.close();
    }

    writeValue(value: number): void {
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
