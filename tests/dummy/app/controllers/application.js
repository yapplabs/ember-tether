import Controller from '@ember/controller';
import { isNone } from '@ember/utils';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked exampleTarget = 1;
  get exampleTargetSelector() {
    return `#tether-target-${this.exampleTarget}`;
  }

  attachmentConfigurations = [
    { targetAttachment: 'top left', attachment: 'top right' },
    { targetAttachment: 'middle left', attachment: 'top right' },
    { targetAttachment: 'bottom left', attachment: 'top right' },
    { targetAttachment: 'bottom left', attachment: 'top center' },
    { targetAttachment: 'bottom middle', attachment: 'top center' },
    { targetAttachment: 'bottom right', attachment: 'top center' },
    { targetAttachment: 'bottom right', attachment: 'top left' },
    { targetAttachment: 'middle right', attachment: 'top left' },
    { targetAttachment: 'top right', attachment: 'top left' },
    { targetAttachment: 'top right', attachment: 'bottom left' },
    { targetAttachment: 'top center', attachment: 'bottom left' },
    { targetAttachment: 'top left', attachment: 'bottom left' },
  ];

  @tracked attachmentConfigurationIndex = 0;

  @tracked _exampleTargetAttachment;
  get exampleTargetAttachment() {
    if (this._exampleTargetAttachment) return this._exampleTargetAttachment;

    let i = this.attachmentConfigurationIndex;
    let config = this.attachmentConfigurations[i];
    return config.targetAttachment;
  }
  set exampleTargetAttachment(val) {
    this._exampleTargetAttachment = val;
  }
  @tracked _exampleAttachment;
  get exampleAttachment() {
    if (this._exampleAttachment) return this._exampleAttachment;

    let i = this.attachmentConfigurationIndex;
    let config = this.attachmentConfigurations[i];
    return config.attachment;
  }
  set exampleAttachment(val) {
    this._exampleAttachment = val;
  }

  @tracked exampleOffset;

  @tracked exampleConstraints = null;
  get exampleConstraintsOn() {
    return this.exampleConstraints ? 'on' : 'off';
  }

  @tracked isShowingTargetWithin = true;

  get exampleTargetWithin() {
    return this.isShowingTargetWithin ? '#tether-target-2 .within' : undefined;
  }

  @tracked exampleTargetComponent;
  @action registerComponentTarget(component) {
    this.exampleTargetComponent = component;
  }

  @action switchTether() {
    let dt = this.exampleTarget;
    let nt = dt === 7 ? 1 : dt + 1;
    this.exampleTarget = nt;
  }

  @action rotateTether() {
    let numConfigs = this.attachmentConfigurations.length;
    let i = this.attachmentConfigurationIndex;
    let nc = i === numConfigs - 1 ? 0 : i + 1;
    this.attachmentConfigurationIndex = nc;
  }

  @action toggleOffset() {
    this.exampleOffset = isNone(this.exampleOffset) ? '0 -20px' : null;
  }

  @action toggleConstraints() {
    if (isNone(this.exampleConstraints)) {
      this.exampleConstraints = [
        {
          to: 'scrollParent',
          attachment: 'together',
          pin: true,
        },
      ];
    } else {
      this.exampleConstraints = null;
    }
  }

  @action toggleTargetWithin() {
    this.isShowingTargetWithin = !this.isShowingTargetWithin;
  }
}
