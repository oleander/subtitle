var opensubtitles = nRequire("subtitler");
var zlib = nRequire("zlib");
var http = nRequire("http");
var fs = nRequire("fs");
var path = nRequire("path")
var url = nRequire("url");

var searchAndDownload = function(token, lang, query, file_path) {
  return new Promise(function(accept, reject){
    opensubtitles.api.searchForTitle(token, lang, query).then(function(results){
      if(!results[0]) { return reject("No subtitles found"); }
      if(results[0]){
        var downloadUrl = results[0].SubDownloadLink
        var p = path.dirname(file_path)
        var u = url.parse(downloadUrl);
        var request = http.get({ 
            host: u.host,
            path: u.path,
            port: 80
        });

        request.on("response", function(response) {
          var fileData = path.parse(results[0].SubFileName)
          var output = fs.createWriteStream(p + "/" + query + fileData.ext);
          response.pipe(zlib.createGunzip()).pipe(output);
          accept();
        });

        request.on("error", reject);
      }
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