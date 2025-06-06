/*
 * SPDX-FileCopyrightText: 2025 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Component } from '@angular/core';
import {
  IxButton,
  IxDropdown,
  IxDropdownItem,
} from '@siemens/ix-angular/standalone';

@Component({
  standalone: true,
  selector: 'app-example',
  imports: [IxButton, IxDropdown, IxDropdownItem],
  template: `
    <ix-button id="iconTriggerId">Open</ix-button>
    <ix-dropdown trigger="iconTriggerId">
      <ix-dropdown-item label="Item 1" icon="star"></ix-dropdown-item>
      <ix-dropdown-item label="Item 2" icon="document"></ix-dropdown-item>
      <ix-dropdown-item label="Item 3" icon="bulb"></ix-dropdown-item>
    </ix-dropdown>
  `,
})
export default class DropdownIcon {}
