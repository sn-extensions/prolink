export default class HttpManager {

  /* Singleton */
  static instance = null;
  static get() {
    if (this.instance == null) { this.instance = new HttpManager(); }
    return this.instance;
  }

  postAbsolute(url, params, onsuccess, onerror) {
    this.httpRequest("post", url, params, onsuccess, onerror);
  }

  patchAbsolute(url, params, onsuccess, onerror) {
    this.httpRequest("patch", url, params, onsuccess, onerror);
  }

  getAbsolute(url, params, onsuccess, onerror) {
    this.httpRequest("get", url, params, onsuccess, onerror);
  }

  httpRequest(verb, url, params, onsuccess, onerror) {
    const xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState === 4) {
        let response = xmlhttp.responseText;

        if (response) {
          try {
            response = JSON.parse(response);
          } catch(e) {
            // If parsing fails, it means the response is not a JSON string
            // and we should return undefined.
            response = undefined;
          }
        }

        if (xmlhttp.status >= 200 && xmlhttp.status <= 299) {
          onsuccess(response);
        } else {
          console.error("Request error:", response);
          onerror(response);
        }
      }
    }.bind(this);

    if (verb === "get" && Object.keys(params).length > 0) {
      url = url + this.formatParams(params);
    }

    xmlhttp.open(verb, url, true);
    xmlhttp.setRequestHeader('Content-type', 'application/json');

    if (verb === "post" || verb === "patch") {
      xmlhttp.send(JSON.stringify(params));
    } else {
      xmlhttp.send();
    }
  }

  formatParams(params) {
    return "?" + Object
          .keys(params)
          .map(function(key){
            return key+"="+encodeURIComponent(params[key])
          })
          .join("&")
  }

}
