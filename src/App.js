import {createClient} from 'webdav'
import {useEffect, useState, useRef} from 'react';
import ProfileSelector from './components/profile/ProfileSelector'
import {
    Breadcrumb,
    BreadcrumbItem,
    Container,
    Nav,
    Navbar, NavbarText, NavLink, Spinner
} from "react-bootstrap";
import Folder from "./components/file/Folder";
import File from "./components/file/File";
import FileViewer from "./components/file/FileViewer";

function App() {
    const itemRefs = useRef([])
    const [loading, setLoading] = useState(false)
    const [currentProfile, setCurrentProfile] = useState(null)

    const [content, setContent] = useState(null)
    const [currentFile, setCurrentFile] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null)

    function selectProfile(profile) {
        setContent(null)
        setCurrentFile(null)
        setLoading(false)
        setCurrentProfile(profile)
    }

    useEffect(() => {
        if (currentProfile != null) {
            browse()
        }
    }, [currentProfile]);

    useEffect(() => {
        if (currentFile != null) {
            setSelectedFile(currentFile)
        }
    }, [currentFile]);

    function getClient() {
        return createClient(currentProfile.server + '/remote.php/dav', {
            authType: "password",
            username: currentProfile.loginName,
            password: currentProfile.appPassword
        })
    }

    async function fetchItem(item) {
        if (isCurrent(item)) {
            return;
        }
        setLoading(true);

        const downloadUrl = getClient().getFileDownloadLink(item.filename);
        const fileUrl = new URL(downloadUrl)
        const auth = "Basic " + btoa(`${fileUrl.username}:${fileUrl.password}`)
        fileUrl.username = ''
        fileUrl.password = ''
        const search = new URLSearchParams(fileUrl.search)
        search.append('__auth', auth)
        fileUrl.search = `${search}`
        const itemUrl = `${fileUrl}`

        setCurrentFile({
            name: item.basename,
            filename: item.filename,
            mime: item.mime,
            thumbnail: item.thumbnail,
            url: itemUrl,
            next: item.next,
            prev: item.prev
        })
    }

    function getRootPath() {
        return `/files/` + currentProfile.loginName
    }

    function toBreadcrumb(pathStr) {
        const fragments = pathStr.split('/')
        const items = []
        let path = ''
        for (const fragment of fragments) {
            if (fragment === '') {
                continue;
            }
            path += ('/' + fragment)
            if (fragment === 'files') {
                continue
            }
            items.push({
                name: fragment,
                path: path
            })
        }
        return items
    }

    function scrollToCurrentItem() {
        for (let i = 0; i < itemRefs.current.length; i++) {
            if (itemRefs.current[i].classList.contains("selected")) {
                itemRefs.current[i].scrollIntoView({behavior: 'auto'})
                break;
            }
        }
    }

    function browse(path) {
        setLoading(true)
        if (path === undefined) {
            path = getRootPath()
        }
        const client = getClient()
        setCurrentFile(null)
        client.getDirectoryContents(path, {
            details: true
        }).then((response) => {
            const headers = client.getHeaders();
            let items = []
            for (const item of response.data) {
                const filename = item.filename.replace(`/files/${currentProfile.loginName}`, '')
                items.push({
                    ...item,
                    thumbnail: `${currentProfile.server}/apps/files/api/v1/thumbnail/500/500${filename}?__auth=${headers['Authorization']}`
                })
            }
            let idx = 0;
            // TODO check if next/prev item is a file (not directory)
            for (const item of items) {
                item.prev = idx >= 1 ? items[idx - 1] : null;
                item.next = idx + 1 >= items.length ? null : items[idx + 1];
                idx++;
            }

            setContent({
                path: path,
                breadcrumb: toBreadcrumb(path),
                items: items
            })
            setLoading(false)
        })
    }

    function isCurrent(item) {
        return currentFile && currentFile.filename === item.filename;
    }

    function isSelected(item) {
        return isCurrent(item) || (selectedFile && selectedFile.filename === item.filename);
    }

    return (<>
        <div className="app">
            <Container fluid="true" flex>
                <Navbar bg='dark' variant='dark'>
                    <Container>
                        <Navbar.Brand href="#" onClick={() => browse()}/>
                        <Nav className="me-auto justify-content-center">
                            {currentProfile && <>
                                <NavbarText>Welcome {currentProfile.loginName}!</NavbarText>
                                <NavLink onClick={() => selectProfile(null)}>[switch profile]</NavLink></>}
                        </Nav>
                    </Container>
                </Navbar>
            </Container>
            <Container className="content rounded-bottom-4" flex>
                {!currentProfile &&
                <ProfileSelector currentProfile={currentProfile}
                                 onProfileSelect={(profile) => selectProfile(profile)}/>}

                {currentProfile && <>
                    {content && <div id="listing">
                        <Breadcrumb className="rounded-3 path">
                            {content.breadcrumb.map(item =>
                                <BreadcrumbItem onClick={() => browse(item.path)} className="p-2 rounded m-1">
                                    {item.name}
                                </BreadcrumbItem>
                            )}
                        </Breadcrumb>
                        <Container md>
                            {content.items.map((item, i) => <>
                                {item.type === 'directory' &&
                                <a ref={el => (itemRefs.current[i] = el)}
                                   href="#"
                                   role="button"
                                   tabIndex="0"
                                   className={isSelected(item) ? "file-item selected" : "file-item"}
                                   onClick={() => browse(item.filename)}>
                                    <Folder item={item}/>
                                </a>}
                                {item.type !== 'directory' &&
                                <a ref={el => (itemRefs.current[i] = el)}
                                   href="#"
                                   role="button"
                                   tabIndex="0"
                                   className={isSelected(item) ? "file-item selected" : "file-item"}
                                   onClick={() => fetchItem(item)}>
                                    <File item={item}/>
                                </a>}
                            </>)}
                        </Container>
                    </div>}
                </>}
            </Container>
        </div>

        {currentFile && <FileViewer
            file={currentFile}
            next={currentFile.next}
            prev={currentFile.prev}
            onLoad={() => setLoading(false)}
            onClose={() => {
                scrollToCurrentItem();
                setCurrentFile(null)
            }}
            onPrev={() => fetchItem(currentFile.prev)}
            onNext={() => fetchItem(currentFile.next)}
        />}

        {loading && <div className="spinner-wrapper rounded-bottom-4 position-fixed" onClick={() => setLoading(false)}>
            <Spinner className="spn" variant='light'/>
        </div>}
    </>);
}

export default App;
