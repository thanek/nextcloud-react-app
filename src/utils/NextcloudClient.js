import {createClient} from "webdav";

class NextcloudClient {
    static withProfile(profile) {
        const c = new NextcloudClient()
        c.setProfile(profile)
        return c
    }

    static withServer(server) {
        const c = new NextcloudClient()
        c.setServer(server)
        return c;
    }

    setServer(server) {
        this.server = server
    }

    setProfile(profile) {
        this.setServer(profile.server)
        this.login = profile.loginName
        this.password = profile.appPassword

        this.webdav = createClient(this.server + '/remote.php/dav', {
            authType: "password",
            username: this.login,
            password: this.password
        })
    }

    startLoginFlow(flowParameters) {
        fetch(this.server + '/index.php/login/v2', {method: 'POST', headers: {'USER_AGENT': 'Nextcloud-Tizen'}})
            .then(response => response.json())
            .then((data) => {
                flowParameters.onStartPolling(data)
                this.pollForConfirmation({
                    token: data.poll.token,
                    endpoint: data.poll.endpoint,
                    onSuccess: (data) => flowParameters.onSuccess(data)
                })
            })
    }

    pollForConfirmation(pollingParameters) {
        const client = this
        const requestOptions = {
            method: 'POST',
            body: "token=" + pollingParameters.token,
            headers: {'content-type': 'application/x-www-form-urlencoded'}
        };

        fetch(pollingParameters.endpoint, requestOptions)
            .then(response => {
                if (response.status !== 404) {
                    console.log("Got profile confirmation!")
                    return response.json()
                } else {
                    console.log("Waiting for confirmation...")
                    setTimeout(function () {
                        client.pollForConfirmation(pollingParameters)
                    }, 3000)
                    return null
                }
            })
            .then(data => {
                if (data) {
                    pollingParameters.onSuccess(data)
                }
            })
    }

    getItemUrl(filename) {
        if (!this.webdav) {
            throw new Error('No profile set')
        }
        const downloadUrl = this.webdav.getFileDownloadLink(filename);
        const fileUrl = new URL(downloadUrl)
        const auth = "Basic " + btoa(`${fileUrl.username}:${fileUrl.password}`)
        fileUrl.username = ''
        fileUrl.password = ''
        const search = new URLSearchParams(fileUrl.search)
        search.append('__auth', auth)
        fileUrl.search = `${search}`
        return `${fileUrl}`
    }

    getRootPath() {
        if (!this.webdav) {
            throw new Error('No profile set')
        }
        return `/files/` + this.login
    }

    browse(path) {
        if (!this.webdav) {
            throw new Error('No profile set')
        }

        return this.webdav.getDirectoryContents(path, {details: true})
            .then((response) => response.data
                .map(i => ({...i, thumbnail: (i.type === 'file') ? this.thumbnailUrl(i.filename) : null}))
            )
    }

    thumbnailUrl(filename) {
        if (!this.webdav) {
            throw new Error('No profile set')
        }
        const headers = this.webdav.getHeaders();
        const f = filename.replace(this.getRootPath(), '')
        return `${this.server}/apps/files/api/v1/thumbnail/500/500${f}?__auth=${headers['Authorization']}`
    }

}

export default NextcloudClient;

