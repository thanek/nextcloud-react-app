self.addEventListener('fetch', function (event) {
    let url = new URL(event.request.url)
    const urlParams = new URLSearchParams(url.search)
    if (urlParams.has('__auth')) {
        let headers = {Authorization: urlParams.get('__auth')}
        for (const h of event.request.headers) {
            headers[h[0]] = h[1]
        }
        urlParams.delete('__auth')
        url.search = urlParams;
        event.respondWith(
            fetch(url, {headers: headers, mode: "cors"})
        )
    }
});