const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

module.exports = {
  loadSQL(directory) {
    const files = fs.readdirSync(directory);
    return files.reduce((acc, file) => {
      if (file.match(/.*\.sql/)) {
        acc[`${file.replace('.sql', '')}SQL`] = fs.readFileSync(
          path.join(directory, file),
          'utf8'
        );
      }
      return acc;
    }, {});
  },
  loadTemplates(directory) {
    const files = fs.readdirSync(directory);
    const partials = fs.readdirSync(`${directory}/partials`);

    partials.forEach(partial => {
      if (partial.match(/.*\.hbs/)) {
        const f = fs.readFileSync(
          path.join(`${directory}/partials`, partial),
          'utf8'
        );
        handlebars.registerPartial(partial.replace('.hbs', ''), f);
      }
    });

    return files.reduce((acc, file) => {
      if (file.match(/.*\.hbs/)) {
        acc[`${file.replace('.hbs', '')}Template`] = handlebars.compile(
          fs.readFileSync(path.join(directory, file), 'utf8')
        );
      }
      return acc;
    }, {});
  }
};
