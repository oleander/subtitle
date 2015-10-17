module.exports = function(grunt) {
  var electronVersion = "0.33.0";
  var appName = "Subtitle";
  var platform = "all";
  var arch = "all";
  
  var version = require("./package.json").version;
  var releases = require("./releases.json");
  var walk = require("walkdir");
  var path = require("path");

  if(!process.env.GITHUB_TOKEN) {
    return grunt.fail.fatal("GITHUB_TOKEN not set");
  }

  var execute = function(cmd) {
    var exec = require("child_process").exec;
    return new Promise(function(accept, reject) {
      exec(cmd, function (error, stdout, stderr) {
        if(error) {
          reject(error);
        } else if(stdout && stdout.length > 0) {
          accept(stdout)
        } else {
          accept(stderr);
        }
      });
    });
  }

  var zipFolder = function (filename) {
    return new Promise(function(accept, reject) {
      var stat = path.parse(filename)
      var zipFile = path.join(stat.dir, stat.base + ".zip");
      zipdir(filename, { saveTo: zipFile }, function (err, buffer) {
        err ? reject(err) : accept(zipFile, stat.base);
      });
    });
  }

  var getRelease = function(version){
    var res = releases[version]
    if(!res) {
      throw "release " + version + " not found";
    }

    return res;
  }

  grunt.registerTask("release", "Publishes pre-builds on github", function() {
    var tag = "v" + version;
    var done = this.async();

    if(!releases[tag]) {
      return grunt.fail.fatal("Release '" + tag + "' in releases.json could not be found");
    }

    execute("git tag " + tag).then(function(){
      grunt.log.ok("Creating release");
      return execute("github-release release --user oleander --repo subtitle --tag " + tag + " --name '" + tag + "' --description '" + getRelease(tag).description + "'");
    }).then(function(){
      walk("./dist", { no_recurse: true }).on("directory", function(folder, _, next){
        var base = path.parse(folder).base;
        var name = base + "-" + tag + ".zip";
        execute("cd dist && zip -o -q --symlinks -r '" + name + "' '" + base + "'").then(function(){
          grunt.log.ok("Upload", name);
          return execute("github-release upload --user oleander --repo subtitle --tag " + tag + " --name '" + name + "' --file 'dist/" + name + "'");
        }).then(next).catch(function(err){
          grunt.fail.fatal(err);
        });
      });
    }).catch(function(err) {
      grunt.fail.fatal(err);
    });
  }); 
  
  grunt.registerTask("build", "Build releases", function() {
    var done = this.async();
    grunt.log.ok("Run ember build");
    execute("rm -rf build/ && mkdir build/ && ember build --environment=production --output-path=build/").then(function(){
      grunt.log.ok("Copy files");
      var p = [];
      p.push(execute("cp package.json main.js build"));
      p.push(execute("cp -r public/ build/public"));
      p.push(execute("cp package.json build"));
      return Promise.all(p);
    }).then(function(){
      return execute("npm install --prefix ./build --production");
    }).then(function(){
      grunt.log.ok("Building binaries");
      return execute("rm -rf dist/ && ./node_modules/electron-packager/cli.js build/ " + appName + " --out=dist/ --version=" + electronVersion + " --icon=icon.icns --platform=" + platform + " --arch=" + arch + " --overwrite");
    }).then(function(){
      grunt.log.ok("Remove build path");
      return execute("rm -rf build/");
    }).then(function(){
      grunt.log.ok("Done!");
      done();
    }).catch(function(err) {
      grunt.fail.fatal("Failed", err);
      done();
    });
  });

  grunt.registerTask("deploy", ["build", "release"]);
};