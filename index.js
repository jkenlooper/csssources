var argv = require("yargs")
  .usage('Usage: $0 [input.css]')
  .help('h')
  .alias('h', 'help')
  .check(function(argv){
    if (!argv._) {
      throw "Need to specify an input css file.";
    }
    return true;
  })
  .argv;

var fs = require("fs")
var postcss = require("postcss")
var atImport = require("postcss-import")

argv._.forEach(function(input){
// css to be processed
var css = fs.readFileSync(input, "utf8")

// process css
var output = postcss()
  .use(atImport())
  .process(css, {
    // `from` option is required so relative import can work from input dirname
    from: input,
    map: {
      inline: false
    }
  })
  .then(function (result) {
    var sources = [];
    if ( result.map ) {
      sources = result.map.toJSON().sources;
    }
    process.stdout.write(sources.join(' '));
    process.stdout.write('\n');
  });
});
