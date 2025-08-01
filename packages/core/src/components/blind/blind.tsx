/*
 * SPDX-FileCopyrightText: 2024 Siemens AG
 *
 * SPDX-License-Identifier: MIT
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  Component,
  Element,
  Event,
  EventEmitter,
  Fragment,
  h,
  Host,
  Prop,
  Watch,
} from '@stencil/core';
import anime from 'animejs';
import { a11yBoolean } from '../utils/a11y';
import { iconChevronDownSmall } from '@siemens/ix-icons/icons';
import type { BlindVariant } from './blind.types';

let sequentialInstanceId = 0;

@Component({
  tag: 'ix-blind',
  styleUrl: 'blind.scss',
  shadow: true,
})
export class Blind {
  /**
   * Collapsed state
   */
  @Prop({ mutable: true, reflect: true }) collapsed = false;

  /**
   * Label of blind
   */
  @Prop() label?: string;

  /**
   * Secondary label inside blind header
   */
  @Prop() sublabel?: string;

  /**
   * Optional icon to be displayed next to the header label
   */
  @Prop() icon?: string;

  /**
   * Blind variant
   */
  @Prop() variant: BlindVariant = 'filled';

  /**
   * Collapsed state changed
   */
  @Event() collapsedChange!: EventEmitter<boolean>;

  @Element() hostElement!: HTMLIxBlindElement;

  private chevronRef?: HTMLElement;
  private blindId = ++sequentialInstanceId;

  constructor() {}

  private onHeaderClick() {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  componentDidLoad() {
    this.animateCollapse(this.collapsed);
  }

  get content() {
    return this.hostElement.shadowRoot!.querySelector('.blind-content');
  }

  @Watch('collapsed')
  animation(isCollapsed: boolean) {
    this.animateCollapse(isCollapsed);
  }

  private animateCollapse(isCollapsed: boolean) {
    if (isCollapsed) {
      this.rotateChevronDown();
    } else {
      this.rotateChevronUp();
    }
  }

  private rotateChevronUp() {
    anime({
      targets: this.chevronRef,
      duration: 150,
      easing: 'easeInOutSine',
      rotateZ: 180,
    });
    anime({
      targets: this.content,
      duration: 150,
      easing: 'easeInOutSine',
      opacity: 1,
    });
  }

  private rotateChevronDown() {
    anime({
      targets: this.chevronRef,
      duration: 150,
      easing: 'easeInOutSine',
      rotateZ: 0,
    });
    anime({
      targets: this.content,
      duration: 150,
      easing: 'easeInOutSine',
      opacity: 0,
    });
  }

  render() {
    return (
      <Host
        class={{
          [`blind-${this.variant}`]: true,
        }}
      >
        <div class={'blind-header-wrapper'}>
          <button
            class={{
              'blind-header': true,
              [`blind-${this.variant}`]: true,
              closed: this.collapsed,
            }}
            type="button"
            aria-labelledby={`ix-blind-header-title-${this.blindId}`}
            aria-controls={`ix-blind-content-section-${this.blindId}`}
            aria-expanded={a11yBoolean(!this.collapsed)}
            onClick={() => this.onHeaderClick()}
          >
            <slot name="custom-header"></slot>
          </button>

          <div class={'blind-header-content'}>
            <ix-icon
              class="collapse-icon"
              name={iconChevronDownSmall}
              color={
                this.variant === 'filled' || this.variant === 'outline'
                  ? 'color-std-text'
                  : `color-${this.variant}--contrast`
              }
              ref={(ref: HTMLElement | undefined) => (this.chevronRef = ref)}
            ></ix-icon>
            <div
              class="blind-header-title"
              id={`ix-blind-header-title-${this.blindId}`}
            >
              {this.label !== undefined ? (
                <Fragment>
                  {this.icon && (
                    <ix-icon
                      class="blind-header-title-icon"
                      name={this.icon}
                      color={
                        this.variant === 'filled' || this.variant === 'outline'
                          ? 'color-std-text'
                          : `color-${this.variant}--contrast`
                      }
                    ></ix-icon>
                  )}
                  <div class={'blind-header-title-row'}>
                    <div class="blind-header-title-col">
                      <ix-typography title={this.label} format="label-lg" bold>
                        <div
                          class="blind-header-title-label"
                          title={this.label}
                        >
                          {this.label}
                        </div>
                      </ix-typography>
                    </div>

                    {this.sublabel && (
                      <div class="blind-header-title-col">
                        <ix-typography title={this.sublabel}>
                          <div class="blind-header-title-sublabel">
                            {this.sublabel}
                          </div>
                        </ix-typography>
                      </div>
                    )}
                  </div>
                  <div class="header-actions">
                    <slot name="header-actions"></slot>
                  </div>
                </Fragment>
              ) : null}
            </div>
          </div>
        </div>
        <section
          id={`ix-blind-content-section-${this.blindId}`}
          aria-labelledby={`ix-blind-header-title-${this.blindId}`}
        >
          <div
            class={{
              'blind-content': true,
              hide: this.collapsed,
            }}
          >
            {!this.collapsed ? <slot></slot> : null}
          </div>
        </section>
      </Host>
    );
  }
}
