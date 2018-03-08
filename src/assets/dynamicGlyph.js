import Glyph from "./glyph";

class DynamicGlyph extends Glyph {
  constructor({ name = "", mixins = [] }) {
    super(...arguments);
    this.name = name;
    this.attachedMixins = {};
    this.attachedMixinGroups = {};
    this.setupFunctions = [];

    mixins.forEach(mixinFactory => {
      const mixin = new mixinFactory(...arguments);

      this.attachedMixins[mixin.name] = true;
      delete mixin.name;
      if (mixin.groupName) {
        this.attachedMixinGroups[mixin.groupName] = true;
        delete mixin.groupName;
      }
      if (mixin.setup) {
        this.setupFunctions.push(mixin.setup.bind(this));
      }
      Object.assign(this, mixin);
    });
    this.setupFunctions.forEach(fun => fun());
  }

  hasMixin(mixin) {
    return (
      this.attachedMixins.hasOwnProperty(mixin) ||
      this.attachedMixinGroups.hasOwnProperty(mixin)
    );
  }

  describe() {
    return this.name;
  }

  describeA(capitalize) {
    const prefixes = capitalize ? [`A`, `An`] : [`a`, `an`];
    const prefix =
      "aeiou".indexOf(this.describe()[0].toLowerCase()) >= 0 ? 1 : 0;
    return prefixes[prefix] + " " + this.describe();
  }

  describeThe(capitalize) {
    const prefix = capitalize ? `The` : `the`;
    return prefix + " " + this.describe();
  }
}

export default DynamicGlyph;
