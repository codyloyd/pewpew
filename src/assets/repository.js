import ROT from "rot-js";

class Repository {
  constructor({ name = "repository", ctor = null }) {
    this.templates = {};
    this.randomTemplates = {};
    this.ctor = ctor;
  }

  define(template) {
    this.templates[template.name] = template;
    if (!template.disableRandomCreation) {
      this.randomTemplates[template.name] = template;
    }
  }

  create(name) {
    const template = this.templates[name];
    if (!template) {
      throw new Error(`no template named ${name}`);
    }
    if (template) {
      return new this.ctor(template);
    }
  }

  maybeCreateRandom(rank, probability) {
    if (Math.random() < probability) {
      return this.createRandom(rank);
    }
  }

  createRandom(rank) {
    const weightMap = Object.keys(
      this.randomTemplates
    ).reduce((obj, template) => {
      const item = this.randomTemplates[template];
      if ((rank && item.rank <= rank) || !rank) {
        obj[template] = item.rngWeight || 1;
      }
      return obj;
    }, {});
    const item = ROT.RNG.getWeightedValue(weightMap);
    if (item) {
      return this.create(item);
    }
  }
}

export default Repository;
