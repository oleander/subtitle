module.exports = function(grunt) {
  var appName = "Subtitle";

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
    })
  }

  grunt.registerTask("release", "Publishes pre-builds on github", function() {
    var releases = require("./releases.json");
    var done = this.async();
    var walk = require("walkdir");
    var zipdir = require("zip-dir");
    var path = require("path");

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

    execute("git tag | tail -n 1").then(function(raw){
      var tag = raw.trim();
      console.info("Creating release");
      execute("github-release release --user oleander --repo subtitle --tag " + tag + " --name '" + tag + "' --description '" + getRelease(tag).description + "'").then(function(){
        var emitter = walk('./dist', { no_recurse: true });
        emitter.on("directory", function(filename){
          zipFolder(filename).then(function(zipFile){
            console.info("Upload", zipFile);
            var name = path.parse(zipFile).base;
            execute("github-release upload --user oleander --repo subtitle --tag " + tag + " --name '" + name + "' --file '" + zipFile + "'").then(function(){
              console.info(name + " has been uploaded");
            }).catch(function(err){
              console.info("Could not upload " + name);
            });
          }).catch(function(err) {
            console.info("Could not zip", err);
          });
        });

        console.info("Release " + tag + " has been created");
      }).catch(function(err){
        console.info("Could not create release");
      });
    }).catch(function(err) {
      console.info("Could not find tag", err);
    });
  }); 
  
  grunt.registerTask("build", "Build releases", function() {
    var done = this.async();
    console.info("Run ember build");
    execute("ember build --environment=production --output-path=build/").then(function(){
      console.info("Copy files");
      var p = [];
      p.push(execute("cp package.json main.js build"))
      p.push(execute("cp -r public/ build/public"))
      p.push(execute("cp package.json build"))
      Promise.all(p).then(function(){
        execute("npm install --prefix ./build --production").then(function(){
          console.info("Building binaries");
          execute("./node_modules/electron-packager/cli.js build/ " + appName + " --out=dist/ --version=0.33.0 --icon=icon.icns --platform=all --arch=all --overwrite").then(function(){
            console.info("Remove build path");
            execute("rm -rf build/").then(function(){
              console.info("Done!");
              done();
            }).catch(function(err){
              console.info("Could not clean upp", err);
              done();
            });
          }).catch(function(err) {
            console.info("Could not build binaries", err);
            done();
          });
        }).catch(function(err){
          console.info("Could not run npm install", err);
          done();
        });
      }).catch(function(err) {
        console.info("Could not copy files");
        done();
      });
    }).catch(function(err) {
      console.info("Failed to run ember build", err);
      done();
    });
  });

  grunt.registerTask("deploy", ["build", "release"]);
};