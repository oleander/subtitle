var opensubtitles = nRequire("subtitler");
var zlib = nRequire("zlib");
var http = nRequire("http");
var fs = nRequire("fs");
var path = nRequire("path")
var url = nRequire("url");
var wuzzy = nRequire("wuzzy");

var selectBestMatch = function(results, query){
  var cleanUp = function(value) {
    return value.replace(/[^a-z\d]/gi, "");
  }
  var searchQuery = cleanUp(query);
  var distance = function(value){
    return wuzzy.levenshtein(
      cleanUp(value.MovieReleaseName), searchQuery
    );
  }
  return results.sort(function(a, b){
    return distance(b) - distance(a);
  })[0];
}

var searchAndDownload = function(token, lang, query, file_path) {
  return new Promise(function(accept, reject){
    opensubtitles.api.searchForTitle(token, lang, query).then(function(results){
      if(!results.length) { return reject("No subtitles found"); }
      var match = selectBestMatch(results, query);
      if(!match) { return reject("No matching subtitle"); }

      var downloadUrl = match.SubDownloadLink
      var p = path.dirname(file_path)
      var u = url.parse(downloadUrl);
      var request = http.get({ 
          host: u.host,
          path: u.path,
          port: 80
      });

      request.on("response", function(response) {
        response.on("end", accept);
        var fileData = path.parse(match.SubFileName)
        var output = fs.createWriteStream(path.join(p, query + fileData.ext));
        response.pipe(zlib.createGunzip()).pipe(output);
      });

      request.on("error", reject);
    }).fail(reject);
  })
}

export default function (file, lang) {
  return new Promise(function(accept, reject){
    opensubtitles.api.login().then(function(token){
      searchAndDownload(
        token, 
        lang, 
        path.parse(file.name).name, 
        file.path
      ).then(accept).catch(reject)
    });
  });
}