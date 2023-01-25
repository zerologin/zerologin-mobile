import { useContext } from 'react'
import { SvgUri } from 'react-native-svg'
import { AccountContext } from '../contexts/Contexts'

export default function AvatarButton() {
    const accountId = useContext(AccountContext)
    return (
        <SvgUri
            width='32'
            height='32'
            uri={`https://source.boringavatars.com/beam/32/${accountId}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`}
        />
    )
}
