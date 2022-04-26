// const extend = require('lodash.merge');
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('cardName', { type: String, required: true });
    this.option('actionDomain', {desc: 'The domain of action events', type: String, required: false}); 
  }

  prompting() {
    const prompts = [
      // {
      //   name: 'name',
      //   message: 'Enter app name',
      //   when: !this.props.name,
      //   default: process.cwd().split(path.sep).pop()
      // },
      // {
      //   name: 'description',
      //   message: 'Enter description',
      //   when: !this.props.description
      // },
      // {
      //   name: 'authorName',
      //   message: 'Enter author\'s name',
      //   when: !this.props.authorName,
      //   default: this.user.git.name(),
      //   store: true
      // },
      // {
      //   name: 'authorEmail',
      //   message: 'Enter author\'s email',
      //   when: !this.props.authorEmail,
      //   default: this.user.git.email(),
      //   store: true
      // }
    ];
    return this.prompt(prompts);
  }

  writing() {
    const cardName = this.options.cardName;
    const actionDomain = this.options.actionDomain;
    const filePrefix = cardName[0].toLowerCase() + cardName.slice(1);
    const opts = { cardName, actionDomain, filePrefix };
    console.log('>>>> opts', opts);
    const dn = cardName;
    this.fs.copyTpl(
      this.templatePath('card/index.ts'),
      this.destinationPath(`src/cards/${dn}/index.ts`),
      opts,
    );
    this.fs.copyTpl(
      this.templatePath('card/card.component.tsx'),
      this.destinationPath(`src/cards/${dn}/${filePrefix}.component.tsx`),
      opts,
    );
    this.fs.copyTpl(
      this.templatePath('card/card.style.js'),
      this.destinationPath(`src/cards/${dn}/${filePrefix}.style.js`),
      opts,
    );

    // // dot files
    // this.fs.copyTpl(
    //   this.templatePath('.*'),
    //   this.destinationPath(),
    //   { globOptions: { dot: true } }
    // );


  }
};
