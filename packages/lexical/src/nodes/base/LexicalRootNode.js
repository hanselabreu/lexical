/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type {LexicalNode} from '../../LexicalNode';
import type {RangeSelection} from '../../LexicalSelection';

import {ElementNode, $isElementNode} from './LexicalElementNode';
import {$isDecoratorNode} from './LexicalDecoratorNode';
import {NO_DIRTY_NODES} from '../../LexicalConstants';
import {getActiveEditor, isCurrentlyReadOnlyMode} from '../../LexicalUpdates';
import invariant from 'shared/invariant';

export class RootNode extends ElementNode {
  __cachedText: null | string;

  static getType(): string {
    return 'root';
  }

  static clone(): RootNode {
    return new RootNode();
  }

  constructor(): void {
    super('root');
    this.__cachedText = null;
  }

  getTextContent(includeInert?: boolean, includeDirectionless?: false): string {
    const cachedText = this.__cachedText;
    if (
      isCurrentlyReadOnlyMode() ||
      getActiveEditor()._dirtyType === NO_DIRTY_NODES
    ) {
      if (
        cachedText !== null &&
        (!includeInert || includeDirectionless !== false)
      ) {
        return cachedText;
      }
    }
    return super.getTextContent(includeInert, includeDirectionless);
  }

  select(): RangeSelection {
    // You can't select root nodes.
    invariant(false, 'select: cannot be called on root nodes');
  }

  remove(): void {
    // You can't select root nodes.
    invariant(false, 'remove: cannot be called on root nodes');
  }

  replace<N: LexicalNode>(node: N): N {
    // You can't select root nodes.
    invariant(false, 'replace: cannot be called on root nodes');
  }

  insertBefore(): LexicalNode {
    invariant(false, 'insertBefore: cannot be called on root nodes');
  }

  insertAfter(node: LexicalNode): LexicalNode {
    invariant(false, 'insertAfter: cannot be called on root nodes');
  }

  // View

  updateDOM(prevNode: RootNode, dom: HTMLElement): false {
    return false;
  }

  // Mutate

  append(...nodesToAppend: LexicalNode[]): ElementNode {
    for (let i = 0; i < nodesToAppend.length; i++) {
      const node = nodesToAppend[i];
      if (!$isElementNode(node) && !$isDecoratorNode(node)) {
        invariant(
          false,
          'rootNode.append: Only element or decorator nodes can be appended to the root node',
        );
      }
    }
    return super.append(...nodesToAppend);
  }

  canBeEmpty(): false {
    return false;
  }
}

export function $createRootNode(): RootNode {
  return new RootNode();
}

export function $isRootNode(node: ?LexicalNode): boolean %checks {
  return node instanceof RootNode;
}