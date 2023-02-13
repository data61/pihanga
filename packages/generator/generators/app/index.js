// var Generator = require('yeoman-generator');
// const { spawnSync } = require('child_process');
// const semver = require('semver');
const extend = require('lodash.merge');
const Generator = require('yeoman-generator');
const parseAuthor = require('parse-author');
const path = require('path');
const validatePackageName = require('validate-npm-package-name');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Next, add your custom code
    // this.option('babel1', {desc: 'WHat is babel?', type: Boolean, default: false}); // This method adds support for a `--babel` flag
    // this.option('babel2', {desc: 'WHat is babel2?', type: String, default: 'not me'});

    // // This makes `appname` a required argument.
    // this.argument('appname', { type: String, required: true });
  }

  // Courtesy of https://denis-voronin.medium.com/quick-start-of-your-react-application-development-with-yeoman-7d3cadd2f36f
  initializing() {
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});

    this.props = {
      name: this.pkg.name,
      description: this.pkg.description,
      version: this.pkg.version,
      homepage: this.pkg.homepage,
      repositoryName: this.options.repositoryName
    };

    if (typeof this.pkg.author === 'object') {
      this.props.authorName = this.pkg.author.name;
      this.props.authorEmail = this.pkg.author.email;
      this.props.authorUrl = this.pkg.author.url;
    } else if (typeof this.pkg.author === 'string') {
      const info = parseAuthor(this.pkg.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;
    }
  }

  // Courtesy of https://denis-voronin.medium.com/quick-start-of-your-react-application-development-with-yeoman-7d3cadd2f36f
  prompting() {
    const prompts = [
      {
        name: 'name',
        message: 'Enter app name',
        when: !this.props.name,
        default: process.cwd().split(path.sep).pop()
      },
      {
        name: 'description',
        message: 'Enter description',
        when: !this.props.description
      },
      {
        name: 'authorName',
        message: 'Enter author\'s name',
        when: !this.props.authorName,
        default: this.user.git.name(),
        store: true
      },
      {
        name: 'authorEmail',
        message: 'Enter author\'s email',
        when: !this.props.authorEmail,
        default: this.user.git.email(),
        store: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = extend(this.props, props);
      const packageNameValidity = validatePackageName(this.props.name);
      if (!packageNameValidity.validForNewPackages) {
        const error = packageNameValidity.errors && packageNameValidity.errors[0] ||
          `The name ${this.props.name} is not a valid npm package name. (${this.props})`;
        console.log(error);
        process.exit(1);
      }
    });
  }

  // async prompting() {
  //   this.answers = await this.prompt([
  //     {
  //       type: 'input',
  //       name: 'name',
  //       message: 'Your project name',
  //       default: this.appname, // Default to current folder name
  //       default: this.options.appname, // Default to current folder name
  //       // store: true,
  //     },
  //     {
  //       type: 'confirm',
  //       name: 'cool',
  //       message: 'Would you like to enable the Cool feature?'
  //     }
  //   ]);

  //   this.log('app name', this.answers.name);
  //   this.log('cool feature', this.answers.cool);
  // }

  // method1() {
  //   this.log(`method 1 reports babel1 to be '${this.options.babel1}' in '${this.destinationRoot()}'`);
  // }

  // method2() {
  //   this.log(`method 2 reports babel2 to be '${this.options.babel2}'`);
  // }

  writing() {
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      { globOptions: { dot: true } }
    );
    // dot files
    this.fs.copyTpl(
      this.templatePath('.*'),
      this.destinationPath(),
      { globOptions: { dot: true } }
    );


    const currentPkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    const pkg = extend({
      name: this.props.name,
      version: '0.1.0',
      description: this.props.description,
      homepage: this.props.homepage,
      author: {
        name: this.props.authorName,
        email: this.props.authorEmail
      },
      scripts: {
        start: "react-scripts start",
        build: "cross-env GENERATE_SOURCEMAP=false react-scripts build",
        prettier: "prettier --write '**/*.{js,css,html}'",
        "clear-all": "rimraf ./build ./node_modules"
      },
      keywords: ['pihanga'],
      dependencies: {
        '@pihanga/core': '^0.5.0',
        "@pihanga/material-ui": "^0.5.0",
        '@material-ui/core': '^4.11.0',
        "@material-ui/icons": "^4.11.2",
        "@material-ui/lab": "^4.0.0-alpha.58",
        "@material-ui/pickers": "^3.3.10",
        "@material-ui/styles": "^4.11.1",
        'classnames': '^2.3.0',
        "react": "^16.13.1",
        "react-dom": "^16.8.6",
        "react-helmet": "^6.1.0",
        "react-lazy-load-image-component": "^1.5.0",
        "react-leaflet": "^2.7.0",
        "react-router-dom": "^5.0.1",
        "react-scripts": "^4.0.0",
        "react-typed": "^1.2.0",
        "start": "^5.1.0",
        "swiper": "^5.4.1",
      },
      devDependencies: {
        '@testing-library/jest-dom': '^5.12.0',
        '@testing-library/react': '^11.2.0',
        '@testing-library/user-event': '^13.1.0',
        '@types/jest': '^26.0.15',
        '@types/node': '^12.0.0',
        '@types/react': '^17.0.0',
        '@types/react-dom': '^17.0.0',
        'eslint': '^7.25.0',
        'eslint-config-airbnb': '^18.2.0',
        'eslint-plugin-import': '^2.22.0',
        'eslint-plugin-jsx-a11y': '^6.4.0',
        'eslint-plugin-react': '^7.23.0',
        'eslint-plugin-react-hooks': '^4.2.0',
        'react-scripts': '4.0.3',
        'typescript': '^4.2.0',
        'web-vitals': '^1.0.1'
      },
      eslintConfig: {
        extends: [
          "react-app"
        ]
      },
      browserslist: {
        production: [
          ">0.2%",
          "not dead",
          "not op_mini all"
        ],
        development: [
          "last 1 chrome version",
          "last 1 firefox version",
          "last 1 safari version"
        ]
      },
      typings: "src/*.d.ts",
    }, currentPkg);
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
