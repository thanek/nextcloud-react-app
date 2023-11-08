import {useEffect, useRef, useState} from "react";
import {
    Button,
    Container,
    Figure, FormSelect, InputGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalTitle
} from "react-bootstrap";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAdd, faLink} from "@fortawesome/free-solid-svg-icons";
import ProfileEditor from "./ProfileEditor";
import Profile from "./Profile";
import NextcloudClient from "../../utils/NextcloudClient";
import Avatars from "./Avatars";

export default function ProfileSelector(props) {
    const [ncServerProtocol, setNcServerProtocol] = useState(() => localStorage.getItem("ncServerProtocol") || 'https');
    const [ncServerAddress, setNcServerAddress] = useState(() => localStorage.getItem("ncServerHost"));
    const [profiles, setProfiles] = useState(() => {
        const saved = localStorage.getItem("profiles");
        const initialValue = JSON.parse(saved);
        return initialValue || [];
    })
    const [profileEdit, setProfileEdit] = useState(null)
    const [profileConfirmationLink, setProfileConfirmationLink] = useState(null)
    const [gettingNcServer, setGettingNcServer] = useState(false)

    function saveProfiles(profiles) {
        localStorage.setItem("profiles", JSON.stringify(profiles));
    }

    useEffect(() => {
        saveProfiles(profiles)
    }, [profiles]);

    async function createProfile() {
        setGettingNcServer(false)
        localStorage.setItem("ncServerProtocol", ncServerProtocol)
        localStorage.setItem("ncServerHost", ncServerAddress)
        await NextcloudClient.withServer(ncServerProtocol + '://' + ncServerAddress).startLoginFlow(
            {
                onStartPolling: (data) => {
                    setProfileConfirmationLink(data.login)
                },
                onSuccess: (data) => {
                    console.log("ON SUCCESS", data)
                    setProfileConfirmationLink(null)
                    setProfiles([...profiles, {...data, avatar: Avatars.random()}])
                }
            }
        )
    }

    // TODO allow to cancel polling when other profile is selected
    function pollForProfileConfirmation(endpoint, token) {
        new NextcloudClient().pollForConfirmation({
            token: token,
            endpoint: endpoint,
            onSuccess: (data) => {
                setProfileConfirmationLink(null)
                setProfiles([...profiles, data])
            }
        })
    }

    function copyOf(profile) {
        return {
            ...profile,
            loginName: profile.loginName,
            avatar: profile.avatar ? profile.avatar : 0,
            server: profile.server,
            appPassword: profile.appPassword
        }
    }

    function saveProfile(profile) {
        for (let i = 0; i < profiles.length; i++) {
            if (profiles[i].loginName === profile.loginName
                && profiles[i].server === profile.server) {
                profiles[i] = profile
            }
        }
        saveProfiles(profiles)
        setProfileEdit(null)
    }

    return (<>
        {!profileEdit &&
        <Container flex className="profile-selector">
            <h5 className="p-3">Choose your profile:</h5>
            {profiles.map((profile) => <Profile profile={profile}
                                                onEdit={() => setProfileEdit(copyOf(profile))}
                                                onSelect={() => props.onProfileSelect(profile)}/>
            )}

            {!profileConfirmationLink &&
            <Figure className="profile" onClick={() => setGettingNcServer(true)}>
                <div className="icon-wrapper d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faAdd} className="icon" size="6x"/>
                </div>
                <Figure.Caption>
                    <p>Add profile</p>
                </Figure.Caption>
            </Figure>}

            {gettingNcServer &&
            <Modal className="modal" centered show>
                <ModalTitle className="p-3">Nextcloud server</ModalTitle>
                <ModalBody>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="server-address" className="col-form-label">Nextcloud server address:</label>
                            <InputGroup className="mb-3">
                                <FormSelect className="w-25"
                                            value={ncServerProtocol}
                                            onChange={e => setNcServerProtocol(e.target.value)}>
                                    <option value="https">https://</option>
                                    <option value="http">http://</option>
                                </FormSelect>
                                <input className="w-75 form-control" placeholder="nextcloud.com"
                                       value={ncServerAddress}
                                       onInput={e => setNcServerAddress(e.target.value)}/>
                            </InputGroup>
                            <div className="form-text">
                                Enter your nextcloud server address url
                            </div>
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button className="btn-secondary" onClick={() => setGettingNcServer(false)}>Cancel</Button>
                    <Button className="btn-primary" onClick={() => createProfile()}>OK</Button>
                </ModalFooter>
            </Modal>}

            {profileConfirmationLink &&
            <Figure className="profile add-profile">
                <FontAwesomeIcon icon={faLink} className="icon"/>
                <Figure.Caption>
                    <a target="_blank" href={profileConfirmationLink}>Confirm profile</a>
                </Figure.Caption>
            </Figure>}
        </Container>}

        {profileEdit && <ProfileEditor profile={profileEdit}
                                       onSave={(profile) => saveProfile(profile)}
                                       onCancel={() => setProfileEdit(null)}/>}
    </>);
}
